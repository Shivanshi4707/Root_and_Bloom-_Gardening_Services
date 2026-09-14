// Gemini AI and Fallback Knowledge Service for Root & Bloom

export interface ChatHistoryItem {
  id?: string;
  sender: 'user' | 'bot';
  text: string;
  time?: string;
}

export interface ChatResponse {
  reply: string;
  source: 'gemini' | 'knowledge-base';
}

export const sendChatMessage = async (
  message: string,
  history: ChatHistoryItem[] = []
): Promise<ChatResponse> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.reply) {
        return { reply: data.reply, source: data.source || 'gemini' };
      }
    }
  } catch (e) {
    // Network or server unreachable; continue to client-side fallback
  }

  // Resilient Client-Side Fallback Knowledge Engine
  return {
    reply: getFallbackReply(message, history),
    source: 'knowledge-base',
  };
};

const getFallbackReply = (text: string, history: ChatHistoryItem[] = []): string => {
  const clean = (text || '').trim().toLowerCase();

  // 1. Natural Conversation & Greetings
  if (/^(hi|hello|hey|namaste|good\s*(morning|afternoon|evening)|hola)/i.test(clean)) {
    return 'Namaste! 🌿 Welcome to Root & Bloom. I am your botanical advisor. Are you looking for plant care advice, order tracking, service bookings, or ideas for your balcony/garden?';
  }

  if (/^(how are you|how do you do)/i.test(clean)) {
    return 'Doing wonderfully and surrounded by fresh greens! 🌱 How can I assist with your garden or home plants today?';
  }

  if (/^(thanks|thank you|awesome|great|perfect|ok|okay|cool)/i.test(clean)) {
    return 'You are most welcome! 🌸 Happy gardening, and feel free to ask anytime if your plants need anything.';
  }

  // 2. Balcony & Lighting Follow-ups (Conversational Context)
  if (clean.includes('balcony') || clean.includes('patio') || clean.includes('terrace')) {
    if (clean.includes('sunny') || clean.includes('direct sun') || clean.includes('full sun')) {
      return 'For a sunny balcony in India, these plants thrive with vibrant color: Bougainvillea, Holy Basil (Tulsi), Arabian Jasmine (Mogra), Hibiscus, Jade, and Adenium. They love 4–6 hours of sunlight and regular morning watering.';
    }
    if (clean.includes('low light') || clean.includes('shade') || clean.includes('shady') || clean.includes('indirect')) {
      return 'For a shaded or low-light balcony: Snake Plant (Sansevieria), ZZ Plant, Aglaonema (Chinese Evergreen), Golden Pothos (Money Plant), and Boston Ferns will flourish beautifully without scorching.';
    }
    return 'Balconies are lovely green sanctuaries! 🌿 Does your balcony receive full direct sunlight, partial morning sun, or mostly shaded indirect light?';
  }

  if (clean === 'sunny' || clean === 'mostly sunny' || clean === 'lots of sun') {
    return 'Brilliant! With plenty of sunlight, you can grow flowering wonders like Bougainvillea, Jasmine (Mogra), Hibiscus, Portulaca, plus culinary herbs like Basil and Mint. Water them early in the morning before the afternoon heat!';
  }

  if (clean === 'shaded' || clean === 'shade' || clean === 'low light' || clean === 'indirect light') {
    return 'Shaded spaces are ideal for lush architectural foliage! We recommend Snake Plants, ZZ Plants, Peace Lilies, Cast Iron Plants, and cascading Golden Pothos. They keep rich green foliage with minimal fuss.';
  }

  // 3. Root & Bloom Orders & Delivery
  if (clean.includes('where is my order') || clean.includes('order status') || clean.includes('tracking') || clean.includes('track order')) {
    return 'You can track active deliveries under the "My Garden" tab on your top menu! All orders are packed in eco-friendly Kraft packaging and dispatched within 35 minutes via our zero-emission electric cargo vehicles.';
  }

  if (clean.includes('delivery') || clean.includes('how fast') || clean.includes('shipping')) {
    return 'Root & Bloom offers ultra-fast 35-minute quick delivery for plants, potting soils, pots, fertilizers, and tools. Orders above ₹499 qualify for FREE eco-delivery!';
  }

  // 4. Service Bookings & Cancellations
  if (clean.includes('book') || clean.includes('service') || clean.includes('gardener') || clean.includes('horticulturist') || clean.includes('visit')) {
    return 'You can book verified urban gardeners and senior horticulturists through our "Services" tab. Services include Routine Maintenance, Soil Aeration & Vermicomposting, Plant Doctor Clinics, Lawn Care, and Balcony Transformations. Starting at ₹799/visit!';
  }

  if (clean.includes('cancel') || clean.includes('reschedule')) {
    return 'Bookings can be rescheduled or cancelled with full refund up to 2 hours before the scheduled technician arrival time. Go to "My Garden" -> "Bookings" or contact support at support@rootandbloom.in.';
  }

  // 5. Garden Visualizer
  if (clean.includes('visualizer') || clean.includes('garden design') || clean.includes('ai design') || clean.includes('photo')) {
    return 'Our AI Garden Visualizer lets you upload a photo of your existing balcony, terrace, or backyard. Select your preferred style (Tropical, Modern, Zen, Vertical) and it will generate an architectural proposed transformation with matching plants and materials!';
  }

  // 6. Payment & UPI
  if (clean.includes('payment') || clean.includes('upi') || clean.includes('pay') || clean.includes('gpay') || clean.includes('phonepe')) {
    return 'We accept UPI (Google Pay, PhonePe, Paytm, BHIM), Debit & Credit Cards, Net Banking, and Cash on Delivery / Pay After Service.';
  }

  // 7. Plant Care: Yellow Leaves, Watering, Pests, Fertilizers
  if (clean.includes('yellow') || clean.includes('turning yellow')) {
    return 'Yellow leaves are usually caused by: 1) Overwatering — let the top 2 inches of soil dry out. 2) Poor drainage — ensure container drainage holes are clear. 3) Low nitrogen — nourish with organic Vermicompost or diluted seaweed tonic.';
  }

  if (clean.includes('water') || clean.includes('watering')) {
    return 'The best watering rule is the Finger Test: insert your index finger 1.5 inches into the soil. If it feels dry, water deeply until water trickles out the drainage hole. If damp, wait another day!';
  }

  if (clean.includes('snake plant') || clean.includes('sansevieria')) {
    return 'Snake plants are ultra low-maintenance succulents! Water them only once every 10–14 days in summers, and once every 3 weeks in winter. Always let the soil dry out completely.';
  }

  if (clean.includes('pest') || clean.includes('bug') || clean.includes('white insect') || clean.includes('mealybug') || clean.includes('aphid')) {
    return 'For white insects (mealybugs) or aphids: Mix 5ml cold-pressed Neem Oil with 2 drops of gentle soap in 1 Litre of water and spray under leaves at dusk. For stubborn mealybugs, dab them with a cotton swab soaked in rubbing alcohol.';
  }

  if (clean.includes('fertilizer') || clean.includes('rose') || clean.includes('feed') || clean.includes('bloom')) {
    return 'For roses and flowering plants: Feed monthly with organic Vermicompost and a spoonful of bone meal or banana peel powder (rich in phosphorus and potassium). Spray seaweed extract every 3 weeks for active budding.';
  }

  // General fallback
  return 'Thank you for reaching out to Root & Bloom! 🌿 Our horticulturists are here to support your green journey. You can explore our Shop for 35-minute delivery, book a gardener via Services, or use our Garden Visualizer to transform your space. What would you like to explore next?';
};
