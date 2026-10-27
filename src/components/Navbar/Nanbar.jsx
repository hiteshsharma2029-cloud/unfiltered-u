import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import "./navbar.css";

export const NavContext = createContext(null);

const NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
    description: "Where it all starts: what UNFILTERED U is and how it works.",
  },
  {
    id: "reviews",
    label: "Reviews",
    description: "Honest reviews of colleges, written by their seniors.",
  },
  {
    id: "groups",
    label: "Your groups",
    description: "Chat with students from your college, branch and batch.",
  },
  {
    id: "login",
    label: "Login",
    description: "Sign in as an upcoming fresher or a college student.",
  },
  {
    id: "settings",
    label: "Settings",
    description: "Manage your profile and preferences.",
  },
];

const ICONS = {
  home: (
    <path d="M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5M10 20v-6h4v6" />
  ),
  reviews: (
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />
  ),
  groups: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.8 20c.4-3.4 3-5.4 6.2-5.4s5.8 2 6.2 5.4" />
      <circle cx="17.2" cy="9" r="2.5" />
      <path d="M17 14.2c2.4.1 4 1.8 4.3 4.6" />
    </>
  ),
  login: (
    <path d="M14 4h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-5M10 8l4 4-4 4M14 12H4" />
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 2.8v2.4M12 18.8v2.4M4.6 7.4l2 1.2M17.4 15.4l2 1.2M4.6 16.6l2-1.2M17.4 8.6l-2-1.2" />
    </>
  ),
};

function Icon({ name }) {
  return (
    <svg
      className="nav-icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

function NavbarWordmark() {
  return (
    <span className="wordmark" role="img" aria-label="UNFILTERED U">
      <span aria-hidden="true">U</span>
      <span className="script" aria-hidden="true">
        nfiltered
      </span>
      <span aria-hidden="true">U</span>
    </span>
  );
}

function NavItem({ item, active, onSelect, user }) {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);

  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);
  const touchTimerRef = useRef(null);
  const touchRef = useRef(false);
  const tooltipId = useId();

  useLayoutEffect(() => {
    if (!open || !buttonRef.current || !tooltipRef.current) {
      return;
    }

    const button = buttonRef.current.getBoundingClientRect();
    const tooltipWidth = tooltipRef.current.offsetWidth;
    const padding = 10;

    const left =
      button.left + button.width / 2 - tooltipWidth / 2;

    if (left < padding) {
      setShift(padding - left);
    } else if (left + tooltipWidth > window.innerWidth - padding) {
      setShift(
        window.innerWidth - padding - left - tooltipWidth
      );
    } else {
      setShift(0);
    }
  }, [open]);

  useEffect(() => {
    return () => clearTimeout(touchTimerRef.current);
  }, []);

  const handleClick = () => {
    onSelect(item.id);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    if (touchRef.current) {
      setOpen(true);
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = setTimeout(
        () => setOpen(false),
        2200
      );
    }
  };

  const tooltipDescription =
    item.id === "groups" && !user
      ? "Log in as a verified Chitkara student to access Groups."
      : item.id === "groups" &&
          user.role !== "verifiedStudent"
        ? "Groups is available only to verified Chitkara students."
        : item.description;

  return (
    <li
      className="nav-li"
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`nav-item ${active ? "is-active" : ""}`}
        aria-current={active ? "page" : undefined}
        aria-describedby={tooltipId}
        onPointerDown={(event) => {
          touchRef.current = event.pointerType === "touch";
        }}
        onClick={handleClick}
        onFocus={(event) => {
          if (event.target.matches(":focus-visible")) {
            setOpen(true);
          }
        }}
        onBlur={() => setOpen(false)}
      >
        <Icon name={item.id} />
        <span className="nav-label">{item.label}</span>
      </button>

      <div
        ref={tooltipRef}
        id={tooltipId}
        role="tooltip"
        className={`nav-tip ${open ? "on" : ""}`}
        style={{ "--shift": `${shift}px` }}
      >
        <strong>{item.label}</strong>
        <span>{tooltipDescription}</span>
      </div>
    </li>
  );
}

export default function Navbar() {
  const navigation = useContext(NavContext);
  const [hidden, setHidden] = useState(false);

  if (!navigation) {
    throw new Error(
      "Navbar must be rendered inside NavContext.Provider in App.jsx."
    );
  }

  const { active, navigate, user } = navigation;

  return (
    <>
      <header
        className={`navbar ${hidden ? "navbar-hidden" : ""}`}
        data-solid
      >
        <div className="navbar-in">
          <a
            className="brand"
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              navigate("home");

              window.scrollTo({
                top: 0,
                left: 0,
                behavior: "auto",
              });
            }}
          >
            <NavbarWordmark />
          </a>

          <nav aria-label="Main navigation">
            <ul className="nav-list">
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  active={active === item.id}
                  onSelect={navigate}
                  user={user}
                />
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <button
        type="button"
        className={`nav-toggle ${hidden ? "is-hidden" : ""}`}
        onClick={() => setHidden((previous) => !previous)}
        aria-label={hidden ? "Show navigation" : "Hide navigation"}
        aria-expanded={!hidden}
      >
        {hidden ? "▼" : "▲"}
      </button>
    </>
  );
}