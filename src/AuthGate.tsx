import { SignedIn, SignedOut, SignIn, useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react';
import { useAuth } from '../core/context/AuthContext';

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { user: clerkUser } = useUser();
  const { signIn } = useAuth();

  useEffect(() => {
    if (clerkUser?.primaryEmailAddress?.emailAddress) {
      signIn(clerkUser.primaryEmailAddress.emailAddress).catch(error => {
        console.error('Failed to fetch user info from RestrictedChat:', error);
      });
    }
  }, [clerkUser, signIn]);

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