import Link from 'next/link';

export default function PropuestaPage() {
  const columns = [
    "Influencer", "Seguidores IG", "Seguidores TT", "Suscriptores YT", "Est. Views Reel",
    "Est. Views Story", "Est Views TT", "Est Views YT", "ER% IG", "ER% TT", "ER%",
    "Est. Views", "Costo Reel", "Costo Story", "Costo TikTok", "Costo YouTube",
    "Pauta por mes", "QTY Reel", "QTY Story", "QTY TikTok", "QTY YouTube",
    "Meses de pauta", "Costo", "Presupuesto"
  ];

  // Setup Mock Data Grid
  const rows = Array.from({ length: 8 }).map((_, rIdx) => {
    return columns.map((col, cIdx) => {
      if (col === "Influencer" && rIdx === 0) return "XXXXXXX";
      if (col === "Influencer") return "";
      if (col.startsWith("Est. Views") || col.startsWith("Est Views") || col === "Est. Views") return "0";
      if (col.startsWith("ER%")) return "#DIV/0!";
      if (col === "Costo" || col === "Presupuesto") return "MXN 0";
      return "";
    });
  });

  const totals = columns.map((col) => {
    if (col === "Influencer") return "TOTAL";
    if (col.startsWith("ER%")) return "#DIV/0!";
    if (col.startsWith("Est. Views") || col.startsWith("Est Views") || col === "Est. Views") return "0";
    if (col.startsWith("QTY") || col === "Meses de pauta") return "0";
    if (col === "Costo" || col === "Presupuesto") return "MXN 0";
    return "";
  });

  return (
    <div className="min-h-screen bg-black flex flex-col p-8 text-white font-sans overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
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

      <div className="text-2xl mb-8 tracking-wide">Propuesta</div>

      {/* Main Content Area - Table Container (Horizontal Scroll allowed for large data) */}
      <div className="w-full flex-grow overflow-x-auto pb-8">
        <table className="table-fixed border-collapse border border-white w-max min-w-full text-xs text-center">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="border border-white p-2 font-normal w-24 align-middle bg-white/5 whitespace-pre-wrap leading-tight h-16">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-t border-white h-8 hover:bg-white/10 transition-colors">
                {row.map((cell, colIdx) => (
                  <td key={colIdx} className="border-r border-white border-l last:border-r-0 px-2 font-light">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            {/* Total Row */}
            <tr className="border-t border-white bg-white/10 h-8 font-bold">
              {totals.map((cell, colIdx) => (
                <td key={colIdx} className="border-r border-white border-l last:border-r-0 px-2 text-[10px]">
                  {cell}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}