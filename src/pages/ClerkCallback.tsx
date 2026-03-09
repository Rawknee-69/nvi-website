import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * Handles Clerk SSO callbacks
 * This component is used for /login/sso-callback and /signup/sso-callback routes
 */
const ClerkCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoaded } = useUser();
  const [error, setError] = useState<string | null>(null);
  
  // Get the intended destination from URL params
  const afterSignInUrl = searchParams.get('after_sign_in_url') || '/';
  const role = searchParams.get('role') || 'student';
  const next = searchParams.get('next') || afterSignInUrl;
  
  // Check for OAuth errors in URL
  const oauthError = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  useEffect(() => {
    // Check for OAuth errors first
    if (oauthError) {
      let errorMessage = 'Authentication failed';
      
      if (oauthError === 'external_account_not_found') {
        errorMessage = 'No account found with this email. Please sign up first or use a different sign-in method.';
      } else if (errorDescription) {
        errorMessage = decodeURIComponent(errorDescription);
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Redirect to login after showing error
      setTimeout(() => {
        navigate(`/login?role=${role}`);
      }, 3000);
      return;
    }

    if (isLoaded) {
      if (user) {
        // User is authenticated, check role and redirect
        const userRole = user.publicMetadata?.role as string;
        
        // If user doesn't have a role, redirect to set-role page
        if (!userRole || (userRole !== 'owner' && userRole !== 'student')) {
          navigate(`/set-role?next=${next}${role ? `&role=${role}` : ''}`);
          return;
        }
        
        // Redirect to home page for both owners and students
        navigate('/');
      } else {
        // User not authenticated, redirect to login
        navigate(`/login?role=${role}${next !== '/' ? `&next=${next}` : ''}`);
      }
    }
  }, [user, isLoaded, role, next, navigate, oauthError, errorDescription]);

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Authentication Error</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => navigate(`/login?role=${role}`)}>
              Go to Login
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Redirecting automatically in a few seconds...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Completing authentication...</p>
        </div>
      </div>
    </Layout>
  );
};

export default ClerkCallback;

