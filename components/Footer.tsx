import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full flex flex-col md:flex-row justify-between items-start gap-8 px-12 pb-24 bg-[#0e0e0e] p-12 mt-20 border-t-4 border-double border-[#262626]">
      <div className="flex flex-col gap-4">
        <span className="text-[#ff3333] font-bold font-mono text-xs uppercase tracking-tighter">SUPASHIELD // STAY SAFE</span>
        <p className="text-gray-700 font-mono text-xs uppercase tracking-tighter max-w-xs">
          © 2024 SUPASHIELD // STAY SAFE. Dibuat dengan keringat dingin saat audit database.
        </p>
      </div>
      <div className="flex flex-wrap gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-white font-mono text-xs uppercase mb-2">Socials</span>
          <a className="text-gray-700 hover:text-white transition-all font-mono text-xs uppercase tracking-tighter" href="#">GitHub</a>
          <a className="text-gray-700 hover:text-white transition-all font-mono text-xs uppercase tracking-tighter" href="#">Twitter</a>
          <a className="text-gray-700 hover:text-white transition-all font-mono text-xs uppercase tracking-tighter" href="#">Discord</a>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-white font-mono text-xs uppercase mb-2">Resource</span>
          <Link className="text-gray-700 hover:text-white transition-all font-mono text-xs uppercase tracking-tighter" href="/security-guide">RLS Guide</Link>
          <a className="text-gray-700 hover:text-white transition-all font-mono text-xs uppercase tracking-tighter" href="#">API Docs</a>
          <a className="text-gray-700 hover:text-white transition-all font-mono text-xs uppercase tracking-tighter" href="#">Legal</a>
        </div>
      </div>
    </footer>
  );
}
