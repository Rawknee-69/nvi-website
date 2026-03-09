import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { setUserRole } from '@/utils/clerkRoleHandler';

/**
 * Component to handle setting user role after signup
 * This component should be rendered after Clerk signup to set the role in metadata
 */
export const RoleHandler = () => {
  const { user, isLoaded } = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role') || 'student';
  const next = searchParams.get('next') || '/';

  useEffect(() => {
    if (isLoaded && user) {
      const userRole = user.publicMetadata?.role as string;
      
      // If user doesn't have a role set, set it based on the signup role
      if (!userRole && role) {
        setUserRole(role as 'owner' | 'student')
          .then(() => {
            // Role set successfully, navigate to next page
            if (role === 'owner') {
              navigate(next === '/' ? '/list-property' : next);
            } else {
              navigate(next);
            }
          })
          .catch((error) => {
            console.error('Error setting user role:', error);
            // Even if role setting fails, navigate to next page
            if (role === 'owner') {
              navigate(next === '/' ? '/list-property' : next);
            } else {
              navigate(next);
            }
          });
      } else if (userRole) {
        // User already has a role, navigate accordingly
        if (role === 'owner' && userRole === 'owner') {
          navigate(next === '/' ? '/list-property' : next);
        } else if (role === 'owner' && userRole !== 'owner') {
          // User is signed up but not as owner, redirect to signup
          navigate(`/signup?role=owner&next=${next}`);
        } else {
          navigate(next);
        }
      }
    }
  }, [user, isLoaded, role, next, navigate]);

  return null; // This component doesn't render anything
};


