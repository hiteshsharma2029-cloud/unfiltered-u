import Card from "../ui/Card";
import "./HomeFeatures.css";

const FEATURES = [
  {
    id: "reviews",
    number: "01",
    eyebrow: "REAL EXPERIENCES",
    title: "Reviews from real seniors",
    description:
      "First-hand reviews on hostels, food, faculty and placements, written by students who have actually been there.",
    className: "home-feature-card--reviews",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M10 9.5h21.5A4.5 4.5 0 0 1 36 14v15a4.5 4.5 0 0 1-4.5 4.5H20l-9 6v-6A4.5 4.5 0 0 1 6.5 29V13A3.5 3.5 0 0 1 10 9.5Z" />
        <path d="M14 18h14M14 24h10" />
        <path d="m32 5 2 4 4.5.7-3.2 3.1.8 4.4-4.1-2.1-4 2.1.8-4.4-3.2-3.1 4.4-.7L32 5Z" />
      </svg>
    ),
    detail: "FIRST-HAND PERSPECTIVES",
  },
  {
    id: "fresh",
    number: "02",
    eyebrow: "STAY UP TO DATE",
    title: "Reviews that stay fresh",
    description:
      "Every review fades with time unless seniors confirm it is still true, so what you read is what is current.",
    className: "home-feature-card--fresh",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M38 17A15 15 0 0 0 11 13l-3 4" />
        <path d="M8 9v8h8M10 31a15 15 0 0 0 27 4l3-4" />
        <path d="M40 39v-8h-8" />
        <path d="M24 15v9l6 3" />
      </svg>
    ),
    detail: "CURRENT, NOT OUTDATED",
  },
  {
    id: "groups",
    number: "03",
    eyebrow: "FIND YOUR PEOPLE",
    title: "Groups that fit you",
    description:
      "Join groups by college, branch or batch and talk to people who are exactly where you are headed.",
    className: "home-feature-card--groups",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="19" cy="16" r="6" />
        <path d="M7 38v-3.5A9.5 9.5 0 0 1 16.5 25h5A9.5 9.5 0 0 1 31 34.5V38" />
        <path d="M29 10.5a6 6 0 0 1 0 11.5M34 26a8.5 8.5 0 0 1 7 8.4V38" />
      </svg>
    ),
    detail: "COLLEGE · BRANCH · BATCH",
  },
  {
    id: "senior",
    number: "04",
    eyebrow: "ASK WHAT MATTERS",
    title: "Ask a senior",
    description:
      "Ask what the brochure never tells you and get straight answers from someone who has been through it.",
    className: "home-feature-card--senior",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M8 10.5A4.5 4.5 0 0 1 12.5 6h23a4.5 4.5 0 0 1 4.5 4.5v17a4.5 4.5 0 0 1-4.5 4.5H22l-9 6v-6a5 5 0 0 1-5-5v-16.5Z" />
        <path d="M20 17.5a4.3 4.3 0 1 1 7.4 3c-1.5 1.6-3.4 2.2-3.4 4.5M24 29v.1" />
      </svg>
    ),
    detail: "ANSWERS FROM EXPERIENCE",
  },
];

function FeatureIcon({ children }) {
  return <span className="home-feature-card__icon">{children}</span>;
}

export default function HomeFeatures({ className = "" }) {
  return (
    <section
      className={`home-features ${className}`.trim()}
      aria-labelledby="home-features-title"
      data-solid
    >
      <div className="home-features__inner">
        <header className="home-features__header">
          <p className="home-features__eyebrow">BUILT AROUND THE REAL STORY</p>
          <h2 id="home-features-title" className="home-features__title">
            Everything you’d ask a senior, <span>in one place.</span>
          </h2>
          <p className="home-features__description">
            Less guessing. More first-hand insight into the college life ahead.
          </p>
        </header>

        <div className="home-features__grid">
          {FEATURES.map((feature) => (
            <Card
              as="article"
              key={feature.id}
              className={`home-feature-card ${feature.className}`}
            >
              <div className="home-feature-card__topline">
                <span className="home-feature-card__number">{feature.number}</span>
                <FeatureIcon>{feature.icon}</FeatureIcon>
              </div>

              <div className="home-feature-card__content">
                <p className="home-feature-card__eyebrow">{feature.eyebrow}</p>
                <h3 className="home-feature-card__title">{feature.title}</h3>
                <p className="home-feature-card__description">{feature.description}</p>
              </div>

              <div className="home-feature-card__footer">
                <span>{feature.detail}</span>
                <span className="home-feature-card__accent" aria-hidden="true">↗</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
