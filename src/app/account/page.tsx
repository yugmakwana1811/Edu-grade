import { KeyRound, UserRound } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { Alert, PageHeader } from "@/components/ui";
import { SubmitButton } from "@/components/submit-button";
import {
  changePasswordAction,
  updateAccountAction,
} from "@/app/account-actions";

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
                Email changes require support verification.
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
                  <input
                    className="field"
                    name="grade"
                    defaultValue={user.studentProfile?.grade ?? ""}
                    maxLength={30}
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
        <section className="card card-pad">
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
          <form
            action={changePasswordAction}
            style={{ display: "grid", gap: ".85rem" }}
          >
            <label>
              <span className="label">Current password</span>
              <input
                className="field"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>
            <label>
              <span className="label">New password</span>
              <input
                className="field"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength={10}
                maxLength={128}
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{10,}"
                required
              />
              <span className="hint">
                Use 10+ characters with uppercase, lowercase, number, and
                symbol.
              </span>
            </label>
            <label>
              <span className="label">Confirm new password</span>
              <input
                className="field"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={10}
                maxLength={128}
                required
              />
            </label>
            <SubmitButton
              pendingText="Securing account…"
              confirmMessage="Change your password and sign out every other active session?"
            >
              Change password
            </SubmitButton>
          </form>
        </section>
      </div>
    </div>
  );
}
