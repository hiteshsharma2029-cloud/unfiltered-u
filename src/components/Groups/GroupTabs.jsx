import Button from "../ui/Button";
import { GROUP_TABS } from "./GroupsData";
import { TabIcon } from "./GroupsPrimitives";

export default function GroupTabs({ tab, sent, onChange, onKeyDown }) {
  const tabIndex = GROUP_TABS.findIndex((item) => item.id === tab);

  return (
    <div
      className="gtabs"
      role="tablist"
      aria-label="Groups"
      style={{ "--i": tabIndex }}
      onKeyDown={onKeyDown}
    >
      <span className="gtab-thumb" aria-hidden="true" />
      {GROUP_TABS.map((item) => (
        <Button
          key={item.id}
          type="button"
          variant="ghost"
          size="small"
          role="tab"
          id={`gtab-${item.id}`}
          aria-selected={tab === item.id}
          aria-controls="gpanel"
          tabIndex={tab === item.id ? 0 : -1}
          className={`gtab${tab === item.id ? " on" : ""}`}
          onClick={() => onChange(item.id)}
        >
          <TabIcon name={item.id} />
          <span>{item.label}</span>
          {item.id === "sent" && sent.length > 0 && (
            <span className="gtab-badge">{sent.length}</span>
          )}
        </Button>
      ))}
    </div>
  );
}
