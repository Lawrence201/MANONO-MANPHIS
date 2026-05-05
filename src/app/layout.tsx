import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Manono Manphis — Global Export & Trade Management",
  description: "Enterprise import/export trade management platform for agricultural commodities including honey, cashew nuts, and shea butter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@100..800&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
      </head>
      <body 
        className="antialiased" 
        style={{
          // @ts-ignore
          "--font-bebas-neue": "'Bebas Neue', sans-serif",
          "--font-jetbrains-mono": "'JetBrains Mono', monospace",
          "--font-plus-jakarta": "'Plus Jakarta Sans', sans-serif"
        }}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
