import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import React from 'react';

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </>
  );
} 