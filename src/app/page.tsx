import { TopBar } from "@/components/website/top-bar";
import { WebsiteHeader } from "@/components/website/header";
import { HoneyHero } from "@/components/website/honey-hero";
import { FeaturesBanner } from "@/components/website/features-banner";
import { ServicesSection } from "@/components/website/services-section";
import { AboutUsSection } from "@/components/website/about-us-section";
import { ProductsGrid } from "@/components/website/products-grid";
import { FeaturedProducts } from "@/components/website/featured-products";
import { HowWeWork } from "@/components/website/how-we-work";
import { TestimonialsSection } from "@/components/website/testimonials-section";
import { ContactSection } from "@/components/website/contact-section";
import { MapSection } from "@/components/website/map-section";
import { NewsletterBanner } from "@/components/website/newsletter-banner";
import { WebsiteFooter } from "@/components/website/footer";
import { OutdoorSolution } from "@/components/website/outdoor-solution";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f3f0] selection:bg-[#eea000] selection:text-white">
      <TopBar />
      <WebsiteHeader />
      <main>
        <HoneyHero />
        <FeaturesBanner />
        <ServicesSection />
        <AboutUsSection />
        <ProductsGrid />
        <FeaturedProducts />
        <HowWeWork />
        <ProductsGrid type="billboards" />
        <OutdoorSolution />
        <TestimonialsSection />
        <ContactSection />
        <MapSection />
        <NewsletterBanner />
      </main>
      <WebsiteFooter />
    </div>
  );
}
