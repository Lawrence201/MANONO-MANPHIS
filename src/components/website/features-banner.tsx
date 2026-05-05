import Image from "next/image";

export function FeaturesBanner() {
  const features = [
    {
      icon: "/svg_1.svg",
      title: "Reliable Supply",
      subtitle: "Consistent bulk delivery",
    },
    {
      icon: "/svg_2.svg",
      title: "Global Export",
      subtitle: "International shipping ready",
    },
    {
      icon: "/svg_3.svg",
      title: "Certified Quality",
      subtitle: "Export-standard products",
    },
    {
      icon: "/svg_4.svg",
      title: "Flexible Orders",
      subtitle: "Custom quantities & pricing",
    },
  ];

  return (
    <div className="w-full bg-[#ecf3f2] py-8 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:px-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Image src={feature.icon} alt="" aria-hidden="true" width={32} height={32} className="object-contain" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[18px] font-bold text-[#1a1a1a] leading-tight">
                  {feature.title}
                </span>
                <span className="text-[15px] font-medium text-gray-500 leading-tight">
                  {feature.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
