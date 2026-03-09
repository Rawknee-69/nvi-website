import { Link } from 'react-router-dom';
import { MapPin, Wifi, UtensilsCrossed, Droplets, Star, Heart, Bed, MoveHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Property {
  id: string;
  name: string;
  type: 'pg' | 'hostel' | 'flat' | 'room';
  price: number;
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  occupancy: string;
  amenities: string[];
  image: string;
  gender: 'male' | 'female' | 'unisex';
  available: boolean;
}

interface PropertyCardProps {
  property: Property;
  className?: string;
}

const PropertyCard = ({ property, className }: PropertyCardProps) => {
  const typeLabels: Record<string, string> = {
    pg: 'PG',
    hostel: 'Hostel',
    flat: 'Flat',
    room: 'Single Room',
  };

  return (
    <Link to={`/property/${property.id}`} className={cn('block group', className)}>
      <div className="property-card">
        {/* Image */}
        <div className="relative h-52 overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/30 z-10" />
          <img
            src={property.image}
            alt={property.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Discount Badge */}
          <div className="absolute top-3 left-3 z-20">
            <span className="inline-flex items-center gap-1.5 bg-[#16a34a] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
              <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[9px]">%</span>
              15% Off
            </span>
          </div>

          {/* Heart Button */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white hover:text-red-500 transition-all duration-200 shadow-sm border border-white/30"
          >
            <Heart className="w-4 h-4" />
          </button>

          {/* Type Badge */}
          <div className="absolute bottom-8 left-3 z-20">
            <span className="badge bg-primary/90 text-primary-foreground text-[10px] font-semibold backdrop-blur-sm px-2 py-1 rounded-md">
              {typeLabels[property.type]}
            </span>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            <div className="w-5 h-1.5 rounded-full bg-white" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
          </div>

          {/* Unavailable overlay */}
          {!property.available && (
            <div className="absolute inset-0 bg-foreground/60 z-20 flex items-center justify-center">
              <span className="text-white font-semibold border border-white/50 px-4 py-2 rounded-lg backdrop-blur-md text-sm">
                Fully Occupied
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-bold text-base text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {property.name}
          </h3>

          {/* Location */}
          <p className="text-sm text-muted-foreground mb-4 font-medium truncate flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {property.location}
          </p>

          {/* Room Specs */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/60 bg-secondary/30 text-xs font-semibold text-foreground">
              <Bed className="w-3.5 h-3.5 text-muted-foreground" />
              <span>3 Beds</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/60 bg-secondary/30 text-xs font-semibold text-foreground">
              <Droplets className="w-3.5 h-3.5 text-muted-foreground" />
              <span>2 Baths</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/60 bg-secondary/30 text-xs font-semibold text-foreground">
              <MoveHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
              <span>1,500 ft²</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-border/60 mb-4" />

          {/* Price & Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground line-through font-medium">
                ₹{Math.floor(property.price * 1.2).toLocaleString()}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-primary">
                  ₹{property.price.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-muted-foreground">/month</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-bold text-foreground">{property.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
