@AGENTS.md

# Xourse (repo: ratexmumelectives)

Xourse is a site where XMUM (Xiamen University Malaysia) students rate and review electives.
Students search a course by code or title, read reviews (rating, workload, grading fairness, attendance), and leave a review after taking the course.
Only XMUM students should get in; that rule is not enforced yet.

Current status and the todo list are in [progress.md](progress.md). Read it before starting work, and update it when you finish something.

## Tech stack

| Area      | What                                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework | **Next.js 16.2.6**, App Router with RSC, React 19.2.4, TypeScript (strict). Next 16 breaks things you may expect: read `node_modules/next/dist/docs/` first. |
| Styling   | **Tailwind CSS v4** through `@tailwindcss/postcss`. There is **no tailwind.config**: theme tokens live in `app/globals.css` under `@theme inline`. Also `tw-animate-css`. |
| UI kit    | **shadcn** with style `base-nova`, built on **`@base-ui/react`, not Radix**. Extra registries: `@magicui` and `@unlumen-ui` (see `components.json`). The shadcn carousel uses `embla-carousel-react`. |
| Backend   | **Supabase** (`@supabase/ssr` and `@supabase/supabase-js`) for auth (email/password and Google OAuth) and Postgres. Schema is below; the app doesn't query tables yet. |
| Animation | `motion`, imported as `motion/react`. Don't install or import `framer-motion` directly.                                                                             |
| 3D        | `three`, `@react-three/fiber` and `@react-three/drei` for the hero graduation-cap model (`public/graduation_hat.glb`, meshopt-compressed; `useGLTF` decodes it out of the box). `@types/three` is a devDependency. |
| Icons     | `lucide-react`                                                                                                                                         |
| Fonts     | Geist (`--font-sans`, also `--font-heading`) and Geist Mono (`--font-mono`) via `next/font/google` in `app/layout.tsx`.                                 |
| Tooling   | pnpm, ESLint 9 (`eslint-config-next`), Prettier with `prettier-plugin-tailwindcss`. There are no tests.                                                |

## Commands

```bash
pnpm dev         # dev server
pnpm build       # production build
pnpm lint        # eslint
pnpm typecheck   # tsc --noEmit
pnpm format      # prettier on all .ts/.tsx
npx shadcn@latest add <name>             # shadcn component -> components/ui
npx shadcn@latest add @magicui/<name>    # Magic UI component
npx shadcn@latest add @unlumen-ui/<name> # Unlumen UI component
```

## Directory map

```
app/
  layout.tsx            fonts (Geist, Geist Mono), ThemeProvider (dark theme is forced),
                        root metadata (metadataBase, "%s | Xourse" title template, OG/Twitter)
                        and the viewport theme-color
  favicon.ico           Next serves it at /favicon.ico. It must stay in app/, not public/
  robots.ts             disallows /browse, /account and /auth/ (all login-walled)
  page.tsx              landing page, built from components/sections/*. Static, revalidate = 3600;
                        ledger strip + trending cards come from getLandingData()
  globals.css           Tailwind v4 theme: brand colors, animations, shadcn vars
  auth/
    actions.ts          server actions: login, signup, signInWithGoogle,
                        requestPasswordReset, updatePassword
    login/ signup/      pages (shadcn login-02 / signup-02 layout via AuthShell)
    forgot-password/    email form -> reset link; reset-password/ sets the new password
    auth-success/       "check your email" page shown after signup
    callback/route.ts   code exchange -> /browse (or /auth/reset-password when ?next=reset);
                        maps the email-domain trigger error to /auth/login?error=email-domain
  account/
    page.tsx            profile editor (photo, name, username, bio); actions.ts updateProfile
  browse/
    layout.tsx          Navbar + Footer shared by /browse and /browse/[id]
    page.tsx            course list: reads ?q, ?type, ?sort and renders CourseBrowser
    loading.tsx         skeleton for the list
    [id]/page.tsx       course page. [id] is the lowercased course code (looked up uppercase).
                        Header, About (+ "Before you enroll" notes), Assessment, rating band,
                        reviews list. Also loading.tsx and not-found.tsx
    [id]/actions.ts     server actions saveReview (upsert) and deleteReview
components/
  sections/             landing-page sections (hero, ledger-marqee, how-it-works,
                        grade-reveal, trending-electives, review-spotlight (carousel), final-cta).
                        Below lg the hero puts the cap above the copy; on touch screens
                        ((hover: none)) the cap turns with page scroll instead of the cursor
  ui/                   shadcn and Magic UI components
  unlumen-ui/           Unlumen UI components (tilt, clipped-circle, glowing-badge, scramble-text, ...)
  browse/               course-browser (search, colored type chips, sort, ledger rows; client-side
                        filtering synced to the URL), star-rating, browse-header
  course/               course page parts: course-header, course-about, assessment-card,
                        rating-summary (client, NumberTicker), review-list (client: sort,
                        show more, relative time with full date in a tooltip, detail badges),
                        review-card (tweet-style card), profile-popover, review-actions-menu
                        (the ... edit/delete menu on your own review), review-dialog
                        (WriteReviewButton, controlled ReviewDialog, DeleteReviewDialog)
  auth/                 auth-shell (two-column layout, cover = public/auth-cover.jpg over a
                        gradient), login/signup/forgot/reset forms, google-button, form-error
  account/              account-form (client: avatar upload to storage, username check)
  Navbar.tsx            server component: wordmark + UserMenu (user-menu.tsx: Account, Sign out)
  Footer.tsx, ScrollProgress.tsx (unused), theme-provider.tsx
lib/
  supabase/client.ts    createBrowserClient (for client components)
  supabase/server.ts    createServerClient using await cookies() (for RSC, actions, routes)
  supabase/database.types.ts  generated DB types (both clients are typed with Database)
  courses.ts            CourseSummary type, sort options, courseHref, ratingTextClass (client-safe)
  landing-data.ts       getLandingData(): trending (most reviewed, max 4) and ledger entries
                        (reviewed first, then random "new" courses, 16 total), and the review
                        spotlight (newest 5 reviews, no profanity, shortened to ~220 chars)
  supabase/public.ts    cookie-less anon client for cacheable public reads (landing page)
  course-queries.ts     server only: getCourseSummaries() for /browse, getCourseDetail(code)
                        (React cache) for the course page, with reviews + reviewer profiles
  course-info.ts        organizeAssessment() (parts by weight, kind, exam share) and
                        extractEnrollmentNotes() (leading "Restriction:/Note:/..." sentences)
  format-time.ts        formatRelativeTime(), formatFullDate()
  review-scales.ts      review labels (rating, workload, grading, attendance), limits and
                        validateReview(), shared by the dialog, the action and the list
  allowed-emails.ts     ALLOWED_EMAIL_DOMAINS, isAllowedEmail (mirror of the DB trigger)
  profile.ts            DEFAULT_AVATAR, avatarSrc(), displayName(), username/bio rules,
                        validateProfile(), avatar upload limits
  actions/auth.ts       signOut server action (used by the user menu)
  utils.ts              cn()
proxy.ts                (Next 16's name for middleware) refreshes the Supabase session,
                        protects /browse and /account, bounces logged-in users away from
                        /auth/* (except /auth/callback and /auth/reset-password)
public/                 graduation_hat.glb, default_pfpf.png (default avatar); add
                        auth-cover.jpg for the auth pages' right-hand image
hooks/                  empty
supabase/migrations/    SQL migrations applied to the Supabase project
```

## Database

- View `course_rating_stats` (`security_invoker`): per course `review_count`, `avg_rating`, `avg_workload`, `avg_grading`. The landing reads it; `/browse` could switch to it too instead of loading every review.

Supabase project `ElectiveCourseReview` (`eeioikpvzirlpdhsbrqu`). RLS is on for every table, and every table is publicly readable.

- `profiles`: `id` (= `auth.users.id`), `username` (unique; CHECK `^[a-z0-9_.]{3,20}$`, NOT VALID so old rows are exempt until edited), `full_name`, `avatar_url`, `bio` (max 160). The `on_auth_user_created` trigger (`handle_new_user`) creates a row at signup with a generated valid username; users can update only their own.
- `enforce_email_domain` (BEFORE INSERT on `auth.users`) rejects new accounts unless the email ends with `@gmail.com`, `@mail.ru`, `@outlook.com` or `@xmu.edu.my`. It covers email and Google sign-up; existing accounts are unaffected. `lib/allowed-emails.ts` must match it.
- Storage bucket `avatars` (public, 2 MB, JPG/PNG/WebP). Files live at `<user id>/<timestamp>.<ext>`; policies only allow writing to your own folder. The account form deletes older files after a successful save.
- `courses`: `course_code` (unique), `course_name`, `credit_amount`, `type` (lowercase: `arts`, `business`, `science`), `description`, `assessment_methods` (jsonb). No write policies; seed it with the service role or SQL.
- `reviews`: `course_id`, `user_id`, `rating` (overall, 1-5), `workload` (1 light to 5 heavy), `grading_fairness` (1-5), `attendance` (`strict` | `tracked` | `friendly`; must match `ATTENDANCE_OPTIONS` in `lib/review-scales.ts`, so changing the options needs a migration), `lecturer` (optional; no longer collected or shown by the app), `comment`. One review per user per course. Users insert, update and delete only their own.
- Reviews show the writer's name, `@username`, avatar (or `DEFAULT_AVATAR`) and, in the profile popover, their bio. Generated usernames come from the email prefix, so they reveal part of the email until the user changes it on `/account`.
- Embedding `profiles` from `reviews` must name the FK (`profiles!reviews_user_id_fkey(...)`), because `review_likes` also links the two tables and PostgREST refuses the ambiguous embed.
- `review_likes`: `(review_id, user_id)` primary key, so one like per user per review. Users add and remove only their own. Get counts with `.select("*, review_likes(count)")`.

After a schema change, save the SQL in `supabase/migrations/` and regenerate `lib/supabase/database.types.ts` (Supabase MCP `generate_typescript_types`, then `pnpm exec prettier --write`).

## Auth flow

- `proxy.ts` runs on every non-static request:
  - Calls `supabase.auth.getUser()`, which refreshes the session cookies.
  - A logged-out user who requests `/browse*` or `/account` is redirected to `/auth/login`.
  - A logged-in user who requests `/auth/*` is redirected to `/browse`, except `/auth/callback` and `/auth/reset-password` (the reset link signs the user in first).
- Forms in `app/auth/login` and `app/auth/signup` call the server actions in `app/auth/actions.ts`:
  - The actions return `{ error }` on failure, or call `redirect()` on success.
  - **After any successful login or signup the user always lands on `/browse`** (never a deep link such as `/browse/[id]`). This is a deliberate product rule.
  - Signup: if Supabase returns a session (email confirmation off), the user goes straight to `/browse`. Otherwise they go to `/auth/auth-success`, and the confirmation link (`emailRedirectTo`) goes through `/auth/callback` to `/browse`.
- Sign-up is limited to the four allowed email domains (checked in the action, enforced by the DB trigger). When the trigger rejects a Google sign-up, Supabase redirects to the callback with `error_description=Database error saving new user`, which becomes `/auth/login?error=email-domain`.
- Password reset: `/auth/forgot-password` calls `resetPasswordForEmail` with `redirectTo = NEXT_PUBLIC_SITE_URL + /auth/callback?next=reset`. That URL must be allowed in Supabase Auth, URL Configuration (e.g. `http://localhost:3000/**`). The callback then sends the user to `/auth/reset-password`, and `updatePassword` redirects to `/browse`.
- Google sign-in uses `signInWithOAuth`, which redirects to `${NEXT_PUBLIC_SITE_URL}/auth/callback`. That route calls `exchangeCodeForSession` and then always redirects to `/browse`.
- In server code, use `createClient` from `@/lib/supabase/server` (it's async, so `await` it). In client components, use the one from `@/lib/supabase/client`.

## Reviews

- Each student has at most one review per course. The unique `(course_id, user_id)` constraint enforces it, and `saveReview` upserts on it. Once a student has reviewed, the main button turns into a disabled "You reviewed this course"; editing and deleting are in the ... menu on their own review card.
- The dialog collects rating (stars), workload, grading fairness, attendance, and a 10–2000 character comment. `validateReview` runs on the client first and again in the server action.
- `saveReview` and `deleteReview` call `revalidatePath` on the course page and `/browse`, so the page and list averages update right away. Success shows a sonner toast (`<Toaster />` is in the root layout).
- RLS (only your own review can be inserted, updated or deleted) is the real guard; the actions also filter by `user.id`.

## Styling conventions

- Brand palette. These are Tailwind colors, so write classes like `bg-night`, `text-bone/60` and `border-umber/50`.

  | Token      | Hex       | Use                                                                 |
  | ---------- | --------- | ------------------------------------------------------------------- |
  | `night`    | `#0a0908` | page background                                                     |
  | `bone`     | `#f2f4f3` | body text; with opacity for muted text and faint surfaces (`/3`)    |
  | `white`    | `#ffffff` | headings, text on `wine` buttons                                    |
  | `wine`     | `#49111c` | primary: solid buttons, selected toggles, "You" badge. Too dark for text on night |
  | `sand`     | `#a9927d` | accent: eyebrow labels, links, hover, highlights, focus ring, ratings of 4.0+ |
  | `umber`    | `#5e503f` | borders and dividers (`/50` default, `/60`–`/70` for inputs and buttons) |
  | `signal`   | `#e5645b` | errors; ratings below 3.0                                           |
  | `star`     | `#facc15` | filled stars in `StarRating`                                        |
  | `arts`     | `#f68712` | selected "Arts" type chip (dark text)                               |
  | `business` | `#5e2590` | selected "Business" type chip (white text)                          |
  | `science`  | `#99d420` | selected "Science" type chip (dark text)                            |

  Ratings from 3.0 to 3.9 use neutral `text-bone/60`. Use `ratingTextClass()` from `lib/courses.ts` instead of repeating the tiers.

- Use the tokens, not raw hex values. The only hex values in components are props that need a color string (3D lights, `ShimmerButton`, `FlickeringGrid`).
- The theme is forced to dark (`forcedTheme="dark"` in the layout). The shadcn `.dark` variables in `globals.css` are mapped to the brand palette (background = night, primary = wine, ring = sand, border = umber, destructive = signal), so shadcn components match without overrides.
- Headings use `font-heading font-semibold tracking-tight` and `text-white`. `--font-heading` points at Geist; swap it in `globals.css` to change every heading at once.
- Merge classes with `cn()` from `@/lib/utils`.
- Prettier settings: no semicolons, double quotes, trailing commas (es5), width 80. Tailwind classes get sorted automatically.
- Mark components that use motion, three or hooks with `"use client"`. Keep pages as server components where you can.

## Environment (`.env.local`, gitignored)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`: used for the OAuth redirect.
- `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET`: Supabase Google provider config. The app doesn't read it.

## Gotchas

- **Next 16:** middleware is now `proxy.ts` with a `proxy` export (Node runtime only); don't recreate `middleware.ts`. `cookies()` and `params` are async. Type pages with the global `PageProps<"/route/[param]">` helper.
- **Landing data:** the ledger strip, trending cards and review spotlight are real (see `lib/landing-data.ts`). The spotlight shows each reviewer's avatar (or `DEFAULT_AVATAR`) and `@username`, publicly, on the landing. The hero chips and grade-reveal average are still mock data.
- **Keep the landing static.** Don't use `lib/supabase/server.ts` (it reads cookies) in `app/page.tsx`; that would make every visit query the database. Use `createPublicClient()`. Anything that changes review numbers should call `revalidatePath("/")`.
- `npx shadcn add` may generate `import { cn } from "cn"` and install an npm package called `cn`. Change the import to `@/lib/utils` and `pnpm remove cn`. It also prompts before overwriting `button.tsx`/`input.tsx`; answer no. Run without a terminal (stdin closed), it stops at that prompt after installing dependencies but before writing any file, so write the component from the registry JSON (`https://ui.shadcn.com/r/styles/base-nova/<name>.json`) instead.
- **Lint rejects `setState` called directly in an effect** (`react-hooks/set-state-in-effect`), and some stock shadcn components do it (the carousel did). Read external state with `useSyncExternalStore` instead, as `components/ui/carousel.tsx` and the review-spotlight dots do, or set state inside a subscription callback.
- Use `next/link` `<Link>` for internal links. Lint rejects a plain `<a>` pointing at an existing page.
- **Page titles:** the root layout sets `title.template = "%s | Xourse"`, so a page exports the bare title (`"Login"`, not `"Login | Xourse"`) or it renders as `Login | Xourse | Xourse`.
