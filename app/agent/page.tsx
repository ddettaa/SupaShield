'use client';

import { useI18n } from '../../lib/i18n/context';

export default function AgentPage() {
  const { t } = useI18n();

  return (
    <main className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto selection:bg-[#00ff41] selection:text-black">
      {/* ─── Hero Section ─── */}
      <section className="mb-20">
        <div className="inline-block px-3 py-1 bg-white text-black font-black uppercase text-xs tracking-widest mb-6">
          {t('agent.heroTag')}
        </div>
        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] tracking-tighter uppercase mb-6 flex flex-col">
          <span>{t('agent.heroTitlePart1')}</span>
          <span className="text-[#00ff41]">{t('agent.heroTitlePart2')}</span>
        </h1>
        <p className="font-mono text-gray-400 max-w-2xl text-sm leading-relaxed border-l-2 border-[#00ff41] pl-4">
          {t('agent.heroDesc')}
        </p>
      </section>

      {/* ─── Bento Details Section ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="bg-[#111] border border-gray-800 p-8 hover:border-[#00ff41] transition-colors relative group">
          <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-[#00ff41]">psychology</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-[#00ff41]">
            {t('agent.mcpTitle')}
          </h2>
          <p className="font-mono text-sm text-gray-400 leading-relaxed">
            {t('agent.mcpDesc')}
          </p>
        </div>

        <div className="bg-[#111] border border-gray-800 p-8 hover:border-[#00ff41] transition-colors relative group">
          <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-[#00ff41]">terminal</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white">
            {t('agent.skillTitle')}
          </h2>
          <p className="font-mono text-sm text-gray-400 leading-relaxed">
            {t('agent.skillDesc')}
          </p>
        </div>
      </section>

      {/* ─── Integration Guide Section ─── */}
      <section className="border-t border-gray-800 pt-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px bg-[#00ff41] flex-1"></div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">
            {t('agent.integrationTitle')}
          </h2>
          <div className="h-px bg-[#00ff41] flex-1"></div>
        </div>
        
        <p className="font-mono text-sm text-center text-gray-400 max-w-3xl mx-auto mb-16">
          {t('agent.integrationDesc')}
        </p>

        <div className="space-y-12 max-w-4xl mx-auto">
          {/* Step 1 */}
          <div className="relative pl-12">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-800"></div>
            <div className="absolute left-[-5px] top-1.5 w-3 h-3 bg-[#00ff41] shadow-[0_0_10px_#00ff41]"></div>
            <h3 className="text-xl font-bold uppercase tracking-tight mb-2">
              {t('agent.step1Title')}
            </h3>
            <p className="font-mono text-xs text-gray-400 mb-4">{t('agent.step1Desc')}</p>
            <div className="bg-[#111] border-l-4 border-[#00d2fd] p-4 text-xs font-mono text-gray-300">
              <span className="text-[#00d2fd] font-bold">Prompt:</span> "Please read and understand your new skill from https://supashield.vercel.app/api/skill"
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative pl-12">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-800"></div>
            <div className="absolute left-[-5px] top-1.5 w-3 h-3 bg-white"></div>
            <h3 className="text-xl font-bold uppercase tracking-tight mb-2">
              {t('agent.step2Title')}
            </h3>
            <p className="font-mono text-xs text-gray-400 mb-2">{t('agent.step2Desc')}</p>
            <div className="inline-block bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30 font-mono text-[9px] uppercase px-2 py-1 mb-4">
              <span className="material-symbols-outlined text-[12px] inline-block align-text-bottom mr-1">warning</span>
              {t('agent.codeWarning')}
            </div>
            
            {/* Example configuration for OpenClaw/Cursor */}
            <div className="bg-black border border-gray-800 p-4 rounded-sm font-mono text-[11px] text-gray-300 overflow-x-auto flex flex-col gap-3">
              <p className="text-gray-500">// OpenClaw JSON Config (or Cursor SSE UI)</p>
              <pre><code>{`{
  "mcpServers": {
    "supashield-mcp": {
      "type": "sse",
      "url": "https://supashield.vercel.app/api/mcp"
    }
  }
}`}</code></pre>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative pl-12">
            <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-gray-800 to-transparent"></div>
            <div className="absolute left-[-5px] top-1.5 w-3 h-3 bg-white"></div>
            <h3 className="text-xl font-bold uppercase tracking-tight mb-2">
              {t('agent.step3Title')}
            </h3>
            <p className="font-mono text-xs text-gray-400 mb-4">{t('agent.step3Desc')}</p>
            <div className="bg-[#111] border-l-4 border-[#00d2fd] p-4 text-xs font-mono text-gray-300">
              <span className="text-[#00d2fd] font-bold">Try Prompt:</span> "Hey AI, can you use SupaShield to scan my Supabase project?"
            </div>
          </div>
        </div>
      </section>

      {/* ─── Call To Action ─── */}
      <section className="mt-32 max-w-4xl mx-auto bg-white text-black p-12 text-center hover:scale-[1.02] transition-transform">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          {t('agent.ctaTitle')}
        </h2>
        <p className="font-mono text-sm mb-8 max-w-xl mx-auto">
          {t('agent.ctaDesc')}
        </p>
        <a 
          href="https://supashield.vercel.app/api/skill" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#00ff41] hover:text-black transition-colors"
        >
          {t('agent.ctaBtn')} <span className="material-symbols-outlined text-sm">open_in_new</span>
        </a>
      </section>
    </main>
  );
}
