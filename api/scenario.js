// 안전빵 - 개인 시나리오 생성 API
// POST /api/scenario
// body: { place: {...}, situation: string }

const SCENARIO_PROMPT = `안전빵 개인 손실 시나리오 생성기.

JSON만:
{
  "lossLevel": "high|medium|low",
  "headline": "예상 손실 한 줄(40자, 손실 프레이밍)",
  "scenarios": [
    {"icon": "이모지", "title": "손실 상황(20자)", "detail": "이유(60자)"},
    ...3개
  ],
  "estimatedLoss": "예상 손실 금액·영향(40자)",
  "verdict": "go|caution|stop",
  "verdictMessage": "판단(30자)",
  "alternativeHint": "대안 힌트(40자)"
}

원칙: 사용자 상황과 장소 위험의 교차점. 손실 프레이밍. 과장 금지.`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST만 허용' });

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) return res.status(500).json({ error: '서버 설정 오류' });

  const { place, situation } = req.body || {};
  if (!place || !situation) return res.status(400).json({ error: 'place와 situation 필요' });

  try {
    const userMsg = `[장소]
이름: ${place.name}
점수: ${place.safetyScore}/100 (${place.scoreLabel})
요약: ${place.oneLineSummary}
위험: ${(place.topRisks || []).map(r => `${r.title}: ${r.detail}`).join(' / ')}

[사용자]
${situation}`;

    const res2 = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SCENARIO_PROMPT },
          { role: 'user', content: userMsg }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4,
        max_tokens: 1500
      })
    });

    if (!res2.ok) return res.status(500).json({ error: `시나리오 생성 실패 (${res2.status})` });
    
    const data = await res2.json();
    const text = data.choices?.[0]?.message?.content || '';
    
    let result;
    try { result = JSON.parse(text); }
    catch (e) {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) result = JSON.parse(m[0]);
      else throw new Error('파싱 실패');
    }
    
    return res.status(200).json(result);
  } catch (e) {
    console.error('Scenario error:', e);
    return res.status(500).json({ error: e.message });
  }
}
