# KAWS waitlist website

Next.js App Router application, served on port 3002 with Bun.

From the repository root, run `bun install`, then `bun run dev:waitlist`.
Copy `.env.example` to `.env.local` in this folder and supply your Firebase web configuration to enable sign-in, blogs, and waitlist submissions.

The original homepage, static course catalog, blog, and waitlist form have matching routes in `src/app`. Components, course data, styles, and public assets keep their original organization.

See the [repository setup guide](../README.md) for environment fields, builds, tests, and deployment.
