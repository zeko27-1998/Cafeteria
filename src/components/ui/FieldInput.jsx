export default function FieldInput({
  label,
  required,
  className = "",
  ...props
}) {
  const Tag =
    props.as === "textarea"
      ? "textarea"
      : props.as === "select"
        ? "select"
        : "input";
  const { as, ...rest } = props;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-500">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <Tag
        {...rest}
        className={`field-input ${props.as === "textarea" ? "resize-y min-h-[80px]" : ""}`}
      />
    </div>
  );
}
