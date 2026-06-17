import Image from "next/image";
import Link from "next/link";
import { GitMerge, PenTool, Users, ClipboardCheck, ChevronRight } from "lucide-react";

export function ConstructionProcessSection() {
  const processSteps = [
    {
      num: "01",
      title: "Consultation & Planning",
      desc: "We begin by understanding your project needs, budget, and vision to create a clear construction plan.",
      icon: <GitMerge className="w-7 h-7 text-[#FFD100]" />,
      features: [
        "Client discussion",
        "Site evaluation",
        "Project requirements analysis"
      ]
    },
    {
      num: "02",
      title: "Design & Approval",
      desc: "We develop detailed designs and layouts to ensure everything matches your expectations before construction begins.",
      icon: <PenTool className="w-7 h-7 text-[#FFD100]" />,
      features: [
        "Architectural drawings",
        "Design review",
        "Client approval"
      ]
    },
    {
      num: "03",
      title: "Construction & Execution",
      desc: "Our skilled team begins construction with strict attention to quality, safety, and timelines.",
      icon: <Users className="w-7 h-7 text-[#FFD100]" />,
      features: [
        "Site preparation",
        "Building and structure work",
        "Quality supervision"
      ]
    },
    {
      num: "04",
      title: "Final Inspection & Handover",
      desc: "We inspect every detail to ensure the project meets standards before officially handing it over.",
      icon: <ClipboardCheck className="w-7 h-7 text-[#FFD100]" />,
      features: [
        "Quality checks",
        "Final adjustments",
        "Project delivery"
      ]
    }
  ];

  return (
    <section className="py-24 max-[480px]:pt-4 max-[480px]:pb-16 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1500px]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16">
          <div className="max-w-[650px]">
            <div className="flex items-center gap-2 mb-4 max-[480px]:mb-3">
              <div className="w-2 h-2 max-[480px]:w-1.5 max-[480px]:h-1.5 rounded-full bg-[#FFD100]"></div>
              <span className="text-[12px] max-[480px]:text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase">
                WORK PROCESS
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-[56px] max-[480px]:text-3xl font-black text-[#1a1a1a] tracking-tight mb-6 max-[480px]:mb-4 leading-[1.1]">
              Our Work Process
            </h2>
            <p className="text-gray-500 text-[16px] max-[480px]:text-[14px] leading-[1.8] max-[480px]:leading-[1.6] max-w-[550px] font-medium">
              We support businesses in tech, retail, real estate, finance, healthcare, and more providing custom strategies that work in your world.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-[480px]:gap-4">
          {processSteps.map((step, i) => (
            <div key={i} className="bg-[#323232] rounded-md p-8 md:p-10 max-[480px]:p-6 flex flex-col transition-transform hover:-translate-y-2 duration-300">
              <div className="flex justify-between items-start mb-16 max-[480px]:mb-10">
                <div className="w-[60px] h-[60px] max-[480px]:w-[50px] max-[480px]:h-[50px] bg-[#404040] rounded-md flex items-center justify-center shrink-0 shadow-inner">
                  {step.icon}
                </div>
                <div 
                  className="text-[64px] max-[480px]:text-[48px] leading-none font-black text-transparent opacity-40 select-none" 
                  style={{ WebkitTextStroke: '1px #FFD100' }}
                >
                  {step.num}
                </div>
              </div>
              
              <div className="w-full h-[1px] bg-gray-600 mb-8 max-[480px]:mb-6 relative">
                <div className="absolute left-0 top-0 w-12 h-[2px] bg-white -mt-[0.5px]"></div>
              </div>

              <h3 className="text-white text-[22px] max-[480px]:text-[18px] font-bold mb-4 max-[480px]:mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-gray-400 text-[15px] max-[480px]:text-[14px] leading-relaxed font-medium mb-5">
                {step.desc}
              </p>
              {step.features && (
                <ul className="space-y-2 mt-auto">
                  {step.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-300 text-[14px]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFD100] shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
