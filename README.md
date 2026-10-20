# Tarek Goda | Portfolio

A personal portfolio built with **Angular 22**, **Tailwind CSS** and **Supabase**. Visitors can browse projects and certifications and download the CV. The owner manages everything from a protected admin dashboard, with no code changes needed.

**Live:** https://my-portfolio-zie8.vercel.app/#/

## Features

**Public site**
- Hero with an SVG path-drawing animation of the name and the line "Make art, not war"
- Animated TG logo that draws itself on load, plus a matching favicon
- Projects list with expandable rows (poster, description, live and source links open in a new tab)
- Experience timeline, certifications and grouped skills
- Downloadable CV (always the latest uploaded version)
- Contact page with Gmail, LinkedIn and GitHub links and a form that opens a prefilled email
- Smart email opening: Gmail app on Android and iOS when installed, Gmail on the web otherwise
- Light and dark themes, mobile-first responsive layout

**Admin dashboard** (`/admin`)
- Email and password login, guarded by a route guard and Supabase Row Level Security
- Projects CRUD: title, description, poster upload or URL, demo and repository links, tags, order
- Certificates CRUD: title, issuer, date, credential link, badge image, skills, order
- CV management: upload, replace and delete the active PDF

**Engineering**
- Standalone components, Signals, modern control flow (`@if`, `@for`), typed reactive forms
- Lazy-loaded routes with a CSS spinner while pages load
- SEO: dynamic title and meta tags, Open Graph, canonical link, JSON-LD (`Person`)
- Accessibility: semantic HTML, keyboard-friendly accordions, focus styles, `prefers-reduced-motion` support

## Tech Stack

| Area | Tools |
|---|---|
| Framework | Angular 22 (standalone, Signals) |
| Styling | Tailwind CSS v4 |
| Backend | Supabase (Auth, Postgres, Storage) |
| Language | TypeScript |
| Hosting | Vercel |

## Project Structure

```
src/app/
├── core/
│   ├── guards/      # adminGuard
│   ├── models/      # Project, Certificate types
│   └── services/    # supabase, auth, projects, certificates, resume, seo, email, loading
├── layout/          # navbar, footer, public-layout, admin-layout
├── pages/           # home, projects, contact, not-found
├── admin/           # login, dashboard, projects-manager, project-form,
│                    # certificates-manager, certificate-form, resume-manager
└── shared/          # spinner, project-card, certificate-card, hero-draw-name, logo, icon
supabase/
├── schema.sql        # projects, resume, RLS policies, storage buckets
└── certificates.sql  # certificates table, RLS, storage bucket, initial data
vercel.json           # SPA rewrite so deep links work
```

Separation of concerns: components handle presentation, state lives in Signals inside services, and all Supabase calls are isolated in the services.

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Tarek-goda/My-Portfolio.git
cd My-Portfolio
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run `supabase/schema.sql`, then `supabase/certificates.sql`.
3. In both files, replace the admin email in the policies with your own before running them.
4. Go to **Authentication → Users → Add user**, create the admin account with the same email, and enable **Auto Confirm User**.
5. Disable public sign-ups: **Authentication → Sign In / Providers → Email → Allow new users to sign up** (off).

### 3. Configure the environment

Create `src/environments/environment.ts` and `environment.development.ts`:

```ts
export const environment = {
  supabaseUrl: 'https://YOUR-PROJECT.supabase.co',
  supabaseAnonKey: 'YOUR-PUBLISHABLE-KEY',
};
```

Use only the public **anon / publishable** key. Never put a `service_role` or secret key in this project.

### 4. Run

```bash
ng serve
```

Open `http://localhost:4200`. The admin login is at `/admin/login`.

## Scripts

| Command | Description |
|---|---|
| `ng serve` | Start the dev server |
| `ng build` | Production build in `dist/` |

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import it in Vercel. The Angular preset is detected automatically.
3. Check the output directory (`dist/portfolio/browser`, matching the project name in `angular.json`).
4. No environment variables are needed, because the public Supabase keys live in the environment files.

`vercel.json` rewrites every route to `index.html`, so deep links such as `/projects` and `/admin/login` keep working after a refresh.

## Security Notes

- Write access is enforced in the database through Row Level Security, not only in the Angular guard. Anyone can read, only the admin email can write.
- The publishable key is designed to be public. Protection comes from the RLS policies.

## Author

**Tarek Goda**, Front-End Developer (Angular)

[LinkedIn](https://www.linkedin.com/in/tarekgoda22/) · [GitHub](https://github.com/Tarek-goda)