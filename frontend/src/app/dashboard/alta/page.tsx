import Link from 'next/link';
import UserDropdown from '@/components/dashboard/UserDropdown';

export default function AltaPage() {
  const formFieldsCol1 = [
    "Nombre",
    "Contacto",
    "Correo",
    "Persona (fisica, moral, empresarial)",
    "Razón Social",
    "RFC",
    "Dirección fiscal",
    "Código postal",
    "Representante legal"
  ];

  const formFieldsCol2 = [
    "Banco",
    "Número de cuenta",
    "CLABE",
    "Titular de la cuenta",
    "CSF (archivo adjunto)",
    "Opinión de cumplimiento (archivo adjunto)"
  ];

  const categories = [
    "Cliente",
    "Influencer",
    "Agencia",
    "Representante",
    "Proveedor"
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col p-8 text-white font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-16">
        <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
          <span className="text-3xl font-serif tracking-widest">BOURBON</span>
          <span className="text-3xl font-bold tracking-wide">HUB</span>
        </Link>
        <UserDropdown />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-row flex-grow w-full max-w-6xl mx-auto gap-8 mt-8">
        
        {/* Sidebar */}
        <div className="flex flex-row items-start w-1/4">
          <div className="text-lg tracking-widest mr-8 flex-shrink-0 mt-3 pt-0.5">Alta</div>
          <div className="flex flex-col border-l border-white/50 pl-8 gap-10 py-3">
            {categories.map((cat, i) => (
              <div key={i} className="text-md tracking-wide hover:text-white/70 cursor-pointer">
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-grow grid grid-cols-2 gap-x-8 gap-y-4 items-start pl-8">
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            {formFieldsCol1.map((placeholder, idx) => (
              <input
                key={`col1-${idx}`}
                type="text"
                placeholder={placeholder}
                className="bg-transparent border border-white px-4 py-3 outline-none text-white placeholder-white text-sm w-full tracking-wide"
              />
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            {formFieldsCol2.map((placeholder, idx) => (
              <input
                key={`col2-${idx}`}
                type="text"
                placeholder={placeholder}
                className="bg-transparent border border-white px-4 py-3 outline-none text-white placeholder-white text-sm w-full tracking-wide"
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}