## AI coding guide for this repo (moisotalk)

This is a minimal Next.js 15 (App Router) app using React 19 and Tailwind CSS v4, built/run with Turbopack.

### Architecture and layout
- App Router lives under `src/app/`.
  - `src/app/layout.tsx` defines root HTML, loads Geist fonts via `next/font`, sets CSS variables on `<body>`, and exports `metadata`.
  - `src/app/page.tsx` is the home route; uses `next/image` and Tailwind utility classes.
- Static assets are in `public/` (e.g., `public/next.svg`, `public/file.svg`). Reference them with `/asset.svg` in `next/image`.
- Tailwind v4 is enabled via PostCSS (`postcss.config.mjs` uses `@tailwindcss/postcss`) and a single import in `src/app/globals.css`.
- TypeScript is strict; path alias `@/*` maps to `./src/*` (see `tsconfig.json`).

### Build, run, debug
- Dev server: `pnpm dev` (Next + Turbopack) at http://localhost:3000 with HMR.
- Production build: `pnpm build` (Turbopack) then `pnpm start`.
- Type-checking runs via TS config (`noEmit: true`). There is no ESLint config in this repo.

### Project conventions and patterns
- Fonts: `next/font/google` loads Geist; `layout.tsx` applies `className="${geistSans.variable} ${geistMono.variable} antialiased"` on `<body>`. If you add fonts, follow this pattern and expose CSS variables for Tailwind to consume.
- Tailwind theming: `src/app/globals.css` defines tokens with `@theme inline` mapping CSS variables:
  - `--font-sans` and `--font-mono` are connected to the `next/font` variables.
  - Color tokens: `--color-background`, `--color-foreground`; dark mode via `prefers-color-scheme: dark`.
  - Use utilities like `font-sans`, `font-mono`, and `bg-background text-foreground` in components.
- Images: prefer `next/image` for local files in `public/` and remote if configured.
- Routing: create routes as folders under `src/app/<route>/page.tsx`. Layouts per route are `src/app/<route>/layout.tsx`.
- Client vs server components: components are server by default. Add `'use client'` at the top of files needing state, effects, or event handlers.
- Imports: prefer the `@/*` alias, e.g., `import X from "@/app/page"` or `@/lib/foo` once such modules exist.

### Examples from this codebase
- Root layout font wiring: see `src/app/layout.tsx` using `Geist` and `Geist_Mono` and applying their `.variable` classes.
- Tailwind tokens in use: `src/app/page.tsx` uses `font-sans` and `font-mono` classes; colors derive from `globals.css` tokens.
- Image usage: `src/app/page.tsx` imports `next/image` and references `/next.svg` from `public/`.

### Adding a new page quickly
1) Create `src/app/about/page.tsx` exporting a React component (server by default).
2) Style with Tailwind using the existing theme tokens, e.g., `className="font-sans bg-background text-foreground p-6"`.
3) For interactivity (click handlers, state), add `'use client'` to the top of the file or move interactive parts into a client component.

### Integration points
- Next.js configuration is minimal (`next.config.ts`); no custom rewrites or images domains are declared yet.
- PostCSS pipeline: `@tailwindcss/postcss` only. Tailwind config file is not present; rely on v4 defaults and `@theme` tokens in CSS.

### Gotchas and tips
- When changing `globals.css` theme tokens, use the defined CSS variable names to keep Tailwind tokens (`bg-background`, `text-foreground`, etc.) working.
- Turbopack is used for both dev and build; if you hit an unsupported plugin/loader scenario, consider removing `--turbopack` in scripts locally to compare behavior.
- Keep routes and assets under `src/app/` and `public/` respectively; avoid placing page files outside `src/app/`.

If anything here is unclear or you want me to capture more conventions (e.g., preferred file/folder naming, testing setup), tell me and I’ll update this guide.
