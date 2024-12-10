"use client";

import "./globals.css";
import { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import { QueryClient, QueryClientProvider } from "react-query";
import SessionProvider from "@/components/SessionProvider";

const metadata: Metadata = {
  title: "OlheOleo",
  description: "Desenvolvido por CJR",
};
const inter = Josefin_Sans({ subsets: ["latin"], weight: [ '400', '500', '600'], display: 'swap' });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  }
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
        <SessionProvider>
          {children}
        </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
