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
    console.log('=== Clerk User Debug in AuthGate ===');
    console.log('Clerk user:', clerkUser);
    console.log('Clerk user ID:', clerkUser?.id);
    console.log('Clerk user email:', clerkUser?.primaryEmailAddress?.emailAddress);
    console.log('Clerk user public metadata:', clerkUser?.publicMetadata);
    console.log('Clerk user unsafe metadata:', clerkUser?.unsafeMetadata);
    console.log('Clerk user role:', clerkUser?.publicMetadata?.role);
    console.log('=== End Clerk User Debug ===');

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