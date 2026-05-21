// 안전빵 - 이미지 캡처 분석 API
// POST /api/analyze-image
// body: { images: [{ dataUrl: string }] }

const SYSTEM_PROMPT = `당신은 "안전빵" AI 리뷰 리스크 진단 시스템입니다.
첨부 이미지의 리뷰들을 읽고 결제 전 위험과 장점을 진단하세요.

【핵심 원칙: 점수 기준】
safetyScore는 0~100 안전 점수입니다. 숫자가 높을수록 안전합니다.
- 75~100: 안심하고 가도 됨
- 55~74: 대체로 안전
- 40~54: 주의 필요
- 25~39: 위험
- 0~24: 매우 위험

【카테고리 자동 판별】
이미지에서 어떤 장소인지 파악해 카테고리 분류:
- restaurant (식당/카페): ["맛/품질", "위생", "응대", "가성비", "분위기"]
- beauty (미용실/네일): ["시술 실력", "친절도", "위생", "가성비", "공간"]
- hospital (병원): ["진료 실력", "응대/설명", "대기 시간", "시설", "수납/비용"]
- lodging (숙소): ["청결", "위치", "시설", "응대", "가성비"]
- fitness (헬스장): ["시설", "강사 실력", "청결", "응대", "가성비"]
- education (학원): ["강사 실력", "시설", "응대", "가성비", "커리큘럼"]
- auto (정비소): ["기술력", "친절도", "가격 투명성", "작업 속도", "사후 대응"]
- pet (동물병원): ["진료 실력", "응대", "가격", "위생", "시설"]
- other: ["품질", "응대", "가성비", "청결", "기타"]

【추천 판단】
- recommend: 75+
- consider: 55~74
- caution: 40~54
- avoid: 25~39
- strongly_avoid: 0~24

JSON으로만 응답:
{
  "name": "장소명",
  "location": "위치(있으면, 없으면 '위치 정보 없음')",
  "emoji": "이모지 1개",
  "category": "위 9개 중 하나",
  "categoryLabel": "카테고리 한글",
  "reviewCount": 보이는 리뷰 개수,
  "safetyScore": 0-100,
  "verdict": "recommend|consider|caution|avoid|strongly_avoid",
  "verdictHeadline": "한 줄 판단(20자)",
  "verdictReasons": [
    {"icon": "✅|⚠️|❌", "title": "이유(15자)", "detail": "근거(40자)"}, ...3개
  ],
  "bestFor": "추천 대상(40자, 추천일 때)",
  "worstFor": "비추 대상(40자, 비추 이상일 때)",
  "oneLineSummary": "한 줄(40자, 손실 프레이밍)",
  "avgRating": 평균(1-5),
  "ratingDistribution": {"5": %, "4": %, "3": %, "2": %, "1": %},
  "aspectScores": [
    {"name": "카테고리별 속성1", "score": 0-100, "trend": "up|down|stable", "mentions": 숫자},
    ...정확히 5개 (카테고리에 맞게)
  ],
  "topRisks": [
    {"title": "...", "detail": "...", "severity": "high|medium|low", "evidenceCount": 숫자,
     "evidenceReviews": [{"rating": 1-5, "date": "...", "text": "원문(80자)"}, ...]}, ...3개],
  "topPositives": [{"title": "...", "detail": "...", "evidenceCount": ..., "evidenceReviews": [...]}, ...3개],
  "avoidIf": ["...", "...", "..."],
  "recentSignal": "...", "priceJudgment": "..."
}

원칙: 별점 아닌 반복 신호. 손실 프레이밍. 이미지에 없는 내용 생성 금지.`;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb'
    }
  }
};

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

  const { images } = req.body || {};
  if (!images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: '이미지가 필요합니다' });
  }
  if (images.length > 5) {
    return res.status(400).json({ error: '이미지는 최대 5장까지' });
  }

  try {
    const imageContents = images.map(img => ({
      type: 'image_url',
      image_url: { url: img.dataUrl }
    }));

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
          { role: 'user', content: [...imageContents, { type: 'text', text: '이 리뷰들을 분석해주세요.' }] }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error('OpenAI error:', openaiRes.status, errText);
      return res.status(500).json({ error: `AI 분석 실패 (${openaiRes.status})` });
    }

    const data = await openaiRes.json();
    const text = data.choices?.[0]?.message?.content || '';
    
    let analysis;
    try { analysis = JSON.parse(text); }
    catch (e) {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) analysis = JSON.parse(m[0]);
      else throw new Error('응답 파싱 실패');
    }

    return res.status(200).json({
      ...analysis,
      sourceUrl: null,
      siteName: '이미지 업로드'
    });
  } catch (e) {
    console.error('Image analyze error:', e);
    return res.status(500).json({ error: e.message || '서버 오류' });
  }
}
