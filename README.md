# CareerAI

A modern career management platform built with Next.js, featuring AI-powered resume analysis and job matching.

## Features

- 🔐 Secure authentication with Clerk
- 🌓 Dark/Light mode support
- 📊 ATS score analysis
- 📝 Resume management
- 🔍 Job tracking
- 💼 Professional profile management

## Tech Stack

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Clerk Auth](https://clerk.com/)
- [Supabase](https://supabase.com/)
- [tRPC](https://trpc.io/)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/sanjaymalladi/career-ai.git
cd career-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The project is configured for deployment on Netlify. The `netlify.toml` file contains the necessary build configuration.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

-[] connect with netlify
-[] connect frontend to backend
-[] make ui better
-[] make carrer ai to carrer advise
-[] add api to find jobs
-[] add opensource logic and api for ats score
-[] add tips on how to improve linkedin and github and tips like projects and skills to learn