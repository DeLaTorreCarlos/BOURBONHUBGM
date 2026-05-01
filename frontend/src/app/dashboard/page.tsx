import Link from 'next/link';

export default function Dashboard() {
  const buttons = [
    "ALTA", "PROPUESTA", "CONTRATO", "REPORTE",
    "INFLUENCERS", "INSIGHTS", "TEMPLATES", "NOTEPAD"
  ];
  return (
    <div className="min-h-screen bg-black flex flex-col p-8 text-white font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <span className="text-3xl font-serif tracking-widest">BOURBON</span>
          <span className="text-3xl font-bold tracking-wide">HUB</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm">¡Hola Sof!</span>
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <svg className="w-5 h-5 text-black mt-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow bg-[#EAEAEA] mb-6 flex flex-col items-center justify-center text-black/40 overflow-hidden min-h-[500px]">
         <p className="text-xl font-bold mb-4">Dashboard Workspace Area</p>
         <p className="text-sm">Mockup View: Media Gallery or Module Data renders here.</p>
      </div>

      {/* Footer Buttons */}
      <div className="grid grid-cols-4 gap-4">
        {buttons.map(btn => (
          <Link
            key={btn}
            href={`/dashboard/${btn.toLowerCase()}`}
            className="border border-white py-3 text-center font-bold hover:bg-white hover:text-black transition-colors tracking-widest text-sm block"
          >
            {btn}
          </Link>
        ))}
      </div>
    </div>
  );
}