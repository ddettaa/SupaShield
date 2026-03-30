import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, join, extname } from "node:path";

// ─── Constants ──────────────────────────────────────────────────────────
// Karena berjalan di Vercel, kita perlu mendefinisikan PROJECT_ROOT ke root direktori
const PROJECT_ROOT = process.cwd();

// ─── Injection Templates ──────────────────────────────────────────────
const INJECTION_TEMPLATES = [
  {
    id: "dump_users",
    label: "Dump Seluruh Tabel Users",
    desc: "Mengecek apakah RLS aktif dengan request SELECT * pada tabel users. Jika data user dikembalikan, berarti RLS tidak aktif atau terlalu permisif.",
    path: "/rest/v1/users?select=*",
    method: "GET" as const,
    severity: "TINGGI",
    payload: null,
  },
  {
    id: "privilege_escalation",
    label: "Eskalasi Privilege (is_admin)",
    desc: "Mencoba menyuntikkan kolom is_admin menjadi true pada tabel profiles. Menguji apakah user bisa menaikkan privilege diri sendiri.",
    path: "/rest/v1/profiles?id=eq.1",
    method: "PATCH" as const,
    severity: "KRITIS",
    payload: { is_admin: true, role: "superadmin" },
  },
  {
    id: "idor",
    label: "Baca Data Pengguna Lain (IDOR)",
    desc: "Mengambil data profil milik user_id lain tanpa autentikasi pemilik. Menguji Insecure Direct Object Reference.",
    path: "/rest/v1/profiles?user_id=eq.VICTIM-UUID-HERE&select=*",
    method: "GET" as const,
    severity: "TINGGI",
    payload: null,
  },
  {
    id: "rpc_no_auth",
    label: "Panggil RPC Tanpa Auth",
    desc: "Mengeksekusi fungsi SECURITY DEFINER yang terbuka tanpa token valid. Menguji apakah RPC function terekspos.",
    path: "/rest/v1/rpc/get_all_users",
    method: "POST" as const,
    severity: "KRITIS",
    payload: {},
  },
  {
    id: "delete_anonymous",
    label: "Hapus Baris Anonim (DELETE)",
    desc: "Menguji apakah user anonim bisa menghapus data sensitif tanpa izin yang sah.",
    path: "/rest/v1/orders?id=eq.999",
    method: "DELETE" as const,
    severity: "KRITIS",
    payload: null,
  },
  {
    id: "insert_fake",
    label: "Sisipkan Data Palsu (INSERT)",
    desc: "Menyuntikkan baris baru ke tabel tanpa izin autentikasi yang sah.",
    path: "/rest/v1/reviews",
    method: "POST" as const,
    severity: "SEDANG",
    payload: { product_id: 1, rating: 5, body: "Injected by SupaShield MCP" },
  },
] as const;

// ─── Security Verdict Logic ───────────────────────────────────────────
interface ScanResult {
  status: number;
  statusText: string;
  latencyMs: number;
  headers: string;
  data: any;
  requestMade: {
    url: string;
    method: string;
    payload: string | null;
  };
}

interface Verdict {
  title: string;
  description: string;
  isVulnerable: boolean;
  severity: "SAFE" | "WARNING" | "VULNERABLE" | "CRITICAL";
}

function analyzeVerdict(result: ScanResult, method: string): Verdict {
  const status = result.status;

  if (status >= 200 && status < 300) {
    if (method === "GET" && Array.isArray(result.data) && result.data.length === 0) {
      return {
        title: "AMAN / DATA KOSONG",
        description: `Status 200 OK tapi data kosong. RLS kemungkinan memfilter seluruh baris — atau tabel memang tidak berisi data.`,
        isVulnerable: false,
        severity: "SAFE",
      };
    }
    return {
      title: "KERENTANAN TERBUKA",
      description: `HTTP ${status} — Server menerima dan mengeksekusi payload. Jika Anda melihat atau memodifikasi data akun pengguna lain, RLS Anda tembus!`,
      isVulnerable: true,
      severity: "CRITICAL",
    };
  }

  if (status === 401 || status === 403) {
    return {
      title: "BENTENG AKTIF",
      description: `Status ${status}. Row Level Security berhasil menolak operasi asing. Serangan tergagalkan.`,
      isVulnerable: false,
      severity: "SAFE",
    };
  }

  if (status === 404) {
    return {
      title: "TARGET MATI",
      description: `Status 404. Route/tabel tidak ditemukan. Pastikan path endpoint benar.`,
      isVulnerable: false,
      severity: "WARNING",
    };
  }

  return {
    title: "ANOMALI API",
    description: `HTTP ${status}. Respons tidak umum. Periksa sintaks filter PostgREST.`,
    isVulnerable: false,
    severity: "WARNING",
  };
}

// ─── HTTP Request Engine ──────────────────────────────────────────────
async function executeSupabaseRequest(url: string, key: string, method: string, body?: string | null): Promise<ScanResult> {
  const headers: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };

  if (method === "PATCH" && url.includes("/rest/v1/")) headers["Prefer"] = "return=representation";
  if (method === "POST" && url.includes("/rest/v1/") && !url.includes("/rpc/")) headers["Prefer"] = "return=representation";

  const startTime = Date.now();
  try {
    const response = await fetch(url, { method, headers, body: method !== "GET" && body ? body : undefined });
    const latency = Date.now() - startTime;
    const responseHeadersText = Array.from(response.headers.entries()).map(([k, v]) => `${k}: ${v}`).join("\n");

    let bodyData: any;
    const bodyText = await response.text();
    try { bodyData = JSON.parse(bodyText); } catch { bodyData = bodyText; }

    return {
      status: response.status,
      statusText: response.statusText,
      latencyMs: latency,
      headers: responseHeadersText,
      data: bodyData,
      requestMade: { url, method, payload: body ?? null },
    };
  } catch (error: any) {
    return {
      status: 0,
      statusText: "Connection Failed",
      latencyMs: Date.now() - startTime,
      headers: "",
      data: { error: error.message },
      requestMade: { url, method, payload: body ?? null },
    };
  }
}

// ─── Format Helpers ───────────────────────────────────────────────────
function formatScanResult(result: ScanResult, verdict: Verdict): string {
  const divider = "═".repeat(60);
  const thinDivider = "─".repeat(60);

  let output = `\n${divider}\n  🛡️  SUPASHIELD SCAN REPORT\n${divider}\n\n`;
  const icon = verdict.isVulnerable ? "🔴" : verdict.severity === "WARNING" ? "🟡" : "🟢";
  output += `${icon} VERDICT: ${verdict.title}\n   ${verdict.description}\n\n`;

  output += `${thinDivider}\n📡 REQUEST\n   Method : ${result.requestMade.method}\n   URL    : ${result.requestMade.url}\n`;
  if (result.requestMade.payload) output += `   Payload: ${result.requestMade.payload}\n`;

  output += `\n${thinDivider}\n📥 RESPONSE\n   Status  : HTTP ${result.status} ${result.statusText}\n   Latency : ${result.latencyMs}ms\n\n`;

  output += `${thinDivider}\n📄 BODY\n`;
  const bodyStr = typeof result.data === "string" ? result.data : JSON.stringify(result.data, null, 2);
  output += bodyStr.length > 2000 ? `${bodyStr.substring(0, 2000)}\n... (truncated, ${bodyStr.length} chars total)\n` : `${bodyStr}\n`;
  output += `\n${divider}\n`;
  
  return output;
}

// ─── Initialize MCP Server & Transport ────────────────────────────────
const server = new McpServer({ name: "supashield-vercel", version: "1.0.0" });

// Tool 1: supashield_scan
server.tool(
  "supashield_scan",
  "Mengirim request ke Supabase REST API dan menganalisis kerentanan Row Level Security (RLS). Server bertindak sebagai proxy langsung dan memberikan verdict otomatis.",
  {
    supabase_url: z.string().url().describe("Full URL endpoint Supabase, contoh: https://xxx.supabase.co/rest/v1/users?select=*"),
    supabase_key: z.string().min(1).describe("Supabase anon key atau JWT bearer token untuk autentikasi"),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).describe("HTTP method untuk request"),
    body: z.string().optional().describe("JSON body sebagai string (Opsional)"),
  },
  async ({ supabase_url, supabase_key, method, body }) => {
    if (body) {
      try { JSON.parse(body); } catch { return { content: [{ type: "text" as const, text: "❌ ERROR: JSON body tidak valid." }] }; }
    }
    const result = await executeSupabaseRequest(supabase_url, supabase_key, method, body);
    const verdict = analyzeVerdict(result, method);
    return { content: [{ type: "text" as const, text: formatScanResult(result, verdict) }] };
  }
);

// Tool 2: supashield_quick_test
server.tool(
  "supashield_quick_test",
  "Menjalankan template injeksi preset SupaShield dengan satu perintah.",
  {
    base_url: z.string().url().describe("Base URL proyek Supabase, contoh: https://xxx.supabase.co"),
    supabase_key: z.string().min(1).describe("Supabase anon key atau JWT bearer token"),
    template: z.enum(["dump_users", "privilege_escalation", "idor", "rpc_no_auth", "delete_anonymous", "insert_fake"]).describe("ID template injeksi"),
  },
  async ({ base_url, supabase_key, template }) => {
    const tmpl = INJECTION_TEMPLATES.find((t) => t.id === template);
    if (!tmpl) return { content: [{ type: "text" as const, text: `❌ Template "${template}" tidak ditemukan.` }] };

    const cleanBase = base_url.replace(/\/+$/, "");
    const result = await executeSupabaseRequest(cleanBase + tmpl.path, supabase_key, tmpl.method, tmpl.payload ? JSON.stringify(tmpl.payload) : null);
    const verdict = analyzeVerdict(result, tmpl.method);
    
    let output = `\n🧪 TEMPLATE: ${tmpl.label}\n   Severity: ${tmpl.severity}\n`;
    output += formatScanResult(result, verdict);
    return { content: [{ type: "text" as const, text: output }] };
  }
);

// Tool 3: supashield_analyze_rls
server.tool(
  "supashield_analyze_rls",
  "Menjalankan SEMUA 6 template injeksi secara batch dan menghasilkan laporan kerentanan komprehensif.",
  {
    base_url: z.string().url().describe("Base URL proyek Supabase"),
    supabase_key: z.string().min(1).describe("Supabase anon key atau JWT bearer token"),
  },
  async ({ base_url, supabase_key }) => {
    const cleanBase = base_url.replace(/\/+$/, "");
    let vulnerable = 0; let safe = 0; let warnings = 0;
    
    let output = `\n════════════════════════════════════════════════════════════\n`;
    output += `  🛡️  SUPASHIELD — FULL RLS AUDIT REPORT\n`;
    output += `════════════════════════════════════════════════════════════\n\n`;

    for (const tmpl of INJECTION_TEMPLATES) {
      const result = await executeSupabaseRequest(cleanBase + tmpl.path, supabase_key, tmpl.method, tmpl.payload ? JSON.stringify(tmpl.payload) : null);
      const verdict = analyzeVerdict(result, tmpl.method);
      
      if (verdict.isVulnerable) vulnerable++;
      else if (verdict.severity === "WARNING") warnings++;
      else safe++;

      const icon = verdict.isVulnerable ? "🔴" : verdict.severity === "WARNING" ? "🟡" : "🟢";
      output += `${icon} [${tmpl.severity}] ${tmpl.label}\n`;
      output += `   Status  : HTTP ${result.status} ${result.statusText} (${result.latencyMs}ms)\n`;
      output += `   Verdict : ${verdict.title}\n\n`;
    }

    output += `────────────────────────────────────────────────────────────\n`;
    output += `📊  HASIL: ${vulnerable} RENTAN | ${warnings} WARNING | ${safe} AMAN\n`;
    output += `════════════════════════════════════════════════════════════\n`;
    return { content: [{ type: "text" as const, text: output }] };
  }
);

// Tool 4: supashield_list_templates
server.tool(
  "supashield_list_templates",
  "Menampilkan daftar template injeksi yang tersedia.",
  {},
  async () => {
    let output = `\n🧪 SUPASHIELD — DAFTAR TEMPLATE INJEKSI\n────────────────────────────────────────────────────────────\n\n`;
    for (const tmpl of INJECTION_TEMPLATES) {
      output += `• ID: ${tmpl.id} (${tmpl.severity}) — ${tmpl.label}\n`;
    }
    return { content: [{ type: "text" as const, text: output }] };
  }
);

// Tool 5: supashield_read_doc
server.tool(
  "supashield_read_doc",
  "Membaca file markdown dari proyek SupaShield (misal SKILL.md) untuk diedukasikan kepada AI. File tersedia bisa dilihat dengan parameter list_available=true",
  {
    file_path: z.string().optional().describe("Path relatif file markdown. Contoh: '.agents/skills/supashield-pentest/SKILL.md'"),
    list_available: z.boolean().optional().describe("Tampilkan daftar file tersedia"),
  },
  async ({ file_path, list_available }) => {
    if (list_available) {
      const mdFiles: string[] = [];
      function scanDir(dir: string, prefix: string = "") {
        try {
          // Hanya nge-scan directory aman untuk Vercel
          const allowedDirs = [".agents", "mcp-server"];
          const entries = readdirSync(dir);
          for (const entry of entries) {
            if (!prefix && !allowedDirs.includes(entry) && entry !== "README.md") continue;
            const fullPath = join(dir, entry);
            const relPath = prefix ? `${prefix}/${entry}` : entry;
            try {
              if (statSync(fullPath).isDirectory()) scanDir(fullPath, relPath);
              else if (extname(entry).toLowerCase() === ".md") mdFiles.push(relPath);
            } catch { /* skip */ }
          }
        } catch { /* skip */ }
      }
      scanDir(PROJECT_ROOT);
      
      let out = `📄 File Markdown Tersedia di SupaShield (Vercel Build):\n\n`;
      mdFiles.forEach(f => out += `  • ${f}\n`);
      return { content: [{ type: "text" as const, text: out }] };
    }

    if (!file_path) return { content: [{ type: "text" as const, text: "❌ file_path atau list_available=true diperlukan." }] };
    
    // Fallback static files if missing from lambda in Vercel
    const absolutePath = resolve(PROJECT_ROOT, file_path);
    if (!absolutePath.startsWith(PROJECT_ROOT)) return { content: [{ type: "text" as const, text: "❌ Akses keluar direktori proyek ditolak." }] };
    if (!existsSync(absolutePath)) return { content: [{ type: "text" as const, text: `❌ File tidak ditemukan di ${absolutePath}` }] };

    try {
      const content = readFileSync(absolutePath, "utf-8");
      return { content: [{ type: "text" as const, text: content }] };
    } catch (e: any) {
      return { content: [{ type: "text" as const, text: `❌ Gagal baca file: ${e.message}` }] };
    }
  }
);

// Resource 1: SKILL
server.resource(
  "skill-instructions",
  "supashield://skills/supashield-pentest",
  { description: "Instruksi untuk agen AI / panduan pentest.", mimeType: "text/markdown" },
  async () => {
    try {
      const content = readFileSync(resolve(PROJECT_ROOT, ".agents/skills/supashield-pentest/SKILL.md"), "utf-8");
      return { contents: [{ uri: "supashield://skills/supashield-pentest", mimeType: "text/markdown", text: content }] };
    } catch { return { contents: [{ uri: "supashield://skills/supashield-pentest", mimeType: "text/plain", text: "File not found." }] }; }
  }
);

// ─── Setup Vercel HTTP Web Standard Transport ─────────────────────────
// Stateless: no sessionId generator required
const transport = new WebStandardStreamableHTTPServerTransport({
  sessionIdGenerator: undefined
});

// Immediately connect the transport to the server runtime
// (In stateless mode, connections aren't bound to memory long-term)
let isConnected = false;
async function ensureConnection() {
  if (!isConnected) {
    await server.connect(transport);
    isConnected = true;
  }
}

export async function GET(req: Request) {
  await ensureConnection();
  return transport.handleRequest(req);
}

export async function POST(req: Request) {
  await ensureConnection();
  return transport.handleRequest(req);
}
