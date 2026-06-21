import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LimitlessAI Pro - AI Calorie Tracker',
  description: 'Smart food tracking with AI-powered meal analysis and nutrition insights',
  keywords: ['calorie tracker', 'food tracking', 'nutrition', 'AI', 'meal analysis'],
  authors: [{ name: 'LimitlessAI' }],
  creator: 'LimitlessAI',
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="dark">
        <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
          <script
            dangerouslySetInnerHTML={{
              __html: `(() => {
                try {
                  const saved = localStorage.getItem('theme-preference');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = saved === 'light' || saved === 'dark' ? saved : (prefersDark ? 'dark' : 'light');
                  const root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  root.classList.add(theme);
                } catch (e) {}
              })();`,
            }}
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
