"use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootProviders from "@/components/providers/RootProviders";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [title, setTitle] = useState("Hyperspace");

  useEffect(() => {
    const generateTitle = () => {
      if (pathname === "/") return "Hyperspace - Home";
      return "Hyperspace";
    };
    setTitle(generateTitle());
  }, [pathname]);

  const metadata: Metadata = {
    title,
  };

  return (
      <html
        lang="en"
        className="dark"
        style={{
          colorScheme: "dark",
        }}
      >
        <head>
          <title>{title}</title>
        </head>
        <body className={inter.className}>
          <Toaster richColors position="bottom-right" />
          <RootProviders>{children}</RootProviders>
        </body>
      </html>
  );
}
