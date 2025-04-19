'use client';

import { usePathname } from 'next/navigation';
import Navbar from '../app/components/layout/Navbar';
import Footer from '../app/components/layout/Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const showLayout = pathname === '/' || pathname === '/teacher';

  return (
    <>
      {showLayout && <Navbar />}
      <main className={`min-h-screen ${showLayout ? 'pt-16 pb-20' : ''}`}>
        {children}
      </main>
      {showLayout && <Footer />}
    </>
  );
}
