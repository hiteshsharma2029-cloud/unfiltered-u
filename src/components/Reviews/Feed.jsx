import { useEffect, useMemo, useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { TOPICS, go } from "./reviewConstants";
import { approvePending, listPublic } from "./reviewApi";
import ReviewBody from "./ReviewBody";
import ExternalSummary from "./ExternalSummary";

function UniversitySelect({ options, value, onChange }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const matches = options.filter((option) => option.name.toLowerCase().includes(query.toLowerCase()));

  const choose = (option) => {
    onChange(option);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="review-combobox">
      <label htmlFor="review-university">University</label>
      <Input
        id="review-university"
        className="review-input"
        role="combobox"
        aria-expanded={open}
        aria-controls="review-university-options"
        autoComplete="off"
        placeholder={value ? value.name : "All universities"}
        value={open ? query : value ? value.name : ""}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
          if (event.key === "Enter" && open && matches.length === 1) {
            event.preventDefault();
            choose(matches[0]);
          }
        }}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
      />
      {open && (
        <div className="review-combobox__list" id="review-university-options" role="listbox">
          <button type="button" role="option" aria-selected={!value} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(null)}>
            All universities
          </button>
          {matches.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={value?.id === option.id}
              key={option.id}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(option)}
            >
              {option.name}
            </button>
          ))}
          {!matches.length && <p className="review-combobox__empty">No matching university</p>}
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const longExperience = (review.experience || "").length > 260;
  const extra = [review.course, review.department, review.studyYear].filter(Boolean).join(" · ");
  const created = new Date(review.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="review-card review-feed-card">
      <article>
        <div className="review-feed-card__meta">
          <span>{review.collegeName}</span>
          <time dateTime={new Date(review.createdAt).toISOString()}>{created}</time>
        </div>
        <ReviewBody review={review} />
        <p className="review-preserve-lines review-feed-card__experience">
          {expanded || !longExperience
            ? review.experience
            : `${review.experience.slice(0, 260).trimEnd()}…`}
        </p>
        {longExperience && (
          <Button
            type="button"
            className="review-text-button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : "Read more"}
          </Button>
        )}
        {expanded && review.liked && <p><strong>Liked:</strong> {review.liked}</p>}
        {expanded && review.improvements && <p><strong>Could be improved:</strong> {review.improvements}</p>}
        <p className="review-muted review-feed-card__footer">
          {extra ? `${extra} · ` : ""}{review.authorName}
        </p>
      </article>
    </Card>
  );
}

const SORTS = {
  new: (a, b) => b.createdAt - a.createdAt,
  old: (a, b) => a.createdAt - b.createdAt,
  hi: (a, b) => b.overallRating - a.overallRating || b.createdAt - a.createdAt,
  lo: (a, b) => a.overallRating - b.overallRating || b.createdAt - a.createdAt,
};

export default function Feed({ reload }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(false);
  const [university, setUniversity] = useState(null);
  const [topic, setTopic] = useState("");
  const [sort, setSort] = useState("new");

  const load = () => {
    setRows(null);
    setError(false);
    listPublic().then(setRows).catch(() => setError(true));
  };

  useEffect(() => { load(); }, [reload]); // reload after a new submission

  const universities = useMemo(() => {
    const map = new Map();
    (rows || []).forEach((review) => map.set(review.collegeId, review.collegeName));
    return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [rows]);

  const shown = useMemo(
    () => (rows || [])
      .filter((review) => (!university || review.collegeId === university.id) && (!topic || review.topic === topic))
      .sort(SORTS[sort]),
    [rows, university, topic, sort]
  );

  const resetFilters = () => {
    setUniversity(null);
    setTopic("");
    setSort("new");
  };

  return (
    <section className="review-section" id="reviews">
      <div className="uu-container review-container">
        <div className="review-section__intro">
          <p className="review-kicker">Student voices</p>
          <h2>Published reviews</h2>
          <p>Browse approved student reviews. No account is needed to read them.</p>
        </div>

        <div className="review-note">
          Prototype: reviews currently load from this browser’s local storage, not a live database.
        </div>

        <div className="review-filters">
          <UniversitySelect options={universities} value={university} onChange={setUniversity} />
          <div className="review-field">
            <label htmlFor="review-topic-filter">Topic</label>
            <select id="review-topic-filter" className="review-input" value={topic} onChange={(event) => setTopic(event.target.value)}>
              <option value="">All topics</option>
              {TOPICS.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>
          <div className="review-field">
            <label htmlFor="review-sort">Sort</label>
            <select id="review-sort" className="review-input" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
              <option value="hi">Highest rated</option>
              <option value="lo">Lowest rated</option>
            </select>
          </div>
          <Button type="button" className="review-action review-action--secondary review-filter-reset" onClick={resetFilters}>
            Reset filters
          </Button>
        </div>

        <ExternalSummary university={university ? university.name : ""} topic={topic} />

        {rows && !error && (
          <p className="review-result-count" aria-live="polite">
            {shown.length} of {rows.length} published review{rows.length === 1 ? "" : "s"} · {university ? university.name : "All universities"} · {topic || "All topics"}
          </p>
        )}
        {error && (
          <Card className="review-card review-empty-state">
            <p className="review-error">Couldn’t load reviews.</p>
            <Button type="button" className="review-action review-action--primary" onClick={load}>Retry</Button>
          </Card>
        )}
        {!rows && !error && Array.from({ length: 3 }, (_, index) => <div className="review-skeleton" key={index} />)}
        {rows && !error && rows.length === 0 && (
          <Card className="review-card review-empty-state">
            <h3>No published reviews yet</h3>
            <p>Be the first to share your genuine experience.</p>
            <Button type="button" className="review-action review-action--primary" onClick={() => go("write")}>Write a review</Button>
          </Card>
        )}
        {rows && !error && rows.length > 0 && shown.length === 0 && (
          <Card className="review-card review-empty-state">
            <h3>No matches</h3>
            <p>No published reviews match the selected university and topic.</p>
            <Button type="button" className="review-action review-action--primary" onClick={resetFilters}>Reset filters</Button>
          </Card>
        )}
        {shown.map((review) => <ReviewCard key={review.reviewId} review={review} />)}

        <p className="review-prototype-tool">
          Prototype tool: {" "}
          <Button type="button" className="review-text-button" onClick={() => { approvePending(); load(); }}>
            simulate moderator approval of pending reviews
          </Button>
        </p>
      </div>
    </section>
  );
}
