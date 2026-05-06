import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Antonio, Anton, Bebas_Neue, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

const antonio = Antonio({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-antonio",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

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
      <body 
        className={`${antonio.variable} ${anton.variable} ${bebasNeue.variable} ${jetbrainsMono.variable} ${plusJakarta.variable} antialiased`} 
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
