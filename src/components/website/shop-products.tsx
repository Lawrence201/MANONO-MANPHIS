import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Heart, Repeat, Eye, ChevronRight } from "lucide-react";

const shopProducts = [
  { 
    id: 1, 
    name: "HEATHER HONEY", 
    subtitle: "HEATHER HONEY",
    price: "$10.00", 
    description: "Premium natural honeycomb harvested from the finest fields, rich in flavor and nutrients.",
    image: "/product_honey_card.png",
    discount: "", 
    timer: "",
    tag: "NEW"
  },
  { 
    id: 2, 
    name: "JARRAH HONEY", 
    subtitle: "JARRAH HONEY",
    price: "$15.00", 
    description: "Rare and potent honey with a unique dark amber color and high medicinal properties.",
    image: "/product_honey_card.png",
    discount: "", 
    timer: ""
  },
  { 
    id: 3, 
    name: "LINDEN HONEY", 
    subtitle: "LINDEN HONEY",
    price: "$20.00", 
    description: "Delicate and aromatic light honey with a subtle floral taste and creamy texture.",
    image: "/product_honey_card.png",
    discount: "", 
    timer: ""
  }
];

export function ShopProducts() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-[42px] font-black text-[#1a1a1a] uppercase mb-6 tracking-tight leading-none">
            Our <span className="text-[#ffcc00]">Products</span>
          </h2>
          <p className="text-[#666] text-[15px] leading-relaxed">
            Check out our online shop for premium honey varieties, organic supplements, traditionally processed shea products, and more high-quality commodities.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shopProducts.map((p) => (
            <div key={p.id} className="group border border-gray-200 rounded-sm bg-white p-6 hover:shadow-2xl transition-all duration-500">
              {/* Image Area */}
              <div className="relative bg-[#f6f6f6] aspect-[4/5] rounded-sm mb-8 flex items-center justify-center p-12 overflow-hidden">
                <Image 
                  src={p.image} 
                  alt={p.name} 
                  width={220} 
                  height={220} 
                  className="object-contain group-hover:scale-110 transition-transform duration-700" 
                />
                
                {/* Tag Badge */}
                {p.tag && (
                  <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-black px-3 py-1 rounded-sm shadow-lg z-10">
                    {p.tag}
                  </div>
                )}

                {/* Quick Actions (Hover) */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 z-10">
                  {[Heart, Repeat, Eye].map((Icon, i) => (
                    <button key={i} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#ffcc00] hover:text-black transition-colors text-gray-400">
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="text-left">
                <p className="text-[#ffcc00] font-black text-[11px] uppercase tracking-[0.2em] mb-2">{p.subtitle}</p>
                <h3 className="text-[20px] font-black text-gray-900 leading-tight mb-3 hover:text-[#ffcc00] transition-colors">
                  {p.name}
                </h3>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[22px] font-black text-gray-900">{p.price}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-[#ffcc00] fill-[#ffcc00]" />
                    ))}
                  </div>
                </div>

                <p className="text-[#666] text-[14px] leading-relaxed mb-8 h-12 line-clamp-2">
                  {p.description}
                </p>

                {/* Action Button */}
                <button className="w-full bg-[#ffcc00] hover:bg-black hover:text-white text-black py-4 rounded-full text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="mt-16 text-center">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-4 text-[13px] font-black uppercase tracking-widest text-gray-900 hover:text-[#ffcc00] transition-colors"
          >
            Discover More Products <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
