//layout

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana Coffee House",
  description: "Pay for your coffee with using Devnet Solana Pay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-900 text-white">
          <header className="bg-gray-800 p-4">
            <h1 className="text-2xl font-bold">Solana Coffee House</h1>
          </header>
          <main className="container mx-auto p-4">
            {children}
          </main>
          <footer className="bg-gray-800 p-4 text-center">
            <p>&copy; 2024 Solana Summer Fellowship. All Rights Reserved. </p>
          </footer>
        </div>
      </body>
    </html>
  );
}