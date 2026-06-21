# LimitlessAI Pro - Deployment Guide

## 🚀 Vercel Deployment

### Option 1: Deploy with GitHub (Recommended)

#### 1. Push to GitHub

```bash
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: LimitlessAI Pro"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/limitlessai-pro.git

# Push to main branch
git branch -M main
git push -u origin main
```

#### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Configure project:
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### 3. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_value
CLERK_SECRET_KEY=your_value
NEXT_PUBLIC_SUPABASE_URL=your_value
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_value
SUPABASE_SERVICE_ROLE_KEY=your_value
OPENAI_API_KEY=your_value
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### 4. Click "Deploy"

Vercel will automatically build and deploy!

---

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts to complete deployment
```

---

## 📋 Pre-Deployment Checklist

### Environment Variables ✅
- [ ] All 7 environment variables configured
- [ ] No hardcoded secrets in code
- [ ] Production URLs set correctly

### Database ✅
- [ ] Supabase project created
- [ ] Database schema applied (run `schema.sql`)
- [ ] Row Level Security (RLS) policies enabled
- [ ] `meal-images` storage bucket created and public

### Authentication ✅
- [ ] Clerk project created
- [ ] Clerk API keys added
- [ ] Redirect URLs set to production domain:
  - Sign in: `https://your-domain.com/auth/sign-in`
  - Sign up: `https://your-domain.com/auth/sign-up`
  - After sign in: `https://your-domain.com/dashboard`
  - After sign up: `https://your-domain.com/onboarding`

### OpenAI ✅
- [ ] API key added
- [ ] GPT-4 Vision access confirmed
- [ ] Rate limits appropriate for production

### Code ✅
- [ ] All TypeScript errors resolved
- [ ] Environment variables properly referenced
- [ ] No console errors in build

---

## 🔗 Custom Domain Setup

### 1. In Vercel Dashboard

1. Go to your project
2. Settings → Domains
3. Add your domain (e.g., `limitlessai.com`)

### 2. Update DNS Records

Add Vercel's nameservers to your domain registrar:

| Type | Name | Value |
|------|------|-------|
| NS | @ | ns1.vercel-dns.com |
| NS | @ | ns2.vercel-dns.com |

Or use CNAME:
| Type | Name | Value |
|------|------|-------|
| CNAME | www | cname.vercel-dns.com |

### 3. Wait for DNS Propagation

DNS changes can take 24-48 hours to fully propagate.

---

## 🔄 Continuous Deployment

### Automatic Deployments

Every push to `main` branch automatically triggers:

```
git push origin main
  ↓
GitHub detects push
  ↓
Vercel webhook triggered
  ↓
Build process starts
  ↓
Tests run (if configured)
  ↓
Deploy to production
  ↓
Domain updated
```

### Preview Deployments

Push to feature branch:

```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
```

Vercel creates preview URL automatically.

---

## 📊 Monitoring & Analytics

### Vercel Dashboard

- Real-time logs and errors
- Performance metrics
- Deployment history
- Edge network analytics

### Application Monitoring

Add error tracking:

```bash
npm install @sentry/nextjs
```

Configure in `next.config.js`:

```javascript
const withSentryConfig = require("@sentry/nextjs/withSentryConfig");

module.exports = withSentryConfig(nextConfig);
```

---

## 🔐 Security in Production

### HTTPS
- ✅ Automatically enabled by Vercel
- All traffic encrypted

### Environment Variables
- ✅ Stored securely on Vercel
- Never exposed in client code
- Only revealed to deployed application

### Database Access
- ✅ Restricted to API routes only
- ✅ Row Level Security enabled
- ✅ User can only access own data

### Rate Limiting
Add to API routes:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
});

export async function POST(request: NextRequest) {
  const { success } = await ratelimit.limit("meal-analysis");
  if (!success) return new Response("Rate limited", { status: 429 });
  // ... rest of handler
}
```

---

## 🚨 Troubleshooting Deployment

### Build Fails

```bash
# Clear build cache
vercel env pull
npm run build
```

### Environment Variables Not Working

```bash
# Verify variables are set
vercel env list

# Pull latest env
vercel env pull
```

### Database Connection Issues

```bash
# Test connection
curl https://your-domain.com/api/nutrition/today
# Should return 401 (unauthorized) if working
```

### Image Upload Not Working

1. Check Supabase storage bucket exists
2. Verify bucket is public
3. Check RLS policies allow uploads

---

## 📈 Performance Optimization

### Vercel Functions

Optimize function memory and timeout:

```json
// vercel.json
{
  "functions": {
    "api/**": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

### Edge Caching

Cache API responses:

```typescript
export async function GET(request: NextRequest) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
```

### Image Optimization

Next.js automatically optimizes images:

```jsx
import Image from 'next/image';

<Image
  src={imageUrl}
  alt="Meal"
  width={400}
  height={300}
  quality={80}
/>
```

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Clerk Docs**: https://clerk.com/docs
- **OpenAI API**: https://openai.com/docs/guides/vision

---

## ✅ Post-Deployment

1. Test all functionality on production
2. Verify Clerk authentication works
3. Test meal upload and analysis
4. Check analytics calculations
5. Monitor error logs
6. Set up error tracking (Sentry)
7. Configure backups for database
8. Plan CI/CD improvements

---

Happy deploying! 🎉

For questions or issues, open an issue on GitHub or contact support.
