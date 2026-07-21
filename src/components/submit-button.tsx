"use client";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
export function SubmitButton({
  children,
  className = "btn btn-primary",
  pendingText = "Saving…",
  confirmMessage,
  confirmWhenChecked,
}: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
  confirmMessage?: string;
  confirmWhenChecked?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      aria-disabled={pending}
      style={{ opacity: pending ? 0.7 : 1 }}
      onClick={(event) => {
        const checkedField = confirmWhenChecked
          ? (event.currentTarget.form?.elements.namedItem(
              confirmWhenChecked,
            ) as HTMLInputElement | null)
          : null;
        const shouldConfirm =
          Boolean(confirmMessage) &&
          (!confirmWhenChecked || Boolean(checkedField?.checked));
        if (shouldConfirm && !window.confirm(confirmMessage!))
          event.preventDefault();
      }}
    >
      {pending && <LoaderCircle size={17} className="animate-spin" />}
      {pending ? pendingText : children}
    </button>
  );
}
