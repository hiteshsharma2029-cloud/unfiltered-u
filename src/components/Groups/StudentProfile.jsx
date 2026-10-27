import Button from "../ui/Button";
import { Empty, Identicon, Icon2 } from "./GroupsPrimitives";

export default function StudentProfile({ profile, onBack }) {
  return (
    <div className="g-profile-page">
      <Button
        type="button"
        variant="ghost"
        size="small"
        className="g-back"
        onClick={onBack}
      >
        <Icon2 size={16} stroke={2}>
          <path d="M15 5l-7 7 7 7" />
        </Icon2>
        Back to search
      </Button>

      <div className="g-profile-top">
        <Identicon id={profile.id} size={84} />
        <div>
          <p className="g-profile-id">#{profile.id}</p>
          <div className="g-chips">
            <span className="g-chip">{profile.branch}</span>
            <span className="g-chip">Semester {profile.semester}</span>
            <span className="g-chip">Chitkara University</span>
          </div>
        </div>
      </div>

      <Empty title="Nothing here yet." text="" icon="saved" />
    </div>
  );
}
