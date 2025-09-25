import { Button } from "@/src/ui/shadcn/components/ui/button";
import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative layout-width flex flex-col-reverse md:flex-row mb-24 justify-between"
    >
      {/* Container */}
      <div className="-mt-78 md:mt-0 md:flex-1 flex items-center">
        {/* Wrapper */}
        <div className="max-w-lg text-center md:text-left">
          <h1 className="font-header font-extrabold text-4xl md:text-5xl">
            {`Oops, You Just Killed Your Plant Again Didn't You`}
          </h1>
          <p className="mt-6 font-light">
            {`Never Again! We'll remember it for you, whether it's your girlfriend's birthday to your plant watering schedule!`}
          </p>
          <div className="mt-6 grid grid-cols-2 md:flex items-center gap-2">
            <Button variant={"outline"} className="md:px-16">
              Sign In
            </Button>
            <Button className="md:px-16">Sign Up</Button>
          </div>
        </div>
      </div>

      {/* Illo */}
      <div>
        <Image
          width={500}
          height={500}
          src={
            "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/landing/landing-01-hero.png"
          }
          alt="N"
          className="hidden md:block"
        />
        <Image
          width={500}
          height={500}
          src={
            "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/landing/beta-mockup-mobile-prototype.png"
          }
          alt="N"
          className="md:hidden opacity-fade-bottom"
        />
      </div>
    </section>
  );
};

export default HeroSection;
