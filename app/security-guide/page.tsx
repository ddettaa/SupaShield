'use client';

import { useI18n } from '../../lib/i18n/context';

export default function SecurityGuidePage() {
  const { t } = useI18n();

  return (
    <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Background Decoration specifically for this page */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
        <div className="absolute top-0 left-0 w-full h-full scanline"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-dim/10 blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <section className="mb-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6 hover:text-shadow-[2px_0_#00d2fd,-2px_0_#ff3333] transition-all">
              {t('security.heroTitlePart1')} <br/> <span className="text-primary-dim">{t('security.heroTitlePart2')}</span>
            </h1>
            <p className="text-on-surface-variant font-mono text-lg max-w-lg border-l-4 border-primary-dim pl-6 py-2 bg-surface-container-low">
              {t('security.heroDesc')}
            </p>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-primary-dim font-mono text-xs mb-1">{t('security.heroLatency')}</div>
            <div className="text-secondary font-mono text-xs mb-1">{t('security.heroEnc')}</div>
            <div className="text-error font-mono text-xs">{t('security.heroStatus')}</div>
          </div>
        </div>
      </section>

      {/* Bento Grid Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
        {/* Card 1: RLS */}
        <div className="md:col-span-8 bg-surface-container-low border-l-4 border-primary p-8 relative overflow-hidden group">
          <div className="absolute inset-0 scanline opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-primary text-sm font-bold tracking-widest">{t('security.card1Tag')}</span>
              <span className="material-symbols-outlined text-primary">security</span>
            </div>
            <h3 className="text-3xl font-bold uppercase mb-4 italic">{t('security.card1Title')}</h3>
            <p className="text-on-surface-variant mb-6 font-medium">{t('security.card1Desc')}</p>
            <div className="bg-surface-container-highest p-6 font-mono text-sm text-secondary border border-secondary/20">
              <div className="flex gap-2 mb-2 opacity-50">
                <span className="w-3 h-3 bg-error"></span>
                <span className="w-3 h-3 bg-secondary"></span>
                <span className="w-3 h-3 bg-primary"></span>
              </div>
              <code className="whitespace-pre-line leading-loose">
                ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
                {'\n'}
                CREATE POLICY &quot;Users can only update their own profile&quot;
                ON profiles FOR UPDATE
                USING (auth.uid() = id);
              </code>
            </div>
          </div>
        </div>

        {/* Card 2: Anon Key */}
        <div className="md:col-span-4 bg-surface-container p-8 border border-white/5 flex flex-col justify-between">
          <div>
            <span className="font-mono text-tertiary text-sm font-bold tracking-widest">{t('security.card2Tag')}</span>
            <h3 className="text-2xl font-bold uppercase mt-4 mb-2">{t('security.card2Title')}</h3>
            <p className="text-on-surface-variant text-sm font-mono leading-relaxed">{t('security.card2Desc')}</p>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-4 text-error">
              <span className="material-symbols-outlined">warning</span>
              <span className="text-xs uppercase font-bold tracking-widest">{t('security.card2Warn')}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Edge Functions */}
        <div className="md:col-span-5 bg-surface-container-high p-8 border-b-4 border-secondary flex flex-col h-full">
          <span className="font-mono text-secondary text-sm font-bold tracking-widest">{t('security.card3Tag')}</span>
          <h3 className="text-2xl font-bold uppercase mt-4 mb-6">{t('security.card3Title')}</h3>
          <div className="bg-black/40 p-4 font-mono text-xs text-primary-dim mb-6 flex-grow overflow-auto custom-scrollbar">
            <pre><code>{`serve(async (req) => {
  const { data, error } = await supabase
    .from('secrets')
    .select('*')
    
  if (!isValid(data)) {
    return new Response("UNAUTHORIZED", 
      { status: 401 })
  }
})`}</code></pre>
          </div>
          <p className="text-on-surface-variant text-sm">{t('security.card3Desc')}</p>
        </div>

        {/* Card 4: Rate Limiting & Logs */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-surface-container p-8 border border-white/5 hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined text-secondary-dim mb-4">speed</span>
            <h4 className="font-bold uppercase mb-2">{t('security.card4RateTitle')}</h4>
            <p className="text-on-surface-variant text-sm font-mono">{t('security.card4RateDesc')}</p>
          </div>
          <div className="bg-surface-container p-8 border border-white/5 hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined text-primary-dim mb-4">monitoring</span>
            <h4 className="font-bold uppercase mb-2">{t('security.card4LogTitle')}</h4>
            <p className="text-on-surface-variant text-sm font-mono">{t('security.card4LogDesc')}</p>
          </div>
          <div className="sm:col-span-2 bg-gradient-to-r from-surface-container to-surface-container-low p-8 border border-white/5 flex items-center justify-between">
            <div>
              <h4 className="font-bold uppercase mb-1">{t('security.card4SanTitle')}</h4>
              <p className="text-on-surface-variant text-sm">{t('security.card4SanDesc')}</p>
            </div>
            <span className="material-symbols-outlined text-primary text-4xl">verified_user</span>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <section className="mt-32">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 italic">{t('security.pricingTitle')}</h2>
          <div className="h-1 w-24 bg-primary-dim mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {/* Starter */}
          <div className="bg-surface-container-low border border-white/10 p-10 flex flex-col justify-between hover:bg-surface-container transition-all">
            <div>
              <span className="font-mono text-xs text-on-surface-variant uppercase tracking-[0.3em]">{t('security.subStarter')}</span>
              <h3 className="text-3xl font-bold mt-2 mb-6">{t('security.titleStarter')}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black">{t('security.priceStarter')}</span>
                <span className="text-on-surface-variant text-sm font-mono">{t('security.freqMonth')}</span>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm font-mono">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span> {t('security.liStarter1')}
                </li>
                <li className="flex items-center gap-3 text-sm font-mono">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span> {t('security.liStarter2')}
                </li>
                <li className="flex items-center gap-3 text-sm font-mono opacity-40">
                  <span className="material-symbols-outlined text-sm">circle</span> {t('security.liStarter3')}
                </li>
              </ul>
            </div>
            <button disabled className="w-full bg-surface-container-highest text-on-surface-variant border border-white/10 py-4 font-bold uppercase tracking-widest cursor-not-allowed">{t('security.btnStarter')}</button>
          </div>

          {/* Pro */}
          <div className="bg-surface-container-highest border-x-0 md:border-x-4 border-primary p-10 flex flex-col justify-between relative shadow-[0_0_40px_rgba(0,252,64,0.1)]">
            <div className="absolute top-0 right-0 bg-primary text-on-primary-container px-3 py-1 text-[10px] font-black uppercase tracking-widest">{t('security.tagPro')}</div>
            <div>
              <span className="font-mono text-xs text-primary-dim uppercase tracking-[0.3em]">{t('security.subPro')}</span>
              <h3 className="text-3xl font-bold mt-2 mb-6 text-primary-dim">{t('security.titlePro')}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black drop-shadow-md">{t('security.pricePro')}</span>
                <span className="text-on-surface-variant text-sm font-mono">{t('security.freqMonth')}</span>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm font-mono">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span> {t('security.liPro1')}
                </li>
                <li className="flex items-center gap-3 text-sm font-mono">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span> {t('security.liPro2')}
                </li>
                <li className="flex items-center gap-3 text-sm font-mono">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span> {t('security.liPro3')}
                </li>
                <li className="flex items-center gap-3 text-sm font-mono">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span> {t('security.liPro4')}
                </li>
              </ul>
            </div>
            <button disabled className="w-full bg-primary/20 text-on-surface-variant py-4 font-bold uppercase tracking-widest cursor-not-allowed border border-primary/30">{t('security.btnPro')}</button>
          </div>

          {/* Enterprise */}
          <div className="bg-surface-container-low border border-white/10 p-10 flex flex-col justify-between hover:bg-surface-container transition-all">
            <div>
              <span className="font-mono text-xs text-secondary uppercase tracking-[0.3em]">{t('security.subEnt')}</span>
              <h3 className="text-3xl font-bold mt-2 mb-6">{t('security.titleEnt')}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black drop-shadow-md">{t('security.priceEnt')}</span>
                <span className="text-on-surface-variant text-sm font-mono">{t('security.freqMonth')}</span>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm font-mono">
                  <span className="material-symbols-outlined text-secondary text-sm">verified</span> {t('security.liEnt1')}
                </li>
                <li className="flex items-center gap-3 text-sm font-mono">
                  <span className="material-symbols-outlined text-secondary text-sm">verified</span> {t('security.liEnt2')}
                </li>
                <li className="flex items-center gap-3 text-sm font-mono">
                  <span className="material-symbols-outlined text-secondary text-sm">verified</span> {t('security.liEnt3')}
                </li>
              </ul>
            </div>
            <button disabled className="w-full bg-surface-container-highest text-on-surface-variant border border-white/10 py-4 font-bold uppercase tracking-widest cursor-not-allowed">{t('security.btnEnt')}</button>
          </div>
        </div>
      </section>
    </main>
  );
}
