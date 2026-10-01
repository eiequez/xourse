# Xourse

Xourse is where XMUM (Xiamen University Malaysia) students rate and review the electives they have taken, so the next batch can choose theirs knowing what they are signing up for. It runs at https://www.xourse.online.

Each review has:

- an overall rating out of five
- how heavy the workload was
- how fair the grading felt
- how strict attendance was
- a written comment

You need an account to read or write reviews.

## What's in it

- **Landing page.** Shows the most reviewed electives, a strip of course codes with their current averages, and a few recent reviews.
- **The course list at `/browse`.**
  - Search by code or title.
  - Filter by type (arts, business, science).
  - Sort by rating, number of reviews or course code.
  - Filters are kept in the URL, so a filtered list can be shared as a link.
- **A page for every course.** It has:
  - the description
  - anything you should know before enrolling (restrictions, prerequisites)
  - how the grade splits between exams and coursework
  - the rating breakdown
  - the reviews
- **Reviews.** One per student per course. You can edit or delete your own later.
- **Accounts.**
  - Sign in with email and password or with Google.
  - Password reset.
  - An account page for your photo, name, username and a short bio.
- **Restricted sign-up.** Only a few email domains can sign up (see below). The aim is XMUM students only, but that is not enforced yet.

## Stack

- **Framework:** Next.js 16 (App Router, Server Components), React 19, TypeScript
- **UI:** Tailwind CSS v4 and shadcn/ui on Base UI, plus a few Magic UI and Unlumen UI components
- **Backend:** Supabase for auth, Postgres and file storage
- **Animation and 3D:** Motion, and three.js through React Three Fiber for the graduation cap on the landing page
- **Tooling:** pnpm, ESLint, Prettier

## Running it locally

**1. Install.** You need Node 20.9 or newer, pnpm, and a Supabase project (the next section covers what the project needs).

```bash
git clone https://github.com/eiequez/xourse.git
cd xourse
pnpm install
```

**2. Add environment variables.** Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- The URL and the publishable key are shown when you click **Connect** on your project in the Supabase dashboard.
- `NEXT_PUBLIC_SITE_URL` is where auth emails and Google sign-in send people back to. Locally, that is the dev server.
- All `.env*` files are gitignored.

**3. Run it.**

```bash
pnpm dev
```

Then open http://localhost:3000. Browsing, course pages and your account all need an account, so sign up first.

`pnpm build` renders the landing page from the database. Without the variables above it fails with `supabaseUrl is required`.

## Supabase setup

### Tables

Row level security is on for every table. Anyone can read them; writes are limited as described below.

- **`profiles`:** one row per user, created by a trigger at sign-up. Holds the username, full name, avatar URL and bio. Users can only change their own.
- **`courses`:**
  - Columns: code, name, credits, type (`arts`, `business` or `science`), description, and `assessment_methods`.
  - `assessment_methods` is a JSON object that maps each assessment to its weight, for example `{"Final Examination": 40, "Group Project": 30, "Quizzes": 30}`.
  - There are no write policies, so the app itself cannot change courses.
- **`reviews`:**
  - Columns: rating, workload, grading fairness, attendance (`strict`, `tracked` or `friendly`) and the comment.
  - A unique constraint on course and user keeps it to one review per student per course.
- **`review_likes`:** one row per like. The table exists, but the app does not use it yet.
- **`course_rating_stats`:** a view with the review count and the average rating, workload and grading for each course. The landing page reads from it.

### Profile photos

They live in a public storage bucket called `avatars`:

- 2 MB limit.
- JPG, PNG or WebP.
- Each user can only write inside the folder named after their user id.

### Migrations

The files in `supabase/migrations/` will not build a database from scratch. The base tables (`profiles`, `courses` and `reviews`) were first created in the Supabase dashboard, and the folder only holds the changes made after that.

To set up a new project:

1. Create those three tables first. The columns are listed in `lib/supabase/database.types.ts`.
2. Apply the migrations in order.

### Adding courses

Courses are added by hand, in the SQL editor or with the service role key:

```sql
insert into public.courses
  (course_code, course_name, credit_amount, type, description, assessment_methods)
values
  ('G0000', 'Example Elective', 2, 'arts', 'What the course covers.',
   '{"Final Examination": 50, "Essay": 30, "Quizzes": 20}');
```

### Auth

- **Redirect URLs.** Under Authentication, URL Configuration:
  - Set the Site URL to the production address.
  - Add every address the app runs on to Redirect URLs, for example `http://localhost:3000/**` and `https://www.xourse.online/**`.
  - Email confirmation, Google sign-in and password reset all come back through `/auth/callback`. Supabase refuses to redirect anywhere that is not on the list.
- **Google sign-in.**
  - Enable the Google provider and paste in the client ID and secret from Google Cloud.
  - Google sends people back to Supabase's own callback URL (shown on the provider page), not to this app.
- **Email domains.**
  - A trigger on `auth.users` (`enforce_email_domain`) rejects sign-ups unless the email ends in `@gmail.com`, `@mail.ru`, `@outlook.com` or `@xmu.edu.my`. It applies to Google sign-in as well.
  - `lib/allowed-emails.ts` has the same list, used for the error message on the form. Change both together.

## Scripts

| Command          | What it does                              |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Dev server on port 3000                   |
| `pnpm build`     | Production build                          |
| `pnpm start`     | Serves the production build               |
| `pnpm lint`      | ESLint                                    |
| `pnpm typecheck` | TypeScript check, no output               |
| `pnpm format`    | Prettier over every `.ts` and `.tsx` file |

## Project layout

```
app/                  routes: landing page, /browse, /browse/[id], /account, /auth/*
components/sections/  landing page sections
components/browse/    course list, search and filters
components/course/    course page and the review UI
components/ui/        shadcn and Magic UI components
lib/                  Supabase clients, data queries, validation, helpers
proxy.ts              refreshes the session and guards the logged-in routes
supabase/migrations/  SQL applied to the database
```

Next.js 16 renamed `middleware.ts` to `proxy.ts`, and a few other APIs changed. If something about the framework looks unfamiliar, the docs for the installed version are in `node_modules/next/dist/docs/`.

## Deploying

The site runs on Vercel.

**1. Import the repo.** The defaults work: Vercel detects Next.js and pnpm on its own.

**2. Add the environment variables in the Vercel project settings.** `.env.local` never leaves your machine, so Vercel needs its own copy:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`: the production address with no trailing slash, e.g. `https://www.xourse.online`

**None of these are secrets.**

- Anything starting with `NEXT_PUBLIC_` is sent to the browser anyway, and the publishable key is meant to be public.
- Row level security is what protects the data.
- The one key that must stay private is Supabase's secret (service role) key. Never put it in a `NEXT_PUBLIC_` variable.

**Two things that are easy to miss:**

- **Redeploy after changing a variable.** `NEXT_PUBLIC_` values are baked in when the site is built, so the running site keeps the old value until the next deploy.
- **Pick one version of a custom domain.** With or without `www`, make the other one redirect to it. Use that exact address in `NEXT_PUBLIC_SITE_URL` and in the Supabase redirect URLs. Google sign-in fails if it starts on one domain and comes back on the other.

The landing page is static and rebuilt at most once an hour. Saving or deleting a review rebuilds it straight away.

## Known gaps

- There are no tests.
- The course codes circling the 3D cap and the average in the big number section are still placeholder data.
- Review likes have a table but no UI.
- There are no Terms or Privacy pages yet.
