"use client";
import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";
export function ReviewSubmit() { const { pending }=useFormStatus(); return <button type="submit" className="btn btn-primary" disabled={pending} aria-disabled={pending} onClick={(event)=>{const form=event.currentTarget.form;const publish=form?.elements.namedItem("publish") as HTMLInputElement|null;if(publish?.checked&&!window.confirm("Publish this result now? The student will immediately see the marks and feedback."))event.preventDefault();}}><Save size={16}/>{pending?"Saving review…":"Save review"}</button> }
