import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Preorder Manager",
  description: "Efficiently manage product preorders, track stock options, and toggle status constraints.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8f9fa] text-[#171717]">
        <main className="flex-1">{children}</main>
        <footer className="w-full py-5 text-center text-xs text-gray-500 border-t border-[#e5e7eb] bg-white mt-auto select-none">
          <p>
            © {new Date().getFullYear()} All rights reserved{' '}
            <a
              href="https://dev-mdasif-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-black hover:underline transition-colors"
            >
              dev_asif
            </a>
          </p>
        </footer>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
