import Input from "../ui/Input";
import Button from "../ui/Button";
import { Identicon, Icon2 } from "./GroupsPrimitives";
import StudentCard from "./StudentCard";

export default function UniversitySearch({
  query,
  onQueryChange,
  queryLower,
  university,
  sent,
  onSend,
  onSeeProfile,
}) {
  return (
    <>
      <label className="gsearch">
        <Icon2 size={20}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </Icon2>
        <Input
          id="groups-university-search"
          name="universitySearch"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search a university, e.g. Chitkara University"
          aria-label="Search university"
          autoComplete="off"
        />
      </label>

      {!university && (
        <div className="g-hint">
          <p>
            {queryLower.length < 2
              ? "Type a university name to see its students."
              : "No university found."}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="small"
            className="g-suggest"
            onClick={() => onQueryChange("Chitkara University")}
          >
            Try “Chitkara University”
          </Button>
        </div>
      )}

      {university && (
        <>
          <p className="g-uni">
            {university.name}
            <span>{university.students.length} students</span>
          </p>
          <ul className="g-grid">
            {university.students.map((student, index) => (
              <StudentCard
                key={student.id}
                student={student}
                index={index}
                alreadySent={sent.some((request) => request.id === student.id)}
                onSend={onSend}
                onSeeProfile={onSeeProfile}
              />
            ))}
          </ul>
        </>
      )}
    </>
  );
}
