import Image from "next/image";
import Link from "next/link";
import { Phone, CheckCircle2, Clock, Star, ArrowRight, MapPin, Monitor, Calendar, DollarSign, MousePointerClick } from "lucide-react";

interface ProductSpec {
  label: string;
  value: string;
}

interface ProductItem {
  id: number | string;
  name: string;
  subtitle: string;
  image: string;
  price: string;
  specs: ProductSpec[];
  location: string;
  supplier: string;
  years: string;
  rating: number;
}

interface ProductsGridProps {
  type?: "products" | "billboards";
  title?: string;
  subtitle?: string;
  showViewMore?: boolean;
  items?: ProductItem[];
}

const agriculturalProducts = [
  {
    id: 1,
    name: "HEATHER HONEY",
    subtitle: "HEATHER HONEY",
    image: "/product_honey_card.png",
    price: "$10.00",
    specs: [
      { label: "Type", value: "Premium Raw" },
      { label: "Origin", value: "Ghana" },
      { label: "Grade", value: "Organic" },
      { label: "Brand", value: "Manono" }
    ],
    description: "Premium natural honeycomb harvested from the finest fields, rich in flavor and nutrients.",
    location: "Accra, Ghana",
    supplier: "Manono Manphis",
    years: "NEW",
    rating: 5.0
  },
  {
    id: 2,
    name: "JARRAH HONEY",
    subtitle: "JARRAH HONEY",
    image: "/product_honey_card.png",
    price: "$15.00",
    specs: [
      { label: "Type", value: "Rare Medicinal" },
      { label: "Origin", value: "Ghana" },
      { label: "Color", value: "Dark Amber" },
      { label: "Brand", value: "Manono" }
    ],
    description: "Rare and potent honey with a unique dark amber color and high medicinal properties.",
    location: "Accra, Ghana",
    supplier: "Manono Manphis",
    years: "10 yrs",
    rating: 4.9
  },
  {
    id: 3,
    name: "LINDEN HONEY",
    subtitle: "LINDEN HONEY",
    image: "/product_honey_card.png",
    price: "$20.00",
    specs: [
      { label: "Type", value: "Aromatic Light" },
      { label: "Origin", value: "Ghana" },
      { label: "Texture", value: "Creamy" },
      { label: "Brand", value: "Manono" }
    ],
    description: "Delicate and aromatic light honey with a subtle floral taste and creamy texture.",
    location: "Accra, Ghana",
    supplier: "Manono Manphis",
    years: "15 yrs",
    rating: 4.8
  }
];

const billboardSlots = [
  {
    id: 1,
    name: "Main City Center LED",
    subtitle: "High Visibility Screen",
    image: "/billboards/bill_boards1.webp",
    price: "From $1,200",
    specs: [
      { label: "Location", value: "Accra Central" },
      { label: "Duration", value: "1 Week Slot" },
      { label: "Traffic", value: "50k+ Daily" },
      { label: "Type", value: "Digital LED" }
    ],
    location: "Accra Central, Ghana",
    supplier: "Media Division",
    years: "Premium",
    rating: 5.0
  },
  {
    id: 2,
    name: "Airport Arrival Digital",
    subtitle: "Elite Audience Reach",
    image: "/billboards/bill_boards_2.webp",
    price: "From $2,500",
    specs: [
      { label: "Location", value: "KIA Terminal 3" },
      { label: "Duration", value: "2 Weeks Slot" },
      { label: "Traffic", value: "International" },
      { label: "Type", value: "4K Display" }
    ],
    location: "Airport, Accra",
    supplier: "Media Division",
    years: "Exclusive",
    rating: 4.9
  },
  {
    id: 3,
    name: "Motorway Giant Board",
    subtitle: "Mass Market Exposure",
    image: "/billboards/bill_boards 3.webp",
    price: "From $3,000",
    specs: [
      { label: "Location", value: "Tema Motorway" },
      { label: "Duration", value: "1 Month Slot" },
      { label: "Traffic", value: "100k+ Daily" },
      { label: "Type", value: "Portrait LED" }
    ],
    location: "Tema Highway, Ghana",
    supplier: "Media Division",
    years: "Strategic",
    rating: 4.8
  }
];

export function ProductsGrid({ 
  type = "products", 
  title, 
  subtitle, 
  showViewMore = true, 
  items: customItems 
}: ProductsGridProps) {
  const defaultItems = type === "products" ? agriculturalProducts : billboardSlots;
  const items: ProductItem[] = customItems || (defaultItems as ProductItem[]);
  const currentTitle = title || "Available Product";
  const currentSubtitle = subtitle || "Check out our online shop for premium honey varieties, organic supplements, traditionally processed shea products, and more high-quality commodities.";

  return (
    <section className={`py-24 ${type === "products" ? "bg-[#f7f3f0]" : "bg-white"}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <p className="text-[#eea000] font-bold tracking-[0.3em] text-[12px] uppercase mb-6">Catalog</p>
          <h2 className="text-[42px] font-black text-[#1a1a1a] uppercase leading-none mb-6">
            Available <span className="text-[#eea000]">Product</span>
          </h2>
          <p className="text-gray-500 text-[15px] leading-relaxed">
            {currentSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100 flex flex-col">
              {/* Image */}
              <div className="relative h-48 overflow-hidden group">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {type === "billboards" && (
                  <div className="absolute top-4 right-4 bg-[#eea000] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Available
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-[#1a1a1a] leading-tight mb-0.5">{item.name}</h3>
                  <p className="text-gray-400 font-medium text-[11px] uppercase tracking-wider">{item.subtitle}</p>
                </div>
                
                <div className="mb-4">
                  <span className="text-xl font-black text-[#1a1a1a]">{item.price}</span>
                </div>

                {type === "billboards" ? (
                  <Link href="/products/13" className="block w-full">
                    <button className="w-full bg-[#cbc9c5] text-[#1a1a1a] py-2.5 font-bold text-[12px] uppercase hover:bg-[#eea000] hover:text-white transition-all rounded-md mb-4 shadow-sm flex items-center justify-center gap-2">
                      Advertising this request slot
                      <MousePointerClick className="w-4 h-4" />
                    </button>
                  </Link>
                ) : (
                  <button className="w-full bg-[#eea000]/90 text-white py-2.5 font-bold text-[12px] uppercase hover:bg-[#eea000] transition-all rounded-md mb-4 shadow-sm flex items-center justify-center gap-2">
                    Add to Cart
                  </button>
                )}

                {/* Specs Table */}
                <div className="rounded-md overflow-hidden mb-4 border border-gray-50 text-[11px]">
                  {item.specs.map((spec, i) => (
                    <div key={i} className={`flex justify-between items-center px-3 py-1.5 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2">
                        {type === "billboards" && (
                          spec.label === "Location" ? <MapPin className="w-3 h-3 text-[#eea000]" /> :
                          spec.label === "Duration" ? <Calendar className="w-3 h-3 text-[#eea000]" /> :
                          spec.label === "Traffic" ? <Monitor className="w-3 h-3 text-[#eea000]" /> :
                          <Clock className="w-3 h-3 text-[#eea000]" />
                        )}
                        <span className="text-gray-400">{spec.label}</span>
                      </div>
                      <span className="text-[#1a1a1a] font-bold">{spec.value}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="space-y-3 pt-1 mt-auto">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-[#eea000] shrink-0" />
                    <span className="text-[#1a1a1a] font-bold text-[12px] truncate">{item.location}</span>
                  </div>

                  <div className="flex items-center gap-3 border-t border-gray-50 pt-3">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#66a7fb]" />
                      <span className="text-[9px] text-gray-400 font-bold uppercase">Verified</span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <Star className="w-3 h-3 text-[#fbbf24] fill-[#fbbf24]" />
                      <span className="text-[10px] font-bold text-[#1a1a1a]">{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-gray-400 font-bold uppercase">{item.years}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        {showViewMore && (
          <div className="mt-20 text-center">
            <Link 
              href="#" 
              className="inline-flex items-center gap-3 border-2 border-[#1a1a1a] text-[#1a1a1a] px-10 py-4 rounded-full font-bold text-[14px] uppercase hover:bg-[#1a1a1a] hover:text-white transition-all group"
            >
              {type === "products" ? "Discover More Products" : "Explore More Slots"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
