import { useEffect, useState } from "react";

import Card from "../components/ui/Card";
import GroupsIntro from "../components/Animations/GroupsIntro";
import GroupTabs from "../components/Groups/GroupTabs";
import UniversitySearch from "../components/Groups/UniversitySearch";
import StudentProfile from "../components/Groups/StudentProfile";
import GroupRequests from "../components/Groups/GroupRequests";
import {
  UNIVERSITIES,
  GROUP_TABS,
} from "../components/Groups/GroupsData";
import { Icon2 } from "../components/Groups/GroupsPrimitives";

import "./Groups.css";

export default function Groups({
  introSeen = false,
  onIntroSeen = () => {},
}) {
  const [sent, setSent] = useState([]);
  const [tab, setTab] = useState("create");
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState(null);
  const [toast, setToast] = useState("");
  const [introOn, setIntroOn] = useState(!introSeen);

  const finishIntro = () => {
    setIntroOn(false);
    onIntroSeen();
  };

  useEffect(() => {
    if (!toast) return undefined;

    const timeout = window.setTimeout(
      () => setToast(""),
      2400
    );

    return () => window.clearTimeout(timeout);
  }, [toast]);

  const queryLower = query.trim().toLowerCase();

  const university =
    queryLower.length >= 2
      ? UNIVERSITIES.find((item) =>
          item.name.toLowerCase().includes(queryLower)
        )
      : null;

  const tabIndex = GROUP_TABS.findIndex(
    (item) => item.id === tab
  );

  const onTabKey = (event) => {
    const count = GROUP_TABS.length;

    const nextIndex = {
      ArrowRight: (tabIndex + 1) % count,
      ArrowLeft: (tabIndex - 1 + count) % count,
      Home: 0,
      End: count - 1,
    }[event.key];

    if (nextIndex === undefined) return;

    event.preventDefault();
    setTab(GROUP_TABS[nextIndex].id);
    setProfile(null);

    document
      .getElementById(`gtab-${GROUP_TABS[nextIndex].id}`)
      ?.focus();
  };

  const sendRequest = (student) => {
    if (!university) return;

    setSent((list) =>
      list.some((request) => request.id === student.id)
        ? list
        : [
            {
              id: student.id,
              university: university.name,
              time: Date.now(),
            },
            ...list,
          ]
    );

    setToast(`Request sent to #${student.id}`);
  };

  const removeRequest = (request) => {
    setSent((list) =>
      list.filter((item) => item.id !== request.id)
    );

    setToast(`Request to #${request.id} removed`);
  };

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <main
      id="top"
      className={`groups wrap${introOn ? "" : " is-ready"}`}
    >
      {introOn && <GroupsIntro onDone={finishIntro} />}

      <header className="groups-head">
        <p className="eyebrow">Your groups</p>

        <h1 className="groups-title">
          Find your <span className="script">people</span>.
        </h1>

        <p className="groups-sub">
          Students are shown only as anonymous IDs, so you can
          reach out without revealing who anyone is.
        </p>
      </header>

      <GroupTabs
        tab={tab}
        sent={sent}
        onChange={(nextTab) => {
          setTab(nextTab);
          setProfile(null);
        }}
        onKeyDown={onTabKey}
      />

      <Card
        as="section"
        id="gpanel"
        className="gpanel glass"
        role="tabpanel"
        aria-labelledby={`gtab-${tab}`}
      >
        <div
          className="gpane"
          key={`${tab}-${profile ? "profile" : "main"}`}
        >
          {tab === "create" && profile && (
            <StudentProfile
              profile={profile}
              onBack={() => setProfile(null)}
            />
          )}

          {tab === "create" && !profile && (
            <UniversitySearch
              query={query}
              onQueryChange={setQuery}
              queryLower={queryLower}
              university={university}
              sent={sent}
              onSend={sendRequest}
              onSeeProfile={setProfile}
            />
          )}

          {(tab === "sent" ||
            tab === "saved" ||
            tab === "received") && (
            <GroupRequests
              tab={tab}
              sent={sent}
              onRemove={removeRequest}
              formatTime={formatTime}
            />
          )}
        </div>
      </Card>

      <div
        className={`g-toast${toast ? " show" : ""}`}
        role="status"
        aria-live="polite"
      >
        <Icon2 size={16} stroke={2.2}>
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </Icon2>
        {toast}
      </div>
    </main>
  );
}