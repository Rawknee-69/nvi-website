import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import PropertyCard, { Property } from '@/components/PropertyCard';
import { useRevealOnScrollMultiple } from '@/hooks/useRevealOnScroll';
import {
  Shield,
  MapPin,
  Wallet,
  Clock,
  Building2,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Star,
  Smartphone,
  Loader2,
  ChevronDown,
  Bed,
  Droplets,
  X,
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useRevealOnScrollMultiple('.reveal');

  // Fetch featured properties from API
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoadingFeatured(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'https://nivapi.invoiceman.in/api';
        const response = await fetch(`${apiUrl}/properties?limit=8`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch featured properties');
        }

        const data = await response.json();
        if (data.success && data.properties) {
          setFeaturedProperties(data.properties);
        }
      } catch (error: any) {
        console.error('Error fetching featured properties:', error);
        setFeaturedProperties([]);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  // Transform API properties to PropertyCard format
  const transformedFeaturedProperties = useMemo(() => {
    const baseUrl = (import.meta.env.VITE_API_URL || 'https://nivapi.invoiceman.in/api').replace('/api', '');

    return featuredProperties.map((property) => {
      let imageUrl = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop';
      if (property.photos && property.photos.length > 0) {
        const firstPhoto = property.photos[0];
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

      return {
        id: property.id,
        name: property.name,
        type: property.propertyType as 'pg' | 'hostel' | 'flat' | 'room',
        price: property.monthlyRent,
        location: `${property.area}, ${property.city}`,
        distance: property.nearbyCollege ? `Near ${property.nearbyCollege}` : '',
        rating: 4.5,
        reviews: 0,
        occupancy: `0/${property.totalBeds}`,
        amenities: property.amenities || [],
        image: imageUrl,
        gender: (property.gender || 'unisex') as 'male' | 'female' | 'unisex',
        available: property.status === 'approved',
      } as Property;
    });
  }, [featuredProperties]);

  const handleSearch = () => {
    navigate(`/listings?search=${searchQuery}`);
  };

  const features = [
    {
      icon: Shield,
      title: 'Verified Properties',
      description: 'Every listing is personally verified for safety and quality standards.',
    },
    {
      icon: MapPin,
      title: 'Near Campus',
      description: 'Find stays within walking distance of your college or university.',
    },
    {
      icon: Wallet,
      title: 'Budget Friendly',
      description: 'Options for every budget with transparent pricing, no hidden fees.',
    },
    {
      icon: Clock,
      title: 'Instant Booking',
      description: 'Book your stay instantly with real-time availability updates.',
    },
  ];

  const ownerBenefits = [
    {
      icon: Users,
      title: 'Reach Students',
      description: 'Connect directly with thousands of students looking for accommodation.',
    },
    {
      icon: BarChart3,
      title: 'Track Payments',
      description: 'Manage rent collection and track payment history effortlessly.',
    },
    {
      icon: Building2,
      title: 'Manage Properties',
      description: 'Comprehensive dashboard to manage all your properties in one place.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Happy Students' },
    { value: '2.5K', label: 'Verified Properties' },
    { value: '50+', label: 'Cities Covered' },
    { value: '4.8', label: 'Average Rating' },
  ];

  return (
    <Layout>
      {/* Main Container with Search */}
      <div className="bg-secondary/50 min-h-screen pt-28 pb-12">
        <div className="container-custom">
          {/* Search Bar */}
          <div className="bg-surface rounded-2xl shadow-md border border-border/50 p-2 mb-6 flex flex-wrap items-center justify-between gap-2 lg:gap-0 animate-fade-up">
            {/* Location */}
            <div className="flex items-center gap-2 px-4 py-2 flex-grow min-w-[200px] lg:border-r border-border/50">
              <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search by college, area, or city..."
                className="bg-transparent border-none focus:outline-none w-full text-foreground text-sm font-medium placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="shrink-0">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            {/* Price Range */}
            <div className="flex items-center gap-2 px-4 py-2 flex-grow min-w-[150px] lg:border-r border-border/50">
              <div className="w-5 h-5 rounded-full border border-muted-foreground flex items-center justify-center shrink-0">
                <span className="text-muted-foreground text-[10px] font-bold">₹</span>
              </div>
              <span className="text-foreground text-sm font-medium whitespace-nowrap">₹3,000 - ₹20,000</span>
            </div>
            {/* Property Type */}
            <div className="flex items-center justify-between px-4 py-2 flex-grow min-w-[140px] lg:border-r border-border/50 cursor-pointer">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="text-foreground text-sm font-medium">All Types</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
            </div>
            {/* Beds */}
            <div className="flex items-center justify-between px-4 py-2 flex-grow min-w-[130px] lg:border-r border-border/50 cursor-pointer">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="text-foreground text-sm font-medium">Any Beds</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
            </div>
            {/* Baths */}
            <div className="flex items-center justify-between px-4 py-2 flex-grow min-w-[130px] lg:border-r border-border/50 cursor-pointer">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="text-foreground text-sm font-medium">Any Baths</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
            </div>
            {/* Guests */}
            <div className="flex items-center justify-between px-4 py-2 flex-grow min-w-[130px] mr-2 cursor-pointer">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="text-foreground text-sm font-medium">Any Guests</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
            </div>
            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 rounded-xl w-full lg:w-auto mt-2 lg:mt-0 font-semibold"
            >
              Search
            </Button>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-3 mb-8 animate-fade-up stagger-1">
            <button className="px-5 py-2.5 rounded-lg border border-primary/20 bg-primary/5 text-primary text-sm font-medium whitespace-nowrap shrink-0 transition-colors">
              All Listings (1,345)
            </button>
            <Link to="/listings?filter=free_cancel">
              <button className="px-5 py-2.5 rounded-lg border border-border bg-surface text-muted-foreground hover:bg-secondary text-sm font-medium whitespace-nowrap shrink-0 transition-colors">
                Free Cancelation (340)
              </button>
            </Link>
            <Link to="/listings?filter=pg">
              <button className="px-5 py-2.5 rounded-lg border border-border bg-surface text-muted-foreground hover:bg-secondary text-sm font-medium whitespace-nowrap shrink-0 transition-colors">
                PG (255)
              </button>
            </Link>
            <Link to="/listings?filter=hostel">
              <button className="px-5 py-2.5 rounded-lg border border-border bg-surface text-muted-foreground hover:bg-secondary text-sm font-medium whitespace-nowrap shrink-0 transition-colors">
                Hostel (122)
              </button>
            </Link>

            <div className="ml-auto flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-end">
              <span className="text-muted-foreground text-sm">Sort by:</span>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-surface text-foreground text-sm font-medium hover:bg-secondary transition-colors">
                Most Popular
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Featured Listings Grid */}
          {loadingFeatured ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
            </div>
          ) : transformedFeaturedProperties.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {transformedFeaturedProperties.map((property, index) => (
                <div
                  key={property.id}
                  className="reveal"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-semibold mb-2 text-lg">No listings yet</p>
              <p className="text-muted-foreground mb-6 text-sm">
                No properties available at this moment. Be the first to list yours!
              </p>
              <Link to="/listings">
                <Button variant="outline">
                  Browse All Properties
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}

          {transformedFeaturedProperties.length > 0 && (
            <div className="text-center mt-10">
              <Link to="/listings">
                <Button variant="outline" size="lg">
                  View All Properties
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-12 bg-surface border-y border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center reveal" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 reveal">
              Why Choose NIVĀSYA?
            </h2>
            <p className="text-muted-foreground reveal">
              We make finding student accommodation simple, safe, and stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="feature-card reveal"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Student / Owner CTA Section */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Student Card */}
            <div className="feature-card p-8 lg:p-10 reveal">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                For Students
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Find Your Ideal Accommodation
              </h3>
              <p className="text-muted-foreground mb-6">
                Browse verified properties near your college, compare prices, and book your perfect stay with confidence.
              </p>
              <ul className="space-y-3 mb-8">
                {['Verified & safe properties', 'Transparent pricing', 'Easy booking process', '24/7 support'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/listings">
                <Button size="lg">
                  Start Searching
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Owner Card */}
            <div className="feature-card p-8 lg:p-10 bg-primary text-primary-foreground reveal" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium mb-6">
                For Property Owners
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                List Your Property Today
              </h3>
              <p className="text-primary-foreground/80 mb-6">
                Reach thousands of students looking for accommodation. Manage bookings, collect rent, and grow your business.
              </p>
              <ul className="space-y-3 mb-8">
                {ownerBenefits.map((benefit) => (
                  <li key={benefit.title} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    {benefit.title}: {benefit.description}
                  </li>
                ))}
              </ul>
              <Link to="/signup?role=owner&next=/list-property">
                <Button variant="outline" size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  List Property
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* App CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 reveal">
              <Smartphone className="w-4 h-4" />
              Coming Soon
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 reveal">
              Get the NIVĀSYA App
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto reveal">
              Search, book, and manage your stay on the go. Get instant notifications and exclusive app-only deals.
            </p>
            <div className="flex flex-wrap justify-center gap-4 reveal">
              <Button variant="default" size="lg" disabled>
                App Store - Coming Soon
              </Button>
              <Button variant="outline" size="lg" disabled>
                Play Store - Coming Soon
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
