# StudyMentor AI

StudyMentor AI is a next-generation collaborative AI learning platform built on Next.js 16 App Router.

It features a unified single-repository structure where both the user interface and backend API handlers live under `src/app/`, making it optimized for deployment on **Vercel**.

---

## 🏗️ Architecture & Structure

```
.
├── src/
│   └── app/
│       ├── api/
│       │   └── hello/
│       │       └── route.ts     # Backend API Route Handler
│       ├── globals.css          # Global Tailwind CSS styles
│       ├── layout.tsx           # Root layout component
│       └── page.tsx             # Interactive dashboard page
├── public/                      # Static assets
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
└── vercel.json                  # Vercel deployment configuration
```

---

## 🚀 Getting Started

### Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

Deploying this project to Vercel requires **zero configuration**:

1. Push your code to GitHub, GitLab, or Bitbucket.
2. Import the repository in [Vercel](https://vercel.com).
3. Vercel automatically detects Next.js and deploys both the frontend and API routes instantly!
