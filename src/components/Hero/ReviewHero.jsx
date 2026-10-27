import BaseHero from "./BaseHero";
import "./ReviewHero.css";

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (!section) return;

  const reduceMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  section.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}

export default function ReviewHero({
  onWriteReview,
  onHowItWorks,
  className = "",
}) {
  const handleWriteReview = () => {
    if (onWriteReview) {
      onWriteReview();
      return;
    }

    scrollToSection("write");
  };

  const handleHowItWorks = () => {
    if (onHowItWorks) {
      onHowItWorks();
      return;
    }

    scrollToSection("how");
  };

  return (
    <BaseHero
      className={`review-hero ${className}`.trim()}
      eyebrow="Because you deserve truth."
      title={
        <>
          Your experience.
          <br />
          Their clarity.
        </>
      }
      description="Every student has a story. Share your real college experience, help others see beyond the brochure, and make honest college information accessible to everyone."
    >
      <p className="review-hero__supporting">
        Real experiences. Honest perspectives. Better decisions.
      </p>

      <div className="review-hero__actions">
        <button
          type="button"
          className="review-hero__button review-hero__button--primary"
          onClick={handleWriteReview}
        >
          <span>Write a review</span>

          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>

        <button
          type="button"
          className="review-hero__button review-hero__button--secondary"
          onClick={handleHowItWorks}
        >
          <span>See how it works</span>

          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
      </div>
    </BaseHero>
  );
}