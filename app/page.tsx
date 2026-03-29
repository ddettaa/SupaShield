export default function Home() {
  return (
    <main className="relative pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[921px] flex flex-col justify-center px-8 md:px-24 overflow-hidden">
        <div className="absolute inset-0 matrix-bg pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-dim/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 max-w-5xl">
          <div className="inline-block bg-surface-container-highest px-3 py-1 mb-6 border-l-4 border-primary">
            <span className="font-mono text-primary text-sm tracking-widest uppercase">KERENTANAN KRITIS TERDETEKSI</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-headline font-black tracking-tighter leading-[0.9] mb-8 uppercase">
             Supabase Kamu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">Telanjang.</span>
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl mb-12 leading-relaxed">
             Platform edukasi &amp; testing untuk <span className="text-on-surface font-bold">vibe coders</span> yang pengen tau seberapa bolong database-nya sebelum digoreng hacker.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <button className="bg-primary-container text-on-primary-container px-8 py-4 text-xl font-black uppercase tracking-tight flex items-center justify-between group hover:translate-x-2 transition-transform">
              <span>Uji Database-mu Sekarang</span>
              <span className="material-symbols-outlined ml-4 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <button className="border border-outline-variant hover:border-secondary text-on-surface px-8 py-4 text-xl font-bold uppercase tracking-tight transition-all">
               Pelajari Cara Melindungi
            </button>
          </div>
        </div>
        {/* Decorative Terminal Element */}
        <div className="hidden lg:block absolute right-12 bottom-12 w-96 bg-surface-container-low p-4 border border-outline-variant font-mono text-xs opacity-50">
          <div className="flex gap-2 mb-2">
            <div className="w-2 h-2 bg-error rounded-full"></div>
            <div className="w-2 h-2 bg-tertiary rounded-full"></div>
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          </div>
          <div className="text-primary-dim">$ npx supashield-scan --target=prod-db</div>
          <div className="text-on-surface-variant mt-2">[TUNGGU] Menganalisis kebijakan RLS...</div>
          <div className="text-error mt-1">[AWAS] Tabel 'profiles' terbuka untuk publik</div>
          <div className="text-error mt-1">[AWAS] Tidak ada validasi 'user_id' untuk UPDATE</div>
          <div className="text-on-surface-variant mt-2">Pemindaian selesai. 12 kelemahan ditemukan.</div>
        </div>
      </section>
      
      {/* Section: Apa Ini? (Bento Grid) */}
      <section className="py-24 px-8 md:px-24">
        <h2 className="text-4xl md:text-6xl font-headline font-black mb-16 uppercase tracking-tighter">
                        Apa <span className="text-secondary">Ini?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 bg-surface-container-low p-8 border-l-4 border-secondary relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4 uppercase">Dilema Coders Masa Kini</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
                 Kita semua pernah di sana: Copy-paste setup dari tutorial YouTube, klik tombol &quot;Enable RLS&quot; tapi isinya cuma diisi <code className="bg-surface-container px-2 py-1 text-secondary">true</code>, atau lupa mengunci schema <code className="text-primary-dim">public</code>. Vibe coding itu asik sampe database lu bocor dan dimainin hacker.
              </p>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] text-secondary opacity-5 group-hover:scale-110 transition-transform">construction</span>
          </div>
          <div className="md:col-span-4 bg-surface-container-highest p-8 flex flex-col justify-between">
            <span className="material-symbols-outlined text-primary text-4xl">bolt</span>
            <div>
              <h3 className="text-xl font-black mb-2 uppercase">Setup Instan</h3>
              <p className="text-on-surface-variant">Hanya butuh 2 menit buat tahu seberapa terekspos aplikasi Anda ke publik.</p>
            </div>
          </div>
          <div className="md:col-span-4 bg-surface-container-high p-8 border-t-4 border-tertiary">
            <h3 className="text-xl font-black mb-4 uppercase">Mimpi Buruk RLS</h3>
            <p className="text-on-surface-variant mb-6">Kebanyakan pemula ngira aplikasinya otomatis aman kalo RLS dicentang. Faktanya? Row Level Security itu tajam kayak silet kalo Anda gak tahu cara konfigurasinya.</p>
            <div className="bg-surface-container-lowest p-4 font-mono text-sm border border-outline-variant">
              <span className="text-error">DROP POLICY</span> &quot;Semua Orang&quot; <span className="text-primary">ON</span> users;
            </div>
          </div>
          <div className="md:col-span-8 bg-surface-container-low p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-black mb-4 uppercase">Platform Edukasi</h3>
                <p className="text-on-surface-variant leading-relaxed">
                   SupaShield bukan cuma alat pemindai. Kita ngajarin bagaimana cara berpikir seperti pengetes keamanan siber sungguhan. Belajar SQL injection dari *client-side*.
                </p>
              </div>
              <div className="w-full md:w-1/2 aspect-video bg-black relative">
                <img alt="Dashboard keamanan siber interaktif" className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlG7wsShR4IlL0dllvjepVkW4b53_0li6cXlHzr9_FlCoJWKSGYotgha7Gzb_rN3oyNnc__y06aWuAJVK3KOPNswZnUdOnVWFMbU0v5802kDC1tiwcjH1hxkSfhYMabGPK6gPe2jHDvBcGRbGhiCEa9cC25b1GfjOm0QDxd-NJO0bDvJILV6fWhhlXmb6b7tXUwCz_NmNF94uI4El6W6nLUOY8msqIAVKiLlAPnk5QRQgMZURjb9a3LMIgF5VQd5IBKORLxtYaRdY"/>
                <div className="absolute inset-0 scanline"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section: Kenapa Harus Peduli? */}
      <section className="py-24 px-8 md:px-24 bg-surface-container-lowest relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-tertiary/5 skew-x-12 translate-x-1/2"></div>
        <h2 className="text-4xl md:text-6xl font-headline font-black mb-16 uppercase tracking-tighter relative z-10">
            Kenapa Harus <span className="text-error">Peduli?</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-12">
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-surface-container">
                <div className="text-5xl font-black text-error mb-2 tracking-tighter">84%</div>
                <div className="text-sm font-mono uppercase tracking-widest text-on-surface-variant">Aplikasi Salah Konfigurasi RLS</div>
              </div>
              <div className="p-6 bg-surface-container">
                <div className="text-5xl font-black text-primary mb-2 tracking-tighter">0.4d</div>
                <div className="text-sm font-mono uppercase tracking-widest text-on-surface-variant">Waktu bocor 10k data *user*</div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4 p-4 border-l-2 border-outline-variant hover:border-tertiary transition-colors group">
                <span className="material-symbols-outlined text-tertiary mt-1">warning</span>
                <div>
                  <h4 className="font-black uppercase mb-1 group-hover:text-tertiary transition-colors">Kasus: Pemalsuan Leaderboard</h4>
                  <p className="text-on-surface-variant">Game indie populer kehilangan integritas datanya karena *user* iseng bisa mengirim skor 999,999 langsung mem-bypass API Supabase Client.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 border-l-2 border-outline-variant hover:border-tertiary transition-colors group">
                <span className="material-symbols-outlined text-tertiary mt-1">security</span>
                <div>
                  <h4 className="font-black uppercase mb-1 group-hover:text-tertiary transition-colors">Kasus: Kebocoran Data (PII)</h4>
                  <p className="text-on-surface-variant">Startup SaaS membocorkan 5000+ email pengguna karena lupa mengatur *select specific columns* dan kunci *public*.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface p-1 border border-outline-variant shadow-[0_0_30px_rgba(255,51,51,0.1)]">
            <div className="bg-surface-container-low p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <span className="font-mono text-xs text-on-surface-variant tracking-widest uppercase">Simulasi Payload Langsung</span>
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-error-container"></span>
                  <span className="w-2 h-2 bg-error-container"></span>
                </span>
              </div>
              <div className="space-y-8">
                <div>
                  <div className="text-xs font-mono text-on-surface-variant mb-2 uppercase">Skenario A: Aplikasi Anda (Rentan)</div>
                  <div className="bg-surface-container-highest p-4 border-l-4 border-error font-mono text-sm">
                    <div className="text-gray-500">-- Hacker mengetik di konsol browser</div>
                    <div className="text-on-surface"><span className="text-secondary">supabase</span>.<span className="text-primary">from</span>(&apos;users&apos;).<span className="text-primary">select</span>(&apos;*&apos;)</div>
                    <div className="text-error mt-2 font-bold">// Respons: 200 OK (Seluruh Data Bocor)</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-on-surface-variant mb-2 uppercase">Skenario B: Setelah Pengerasan RLS</div>
                  <div className="bg-surface-container-highest p-4 border-l-4 border-primary font-mono text-sm">
                    <div className="text-gray-500">-- Hacker memasukkan perintah SQL yang sama</div>
                    <div className="text-on-surface"><span className="text-secondary">supabase</span>.<span className="text-primary">from</span>(&apos;users&apos;).<span className="text-primary">select</span>(&apos;*&apos;)</div>
                    <div className="text-primary mt-2 font-bold">// Respons: 403 Forbidden (Akses Ditolak RLS)</div>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-outline-variant text-center">
                <button className="text-primary font-black uppercase tracking-widest flex items-center justify-center gap-2 mx-auto hover:gap-4 transition-all">
                  <span className="material-symbols-outlined">security</span>
                     AMANKAN APLIKASIMU SEKARANG
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-8 text-center bg-black relative">
        <div className="absolute inset-0 matrix-bg opacity-5"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-headline font-black mb-8 tracking-tighter uppercase leading-tight">
             Jangan Tunggu Sampai <span className="text-tertiary">Bocor.</span>
          </h2>
          <p className="text-xl text-on-surface-variant mb-12">
             Gabung bareng ratusan vibe coders yang sudah mulai peduli sama keamanan database mereka. Coba fitur gratisnya hari ini.
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button className="bg-primary-container text-on-primary-container px-12 py-5 text-2xl font-black uppercase tracking-tight hover:scale-105 transition-transform shadow-[4px_4px_0_#9cff93] active:translate-x-1 active:translate-y-1 active:shadow-[0_0_0_#9cff93]">
               Buka Terminal Tool
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
