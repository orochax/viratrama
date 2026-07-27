import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { CartProvider } from "@/components/store/CartProvider";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "ViraTrama | Histórias que começam na caixa",
  description: "Experiências narrativas híbridas para jogar em grupo. Conheça Operação da Meia-Noite: A Chave Atlas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className={`${inter.variable} ${cormorant.variable}`}><body className="grain"><CartProvider>{children}</CartProvider></body></html>;
}
