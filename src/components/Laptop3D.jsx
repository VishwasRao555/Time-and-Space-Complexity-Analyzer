import { useEffect, useState } from "react";
import { DiJavascript1, DiJava, DiPython } from "react-icons/di";
import { SiCplusplus, SiC, SiTypescript } from "react-icons/si";
import "./Laptop3D.css";

const STEP_INTERVAL = 1700; // ms each card holds before the next step
const SETTLE = 600; // ms the tween takes to slide one slot
const R_X = 340; // arch horizontal radius (wider = more space between cards)
const R_Y = 118; // arch vertical radius

const CENTER_HIDE_DEG = 12; // half-width of the dead zone right behind the laptop
const VISIBLE_SPAN_DEG = 100; // cards are only ever shown within +/- this many degrees of centre
const EDGE_FADE_DEG = 25; // width of the fade-out as a card nears the visible span's edge

// Six languages, repeated around the loop so the arch stays full. Java,
// C++, Python and JavaScript come first (the requested order), then C and
// TypeScript continue the cycle.
const LANGS = [
  { id: "java", Icon: DiJava, color: "#e07c22", label: "Java" },
  { id: "cpp", Icon: SiCplusplus, color: "#3a6ea5", label: "C++" },
  { id: "python", Icon: DiPython, color: "#4b8bbe", label: "Python" },
  { id: "javascript", Icon: DiJavascript1, color: "#e8c020", label: "JavaScript" },
  { id: "c", Icon: SiC, color: "#6f86b8", label: "C" },
  { id: "typescript", Icon: SiTypescript, color: "#3178c6", label: "TypeScript" },
];

// Twice the language count, spaced 30deg apart — fine enough steps that
// roughly two cards sit comfortably visible on each side at once.
const CARD_COUNT = LANGS.length * 2;
const STEP_ANGLE = 360 / CARD_COUNT;
const CARDS = Array.from({ length: CARD_COUNT }, (_, i) => ({
  ...LANGS[i % LANGS.length],
  key: i,
}));

// Place a card on the top arch from its angle. Every card sits on the same
// flat plane (fixed size, no scale/z-index depth) and is hidden by opacity
// alone: invisible in the dead zone directly behind the laptop (the screen
// shows that language instead), and it fades out again at the horizon —
// cards never dip down toward the laptop's base, only the top arch is
// ever shown, just like the reference.
function placeCard(angleDeg) {
  let a = ((angleDeg % 360) + 360) % 360;
  if (a > 180) a -= 360; // normalise to [-180, 180]
  const absA = Math.abs(a);
  const rad = (a * Math.PI) / 180;
  const x = R_X * Math.sin(rad);
  const y = -R_Y * Math.cos(rad);

  let opacity = 0;
  if (absA < VISIBLE_SPAN_DEG) {
    opacity = 1;
    if (absA < CENTER_HIDE_DEG) {
      opacity = absA / CENTER_HIDE_DEG;
    } else if (absA > VISIBLE_SPAN_DEG - EDGE_FADE_DEG) {
      opacity = (VISIBLE_SPAN_DEG - absA) / EDGE_FADE_DEG;
    }
  }

  return { x, y, opacity: Math.max(0, Math.min(1, opacity)) };
}

export default function Laptop3D() {
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(LANGS[0]);

  // Advance one slot at a time with a hold between steps (stepped carousel).
  useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), STEP_INTERVAL);
    return () => clearInterval(id);
  }, []);

  // The card that lands dead-centre fades out as the laptop screen takes
  // over showing that language. Wait for the dip to happen before swapping.
  useEffect(() => {
    const lang = LANGS[(step % CARD_COUNT) % LANGS.length];
    const id = setTimeout(() => setActive(lang), SETTLE);
    return () => clearTimeout(id);
  }, [step]);

  const ActiveIcon = active.Icon;

  return (
    <div className="laptop-scene">
      <div className="arch-wrap">
        {CARDS.map((card, i) => {
          const { x, y, opacity } = placeCard((i - step) * STEP_ANGLE);
          return (
            <div
              key={card.key}
              className="arch-card"
              style={{
                transform: `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`,
                opacity,
                // No transition while invisible (avoids visible "teleport"
                // when a card wraps around the hidden bottom).
                transition: opacity < 0.02 ? "none" : `transform ${SETTLE}ms cubic-bezier(0.5, 0, 0.2, 1), opacity ${SETTLE}ms ease`,
              }}
            >
              <card.Icon size={52} color={card.color} />
            </div>
          );
        })}

        <div className="laptop">
          <div className="laptop-lid">
            <div className="laptop-bezel">
              <span className="laptop-cam" />
              <div className="laptop-screen">
                <div className="laptop-scanlines" />
                <div key={active.id} className="laptop-screen-icon">
                  <ActiveIcon size={68} color={active.color} />
                </div>
                <div className="laptop-screen-label">{active.label}</div>
              </div>
            </div>
          </div>
          <div className="laptop-deck">
            <div className="laptop-hinge" />
            <div className="laptop-keyboard" />
          </div>
          <div className="laptop-shadow" />
        </div>
      </div>
    </div>
  );
}
