import Card from "../ui/Card";
import Button from "../ui/Button";
import { Identicon, Icon2 } from "./GroupsPrimitives";

export default function StudentCard({
  student,
  index,
  alreadySent,
  onSend,
  onSeeProfile,
}) {
  return (
    <Card as="li" className="g-card" style={{ "--n": index }}>
      <div className="g-card-top">
        <Identicon id={student.id} />
        <div className="g-card-id">
          <span className="g-id-text">#{student.id}</span>
          <small>{student.branch}</small>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="small"
          className={`g-plus${alreadySent ? " done" : ""}`}
          disabled={alreadySent}
          aria-label={
            alreadySent
              ? `Request sent to ${student.id}`
              : `Send request to ${student.id}`
          }
          onClick={() => onSend(student)}
        >
          <Icon2 size={18} stroke={2.2}>
            {alreadySent ? (
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            ) : (
              <path d="M12 5v14M5 12h14" />
            )}
          </Icon2>
        </Button>
      </div>

      <div className="g-card-bottom">
        <span className="g-chip">Semester {student.semester}</span>
        <Button
          type="button"
          variant="ghost"
          size="small"
          className="g-see"
          onClick={() => onSeeProfile(student)}
        >
          See profile
          <Icon2 size={14} stroke={2.2}>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </Icon2>
        </Button>
      </div>
    </Card>
  );
}
