import Image from "next/image";
import Link from "next/link";
import { Search, Menu, ArrowUpRight, Hammer, Handshake, FileCheck } from "lucide-react";

export default function ConstructionPage() {
  return (
    <div className="min-h-screen relative font-sans selection:bg-[#FFC700] selection:text-black">
      {/* Navigation Bar */}
      <nav className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 w-[95%] max-w-[1500px] z-50 bg-[#313131] rounded-xl px-6 lg:px-10 py-5 flex items-center justify-between shadow-2xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0">
          <Image 
            src="/logo.PNG" 
            alt="Logo" 
            width={80} 
            height={80} 
            className="object-contain h-10 md:h-12 w-auto"
            priority
          />
          <span className="hidden min-[500px]:inline text-lg md:text-xl font-black text-white tracking-tight uppercase lg:-ml-2">
            MANONO <span className="text-[#FFD100]">MANPHIS</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden min-[900px]:flex items-center gap-10">
          <Link href="/" className="text-[15px] font-bold text-[#FFD100]">Home</Link>
          <Link href="/#about" className="text-[15px] font-bold text-white hover:text-[#FFD100] transition-colors">About</Link>
          <Link href="/services" className="text-[15px] font-bold text-white hover:text-[#FFD100] transition-colors">Services</Link>
          <Link href="/projects" className="text-[15px] font-bold text-white hover:text-[#FFD100] transition-colors">Projects</Link>
          <Link href="/blog" className="text-[15px] font-bold text-white hover:text-[#FFD100] transition-colors">Blog</Link>
          <Link href="/contact" className="text-[15px] font-bold text-white hover:text-[#FFD100] transition-colors">Contact</Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <Link href="/contact" className="hidden sm:flex items-center gap-2 bg-[#FFD100] text-black px-6 py-3 font-bold text-[15px] hover:bg-[#FFD100]/90 transition-colors">
            Get Free Quote <ArrowUpRight className="w-5 h-5" />
          </Link>
          <button className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen pt-[100px] flex items-center bg-[#1a1a1a]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/construction/slider_1.jpg" 
            alt="Construction" 
            fill 
            className="object-cover"
            priority
          />
          {/* Gradient Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10 w-full mt-24 md:mt-32">
          <div className="max-w-[700px]">
            <h4 className="text-[#FFD100] text-[13px] font-bold tracking-[0.2em] uppercase mb-3">
              Delivering Quality Construction
            </h4>
            <h1 className="text-white text-5xl md:text-7xl lg:text-[85px] font-bold leading-[1.05] tracking-tight mb-5">
              Built With<br />
              Strength And<br />
              Precision
            </h1>
            
            <div className="w-[120px] h-[2px] bg-white/30 mb-5"></div>
            
            <p className="text-gray-300 text-[17px] leading-[1.8] mb-8 max-w-[580px]">
              We believe that every business is uniquids our approach is never one size fits all We tailor our strategies to fit your goals hub.
            </p>

            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#FFD100] text-black px-8 py-4 font-bold text-[15px] hover:bg-[#FFD100]/90 transition-colors">
              Service Request <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-[#313131] p-8 md:p-10 flex flex-col gap-8 shadow-lg">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-[#404040] flex items-center justify-center shrink-0 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 423 453" fill="none" className="w-8 h-8 text-[#FFD100]">
                    <path fillRule="evenodd" clipRule="evenodd" d="M62.609 210.138L46.656 194.185C43.976 191.511 43.976 187.167 46.656 184.487C49.33 181.812 53.674 181.812 56.348 184.487L67.068 195.212L94.156 163.6C96.622 160.729 100.948 160.394 103.831 162.861C106.702 165.321 107.037 169.653 104.57 172.524L72.659 209.756C70.063 212.787 65.426 212.954 62.609 210.138ZM124.42 129.061C124.42 125.278 127.481 122.205 131.276 122.205L370.582 122.199C374.377 122.199 377.438 125.271 377.438 129.055C377.438 132.838 374.377 135.911 370.582 135.911L131.276 135.917C127.482 135.916 124.421 132.844 124.42 129.061ZM46.654 136.565C43.974 133.885 43.974 129.547 46.654 126.867C49.328 124.198 53.672 124.198 56.346 126.867L67.066 137.587L94.154 105.981C96.62 103.11 100.946 102.775 103.829 105.242C106.7 107.708 107.035 112.034 104.568 114.911L72.657 152.131C70.048 155.182 65.42 155.332 62.607 152.524L46.654 136.565ZM359.557 415.937H357.945L357.943 349.878H359.555C386.47 349.877 408.384 364.698 408.385 382.909C408.386 401.12 386.473 415.936 359.557 415.937ZM306.614 340.43C304.384 341.164 302.675 342.972 302.092 345.247C299.903 353.784 296.501 361.974 291.996 369.575C290.801 371.597 290.725 374.092 291.788 376.189L302 396.225L285.47 412.75L265.439 402.539C263.342 401.476 260.847 401.551 258.826 402.747C251.225 407.252 243.035 410.649 234.498 412.844C232.222 413.427 230.409 415.137 229.681 417.367L222.733 438.738L199.364 438.739L192.415 417.368C191.693 415.138 189.874 413.429 187.598 412.846C179.067 410.657 170.888 407.256 163.264 402.751C161.243 401.555 158.747 401.48 156.668 402.543L136.632 412.755L120.095 396.231L130.3 376.194C131.374 374.097 131.293 371.614 130.092 369.58C125.598 361.979 122.196 353.789 120.001 345.252C119.423 342.976 117.72 341.168 115.484 340.435L94.113 333.499V320.59L145.715 320.589C145.703 320.993 145.698 321.403 145.698 321.808C145.699 357.838 175.012 387.161 211.054 387.16C247.084 387.159 276.407 357.834 276.406 321.804C276.406 321.4 276.389 320.99 276.377 320.585L327.984 320.584V333.493L306.614 340.43ZM196.62 170.073C206.192 168.411 215.884 168.408 225.459 170.072L225.461 234.074C225.461 235.472 224.283 236.65 222.885 236.65L199.21 236.651C197.812 236.651 196.622 235.473 196.622 234.075L196.62 170.073ZM126.618 253.259C126.618 258.405 127.08 263.534 127.999 268.559L294.09 268.555C301.716 227.088 277.624 187.281 239.171 173.653L239.172 234.074C239.172 243.044 231.872 250.356 222.884 250.356L199.209 250.357C190.222 250.357 182.909 243.045 182.909 234.075L182.908 173.654C150.153 185.265 126.617 216.571 126.618 253.259ZM74.51 306.878C72.968 306.878 71.657 305.573 71.656 304.025V285.126C71.656 283.584 72.967 282.273 74.509 282.273L347.58 282.266C349.134 282.266 350.439 283.577 350.439 285.119V304.018C350.439 305.566 349.134 306.871 347.58 306.871L74.51 306.878ZM262.693 321.804C262.693 321.4 262.676 320.99 262.664 320.585L159.426 320.588C158.599 349.296 182.021 373.448 211.052 373.447C239.522 373.446 262.694 350.273 262.693 321.804ZM13.713 303.148C13.713 321.048 38.579 336.174 68.001 336.173H80.402V320.59H74.511C65.379 320.59 57.946 313.163 57.945 304.025V285.126C57.945 275.994 65.378 268.561 74.51 268.56L114.098 268.559C104.805 208.923 150.889 155.12 211.049 155.119C235.966 155.118 258.741 164.457 276.074 179.821L370.585 179.819C374.38 179.819 377.441 182.88 377.441 186.675C377.441 190.458 374.38 193.531 370.585 193.531L288.856 193.533C304.997 214.493 312.257 241.381 307.993 268.555L347.581 268.554C356.719 268.554 364.152 275.987 364.152 285.119V304.018C364.152 313.155 356.719 320.583 347.582 320.584H341.697V336.167H359.556C378.017 336.167 395.918 342.096 408.386 353.58L408.38 126.502C408.38 108.597 383.514 93.471 354.08 93.471L62.537 93.478C44.17 93.478 26.073 87.545 13.707 76.077L13.713 303.148ZM62.535 13.707H64.135L64.137 79.766H62.537C35.61 79.767 13.708 64.952 13.707 46.747C13.706 28.529 35.608 13.707 62.535 13.707ZM401.066 92.556C388.417 84.302 371.73 79.757 354.079 79.758L77.848 79.765L77.846 6.856C77.846 3.067 74.785 0 70.99 0H62.534C46.24 0 30.836 4.604 19.163 12.962C6.809 21.817 0 33.82 0 46.746L0.00600052 303.148C0.00600052 316.196 7.463 328.25 21.019 337.092C33.668 345.346 50.361 349.885 68 349.884L100.201 349.883L107.744 352.332C109.881 359.592 112.787 366.598 116.408 373.246L105.614 394.432C104.268 397.083 104.782 400.295 106.879 402.397L130.457 425.968C132.554 428.07 135.771 428.584 138.41 427.227L159.601 416.437C166.261 420.064 173.261 422.969 180.51 425.106L187.863 447.713C188.776 450.537 191.409 452.449 194.378 452.449L227.716 452.448C230.685 452.448 233.319 450.536 234.237 447.712L241.578 425.105C248.838 422.968 255.838 420.062 262.492 416.435L283.678 427.224C286.329 428.581 289.54 428.067 291.643 425.965L315.214 402.393C317.316 400.291 317.819 397.079 316.473 394.428L305.683 373.254C309.31 366.589 312.215 359.588 314.352 352.328L321.895 349.879L344.236 349.878L344.238 422.793C344.238 426.588 347.305 429.649 351.094 429.649H359.556C375.844 429.649 391.248 425.051 402.915 416.687C415.286 407.826 422.096 395.835 422.096 382.909L422.09 126.501C422.091 113.453 414.622 101.393 401.066 92.556Z" fill="currentColor"></path>
                  </svg>
                </div>
                <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight">Quality Workmanship</h3>
              </div>
              <div className="w-full h-[1px] bg-gray-600 flex">
                <div className="w-16 h-[2px] bg-white -mt-[0.5px]"></div>
              </div>
              <p className="text-gray-300 text-[15px] leading-relaxed">
                Provide our people with a meaningful experience that helps and guide growth.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#313131] p-8 md:p-10 flex flex-col gap-8 shadow-lg">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-[#404040] flex items-center justify-center shrink-0 rounded-md">
                  <Handshake className="w-8 h-8 text-[#FFD100]" />
                </div>
                <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight">Project Management</h3>
              </div>
              <div className="w-full h-[1px] bg-gray-600 flex">
                <div className="w-16 h-[2px] bg-white -mt-[0.5px]"></div>
              </div>
              <p className="text-gray-300 text-[15px] leading-relaxed">
                Provide our people with a meaningful experience that helps and guide growth.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#313131] p-8 md:p-10 flex flex-col gap-8 shadow-lg">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-[#404040] flex items-center justify-center shrink-0 rounded-md">
                  <FileCheck className="w-8 h-8 text-[#FFD100]" />
                </div>
                <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight">Certified Professionals</h3>
              </div>
              <div className="w-full h-[1px] bg-gray-600 flex">
                <div className="w-16 h-[2px] bg-white -mt-[0.5px]"></div>
              </div>
              <p className="text-gray-300 text-[15px] leading-relaxed">
                Provide our people with a meaningful experience that helps and guide growth.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
