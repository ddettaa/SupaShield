'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '../lib/i18n/context';

export default function Navbar() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useI18n();

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'id' : 'en');
  };

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
              {t('nav.home')}
            </Link>
            <Link 
              href="/tool" 
              className={`${pathname === '/tool' ? 'text-[#00ff41] border-[#00ff41]' : 'text-gray-500 border-transparent'} border-b-2 hover:text-[#00d2fd] pb-1 font-headline tracking-tighter uppercase font-bold hover:skew-x-2 transition-all duration-100`}
            >
              {t('nav.tool')}
            </Link>
            <Link 
              href="/education" 
              className={`${pathname === '/education' ? 'text-[#00ff41] border-[#00ff41]' : 'text-gray-500 border-transparent'} border-b-2 hover:text-[#00d2fd] pb-1 font-headline tracking-tighter uppercase font-bold hover:skew-x-2 transition-all duration-100`}
            >
              {t('nav.education')}
            </Link>
            <Link 
              href="/agent" 
              className={`${pathname === '/agent' ? 'text-[#00ff41] border-[#00ff41]' : 'border-secondary/30 text-secondary hover:text-white'} border-b-2 pb-1 font-headline tracking-tighter uppercase font-bold hover:skew-x-2 transition-all duration-100 flex items-center gap-1`}
            >
              {t('nav.agent')}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage}
            className="text-xs font-mono font-bold text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-2 py-1 rounded transition-colors uppercase tracking-widest hidden md:block"
          >
            {locale === 'en' ? 'ID' : 'EN'}
          </button>
          <span className="material-symbols-outlined text-[#00ff41] hidden md:block">terminal</span>
          <button className="bg-primary-container text-on-primary-container px-6 py-1 font-bold uppercase tracking-tighter hover:skew-x-2 active:scale-95 transition-all hidden md:block">
            {t('nav.connect')}
          </button>
        </div>
      </header>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-14 bg-[#000000] border-t border-[#00ff41]/20 shadow-[0_-4px_20px_rgba(0,255,65,0.1)] overflow-x-auto">
        <Link 
          href="/tool" 
          className={`flex flex-col items-center justify-center min-w-[70px] px-2 py-2 transition-all ${pathname === '/tool' ? 'bg-[#00ff41]/10 text-[#00ff41] border-t-2 border-[#00ff41]' : 'text-gray-600 hover:bg-white/5 border-t-2 border-transparent'}`}
        >
          <span className="material-symbols-outlined text-xl">terminal</span>
          <span className="font-mono text-[9px] uppercase tracking-widest mt-1">{t('nav.terminal')}</span>
        </Link>
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center min-w-[70px] px-2 py-2 transition-all ${pathname === '/' ? 'bg-[#00ff41]/10 text-[#00ff41] border-t-2 border-[#00ff41]' : 'text-gray-600 hover:bg-white/5 border-t-2 border-transparent'}`}
        >
          <span className="material-symbols-outlined text-xl">lock_open</span>
          <span className="font-mono text-[9px] uppercase tracking-widest mt-1">{t('nav.home')}</span>
        </Link>
        <Link 
          href="/education" 
          className={`flex flex-col items-center justify-center min-w-[70px] px-2 py-2 transition-all ${pathname === '/education' ? 'bg-[#00ff41]/10 text-[#00ff41] border-t-2 border-[#00ff41]' : 'text-gray-600 hover:bg-white/5 border-t-2 border-transparent'}`}
        >
          <span className="material-symbols-outlined text-xl">menu_book</span>
          <span className="font-mono text-[9px] uppercase tracking-widest mt-1">{t('nav.guide')}</span>
        </Link>
        <Link 
          href="/agent" 
          className={`flex flex-col items-center justify-center min-w-[70px] px-2 py-2 transition-all ${pathname === '/agent' ? 'bg-[#00ff41]/10 text-[#00ff41] border-t-2 border-[#00ff41]' : 'text-secondary hover:bg-white/5 border-t-2 border-transparent'}`}
        >
          <span className="material-symbols-outlined text-xl">smart_toy</span>
          <span className="font-mono text-[9px] uppercase tracking-widest mt-1">{t('nav.agent')}</span>
        </Link>
        
        {/* Mobile Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="flex flex-col items-center justify-center min-w-[70px] px-2 py-2 text-gray-600 hover:text-white transition-all"
        >
          <span className="material-symbols-outlined text-xl">translate</span>
          <span className="font-mono text-[9px] uppercase tracking-widest mt-1">{locale === 'en' ? 'ID' : 'EN'}</span>
        </button>
      </nav>
    </>
  );
}
