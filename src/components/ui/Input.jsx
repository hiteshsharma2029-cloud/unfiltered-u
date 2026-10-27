
import "./Input.css";

export default function Input({
  label,
  id,
  error,
  hint,
  className = "",
  ...props
}) {
  const inputId =
    id || props.name || `uu-input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={`uu-field ${className}`.trim()}>
      {label && (
        <label className="uu-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={`uu-input${error ? " uu-input--error" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        {...props}
      />

      {error && (
        <p className="uu-field__error" id={`${inputId}-error`}>
          {error}
        </p>
      )}

      {!error && hint && (
        <p className="uu-field__hint" id={`${inputId}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
}
