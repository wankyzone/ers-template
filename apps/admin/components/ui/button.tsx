import * as React from "react";

type Variant = "default" | "ghost";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({
  className = "",
  variant = "default",
  ...props
}: ButtonProps) {
  const base =
    "px-3 py-2 rounded-md text-sm font-medium disabled:opacity-50";

  const variants: Record<Variant, string> = {
    default: "bg-black text-white hover:opacity-90",
    ghost: "bg-transparent text-black hover:bg-gray-100",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
