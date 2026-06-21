"use client";

import { Button } from '@/components/ui/button';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const reduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(circle at center, black 30%, transparent 88%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 88%)',
          }}
        />

        {!reduceMotion && (
          <>
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 opacity-70"
              animate={{ y: ['-8%', '8%'] }}
              transition={{ duration: 16, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 1440 1200" className="h-full w-full">
                <defs>
                  <linearGradient id="edgeLine" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(96,165,250,0.55)" />
                    <stop offset="100%" stopColor="rgba(168,85,247,0.25)" />
                  </linearGradient>
                </defs>

                <g fill="none" stroke="url(#edgeLine)" strokeWidth="1.2" opacity="0.7">
                  <path d="M120 150 L260 90 L420 180 L580 110 L750 220 L930 130 L1120 240 L1290 160" />
                  <path d="M100 360 L270 280 L430 390 L610 300 L770 420 L970 330 L1140 450 L1320 360" />
                  <path d="M160 590 L320 500 L500 620 L660 520 L840 640 L1010 540 L1190 660 L1360 580" />
                  <path d="M90 840 L250 750 L420 870 L610 760 L790 890 L980 780 L1160 900 L1340 820" />
                  <path d="M180 1040 L340 950 L520 1060 L700 970 L880 1085 L1060 985 L1240 1100" />
                  <path d="M260 90 L270 280 L320 500 L340 950" />
                  <path d="M420 180 L430 390 L500 620 L520 1060" />
                  <path d="M580 110 L610 300 L660 520 L700 970" />
                  <path d="M750 220 L770 420 L840 640 L880 1085" />
                  <path d="M930 130 L970 330 L1010 540 L1060 985" />
                  <path d="M1120 240 L1140 450 L1190 660 L1240 1100" />
                </g>

                <g>
                  {[
                    [120, 150], [260, 90], [420, 180], [580, 110], [750, 220], [930, 130], [1120, 240], [1290, 160],
                    [100, 360], [270, 280], [430, 390], [610, 300], [770, 420], [970, 330], [1140, 450], [1320, 360],
                    [160, 590], [320, 500], [500, 620], [660, 520], [840, 640], [1010, 540], [1190, 660], [1360, 580],
                    [90, 840], [250, 750], [420, 870], [610, 760], [790, 890], [980, 780], [1160, 900], [1340, 820],
                    [180, 1040], [340, 950], [520, 1060], [700, 970], [880, 1085], [1060, 985], [1240, 1100],
                  ].map(([cx, cy], index) => (
                    <g key={`${cx}-${cy}`}>
                      <circle cx={cx} cy={cy} r={index % 3 === 0 ? 7 : 4} fill={index % 2 === 0 ? 'rgba(96,165,250,0.95)' : 'rgba(168,85,247,0.95)'} />
                      <circle cx={cx} cy={cy} r={index % 3 === 0 ? 18 : 12} fill="rgba(255,255,255,0.06)" />
                    </g>
                  ))}
                </g>
              </svg>
            </motion.div>

            <motion.div
              aria-hidden="true"
              className="absolute left-[-10%] top-[-10%] h-[30rem] w-[30rem] rounded-full bg-blue-500/20 blur-3xl"
              animate={{ x: [0, 36, 0], y: [0, 18, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute right-[-10%] top-[14%] h-[28rem] w-[28rem] rounded-full bg-violet-500/18 blur-3xl"
              animate={{ x: [0, -28, 0], y: [0, 26, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}

        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[22rem] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_58%)] opacity-35"
          animate={reduceMotion ? undefined : { opacity: [0.18, 0.42, 0.18], scale: [1, 1.02, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl bg-black/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">∞</span>
            </div>
            <h1 className="text-xl font-bold text-white">LimitlessAI Pro</h1>
          </div>
          <div className="flex gap-4">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6 backdrop-blur"
          >
            <span className="text-blue-400">✨</span>
            <span className="text-sm text-white/80">AI-Powered Nutrition Tracking</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Track Your Food.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Achieve Limitless Health.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Simply photograph your meals and let AI analyze the calories, macros, and nutritional content. 
            Get insights, track progress, and reach your health goals faster.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.65 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-transform duration-200 hover:scale-105">
              <Link href="/meal-scanner">Scan Meal Now</Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-gray-100 font-semibold transition-transform duration-200 hover:scale-105">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3"
        >
          {[
            { label: 'Scan meals fast', value: 'AI vision detects calories and macros', accent: 'from-blue-500 to-cyan-500' },
            { label: 'Track progress', value: 'See trends with live dashboards', accent: 'from-violet-500 to-fuchsia-500' },
            { label: 'Save every meal', value: 'History, goals, and insights in one place', accent: 'from-emerald-500 to-teal-500' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-2xl border border-white/10 bg-black/55 p-5 text-white/90 backdrop-blur-md shadow-lg shadow-black/20"
            >
              <div className={`mb-3 h-1.5 w-20 rounded-full bg-gradient-to-r ${item.accent}`} />
              <p className="text-sm uppercase tracking-[0.2em] text-white/50">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-white/75">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="grid gap-6 rounded-[2rem] border border-white/10 bg-black/50 p-6 backdrop-blur-xl md:grid-cols-[1.15fr_0.85fr] md:p-8"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-white/45">How it works</p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">A smooth flow from photo to nutrition</h2>
            <p className="mt-3 max-w-2xl text-white/70">
              The app turns your meal photo into clear nutrition data. It analyzes what is on the plate,
              lets you review it, and saves it into your history and dashboard.
            </p>

            <div className="mt-8 grid gap-4">
              {[
                {
                  step: '01',
                  title: 'Capture or upload',
                  text: 'Take a meal photo and send it to the scanner in one tap.',
                },
                {
                  step: '02',
                  title: 'AI detects foods',
                  text: 'The model identifies items, portions, calories, and macros.',
                },
                {
                  step: '03',
                  title: 'Review and save',
                  text: 'Edit anything you want, then save it to your nutrition log.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-black/55 p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-blue-500/20">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/65">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-blue-500/15 to-purple-500/10 p-5"
            >
              <p className="text-sm uppercase tracking-[0.22em] text-white/50">Inside the app</p>
              <div className="mt-4 space-y-3 text-sm text-white/75">
                <div className="flex items-center justify-between rounded-xl bg-black/45 px-4 py-3">
                  <span>Meal Scanner</span>
                  <span className="text-cyan-300">Smart upload</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-black/45 px-4 py-3">
                  <span>Dashboard</span>
                  <span className="text-violet-300">Daily totals</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-black/45 px-4 py-3">
                  <span>History</span>
                  <span className="text-emerald-300">Meal timeline</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-black/45 px-4 py-3">
                  <span>Settings</span>
                  <span className="text-amber-300">Goal control</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="rounded-[1.5rem] border border-white/10 bg-black/50 p-5"
            >
              <p className="text-sm uppercase tracking-[0.22em] text-white/50">App highlights</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/75">
                <div className="rounded-2xl bg-black/45 p-4">Photo-based logging</div>
                <div className="rounded-2xl bg-black/45 p-4">Goal tracking</div>
                <div className="rounded-2xl bg-black/45 p-4">Meal history</div>
                <div className="rounded-2xl bg-black/45 p-4">Analytics charts</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-white mb-16 text-center"
        >
          Powerful Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '📸',
              title: 'AI Meal Scanner',
              description: 'Upload photos and get instant calorie analysis',
            },
            {
              icon: '📊',
              title: 'Smart Dashboard',
              description: 'Track your daily nutrition in real-time',
            },
            {
              icon: '📈',
              title: 'Advanced Analytics',
              description: 'Weekly insights and macro trends',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition will-change-transform"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-xl md:p-8"
        >
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-white/45">Use cases</p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Built for everyday food tracking</h2>
            <p className="mt-3 text-white/70">
              Whether someone is trying to lose weight, build muscle, eat more consistently, or just understand
              their meals better, the app gives simple guidance from a single photo.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: 'Weight loss',
                text: 'See calorie intake clearly and stay on track with daily goals.',
              },
              {
                title: 'Fitness & muscle gain',
                text: 'Monitor protein, carbs, and fat to support training targets.',
              },
              {
                title: 'Healthy habits',
                text: 'Build awareness of portion sizes and meal balance over time.',
              },
              {
                title: 'Busy routines',
                text: 'Log meals quickly without typing long nutrition entries.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="rounded-2xl border border-white/10 bg-slate-950/40 p-5"
              >
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Impact Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="grid gap-6 rounded-[2rem] border border-white/10 bg-black/50 p-6 backdrop-blur-xl md:grid-cols-[0.95fr_1.05fr] md:p-8"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-white/45">App impact</p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Why this app matters</h2>
            <p className="mt-3 text-white/70">
              Manual calorie counting can be slow and frustrating. This app reduces friction, improves consistency,
              and helps users make better food decisions without the hassle of logging everything by hand.
            </p>

            <div className="mt-8 space-y-4">
              {[
                'Less time spent logging meals',
                'More awareness of calories and macros',
                'Better habit tracking with saved history',
                'More confidence when following goals',
              ].map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-2xl bg-black/45 px-4 py-3 text-white/80">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-sm font-bold text-slate-950">
                    ✓
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { value: 'Fast', label: 'photo-based meal logging' },
              { value: 'Clear', label: 'nutrition insights' },
              { value: 'Saved', label: 'meal history and trends' },
              { value: 'Simple', label: 'goal tracking for daily use' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/70 to-slate-900/50 p-6"
              >
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-white/65">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Final CTA Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-500/20 p-8 text-center backdrop-blur-xl md:p-12"
        >
          <p className="text-sm uppercase tracking-[0.28em] text-white/45">Start now</p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">Turn every meal into useful insight</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Scan a meal, understand what is on the plate, and see how it fits your goals. The more you use it,
            the more value you get from your food history and nutrition trends.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-gray-100 font-semibold">
              <Link href="/meal-scanner">Try the Scanner</Link>
            </Button>
            <Button asChild size="lg" className="border border-white/20 bg-white/10 text-white hover:bg-white/15">
              <Link href="/dashboard">Explore the Dashboard</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-white/60 text-sm">
          <p>&copy; 2024 LimitlessAI Pro. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </main>
  );
}
