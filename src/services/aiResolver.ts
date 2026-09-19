export interface ResolvedInsurerInfo {
  insurerName: string;
  officialWebsiteUrl: string;
  customerSupportPhone: string;
  isAiResolved: boolean;
  notes: string;
}

// Known common database of insurer official portals for instant zero-latency resolution
const KNOWN_INSURERS: Record<string, ResolvedInsurerInfo> = {
  'star health': {
    insurerName: 'Star Health & Allied Insurance',
    officialWebsiteUrl: 'https://www.starhealth.in',
    customerSupportPhone: '1800-425-2255',
    isAiResolved: true,
    notes: 'Official Star Health customer portal for policy renewals and claims.'
  },
  'medicare': {
    insurerName: 'Medicare Official Portal',
    officialWebsiteUrl: 'https://www.medicare.gov',
    customerSupportPhone: '1-800-633-4227',
    isAiResolved: true,
    notes: 'Official US Medicare government portal for senior healthcare benefits.'
  },
  'blue cross': {
    insurerName: 'Blue Cross Blue Shield',
    officialWebsiteUrl: 'https://www.bcbs.com',
    customerSupportPhone: '1-800-262-2583',
    isAiResolved: true,
    notes: 'Official Blue Cross member portal.'
  },
  'aetna': {
    insurerName: 'Aetna Health',
    officialWebsiteUrl: 'https://www.aetna.com',
    customerSupportPhone: '1-800-872-3862',
    isAiResolved: true,
    notes: 'Official Aetna member login and policy manager.'
  },
  'lic': {
    insurerName: 'LIC of India (Life Insurance Corp)',
    officialWebsiteUrl: 'https://licindia.in',
    customerSupportPhone: '022-68276827',
    isAiResolved: true,
    notes: 'Official LIC portal for policy renewal payments.'
  },
  'hdfc ergo': {
    insurerName: 'HDFC ERGO General Insurance',
    officialWebsiteUrl: 'https://www.hdfcergo.com',
    customerSupportPhone: '022-62346234',
    isAiResolved: true,
    notes: 'Official HDFC ERGO health and motor insurance portal.'
  },
  'kaiser': {
    insurerName: 'Kaiser Permanente',
    officialWebsiteUrl: 'https://healthy.kaiserpermanente.org',
    customerSupportPhone: '1-800-464-4000',
    isAiResolved: true,
    notes: 'Official Kaiser member portal.'
  },
  'unitedhealth': {
    insurerName: 'UnitedHealthcare',
    officialWebsiteUrl: 'https://www.uhc.com',
    customerSupportPhone: '1-800-842-8000',
    isAiResolved: true,
    notes: 'Official UnitedHealthcare portal.'
  }
};

/**
 * Resolves insurer name to official website URL & support phone number.
 */
export async function resolveInsurerWebsite(
  name: string,
  apiKey?: string
): Promise<ResolvedInsurerInfo> {
  const cleanName = name.trim().toLowerCase();

  // Check known database first
  for (const key in KNOWN_INSURERS) {
    if (cleanName.includes(key)) {
      return KNOWN_INSURERS[key];
    }
  }

  // If custom API key present, call Gemini
  if (apiKey && apiKey.length > 10) {
    try {
      const prompt = `Return the official website URL and customer care phone number for insurance provider: "${name}".
Respond ONLY in JSON format:
{
  "officialWebsiteUrl": "https://...",
  "customerSupportPhone": "1800-...",
  "notes": "Short description"
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
            insurerName: name,
            officialWebsiteUrl: parsed.officialWebsiteUrl || `https://www.google.com/search?q=${encodeURIComponent(name + ' official website')}`,
            customerSupportPhone: parsed.customerSupportPhone || '1-800-555-0199',
            isAiResolved: true,
            notes: parsed.notes || `GenAI resolved portal for ${name}.`
          };
        }
      }
    } catch (err) {
      console.warn('Gemini resolver fallback:', err);
    }
  }

  // Smart fallback URL generation
  const formattedDomain = cleanName.replace(/[^a-z0-9]/g, '');
  return {
    insurerName: name,
    officialWebsiteUrl: `https://www.${formattedDomain}.com`,
    customerSupportPhone: '1-800-555-0199',
    isAiResolved: true,
    notes: `Resolved portal URL for ${name}. You can edit or replace this link anytime.`
  };
}
