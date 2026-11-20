import smsGuardianCover from '../assets/projects/sms-guardian-cover.jpg';
import smsGuardianScan from '../assets/projects/sms-guardian-scan.jpg';
import smsGuardianTrace from '../assets/projects/sms-guardian-trace.jpg';
import spacesCover from '../assets/projects/spaces-cover.jpg';
import spacesListings from '../assets/projects/spaces-listings.jpg';
import spacesAdmin from '../assets/projects/spaces-admin.jpg';
import spacesAppliances from '../assets/projects/spaces-appliances.jpg';
import optumAdminOverview from '../assets/projects/optum-admin-overview.jpg';
import optumSessions from '../assets/projects/optum-sessions.jpg';
import optumTeams from '../assets/projects/optum-teams.jpg';
import optumAria from '../assets/projects/optum-aria.jpg';
import optumLanding from '../assets/projects/optum-landing.jpg';

// Curated works. Each project renders as a card that expands into a detail
// sheet. Fields still on placeholders (fill these in as they arrive):
//
//   images   [{ src, alt }]  first one is the cover; 16:9 crops best. Import
//                            files from src/assets so Vite fingerprints them.
//   github   'https://github.com/jsonJae/...'  or null while pending
//   privateCode  true for client or org work whose code is never linked;
//                shows no code link at all instead of the pending placeholder
//   ongoing  true while the project is still being built: adds an "Ongoing"
//            pill, presses the name only part way, and, until images arrive,
//            shows a proof still on the press instead of the image placeholder
//   live     'https://...'  optional; omit when there is no live build
//   figma    'https://www.figma.com/...'  for a design-only concept; links the
//            file and, with no GitHub link, shows no pending code placeholder
//   details  ['One highlight per line.', ...] or null while pending
//
// Until a field is filled, the card and sheet show a marked placeholder.
export const projects = [
    {
        id: 'sms-guardian',
        name: 'SMS Guardian',
        subtitle: 'Spam Message Classifier',
        org: 'Solo project',
        role: 'ML & Full-Stack',
        summary:
            'Trained a TF-IDF and logistic regression spam classifier, then shipped it as a FastAPI service behind a Next.js app that returns a spam-or-ham verdict, a confidence score, and signal checks.',
        tags: ['scikit-learn', 'FastAPI', 'Next.js', 'Docker'],
        images: [
            {
                src: smsGuardianCover,
                alt: "SMS Guardian's landing page: the headline 'Verify suspicious text messages instantly' beside a radar plotting sample messages by spam confidence.",
            },
            {
                src: smsGuardianScan,
                alt: 'The scanner flagging a GCash subsidy message as likely phishing or spam at 97% confidence, with link and prize signals detected.',
            },
            {
                src: smsGuardianTrace,
                alt: 'The pipeline trace walking a message through TF-IDF tokens and a logistic regression score to a spam verdict at 97% confidence.',
            },
        ],
        github: 'https://github.com/jsonJae/spam-sms-classifier',
        live: 'https://smsguardian.jsondu.space/',
        details: [
            'Trained the model in a Jupyter notebook on 5,848 messages, pairing UCI ham with Philippine spam SMS. It scores 0.99 accuracy on a stratified 80/20 split, and the site says plainly that this is a lab result, since each source supplies only one class.',
            'Served the scikit-learn pipeline from FastAPI with Pydantic validation, behind a Next.js route handler so the browser never needs the backend address.',
            'Kept message text in memory only: nothing is written to a database, browser storage, or cookies.',
            'Added browser-side checks for links, urgency, and prize wording, and flagged any verdict under 60% confidence as borderline.',
            'Built a pipeline trace that walks a message through the same steps the API runs, from tokens to TF-IDF to the logistic score and verdict.',
            'Containerized both services with Docker Compose, with GitHub Actions CI that builds, loads the model, and checks sample predictions.',
        ],
    },
    {
        id: 'spaces',
        name: 'SPACES',
        org: 'UPLB',
        role: 'Frontend Developer',
        summary:
            'Co-developed a centralized student accommodation tracker for UPLB, replacing manual forms, spreadsheets, and email threads with one streamlined digital platform.',
        tags: ['SvelteKit', 'PocketBase', 'Go'],
        images: [
            {
                src: spacesCover,
                alt: "SPACES landing page: 'Find your SPACE to stay' beside orbits labeled Browse, Apply, and Track.",
            },
            {
                src: spacesListings,
                alt: 'The dormitory listings: UPLB residence halls shown as photo cards with gender policy, monthly rent, and slot counts.',
            },
            {
                src: spacesAdmin,
                alt: 'The housing admin dashboard with occupancy, semestral revenue, open tickets, and managed residence halls, filled with seed data.',
            },
            {
                src: spacesAppliances,
                alt: "The student billing page's Appliances tab, listing declared appliances with quantities and monthly costs.",
            },
        ],
        github: 'https://github.com/jsonJae/SPACES',
        details: [
            'Worked in a class-wide team split into Dev Pods, each owning one feature end to end, on SvelteKit, Go with PocketBase, and Docker. SPACES stands for Streamlined Platform for Accommodation of Campus & External Stays.',
            'Built the first guest view of accommodation listings: the navbar, the hero, and listing cards with details and pagination.',
            'Built the dorm manager dashboard and the housing admin dashboard, with counts of pending approvals and dorms awaiting submission, a list of all residences, filters, and row actions.',
            "Laid out the transient manager dashboard and a room's occupancy history.",
            'Created the student billing pages for declaring appliances and for rent, including the scholarship discount calculation on the rent tab.',
            'Turned on file polling in Vite so hot reload worked inside the Docker dev containers.',
        ],
    },
    {
        // Client work for Optum, shown with QE 360's permission. The code stays
        // private: never link the repo. Screenshots come from a local run on
        // sample data (the hosted database is gone); the judges' scoring screen,
        // marked confidential in the app, is deliberately left out.
        id: 'qe360',
        name: 'Event Platform',
        subtitle: 'Proposal for Optum',
        org: 'QE 360',
        role: 'Full-Stack Intern',
        summary:
            'A proposal event platform QE 360 built for Optum, with attendee, judge, and admin views, MUX video streaming, and a RAG chatbot backed by Supabase.',
        tags: ['Next.js', 'Supabase', 'MUX'],
        images: [
            {
                src: optumLanding,
                alt: "The attendee landing page: the iFactor 5.0 Event Launch hero with a countdown and links to the schedule and showreel.",
            },
            {
                src: optumAria,
                alt: "ARIA, the event's RAG chatbot, open over Today's Program with its greeting and suggested questions, shown with sample data.",
            },
            {
                src: optumAdminOverview,
                alt: "The admin portal's executive overview for the event: live poll activity, attendee sources, and the Q&A queue, shown with sample data.",
            },
            {
                src: optumSessions,
                alt: "Sessions management listing the day's keynote and team pitches with live, ended, and scheduled statuses, using sample data.",
            },
            {
                src: optumTeams,
                alt: 'The participating teams table with logos, pitch descriptions, and member counts for fictional demo teams.',
            },
        ],
        github: null,
        privateCode: true,
        details: [
            'Worked on an event platform that QE 360 built as a proposal for Optum, during my full-stack internship.',
            'Shipped full-stack features across the attendee, judge, and admin views.',
            'Integrated MUX video streaming with webhooks, secrets, and environment variables for the deployed site.',
            'Built a RAG chatbot on the OpenAI API with Supabase as its knowledge base.',
            'Wrote test charters and ran QA cases against user-story acceptance criteria.',
        ],
    },
    {
        // A hackathon proof of concept: designed in Figma and never built, so
        // it links the Figma file and has no code to wait for. Facts come from
        // the team's concept doc and YSES' post on the award (December 2025).
        id: 'sipat',
        name: 'SIPAT',
        subtitle: 'Resibo ng Bayan',
        org: 'Hack the Flood',
        award: 'Most Innovative',
        summary:
            'A proof-of-concept mobile app, designed in Figma, that gamifies auditing government infrastructure by matching contract promises against geotagged community photos. Offline-first and privacy-preserving.',
        tags: ['Figma', 'Civic Tech', 'Proof of Concept'],
        images: [],
        figma: 'https://www.figma.com/design/cNs5vnDoZM5tcnMBTq87mv/SIPAT?node-id=19-2508',
        github: null,
        details: [
            "Co-created SIPAT with a team of three at Hack the Flood: Digital Rights Hackathon, where it won the Most Innovative award. It's a proof of concept: the app lives in Figma, not in code.",
            "Built the concept around one check anyone can do: near a flood-control project, road, or bridge, the app puts the contract's specs beside the live camera and asks whether they match.",
            'Planned it offline-first for remote barangays with no signal. Photos can only be taken in the app, within 500 m of the project, so every report comes from the site itself.',
            'Designed for whistleblower safety: reporters appear under random aliases, a pin goes public only after three devices report it, and uploads post after a random 2 to 6 hour delay.',
            "Kept the wording neutral, flagging a mismatch rather than corruption, and gave contractors a right to reply with their own evidence.",
            'Let remote users review anonymized photos with a swipe, so a project is flagged only once enough people agree.',
        ],
    },
    {
        // Still being built, so it stays last and shows a proof still on the
        // press instead of screenshots (see ProjectProof). The repo belongs to
        // the YSES org and is private: never link it. Facts come from the
        // YSEIS v2 repo; the proof prints its real tokens from frontend/src/app.css.
        id: 'yseis',
        name: 'YSEIS',
        org: 'YSES',
        role: 'Frontend Lead',
        ongoing: true,
        summary:
            "Leading the frontend of YSES' new inventory system, still in development, which will run equipment lending, event assets, and borrowing approvals for the org's Executive and Visuals & Logistics departments.",
        tags: ['SvelteKit', 'Tailwind CSS', 'TypeScript'],
        images: [],
        github: null,
        privateCode: true,
        details: [
            'Leading the frontend team on YSEIS v2, a pnpm monorepo with a SvelteKit and Svelte 5 frontend, a SvelteKit API on Neon Postgres, and Zod contracts shared by both.',
            'Set up Tailwind CSS 4 and turned the YSEIS design system into tokens: the brand blues, six item statuses from available to removed, a 4px spacing grid, radii, and a type scale.',
            'Wrote the design rules every screen follows, for teammates and AI coding agents alike: 44px tap targets, one focus ring, Lucide icons, and short sentence-case copy.',
            "Scaffolded the UI, layout, and feedback component folders, a token showcase page, and the frontend's Vitest suite with an 80% coverage gate.",
            "Fixed a SvelteKit SSR error in the tests by giving each workspace its own test runner.",
            'Next up: the member and admin screens, built on these tokens.',
        ],
    },
];
