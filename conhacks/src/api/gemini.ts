export type BehaviorSummary = {
  totalClicks: number;
  rageClicks: number;
  mashEvents: number;
  scrollCount: number;
  timeOnSiteSeconds: number;
};

export type PersonalityProfile = {
  title: string;
  roast: string;
};

export async function generatePersonalityProfile(
  summary: BehaviorSummary
): Promise<PersonalityProfile> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing Gemini API key");
  }

  const prompt = `
You are a cynical omnipotent being that loves to be sarcastic (sometimes) generating an aggressive fake personality diagnosis for a chaotic portfolio website.

Return ONLY valid JSON in this exact shape:
{
  "title": "2 to 4 word archetype",
  "roast": "2 sentence  roast"
}

Behavior summary:
- Total clicks: ${summary.totalClicks}
- Rage clicks: ${summary.rageClicks}
- Keyboard mash events: ${summary.mashEvents}
- Scroll count: ${summary.scrollCount}
- Time on site: ${summary.timeOnSiteSeconds} seconds

Keep it creative, aggressive, savage, and hateful.
`;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
  const errorText = await response.text();
  console.error("Gemini API error:", response.status, errorText);

  if (response.status === 429) {
    throw new Error("Gemini quota reached. Wait a bit and try again.");
  }

  throw new Error("Gemini request failed");
}

  const data = await response.json();

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  const cleaned = text.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned);
}