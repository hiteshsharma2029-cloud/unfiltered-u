import Card from "../ui/Card";

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  );
}

function MaskIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 9c0-2 2-3 4-3h10c2 0 4 1 4 3v2c0 4-3 7-9 7s-9-3-9-7z" />
      <path d="M7 11h3M14 11h3" />
    </svg>
  );
}

function IdentityOption({ selected, onPick, Icon, title, lines, actionLabel }) {
  return (
    <Card className={`review-card review-identity-card${selected ? " is-selected" : ""}`}>
      <button
        type="button"
        className="review-identity-card__select"
        aria-pressed={selected}
        onClick={onPick}
      >
        <Icon />
        <span className="review-identity-card__title">{title}</span>
        <span className="review-identity-card__lines">
          {lines.map((line) => <span key={line}>{line}</span>)}
        </span>
        <span className="review-identity-card__action">
          <span className="review-action review-action--secondary" aria-hidden="true">
            {actionLabel}
          </span>
        </span>
      </button>
    </Card>
  );
}

export default function Identity({ user, selected, onPick }) {
  const displayName = user?.status === "verified" ? user.name : "Your verified profile name";

  return (
    <section className="review-section" id="write">
      <div className="uu-container review-container">
        <div className="review-section__intro">
          <p className="review-kicker">Your contribution</p>
          <h2>Your voice. Your choice.</h2>
          <p>Choose how your experience will appear to other students.</p>
        </div>

        <div className="review-identity-grid" role="group" aria-label="Publication identity">
          <IdentityOption
            selected={selected === "name"}
            onPick={() => onPick("name")}
            Icon={UserIcon}
            title="Publish with your name"
            lines={[
              `Appears as: ${displayName}`,
              "Your review is associated with your profile; your identity is visible with it.",
            ]}
            actionLabel="Continue with my name"
          />
          <IdentityOption
            selected={selected === "anon"}
            onPick={() => onPick("anon")}
            Icon={MaskIcon}
            title="Publish anonymously"
            lines={[
              "Appears as: Anonymous Student",
              "Your name is hidden publicly. The platform can still identify the account internally for verification, moderation, and abuse prevention.",
            ]}
            actionLabel="Continue anonymously"
          />
        </div>
      </div>
    </section>
  );
}
