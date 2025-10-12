"use client";

import Image from "next/image";
import Navigations from "./Navigations";

const PublicNavBar = () => {
  return (
    <nav className="layout-width py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          width={200}
          height={200}
          priority
          unoptimized
          src={
            "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/logo/TuskTask-Horizontal.png"
          }
          alt="TuskTask Logo - Wordmark"
          className="w-42"
        />
      </div>

      {/* Navigation Bar */}
      <Navigations />
    </nav>
  );
};

export default PublicNavBar;
