import BaseHero from "./BaseHero.jsx";
import "./HomeHero.css";

const HERO_LINES = [
  [
    { text: "A college shouldn’t be a guess." },
  ],
  [
    { text: "Hear it from seniors who lived it." },
  ],
  [
    { text: "No filters. Just the " },
    { text: "truth", script: true },
    { text: "." },
  ],
];

const HEADLINE =
  "A college shouldn’t be a guess. Hear it from seniors who lived it. No filters. Just the truth.";

function renderLine(segments) {
  return segments.map((segment, index) =>
    segment.script ? (
      <em className="home-hero__script" key={index}>
        {segment.text}
      </em>
    ) : (
      <span key={index}>{segment.text}</span>
    )
  );
}

export default function HomeHero() {
  return (
    <BaseHero
      className="home-hero"
      title={
        <span
          className="home-hero__headline"
          aria-label={HEADLINE}
        >
          {HERO_LINES.map((segments, index) => (
            <span
              className="home-hero__line"
              key={index}
              style={{
                "--line-delay": `${200 + index * 800}ms`,
              }}
            >
              <span className="home-hero__main">
                {renderLine(segments)}
              </span>

              <span
                className="home-hero__glitch"
                aria-hidden="true"
              >
                <span className="home-hero__slice home-hero__slice--one">
                  {renderLine(segments)}
                </span>

                <span className="home-hero__slice home-hero__slice--two">
                  {renderLine(segments)}
                </span>

                <span className="home-hero__slice home-hero__slice--three">
                  {renderLine(segments)}
                </span>
              </span>
            </span>
          ))}
        </span>
      }
    />
  );
}