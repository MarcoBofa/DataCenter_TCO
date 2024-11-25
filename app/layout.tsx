import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ToasterProvider from "@/providers/ToasterProvider";
import { TCOProvider } from "./context/useContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Data Center TCO Calculator",
  description:
    "Simple and practical web tools to estimate the Total Cost of Ownership of a Datacenter (Beta Version)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterProvider />
        <TCOProvider>{children}</TCOProvider>
      </body>
    </html>
  );
}
