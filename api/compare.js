// 안전빵 - 비교 분석 API
// POST /api/compare
// body: { places: [{ name, safetyScore, ... }] }

const COMPARE_PROMPT = `안전빵 비교 분석가. 사용자가 담은 장소들 중 가장 안전한 선택을 제시.

JSON만:
{
  "winner": 가장 안전한 placeIndex(숫자),
  "winnerReason": "이유(60자, 손실 회피 관점)",
  "comparison": [
    {"placeIndex": 0, "verdict": "go|caution|stop", "verdictLabel": "추천|주의|비추", "strength": "강점(40자)", "weakness": "약점(40자)", "bestFor": "적합 대상(30자)"},
    ...
  ],
  "categoryBest": {"맛/품질": placeIndex, "위생": ..., "응대": ..., "가성비": ..., "분위기": ...},
  "finalAdvice": "조언(80자, 손실 회피 관점)"
}

원칙: 객관적 데이터 기반. 손실 회피 관점에서 후회 가능성 낮은 곳을 winner로.`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST만 허용' });

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: '서버 설정 오류' });
  }

  const { places } = req.body || {};
  if (!Array.isArray(places) || places.length < 2) {
    return res.status(400).json({ error: '비교하려면 2개 이상 필요' });
  }

  try {
    const summary = places.map((p, i) => ({
      placeIndex: i,
      name: p.name,
      safetyScore: p.safetyScore,
      avgRating: p.avgRating,
      oneLineSummary: p.oneLineSummary,
      aspectScores: p.aspectScores,
      topRiskTitles: (p.topRisks || []).map(r => `${r.title}(${r.severity})`),
      topPositiveTitles: (p.topPositives || []).map(p => p.title)
    }));

    const res2 = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: COMPARE_PROMPT },
          { role: 'user', content: `[장소 ${places.length}곳]\n${JSON.stringify(summary, null, 2)}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 2500
      })
    });

    if (!res2.ok) {
      return res.status(500).json({ error: `비교 분석 실패 (${res2.status})` });
    }

    const data = await res2.json();
    const text = data.choices?.[0]?.message?.content || '';
    
    let result;
    try { result = JSON.parse(text); }
    catch (e) {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) result = JSON.parse(m[0]);
      else throw new Error('응답 파싱 실패');
    }

    return res.status(200).json(result);
  } catch (e) {
    console.error('Compare error:', e);
    return res.status(500).json({ error: e.message });
  }
}
