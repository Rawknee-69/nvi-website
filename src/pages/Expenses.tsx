import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Users,
  Search,
  Plus,
  Home,
  Receipt,
  Settings,
  IndianRupee,
  Calendar,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  Wrench,
  Zap,
  Droplets,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Expenses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterProperty, setFilterProperty] = useState('all');

  const expenses = [
    {
      id: '1',
      description: 'Plumbing repair - Room 101',
      property: 'Sunshine PG',
      category: 'maintenance',
      amount: 2500,
      date: '2024-11-25',
      status: 'paid',
    },
    {
      id: '2',
      description: 'Electricity Bill - November',
      property: 'Sunshine PG',
      category: 'utilities',
      amount: 8500,
      date: '2024-11-20',
      status: 'paid',
    },
    {
      id: '3',
      description: 'Water Bill - November',
      property: 'Green Valley Hostel',
      category: 'utilities',
      amount: 3200,
      date: '2024-11-18',
      status: 'pending',
    },
    {
      id: '4',
      description: 'Security Guard Salary',
      property: 'All Properties',
      category: 'salary',
      amount: 15000,
      date: '2024-11-15',
      status: 'paid',
    },
    {
      id: '5',
      description: 'WiFi Router Replacement',
      property: 'Urban Nest',
      category: 'maintenance',
      amount: 4500,
      date: '2024-11-12',
      status: 'paid',
    },
    {
      id: '6',
      description: 'AC Service - All Rooms',
      property: 'Green Valley Hostel',
      category: 'maintenance',
      amount: 12000,
      date: '2024-11-10',
      status: 'paid',
    },
  ];

  const categories = ['all', 'maintenance', 'utilities', 'salary', 'other'];
  const properties = ['all', 'Sunshine PG', 'Green Valley Hostel', 'Urban Nest'];

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    const matchesProperty = filterProperty === 'all' || expense.property === filterProperty || expense.property === 'All Properties';
    return matchesSearch && matchesCategory && matchesProperty;
  });

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const paidExpenses = expenses.filter((exp) => exp.status === 'paid').reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter((exp) => exp.status === 'pending').reduce((sum, exp) => sum + exp.amount, 0);

  const sidebarLinks = [
    { label: 'Dashboard', icon: Home, href: '/owner-dashboard' },
    { label: 'My Listings', icon: Building2, href: '/owner-listings' },
    { label: 'Tenants', icon: Users, href: '/tenants' },
    { label: 'Expenses', icon: Receipt, href: '/expenses', active: true },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance':
        return Wrench;
      case 'utilities':
        return Zap;
      case 'salary':
        return Users;
      default:
        return Receipt;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'maintenance':
        return 'bg-amber-50 text-amber-600';
      case 'utilities':
        return 'bg-blue-50 text-blue-600';
      case 'salary':
        return 'bg-purple-50 text-purple-600';
      default:
        return 'bg-gray-50 text-gray-600';
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
                <h1 className="text-2xl font-bold text-foreground">Expenses</h1>
                <p className="text-muted-foreground">Track and manage property expenses</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="default">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <TrendingDown className="w-4 h-4" />
                  Total Expenses
                </div>
                <div className="text-2xl font-bold text-foreground">
                  ₹{totalExpenses.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">This month</div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <IndianRupee className="w-4 h-4" />
                  Paid
                </div>
                <div className="text-2xl font-bold text-emerald-600">
                  ₹{paidExpenses.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">{expenses.filter((e) => e.status === 'paid').length} transactions</div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  Pending
                </div>
                <div className="text-2xl font-bold text-amber-600">
                  ₹{pendingExpenses.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">{expenses.filter((e) => e.status === 'pending').length} transactions</div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <TrendingUp className="w-4 h-4" />
                  vs Last Month
                </div>
                <div className="text-2xl font-bold text-red-600">+12%</div>
                <div className="text-xs text-muted-foreground">₹5,200 more</div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="h-11 px-4 rounded-xl border border-border bg-background text-foreground text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
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

            {/* Expenses Table */}
            <div className="table-container overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Description</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Property</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => {
                    const CategoryIcon = getCategoryIcon(expense.category);
                    return (
                      <tr key={expense.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', getCategoryColor(expense.category))}>
                              <CategoryIcon className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-foreground">{expense.description}</span>
                          </div>
                        </td>
                        <td className="p-4 text-foreground">{expense.property}</td>
                        <td className="p-4">
                          <span className="capitalize text-muted-foreground">{expense.category}</span>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-semibold text-foreground">
                            ₹{expense.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            'badge',
                            expense.status === 'paid' ? 'badge-success' : 'badge-warning'
                          )}>
                            {expense.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredExpenses.length === 0 && (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-1">No expenses found</h3>
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

export default Expenses;
