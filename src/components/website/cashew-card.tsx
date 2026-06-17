import Image from "next/image";
import Link from "next/link";

export function CashewCard({ product }: { product: any }) {
  return (
    <div className="relative mt-12 mb-4">
      <div className="relative bg-[#fcf9f5] border border-[#b87652] rounded-[24px] p-10 pt-12 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow duration-300">
        
        {/* Stock Status Pill Overlapping Top Border */}
        <div className="absolute top-0 -translate-y-1/2 left-10 bg-[#9c4921] text-white px-5 py-1.5 rounded-full text-[11px] font-bold tracking-wider z-20 shadow-sm uppercase">
          {product.stockStatus && product.stockStatus !== "—" ? product.stockStatus : "In Stock"}
        </div>

        {/* Floating Circular Image Top Right */}
        <div className="absolute -top-12 -right-6 max-[480px]:-top-8 max-[480px]:-right-2 w-40 h-40 max-[480px]:w-28 max-[480px]:h-28 rounded-full border-[6px] max-[480px]:border-[4px] border-[#dea882] overflow-hidden z-20 shadow-lg bg-white transition-all">
          <Image 
            src={product.image || "/cashew.png"} 
            alt={product.name} 
            fill
            className="object-cover scale-110"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col mt-4 max-[480px]:mt-6">
          <h3 className="text-[24px] max-[480px]:text-[20px] text-[#222] font-semibold leading-tight pr-16 max-[480px]:pr-20 transition-all">
            {product.name}
          </h3>
          
          <p className="mt-5 max-[480px]:mt-3 text-[14px] max-[480px]:text-[13px] text-gray-500 leading-[1.8] line-clamp-6 pr-4 max-[480px]:pr-0 transition-all">
            {product.description || `${product.name} are a deliciously crunchy and flavorful snack made from premium whole cashews. Carefully processed to perfection, these cashews retain their original nutrients, offering a rich source of vitamins and minerals.`}
          </p>
          
          {/* Price, MOQ, and Origin */}
          <div className="mt-8 max-[480px]:mt-5 flex items-center max-[480px]:flex-wrap gap-3 max-[480px]:gap-2 w-full transition-all">
            <div className="text-[14px] max-[480px]:text-[12px] font-bold text-[#333] whitespace-nowrap">
              {product.price || "Ask for Price"}
            </div>
            <div className="w-[1.5px] h-4 max-[480px]:h-3 bg-[#cba892] shrink-0" />
            <div className="text-[13px] max-[480px]:text-[11px] font-bold text-[#333] whitespace-nowrap">
              MOQ: {product.moq || "100"}
            </div>
            <div className="w-[1.5px] h-4 max-[480px]:h-3 bg-[#cba892] shrink-0" />
            <div className="text-[13px] max-[480px]:text-[11px] font-bold text-[#333] whitespace-nowrap truncate">
              Origin: {product.warehouse && product.warehouse !== "—" ? product.warehouse : "Accra"}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <Link href={`/cashews/${product.id || 'cashew'}`}>
            <button className="w-full bg-[#9c4921] hover:bg-[#7a391a] text-white py-3.5 rounded-xl font-bold text-[13px] tracking-wide transition-colors shadow-sm">
              View Details
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
