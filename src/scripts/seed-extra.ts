import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const services = [
  {
    title: "Project Management",
    slug: "project-management",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-[#FFD100]"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`, // Lucide Building
    shortDescription: "Expert oversight and coordination to ensure your project is completed on time and within budget.",
    features: ["Resource planning", "Timeline management", "Quality control"],
    heroImage: "/construction/slider_1.jpg",
    mainImage: "/construction/slider_1.jpg",
    accomplishedTitle: "Delivering Excellence on Every Timeline",
    accomplishedDescription: "We have successfully managed multi-million dollar projects from inception to handover. By utilizing cutting-edge project management tools and methodologies, we ensure that every stakeholder is aligned and every milestone is met without compromising on quality or safety.",
    accomplishedQuote: "\"True project management is about anticipating challenges before they arise and having the strategy to overcome them.\"",
    overviewTitle: "Comprehensive Construction Management",
    overviewDescription: "Our project management services cover the full lifecycle of construction. We act as your primary representative on-site, overseeing contractors, managing procurement, enforcing safety standards, and ensuring strict adherence to the project schedule and budget.",
    highlightFeatures: ["Real-time budget tracking", "Risk mitigation", "Subcontractor coordination", "Compliance management"],
    theResults: ["On-time delivery", "Zero budget overruns", "High safety ratings", "Seamless communication"],
    status: "published",
    subServices: [
      { title: "Quality Workmanship", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "Award" },
      { title: "Project Management", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "Briefcase" },
      { title: "Certified Professionals", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "UserCheck" }
    ]
  },
  {
    title: "Custom Home Building",
    slug: "custom-home-building",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-[#FFD100]"><path d="m11.47 17.47 3.53-3.53a5.53 5.53 0 0 0-7.82-7.82l-5.83 5.83a5.53 5.53 0 0 0 7.82 7.82l3.53-3.53Z"/><path d="m15 9 5.83-5.83a5.53 5.53 0 0 1 7.82 7.82l-5.83 5.83a5.53 5.53 0 0 1-7.82-7.82Z"/><path d="M15 9l-3.53 3.53"/><path d="M12 12l-3.53 3.53"/></svg>`, // Lucide Tractor (fallback to linked rings or something similar, actually let's use Tractor SVG)
    // Here is Lucide Tractor exact path:
    /* iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-[#FFD100]"><path d="m10 11 11 .9c.6 0 .9.5.8 1.1l-.8 5h-1"/><path d="M16 18h-5"/><path d="M18 5a1 1 0 0 0-1 1v5.573"/><path d="M3 4h9l1 7.246"/><path d="M4 11V4"/><path d="M7 15h.01"/><path d="M8 10.1V4"/><circle cx="18" cy="18" r="2"/><circle cx="7" cy="15" r="5"/></svg>`, */
    shortDescription: "Working closely with you to design and construct a home that perfectly fits your unique requirements.",
    features: ["Personalized design", "Premium materials", "Expert craftsmanship"],
    heroImage: "/construction/slider_1.jpg",
    mainImage: "/construction/slider_1.jpg",
    accomplishedTitle: "Crafting Unique Spaces for Unique Families",
    accomplishedDescription: "Over the years, we have brought countless dream homes to life. We specialize in bespoke architecture and custom layouts that cater directly to the specific lifestyle needs of our clients, ensuring that every corner of the home feels uniquely theirs.",
    accomplishedQuote: "\"Your home should be as unique as your fingerprint, built exactly the way you've always imagined.\"",
    overviewTitle: "Bespoke Home Construction",
    overviewDescription: "From the initial sketch to the final walk-through, our custom home building service is a collaborative journey. We integrate your personal style with our structural expertise, offering endless customization options for layouts, materials, and smart home integrations.",
    highlightFeatures: ["Fully custom floor plans", "Luxury material sourcing", "Smart home integrations", "Sustainable living options"],
    theResults: ["A home that reflects you", "High resale value", "Optimized living spaces", "Energy efficiency"],
    status: "published",
    subServices: [
      { title: "Quality Workmanship", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "Award" },
      { title: "Project Management", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "Briefcase" },
      { title: "Certified Professionals", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "UserCheck" }
    ]
  }
];

// Fix Tractor SVG correctly
services[1].iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-[#FFD100]"><path d="m10 11 11 .9c.6 0 .9.5.8 1.1l-.8 5h-1"/><path d="M16 18h-5"/><path d="M18 5a1 1 0 0 0-1 1v5.573"/><path d="M3 4h9l1 7.246"/><path d="M4 11V4"/><path d="M7 15h.01"/><path d="M8 10.1V4"/><circle cx="18" cy="18" r="2"/><circle cx="7" cy="15" r="5"/></svg>`;


async function main() {
  console.log("Starting seeding of extra construction services...");
  
  for (const service of services) {
    const exists = await prisma.constructionService.findUnique({
      where: { slug: service.slug }
    });
    
    if (!exists) {
      await prisma.constructionService.create({
        data: service
      });
      console.log(`Created service: ${service.title}`);
    } else {
      console.log(`Service already exists: ${service.title}`);
    }
  }
  
  console.log("Extra seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
