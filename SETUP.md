# LimitlessAI Pro - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup

Copy `.env.local.example` to `.env.local` and fill in:

```bash
cp .env.local.example .env.local
```

#### Required Environment Variables:

**Clerk Authentication:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - From [clerk.com](https://clerk.com) dashboard
- `CLERK_SECRET_KEY` - From Clerk dashboard
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - Default: `/auth/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - Default: `/auth/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` - Default: `/dashboard`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` - Default: `/onboarding`

**Supabase Database:**
- `NEXT_PUBLIC_SUPABASE_URL` - From [supabase.com](https://supabase.com) project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase API keys
- `SUPABASE_SERVICE_ROLE_KEY` - From Supabase API keys (service role)

**OpenAI API:**
- `OPENAI_API_KEY` - From [openai.com](https://openai.com/account/api-keys)

**Application:**
- `NEXT_PUBLIC_APP_URL` - Default: `http://localhost:3000`
- `NEXT_PUBLIC_API_URL` - Default: `http://localhost:3000/api`

### 3. Setup Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create a project
2. Get your API keys from Dashboard → API Keys
3. Set up your authentication URLs to match the app routes

### 4. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the SQL schema from `supabase/schema.sql`:
   ```sql
   -- Paste entire content from supabase/schema.sql
   ```
3. Get your API keys from Settings → API

### 5. Verify OpenAI API Key

- Ensure you have access to GPT-4 Vision API
- Check your usage limits at [openai.com](https://openai.com/account/billing/overview)
- The app uses `gpt-4-vision-preview` model

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
/app                          # Next.js App Router
  /api                        # API routes
    /meal/analyze            # Analyze food photos
    /meals                   # CRUD meals
    /nutrition/today         # Daily nutrition
    /analytics               # Analytics data
  /dashboard                 # Protected dashboard
  /auth                      # Auth pages
  /onboarding               # Setup profile
  layout.tsx                # Root layout
  page.tsx                  # Home page

/components                   # React components
  /ui                       # Base UI components
  /dashboard                # Dashboard components
  /meal                     # Meal components
  /auth                     # Auth components
  /common                   # Shared components

/lib                        # Utilities & helpers
  supabase.ts              # Supabase client
  openai.ts                # OpenAI integration
  utils.ts                 # Helper functions

/hooks                      # Custom React hooks

/types                      # TypeScript types

/public                     # Static assets

/supabase                   # Supabase config
  schema.sql               # Database schema
```

## 🔧 Key Features Implementation

### AI Meal Analysis (`/api/meal/analyze`)
1. Receives image file upload
2. Stores in Supabase Storage (`meal-images` bucket)
3. Sends to OpenAI GPT-4 Vision API
4. Extracts: food items, portions, calories, macros
5. Saves meal log to database

### Dashboard (`/dashboard`)
1. Daily nutrition summary
2. Macro breakdown chart
3. Today's meal list
4. Meal scanner component

### Meal Tracking
- Upload photos with drag-drop
- Manual meal entry
- Edit/delete meals
- Search & filter by date
- Export history

## 📊 Database Schema

### meals
- `id` - UUID primary key
- `user_id` - Clerk user ID
- `image_url` - Supabase storage URL
- `meal_type` - breakfast/lunch/dinner/snack
- `description` - Food description
- `calories, protein, carbs, fat, fiber` - Nutrition data
- `items` - JSONB array of food items
- `created_at, updated_at` - Timestamps

### nutrition_summaries
- `id` - UUID primary key
- `user_id` - Clerk user ID
- `date` - Date of summary
- `total_calories, total_protein, total_carbs, total_fat, total_fiber`
- `meal_count` - Number of meals
- `water_intake` - Water intake in ml

## 🚀 Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/limitlessai-pro.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Add environment variables from `.env.local`
5. Click "Deploy"

### 3. Setup Custom Domain
- In Vercel Dashboard → Domains
- Add your custom domain
- Update DNS records as shown

## 🔐 Security Notes

- All API routes protected with Clerk authentication
- Row Level Security (RLS) enabled on all database tables
- User can only access their own data
- Supabase Storage bucket access restricted to authenticated users
- OpenAI API calls rate limited server-side
- Sensitive keys stored in environment variables

## 📱 Mobile Optimization

- Fully responsive design with Tailwind CSS
- Mobile-first approach
- Touch-friendly UI components
- Image compression before upload
- PWA-ready (add manifest.json for offline support)

## 🐛 Troubleshooting

### OpenAI API Errors
- Ensure `gpt-4-vision-preview` model is available
- Check rate limits haven't been exceeded
- Verify image URL is publicly accessible

### Supabase Connection Issues
- Verify environment variables are set correctly
- Check project is active in Supabase dashboard
- Ensure RLS policies are properly configured

### Clerk Authentication Issues
- Verify redirect URLs in Clerk dashboard match your app
- Check session cookies are enabled
- Clear browser cache and try again

## 📈 Performance Tips

1. Images are optimized before upload
2. Database queries use indexes on `user_id` and `created_at`
3. API responses cached where possible
4. Next.js automatic code splitting
5. Vercel edge functions for low latency

## 🎯 Next Steps

1. ✅ Setup authentication with Clerk
2. ✅ Configure Supabase database
3. ✅ Deploy to Vercel
4. Add analytics dashboard
5. Add weekly/monthly reports
6. Add food database/autocomplete
7. Add notifications & reminders
8. Add data export (PDF, CSV)
9. Add social features (sharing)
10. Add AI meal recommendations

## 📞 Support

- 📧 Email: support@limitlessai.com
- 💬 Discord: [Join community](https://discord.gg/limitlessai)
- 🐛 Issues: [GitHub Issues](https://github.com/limitlessai/pro/issues)

---

Happy tracking! 🎉
