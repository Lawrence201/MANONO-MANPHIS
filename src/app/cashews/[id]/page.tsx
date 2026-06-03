"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { getBillboard, getBillboards } from "@/lib/actions/billboard-actions";
import { getProduct, getCashewProducts } from "@/lib/actions/product-actions";
import { submitReview, getReviews } from "@/lib/actions/review-actions";
import { ProductComparisonRating } from "@/components/ProductComparisonRating";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
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
  Play,
  Package,
  Activity,
  DollarSign,
  Tag,
  Sliders,
  ExternalLink
} from "lucide-react";
import { TopBar } from "@/components/website/top-bar";
import { WebsiteHeader } from "@/components/website/header";
import { WebsiteFooter } from "@/components/website/footer";
import { ProductsHero } from "@/components/website/products-hero";

const products = [
  {
    id: 1,
    name: "24 Mantra Organic 100% Pure & RAW Honey | Zero Added Sugar",
    price: "GH₵ 18.00 - GH₵ 20.00",
    rating: 5,
    reviews: 12,
    sku: "AMD-PSJ-958",
    image: "/cashew.png",
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
    price: "GH₵ 29.00",
    rating: 4,
    reviews: 8,
    sku: "HDF-GHD-546",
    image: "/cashew.png",
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
    price: "GH₵ 200.00 - 10,000.00",
    rating: 5,
    reviews: 145,
    sku: "Billboard-LED-X1",
    image: "/billboards/bill_boards 3.webp",
    category: "Digital Advertising",
    tags: ["LED", "Advertising", "Outdoor"],
    moq: "10 Pieces (Minimum Order)",
    description: "Premium high-resolution LED digital advertising billboard designed for maximum visibility and durability. Featuring low carbon footprint technology and intelligent light sensor for energy efficiency.",
    fullDescription: "Our LED Digital Advertising Billboard is a state-of-the-art solution for modern marketing. It offers superior brightness and color accuracy, ensuring your advertisements stand out even in direct sunlight. Built with high-grade metal materials and advanced LED modules, it is weather-resistant and designed for 24/7 operation.",
    isService: true,
    specs: [
      { label: "BILLBOARD CODE", value: "Billboard-LED-X1" },
      { label: "Origin", value: "Accra" },
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
  const [relatedCashewProducts, setRelatedCashewProducts] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [removedProductIds, setRemovedProductIds] = useState<number[]>([]);
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');

  // Review states
  const { data: session } = useSession();
  const [reviewsData, setReviewsData] = useState<any>({ reviews: [], totalReviews: 0, averageRating: 0, ratingCounts: {5:0, 4:0, 3:0, 2:0, 1:0} });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', authorName: '', authorEmail: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Auto-populate when session loads
  useEffect(() => {
    if (session?.user) {
      setReviewForm(prev => ({
        ...prev,
        authorName: session.user?.name || '',
        authorEmail: session.user?.email || ''
      }));
    }
  }, [session]);

  const fetchReviewsData = async (type: string, refId: number) => {
    const res = await getReviews(type, refId);
    if (res.success && res.data) {
      setReviewsData(res.data);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.authorName || !reviewForm.authorEmail || !reviewForm.comment) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const pType = typeParam === "billboard" ? "billboard" : "product";
      const res = await submitReview({
        itemType: pType,
        referenceId: Number(id),
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        authorName: reviewForm.authorName,
        authorEmail: reviewForm.authorEmail
      });
      if (res.success) {
        toast.success(res.message);
        setReviewForm(prev => ({ ...prev, comment: '', rating: 5 })); // reset form but keep name/email
        fetchReviewsData(pType, Number(id)); // refresh list
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      if (id) {
        setLoading(true);

        if (typeParam !== "billboard") {
          // First try to fetch as a honey/product from the products table
          const honeyRes = await getProduct(Number(id));
          if (honeyRes.success && honeyRes.data) {
            const h = honeyRes.data as any;
            setProduct({
            id: h.id,
            name: h.name,
            price: (function() {
              const p = Number(h.pricePerUnit) || 0;
              let multiplier = 1;
              let pkgName = "Unit";
              
              if (h.packagingType === "drum") pkgName = "Drum";
              else if (h.packagingType === "bucket") pkgName = "Bucket";
              else if (h.packagingType === "container") pkgName = "IBC Tote";
              else if (h.packagingType === "bottle") pkgName = "Bottle";
              else if (h.packagingType) pkgName = h.packagingType.charAt(0).toUpperCase() + h.packagingType.slice(1);
              
              if (h.priceUnitType === 'per_kg' && h.packagingSize) {
                const matchKg = h.packagingSize.match(/(\d+(?:\.\d+)?)kg/i);
                if (matchKg) multiplier = Number(matchKg[1]);
              } else if (h.priceUnitType === 'per_liter' && h.packagingSize) {
                const matchL = h.packagingSize.match(/(\d+(?:\.\d+)?)L/i);
                if (matchL) multiplier = Number(matchL[1]);
              }
              
              const finalPrice = p * multiplier;
              return `GH₵ ${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${pkgName}`;
            })(),
            rating: 5,
            reviews: 0,
            sku: h.slug,
            image: h.featureImage || "/cashew.png",
            gallery: [h.featureImage, ...(h.galleryImages || [])].filter(Boolean),
            category: h.category,
            description: h.description,
            fullDescription: h.description,
            isService: false,
            specs: [
              {
                label: "Category",
                value:
                  h.category === "raw" ? "Raw Honey" :
                  h.category === "processed" ? "Processed Honey" :
                  h.category === "organic" ? "Organic Certified Honey" :
                  h.category === "wild" ? "Wild Honey" :
                  h.category
              },
              {
                label: "Packaging",
                value:
                  h.packagingType === "bottle" ? "Glass Bottles" :
                  h.packagingType === "jerrycan" ? "Plastic Jerrycans" :
                  h.packagingType === "bucket" ? "Food-grade Buckets" :
                  h.packagingType === "drum" ? "Steel Drums" :
                  h.packagingType === "container" ? "IBC Totes" :
                  h.packagingType
              },
              { label: "Size",          value: h.packagingSize },
              { label: "Minimum Order",           value: `${h.moqValue} ${h.moqUnit}` },
              {
                label: "Stock Status",
                value:
                  h.stockStatus === "in_stock" ? "In Stock" :
                  h.stockStatus === "low_stock" ? "Low Stock Warning" :
                  h.stockStatus === "out_of_stock" ? "Out of Stock" :
                  h.stockStatus
              },
              (function() {
                const p = Number(h.pricePerUnit) || 0;
                let multiplier = 1;
                let pkgName = "Unit";
                
                if (h.packagingType === "drum") pkgName = "Drum";
                else if (h.packagingType === "bucket") pkgName = "Bucket";
                else if (h.packagingType === "container") pkgName = "IBC Tote";
                else if (h.packagingType === "bottle") pkgName = "Bottle";
                else if (h.packagingType) pkgName = h.packagingType.charAt(0).toUpperCase() + h.packagingType.slice(1);
                
                // Extract numeric weight/volume to calculate full package price
                if (h.priceUnitType === 'per_kg' && h.packagingSize) {
                  const matchKg = h.packagingSize.match(/(\d+(?:\.\d+)?)kg/i);
                  if (matchKg) multiplier = Number(matchKg[1]);
                } else if (h.priceUnitType === 'per_liter' && h.packagingSize) {
                  const matchL = h.packagingSize.match(/(\d+(?:\.\d+)?)L/i);
                  if (matchL) multiplier = Number(matchL[1]);
                }
                
                const finalPrice = p * multiplier;
                return {
                  label: `Unit Price/${pkgName}`,
                  value: `GH₵ ${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                };
              })(),
              {
                label: "Warehouse",
                value:
                  h.warehouse === "accra_warehouse" ? "Accra Industrial Port Site" :
                  h.warehouse === "kumasi_hub" ? "Kumasi Sourcing Facility" :
                  h.warehouse === "tema_cold" ? "Tema Harbour Cold Vault" :
                  h.warehouse || "—"
              },
              { label: "Processing",    value: h.processingTime || "—" },
            ],
          });
          // Fetch other honey products for comparison
          getCashewProducts().then((allRes) => {
            if (allRes.success && allRes.data) {
              const others = (allRes.data as any[])
                .filter((p) => p.id !== Number(id))
                .slice(0, 5);
              setRelatedCashewProducts(others);
            }
          });

          await fetchReviewsData("product", Number(id));
          setLoading(false);
          return;
        }
        } // End of if (typeParam !== "billboard")

        // Otherwise try as a billboard
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
            price: `GH₵ ${Number(b.weeklyRate).toLocaleString()}`,
            rating: 5,
            reviews: 0, // will be updated dynamically
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
        
        // Fetch real reviews
        await fetchReviewsData(typeParam === "billboard" ? "billboard" : "product", Number(id));

        setLoading(false);
      }
    }

    loadData();
  }, [id, typeParam]);

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
        <div className="w-12 h-12 border-4 border-[#cba892] border-t-transparent rounded-full animate-spin" />
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
          title={product.isService
            ? product.name.split(' ').slice(0, 2).join(' ').toUpperCase()
            : product.name.split(' ').slice(0, 3).join(' ').toUpperCase()}
          highlightTitle={product.isService
            ? product.name.split(' ').slice(2).join(' ').toUpperCase()
            : product.name.split(' ').slice(3).join(' ').toUpperCase()}
          backgroundImage={product.image}
          breadcrumbTitle="Products"
          highlightColor={product.isService ? "#b8b3b4" : "#cba892"}
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
                    className={`w-full aspect-square bg-[#f6f6f6] border ${activeImage === img ? "border-[#9c4921]" : "border-gray-100"} hover:border-[#9c4921] transition-all p-2 flex items-center justify-center ${activeImage === img ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
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
                        <Star key={i} className={`w-3.5 h-3.5 ${i < (reviewsData.totalReviews > 0 ? Math.round(reviewsData.averageRating) : 5) ? "text-[#9c4921] fill-[#9c4921]" : "text-gray-200"}`} />
                      ))}
                    </div>
                    <span className="text-[13px] text-gray-400 font-medium">({reviewsData.totalReviews} reviews)</span>
                  </div>
                </div>



                {/* Specs Table — works for both honey and billboard */}
                {product.specs && product.specs.length > 0 && (
                  <div className="rounded-[12px] overflow-hidden border border-gray-100 mb-8 shadow-sm">
                    {product.specs.map((spec: any, i: number) => (
                      <div
                        key={i}
                        className={`flex justify-between items-center px-6 py-3.5 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-5 flex justify-center">
                            {spec.label === "BILLBOARD CODE"   ? <Hash className="w-4 h-4 text-[#cba892]" /> :
                             (spec.label === "Location" || spec.label === "Origin") ? <MapPin className="w-4 h-4 text-[#cba892]" /> :
                             spec.label === "Duration"         ? <Calendar className="w-4 h-4 text-[#cba892]" /> :
                             spec.label === "Display Type"     ? <Monitor className="w-4 h-4 text-[#cba892]" /> :
                             spec.label === "Format"           ? <Layout className="w-4 h-4 text-[#cba892]" /> :
                             spec.label === "Dimensions (W×H)" ? <Monitor className="w-4 h-4 text-[#cba892]" /> :
                             spec.label === "Resolution"       ? <Star className="w-4 h-4 text-[#cba892]" /> :
                             spec.label === "Brightness"       ? <Sun className="w-4 h-4 text-[#cba892]" /> :
                             spec.label === "AVAILABLE SLOT"   ? <CheckCircle2 className="w-4 h-4 text-[#cba892]" /> :
                             spec.label === "Category"         ? <Tag className="w-4 h-4 text-[#cba892]" /> :
                             spec.label === "Packaging"        ? <Package className="w-4 h-4 text-[#cba892]" /> :
                             spec.label === "Size"             ? <Hash className="w-4 h-4 text-[#cba892]" /> :
                             spec.label === "Minimum Order"              ? <ShoppingCart className="w-4 h-4 text-[#cba892]" /> :
                             spec.label === "Stock"            ? <Activity className="w-4 h-4 text-[#cba892]" /> :
                             spec.label === "Stock Status"     ? <CheckCircle2 className="w-4 h-4 text-[#cba892]" /> :
                             spec.label === "Price"            ? <DollarSign className="w-4 h-4 text-[#cba892]" /> :
                             spec.label === "Warehouse"        ? <MapPin className="w-4 h-4 text-[#cba892]" /> :
                             spec.label === "Processing"       ? <Clock className="w-4 h-4 text-[#cba892]" /> :
                             <Hash className="w-4 h-4 text-[#cba892]" />}
                          </div>
                          <span className="text-gray-400 font-bold text-[12px] uppercase tracking-wide">{spec.label}</span>
                        </div>
                        <span className="text-[#1a1a1a] font-bold text-[14px]">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {product.isService ? (
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Link 
                      href={session ? `/billboard-booking?hallId=${product.id}` : `/login?callbackUrl=${encodeURIComponent(`/billboard-booking?hallId=${product.id}`)}`} 
                      className="flex-1"
                    >
                      <button className="w-full h-14 bg-[#b8b3b4] text-white px-8 font-bold text-[15px] rounded-full transition-all hover:opacity-90 flex items-center justify-center whitespace-nowrap">
                        BOOK NOW
                      </button>
                    </Link>
                    <button className="flex-1 h-14 bg-white border border-[#666] text-black px-8 font-bold text-[15px] rounded-full transition-all hover:bg-gray-50 flex items-center justify-center gap-2 whitespace-nowrap">
                      <div className="w-5 h-5 bg-[#007aff] rounded-full flex items-center justify-center p-1 shrink-0">
                        <MessageCircle className="w-full h-full text-white" />
                      </div>
                      Chat Now
                    </button>
                  </div>
                ) : (
                  <div className="mb-8">
                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="flex-1 h-14 bg-[#9c4921] hover:bg-[#7a391a] text-white font-black text-[13px] uppercase tracking-widest rounded-full transition-all duration-300 flex items-center justify-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Ask Latest Price
                      </button>
                      <Link 
                        href={session ? `/shipping?productName=${encodeURIComponent(product.name)}&productImage=${encodeURIComponent(product.image)}&productLocation=${encodeURIComponent(product.specs?.find((s: any) => s.label === "Warehouse")?.value || "Kumasi")}&productId=${product.id}` : `/login?callbackUrl=${encodeURIComponent(`/shipping?productName=${encodeURIComponent(product.name)}&productImage=${encodeURIComponent(product.image)}&productLocation=${encodeURIComponent(product.specs?.find((s: any) => s.label === "Warehouse")?.value || "Kumasi")}&productId=${product.id}`)}`} 
                        className="flex-1 flex"
                      >
                        <button className="w-full h-14 bg-black hover:bg-[#1a1a1a] text-white font-black text-[13px] uppercase tracking-widest rounded-full transition-all duration-300 flex items-center justify-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Request Quote
                        </button>
                      </Link>
                    </div>
                  </div>
                )}


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

        </div>

        {/* Unified Documentation Box */}
        <div className="w-full bg-[#fff5eb]">
          <div className="max-w-[1500px] mx-auto px-1 py-10 sm:px-0">
            <div className="bg-white">
              {/* Tab Navigation (Inside Box) */}
              <div className="border-b border-[#dbdbdb]">
                <div className="flex w-full overflow-x-auto no-scrollbar">
                  {[
                    { id: "description", label: "Description" },
                    { id: "specs", label: "Additional information" },
                    { id: "reviews", label: `Reviews (${reviewsData.totalReviews})` },
                    { id: "shipping", label: product?.isService ? "Map" : "Shipping Policy" }
                  ].map((tab, index) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-3.5 px-4 text-[15px] font-bold transition-all relative whitespace-nowrap text-center ${index !== 0 ? 'border-l border-[#dbdbdb]' : ''} ${
                        activeTab === tab.id ? "bg-[#8b4513] text-white" : "bg-white text-gray-800 hover:text-black hover:bg-gray-50/50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content Area (Shared Padding) */}
              <div className="p-6 sm:p-8">
              {activeTab === "description" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {/* Cinematic Banner */}
                  <div className="relative w-full aspect-[1600/586] overflow-hidden mb-12 shadow-sm rounded-sm">
                    <Image
                      src={product.image || (product.isService ? "/billboards/bill_boards1.webp" : "/cashew.png")}
                      alt={product.name || "Product Banner"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-10 text-left">
                    <div>
                      <h3 className="text-[18px] font-bold text-gray-900 mb-5 uppercase tracking-tight">
                        {product.isService ? "BILLBOARD DESCRIPTION" : `${product.name.toUpperCase()} — PRODUCT DESCRIPTION`}
                      </h3>
                      <p className="text-[#666] leading-[1.8] text-[14px] mb-8 whitespace-pre-wrap">
                        {product.description || (product.isService ? "No description available for this billboard." : "No description available for this product.")}
                      </p>
                    </div>

                    <div className="pt-10 border-t border-gray-200">
                      <p className="text-[12px] text-gray-400 italic leading-relaxed">
                        {product.isService ? (
                          "led billboard, digital advertising, outdoor media, high brightness led, advertising display, billboard rental, electronic signage, large format display, p6 led, p8 led, p10 led, billboard campaign."
                        ) : (
                          "cashew nuts, premium cashews, roasted cashews, raw cashews, cashew kernels, export quality, raw honey, fesh honey, honey in fresh, pure honey, indigenious honey, honey dabur, honey in fresh 1kg, dabur honey 500gm, wild honey, natural honey, forest honey."
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "specs" && (
                <div className="animate-in fade-in duration-500 overflow-hidden w-full">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      {product.specs.map((spec: any, i: number) => (
                        <tr key={i} className={`${i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'} border-b border-[#dbdbdb]`}>
                          <th className="px-8 py-5 font-bold text-gray-800 text-[14px] w-1/2">{spec.label}</th>
                          <td className="px-8 py-5 text-gray-600 text-[14px] text-right font-medium">{spec.value}</td>
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
                      <h2 className="text-[20px] font-bold mb-6">{reviewsData.totalReviews} reviews for <span>{product.name}</span></h2>
                      <div className="flex items-center gap-6 mb-8">
                        <div className="text-[48px] font-black text-[#cba892]">
                          {reviewsData.averageRating.toFixed(2)}
                        </div>
                        <div>
                          <div className="flex gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < (reviewsData.totalReviews > 0 ? Math.round(reviewsData.averageRating) : 5) ? "fill-[#cba892] text-[#cba892]" : "text-gray-200"}`} />
                            ))}
                          </div>
                          <div className="text-sm text-gray-400 font-bold uppercase tracking-wider">out of 5 stars</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = reviewsData.ratingCounts[rating as keyof typeof reviewsData.ratingCounts] || 0;
                          const percentage = reviewsData.totalReviews > 0 ? (count / reviewsData.totalReviews) * 100 : 0;
                          return (
                            <div key={rating} className="flex items-center gap-4 text-sm font-bold text-gray-900">
                              <div className="w-4">{rating}</div>
                              <Star className="w-3.5 h-3.5 fill-[#cba892] text-[#cba892]" />
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#cba892] transition-all" style={{ width: `${percentage}%` }} />
                              </div>
                              <div className="w-4 text-gray-400">{count}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Review Form */}
                    <div className="border border-gray-200 p-8 rounded-sm">
                      <h3 className="text-xl font-bold mb-6">Add a review</h3>
                      
                      {/* Interactive Star Selection */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm font-bold text-gray-700 mr-2">Your Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                            className={`w-5 h-5 cursor-pointer transition-colors ${star <= reviewForm.rating ? "fill-[#cba892] text-[#cba892]" : "text-gray-300"}`} 
                          />
                        ))}
                      </div>

                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            placeholder="Name *" 
                            value={reviewForm.authorName}
                            onChange={(e) => setReviewForm(prev => ({ ...prev, authorName: e.target.value }))}
                            required
                            disabled={!!session?.user?.name}
                            className="p-4 border border-gray-200 focus:border-black outline-none text-sm bg-white disabled:bg-gray-50 disabled:text-gray-500" 
                          />
                          <input 
                            type="email" 
                            placeholder="Email *" 
                            value={reviewForm.authorEmail}
                            onChange={(e) => setReviewForm(prev => ({ ...prev, authorEmail: e.target.value }))}
                            required
                            disabled={!!session?.user?.email}
                            className="p-4 border border-gray-200 focus:border-black outline-none text-sm bg-white disabled:bg-gray-50 disabled:text-gray-500" 
                          />
                        </div>
                        <textarea 
                          placeholder="Your Review *" 
                          rows={6} 
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                          required
                          className="w-full p-4 border border-gray-200 focus:border-black outline-none text-sm bg-white"
                        ></textarea>
                        <button 
                          type="submit"
                          disabled={isSubmittingReview}
                          className="bg-black text-white px-10 py-4 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-[#9c4921] hover:text-black transition-all disabled:opacity-50"
                        >
                          {isSubmittingReview ? "Submitting..." : "Submit Review"}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* List of Reviews */}
                  {reviewsData.reviews.length > 0 && (
                    <div className="mt-12 space-y-6">
                      <h3 className="text-lg font-bold text-[#1a1a1a] mb-6">Customer Feedback</h3>
                      {reviewsData.reviews.map((review: any) => (
                        <div key={review.id} className="p-6 border border-gray-100 rounded-sm bg-white shadow-sm flex flex-col sm:flex-row gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                            <span className="text-gray-500 font-bold uppercase">{review.authorName.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-[#1a1a1a]">{review.authorName}</h4>
                              <span className="text-xs text-gray-400 font-medium">
                                {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex gap-0.5 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-[#cba892] text-[#cba892]" : "text-gray-200"}`} />
                              ))}
                            </div>
                            <p className="text-[#666] text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}


              {activeTab === "shipping" && (
                <div className="animate-in fade-in duration-500">
                  {product.isService ? (
                    /* Billboard: keep the location map */
                    <div className="w-full h-[550px] rounded-sm border border-gray-200 overflow-hidden relative">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://maps.google.com/maps?ll=${product.latitude},${product.longitude}&z=${mapZoom}&t=m&hl=en&output=embed`}
                        className="w-full h-full pointer-events-none"
                        allowFullScreen
                      ></iframe>
                      
                      {/* Transparent overlay to capture clicks and prevent panning */}
                      <div className="absolute inset-0 z-10"></div>
                      
                      {/* Bouncing Custom Marker */}
                      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none pb-8">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl animate-bounce">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335" />
                        </svg>
                      </div>

                      <div className="absolute top-3 right-3 flex flex-col gap-2 z-30">
                        <button type="button" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-md hover:bg-gray-50 border border-gray-200 transition-all text-black" onClick={(e) => { e.preventDefault(); setMapZoom(prev => Math.min(prev + 1, 21)); }}>
                          <Plus className="w-5 h-5" />
                        </button>
                        <button type="button" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-md hover:bg-gray-50 border border-gray-200 transition-all text-black" onClick={(e) => { e.preventDefault(); setMapZoom(prev => Math.max(prev - 1, 0)); }}>
                          <Minus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Product: shipping policy */
                    <div className="max-w-[800px] space-y-10 text-left">
                      <div>
                        <h3 className="text-[18px] font-black text-[#1a1a1a] uppercase tracking-tight mb-1">Shipping Policy</h3>
                        <p className="text-[13px] text-gray-400 font-bold uppercase tracking-wider mb-8">Export & Delivery Information</p>
                      </div>

                      {[
                        {
                          title: "Order Processing",
                          body: "All orders are processed within 2–5 business days after payment confirmation. You will receive an email notification with your shipment tracking details once your order has been dispatched from our warehouse."
                        },
                        {
                          title: "Domestic Delivery (Ghana)",
                          body: "We deliver nationwide across Ghana. Standard delivery takes 3–7 business days depending on your location. Express delivery (1–2 business days) is available for Accra, Kumasi, and Tema at an additional cost."
                        },
                        {
                          title: "International Export",
                          body: "We ship to over 30 countries across Europe, Asia, North America, and the Middle East. International orders are shipped via sea freight or air freight depending on order volume and destination. Estimated transit times range from 7 to 30 business days."
                        },
                        {
                          title: "Minimum Order",
                          body: "Export orders must meet the minimum order quantity stated on the product listing. Smaller quantities may be accommodated for sample orders — please contact us directly to arrange a sample shipment."
                        },
                        {
                          title: "Customs & Import Duties",
                          body: "International buyers are responsible for all customs duties, import taxes, and any fees imposed by the destination country. We will provide all necessary export documentation including phytosanitary certificates, certificate of origin, and quality test reports."
                        },
                        {
                          title: "Packaging & Food Safety",
                          body: "All products are packed in food-grade, export-compliant packaging. Honey and shea butter are sealed to preserve freshness and meet international food safety standards (HACCP, FDA, EU regulations)."
                        },
                      ].map(({ title, body }, i) => (
                        <div key={i} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                          <div className="flex items-start gap-4">
                            <span className="mt-1 w-6 h-6 rounded-full bg-[#9c4921] flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-black text-black">{i + 1}</span>
                            </span>
                            <div>
                              <h4 className="text-[14px] font-black text-[#1a1a1a] uppercase tracking-wide mb-2">{title}</h4>
                              <p className="text-[13px] text-gray-500 leading-[1.8]">{body}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="bg-[#fffbea] border border-[#9c4921]/40 rounded-sm p-6">
                        <p className="text-[12px] font-black text-[#1a1a1a] uppercase tracking-widest mb-1">Need a custom shipping arrangement?</p>
                        <p className="text-[13px] text-gray-500">Contact our export team directly and we will tailor a logistics plan to fit your order size and destination.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-[1400px]">
          {/* Quick Comparison / Related Products Section */}
          <div className="pt-20 border-t border-gray-100 mt-24">
            <h2 className="text-[28px] font-bold text-gray-900 text-center mb-8 tracking-tight">
              Quick Comparison
            </h2>

            {!product.isService && relatedCashewProducts.length > 0 ? (
              (() => {
                const formatPriceClean = (priceStr: string) => {
                  if (!priceStr) return "";
                  return priceStr.replace(/\.00/g, "").replace(/-/g, "–");
                };

                let currentOrigPrice = "";
                let currentPrice = product.price;
                if (product.name.includes("Zandu")) {
                  currentOrigPrice = "GH₵ 25.00";
                  currentPrice = "GH₵ 22.00";
                } else if (product.name.includes("Lion Kashmir")) {
                  currentOrigPrice = "GH₵ 30.00";
                  currentPrice = "GH₵ 28.00";
                } else if (product.name.includes("24 Mantra")) {
                  currentPrice = "GH₵ 18.00 - GH₵ 20.00";
                } else if (product.name.includes("World'S No.1")) {
                  currentPrice = "GH₵ 17.00 - GH₵ 24.00";
                } else if (product.name.includes("Glass Jar")) {
                  currentPrice = "GH₵ 29.00";
                } else if (product.name.includes("Coorg Essence")) {
                  currentPrice = "GH₵ 35.00";
                }

                // Unified list of products for comparison (current product first)
                const rawCompareList = [
                  {
                    id: product.id,
                    name: product.name,
                    image: product.image || "/cashew.png",
                    price: currentPrice,
                    originalPrice: currentOrigPrice,
                    rating: product.rating || 5,
                    stockQuantity: product.specs?.find((s: any) => s.label === "Stock Status")?.value || "",
                    packagingSize: product.specs?.find((s: any) => s.label === "Size")?.value || "",
                    packagingUnit: currentPrice.includes('/') ? currentPrice.split('/').pop()?.trim() : "Unit",
                    packagingType: product.specs?.find((s: any) => s.label === "Packaging")?.value || "",
                    sku: product.sku || "",
                    isCurrent: true,
                  },
                  ...relatedCashewProducts.map((p) => {
                    const pricePerUnit = Number(p.pricePerUnit) || 0;
                    let multiplier = 1;
                    let pkgName = "Unit";
                    
                    if (p.packagingType === "drum" || p.packagingType?.toLowerCase().startsWith("dru")) pkgName = "Drum";
                    else if (p.packagingType === "bucket") pkgName = "Bucket";
                    else if (p.packagingType === "container") pkgName = "IBC Tote";
                    else if (p.packagingType === "bottle") pkgName = "Bottle";
                    else if (p.packagingType) pkgName = p.packagingType.charAt(0).toUpperCase() + p.packagingType.slice(1);
                    
                    let pkgFull = p.packagingType;
                    if (p.packagingType === "bottle") pkgFull = "Glass Bottles";
                    else if (p.packagingType === "jerrycan") pkgFull = "Plastic Jerrycans";
                    else if (p.packagingType === "bucket") pkgFull = "Food-grade Buckets";
                    else if (p.packagingType === "drum") pkgFull = "Steel Drums";
                    else if (p.packagingType === "container") pkgFull = "IBC Totes";
                    
                    if (p.priceUnitType === 'per_kg' && p.packagingSize) {
                      const matchKg = p.packagingSize.match(/(\d+(?:\.\d+)?)kg/i);
                      if (matchKg) multiplier = Number(matchKg[1]);
                    } else if (p.priceUnitType === 'per_liter' && p.packagingSize) {
                      const matchL = p.packagingSize.match(/(\d+(?:\.\d+)?)L/i);
                      if (matchL) multiplier = Number(matchL[1]);
                    }
                    
                    const finalPrice = pricePerUnit * multiplier;
                    const priceVal = `GH₵ ${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${pkgName}`;
                    
                    let stockStatusLabel = "In Stock";
                    if (p.stockStatus === "low_stock") stockStatusLabel = "Low Stock";
                    else if (p.stockStatus === "out_of_stock") stockStatusLabel = "Out of Stock";
                    else if (p.stockStatus) stockStatusLabel = p.stockStatus.charAt(0).toUpperCase() + p.stockStatus.slice(1).replace('_', ' ');

                    return {
                      id: p.id,
                      name: p.name,
                      image: p.featureImage || "/cashew.png",
                      price: priceVal,
                      originalPrice: "",
                      rating: 5,
                      stockQuantity: stockStatusLabel,
                      packagingSize: p.packagingSize || "",
                      packagingUnit: pkgName,
                      packagingType: pkgFull || "",
                      sku: p.slug || "",
                      isCurrent: false,
                    };
                  })
                ];

                const compareList = rawCompareList.filter((p) => !removedProductIds.includes(p.id));

                if (compareList.length === 0) {
                  return (
                    <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
                      <p className="text-gray-400">All products removed from comparison.</p>
                      <button 
                        onClick={() => setRemovedProductIds([])}
                        className="mt-4 px-6 py-2 bg-[#9c4921] text-black text-xs font-black uppercase tracking-wider rounded-full hover:bg-black hover:text-white transition-colors"
                      >
                        Reset Comparison
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="comparison-table-container animate-in fade-in duration-300">
                    <table className="comparison-table">
                      <tbody>
                        {/* Name row */}
                        <tr className="row-even row-names">
                          <td className="cell-label" />
                          {compareList.map((p) => (
                            <td key={p.id} className="cell-value text-center">
                              <div className="relative group/name">
                                <Link href={`/products/${p.id}`} draggable="false" className="block pr-4">
                                  {p.name}
                                </Link>
                                <span 
                                  className="absolute top-0 right-0 text-[14px] leading-none text-gray-400 hover:text-red-500 cursor-pointer opacity-0 group-hover/name:opacity-100 transition-opacity font-normal"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setRemovedProductIds(prev => [...prev, p.id]);
                                  }}
                                  title="Remove from comparison"
                                >
                                  ×
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>

                        {/* Image row */}
                        <tr className="row-even row-images">
                          <td className="cell-label">Image</td>
                          {compareList.map((p) => (
                            <td key={p.id} className="cell-value text-center">
                              <Link href={`/products/${p.id}`} draggable="false">
                                <img 
                                  width="300" 
                                  height="300" 
                                  src={p.image} 
                                  alt={p.name} 
                                  draggable="false" 
                                  decoding="async" 
                                />
                              </Link>
                            </td>
                          ))}
                        </tr>

                        {/* Rating row */}
                        <tr className="row-odd row-ratings">
                          <td className="cell-label">Rating</td>
                          {compareList.map((p) => (
                            <td key={p.id} className="cell-value text-center">
                              <ProductComparisonRating productId={p.id} />
                            </td>
                          ))}
                        </tr>

                        {/* Price row */}
                        <tr className="row-even row-prices">
                          <td className="cell-label">Price</td>
                          {compareList.map((p) => (
                            <td key={p.id} className="cell-value text-center">
                              {formatPriceClean(p.price)}
                            </td>
                          ))}
                        </tr>

                        {/* Add to cart row */}
                        <tr className="row-odd row-buttons">
                          <td className="cell-label">Add to cart</td>
                          {compareList.map((p) => {
                            let btnText = "ADD TO CART";
                            let iconSvg = (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                              </svg>
                            );
                            
                            if (p.name.toLowerCase().includes("stirrer") || p.name.toLowerCase().includes("dipper")) {
                              btnText = "VIEW PRODUCTS";
                              iconSvg = (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                  <polyline points="15 3 21 3 21 9" />
                                  <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                              );
                            } else {
                              const sizeStr = p.packagingSize || "";
                              const sizes = sizeStr ? sizeStr.split(",").map((s: string) => s.trim()) : [];
                              const isVar = sizes.length > 1 || (p.isCurrent && product.specs?.find((s: any) => s.label === "Size")?.value?.split(",").length > 1);
                              if (isVar) {
                                btnText = "SELECT OPTIONS";
                                iconSvg = (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
                                  </svg>
                                );
                              }
                            }

                            return (
                              <td key={p.id} className="cell-value text-center">
                                <Link href={`/products/${p.id}`} className="comparison-btn">
                                  {iconSvg}
                                  {btnText}
                                </Link>
                              </td>
                            );
                          })}
                        </tr>

                        {/* Availability row */}
                        <tr className="row-even row-availability">
                          <td className="cell-label">Availability</td>
                          {compareList.map((p) => {
                            let stockText = "";
                            if (p.stockQuantity) {
                              const num = parseInt(p.stockQuantity);
                              if (!isNaN(num)) {
                                stockText = `${num} in stock`;
                              } else {
                                stockText = p.stockQuantity;
                              }
                            }
                            return (
                              <td key={p.id} className="cell-value text-center">
                                {stockText || ""}
                              </td>
                            );
                          })}
                        </tr>

                        {/* Weight row */}
                        <tr className="row-odd row-additional">
                          <td className="cell-label">Weight</td>
                          {compareList.map((p) => {
                            const sizeStr = p.packagingSize || "";
                            const sizes = sizeStr ? sizeStr.split(",").map((s: string) => s.trim()) : [];
                            let sizesToUse = sizes;
                            if (p.isCurrent) {
                              const currentSizeStr = product.specs?.find((s: any) => s.label === "Size")?.value || "";
                              if (currentSizeStr) {
                                sizesToUse = currentSizeStr.split(",").map((s: string) => s.trim());
                              }
                            }
                            return (
                              <td key={p.id} className="cell-value text-center">
                                {sizesToUse.length > 0 ? (
                                  <div>
                                    <span className="comparison-weight-value">
                                      {sizesToUse.map((s: string, idx: number) => (
                                        <span key={s}>
                                          <Link href="#">{s} / {p.packagingUnit}</Link>
                                          {idx < sizesToUse.length - 1 ? ", " : ""}
                                        </span>
                                      ))}
                                    </span>
                                  </div>
                                ) : null}
                              </td>
                            );
                          })}
                        </tr>

                        {/* Package type row */}
                        <tr className="row-even row-package-type">
                          <td className="cell-label">Package type</td>
                          {compareList.map((p) => (
                            <td key={p.id} className="cell-value text-center text-gray-500 text-sm">
                              {p.packagingType === "drum" ? "Drums" : 
                               p.packagingType === "bucket" ? "Buckets" : 
                               p.packagingType === "container" ? "IBC Totes" : 
                               p.packagingType === "bottle" ? "Bottles" : 
                               p.packagingType ? p.packagingType.charAt(0).toUpperCase() + p.packagingType.slice(1) : "—"}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })()
            ) : product.isService ? (
              /* Billboard: keep original grid */
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
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
                      {[Heart, Repeat].map((Icon, i) => (
                        <button key={i} className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#9c4921] hover:text-black transition-colors text-gray-400 pointer-events-auto">
                          <Icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <Link href={`/products/${b.id}`}>
                      <h3 className="text-[14px] font-black text-gray-900 leading-snug mb-3 hover:text-[#9c4921] transition-colors h-10 line-clamp-2 px-2">{b.name}</h3>
                    </Link>
                    <div className="flex justify-center gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < 4 ? "text-[#9c4921] fill-[#9c4921]" : "text-gray-200"}`} />)}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <span className="text-[16px] text-gray-900 font-black">GH₵{Number(b.weeklyRate).toLocaleString()}</span>
                    </div>
                    <Link href={`/products/${b.id}`}>
                      <button className="w-full bg-[#9c4921] hover:bg-black hover:text-white text-black py-4 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 group/btn">
                        <Eye className="w-3.5 h-3.5" />
                        VIEW DETAILS
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
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
                    (activeImage || product.image) === img ? "border-[#9c4921] scale-110" : "border-white/10 hover:border-white/30"
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
