import Image from "next/image";
import { ShoppingBasket } from "lucide-react";

const products = [
  {
    id: 1,
    name: "HEATHER HONEY",
    price: "$10.00",
    description: "Premium natural honeycomb harvested from the finest fields, rich in flavor and nutrients.",
    image: "/honey_comb_transparent.png",
    isNew: false
  },
  {
    id: 2,
    name: "JARRAH HONEY",
    price: "$15.00",
    description: "Rare and potent honey with a unique dark amber color and high medicinal properties.",
    image: "/honey_jar_dark_transparent.png",
    isNew: true
  },
  {
    id: 3,
    name: "LINDEN HONEY",
    price: "$20.00",
    description: "Delicate and aromatic light honey with a subtle floral taste and creamy texture.",
    image: "/honey_jar_light_transparent.png",
    isNew: false
  }
];

export function FeaturedProducts() {
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
          {products.map((product) => (
            <div key={product.id} className="flex flex-col items-center text-center group">
              {/* Product Image Container */}
              <div className="relative w-full aspect-square mb-8 flex items-center justify-center">
                {product.isNew && (
                  <span className="absolute top-0 right-1/4 z-10 bg-[#eea000] text-white text-[10px] font-black px-2 py-0.5 rounded-sm shadow-sm">
                    NEW
                  </span>
                )}
                <div className="relative w-4/5 h-4/5 transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl">
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
                <h3 className="text-xl font-black text-[#1a1a1a] tracking-tight">
                  {product.name}
                </h3>
                <p className="text-[#eea000] font-bold text-lg">
                  {product.price}
                </p>
                <p className="text-gray-400 text-[13px] leading-relaxed max-w-[240px] mx-auto">
                  {product.description}
                </p>

                {/* Add to Cart Button */}
                <button className="flex items-center gap-2 mx-auto pt-4 text-[#1a1a1a] font-black text-[11px] uppercase tracking-widest hover:text-[#eea000] transition-colors group/btn">
                  <ShoppingBasket className="w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
