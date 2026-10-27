import { useState } from "react";
import Card from "../ui/Card";
import "./HomeFlowChart.css";

const STEPS = {
  eyebrow: "How it works",
  title: "Five steps from “I don’t know” to “I’m sure”.",
  hint: "Select a step to see what happens.",
  items: [
    {
      id: 1,
      label: "Sign up",
      text: "You tell us whether you are an upcoming fresher or a college student, plus a few basics. Everything you see afterwards is tailored to that.",
    },
    {
      id: 2,
      label: "Explore reviews",
      text: "You read honest reviews from seniors, filtered by college, topic and how recent they are, so you can compare colleges on what actually matters.",
    },
    {
      id: 3,
      label: "Join groups",
      text: "You step into groups for your college, branch or batch, where you can ask questions and hear real experiences from people like you.",
    },
    {
      id: 4,
      label: "Ask a senior",
      text: "You send your own question to seniors who have been through it. The answers come from experience, not from marketing.",
    },
    {
      id: 5,
      label: "Choose with confidence",
      text: "With the full picture in hand you make your decision, and later you pass your own honest review forward to the next student.",
    },
  ],
};

export default function HomeFlowChart({ className = "" }) {
  const [activeStep, setActiveStep] = useState(1);
  const currentStep = STEPS.items.find((step) => step.id === activeStep) ?? STEPS.items[0];

  return (
    <section
      className={`home-flow ${className}`.trim()}
      aria-labelledby="home-flow-title"
      data-solid
    >
      <header className="home-flow__header">
        <p className="home-flow__eyebrow">{STEPS.eyebrow}</p>
        <h2 className="home-flow__title" id="home-flow-title">
          {STEPS.title}
        </h2>
        <p className="home-flow__hint">{STEPS.hint}</p>
      </header>

      <ol className="home-flow__steps" aria-label="How UnfilteredU works">
        {STEPS.items.map((step) => {
          const state =
            step.id === activeStep
              ? "active"
              : step.id < activeStep
                ? "done"
                : "upcoming";

          return (
            <li
              className={`home-flow__step home-flow__step--${state}`}
              key={step.id}
            >
              <button
                className="home-flow__step-button"
                type="button"
                aria-pressed={step.id === activeStep}
                aria-controls="home-flow-detail"
                onClick={() => setActiveStep(step.id)}
              >
                <span className="home-flow__number" aria-hidden="true">
                  {state === "done" ? (
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path
                        d="m4.5 10.2 3.4 3.3 7.6-7.4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    String(step.id).padStart(2, "0")
                  )}
                </span>
                <span className="home-flow__step-label">{step.label}</span>
                <span className="home-flow__step-state" aria-hidden="true">
                  {state === "active" ? "Selected" : state === "done" ? "Completed" : "Step"}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <Card
        as="div"
        className="home-flow__detail"
        id="home-flow-detail"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="home-flow__detail-marker" aria-hidden="true">
          <span>{String(currentStep.id).padStart(2, "0")}</span>
          <span className="home-flow__detail-line" />
        </div>

        <div className="home-flow__detail-copy" key={currentStep.id}>
          <p className="home-flow__detail-kicker">STEP {currentStep.id} OF {STEPS.items.length}</p>
          <h3>{currentStep.label}</h3>
          <p className="home-flow__description">{currentStep.text}</p>
        </div>

        <div className="home-flow__detail-navigation" aria-label="Step navigation">
          <button
            type="button"
            className="home-flow__arrow"
            aria-label="Previous step"
            disabled={activeStep === 1}
            onClick={() => setActiveStep((step) => Math.max(1, step - 1))}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5m0 0 7-7m-7 7 7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="home-flow__progress-label">
            {String(activeStep).padStart(2, "0")} <span>/</span> {String(STEPS.items.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            className="home-flow__arrow"
            aria-label="Next step"
            disabled={activeStep === STEPS.items.length}
            onClick={() => setActiveStep((step) => Math.min(STEPS.items.length, step + 1))}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14m0 0-7-7m7 7-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </Card>
    </section>
  );
}
