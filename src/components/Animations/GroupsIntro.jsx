
import { useEffect, useRef, useState } from "react";
import "./GroupsIntro.css";

const NET_CENTER = { x: 200, y: 200 };

const NET_IDS = [
  "a3f9c2e1",
  "7be40d95",
  "c18f6a2d",
  "5d92e7b0",
  "e4a1038c",
  "91c7bf56",
  "2f68d4ea",
  "b05a39c7",
  "48e1fd73",
  "d7c260a9",
];

const NET_RING = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;

  return {
    x: 200 + Math.cos(angle) * 150,
    y: 200 + Math.sin(angle) * 150,
    lx: 200 + Math.cos(angle) * 178,
    ly: 200 + Math.sin(angle) * 178 + 3,
    id: NET_IDS[i],
  };
});

const NET_INNER = Array.from({ length: 5 }, (_, i) => {
  const angle = (i / 5) * Math.PI * 2 - Math.PI / 2 + 0.3;

  return {
    x: 200 + Math.cos(angle) * 74,
    y: 200 + Math.sin(angle) * 74,
  };
});

const NET_LINES = [
  ...NET_INNER.map((node, i) => [
    NET_CENTER,
    node,
    0.25 + i * 0.07,
  ]),
  ...NET_INNER.map((node, i) => [
    node,
    NET_RING[i * 2],
    0.55 + i * 0.08,
  ]),
  ...NET_RING.map((node, i) => [
    NET_CENTER,
    node,
    0.5 + i * 0.06,
  ]),
  ...NET_RING.map((node, i) => [
    node,
    NET_RING[(i + 1) % 10],
    0.95 + i * 0.07,
  ]),
  ...NET_INNER.map((node, i) => [
    node,
    NET_INNER[(i + 2) % 5],
    0.85 + i * 0.07,
  ]),
];

export default function GroupsIntro({ onDone }) {
  const [stage, setStage] = useState(0);
  const onDoneRef = useRef(onDone);

  onDoneRef.current = onDone;

  useEffect(() => {
    const finish = () => onDoneRef.current?.();

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      finish();
      return undefined;
    }

    const timers = [
      window.setTimeout(() => setStage(1), 1500),
      window.setTimeout(() => setStage(2), 3400),
      window.setTimeout(finish, 4200),
    ];

    const onKey = (event) => {
      if (event.key === "Escape") finish();
    };

    window.addEventListener("keydown", onKey);

    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      className={`uu-groups-intro${
        stage >= 1 ? " s1" : ""
      }${stage >= 2 ? " s2" : ""}`}
      onClick={() => onDoneRef.current?.()}
      role="presentation"
    >
      <svg
        className="uu-gi-net"
        viewBox="0 0 400 400"
        aria-hidden="true"
      >
        {[0, 1, 2].map((k) => (
          <circle
            key={k}
            className="uu-gi-ripple"
            cx="200"
            cy="200"
            r="190"
            style={{ "--d": `${1 + k * 0.28}s` }}
          />
        ))}

        {NET_LINES.map(([a, b, delay], i) => (
          <line
            key={i}
            className="uu-gi-line"
            pathLength="1"
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            style={{ "--d": `${delay}s` }}
          />
        ))}

        {NET_INNER.map((node, i) => (
          <circle
            key={`inner-${i}`}
            className="uu-gi-node"
            cx={node.x}
            cy={node.y}
            r="3.4"
            style={{ "--d": `${0.2 + i * 0.07}s` }}
          />
        ))}

        {NET_RING.map((node, i) => (
          <g key={`ring-${i}`}>
            <circle
              className="uu-gi-node"
              cx={node.x}
              cy={node.y}
              r="4.6"
              style={{ "--d": `${0.4 + i * 0.06}s` }}
            />

            <text
              className="uu-gi-label"
              x={node.lx}
              y={node.ly}
              textAnchor="middle"
              style={{ "--d": `${1.1 + i * 0.07}s` }}
            >
              #{node.id.slice(0, 4)}
            </text>
          </g>
        ))}

        <circle
          className="uu-gi-node uu-gi-core"
          cx="200"
          cy="200"
          r="7"
        />
      </svg>

      <p className="uu-gi-text" aria-hidden="true">
        No names. Just{" "}
        <span className="uu-gi-script">people</span>.
      </p>

      <button
        type="button"
        className="uu-gi-skip"
        onClick={(event) => {
          event.stopPropagation();
          onDoneRef.current?.();
        }}
      >
        Skip
      </button>
    </div>
  );
}
