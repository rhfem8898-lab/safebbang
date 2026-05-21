// 안전빵 - 네이버 플레이스 분석 API
// POST /api/analyze-naver
// body: { url: string }

const SYSTEM_PROMPT = `당신은 "안전빵" AI 리뷰 리스크 진단 시스템입니다. 결제 전 소비자가 알아야 할 위험과 장점을 진단하세요.

【핵심 원칙: 점수 기준】
safetyScore는 0~100 안전 점수입니다. 숫자가 높을수록 안전합니다.
- 75~100: 큰 위험 없음, 안심하고 가도 됨 (반복되는 부정 신호 거의 없음)
- 55~74: 대체로 안전하나 일부 약점 존재
- 40~54: 주의 필요, 부정 후기 다수 있음
- 25~39: 위험, 결제 후 후회 가능성 큼
- 0~24: 매우 위험, 비추천

【카테고리 자동 판별】
장소를 다음 카테고리 중 하나로 분류하고, 그에 맞는 속성으로 평가하세요:

1. "restaurant" (식당/카페/주점)
   속성: ["맛/품질", "위생", "응대", "가성비", "분위기"]
2. "beauty" (미용실/네일샵/피부관리)
   속성: ["시술 실력", "친절도", "위생", "가성비", "공간"]
3. "hospital" (병원/의원/한의원)
   속성: ["진료 실력", "응대/설명", "대기 시간", "시설", "수납/비용"]
4. "lodging" (숙소/펜션/호텔)
   속성: ["청결", "위치", "시설", "응대", "가성비"]
5. "fitness" (헬스장/필라테스/요가)
   속성: ["시설", "강사 실력", "청결", "응대", "가성비"]
6. "education" (학원/교습소/스터디카페)
   속성: ["강사 실력", "시설", "응대", "가성비", "커리큘럼"]
7. "auto" (정비소/카센터/세차장)
   속성: ["기술력", "친절도", "가격 투명성", "작업 속도", "사후 대응"]
8. "pet" (동물병원/펫샵)
   속성: ["진료 실력", "응대", "가격", "위생", "시설"]
9. "other" (위 분류에 안 맞으면)
   속성: ["품질", "응대", "가성비", "청결", "기타"]

【추천/비추천 판단 (verdict)】
- "recommend": 75점 이상, 부정 신호 거의 없음
- "consider": 55~74점, 강점이 약점보다 큼
- "caution": 40~54점, 강점과 약점 비슷
- "avoid": 25~39점, 약점이 강점보다 큼
- "strongly_avoid": 25점 미만, 결제 시 높은 확률로 후회

반드시 아래 JSON 형식으로만 응답:
{
  "name": "장소명",
  "location": "위치(있으면)",
  "emoji": "이모지 1개(가게 종류에 맞게)",
  "category": "restaurant|beauty|hospital|lodging|fitness|education|auto|pet|other",
  "categoryLabel": "카테고리 한글명 (예: 식당, 미용실, 병원, 숙소, 헬스장 등)",
  "safetyScore": 0-100 숫자(높을수록 안전),
  "verdict": "recommend|consider|caution|avoid|strongly_avoid",
  "verdictHeadline": "한 줄 판단(20자, 추천/비추천 명확히)",
  "verdictReasons": [
    {"icon": "✅|⚠️|❌", "title": "이유 제목(15자)", "detail": "근거(40자)"},
    ...3개 (recommend/consider면 ✅ 위주, avoid/strongly_avoid면 ❌ 위주, caution이면 ⚠️ 섞기)
  ],
  "bestFor": "이런 분께 추천(40자, 추천일 때만)",
  "worstFor": "이런 분께는 비추(40자, avoid 이상일 때)",
  "oneLineSummary": "한 줄 요약(40자, 손실 프레이밍 - 후회/위험 강조)",
  "avgRating": 평균 별점(1.0-5.0, 소수1자리),
  "ratingDistribution": {"5": 비율(%), "4": ..., "3": ..., "2": ..., "1": ...},
  "aspectScores": [
    {"name": "위 카테고리별 속성1", "score": 0-100, "trend": "up|down|stable", "mentions": 숫자},
    ...정확히 5개, 카테고리에 맞는 속성으로
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

원칙: 별점 아닌 반복 신호. 손실 프레이밍 톤. 리뷰에 없는 내용 생성 금지. evidenceReviews는 실제 원문 인용. safetyScore는 위 기준 엄격 적용. category와 aspectScores 속성이 반드시 일치해야 함.`;

// 네이버 단축 URL을 실제 URL로 확장
async function expandNaverShortUrl(shortUrl) {
  try {
    // HEAD 요청으로 리다이렉트 따라가기
    const res = await fetch(shortUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
      }
    });
    return res.url; // 리다이렉트 끝난 최종 URL
  } catch (e) {
    console.error('단축 URL 확장 실패:', e);
    return null;
  }
}

// 네이버 URL에서 Place ID 추출 (강화 버전)
function extractNaverPlaceId(url) {
  if (!url) return null;
  const decoded = decodeURIComponent(url);
  
  // 우선순위 높은 패턴부터 (장소 상세 페이지)
  const patterns = [
    /pcmap\.place\.naver\.com\/[^\/]+\/(\d+)/,  // pcmap.place.naver.com/restaurant/123
    /m\.place\.naver\.com\/[^\/]+\/(\d+)/,       // m.place.naver.com/restaurant/123
    /map\.naver\.com\/[^\/]*\/entry\/[^\/]+\/(\d+)/,  // map.naver.com/p/entry/place/123
    /place\.naver\.com\/[^\/]+\/(\d+)/,          // 일반 place.naver.com
    /\/place\/(\d+)/,                             // /place/123
    /\/restaurant\/(\d+)/,                        // /restaurant/123
    /[?&]id=(\d{6,})/,                            // ?id=123
    /placePath=[^&]*\/(\d{6,})/,                  // placePath=.../123
  ];
  
  for (const p of patterns) {
    const m = decoded.match(p);
    if (m && m[1]) return m[1];
  }
  
  // 마지막 시도: URL에서 8자리 이상 숫자 (placeId일 가능성)
  // 단, 좌표(c=15.00,...)나 timestamp는 제외하도록 조심
  const numMatches = decoded.match(/\b(\d{8,12})\b/g);
  if (numMatches) {
    // 너무 큰 숫자(13자리 이상은 timestamp일 가능성)는 제외
    const valid = numMatches.filter(n => n.length >= 8 && n.length <= 12);
    if (valid.length > 0) return valid[0];
  }
  
  // 그냥 숫자만 입력한 경우
  if (/^\d+$/.test(url.trim())) return url.trim();
  
  return null;
}

// URL이 검색 페이지인지 장소 상세 페이지인지 판별
function detectUrlType(url) {
  if (!url) return 'unknown';
  if (url.includes('/p/search/')) return 'search';
  if (url.includes('pcmap.place.naver.com') || url.includes('m.place.naver.com')) return 'place';
  if (url.includes('/entry/place/') || url.includes('/entry/restaurant/')) return 'place';
  if (url.includes('naver.me/')) return 'short';
  return 'unknown';
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

  // 단축 URL이면 먼저 확장
  let actualUrl = url;
  if (url.includes('naver.me/') || url.includes('me2.do/')) {
    console.log('단축 URL 감지, 확장 시도:', url);
    const expanded = await expandNaverShortUrl(url);
    if (expanded) {
      actualUrl = expanded;
      console.log('확장 성공:', expanded);
    } else {
      return res.status(400).json({ 
        error: '단축 URL을 펼치지 못했어요. 네이버 지도에서 원본 URL을 복사해주세요.' 
      });
    }
  }

  // URL 타입 체크 (확장된 URL 기준)
  const urlType = detectUrlType(actualUrl);
  if (urlType === 'search') {
    return res.status(400).json({ 
      error: '검색 결과 페이지가 아닌 장소 상세 페이지 URL이 필요해요. 네이버 지도에서 식당을 검색한 후, 그 식당을 클릭해서 상세 페이지로 들어간 다음 공유 버튼을 눌러주세요.' 
    });
  }

  const placeId = extractNaverPlaceId(actualUrl);
  if (!placeId) {
    return res.status(400).json({ 
      error: '장소 ID를 찾을 수 없어요. 네이버 지도 앱에서 식당 페이지를 열고 → 공유 → "URL 복사" 한 링크를 붙여넣어주세요.' 
    });
  }

  try {
    // 1단계: Apify로 리뷰 수집 (타임아웃 설정: 45초)
    const apifyUrl = `https://api.apify.com/v2/acts/oxygenated_quagmire~naver-place-reviews/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=45`;
    
    // 클라이언트 측 타임아웃도 설정 (40초 - Vercel 60초 한도 안에서 OpenAI에 15초 남기기)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 40000);
    
    let apifyRes;
    try {
      apifyRes = await fetch(apifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeUrls: [{ url: `https://pcmap.place.naver.com/restaurant/${placeId}/review/visitor` }],
          maxReviews: 60,  // 80 → 60으로 줄여서 속도 ↑
          sortBy: 'recent',
          includeStats: true
        }),
        signal: controller.signal
      });
    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        return res.status(504).json({ error: '리뷰 수집이 40초를 넘었어요. 잠시 후 다시 시도하거나, 다른 장소로 시도해주세요.' });
      }
      throw e;
    }
    clearTimeout(timeoutId);

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
