'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
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
              <div className="h-9 flex items-center justify-center banner-resp">
                <Link 
                  href="/shop" 
                  className="flex items-center gap-2 text-text text-sm hover:opacity-80 transition-opacity"
                >
                  <span>Gratis verzending bij bestellingen vanaf €150</span>
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
      <main className={`flex-1 ${!isAuthPage ? 'pt-[105px] bg-white' : ''}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
} 