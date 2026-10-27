import "./Stars.css";

const STAR_PATH =
  "M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4 6.1 20.7l1.3-6.6L2.5 9.5l6.6-.8z";

function normalizeRating(input) {
  const number = Number(input) || 0;
  return Math.max(0, Math.min(5, number));
}

// Accept both `value` (new components) and `v` (legacy ReviewBody code).
export function StaticStars({ value, v }) {
  const rating = normalizeRating(value ?? v);

  return (
    <span
      className="review-stars uu-review-static-stars"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const number = index + 1;
        const filled = number <= rating;

        return (
          <svg
            key={number}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={filled ? "is-filled" : ""}
          >
            <path d={STAR_PATH} />
          </svg>
        );
      })}
    </span>
  );
}

export function Rate({ label, value = 0, onChange, required = false }) {
  const rating = normalizeRating(value);

  return (
    <div className="review-rating-row uu-review-rating-row">
      <span className="review-rating-row__label uu-review-rating-label">
        {label}
      </span>

      <span
        className="review-stars review-stars--interactive uu-review-star-control"
        role="radiogroup"
        aria-label={`Rate ${label}`}
      >
        {Array.from({ length: 5 }, (_, index) => {
          const number = index + 1;
          const selected = number <= rating;

          return (
            <button
              key={number}
              type="button"
              className={`review-star-button uu-review-star-button${selected ? " is-filled" : ""}`}
              role="radio"
              aria-checked={rating === number}
              aria-label={`${number} star${number === 1 ? "" : "s"} for ${label}`}
              onClick={() => {
                if (typeof onChange === "function") {
                  onChange(rating === number && !required ? 0 : number);
                }
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d={STAR_PATH} />
              </svg>
            </button>
          );
        })}
      </span>
    </div>
  );
}
