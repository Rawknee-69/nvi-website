import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { setUserRole } from '@/utils/clerkRoleHandler';
import Layout from '@/components/layout/Layout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Building2, GraduationCap, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Page to set user role after signup/login
 * Shows a dialog popup for users to select their role
 */
const SetRole = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [isSettingRole, setIsSettingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'owner' | 'student' | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const role = searchParams.get('role') || null;
  const next = searchParams.get('next') || '/';

  useEffect(() => {
    if (isLoaded && user) {
      const userRole = user.publicMetadata?.role as string;
      
      // If user already has the requested role (owner), navigate to next
      if (role === 'owner' && userRole === 'owner') {
        navigate(next || '/', { replace: true });
        return;
      }
      
      // If user has a role but it's not the one requested, show dialog to change
      if (userRole === 'owner' || userRole === 'student') {
        // Only show dialog if they're trying to change roles
        if (role && role !== userRole) {
          setShowDialog(true);
        } else {
          // Same role or no specific role requested, go to next
          navigate(next || '/', { replace: true });
        }
        return;
      }

      // If user doesn't have a role, show dialog to select
      if (!userRole) {
        setShowDialog(true);
      }
    }
  }, [user, isLoaded, role, next, navigate]);

  const handleRoleSelect = async (selected: 'owner' | 'student') => {
    setSelectedRole(selected);
    setIsSettingRole(true);
    
    try {
      await setUserRole(selected, getToken);
      
      // Role set successfully, navigate to next page or home
      navigate(next || '/', { replace: true });
    } catch (error) {
      console.error('Error setting user role:', error);
      setIsSettingRole(false);
      setSelectedRole(null);
      // Show error or retry option
    }
  };

  if (!isLoaded) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Dialog open={showDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Select Your Role</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Please choose how you'd like to use NIVĀSYA
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Student Option */}
            <button
              onClick={() => handleRoleSelect('student')}
              disabled={isSettingRole}
              className={cn(
                'relative p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg',
                selectedRole === 'student'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50',
                isSettingRole && selectedRole !== 'student' && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex flex-col items-start gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  selectedRole === 'student' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                )}>
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">I'm a Student</h3>
                  <p className="text-sm text-muted-foreground">
                    Find and book accommodation near your college
                  </p>
                </div>
                {selectedRole === 'student' && (
                  <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-primary" />
                )}
              </div>
            </button>

            {/* Owner Option */}
            <button
              onClick={() => handleRoleSelect('owner')}
              disabled={isSettingRole}
              className={cn(
                'relative p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg',
                selectedRole === 'owner'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50',
                isSettingRole && selectedRole !== 'owner' && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex flex-col items-start gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  selectedRole === 'owner' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                )}>
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">I'm an Owner</h3>
                  <p className="text-sm text-muted-foreground">
                    List and manage your properties for students
                  </p>
                </div>
                {selectedRole === 'owner' && (
                  <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-primary" />
                )}
              </div>
            </button>
          </div>

          {isSettingRole && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Setting up your account...</span>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center mt-4">
            You can change this later in your account settings
          </p>
        </DialogContent>
      </Dialog>

      {isSettingRole && !showDialog && (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Setting up your account...</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SetRole;

