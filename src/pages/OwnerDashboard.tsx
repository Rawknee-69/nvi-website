import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import {
  Building2,
  Users,
  IndianRupee,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar,
  Bell,
  Settings,
  Home,
  UserCheck,
  Receipt,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DashboardStats {
  totalProperties: { label: string; value: string; change: string; trend: string };
  activeTenants: { label: string; value: string; change: string; trend: string };
  monthlyRevenue: { label: string; value: string; change: string; trend: string };
  occupancyRate: { label: string; value: string; change: string; trend: string };
}

interface Activity {
  id: string;
  type: 'payment' | 'booking' | 'maintenance' | 'tenant';
  message: string;
  time: string;
  amount?: string;
}

interface PendingPayment {
  id: string;
  name: string;
  property: string;
  amount: string;
  dueIn: string;
}

const OwnerDashboard = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/owner/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      
      if (data.success) {
        // Format stats for display
        const formattedStats: DashboardStats = {
          totalProperties: {
            label: data.stats.totalProperties.label,
            value: data.stats.totalProperties.value,
            change: data.stats.totalProperties.change,
            trend: 'up',
          },
          activeTenants: {
            label: data.stats.activeTenants.label,
            value: data.stats.activeTenants.value,
            change: data.stats.activeTenants.change,
            trend: 'up',
          },
          monthlyRevenue: {
            label: data.stats.monthlyRevenue.label,
            value: data.stats.monthlyRevenue.value,
            change: data.stats.monthlyRevenue.change,
            trend: 'up',
          },
          occupancyRate: {
            label: data.stats.occupancyRate.label,
            value: data.stats.occupancyRate.value,
            change: data.stats.occupancyRate.change,
            trend: 'up',
          },
        };

        setStats(formattedStats);
        setRecentActivity(data.recentActivity || []);
        setPendingPayments(data.pendingPayments || []);
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Add Property', icon: Plus, href: '/list-property', primary: true },
    { label: 'View Tenants', icon: UserCheck, href: '/tenants' },
    { label: 'Track Expenses', icon: Receipt, href: '/expenses' },
    { label: 'Payment Tracker', icon: IndianRupee, href: '/payment-tracker' },
    { label: 'My Listings', icon: Home, href: '/owner-listings' },
  ];

  const statsArray = stats ? [
    {
      label: stats.totalProperties.label,
      value: stats.totalProperties.value,
      change: stats.totalProperties.change,
      trend: stats.totalProperties.trend,
      icon: Building2,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: stats.activeTenants.label,
      value: stats.activeTenants.value,
      change: stats.activeTenants.change,
      trend: stats.activeTenants.trend,
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: stats.monthlyRevenue.label,
      value: stats.monthlyRevenue.value,
      change: stats.monthlyRevenue.change,
      trend: stats.monthlyRevenue.trend,
      icon: IndianRupee,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: stats.occupancyRate.label,
      value: stats.occupancyRate.value,
      change: stats.occupancyRate.change,
      trend: stats.occupancyRate.trend,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
    },
  ] : [];

  const sidebarLinks = [
    { label: 'Dashboard', icon: Home, href: '/owner-dashboard', active: true },
    { label: 'My Listings', icon: Building2, href: '/owner-listings' },
    { label: 'Tenants', icon: Users, href: '/tenants' },
    { label: 'Payment Tracker', icon: IndianRupee, href: '/payment-tracker' },
    { label: 'Expenses', icon: Receipt, href: '/expenses' },
  ];

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-80px)] bg-surface border-r border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-1">Owner Portal</h2>
              <p className="text-sm text-muted-foreground">Manage your properties</p>
            </div>
            <nav className="flex-1 px-4">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn('sidebar-link mb-1', link.active && 'active')}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border">
              <Link to="/list-property">
                <Button variant="default" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome back, {user?.firstName || 'Owner'}!
                </h1>
                <p className="text-muted-foreground">Here's what's happening with your properties.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon">
                  <Bell className="w-5 h-5" />
                </Button>
                <Link to="/list-property" className="hidden md:block">
                  <Button variant="default">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Property
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="stat-card">
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statsArray.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="stat-card">
                      <div className="flex items-center justify-between mb-4">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.color)}>
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                      <div className="text-xs text-emerald-600 mt-2">{stat.change}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Actions - Mobile */}
            <div className="grid grid-cols-2 gap-3 mb-8 lg:hidden">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} to={action.href}>
                    <Button
                      variant={action.primary ? 'default' : 'outline'}
                      className="w-full h-auto py-4 flex-col gap-2"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="bg-surface rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
                    <Button variant="ghost" size="sm">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : recentActivity.length > 0 ? (
                      recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between py-3 border-b border-border last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-10 h-10 rounded-xl flex items-center justify-center',
                              activity.type === 'payment' ? 'bg-emerald-50 text-emerald-600' :
                              activity.type === 'booking' ? 'bg-blue-50 text-blue-600' :
                              'bg-amber-50 text-amber-600'
                            )}>
                              {activity.type === 'payment' ? <IndianRupee className="w-5 h-5" /> :
                               activity.type === 'booking' ? <Calendar className="w-5 h-5" /> :
                               <Settings className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{activity.message}</p>
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                          {activity.amount && (
                            <span className="text-sm font-semibold text-emerald-600">
                              +{activity.amount}
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No recent activity</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pending Payments */}
              <div>
                <div className="bg-surface rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">Pending Payments</h2>
                    <span className="badge badge-warning">{pendingPayments.length}</span>
                  </div>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : pendingPayments.length > 0 ? (
                      pendingPayments.map((payment) => (
                        <div
                          key={payment.id}
                          className="p-4 rounded-xl bg-secondary/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-foreground">{payment.name}</span>
                            <span className="text-sm font-semibold text-foreground">{payment.amount}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{payment.property}</span>
                            <span className="text-amber-600">{payment.dueIn}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No pending payments</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link to="/payment-tracker" className="flex-1">
                      <Button variant="default" className="w-full">
                        Payment Tracker
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/tenants" className="flex-1">
                      <Button variant="outline" className="w-full">
                        All Tenants
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default OwnerDashboard;
