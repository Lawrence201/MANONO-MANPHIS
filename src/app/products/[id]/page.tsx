"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Star, 
  Heart, 
  Repeat, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Minus, 
  Plus, 
  ShoppingCart,
  ChevronRight,
  Home,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Eye,
  MessageSquare,
  MessageCircle,
  Share2 as Share
} from "lucide-react";
import { TopBar } from "@/components/website/top-bar";
import { WebsiteHeader } from "@/components/website/header";
import { WebsiteFooter } from "@/components/website/footer";
import { ProductsHero } from "@/components/website/products-hero";

const products = [
  {
    id: 1,
    name: "24 Mantra Organic 100% Pure & RAW Honey | Zero Added Sugar",
    price: "$18.00 - $20.00",
    rating: 5,
    reviews: 12,
    sku: "AMD-PSJ-958",
    image: "/product_honey_card.png",
    category: "Organic Honey",
    tags: ["Organic", "Raw", "Natural"],
    description: "Our 24 Mantra Organic Honey is 100% pure, natural and organic. It is sourced from the finest organic farms and is free from any added sugar or preservatives. Perfect for a healthy lifestyle.",
    fullDescription: "Organic honey is honey that is produced, processed, and packaged according to organic standards. These standards are meant to ensure that the honey is free from synthetic chemicals, pesticides, and other contaminants. Organic honey is produced by bees that have been fed on nectar from plants that have been grown without the use of synthetic fertilizers or pesticides.",
    specs: [
      { label: "Weight", value: "500g, 1kg" },
      { label: "Origin", value: "Ghana" },
      { label: "Type", value: "Raw & Unfiltered" },
      { label: "Shelf Life", value: "24 Months" }
    ]
  },
  {
    id: 2,
    name: "A Glass Jar Of Honey With Dipper Resting On Top Surrounded",
    price: "$29.00",
    rating: 4,
    reviews: 8,
    sku: "HDF-GHD-546",
    image: "/product_honey_card.png",
    category: "Organic Honey",
    tags: ["Jar", "Natural", "Sweet"],
    description: "Premium honey in a classic glass jar, complete with a traditional wooden dipper. A beautiful addition to any kitchen and a sweet treat for any occasion.",
    fullDescription: "This glass jar of honey is not only delicious but also a beautiful piece of decor. Sourced from the finest blossoms, our honey is clear, sweet, and full of natural goodness. The included wooden dipper makes it easy to drizzle over your favorite foods.",
    specs: [
      { label: "Weight", value: "750g" },
      { label: "Origin", value: "Ghana" },
      { label: "Type", value: "Clear Honey" },
      { label: "Packaging", value: "Glass Jar" }
    ]
  },
  {
    id: 13,
    name: "Hot Sale Low Carbon Footprint LED Digital Advertising Billboard",
    price: "US$200.00 - 10,000.00",
    rating: 5,
    reviews: 145,
    sku: "Billboard-LED-X1",
    image: "/billboards/bill_boards 3.webp",
    category: "Digital Advertising",
    tags: ["LED", "Advertising", "Outdoor"],
    moq: "10 Pieces (MOQ)",
    description: "Premium high-resolution LED digital advertising billboard designed for maximum visibility and durability. Featuring low carbon footprint technology and intelligent light sensor for energy efficiency.",
    fullDescription: "Our LED Digital Advertising Billboard is a state-of-the-art solution for modern marketing. It offers superior brightness and color accuracy, ensuring your advertisements stand out even in direct sunlight. Built with high-grade metal materials and advanced LED modules, it is weather-resistant and designed for 24/7 operation.",
    isService: true,
    specs: [
      { label: "Customization", value: "Available" },
      { label: "Certification", value: "CE" },
      { label: "Light Source", value: "LED Backlit with Lens" },
      { label: "Resolution", value: "P4, P5, P6, P8, P10" },
      { label: "Brightness", value: ">= 5500 nits" }
    ]
  }
];

export default function ProductDetailsPage() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id)) || products[0];
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <WebsiteHeader />
      
      <main className="pb-24">
        <ProductsHero 
          title={product.id === 13 ? "DIGITAL" : "HONEY &"}
          highlightTitle={product.id === 13 ? "BILL BOARDS" : "CASHEW"}
          backgroundImage={product.id === 13 ? "/billboards/bill_boards_2.webp" : "/hero_img.webp"}
          breadcrumbTitle={product.id === 13 ? "Billboards" : "Products"}
          highlightColor={product.id === 13 ? "#b8b3b4" : "#eea000"}
        />
        
        <div className="container mx-auto px-4 max-w-[1400px] mt-16">


          <div className="flex flex-col lg:flex-row gap-8 mb-24">
            
            {/* Left: Gallery (Thumbnails + Main) */}
            <div className="w-full lg:w-[55%] flex gap-6">
              {/* Vertical Thumbnails */}
              <div className="hidden sm:flex flex-col gap-4 w-24">
                <button className="w-full aspect-square bg-[#f6f6f6] border border-[#ffcc00] p-2 flex items-center justify-center">
                  <Image src={product.image} alt="thumb" width={80} height={80} className="object-contain" />
                </button>
                {(product.id === 13 ? [
                  "/billboards/bill_boards1.webp",
                  "/billboards/bill_boards_2.webp",
                  "/billboards/bill_boards 3.webp"
                ] : [
                  product.image,
                  product.image,
                  product.image
                ]).map((img, i) => (
                  <button key={i} className="w-full aspect-square bg-[#f6f6f6] border border-gray-100 hover:border-[#ffcc00] transition-colors p-2 flex items-center justify-center opacity-60 hover:opacity-100">
                    <Image src={img} alt="thumb" width={80} height={80} className="object-contain" />
                  </button>
                ))}
              </div>

              {/* Main Image & Trust Bar */}
              <div className="flex-1">
                <div 
                  className="relative aspect-square bg-[#f6f6f6] flex items-center justify-center cursor-crosshair group/zoom"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    const lens = e.currentTarget.querySelector(".zoom-lens") as HTMLElement;
                    const zoom = document.getElementById("zoom-preview") as HTMLElement;
                    
                    if (lens && zoom) {
                      const lensSize = 150; // Size of the lens in pixels
                      let left = e.clientX - rect.left - lensSize / 2;
                      let top = e.clientY - rect.top - lensSize / 2;
                      
                      // Boundary checks
                      left = Math.max(0, Math.min(left, rect.width - lensSize));
                      top = Math.max(0, Math.min(top, rect.height - lensSize));
                      
                      lens.style.left = `${left}px`;
                      lens.style.top = `${top}px`;
                      lens.style.display = "block";
                      
                      zoom.style.backgroundImage = `url("${product.image.replace(/ /g, '%20')}")`;
                      zoom.style.backgroundPosition = `${x}% ${y}%`;
                      zoom.style.display = "block";
                    }
                  }}
                  onMouseLeave={(e) => {
                    const lens = e.currentTarget.querySelector(".zoom-lens") as HTMLElement;
                    const zoom = document.getElementById("zoom-preview") as HTMLElement;
                    if (lens) lens.style.display = "none";
                    if (zoom) zoom.style.display = "none";
                  }}
                >
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-contain p-12"
                  />
                  {/* Zoom Lens */}
                  <div className="zoom-lens absolute border border-gray-300 bg-white/20 pointer-events-none hidden z-10" style={{ width: '150px', height: '150px' }}></div>
                  
                  {/* Floating Zoom Preview Box */}
                  <div 
                    id="zoom-preview"
                    className="absolute top-0 left-full ml-4 w-[400px] h-[400px] bg-white border border-gray-200 shadow-2xl z-[100] hidden bg-no-repeat rounded-sm overflow-hidden"
                    style={{ backgroundSize: '280%' }}
                  ></div>

                  <div className="absolute top-4 left-4 bg-black text-white text-[11px] font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                    -10%
                  </div>
                </div>

                {/* Trust Bar */}
                <div className="grid grid-cols-3 gap-1 mt-8">
                  {(product.isService ? [
                    { icon: ShieldCheck, text: "Direct Factory" },
                    { icon: Star, text: "Certified Quality" },
                    { icon: Truck, text: "Global Export" }
                  ] : [
                    { icon: ShieldCheck, text: "101% Original" },
                    { icon: Repeat, text: "Lowest Price" },
                    { icon: Truck, text: "Free Shipping" }
                  ]).map((item, i) => (
                    <div key={i} className="bg-[#f0f3f9] py-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-[#4a5f8e] font-bold text-[11px] uppercase tracking-wider">
                      <item.icon className="w-4 h-4" />
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="w-full lg:w-[45%] lg:pl-4">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <p className="text-[12px] text-gray-400 mb-2">Brand: <span className="text-gray-900 font-bold">Manono</span></p>
                <h1 className="text-[26px] font-bold text-[#1a1a1a] leading-tight mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[22px] font-black text-[#1a1a1a]">{product.price}</span>
                  <div className="flex items-center gap-1 ml-4 border-l border-gray-200 pl-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < 5 ? "text-[#ffcc00] fill-[#ffcc00]" : "text-gray-200"}`} />
                      ))}
                    </div>
                    <span className="text-[13px] text-gray-400 font-medium">({product.reviews} reviews)</span>
                  </div>
                </div>

                {product.moq && (
                  <p className="text-[14px] text-gray-500 font-bold mb-6">{product.moq}</p>
                )}

                <p className="text-red-500 text-[13px] font-medium flex items-center gap-2 mb-6">
                  <span>🔥</span> Selling fast! Over 9 people have in their cart
                </p>

                <p className="text-gray-500 leading-relaxed text-[14px] mb-8">
                  {product.description}
                </p>

                {/* Attributes (Only for non-services) */}
                {!product.isService && (
                  <div className="space-y-6 mb-8">
                    <div>
                      <label className="block text-[13px] font-bold text-gray-900 mb-3">Weight</label>
                      <div className="flex gap-3">
                        {["500g", "1kg"].map((w, i) => (
                          <button key={w} className={`px-4 py-2 border ${i === 0 ? "border-[#ffcc00] bg-white ring-1 ring-[#ffcc00]" : "border-gray-200 bg-white"} text-[13px] font-bold text-gray-900 min-w-[60px]`}>
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Service Specific Info */}
                {product.isService && (
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-[13px] text-gray-500 font-bold">Customization:</span>
                      <span className="text-[13px] text-gray-900 font-black">Available</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-[13px] text-gray-500 font-bold">Certification:</span>
                      <span className="text-[13px] text-gray-900 font-black">CE</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-[13px] text-gray-500 font-bold">Light Source:</span>
                      <span className="text-[13px] text-gray-900 font-black">LED Backlit with Lens</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mb-4">
                  {product.isService ? (
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                      <button className="flex-1 h-14 bg-[#b8b3b4] text-white px-8 font-bold text-[15px] rounded-full transition-all hover:opacity-90 flex items-center justify-center whitespace-nowrap">
                        Send Inquiry
                      </button>
                      <button className="flex-1 h-14 bg-white border border-[#666] text-black px-8 font-bold text-[15px] rounded-full transition-all hover:bg-gray-50 flex items-center justify-center gap-2 whitespace-nowrap">
                        <div className="w-5 h-5 bg-[#007aff] rounded-full flex items-center justify-center p-1 shrink-0">
                          <MessageCircle className="w-full h-full text-white" />
                        </div>
                        Chat Now
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center border border-gray-100 bg-[#f6f6f6] rounded-sm px-4">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 text-gray-400 hover:text-black">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input type="number" value={quantity} readOnly className="w-10 text-center font-bold text-gray-900 bg-transparent text-[14px]" />
                        <button onClick={() => setQuantity(quantity + 1)} className="p-1 text-gray-400 hover:text-black">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button className="flex-1 bg-[#ffcc00] hover:bg-[#ffcc00]/90 text-black py-4 font-black text-[12px] uppercase tracking-widest rounded-full transition-all">
                        Add to Cart
                      </button>
                    </>
                  )}
                </div>
                
                {!product.isService && (
                  <button className="w-full bg-black hover:bg-black/90 text-white py-4 font-black text-[12px] uppercase tracking-widest rounded-full mb-8">
                    Buy Now
                  </button>
                )}

                {/* Supplier Info Bar (Service Only) */}
                {product.isService && (
                  <div className="mt-8 py-6 flex items-center gap-6 border-t border-gray-100">
                    <div className="w-20 h-20 bg-white flex items-center justify-center">
                      <Image src="/logo.png" alt="Supplier" width={80} height={80} className="object-contain" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[16px] font-black text-gray-900">Manono Export Materials Co., Ltd.</h4>
                      <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider">Manufacturer/Factory & Trading Company</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                )}

                {/* Small Actions */}
                <div className="grid grid-cols-4 gap-2 mb-10 mt-10">
                  {[
                    { icon: Repeat, label: "Compare" },
                    { icon: Heart, label: "Wishlist" },
                    { icon: Mail, label: "Ask Us" },
                    { icon: Share, label: "Share" }
                  ].map((item) => (
                    <button key={item.label} className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-wider text-[#1a1a1a] hover:text-[#ffcc00] transition-colors">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Stats */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-[14px] text-gray-600 font-medium">
                    <Eye className="w-5 h-5 text-gray-400" />
                    <span><span className="font-bold text-gray-900">27</span> people are viewing this right now</span>
                  </div>
                  <div className="flex items-center gap-3 text-[14px] text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-gray-400" />
                    {product.isService ? "Production Time : " : "Estimated Delivery : "} 
                    <span className="text-gray-900 font-medium ml-1">
                      {product.isService ? "15 - 20 Business Days" : "Up to 4 business days"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[14px] text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-gray-400" />
                    {product.isService ? "Shipping Terms : " : "Free Shipping & Returns : "}
                    <span className="text-gray-900 font-medium ml-1">
                      {product.isService ? "FOB / CIF / DDP Available" : "On all orders over $200"}
                    </span>
                  </div>
                </div>

                {/* Checkout Box */}
                <div className="bg-[#f9f9f9] p-6 rounded-sm text-center border border-gray-100 mt-10">
                  <p className="text-[12px] font-bold text-gray-400 mb-5 uppercase tracking-[0.2em]">Guaranteed Safe And Secure Checkout</p>
                  <div className="flex justify-center items-center gap-5">
                    <Image src="/visa.png" alt="Visa" width={45} height={28} className="object-contain" />
                    <Image src="/master_card.png" alt="MasterCard" width={45} height={28} className="object-contain" />
                    <Image src="/mtn.webp" alt="MTN" width={45} height={28} className="object-contain" />
                    <Image src="/telecel.jpg" alt="Telecel" width={45} height={28} className="object-contain" />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Unified Documentation Box */}
          <div className="max-w-[1400px] mx-auto mb-24 border border-gray-200 rounded-sm overflow-hidden">
            {/* Tab Navigation (Inside Box) */}
            <div className="border-b border-gray-200">
              <div className="flex justify-center">
                <div className="flex gap-16 overflow-x-auto no-scrollbar py-8">
                  {[
                    { id: "description", label: "Description" },
                    { id: "specs", label: "Additional information" },
                    { id: "reviews", label: `Reviews (${product.reviews})` },
                    { id: "size", label: "Size Chart" },
                    { id: "shipping", label: "Shipping & Return" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-1 text-[16px] uppercase tracking-wider transition-all relative whitespace-nowrap ${
                        activeTab === tab.id ? "text-black font-black" : "text-gray-500 font-bold hover:text-black"
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && <div className="absolute -bottom-[32px] left-0 w-full h-[3px] bg-black" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content Area (Shared Padding) */}
            <div className="p-8 sm:p-12">
              {activeTab === "description" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {/* Cinematic Banner */}
                  <div className="relative w-full aspect-[1600/586] overflow-hidden mb-12 shadow-sm rounded-sm">
                    <Image 
                      src={product.isService ? "/billboards/bill_boards1.webp" : "/hero_img.webp"} 
                      alt="Product Banner" 
                      fill 
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-10 text-left">
                    <div>
                      <h3 className="text-[18px] font-bold text-gray-900 mb-5 uppercase tracking-tight">About This Item</h3>
                      <p className="text-[#666] leading-[1.8] text-[14px] mb-8">
                        {product.isService ? (
                          "Our LED Digital Advertising Billboard is a high-performance solution for out-of-home advertising. It features cutting-edge P6/P8/P10 LED technology for crystal-clear visuals even in bright daylight. Designed for high-impact urban environments, it offers maximum visibility and engagement for your brand. Built with premium materials, these boards are engineered for 24/7 operation and long-term durability in any weather condition."
                        ) : (
                          "Zandu Pure Honey is the purest honey around. Pure honey has a distinct taste, colour, flavour and thickness which can only be experienced. We guarantee that every drop you taste is 100% pure because each batch of it is sent for sugar-addition test in an International laboratory to ensure purity. Zandu Pure Honey is a unique blend of Sundarban Honey & Tulsi."
                        )}
                      </p>
                    </div>

                    <ul className="space-y-4">
                      {product.isService ? (
                        [
                          { text: "High Resolution P6/P8/P10: Ensures clear visibility from long distances and sharp imagery.", bold: "High Resolution:" },
                          { text: "Ultra Brightness (>= 5500 nits): Excellent readability even in direct sunlight for 24/7 impact.", bold: "Ultra Brightness:" },
                          { text: "IP65 Weatherproof Rating: Durable design built to withstand harsh outdoor conditions and heavy rain.", bold: "Weatherproof Design:" },
                          { text: "Energy Efficient LED: Lower power consumption with high-output brightness using advanced SMD technology.", bold: "Energy Efficient:" },
                          { text: "Intelligent Control System: Remote monitoring and content scheduling via 4G/Wi-Fi/Ethernet connections.", bold: "Intelligent Control:" },
                          { text: "Wide Viewing Angle: 140° horizontal and vertical for maximum audience reach and engagement.", bold: "Wide Viewing Angle:" },
                          { text: "Seamless Cabinet Structure: Lightweight yet robust structure for easy installation and maintenance.", bold: "Robust Cabinet:" },
                          { text: "Long Lifespan: Rated for over 100,000 hours of continuous operation with consistent color quality.", bold: "Long Lifespan:" }
                        ].map((feature, i) => (
                          <li key={i} className="flex gap-3 text-[#666] text-[14px] leading-relaxed">
                            <span className="w-1.5 h-1.5 bg-black rounded-full mt-[7px] shrink-0" />
                            <span>
                              {feature.bold && <strong className="text-gray-900">{feature.bold} </strong>}
                              {feature.text.replace(feature.bold, "").trim()}
                            </span>
                          </li>
                        ))
                      ) : (
                        [
                          { text: "It is 100% compliant on all the 22 parameters mandated by FSSAI for testing honey.", bold: "" },
                          { text: "Premium honey Beans: It clears all European (including German) standards for sugar adulteration.", bold: "Premium honey Beans:" },
                          { text: "Exotic Flavor Fusion: Saffola Honey Active complies with 22 stringent FSSAI parameters to ensure it is free from any adulteration and 100% pure", bold: "Exotic Flavor Fusion:" },
                          { text: "Rich in Antioxidants: Enjoy the health benefits of White Tea and Hyson Honey , known for their high antioxidant content.", bold: "Rich in Antioxidants:" },
                          { text: "Packaging designed for freshness: Honey packed in Double Lid Tin Caddies that protect the Honey from moisture.", bold: "Packaging designed for freshness:" }
                        ].map((feature, i) => (
                          <li key={i} className="flex gap-3 text-[#666] text-[14px] leading-relaxed">
                            <span className="w-1.5 h-1.5 bg-black rounded-full mt-[7px] shrink-0" />
                            <span>
                              {feature.bold && <strong className="text-gray-900">{feature.bold} </strong>}
                              {feature.text.replace(feature.bold, "").trim()}
                            </span>
                          </li>
                        ))
                      )}
                    </ul>

                    <div className="pt-10 border-t border-gray-200">
                      <p className="text-[12px] text-gray-400 italic leading-relaxed">
                        {product.isService ? (
                          "led billboard, digital advertising, outdoor media, high brightness led, advertising display, billboard rental, electronic signage, large format display, p6 led, p8 led, p10 led, billboard campaign."
                        ) : (
                          "honey 1kg, honey , dabur honey, raw honey, fesh honey, honey in fresh, pure honey, indigenious honey, honey dabur, honey in fresh 1kg, dabur honey 500gm, wild honey, natural honey, forest honey."
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "specs" && (
                <div className="animate-in fade-in duration-500 overflow-hidden rounded-sm border border-gray-200 max-w-[800px] mx-auto">
                  <table className="w-full text-left">
                    <tbody>
                      {product.specs.map((spec: any, i: number) => (
                        <tr key={i} className="border-b border-gray-200">
                          <th className="px-8 py-5 font-bold text-gray-900 w-1/3 text-sm">{spec.label}</th>
                          <td className="px-8 py-5 text-[#ffcc00] font-bold text-sm">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="animate-in fade-in duration-500 space-y-12 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Reviews Stats */}
                    <div className="p-8 rounded-sm border border-gray-200">
                      <h2 className="text-[20px] font-bold mb-6">{product.reviews} reviews for <span>{product.name}</span></h2>
                      <div className="flex items-center gap-6 mb-8">
                        <div className="text-[48px] font-black text-[#ffab00]">5.00</div>
                        <div>
                          <div className="flex gap-1 mb-1">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#ffab00] text-[#ffab00]" />)}
                          </div>
                          <div className="text-sm text-gray-400 font-bold uppercase tracking-wider">out of 5 stars</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-4 text-sm font-bold text-gray-900">
                            <div className="w-4">{rating}</div>
                            <Star className="w-3.5 h-3.5 fill-[#ffab00] text-[#ffab00]" />
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#ffab00]" style={{ width: rating === 5 ? '100%' : '0%' }} />
                            </div>
                            <div className="w-4 text-gray-400">{rating === 5 ? product.reviews : 0}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review Form */}
                    <div className="border border-gray-200 p-8 rounded-sm">
                      <h3 className="text-xl font-bold mb-6">Add a review</h3>
                      <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="Name *" className="p-4 border border-gray-200 focus:border-black outline-none text-sm bg-white" />
                          <input type="email" placeholder="Email *" className="p-4 border border-gray-200 focus:border-black outline-none text-sm bg-white" />
                        </div>
                        <textarea placeholder="Your Review *" rows={6} className="w-full p-4 border border-gray-200 focus:border-black outline-none text-sm bg-white"></textarea>
                        <button className="bg-black text-white px-10 py-4 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-[#ffcc00] hover:text-black transition-all">Submit Review</button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "size" && (
                <div className="animate-in fade-in duration-500 text-left space-y-12">
                  <div className="prose prose-sm max-w-none text-gray-500">
                    <p className="text-[15px] leading-relaxed mb-10">
                      {product.isService ? (
                        "Selecting the right billboard size is crucial for your campaign's success. We offer various standard and custom dimensions to fit your specific advertising needs and location requirements."
                      ) : (
                        "Finding the perfect fit is essential for a comfortable and flattering wardrobe. To assist you in selecting the right size, we've compiled comprehensive size guides."
                      )}
                    </p>
                    
                    {product.isService ? (
                      <div>
                        <h4 className="text-gray-900 font-black text-lg mb-6 uppercase tracking-tight">Standard Billboard Dimensions</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-black text-white">
                                {["Type", "Dimensions (m)", "Aspect Ratio", "Resolution", "Best View Distance"].map(h => (
                                  <th key={h} className="p-4 text-xs font-black uppercase tracking-widest text-left">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="text-gray-600 text-[13px]">
                              {[
                                ["Small Digital", "3m x 6m", "1:2", "P6 / P8", "10m - 50m"],
                                ["Standard Highway", "4m x 12m", "1:3", "P10", "30m - 200m"],
                                ["Giant Motorway", "6m x 18m", "1:3", "P16", "50m - 500m"],
                                ["Urban Portrait", "8m x 4m", "2:1", "P6", "5m - 30m"]
                              ].map((row, i) => (
                                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                  {row.map((cell, j) => <td key={j} className="p-4">{cell}</td>)}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-12">
                        {/* Men's Table */}
                        <div>
                          <h4 className="text-gray-900 font-black text-lg mb-6 uppercase tracking-tight">Men's Clothing Size Guide</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-black text-white">
                                  {["Size", "Chest (in)", "Waist (in)", "Hips (in)"].map(h => (
                                    <th key={h} className="p-4 text-xs font-black uppercase tracking-widest text-left">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="text-gray-600 text-[13px]">
                                {[
                                  ["XS", "34-36", "28-30", "34-36"],
                                  ["S", "36-38", "30-32", "36-38"],
                                  ["M", "38-40", "32-34", "38-40"]
                                ].map((row, i) => (
                                  <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    {row.map((cell, j) => <td key={j} className="p-4">{cell}</td>)}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="animate-in fade-in duration-500 text-left grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div>
                    <h4 className="text-gray-900 font-black text-xl mb-8 uppercase tracking-tighter">
                      {product.isService ? "Installation & Support" : "Shipping Policy"}
                    </h4>
                    <div className="space-y-6 text-[#666] text-[14px] leading-relaxed">
                      <p>
                        {product.isService ? (
                          "We provide full-service installation and maintenance for all our digital billboards. Our team handles everything from structural mounting to software integration."
                        ) : (
                          "At our Company, we understand the importance of timely delivery. We offer a variety of shipping options to suit your needs."
                        )}
                      </p>
                      <ul className="space-y-4">
                        {product.isService ? (
                          [
                            "Installation: Within 5-7 business days",
                            "24/7 Technical remote support included",
                            "On-site maintenance response within 24 hours",
                            "Full structural warranty for 2 years",
                            "Software training for your marketing team"
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 items-center">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              {item}
                            </li>
                          ))
                        ) : (
                          [
                            "Dispatch: Within 24 Hours",
                            "Free shipping on orders over $99",
                            "Easy 30 days returns and exchanges"
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 items-center">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              {item}
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-gray-900 font-black text-xl mb-8 uppercase tracking-tighter">
                      {product.isService ? "Service Terms" : "Returns Policy"}
                    </h4>
                    <div className="space-y-6 text-[#666] text-[14px] leading-relaxed">
                      <p>
                        {product.isService ? (
                          "Our service contracts are designed to provide maximum value and security for your advertising investment."
                        ) : (
                          "We want you to be completely satisfied. If for any reason you are not happy, we're here to help."
                        )}
                      </p>
                      <div className="p-6 border border-gray-200 border-l-4 border-l-black space-y-4">
                        {product.isService ? (
                          <>
                            <p><strong>Uptime Guarantee: 99.9% screen availability.</strong></p>
                            <p>Flexible scheduling and content updates.</p>
                            <p>Detailed performance and impression reporting.</p>
                          </>
                        ) : (
                          <>
                            <p><strong>Returned items must be unused and original condition.</strong></p>
                            <p>Proof of purchase is required for all returns.</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Section */}
          <div className="pt-24 border-t border-gray-200">
            <h2 className="text-[32px] font-black text-[#1a1a1a] uppercase text-center mb-16 tracking-tight">
              Related <span className="text-[#ffcc00]">{product.isService ? "Slots" : "Products"}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(product.isService ? [
                { 
                  id: 1, 
                  name: "Main City Center LED | High Visibility Screen", 
                  price: "$1,200", 
                  image: "/billboards/bill_boards1.webp",
                  buttonText: "SELECT OPTIONS",
                  icon: <ShoppingCart className="w-3.5 h-3.5" />,
                  discount: "-15%",
                  oldPrice: "$1,400",
                  timer: "Limited Slot"
                },
                { 
                  id: 2, 
                  name: "Airport Arrival Digital | Elite Audience Reach", 
                  price: "$2,500", 
                  image: "/billboards/bill_boards_2.webp",
                  buttonText: "ADD TO CART",
                  icon: <ShoppingCart className="w-3.5 h-3.5" />,
                  discount: null,
                  oldPrice: null,
                  timer: null
                },
                { 
                  id: 3, 
                  name: "Motorway Giant Board | Mass Market Exposure", 
                  price: "$3,000", 
                  image: "/billboards/bill_boards 3.webp",
                  buttonText: "ADD TO CART",
                  icon: <ShoppingCart className="w-3.5 h-3.5" />,
                  discount: "HOT",
                  oldPrice: "$3,500",
                  timer: "Sale Ends Soon"
                },
                { 
                  id: 4, 
                  name: "Urban Transit Hub Screen | Targeted Daily Reach", 
                  price: "$1,800", 
                  image: "/billboards/bill_boards1.webp",
                  buttonText: "ADD TO CART",
                  icon: <ShoppingCart className="w-3.5 h-3.5" />,
                  discount: null,
                  oldPrice: null,
                  timer: null
                }
              ] : [
                { 
                  id: 1, 
                  name: "Honey And Spice Wild Acacia Honey From The Valleys Of...", 
                  price: "$16 – $20", 
                  image: "/product_honey_card.png",
                  buttonText: "SELECT OPTIONS",
                  icon: <ShoppingCart className="w-3.5 h-3.5" />,
                  discount: "-10%",
                  oldPrice: "$22",
                  timer: "Flash Sale"
                },
                { 
                  id: 2, 
                  name: "Buy 1Kg Lion Kashmir Honey & Get Kashmir Honey 500 Gm", 
                  price: "$28", 
                  image: "/product_honey_card.png",
                  buttonText: "ADD TO CART",
                  icon: <ShoppingCart className="w-3.5 h-3.5" />,
                  discount: "BOGO",
                  oldPrice: null,
                  timer: null
                },
                { 
                  id: 3, 
                  name: "Avadata Organics 100% Pure Raw Honey Raw, Unprocessed..", 
                  price: "$32", 
                  image: "/product_honey_card.png",
                  buttonText: "ADD TO CART",
                  icon: <ShoppingCart className="w-3.5 h-3.5" />,
                  discount: null,
                  oldPrice: null,
                  timer: null
                },
                { 
                  id: 4, 
                  name: "ANP BEE ,Raw Unpasteurized 100% Pure Natural Honey", 
                  price: "$18", 
                  image: "/product_honey_card.png",
                  buttonText: "ADD TO CART",
                  icon: <ShoppingCart className="w-3.5 h-3.5" />,
                  discount: null,
                  oldPrice: null,
                  timer: null
                }
              ]).map((p) => (
                <div key={p.id} className="group border border-gray-100 rounded-sm bg-white p-4 hover:shadow-xl transition-all duration-300">
                  {/* Image Area */}
                  <div className="relative bg-[#f6f6f6] aspect-square rounded-sm mb-6 flex items-center justify-center p-8 overflow-hidden">
                    <Image 
                      src={p.image} 
                      alt={p.name} 
                      width={180} 
                      height={180} 
                      className="object-contain group-hover:scale-110 transition-transform duration-500" 
                    />
                    
                    {/* Discount Badge */}
                    {p.discount && (
                      <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-black w-9 h-9 rounded-full flex items-center justify-center shadow-lg">
                        {p.discount}
                      </div>
                    )}

                    {/* Quick Actions (Hover) */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      {[Heart, Repeat, Eye].map((Icon, i) => (
                        <button key={i} className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#ffcc00] hover:text-black transition-colors text-gray-400">
                          <Icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>

                    {/* Timer Pill */}
                    {p.timer && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-sm shadow-sm text-[10px] text-red-500 font-black whitespace-nowrap border border-gray-50">
                        {p.timer}
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="text-center">
                    <h3 className="text-[14px] font-black text-gray-900 leading-snug mb-3 hover:text-[#ffcc00] transition-colors h-10 line-clamp-2 px-2">
                      {p.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex justify-center gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < 4 ? "text-[#ffcc00] fill-[#ffcc00]" : "text-gray-200"}`} />
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                      {p.oldPrice && <span className="text-[14px] text-gray-300 line-through font-bold">{p.oldPrice}</span>}
                      <span className="text-[16px] text-gray-900 font-black">{p.price}</span>
                    </div>

                    {/* Action Button */}
                    <button className="w-full bg-[#ffcc00] hover:bg-black hover:text-white text-black py-4 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 group/btn">
                      {p.icon}
                      {p.buttonText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <WebsiteFooter />
    </div>
  );
}
