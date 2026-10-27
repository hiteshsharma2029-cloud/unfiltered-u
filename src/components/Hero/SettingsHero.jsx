
import BaseHero from "./BaseHero";
import "./SettingsHero.css";

export default function SettingsHero({ glitchOn = false }) {
  return (
    <BaseHero
      className="hero settings-hero"
      eyebrow="Settings"
      title={
        <span
          className={`settings-glitch ${glitchOn ? "go" : ""}`}
          data-t="Make it yours."
        >
          Make it yours.
        </span>
      }
      description="Changes apply as you make them and save on their own."
    />
  );
}
