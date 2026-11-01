# KAWS Academy — Next.js + Bun

This repository contains the Next.js migration of `D:\KAWS web\web\Course-Website`. The three applications retain their original components, data repositories, CSS, public assets, and URLs. They use the Next.js App Router instead of Vite and React Router. Firebase Cloud Functions remain the payment backend.

## Run locally

Install [Bun](https://bun.sh/) 1.3 or newer, then run these commands from this repository:

```sh
bun install
bun run dev
```

| Application | URL | Run individually |
| --- | --- | --- |
| Student website | http://localhost:3000 | `bun run dev:user` |
| Administration | http://localhost:3001 | `bun run dev:admin` |
| Waitlist website | http://localhost:3002 | `bun run dev:waitlist` |

The apps also accept `bun run dev`, `bun run build`, and `bun run start` from their own folders. Next.js runs under Bun. A single root `bun.lock` manages dependencies for all four workspaces.

## Environment configuration

No environment files or credentials were copied from the original project. Create the following local files from their supplied examples, and fill in your own values:

| Copy from | Create and fill in |
| --- | --- |
| `user-app/.env.example` | `user-app/.env.local` |
| `admin-app/.env.example` | `admin-app/.env.local` |
| `waitlist-app/.env.example` | `waitlist-app/.env.local` |

Each frontend needs these Firebase web configuration values:

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

These are the same configuration names the original apps used, with `NEXT_PUBLIC_` replacing `VITE_`. Supply all six values. `NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION` defaults to `asia-south1`; it must match the backend's `FUNCTIONS_REGION`. Set `NEXT_PUBLIC_USE_FUNCTIONS_EMULATOR=true` only when using the local Functions emulator on port 5001. Restart development servers after changing configuration. For production, supply the values **before building** because Next.js embeds public variables in the browser bundle.

Before configuration is supplied, the public pages and bundled course catalogs work. Sign-in, live blogs and courses, saved learning progress, administrative data, waitlist submissions, and checkout require the original Firebase services. Missing configuration does not create fake users, enrollments, or payments.

Payment secrets stay in Firebase Secret Manager under `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. For local emulator development, `functions/.secret.local.example` provides empty slots for `functions/.secret.local`; `functions/.env.example` provides the optional region setting. Private Razorpay secrets do not belong in any `NEXT_PUBLIC_` variable. Local environment and secret files are ignored by Git.

The existing Firebase project selection and `firebase.json` are preserved. Google sign-in still requires the app's hostname in Firebase Authentication's authorized domains, and admin access still checks `admins/{email}.role === "admin"`. Use the same Firestore rules, Storage rules, and deployed functions as the original application; those rules were not present in the source repository.

## Folder structure

```text
kawsweb2/
├── user-app/
│   ├── src/
│   │   ├── app/              # Next.js pages and layouts
│   │   ├── components/       # Original student UI
│   │   ├── screens/          # Purchase history and invoice UI
│   │   ├── data/
│   │   ├── repo/
│   │   ├── utils/
│   │   ├── about.jsx
│   │   └── App.css
│   ├── public/
│   ├── .env.example
│   └── next.config.mjs
├── admin-app/
│   ├── src/{app,admin,repo,utils}/
│   ├── public/
│   ├── .env.example
│   └── next.config.mjs
├── waitlist-app/
│   ├── src/{app,components,data,repo,utils}/
│   ├── public/
│   ├── .env.example
│   └── next.config.mjs
├── functions/                # Original Firebase payment backend and tests
├── images/                   # Additional original image library
├── tests/                    # Migration regression checks
├── firebase.json
├── bunfig.toml
├── bun.lock
└── package.json
```

There are 26 original application routes:

- Student: `/`, `/waiting-list`, `/courses`, `/courses/[domainId]`, `/blog`, `/profile`, `/my-courses`, `/cart`, `/purchase-history`, `/invoice/[invoiceId]`, `/learning/[courseCode]`.
- Admin: `/`, `/admin/dashboard`, `/admin/waitlist`, `/admin/blogs`, `/admin/courses`, `/admin/courses/new`, `/admin/courses/edit/[domainId]/[code]`, `/admin/promotions`, `/admin/payments`, `/admin/refunds`, `/admin/reports`.
- Waitlist: `/`, `/waiting-list`, `/courses`, `/blog`.

Student account routes share `src/app/(account)/layout.jsx`; administration routes share `src/app/admin/layout.jsx`. Authentication guards preserve the original login and role requirements. The student's old `src/pages` UI folder is named `src/screens` here because Next.js reserves `src/pages` for its other routing system. Interactive components are client components; Next.js owns the page routes, initial rendering, links, dynamic parameters, and error pages.

## Build and verify

```sh
bun run build
bun run lint
bun run test:unit
bun run test:e2e
```

`bun run build` builds the applications sequentially. `bun run start` serves all three production builds on the same ports as development. Each app can also be built or started individually with `build:user`, `build:admin`, `build:waitlist`, `start:user`, `start:admin`, and `start:waitlist`.

`bun run test:unit` covers the existing payment, promotion, and refund logic, plus server-side imports and unconfigured client services, without loading environment files. Browser checks run against production builds on ports 3410–3412 and cover public pages, course searches, direct dynamic URLs, navigation, mobile menus, forms, and anonymous route protection. Run those checks on builds made with the frontend configuration unset. They block external service requests and do not submit data to Firebase or Razorpay. If Chromium is not installed for Playwright, run `bunx playwright install chromium` first.

Deploy each frontend as a Next.js application with its own app folder as the application root and access to the workspace dependencies. Static Vite hosting and SPA fallback rules do not apply to these server builds. The Functions folder keeps Firebase's Node.js 20 deployment runtime; Bun manages local installation and tests. Existing deployed Firebase services can be reused without deploying them again.

## Migration verification

Verified with Bun 1.4.2 and Next.js 16.4.0:

- All three production builds pass.
- All 39 unit tests and 34 browser tests pass.
- Lint completes without errors; 23 warnings remain in the preserved application and backend code.
- Desktop and mobile browser screenshots were reviewed.
- All 311 checked non-environment source files remained unchanged. The copies include 205 identical assets, three identical stylesheets, and 11 identical backend source/test files. All 40 original UI components are present.
- No original environment files were read or copied. Authenticated live-data flows and real payments were not exercised without credentials.
