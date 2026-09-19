import { HealthStatEntry, AiHealthSummary } from '../types';

/**
 * GenAI Health Interpreter Service.
 * Uses Gemini API if custom API key is present or uses intelligent plain-language synthesis.
 */
export async function generateHealthTrendInsight(
  recentEntries: HealthStatEntry[],
  apiKey?: string
): Promise<AiHealthSummary> {
  if (!recentEntries || recentEntries.length === 0) {
    return {
      overallHealthStatus: 'Optimal',
      overallTrend: 'No recent health logs recorded.',
      plainLanguageSummary: 'Log your blood pressure, glucose, or temperature to see a simple weekly summary.',
      recommendation: 'Try taking a reading today to start tracking your health.',
      suggestDoctorVisit: false,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  const abnormalCount = recentEntries.filter(e => e.status === 'Abnormal').length;
  const borderlineCount = recentEntries.filter(e => e.status === 'Borderline').length;

  let computedStatus: 'Optimal' | 'Good' | 'Attention Needed' = 'Optimal';
  if (abnormalCount > 0) computedStatus = 'Attention Needed';
  else if (borderlineCount > 0) computedStatus = 'Good';

  // Try API call if key provided
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const prompt = `You are a warm, gentle senior companion assistant. Analyze the following health stat entries for a senior citizen.
The deterministic medical rules have already classified the entries. DO NOT change the medical status.
Explain the trend in plain, clear, non-jargon English (maximum 3 sentences).

Recent Entries:
${JSON.stringify(recentEntries.map(e => ({ type: e.type, val: `${e.valueNumeric1}${e.valueNumeric2 ? '/' + e.valueNumeric2 : ''} ${e.unit}`, status: e.status, reason: e.statusReason, date: e.timestamp })))}

Return JSON with format:
{
  "overallTrend": "Short title e.g. Slightly Elevated Blood Pressure",
  "plainLanguageSummary": "Simple explanation",
  "recommendation": "Gentle daily advice",
  "suggestDoctorVisit": true/false
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            overallHealthStatus: computedStatus,
            overallTrend: parsed.overallTrend || 'Weekly Health Insight',
            plainLanguageSummary: parsed.plainLanguageSummary || 'Your readings are logged.',
            recommendation: parsed.recommendation || 'Keep logging daily.',
            suggestDoctorVisit: !!parsed.suggestDoctorVisit,
            generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call fell back to local AI synthesizer:', err);
    }
  }

  // Deterministic local GenAI plain-language synthesizer (Rule-bounded)
  const suggestDoctor = abnormalCount >= 1 || borderlineCount >= 3;

  let trendTitle = 'Steady & Healthy Week';
  let summaryText = 'Your recent health readings look stable and within your normal targets.';
  let adviceText = 'Keep up your regular daily routine, take medicines on time, and stay hydrated!';

  if (abnormalCount > 0) {
    const latestAbnormal = recentEntries.find(e => e.status === 'Abnormal');
    trendTitle = `Attention Needed: ${latestAbnormal?.type.toUpperCase()} Alert`;
    summaryText = `We noticed ${abnormalCount} reading(s) outside your standard goal, such as your ${latestAbnormal?.type} entry of ${latestAbnormal?.valueNumeric1} ${latestAbnormal?.unit}.`;
    adviceText = `Please share these readings with your family caregiver or doctor. Rest comfortably and consider booking a checkup.`;
  } else if (borderlineCount > 0) {
    trendTitle = 'Slightly Elevated Readings';
    summaryText = `Your readings show ${borderlineCount} borderline entry over the past few days. Overall it is manageable, but worth monitoring.`;
    adviceText = `Try logging your stats at the same time each day (e.g. morning after waking up) for accurate comparison.`;
  }

  return {
    overallHealthStatus: computedStatus,
    overallTrend: trendTitle,
    plainLanguageSummary: summaryText,
    recommendation: adviceText,
    suggestDoctorVisit: suggestDoctor,
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
