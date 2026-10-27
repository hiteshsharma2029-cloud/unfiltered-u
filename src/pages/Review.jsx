
import { useState } from "react";
import "./Review.css";

import ReviewHero from "../components/Hero/ReviewHero";
import Flowchart from "../components/Reviews/Flowchart";
import Identity from "../components/Reviews/Identity";
import ReviewForm from "../components/Reviews/ReviewForm";
import { Done, Preview } from "../components/Reviews/Preview";
import Feed from "../components/Reviews/Feed";
import { BLANK, go } from "../components/Reviews/reviewConstants";
import {
  getUser,
  saveUser,
  submitReview,
} from "../components/Reviews/reviewApi";


export default function Review({ user: accessUser }) {
  const canWrite = accessUser?.role === "verifiedStudent";

  const [user, setUserState] = useState(getUser);
  const [identity, setIdentity] = useState(null);
  const [data, setData] = useState(() => ({
    ...BLANK,
    ratings: { ...BLANK.ratings },
  }));
  const [phase, setPhase] = useState("form");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [reload, setReload] = useState(0);

  const setUser = (nextUser) => {
    saveUser(nextUser);
    setUserState(nextUser);
  };

  const pickIdentity = (nextIdentity) => {
    setIdentity(nextIdentity);
    window.setTimeout(() => go("form"), 80);
  };

  const submit = async () => {
    if (!canWrite) {
      setError("Only verified Chitkara students can submit reviews.");
      return;
    }

    if (busy) return;

    setBusy(true);
    setError("");

    try {
      const published = await submitReview(
        { ...data, anonymous: identity === "anon" },
        user
      );

      setStatus(published.moderationStatus);
      setPhase("done");
      setReload((value) => value + 1);
      window.setTimeout(() => go("write"), 50);
    } catch (submissionError) {
      setError(
        submissionError?.message || "Submission failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  const startAgain = () => {
    setData({ ...BLANK, ratings: { ...BLANK.ratings } });
    setIdentity(null);
    setPhase("form");
    setError("");
    go("reviews");
  };

  return (
    <div className="uu-reviews">
      <div className="uu-reviews__main">
        <ReviewHero />
        <Flowchart />

        {!canWrite && (
          <section
            className="uu-review-access-note"
            role="status"
            style={{
              margin: "24px 0",
              padding: "20px 22px",
              border: "1px solid var(--uu-border, rgba(255,255,255,.16))",
              borderRadius: "var(--uu-radius-lg, 16px)",
              background: "var(--uu-surface, rgba(255,255,255,.05))",
              color: "var(--uu-text, inherit)",
            }}
          >
            <h2 style={{ margin: "0 0 8px" }}>Read-only access</h2>
            <p style={{ margin: 0, lineHeight: 1.65 }}>
              You can read published reviews below. Only verified Chitkara
              students can write and submit a review.
            </p>
          </section>
        )}

        {canWrite && (
          <Identity
            user={user}
            selected={identity}
            onPick={pickIdentity}
          />
        )}

        {canWrite && identity && phase === "form" && (
          <ReviewForm
            user={user}
            setUser={setUser}
            data={data}
            setData={setData}
            onPreview={() => {
              setError("");
              setPhase("preview");
              window.setTimeout(() => go("preview"), 60);
            }}
          />
        )}

        {canWrite && identity && phase === "preview" && (
          <Preview
            user={user}
            data={data}
            anonymous={identity === "anon"}
            busy={busy}
            error={error}
            onSubmit={submit}
            onEdit={() => {
              setPhase("form");
              setError("");
            }}
          />
        )}

        {canWrite && phase === "done" && (
          <Done status={status} onAgain={startAgain} />
        )}

        <Feed reload={reload} />
      </div>
    </div>
  );
}
