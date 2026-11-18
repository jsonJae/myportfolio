import smsGuardianCover from '../assets/projects/sms-guardian-cover.jpg';
import smsGuardianScan from '../assets/projects/sms-guardian-scan.jpg';
import smsGuardianTrace from '../assets/projects/sms-guardian-trace.jpg';
import spacesCover from '../assets/projects/spaces-cover.jpg';
import spacesListings from '../assets/projects/spaces-listings.jpg';
import spacesAdmin from '../assets/projects/spaces-admin.jpg';
import spacesAppliances from '../assets/projects/spaces-appliances.jpg';

// Curated works. Each project renders as a card that expands into a detail
// sheet. Fields still on placeholders (fill these in as they arrive):
//
//   images   [{ src, alt }]  first one is the cover; 16:9 crops best. Import
//                            files from src/assets so Vite fingerprints them.
//   github   'https://github.com/jsonJae/...'  or null while pending
//   live     'https://...'  optional; omit when there is no live build
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
        id: 'yseis',
        name: 'YSEIS',
        org: 'YSES',
        role: 'Frontend Lead',
        summary:
            "Leading the frontend team of YSES' Inventory System, a platform that digitizes how the organization tracks and manages its equipment and supplies.",
        tags: ['Frontend Lead', 'Inventory System', 'YSES'],
        images: [],
        github: null,
        details: null,
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
        id: 'sipat',
        name: 'SIPAT',
        subtitle: 'Ang Resibo ng Bayan',
        org: 'Hack the Flood',
        award: 'Most Innovative',
        summary:
            'An offline-first, privacy-preserving mobile app that gamifies auditing government infrastructure, matching contract promises against geotagged community photos.',
        tags: ['Flutter', 'Hive', 'Civic Tech'],
        images: [],
        github: null,
        details: null,
    },
    {
        id: 'qe360',
        name: 'QE 360',
        subtitle: 'Event Platform',
        org: 'QE 360',
        role: 'Full-Stack Intern',
        summary:
            'Built full-stack features across attendee, judge, and admin views, integrated MUX video streaming, and shipped a RAG chatbot backed by Supabase.',
        tags: ['Next.js', 'Supabase', 'MUX'],
        images: [],
        github: null,
        details: null,
    },
];
