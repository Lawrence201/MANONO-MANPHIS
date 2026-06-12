import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, ChevronRight, AlertTriangle, MessageSquare, 
  MapPin, Package, Truck, CheckCircle2, Clock, Check, CheckSquare
} from "lucide-react";
import Link from "next/link";
import { TopBar } from "@/components/website/top-bar";
import { WebsiteHeader } from "@/components/website/header";
import { WebsiteFooter } from "@/components/website/footer";
import { TrackingMap } from "@/components/website/tracking-map";

export default async function ShipmentProcessPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login?callbackUrl=/tracking");
  }

  const params = await searchParams;
  const reference = params.ref || "";
  
  const order = reference ? await prisma.exportOrder.findFirst({
    where: { 
      referenceNumber: reference,
      email: { equals: session.user.email as string, mode: "insensitive" }
    },
    include: { product: true }
  }) : null;

  if (!order) {
    return (
      <div className="min-h-screen bg-[#fdfaf7] flex flex-col">
        <TopBar />
        <WebsiteHeader />
        <main className="flex-1 py-20 flex flex-col items-center justify-center">
          <div className="text-center space-y-4">
            <Package className="w-16 h-16 text-gray-300 mx-auto" />
            <h1 className="text-2xl font-black text-[#1a1a1a] uppercase">Order Not Found</h1>
            <p className="text-gray-500 max-w-md mx-auto">We couldn't find any active shipment matching the tracking number "{reference}". Please verify the tracking number and try again.</p>
          </div>
        </main>
      </div>
    );
  }

  // Calculate some fake/real data based on the order
  const orderDate = new Date(order.createdAt);
  
  const getProgressStatus = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending") return 1;
    if (s === "approved") return 2;
    if (s === "processing") return 2;
    if (s === "shipped" || s === "in_transit") return 3;
    if (s === "delivered") return 4;
    return 1;
  };
  const currentStep = getProgressStatus(order.status);
  
  // Real timestamps from database
  const approvedDate = (order as any).approvedAt ? new Date((order as any).approvedAt) : orderDate;
  const processingDate = (order as any).processingAt ? new Date((order as any).processingAt) : null;
  const shippedDate = (order as any).shippedAt ? new Date((order as any).shippedAt) : null;
  const deliveredDate = (order as any).deliveredAt ? new Date((order as any).deliveredAt) : null;

  const isAir = (order.shippingType || "").toLowerCase().includes("air");

  let totalTimeString = isAir ? "Est. 5-7 Days" : "Est. 21-30 Days";
  if (deliveredDate && shippedDate) {
    const diffMs = deliveredDate.getTime() - shippedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      totalTimeString = `${diffDays} days, ${diffHours} hours`;
    } else if (diffHours > 0) {
      totalTimeString = `${diffHours} hours, ${diffMinutes} mins`;
    } else {
      totalTimeString = `${diffMinutes} mins`;
    }
  } else if (deliveredDate && approvedDate) {
    const diffMs = deliveredDate.getTime() - approvedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      totalTimeString = `${diffDays} days, ${diffHours} hours`;
    } else if (diffHours > 0) {
      totalTimeString = `${diffHours} hours, ${diffMinutes} mins`;
    } else {
      totalTimeString = `${diffMinutes} mins`;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf7]">
      {/* Top Navigation - Keep it minimal so the map can take space */}
      <div className="flex-none shadow-sm z-50">
        <TopBar />
        <WebsiteHeader />
      </div>

      <div className="flex-1 flex flex-col xl:flex-row relative">
        
        {/* MAP PANE (Top on mobile/tablet, Right on desktop) */}
        <div className="w-full h-[45vh] xl:h-auto xl:min-h-[800px] xl:flex-1 bg-[#e5e3df] relative xl:order-last overflow-hidden xl:border-l xl:border-gray-100 xl:shadow-[inset_10px_0_20px_rgba(0,0,0,0.01)] sticky top-0 xl:static z-0">
          <TrackingMap
            destinationCountry={order.destinationCountry}
            city={order.city}
            currentStep={currentStep}
            productName={order.product.name}
          />
        </div>

        {/* LEFT PANE: Information Panel (Bottom card on mobile/tablet) */}
        <div className="w-full xl:w-[680px] bg-white xl:border-r xl:border-gray-100 flex flex-col relative z-10 -mt-6 xl:mt-0 rounded-t-[32px] xl:rounded-none shadow-[0_-8px_30px_rgba(0,0,0,0.06)] xl:shadow-none pb-12 xl:pb-0 min-h-[60vh] xl:min-h-[800px]">
          
          {/* Mobile Drag Handle Indicator */}
          <div className="w-full flex justify-center pt-5 pb-1 xl:hidden">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
          </div>

          <div className="p-6 md:p-10 pt-2 xl:pt-10 flex-1">
            
            {/* Header Section */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <Link href="/tracking" className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                  <ChevronLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">{order.referenceNumber}</h1>
                {order.status === "delivered" ? (
                  <span className="bg-green-50 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Delivered
                  </span>
                ) : order.status === "pending" ? (
                  <span className="bg-[#fff7ed] text-[#ea580c] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending Review
                  </span>
                ) : (
                  <span className="bg-[#eef2ff] text-[#4f46e5] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Truck className="w-3 h-3" /> In Progress
                  </span>
                )}
                {order.status === "processing" && (
                  <span className="bg-[#fff7ed] text-[#ea580c] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Delay
                  </span>
                )}
              </div>
              
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 text-gray-400">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 text-gray-400">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-8 ml-12">
              Shipping date {orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · Order ID <span className="text-gray-900 font-bold underline decoration-gray-300 underline-offset-2">Order-{order.id}</span>
            </div>


            {/* Route Box */}
            <div className="border border-gray-200 rounded-xl p-6 mb-8 bg-gray-50/30">
              {/* Addresses */}
              <div className="flex justify-between items-start mb-10 relative">
                <div className="space-y-4 w-full">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0 relative z-10" />
                    <p className="text-sm font-medium text-gray-900">Tema Port, Ghana</p>
                  </div>
                  
                  {/* Vertical connector line */}
                  <div className="absolute left-[3px] top-4 bottom-8 w-[2px] bg-gray-200" />
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0 relative z-10" />
                    <p className="text-sm font-medium text-gray-900">{order.deliveryAddress || order.city}, {order.destinationCountry}</p>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 px-3 py-1 rounded-md text-xs font-bold text-[#4f46e5] flex items-center gap-2 shadow-sm flex-shrink-0">
                  <Package className="w-3 h-3" /> 
                  {isAir ? "Air Freight" : "Sea Freight"}
                </div>
              </div>

              {/* Horizontal Progress */}
              <div className="relative flex justify-between items-center px-2">
                {/* Background Line */}
                <div className="absolute left-6 right-6 h-1 bg-gray-200 rounded-full" />
                
                {/* Active Line */}
                <div 
                  className="absolute left-6 h-1 bg-[#1a1a1a] rounded-full transition-all duration-1000" 
                  style={{ width: currentStep >= 4 ? 'calc(100% - 48px)' : currentStep >= 3 ? '66%' : currentStep >= 2 ? '33%' : '0%' }}
                />

                {[
                  { step: 1, icon: Package },
                  { step: 2, icon: CheckSquare },
                  { step: 3, icon: Truck },
                  { step: 4, icon: MapPin },
                ].map((s, idx) => (
                  <div key={s.step} className="relative z-10">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                      currentStep >= s.step 
                        ? "bg-[#1a1a1a] border-[#1a1a1a] text-white" 
                        : "bg-white border-gray-200 text-gray-400"
                    )}>
                      <s.icon className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Estimates */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Time</p>
                <p className="text-sm font-bold text-[#1a1a1a]">{totalTimeString}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Departure Time</p>
                <p className="text-sm font-bold text-[#1a1a1a]">
                  {shippedDate ? `${shippedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })} ${shippedDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : 'Pending'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Expected Arrived</p>
                <p className="text-sm font-bold text-[#1a1a1a]">
                  {deliveredDate ? `${deliveredDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })} ${deliveredDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : 'TBD'}
                </p>
              </div>
            </div>



            {/* Vertical Status Timeline */}
            <div>
              <h2 className="text-lg font-bold text-[#1a1a1a] mb-6">Shipment Status</h2>
              
              <div className="space-y-0">
                {/* Step 1 */}
                <div className="flex gap-4 pb-8 relative">
                  <div className="absolute left-2.5 top-6 bottom-0 w-[1px] bg-gray-200" />
                  <div className={cn("w-5 h-5 rounded-full border-4 border-white flex-shrink-0 relative z-10 mt-1", currentStep >= 2 ? "bg-gray-800" : "bg-gray-300")} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={cn("font-bold text-sm", currentStep >= 2 ? "text-[#1a1a1a]" : "text-gray-500")}>
                        {currentStep >= 2 ? "Order Confirmed" : "Pending Review"}
                      </p>
                      {currentStep >= 2 && approvedDate ? (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <p className="text-xs text-gray-500">{approvedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} {approvedDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                        </>
                      ) : (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <p className="text-xs text-gray-400">Awaiting Approval</p>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {currentStep >= 2 ? "Your order has been approved and confirmed" : "Your order has been received and is waiting to be approved by our team"}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <MapPin className="w-3 h-3" /> Tema, Ghana
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 pb-8 relative">
                  <div className="absolute left-2.5 top-6 bottom-0 w-[1px] bg-gray-200" />
                  <div className={cn("w-5 h-5 rounded-full border-4 border-white flex-shrink-0 relative z-10 mt-1", currentStep >= 2 ? "bg-gray-800" : "bg-gray-200")} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={cn("font-bold text-sm", currentStep >= 2 ? "text-[#1a1a1a]" : "text-gray-400")}>Production</p>
                      {processingDate && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <p className="text-xs text-gray-500">{processingDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} {processingDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Your commodities are currently in production and packaging</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 pb-8 relative">
                  <div className="absolute left-2.5 top-6 bottom-0 w-[1px] bg-gray-200" />
                  <div className={cn("w-5 h-5 rounded-full border-4 border-white flex-shrink-0 relative z-10 mt-1", currentStep >= 3 ? "bg-gray-800" : "bg-gray-200")} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={cn("font-bold text-sm", currentStep >= 3 ? "text-[#1a1a1a]" : "text-gray-400")}>In Transit</p>
                      {shippedDate && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <p className="text-xs text-gray-500">{shippedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} {shippedDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Order has been handed over to the carrier and is in transit</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4 relative">
                  <div className={cn("w-5 h-5 rounded-full border-4 border-white flex-shrink-0 relative z-10 mt-1", currentStep >= 4 ? "bg-green-500" : "bg-gray-200")} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={cn("font-bold text-sm", currentStep >= 4 ? "text-green-600" : "text-gray-400")}>Delivered</p>
                      {deliveredDate && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <p className="text-xs text-gray-500">{deliveredDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} {deliveredDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Package has arrived at destination</p>
                </div>
              </div>
            </div>
          </div>

          </div>
        </div>
      </div>
      <WebsiteFooter />
    </div>
  );
}
