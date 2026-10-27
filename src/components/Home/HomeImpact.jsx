import Card from "../ui/Card";
import "./HomeImpact.css";

const BENEFITS = [
  "Helps students avoid costly surprises before they commit to a college.",
  "Gives seniors a place to pass on what they learned the hard way.",
  "Keeps information current, so today’s students are not judged by last decade’s reviews.",
];

const AUDIENCES = [
  {
    title: "Upcoming freshers",
    description: "Just finished 12th and deciding where to go.",
  },
  {
    title: "College students",
    description: "Looking for peers, groups and straight answers.",
  },
  {
    title: "Seniors and alumni",
    description: "Ready to share what they wish they had known.",
  },
];

export default function HomeImpact() {
  return (
    <section className="home-impact" aria-labelledby="home-impact-title">
      <div className="home-impact__inner">
        <header className="home-impact__header">
          <p className="home-impact__eyebrow">Why it matters</p>
          <h2 className="home-impact__title" id="home-impact-title">
            Built so no student has to choose blind.
          </h2>
          <p className="home-impact__lead" data-solid>
            Too often a college is chosen from brochures, rankings and whoever
            you happen to know. Students without a senior to ask, from smaller
            towns, from first-generation families, from schools with no alumni
            network, end up guessing. UNFILTERED U puts honest, first-hand
            experience in front of every student who needs it.
          </p>
        </header>

        <div className="home-impact__grid">
          <Card as="article" className="home-impact__card home-impact__card--benefits">
            <p className="home-impact__card-label">The difference</p>
            <h3 className="home-impact__card-title">How it helps</h3>
            <ul className="home-impact__benefits">
              {BENEFITS.map((benefit, index) => (
                <li className="home-impact__benefit" key={benefit}>
                  <span className="home-impact__check" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card as="article" className="home-impact__card home-impact__card--audience">
            <p className="home-impact__card-label">Made for every stage</p>
            <h3 className="home-impact__card-title">Who we’re building for</h3>
            <ul className="home-impact__audiences">
              {AUDIENCES.map((audience, index) => (
                <li className="home-impact__audience" key={audience.title}>
                  <span className="home-impact__audience-index" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <div className="home-impact__audience-copy">
                    <h4>{audience.title}</h4>
                    <p>{audience.description}</p>
                  </div>
                  <span className="home-impact__arrow" aria-hidden="true">↗</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}
