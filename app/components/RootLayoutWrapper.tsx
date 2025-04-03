"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import Link from "next/link";

export default function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthPage && (
        <>
          {/* Simple Banner */}
          <div className="fixed left-0 right-0 top-0 z-40 bg-accent">
            <div className="mx-auto max-w-[1600px] px-4 lg:px-8">
              <div className="banner-resp flex h-9 items-center justify-center">
                <Link
                  href="/shop"
                  className="flex items-center gap-2 text-sm text-text transition-opacity hover:opacity-80"
                >
                  <span>Gratis verzending bij bestellingen vanaf €150</span>
                </Link>
              </div>
            </div>
          </div>
          {/* Header with adjusted top position */}
          <div className="fixed left-0 right-0 top-9 z-40">
            <Header />
          </div>
        </>
      )}
      <main className={`flex-1 ${!isAuthPage ? "bg-white pt-[105px]" : ""}`}>{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
