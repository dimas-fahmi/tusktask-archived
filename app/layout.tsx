"use client";

import type React from "react";
import { useEffect } from "react";
import "@/src/ui/css/globals.tailwind.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { APP_THEMES_ID } from "@/src/lib/configs";
import { useThemeStore } from "@/src/lib/stores/ui/themeStore";
import { fontsVariables } from "@/src/ui/fonts";
import { Toaster } from "@/src/ui/shadcn/components/ui/sonner";

// QueryClient Initialization
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { activeTheme } = useThemeStore();

  useEffect(() => {
    if (typeof document !== "undefined") {
      const html = document.documentElement;
      APP_THEMES_ID.map((item) => {
        html.classList.remove(item);
        return false;
      });

      html.classList.add(activeTheme.id);
    }
  }, [activeTheme]);

  return (
    <html lang="en">
      <body className={`${fontsVariables} antialiased`}>
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
