"use client";

import React from "react";
import "@/src/ui/css/globals.tailwind.css";
import { spaceGroteskFont, oswaldFont } from "@/src/ui/fonts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/src/ui/shadcn/components/ui/sonner";

// QueryClient Initialization
const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
          {children}

          {/* Toaster */}
          <Toaster position="top-center" />

          {/* DevTools */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
