import { useUser } from '@clerk/clerk-react';
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook to check if the current user is an owner
 * Redirects to signup if user is not authenticated or not an owner
 */
export const useOwnerCheck = (redirectTo = '/signup?role=owner&next=/list-property') => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirected.current || !isLoaded) return;

    if (!user) {
      // User is not authenticated, redirect to signup (only if not already there)
      if (!location.pathname.startsWith('/signup') && !location.pathname.startsWith('/login')) {
        hasRedirected.current = true;
        navigate(redirectTo, { replace: true });
      }
      return;
    }

    const userRole = user.publicMetadata?.role as string;
    // Don't redirect authenticated students - let the component show a prompt instead
    // Only redirect unauthenticated users
    if (userRole !== 'owner') {
      return; // Component will handle showing the prompt
    }
  }, [user, isLoaded, location.pathname, redirectTo]); // Removed navigate from deps

  return {
    isOwner: user?.publicMetadata?.role === 'owner',
    isLoading: !isLoaded,
    user,
  };
};

