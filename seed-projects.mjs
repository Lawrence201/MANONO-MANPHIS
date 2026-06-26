import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const projects = [
  {
    title: "Oceanview Residences",
    slug: "oceanview-residences",
    heroImage: "/construction/project_6.jpg",
    mainImage: "/construction/post_01.jpg",
    shortDescription: "This project reflects our commitment to quality construction, efficient project management, and sustainable building practices.",
    clientName: "Brickz Limited",
    serviceType: "Residential Construction",
    projectDate: "February 24, 2026",
    websiteUrl: "https://example.com/oceanview",
    accomplishedTitle: "Setting a New Standard for Coastal Living",
    accomplishedDescription: "We successfully delivered a state-of-the-art residential complex that blends modern aesthetics with rugged durability to withstand coastal weather. The project was completed two weeks ahead of schedule while remaining under budget.",
    accomplishedQuote: "The attention to detail and proactive problem-solving from the team was unmatched. Oceanview is exactly what we envisioned.",
    overviewTitle: "Project Overview",
    overviewDescription: "Oceanview Residences required a careful balance of luxury finishes and robust engineering. The 50-unit complex includes underground parking, a rooftop infinity pool, and smart-home integration in every unit.",
    highlightFeatures: [
      "Sustainable energy integration with rooftop solar panels",
      "Smart home automation systems in all units",
      "Custom Italian marble finishes in lobbies",
      "Hurricane-resistant impact glass throughout"
    ],
    theResults: [
      "100% occupancy within 3 months of completion",
      "Awarded 'Best Residential Development 2026'",
      "Energy costs reduced by 30% compared to traditional builds"
    ],
    status: "published"
  },
  {
    title: "Shapla Housing",
    slug: "shapla-housing",
    heroImage: "/construction/product_1.jpg",
    mainImage: "/construction/product_1.jpg",
    shortDescription: "An affordable housing initiative designed to provide high-quality living spaces for middle-income families.",
    clientName: "Metro Development Group",
    serviceType: "Urban Development",
    projectDate: "November 15, 2025",
    websiteUrl: "https://example.com/shapla",
    accomplishedTitle: "Community-Centric Affordable Housing",
    accomplishedDescription: "Shapla Housing was built with the community in mind, providing 200 affordable units alongside green spaces, playgrounds, and a community center.",
    accomplishedQuote: "A fantastic initiative that brought high-quality construction to affordable housing.",
    overviewTitle: "Project Overview",
    overviewDescription: "The development spans 5 acres and focuses on maximizing space efficiency without compromising on living quality. Prefabricated materials were used to speed up construction and lower costs.",
    highlightFeatures: [
      "Use of eco-friendly, locally sourced materials",
      "Integrated community parks and recreational areas",
      "Energy-efficient LED lighting across the complex"
    ],
    theResults: [
      "Completed 1 month ahead of schedule",
      "Provided housing for over 200 families",
      "Recognized by the city council for urban excellence"
    ],
    status: "published"
  },
  {
    title: "Integrity Build",
    slug: "integrity-build",
    heroImage: "/construction/project_2.jpg",
    mainImage: "/construction/project_2.jpg",
    shortDescription: "A cutting-edge commercial office space tailored for tech startups and modern enterprises.",
    clientName: "TechHub Ventures",
    serviceType: "Commercial Construction",
    projectDate: "January 10, 2026",
    websiteUrl: "https://example.com/integrity",
    accomplishedTitle: "Designing the Workspace of Tomorrow",
    accomplishedDescription: "We constructed a 5-story commercial building featuring open-plan layouts, collaborative zones, and high-speed fiber optic infrastructure.",
    accomplishedQuote: "The perfect environment for our tech startups to thrive.",
    overviewTitle: "Project Overview",
    overviewDescription: "Integrity Build was designed to foster innovation. The building includes multiple breakout rooms, a central atrium for natural light, and a state-of-the-art HVAC system for optimal air quality.",
    highlightFeatures: [
      "Biophilic design elements with living green walls",
      "High-speed digital infrastructure built-in",
      "Flexible office layouts with modular partitions"
    ],
    theResults: [
      "Leased to 100% capacity before opening",
      "LEED Gold Certified for environmental sustainability",
      "Increased tenant satisfaction scores by 40%"
    ],
    status: "published"
  },
  {
    title: "Modern Villa",
    slug: "modern-villa",
    heroImage: "/construction/project_3.jpg",
    mainImage: "/construction/project_3.jpg",
    shortDescription: "A luxurious private residence featuring minimalist architecture and panoramic views.",
    clientName: "Private Client",
    serviceType: "Custom Home Building",
    projectDate: "August 22, 2025",
    websiteUrl: "",
    accomplishedTitle: "Minimalist Luxury Realized",
    accomplishedDescription: "This custom-built villa combines expansive glass facades with raw concrete and warm timber to create a stunning architectural masterpiece.",
    accomplishedQuote: "They turned our dream home into a reality with breathtaking precision.",
    overviewTitle: "Project Overview",
    overviewDescription: "The 8,000 sq ft villa includes an infinity edge pool, a private cinema, and a climate-controlled wine cellar. The challenging hillside terrain required extensive retaining walls and foundational engineering.",
    highlightFeatures: [
      "Floor-to-ceiling retractable glass walls",
      "Custom infinity edge pool overlooking the valley",
      "Fully integrated smart home environment"
    ],
    theResults: [
      "Featured in 'Modern Architecture Digest'",
      "Achieved net-zero energy rating",
      "Flawless execution of complex hillside foundation"
    ],
    status: "published"
  },
  {
    title: "Skyline Tower",
    slug: "skyline-tower",
    heroImage: "/construction/project_4.jpg",
    mainImage: "/construction/project_4.jpg",
    shortDescription: "A mixed-use high-rise combining premium retail space with luxury penthouses.",
    clientName: "Horizon Properties",
    serviceType: "High-Rise Construction",
    projectDate: "March 05, 2026",
    websiteUrl: "https://example.com/skyline",
    accomplishedTitle: "Redefining the City Skyline",
    accomplishedDescription: "Skyline Tower is a 40-story landmark building that seamlessly integrates commercial retail on the lower floors with exclusive residential units above.",
    accomplishedQuote: "A monumental achievement in urban high-rise construction.",
    overviewTitle: "Project Overview",
    overviewDescription: "Constructing in the heart of a busy downtown area presented significant logistical challenges. We utilized advanced crane systems and just-in-time delivery to minimize disruption while building this iconic tower.",
    highlightFeatures: [
      "Seismic-resistant structural engineering",
      "Multi-story glass atrium in the retail lobby",
      "High-speed regenerative drive elevators"
    ],
    theResults: [
      "Safely completed with zero lost-time incidents",
      "Retail spaces secured premium anchor tenants",
      "Iconic architectural lighting system installed"
    ],
    status: "published"
  },
  {
    title: "Urban Oasis",
    slug: "urban-oasis",
    heroImage: "/construction/project_5.jpg",
    mainImage: "/construction/project_5.jpg",
    shortDescription: "A comprehensive renovation of a historic city park and public recreational facility.",
    clientName: "City Department of Parks",
    serviceType: "Public Infrastructure",
    projectDate: "May 18, 2025",
    websiteUrl: "",
    accomplishedTitle: "Revitalizing Public Spaces",
    accomplishedDescription: "We transformed an aging public park into a vibrant Urban Oasis featuring modern playgrounds, an amphitheater, and sustainable landscaping.",
    accomplishedQuote: "The transformation is incredible; the park is now the heart of our city.",
    overviewTitle: "Project Overview",
    overviewDescription: "The project required careful preservation of historic trees while installing new water features, walking paths, and a state-of-the-art outdoor performance stage.",
    highlightFeatures: [
      "Preservation of century-old oak trees",
      "Installation of a recycled water irrigation system",
      "Construction of an acoustically engineered amphitheater"
    ],
    theResults: [
      "Park attendance increased by 300%",
      "Won the 'Civic Improvement Award'",
      "Created a safe, accessible environment for all ages"
    ],
    status: "published"
  }
];

async function main() {
  console.log("Starting seeding projects...");
  for (const p of projects) {
    const existing = await prisma.constructionProject.findUnique({
      where: { slug: p.slug }
    });
    if (!existing) {
      await prisma.constructionProject.create({
        data: p
      });
      console.log(`Created project: ${p.title}`);
    } else {
      console.log(`Project already exists: ${p.title}`);
    }
  }
  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
