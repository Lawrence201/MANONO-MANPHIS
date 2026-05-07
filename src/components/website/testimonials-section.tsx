import Image from "next/image";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Daniel Carter",
    role: "International Commodity Buyer",
    content: "Working with Manono Manphis has significantly improved our sourcing process. Their product quality, professionalism, and export coordination have been consistently reliable.",
    image: "/client_1.png"
  },
  {
    id: 2,
    name: "Sophia Bennett",
    role: "Marketing Manager",
    content: "Their digital billboard advertising services helped our campaign gain excellent visibility and audience reach. The booking process was smooth and professionally managed.",
    image: "/client_2.png"
  },
  {
    id: 3,
    name: "Michael Reynolds",
    role: "Global Trade Partner",
    content: "We value their commitment to quality supply and timely delivery. From product sourcing to logistics support, the experience has been efficient and dependable.",
    image: "/client_3.png"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-[#fcf9f6]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[#eea000] font-bold tracking-[0.4em] text-[10px] md:text-[11px] uppercase mb-4">Testimonials</p>
          <h2 className="text-3xl min-[480px]:text-4xl md:text-5xl font-black text-[#1a1a1a] leading-tight px-4 md:px-0">
            What Our <span className="text-[#eea000]">Clients Say</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-8 min-[480px]:p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all border border-gray-50 rounded-sm">
              <Quote className="w-10 h-10 md:w-12 md:h-12 text-[#1a1a1a] mb-6 md:mb-8 opacity-10" fill="currentColor" />
              
              <p className="text-gray-500 text-[14px] md:text-[15px] leading-relaxed mb-8 md:mb-10 italic px-2 md:px-0">
                "{testimonial.content}"
              </p>

              <div className="mt-auto">
                <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden mb-4 mx-auto border-2 border-[#eea000]/20">
                  <Image 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-[#1a1a1a] font-black text-sm md:text-base uppercase tracking-tight">{testimonial.name}</h4>
                <p className="text-[#eea000] font-bold text-[9px] md:text-[10px] uppercase tracking-widest mt-1">{testimonial.role}</p>
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
