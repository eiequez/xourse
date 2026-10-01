# Progress

_Last updated: 2026-09-30. Git history: `41a962b` initial commit (2026-08-09), `a724efa` base layer (2026-08-18)._

Overall: the landing-page UI and auth plumbing are built, and the DB schema exists (empty). `/browse` is built; course pages and the review UI are not started.

## Done

- [x] Next 16, Tailwind v4 and shadcn (base-nova) project setup; Prettier and ESLint configured.
- [x] Brand palette and theme tokens in `app/globals.css`; dark theme forced.
- [x] Landing page (`app/page.tsx`), with every section animated:
  - [x] Hero: 3D graduation cap (toss-in and cursor parallax), orbiting rating chips, shimmer CTA.
  - [x] Ledger marquee of course codes and ratings.
  - [x] How-it-works: a scroll-linked 3-step timeline.
  - [x] Grade reveal: a scroll-driven average-rating counter.
  - [x] Trending electives: tilt cards (max 4; 1, 2, then 4 columns).
  - [x] Review spotlight: shadcn carousel of the newest 5 reviews (swipe, arrows, dots).
  - [x] Final CTA and footer.
- [x] Supabase SSR clients (`lib/supabase/client.ts`, `lib/supabase/server.ts`).
- [x] Email/password signup and login server actions, with validation and error display.
- [x] Google OAuth action and `/auth/callback` code-exchange route.
- [x] "Check your email" page after signup.
- [x] `proxy.ts` (renamed from `middleware.ts` for Next 16): session refresh, protects `/browse`, redirects logged-in users away from `/auth/*`.
- [x] After a successful login, signup, OAuth sign-in or email confirmation, the user always lands on `/browse`.
- [x] Fraunces font loaded; GLB preload path fixed; landing links point at `/browse`; lint errors cleared; `pnpm typecheck` and `next build` pass.
- [x] `signOut` server action (`lib/actions/auth.ts`), called from the navbar user menu.
- [x] **Landing: real ledger strip and trending electives** (2026-09-29): `course_rating_stats` view, cookie-less public client, `app/page.tsx` static with hourly revalidation plus `revalidatePath("/")` on review changes. Trending = most reviewed courses (max 5); strip = reviewed courses then random "new" ones.
- [x] **requests.md batch** (2026-09-29):
  - Review cards (outlined, tweet-style header with name, @username, time), ... menu on your own review (Edit / Delete), disabled "You reviewed this course" button, Pencil icon.
  - Profile popover on reviewer avatar/name (avatar, name, @username, bio).
  - Auth pages rebuilt on shadcn login-02 / signup-02 (Full name field, Google, no Apple), right-hand cover `public/auth-cover.jpg` over a gradient (image not added yet).
  - Password reset (`/auth/forgot-password` -> email -> `/auth/reset-password`).
  - Sign-up limited to @gmail.com, @mail.ru, @outlook.com, @xmu.edu.my (DB trigger + action check); existing accounts unaffected.
  - `/account`: photo upload (Supabase Storage `avatars`), name, username (format + uniqueness check), bio; navbar menu has Account. Default avatar `public/default_pfpf.png`.
- [x] **Write, edit and delete your own review** (2026-09-29): "Write a review" / "Edit your review" button in the rating band and the empty state opens a dialog (stars, workload, grading fairness, attendance, comment; the optional lecturer field was removed later). Server actions in `app/browse/[id]/actions.ts` upsert or delete, then revalidate. Delete asks for confirmation. Reviews now show workload / grading / attendance badges.
- [x] **Course page `/browse/[id]`** (2026-09-29):
  - Breadcrumb, colored type badge, code, credits, title.
  - About card; leading "Restriction / Note / Requirement / Pre-requisite" sentences become a "Before you enroll" notice.
  - Assessment card: parts sorted by weight, stacked bar, icon per kind, "X% exams, Y% coursework" summary.
  - Rating band: big average (NumberTicker), large stars, "Based on N reviews", 5-to-1 distribution bars.
  - Reviews: username + avatar, "You" badge, stars, relative time (full date on hover), "Edited", sort (newest/oldest/highest/lowest), show 10 more at a time, empty state.
  - `loading.tsx`, `not-found.tsx`, per-course page title.
- [x] **Restyle** (2026-09-29): Geist and Geist Mono everywhere (Poppins and Fraunces removed); new palette `midnight` / `mist` / `lagoon` / `frost` / `signal` replaces ink / parchment / brass / sage across the landing page, auth pages and `/browse`; auth pages no longer hardcode hex.
- [x] **`/browse`** (2026-09-29):
  - Navbar with wordmark and avatar menu (name, email, sign out); shared `/browse` layout with footer.
  - Header, search (code or name, ignores case and spaces, `/` focuses it, Esc clears), course-type chips, sort.
  - Ledger rows: code, name, credits, review count, and the average as 5 yellow stars (exact partial fill, grey when unrated) plus the number. Desktop column headers sort; phones get a sort menu.
  - Type chips take their own color when selected: All white, Arts `#f68712`, Business `#5e2590`, Science `#99d420`. Workload and grading are not shown in the list (they belong on the course page).
  - Filters live in the URL (`?q=&type=&sort=`). Empty states for "no courses yet" and "no matches". `loading.tsx` skeleton.
  - shadcn dark tokens mapped to the brand palette.
- [x] **DB schema** (2026-09-29, migration `supabase/migrations/20260929110704_fix_review_schema.sql`):
  - `profiles` (auto-created at signup), `courses`, `reviews`, `review_likes`, all with RLS.
  - `reviews` has overall `rating`, `workload`, `grading_fairness`, `attendance`, `lecturer`, `comment`; one per user per course; `updated_at` trigger.
  - Likes are rows in `review_likes` (one per user per review), not a counter.
  - Generated types in `lib/supabase/database.types.ts`; both clients use them.
- [x] **Metadata and favicon** (2026-09-30): root `metadata` in `app/layout.tsx` (`metadataBase` from `NEXT_PUBLIC_SITE_URL`, `%s | Xourse` title template, description, keywords, Open Graph, Twitter card, robots) and a `viewport` export for `theme-color`. Child routes now set bare titles so the template appends the brand once. `app/robots.ts` disallows the login-walled `/browse`, `/account` and `/auth/`. `favicon.ico` moved from `public/` to `app/`.

- [x] **Dependency cleanup** (2026-09-30): Next 16.3.6; `shadcn` (CLI, only used for `@import "shadcn/tailwind.css"` at build time) and `@types/three` moved to devDependencies; unused `framer-motion` and `@splinetool/react-spline` removed. `pnpm audit --prod` is clean.

- [x] **Landing mobile pass, requests.md batch 2** (2026-09-30):
  - Hero:
    - Below `lg` the cap sits above centered copy: 260px tall on phones, 340px on tablets.
    - The chip orbit shrinks to the cap's box (ResizeObserver): 96px at 320 wide, 130px at 390, 170px on tablets, 300px on desktop.
    - On touch screens (`(hover: none)`) the cap turns with page scroll instead of the cursor.
    - The canvas caps DPR at 1.5 and stops rendering off-screen (`frameloop` driven by `useInView`). The idle drift counts rendered time only, so it doesn't jump when rendering resumes.
  - `public/graduation_hat.glb` is meshopt-compressed: 2.49 MB to 422 KB, with the same meshes, materials and triangle count.
  - Trending:
    - Max 4 cards; the whole card is one link, with a single padding.
    - Grid is 1, 2, then 4 columns (4 only from `xl`).
    - Phones get a "View all electives" link under the cards.
    - `TiltCard` was replaced by `Tilt` + `ClippedCircle`, and `tilt-card.tsx` deleted.
  - Review spotlight:
    - The 300vh scroll-driven strip is replaced by the shadcn carousel (`embla-carousel-react`) with the newest 5 reviews.
    - Dots and arrows sit under the cards and hide when everything fits.
    - Carousel state is read with `useSyncExternalStore` to satisfy lint.
  - Phone spacing and type sizes for how-it-works, grade-reveal (`h-svh`, number stacked over its label), final CTA and footer. `overflow-x-clip` on the landing `<main>`.
  - Checked in headless Chrome at 320, 390, 768, 1100 and 1440 wide: no sideways scroll; carousel next/dots work.
  - README rewritten (setup, Supabase, deploying to Vercel, known gaps).

## Partial or broken

- [ ] **Dead CTAs.** The final-CTA button has no action, and "Rate a course you took" in the hero is plain text, not a link.
- [ ] **3D model colors:** the books in `public/graduation_hat.glb` are saturated blue and red, which clash with the teal palette. They could be retinted in code by overriding the materials.
- [ ] **Lint: 0 errors, 3 warnings left.** Unused `DotPattern` import in `grade-reveal.tsx` and unused `dotScale` in `how-it-works.tsx` (both belong to commented-out code), and `_childRef` in `highlight.tsx`.
- [ ] **Unused files:** `ScrollProgress.tsx`, `public/default_pfpf.png` (meant as the default avatar), and several `components/ui/*` (dock, menubar, border-beam, number-ticker, ...).

## Not started

- [ ] **Supabase database, remaining work.**
  - Aggregates (per-course averages and review counts, site-wide average).
  - Seed course list.
  - The tables created before the migration (from the dashboard) have no SQL in `supabase/migrations/`.
  - Advisor warnings still open:
    - Older RLS policies on `profiles` and `reviews` call `auth.uid()` per row; wrap it as `(select auth.uid())`.
    - `handle_new_user()` and `rls_auto_enable()` are SECURITY DEFINER and callable through `/rest/v1/rpc`; revoke EXECUTE from `anon` and `authenticated`.
    - Leaked password protection is off in Supabase Auth settings.
- [ ] **Real data on the landing page, remaining:** grade-reveal average and hero chips (ledger strip, trending and review spotlight are done).
- [ ] **Profile page** (the user menu only has sign out).
- [ ] **Framework pages:** `error.tsx` and a root `not-found.tsx` (`loading.tsx` exists for `/browse` and `/browse/[id]`).
- [ ] **Terms and Privacy pages.**
- [ ] **Tests.**
- [ ] **Deployment** (in progress, 2026-09-30): Vercel project `xourse`, domain `www.xourse.online`.
  - The first builds failed with `supabaseUrl is required` because the Vercel project had no environment variables.
  - Remaining in Vercel: add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_SITE_URL=https://www.xourse.online`, then redeploy.
  - Remaining in Supabase Auth: set the Site URL, and add `https://www.xourse.online/**` to Redirect URLs.

## Next steps (suggested order)

1. ~~Quick fixes~~ (done 2026-09-29). Remaining small ones: the 8 lint warnings.
2. **DB:** schema, RLS and types are done. Remaining: seed courses, a view or RPC for aggregates, and the advisor warnings above.
3. **Enforce the XMUM email domain:**
   - Check it in the signup action.
   - Pass the `hd` param to Google OAuth.
   - Re-check the domain in the callback.
   - Optionally add a Supabase auth hook or trigger that rejects other domains.
4. ~~Navbar and `/browse`~~ (done 2026-09-29). It shows the empty state until courses are seeded.
5. ~~Review form~~ (done 2026-09-29). Possible follow-ups: show course-level workload / grading averages on the course page; review likes (`review_likes` table exists, no UI).
6. **Wire the landing sections to real data** and fix the CTAs.
7. **Polish:** Apple button (remove or implement), Terms and Privacy, loading and error states, mobile pass for the pages past the landing (landing done 2026-09-30).
8. **SEO leftovers:** an `app/opengraph-image.tsx` (shared links currently unfurl with no image), and JSON-LD `Course` + `AggregateRating` on the course page if `/browse` is ever made public. A sitemap is pointless while everything but `/` sits behind the login wall.
9. **Ship:** lint and typecheck clean, ~~README~~ (done 2026-09-30), deploy, production auth redirect URLs. **Set `NEXT_PUBLIC_SITE_URL` to the real domain** — `metadataBase` and every `og:url` come from it, so leaving it at `http://localhost:3000` ships localhost URLs in the Open Graph tags.
