import Card from "../ui/Card";
import Button from "../ui/Button";
import ReviewBody from "./ReviewBody";

export function Preview({ user, data, anonymous, busy, error, onEdit, onSubmit }) {
  const review = {
    title: data.title,
    topic: data.topic,
    overallRating: data.ratings.overall,
    categoryRatings: Object.fromEntries(
      Object.entries(data.ratings).filter(([key, value]) => key !== "overall" && value)
    ),
  };
  const extra = [data.course, data.department, data.year].filter(Boolean).join(" · ");

  return (
    <section className="review-section" id="preview">
      <div className="uu-container review-container">
        <div className="review-section__intro">
          <p className="review-kicker">One last check</p>
          <h2>Review & submit</h2>
          <p>This is how your review will appear publicly.</p>
        </div>

        <Card className="review-card review-preview-card">
          <p className="review-preview-card__college">{user.college}</p>
          <ReviewBody review={review} />
          {data.liked && <p><strong>Liked:</strong> {data.liked}</p>}
          {data.improvements && <p><strong>Could be improved:</strong> {data.improvements}</p>}
          <p className="review-preserve-lines">{data.experience}</p>
          {[["Hostel", data.hostel], ["Food & mess", data.food], ["Facilities", data.facilities]]
            .filter(([, value]) => value)
            .map(([label, value]) => <p key={label}><strong>{label}:</strong> {value}</p>)}
          {extra && <p className="review-muted">{extra}</p>}
          <p className="review-preview-card__author">— {anonymous ? "Anonymous Student" : user.name}</p>
        </Card>

        {error && <div className="review-error" role="alert">{error}</div>}
        <div className="review-actions-row">
          <Button type="button" className="review-action review-action--secondary" onClick={onEdit} disabled={busy}>
            Edit review
          </Button>
          <Button type="button" className="review-action review-action--primary" onClick={onSubmit} disabled={busy}>
            {busy ? "Submitting…" : "Submit review"}
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Done({ status, onAgain }) {
  return (
    <section className="review-section" aria-live="polite">
      <div className="uu-container review-container">
        <Card className="review-card review-done-card">
          <span className="review-done-card__icon" aria-hidden="true">✓</span>
          <p className="review-kicker">Thank you for contributing</p>
          <h2>Your experience has been recorded.</h2>
          <p>Honest student experiences help build a more informed college community.</p>
          <p className="review-muted">
            Status: {status === "pending"
              ? "Submitted for moderation — it will appear in the feed once approved."
              : status}
          </p>
          <div className="review-actions-row">
            <Button type="button" className="review-action review-action--primary" onClick={onAgain}>
              Back to reviews
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
