
import "./Card.css";

export default function Card({
  children,
  className = "",
  as: Component = "div",
  ...props
}) {
  const classes = ["uu-card", "uu-ui-card", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
