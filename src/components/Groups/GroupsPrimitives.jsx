const TAB_ICONS = {
  create: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.8 20c.4-3.4 3-5.4 6.2-5.4s5.8 2 6.2 5.4M19 8v6M16 11h6" />
    </>
  ),
  saved: <path d="M6 4h12v16l-6-4-6 4z" />,
  received: (
    <>
      <path d="M4 13l2.5-7h11L20 13v6H4z" />
      <path d="M4 13h4.5l1 2h5l1-2H20" />
    </>
  ),
  sent: <path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />,
};

export function Icon2({ children, size = 18, stroke = 1.8 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function TabIcon({ name, size = 17, stroke = 1.8 }) {
  return (
    <Icon2 size={size} stroke={stroke}>
      {TAB_ICONS[name]}
    </Icon2>
  );
}

export function Identicon({ id, size = 52 }) {
  const value = Number.parseInt(id, 16) >>> 0;
  const mixed = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  const bits = (mixed ^ (mixed >>> 15)) >>> 0;
  const cells = [];

  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 3; x += 1) {
      if ((bits >>> (y * 3 + x)) & 1) {
        cells.push([x, y]);
        if (x < 2) cells.push([4 - x, y]);
      }
    }
  }

  return (
    <span
      className="ident"
      style={{ width: size, height: size, padding: Math.round(size * 0.2) }}
      aria-hidden="true"
    >
      <svg viewBox="-0.7 -0.7 6.4 6.4">
        {cells.map(([x, y], index) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="1"
            height="1"
            rx=".2"
            fill="currentColor"
            style={{ "--k": index }}
          />
        ))}
      </svg>
    </span>
  );
}

export function Empty({
  title = "Nothing here.",
  text = "You are caught up.",
  icon = "received",
}) {
  return (
    <div className="g-empty">
      <span className="g-empty-ring">
        <TabIcon name={icon} size={30} stroke={1.5} />
      </span>
      <p>{title}</p>
      {text && <small>{text}</small>}
    </div>
  );
}
