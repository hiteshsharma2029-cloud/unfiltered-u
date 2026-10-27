import { useEffect, useRef, useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { TOPICS } from "./reviewConstants";

const API_BASE = import.meta.env.VITE_API_BASE || "";
const EXTERNAL_TOPICS = TOPICS.filter((topic) => topic !== "Other");

async function callApi(path, options) {
  const response = await fetch(`${API_BASE}${path}`, options);
  let body = null;
  try {
    body = await response.json();
  } catch {
    // A non-JSON response normally means the service is unavailable or misconfigured.
  }
  return { response, body };
}

function Citations({ ids, sources }) {
  return ids
    .map((id) => sources.find((source) => source.id === id))
    .filter(Boolean)
    .map((source) => (
      <sup key={source.id}>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Source ${source.id}: ${source.domain}`}
        >
          [{source.id}]
        </a>
      </sup>
    ));
}

function SummaryPoints({ title, items = [], sources = [] }) {
  if (!items.length) return null;
  return (
    <div className="review-external__points">
      <h4>{title}</h4>
      <ul>
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>
            {item.text} <Citations ids={item.sources || []} sources={sources} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ExternalSummary({ university = "", topic = "" }) {
  const [name, setName] = useState(university);
  const [selectedTopic, setSelectedTopic] = useState(EXTERNAL_TOPICS.includes(topic) ? topic : "");
  const [configuration, setConfiguration] = useState(null); // null = checking; 'down' | backend response
  const [phase, setPhase] = useState("idle"); // idle | loading | ok | empty | error | limited
  const [result, setResult] = useState(null);
  const requestId = useRef(0);

  useEffect(() => { if (university) setName(university); }, [university]);
  useEffect(() => { if (EXTERNAL_TOPICS.includes(topic)) setSelectedTopic(topic); }, [topic]);
  useEffect(() => {
    requestId.current += 1;
    setPhase("idle");
    setResult(null);
  }, [name, selectedTopic]);

  useEffect(() => {
    let active = true;
    callApi("/api/external-summary/status")
      .then(({ response, body }) => {
        if (active) setConfiguration(response.ok && body ? body : "down");
      })
      .catch(() => { if (active) setConfiguration("down"); });
    return () => { active = false; };
  }, []);

  const run = async () => {
    const currentRequest = ++requestId.current;
    setPhase("loading");
    setResult(null);

    try {
      const { response, body } = await callApi("/api/external-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ university: name, topic: selectedTopic }),
      });

      if (currentRequest !== requestId.current) return;
      if (response.status === 503) {
        setConfiguration({ configured: false, missing: body?.missing || [] });
        setPhase("idle");
        return;
      }
      if (response.status === 429) {
        setPhase("limited");
        return;
      }
      if (!response.ok || !body) {
        setPhase("error");
        return;
      }

      setResult(body);
      setPhase(body.status === "ok" ? "ok" : "empty");
    } catch {
      if (currentRequest === requestId.current) setPhase("error");
    }
  };

  const ready = Boolean(configuration && configuration !== "down" && configuration.configured);
  const canRun = ready && name.trim().length >= 2 && selectedTopic && phase !== "loading";

  return (
    <Card className="review-card review-external">
      <div className="review-external__heading">
        <div>
          <p className="review-kicker">Beyond this platform</p>
          <h3>External reviews</h3>
        </div>
        <span className="review-tag">AI summary</span>
      </div>
      <p>
        Summarise what other public websites say about a university. This is separate from UNFILTERED U student reviews.
      </p>

      {configuration === "down" && (
        <div className="review-note">The external summary service can’t be reached right now.</div>
      )}
      {configuration && configuration !== "down" && !configuration.configured && (
        <div className="review-note">
          Not connected: this feature needs backend configuration{configuration.missing?.length ? ` (${configuration.missing.join(", ")})` : ""}. No results are shown until it is set up.
        </div>
      )}

      <div className="review-grid-two review-external__fields">
        <div className="review-field">
          <label htmlFor="external-university">University</label>
          <Input
            id="external-university"
            className="review-input"
            value={name}
            maxLength={100}
            onChange={(event) => setName(event.target.value)}
            placeholder="Type any university name"
          />
        </div>
        <div className="review-field">
          <label htmlFor="external-topic">Topic</label>
          <select id="external-topic" className="review-input" value={selectedTopic} onChange={(event) => setSelectedTopic(event.target.value)}>
            <option value="">Select a topic…</option>
            {EXTERNAL_TOPICS.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </div>
      </div>

      <Button type="button" className="review-action review-action--primary" onClick={run} disabled={!canRun}>
        {phase === "loading" ? "Searching & summarising…" : "Summarize external reviews"}
      </Button>

      <div className="review-external__results" aria-live="polite" aria-busy={phase === "loading"}>
        {phase === "loading" && <div className="review-skeleton" />}
        {phase === "error" && (
          <p className="review-error">
            Couldn’t generate a summary. Please try again.{" "}
            <Button type="button" className="review-text-button" onClick={run}>Retry</Button>
          </p>
        )}
        {phase === "limited" && <p className="review-error">Too many requests. Please wait a minute and try again.</p>}

        {phase === "empty" && result && (
          <div className="review-external__content">
            <p><strong>Not enough information.</strong> {result.evidenceNote}</p>
            {result.sources?.length > 0 && <p className="review-muted">Pages that were found (not summarised):</p>}
            {(result.sources || []).map((source) => (
              <a key={source.id} className="review-source-link" href={source.url} target="_blank" rel="noopener noreferrer">
                {source.domain} — {source.title}
              </a>
            ))}
          </div>
        )}

        {phase === "ok" && result && (
          <div className="review-external__content">
            <p className="review-muted">
              AI-generated summary of {(result.sources || []).length} external web sources for {result.university} · {result.topic}. It may contain errors and is not verified by UNFILTERED U. Check the original pages.
            </p>
            <p className="review-external__summary">{result.summary}</p>
            <SummaryPoints title="Common positives" items={result.positives || []} sources={result.sources || []} />
            <SummaryPoints title="Common complaints" items={result.complaints || []} sources={result.sources || []} />
            <SummaryPoints title="Conflicting opinions" items={result.conflicts || []} sources={result.sources || []} />
            {result.evidenceNote && <p className="review-muted">{result.evidenceNote}</p>}
            <h4>Sources</h4>
            {(result.sources || []).map((source) => (
              <a key={source.id} className="review-source-link" href={source.url} target="_blank" rel="noopener noreferrer">
                [{source.id}] {source.domain} — {source.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
