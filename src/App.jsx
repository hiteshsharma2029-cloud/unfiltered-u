import { useContext, useLayoutEffect, useState } from "react";
import Intro from "./Animation.jsx";

import GlobalBackground from "./global/GlobalBackground";
import Navbar, { NavContext } from "./components/Navbar/Nanbar.jsx";
import Button from "./components/ui/Button";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Review from "./pages/Review.jsx";
import Settings from "./pages/Settings";
import Groups from "./pages/Groups.jsx";

import { NavigationProvider } from "./NavigationContext.jsx";

function AccessNotice({ title, message, navigate, showLogin = true }) {
  return (
    <section
      className="uu-route-placeholder"
      aria-labelledby="uu-access-title"
      style={{
        width: "min(calc(100% - 48px), 1120px)",
        minHeight: "60vh",
        marginInline: "auto",
        paddingBlock: "clamp(72px, 12vh, 140px)",
        color: "var(--uu-text, #fff)",
      }}
    >
      <p
        style={{
          margin: "0 0 14px",
          color: "var(--uu-text-muted, #9696a0)",
          fontSize: ".75rem",
          fontWeight: 700,
          letterSpacing: ".2em",
          textTransform: "uppercase",
        }}
      >
        UNFILTERED U
      </p>

      <h1
        id="uu-access-title"
        style={{
          margin: 0,
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 800,
          letterSpacing: "-.04em",
          lineHeight: 1.1,
        }}
      >
        {title}
      </h1>

      <p
        style={{
          maxWidth: 620,
          marginTop: 18,
          color: "var(--uu-text-muted, #9696a0)",
          lineHeight: 1.7,
        }}
      >
        {message}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginTop: 26,
        }}
      >
        <Button
          variant="secondary"
          onClick={() => navigate("home")}
        >
          Back to Home
        </Button>

        {showLogin && (
          <Button onClick={() => navigate("login")}>
            Switch account / Login
          </Button>
        )}
      </div>
    </section>
  );
}

function AppContent() {
  const {
    active,
    navigate,
    user,
    login,
    groupsIntroSeen,
    markGroupsIntroSeen,
  } = useContext(NavContext);

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [active]);

  let page;

  switch (active) {
    case "home":
      page = <Home />;
      break;

    case "login":
      page = <Login onContinue={login} />;
      break;

    case "reviews":
      page = user ? (
        <Review user={user} />
      ) : (
        <AccessNotice
          title="Login required"
          message="Log in to read college reviews and explore external review summaries."
          navigate={navigate}
        />
      );
      break;

    case "groups":
      page =
        user?.role === "verifiedStudent" ? (
          <Groups
            introSeen={groupsIntroSeen}
            onIntroSeen={markGroupsIntroSeen}
          />
        ) : (
          <AccessNotice
            title="Groups are for verified students"
            message="Use your recognized @chitkara.edu.in student email to access anonymous student profiles and group requests."
            navigate={navigate}
          />
        );
      break;

    case "settings":
      page = user ? (
        <Settings />
      ) : (
        <AccessNotice
          title="Login required"
          message="Log in to open Settings and manage your preferences."
          navigate={navigate}
        />
      );
      break;

    default:
      page = <Home />;
  }

  return (
    <div className="uu-app-shell">
      <GlobalBackground />

      <Navbar />

      <div className="uu-page-content" key={active}>
        {page}
      </div>
    </div>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <NavigationProvider>
      {showIntro ? (
        <Intro onComplete={() => setShowIntro(false)} />
      ) : (
        <AppContent />
      )}
    </NavigationProvider>
  );
}