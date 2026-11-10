import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/components/CartProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MarFloTech E-Commerce",
  description: "Optimized Next.js E-commerce Frontend",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}