"use client";

import { useState } from "react";
import { XCircle, Trash2 } from "lucide-react";
import { updateExportOrderStatus, deleteExportOrder } from "@/lib/actions/export-order-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ClientOrderActions({ orderId, status }: { orderId: number, status: string }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setIsUpdating(true);
    const res = await updateExportOrderStatus(orderId, "cancelled");
    setIsUpdating(false);
    if (res.success) {
      toast.success("Order cancelled successfully");
      router.refresh();
    } else {
      toast.error("Failed to cancel order");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this order?")) return;
    setIsUpdating(true);
    const res = await deleteExportOrder(orderId);
    setIsUpdating(false);
    if (res.success) {
      toast.success("Order deleted successfully");
      router.refresh();
    } else {
      toast.error("Failed to delete order");
    }
  };

  return (
    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
      {status === "pending" && (
        <button 
          onClick={handleCancel}
          disabled={isUpdating}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 disabled:opacity-50 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" />
          Cancel Order
        </button>
      )}
      <button 
        onClick={handleDelete}
        disabled={isUpdating}
        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 disabled:opacity-50 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete
      </button>
    </div>
  );
}
