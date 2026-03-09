import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRevealOnScrollMultiple } from '@/hooks/useRevealOnScroll';
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ApiProperty {
  id: string;
  name: string;
  propertyType: string;
  city: string;
  area: string;
  address: string;
  nearbyCollege?: string | null;
  gender?: string | null;
  monthlyRent: number;
  totalBeds: number;
  photos: string[];
  amenities: string[];
  status: string;
}

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState<string>(searchParams.get('budget') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<ApiProperty[]>([]);

  useRevealOnScrollMultiple('.reveal');

  useEffect(() => {
    fetchProperties();
  }, [searchQuery, selectedType, selectedGender, maxBudget]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (selectedType !== 'all') params.append('propertyType', selectedType);
      if (selectedGender !== 'all') params.append('gender', selectedGender);
      if (maxBudget) params.append('maxRent', maxBudget);

      const response = await fetch(`${apiUrl}/properties?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      
      if (data.success) {
        setProperties(data.properties || []);
      }
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const propertyTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'pg', label: 'PG' },
    { value: 'hostel', label: 'Hostel' },
    { value: 'flat', label: 'Flat' },
    { value: 'room', label: 'Single Room' },
  ];

  const genderOptions = [
    { value: 'all', label: 'All' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'unisex', label: 'Unisex' },
  ];

  const budgetOptions = [
    { value: '', label: 'Any Budget' },
    { value: '5000', label: 'Under ₹5,000' },
    { value: '10000', label: 'Under ₹10,000' },
    { value: '15000', label: 'Under ₹15,000' },
    { value: '20000', label: 'Under ₹20,000' },
  ];

  // Transform API properties to PropertyCard format
  const transformedProperties = useMemo(() => {
    // Base URL without /api since photos are served from root
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '');
    
    return properties.map((property) => {
      // Get first photo or fallback
      let imageUrl = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop';
      if (property.photos && property.photos.length > 0) {
        const firstPhoto = property.photos[0];
        if (firstPhoto.startsWith('http://') || firstPhoto.startsWith('https://')) {
          imageUrl = firstPhoto;
        } else if (firstPhoto.startsWith('/')) {
          imageUrl = `${baseUrl}${firstPhoto}`;
        } else if (firstPhoto.startsWith('photos/')) {
          imageUrl = `${baseUrl}/${firstPhoto}`;
        } else {
          imageUrl = `${baseUrl}/photos/${firstPhoto}`;
        }
      }

      return {
        id: property.id,
        name: property.name,
        type: property.propertyType as 'pg' | 'hostel' | 'flat' | 'room',
        price: property.monthlyRent,
        location: `${property.area}, ${property.city}`,
        distance: property.nearbyCollege ? `Near ${property.nearbyCollege}` : '',
        rating: 4.5, // Default rating (can be added to backend later)
        reviews: 0, // Default reviews (can be added to backend later)
        occupancy: `0/${property.totalBeds}`, // TODO: Calculate actual occupancy
        amenities: property.amenities || [],
        image: imageUrl,
        gender: (property.gender || 'unisex') as 'male' | 'female' | 'unisex',
        available: property.status === 'approved',
      };
    });
  }, [properties]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedGender('all');
    setMaxBudget('');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery || selectedType !== 'all' || selectedGender !== 'all' || maxBudget;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-surface border-b border-border sticky top-16 lg:top-20 z-30">
          <div className="container-custom py-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by location, college, or property name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12"
                  aria-label="Search properties"
                />
              </div>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-3">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="h-12 px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-label="Property type"
                >
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="h-12 px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-label="Gender preference"
                >
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="h-12 px-4 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-label="Budget range"
                >
                  {budgetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="lg:hidden mt-4 pt-4 border-t border-border space-y-4 animate-fade-in">
                <div>
                  <label className="form-label">Property Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="form-input"
                  >
                    {propertyTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Gender</label>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="form-input"
                  >
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Budget</label>
                  <select
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="form-input"
                  >
                    {budgetOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => setShowFilters(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="container-custom py-8">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {searchQuery ? `Results for "${searchQuery}"` : 'All Properties'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {loading ? 'Loading...' : `${transformedProperties.length} ${transformedProperties.length === 1 ? 'property' : 'properties'} found`}
              </p>
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : transformedProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedProperties.map((property, index) => (
                <div
                  key={property.id}
                  className="reveal"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No properties found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search for a different location.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Listings;
