import { SignedIn, SignedOut, SignIn, useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../core/context/AuthContext';

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { user: clerkUser } = useUser();
  const { signIn, user } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

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
      const email = clerkUser.primaryEmailAddress.emailAddress;
      console.log('Attempting to sign in with email:', email);
      
      signIn(email).catch(error => {
        console.error('Failed to fetch user info from RestrictedChat:', error);
        
        // Check if it's a 404 error (user not found)
        if (error instanceof Error && error.message.includes('404')) {
          setAuthError(`User with email "${email}" not found in the system. Please contact your administrator to be added to the system.`);
        } else if (error instanceof Error && error.message.includes('Failed to fetch')) {
          setAuthError('Unable to connect to the authentication service. Please check your internet connection and try again.');
        } else {
          setAuthError(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      });
    }
  }, [clerkUser, signIn, user]);

  // Clear error when user successfully signs in
  useEffect(() => {
    if (user) {
      setAuthError(null);
    }
  }, [user]);

  return (
    <>
      <SignedIn>
        {authError ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Authentication Error</h3>
                <p className="mt-2 text-sm text-gray-500">{authError}</p>
                <div className="mt-6">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </>
  );
} 