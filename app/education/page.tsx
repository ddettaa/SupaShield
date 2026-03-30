'use client';

import { useI18n } from '../../lib/i18n/context';

export default function EducationPage() {
  const { t } = useI18n();

  return (
    <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto relative">
      <div className="scanline fixed inset-0 z-10 opacity-10"></div>
      
      {/* Hero Section */}
      <section className="mb-24 relative z-20">
        <div className="inline-block bg-tertiary-container text-on-tertiary px-3 py-1 font-mono text-xs mb-4 tracking-widest uppercase">{t('education.heroTags')}</div>
        <h1 className="text-6xl md:text-8xl font-headline font-extrabold tracking-tighter uppercase leading-none mb-6 glitch-text transition-all">
          {t('education.heroTitlePart1')} <br/><span className="text-primary-dim">{t('education.heroTitlePart2')}</span>
        </h1>
        <p className="text-on-surface-variant max-w-2xl font-mono text-lg border-l-4 border-primary-dim pl-6 py-2">
           {t('education.heroDesc')}
        </p>
      </section>

      {/* Vertical Timeline Container */}
      <div className="relative z-20 space-y-32 before:content-[''] before:absolute before:left-[19px] before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-primary-dim before:via-secondary before:to-tertiary-dim before:opacity-30">
        {/* Step 1 */}
        <div className="relative pl-16 group">
          <div className="absolute left-0 top-0 w-10 h-10 bg-surface-container-highest border-2 border-primary-dim flex items-center justify-center z-30 group-hover:shadow-[0_0_15px_rgba(0,252,64,0.5)] transition-all">
            <span className="font-mono font-bold text-primary-dim">01</span>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-headline font-bold uppercase tracking-tight text-white mb-4">{t('education.step1Title')}</h2>
              <p className="text-on-surface-variant font-body mb-6">
                 {t('education.step1Desc')}
              </p>
              <ul className="space-y-3 font-mono text-sm text-primary-dim">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">arrow_forward</span> {t('education.step1Li1')}</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">arrow_forward</span> {t('education.step1Li2')}</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">arrow_forward</span> {t('education.step1Li3')}</li>
              </ul>
            </div>
            <div className="bg-surface-container-lowest border border-primary-dim/20 p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 border-b border-outline-variant pb-2">
                <span className="font-mono text-xs text-outline italic">DevTools_Console.log</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-error rounded-full"></div>
                  <div className="w-2 h-2 bg-tertiary rounded-full"></div>
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
              </div>
              <pre className="font-mono text-sm text-on-surface leading-relaxed whitespace-pre-wrap"><span className="text-secondary">const</span> supabaseUrl = <span className="text-primary-dim">&apos;https://xyz.supabase.co&apos;</span>
<span className="text-secondary">const</span> supabaseKey = <span className="text-primary-dim">&apos;eyJhbGciOiJIUzI1NiIsInR5c...&apos;</span>
<span className="text-secondary">const</span> supabase = createClient(url, key)</pre>
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative pl-16 group">
          <div className="absolute left-0 top-0 w-10 h-10 bg-surface-container-highest border-2 border-secondary flex items-center justify-center z-30 group-hover:shadow-[0_0_15px_rgba(0,210,253,0.5)] transition-all">
            <span className="font-mono font-bold text-secondary">02</span>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-headline font-bold uppercase tracking-tight text-white mb-4">{t('education.step2Title')}</h2>
              <p className="text-on-surface-variant font-body mb-6">
                 {t('education.step2Desc')}
              </p>
              <div className="bg-surface-container-low p-4 border-l-4 border-secondary">
                <p className="text-sm font-mono text-secondary-dim">{t('education.step2Warn')}</p>
                <p className="text-xs font-mono text-on-surface">{t('education.step2WarnDesc')}</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-secondary/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary text-sm">terminal</span>
                <span className="font-mono text-xs text-secondary uppercase tracking-widest">{t('education.step2PayloadTitle')}</span>
              </div>
              <pre className="font-mono text-xs text-on-surface leading-relaxed whitespace-pre-wrap"><span className="text-outline">{t('education.step2CodeCmt')}</span>
fetch(<span className="text-primary-dim">&apos;https://xyz.supabase.co/rest/v1/profiles?id=eq.my_id&apos;</span>, {'{'}
  method: <span className="text-secondary">&apos;PATCH&apos;</span>,
  headers: {'{'}
    <span className="text-secondary">&apos;apikey&apos;</span>: <span className="text-primary-dim">&apos;REDACTED&apos;</span>,
    <span className="text-secondary">&apos;Content-Type&apos;</span>: <span className="text-primary-dim">&apos;application/json&apos;</span>
  {'}'},
  body: JSON.stringify({'{'} credits: <span className="text-tertiary">999999</span> {'}'})
{'}'})</pre>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative pl-16 group">
          <div className="absolute left-0 top-0 w-10 h-10 bg-surface-container-highest border-2 border-secondary-fixed-dim flex items-center justify-center z-30 group-hover:shadow-[0_0_15px_rgba(28,213,255,0.5)] transition-all">
            <span className="font-mono font-bold text-secondary-fixed-dim">03</span>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="order-2 md:order-1">
              <div className="bg-surface-container-lowest border border-secondary-fixed-dim/20 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-secondary-fixed-dim text-sm">bolt</span>
                  <span className="font-mono text-xs text-secondary-fixed-dim uppercase tracking-widest">{t('education.step3BypassTitle')}</span>
                </div>
                <pre className="font-mono text-xs text-on-surface leading-relaxed whitespace-pre-wrap"><span className="text-outline">{t('education.step3BypassCmt')}</span>
curl -X POST <span className="text-primary-dim">&apos;https://xyz.supabase.co/functions/v1/process-order&apos;</span> \
-H <span className="text-secondary">&quot;Authorization: Bearer ATTACKER_TOKEN&quot;</span> \
-d <span className="text-secondary">&apos;{'{'} &quot;orderId&quot;: &quot;123&quot;, &quot;bypass_payment&quot;: true {'}'}&apos;</span></pre>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-headline font-bold uppercase tracking-tight text-white mb-4">{t('education.step3Title')}</h2>
              <p className="text-on-surface-variant font-body mb-6">
                 {t('education.step3Desc')}
              </p>
              <div className="bg-surface-container-high p-4 flex items-center gap-4">
                <span className="material-symbols-outlined text-error text-3xl">warning</span>
                <div className="font-mono text-xs">
                  <span className="text-error font-bold">{t('education.step3Warn')}</span> {t('education.step3WarnDesc')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="relative pl-16 group">
          <div className="absolute left-0 top-0 w-10 h-10 bg-surface-container-highest border-2 border-tertiary-dim flex items-center justify-center z-30 group-hover:shadow-[0_0_15px_rgba(229,28,36,0.5)] transition-all">
            <span className="font-mono font-bold text-tertiary-dim">04</span>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-headline font-bold uppercase tracking-tight text-white mb-4">{t('education.step4Title')}</h2>
              <p className="text-on-surface-variant font-body mb-8">
                 {t('education.step4Desc')}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container p-4 border-t-2 border-tertiary">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase">{t('education.step4Stat1')}</span>
                  <div className="text-2xl font-bold text-tertiary">{t('education.step4Stat1Val')}</div>
                </div>
                <div className="bg-surface-container p-4 border-t-2 border-tertiary">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase">{t('education.step4Stat2')}</span>
                  <div className="text-2xl font-bold text-tertiary">{t('education.step4Stat2Val')}</div>
                </div>
              </div>
            </div>
            <div className="relative h-64 bg-surface-container-high overflow-hidden">
              <img className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL4254FoebJ_3P0LivUZcM2wz-Kssup81KT5I4VQvuAO-eucPPKguThJn_cKMekYuKG4_9qEb0JCn0wpyX6RtbGUR_UxQZIQ4eNyetPLxlRPrHDaN5dVr0V8qxEq5NU4n_gr7NJ21ut2kL5hNwVJFFKOJMvGC-1L4BvfunkYceZpcTJC39ZyVk6baoS0s3PphDISFvtP6QGCnz5wd-vpJIIsjChH5i1c21fOlmKbP73h_HK1gH610DIWNZjP-0L1NRvVO2ajbrwhk" alt="Log Sistem Terkompromi"/>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-error-container/20">
                <span className="material-symbols-outlined text-6xl text-tertiary mb-2">heart_broken</span>
                <span className="font-mono text-sm font-bold tracking-[0.5em] text-white">{t('education.step4Alert')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <section className="mt-40 p-12 bg-primary-container relative">
        <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-4xl font-headline font-black text-on-primary-container uppercase tracking-tighter leading-none mb-2">{t('education.ctaTitle')}</h3>
            <p className="text-on-primary-container/80 font-mono text-sm max-w-md">{t('education.ctaDesc')}</p>
          </div>
          <button className="bg-on-primary-container text-primary-container px-10 py-4 font-black uppercase text-xl hover:translate-x-2 hover:-translate-y-2 transition-transform shadow-[4px_4px_0px_#000000] active:scale-95">{t('education.ctaBtn')}</button>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="material-symbols-outlined text-9xl text-on-primary-container">shield</span>
        </div>
      </section>
    </main>
  );
}
