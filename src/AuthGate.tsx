import { SignedIn, SignedOut, SignIn, useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react';
import { useAuth } from '../core/context/AuthContext';

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { user: clerkUser } = useUser();
  const { signIn, user } = useAuth();

  useEffect(() => {
    if (clerkUser?.primaryEmailAddress?.emailAddress && !user) {
      signIn(clerkUser.primaryEmailAddress.emailAddress).catch(error => {
        console.error('Failed to fetch user info from RestrictedChat:', error);
      });
    }
  }, [clerkUser, signIn, user]);

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