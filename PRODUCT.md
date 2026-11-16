# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, confirmed as equal priorities:

- Recruiters and hiring managers evaluating Jason for internships or junior designer/developer roles. They scan quickly to judge visual craft and technical competence, then look for a resume and contact route.
- Freelance clients considering Jason for design, UI/UX, or development work. They need enough evidence of range and quality to start an inquiry.

## Product Purpose

A personal portfolio for Jason Gian Duran that presents him as both a designer and a developer, and converts a visit into either an interview conversation or a freelance inquiry. Success means a visitor leaves with a credible impression of his work and a clear way to reach him.

## Positioning

A hybrid designer-developer: graphic and UI/UX design paired with full-stack implementation, plus a stated interest in ML and AI. The current site copy frames this as work at the intersection of form and function. A design-only or code-only portfolio could not truthfully make that same claim.

## Operating Context

- Visitors arrive by link (LinkedIn, GitHub, resume, direct sharing) and evaluate a single scrolling page.
- The resume PDF (`DURAN-RESUME.pdf`) is an available artifact and a likely evaluation path.
- Contact happens through an in-page form that opens the visitor's email app with the message prefilled, plus direct email, GitHub, and LinkedIn links.
- Evaluation happens on desktop and mobile; the mobile navbar is a first-class surface.

## Capabilities and Constraints

- Single-page React 19 + Vite 7 + Tailwind CSS 4 app, built with Framer Motion; sections are anchor targets (Home, About, Experience, Stack, Projects, Beyond, Contact) with smooth scrolling.
- No backend, CMS, or analytics. The contact form is client-side and hands off to the visitor's email app via `mailto:`.
- `Experiences` and `Skills` are populated from the resume PDF; `Beyond` uses confirmed facets of design, community, and AI curiosity; `Contact` replaces the former empty `Footer` shell.
- The Projects section presents four real projects from the resume: YSEIS, SPACES, SIPAT, and QE 360.
- Not yet decided: which specific public GitHub repositories should be featured.

## Brand Commitments

- Personal identity: Jason Gian Duran, presented first-person as "Jason".
- Voice: direct, warm, first-person, concise.
- Real contact assets: GitHub `github.com/jsonJae`, LinkedIn `jason-gian-duran`, email `jasongian28@gmail.com`.
- Owned assets: `src/assets/logoblack.png` (logo mark), `HeroPic.png`, `AboutMePic.png`, `DURAN-RESUME.pdf`.

## Evidence on Hand

- Public GitHub repositories at `github.com/jsonJae`, confirmed as the primary real work evidence.
- Resume PDF at project root (`DURAN-RESUME.pdf`).
- Portrait and hero imagery in `src/assets/`.
- Absences future work must not fabricate: no project case studies, process write-ups, client names, testimonials, metrics, awards, or press exist yet.

## Product Principles

1. Show real work; never invent projects, clients, or outcomes to fill space.
2. Prove the hybrid claim through both visual craft and working code, not through adjectives.
3. Make the path to contact obvious from anywhere on the page.
4. Keep the first-person voice personal and specific; avoid generic portfolio boilerplate.
5. Prefer a short honest page over empty sections shipped to look complete.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established. Existing interactions include icon buttons and mobile navigation; treat keyboard and screen-reader access as expected baseline quality, not a confirmed standard.
