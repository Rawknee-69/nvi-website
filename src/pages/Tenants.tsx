import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Users,
  Search,
  Phone,
  Mail,
  MoreVertical,
  Home,
  Receipt,
  Settings,
  Plus,
  Calendar,
  IndianRupee,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Tenants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProperty, setFilterProperty] = useState('all');

  const tenants = [
    {
      id: '1',
      name: 'Rahul Kumar',
      property: 'Sunshine PG',
      room: 'Room 101',
      phone: '+91 98765 43210',
      email: 'rahul@email.com',
      rentAmount: 8500,
      joinDate: '2024-01-15',
      status: 'paid',
      avatar: 'RK',
    },
    {
      id: '2',
      name: 'Priya Sharma',
      property: 'Green Valley Hostel',
      room: 'Room 205',
      phone: '+91 98765 43211',
      email: 'priya@email.com',
      rentAmount: 12000,
      joinDate: '2024-02-01',
      status: 'paid',
      avatar: 'PS',
    },
    {
      id: '3',
      name: 'Amit Singh',
      property: 'Sunshine PG',
      room: 'Room 102',
      phone: '+91 98765 43212',
      email: 'amit@email.com',
      rentAmount: 8500,
      joinDate: '2024-03-10',
      status: 'pending',
      avatar: 'AS',
    },
    {
      id: '4',
      name: 'Neha Gupta',
      property: 'Urban Nest',
      room: 'Flat A',
      phone: '+91 98765 43213',
      email: 'neha@email.com',
      rentAmount: 15000,
      joinDate: '2024-01-20',
      status: 'overdue',
      avatar: 'NG',
    },
    {
      id: '5',
      name: 'Vikram Patel',
      property: 'Green Valley Hostel',
      room: 'Room 301',
      phone: '+91 98765 43214',
      email: 'vikram@email.com',
      rentAmount: 12000,
      joinDate: '2024-04-05',
      status: 'paid',
      avatar: 'VP',
    },
  ];

  const properties = ['all', 'Sunshine PG', 'Green Valley Hostel', 'Urban Nest'];

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProperty =
      filterProperty === 'all' || tenant.property === filterProperty;
    return matchesSearch && matchesProperty;
  });

  const sidebarLinks = [
    { label: 'Dashboard', icon: Home, href: '/owner-dashboard' },
    { label: 'My Listings', icon: Building2, href: '/owner-listings' },
    { label: 'Tenants', icon: Users, href: '/tenants', active: true },
    { label: 'Expenses', icon: Receipt, href: '/expenses' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="badge badge-success">Paid</span>;
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'overdue':
        return <span className="badge badge-danger">Overdue</span>;
      default:
        return null;
    }
  };

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
                <h1 className="text-2xl font-bold text-foreground">Tenants</h1>
                <p className="text-muted-foreground">Manage your tenants and track payments</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="stat-card">
                <div className="text-2xl font-bold text-foreground">{tenants.length}</div>
                <div className="text-sm text-muted-foreground">Total Tenants</div>
              </div>
              <div className="stat-card">
                <div className="text-2xl font-bold text-emerald-600">
                  {tenants.filter((t) => t.status === 'paid').length}
                </div>
                <div className="text-sm text-muted-foreground">Paid This Month</div>
              </div>
              <div className="stat-card">
                <div className="text-2xl font-bold text-amber-600">
                  {tenants.filter((t) => t.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="stat-card">
                <div className="text-2xl font-bold text-red-600">
                  {tenants.filter((t) => t.status === 'overdue').length}
                </div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tenants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>
              <select
                value={filterProperty}
                onChange={(e) => setFilterProperty(e.target.value)}
                className="h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm"
              >
                {properties.map((property) => (
                  <option key={property} value={property}>
                    {property === 'all' ? 'All Properties' : property}
                  </option>
                ))}
              </select>
            </div>

            {/* Tenants Table */}
            <div className="table-container overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tenant</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Property</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contact</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rent</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.map((tenant) => (
                    <tr key={tenant.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                            {tenant.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{tenant.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Since {new Date(tenant.joinDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-foreground">{tenant.property}</div>
                        <div className="text-sm text-muted-foreground">{tenant.room}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm text-foreground">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          {tenant.phone}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          {tenant.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 font-semibold text-foreground">
                          <IndianRupee className="w-4 h-4" />
                          {tenant.rentAmount.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">/month</div>
                      </td>
                      <td className="p-4">{getStatusBadge(tenant.status)}</td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="icon-sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTenants.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-1">No tenants found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Tenants;
