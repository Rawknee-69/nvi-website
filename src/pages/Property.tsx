import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Star,
  Users,
  Phone,
  Mail,
  Shield,
  Wifi,
  UtensilsCrossed,
  Droplets,
  Zap,
  Car,
  Tv,
  AirVent,
  BookOpen,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Heart,
  Calendar,
  Clock,
  IndianRupee,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PropertyData {
  id: string;
  name: string;
  propertyType: string;
  address: string;
  city: string;
  area: string;
  nearbyCollege?: string | null;
  gender?: string | null;
  occupancyType?: string | null;
  totalBeds: number;
  monthlyRent: number;
  securityDeposit: number;
  minStay: number;
  amenities: string[];
  rules: string;
  description: string;
  photos: string[];
  status: string;
  ownerEmail?: string | null;
  ownerName?: string | null;
}

const Property = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<PropertyData | null>(null);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/properties/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          setProperty(null);
          return;
        }
        throw new Error('Failed to fetch property');
      }

      const data = await response.json();
      
      if (data.success && data.property) {
        setProperty(data.property);
      } else {
        setProperty(null);
      }
    } catch (error: any) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property');
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading property...</p>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist.</p>
          <Link to="/listings">
            <Button variant="default">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listings
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const amenityIcons: Record<string, typeof Wifi> = {
    wifi: Wifi,
    food: UtensilsCrossed,
    water: Droplets,
    power: Zap,
    security: Shield,
    parking: Car,
  };

  const amenityLabels: Record<string, string> = {
    wifi: 'WiFi',
    food: 'Food/Meals',
    water: '24/7 Water',
    power: 'Power Backup',
    security: 'CCTV Security',
    parking: 'Parking',
  };

  const typeLabels: Record<string, string> = {
    pg: 'PG',
    hostel: 'Hostel',
    flat: 'Flat',
    room: 'Single Room',
  };

  const genderLabels: Record<string, string> = {
    male: 'Male Only',
    female: 'Female Only',
    unisex: 'Unisex',
  };

  const occupancyLabels: Record<string, string> = {
    single: 'Single Occupancy',
    double: 'Double Sharing',
    triple: 'Triple Sharing',
    multiple: 'Multiple Options',
  };

  // Format photos URLs - handle both 'photos' and 'images' field names
  // Base URL without /api since photos are served from root
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '');
  const photoArray = property.photos || (property as any).images || [];
  const photos = photoArray.map((photo: string) => {
    if (!photo) return '';
    // If already a full URL, return as is
    if (photo.startsWith('http://') || photo.startsWith('https://')) {
      return photo;
    }
    // If starts with /, it's a relative path from root
    if (photo.startsWith('/')) {
      return `${baseUrl}${photo}`;
    }
    // If starts with photos/, add the base URL
    if (photo.startsWith('photos/')) {
      return `${baseUrl}/${photo}`;
    }
    // Otherwise, assume it's a relative path and add /photos/ prefix
    return `${baseUrl}/photos/${photo}`;
  }).filter((url: string) => url.length > 0);

  // Parse rules from string (assuming they're separated by newlines or semicolons)
  const rulesList = property.rules
    ? property.rules.split(/\n|;/).filter((rule) => rule.trim().length > 0)
    : [];

  // Format minimum stay
  const formatMinStay = (months: number) => {
    if (months === 1) return '1 Month';
    if (months === 3) return '3 Months';
    if (months === 6) return '6 Months';
    if (months === 12) return '12 Months';
    return `${months} Month${months > 1 ? 's' : ''}`;
  };

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-surface border-b border-border">
          <div className="container-custom py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/listings" className="text-muted-foreground hover:text-primary">
                Listings
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">{property.name}</span>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                {photos.length > 0 ? (
                  <>
                    <div className="relative aspect-video rounded-2xl overflow-hidden">
                      <img
                        src={photos[selectedImage]}
                        alt={property.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop';
                        }}
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          variant="hero-outline"
                          size="icon"
                          onClick={() => setIsSaved(!isSaved)}
                          className="bg-surface/80 backdrop-blur-sm"
                        >
                          <Heart
                            className={cn('w-5 h-5', isSaved && 'fill-red-500 text-red-500')}
                          />
                        </Button>
                        <Button
                          variant="hero-outline"
                          size="icon"
                          className="bg-surface/80 backdrop-blur-sm"
                        >
                          <Share2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                    {photos.length > 1 && (
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {photos.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={cn(
                              'shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all',
                              selectedImage === index
                                ? 'border-primary'
                                : 'border-transparent opacity-70 hover:opacity-100'
                            )}
                          >
                            <img
                              src={image}
                              alt={`View ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop';
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-secondary flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No photos available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Basic Info */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="badge badge-primary">
                    {typeLabels[property.propertyType] || property.propertyType}
                  </span>
                  {property.status === 'approved' && (
                    <span className="badge badge-success">Verified</span>
                  )}
                  <span className="badge bg-emerald-50 text-emerald-700">Available</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {property.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {property.address || `${property.area}, ${property.city}`}
                    </span>
                  </div>
                  {property.nearbyCollege && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">Near {property.nearbyCollege}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-3">About this place</h2>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </div>
              )}

              {/* Property Details */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-foreground">Total Beds</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{property.totalBeds}</p>
                  </div>
                  {property.gender && (
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">Gender</span>
                      </div>
                      <p className="text-lg font-semibold text-foreground capitalize">
                        {genderLabels[property.gender] || property.gender}
                      </p>
                    </div>
                  )}
                  {property.occupancyType && (
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">Occupancy</span>
                      </div>
                      <p className="text-lg font-semibold text-foreground">
                        {occupancyLabels[property.occupancyType] || property.occupancyType}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity] || CheckCircle2;
                      const label = amenityLabels[amenity] || amenity;
                      return (
                        <div
                          key={amenity}
                          className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
                        >
                          <Icon className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-sm text-foreground">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* House Rules */}
              {rulesList.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">House Rules</h2>
                  <ul className="space-y-3">
                    {rulesList.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>{rule.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Nearby College */}
              {property.nearbyCollege && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Nearby</h2>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span className="text-foreground">{property.nearbyCollege}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-surface rounded-2xl border border-border p-6 shadow-soft">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">
                        ₹{property.monthlyRent.toLocaleString('en-IN')}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {property.totalBeds} bed{property.totalBeds !== 1 ? 's' : ''} available
                    </p>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <IndianRupee className="w-4 h-4" />
                        <span className="text-sm">Security Deposit</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        ₹{property.securityDeposit.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Minimum Stay</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {formatMinStay(property.minStay)}
                      </span>
                    </div>
                    {property.gender && (
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">For</span>
                        </div>
                        <span className="text-sm font-medium text-foreground capitalize">
                          {genderLabels[property.gender] || property.gender}
                        </span>
                      </div>
                    )}
                    {property.occupancyType && (
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">Occupancy</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {occupancyLabels[property.occupancyType] || property.occupancyType}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    {property.ownerEmail ? (
                      <>
                        <Button 
                          variant="hero" 
                          size="lg" 
                          className="w-full"
                          onClick={() => {
                            const subject = encodeURIComponent(`Book Visit - ${property.name}`);
                            const body = encodeURIComponent(
                              `Hello,\n\nI am interested in booking a visit for the property: ${property.name}\n\n` +
                              `Property Details:\n` +
                              `- Location: ${property.address}, ${property.area}, ${property.city}\n` +
                              `- Type: ${property.propertyType}\n` +
                              `- Rent: ₹${property.monthlyRent.toLocaleString()}/month\n\n` +
                              `Please let me know your available dates and times for a visit.\n\nThank you!`
                            );
                            window.location.href = `mailto:${property.ownerEmail}?subject=${subject}&body=${body}`;
                          }}
                        >
                          <Calendar className="w-4 h-4" />
                          Book Visit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="w-full"
                          onClick={() => {
                            const subject = encodeURIComponent(`Inquiry about ${property.name}`);
                            const body = encodeURIComponent(
                              `Hello,\n\nI am interested in learning more about your property: ${property.name}\n\n` +
                              `Could you please provide more information?\n\nThank you!`
                            );
                            window.location.href = `mailto:${property.ownerEmail}?subject=${subject}&body=${body}`;
                          }}
                        >
                          <Mail className="w-4 h-4" />
                          Contact Owner
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link to={`/login?next=/property/${id}`} className="block">
                          <Button variant="hero" size="lg" className="w-full">
                            <Calendar className="w-4 h-4" />
                            Book Visit
                          </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="w-full" disabled>
                          <Phone className="w-4 h-4" />
                          Contact Owner
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Owner Info */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{property.ownerName || 'Property Owner'}</p>
                        <p className="text-sm text-muted-foreground">
                          {property.ownerEmail ? property.ownerEmail : 'Verified Owner'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Property;
