import Link from 'next/link';
import StatsModule from '@/components/dashboard/StatsModule';
import MediaGallery from '@/components/dashboard/MediaGallery';
import UserDropdown from '@/components/dashboard/UserDropdown';

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
        <UserDropdown />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow bg-[#EAEAEA] mb-6 flex flex-col items-start p-10 overflow-y-auto">
         <StatsModule />
         <MediaGallery />
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