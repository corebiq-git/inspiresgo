export type NavigationTab = 
  | 'home' 
  | 'packages' 
  | 'umrah' 
  | 'evisa' 
  | 'flights' 
  | 'ai-planner' 
  | 'profile' 
  | 'support';

export interface Destination {
  id: string;
  name: string;
  location: string;
  country: string;
  category: 'Trending' | 'Popular' | 'Nature' | 'Spiritual' | 'Cultural' | 'Luxury';
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  pricePerPerson: number;
  currency: string;
  duration: string;
  description: string;
  highlights: string[];
  bestSeason: string;
  featured?: boolean;
}

export interface TravelPackage {
  id: string;
  title: string;
  destination: string;
  country: string;
  category: 'Trending' | 'Umrah' | 'Europe' | 'Asia' | 'Adventure' | 'Luxury';
  days: number;
  nights: number;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  tag: string;
  inclusions: string[];
  highlights: string[];
  itinerary: { day: number; title: string; desc: string }[];
  availableDates: string[];
}

export interface UmrahPackage {
  id: string;
  name: string;
  tier: 'VIP Executive' | 'Premium Deluxe' | 'Economy Comfort';
  duration: string;
  pricePerPerson: number;
  makkahHotel: {
    name: string;
    distance: string;
    rating: number;
    stars: number;
  };
  madinahHotel: {
    name: string;
    distance: string;
    rating: number;
    stars: number;
  };
  highlights: string[];
  inclusions: string[];
  rawdahAssistance: boolean;
  privateTransport: boolean;
  tag: string;
  imageUrl: string;
}

export interface EVisaOption {
  id: string;
  country: string;
  flag: string;
  feeUSD: number;
  processingTime: string;
  validity: string;
  stayDuration: string;
  entries: 'Single' | 'Multiple';
  popularFor: string;
  documentsRequired: string[];
}

export interface FlightInfo {
  flightNumber: string;
  airline: string;
  aircraft: string;
  status: 'In Air' | 'Boarding' | 'On Time' | 'Delayed' | 'Landed';
  progressPercent: number;
  altitude: string;
  groundSpeed: string;
  origin: {
    code: string;
    city: string;
    airport: string;
    terminal: string;
    gate: string;
    departureTime: string;
    date: string;
    weather: string;
  };
  destination: {
    code: string;
    city: string;
    airport: string;
    terminal: string;
    gate: string;
    arrivalTime: string;
    date: string;
    weather: string;
    baggageCarousel: string;
  };
}

export interface BookingRecord {
  id: string;
  userId: string;
  itemType: 'package' | 'umrah' | 'flight' | 'visa';
  itemId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelersCount: number;
  totalAmount: number;
  currency: string;
  paymentMethod: 'upi' | 'card' | 'applepay' | 'netbanking';
  paymentStatus: 'paid' | 'pending' | 'failed';
  bookingStatus: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  transactionRef: string;
  qrCodeData: string;
  createdAt: string;
  applicantDetails?: {
    name: string;
    email: string;
    phone: string;
    passport?: string;
  };
}

export interface VisaApplicationRecord {
  id: string;
  userId: string;
  country: string;
  applicantName: string;
  passportNumber: string;
  nationality: string;
  email: string;
  visaType: string;
  status: 'submitted' | 'under_review' | 'approved' | 'action_required';
  referenceNo: string;
  feeUSD: number;
  submittedAt: string;
}

export interface UserProfileData {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  nationality: string;
  passportNumber: string;
  loyaltyPoints: number;
  preferredCurrency: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface OfficeContact {
  id: string;
  type: 'Head Office' | 'Branch Office';
  country: 'UAE' | 'India';
  city: string;
  title: string;
  address: string[];
  phones: string[];
  whatsapp: string;
  email: string;
  workingHours: string;
  emergencySupport?: string;
  badges: string[];
}
