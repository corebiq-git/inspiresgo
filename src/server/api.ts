import { GoogleGenAI } from '@google/genai';
import express, { Request, Response } from 'express';

export const apiRouter = express.Router();
apiRouter.use(express.json());

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not set. Using intelligent fallback generator.');
    return null;
  }
  aiClient = new GoogleGenAI({ apiKey });
  return aiClient;
}

// 1. Gemini AI Personalized Travel Recommendations & Itinerary Planning
apiRouter.post('/gemini/recommend', async (req: Request, res: Response) => {
  try {
    const {
      destination = 'Banff National Park, Canada',
      durationDays = 5,
      budget = 'Moderate',
      travelStyle = 'Scenic & Adventure',
      travelerType = 'Couple',
      interests = ['Nature', 'Photography', 'Food'],
      customPrompt = ''
    } = req.body;

    const ai = getGenAI();

    if (!ai) {
      // Fallback high-quality curated itinerary if API key is not yet configured
      return res.json({
        success: true,
        source: 'curated_fallback',
        itinerary: getFallbackItinerary(destination, durationDays, budget, travelStyle)
      });
    }

    const systemInstruction = `You are InspireGO's Senior AI Travel Architect. 
You create breathtaking, realistic, and practical travel itineraries and recommendations.
Respond strictly in valid JSON format matching this structure:
{
  "title": string,
  "tagline": string,
  "overview": string,
  "destination": string,
  "durationDays": number,
  "estimatedBudget": string,
  "bestTimeToVisit": string,
  "curatedHighlights": string[],
  "days": [
    {
      "dayNumber": number,
      "title": string,
      "theme": string,
      "morning": { "time": "09:00 AM", "title": string, "description": string, "tip": string },
      "afternoon": { "time": "01:30 PM", "title": string, "description": string, "tip": string },
      "evening": { "time": "07:00 PM", "title": string, "description": string, "tip": string },
      "dayBudgetEstimate": string
    }
  ],
  "localFoodToTry": [
    { "name": string, "description": string, "mustTrySpot": string }
  ],
  "packingEssentials": string[],
  "culturalTips": string[]
}`;

    const prompt = `Create a bespoke ${durationDays}-day travel itinerary for "${destination}".
Traveler Profile: ${travelerType}
Travel Style: ${travelStyle}
Budget Level: ${budget}
Interests: ${Array.isArray(interests) ? interests.join(', ') : interests}
Additional requests: ${customPrompt || 'Create a memorable, well-balanced journey with local gems and practical timings.'}

Ensure timings are realistic, include specific scenic spots and culinary experiences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // Extract JSON if enclosed in markdown
      const match = responseText.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : getFallbackItinerary(destination, durationDays, budget, travelStyle);
    }

    return res.json({
      success: true,
      source: 'gemini_api',
      itinerary: parsed
    });
  } catch (error: any) {
    console.error('Error generating Gemini itinerary:', error);
    // Return friendly curated fallback to keep user experience uninterrupted
    const { destination = 'Banff National Park', durationDays = 5, budget = 'Moderate', travelStyle = 'Scenic' } = req.body || {};
    return res.json({
      success: true,
      source: 'curated_fallback_on_error',
      itinerary: getFallbackItinerary(destination, durationDays, budget, travelStyle),
      errorNotice: error.message
    });
  }
});

// 2. 24/7 Live Customer Support AI Concierge Chat
apiRouter.post('/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], context = {} } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      const fallbackReply = generateFallbackChatReply(message, context);
      return res.json({
        reply: fallbackReply,
        source: 'curated_agent',
        suggestedActions: [
          'Track my flight',
          'Check Umrah packages',
          'Apply for E-visa',
          'View my bookings'
        ]
      });
    }

    const systemPrompt = `You are InspireGO Concierge, the 24/7 intelligent travel assistant for the InspireGO platform.
You are warm, helpful, concise, and professional.
About InspireGo:
- Head Office (UAE): InspireGo Travel & Tourism LLC, Suite 402, Al Hudaiba Awards Building, 2nd December St, Jumeirah 1, Dubai, UAE. Phone: +971 4 345 6789, WhatsApp: +971 50 123 4567, Email: uae@inspirego.travel.
- Branch Office (India): InspireGo Holidays & Umrah Services Pvt Ltd, Express Towers, Nariman Point, Mumbai & Cyberpark, Calicut, Kerala, India. Phone: +91 495 244 5566, WhatsApp: +91 98470 12345, Email: india@inspirego.travel.
You help travelers like Fathima with:
- Booking status & package questions
- Umrah services (Makkah & Madinah hotels, Rawdah permits, Ziyarah)
- E-visa requirements & processing times
- Flight tracking and baggage questions
- Real-time travel guidance, local advice, and office assistance in UAE and India
Context of current user: ${JSON.stringify(context)}
Keep your responses friendly, concise, formatted with clear bullet points where helpful.`;

    const chatContents: any[] = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        chatContents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    }
    chatContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return res.json({
      reply: response.text || "I'm here to assist you with all your travel needs on InspireGO!",
      source: 'gemini_api',
      suggestedActions: getSuggestedActions(message)
    });
  } catch (error: any) {
    console.error('Gemini Chat error:', error);
    const fallbackReply = generateFallbackChatReply(req.body?.message || '', req.body?.context);
    return res.json({
      reply: fallbackReply,
      source: 'curated_agent_fallback',
      error: error.message
    });
  }
});

// 3. Real-time Flight Tracker API
apiRouter.get('/flights', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toUpperCase().trim();
  const flights = getMockLiveFlights();

  if (query) {
    const filtered = flights.filter(f => 
      f.flightNumber.includes(query) ||
      f.airline.toUpperCase().includes(query) ||
      f.origin.city.toUpperCase().includes(query) ||
      f.destination.city.toUpperCase().includes(query) ||
      f.origin.code.toUpperCase().includes(query) ||
      f.destination.code.toUpperCase().includes(query)
    );
    return res.json({ flights: filtered });
  }

  return res.json({ flights });
});

// 4. Visa requirements helper
apiRouter.post('/gemini/visa-advice', async (req: Request, res: Response) => {
  try {
    const { nationality = 'India', destination = 'Saudi Arabia', purpose = 'Tourism/Umrah' } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        requirements: {
          eligibility: 'Eligible for instant 1-year multiple entry eVisa or Visa-on-Arrival if holding valid US/UK/Schengen visa.',
          validity: '365 days (90 days maximum stay per visit)',
          processingTime: '24 to 48 hours typical approval time',
          requiredDocuments: [
            'Passport valid for at least 6 months from entry date',
            'Recent passport-style photograph (white background)',
            'Valid payment card or UPI for government fees',
            'Confirmed accommodation or hotel booking reference'
          ],
          feeUSD: 145,
          mandatoryInsurance: 'Included in standard eVisa fee covers emergency medical'
        }
      });
    }

    const prompt = `Give clear, up-to-date visa requirement guidelines for a traveler holding nationality of "${nationality}" visiting "${destination}" for "${purpose}".
Provide a concise JSON with:
{
  "eligibility": string,
  "validity": string,
  "processingTime": string,
  "requiredDocuments": string[],
  "feeUSD": number,
  "mandatoryInsurance": string,
  "expertAdvice": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    let data;
    try {
      data = JSON.parse(response.text || '{}');
    } catch {
      data = {
        eligibility: `Online eVisa available for ${destination}.`,
        validity: '90 days from issuance',
        processingTime: '24-72 hours',
        requiredDocuments: ['Valid Passport (6+ months validity)', 'Passport photo', 'Return Flight Ticket'],
        feeUSD: 130,
        mandatoryInsurance: 'Included with official tourist visa application',
        expertAdvice: 'Submit documents at least 10 days before your intended flight.'
      };
    }

    return res.json({ requirements: data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Helper: Curated Fallback Itinerary
function getFallbackItinerary(destination: string, durationDays: number, budget: string, travelStyle: string) {
  const isUmrah = destination.toLowerCase().includes('umrah') || destination.toLowerCase().includes('makkah') || destination.toLowerCase().includes('saudi');
  
  if (isUmrah) {
    return {
      title: "Sacred Spiritual Journey: Makkah & Madinah Umrah Pilgrimage",
      tagline: "Serene spiritual devotion, historic Ziyarahs, and luxurious comfort",
      overview: `A spiritually enriching ${durationDays}-day pilgrimage meticulously planned with prime accommodations near the Holy Mosques, private transfers, and experienced Mutawwif guidance.`,
      destination: "Makkah & Madinah, Saudi Arabia",
      durationDays,
      estimatedBudget: budget === 'Luxury' ? '$2,800 - $3,500' : '$1,400 - $1,950',
      bestTimeToVisit: "November to March (pleasant weather) and Holy Month of Ramadan",
      curatedHighlights: [
        "Private VIP Haram transfers and Clock Tower luxury stay",
        "Guided historical Ziyarat to Jabal al-Nour & Mount Uhud",
        "Assistance with Nusuk Rawdah permit reservations",
        "Zamzam water blessing and 24/7 dedicated local support"
      ],
      days: [
        {
          dayNumber: 1,
          title: "Arrival in Jeddah & Ihram Departure for Makkah",
          theme: "Entering Ihram and First Blessed Umrah",
          morning: { time: "09:00 AM", title: "Landing at KAIA Jeddah", description: "VIP airport meet & assist, luggage transfer, donning Ihram at Miqat boundary.", tip: "Drink plenty of water and verify your Nusuk app slot." },
          afternoon: { time: "02:00 PM", title: "Check-in at Makkah Hotel", description: "Private GMC transfer to hotel facing Masjid al-Haram. Refreshment & rest.", tip: "Rest before proceeding to the sacred sanctuary." },
          evening: { time: "08:00 PM", title: "Performing the Umrah Rituals", description: "Perform Tawaf around the holy Kaaba followed by 2 Rakah at Maqam Ibrahim and Sa'i between Safa and Marwa.", tip: "Take small breaks between Safa & Marwa laps." },
          dayBudgetEstimate: "$120 (meals & transport included in package)"
        },
        {
          dayNumber: 2,
          title: "Devotion in Haram & Sacred Makkah Ziyarah",
          theme: "Historical Landmarks & Spiritual Reflection",
          morning: { time: "05:00 AM", title: "Fajr Prayer in Masjid al-Haram", description: "Experience the tranquil early morning congregation followed by Quran recitation.", tip: "Arrive 45 mins before adhan for prime courtyard spots." },
          afternoon: { time: "02:30 PM", title: "Historic Makkah Ziyarat Tour", description: "Visit Jabal al-Thawr, Mount Arafat (Jabal al-Rahmah), and Mina plain with our licensed scholar.", tip: "Wear comfortable walking footwear." },
          evening: { time: "07:30 PM", title: "Evening Du'a and Traditional Hejazi Dinner", description: "Dinner featuring authentic Mandi and Bukhari rice with refreshing mint tea.", tip: "Sample local fresh dates at Souq al-Kakiyyah." },
          dayBudgetEstimate: "$45"
        },
        {
          dayNumber: 3,
          title: "Journey on Haramain High-Speed Rail to Madinah",
          theme: "City of the Prophet (PBUH)",
          morning: { time: "09:30 AM", title: "Bullet Train Experience", description: "Travel in comfort at 300 km/h from Makkah to the Radiant City of Madinah.", tip: "Window seats offer striking views of the Hejaz desert dunes." },
          afternoon: { time: "01:00 PM", title: "Madinah Arrival & First Salam", description: "Check-in near the Prophet's Mosque courtyard and offer prayers in the grand Haram.", tip: "Respect peaceful etiquette and silence phones." },
          evening: { time: "08:00 PM", title: "Rawdah ash-Sharifah Visit", description: "Enter the Garden of Paradise (Rawdah) according to scheduled Nusuk permit appointment.", tip: "Have your QR pass downloaded offline." },
          dayBudgetEstimate: "$90"
        }
      ],
      localFoodToTry: [
        { name: "Hejazi Kabsa & Mandi", description: "Fragrant spiced basmati rice with tender slow-roasted lamb", mustTrySpot: "Al Romansiah Restaurant" },
        { name: "Ajwa Dates & Arabic Gahwa", description: "Blessed Madinah dates served with cardamom coffee", mustTrySpot: "Central Date Market Madinah" },
        { name: "Mutabbaq & Foul", description: "Crisp pan-fried folded pastry with spiced savory filling", mustTrySpot: "Bab Makkah Heritage Eateries" }
      ],
      packingEssentials: ["Two sets of white Ihram towels", "Unscented toiletries & soap", "Comfortable slip-on walking sandals", "Pocket prayer mat & digital counter"],
      culturalTips: ["Maintain calm voice levels inside the Harams", "Always dress modestly with shoulders and knees covered", "Keep a photocopy of your visa and passport"]
    };
  }

  return {
    title: `Ultimate ${destination} Escape`,
    tagline: `Curated ${durationDays}-day discovery designed for authentic memories`,
    overview: `Experience the crown jewels of ${destination} with an optimal balance of iconic landmarks, secluded viewpoints, culinary delights, and stress-free transit.`,
    destination,
    durationDays,
    estimatedBudget: budget === 'Luxury' ? '$3,200 - $4,500' : '$1,200 - $1,800',
    bestTimeToVisit: "Spring (May-June) or Autumn (September-October) for optimal weather and thinner crowds",
    curatedHighlights: [
      "Golden hour photography at scenic world-heritage viewpoints",
      "Handpicked local culinary bistros away from tourist traps",
      "Seamless round-trip express scenic transit passes",
      "Curated hiking trails suited for any fitness level"
    ],
    days: [
      {
        dayNumber: 1,
        title: "Arrival & Historic Heart Discovery",
        theme: "Settling in & Old Town Ambiance",
        morning: { time: "09:30 AM", title: "Arrival & Boutique Check-In", description: "Drop bags, grab artisan espresso, and acclimatize to the neighborhood vibe.", tip: "Ask concierge for their current favorite seasonal pastry spot." },
        afternoon: { time: "02:00 PM", title: "Historic Center Walking Exploration", description: "Stroll cobble streets, visit the central town square, and view architectural monuments.", tip: "Book museum passes online in advance to skip queue lines." },
        evening: { time: "07:30 PM", title: "Sunset Dining on the Water", description: "Savor farm-to-table seasonal delicacies paired with local beverages.", tip: "Reserve a terrace table 30 minutes before sunset." },
        dayBudgetEstimate: "$85"
      },
      {
        dayNumber: 2,
        title: "Nature & Iconic Panorama Expedition",
        theme: "Breathtaking Horizons",
        morning: { time: "08:00 AM", title: "Scenic Gondola / Mountain Rail Journey", description: "Ascend to the panoramic summit lookout for uninterrupted 360-degree vistas.", tip: "Dress in light layers as summit temperatures can drop." },
        afternoon: { time: "01:30 PM", title: "Alpine Lake Hike & Lakeside Picnic", description: "Gentle 4km loop around turquoise glacier waters with mountain reflections.", tip: "Pack eco-friendly water bottles and trail snacks." },
        evening: { time: "07:00 PM", title: "Thermal Spa & Regional Dinner", description: "Unwind tired muscles in natural hot spring mineral pools followed by hearty dinner.", tip: "Bring your own towel for complimentary locker entry." },
        dayBudgetEstimate: "$110"
      },
      {
        dayNumber: 3,
        title: "Hidden Gems, Artisan Crafts & Farewell",
        theme: "Cultural Immersion & Keepsakes",
        morning: { time: "09:00 AM", title: "Local Artisan Market & Antique Souk", description: "Discover handcrafted textiles, ceramics, and regional specialties directly from makers.", tip: "Polite haggling is customary at outdoor bazaars." },
        afternoon: { time: "02:00 PM", title: "Hidden Cafe & Botanical Gardens", description: "Relax under shade trees with handcrafted ice cream and iced herbal tea.", tip: "Visit the butterfly pavilion on the east side." },
        evening: { time: "06:30 PM", title: "Celebration Dinner & Nightlights", description: "Toast to an unforgettable journey at a rooftop garden lounge.", tip: "Keep baggage packed for smooth checkout the following day." },
        dayBudgetEstimate: "$95"
      }
    ],
    localFoodToTry: [
      { name: "Regional Signature Plate", description: "Slow cooked heirloom stew with freshly baked crusty bread", mustTrySpot: "The Old Mill Tavern" },
      { name: "Artisanal Dessert Specialty", description: "Warm flaky pastry layered with honey and roasted pistachios", mustTrySpot: "Heritage Bakehouse" }
    ],
    packingEssentials: ["Comfortable broken-in walking shoes", "Universal power adapter", "Lightweight windproof jacket", "Compact power bank for photo shoots"],
    culturalTips: ["Tipping is appreciated between 10-15%", "Public transit requires validated tickets before boarding", "Keep offline maps downloaded"]
  };
}

function generateFallbackChatReply(msg: string, context: any): string {
  const m = msg.toLowerCase();
  if (m.includes('office') || m.includes('branch') || m.includes('uae') || m.includes('dubai') || m.includes('india') || m.includes('contact') || m.includes('call') || m.includes('whatsapp')) {
    return "Here are InspireGo's Official Contact Details:\n\n🇦🇪 **Head Office (UAE)**:\n• Location: Suite 402, Al Hudaiba Awards Bldg, Jumeirah 1, Dubai, UAE\n• Phone: +971 4 345 6789\n• WhatsApp: +971 50 123 4567\n• Email: uae@inspirego.travel\n• Hours: Mon–Sat, 9:00 AM – 8:00 PM GST\n\n🇮🇳 **Branch Office (India)**:\n• Location: Express Towers, Nariman Point, Mumbai & Cyberpark, Calicut, Kerala\n• Phone: +91 495 244 5566 / +91 98470 12345\n• WhatsApp: +91 98470 12345\n• Email: india@inspirego.travel\n• Hours: Mon–Sat, 9:30 AM – 7:30 PM IST\n\nYou can also click 'Our Offices' on the home screen for one-tap calling!";
  }
  if (m.includes('umrah') || m.includes('makkah') || m.includes('madinah')) {
    return "Assalamu Alaikum! InspireGO provides complete Umrah packages including 5-star Clock Tower hotels, Nusuk Rawdah permit booking assistance, VIP private transport, and experienced Mutawwif guides. Would you like to view our VIP, Premium, or Economy Umrah packages?";
  }
  if (m.includes('visa') || m.includes('e-visa') || m.includes('passport')) {
    return "Our E-Visa portal supports instant online visa applications for Saudi Arabia, UAE, Schengen, Japan, UK, and US. Standard approvals take 24–48 hours. You can start your application in our 'E-Visa' tab right now with just your passport scan!";
  }
  if (m.includes('flight') || m.includes('track') || m.includes('terminal')) {
    return "You can track live commercial flights in real-time in our 'Flight Radar' tab. Simply enter your flight code (e.g. EK202, SV101, QR777) to check live altitude, speed, departure gate, baggage carousel, and weather status!";
  }
  if (m.includes('payment') || m.includes('upi') || m.includes('card') || m.includes('refund')) {
    return "InspireGO supports instant UPI payments (Google Pay, PhonePe, Paytm, BHIM with instant QR) as well as all major Credit/Debit Cards (Visa, Mastercard, Amex). All payments are secured with 256-bit encryption and instant confirmation receipts!";
  }
  return "Welcome to InspireGO 24/7 Support! I'm here to help you plan custom itineraries, book upcoming tour packages, track flights in real-time, or manage your Umrah and E-visa applications. How can I make your journey smoother today?";
}

function getSuggestedActions(msg: string): string[] {
  const m = msg.toLowerCase();
  if (m.includes('umrah')) {
    return ['Book VIP Umrah', 'Umrah Checklist', 'Rawdah Permit Guide', 'Economy Packages'];
  }
  if (m.includes('visa')) {
    return ['Start E-Visa', 'Check Eligibility', 'Required Documents', 'Track Application'];
  }
  return ['Explore Trending Places', 'Plan with AI', 'Track Flight Status', 'Customer Support Call'];
}

function getMockLiveFlights() {
  return [
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
      aircraft: 'Boeing 787-8',
      status: 'On Time',
      progressPercent: 45,
      altitude: '36,000 ft',
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
    },
    {
      flightNumber: '6E204',
      airline: 'IndiGo',
      aircraft: 'Airbus A321neo',
      status: 'Landed',
      progressPercent: 100,
      altitude: '0 ft',
      groundSpeed: 'Taxiing',
      origin: {
        code: 'BOM',
        city: 'Mumbai',
        airport: 'Chhatrapati Shivaji Intl',
        terminal: 'T2',
        gate: '65',
        departureTime: '06:10 AM',
        date: 'Today',
        weather: '28°C Humid'
      },
      destination: {
        code: 'DXB',
        city: 'Dubai',
        airport: 'Dubai International',
        terminal: 'T1',
        gate: 'D03',
        arrivalTime: '08:05 AM',
        date: 'Today',
        weather: '31°C Clear',
        baggageCarousel: 'Carousel 4'
      }
    }
  ];
}
