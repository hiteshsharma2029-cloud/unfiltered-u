
import "./BaseHero.css";

export default function BaseHero({
  eyebrow,
  title,
  description,
  className = "",
  children,
}) {
  return (
    <section className={`uu-hero ${className}`.trim()}>
      {eyebrow && (
        <p className="uu-hero__eyebrow">{eyebrow}</p>
      )}

      {title && (
        <h1 className="uu-hero__title">{title}</h1>
      )}

      {description && (
        <p className="uu-hero__description">{description}</p>
      )}

      {children}
    </section>
  );
}
