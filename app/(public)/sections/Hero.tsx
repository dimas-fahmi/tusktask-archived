import { Button } from "@/src/ui/shadcn/components/ui/button";
import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <section id="hero" className="layout-width flex justify-between">
      {/* Container */}
      <div className="flex-1 flex items-center">
        {/* Wrapper */}
        <div className="max-w-lg">
          <h1 className="font-header font-extrabold text-5xl">
            {`Oops, You Just Killed Your Plant Again Didn't You`}
          </h1>
          <p className="mt-6 font-light">
            {`Never Again! We'll remember it for you, whether it's your girlfriend's birthday to your plant watering schedule!`}
          </p>
          <div className="mt-6 flex items-center gap-2">
            <Button variant={"outline"} className="px-16">
              Sign In
            </Button>
            <Button className="px-16">Sign Up</Button>
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
        />
      </div>
    </section>
  );
};

export default HeroSection;
