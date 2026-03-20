# Future Steps for Production Readiness

## Supabase Setup
- [ ] Create a project on Supabase.
- [ ] Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` based on your project API keys.
- [ ] Obtain Database connection strings and place them in `DATABASE_URL` and `DIRECT_URL`.
- [ ] Ensure Email Auth is enabled in your Supabase Auth Providers settings.

## Prisma Setup
- [ ] Review `prisma/schema.prisma` to ensure the `User` table maps correctly to what you need alongside Supabase's `auth.users`, or rely purely on Supabase auth.
- [ ] Run `npx prisma db push` or `npx prisma migrate dev` to sync schema with database.
- [ ] Run `npx prisma generate` to generate the TypeScript client.

## Application Logic
- [ ] Connect custom UI behaviors to the `/dashboard`.
- [ ] Review Next.js Middleware (`middleware.ts`) to ensure protected paths remain secure based on your routing needs.
- [ ] Consider extending `auth.actions.ts` for password resets or OAuth logins (e.g., Google, GitHub).

## Deployment
- [ ] Commit all code to a Git repository.
- [ ] Set up a Vercel deployment and insert environmental variables.
- [ ] Prepare post-build scripts for Prisma (`"postinstall": "prisma generate"` can be added to package.json).

## CAS Upload Storage Configuration
- [ ] In the Supabase dashboard, create a Storage Bucket named `cas_uploads`.
- [ ] Make the bucket public or configure Row Level Security (RLS) policies allowing authenticated users to upload their PDFs.
