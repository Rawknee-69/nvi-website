import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Building2, User, LogOut, UserCircle, LayoutDashboard, Sun, Moon, Monitor, Heart, Globe, Settings, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navTypes = ['PG', 'Hostel', 'Flat'];

  return (
    <>
      <nav className="fixed top-4 left-4 right-4 z-50 max-w-[1400px] mx-auto bg-surface rounded-2xl shadow-md border border-border/50 transition-shadow duration-300 hover:shadow-lg">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold text-xl text-primary tracking-tight">
              NIVĀSYA
            </span>
          </Link>

          {/* Center Segmented Toggle */}
          <div className="hidden lg:flex items-center bg-secondary/60 rounded-lg p-1 gap-0.5">
            {navTypes.map((type) => (
              <Link
                key={type}
                to={`/listings?type=${type.toLowerCase()}`}
                className={cn(
                  'px-5 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
                  location.search.includes(type.toLowerCase())
                    ? 'bg-surface shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {type}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Wishlist */}
            <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full border-border/50 font-medium h-9 px-4">
              <Heart className="w-4 h-4" />
              <span className="hidden xl:block">Wishlist</span>
              <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold">10</span>
            </Button>
            {/* Language */}
            <Button variant="outline" size="sm" className="hidden xl:flex items-center gap-2 rounded-full border-border/50 font-medium h-9 px-4">
              <Globe className="w-4 h-4" />
              <span>English</span>
            </Button>
            {/* Settings */}
            <Button variant="outline" size="icon" className="rounded-full border-border/50 w-9 h-9">
              <Settings className="w-4 h-4" />
            </Button>
            {/* Notifications */}
            <Button variant="outline" size="icon" className="rounded-full border-border/50 w-9 h-9 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-surface" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full">
                  {mounted ? (
                    theme === 'dark' ? (
                      <Moon className="w-4 h-4" />
                    ) : theme === 'light' ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Monitor className="w-4 h-4" />
                    )
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className="w-4 h-4 mr-2" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Auth */}
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 hover:bg-primary/90 transition-colors">
                    {user?.firstName?.[0] || 'U'}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.fullName || user?.emailAddresses[0]?.emailAddress}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.publicMetadata?.role === 'owner' ? 'Owner' : 'Student'}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  {user?.publicMetadata?.role === 'owner' ? (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/owner-dashboard')}>
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/owner-listings')}>
                        <Building2 className="w-4 h-4 mr-2" />
                        My Listings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/student-dashboard')}>
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => signOut(() => navigate('/'))}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="rounded-full font-medium">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 w-[280px] bg-surface z-50 lg:hidden transform transition-transform duration-300 ease-out shadow-xl',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-semibold text-foreground">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Property Types */}
            <div className="space-y-1 mb-6">
              {navTypes.map((type) => (
                <Link
                  key={type}
                  to={`/listings?type=${type.toLowerCase()}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-foreground hover:bg-secondary"
                >
                  <Home className="w-5 h-5" />
                  Browse {type}s
                </Link>
              ))}
              <Link
                to="/list-property"
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-foreground hover:bg-secondary"
              >
                <Building2 className="w-5 h-5" />
                List Property
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-border space-y-2">
              {/* Theme Switcher - Mobile */}
              <div className="px-4 py-2 mb-2">
                <p className="text-xs text-muted-foreground mb-2">Theme</p>
                <div className="flex gap-2">
                  <Button
                    variant={mounted && theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="w-4 h-4 mr-1" />
                    Light
                  </Button>
                  <Button
                    variant={mounted && theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="w-4 h-4 mr-1" />
                    Dark
                  </Button>
                  <Button
                    variant={mounted && theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setTheme('system')}
                  >
                    <Monitor className="w-4 h-4 mr-1" />
                    Auto
                  </Button>
                </div>
              </div>
              {isSignedIn ? (
                <>
                  <div className="px-4 py-2 mb-2">
                    <p className="text-sm font-medium text-foreground">{user?.fullName || user?.emailAddresses[0]?.emailAddress}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.publicMetadata?.role === 'owner' ? 'Owner' : 'Student'}
                    </p>
                  </div>
                  {user?.publicMetadata?.role === 'owner' ? (
                    <>
                      <Link to="/owner-dashboard" className="block">
                        <Button variant="outline" className="w-full justify-start">
                          <LayoutDashboard className="w-5 h-5 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link to="/owner-listings" className="block">
                        <Button variant="outline" className="w-full justify-start">
                          <Building2 className="w-5 h-5 mr-2" />
                          My Listings
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link to="/student-dashboard" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <LayoutDashboard className="w-5 h-5 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={() => signOut(() => navigate('/'))}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="w-5 h-5 mr-2" />
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup" className="block">
                    <Button className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
