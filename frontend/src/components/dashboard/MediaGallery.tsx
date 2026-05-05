"use client";

export default function MediaGallery() {
  const dummyImages = [
    { id: 1, name: "CAMP_01.jpg", size: "4.2 MB", type: "image", src: "/mockups/mockup.jpg" },
    { id: 2, name: "REEL_RAW.mp4", size: "128 MB", type: "video", src: "/mockups/mockup.mp4" },
    { id: 3, name: "STORY_T.mp4", size: "64 MB", type: "video", src: "/mockups/mockup.mp4" },
    { id: 4, name: "HERO_IMG.jpg", size: "5.5 MB", type: "image", src: "/mockups/mockup.jpg" },
  ];

  return (
    <div className="font-sans w-full">
      <h3 className="text-black font-bold mb-4 tracking-widest text-lg border-b border-gray-300 pb-2">RECENT MEDIA (109 GB)</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {dummyImages.map((img) => (
          <div key={img.id} className="bg-white hover:bg-gray-50 flex flex-col items-center justify-start border border-gray-200 shadow-sm transition-colors cursor-pointer aspect-square relative group overflow-hidden pb-4">
            
            <div className="w-full h-3/4 bg-gray-100 flex items-center justify-center relative mb-2">
              {img.type === "image" ? (
                <img src={img.src} alt={img.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
              ) : (
                <>
                  <video src={img.src} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" muted loop playsInline onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()} />
                  {/* Play icon overlay for videos */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/50 rounded-full p-2">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </>
              )}
            </div>

            <span className="text-black font-bold text-xs tracking-wide text-center px-2 truncate w-full">{img.name}</span>
            <span className="text-gray-400 text-[10px] mt-1">{img.size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}