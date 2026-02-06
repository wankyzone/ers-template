import * as React from "react";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = "", ...props }: SelectProps) {
  return (
    <select
      className={"border rounded-md px-2 py-2 text-sm bg-white " + className}
      {...props}
    />
  );
}

// Keep these exports so your existing imports don't explode.
// They're "no-op" wrappers to match your current API.
export const SelectTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SelectItem = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SelectValue = ({ children }: { children: React.ReactNode }) => <>{children}</>;
