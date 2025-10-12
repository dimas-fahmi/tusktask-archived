import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative layout-width flex flex-col-reverse md:flex-row mb-24 justify-between"
    >
      {/* Container */}
      <div className="absolute md:static top-[45%] left-0 right-0 md:mt-0 md:flex-1 flex items-center">
        {/* Wrapper */}
        <div className="max-w-lg text-center md:text-left p-4 md:p-0 z-10">
          <h1 className="font-header font-extrabold text-4xl md:text-5xl">
            {`Oops, You Just Killed Your Plant Again Didn't You`}
          </h1>
          <p className="mt-6 font-light">
            {`Never Again! We'll remember it for you, whether it's your girlfriend's birthday to your plant watering schedule!`}
          </p>
          <div className="mt-6 grid grid-cols-2 md:flex items-center gap-2">
            <Button variant={"outline"} className="md:px-16" asChild>
              <Link href={"/auth"}>Sign In</Link>
            </Button>
            <Button className="md:px-16" asChild>
              <Link href={"/auth/register"}>Sign Up</Link>
            </Button>
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
          alt="TuskTask landing page hero illustration, a girl with a dying plant."
          className="hidden md:block"
        />
        <Image
          width={500}
          height={500}
          src={
            "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/landing/beta-mockup-mobile-prototype.png"
          }
          alt="TuskTask landing page hero illustration, a screenshot of dashboard page in smartphone frame."
          className="md:hidden opacity-fade-bottom"
          priority
          unoptimized
        />
      </div>
    </section>
  );
};

export default HeroSection;
