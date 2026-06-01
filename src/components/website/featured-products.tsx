import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const fallbackProducts = [
  {
    id: 1,
    name: "HEATHER HONEY",
    price: "GH₵ 10.00",
    description: "Premium natural honeycomb harvested from the finest fields, rich in flavor and nutrients.",
    image: "/honey_comb_transparent.png",
    isNew: false
  },
  {
    id: 2,
    name: "JARRAH HONEY",
    price: "GH₵ 15.00",
    description: "Rare and potent honey with a unique dark amber color and high medicinal properties.",
    image: "/honey_jar_dark_transparent.png",
    isNew: true
  },
  {
    id: 3,
    name: "LINDEN HONEY",
    price: "GH₵ 20.00",
    description: "Delicate and aromatic light honey with a subtle floral taste and creamy texture.",
    image: "/honey_jar_light_transparent.png",
    isNew: false
  }
];

export async function FeaturedProducts() {
  const dbProducts = await prisma.product.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  const now = new Date();
  
  const mappedProducts = dbProducts.map(p => {
    // Treat as "NEW" if created in the last 7 days
    const isNew = (now.getTime() - new Date(p.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
    
    return {
      id: p.id,
      name: p.name.toUpperCase(),
      price: (function() {
        const pricePerUnit = Number(p.pricePerUnit) || 0;
        let multiplier = 1;
        let pkgName = "Unit";
        
        if (p.packagingType === "drum" || p.packagingType?.toLowerCase().startsWith("dru")) pkgName = "Drum";
        else if (p.packagingType === "bucket") pkgName = "Bucket";
        else if (p.packagingType === "container") pkgName = "IBC Tote";
        else if (p.packagingType === "bottle") pkgName = "Bottle";
        else if (p.packagingType) pkgName = p.packagingType.charAt(0).toUpperCase() + p.packagingType.slice(1);
        
        if (p.priceUnitType === 'per_kg' && p.packagingSize) {
          const matchKg = p.packagingSize.match(/(\d+(?:\.\d+)?)kg/i);
          if (matchKg) multiplier = Number(matchKg[1]);
        } else if (p.priceUnitType === 'per_liter' && p.packagingSize) {
          const matchL = p.packagingSize.match(/(\d+(?:\.\d+)?)L/i);
          if (matchL) multiplier = Number(matchL[1]);
        }
        
        const finalPrice = pricePerUnit * multiplier;
        return `GH₵ ${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${pkgName}`;
      })(),
      description: p.description || "Premium natural product.",
      image: p.featureImage || "/honey_jar_dark_transparent.png",
      isNew
    };
  });

  const displayProducts = mappedProducts.length > 0 ? mappedProducts : fallbackProducts;

  return (
    <section className="py-24 bg-[#fdfaf7]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-[#1a1a1a] uppercase tracking-tight mb-6" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
            Our Products
          </h2>
          <p className="text-gray-500 text-[15px] max-w-2xl mx-auto leading-relaxed">
            Check out our online shop for premium honey varieties, organic supplements, 
            traditionally processed shea products, and more high-quality commodities.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {displayProducts.map((product) => (
            <div key={product.id} className="flex flex-col items-center text-center group">
              {/* Product Image Container */}
              <div className="relative w-full h-[220px] mb-5 flex items-center justify-center">
                {product.isNew && (
                  <span className="absolute top-0 right-4 z-10 bg-[#eea000] text-white text-[10px] font-black px-2 py-0.5 rounded-sm shadow-sm">
                    NEW
                  </span>
                )}
                <div className="relative w-[90%] h-[90%] transition-transform duration-500 group-hover:scale-105 drop-shadow-xl">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-[#1a1a1a] tracking-tight truncate w-full px-4">
                  {product.name}
                </h3>
                <p className="text-[#eea000] font-bold text-lg">
                  {product.price}
                </p>
                <p className="text-gray-400 text-[13px] leading-relaxed max-w-[240px] mx-auto line-clamp-3">
                  {product.description}
                </p>

                {/* View Details Button */}
                <div className="flex justify-center w-full pt-4">
                  <Link href={`/products/${product.id}`} className="inline-block">
                    <button className="flex items-center justify-center text-[#1a1a1a] font-black text-[11px] uppercase tracking-widest hover:text-[#eea000] transition-colors group/btn">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
