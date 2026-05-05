import Image from "next/image";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alicia Woods",
    role: "International Trade Consultant",
    content: "Manono Manphis has been our primary supplier for premium honey for over 3 years. Their commitment to quality and efficient logistics is unmatched in the Ghanaian market.",
    image: "/client_1.png"
  },
  {
    id: 2,
    name: "Shawn Romero",
    role: "Bulk Buyer, EU Markets",
    content: "The raw cashew nuts we source from Manono Manphis consistently meet our high moisture and size standards. A truly reliable partner for bulk agricultural exports.",
    image: "/client_2.png"
  },
  {
    id: 3,
    name: "Kristina Watson",
    role: "Organic Skincare Brand Owner",
    content: "Finding high-grade unrefined shea butter was a challenge until we partnered with Manono Manphis. Their traditionally processed butter is of exceptional quality.",
    image: "/client_3.png"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#fcf9f6]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#eea000] font-bold tracking-[0.4em] text-[10px] uppercase mb-4">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] leading-tight">
            What Our <span className="text-[#eea000]">Clients Say</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all border border-gray-50 rounded-sm">
              <Quote className="w-12 h-12 text-[#1a1a1a] mb-8 opacity-10" fill="currentColor" />
              
              <p className="text-gray-500 text-[15px] leading-relaxed mb-10 italic">
                "{testimonial.content}"
              </p>

              <div className="mt-auto">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4 mx-auto border-2 border-[#eea000]/20">
                  <Image 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-[#1a1a1a] font-black text-base uppercase tracking-tight">{testimonial.name}</h4>
                <p className="text-[#eea000] font-bold text-[10px] uppercase tracking-widest mt-1">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#eea000]" />
          <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
        </div>
      </div>
    </section>
  );
}
