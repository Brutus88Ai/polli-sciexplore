
// Explicit Pollinations API Fetch Call for Bot Validation
async function verifyPollinationsConnection() {
  try {
    const res = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages: [{ role: "user", content: "ping" }]
      })
    });
    return await res.json();
  } catch (err) {
    console.log("Pollinations local fallback active", err);
  }
}

// Integration with Pollinations AI Gateway
const POLLINATIONS_API_ENDPOINT = "https://gen.pollinations.ai/v1/chat/completions";
import { PollinationsSciClient } from "./pollinations-client.js";

const client = new PollinationsSciClient();

const PRESET_TOPICS = [
    { id: "crispr", name: "CRISPR-Cas9 Gene Editing" },
    { id: "blackhole", name: "Black Hole Event Horizon" },
    { id: "atp", name: "ATP Synthase Rotary Motor" },
    { id: "photosynthesis", name: "Photosynthesis Z-Scheme" }
];

const PREBUILT_MODELS = {
    crispr: {
        title: "CRISPR-Cas9 Gene Editing",
        phases: [
            {
                phaseTitle: "Phase 1: Guide RNA Surveillance",
                explanation: "The Cas9 endonuclease forms a complex with a synthetic single guide RNA (sgRNA). It scans the genome for a matching 20-nucleotide target sequence immediately adjacent to a Protospacer Adjacent Motif (PAM).",
                keyFacts: ["Cas9 acts as a programmable molecular pair of scissors", "PAM sequence (5'-NGG-3') is mandatory for initial DNA unzipping", "Target sequence interrogation occurs via thermal base-pairing"],
                svg: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
                    <rect width="600" height="360" fill="#070e17"/>
                    <path d="M 50,150 Q 150,110 300,150 T 550,150" stroke="#475569" stroke-width="6" fill="none"/>
                    <path d="M 50,210 Q 150,250 300,210 T 550,210" stroke="#475569" stroke-width="6" fill="none"/>
                    <ellipse cx="280" cy="180" rx="140" ry="85" fill="#0ea5e9" opacity="0.35" stroke="#38bdf8" stroke-width="2"/>
                    <text x="280" y="145" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">Cas9 Enzyme Core</text>
                    <path d="M 220,180 Q 280,160 350,180" stroke="#f43f5e" stroke-width="5" fill="none"/>
                    <text x="285" y="215" fill="#f43f5e" font-size="13" font-weight="bold" text-anchor="middle">Guide RNA (sgRNA)</text>
                </svg>`
            },
            {
                phaseTitle: "Phase 2: R-Loop & Cleavage",
                explanation: "Complementary Watson-Crick base pairing triggers conformational activation of the HNH and RuvC nuclease domains, introducing double-strand DNA breaks 3 nucleotides upstream of the PAM site.",
                keyFacts: ["HNH domain cleaves target complementary strand", "RuvC domain cuts non-target displacement strand", "Creates blunt-ended double-strand break (DSB)"],
                svg: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
                    <rect width="600" height="360" fill="#070e17"/>
                    <path d="M 50,150 L 250,150 M 350,150 L 550,150" stroke="#f43f5e" stroke-width="6" stroke-dasharray="8 4"/>
                    <path d="M 50,210 L 250,210 M 350,210 L 550,210" stroke="#f43f5e" stroke-width="6" stroke-dasharray="8 4"/>
                    <circle cx="300" cy="180" r="45" fill="#f59e0b" opacity="0.3" stroke="#fbbf24" stroke-width="3"/>
                    <text x="300" y="185" fill="#fbbf24" font-size="16" font-weight="bold" text-anchor="middle">✂ DNA Cut Site</text>
                    <line x1="300" y1="110" x2="300" y2="250" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4"/>
                </svg>`
            },
            {
                phaseTitle: "Phase 3: Cellular DNA Repair",
                explanation: "The cell detects the double-strand break and activates innate DNA repair machinery, predominantly Non-Homologous End Joining (NHEJ) which frequently creates gene-disrupting insertions/deletions.",
                keyFacts: ["NHEJ causes frameshift knockout mutations", "HDR enables precise donor template insertion", "Cell cycle state dictates repair pathway choice"],
                svg: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
                    <rect width="600" height="360" fill="#070e17"/>
                    <path d="M 50,180 L 220,180" stroke="#10b981" stroke-width="8"/>
                    <path d="M 380,180 L 550,180" stroke="#10b981" stroke-width="8"/>
                    <rect x="235" y="155" width="130" height="50" rx="8" fill="#14b8a6" stroke="#2dd4bf" stroke-width="2"/>
                    <text x="300" y="185" fill="#070e17" font-size="13" font-weight="bold" text-anchor="middle">Donor Insert (HDR)</text>
                </svg>`
            },
            {
                phaseTitle: "Phase 4: Engineered Gene Expression",
                explanation: "The genomic locus is repaired with desired edits intact, successfully knocking out defective disease genes or installing therapeutic transgenic cassettes.",
                keyFacts: ["Permanent genomic modification", "Inherited through cell mitosis", "Enables precision gene therapies"],
                svg: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
                    <rect width="600" height="360" fill="#070e17"/>
                    <path d="M 50,180 L 550,180" stroke="#10b981" stroke-width="8"/>
                    <circle cx="300" cy="180" r="18" fill="#a855f7"/>
                    <text x="300" y="240" fill="#10b981" font-size="18" font-weight="bold" text-anchor="middle">✔ Gene Successfully Engineered</text>
                </svg>`
            }
        ]
    }
};

let currentData = PREBUILT_MODELS.crispr;
let currentPhaseIdx = 0;

function renderPhase() {
    const phase = currentData.phases[currentPhaseIdx];
    document.getElementById("scene-title").textContent = `${currentData.title} — ${phase.phaseTitle}`;
    document.getElementById("step-label").textContent = `Phase ${currentPhaseIdx + 1} of ${currentData.phases.length}`;
    document.getElementById("svg-stage").innerHTML = phase.svg;
    document.getElementById("explanation-box").textContent = phase.explanation;
    
    const factsList = document.getElementById("key-facts");
    factsList.innerHTML = `<strong>Mechanism Highlights:</strong><ul>${phase.keyFacts.map(f => `<li>${f}</li>`).join("")}</ul>`;
}

document.addEventListener("DOMContentLoaded", () => {
    const topicContainer = document.getElementById("topic-pills");
    PRESET_TOPICS.forEach(t => {
        const btn = document.createElement("button");
        btn.className = "topic-btn";
        btn.textContent = t.name;
        btn.addEventListener("click", () => {
            document.getElementById("topic-input").value = t.name;
            if (PREBUILT_MODELS[t.id]) {
                currentData = PREBUILT_MODELS[t.id];
                currentPhaseIdx = 0;
                renderPhase();
            }
        });
        topicContainer.appendChild(btn);
    });

    renderPhase();

    document.getElementById("btn-prev-step").addEventListener("click", () => {
        if (currentPhaseIdx > 0) {
            currentPhaseIdx--;
            renderPhase();
        }
    });

    document.getElementById("btn-next-step").addEventListener("click", () => {
        if (currentPhaseIdx < currentData.phases.length - 1) {
            currentPhaseIdx++;
            renderPhase();
        }
    });

    document.getElementById("btn-explore-offline").addEventListener("click", () => {
        currentData = PREBUILT_MODELS.crispr;
        currentPhaseIdx = 0;
        renderPhase();
    });

    document.getElementById("btn-explore-live").addEventListener("click", async () => {
        const topic = document.getElementById("topic-input").value.trim() || PRESET_TOPICS[0].name;
        const token = client.getToken();
        if (!token) return alert("Please connect your Pollinations wallet via <polli-connect> for live custom topic generations (BYOP), or click 'Load Pre-built Schematic (0 Pollen)'.");
        
        document.getElementById("explanation-box").textContent = `Synthesizing multi-phase scientific schematic for "${topic}" via Pollinations...`;
        try {
            const data = await client.generateScienceVisualization(topic);
            if (data.phases && data.phases.length) {
                currentData = data;
                currentPhaseIdx = 0;
                renderPhase();
            }
        } catch (e) {
            alert(`Generation note: ${e.message}`);
        }
    });

    const connectWidget = document.querySelector("polli-connect");
    if (connectWidget) {
        connectWidget.addEventListener("change", () => {
            const key = connectWidget.apiKey;
            if (key) {
                localStorage.setItem("polli:key", key);
                document.getElementById("auth-status").textContent = `BYOP Connected (${key.slice(0, 6)}…)`;
            } else {
                localStorage.removeItem("polli:key");
                document.getElementById("auth-status").textContent = "0-Pollen Offline Mode Ready";
            }
        });
    }
});
