# Testing EduGrade AI

Run the complete local gate with:

```bash
npm ci
npm run check
npm audit --omit=dev
```

The gate includes TypeScript checking, ESLint, Vitest unit tests, Prisma Client generation, and a production Next.js build.

For database-backed testing, use an isolated PostgreSQL database or Neon branch. Apply `npm run db:deploy`, optionally run `npm run db:seed`, start with `npm run dev`, and test both roles. Never point destructive or experimental tests at the production branch.

Core manual regression paths:

1. Register one teacher and one student with different email addresses.
2. Create a class, join it using the generated code, and verify cross-role route protection.
3. Create and publish an assignment with an attachment.
4. Upload multiple answer images, remove/reorder before submission, and finalize.
5. Review pages as the teacher, edit AI feedback, save marks, and publish.
6. Confirm unpublished results remain hidden and published results are visible to the enrolled learner only.
7. Create a quiz with unique options, publish it, attempt it as the learner, and verify scoring/explanations.
8. Update profile details, change a password, and verify other sessions are invalidated.
9. Confirm private file routes return `401` without a session and `404` for unauthorized classroom users.
