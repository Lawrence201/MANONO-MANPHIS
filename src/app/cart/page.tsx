"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { TopBar } from "@/components/website/top-bar";
import { WebsiteHeader } from "@/components/website/header";
import { WebsiteFooter } from "@/components/website/footer";
import { ArrowLeft, X } from "lucide-react";
import { FaCreditCard, FaBuildingColumns } from "react-icons/fa6";
import { getCart, removeFromCart, updateCartItemQuantity } from "@/lib/actions/cart-actions";
import { useSession, SessionProvider } from "next-auth/react";
import { createBillboardBooking } from "@/lib/actions/booking-actions";
import { submitExportOrder } from "@/lib/actions/export-actions";

interface CartItem {
  id: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  itemType: string;
  referenceId: number;
  details?: any;
}

function CartPageContent() {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank_transfer">("card");
  const [fullName, setFullName] = useState("Lawrence Antwi");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiration, setCardExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      if (res.success && res.data?.items) {
        setCartItems(res.data.items.map((item: any) => ({
          id: item.id.toString(),
          title: item.name,
          image: item.imagePath || "/product_honey_card.png",
          price: Number(item.price),
          quantity: item.quantity,
          itemType: item.itemType,
          referenceId: item.referenceId,
          details: item.details
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: string, val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 1) return;

    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity: num } : item))
    );

    const res = await updateCartItemQuantity(Number(id), num);
    if (!res.success) {
      toast.error(res.message || "Failed to update quantity");
      fetchCart();
    } else {
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const removeItem = async (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));

    const res = await removeFromCart(Number(id));
    if (res.success) {
      toast.success("Item removed from cart");
      window.dispatchEvent(new Event("cartUpdated"));
    } else {
      toast.error(res.message || "Failed to remove item");
      fetchCart();
    }
  };
  const selectedSubtotal = selectedCartItem ? selectedCartItem.price * selectedCartItem.quantity : 0;
  const taxAmount = selectedSubtotal * 0.1;
  const totalGHS = selectedSubtotal + taxAmount;

  const handleCheckout = async () => {
    if (!selectedCartItem) {
      toast.error("No product selected for checkout");
      return;
    }

    if (paymentMethod === "card") {
      if (!fullName.trim()) {
        toast.error("Please enter full name as displayed on card");
        return;
      }
      if (!cardNumber.trim()) {
        toast.error("Please enter your card number");
        return;
      }
      if (!cardExpiration.trim()) {
        toast.error("Please enter expiration date");
        return;
      }
      if (!cvv.trim() || cvv.length < 3) {
        toast.error("Please enter a valid 3-digit CVV");
        return;
      }
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Processing payment securely...");

    try {
      const email = session?.user?.email || "customer@example.com";
      const nameOfUser = fullName.trim() || session?.user?.name || "Lawrence Antwi";

      if (selectedCartItem.itemType === "billboard") {
        const details = selectedCartItem.details || {};
        const slots = Number(details.slotsRequested) || 1;
        const duration = Number(details.campaignDuration) || 1;

        const startDateStr = details.startDate || new Date().toISOString();
        let endDateStr = details.endDate;
        if (!endDateStr) {
          const start = new Date(startDateStr);
          start.setMonth(start.getMonth() + duration);
          endDateStr = start.toISOString();
        }

        const bookingPayload = {
          billboardId: Number(selectedCartItem.referenceId),
          fullName: details.fullName || nameOfUser,
          email: details.email || email,
          phone: details.phone || "0000000000",
          companyName: details.companyName || "Self",
          clientType: details.clientType || "individual",
          campaignTitle: selectedCartItem.title.split(" - ")[0] || "Campaign from Cart",
          campaignType: details.campaignType || "image",
          campaignDuration: duration,
          startDate: startDateStr,
          endDate: endDateStr,
          slotsRequested: slots,
          description: "Ordered and scheduled directly via Shopping Cart / Orders & Bookings.",
          advertFile: details.advertFile || selectedCartItem.image || undefined,
          totalPrice: Number(selectedCartItem.price),
          taxRate: 10,
          paymentMethod: paymentMethod === "card" ? "Credit / Debit Card" : "Bank Wire Transfer"
        };

        const result = await createBillboardBooking(bookingPayload);

        if (!result.success) {
          toast.error(result.error || "Failed to process database booking.", { id: toastId });
          setIsSubmitting(false);
          return;
        }
      } else {
        const orderPayload = {
          productId: Number(selectedCartItem.referenceId),
          buyerType: "individual",
          companyName: "Self",
          destinationCountry: "Ghana",
          city: "Accra",
          deliveryAddress: "Checkout directly via Orders & Bookings Page",
          stateRegion: "Accra",
          postalCode: "00000",
          email: email,
          phone: "0000000000",
          taxId: null,
          quantityRequested: Number(selectedCartItem.quantity),
          shippingType: "Standard Shipping",
          deliveryType: "Standard Delivery",
          pickupOption: "delivery",
          preferredDate: null,
          deliveryPriority: "standard",
          requiresFda: false,
          requiresPhyto: false,
          requiresOrganic: false,
          requiresOrigin: false,
          customsValue: Number(selectedCartItem.price * selectedCartItem.quantity),
          importRequirements: null,
          paymentMethod: paymentMethod === "card" ? "CreditCard" : "BankTransfer",
          depositRequired: "Full",
          billingAddress: "Same as shipping"
        };

        const result = await submitExportOrder(orderPayload);

        if (!result.success) {
          toast.error(result.message || "Failed to process database export order.", { id: toastId });
          setIsSubmitting(false);
          return;
        }
      }

      toast.success("Payment Received & Order Placed Successfully!", {
        id: toastId,
        description: `Your receipt for GH₵${totalGHS.toFixed(2)} has been sent to your email.`,
      });

      // Remove the specific item from the database cart
      await removeFromCart(Number(selectedCartItem.id));

      // Update local state
      setCartItems(prev => prev.filter(item => item.id !== selectedCartItem.id));
      setSelectedCartItem(null);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] selection:bg-[#eea000] selection:text-white flex flex-col font-sans">
      <TopBar />
      <WebsiteHeader />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-[1500px]">
        {/* Title */}
        <div className="text-center mb-20">
          <h1
            className="text-[42px] sm:text-[60px] md:text-[80px] lg:text-[110px] font-bold text-[#1a1a1a] tracking-[-0.02em] md:tracking-[-0.04em] uppercase leading-[1.0] sm:scale-x-[0.9] md:scale-x-[0.85] transform origin-center whitespace-nowrap"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Orders & Bookings
          </h1>
          {/* Breadcrumb - matches mockup font and spacing */}
          <div className="text-[13px] text-gray-500 mt-6 flex items-center justify-center gap-1">
            <Link href="/" className="hover:text-[#eea000] transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="font-semibold text-gray-800">Orders & Bookings</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-[#eea000] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 w-full">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#b1afae] hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-[#b1afae]/30 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Return To Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Cart items table and actions */}
            <div className={selectedCartItem ? "lg:col-span-2" : "lg:col-span-3"}>
              {/* Desktop Table Container */}
              <div className="hidden lg:block overflow-x-auto bg-white rounded-lg border border-gray-100 shadow-sm mb-6">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-[#fcfbf9] border-b border-gray-100 text-gray-500 text-[13px] font-semibold tracking-wider">
                      <th className="py-4 px-6 w-12"></th>
                      <th className="py-4 px-6 text-center">Product Image</th>
                      <th className="py-4 px-6">Product Title</th>
                      <th className="py-4 px-6 text-center">Price</th>
                      <th className="py-4 px-6 text-center">
                        {cartItems.every(i => i.itemType === "billboard") 
                          ? "Duration" 
                          : cartItems.some(i => i.itemType === "billboard") 
                            ? "Qty / Duration" 
                            : "Quantity"}
                      </th>
                      <th className="py-4 px-6 text-center">Total</th>
                      <th className="py-4 px-6 text-right">Checkout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cartItems.map((item) => (
                      <tr key={item.id} className={`text-gray-700 text-sm font-medium hover:bg-gray-50/50 transition-colors ${selectedCartItem?.id === item.id ? "bg-amber-50/10" : ""}`}>
                        {/* Remove item button */}
                        <td className="py-6 px-6 text-center">
                          <button
                            onClick={() => {
                              if (selectedCartItem?.id === item.id) {
                                setSelectedCartItem(null);
                              }
                              removeItem(item.id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <X className="w-5 h-5 stroke-[2.5px]" />
                          </button>
                        </td>

                        {/* Product Image */}
                        <td className="py-6 px-6 flex justify-center">
                          <div className="relative w-20 h-20 border border-gray-100 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                            {item.image.toLowerCase().includes('.mp4') || item.image.toLowerCase().includes('video') ? (
                              <video
                                src={item.image}
                                className="object-cover w-full h-full"
                                muted
                                playsInline
                              />
                            ) : item.image.toLowerCase().endsWith('.pdf') ? (
                              <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                                <span className="text-xs font-medium">PDF</span>
                              </div>
                            ) : (
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                                priority
                              />
                            )}
                          </div>
                        </td>

                        {/* Product Title */}
                        <td className="py-6 px-6 max-w-xs font-normal text-gray-800 text-[14px]">
                          {item.title}
                        </td>

                        {/* Price */}
                        <td className="py-6 px-6 text-center font-semibold text-gray-800 text-[14px]">
                          GH₵{item.price.toFixed(2)}
                        </td>

                        {/* Quantity / Duration */}
                        <td className="py-6 px-6 text-center">
                          {item.itemType === "billboard" ? (
                            <div className="font-semibold text-gray-800 text-[14px]">
                              {item.details?.campaignDuration || 1} {item.details?.durationUnit || (Number(item.details?.campaignDuration || 1) !== 1 ? 'Months' : 'Month')}
                            </div>
                          ) : (
                            <div className="inline-block">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                  updateQuantity(item.id, e.target.value);
                                  // If this item is currently selected, update its reference in selectedCartItem state too
                                  if (selectedCartItem?.id === item.id) {
                                    setSelectedCartItem(prev => prev ? { ...prev, quantity: parseInt(e.target.value, 10) || 1 } : null);
                                  }
                                }}
                                suppressHydrationWarning
                                className="w-16 h-10 border border-gray-200 rounded text-center font-medium text-gray-800 focus:outline-none focus:border-[#eea000] focus:ring-1 focus:ring-[#eea000] text-base"
                              />
                            </div>
                          )}
                        </td>

                        {/* Total */}
                        <td className="py-6 px-6 text-center font-bold text-gray-800 text-[14px]">
                          GH₵{(item.price * item.quantity).toFixed(2)}
                        </td>

                        {/* Checkout button */}
                        <td className="py-6 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCartItem(selectedCartItem?.id === item.id ? null : item);
                            }}
                            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${selectedCartItem?.id === item.id
                                ? "bg-[#eea000] text-white shadow-md shadow-amber-500/20"
                                : "bg-[#1f1e24] hover:bg-black text-white"
                              }`}
                          >
                            {selectedCartItem?.id === item.id ? "Selected" : "Checkout"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout (Hidden on Desktop) */}
              <div className="lg:hidden space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className={`bg-white rounded-xl border ${selectedCartItem?.id === item.id ? "border-[#373737]" : "border-gray-200"} shadow-sm p-5 relative transition-all`}>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => {
                        if (selectedCartItem?.id === item.id) setSelectedCartItem(null);
                        removeItem(item.id);
                      }}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-full p-2 transition-colors z-10"
                      title="Remove item"
                    >
                      <X className="w-4 h-4 stroke-[2.5px]" />
                    </button>

                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 border border-gray-100 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                        {item.image.toLowerCase().includes('.mp4') || item.image.toLowerCase().includes('video') ? (
                          <video src={item.image} className="object-cover w-full h-full" muted playsInline />
                        ) : item.image.toLowerCase().endsWith('.pdf') ? (
                          <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                            <span className="text-xs font-medium">PDF</span>
                          </div>
                        ) : (
                          <Image src={item.image} alt={item.title} fill className="object-cover" priority />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 pr-8">
                        <h3 className="font-semibold text-gray-800 text-[15px] leading-snug mb-1">{item.title}</h3>
                        <div className="text-gray-500 font-medium text-[13px] mb-2">Unit: GH₵{item.price.toFixed(2)}</div>
                        
                        {/* Quantity / Duration */}
                        {item.itemType === "billboard" ? (
                          <div className="inline-flex items-center bg-gray-50 border border-gray-100 px-2.5 py-1 rounded text-[13px] font-semibold text-gray-700">
                            {item.details?.campaignDuration || 1} {item.details?.durationUnit || (Number(item.details?.campaignDuration || 1) !== 1 ? 'Months' : 'Month')}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-[13px] font-medium">Qty:</span>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                updateQuantity(item.id, e.target.value);
                                if (selectedCartItem?.id === item.id) {
                                  setSelectedCartItem(prev => prev ? { ...prev, quantity: parseInt(e.target.value, 10) || 1 } : null);
                                }
                              }}
                              className="w-16 h-8 border border-gray-200 rounded-md text-center font-medium text-gray-800 text-sm focus:border-[#eea000] focus:ring-1 focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Total & Checkout Row */}
                    <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium text-[14px]">Total Amount</span>
                        <span className="font-bold text-gray-900 text-[16px]">GH₵{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setSelectedCartItem(selectedCartItem?.id === item.id ? null : item)}
                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                          selectedCartItem?.id === item.id
                            ? "bg-[#eea000] text-white scale-[0.98]"
                            : "bg-[#1a1a1a] text-white hover:bg-black shadow-md"
                        }`}
                      >
                        {selectedCartItem?.id === item.id ? "Selected for Checkout" : "Checkout Item"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Return to Shop link */}
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-[#eea000] font-semibold transition-colors text-[14px]"
              >
                <ArrowLeft className="w-4 h-4" />
                Return To Shop
              </Link>
            </div>

            {/* Right Column: Totals / Summary & Confirm Payment */}
            {selectedCartItem && (
              <div className="space-y-6 lg:col-span-1">

                {/* Pricing Details Card */}
                <div className="bg-[#fcfbf9] border border-gray-155 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <h3 className="font-bold text-gray-800 text-lg uppercase tracking-wider">
                      Order Details
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedCartItem(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      title="Close Checkout"
                    >
                      <X className="w-5 h-5 stroke-[2.5px]" />
                    </button>
                  </div>

                  <div className="bg-amber-50/70 text-amber-800 border border-amber-200/40 rounded-lg p-3 text-xs font-medium">
                    Checking out: <span className="font-bold">{selectedCartItem.title}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-500 font-medium">Original price</span>
                    <span className="text-gray-800 font-bold">GH₵{selectedSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  {selectedCartItem.itemType === "billboard" ? (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Campaign Duration</span>
                        <span className="text-gray-800 font-bold">
                          {selectedCartItem.details?.campaignDuration || 1} {selectedCartItem.details?.durationUnit || (Number(selectedCartItem.details?.campaignDuration || 1) !== 1 ? 'Months' : 'Month')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-2">
                        <span className="text-gray-500 font-medium">Slots Booked</span>
                        <span className="text-gray-800 font-bold">
                          {selectedCartItem.details?.slotsRequested || 1} Slot{Number(selectedCartItem.details?.slotsRequested || 1) !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-gray-500 font-medium">Quantity</span>
                      <span className="text-gray-800 font-bold">
                        {selectedCartItem.quantity} Item{selectedCartItem.quantity !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Tax</span>
                    <span className="text-gray-800 font-bold">GH₵{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  <div className="border-t border-gray-200/80 pt-4 mt-2 flex justify-between items-center">
                    <span className="text-base font-bold text-gray-800">Total</span>
                    <span className="text-xl font-extrabold text-[#eea000]">GH₵{totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Confirm Payment Details Card */}
                <div className="bg-white border border-gray-155 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">Confirm Payment Details</h3>
                      <p className="text-xs text-gray-500">Enter your payment credentials to securely schedule your campaign.</p>
                    </div>
                  </div>

                  {/* Choose Payment Method Tabs */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`py-3 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${paymentMethod === "card"
                          ? "border-[#1f1e24] bg-gray-50 text-gray-900 font-bold"
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                      <FaCreditCard className="w-3.5 h-3.5" /> Credit / Debit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bank_transfer")}
                      className={`py-3 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${paymentMethod === "bank_transfer"
                          ? "border-[#1f1e24] bg-gray-50 text-gray-900 font-bold"
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                      <FaBuildingColumns className="w-3.5 h-3.5" /> Bank Wire Transfer
                    </button>
                  </div>

                  {paymentMethod === "card" ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">
                          Full name (as displayed on card)*
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Lawrence Antwi"
                          className="border border-gray-200 rounded-lg p-3 text-[16px] focus:outline-none focus:border-[#eea000] focus:ring-1 focus:ring-[#eea000]"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">
                          Card number*
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="xxxx-xxxx-xxxx-xxxx"
                          className="border border-gray-200 rounded-lg p-3 text-[16px] focus:outline-none focus:border-[#eea000] focus:ring-1 focus:ring-[#eea000]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-gray-700">
                            Card expiration*
                          </label>
                          <input
                            type="text"
                            value={cardExpiration}
                            onChange={(e) => setCardExpiration(e.target.value)}
                            placeholder="MM/YY"
                            className="border border-gray-200 rounded-lg p-3 text-[16px] focus:outline-none focus:border-[#eea000] focus:ring-1 focus:ring-[#eea000]"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                            CVV*
                            <span title="3-digit security code on the back of your card" className="text-gray-400 cursor-help">
                              ℹ️
                            </span>
                          </label>
                          <input
                            type="text"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            placeholder="..."
                            maxLength={3}
                            className="border border-gray-200 rounded-lg p-3 text-[16px] focus:outline-none focus:border-[#eea000] focus:ring-1 focus:ring-[#eea000]"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleCheckout}
                        className="w-full mt-4 bg-[#1f1e24] hover:bg-black text-white font-bold tracking-wider py-4 rounded-md transition-all text-xs uppercase shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Processing..." : "Pay now"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      <div className="p-4 border border-gray-150 rounded-lg bg-gray-50/50 flex flex-col gap-3">
                        <div className="text-xs font-bold text-gray-800">Bank Wire details:</div>
                        <div className="grid grid-cols-[100px_1fr] gap-y-2 gap-x-2 text-xs">
                          <span className="text-gray-500">Bank:</span>
                          <span className="font-semibold text-gray-800">Glow-Financial Bank</span>
                          <span className="text-gray-500">Account Name:</span>
                          <span className="font-semibold text-gray-800">Manono Manphis Platform</span>
                          <span className="text-gray-500">Account Number:</span>
                          <span className="font-semibold text-gray-800 font-mono">0029-4829-1029-338</span>
                          <span className="text-gray-500">Routing Code:</span>
                          <span className="font-semibold text-gray-800 font-mono">GLOWGHAC</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleCheckout}
                        className="w-full bg-[#1f1e24] hover:bg-black text-white font-bold tracking-wider py-4 rounded-md transition-all text-xs uppercase shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Processing..." : "Pay now"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Payment Logos under the last card */}
                <div className="flex flex-col items-center gap-2 mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                    Guaranteed Safe And Secure Checkout
                  </span>
                  <div className="flex items-center justify-center gap-4">
                    <Image src="/visa.png" alt="Visa" width={40} height={25} className="object-contain h-6" />
                    <Image src="/master_card.png" alt="MasterCard" width={40} height={25} className="object-contain h-6" />
                    <Image src="/mtn.webp" alt="MTN" width={40} height={25} className="object-contain h-6" />
                    <Image src="/telecel.jpg" alt="Telecel" width={40} height={25} className="object-contain h-6" />
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </main>

      <WebsiteFooter />
    </div>
  );
}

export default function CartPage() {
  return (
    <SessionProvider>
      <CartPageContent />
    </SessionProvider>
  );
}
