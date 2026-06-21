'use client';

import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-black/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold">∞</span>
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">LimitlessAI</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <Link
                href="/dashboard"
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive('/dashboard')
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/meal-scanner"
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive('/meal-scanner')
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                Scan Meal
              </Link>
              <Link
                href="/analytics"
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive('/analytics')
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                Analytics
              </Link>
              <Link
                href="/history"
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive('/history')
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                History
              </Link>
              <Link
                href="/articles"
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive('/articles')
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                Articles
              </Link>
              <Link
                href="/store"
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive('/store')
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                Store
              </Link>
              <Link
                href="/settings"
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive('/settings')
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                Settings
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <SignedIn>
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                  {user && <span className="hidden text-sm font-medium text-slate-700 dark:text-white/75 sm:block">{user.emailAddresses[0]?.emailAddress}</span>}
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: 'h-9 w-9',
                        userButtonPopoverActionButton: 'hover:bg-white/10',
                      },
                    }}
                  />
                </div>
              </SignedIn>
              <SignedOut>
                <Link href="/auth/sign-in" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white">
                  Sign in
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
