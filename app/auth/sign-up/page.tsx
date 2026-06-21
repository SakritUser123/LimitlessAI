import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function SignUpPage() {
  const session = await auth();
  
  // If already signed in, redirect to dashboard
  if (session.userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-2xl",
          },
        }}
        redirectUrl="/dashboard"
        fallbackRedirectUrl="/dashboard"
        providers={[]}
      />
    </div>
  );
}
