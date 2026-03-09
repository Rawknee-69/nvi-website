
import { useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import { useTheme } from 'next-themes';
import { dark } from '@clerk/themes';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoaded } = useUser();
  const { theme, resolvedTheme } = useTheme();
  const role = searchParams.get('role') || 'student';
  const next = searchParams.get('next') || '/';
  const hasNavigated = useRef(false);
  
  // Get the actual theme (resolvedTheme handles 'system' theme)
  const currentTheme = resolvedTheme || theme || 'light';

  useEffect(() => {
    // Prevent multiple navigations
    if (hasNavigated.current || !isLoaded) return;
    
    // If user is signed in, Clerk will handle redirect automatically
    // We only need to handle role-specific redirects
    if (user) {
      const userRole = user.publicMetadata?.role as string;
      
      // Only navigate if we're still on the login page
      // Clerk might already be redirecting, so check location
      if (location.pathname.startsWith('/login')) {
        hasNavigated.current = true;
        
        if (role === 'owner') {
          if (userRole === 'owner') {
            // User is owner, redirect to home page
            navigate('/', { replace: true });
          } else {
            // User is not owner, redirect to signup
            navigate(`/signup?role=owner&next=/`, { replace: true });
          }
        } else {
          // Student login, redirect to home page
          navigate('/', { replace: true });
        }
      }
    }
  }, [user, isLoaded, role, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">N</span>
            </div>
            <span className="font-semibold text-xl text-foreground tracking-tight">
              NIVĀSYA
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              {role === 'owner'
                ? 'Sign in to manage your properties'
                : 'Sign in to find your perfect stay'}
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex p-1 bg-secondary rounded-xl mb-8">
            <Link
              to={`/login?role=student${next !== '/' ? `&next=${next}` : ''}`}
              className={`flex-1 py-2.5 text-center rounded-lg text-sm font-medium transition-all ${
                role === 'student'
                  ? 'bg-surface text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              I'm a Student
            </Link>
            <Link
              to={`/login?role=owner${next !== '/' ? `&next=${next}` : ''}`}
              className={`flex-1 py-2.5 text-center rounded-lg text-sm font-medium transition-all ${
                role === 'owner'
                  ? 'bg-surface text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              I'm an Owner
            </Link>
          </div>

          {/* Clerk Sign In Component */}
          <div className="flex justify-center">
            <SignIn
              routing="path"
              path="/login"
              signUpUrl={`/signup?role=${role}${next !== '/' ? `&next=${next}` : ''}`}
              fallbackRedirectUrl="/"
              appearance={{
                baseTheme: currentTheme === 'dark' ? dark : undefined,
                elements: {
                  rootBox: "mx-auto w-full",
                  card: "shadow-none bg-transparent border-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  header: "hidden",
                  socialButtonsBlockButton: "border-border hover:bg-secondary text-foreground",
                  socialButtonsBlockButtonText: "text-foreground",
                  formFieldInput: "bg-surface border-border text-foreground focus:border-primary",
                  formFieldLabel: "text-foreground",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                  formButtonPrimary__loading: "bg-primary/80",
                  footerActionLink: "text-primary hover:text-primary/80",
                  footerActionText: "text-muted-foreground",
                  identityPreviewText: "text-foreground",
                  identityPreviewEditButton: "text-primary hover:text-primary/80",
                  dividerLine: "bg-border",
                  dividerText: "text-muted-foreground",
                  formResendCodeLink: "text-primary hover:text-primary/80",
                  otpCodeFieldInput: "bg-surface border-border text-foreground focus:border-primary",
                  alertText: "text-foreground",
                  formFieldErrorText: "text-destructive",
                },
              }}
            />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{' '}
            <Link
              to={`/signup?role=${role}${next !== '/' ? `&next=${next}` : ''}`}
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light" />
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">
            {role === 'owner'
              ? 'Manage your properties with ease'
              : 'Find your home away from home'}
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            {role === 'owner'
              ? 'Track tenants, manage payments, and grow your rental business with our comprehensive dashboard.'
              : 'Discover verified accommodations near your college. Safe, affordable, and hassle-free.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
