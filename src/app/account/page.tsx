import Link from "next/link";
import { ChevronRight, KeyRound, MailCheck, UserRound } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { Alert, PageHeader } from "@/components/ui";
import { SubmitButton } from "@/components/submit-button";
import { GradeSelect } from "@/components/education-selects";
import { updateAccountAction } from "@/app/account-actions";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const [{ error, success }, user] = await Promise.all([
    searchParams,
    requireUser(),
  ]);
  const profile =
    user.role === "TEACHER" ? user.teacherProfile : user.studentProfile;
  return (
    <div className="page">
      <PageHeader
        eyebrow="Account settings"
        title="Your profile and security"
        description="Keep your professional or learner details current and protect access to classroom data."
      />
      <Alert error={error} success={success} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.1fr) minmax(300px,.9fr)",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        <section className="card card-pad">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <UserRound size={18} color="var(--teal)" />
            <div className="eyebrow">Profile</div>
          </div>
          <h2
            className="display"
            style={{ fontSize: "1.8rem", margin: ".3rem 0 1rem" }}
          >
            Account details
          </h2>
          <form
            action={updateAccountAction}
            style={{ display: "grid", gap: ".85rem" }}
          >
            <label>
              <span className="label">Full name</span>
              <input
                className="field"
                name="name"
                defaultValue={user.name}
                minLength={2}
                maxLength={80}
                required
              />
            </label>
            <label>
              <span className="label">Email address</span>
              <input className="field" value={user.email} disabled />
              <span className="hint">
                Use the secure email-change form. Your current password verifies
                account control.
              </span>
            </label>
            <label>
              <span className="label">
                School <span className="hint">(optional)</span>
              </span>
              <input
                className="field"
                name="school"
                defaultValue={profile?.school ?? ""}
                maxLength={120}
              />
            </label>
            {user.role === "TEACHER" ? (
              <label>
                <span className="label">
                  Primary subject <span className="hint">(optional)</span>
                </span>
                <input
                  className="field"
                  name="subject"
                  defaultValue={user.teacherProfile?.subject ?? ""}
                  maxLength={80}
                />
              </label>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: ".7rem",
                }}
              >
                <label>
                  <span className="label">Grade</span>
                  <GradeSelect
                    defaultValue={user.studentProfile?.grade ?? ""}
                  />
                </label>
                <label>
                  <span className="label">Roll number</span>
                  <input
                    className="field"
                    name="rollNumber"
                    defaultValue={user.studentProfile?.rollNumber ?? ""}
                    maxLength={30}
                  />
                </label>
              </div>
            )}
            <SubmitButton pendingText="Saving profile…">
              Save profile
            </SubmitButton>
          </form>
        </section>
        <aside style={{ display: "grid", gap: "1rem" }}>
          <Link
            href="/account/email"
            className="card card-pad"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <MailCheck size={18} color="var(--teal)" />
              <div className="eyebrow">Sign-in email</div>
            </div>
            <h2
              className="display"
              style={{ fontSize: "1.8rem", margin: ".3rem 0 1rem" }}
            >
              Change email address
            </h2>
            <p
              style={{ color: "var(--muted)", lineHeight: 1.6, margin: 0 }}
            >
              Open a dedicated dashboard to verify your password and update the
              email used to sign in.
            </p>
            <span
              className="btn btn-secondary"
              style={{ marginTop: "1rem", width: "fit-content" }}
            >
              Change Email <ChevronRight size={16} />
            </span>
          </Link>
          <Link
            href="/account/password"
            className="card card-pad"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <KeyRound size={18} color="var(--coral)" />
              <div className="eyebrow">Security</div>
            </div>
            <h2
              className="display"
              style={{ fontSize: "1.8rem", margin: ".3rem 0 1rem" }}
            >
              Change password
            </h2>
            <p
              style={{ color: "var(--muted)", lineHeight: 1.6, margin: 0 }}
            >
              Open a separate security dashboard to choose a new password and
              protect your active sessions.
            </p>
            <span
              className="btn btn-secondary"
              style={{ marginTop: "1rem", width: "fit-content" }}
            >
              Change Password <ChevronRight size={16} />
            </span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
