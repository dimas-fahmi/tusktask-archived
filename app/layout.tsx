"use client";

import React from "react";
import "@/src/ui/css/globals.tailwind.css";
import { chonburyFont, plusJakartaSansFont } from "@/src/ui/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${chonburyFont.variable} ${plusJakartaSansFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
