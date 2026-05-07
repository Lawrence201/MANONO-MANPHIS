import { MapPin, Phone, Mail, Send } from "lucide-react";

export function ContactSection() {
  return (
    <section className="py-16 md:py-24 bg-white" id="contact">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* Left Column: Contact Info */}
          <div className="lg:w-1/3">
            <p className="text-[#eea000] font-bold tracking-[0.4em] text-[10px] md:text-[11px] uppercase mb-4">Contact Us</p>
            <h2 className="text-3xl min-[480px]:text-4xl font-black text-[#1a1a1a] uppercase leading-tight mb-6 md:mb-8">
              Get In <span className="text-[#eea000]">Touch</span>
            </h2>
            <p className="text-gray-500 text-[14px] md:text-[15px] leading-relaxed mb-10 md:mb-12 px-1 md:px-0">
              Have questions about our export process or want to request a bulk quote? 
              Our team is ready to assist you with your international trade needs.
            </p>

            <div className="space-y-6 md:space-y-8">
              <div className="flex items-start gap-4 md:gap-5">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#fcf9f6] rounded-sm flex items-center justify-center shrink-0 border border-gray-50">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#eea000]" />
                </div>
                <div>
                  <h4 className="text-[#1a1a1a] font-black text-[12px] md:text-sm uppercase tracking-tight mb-1">Our Location</h4>
                  <p className="text-gray-500 text-[13px] md:text-[14px]">Manono Manphis Lane, Accra, Ghana</p>
                </div>
              </div>

              <div className="flex items-start gap-4 md:gap-5">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#fcf9f6] rounded-sm flex items-center justify-center shrink-0 border border-gray-50">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-[#eea000]" />
                </div>
                <div>
                  <h4 className="text-[#1a1a1a] font-black text-[12px] md:text-sm uppercase tracking-tight mb-1">Phone Number</h4>
                  <p className="text-gray-500 text-[13px] md:text-[14px] font-bold">+233 24 123 4567</p>
                  <p className="text-gray-400 text-[11px] md:text-[12px]">Mon - Fri, 9am - 6pm</p>
                </div>
              </div>

              <div className="flex items-start gap-4 md:gap-5">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#fcf9f6] rounded-sm flex items-center justify-center shrink-0 border border-gray-50">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-[#eea000]" />
                </div>
                <div>
                  <h4 className="text-[#1a1a1a] font-black text-[12px] md:text-sm uppercase tracking-tight mb-1">Email Address</h4>
                  <p className="text-gray-500 text-[13px] md:text-[14px] font-bold">trade@manonomanphis.com</p>
                  <p className="text-gray-400 text-[11px] md:text-[12px]">We reply within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:w-2/3 bg-[#fcf9f6] p-6 min-[480px]:p-8 md:p-12 rounded-sm shadow-sm border border-gray-50 mt-4 lg:mt-0">
            <form className="space-y-5 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-white border border-gray-200 px-4 py-3 md:py-3.5 text-[13px] md:text-[14px] focus:outline-none focus:border-[#eea000] transition-colors rounded-sm shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-white border border-gray-200 px-4 py-3 md:py-3.5 text-[13px] md:text-[14px] focus:outline-none focus:border-[#eea000] transition-colors rounded-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">Subject</label>
                <input 
                  type="text" 
                  placeholder="Bulk Honey Export Inquiry"
                  className="w-full bg-white border border-gray-200 px-4 py-3 md:py-3.5 text-[13px] md:text-[14px] focus:outline-none focus:border-[#eea000] transition-colors rounded-sm shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">Your Message</label>
                <textarea 
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full bg-white border border-gray-200 px-4 py-3 md:py-3.5 text-[13px] md:text-[14px] focus:outline-none focus:border-[#eea000] transition-colors rounded-sm resize-none shadow-sm"
                ></textarea>
              </div>

              <button className="w-full md:w-auto bg-[#1a1a1a] text-white px-10 py-4 font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:bg-[#eea000] transition-all flex items-center justify-center gap-3 shadow-lg">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
