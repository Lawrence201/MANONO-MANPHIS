"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { getReviews } from "@/lib/actions/review-actions";

export function ProductComparisonRating({ productId }: { productId: number }) {
  const [rating, setRating] = useState(5); // Default to 5 stars if no reviews

  useEffect(() => {
    async function fetchRating() {
      try {
        const res = await getReviews("product", productId);
        if (res.success && res.data && res.data.totalReviews > 0) {
          setRating(Math.round(res.data.averageRating));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchRating();
  }, [productId]);

  return (
    <div className="comparison-stars flex justify-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-[18px] h-[18px] ${
            i < rating ? "text-[#ffcc00] fill-[#ffcc00]" : "text-gray-200 fill-transparent"
          }`}
        />
      ))}
    </div>
  );
}
