import Navbar from '../app/components/layout/Navbar';
import Footer from '../app/components/layout/Footer';
import { usePathname } from 'next/navigation';

'use client';

function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth/login';

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className={`min-h-screen ${!isAuthPage ? 'pt-16 pb-20' : ''}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
}