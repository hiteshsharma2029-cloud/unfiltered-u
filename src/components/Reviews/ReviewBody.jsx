import { CATS } from "./reviewConstants";
import { StaticStars } from "./Stars";

export default function ReviewBody({ review }) {
  const categoryRatings = review.categoryRatings || {};

  return (
    <div className="review-body">
      <div className="review-meta">
        <span className="review-tag">{review.topic}</span>
      </div>
      <h3 className="review-body__title">{review.title}</h3>
      <StaticStars value={review.overallRating} />

      {Object.keys(categoryRatings).length > 0 && (
        <div className="review-body__categories">
          {CATS.filter(([key]) => categoryRatings[key]).map(([key, label]) => (
            <div key={key} className="review-rating-row review-rating-row--static">
              <span className="review-rating-row__label">{label}</span>
              <StaticStars value={categoryRatings[key]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
