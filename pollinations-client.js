export const POLLINATIONS_API_BASE = "https://gen.pollinations.ai";

export class PollinationsSciClient {
    constructor() {
        this.apiBase = POLLINATIONS_API_BASE;
    }

    getToken() {
        return localStorage.getItem("polli:key") || localStorage.getItem("pollinations_api_key") || null;
    }

    async generateScienceVisualization(topic) {
        const token = this.getToken();
        if (!token) throw new Error("No BYOP token connected. Connect via <polli-connect> or use 0-Pollen pre-built schematics.");

        const systemPrompt = `You are a scientific visualizer and educator. Given a scientific phenomenon or concept, return JSON with keys:
- title: concise topic title
- phases: array of 4 distinct phases/steps, each containing:
  - phaseTitle: title of the step
  - svg: standalone valid SVG string (viewBox="0 0 600 360") illustrating this exact phase clearly with high-contrast colors (#0ea5e9, #14b8a6, #f59e0b, #ec4899, #f8fafc) on dark background
  - explanation: 2-3 sentences explaining physical/molecular mechanisms in this phase
  - keyFacts: array of 3 bullet takeaways`;

        const res = await fetch(`${this.apiBase}/v1/chat/completions`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai",
                response_format: { type: "json_object" },
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Generate scientific explorable visualization for: ${topic}` }
                ]
            })
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Pollinations error (${res.status}): ${err}`);
        }

        const data = await res.json();
        return JSON.parse(data.choices?.[0]?.message?.content || "{}");
    }
}
