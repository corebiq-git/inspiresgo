import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  signInAnonymously, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  collection,
  doc,
  setDoc,
  getDocs,
  serverTimestamp
} from '../lib/firebase';
import { 
  NavigationTab, 
  BookingRecord, 
  VisaApplicationRecord, 
  UserProfileData,
  ChatMessage
} from '../types';

interface CurrencyRate {
  code: string;
  symbol: string;
  rateToUSD: number;
}

export const CURRENCIES: Record<string, CurrencyRate> = {
  USD: { code: 'USD', symbol: '$', rateToUSD: 1 },
  EUR: { code: 'EUR', symbol: '€', rateToUSD: 0.92 },
  SAR: { code: 'SAR', symbol: '﷼', rateToUSD: 3.75 },
  INR: { code: 'INR', symbol: '₹', rateToUSD: 86.5 },
  GBP: { code: 'GBP', symbol: '£', rateToUSD: 0.79 },
  AED: { code: 'AED', symbol: 'د.إ', rateToUSD: 3.67 },
};

interface BookingPayload {
  itemType: 'package' | 'umrah' | 'flight' | 'visa';
  itemId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelersCount: number;
  totalAmountUSD: number;
  applicantDetails?: {
    name: string;
    email: string;
    phone: string;
    passport?: string;
  };
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  user: UserProfileData;
  setUser: React.Dispatch<React.SetStateAction<UserProfileData>>;
  firebaseUid: string | null;
  isFirebaseAuthLoading: boolean;
  bookings: BookingRecord[];
  visaApplications: VisaApplicationRecord[];
  savedWishlist: string[];
  toggleSaveItem: (itemId: string) => void;
  isSaved: (itemId: string) => boolean;
  activeCurrency: string;
  setActiveCurrency: (code: string) => void;
  formatPrice: (amountUSD: number) => string;
  viewMode: 'mobile' | 'fluid';
  setViewMode: (mode: 'mobile' | 'fluid') => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  
  // Modals & Flows
  selectedBookingPayload: BookingPayload | null;
  startBookingFlow: (payload: BookingPayload) => void;
  closeBookingFlow: () => void;
  isPaymentModalOpen: boolean;
  openPaymentModal: () => void;
  closePaymentModal: () => void;
  processPaymentSuccess: (method: 'upi' | 'card' | 'applepay' | 'netbanking', transactionRef: string) => Promise<BookingRecord>;
  recentConfirmedBooking: BookingRecord | null;
  clearRecentBooking: () => void;

  // Visa application submit
  submitVisaApplication: (data: {
    country: string;
    applicantName: string;
    passportNumber: string;
    nationality: string;
    email: string;
    visaType: string;
    feeUSD: number;
  }) => Promise<VisaApplicationRecord>;

  // Customer support chat
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;
  isSendingChat: boolean;

  // Firebase auth actions
  handleAuthEmailSignIn: (email: string, pass: string) => Promise<void>;
  handleAuthEmailSignUp: (email: string, pass: string, name: string) => Promise<void>;
  handleSignOut: () => Promise<void>;
}

const DEFAULT_USER: UserProfileData = {
  userId: 'usr_fathima_01',
  fullName: 'Fathima',
  email: 'fathima@inspirego.travel',
  phone: '+91 98470 12345',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  nationality: 'India',
  passportNumber: 'IND78492019',
  loyaltyPoints: 4850,
  preferredCurrency: 'INR'
};

const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'BK-78901',
    userId: 'usr_fathima_01',
    itemType: 'umrah',
    itemId: 'umrah-vip-clocktower',
    title: 'VIP Royal Clock Tower Umrah Experience',
    destination: 'Makkah & Madinah, Saudi Arabia',
    startDate: '2026-10-10',
    endDate: '2026-10-20',
    travelersCount: 2,
    totalAmount: 4700,
    currency: 'USD',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    transactionRef: 'TXN-98421094',
    qrCodeData: 'INSPIREGO:BK-78901:VIP_UMRAH:CONFIRMED',
    createdAt: '2026-08-20T14:32:00Z',
    applicantDetails: {
      name: 'Fathima',
      email: 'fathima@inspirego.travel',
      phone: '+91 98470 12345'
    }
  },
  {
    id: 'BK-54210',
    userId: 'usr_fathima_01',
    itemType: 'package',
    itemId: 'banff-canada',
    title: 'Banff National Park Explorer',
    destination: 'Alberta, Canada',
    startDate: '2026-06-15',
    endDate: '2026-06-20',
    travelersCount: 2,
    totalAmount: 1700,
    currency: 'USD',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    transactionRef: 'UPI-894201948',
    qrCodeData: 'INSPIREGO:BK-54210:BANFF:CONFIRMED',
    createdAt: '2026-07-12T10:15:00Z',
    applicantDetails: {
      name: 'Fathima',
      email: 'fathima@inspirego.travel',
      phone: '+91 98470 12345'
    }
  }
];

const INITIAL_VISA_APPS: VisaApplicationRecord[] = [
  {
    id: 'VISA-8921',
    userId: 'usr_fathima_01',
    country: 'Saudi Arabia',
    applicantName: 'Fathima',
    passportNumber: 'IND78492019',
    nationality: 'India',
    email: 'fathima@inspirego.travel',
    visaType: '1-Year Multiple Entry Tourist/Umrah eVisa',
    status: 'approved',
    referenceNo: 'EV-SA-849204',
    feeUSD: 145,
    submittedAt: '2026-08-15T09:00:00Z'
  }
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [user, setUser] = useState<UserProfileData>(() => {
    const saved = localStorage.getItem('inspirego_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.fullName === 'Kathryn Murphy') {
          return DEFAULT_USER;
        }
        return parsed;
      } catch {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [isFirebaseAuthLoading, setIsFirebaseAuthLoading] = useState(true);

  // Responsive device simulation mode: 'mobile' shows phone canvas; 'fluid' shows full screen
  const [viewMode, setViewMode] = useState<'mobile' | 'fluid'>('fluid');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem('inspirego_onboarding_done');
  });

  const [activeCurrency, setActiveCurrency] = useState<string>('USD');

  // Bookings & Visas
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    const saved = localStorage.getItem('inspirego_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });
  const [visaApplications, setVisaApplications] = useState<VisaApplicationRecord[]>(() => {
    const saved = localStorage.getItem('inspirego_visas');
    return saved ? JSON.parse(saved) : INITIAL_VISA_APPS;
  });
  const [savedWishlist, setSavedWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('inspirego_wishlist');
    return saved ? JSON.parse(saved) : ['banff-canada', 'alula-saudi'];
  });

  // Booking & Payment Flow
  const [selectedBookingPayload, setSelectedBookingPayload] = useState<BookingPayload | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [recentConfirmedBooking, setRecentConfirmedBooking] = useState<BookingRecord | null>(null);

  // 24/7 Chat Drawer State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: 'Hello Fathima! 👋 Welcome to InspireGo 24/7 Concierge. Travel with the ones who inspire you! How can I help you with your journeys, Umrah packages, flight radar, or UAE & India office assistance today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: ['Check Umrah Packages', 'UAE Head Office', 'India Branch', 'Apply for E-Visa', 'Track Flight Status']
    }
  ]);
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUid(fbUser.uid);
        setUser(prev => ({
          ...prev,
          userId: fbUser.uid,
          email: fbUser.email || prev.email,
          fullName: fbUser.displayName || prev.fullName
        }));
        // Attempt to sync from Firestore
        try {
          const bookingsSnap = await getDocs(collection(db, 'users', fbUser.uid, 'bookings'));
          if (!bookingsSnap.empty) {
            const list: BookingRecord[] = [];
            bookingsSnap.forEach(d => list.push(d.data() as BookingRecord));
            setBookings(list);
          }
        } catch {
          // Fall back gracefully to local state
        }
      } else {
        // Sign in anonymously for seamless backend access if not logged in
        signInAnonymously(auth).catch(() => {
          // Offline fallback
        });
      }
      setIsFirebaseAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Persist locally
  useEffect(() => {
    localStorage.setItem('inspirego_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('inspirego_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('inspirego_visas', JSON.stringify(visaApplications));
  }, [visaApplications]);

  useEffect(() => {
    localStorage.setItem('inspirego_wishlist', JSON.stringify(savedWishlist));
  }, [savedWishlist]);

  // Wishlist actions
  const toggleSaveItem = (itemId: string) => {
    setSavedWishlist(prev => {
      const exists = prev.includes(itemId);
      const next = exists ? prev.filter(id => id !== itemId) : [...prev, itemId];
      // Sync to Firestore if user is signed in
      if (firebaseUid) {
        const ref = doc(db, 'users', firebaseUid, 'savedItems', itemId);
        if (exists) {
          // In real Firestore, can delete
        } else {
          setDoc(ref, { targetId: itemId, savedAt: new Date().toISOString() }).catch(() => {});
        }
      }
      return next;
    });
  };

  const isSaved = (itemId: string) => savedWishlist.includes(itemId);

  // Price formatting
  const formatPrice = (amountUSD: number) => {
    const cur = CURRENCIES[activeCurrency] || CURRENCIES.USD;
    const converted = Math.round(amountUSD * cur.rateToUSD);
    return `${cur.symbol}${converted.toLocaleString()}`;
  };

  // Booking Flow
  const startBookingFlow = (payload: BookingPayload) => {
    setSelectedBookingPayload(payload);
    setIsPaymentModalOpen(true);
  };

  const closeBookingFlow = () => {
    setSelectedBookingPayload(null);
    setIsPaymentModalOpen(false);
  };

  const openPaymentModal = () => setIsPaymentModalOpen(true);
  const closePaymentModal = () => setIsPaymentModalOpen(false);

  const processPaymentSuccess = async (
    method: 'upi' | 'card' | 'applepay' | 'netbanking',
    transactionRef: string
  ): Promise<BookingRecord> => {
    if (!selectedBookingPayload) {
      throw new Error('No active booking selected');
    }

    const bookingId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: BookingRecord = {
      id: bookingId,
      userId: user.userId,
      itemType: selectedBookingPayload.itemType,
      itemId: selectedBookingPayload.itemId,
      title: selectedBookingPayload.title,
      destination: selectedBookingPayload.destination,
      startDate: selectedBookingPayload.startDate,
      endDate: selectedBookingPayload.endDate,
      travelersCount: selectedBookingPayload.travelersCount,
      totalAmount: selectedBookingPayload.totalAmountUSD,
      currency: 'USD',
      paymentMethod: method,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      transactionRef,
      qrCodeData: `INSPIREGO:${bookingId}:${selectedBookingPayload.title}:CONFIRMED`,
      createdAt: new Date().toISOString(),
      applicantDetails: selectedBookingPayload.applicantDetails || {
        name: user.fullName,
        email: user.email,
        phone: user.phone
      }
    };

    // Update local state
    setBookings(prev => [newBooking, ...prev]);
    setRecentConfirmedBooking(newBooking);

    // Save to Firestore if connected
    if (firebaseUid) {
      try {
        await setDoc(doc(db, 'users', firebaseUid, 'bookings', bookingId), {
          ...newBooking,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Firestore sync failed, saved locally:', err);
      }
    }

    // Award loyalty points
    setUser(prev => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + Math.round(selectedBookingPayload.totalAmountUSD * 0.05)
    }));

    setIsPaymentModalOpen(false);
    return newBooking;
  };

  const clearRecentBooking = () => setRecentConfirmedBooking(null);

  // Submit Visa Application
  const submitVisaApplication = async (data: {
    country: string;
    applicantName: string;
    passportNumber: string;
    nationality: string;
    email: string;
    visaType: string;
    feeUSD: number;
  }): Promise<VisaApplicationRecord> => {
    const applicationId = `VISA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVisa: VisaApplicationRecord = {
      id: applicationId,
      userId: user.userId,
      country: data.country,
      applicantName: data.applicantName,
      passportNumber: data.passportNumber,
      nationality: data.nationality,
      email: data.email,
      visaType: data.visaType,
      status: 'submitted',
      referenceNo: `EV-${data.country.slice(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      feeUSD: data.feeUSD,
      submittedAt: new Date().toISOString()
    };

    setVisaApplications(prev => [newVisa, ...prev]);

    if (firebaseUid) {
      try {
        await setDoc(doc(db, 'users', firebaseUid, 'visaApplications', applicationId), newVisa);
      } catch (err) {
        console.warn('Visa firestore sync warning:', err);
      }
    }

    return newVisa;
  };

  // 24/7 Chat
  const sendChatMessage = async (text: string) => {
    if (!text.trim() || isSendingChat) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatMessages.slice(-4),
          context: {
            userName: user.fullName,
            activeTab,
            loyaltyPoints: user.loyaltyPoints,
            activeBookingsCount: bookings.length
          }
        })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I'm here to assist you with your travels! What would you like to explore next?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: "I'm currently connected to our travel assistance network. You can explore our Umrah packages, track flights, or book popular destinations from the tabs!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: ['Umrah Services', 'Flight Tracking', 'Tour Packages']
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Firebase Auth Actions
  const handleAuthEmailSignIn = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    setUser(prev => ({
      ...prev,
      userId: cred.user.uid,
      email: cred.user.email || email
    }));
  };

  const handleAuthEmailSignUp = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    setUser(prev => ({
      ...prev,
      userId: cred.user.uid,
      email: cred.user.email || email,
      fullName: name
    }));
  };

  const handleSignOut = async () => {
    await fbSignOut(auth);
    setFirebaseUid(null);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        setUser,
        firebaseUid,
        isFirebaseAuthLoading,
        bookings,
        visaApplications,
        savedWishlist,
        toggleSaveItem,
        isSaved,
        activeCurrency,
        setActiveCurrency,
        formatPrice,
        viewMode,
        setViewMode,
        showOnboarding,
        setShowOnboarding: (val) => {
          setShowOnboarding(val);
          if (!val) localStorage.setItem('inspirego_onboarding_done', 'true');
        },
        selectedBookingPayload,
        startBookingFlow,
        closeBookingFlow,
        isPaymentModalOpen,
        openPaymentModal,
        closePaymentModal,
        processPaymentSuccess,
        recentConfirmedBooking,
        clearRecentBooking,
        submitVisaApplication,
        isChatOpen,
        setIsChatOpen,
        chatMessages,
        sendChatMessage,
        isSendingChat,
        handleAuthEmailSignIn,
        handleAuthEmailSignUp,
        handleSignOut
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
