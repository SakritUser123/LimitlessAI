import { UserButton, auth } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function Navbar() {
  const { userId } = auth();

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href={userId ? '/dashboard' : '/'} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">∞</span>
          </div>
          <h1 className="text-xl font-bold">LimitlessAI Pro</h1>
        </Link>

        <div className="flex items-center gap-4">
          {userId ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/dashboard/meals">Meals</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/dashboard/profile">Profile</Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
