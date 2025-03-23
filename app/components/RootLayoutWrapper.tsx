'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { BiChevronRight } from "react-icons/bi";
import Link from 'next/link';

export default function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && (
        <>
          {/* Simple Banner */}
          <div className="fixed top-0 left-0 right-0 bg-accent z-40">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
              <div className="h-9 flex items-center justify-center">
                <Link 
                  href="/shop" 
                  className="flex items-center gap-2 text-white text-sm hover:opacity-80 transition-opacity group"
                >
                  <span>Gratis verzending bij bestellingen over €50,-</span>
                  <BiChevronRight className="text-lg transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
          {/* Header with adjusted top position */}
          <div className="fixed top-9 left-0 right-0 z-40">
            <Header />
          </div>
        </>
      )}
      <main className={`flex-1 ${!isAuthPage ? 'pt-[105px] pb-[25px]' : ''}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
} 