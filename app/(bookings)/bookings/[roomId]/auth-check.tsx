// File: /app/bookings/[roomId]/auth-check.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthCheckProps {
  children: React.ReactNode;
  roomId: string;
  searchParams: string;
}

export default function AuthCheck({
  children,
  roomId,
  searchParams,
}: AuthCheckProps) {
  const { status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for the session to load
    if (status === "loading") return;

    setIsChecking(false);

    // If user is not logged in, redirect to login
    if (status === "unauthenticated") {
      // Construct the return URL to come back to after login
      const returnUrl = `/bookings/${roomId}?${searchParams}`;
      router.push(`/customer-signin?returnTo=${encodeURIComponent(returnUrl)}`);
    }
  }, [status, router, roomId, searchParams]);

  if (isChecking || status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="font-comfortaaMedium text-gray-600">
          Checking authentication...
        </p>
      </div>
    );
  }

  // If authenticated, render children
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // This will not be rendered (redirection happens in useEffect)
  return null;
}
