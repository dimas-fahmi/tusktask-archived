import Features from "./sections/Features";
import HeroSection from "./sections/Hero";

const LandingPageIndex = () => {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Services */}
      <Features />

      <div className="h-[4000px]"></div>
    </>
  );
};

export default LandingPageIndex;
