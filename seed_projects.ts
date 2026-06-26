import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const projects = [
    {
      title: "Green View Housing",
      slug: "green-view-housing",
      serviceType: "Residential",
      mainImage: "/construction/cons/project_1.jpeg",
      heroImage: "/construction/cons/project_1.jpeg",
      shortDescription: "This project reflects our commitment to quality construction, efficient project management, and sustainable practices.",
      status: "published"
    },
    {
      title: "Modern Office Complex",
      slug: "modern-office-complex",
      serviceType: "Commercial",
      mainImage: "/construction/cons/project_2.jpeg",
      heroImage: "/construction/cons/project_2.jpeg",
      shortDescription: "This project reflects our commitment to quality construction, efficient project management, and sustainable practices.",
      status: "published"
    },
    {
      title: "Industrial Warehouse",
      slug: "industrial-warehouse",
      serviceType: "Industrial",
      mainImage: "/construction/cons/project_3.jpeg",
      heroImage: "/construction/cons/project_3.jpeg",
      shortDescription: "This project reflects our commitment to quality construction, efficient project management, and sustainable practices.",
      status: "published"
    },
    {
      title: "Urban Architecture",
      slug: "urban-architecture",
      serviceType: "Construction",
      mainImage: "/construction/cons/project_4.jpeg",
      heroImage: "/construction/cons/project_4.jpeg",
      shortDescription: "This project reflects our commitment to quality construction, efficient project management, and sustainable practices.",
      status: "published"
    }
  ];

  for (const proj of projects) {
    await prisma.constructionProject.upsert({
      where: { slug: proj.slug },
      update: {},
      create: proj
    });
  }
  
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
