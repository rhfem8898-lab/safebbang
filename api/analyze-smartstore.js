// 안전빵 - 네이버 스마트스토어 분석 API
// POST /api/analyze-smartstore
// body: { url: string }

const SYSTEM_PROMPT = `당신은 "안전빵" 스마트스토어 상품 리뷰 분석 시스템입니다.
온라인 쇼핑은 결제 후 후회 가능성이 큰 영역입니다. 사진 vs 실물 차이, 품질 불량, 환불 갈등, 배송 문제 등 위험을 정확히 진단하세요.

【핵심 원칙: 점수 기준】
safetyScore는 0~100 안전 점수입니다. 숫자가 높을수록 안전합니다.
- 75~100: 안심하고 구매 가능, 큰 위험 없음
- 55~74: 대체로 만족, 일부 약점 있음
- 40~54: 주의 필요, 반품 가능성 있음
- 25~39: 위험, 후회 가능성 높음
- 0~24: 매우 위험, 구매 비추

【상품 카테고리 자동 판별】
상품을 다음 카테고리 중 하나로 분류:

1. "fashion" (의류/신발/패션)
   속성: ["사이즈 정확도", "원단/품질", "사진 vs 실물", "배송", "가성비"]
2. "beauty_product" (화장품/뷰티)
   속성: ["효과", "발색/사용감", "성분/안전성", "용량", "가성비"]
3. "food" (식품/건강식품)
   속성: ["맛/품질", "신선도", "포장 상태", "양", "가성비"]
4. "electronics" (전자제품/가전)
   속성: ["성능", "내구성", "사용 편의성", "사진 vs 실물", "가성비"]
5. "home" (생활용품/주방/가구)
   속성: ["품질", "사진 vs 실물", "사용 편의성", "내구성", "가성비"]
6. "baby_kids" (육아/유아/완구)
   속성: ["안전성", "품질", "마감", "사이즈/연령 적합", "가성비"]
7. "pet_product" (반려동물용품/사료)
   속성: ["품질", "안전성", "기호성", "사진 vs 실물", "가성비"]
8. "office" (사무/문구/도서)
   속성: ["품질", "기능성", "내구성", "사진 vs 실물", "가성비"]
9. "other" (기타)
   속성: ["품질", "사진 vs 실물", "배송", "응대", "가성비"]

【공통으로 체크해야 할 위험 신호】
- 사진과 실물 차이 (색상, 사이즈, 재질)
- 품질 불량 (찢어짐, 파손, 오작동)
- 배송 문제 (지연, 파손, 누락)
- CS/환불 갈등 (응대 불친절, 환불 거부)
- 광고/체험단 의심 (정형화된 5점 리뷰 다수)

【추천 판단】
- recommend: 75+
- consider: 55~74
- caution: 40~54
- avoid: 25~39
- strongly_avoid: 0~24

JSON으로만 응답:
{
  "name": "상품명",
  "brand": "판매자/브랜드명",
  "emoji": "상품 이모지",
  "category": "fashion|beauty_product|food|electronics|home|baby_kids|pet_product|office|other",
  "categoryLabel": "한글 카테고리 (예: 의류, 화장품, 식품 등)",
  "price": "가격(있으면)",
  "safetyScore": 0-100,
  "verdict": "recommend|consider|caution|avoid|strongly_avoid",
  "verdictHeadline": "구매 판단 한 줄(20자)",
  "verdictReasons": [
    {"icon": "✅|⚠️|❌", "title": "이유(15자)", "detail": "근거(40자)"},
    ...3개
  ],
  "bestFor": "이런 분께 추천(40자, 추천일 때)",
  "worstFor": "이런 분께는 비추(40자, 비추일 때)",
  "oneLineSummary": "한 줄(40자, 손실 프레이밍)",
  "avgRating": 평균(1-5),
  "ratingDistribution": {"5": %, "4": %, "3": %, "2": %, "1": %},
  "aspectScores": [
    {"name": "카테고리별 속성", "score": 0-100, "trend": "up|down|stable", "mentions": 숫자},
    ...정확히 5개
  ],
  "topRisks": [
    {"title": "위험명(15자)", "detail": "근거+빈도(60자)", "severity": "high|medium|low", "evidenceCount": 숫자,
     "evidenceReviews": [{"rating": 1-5, "date": "...", "text": "원문(80자)"}, ...2~3개]},
    ...3개
  ],
  "topPositives": [
    {"title": "장점(15자)", "detail": "근거+빈도(60자)", "evidenceCount": 숫자,
     "evidenceReviews": [{"rating": ..., "date": "...", "text": "..."}, ...2개]},
    ...3개
  ],
  "photoMatch": "사진과 실물 일치도 평가(40자)",
  "shippingQuality": "배송 품질 평가(40자)",
  "csQuality": "CS/환불 응대 평가(40자)",
  "fakeReviewRatio": "광고/체험단 의심 비율 (예: '약 20% 광고 의심')",
  "avoidIf": ["피해야 할 상황1", "...", "..."],
  "recentSignal": "최근 품질 변화 신호(없으면 '특이 신호 없음')",
  "priceJudgment": "가격 판단(가성비 평가)"
}

원칙: 별점 아닌 반복 패턴. 손실 프레이밍 톤 (구매 후 후회 위험 강조). 광고 리뷰 가려내기. 리뷰에 없는 내용 생성 금지.`;

// 스마트스토어 URL에서 정보 추출
function extractSmartstoreInfo(url) {
  if (!url) return null;
  const decoded = decodeURIComponent(url);
  
  // 패턴들
  const patterns = [
    // smartstore.naver.com/{slug}/products/{productId}
    /smartstore\.naver\.com\/([^\/\?]+)\/products\/(\d+)/,
    // brand.naver.com/{slug}/products/{productId}
    /brand\.naver\.com\/([^\/\?]+)\/products\/(\d+)/,
    // shopping.naver.com/...nvMid=...
    /nvMid=(\d+)/,
  ];
  
  for (const pattern of patterns) {
    const match = decoded.match(pattern);
    if (match) {
      if (match.length >= 3) {
        return { storeSlug: match[1], productId: match[2] };
      } else {
        return { storeSlug: null, productId: match[1] };
      }
    }
  }
  
  return null;
}

function detectStoreType(url) {
  if (!url) return 'unknown';
  if (url.includes('smartstore.naver.com')) return 'smartstore';
  if (url.includes('brand.naver.com')) return 'brand';
  if (url.includes('shopping.naver.com')) return 'shopping';
  return 'unknown';
}

// 단축 URL 확장
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

  const { url } = req.body || {};
  if (!url) {
    return res.status(400).json({ error: 'URL이 필요합니다' });
  }

  // 단축 URL 확장
  let actualUrl = url;
  if (url.includes('naver.me/') || url.includes('me2.do/')) {
    const expanded = await expandNaverShortUrl(url);
    if (expanded) actualUrl = expanded;
  }

  const storeInfo = extractSmartstoreInfo(actualUrl);
  if (!storeInfo) {
    return res.status(400).json({ 
      error: '네이버 스마트스토어/브랜드스토어 URL을 인식하지 못했어요. 상품 페이지 URL을 확인해주세요.' 
    });
  }

  try {
    // Apify로 상품 + 리뷰 수집
    const apifyUrl = `https://api.apify.com/v2/acts/accurate_dancer~naver-smart-store-monitor/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=45`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 40000);
    
    let apifyRes;
    try {
      apifyRes = await fetch(apifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandSlugs: storeInfo.storeSlug ? [storeInfo.storeSlug] : [],
          productIds: [storeInfo.productId],
          includeReviews: true,
          maxReviewsPerProduct: 100
        }),
        signal: controller.signal
      });
    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        return res.status(504).json({ error: '리뷰 수집이 40초를 넘었어요. 다시 시도해주세요.' });
      }
      throw e;
    }
    clearTimeout(timeoutId);

    if (!apifyRes.ok) {
      const errText = await apifyRes.text();
      console.error('Apify smartstore error:', apifyRes.status, errText);
      if (apifyRes.status === 401) return res.status(500).json({ error: 'Apify 토큰 오류' });
      if (apifyRes.status === 402) return res.status(500).json({ error: 'Apify 크레딧 부족' });
      return res.status(500).json({ error: `리뷰 수집 실패 (${apifyRes.status})` });
    }

    const products = await apifyRes.json();
    
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(404).json({ error: '상품을 찾지 못했어요. URL을 다시 확인해주세요.' });
    }

    const product = products[0];
    const reviews = product.reviews || [];
    
    if (reviews.length === 0) {
      return res.status(200).json({
        noReviews: true,
        name: product.name || '상품',
        message: '이 상품은 아직 리뷰가 거의 없어요. 신중히 결정하세요.'
      });
    }

    // OpenAI 분석
    const reviewText = reviews.slice(0, 100).map((r, i) => {
      const text = (r.text || r.content || '').substring(0, 300);
      return `[${i + 1}] ★${r.rating || '?'} (${r.date || '날짜미상'}) ${text}`;
    }).join('\n');
    
    const productInfo = `[상품 정보]
상품명: ${product.name || '미상'}
판매자: ${product.seller || product.brand || '미상'}
가격: ${product.price || '미상'}
카테고리: ${product.category || '미상'}
평균 평점: ${product.rating || '미상'}
리뷰 수: ${reviews.length}개`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `${productInfo}\n\n[리뷰 ${reviews.length}개]\n${reviewText}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error('OpenAI smartstore error:', openaiRes.status, errText);
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
      sourceUrl: actualUrl,
      siteName: '스마트스토어',
      sourceType: 'smartstore',
      reviewCount: reviews.length,
      placeId: storeInfo.productId
    });
  } catch (e) {
    console.error('Smartstore analyze error:', e);
    return res.status(500).json({ error: e.message || '서버 오류' });
  }
}
