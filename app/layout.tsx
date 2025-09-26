"use client";

import React from "react";
import "@/src/ui/css/globals.tailwind.css";
import { spaceGroteskFont, oswaldFont } from "@/src/ui/fonts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // QueryClient Initialization
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <body
        className={`${oswaldFont.variable} ${spaceGroteskFont.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          {children}

          {/* DevTools */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
