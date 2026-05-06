import Image from "next/image";
import { ShoppingCart, Star, Heart, Repeat, Eye, Clock } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Premium Raw Cashew Nuts | Grade W320 Export Quality",
    price: "$20",
    oldPrice: "$24",
    discount: "-16%",
    timer: "299d : 13h : 55m : 52s",
    image: "/product_cashew_card.png",
    rating: 5,
    subtitle: "RAW CASHEWS"
  },
  {
    id: 2,
    name: "Roasted Jumbo Cashews | Sea Salted & Crunchy",
    price: "$25",
    oldPrice: "$30",
    discount: "-15%",
    timer: "238d : 13h : 55m : 52s",
    image: "/product_cashew_card.png",
    rating: 4,
    subtitle: "ROASTED CASHEWS"
  },
  {
    id: 3,
    name: "Organic Cashew Butter | 100% Pure & Unprocessed",
    price: "$32",
    oldPrice: "$34",
    discount: "-6%",
    timer: "225d : 13h : 55m : 52s",
    image: "/product_cashew_card.png",
    rating: 5,
    subtitle: "CASHEW SPREAD"
  }
];

const categories = [
  { name: "Our Store", count: 20 },
  { name: "Raw Cashews", count: 16 },
  { name: "Roasted Cashews", count: 14 },
  { name: "Cashew Butter", count: 15 },
  { name: "Organic Cashews", count: 15 },
];

export function CashewProducts() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <div className="space-y-10">
              {/* Categories */}
              <div>
                <h4 className="text-[18px] font-black text-[#1a1a1a] uppercase tracking-wider mb-6 pb-2 border-b-2 border-[#ffcc00] inline-block">
                  Shop By Categories
                </h4>
                <ul className="space-y-4">
                  {categories.map((cat) => (
                    <li key={cat.name} className="flex justify-between items-center group cursor-pointer">
                      <span className="text-gray-600 font-bold text-[14px] group-hover:text-[#ffcc00] transition-colors uppercase tracking-wide">
                        {cat.name}
                      </span>
                      <span className="text-gray-400 text-[13px]">({cat.count})</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Filter Placeholder */}
              <div>
                <h4 className="text-[18px] font-black text-[#1a1a1a] uppercase tracking-wider mb-6 pb-2 border-b-2 border-[#ffcc00] inline-block">
                  Filter By Weight
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["250g", "500g", "1kg", "2kg"].map((w) => (
                    <button key={w} className="px-4 py-2 border border-gray-200 text-[11px] font-black uppercase tracking-widest hover:border-[#ffcc00] hover:bg-[#ffcc00] hover:text-black transition-all rounded-sm">
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-100">
              <p className="text-gray-400 text-[13px] font-bold uppercase tracking-widest">
                Showing 1–3 of 20 results
              </p>
              <div className="flex items-center gap-4 text-[13px] font-bold text-[#1a1a1a] uppercase tracking-widest cursor-pointer hover:text-[#ffcc00]">
                Default sorting <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group border border-gray-100 rounded-sm bg-white p-5 hover:shadow-2xl transition-all duration-500 flex flex-col">
                  {/* Image Area */}
                  <div className="relative bg-[#f6f6f6] aspect-square rounded-sm mb-6 flex items-center justify-center p-8 overflow-hidden">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      width={200} 
                      height={200} 
                      className="object-contain group-hover:scale-110 transition-transform duration-700" 
                    />
                    
                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4 bg-[#ffcc00] text-black text-[11px] font-black px-3 py-1 rounded-sm shadow-lg z-10">
                      {product.discount}
                    </div>

                    {/* Timer Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm py-2 px-3 rounded-sm flex items-center justify-center gap-2 shadow-sm translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <Clock className="w-3.5 h-3.5 text-[#ffcc00]" />
                      <span className="text-[10px] font-black text-[#1a1a1a] tracking-wider">{product.timer}</span>
                    </div>

                    {/* Quick Actions (Hover) */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 z-10">
                      {[Heart, Repeat, Eye].map((Icon, i) => (
                        <button key={i} className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#ffcc00] hover:text-black transition-colors text-gray-400">
                          <Icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <p className="text-[#ffcc00] font-black text-[10px] uppercase tracking-[0.2em] mb-2">{product.subtitle}</p>
                    <h3 className="text-[16px] font-black text-gray-900 leading-tight mb-3 hover:text-[#ffcc00] transition-colors h-12 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < product.rating ? "text-[#ffcc00] fill-[#ffcc00]" : "text-gray-200"}`} />
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-[20px] font-black text-gray-900">{product.price}</span>
                        <span className="text-gray-400 text-[14px] line-through font-bold">{product.oldPrice}</span>
                      </div>

                      <button className="w-full bg-[#ffcc00] hover:bg-black hover:text-white text-black py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300">
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
