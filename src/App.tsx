import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Listings from "./pages/Listings";
import Property from "./pages/Property";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ListProperty from "./pages/ListProperty";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerListings from "./pages/OwnerListings";
import Tenants from "./pages/Tenants";
import Expenses from "./pages/Expenses";
import PaymentTracker from "./pages/PaymentTracker";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";
import SetRole from "./pages/SetRole";
import ClerkCallback from "./pages/ClerkCallback";
import EditProperty from "./pages/EditProperty";

const queryClient = new QueryClient();

// Get Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file");
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/property/:id" element={<Property />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/sso-callback" element={<ClerkCallback />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/sso-callback" element={<ClerkCallback />} />
            <Route path="/set-role" element={<SetRole />} />
            <Route path="/list-property" element={<ListProperty />} />
            <Route path="/edit-property/:id" element={<EditProperty />} />
              <Route path="/owner-dashboard" element={<OwnerDashboard />} />
              <Route path="/owner-listings" element={<OwnerListings />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/payment-tracker" element={<PaymentTracker />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </ThemeProvider>
);

export default App;
