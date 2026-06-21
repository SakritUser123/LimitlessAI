# LimitlessAI Pro - Production AI Calorie Tracker

A modern, full-stack AI-powered food tracking application built with Next.js 15, React 19, TypeScript, and Supabase.

## Features

-  **AI Meal Scanner** - Upload food photos and get instant calorie + macro analysis with GPT-4 Vision
-  **Smart Dashboard** - Real-time tracking with beautiful charts and progress visualization  
-  **Meal History** - Categorized meal logs with search, filter, and edit capabilities
-  **User Profile** - Personal metrics, dietary preferences, and goal tracking
-  **Advanced Analytics** - Weekly/monthly trends, macro distribution, nutrition insights
-  **Secure Authentication** - Clerk with multi-factor auth and social login
-  **Mobile Responsive** - Premium mobile-first design with Tailwind CSS + shadcn/ui
-  **Smooth Animations** - Framer Motion for delightful interactions
-  **Dark Mode** - Built-in dark/light theme support

## Tech Stack

### Frontend
- **Next.js 15** - React 19 framework with App Router
- **React 19** - Modern component library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling  
- **shadcn/ui** - Beautiful accessible components
- **Framer Motion** - Advanced animations
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend & Database
- **Next.js API Routes** - Serverless backend
- **Supabase PostgreSQL** - Real-time database
- **Supabase Storage** - Image storage
- **OpenAI GPT-4 Vision** - Food recognition & analysis

### Authentication & Deployment
- **Clerk** - Authentication & user management
- **Vercel** - Deployment platform

## Getting Started

### 1. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 2. Setup Environment Variables
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Configure the following:
- **Clerk**: Get keys from [clerk.com](https://clerk.com)
- **Supabase**: Set up project at [supabase.com](https://supabase.com)
- **OpenAI**: Use your API key from [openai.com](https://openai.com)

### 3. Setup Database
\`\`\`bash
npm run db:push
npm run db:seed
\`\`\`

### 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages  
│   ├── auth/             # Authentication pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── dashboard/        # Dashboard components
│   ├── meal/            # Meal components
│   ├── auth/            # Auth components
│   ├── ui/              # shadcn/ui components
│   └── common/          # Shared components
├── lib/                 # Utilities & helpers
│   ├── supabase.ts     # Supabase client
│   ├── openai.ts       # OpenAI client
│   └── utils.ts        # Helper functions
├── hooks/              # Custom React hooks
├── types/              # TypeScript types
├── services/           # API services
└── public/             # Static assets
\`\`\`

## Key Features Implementation

### AI Meal Scanner
- Upload photos via drag-drop or camera
- Process with GPT-4 Vision API
- Extract: food items, portions, calories, macros
- Store meal logs to database

### Dashboard Analytics
- Daily calorie tracking
- Macro breakdown charts
- Weekly trends
- Nutrition goals progress

### Meal History
- Searchable meal logs
- Filter by date range
- Edit/delete entries
- Export to PDF

## API Endpoints

- `POST /api/meal/analyze` - Analyze food photo
- `GET /api/meals` - Get user meals
- `POST /api/meals` - Create meal log
- `PUT /api/meals/[id]` - Update meal
- `DELETE /api/meals/[id]` - Delete meal
- `GET /api/nutrition/today` - Get daily nutrition
- `GET /api/analytics` - Get analytics data
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile

## Development Commands

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript
npm run format       # Format code with Prettier
npm run db:push      # Push schema to database
npm run db:seed      # Seed database
\`\`\`

## Deployment

### Deploy to Vercel

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Environment Variables on Vercel
Add all \`.env.local\` variables in Vercel Dashboard → Settings → Environment Variables

## Key Considerations

1. **Image Upload**: Uses Supabase Storage with 10MB file size limit
2. **Rate Limiting**: OpenAI API calls limited to prevent high costs
3. **Data Privacy**: All data stored on user's Supabase project
4. **Security**: API routes protected with Clerk authentication

## Performance Optimization

- Next.js Image optimization
- Server-side rendering where possible
- API route caching
- Database query optimization
- Supabase realtime subscriptions

## Contributing

1. Create feature branch: \`git checkout -b feature/amazing\`
2. Commit changes: \`git commit -am 'Add amazing feature'\`
3. Push branch: \`git push origin feature/amazing\`
4. Create Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, feature requests, or questions:
- 📧 Email: support@limitlessai.com
- 💬 Discord: [Join our community](https://discord.gg/limitlessai)
- 🐛 Issues: [GitHub Issues](https://github.com/limitlessai/pro/issues)

---

Built with ❤️ for better nutrition tracking
