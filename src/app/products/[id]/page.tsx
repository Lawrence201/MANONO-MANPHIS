"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getBillboard, getBillboards } from "@/lib/actions/billboard-actions";
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
  MapPin,
  Calendar,
  Monitor,
  Clock,
  Hash,
  Layout,
  Sun,
  Share2 as Share,
  X,
  ChevronLeft,
  Link2,
  Play
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
      { label: "BILLBOARD CODE", value: "Billboard-LED-X1" },
      { label: "Location", value: "Accra" },
      { label: "Duration", value: "1 Month" },
      { label: "Format", value: "Landscape" },
      { label: "Dimension", value: "1920px × 1080px" },
      { label: "Resolution", value: "P6" },
      { label: "Brightness", value: "6500 nits" },
      { label: "AVAILABLE SLOT", value: "10 Slots" }
    ]
  }
];

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(products.find(p => p.id === Number(id)) || products[0]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [mapZoom, setMapZoom] = useState(15);
  const [relatedBillboards, setRelatedBillboards] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    async function fetchBillboard() {
      // If it's a billboard ID (numeric)
      if (id) {
        setLoading(true);
        const [res, allRes] = await Promise.all([
          getBillboard(Number(id)),
          getBillboards()
        ]);

        if (allRes.success && allRes.data) {
          const related = allRes.data.filter((b: any) => b.id !== Number(id)).slice(0, 4);
          setRelatedBillboards(related);
        }

        if (res.success && res.data) {
          const b = res.data;
          const gallery = [
            b.featureImage,
            ...(b.galleryImages?.map((img: any) => img.imagePath) || [])
          ].filter(Boolean);

          const formattedDuration = b.minDuration?.replace(/m$/, " Month").replace(/w$/, " Week") || "1 Month";
          
          // Map billboard data to product template structure
          setProduct({
            id: b.id,
            name: b.name,
            price: `GH₵${Number(b.weeklyRate).toLocaleString()}`,
            rating: 5,
            reviews: 145,
            sku: b.assetCode,
            image: b.featureImage || "/billboards/bill_boards 3.webp",
            gallery: gallery,
            category: b.category,
            tags: ["LED", "Advertising", "Outdoor"],
            moq: `Minimum Duration: ${formattedDuration}`,
            description: b.description,
            fullDescription: b.description,
            isService: true,
            specs: [
              { label: "BILLBOARD CODE", value: b.assetCode },
              { label: "Location", value: b.city.charAt(0).toUpperCase() + b.city.slice(1) },
              { label: "Duration", value: formattedDuration },
              { label: "Display Type", value: b.screenType?.toLowerCase() === "led" ? "SMD LED Board" : b.screenType || "SMD LED Board" },
              { label: "Resolution", value: b.resolution?.toLowerCase() === "p6" ? "P6 (Standard)" : b.resolution || "P6 (Standard)" },
              { label: "Format", value: b.aspectRatio ? (b.aspectRatio.charAt(0).toUpperCase() + b.aspectRatio.slice(1)) : "Landscape" },
              { label: "Brightness", value: b.brightness ? (b.brightness.toLowerCase().includes('nits') ? b.brightness : `${b.brightness} nits`) : "6500 nits" },
              { label: "Dimensions (W×H)", value: b.dimensions || "1920px × 1080px" },
              { label: "AVAILABLE SLOT", value: `${b.availableSlots !== undefined ? b.availableSlots : (b.maxSlots || 10)} Slots` }
            ],
            rawSpecs: {
              type: b.screenType ? (b.screenType.length <= 3 ? b.screenType.toUpperCase() : b.screenType.charAt(0).toUpperCase() + b.screenType.slice(1)) : "SMD LED",
              dimensions: b.dimensions || "1920px × 1080px",
              aspectRatio: b.aspectRatio ? (b.aspectRatio.charAt(0).toUpperCase() + b.aspectRatio.slice(1)) : "Landscape",
              resolution: b.resolution ? b.resolution.toUpperCase() : "P6",
              brightness: b.brightness ? (b.brightness.toLowerCase().includes('nits') ? b.brightness : `${b.brightness} nits`) : "6500 nits"
            },
            latitude: b.latitude || "5.6037", // Default to Accra roughly
            longitude: b.longitude || "-0.1870",
            videoShowcase: b.videoShowcase
          });
        }
        setLoading(false);
      }
    }

    fetchBillboard();
  }, [id]);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Set active image when product loads
  useEffect(() => {
    if (product && product.image) {
      setActiveImage(product.image);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#eea000] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayImages = product.gallery || [product.image];

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <WebsiteHeader />
      
      <main className="pb-24">
        <ProductsHero 
          title={product.isService ? product.name.split(' ').slice(0, 2).join(' ').toUpperCase() : "HONEY &"}
          highlightTitle={product.isService ? product.name.split(' ').slice(2).join(' ').toUpperCase() : "CASHEW"}
          backgroundImage={product.image}
          breadcrumbTitle={product.isService ? "Billboards" : "Products"}
          highlightColor={product.isService ? "#b8b3b4" : "#eea000"}
        />
        
        <div className="container mx-auto px-4 max-w-[1400px] mt-16">


          <div className="flex flex-col lg:flex-row gap-8 mb-24">
            
            {/* Left: Gallery (Thumbnails + Main) */}
            <div className="w-full lg:w-[55%] flex gap-6">
              {/* Vertical Thumbnails */}
              <div className="hidden sm:flex flex-col gap-4 w-24">
                {displayImages.map((img: string, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(img)}
                    className={`w-full aspect-square bg-[#f6f6f6] border ${activeImage === img ? "border-[#ffcc00]" : "border-gray-100"} hover:border-[#ffcc00] transition-all p-2 flex items-center justify-center ${activeImage === img ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                  >
                    <Image src={img} alt={`thumb-${i}`} width={80} height={80} className="object-contain" />
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
                      const lensSize = 120; // Size of the lens in pixels
                      let left = e.clientX - rect.left - lensSize / 2;
                      let top = e.clientY - rect.top - lensSize / 2;
                      
                      // Boundary checks
                      left = Math.max(0, Math.min(left, rect.width - lensSize));
                      top = Math.max(0, Math.min(top, rect.height - lensSize));
                      
                      lens.style.left = `${left}px`;
                      lens.style.top = `${top}px`;
                      lens.style.display = "block";
                      
                      zoom.style.backgroundImage = `url("${(activeImage || product.image).replace(/ /g, '%20')}")`;
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
                    src={activeImage || product.image} 
                    alt={product.name} 
                    fill 
                    className="object-contain p-12"
                  />
                  {/* Zoom Lens */}
                  <div className="zoom-lens absolute border border-gray-300 bg-white/20 pointer-events-none hidden z-10" style={{ width: '120px', height: '120px' }}></div>
                  
                  {/* Floating Zoom Preview Box */}
                  <div 
                    id="zoom-preview"
                    className="absolute top-0 left-full ml-4 w-[320px] h-[320px] bg-white border border-gray-200 shadow-2xl z-[100] hidden bg-no-repeat rounded-sm overflow-hidden"
                    style={{ backgroundSize: '280%' }}
                  ></div>
                </div>

                {/* Trust Bar */}
                <div className="grid grid-cols-3 gap-1 mt-8">
                  {(product.isService ? [
                    { icon: ShieldCheck, text: "view", onClick: () => setShowGalleryModal(true) },
                    { icon: Play, text: "Watch Video", onClick: () => setShowVideoModal(true) },
                    { icon: Truck, text: "Global Export" }
                  ] : [
                    { icon: ShieldCheck, text: "101% Original" },
                    { icon: Repeat, text: "Lowest Price" },
                    { icon: Truck, text: "Free Shipping" }
                  ]).map((item: any, i) => (
                    <div 
                      key={i} 
                      className={`bg-[#f0f3f9] py-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-[#4a5f8e] font-bold text-[11px] uppercase tracking-wider ${item.onClick ? 'cursor-pointer hover:bg-[#e1e7f0] transition-colors' : ''}`}
                      onClick={item.onClick}
                    >
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
                {/* Repositioned Supplier Info (Minimalist) */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 flex items-center justify-center shrink-0">
                    <Image src="/logo.PNG" alt="Supplier" width={80} height={80} className="object-contain" />
                  </div>
                  <div>
                    <h4 className="text-[18px] font-black text-gray-900 leading-tight">Manono Export Materials Co., Ltd.</h4>
                    <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider mt-1">Manufacturer/Factory & Trading Company</p>
                  </div>
                </div>

                <h1 className="text-[32px] font-black text-[#1a1a1a] leading-tight mb-4 tracking-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[22px] font-bold text-[#1a1a1a]">{product.price}</span>
                  <div className="flex items-center gap-1 ml-4 border-l border-gray-200 pl-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < 5 ? "text-[#ffcc00] fill-[#ffcc00]" : "text-gray-200"}`} />
                      ))}
                    </div>
                    <span className="text-[13px] text-gray-400 font-medium">({product.reviews} reviews)</span>
                  </div>
                </div>



                {/* Attributes (Only for non-services) */}
                {!product.isService && (
                  <div className="space-y-6 mb-6">
                    <div>
                      <label className="block text-[13px] font-bold text-gray-900 mb-3">Weight</label>
                      <div className="flex gap-3">
                        {["250g", "500g", "1kg"].map((size) => (
                          <button key={size} className="px-6 py-3 border border-gray-200 rounded-sm text-[13px] font-black uppercase tracking-wider hover:border-[#ffcc00] transition-all">
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Dynamic Specs Table (Matching Image UI) */}
                {product.isService && (
                  <div className="rounded-[12px] overflow-hidden border border-gray-100 mb-8 shadow-sm">
                    {product.specs.map((spec: any, i: number) => (
                      <div 
                        key={i} 
                        className={`flex justify-between items-center px-6 py-3.5 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-5 flex justify-center">
                            {spec.label === "BILLBOARD CODE" ? <Hash className="w-4 h-4 text-[#eea000]" /> :
                             spec.label === "Location" ? <MapPin className="w-4 h-4 text-[#eea000]" /> :
                             spec.label === "Duration" ? <Calendar className="w-4 h-4 text-[#eea000]" /> :
                             spec.label === "Display Type" ? <Monitor className="w-4 h-4 text-[#eea000]" /> :
                             spec.label === "Format" ? <Layout className="w-4 h-4 text-[#eea000]" /> :
                             spec.label === "Dimensions (W×H)" ? <Monitor className="w-4 h-4 text-[#eea000]" /> :
                             spec.label === "Resolution" ? <Star className="w-4 h-4 text-[#eea000]" /> :
                             spec.label === "Brightness" ? <Sun className="w-4 h-4 text-[#eea000]" /> :
                             spec.label === "AVAILABLE SLOT" ? <CheckCircle2 className="w-4 h-4 text-[#eea000]" /> :
                             <Clock className="w-4 h-4 text-[#eea000]" />}
                          </div>
                          <span className="text-gray-400 font-bold text-[12px] uppercase tracking-wide">{spec.label}</span>
                        </div>
                        <span className="text-[#1a1a1a] font-bold text-[14px]">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  {product.isService ? (
                    <Link href={`/billboard-booking?hallId=${product.id}`} className="flex-1">
                      <button className="w-full h-14 bg-[#b8b3b4] text-white px-8 font-bold text-[15px] rounded-full transition-all hover:opacity-90 flex items-center justify-center whitespace-nowrap">
                        BOOK NOW
                      </button>
                    </Link>
                  ) : (
                    <button className="flex-1 h-14 bg-[#b8b3b4] text-white px-8 font-bold text-[15px] rounded-full transition-all hover:opacity-90 flex items-center justify-center whitespace-nowrap">
                      BOOK NOW
                    </button>
                  )}
                  <button className="flex-1 h-14 bg-white border border-[#666] text-black px-8 font-bold text-[15px] rounded-full transition-all hover:bg-gray-50 flex items-center justify-center gap-2 whitespace-nowrap">
                    <div className="w-5 h-5 bg-[#007aff] rounded-full flex items-center justify-center p-1 shrink-0">
                      <MessageCircle className="w-full h-full text-white" />
                    </div>
                    Chat Now
                  </button>
                </div>


                {/* Share Billboard Banner (Light Mode - Borderless & No BG) */}
                <div className="mb-10 mt-10">
                  <div className="flex items-center gap-2.5 mb-4">
                    <Share className="w-5 h-5 text-[#1a1a1a]" />
                    <span className="text-[16px] font-bold text-[#1a1a1a] tracking-wide">Share this Billboard</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">

                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-[#cbd5e1] bg-white hover:bg-gray-50 text-[#1a1a1a] text-[12px] font-bold px-4 py-2.5 rounded-[6px] transition-all shrink-0"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-[#475569]">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                      </svg>
                      Facebook
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-[#cbd5e1] bg-white hover:bg-gray-50 text-[#1a1a1a] text-[12px] font-bold px-4 py-2.5 rounded-[6px] transition-all shrink-0"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-[#475569]">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      Twitter
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-[#cbd5e1] bg-white hover:bg-gray-50 text-[#1a1a1a] text-[12px] font-bold px-4 py-2.5 rounded-[6px] transition-all shrink-0"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-[#475569]">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>
                    <a
                      href={`https://api.whatsapp.com/send?text=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-[#cbd5e1] bg-white hover:bg-gray-50 text-[#1a1a1a] text-[12px] font-bold px-4 py-2.5 rounded-[6px] transition-all shrink-0"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-[#475569]">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.003-2.637-1.019-5.114-2.88-6.978C16.592 1.897 14.12 .876 11.48.876c-5.437 0-9.863 4.421-9.867 9.867-.001 1.73.473 3.42 1.37 4.91L2.006 21.9l6.39-1.674c1.472.804 3.09 1.228 4.743 1.228h-.006z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </div>
                </div>



              </div>
            </div>
          </div>

          {/* Unified Documentation Box */}
          <div className="max-w-[1500px] mx-auto mb-24 border border-gray-200 rounded-sm overflow-hidden">
            {/* Tab Navigation (Inside Box) */}
            <div className="border-b border-gray-200">
              <div className="w-full">
                <div className="flex w-full overflow-x-auto no-scrollbar">
                  {[
                    { id: "description", label: "Description" },
                    { id: "specs", label: "Additional information" },
                    { id: "reviews", label: `Reviews (${product.reviews})` },
                    { id: "size", label: "Size Chart" },
                    { id: "shipping", label: "MAP" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-8 text-[16px] uppercase tracking-wider transition-all relative whitespace-nowrap text-center ${
                        activeTab === tab.id ? "text-black font-black bg-gray-50/50" : "text-gray-500 font-bold hover:text-black hover:bg-gray-50/30"
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black" />}
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
                      src={product.image || (product.isService ? "/billboards/bill_boards1.webp" : "/hero_img.webp")} 
                      alt="Product Banner" 
                      fill 
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-10 text-left">
                    <div>
                      <h3 className="text-[18px] font-bold text-gray-900 mb-5 uppercase tracking-tight">BILLBOARD DESCRIPTION</h3>
                      <p className="text-[#666] leading-[1.8] text-[14px] mb-8 whitespace-pre-wrap">
                        {product.description || "No description available for this billboard."}
                      </p>
                    </div>

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
                <div className="animate-in fade-in duration-500 overflow-hidden rounded-sm border border-gray-200 max-w-[1100px] mx-auto">
                  <table className="w-full text-left">
                    <tbody>
                      {product.specs.map((spec: any, i: number) => (
                        <tr key={i} className="border-b border-gray-200">
                          <th className="px-8 py-5 font-bold text-gray-900 text-sm text-left">{spec.label}</th>
                          <td className="px-8 py-5 text-[#ffcc00] font-bold text-sm text-right">{spec.value}</td>
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
                        <div className="text-[48px] font-black text-[#eea000]">5.00</div>
                        <div>
                          <div className="flex gap-1 mb-1">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#eea000] text-[#eea000]" />)}
                          </div>
                          <div className="text-sm text-gray-400 font-bold uppercase tracking-wider">out of 5 stars</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-4 text-sm font-bold text-gray-900">
                            <div className="w-4">{rating}</div>
                            <Star className="w-3.5 h-3.5 fill-[#eea000] text-[#eea000]" />
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#eea000]" style={{ width: rating === 5 ? '100%' : '0%' }} />
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
                    {!product.isService && (
                      <p className="text-[15px] leading-relaxed mb-10">
                        Finding the perfect fit is essential for a comfortable and flattering wardrobe. To assist you in selecting the right size, we've compiled comprehensive size guides.
                      </p>
                    )}
                    
                    {product.isService ? (
                      <div>
                        <h4 className="text-gray-900 font-black text-lg mb-6 uppercase tracking-tight">Billboard Dimensions</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-black text-white">
                                {["Type", "Dimensions", "FORMAT", "Resolution", "BRIGHTNESS"].map(h => (
                                  <th key={h} className="p-4 text-xs font-black uppercase tracking-widest text-left">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="text-gray-600 text-[13px]">
                                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                  <td className="p-4">{product.rawSpecs?.type || "N/A"}</td>
                                  <td className="p-4">{product.rawSpecs?.dimensions || "N/A"}</td>
                                  <td className="p-4">{product.rawSpecs?.aspectRatio || "N/A"}</td>
                                  <td className="p-4">{product.rawSpecs?.resolution || "N/A"}</td>
                                  <td className="p-4">{product.rawSpecs?.brightness || "N/A"}</td>
                                </tr>
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
                <div className="animate-in fade-in duration-500">
                  <div className="w-full h-[550px] bg-secondary/50 dark:bg-[#121212] rounded-xl border-2 border-border/60 overflow-hidden relative group transition-all">
                    {product.isService ? (
                      <>
                        <iframe
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          style={{ border: 0 }}
                          src={`https://maps.google.com/maps?ll=${product.latitude},${product.longitude}&z=${mapZoom}&t=m&hl=en&output=embed`}
                          className="w-full h-full transition-all pointer-events-none"
                          allowFullScreen
                        ></iframe>

                        {/* Bouncing Google-Style Marker Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                          <div className="animate-bounce" style={{ animationDuration: '1.2s' }}>
                            <svg 
                              width="45" 
                              height="45" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg"
                              className="drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] -translate-y-5"
                            >
                              <path 
                                d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" 
                                fill="#EA4335" 
                              />
                            </svg>
                            <div className="w-2 h-1 bg-black/20 rounded-full blur-[2px] mx-auto -mt-1 scale-x-150" />
                          </div>
                        </div>

                        {/* Zoom Controls */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                          <button 
                            type="button"
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-md hover:bg-white dark:hover:bg-black border border-black/5 dark:border-white/10 transition-all text-black"
                            onClick={(e) => { e.preventDefault(); setMapZoom(prev => Math.min(prev + 1, 21)); }}
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                          <button 
                            type="button"
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-md hover:bg-white dark:hover:bg-black border border-black/5 dark:border-white/10 transition-all text-black"
                            onClick={(e) => { e.preventDefault(); setMapZoom(prev => Math.max(prev - 1, 0)); }}
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                        </div>
                        
                        {/* Status Badges Overlay */}
                        <div className="absolute bottom-4 right-4 flex gap-2 pointer-events-none">
                           <div className="bg-black/80 backdrop-blur-md text-white border border-white/10 text-[11px] font-mono font-bold px-3 py-1.5 rounded shadow-xl tracking-widest">
                             LAT: {product.latitude}
                           </div>
                           <div className="bg-black/80 backdrop-blur-md text-white border border-white/10 text-[11px] font-mono font-bold px-3 py-1.5 rounded shadow-xl tracking-widest">
                             LNG: {product.longitude}
                           </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
                        <MapPin className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-xs font-semibold uppercase tracking-wider">Map coordinates not set</p>
                      </div>
                    )}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {relatedBillboards.map((b) => (
                <div key={b.id} className="group border border-gray-100 rounded-sm bg-white p-4 hover:shadow-xl transition-all duration-300">
                  {/* Image Area */}
                  <div className="relative bg-[#f6f6f6] aspect-square rounded-sm mb-6 flex items-center justify-center p-8 overflow-hidden">
                    <Link href={`/products/${b.id}`} className="absolute inset-0 block w-full h-full">
                      <Image 
                        src={b.featureImage || "/billboards/bill_boards 2.webp"} 
                        alt={b.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </Link>
                    
                    {/* Quick Actions (Hover) */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
                      {[Heart, Repeat].map((Icon, i) => (
                        <button key={i} className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#ffcc00] hover:text-black transition-colors text-gray-400 pointer-events-auto">
                          <Icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="text-center">
                    <Link href={`/products/${b.id}`}>
                      <h3 className="text-[14px] font-black text-gray-900 leading-snug mb-3 hover:text-[#ffcc00] transition-colors h-10 line-clamp-2 px-2">
                        {b.name}
                      </h3>
                    </Link>
                    
                    {/* Rating */}
                    <div className="flex justify-center gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < 4 ? "text-[#ffcc00] fill-[#ffcc00]" : "text-gray-200"}`} />
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <span className="text-[16px] text-gray-900 font-black">GH₵{Number(b.weeklyRate).toLocaleString()}</span>
                    </div>

                    {/* Action Button */}
                    <Link href={`/products/${b.id}`}>
                      <button className="w-full bg-[#ffcc00] hover:bg-black hover:text-white text-black py-4 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 group/btn">
                        <Eye className="w-3.5 h-3.5" />
                        VIEW DETAILS
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <WebsiteFooter />

      {/* Full-screen Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <button 
            onClick={() => setShowGalleryModal(false)}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[210] group"
          >
            <X className="w-10 h-10 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = product.gallery.indexOf(activeImage || product.image);
                const prevIndex = (currentIndex - 1 + product.gallery.length) % product.gallery.length;
                setActiveImage(product.gallery[prevIndex]);
              }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-[210] p-4"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            <div className="relative w-full h-full max-w-7xl max-h-[85vh]">
              <Image 
                src={activeImage || product.image} 
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = product.gallery.indexOf(activeImage || product.image);
                const nextIndex = (currentIndex + 1) % product.gallery.length;
                setActiveImage(product.gallery[nextIndex]);
              }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-[210] p-4"
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            {/* Thumbnail Strip in Modal */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 px-4 overflow-x-auto max-w-full scrollbar-hide">
              {product.gallery?.map((img: string, i: number) => (
                <div 
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all shrink-0 ${
                    (activeImage || product.image) === img ? "border-[#ffcc00] scale-110" : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <Image src={img} alt="thumbnail" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Video Showcase Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <button 
            onClick={() => setShowVideoModal(false)}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[210] group"
          >
            <X className="w-10 h-10 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="relative w-full max-w-5xl aspect-video px-4 md:px-0">
            {product.videoShowcase ? (
              <video 
                src={product.videoShowcase} 
                controls 
                autoPlay 
                className="w-full h-full rounded-lg shadow-2xl border border-white/10"
              />
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-10 text-center text-white flex flex-col items-center justify-center h-full aspect-video">
                <Play className="w-16 h-16 text-gray-500 mb-4 animate-pulse" />
                <h3 className="text-xl font-bold mb-2">Showcase Video Unavailable</h3>
                <p className="text-zinc-500 text-sm max-w-md">No dynamic video showcase has been uploaded for this digital billboard asset yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
