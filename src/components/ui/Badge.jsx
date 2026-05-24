const VARIANTS = {
  blue: "bg-blue-pale text-blue-main",
  green: "bg-green-100 text-green-700",
  orange: "bg-amber-100 text-amber-700",
  red: "bg-red-100   text-red-600",
};

export default function Badge({ variant = "blue", children }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full text-xs font-bold px-2.5 py-0.5 ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
