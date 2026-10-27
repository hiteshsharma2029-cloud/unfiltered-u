
import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  type = "button",
  ...props
}) {
  const classes = [
    "uu-button",
    `uu-button--${variant}`,
    `uu-button--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
