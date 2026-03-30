'use client';

import Link from 'next/link';
import { useI18n } from '../lib/i18n/context';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="w-full flex flex-col md:flex-row justify-between items-start gap-8 px-12 pb-24 bg-[#0e0e0e] p-12 mt-20 border-t-4 border-double border-[#262626]">
      <div className="flex flex-col gap-4">
        <span className="text-[#ff3333] font-bold font-mono text-xs uppercase tracking-tighter">{t('footer.tagline')}</span>
        <p className="text-gray-700 font-mono text-xs uppercase tracking-tighter max-w-xs">
          {t('footer.copyright')}
        </p>
      </div>
      <div className="flex flex-wrap gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-white font-mono text-xs uppercase mb-2">{t('footer.socials')}</span>
          <a className="text-gray-700 hover:text-white transition-all font-mono text-xs uppercase tracking-tighter" href="#">GitHub</a>
          <a className="text-gray-700 hover:text-white transition-all font-mono text-xs uppercase tracking-tighter" href="#">Twitter</a>
          <a className="text-gray-700 hover:text-white transition-all font-mono text-xs uppercase tracking-tighter" href="#">Discord</a>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-white font-mono text-xs uppercase mb-2">{t('footer.resource')}</span>
          <Link className="text-gray-700 hover:text-white transition-all font-mono text-xs uppercase tracking-tighter" href="/security-guide">RLS Guide</Link>
          <a className="text-gray-700 hover:text-white transition-all font-mono text-xs uppercase tracking-tighter" href="#">API Docs</a>
          <a className="text-gray-700 hover:text-white transition-all font-mono text-xs uppercase tracking-tighter" href="#">Legal</a>
        </div>
      </div>
    </footer>
  );
}
