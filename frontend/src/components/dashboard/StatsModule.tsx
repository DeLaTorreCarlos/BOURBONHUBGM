export default function StatsModule() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
      <div className="bg-white p-6 shadow-sm border border-gray-200 flex flex-col justify-center">
        <div className="text-gray-500 text-xs font-bold mb-1 tracking-widest uppercase">Storage Used</div>
        <div className="text-3xl text-black font-serif">109 GB</div>
      </div>
      <div className="bg-white p-6 shadow-sm border border-gray-200 flex flex-col justify-center">
        <div className="text-gray-500 text-xs font-bold mb-1 tracking-widest uppercase">Active Influencers</div>
        <div className="text-3xl text-black font-serif">142</div>
      </div>
      <div className="bg-white p-6 shadow-sm border border-gray-200 flex flex-col justify-center">
        <div className="text-gray-500 text-xs font-bold mb-1 tracking-widest uppercase">Scrape Jobs</div>
        <div className="text-3xl text-black font-serif flex items-center gap-3">
          <span>8</span>
          <span className="text-sm font-sans font-normal text-green-600 bg-green-100 px-2 py-1 rounded">Running</span>
        </div>
      </div>
    </div>
  );
}