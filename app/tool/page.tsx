'use client';

import { useState } from 'react';
import { useI18n } from '../../lib/i18n/context';

type PayloadParam = { id: string; key: string; value: string };

type ScanResponse = {
  status?: number;
  statusText?: string;
  latencyMs?: number;
  headers?: string;
  data?: any;
};

export default function ToolPage() {
  const { t } = useI18n();

  // Definisi Template Injeksi menggunakan terjemahan
  const INJECTION_TEMPLATES = [
    {
      label: t('tool.tmpl1Label'),
      desc: t('tool.tmpl1Desc'),
      icon: 'person_search',
      url: '/rest/v1/users?select=*',
      method: 'GET' as const,
      severity: t('tool.sevHigh'),
      severityColor: 'text-error',
    },
    {
      label: t('tool.tmpl2Label'),
      desc: t('tool.tmpl2Desc'),
      icon: 'admin_panel_settings',
      url: '/rest/v1/profiles?id=eq.1',
      method: 'PATCH' as const,
      severity: t('tool.sevCrit'),
      severityColor: 'text-error',
      payload: [
        { id: 'tmpl1', key: 'is_admin', value: 'true' },
        { id: 'tmpl2', key: 'role', value: 'superadmin' },
      ],
    },
    {
      label: t('tool.tmpl3Label'),
      desc: t('tool.tmpl3Desc'),
      icon: 'group',
      url: '/rest/v1/profiles?user_id=eq.VICTIM-UUID-HERE&select=*',
      method: 'GET' as const,
      severity: t('tool.sevHigh'),
      severityColor: 'text-error',
    },
    {
      label: t('tool.tmpl4Label'),
      desc: t('tool.tmpl4Desc'),
      icon: 'terminal',
      url: '/rest/v1/rpc/get_all_users',
      method: 'POST' as const,
      severity: t('tool.sevCrit'),
      severityColor: 'text-error',
      payload: [],
    },
    {
      label: t('tool.tmpl5Label'),
      desc: t('tool.tmpl5Desc'),
      icon: 'delete_forever',
      url: '/rest/v1/orders?id=eq.999',
      method: 'DELETE' as const,
      severity: t('tool.sevCrit'),
      severityColor: 'text-error',
    },
    {
      label: t('tool.tmpl6Label'),
      desc: t('tool.tmpl6Desc'),
      icon: 'post_add',
      url: '/rest/v1/reviews',
      method: 'POST' as const,
      severity: t('tool.sevMed'),
      severityColor: 'text-tertiary',
      payload: [
        { id: 'tmpl3', key: 'product_id', value: '1' },
        { id: 'tmpl4', key: 'rating', value: '5' },
        { id: 'tmpl5', key: 'body', value: 'Injected by SupaShield' },
      ],
    },
  ];

  // States Konfigurasi Utama
  const [baseUrl, setBaseUrl] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('GET');
  const [showKey, setShowKey] = useState(false);

  // States Payload
  const [payloadMode, setPayloadMode] = useState<'kv' | 'raw'>('kv');
  const [payloadParams, setPayloadParams] = useState<PayloadParam[]>([
    { id: '1', key: '', value: '' },
  ]);
  const [rawJsonBody, setRawJsonBody] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // States Eksekusi & Respons
  const [isExecuting, setIsExecuting] = useState(false);
  const [response, setResponse] = useState<ScanResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<number | null>(null);

  const addParam = () => {
    setPayloadParams([...payloadParams, { id: Date.now().toString(), key: '', value: '' }]);
  };

  const updateParam = (id: string, field: 'key' | 'value', value: string) => {
    setPayloadParams(payloadParams.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const removeParam = (id: string) => {
    setPayloadParams(payloadParams.filter((p) => p.id !== id));
  };

  const handleRawJsonChange = (value: string) => {
    setRawJsonBody(value);
    if (!value.trim()) {
      setJsonError(null);
      return;
    }
    try {
      JSON.parse(value);
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  // Konversi key-value params ke raw JSON string
  const convertKvToRaw = () => {
    const obj: Record<string, any> = {};
    payloadParams.forEach((p) => {
      if (p.key.trim()) {
        let val: any = p.value;
        if (val === 'true') val = true;
        else if (val === 'false') val = false;
        else if (!isNaN(Number(val)) && val.trim() !== '' && !val.trim().toLowerCase().startsWith('0x')) val = Number(val);
        obj[p.key] = val;
      }
    });
    return JSON.stringify(obj, null, 2);
  };

  // Konversi raw JSON string ke key-value params
  const convertRawToKv = () => {
    try {
      const parsed = JSON.parse(rawJsonBody);
      if (typeof parsed === 'object' && !Array.isArray(parsed) && parsed !== null) {
        const newParams = Object.entries(parsed).map(([key, value], idx) => ({
          id: (Date.now() + idx).toString(),
          key,
          value: typeof value === 'string' ? value : JSON.stringify(value),
        }));
        if (newParams.length > 0) return newParams;
      }
    } catch { /* ignore */ }
    return [{ id: '1', key: '', value: '' }];
  };

  const switchPayloadMode = (mode: 'kv' | 'raw') => {
    if (mode === payloadMode) return;
    if (mode === 'raw') {
      // KV -> Raw: konversi ke JSON string
      const json = convertKvToRaw();
      setRawJsonBody(json === '{}' ? '' : json);
      setJsonError(null);
    } else {
      // Raw -> KV: konversi ke params
      setPayloadParams(convertRawToKv());
    }
    setPayloadMode(mode);
  };

  const applyTemplate = (index: number) => {
    const tmpl = INJECTION_TEMPLATES[index];
    setActiveTemplate(index);

    if (baseUrl) {
      const clean = baseUrl.replace(/\/+$/, '');
      setSupabaseUrl(clean + tmpl.url);
    } else {
      setSupabaseUrl('https://YOUR-PROJECT.supabase.co' + tmpl.url);
    }

    setMethod(tmpl.method);
    if (tmpl.payload && tmpl.payload.length > 0) {
      setPayloadParams([...tmpl.payload]);
      // Juga set raw JSON agar sinkron
      const obj: Record<string, any> = {};
      tmpl.payload.forEach((p) => {
        if (p.key) {
          let val: any = p.value;
          if (val === 'true') val = true;
          else if (val === 'false') val = false;
          else if (!isNaN(Number(val)) && val.trim() !== '' && !val.trim().toLowerCase().startsWith('0x')) val = Number(val);
          obj[p.key] = val;
        }
      });
      setRawJsonBody(JSON.stringify(obj, null, 2));
    } else {
      setPayloadParams([{ id: '1', key: '', value: '' }]);
      setRawJsonBody('');
    }
    setJsonError(null);
    setFormError(null);
    setResponse(null);
  };

  const executeRequest = async () => {
    setFormError(null);

    if (!supabaseUrl || !supabaseKey) {
      setFormError(t('tool.errMissingVal'));
      return;
    }
    if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
      setFormError(t('tool.errHttpUrl'));
      return;
    }

    setIsExecuting(true);
    setResponse(null);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseUrl,
          supabaseKey,
          method,
          payloadParams: payloadMode === 'kv' ? payloadParams.filter((p) => p.key.trim() !== '') : [],
          rawJsonBody: payloadMode === 'raw' ? rawJsonBody : undefined,
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch {
      setResponse({
        status: 500,
        statusText: 'Client Fetch Error',
        data: t('tool.errFetch'),
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Logika Penilaian Kerentanan
  const getVerdict = () => {
    if (!response || !response.status) return null;

    if (response.status >= 200 && response.status < 300) {
      if (method === 'GET' && Array.isArray(response.data) && response.data.length === 0) {
        return {
          title: t('tool.verdSafeTitle'),
          desc: t('tool.verdSafeDesc'),
          isError: false,
          color: 'text-primary',
        };
      }
      return {
        title: t('tool.verdVulnTitle'),
        desc: t('tool.verdVulnDesc').replace('{status}', response.status.toString()),
        isError: true,
        color: 'text-error',
      };
    }

    if (response.status === 401 || response.status === 403) {
      return {
        title: t('tool.verdActiveTitle'),
        desc: t('tool.verdActiveDesc').replace('{status}', response.status.toString()),
        isError: false,
        color: 'text-primary',
      };
    }

    if (response.status === 404) {
      return {
        title: t('tool.verdTargetMatTitle'),
        desc: t('tool.verdTargetMatDesc'),
        isError: true,
        color: 'text-tertiary',
      };
    }

    return {
      title: t('tool.verdAnomalyTitle'),
      desc: t('tool.verdAnomalyDesc').replace('{status}', response.status.toString()),
      isError: true,
      color: 'text-tertiary',
    };
  };

  const verdict = getVerdict();

  return (
    <main className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Hero Branding */}
      <div className="mb-12 border-l-4 border-primary-dim pl-6">
        <h1 className="font-black tracking-tighter text-5xl md:text-8xl uppercase mb-2">
          {t('tool.heroTitlePart1')} <span className="text-primary-dim">{t('tool.heroTitlePart2')}</span>
        </h1>
        <p className="font-mono text-secondary uppercase tracking-widest text-xs md:text-sm">
          {t('tool.heroSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ─── Sidebar ─── */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Base URL Helper */}
          <div className="bg-surface-container-low p-5 border-l-2 border-secondary/40">
            <h3 className="font-mono text-[10px] text-secondary mb-3 uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">link</span> {t('tool.baseUrlTitle')}
            </h3>
            <input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full bg-surface-container-lowest border-b border-outline-variant focus:border-secondary font-mono text-[11px] text-secondary transition-all outline-none py-1.5 px-1"
              placeholder="https://xxx.supabase.co"
              type="text"
            />
            <p className="mt-2 font-mono text-[9px] text-outline-variant leading-relaxed">
              {t('tool.baseUrlDesc')}
            </p>
          </div>

          {/* Session Status */}
          <div className="bg-surface-container-low p-5 border-l-2 border-primary/30">
            <h3 className="font-mono text-[10px] text-primary mb-3 uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">monitor_heart</span> {t('tool.statusTitle')}
            </h3>
            <div className="space-y-2 font-mono text-[10px] text-on-surface-variant">
              <div className="flex justify-between">
                <span>{t('tool.statusProxy')}</span>
                <span className="text-primary-dim">{t('tool.statusProxyVal')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('tool.statusCors')}</span>
                <span className="text-primary-dim">{t('tool.statusCorsVal')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('tool.statusTarget')}</span>
                <span className={supabaseUrl ? 'text-primary' : 'text-secondary'}>
                  {supabaseUrl ? t('tool.statusTargetValLocked') : t('tool.statusTargetValWait')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('tool.statusMethod')}</span>
                <span className="text-tertiary">{method}</span>
              </div>
            </div>
          </div>

          {/* Injection Templates */}
          <div className="bg-surface-container-low p-5 space-y-3">
            <h3 className="font-mono text-[10px] text-primary mb-1 uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">science</span> {t('tool.tmplTitle')}
            </h3>
            <p className="font-mono text-[9px] text-outline-variant mb-3 leading-relaxed">
              {t('tool.tmplDesc')}
            </p>
            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
              {INJECTION_TEMPLATES.map((tmpl, i) => (
                <button
                  key={i}
                  onClick={() => applyTemplate(i)}
                  className={`w-full text-left p-3 border text-[10px] font-mono transition-all group ${
                    activeTemplate === i
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-outline-variant/50 hover:border-primary/60 text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">{tmpl.icon}</span>
                      <span className="uppercase font-bold tracking-wide">{tmpl.label}</span>
                    </div>
                    <span className={`text-[8px] font-bold ${tmpl.severityColor}`}>{tmpl.severity}</span>
                  </div>
                  <p className="text-[9px] text-outline-variant group-hover:text-on-surface-variant leading-relaxed pl-5">
                    {tmpl.desc}
                  </p>
                  <div className="mt-1.5 pl-5 flex items-center gap-2 text-[9px]">
                    <span className={`px-1.5 py-0.5 border ${tmpl.method === 'GET' ? 'border-primary/30 text-primary' : tmpl.method === 'DELETE' ? 'border-error/30 text-error' : 'border-tertiary/30 text-tertiary'}`}>
                      {tmpl.method}
                    </span>
                    <span className="text-outline-variant truncate">{tmpl.url}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ─── Main Terminal Area ─── */}
        <div className="lg:col-span-9">
          <div className="bg-surface-container relative ring-1 ring-primary/20 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
            {/* Scanline Overlay */}
            <div className="absolute inset-0 scanline opacity-20 pointer-events-none z-0"></div>

            {/* Terminal Header */}
            <div className="bg-surface-container-highest flex items-center justify-between px-4 py-2.5 border-b border-primary/10 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-error"></div>
                <div className="w-2.5 h-2.5 bg-tertiary"></div>
                <div className="w-2.5 h-2.5 bg-primary-dim"></div>
                <span className="ml-3 font-mono text-[11px] text-on-surface-variant">
                  root@supashield:~ <span className="text-primary/60">$</span> ./inject --proxy --bypass-cors
                </span>
              </div>
              <span className="font-mono text-[10px] text-primary/30 hidden md:block">TLS 1.3 · AES-256-GCM</span>
            </div>

            {/* ── 01: URL Target ── */}
            <section className="p-6 border-b border-outline-variant/20 relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-primary text-on-primary text-[10px] font-bold w-6 h-6 flex items-center justify-center">01</span>
                <h2 className="font-mono text-sm uppercase tracking-tight">{t('tool.sec1Title')}</h2>
              </div>

              <div className="space-y-5">
                <div className="group relative z-20">
                  <label className="block font-mono text-[10px] text-on-surface-variant uppercase mb-2 tracking-wide">
                    {t('tool.sec1LblUrl')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-outline">language</span>
                    <input
                      value={supabaseUrl}
                      onChange={(e) => {
                        setSupabaseUrl(e.target.value);
                        setFormError(null);
                      }}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 focus:border-primary font-mono text-sm text-secondary transition-all outline-none py-3 pl-10 pr-3 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"
                      placeholder="https://xxx.supabase.co/rest/v1/users?select=*"
                      type="text"
                    />
                  </div>
                  <p className="mt-1.5 font-mono text-[9px] text-outline-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[10px]">info</span>
                    {t('tool.sec1LblUrlHint')}
                  </p>
                </div>

                <div className="group relative z-20 max-w-xl">
                  <label className="block font-mono text-[10px] text-on-surface-variant uppercase mb-2 tracking-wide">
                    {t('tool.sec1LblKey')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-outline">key</span>
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={supabaseKey}
                      onChange={(e) => {
                        setSupabaseKey(e.target.value);
                        setFormError(null);
                      }}
                      className="w-full bg-surface-container-lowest border border-outline-variant/50 focus:border-secondary font-mono text-sm text-secondary transition-all outline-none py-3 pl-10 pr-10"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-outline cursor-pointer hover:text-on-surface transition-colors"
                    >
                      {showKey ? 'visibility' : 'visibility_off'}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 02: Method ── */}
            <section className="p-6 border-b border-outline-variant/20 relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-primary text-on-primary text-[10px] font-bold w-6 h-6 flex items-center justify-center">02</span>
                <h2 className="font-mono text-sm uppercase tracking-tight">{t('tool.sec2Title')}</h2>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 relative z-20">
                {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`border py-3 font-mono text-xs font-bold transition-all ${
                      method === m
                        ? m === 'DELETE'
                          ? 'border-error bg-error/10 text-error'
                          : 'border-primary-dim bg-primary-dim/10 text-primary-dim'
                        : 'border-outline-variant/50 text-on-surface-variant hover:text-white hover:border-white/50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
                <button className="border border-outline-variant/20 text-outline-variant py-3 font-mono text-[10px] flex flex-col items-center justify-center opacity-40 cursor-not-allowed">
                  BULK
                  <span className="material-symbols-outlined text-[10px] mt-0.5">lock</span>
                </button>
              </div>
            </section>

            {/* ── 03: Payload Builder (hanya tampil untuk POST/PUT/PATCH/DELETE) ── */}
            {method !== 'GET' && (
            <section className="p-6 border-b border-outline-variant/20 relative z-10">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="bg-primary text-on-primary text-[10px] font-bold w-6 h-6 flex items-center justify-center">03</span>
                  <h2 className="font-mono text-sm uppercase tracking-tight">{t('tool.sec3Title')}</h2>
                </div>
                <div className="flex items-center gap-0 relative z-20">
                  <button
                    onClick={() => switchPayloadMode('kv')}
                    className={`px-4 py-1.5 text-[10px] font-mono uppercase font-bold transition-all border ${
                      payloadMode === 'kv'
                        ? 'bg-primary/10 text-primary border-primary/40'
                        : 'bg-transparent text-outline-variant border-outline-variant/30 hover:text-on-surface-variant'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[12px]">list</span>
                      {t('tool.pbModeKv')}
                    </span>
                  </button>
                  <button
                    onClick={() => switchPayloadMode('raw')}
                    className={`px-4 py-1.5 text-[10px] font-mono uppercase font-bold transition-all border border-l-0 ${
                      payloadMode === 'raw'
                        ? 'bg-secondary/10 text-secondary border-secondary/40'
                        : 'bg-transparent text-outline-variant border-outline-variant/30 hover:text-on-surface-variant'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[12px]">data_object</span>
                      {t('tool.pbModeRaw')}
                    </span>
                  </button>
                </div>
              </div>

              {/* Mode: Key-Value */}
              {payloadMode === 'kv' && (
                <>
                  <p className="font-mono text-[9px] text-outline-variant mb-4 leading-relaxed max-w-2xl">
                    {t('tool.pbKvDesc')}
                  </p>
                  <div className="space-y-2 relative z-20">
                    {payloadParams.map((param) => (
                      <div key={param.id} className="flex gap-2 items-center group">
                        <input
                          className={`flex-1 bg-surface-container-lowest border font-mono text-xs p-2.5 text-primary outline-none focus:border-primary transition-all ${param.key ? 'border-primary/40' : 'border-outline-variant/40'}`}
                          placeholder={t('tool.pbKvKey')}
                          type="text"
                          value={param.key}
                          onChange={(e) => updateParam(param.id, 'key', e.target.value)}
                        />
                        <span className="text-outline-variant font-mono text-xs">:</span>
                        <input
                          className={`flex-1 bg-surface-container-lowest border font-mono text-xs p-2.5 text-on-surface outline-none focus:border-primary transition-all ${param.value ? 'border-primary/40' : 'border-outline-variant/40'}`}
                          placeholder={t('tool.pbKvVal')}
                          type="text"
                          value={param.value}
                          onChange={(e) => updateParam(param.id, 'value', e.target.value)}
                        />
                        <button
                          onClick={() => removeParam(param.id)}
                          className="text-error/50 material-symbols-outlined text-[18px] px-1 hover:text-error hover:scale-110 active:scale-95 transition-all"
                        >
                          close
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addParam}
                      className="w-full mt-2 py-2 border border-dashed border-outline-variant/40 hover:border-primary/60 text-outline-variant hover:text-primary font-mono text-[10px] uppercase flex items-center justify-center gap-2 transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px]">add</span>
                      {t('tool.pbKvAdd')}
                    </button>
                  </div>
                </>
              )}

              {/* Mode: Raw JSON */}
              {payloadMode === 'raw' && (
                <div className="relative z-20">
                  <p className="font-mono text-[9px] text-outline-variant mb-3 leading-relaxed max-w-2xl">
                    {t('tool.pbRawDesc')}
                  </p>
                  <div className="relative">
                    {/* Line numbers gutter */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-surface-container-highest border-r border-outline-variant/20 flex flex-col items-end pr-1.5 pt-3 pointer-events-none select-none overflow-hidden">
                      {(rawJsonBody || ' ').split('\n').map((_, i) => (
                        <span key={i} className="font-mono text-[9px] text-outline-variant/50 leading-[1.65rem]">
                          {i + 1}
                        </span>
                      ))}
                    </div>
                    <textarea
                      value={rawJsonBody}
                      onChange={(e) => handleRawJsonChange(e.target.value)}
                      spellCheck={false}
                      className={`w-full bg-surface-container-lowest font-mono text-xs text-secondary p-3 pl-11 outline-none resize-y min-h-[200px] max-h-[500px] leading-relaxed transition-all border ${
                        jsonError
                          ? 'border-error/60 shadow-[0_0_10px_rgba(255,115,81,0.1)]'
                          : rawJsonBody.trim()
                          ? 'border-primary/30'
                          : 'border-outline-variant/40'
                      }`}
                      placeholder={`{\n  "key": "value",\n  "is_admin": true,\n  "score": 999\n}`}
                    />
                  </div>
                  {/* JSON Validation Status */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {rawJsonBody.trim() && (
                        jsonError ? (
                          <span className="font-mono text-[9px] text-error flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[12px]">error</span>
                            {t('tool.pbRawInvalid')}: {jsonError.length > 60 ? jsonError.slice(0, 60) + '...' : jsonError}
                          </span>
                        ) : (
                          <span className="font-mono text-[9px] text-primary-dim flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[12px]">check_circle</span>
                            {t('tool.pbRawValid')}
                          </span>
                        )
                      )}
                      {!rawJsonBody.trim() && (
                        <span className="font-mono text-[9px] text-outline-variant">
                          {t('tool.pbRawWait')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          try {
                            const formatted = JSON.stringify(JSON.parse(rawJsonBody), null, 2);
                            setRawJsonBody(formatted);
                            setJsonError(null);
                          } catch { /* ignore: sudah ditangani jsonError */ }
                        }}
                        disabled={!rawJsonBody.trim() || !!jsonError}
                        className="px-3 py-1 text-[9px] font-mono uppercase text-outline-variant hover:text-primary border border-outline-variant/30 hover:border-primary/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {t('tool.pbRawPrettify')}
                      </button>
                      <button
                        onClick={() => {
                          try {
                            const minified = JSON.stringify(JSON.parse(rawJsonBody));
                            setRawJsonBody(minified);
                            setJsonError(null);
                          } catch { /* ignore */ }
                        }}
                        disabled={!rawJsonBody.trim() || !!jsonError}
                        className="px-3 py-1 text-[9px] font-mono uppercase text-outline-variant hover:text-secondary border border-outline-variant/30 hover:border-secondary/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {t('tool.pbRawMinify')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
            )}

            {/* ── 04: Execute ── */}
            <section className="p-10 md:p-14 flex flex-col items-center justify-center bg-surface-container-lowest/30 relative z-10">
              {/* Error Inline */}
              {formError && (
                <div className="mb-6 w-full max-w-md bg-error/5 border border-error/40 p-4 text-error font-mono text-[11px] flex items-start gap-3 shadow-[0_0_20px_rgba(255,115,81,0.1)]">
                  <span className="material-symbols-outlined text-base mt-0.5">warning</span>
                  <span className="leading-relaxed">{formError}</span>
                </div>
              )}

              {isExecuting ? (
                <button
                  disabled
                  className="relative px-12 py-5 bg-surface-variant text-on-surface-variant font-black text-lg uppercase tracking-[0.15em] cursor-wait z-20"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-4 h-4 border-2 border-secondary border-t-transparent animate-spin"></span>
                    {t('tool.btnExeWait')}
                  </span>
                </button>
              ) : (
                <button
                  onClick={executeRequest}
                  className="relative px-14 py-5 bg-primary-container text-on-primary-container font-black text-lg uppercase tracking-[0.15em] transition-all active:scale-[0.97] hover:shadow-[0_0_60px_rgba(0,252,64,0.4)] z-20 group"
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform duration-300">bolt</span>
                    {t('tool.btnExe')}
                  </span>
                </button>
              )}
            </section>

            {/* ── 05: Response ── */}
            {response && (
              <section className="border-t-2 border-primary/30 relative z-10">
                {/* Response Header Bar */}
                <div className="bg-surface-container-highest px-6 py-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-secondary text-on-secondary-container text-[10px] font-bold w-6 h-6 flex items-center justify-center">04</span>
                    <h2 className="font-mono text-sm uppercase tracking-tight">{t('tool.resTitle')}</h2>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`font-mono text-[11px] font-bold px-3 py-1 ${
                        response.status && response.status < 400
                          ? 'bg-primary/15 text-primary-dim border border-primary/30'
                          : 'bg-error/15 text-error border border-error/30'
                      }`}
                    >
                      HTTP {response.status} {response.statusText}
                    </span>
                    <span className="font-mono text-[11px] text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">timer</span>
                      {response.latencyMs}ms
                    </span>
                  </div>
                </div>

                <div className="p-6 bg-[#050505] space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {/* Data Panels */}
                    <div className="space-y-4">
                      <div className="bg-surface-container-lowest border border-outline-variant/20 p-4 h-28 overflow-hidden">
                        <p className="font-mono text-[9px] text-primary uppercase mb-2 tracking-widest">{t('tool.resHeaders')}</p>
                        <pre className="font-mono text-[10px] text-on-surface-variant leading-relaxed h-full overflow-y-auto custom-scrollbar">
                          {response.headers || t('tool.resNoHeaders')}
                        </pre>
                      </div>
                      <div className="bg-surface-container-lowest border border-outline-variant/20 p-4 h-60 overflow-hidden">
                        <p className="font-mono text-[9px] text-secondary uppercase mb-2 tracking-widest">{t('tool.resBody')}</p>
                        <pre className="font-mono text-[10px] text-secondary-dim leading-relaxed h-full pb-6 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                          {typeof response.data === 'string'
                            ? response.data
                            : JSON.stringify(response.data, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Verdict Card — FIXED COLORS */}
                    {verdict && (
                      <div
                        className={`relative border-2 p-8 flex flex-col items-center justify-center text-center overflow-hidden ${
                          verdict.isError
                            ? 'border-error/60 bg-[#1a0500]'
                            : 'border-primary/60 bg-[#001a05]'
                        }`}
                      >
                        {/* Top accent bar */}
                        <div className={`absolute top-0 left-0 w-full h-1 ${verdict.isError ? 'bg-error' : 'bg-primary'}`}></div>

                        {/* Glow effect */}
                        <div
                          className={`absolute inset-0 opacity-10 ${
                            verdict.isError
                              ? 'bg-[radial-gradient(ellipse_at_center,rgba(255,115,81,0.3),transparent_70%)]'
                              : 'bg-[radial-gradient(ellipse_at_center,rgba(0,236,59,0.3),transparent_70%)]'
                          }`}
                        ></div>

                        <div className="relative z-10">
                          <span
                            className={`material-symbols-outlined text-5xl mb-4 ${
                              verdict.isError ? 'text-error' : 'text-primary-dim'
                            }`}
                          >
                            {verdict.isError ? 'gpp_bad' : 'verified_user'}
                          </span>

                          <p className={`font-mono text-[10px] uppercase tracking-[0.2em] mb-2 ${verdict.color}`}>
                            {t('tool.resForensic')}
                          </p>
                          <h3
                            className={`text-2xl lg:text-3xl font-black uppercase tracking-tighter mb-4 ${verdict.color} glitch-hover`}
                          >
                            {verdict.title}
                          </h3>
                          <p className="font-mono text-[10px] text-on-surface-variant max-w-[280px] mx-auto leading-relaxed border-t border-outline-variant/20 pt-4">
                            {verdict.desc}
                          </p>

                          {!verdict.isError && (
                            <div className="mt-6 px-4 py-2.5 bg-primary/10 border border-primary/20 text-primary font-mono text-[10px] uppercase font-bold inline-flex items-center gap-2">
                              <span className="material-symbols-outlined text-sm">shield</span>
                              {t('tool.resShieldMsg')}
                            </div>
                          )}
                          {verdict.isError && verdict.color === 'text-error' && (
                            <div className="mt-6 px-4 py-2.5 bg-error/10 border border-error/20 text-error font-mono text-[10px] uppercase font-bold inline-flex items-center gap-2">
                              <span className="material-symbols-outlined text-sm">bug_report</span>
                              {t('tool.resVulnMsg')}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* System Footer */}
      <div className="mt-12 flex flex-wrap justify-between items-center font-mono text-[10px] text-outline px-2 gap-4">
        <div className="flex items-center gap-4">
          <span>
            <span className="text-primary-dim">●</span> {t('tool.sysProxy')}
          </span>
          <span>TLS v1.3</span>
          <span>PID: 0x8DA4</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{t('tool.sysHeartbeat')}</span>
          <span className="w-2 h-2 bg-primary-dim animate-pulse"></span>
        </div>
      </div>
    </main>
  );
}
