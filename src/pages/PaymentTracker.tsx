import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Users,
  Search,
  Home,
  Receipt,
  Settings,
  Plus,
  Calendar,
  IndianRupee,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Download,
  Mail,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PaymentTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProperty, setFilterProperty] = useState('all');

  const payments = [
    {
      id: '1',
      tenantName: 'Amit Singh',
      tenantEmail: 'amit@email.com',
      tenantPhone: '+91 98765 43212',
      property: 'Sunshine PG',
      room: 'Room 102',
      rentAmount: 8500,
      dueDate: '2024-11-28',
      status: 'pending',
      daysOverdue: 0,
      lastPaymentDate: '2024-10-28',
    },
    {
      id: '2',
      tenantName: 'Neha Gupta',
      tenantEmail: 'neha@email.com',
      tenantPhone: '+91 98765 43213',
      property: 'Urban Nest',
      room: 'Flat A',
      rentAmount: 15000,
      dueDate: '2024-11-25',
      status: 'overdue',
      daysOverdue: 3,
      lastPaymentDate: '2024-10-25',
    },
    {
      id: '3',
      tenantName: 'Rahul Kumar',
      tenantEmail: 'rahul@email.com',
      tenantPhone: '+91 98765 43210',
      property: 'Sunshine PG',
      room: 'Room 101',
      rentAmount: 8500,
      dueDate: '2024-12-01',
      status: 'pending',
      daysOverdue: 0,
      lastPaymentDate: '2024-11-01',
    },
    {
      id: '4',
      tenantName: 'Priya Sharma',
      tenantEmail: 'priya@email.com',
      tenantPhone: '+91 98765 43211',
      property: 'Green Valley Hostel',
      room: 'Room 205',
      rentAmount: 12000,
      dueDate: '2024-11-20',
      status: 'paid',
      daysOverdue: 0,
      lastPaymentDate: '2024-11-20',
    },
    {
      id: '5',
      tenantName: 'Vikram Patel',
      tenantEmail: 'vikram@email.com',
      tenantPhone: '+91 98765 43214',
      property: 'Green Valley Hostel',
      room: 'Room 301',
      rentAmount: 12000,
      dueDate: '2024-11-22',
      status: 'paid',
      daysOverdue: 0,
      lastPaymentDate: '2024-11-22',
    },
    {
      id: '6',
      tenantName: 'Sneha Reddy',
      tenantEmail: 'sneha@email.com',
      tenantPhone: '+91 98765 43215',
      property: 'Urban Nest',
      room: 'Flat B',
      rentAmount: 15000,
      dueDate: '2024-11-15',
      status: 'overdue',
      daysOverdue: 13,
      lastPaymentDate: '2024-10-15',
    },
  ];

  const properties = ['all', 'Sunshine PG', 'Green Valley Hostel', 'Urban Nest'];

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.tenantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.property.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesProperty = filterProperty === 'all' || payment.property === filterProperty;
    return matchesSearch && matchesStatus && matchesProperty;
  });

  const totalPending = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.rentAmount, 0);
  const totalOverdue = payments
    .filter((p) => p.status === 'overdue')
    .reduce((sum, p) => sum + p.rentAmount, 0);
  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.rentAmount, 0);

  const sidebarLinks = [
    { label: 'Dashboard', icon: Home, href: '/owner-dashboard' },
    { label: 'My Listings', icon: Building2, href: '/owner-listings' },
    { label: 'Tenants', icon: Users, href: '/tenants' },
    { label: 'Payment Tracker', icon: Receipt, href: '/payment-tracker', active: true },
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

  const handleSendReminder = (paymentId: string) => {
    // In a real app, this would send an email/SMS reminder
    alert('Reminder sent to tenant!');
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
                <h1 className="text-2xl font-bold text-foreground">Payment Due Tracker</h1>
                <p className="text-muted-foreground">Monitor tenant rent payments in real-time</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock className="w-4 h-4" />
                  Pending Payments
                </div>
                <div className="text-2xl font-bold text-amber-600">
                  ₹{totalPending.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {payments.filter((p) => p.status === 'pending').length} tenants
                </div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <AlertCircle className="w-4 h-4" />
                  Overdue Payments
                </div>
                <div className="text-2xl font-bold text-red-600">
                  ₹{totalOverdue.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {payments.filter((p) => p.status === 'overdue').length} tenants
                </div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Paid This Month
                </div>
                <div className="text-2xl font-bold text-emerald-600">
                  ₹{totalPaid.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {payments.filter((p) => p.status === 'paid').length} tenants
                </div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <IndianRupee className="w-4 h-4" />
                  Collection Rate
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round((totalPaid / (totalPaid + totalPending + totalOverdue)) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">This month</div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by tenant name, email, or property..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
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

            {/* Payments Table */}
            <div className="table-container overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tenant</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Property</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rent Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Due Date</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Payment</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className={cn(
                        'border-b border-border hover:bg-secondary/30 transition-colors',
                        payment.status === 'overdue' && 'bg-red-50/50'
                      )}
                    >
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-foreground">{payment.tenantName}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" />
                            {payment.tenantEmail}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {payment.tenantPhone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-foreground">{payment.property}</div>
                        <div className="text-sm text-muted-foreground">{payment.room}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 font-semibold text-foreground">
                          <IndianRupee className="w-4 h-4" />
                          {payment.rentAmount.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">/month</div>
                      </td>
                      <td className="p-4">
                        <div className="text-foreground">
                          {new Date(payment.dueDate).toLocaleDateString()}
                        </div>
                        {payment.daysOverdue > 0 && (
                          <div className="text-xs text-red-600 font-medium">
                            {payment.daysOverdue} days overdue
                          </div>
                        )}
                      </td>
                      <td className="p-4">{getStatusBadge(payment.status)}</td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">
                          {new Date(payment.lastPaymentDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {payment.status !== 'paid' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendReminder(payment.id)}
                            >
                              <Mail className="w-4 h-4 mr-1" />
                              Remind
                            </Button>
                          )}
                          <Link to={`/tenants?tenant=${payment.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPayments.length === 0 && (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-1">No payments found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-surface rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Expected</span>
                    <span className="font-semibold text-foreground">
                      ₹{(totalPaid + totalPending + totalOverdue).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Paid</span>
                    <span className="font-semibold text-emerald-600">
                      ₹{totalPaid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <span className="font-semibold text-amber-600">
                      ₹{totalPending.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overdue</span>
                    <span className="font-semibold text-red-600">
                      ₹{totalOverdue.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">Outstanding</span>
                      <span className="font-bold text-red-600">
                        ₹{(totalPending + totalOverdue).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Bulk Reminders
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download Payment Report
                  </Button>
                  <Link to="/tenants" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      View All Tenants
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentTracker;

