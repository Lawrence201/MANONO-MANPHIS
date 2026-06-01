const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ==========================================
// 1. BILLBOARDS
// ==========================================
const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "BB-";
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    code += "-";
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
};

const billboardCities = ['accra', 'kumasi', 'tema', 'takoradi'];
const billboardCategories = ['premium', 'standard', 'highway', 'transit'];
const billboardImages = [
  "https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555529771-835f59bfc50c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1533615705353-8344186ea33b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1601058268499-e52658b8ebf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
];

async function seedBillboards() {
  console.log("Starting seed for Billboards...");
  const billboards = Array.from({ length: 40 }).map((_, i) => ({
    name: `Premium Location ${i + 1}`,
    assetCode: generateCode(),
    category: billboardCategories[Math.floor(Math.random() * billboardCategories.length)],
    description: `A heavily trafficked digital screen located in ${billboardCities[i % billboardCities.length]}. Perfect for reaching a diverse audience.`,
    city: billboardCities[i % billboardCities.length],
    address: `${100 + i} Independence Ave, ${billboardCities[i % billboardCities.length]}`,
    latitude: String(5.6037 + (Math.random() * 0.1 - 0.05)),
    longitude: String(-0.1870 + (Math.random() * 0.1 - 0.05)),
    screenType: "led",
    resolution: "p6",
    dimensions: "12m x 4m",
    brightness: "6500 nits",
    aspectRatio: "landscape",
    wakeTime: "06:00",
    sleepTime: "00:00",
    maxSlots: 12,
    slotDuration: 10,
    weeklyRate: 2500 + Math.floor(Math.random() * 5000),
    taxRate: 5,
    minDuration: "1w",
    trafficVolume: "50,000+ vehicles/day",
    audienceTags: ["Business", "Youth", "Premium"],
    featureImage: billboardImages[i % billboardImages.length],
    videoShowcase: null
  }));

  for (const b of billboards) {
    await prisma.billboard.create({ data: b });
  }
  console.log('Successfully seeded 40 billboards!');
}

// ==========================================
// 2. BILLBOARD BOOKINGS
// ==========================================
async function seedBillboardBookings() {
  console.log("Fetching billboards to link bookings to...");
  const billboards = await prisma.billboard.findMany({
    select: { id: true, weeklyRate: true, taxRate: true }
  });

  if (billboards.length === 0) {
    console.error("No billboards found. Please seed billboards first.");
    return;
  }

  const bookings = [];
  const clientTypes = ["corporate", "agency", "individual"];
  const campaignTypes = ["awareness", "product_launch", "event", "promotion"];
  
  for (const billboard of billboards) {
    const numBookings = Math.floor(Math.random() * 3) + 2; // 2 to 4 bookings
    for (let i = 0; i < numBookings; i++) {
      const slots = Math.floor(Math.random() * 3) + 1; // 1 to 3 slots
      const durationWeeks = Math.floor(Math.random() * 4) + 1; // 1 to 4 weeks
      const wRate = Number(billboard.weeklyRate) || 1000;
      const tRate = Number(billboard.taxRate) || 5;
      
      const subtotal = wRate * slots * durationWeeks;
      const tax = (subtotal * tRate) / 100;
      const totalPrice = subtotal + tax;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + (Math.floor(Math.random() * 40) - 10));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (durationWeeks * 7));

      bookings.push({
        billboardId: billboard.id,
        fullName: `Client User ${billboard.id}-${i}`,
        email: `client${billboard.id}_${i}@example.com`,
        phone: "+233550000000",
        companyName: `Company Beta ${billboard.id}`,
        clientType: clientTypes[Math.floor(Math.random() * clientTypes.length)],
        campaignTitle: `Ad Campaign ${i + 1} for Billboard ${billboard.id}`,
        campaignType: campaignTypes[Math.floor(Math.random() * campaignTypes.length)],
        campaignDuration: durationWeeks,
        startDate: startDate,
        endDate: endDate,
        slotsRequested: slots,
        description: "Seeded approved booking for testing dashboard revenue and utilization.",
        totalPrice: totalPrice,
        taxRate: tRate,
        paymentMethod: "bank_transfer",
        status: "approved",
        paymentStatus: "paid"
      });
    }
  }

  console.log(`Generating ${bookings.length} approved bookings...`);
  let count = 0;
  for (const b of bookings) {
    await prisma.billboardBooking.create({ data: b });
    count++;
  }
  console.log(`Successfully seeded ${count} approved billboard bookings!`);
}

// ==========================================
// 3. HONEY PRODUCTS
// ==========================================
const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000);
const honeyCategories = ['organic', 'raw', 'processed', 'wild'];
const packagingTypes = ['bottle', 'bucket', 'drum', 'container'];
const honeyImages = [
  "https://images.unsplash.com/photo-1587049352847-4d4002ea9a0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1587049352851-8d4e89134a66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1610444371900-54a01c809623?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1614774351634-118fcbc68bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551608935-866409b30c45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
];

async function seedHoneyProducts() {
  console.log("Starting seed for Honey Products...");
  const products = Array.from({ length: 40 }).map((_, i) => {
    const name = `Premium Forest Honey ${i + 1}`;
    const category = honeyCategories[Math.floor(Math.random() * honeyCategories.length)];
    const pkgType = packagingTypes[Math.floor(Math.random() * packagingTypes.length)];
    
    return {
      name: name,
      slug: generateSlug(name),
      category: category,
      description: `A heavily requested ${category} honey harvested directly from premium apiaries. Perfect for food processing and retail.`,
      packagingType: pkgType,
      packagingSize: pkgType === 'bottle' ? "500ml" : pkgType === 'bucket' ? "20L" : "200L",
      moqValue: 50 + Math.floor(Math.random() * 100),
      moqUnit: "units",
      stockQuantity: 1000 + Math.floor(Math.random() * 5000),
      stockUnit: "liters",
      stockStatus: "in_stock",
      pricePerUnit: 25 + Math.floor(Math.random() * 50),
      priceUnitType: "per_liter",
      isExportReady: true,
      exportCountries: ["USA", "UK", "Canada", "Germany", "France"],
      shippingMethods: ["sea", "air"],
      isOrganic: true,
      certificates: ["https://example.com/fda_cert.pdf"],
      featureImage: honeyImages[i % honeyImages.length],
      videoShowcase: null,
      processingTime: "3-5 business days",
      warehouse: "accra_warehouse",
      status: "published"
    };
  });

  for (const p of products) {
    await prisma.product.create({ data: p });
  }
  console.log('Successfully seeded 40 Honey products!');
}

// ==========================================
// 4. HONEY ORDERS
// ==========================================
const generateRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

async function seedHoneyOrders() {
  console.log('Fetching Honey products to link orders...');
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'honey', mode: 'insensitive' } },
        { category: { in: ['raw', 'processed', 'organic', 'wild'] } }
      ]
    },
  });

  if (products.length === 0) {
    console.log('No honey products found! Please seed honey products first.');
    return;
  }

  const statuses = ['pending', 'approved', 'processing', 'shipped', 'delivered', 'paid'];
  const companies = ['Global Foods Inc', 'Natura Organics Ltd', 'EuroMarket SA', 'AfriTrade Group', 'Whole Foods Co', 'Healthy Living Distribution'];
  const countries = ['United States (US)', 'Germany (DE)', 'United Kingdom (GB)', 'France (FR)', 'Netherlands (NL)', 'Canada (CA)', 'China (CN)'];
  const shippingTypes = ['ocean_freight', 'air_freight', 'land_transport'];

  const orders = [];
  const totalOrders = 150;

  console.log(`Generating ${totalOrders} export orders for honey...`);

  for (let i = 1; i <= totalOrders; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = generateRandomDate(new Date(2025, 0, 1), new Date());
    
    let approvedAt = null;
    let processingAt = null;
    let shippedAt = null;
    let deliveredAt = null;

    if (['approved', 'processing', 'shipped', 'delivered', 'paid'].includes(status)) {
      approvedAt = new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 2);
    }
    if (['processing', 'shipped', 'delivered', 'paid'].includes(status)) {
      processingAt = new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 5);
    }
    if (['shipped', 'delivered', 'paid'].includes(status)) {
      shippedAt = new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 10);
    }
    if (['delivered', 'paid'].includes(status)) {
      deliveredAt = new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 25);
    }

    const qty = Math.floor(Math.random() * 50) + 10;
    const cost = qty * Number(product.pricePerUnit);

    orders.push({
      referenceNumber: `EXP-HONEY-${Math.floor(100000 + Math.random() * 900000)}-${i}`,
      productId: product.id,
      buyerType: 'wholesaler',
      companyName: companies[Math.floor(Math.random() * companies.length)],
      destinationCountry: countries[Math.floor(Math.random() * countries.length)],
      city: 'Metropolis',
      deliveryAddress: '123 Trade Street, Warehouse District',
      stateRegion: 'Central',
      postalCode: '10001',
      email: `buyer${i}@example.com`,
      phone: '+1 234 567 8900',
      taxId: `TAX-${Math.floor(1000 + Math.random() * 9000)}`,
      quantityRequested: qty,
      unitMeasurement: product.moqUnit || 'drums',
      totalEstimatedCost: cost,
      shippingType: shippingTypes[Math.floor(Math.random() * shippingTypes.length)],
      deliveryType: 'door_to_door',
      pickupOption: 'warehouse',
      preferredDate: new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0],
      deliveryPriority: 'standard',
      requiresFda: true,
      requiresPhyto: true,
      requiresOrganic: Math.random() > 0.5,
      requiresOrigin: true,
      customsValue: cost * 0.9,
      importRequirements: 'Standard food safety regulations apply.',
      paymentMethod: 'bank_transfer',
      depositRequired: '30%',
      billingAddress: '123 Trade Street, Warehouse District',
      status: status,
      createdAt: createdAt,
      updatedAt: new Date(),
      approvedAt: approvedAt,
      processingAt: processingAt,
      shippedAt: shippedAt,
      deliveredAt: deliveredAt,
    });
  }

  console.log('Inserting orders into database...');
  const created = await prisma.exportOrder.createMany({ data: orders });
  console.log(`Successfully inserted ${created.count} export orders.`);
}

// ==========================================
// EXECUTION PIPELINE
// ==========================================
async function main() {
  console.log("=== STARTING MASTER SEED PROCESS ===");
  await seedBillboards();
  await seedBillboardBookings();
  await seedHoneyProducts();
  await seedHoneyOrders();
  console.log("=== MASTER SEED PROCESS COMPLETED SUCCESSFULLY ===");
}

main()
  .catch((e) => {
    console.error("Master seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
