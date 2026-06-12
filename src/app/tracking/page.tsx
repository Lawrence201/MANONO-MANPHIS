import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WebsiteHeader } from "@/components/website/header";
import { WebsiteFooter } from "@/components/website/footer";
import { TopBar } from "@/components/website/top-bar";
import { Package, Truck, Calendar, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ClientOrderActions } from "@/components/dashboard/client-order-actions";

export default async function TrackingDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/tracking");
  }

  const orders = await prisma.exportOrder.findMany({
    where: { 
      // Ensure we only match if they logged in with the same email they ordered with
      email: { equals: session.user.email as string, mode: "insensitive" } 
    },
    include: { product: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-[#fdfaf7]">
      <TopBar />
      <WebsiteHeader />

      <main className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-16 space-y-4">
            <h1 
              className="text-[48px] max-[450px]:text-[36px] min-[1029px]:text-[110px] font-bold text-[#1a1a1a] tracking-[-0.04em] uppercase leading-[1.0] min-[1029px]:scale-x-[0.85] transform origin-center max-[1028px]:px-4"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Your Shipments
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed text-sm">
              Welcome back, <span className="font-bold text-gray-900">{session.user.name}</span>. 
              Here you can track all your active and past orders in real-time.
            </p>
          </div>

          <div className="w-full">
            {orders.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-2">No Active Orders</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  You don't have any export orders linked to this email address yet. Once you place an order, it will appear here for tracking.
                </p>
                <div className="mt-8">
                  <Link href="/services" className="bg-[#b1afae] text-white px-8 py-3 font-black text-xs uppercase tracking-widest rounded-sm hover:opacity-90 transition-all shadow-lg shadow-[#b1afae]/30 inline-block">
                    Explore Services
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => {
                  const isDelivered = order.status === "delivered";
                  const isPending = order.status === "pending";
                  const statusColor = isDelivered ? "text-green-600 bg-green-50" : isPending ? "text-orange-600 bg-orange-50" : "text-[#0066cc] bg-blue-50";
                  const pName = order.product.name.toLowerCase();
                  const productAccent = pName.includes("honey") ? "#eea000" : pName.includes("cashew") ? "#9c4921" : "#6b7280";

                  return (
                    <div key={order.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-200 transition-all group bg-white flex flex-col">
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", statusColor)}>
                            {order.status}
                          </div>
                          <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-black text-[#1a1a1a] mb-1 line-clamp-1">
                          {order.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                          {order.quantityRequested.toString()} {order.unitMeasurement} • {order.shippingType}
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Truck className="w-4 h-4 flex-shrink-0" style={{ color: productAccent }} />
                            <span className="font-medium line-clamp-1 text-xs uppercase tracking-wider" style={{ color: productAccent }}>{order.destinationCountry}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-xs uppercase tracking-wider text-gray-900">REF: {order.referenceNumber}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
                        <Link 
                          href={`/tracking/process?ref=${order.referenceNumber}`}
                          className="flex items-center justify-center gap-2 w-full text-xs font-black uppercase tracking-widest text-[#ff4444] group-hover:text-red-700 transition-colors"
                        >
                          Track Shipment <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        
                        <ClientOrderActions orderId={order.id} status={order.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <WebsiteFooter />
    </div>
  );
}
