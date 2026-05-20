// 안전빵 - 네이버 플레이스 분석 API
// POST /api/analyze-naver
// body: { url: string }

const SYSTEM_PROMPT = `당신은 "안전빵" AI 리뷰 리스크 진단 시스템입니다. 결제 전 소비자가 알아야 할 위험과 장점을 진단하세요.

반드시 아래 JSON 형식으로만 응답:
{
  "name": "장소명",
  "location": "위치(있으면)",
  "emoji": "이모지 1개(가게 종류에 맞게)",
  "safetyScore": 0-100 숫자(낮을수록 위험),
  "scoreLabel": "안전|주의|위험|매우위험",
  "oneLineSummary": "한 줄 요약(40자, 손실 프레이밍 - 후회/위험 강조)",
  "avgRating": 평균 별점(1.0-5.0, 소수1자리),
  "ratingDistribution": {"5": 비율(%), "4": ..., "3": ..., "2": ..., "1": ...},
  "aspectScores": [
    {"name": "맛/품질", "score": 0-100, "trend": "up|down|stable", "mentions": 숫자},
    {"name": "위생", "score": ..., "trend": ..., "mentions": ...},
    {"name": "응대", "score": ..., "trend": ..., "mentions": ...},
    {"name": "가성비", "score": ..., "trend": ..., "mentions": ...},
    {"name": "분위기", "score": ..., "trend": ..., "mentions": ...}
  ],
  "topRisks": [
    {"title": "위험명(15자)", "detail": "근거+빈도(60자)", "severity": "high|medium|low", "evidenceCount": 숫자,
     "evidenceReviews": [{"rating": 1-5, "date": "...", "text": "원문 인용(80자)"}, ...2~3개]},
    ...3개
  ],
  "topPositives": [
    {"title": "장점(15자)", "detail": "근거+빈도(60자)", "evidenceCount": 숫자,
     "evidenceReviews": [{"rating": ..., "date": "...", "text": "..."}, ...2개]},
    ...3개
  ],
  "avoidIf": ["피해야 할 사람1", "...", "..."],
  "recentSignal": "최근 악화 신호(없으면 '특이 신호 없음')",
  "priceJudgment": "가격 판단(없으면 '가격 정보 부족')"
}

원칙: 별점 아닌 반복 신호. 손실 프레이밍 톤. 리뷰에 없는 내용 생성 금지. evidenceReviews는 실제 원문 인용.`;

// 네이버 URL에서 Place ID 추출
function extractNaverPlaceId(url) {
  if (!url) return null;
  const patterns = [
    /place\/(\d+)/,
    /restaurant\/(\d+)/,
    /\/(\d{8,})/
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  if (/^\d+$/.test(url.trim())) return url.trim();
  return null;
}

export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST만 허용' });
  }

  const APIFY_TOKEN = process.env.APIFY_TOKEN;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!APIFY_TOKEN || !OPENAI_API_KEY) {
    return res.status(500).json({ error: '서버 설정 오류: API 키 미설정' });
  }

  const { url } = req.body || {};
  if (!url) {
    return res.status(400).json({ error: 'URL이 필요합니다' });
  }

  const placeId = extractNaverPlaceId(url);
  if (!placeId) {
    return res.status(400).json({ error: '네이버 플레이스 ID를 찾을 수 없습니다. URL을 확인해주세요.' });
  }

  try {
    // 1단계: Apify로 리뷰 수집
    const apifyUrl = `https://api.apify.com/v2/acts/oxygenated_quagmire~naver-place-reviews/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
    
    const apifyRes = await fetch(apifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placeUrls: [{ url: `https://pcmap.place.naver.com/restaurant/${placeId}/review/visitor` }],
        maxReviews: 80,
        sortBy: 'recent',
        includeStats: true
      })
    });

    if (!apifyRes.ok) {
      const errText = await apifyRes.text();
      console.error('Apify error:', apifyRes.status, errText);
      if (apifyRes.status === 401) {
        return res.status(500).json({ error: 'Apify 토큰 오류. 관리자 문의.' });
      }
      if (apifyRes.status === 402) {
        return res.status(500).json({ error: 'Apify 크레딧 부족. 다음 달까지 기다리거나 충전 필요.' });
      }
      return res.status(500).json({ error: `리뷰 수집 실패 (${apifyRes.status})` });
    }

    const reviews = await apifyRes.json();
    
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return res.status(400).json({ error: '리뷰가 없거나 가져오지 못했습니다. 다른 장소를 시도해주세요.' });
    }

    // 2단계: OpenAI 분석
    const reviewText = reviews.slice(0, 80).map((r, i) =>
      `[리뷰 ${i + 1}] ★${r.rating || '?'} (${r.visited || r.created || '?'}): ${r.body || ''}`
    ).join('\n');

    const businessName = reviews[0]?.businessName || '';
    const userMsg = `[장소]\n이름: ${businessName}\n장소ID: ${placeId}\n\n[리뷰 ${reviews.length}개]\n${reviewText}`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMsg }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error('OpenAI error:', openaiRes.status, errText);
      if (openaiRes.status === 401) {
        return res.status(500).json({ error: 'OpenAI 키 오류. 관리자 문의.' });
      }
      return res.status(500).json({ error: `AI 분석 실패 (${openaiRes.status})` });
    }

    const openaiData = await openaiRes.json();
    const text = openaiData.choices?.[0]?.message?.content || '';
    
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (e) {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) analysis = JSON.parse(m[0]);
      else throw new Error('응답 파싱 실패');
    }

    // 결과 조합
    return res.status(200).json({
      ...analysis,
      name: analysis.name || businessName || '장소 미상',
      emoji: analysis.emoji || '📍',
      reviewCount: reviews.length,
      sourceUrl: url,
      siteName: '네이버 플레이스',
      placeId
    });
  } catch (e) {
    console.error('Analyze error:', e);
    return res.status(500).json({ error: e.message || '서버 오류' });
  }
}
