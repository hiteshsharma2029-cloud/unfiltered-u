import { useEffect, useMemo, useRef, useState } from "react";
import { FLOW } from "./reviewConstants";

const PATH = "M40 150 C 130 30, 210 30, 270 110 S 400 200, 500 110 S 640 20, 720 100 S 880 190, 960 90";

export default function Flowchart() {
  const pathRef = useRef(null);
  const boxRef = useRef(null);
  const reduceMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const [progress, setProgress] = useState(reduceMotion ? 1 : 0);
  const [points, setPoints] = useState([]);
  const [pathLength, setPathLength] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    setPathLength(length);
    setPoints(
      FLOW.map((_, index) => {
        const point = path.getPointAtLength((length * index) / (FLOW.length - 1));
        return [point.x, point.y];
      })
    );
  }, []);

  useEffect(() => {
    const node = boxRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.25 });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || !isVisible) return undefined;

    const cycleDuration = 15000;
    const pauseDuration = 3000;
    const startedAt = performance.now();
    let frame = 0;

    const tick = (now) => {
      const next = Math.min(1, ((now - startedAt) % (cycleDuration + pauseDuration)) / cycleDuration);
      setProgress((previous) => (Math.abs(previous - next) > 0.012 ? next : previous));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, reduceMotion]);

  const marker = pathRef.current && pathLength > 1
    ? pathRef.current.getPointAtLength(pathLength * progress)
    : { x: 40, y: 150 };
  const swing = reduceMotion ? 0 : Math.sin((progress * pathLength) / 9) * 22;

  return (
    <section className="review-section review-flow-section" id="how">
      <div className="uu-container review-container review-flow" ref={boxRef}>
        <div className="review-section__intro">
          <p className="review-kicker">The process</p>
          <h2>How it works</h2>
          <p>Six steps from your experience to a student’s decision.</p>
        </div>

        <div className="review-flow__diagram">
          <svg viewBox="0 0 1000 230" role="img" aria-label="Animated path showing the six steps of submitting a review">
            <path d={PATH} fill="none" stroke="var(--uu-border, rgba(185,194,230,.2))" strokeWidth="1.5" strokeDasharray="4 6" />
            <path
              ref={pathRef}
              d={PATH}
              fill="none"
              stroke="var(--uu-accent-strong, #a69aff)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength * (1 - progress)}
            />
            {points.map(([x, y], index) => (
              <g
                key={index}
                style={{ opacity: progress >= index / (FLOW.length - 1) - 0.001 ? 1 : 0.35, transition: "opacity .5s" }}
              >
                <circle cx={x} cy={y} r="15" fill="var(--uu-bg-soft, #0e1322)" stroke="var(--uu-text, #f4f6ff)" strokeWidth="1.5" />
                <text x={x} y={y + 5} textAnchor="middle" fill="var(--uu-text, #f4f6ff)" fontSize="13" fontWeight="600">
                  {`0${index + 1}`}
                </text>
              </g>
            ))}
            <g transform={`translate(${marker.x},${marker.y - 26})`} stroke="var(--uu-text, #f4f6ff)" strokeWidth="2.2" strokeLinecap="round" fill="none">
              <circle cy="-22" r="6" fill="var(--uu-bg-soft, #0e1322)" />
              <line y1="-16" y2="-2" />
              <line y1="-12" x2={swing * 0.5} y2="-4" />
              <line y1="-12" x2={-swing * 0.5} y2="-4" />
              <line y1="-2" x2={swing * 0.45} y2="14" />
              <line y1="-2" x2={-swing * 0.45} y2="14" />
            </g>
          </svg>
        </div>

        <div className="review-flow__steps">
          {FLOW.map(([heading, description], index) => (
            <article key={heading} className={`review-flow-step${progress >= index / (FLOW.length - 1) - 0.001 ? " is-active" : ""}`}>
              <span className="review-flow-step__number">{`0${index + 1}`}</span>
              <h3>{heading}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
