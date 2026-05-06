import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

// Static knowledge base for general info (kept for context building)
const staticKnowledge = {
    about: `Monophis is a premier Christian retreat and community center dedicated to serving faith, learning, and charity. We offer world-class facilities including event halls, comfortable hostels, and comprehensive event packages for retreats, conferences, weddings, and more.`,

    booking: `To book a facility:
1. Browse available halls/hostels/packages on the website
2. Select preferred dates and facility
3. Fill out the booking form
4. Choose payment method (Paystack or Bank Transfer)
5. Receive confirmation after payment verification.
URLs: /services/halls, /services/hostels, /services/packages`,

    contact: `Phone/WhatsApp: +233 27 993 1941
Email: info@Monophis.com
Location: Fourth St, Accra, Ghana`,

    location: `Fourth St, Accra, Ghana. Easily accessible by road, offering a peaceful environment away from city noise.`,

    services: `Services: Event Halls, Hostel Accommodation, Event Packages (Retreats, Weddings, Conferences), Catering, Audio-Visual Equipment, Outdoor Spaces.`
};

// --- DATA FETCHING HELPERS FOR CONTEXT ---

async function fetchAllData() {
    try {
        const [halls, hostels, eventPackages, specialPackages, groupRetreats] = await Promise.all([
            prisma.hall.findMany({ include: { amenities: true, suitability: true } }),
            prisma.hostel.findMany({ include: { amenities: true } }),
            prisma.package.findMany({ where: { packageType: 'event' }, include: { features: true } }),
            prisma.package.findMany({ where: { packageType: 'special' }, include: { features: true } }),
            prisma.package.findMany({ where: { packageType: 'group_retreat' }, include: { features: true } })
        ]);
        return { halls, hostels, eventPackages, specialPackages, groupRetreats };
    } catch (error) {
        console.error("Error fetching data for context:", error);
        return { halls: [], hostels: [], eventPackages: [], specialPackages: [], groupRetreats: [] };
    }
}

function formatContext(data: any) {
    let context = `CURRENT DATABASE STATUS (Real-time info from website):\n\n`;

    // Halls
    context += `HALLS & AUDITORIUMS:\n`;
    if (data.halls.length) {
        data.halls.forEach((h: any) => {
            const amenities = h.amenities.map((a: any) => a.amenityName).join(', ');
            context += `- ${h.name}: Capacity ${h.capacity}, Price ${h.price} (${h.duration}). Amenities: ${amenities}.\n`;
        });
    } else context += "No halls currently listed.\n";

    // Hostels
    context += `\nHOSTELS & ACCOMMODATION:\n`;
    if (data.hostels.length) {
        data.hostels.forEach((h: any) => {
            const amenities = h.amenities.map((a: any) => a.amenityName).join(', ');
            context += `- ${h.name}: Capacity ${h.capacity}, Price ${h.price} (${h.duration}). Amenities: ${amenities}.\n`;
        });
    } else context += "No hostels currently listed.\n";

    // Packages
    context += `\nEVENT PACKAGES:\n`;
    data.eventPackages.forEach((p: any) => {
        context += `- ${p.name}: ${p.price}. Includes: ${p.features.map((f: any) => f.featureName).join(', ')}.\n`;
    });

    context += `\nSPECIAL PACKAGES (Deals/Discounts):\n`;
    data.specialPackages.forEach((p: any) => {
        context += `- ${p.name}: ${p.price}. ${p.description || ''}\n`;
    });

    context += `\nGROUP RETREAT PACKAGES:\n`;
    data.groupRetreats.forEach((p: any) => {
        context += `- ${p.name}: ${p.price}. ${p.description || ''}\n`;
    });

    return context;
}

// --- FALLBACK LOGIC (Previous Regex Implementation) ---
// Kept for robustness if AI service fails

const greetings = [
    "Hello! 👋 I'm Emily, your Monophis assistant. What are you looking for today?",
    "Hi there! I'm Emily. I can help you with halls, hostels, or packages. What do you need?",
    "Welcome! I'm Emily. How can I help you plan your event at Monophis?"
];

async function getFallbackResponse(message: string): Promise<string> {
    const lower = message.toLowerCase();

    if (/(hi|hello|hey|greetings)/i.test(lower)) return greetings[Math.floor(Math.random() * greetings.length)];

    if (/(hall|auditorium)/i.test(lower)) return "We have several halls available. Please check /services/halls or ask me to list them (Note: AI mode unavailable, generic response).";

    if (/(hostel|accommodation)/i.test(lower)) return "We have comfortable hostels. Check /services/hostels.";

    if (/(package)/i.test(lower)) return "We offer Event, Special, and Group Retreat packages. Check /services/packages.";

    if (/(contact|phone)/i.test(lower)) return staticKnowledge.contact;

    return "I'm currently running in offline mode. Please contact us at +233 27 993 1941 or explore our website menu.";
}


// --- MAIN HANDLER ---

export async function POST(request: Request) {
    try {
        const { message } = await request.json();
        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // 1. Try Gemini AI First
        if (genAI && process.env.GEMINI_API_KEY?.startsWith('AIza')) {
            try {
                console.log("Attempting to use Gemini AI directly...");
                // Fetch fresh data for every request to ensure "up to date" info
                const dbData = await fetchAllData();
                const dbContext = formatContext(dbData);
                console.log("Database context generated successfully");

                const model = genAI.getGenerativeModel({ model: "gemini-pro" });

                const systemPrompt = `
You are Emily, the professional, friendly, and helpful AI assistant for Monophis.
Your goal is to assist users by answering questions about facilities, booking, and services based strictly on the provided context.

CONTEXT:
${JSON.stringify(staticKnowledge, null, 2)}

${dbContext}

INSTRUCTIONS:
- Be warm, welcoming, and professional. Use emojis mostly.
- Use the provided CONTEXT to answer. If the information isn't there, politely say you don't know and provide the contact number (+233 27 993 1941).
- When mentioning facilities, encourage them to "Visit /services/halls" or "Book at /hall-booking" (use correct paths from context/common sense).
- Keep responses concise but informative.
- If asked about "latest" info, trust the "CURRENT DATABASE STATUS" section above as it is live data.
- Do not make up prices or facilities not listed.
- Format with bolding (**text**) for emphasis.

USER MESSAGE: "${message}"
`;

                const result = await model.generateContent(systemPrompt);
                const response = result.response.text();
                console.log("Gemini AI response generated successfully");

                return NextResponse.json({
                    response,
                    timestamp: new Date().toISOString()
                });

            } catch (aiError) {
                console.error("Gemini AI Error Detailed:", JSON.stringify(aiError, Object.getOwnPropertyNames(aiError)));
                // Fallthrough to fallback
            }
        } else {
            console.log("Gemini AI skipped. genAI initialized:", !!genAI, "Key starts with AIza:", process.env.GEMINI_API_KEY?.startsWith('AIza'));
        }

        // 2. Fallback if AI fails or not configured
        console.warn("Using fallback Chatbot logic");
        const fallbackResponse = await getFallbackResponse(message);
        return NextResponse.json({
            response: fallbackResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chatbot error:', error);
        return NextResponse.json(
            { error: 'Failed to process message' },
            { status: 500 }
        );
    }
}
