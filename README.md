# EduGrade AI

**Smart Teaching. Faster Feedback. Better Learning.**

EduGrade AI is a production-oriented, full-stack teacher assistant and classroom platform for the complete teaching cycle: plan, teach, assign, collect, evaluate, support, communicate, and analyse. It is seeded with a Class 12 CBSE Accountancy scenario for a Skill Expo presentation while retaining real authentication, PostgreSQL persistence, validation, upload storage, and role-based workflows.

## Implemented features

### Platform foundation

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, and responsive server-rendered UI
- PostgreSQL/Prisma data layer covering all requested entities plus database-backed sessions
- Credential authentication with bcrypt password hashes and secure HTTP-only session cookies
- Teacher/student authorization and ownership checks on pages and every write action
- Server-side Zod validation plus native client-side form constraints
- Reusable application shell, cards, alerts, loading states, empty states, upload previews, error boundary, and 404 view
- Activity logging for important authentication, creation, submission, generation, quiz, and publication actions

### Teacher workspace

- Workload dashboard with classes, students, open work, unchecked work, average, AI materials, announcements, and estimated time saved
- Class creation, random class-code generation, cohort view, and enrolled-student list
- Editable AI studio for lesson plans, explanations, notes, questions, quizzes, revision sheets, and announcements
- Assignment/test/homework/worksheet/practice creation with optional question-paper upload, draft mode, and publishing
- Submission queue with handwritten answer-page viewer
- AI-assisted feedback suggestion, marks validation, teacher editing, private review save, publication confirmation, and result publishing
- Resource library uploads, announcements, attendance records, and teacher analytics

### Student workspace

- Dashboard with joined classes, deadlines, completion, recent marks, streak, announcements, and study tip
- Class-code enrollment, class resources, assignments, notices, and quizzes
- Multi-image handwritten answer upload with local previews, removal before submission, page order, file validation, checklist, and status tracking
- Published marks, teacher feedback, submitted-page history, and revision action
- Working quizzes with scoring and explanations
- Student doubt/explanation/revision assistant with learning-safe language
- Progress analytics with average, completion, quiz accuracy, topic map, streak, and trend

### AI and safety

- A single replaceable server-side AI abstraction in `src/lib/ai.ts`
- Optional Vercel AI Gateway integration; no API key reaches browser code
- Deterministic, classroom-safe fallback generation when no AI key is configured
- AI content is marked as a suggestion, editable, reviewable, and stored with provider/approval metadata
- Final evaluation, marks, publishing, feedback, and teaching decisions remain under teacher control

## Data model

The Prisma schema at `prisma/schema.prisma` includes:

`User`, `TeacherProfile`, `StudentProfile`, `Session`, `ClassRoom`, `ClassEnrollment`, `Assignment`, `AssignmentAttachment`, `Submission`, `SubmissionPage`, `Result`, `Feedback`, `Quiz`, `QuizQuestion`, `QuizAttempt`, `Resource`, `Announcement`, `AttendanceRecord`, `AIContentGeneration`, and `ActivityLog`.

## Local setup

Requirements: Node.js 24 LTS and PostgreSQL 15+ (local or managed).

```bash
npm install
cp .env.example .env
```

Set `DATABASE_URL` and a strong `AUTH_SECRET` in `.env`, then run:

```bash
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Seeded expo credentials (both use `EduGrade@123`):

- Teacher: `teacher@edugrade.ai`
- Student: `student@edugrade.ai`
- Class: `Class 12 Commerce — Accountancy`
- Class code: `ACC12D`

The seed is idempotent for core demo records and can safely be rerun.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string; use SSL in production |
| `AUTH_SECRET` | Yes | Long random authentication secret |
| `BLOB_READ_WRITE_TOKEN` | Production uploads | Vercel Blob storage token |
| `AI_GATEWAY_API_KEY` | No | Enables Vercel AI Gateway; fallback works without it |
| `AI_MODEL` | No | Gateway model string, default `openai/gpt-5-mini` |

Do not commit `.env`; it is ignored by Git. Generate an auth secret with `openssl rand -base64 32`.

## Testing and verification

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Manual expo smoke test:

1. Seed, sign in as teacher, and inspect the workload dashboard.
2. Generate and edit a lesson plan, notes, and questions in AI Studio.
3. Create and publish a new assignment.
4. Sign out; sign in as student and open the assignment.
5. Upload multiple answer images, remove one preview, re-add it, complete the checklist, and submit.
6. Sign in as teacher, open Review work, inspect pages, draft AI feedback, edit marks/feedback, and publish with confirmation.
7. Sign in as student and open Results and Progress.
8. Return as teacher and open Analytics.

## Deploying to Vercel

1. Upgrade the CLI for current agentic features and compatibility: `npm i -g vercel@latest` or `pnpm add -g vercel@latest`.
2. Create a managed PostgreSQL database from the Vercel Marketplace (Neon, Supabase, or another provider).
3. Create a Vercel Blob store for production uploads.
4. Import the repository into Vercel and add all required environment variables for Production, Preview, and Development as appropriate.
5. Apply the schema and seed the expo environment from a trusted local/CI shell:

   ```bash
   DATABASE_URL="..." npm run db:push
   DATABASE_URL="..." npm run db:seed
   ```

6. Deploy with `vercel --prod` or through the Git integration. Next.js runs on Vercel Fluid Compute; no Edge runtime is required.

For production teams, replace `db:push` with versioned Prisma migrations before evolving a live schema, rotate the seeded passwords, and restrict who can seed production.

## Known limitations

- The included deterministic AI fallback is structured and useful but is not a language model. Configure AI Gateway for richer generation, and retain teacher review in either mode.
- AI does not read handwriting or automatically grade image content. The teacher reviews submitted pages; the feedback generator deliberately offers a general draft rather than inventing image-derived conclusions.
- Local development stores uploaded files under `public/uploads`; ephemeral production hosts require Vercel Blob. Existing sample answer pages are static demo assets.
- Analytics are descriptive and intentionally conservative. The seeded weak-topic and workload estimates are presentation data, not validated psychometric or time-tracking measures.
- Email delivery, password reset, multi-school tenancy, parent accounts, moderation queues, and institutional SSO are logical commercial extensions but are outside this expo release.

## Security notes

- Passwords are hashed with bcrypt; raw credentials and API keys are server-only.
- Sessions are stored in PostgreSQL and referenced by random, HTTP-only, same-site cookies.
- Every mutation rechecks role, ownership/enrollment, and validated input on the server.
- File MIME type and 10 MB size limits are enforced before storage; student submissions are limited to 20 images.
- Student answer pages use private Vercel Blob objects and are streamed only through an authorization-checked endpoint. Resources and teacher-provided papers use public links for shareability; apply the institution’s retention policy before real-school use.

## Teacher-control statement

EduGrade AI uses AI to assist teachers with lesson planning, content generation, feedback, revision support, and learning insights. Final teaching decisions, evaluation, marks, and feedback remain under teacher control.
