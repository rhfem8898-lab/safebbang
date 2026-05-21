// 안전빵 - 네이버 스마트스토어 분석 API
// POST /api/analyze-smartstore
// body: { url: string }
// 네이버 스마트스토어 내부 API 직접 호출 (Apify 대신, 5배 빠름)

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
  
  const patterns = [
    /smartstore\.naver\.com\/([^\/\?]+)\/products\/(\d+)/,
    /brand\.naver\.com\/([^\/\?]+)\/products\/(\d+)/,
  ];
  
  for (const pattern of patterns) {
    const match = decoded.match(pattern);
    if (match) {
      return { 
        storeSlug: match[1], 
        productId: match[2],
        isBrand: pattern.source.includes('brand')
      };
    }
  }
  
  return null;
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

// 네이버 스마트스토어 상품 정보 가져오기
async function fetchProductInfo(storeSlug, productId, isBrand) {
  const domain = isBrand ? 'brand.naver.com' : 'smartstore.naver.com';
  const productUrl = `https://${domain}/i/v2/channels/2sCa37hEpaOLcPLNPCwEMc/products/${productId}`;
  
  try {
    // Approach 1: 페이지 HTML에서 메타 정보 추출
    const pageUrl = `https://${domain}/${storeSlug}/products/${productId}`;
    const pageRes = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml',
      }
    });
    const html = await pageRes.text();
    
    // 메타 태그에서 정보 추출
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/);
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    
    // 가격은 JSON-LD에서
    let price = null, brand = null;
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/);
    if (jsonLdMatch) {
      try {
        const data = JSON.parse(jsonLdMatch[1]);
        if (data.offers?.price) price = data.offers.price;
        if (data.brand?.name) brand = data.brand.name;
      } catch (e) {}
    }
    
    return {
      name: titleMatch ? titleMatch[1].replace(/ : [^:]+$/, '') : '상품',
      brand: brand || storeSlug,
      description: descMatch ? descMatch[1] : '',
      image: imageMatch ? imageMatch[1] : '',
      price: price ? `${price}원` : null
    };
  } catch (e) {
    console.error('상품 정보 가져오기 실패:', e);
    return { name: '상품', brand: storeSlug };
  }
}

// 네이버 스마트스토어 리뷰 가져오기 (내부 API 직접 호출)
async function fetchProductReviews(productId, page = 1, sortType = 'REVIEW_RANKING') {
  const url = `https://smartstore.naver.com/i/v1/reviews/paged-reviews`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        'Accept': 'application/json',
        'Referer': `https://smartstore.naver.com/`,
      },
      body: JSON.stringify({
        page: page,
        pageSize: 20,
        merchantNo: null,
        originProductNo: productId,
        sortType: sortType,
        reviewSearchSortType: sortType
      })
    });
    
    if (!res.ok) {
      console.log(`Review API 실패, status: ${res.status}, page: ${page}, sortType: ${sortType}`);
      return null;
    }
    
    const data = await res.json();
    return data;
  } catch (e) {
    console.error('리뷰 가져오기 실패:', e);
    return null;
  }
}

// 딜레이 헬퍼
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// 리뷰 수집 - 순차 호출 + 딜레이 (rate limit 회피)
// 옵션 B: 위험 강조 샘플링
// - 최신 60개 (현재 상태 반영)
// - 별점 낮은 순 40개 (위험 신호 강조)
async function fetchAllReviews(productId, maxReviews = 100) {
  const allReviews = [];
  const seenIds = new Set();
  
  // 1단계: 최신순 60개 (3 페이지)
  console.log('1단계: 최신 리뷰 수집 시작');
  for (let page = 1; page <= 3; page++) {
    const data = await fetchProductReviews(productId, page, 'RECENT_REVIEW');
    if (!data?.contents || data.contents.length === 0) break;
    
    data.contents.forEach(r => {
      const id = r.reviewId || r.id || `${r.createDate}_${r.writerId}`;
      if (!seenIds.has(id)) {
        seenIds.add(id);
        allReviews.push(r);
      }
    });
    
    // 페이지 간 딜레이 (rate limit 회피)
    if (page < 3) await sleep(800);
  }
  
  console.log(`최신 리뷰: ${allReviews.length}개`);
  
  // 잠시 쉬기
  await sleep(1200);
  
  // 2단계: 별점 낮은 순 40개 (2 페이지) - 위험 신호 강조 (옵션 B)
  console.log('2단계: 별점 낮은 리뷰 수집 시작');
  for (let page = 1; page <= 2; page++) {
    const data = await fetchProductReviews(productId, page, 'REVIEW_SCORE_LOW');
    if (!data?.contents || data.contents.length === 0) break;
    
    data.contents.forEach(r => {
      const id = r.reviewId || r.id || `${r.createDate}_${r.writerId}`;
      if (!seenIds.has(id)) {
        seenIds.add(id);
        allReviews.push(r);
      }
    });
    
    if (page < 2) await sleep(800);
  }
  
  console.log(`총 리뷰: ${allReviews.length}개`);
  
  return allReviews.slice(0, maxReviews);
}

// 점수 차감 방식으로 계산 (옵션 B 가중치)
function calculateSafetyScore(reviews, aiAnalysis) {
  let score = 100;
  
  // 별점 분포 계산
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => {
    const rating = parseInt(r.reviewScore || r.score || 0);
    if (rating >= 1 && rating <= 5) ratingCounts[rating]++;
  });
  
  const total = reviews.length || 1;
  
  // 옵션 B: 3점 이하가 전체의 65% 가중치
  // 1점 리뷰 1개당 -2점
  score -= ratingCounts[1] * 2;
  // 2점 리뷰 1개당 -1점
  score -= ratingCounts[2] * 1;
  // 3점 리뷰 1개당 -0.3점 (10% 가중)
  score -= ratingCounts[3] * 0.3;
  
  // 5점 리뷰가 90% 이상이면 광고 의심 → 가점 안 줌
  // 5점 리뷰가 60% 이상이고 5점 광고 의심 안 되면 가점
  const fiveRatio = ratingCounts[5] / total;
  if (fiveRatio < 0.9 && fiveRatio > 0.6) {
    score += 3; // 진정성 있는 긍정 리뷰
  }
  
  // 최근 10개 중 1~2점이 5개 이상 → 최근 악화 -10점
  const recent10 = reviews.slice(0, 10);
  const recentLow = recent10.filter(r => {
    const rating = parseInt(r.reviewScore || r.score || 0);
    return rating <= 2;
  }).length;
  if (recentLow >= 5) score -= 10;
  
  // AI가 발견한 위험 신호 반영
  if (aiAnalysis) {
    // 사진 vs 실물 차이가 심각하면
    if (aiAnalysis.photoMatch && /다르|차이|실망|속았/.test(aiAnalysis.photoMatch)) {
      score -= 5;
    }
    // CS 문제
    if (aiAnalysis.csQuality && /불친절|환불.{0,5}거부|연락.{0,5}안/.test(aiAnalysis.csQuality)) {
      score -= 5;
    }
    // 광고 의심 비율 높음
    if (aiAnalysis.fakeReviewRatio && /[4-9]\d.{0,3}%|100.{0,3}%/.test(aiAnalysis.fakeReviewRatio)) {
      score -= 10;
    }
    // 심각한 위험 신호 (high severity) 개수만큼 추가 감점
    const highRisks = (aiAnalysis.topRisks || []).filter(r => r.severity === 'high').length;
    score -= highRisks * 3;
  }
  
  // 범위 제한
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  return score;
}

// 점수에 따른 verdict 결정 (백엔드에서 강제)
function determineVerdict(score) {
  if (score >= 75) return 'recommend';
  if (score >= 55) return 'consider';
  if (score >= 40) return 'caution';
  if (score >= 25) return 'avoid';
  return 'strongly_avoid';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST만 허용' });

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: '서버 설정 오류: OpenAI 키 미설정' });
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
      error: '네이버 스마트스토어/브랜드스토어 상품 URL을 인식하지 못했어요.\n예: https://smartstore.naver.com/STORE/products/12345' 
    });
  }

  try {
    // 1단계: 상품 정보 + 리뷰 병렬 수집 (총 15~20초)
    const [productInfo, reviews] = await Promise.all([
      fetchProductInfo(storeInfo.storeSlug, storeInfo.productId, storeInfo.isBrand),
      fetchAllReviews(storeInfo.productId, 100)
    ]);
    
    if (!reviews || reviews.length === 0) {
      return res.status(200).json({
        noReviews: true,
        name: productInfo?.name || '상품',
        message: '이 상품은 아직 리뷰가 거의 없어요. 신중히 결정하세요.'
      });
    }

    // 2단계: OpenAI 분석
    const reviewText = reviews.slice(0, 100).map((r, i) => {
      const text = (r.reviewContent || r.content || '').substring(0, 300);
      const rating = r.reviewScore || r.score || '?';
      const date = r.createDate || r.regDate || '날짜미상';
      const product = r.productName || '';
      return `[${i + 1}] ★${rating} (${date}) ${product ? `[${product}] ` : ''}${text}`;
    }).join('\n');
    
    const productSummary = `[상품 정보]
상품명: ${productInfo?.name || '미상'}
판매자: ${productInfo?.brand || storeInfo.storeSlug}
가격: ${productInfo?.price || '미상'}
설명: ${productInfo?.description ? productInfo.description.substring(0, 200) : ''}
리뷰 수: ${reviews.length}개`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `${productSummary}\n\n[리뷰 ${reviews.length}개]\n${reviewText}` }
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

    // 점수 차감 방식으로 재계산 (옵션 B: 3점 이하 65% 가중)
    const calculatedScore = calculateSafetyScore(reviews, analysis);
    const calculatedVerdict = determineVerdict(calculatedScore);
    
    // AI 점수 대신 계산된 점수 사용 (일관성 보장)
    analysis.safetyScore = calculatedScore;
    analysis.verdict = calculatedVerdict;

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
