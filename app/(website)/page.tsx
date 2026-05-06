import Hero from "@/components/website/Hero";
import ServicesSection from "@/components/website/ServicesSection";
import AvailableHalls from "@/components/website/AvailableHalls";
import BestServices from "@/components/website/BestServices";
import EssentialsWrapper from "@/components/website/EssentialsWrapper";
import AvailableHostels from "@/components/website/AvailableHostels";
import VideoTour from "@/components/website/VideoTour";
import WhyChooseUs from "@/components/website/WhyChooseUs";
import JoinMission from "@/components/website/JoinMission";
import Testimonials from "@/components/website/Testimonials";
import MapSection from "@/components/website/MapSection";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - database queries run at request time
export const dynamic = 'force-dynamic';

export default async function Home() {
  const hallCount = await prisma.hall.count();
  const hostelCount = await prisma.hostel.count();
  const packageCount = await prisma.package.count();

  return (
    <main>
      <Hero
        hallCount={hallCount}
        hostelCount={hostelCount}
        packageCount={packageCount}
      />
      <ServicesSection />
      <AvailableHalls />
      <EssentialsWrapper />
      <AvailableHostels />
      <VideoTour />
      <BestServices />

      <JoinMission />
      <WhyChooseUs />
      <Testimonials />
      <MapSection />
    </main>
  );
}
