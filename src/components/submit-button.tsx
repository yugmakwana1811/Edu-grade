"use client";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
export function SubmitButton({ children, className = "btn btn-primary", pendingText = "Saving…" }: { children: React.ReactNode; className?: string; pendingText?: string }) { const { pending } = useFormStatus(); return <button className={className} disabled={pending} aria-disabled={pending} style={{ opacity: pending ? .7 : 1 }}>{pending && <LoaderCircle size={17} className="animate-spin"/>}{pending ? pendingText : children}</button>; }
