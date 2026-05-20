// 안전빵 - 블로그 리뷰 깊은 분석 API
// POST /api/analyze-blog
// body: { url: string } 또는 { placeId: string }
// 네이버 블로그 리뷰 수집 → 광고 필터링 → 진짜 후기만 분석

const SYSTEM_PROMPT = `당신은 "안전빵" 블로그 리뷰 분석 전문가입니다.
네이버 블로그/카페 리뷰에는 광고가 매우 많습니다(60-80%). 광고를 정확히 가려내고, 진짜 후기에서 의미 있는 신호를 추출하세요.

【광고 판별 기준】
다음 패턴이 있으면 광고 가능성 높음:
1. "협찬", "제공받았", "원고료", "체험단", "서포터즈" 등 명시적 표기
2. 모든 면이 칭찬 일색 (단점 한 줄도 없음)
3. 정형화된 구조 (메뉴 사진 → 가격 안내 → 위치 → 결론적 칭찬)
4. 음식 외 정보(주차, 화장실, 키즈존)까지 완벽하게 정리됨
5. 단점이 있어도 "굳이 꼽자면..." 식으로 부드럽게 처리
6. 마지막에 "재방문 의사 있다", "추천한다" 류의 결론
7. 사진이 전문가급 (각도, 조명, 플레이팅)
8. 작성자가 같은 동네 식당 여러 곳 리뷰

【진짜 후기 특징】
1. 단점이 솔직하게 드러남
2. 감정이 묻어남 (실망, 분노, 놀라움)
3. 구체적 상황 (대기시간, 갈등, 의외의 발견)
4. 사진이 평범하거나 없음
5. "내돈내산" 표기가 신뢰 가능

반드시 아래 JSON 형식으로만 응답:
{
  "totalReviews": 총 분석한 블로그 글 수,
  "adReviews": 광고로 판단된 글 수,
  "realReviews": 진짜 후기로 판단된 글 수,
  "adRatio": 광고 비율 (%, 0-100),
  "trustScore": 0-100 (해당 장소 블로그 리뷰의 신뢰도),
  "deepInsights": [
    {
      "category": "맛|위생|응대|가성비|분위기|기타",
      "title": "심층 발견(20자 이내)",
      "detail": "방문자 리뷰에선 안 보이는 깊은 패턴(80자)",
      "sentiment": "positive|negative|neutral",
      "fromReviews": 해당 패턴이 언급된 리뷰 수
    },
    ...최대 5개
  ],
  "timeTrend": {
    "improving": "최근 개선되고 있는 점(60자, 없으면 '특별한 개선 신호 없음')",
    "worsening": "최근 악화되고 있는 점(60자, 없으면 '특별한 악화 신호 없음')",
    "stable": "꾸준한 강점/약점(60자)"
  },
  "warnings": [
    "방문자 리뷰만 봤다면 놓쳤을 위험 신호(50자)",
    "...",
    "..."
  ],
  "hiddenStrengths": [
    "광고 아닌 진짜 후기들이 공통으로 칭찬하는 점(50자)",
    "...",
    "..."
  ],
  "evidenceQuotes": [
    {"type": "real|ad", "text": "원문 인용(100자)", "reason": "광고/진짜로 판단한 이유(30자)"},
    ...3-5개 (광고/진짜 예시 섞어서)
  ],
  "summary": "방문자 리뷰만 봐선 알 수 없는 핵심 (60자)"
}

원칙: 광고 식별에 보수적이지 말고 공격적으로 판별. "정황상 광고로 보임"이면 광고로 분류. 단, 모든 긍정 리뷰가 광고는 아님(맛집은 진짜 칭찬도 많음). 진짜 후기에서 추출한 패턴만 deepInsights에 포함.`;

// 네이버 단축 URL을 실제 URL로 확장
async function expandNaverShortUrl(shortUrl) {
  try {
    const res = await fetch(shortUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
      }
    });
    return res.url;
  } catch (e) {
    console.error('단축 URL 확장 실패:', e);
    return null;
  }
}

// 네이버 URL에서 Place ID 추출
function extractNaverPlaceId(url) {
  if (!url) return null;
  const decoded = decodeURIComponent(url);
  const patterns = [
    /pcmap\.place\.naver\.com\/[^\/]+\/(\d+)/,
    /m\.place\.naver\.com\/[^\/]+\/(\d+)/,
    /map\.naver\.com\/[^\/]*\/entry\/[^\/]+\/(\d+)/,
    /place\.naver\.com\/[^\/]+\/(\d+)/,
    /\/place\/(\d+)/,
    /\/restaurant\/(\d+)/,
    /[?&]id=(\d{6,})/,
    /placePath=[^&]*\/(\d{6,})/,
  ];
  for (const p of patterns) {
    const m = decoded.match(p);
    if (m && m[1]) return m[1];
  }
  const numMatches = decoded.match(/\b(\d{8,12})\b/g);
  if (numMatches) {
    const valid = numMatches.filter(n => n.length >= 8 && n.length <= 12);
    if (valid.length > 0) return valid[0];
  }
  if (/^\d+$/.test(url.trim())) return url.trim();
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST만 허용' });

  const APIFY_TOKEN = process.env.APIFY_TOKEN;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!APIFY_TOKEN || !OPENAI_API_KEY) {
    return res.status(500).json({ error: '서버 설정 오류: API 키 미설정' });
  }

  const { url, placeId: inputPlaceId } = req.body || {};
  let placeId = inputPlaceId;
  
  // placeId가 없고 url만 있으면 확장 시도
  if (!placeId && url) {
    let actualUrl = url;
    if (url.includes('naver.me/') || url.includes('me2.do/')) {
      const expanded = await expandNaverShortUrl(url);
      if (expanded) actualUrl = expanded;
    }
    placeId = extractNaverPlaceId(actualUrl);
  }
  
  if (!placeId) {
    return res.status(400).json({ error: '네이버 플레이스 ID를 찾을 수 없습니다.' });
  }

  try {
    // 1단계: Apify로 블로그 리뷰 수집
    const apifyUrl = `https://api.apify.com/v2/acts/oxygenated_quagmire~naver-blog-reviews/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
    
    const apifyRes = await fetch(apifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placeUrls: [{ url: `https://pcmap.place.naver.com/restaurant/${placeId}/review/ugc` }],
        maxReviews: 40,        // 블로그는 본문이 길어 40개로 제한
        includeContent: true,   // 본문 포함
        onlyMyMoney: false      // 광고 포함해서 가져와야 광고 비율 계산 가능
      })
    });

    if (!apifyRes.ok) {
      const errText = await apifyRes.text();
      console.error('Apify blog error:', apifyRes.status, errText);
      if (apifyRes.status === 401) return res.status(500).json({ error: 'Apify 토큰 오류' });
      if (apifyRes.status === 402) return res.status(500).json({ error: 'Apify 크레딧 부족' });
      return res.status(500).json({ error: `블로그 리뷰 수집 실패 (${apifyRes.status})` });
    }

    const blogReviews = await apifyRes.json();
    
    if (!Array.isArray(blogReviews) || blogReviews.length === 0) {
      return res.status(200).json({ 
        noBlogReviews: true,
        message: '이 장소는 블로그 리뷰가 거의 없어요. 방문자 리뷰 분석만으로 충분합니다.'
      });
    }

    // 2단계: OpenAI 분석 (광고 필터링 + 깊은 분석)
    // 본문이 길 수 있으니 요약해서 전달
    const reviewText = blogReviews.slice(0, 30).map((r, i) => {
      const body = (r.content || r.body || r.text || '').substring(0, 600); // 본문은 600자로 컷
      return `[블로그${i + 1}] ${r.title || '제목없음'} (${r.created || r.publishDate || '날짜미상'})${r.isOwnMoney ? ' [내돈내산표기]' : ''}\n${body}`;
    }).join('\n\n');

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `[블로그 리뷰 ${blogReviews.length}개]\n${reviewText}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error('OpenAI blog error:', openaiRes.status, errText);
      return res.status(500).json({ error: `AI 분석 실패 (${openaiRes.status})` });
    }

    const openaiData = await openaiRes.json();
    const text = openaiData.choices?.[0]?.message?.content || '';
    
    let analysis;
    try { analysis = JSON.parse(text); }
    catch (e) {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) analysis = JSON.parse(m[0]);
      else throw new Error('응답 파싱 실패');
    }

    return res.status(200).json({
      ...analysis,
      blogReviewCount: blogReviews.length
    });
  } catch (e) {
    console.error('Blog analyze error:', e);
    return res.status(500).json({ error: e.message || '서버 오류' });
  }
}
