import Button from "../ui/Button";
import { Empty, Identicon, Icon2 } from "./GroupsPrimitives";

export default function GroupRequests({ tab, sent, onRemove, formatTime }) {
  if (tab === "saved") {
    return <Empty title="No saved groups yet." text="Groups you save will show up here." icon="saved" />;
  }

  if (tab === "received") {
    return <Empty title="No requests received." text="Requests from other students will show up here." icon="received" />;
  }

  if (tab !== "sent") return null;

  if (sent.length === 0) {
    return <Empty title="No requests sent yet." text="Requests you send will show up here." icon="sent" />;
  }

  return (
    <ul className="g-sent" aria-live="polite">
      {sent.map((request) => (
        <li key={request.id} className="g-sent-row">
          <Identicon id={request.id} size={46} />
          <span className="g-card-id">
            <span className="g-id-text">#{request.id}</span>
            <small>{request.university}</small>
          </span>
          <span className="g-pending">
            <i aria-hidden="true" />
            Pending
            <small>{formatTime(request.time)}</small>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="small"
            className="g-remove"
            aria-label={`Remove request to ${request.id}`}
            onClick={() => onRemove(request)}
          >
            <Icon2 size={15} stroke={2.2}>
              <path d="M6 6l12 12M18 6L6 18" />
            </Icon2>
            Remove request
          </Button>
        </li>
      ))}
    </ul>
  );
}
