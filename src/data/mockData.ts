import { Destination, TravelPackage, UmrahPackage, EVisaOption, FlightInfo, OfficeContact } from '../types';

export const DESTINATIONS: Destination[] = [
  {
    id: 'banff-canada',
    name: 'Banff National Park',
    location: 'Alberta, Canada',
    country: 'Canada',
    category: 'Trending',
    imageUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1000&q=80',
    rating: 5.0,
    reviewsCount: 1420,
    pricePerPerson: 850,
    currency: 'USD',
    duration: '5 Days',
    description: 'Breathtaking turquoise glacial lakes, soaring Canadian Rocky peaks, pine forests, and alpine wildlife.',
    highlights: ['Lake Louise Canoeing', 'Moraine Lake Sunrise', 'Banff Gondola Summit', 'Sulphur Hot Springs'],
    bestSeason: 'June - September (Hiking), Dec - March (Skiing)',
    featured: true
  },
  {
    id: 'venice-italy',
    name: 'Grand Canals of Venice',
    location: 'Veneto, Italy',
    country: 'Italy',
    category: 'Trending',
    imageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1000&q=80',
    rating: 4.9,
    reviewsCount: 2310,
    pricePerPerson: 720,
    currency: 'USD',
    duration: '4 Days',
    description: 'Glide down the historic Grand Canal in a traditional gondola, explore St. Mark’s Square, and discover Murano glassblowing.',
    highlights: ['Gondola Serenade', 'Doge’s Palace Tour', 'Murano & Burano Islands', 'Rialto Bridge Sunset'],
    bestSeason: 'April - June, September - October',
    featured: true
  },
  {
    id: 'alula-saudi',
    name: 'AlUla Ancient Oasis',
    location: 'Medina Province, Saudi Arabia',
    country: 'Saudi Arabia',
    category: 'Spiritual',
    imageUrl: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1000&q=80',
    rating: 4.95,
    reviewsCount: 890,
    pricePerPerson: 1100,
    currency: 'USD',
    duration: '4 Days',
    description: 'Step into 200,000 years of living history amidst towering sandstone cliffs, Hegra UNESCO monuments, and lush palm groves.',
    highlights: ['Hegra Nabataean Tombs', 'Elephant Rock Sunset', 'Maraya Concert Hall', 'Old Town Heritage Walk'],
    bestSeason: 'October - April',
    featured: true
  },
  {
    id: 'interlaken-swiss',
    name: 'Interlaken & Jungfrau',
    location: 'Bernese Oberland, Switzerland',
    country: 'Switzerland',
    category: 'Nature',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80',
    rating: 4.92,
    reviewsCount: 1680,
    pricePerPerson: 1250,
    currency: 'USD',
    duration: '6 Days',
    description: 'The adrenaline and scenic alpine capital nested between Lake Thun and Lake Brienz, under the Eiger and Jungfrau.',
    highlights: ['Top of Europe Train', 'Lake Brienz Cruise', 'Lauterbrunnen 72 Waterfalls', 'Grindelwald First Cliff Walk'],
    bestSeason: 'May - October',
    featured: false
  },
  {
    id: 'kyoto-japan',
    name: 'Kyoto Sacred Shrines',
    location: 'Kansai, Japan',
    country: 'Japan',
    category: 'Cultural',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
    rating: 4.88,
    reviewsCount: 3100,
    pricePerPerson: 940,
    currency: 'USD',
    duration: '5 Days',
    description: 'Tranquil zen rock gardens, thousands of vermilion Torii gates at Fushimi Inari, and traditional matcha ceremonies in Gion.',
    highlights: ['Fushimi Inari Taisha', 'Arashiyama Bamboo Grove', 'Kinkaku-ji Golden Pavilion', 'Gion Geisha District'],
    bestSeason: 'March - May (Sakura), Oct - Nov (Autumn)',
    featured: true
  },
  {
    id: 'bali-indonesia',
    name: 'Ubud & Nusa Penida',
    location: 'Bali, Indonesia',
    country: 'Indonesia',
    category: 'Popular',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
    rating: 4.85,
    reviewsCount: 2950,
    pricePerPerson: 650,
    currency: 'USD',
    duration: '7 Days',
    description: 'Emerald rice terraces, spiritual water temples, cliffside ocean sanctuaries, and vibrant artisan craft villages.',
    highlights: ['Tegalalang Rice Terraces', 'Kelingking T-Rex Beach', 'Tirta Empul Holy Springs', 'Campuhan Ridge Walk'],
    bestSeason: 'April - October',
    featured: false
  }
];

export const PACKAGES: TravelPackage[] = [
  {
    id: 'pkg-swiss-alps',
    title: 'Swiss Alps Grand Panorama',
    destination: 'Interlaken & Lucerne, Switzerland',
    country: 'Switzerland',
    category: 'Europe',
    days: 7,
    nights: 6,
    price: 1580,
    originalPrice: 1890,
    rating: 4.95,
    reviewsCount: 340,
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80',
    tag: 'Best Seller',
    inclusions: ['4-Star Panoramic Alpine Hotels', 'Swiss Travel All-in-One Pass', 'Daily Breakfast Buffet', 'Jungfraujoch Summit Excursion', 'English Speaking Guide'],
    highlights: ['Ride the cogwheel train to the Top of Europe', 'Cruise turquoise waters of Lake Brienz', 'Walk through 72 cascading waterfalls in Lauterbrunnen'],
    itinerary: [
      { day: 1, title: 'Arrival in Zurich & Scenic Train to Interlaken', desc: 'Welcome reception, private check-in, orientation stroll through Old Town.' },
      { day: 2, title: 'Jungfraujoch: Top of Europe Expedition', desc: 'Ascend by high-speed Eiger Express cable car to 3,454m above sea level.' },
      { day: 3, title: 'Lauterbrunnen Valley & Trummelbach Falls', desc: 'Explore glacial caves, picturesque chalets, and alpine meadows.' },
      { day: 4, title: 'Transfer to Lucerne via GoldenPass Line', desc: 'Panoramic train journey through mountain passes and emerald valleys.' },
      { day: 5, title: 'Mount Pilatus Dragon Ride & Lake Lucerne', desc: 'Steepest cogwheel railway in the world and historic Chapel Bridge tour.' },
      { day: 6, title: 'Artisan Chocolate Tasting & Free Exploration', desc: 'Visit Swiss chocolatiers and boutique watchmakers.' },
      { day: 7, title: 'Departure from Zurich Airport', desc: 'Private transfer to Zurich Airport for your flight home.' }
    ],
    availableDates: ['2026-05-15', '2026-06-01', '2026-06-20', '2026-07-10']
  },
  {
    id: 'pkg-banff-explorer',
    title: 'Canadian Rockies & Banff Wilderness',
    destination: 'Banff & Jasper, Canada',
    country: 'Canada',
    category: 'Adventure',
    days: 6,
    nights: 5,
    price: 1190,
    originalPrice: 1450,
    rating: 4.98,
    reviewsCount: 512,
    imageUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1000&q=80',
    tag: 'Trending',
    inclusions: ['Luxury Mountain Lodge Stays', 'Columbia Icefield Explorer Tour', 'Daily Gourmet Breakfast', 'Lake Louise Canoe Rental', 'National Park Passes'],
    highlights: ['Walk on the ancient Athabasca Glacier', 'Sunrise photography at Moraine Lake', 'Relax in Sulphur Mountain Thermal Hot Springs'],
    itinerary: [
      { day: 1, title: 'Calgary to Banff National Park', desc: 'Scenic transfer across the foothills into Banff village.' },
      { day: 2, title: 'Lake Louise & Moraine Lake Icons', desc: 'Glacial canoeing and world-famous turquoise waters.' },
      { day: 3, title: 'Icefields Parkway & Glacier Skywalk', desc: 'Drive one of the most magnificent scenic highways on Earth.' },
      { day: 4, title: 'Johnston Canyon & Upper Falls Hike', desc: 'Walk suspended catwalks beside rushing mountain waterfalls.' },
      { day: 5, title: 'Banff Gondola & Hot Springs Spa', desc: '360-degree mountain summit view followed by thermal mineral pools.' },
      { day: 6, title: 'Calgary Departure', desc: 'Morning souvenir shopping and transfer to Calgary International Airport.' }
    ],
    availableDates: ['2026-05-25', '2026-06-14', '2026-07-05', '2026-08-12']
  },
  {
    id: 'pkg-kyoto-zen',
    title: 'Japan Golden Route: Kyoto & Tokyo',
    destination: 'Tokyo, Kyoto, Osaka, Japan',
    country: 'Japan',
    category: 'Asia',
    days: 8,
    nights: 7,
    price: 1850,
    originalPrice: 2150,
    rating: 4.92,
    reviewsCount: 620,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
    tag: 'Cultural Wonder',
    inclusions: ['7-Day Japan Rail Pass', 'Traditional Ryokan Stay with Onsen', '4-Star Modern City Hotels', 'Guided Gion Tea Ceremony', 'Pocket Wi-Fi Device'],
    highlights: ['Shinkansen Bullet Train rides', 'Authentic Kaiseki 9-course dinner', 'Walk through 10,000 torii gates at Fushimi Inari'],
    itinerary: [
      { day: 1, title: 'Arrive Tokyo Haneda & Shinjuku Nightlights', desc: 'Welcome meet, assist with JR Pass, check-in.' },
      { day: 2, title: 'Tokyo Heritage & Asakusa Senso-ji', desc: 'Ancient temples, Sumida river boat, teamLab Borderless digital art.' },
      { day: 3, title: 'Mount Fuji & Hakone Onsen', desc: 'Lake Ashi cruise and view of Mount Fuji from Owakudani.' },
      { day: 4, title: 'Bullet Train to Kyoto & Gion Evening Walk', desc: 'Ride the Tokaido Shinkansen at 285 km/h to Kyoto.' },
      { day: 5, title: 'Bamboo Groves of Arashiyama & Golden Pavilion', desc: 'Sagano romantic train and Kinkaku-ji reflection.' },
      { day: 6, title: 'Fushimi Inari & Nara Sacred Deer Park', desc: 'Feed the free-roaming sacred sika deer at Todai-ji Temple.' },
      { day: 7, title: 'Osaka Castle & Dotonbori Street Food Feast', desc: 'Savor takoyaki, okonomiyaki, and neon night canal walk.' },
      { day: 8, title: 'Kansai Departure', desc: 'Airport express to KIX for return journey.' }
    ],
    availableDates: ['2026-04-10', '2026-05-02', '2026-05-20', '2026-06-15']
  }
];

export const UMRAH_PACKAGES: UmrahPackage[] = [
  {
    id: 'umrah-vip-clocktower',
    name: 'VIP Royal Clock Tower Umrah Experience',
    tier: 'VIP Executive',
    duration: '10 Days / 9 Nights (5N Makkah, 4N Madinah)',
    pricePerPerson: 2350,
    makkahHotel: {
      name: 'Fairmont Makkah Clock Royal Tower',
      distance: '0 meters (Direct Haram Courtyard Access)',
      rating: 4.98,
      stars: 5
    },
    madinahHotel: {
      name: 'The Oberoi Madinah',
      distance: '50 meters to Prophet’s Mosque Women & Men Gates',
      rating: 4.97,
      stars: 5
    },
    highlights: [
      'Direct Kaaba view rooms available',
      'VIP Haramain Bullet Train Business Class tickets between Makkah and Madinah',
      'Dedicated bilingual scholar (Mutawwif) guiding all rituals',
      'Private luxury GMC Yukon XL airport and inter-city transfers',
      'Assistance with Nusuk Rawdah permit reservations and confirmation',
      'Exclusive private Ziyarah tour with historical insights'
    ],
    inclusions: [
      '5-Star Luxury Accommodations with daily open buffet breakfast',
      'Electronic Tourist / Umrah Visa with mandatory insurance included',
      '5L Zamzam holy water packed at airport upon departure',
      '24/7 dedicated InspireGO ground care concierge',
      'Ihram kits and comprehensive ritual guidance handbook'
    ],
    rawdahAssistance: true,
    privateTransport: true,
    tag: 'Most Recommended',
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'umrah-premium-deluxe',
    name: 'InspireGO Deluxe Umrah Package',
    tier: 'Premium Deluxe',
    duration: '8 Days / 7 Nights (4N Makkah, 3N Madinah)',
    pricePerPerson: 1680,
    makkahHotel: {
      name: 'Swissôtel Al Maqam Makkah',
      distance: '100 meters (Direct Abraj Al Bait Elevator)',
      rating: 4.88,
      stars: 5
    },
    madinahHotel: {
      name: 'Dar Al Taqwa Hotel Madinah',
      distance: '80 meters to Bab Al Salam',
      rating: 4.89,
      stars: 5
    },
    highlights: [
      '5-Star luxury hotels directly opposite the Holy Mosques',
      'High-speed Haramain train transfers included',
      'Nusuk Rawdah booking support and guidance',
      'Comprehensive Makkah & Madinah Ziyarah (Mount Uhud, Quba Mosque, Jabal Thawr)',
      'Free high-speed 5G tourist SIM card with 25GB data'
    ],
    inclusions: [
      'Daily breakfast buffet at both hotels',
      'Group AC coach transfers from Jeddah airport',
      'Complimentary Zamzam water can',
      'Multilingual tour manager',
      'E-visa processing service'
    ],
    rawdahAssistance: true,
    privateTransport: false,
    tag: 'Popular Choice',
    imageUrl: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'umrah-economy-comfort',
    name: 'Economy Comfort Umrah Package',
    tier: 'Economy Comfort',
    duration: '7 Days / 6 Nights (3N Makkah, 3N Madinah)',
    pricePerPerson: 990,
    makkahHotel: {
      name: 'Anjum Hotel Makkah',
      distance: '350 meters (4-minute walk to new Haram expansion)',
      rating: 4.65,
      stars: 4
    },
    madinahHotel: {
      name: 'Leader Al Muna Kareem Hotel',
      distance: '200 meters to Masjid An-Nabawi',
      rating: 4.6,
      stars: 4
    },
    highlights: [
      'Affordable comfort with proximity to both holy sites',
      'Regular air-conditioned shuttle and easy walking access',
      'Guidance for Tawaf and Sa’i procedures',
      'Guided group Ziyarat to historical battlegrounds and historic mosques'
    ],
    inclusions: [
      'Daily breakfast',
      'AC bus transportation across Jeddah, Makkah, Madinah',
      'Umrah E-visa processing support',
      'Emergency medical assistance 24/7'
    ],
    rawdahAssistance: true,
    privateTransport: false,
    tag: 'Value for Money',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80'
  }
];

export const EVISA_OPTIONS: EVisaOption[] = [
  {
    id: 'visa-saudi',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    feeUSD: 145,
    processingTime: '24 - 48 Hours',
    validity: '365 Days (1 Year Multiple Entry)',
    stayDuration: '90 Days per visit',
    entries: 'Multiple',
    popularFor: 'Umrah Pilgrimage & Tourism',
    documentsRequired: [
      'Passport with 6+ months validity',
      'Recent passport-size photo with white background',
      'National ID / Residence permit',
      'Confirmed flight return date'
    ]
  },
  {
    id: 'visa-uae',
    country: 'United Arab Emirates (Dubai)',
    flag: '🇦🇪',
    feeUSD: 110,
    processingTime: '24 - 72 Hours',
    validity: '60 Days',
    stayDuration: '30 or 60 Days',
    entries: 'Single',
    popularFor: 'Dubai Sightseeing, Shopping & Expo',
    documentsRequired: [
      'Passport bio-page color scan',
      'Passport photo (square format)',
      'Proof of accommodation / hotel voucher'
    ]
  },
  {
    id: 'visa-schengen',
    country: 'Schengen Area (Europe 27 States)',
    flag: '🇪🇺',
    feeUSD: 160,
    processingTime: '10 - 15 Business Days',
    validity: 'Up to 90 Days within 180-day period',
    stayDuration: '90 Days',
    entries: 'Multiple',
    popularFor: 'France, Italy, Switzerland, Germany tours',
    documentsRequired: [
      'Passport valid for 3+ months past departure',
      'Bank statement (last 3 months)',
      'Confirmed flight itinerary & hotel bookings',
      'Travel health insurance covering €30,000+'
    ]
  },
  {
    id: 'visa-japan',
    country: 'Japan eVisa',
    flag: '🇯🇵',
    feeUSD: 65,
    processingTime: '5 Business Days',
    validity: '90 Days from issuance',
    stayDuration: '15 or 30 Days',
    entries: 'Single',
    popularFor: 'Tokyo & Kyoto Cherry Blossom season',
    documentsRequired: [
      'Passport copy with machine-readable zone',
      'Recent photo taken within 6 months',
      'Daily schedule of stay / itinerary',
      'Tax return or proof of financial means'
    ]
  },
  {
    id: 'visa-uk-eta',
    country: 'United Kingdom (ETA)',
    flag: '🇬🇧',
    feeUSD: 35,
    processingTime: 'Under 24 Hours',
    validity: '2 Years Multiple Entry',
    stayDuration: '6 Months per visit',
    entries: 'Multiple',
    popularFor: 'London tours, family visits, business',
    documentsRequired: [
      'Biometric passport photo scan',
      'Credit card or UPI for official fee',
      'Contact address in the UK'
    ]
  }
];

export const INITIAL_FLIGHTS: FlightInfo[] = [
  {
    flightNumber: 'EK202',
    airline: 'Emirates',
    aircraft: 'Airbus A380-800',
    status: 'In Air',
    progressPercent: 68,
    altitude: '38,000 ft',
    groundSpeed: '915 km/h',
    origin: {
      code: 'JFK',
      city: 'New York',
      airport: 'John F. Kennedy Intl',
      terminal: 'T4',
      gate: 'B26',
      departureTime: '11:00 PM',
      date: 'Today',
      weather: '18°C Sunny'
    },
    destination: {
      code: 'DXB',
      city: 'Dubai',
      airport: 'Dubai International',
      terminal: 'T3',
      gate: 'A12',
      arrivalTime: '07:45 PM',
      date: 'Tomorrow',
      weather: '32°C Clear',
      baggageCarousel: 'Carousel 7'
    }
  },
  {
    flightNumber: 'SV101',
    airline: 'Saudia',
    aircraft: 'Boeing 777-300ER',
    status: 'In Air',
    progressPercent: 82,
    altitude: '35,000 ft',
    groundSpeed: '880 km/h',
    origin: {
      code: 'LHR',
      city: 'London',
      airport: 'Heathrow Airport',
      terminal: 'T4',
      gate: '14',
      departureTime: '01:45 PM',
      date: 'Today',
      weather: '14°C Light Rain'
    },
    destination: {
      code: 'JED',
      city: 'Jeddah',
      airport: 'King Abdulaziz Intl (Hajj/Umrah Terminal)',
      terminal: 'T1',
      gate: 'G08',
      arrivalTime: '09:30 PM',
      date: 'Today',
      weather: '30°C Warm',
      baggageCarousel: 'Carousel 3'
    }
  },
  {
    flightNumber: 'QR777',
    airline: 'Qatar Airways',
    aircraft: 'Boeing 787-9 Dreamliner',
    status: 'Boarding',
    progressPercent: 0,
    altitude: '0 ft (On Ground)',
    groundSpeed: '0 km/h',
    origin: {
      code: 'DOH',
      city: 'Doha',
      airport: 'Hamad International',
      terminal: 'Main',
      gate: 'C22',
      departureTime: '03:15 PM',
      date: 'Today',
      weather: '29°C Fair'
    },
    destination: {
      code: 'SIN',
      city: 'Singapore',
      airport: 'Changi Airport',
      terminal: 'T1',
      gate: 'D44',
      arrivalTime: '02:40 AM',
      date: 'Tomorrow',
      weather: '28°C Tropical',
      baggageCarousel: 'Carousel 12'
    }
  },
  {
    flightNumber: 'AI101',
    airline: 'Air India',
    aircraft: 'Boeing 787-8 Dreamliner',
    status: 'On Time',
    progressPercent: 42,
    altitude: '36,500 ft',
    groundSpeed: '860 km/h',
    origin: {
      code: 'DEL',
      city: 'New Delhi',
      airport: 'Indira Gandhi Intl',
      terminal: 'T3',
      gate: '48',
      departureTime: '08:20 AM',
      date: 'Today',
      weather: '26°C Clear'
    },
    destination: {
      code: 'LHR',
      city: 'London',
      airport: 'Heathrow Airport',
      terminal: 'T2',
      gate: 'B18',
      arrivalTime: '01:10 PM',
      date: 'Today',
      weather: '15°C Cloudy',
      baggageCarousel: 'Carousel 5'
    }
  }
];

export const OFFICE_CONTACTS: OfficeContact[] = [
  {
    id: 'office-uae-headquarters',
    type: 'Head Office',
    country: 'UAE',
    city: 'Dubai',
    title: 'InspireGo Travel & Tourism LLC',
    address: [
      'Suite 402, Al Hudaiba Awards Building',
      '2nd December Street, Jumeirah 1',
      'P.O. Box 48721, Dubai, United Arab Emirates'
    ],
    phones: ['+971 4 345 6789', '+971 50 123 4567'],
    whatsapp: '+971 50 123 4567',
    email: 'uae@inspirego.travel',
    workingHours: 'Mon – Sat: 9:00 AM – 8:00 PM (GST)',
    emergencySupport: '+971 55 987 6543 (24/7 VIP Travelers)',
    badges: ['Global Head Office', 'DTCM & IATA Certified', 'Visa & Umrah Hub', 'Direct WhatsApp Assistance']
  },
  {
    id: 'office-india-branch',
    type: 'Branch Office',
    country: 'India',
    city: 'Mumbai & Calicut',
    title: 'InspireGo Holidays & Umrah Services Pvt Ltd',
    address: [
      'Corporate Branch: 3rd Floor, Express Towers, Nariman Point, Mumbai, Maharashtra 400021',
      'Regional Operations: Cyberpark & HiLITE City, Calicut, Kerala 673016, India'
    ],
    phones: ['+91 495 244 5566', '+91 22 6123 4567', '+91 98470 12345'],
    whatsapp: '+91 98470 12345',
    email: 'india@inspirego.travel',
    workingHours: 'Mon – Sat: 9:30 AM – 7:30 PM (IST)',
    emergencySupport: '1800 123 4567 (Toll-Free India)',
    badges: ['India Branch Office', 'Ministry of Tourism Approved', 'Dedicated India Support', 'Kerala & Mumbai Desks']
  }
];
