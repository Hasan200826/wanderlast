"use client";

import { useState, type ComponentProps } from "react";
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "cn";

type PasswordInputProps = Omit<ComponentProps<"input">, "type">;

function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <LockIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
      <Input
        type={visible ? "text" : "password"}
        className={cn(
          "border-transparent bg-zinc-50 pr-9 pl-9",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-zinc-400 outline-none transition-colors hover:text-zinc-600 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {visible ? (
          <EyeOffIcon className="size-4" />
        ) : (
          <EyeIcon className="size-4" />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
