'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-gradient-to-b from-[#131313] to-[#0e0e0e]">
        <div className="flex items-center gap-8">
          <Link href="/">
            <span className="text-[#00ff41] font-black italic drop-shadow-[0_0_8px_rgba(0,255,65,0.5)] font-headline tracking-tighter uppercase text-xl">
              SUPASHIELD
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link 
              href="/" 
              className={`${pathname === '/' ? 'text-[#00ff41] border-[#00ff41]' : 'text-gray-500 border-transparent'} border-b-2 hover:text-[#00d2fd] pb-1 font-headline tracking-tighter uppercase font-bold hover:skew-x-2 transition-all duration-100`}
            >
              Beranda
            </Link>
            <Link 
              href="/tool" 
              className={`${pathname === '/tool' ? 'text-[#00ff41] border-[#00ff41]' : 'text-gray-500 border-transparent'} border-b-2 hover:text-[#00d2fd] pb-1 font-headline tracking-tighter uppercase font-bold hover:skew-x-2 transition-all duration-100`}
            >
              Alat
            </Link>
            <Link 
              href="/education" 
              className={`${pathname === '/education' ? 'text-[#00ff41] border-[#00ff41]' : 'text-gray-500 border-transparent'} border-b-2 hover:text-[#00d2fd] pb-1 font-headline tracking-tighter uppercase font-bold hover:skew-x-2 transition-all duration-100`}
            >
              Edukasi
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[#00ff41] hidden md:block">terminal</span>
          <button className="bg-primary-container text-on-primary-container px-6 py-1 font-bold uppercase tracking-tighter hover:skew-x-2 active:scale-95 transition-all hidden md:block">
            Hubungkan
          </button>
        </div>
      </header>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-14 bg-[#000000] border-t border-[#00ff41]/20 shadow-[0_-4px_20px_rgba(0,255,65,0.1)]">
        <Link 
          href="/tool" 
          className={`flex flex-col items-center justify-center px-6 py-2 transition-all ${pathname === '/tool' ? 'bg-[#00ff41]/10 text-[#00ff41] border-t-2 border-[#00ff41]' : 'text-gray-600 hover:bg-white/5 border-t-2 border-transparent'}`}
        >
          <span className="material-symbols-outlined text-xl">terminal</span>
          <span className="font-mono text-[10px] uppercase tracking-widest mt-1">Terminal</span>
        </Link>
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center px-6 py-2 transition-all ${pathname === '/' ? 'bg-[#00ff41]/10 text-[#00ff41] border-t-2 border-[#00ff41]' : 'text-gray-600 hover:bg-white/5 border-t-2 border-transparent'}`}
        >
          <span className="material-symbols-outlined text-xl">lock_open</span>
          <span className="font-mono text-[10px] uppercase tracking-widest mt-1">Beranda</span>
        </Link>
        <Link 
          href="/education" 
          className={`flex flex-col items-center justify-center px-6 py-2 transition-all ${pathname === '/education' ? 'bg-[#00ff41]/10 text-[#00ff41] border-t-2 border-[#00ff41]' : 'text-gray-600 hover:bg-white/5 border-t-2 border-transparent'}`}
        >
          <span className="material-symbols-outlined text-xl">menu_book</span>
          <span className="font-mono text-[10px] uppercase tracking-widest mt-1">Panduan</span>
        </Link>
        <Link 
          href="/security-guide" 
          className={`flex flex-col items-center justify-center px-6 py-2 transition-all ${pathname === '/security-guide' ? 'bg-[#00ff41]/10 text-[#00ff41] border-t-2 border-[#00ff41]' : 'text-gray-600 hover:bg-white/5 border-t-2 border-transparent'}`}
        >
          <span className="material-symbols-outlined text-xl">security_update_good</span>
          <span className="font-mono text-[10px] uppercase tracking-widest mt-1">Harga</span>
        </Link>
      </nav>
    </>
  );
}
