"use client";

import React from "react";
import "@/src/ui/css/globals.tailwind.css";
import { spaceGroteskFont, oswaldFont } from "@/src/ui/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswaldFont.variable} ${spaceGroteskFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
