import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@clerk/clerk-react';
import {
  Building2,
  MapPin,
  IndianRupee,
  Users,
  Wifi,
  UtensilsCrossed,
  Droplets,
  Zap,
  Car,
  Shield,
  Upload,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOwnerCheck } from '@/hooks/useOwnerCheck';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * Component to show when a student tries to access owner-only features
 */
const OwnerOnlyPrompt = ({ onBecomeOwner, onGoBack }: { onBecomeOwner: () => void; onGoBack: () => void }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <DialogTitle className="text-2xl text-center">Owner Access Required</DialogTitle>
            <DialogDescription className="text-center pt-2">
              This feature is only available for property owners. You need to have an owner account to list properties.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-secondary/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground text-center">
                As an owner, you can:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  List and manage your properties
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Track tenants and payments
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Access owner dashboard and analytics
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={onGoBack} className="w-full sm:w-auto">
              Go Back
            </Button>
            <Button onClick={onBecomeOwner} className="w-full sm:w-auto">
              Become an Owner
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ListProperty = () => {
  // Check if user is authenticated and is an owner
  const { isOwner, isLoading } = useOwnerCheck('/signup?role=owner&next=/list-property');
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // All hooks must be called before any conditional returns
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    propertyType: '',
    name: '',
    address: '',
    city: '',
    area: '',
    nearbyCollege: '',
    gender: '',
    occupancyType: '',
    totalBeds: '',
    monthlyRent: '',
    securityDeposit: '',
    minStay: '',
    amenities: [] as string[],
    rules: '',
    description: '',
    images: [] as File[],
  });

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // If not owner, show a prompt dialog
  if (!isOwner && !isLoading) {
    return (
      <Layout>
        <OwnerOnlyPrompt 
          onBecomeOwner={() => navigate('/set-role?role=owner&next=/list-property')}
          onGoBack={() => navigate('/')}
        />
      </Layout>
    );
  }

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Location' },
    { number: 3, title: 'Pricing' },
    { number: 4, title: 'Amenities' },
    { number: 5, title: 'Photos' },
  ];

  const propertyTypes = [
    { value: 'pg', label: 'PG', icon: Building2 },
    { value: 'hostel', label: 'Hostel', icon: Building2 },
    { value: 'flat', label: 'Flat', icon: Building2 },
    { value: 'room', label: 'Single Room', icon: Building2 },
  ];

  const genderOptions = [
    { value: 'male', label: 'Male Only' },
    { value: 'female', label: 'Female Only' },
    { value: 'unisex', label: 'Unisex' },
  ];

  const occupancyOptions = [
    { value: 'single', label: 'Single Occupancy' },
    { value: 'double', label: 'Double Sharing' },
    { value: 'triple', label: 'Triple Sharing' },
    { value: 'multiple', label: 'Multiple Options' },
  ];

  const amenitiesList = [
    { value: 'wifi', label: 'WiFi', icon: Wifi },
    { value: 'food', label: 'Food/Meals', icon: UtensilsCrossed },
    { value: 'water', label: '24/7 Water', icon: Droplets },
    { value: 'power', label: 'Power Backup', icon: Zap },
    { value: 'parking', label: 'Parking', icon: Car },
    { value: 'security', label: 'CCTV Security', icon: Shield },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter((a) => a !== amenity)
        : [...formData.amenities, amenity],
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Validate file types and sizes
    const validFiles = fileArray.filter((file) => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Add files to state first
    const newImages = [...formData.images, ...validFiles];
    setFormData({ ...formData, images: newImages });
    
    // Upload photos immediately
    await uploadPhotos(validFiles);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadPhotos = async (files: File[]) => {
    if (files.length === 0) return;

    setUploadingPhotos(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append('photos', file);
      });

      const apiUrl = import.meta.env.VITE_API_URL || 'https://nivapi.invoiceman.in/api';
      const response = await fetch(`${apiUrl}/properties/upload-photos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload photos');
      }

      const data = await response.json();
      const photoUrls = data.photos.map((url: string) => {
        // Convert relative URL to absolute URL
        // Base URL without /api since photos are served from root
        if (url.startsWith('/')) {
          const baseUrl = (import.meta.env.VITE_API_URL || 'https://nivapi.invoiceman.in/api').replace('/api', '');
          return `${baseUrl}${url}`;
        }
        return url;
      });

      setUploadedPhotoUrls([...uploadedPhotoUrls, ...photoUrls]);
      toast.success(`${files.length} photo(s) uploaded successfully`);
    } catch (error: any) {
      console.error('Error uploading photos:', error);
      toast.error(error.message || 'Failed to upload photos');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const removePhoto = (index: number) => {
    // Remove from both arrays
    const newImages = formData.images.filter((_, i) => i !== index);
    const newUrls = uploadedPhotoUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setUploadedPhotoUrls(newUrls);
    toast.success('Photo removed');
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.propertyType || !formData.name || !formData.address || 
        !formData.city || !formData.area || !formData.monthlyRent) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (uploadedPhotoUrls.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'https://nivapi.invoiceman.in/api';
      const response = await fetch(`${apiUrl}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          photos: uploadedPhotoUrls,
          totalBeds: parseInt(formData.totalBeds) || 1,
          monthlyRent: parseFloat(formData.monthlyRent),
          securityDeposit: parseFloat(formData.securityDeposit) || 0,
          minStay: parseInt(formData.minStay) || 1,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit listing');
      }

      const data = await response.json();
      toast.success('Property listed successfully!');
      
      // Redirect to owner dashboard or listings page
      setTimeout(() => {
        navigate('/owner-listings');
      }, 1500);
    } catch (error: any) {
      console.error('Error submitting listing:', error);
      toast.error(error.message || 'Failed to submit listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container-custom max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Link to="/owner-dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">List Your Property</h1>
            <p className="text-muted-foreground mt-1">Fill in the details to list your property on NIVĀSYA</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all',
                      currentStep >= step.number
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    )}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'hidden sm:block w-16 lg:w-24 h-1 mx-2 rounded-full transition-all',
                        currentStep > step.number ? 'bg-primary' : 'bg-secondary'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <span
                  key={step.number}
                  className={cn(
                    'text-xs font-medium',
                    currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-surface rounded-2xl border border-border p-6 md:p-8">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-lg font-semibold text-foreground">Property Type</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {propertyTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, propertyType: type.value })}
                          className={cn(
                            'p-4 rounded-xl border-2 transition-all text-center',
                            formData.propertyType === type.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          <Icon className={cn(
                            'w-6 h-6 mx-auto mb-2',
                            formData.propertyType === type.value ? 'text-primary' : 'text-muted-foreground'
                          )} />
                          <span className={cn(
                            'text-sm font-medium',
                            formData.propertyType === type.value ? 'text-primary' : 'text-foreground'
                          )}>
                            {type.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label htmlFor="name" className="form-label">Property Name</label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Sunshine PG for Boys"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Gender Preference</label>
                    <div className="grid grid-cols-3 gap-3">
                      {genderOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: option.value })}
                          className={cn(
                            'p-3 rounded-xl border-2 transition-all text-sm font-medium',
                            formData.gender === option.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border hover:border-primary/50 text-foreground'
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Occupancy Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {occupancyOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, occupancyType: option.value })}
                          className={cn(
                            'p-3 rounded-xl border-2 transition-all text-sm font-medium',
                            formData.occupancyType === option.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border hover:border-primary/50 text-foreground'
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-lg font-semibold text-foreground">Location Details</h2>
                  
                  <div>
                    <label htmlFor="address" className="form-label">Full Address</label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter complete address"
                      className="form-input min-h-[100px] resize-none"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="form-label">City</label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g., Bangalore"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="area" className="form-label">Area/Locality</label>
                      <Input
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="e.g., Koramangala"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="nearbyCollege" className="form-label">Nearby College/University</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="nearbyCollege"
                        name="nearbyCollege"
                        value={formData.nearbyCollege}
                        onChange={handleInputChange}
                        placeholder="e.g., Christ University"
                        className="pl-12"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Pricing */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-lg font-semibold text-foreground">Pricing & Capacity</h2>
                  
                  <div>
                    <label htmlFor="totalBeds" className="form-label">Total Beds/Rooms Available</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="totalBeds"
                        name="totalBeds"
                        type="number"
                        value={formData.totalBeds}
                        onChange={handleInputChange}
                        placeholder="e.g., 15"
                        className="pl-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="monthlyRent" className="form-label">Monthly Rent (₹)</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="monthlyRent"
                          name="monthlyRent"
                          type="number"
                          value={formData.monthlyRent}
                          onChange={handleInputChange}
                          placeholder="e.g., 8500"
                          className="pl-12"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="securityDeposit" className="form-label">Security Deposit (₹)</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="securityDeposit"
                          name="securityDeposit"
                          type="number"
                          value={formData.securityDeposit}
                          onChange={handleInputChange}
                          placeholder="e.g., 17000"
                          className="pl-12"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="minStay" className="form-label">Minimum Stay Period</label>
                    <select
                      id="minStay"
                      name="minStay"
                      value={formData.minStay}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select minimum stay</option>
                      <option value="1">1 Month</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">12 Months</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 4: Amenities */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-lg font-semibold text-foreground">Amenities & Rules</h2>
                  
                  <div>
                    <label className="form-label">Select Available Amenities</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenitiesList.map((amenity) => {
                        const Icon = amenity.icon;
                        const isSelected = formData.amenities.includes(amenity.value);
                        return (
                          <button
                            key={amenity.value}
                            type="button"
                            onClick={() => toggleAmenity(amenity.value)}
                            className={cn(
                              'p-4 rounded-xl border-2 transition-all flex items-center gap-3',
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            )}
                          >
                            <Icon className={cn(
                              'w-5 h-5',
                              isSelected ? 'text-primary' : 'text-muted-foreground'
                            )} />
                            <span className={cn(
                              'text-sm font-medium',
                              isSelected ? 'text-primary' : 'text-foreground'
                            )}>
                              {amenity.label}
                            </span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-primary ml-auto" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="rules" className="form-label">House Rules</label>
                    <textarea
                      id="rules"
                      name="rules"
                      value={formData.rules}
                      onChange={handleInputChange}
                      placeholder="Enter house rules (one per line)"
                      className="form-input min-h-[120px] resize-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="form-label">Property Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your property, its features, and what makes it special..."
                      className="form-input min-h-[120px] resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Photos */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-lg font-semibold text-foreground">Upload Photos</h2>
                  <p className="text-sm text-muted-foreground">
                    Add high-quality photos of your property. Good photos increase booking chances.
                  </p>
                  
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      {uploadingPhotos ? (
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <h3 className="font-medium text-foreground mb-1">Upload Photos</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 5MB each. Minimum 3 photos recommended.
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="photos"
                      onChange={handleFileChange}
                      disabled={uploadingPhotos}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      disabled={uploadingPhotos}
                    >
                      {uploadingPhotos ? 'Uploading...' : 'Select Files'}
                    </Button>
                  </div>

                  {/* Display uploaded photos */}
                  {uploadedPhotoUrls.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-foreground mb-3">
                        Uploaded Photos ({uploadedPhotoUrls.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {uploadedPhotoUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-border"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              title="Remove photo"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Show preview of files being uploaded */}
                  {formData.images.length > uploadedPhotoUrls.length && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Uploading {formData.images.length - uploadedPhotoUrls.length} photo(s)...
                      </p>
                    </div>
                  )}

                  <div className="bg-secondary/50 rounded-xl p-4">
                    <h4 className="font-medium text-foreground mb-2">Photo Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use natural lighting for best results</li>
                      <li>• Include photos of rooms, common areas, and exterior</li>
                      <li>• Show amenities like kitchen, bathroom, study area</li>
                      <li>• Keep photos clean and well-organized</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep === steps.length && (
                  <Button key="submit" type="submit" variant="hero" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Listing
                        <Check className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
                {currentStep !== steps.length && (
                  <Button key="next" type="button" variant="default" onClick={nextStep}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ListProperty;
