import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Home,
  Heart,
  AlertCircle,
  Gift,
  Search,
  Plus,
  Calendar,
  IndianRupee,
  MapPin,
  Star,
  CheckCircle2,
  Clock,
  X,
  Trash2,
  Filter,
  Award,
  TrendingUp,
  Building2,
  Users,
  Eye,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PropertyCard from '@/components/PropertyCard';
import { mockListings } from '@/data/mockListings';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'wishlist' | 'complaints' | 'rewards'>('bookings');
  const [searchQuery, setSearchQuery] = useState('');
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    title: '',
    description: '',
    category: 'maintenance',
    property: '',
  });

  // Mock data for bookings
  const [bookings, setBookings] = useState([
    {
      id: '1',
      propertyId: 'prop_1',
      propertyName: 'Sunshine PG for Boys',
      propertyType: 'PG',
      address: '123 Main Street, Koramangala',
      city: 'Bangalore',
      area: 'Koramangala',
      monthlyRent: 8500,
      securityDeposit: 17000,
      status: 'confirmed',
      bookingDate: '2024-11-15',
      moveInDate: '2024-12-01',
      duration: '6 months',
      ownerName: 'Rajesh Kumar',
      ownerEmail: 'rajesh@example.com',
      photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
    },
    {
      id: '2',
      propertyId: 'prop_2',
      propertyName: 'Green Valley Hostel',
      propertyType: 'Hostel',
      address: '456 Park Avenue, HSR Layout',
      city: 'Bangalore',
      area: 'HSR Layout',
      monthlyRent: 12000,
      securityDeposit: 24000,
      status: 'pending',
      bookingDate: '2024-11-20',
      moveInDate: '2025-01-01',
      duration: '12 months',
      ownerName: 'Priya Sharma',
      ownerEmail: 'priya@example.com',
      photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
    },
    {
      id: '3',
      propertyId: 'prop_3',
      propertyName: 'Comfort Zone Flat',
      propertyType: 'Flat',
      address: '789 MG Road, Indiranagar',
      city: 'Bangalore',
      area: 'Indiranagar',
      monthlyRent: 15000,
      securityDeposit: 30000,
      status: 'cancelled',
      bookingDate: '2024-10-10',
      moveInDate: '2024-11-01',
      duration: '3 months',
      ownerName: 'Amit Patel',
      ownerEmail: 'amit@example.com',
      photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
    },
  ]);

  // Mock data for wishlist
  const [wishlist, setWishlist] = useState(mockListings.slice(0, 3));

  // Mock data for complaints
  const [complaints, setComplaints] = useState([
    {
      id: '1',
      title: 'WiFi Connection Issue',
      description: 'WiFi keeps disconnecting in Room 101. Need urgent fix.',
      category: 'maintenance',
      property: 'Sunshine PG',
      status: 'active',
      date: '2024-11-20',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Cleaning Request',
      description: 'Common area needs cleaning. Trash not being collected regularly.',
      category: 'cleanliness',
      property: 'Sunshine PG',
      status: 'in-progress',
      date: '2024-11-18',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Water Leakage',
      description: 'Water leakage from ceiling in bathroom. Reported last week.',
      category: 'maintenance',
      property: 'Sunshine PG',
      status: 'resolved',
      date: '2024-11-10',
      priority: 'high',
    },
  ]);

  // Mock data for reward points
  const rewardPoints = 1250;
  const rewardHistory = [
    { id: '1', action: 'On-time rent payment', points: 100, date: '2024-11-01', type: 'earned' },
    { id: '2', action: 'Referred a friend', points: 500, date: '2024-10-15', type: 'earned' },
    { id: '3', action: 'Redeemed discount voucher', points: -200, date: '2024-10-10', type: 'redeemed' },
    { id: '4', action: '6 months stay bonus', points: 300, date: '2024-09-01', type: 'earned' },
    { id: '5', action: 'On-time rent payment', points: 100, date: '2024-08-01', type: 'earned' },
    { id: '6', action: 'Redeemed free WiFi upgrade', points: -150, date: '2024-07-15', type: 'redeemed' },
  ];

  const filteredWishlist = wishlist.filter((property) =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const newComplaint = {
      id: String(complaints.length + 1),
      ...complaintForm,
      status: 'active',
      date: new Date().toISOString().split('T')[0],
      priority: complaintForm.category === 'maintenance' ? 'high' : 'medium',
    };
    setComplaints([newComplaint, ...complaints]);
    setComplaintForm({ title: '', description: '', category: 'maintenance', property: '' });
    setShowComplaintForm(false);
  };

  const handleRemoveFromWishlist = (id: string) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-warning">Active</span>;
      case 'in-progress':
        return <span className="badge badge-info">In Progress</span>;
      case 'resolved':
        return <span className="badge badge-success">Resolved</span>;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const sidebarLinks = [
    { label: 'Dashboard', icon: Home, href: '/student-dashboard', active: true },
    { label: 'Find Stays', icon: Search, href: '/listings' },
  ];

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-80px)] bg-surface border-r border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-1">Student Portal</h2>
              <p className="text-sm text-muted-foreground">Manage your stay</p>
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
              <Link to="/listings">
                <Button variant="default" className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Find Stays
                </Button>
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Welcome back, Student!</h1>
                <p className="text-muted-foreground">Manage your accommodation and rewards</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">{rewardPoints.toLocaleString()} Points</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
              <button
                onClick={() => setActiveTab('bookings')}
                className={cn(
                  'px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === 'bookings'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  My Bookings ({bookings.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={cn(
                  'px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === 'wishlist'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Wishlist ({wishlist.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('complaints')}
                className={cn(
                  'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'complaints'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Complaints ({complaints.filter((c) => c.status !== 'resolved').length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={cn(
                  'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'rewards'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Reward Points
                </div>
              </button>
            </div>

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Your Bookings</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage and track your property bookings
                    </p>
                  </div>
                  <Link to="/listings">
                    <Button variant="default">
                      <Plus className="w-4 h-4 mr-2" />
                      Book New Property
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const getStatusBadge = (status: string) => {
                      switch (status) {
                        case 'confirmed':
                          return <span className="badge badge-success">Confirmed</span>;
                        case 'pending':
                          return <span className="badge badge-warning">Pending</span>;
                        case 'cancelled':
                          return <span className="badge badge-danger">Cancelled</span>;
                        default:
                          return null;
                      }
                    };

                    return (
                      <div
                        key={booking.id}
                        className="bg-surface rounded-2xl border border-border p-6 hover:shadow-soft transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Property Image */}
                          <div className="md:w-48 h-48 rounded-xl overflow-hidden shrink-0">
                            <img
                              src={booking.photos[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop'}
                              alt={booking.propertyName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop';
                              }}
                            />
                          </div>

                          {/* Booking Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-semibold text-foreground">
                                    {booking.propertyName}
                                  </h3>
                                  {getStatusBadge(booking.status)}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {booking.area}, {booking.city}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Building2 className="w-4 h-4" />
                                    {booking.propertyType}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{booking.address}</p>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div className="bg-secondary/50 rounded-lg p-3">
                                <div className="text-xs text-muted-foreground mb-1">Monthly Rent</div>
                                <div className="text-lg font-semibold text-foreground">
                                  <IndianRupee className="w-4 h-4 inline" />
                                  {booking.monthlyRent.toLocaleString()}/month
                                </div>
                              </div>
                              <div className="bg-secondary/50 rounded-lg p-3">
                                <div className="text-xs text-muted-foreground mb-1">Security Deposit</div>
                                <div className="text-lg font-semibold text-foreground">
                                  <IndianRupee className="w-4 h-4 inline" />
                                  {booking.securityDeposit.toLocaleString()}
                                </div>
                              </div>
                              <div className="bg-secondary/50 rounded-lg p-3">
                                <div className="text-xs text-muted-foreground mb-1">Move-in Date</div>
                                <div className="text-sm font-medium text-foreground">
                                  {new Date(booking.moveInDate).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </div>
                              </div>
                              <div className="bg-secondary/50 rounded-lg p-3">
                                <div className="text-xs text-muted-foreground mb-1">Duration</div>
                                <div className="text-sm font-medium text-foreground">{booking.duration}</div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-border">
                              <div className="text-sm text-muted-foreground">
                                <span>Owner: {booking.ownerName}</span>
                                {booking.ownerEmail && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2 h-auto p-0 text-primary hover:text-primary/80"
                                    onClick={() => {
                                      const subject = encodeURIComponent(`Inquiry about booking - ${booking.propertyName}`);
                                      const body = encodeURIComponent(
                                        `Hello ${booking.ownerName},\n\nI have a booking for ${booking.propertyName}.\n\nCould you please provide more information?\n\nThank you!`
                                      );
                                      window.location.href = `mailto:${booking.ownerEmail}?subject=${subject}&body=${body}`;
                                    }}
                                  >
                                    <Mail className="w-4 h-4 mr-1" />
                                    Contact
                                  </Button>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Link to={`/property/${booking.propertyId}`}>
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Property
                                  </Button>
                                </Link>
                                {booking.status === 'pending' && (
                                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {bookings.length === 0 && (
                    <div className="text-center py-20">
                      <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Start exploring properties and book your perfect stay
                      </p>
                      <Link to="/listings">
                        <Button variant="default">
                          <Search className="w-4 h-4 mr-2" />
                          Browse Properties
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search wishlist..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12"
                    />
                  </div>
                  <Link to="/listings">
                    <Button variant="default">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Properties
                    </Button>
                  </Link>
                </div>

                {filteredWishlist.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWishlist.map((property) => (
                      <div key={property.id} className="relative">
                        <PropertyCard property={property} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 bg-background/80 hover:bg-background"
                          onClick={() => handleRemoveFromWishlist(property.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {searchQuery ? 'No properties found' : 'Your wishlist is empty'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery
                        ? 'Try adjusting your search'
                        : 'Start saving properties you like to compare them later'}
                    </p>
                    <Link to="/listings">
                      <Button variant="default">
                        <Plus className="w-4 h-4 mr-2" />
                        Browse Properties
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Complaints Tab */}
            {activeTab === 'complaints' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Your Complaints</h2>
                    <p className="text-sm text-muted-foreground">
                      Track and manage your reported issues
                    </p>
                  </div>
                  <Button
                    variant="default"
                    onClick={() => setShowComplaintForm(!showComplaintForm)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Complaint
                  </Button>
                </div>

                {/* Complaint Form */}
                {showComplaintForm && (
                  <div className="bg-surface rounded-2xl border border-border p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">Report an Issue</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowComplaintForm(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <form onSubmit={handleAddComplaint} className="space-y-4">
                      <div>
                        <label className="form-label">Title</label>
                        <Input
                          value={complaintForm.title}
                          onChange={(e) =>
                            setComplaintForm({ ...complaintForm, title: e.target.value })
                          }
                          placeholder="Brief description of the issue"
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Category</label>
                        <select
                          value={complaintForm.category}
                          onChange={(e) =>
                            setComplaintForm({ ...complaintForm, category: e.target.value })
                          }
                          className="form-input"
                          required
                        >
                          <option value="maintenance">Maintenance</option>
                          <option value="cleanliness">Cleanliness</option>
                          <option value="safety">Safety</option>
                          <option value="noise">Noise</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Property</label>
                        <Input
                          value={complaintForm.property}
                          onChange={(e) =>
                            setComplaintForm({ ...complaintForm, property: e.target.value })
                          }
                          placeholder="Property name"
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Description</label>
                        <Textarea
                          value={complaintForm.description}
                          onChange={(e) =>
                            setComplaintForm({ ...complaintForm, description: e.target.value })
                          }
                          placeholder="Provide detailed information about the issue"
                          rows={4}
                          required
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button type="submit" variant="default">
                          Submit Complaint
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowComplaintForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Complaints List */}
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="bg-surface rounded-2xl border border-border p-6 hover:shadow-soft transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {complaint.title}
                            </h3>
                            {getStatusBadge(complaint.status)}
                            <span
                              className={cn(
                                'px-2 py-1 rounded-lg text-xs font-medium capitalize',
                                getPriorityColor(complaint.priority)
                              )}
                            >
                              {complaint.priority} priority
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{complaint.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {complaint.property}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(complaint.date).toLocaleDateString()}
                            </span>
                            <span className="capitalize">{complaint.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {complaints.length === 0 && (
                    <div className="text-center py-20">
                      <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No complaints yet
                      </h3>
                      <p className="text-muted-foreground">
                        Report any issues you encounter at your accommodation
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rewards Tab */}
            {activeTab === 'rewards' && (
              <div>
                {/* Points Overview */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-6 text-primary-foreground">
                    <div className="flex items-center justify-between mb-4">
                      <Award className="w-8 h-8" />
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{rewardPoints.toLocaleString()}</div>
                    <div className="text-sm opacity-90">Total Points</div>
                  </div>
                  <div className="stat-card">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Gift className="w-4 h-4" />
                      Available for Redemption
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {rewardPoints.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Points ready to use</div>
                  </div>
                  <div className="stat-card">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Star className="w-4 h-4" />
                      This Month
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">+100</div>
                    <div className="text-xs text-muted-foreground">Points earned</div>
                  </div>
                </div>

                {/* Rewards Info */}
                <div className="bg-surface rounded-2xl border border-border p-6 mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    How to Earn Points
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">On-time Rent Payment</div>
                        <div className="text-sm text-muted-foreground">Earn 100 points each month</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Refer a Friend</div>
                        <div className="text-sm text-muted-foreground">Earn 500 points per referral</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Long-term Stay</div>
                        <div className="text-sm text-muted-foreground">Bonus points for extended stays</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Leave Reviews</div>
                        <div className="text-sm text-muted-foreground">Earn points for helpful reviews</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Redemption Options */}
                <div className="bg-surface rounded-2xl border border-border p-6 mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Redeem Your Points
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border border-border rounded-xl p-4 hover:border-primary transition-colors">
                      <div className="text-2xl font-bold text-primary mb-1">200</div>
                      <div className="text-sm font-medium text-foreground mb-1">Discount Voucher</div>
                      <div className="text-xs text-muted-foreground mb-3">₹500 off on rent</div>
                      <Button variant="outline" size="sm" className="w-full" disabled={rewardPoints < 200}>
                        Redeem
                      </Button>
                    </div>
                    <div className="border border-border rounded-xl p-4 hover:border-primary transition-colors">
                      <div className="text-2xl font-bold text-primary mb-1">150</div>
                      <div className="text-sm font-medium text-foreground mb-1">WiFi Upgrade</div>
                      <div className="text-xs text-muted-foreground mb-3">Free high-speed WiFi</div>
                      <Button variant="outline" size="sm" className="w-full" disabled={rewardPoints < 150}>
                        Redeem
                      </Button>
                    </div>
                    <div className="border border-border rounded-xl p-4 hover:border-primary transition-colors">
                      <div className="text-2xl font-bold text-primary mb-1">300</div>
                      <div className="text-sm font-medium text-foreground mb-1">Cleaning Service</div>
                      <div className="text-xs text-muted-foreground mb-3">Free deep cleaning</div>
                      <Button variant="outline" size="sm" className="w-full" disabled={rewardPoints < 300}>
                        Redeem
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Points History */}
                <div className="bg-surface rounded-2xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Points History</h3>
                  <div className="space-y-3">
                    {rewardHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-3 border-b border-border last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-10 h-10 rounded-xl flex items-center justify-center',
                              item.type === 'earned'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-amber-50 text-amber-600'
                            )}
                          >
                            {item.type === 'earned' ? (
                              <TrendingUp className="w-5 h-5" />
                            ) : (
                              <Gift className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{item.action}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(item.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div
                          className={cn(
                            'font-semibold',
                            item.type === 'earned' ? 'text-emerald-600' : 'text-amber-600'
                          )}
                        >
                          {item.type === 'earned' ? '+' : ''}
                          {item.points} pts
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;

