import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const services = [
  {
    title: "Residential Construction",
    slug: "residential-construction",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-[#FFD100]"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/></svg>`,
    shortDescription: "We build strong, modern, and comfortable homes designed to match your lifestyle and budget.",
    features: ["Custom home building", "Modern housing solutions", "Quality finishing work"],
    heroImage: "/construction/cons/residential_1.jpeg",
    mainImage: "/construction/cons/residential_1.jpeg",
    accomplishedTitle: "Building Dream Homes Across the Country",
    accomplishedDescription: "Over the past decade, we have successfully completed hundreds of residential projects, ranging from cozy family homes to expansive luxury estates. We pride ourselves on turning our clients' visions into beautiful, enduring realities.",
    accomplishedQuote: "\"A home should be a reflection of who you are, built with care and precision.\"",
    overviewTitle: "Residential Construction Services",
    overviewDescription: "Our residential construction services cover every aspect of home building. From laying the foundation to the final coat of paint, we ensure top-tier quality and adherence to safety standards, making sure your home is safe and comfortable.",
    highlightFeatures: ["Energy-efficient designs", "Premium materials", "On-time project delivery", "Transparent pricing"],
    theResults: ["Increased property value", "Enhanced living comfort", "Durable structures", "Beautiful aesthetics"],
    status: "published",
    subServices: [
      { title: "Quality Workmanship", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "Award" },
      { title: "Project Management", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "Briefcase" },
      { title: "Certified Professionals", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "UserCheck" }
    ]
  },
  {
    title: "Commercial Construction",
    slug: "commercial-construction",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512" fill="none" className="w-8 h-8 text-[#FFD100]">
          <path d="M213.333 298.667V0H53.3333C23.936 0 0 23.9147 0 53.3333V458.667C0 488.085 23.936 512 53.3333 512H458.667C488.085 512 512 488.085 512 458.667V298.667H213.333ZM490.667 458.667C490.667 476.309 476.309 490.667 458.667 490.667H53.3333C35.6907 490.667 21.3333 476.309 21.3333 458.667V53.3333C21.3333 35.6907 35.6907 21.3333 53.3333 21.3333H192V85.3333H106.667V106.667H192V192H106.667V213.333H192V298.667H106.667V320H192V405.333H213.333V320H298.667V405.333H320V320H405.333V405.333H426.667V320H490.667V458.667Z" fill="currentColor"></path>
        </svg>`,
    shortDescription: "We deliver durable and functional buildings for business and commercial use.",
    features: ["Office buildings", "Shops and retail spaces", "Warehouses and facilities"],
    heroImage: "/construction/cons/commercial.jpeg",
    mainImage: "/construction/cons/commercial.jpeg",
    accomplishedTitle: "Empowering Businesses with Solid Foundations",
    accomplishedDescription: "We have partnered with leading enterprises to build commercial hubs that foster productivity and growth. From modern office spaces to robust warehouses, our work supports business operations locally and globally.",
    accomplishedQuote: "\"A strong business needs a strong foundation and a functional space to thrive.\"",
    overviewTitle: "Commercial Construction Solutions",
    overviewDescription: "We handle commercial construction projects of all sizes. Our team works closely with your business to ensure minimal disruption during construction while delivering a facility that meets all regulatory and industry-specific requirements.",
    highlightFeatures: ["Scalable space designs", "Corporate identity integration", "Advanced security features", "Sustainable infrastructure"],
    theResults: ["Enhanced brand image", "Optimized workspace efficiency", "Long-term durability", "Compliance with building codes"],
    status: "published",
    subServices: [
      { title: "Quality Workmanship", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "Award" },
      { title: "Project Management", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "Briefcase" },
      { title: "Certified Professionals", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "UserCheck" }
    ]
  },
  {
    title: "Planning, Design & Build",
    slug: "planning-design-and-build",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-[#FFD100]"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 6-6h0"/><path d="M14 6h0a6 6 0 0 1 6 6v3"/></svg>`,
    shortDescription: "We handle everything from concept to completion with professional planning and execution.",
    features: ["Architectural planning", "Structural design support", "Full project execution"],
    heroImage: "/construction/cons/planing.jpeg",
    mainImage: "/construction/cons/planing.jpeg",
    accomplishedTitle: "From Vision to Reality",
    accomplishedDescription: "Our comprehensive design and build approach ensures seamless communication between architects, engineers, and construction teams. We streamline the entire process to save time, reduce costs, and eliminate unnecessary hurdles.",
    accomplishedQuote: "\"Good planning is the bridge between a brilliant idea and a successful outcome.\"",
    overviewTitle: "End-to-End Project Delivery",
    overviewDescription: "We take full accountability for your project from the initial blueprints to the final handover. By managing both the design and construction phases, we guarantee that the final build matches the envisioned design flawlessly.",
    highlightFeatures: ["Unified team workflow", "Cost control & estimation", "Rapid deployment", "Architectural drafting"],
    theResults: ["Faster completion times", "Reduced overall costs", "No design-to-build discrepancies", "Stress-free client experience"],
    status: "published",
    subServices: [
      { title: "Quality Workmanship", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "Award" },
      { title: "Project Management", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "Briefcase" },
      { title: "Certified Professionals", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "UserCheck" }
    ]
  },
  {
    title: "Renovation & Remodeling",
    slug: "renovation-and-remodeling",
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-[#FFD100]"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    shortDescription: "We upgrade and transform old buildings into modern and improved spaces.",
    features: ["Home renovations", "Office remodeling", "Structural improvements"],
    heroImage: "/construction/cons/remodeling.jpeg",
    mainImage: "/construction/cons/remodeling.jpeg",
    accomplishedTitle: "Breathing New Life into Old Spaces",
    accomplishedDescription: "Whether it's restoring a historic building or modernizing an outdated kitchen, our renovation team has the expertise to completely revitalize any space. We respect the original structure while injecting modern functionality and aesthetics.",
    accomplishedQuote: "\"A well-executed renovation does more than just fix—it transforms.\"",
    overviewTitle: "Expert Remodeling Services",
    overviewDescription: "We offer comprehensive remodeling services for both residential and commercial clients. We assess the structural integrity, optimize the layout, and deploy modern finishes to give your property a completely new and improved feel.",
    highlightFeatures: ["Structural repairs", "Interior redesigns", "Modern fixture upgrades", "Space optimization"],
    theResults: ["Extended property lifespan", "Modernized aesthetic", "Improved functionality", "High return on investment"],
    status: "published",
    subServices: [
      { title: "Quality Workmanship", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "Award" },
      { title: "Project Management", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "Briefcase" },
      { title: "Certified Professionals", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "UserCheck" }
    ]
  }
];

async function main() {
  console.log("Starting seeding of construction services...");
  
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
  
  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
