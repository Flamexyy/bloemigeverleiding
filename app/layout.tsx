import type { Metadata } from "next";
import { Gabarito, Courgette, Pacifico } from "next/font/google";
import "./globals.css";
import RootLayoutWrapper from "./components/RootLayoutWrapper";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import CookieConsent from "./components/CookieConsent";
import { LikedProvider } from "./context/LikedContext";

const gabarito = Gabarito({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-gabarito",
});

const courgette = Courgette({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-courgette",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Bloemigeverleiding",
    default: "Bloemigeverleiding | De liefde voor bloemen die altijd bloeien",
  },
  description: "De liefde voor bloemen die altijd bloeien",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon_io/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon_io/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon_io/favicon-16x16.png"
        />
        <link
          rel="manifest"
          href="/favicon_io/site.webmanifest"
        />
      </head>
      <body className={`${gabarito.variable} ${courgette.variable} ${pacifico.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            <LikedProvider>
              <RootLayoutWrapper>{children}</RootLayoutWrapper>
            </LikedProvider>
          </CartProvider>
        </AuthProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
