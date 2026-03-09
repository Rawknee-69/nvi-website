import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/clerk-react';
import {
  Building2,
  Users,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Star,
  Home,
  Receipt,
  Settings,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Property {
  id: string;
  name: string;
  propertyType: string;
  city: string;
  area: string;
  totalBeds: number;
  monthlyRent: number;
  photos: string[];
  status: string;
  address: string;
}

const OwnerListings = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    occupancy: '0/0',
    revenue: 0,
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'https://nivapi.invoiceman.in/api';
      const response = await fetch(`${apiUrl}/owner/properties`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      
      if (data.success) {
        setProperties(data.properties || []);
        
        // Calculate stats
        const total = data.properties.length;
        const active = data.properties.filter((p: Property) => p.status === 'approved' || p.status === 'active').length;
        const totalBeds = data.properties.reduce((sum: number, p: Property) => sum + (p.totalBeds || 0), 0);
        const revenue = data.properties.reduce((sum: number, p: Property) => sum + (p.monthlyRent || 0), 0);
        
        setStats({
          total,
          active,
          occupancy: `0/${totalBeds}`, // TODO: Calculate actual occupancy from tenants
          revenue,
        });
      }
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'https://nivapi.invoiceman.in/api';
      const response = await fetch(`${apiUrl}/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      toast.success('Property deleted successfully');
      fetchProperties(); // Refresh list
    } catch (error: any) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const formatCurrency = (amount: number): string => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const sidebarLinks = [
    { label: 'Dashboard', icon: Home, href: '/owner-dashboard' },
    { label: 'My Listings', icon: Building2, href: '/owner-listings', active: true },
    { label: 'Tenants', icon: Users, href: '/tenants' },
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
                <h1 className="text-2xl font-bold text-foreground">My Properties</h1>
                <p className="text-muted-foreground">Manage and track all your listings</p>
              </div>
              <Link to="/list-property">
                <Button variant="default">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </Link>
            </div>

            {/* Stats */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="stat-card">
                    <div className="flex items-center justify-center h-20">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="stat-card">
                  <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Properties</div>
                </div>
                <div className="stat-card">
                  <div className="text-2xl font-bold text-foreground">{stats.active}</div>
                  <div className="text-sm text-muted-foreground">Active Listings</div>
                </div>
                <div className="stat-card">
                  <div className="text-2xl font-bold text-foreground">{stats.occupancy}</div>
                  <div className="text-sm text-muted-foreground">Total Occupancy</div>
                </div>
                <div className="stat-card">
                  <div className="text-2xl font-bold text-foreground">{formatCurrency(stats.revenue)}</div>
                  <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                </div>
              </div>
            )}

            {/* Properties Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : properties.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {properties.map((property) => {
                  // Base URL without /api since photos are served from root
                  const baseUrl = (import.meta.env.VITE_API_URL || 'https://nivapi.invoiceman.in/api').replace('/api', '');
                  const photoArray = property.photos || [];
                  let imageUrl = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop';
                  
                  if (photoArray.length > 0) {
                    const firstPhoto = photoArray[0];
                    if (firstPhoto.startsWith('data:image/')) {
                      imageUrl = firstPhoto;
                    } else if (firstPhoto.startsWith('http://') || firstPhoto.startsWith('https://')) {
                      imageUrl = firstPhoto;
                    } else if (firstPhoto.startsWith('/')) {
                      imageUrl = `${baseUrl}${firstPhoto}`;
                    } else if (firstPhoto.startsWith('photos/')) {
                      imageUrl = `${baseUrl}/${firstPhoto}`;
                    } else {
                      imageUrl = `${baseUrl}/photos/${firstPhoto}`;
                    }
                  }
                  
                  return (
                    <div
                      key={property.id}
                      className="bg-surface rounded-2xl border border-border overflow-hidden"
                    >
                      <div className="flex">
                        <div className="w-32 h-32 shrink-0">
                          <img
                            src={imageUrl}
                            alt={property.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop';
                            }}
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{property.name}</h3>
                                <span className={cn(
                                  'badge text-xs',
                                  property.status === 'approved' || property.status === 'active' 
                                    ? 'badge-success' 
                                    : 'badge-warning'
                                )}>
                                  {property.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                                <MapPin className="w-3.5 h-3.5" />
                                {property.area}, {property.city}
                              </div>
                            </div>
                            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="text-foreground font-medium">0/{property.totalBeds}</span>
                            </div>
                            <div className="text-emerald-600 font-semibold">
                              {formatCurrency(property.monthlyRent)}/mo
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-border p-3 flex gap-2">
                        <Link to={`/property/${property.id}`} className="flex-1">
                          <Button variant="ghost" size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link to={`/edit-property/${property.id}`} className="flex-1">
                          <Button variant="ghost" size="sm" className="w-full">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(property.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No properties yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start by listing your first property
                </p>
                <Link to="/list-property">
                  <Button variant="default">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Property
                  </Button>
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default OwnerListings;
