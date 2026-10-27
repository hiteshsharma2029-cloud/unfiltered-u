import { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { CATS, TOPICS } from "./reviewConstants";
import { saveUser } from "./reviewApi";
import { Rate } from "./Stars";

const STEP_NAMES = [
  "Confirm your college",
  "Rate your experience",
  "Write the review",
  "Add useful details",
  "Confirm authenticity",
];

function Field({ id, label, error, count, max, children }) {
  return (
    <div className="review-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {max ? <div className="review-field__count">{count}/{max}</div> : null}
      {error ? <div className="review-error" role="alert">{error}</div> : null}
    </div>
  );
}

function VerifyCollege({ setUser }) {
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const canVerify = name.trim().length >= 2 && college.trim().length >= 2;

  const verify = () => {
    if (!canVerify) return;
    const user = {
      uid: `u${Date.now()}`,
      name: name.trim(),
      college: college.trim(),
      collegeId: college.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      status: "verified",
    };
    saveUser(user);
    setUser(user);
  };

  return (
    <Card className="review-card review-verification-card">
      <p className="review-kicker">Account check</p>
      <h3>Verification required</h3>
      <p>
        You can only review the college tied to your verified account. In production, this should be checked by an approved college email domain or a manual/enrollment verification workflow stored in a backend-controlled profile.
      </p>
      <div className="review-note">
        Prototype only: this form stands in for that workflow. It does not independently verify your enrollment.
      </div>
      <Field id="review-verify-name" label="Your name">
        <Input id="review-verify-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={60} autoComplete="name" className="review-input" />
      </Field>
      <Field id="review-verify-college" label="Your college">
        <Input id="review-verify-college" value={college} onChange={(event) => setCollege(event.target.value)} maxLength={100} autoComplete="organization" className="review-input" />
      </Field>
      <Button type="button" className="review-action review-action--primary" disabled={!canVerify} onClick={verify}>
        Verify (prototype)
      </Button>
    </Card>
  );
}

export default function ReviewForm({ user, setUser, data, setData, onPreview }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const update = (key, value) => setData((previous) => ({ ...previous, [key]: value }));

  const textField = (key, label, options = {}, control = "input") => {
    const fieldOptions = options.field || {};
    const inputOptions = options.input || {};
    const common = {
      id: key,
      value: data[key] ?? "",
      onChange: (event) => update(key, event.target.value),
      className: "review-input",
      ...inputOptions,
    };

    return (
      <Field key={key} id={key} label={label} {...fieldOptions}>
        {control === "textarea" ? <textarea {...common} /> : <Input {...common} />}
      </Field>
    );
  };

  const validate = (stepToValidate) => {
    const nextErrors = {};

    if (stepToValidate === 0 && user?.status !== "verified") {
      nextErrors.college = "Verify your college to continue.";
    }
    if (stepToValidate === 1 && !data.ratings.overall) {
      nextErrors.overall = "An overall rating is required.";
    }
    if (stepToValidate === 2) {
      if (!data.topic) nextErrors.topic = "Choose the main topic of your review.";
      if (data.title.trim().length < 5) nextErrors.title = "Add a title (at least 5 characters).";
      if (data.experience.trim().length < 50) nextErrors.experience = "Please write at least 50 characters.";
    }
    if (stepToValidate === 4 && !data.confirm) {
      nextErrors.confirm = "Please confirm to continue.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    if (step === STEP_NAMES.length - 1) onPreview();
    else setStep((previous) => previous + 1);
  };

  return (
    <section className="review-section" id="form">
      <div className="uu-container review-container review-form-container">
        <div className="review-section__intro">
          <p className="review-kicker">Step {step + 1} of {STEP_NAMES.length}</p>
          <h2>{STEP_NAMES[step]}</h2>
        </div>

        <div className="review-progress" aria-label={`Step ${step + 1} of ${STEP_NAMES.length}`}>
          {STEP_NAMES.map((name, index) => (
            <span key={name} className={index <= step ? "is-complete" : ""} />
          ))}
        </div>

        {step === 0 && (user?.status === "verified" ? (
          <Card className="review-card review-verified-card">
            <p className="review-kicker">Verified college</p>
            <h3>{user.college}</h3>
            <p className="review-no-margin">Reviews can only be submitted for this college.</p>
          </Card>
        ) : <VerifyCollege setUser={setUser} />)}
        {errors.college && <div className="review-error" role="alert">{errors.college}</div>}

        {step === 1 && (
          <Card className="review-card review-rating-card">
            <p className="review-card__hint">Overall is required; the other category ratings are optional.</p>
            {CATS.map(([key, label]) => (
              <Rate
                key={key}
                label={label}
                required={key === "overall"}
                value={data.ratings[key] || 0}
                onChange={(rating) => update("ratings", { ...data.ratings, [key]: rating })}
              />
            ))}
            {errors.overall && <div className="review-error" role="alert">{errors.overall}</div>}
          </Card>
        )}

        {step === 2 && (
          <Card className="review-card review-form-card">
            <Field id="topic" label="Main topic of this review" error={errors.topic}>
              <select id="topic" className="review-input" value={data.topic} onChange={(event) => update("topic", event.target.value)}>
                <option value="">Select a topic…</option>
                {TOPICS.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
              </select>
            </Field>
            {textField("title", "Review title", { field: { error: errors.title, count: data.title.length, max: 120 }, input: { maxLength: 120, placeholder: "Summarize your experience in one sentence" } })}
            {textField("liked", "What did you like?", { field: { count: data.liked.length, max: 800 }, input: { maxLength: 800, placeholder: "Share what worked well for you..." } }, "textarea")}
            {textField("improvements", "What could be improved?", { field: { count: data.improvements.length, max: 800 }, input: { maxLength: 800, placeholder: "What should future students know or consider?" } }, "textarea")}
            {textField("experience", "Your overall experience", { field: { error: errors.experience, count: data.experience.length, max: 3000 }, input: { maxLength: 3000, style: { minHeight: 160 }, placeholder: "Describe your genuine experience at your college..." } }, "textarea")}
          </Card>
        )}

        {step === 3 && (
          <Card className="review-card review-form-card">
            <p className="review-card__hint">All fields here are optional. Please don’t include ID numbers or private details.</p>
            <div className="review-grid-two">
              {textField("course", "Course or program", { input: { maxLength: 60 } })}
              {textField("department", "Department", { input: { maxLength: 60 } })}
              {textField("year", "Study year or graduation year", { input: { maxLength: 60 } })}
            </div>
            {textField("hostel", "Hostel experience", { input: { maxLength: 500, style: { minHeight: 76 } } }, "textarea")}
            {textField("food", "Food and mess experience", { input: { maxLength: 500, style: { minHeight: 76 } } }, "textarea")}
            {textField("facilities", "Campus facilities", { input: { maxLength: 500, style: { minHeight: 76 } } }, "textarea")}
          </Card>
        )}

        {step === 4 && (
          <Card className="review-card review-confirm-card">
            <label className="review-confirm-label" htmlFor="review-confirm">
              <input
                id="review-confirm"
                type="checkbox"
                checked={data.confirm}
                onChange={(event) => update("confirm", event.target.checked)}
              />
              <span>I confirm that this review reflects my genuine experience with the college selected for my verified account.</span>
            </label>
            <p className="review-card__hint">Please keep your review honest, respectful, and based on your own experience. Do not share private information about other people.</p>
            {errors.confirm && <div className="review-error" role="alert">{errors.confirm}</div>}
          </Card>
        )}

        <div className="review-actions-row">
          <Button
            type="button"
            className="review-action review-action--secondary"
            disabled={step === 0}
            onClick={() => setStep((previous) => Math.max(0, previous - 1))}
          >
            Back
          </Button>
          <Button type="button" className="review-action review-action--primary" onClick={next}>
            {step === STEP_NAMES.length - 1 ? "Preview review" : "Continue"}
          </Button>
        </div>
      </div>
    </section>
  );
}
