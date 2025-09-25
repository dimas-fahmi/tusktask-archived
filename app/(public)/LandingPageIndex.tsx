import React from "react";
import HeroSection from "./sections/Hero";
import Features from "./sections/Features";

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
