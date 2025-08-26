
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CartProvider } from "@/components/store/shopping-cart-provider";
import { UserProvider } from "@/components/user/user-provider";

export const metadata: Metadata = {
  title: "Inven-tra",
  description: "Intelligent Inventory Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased h-full")}>
        <UserProvider>
          <SidebarProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </SidebarProvider>
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
