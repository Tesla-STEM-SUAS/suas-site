"use client";

export default function GalleryPage() {
  const photos = [
    "/images/image-21.png",
    "/images/image-22.png",
    "/images/image-23.png",
    "/images/image-24.png",
    "/images/image-25.png",
    "/images/image-26.png",
  ];

  // Layout positions/rotation for a scattered polaroid look. You can
  // replace the paths above with real images under /public/gallery/.
  const layout = [
    { left: "6%", top: "6%", rotate: -6, w: 64 },
    { left: "50%", top: "4%", rotate: 6, w: 72 },
    { left: "8%", top: "44%", rotate: 8, w: 96 },
    { left: "55%", top: "42%", rotate: -4, w: 64 },
    { left: "10%", top: "90%", rotate: -8, w: 72 },
    { left: "60%", top: "76%", rotate: 6, w: 72 },
  ];

  return (
    <main className="px-6 py-16 md:py-24 lg:py-32 font-sans h-[1400px]">
      <section className="max-w-4xl mx-auto text-center font-sans">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-300">
          SUAS @Tesla Stem High School
        </h2>
        <h1 className="mt-4 text-5xl md:text-7xl font-extrabold text-white">
          Our Gallery
        </h1>
        <p className="mt-6 text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
          These photos showcase the team's hard work, focus, and collaboration as
          they design, build, and test their drones — highlighting not just
          their dedication but also the hands-on learning and growth that drive
          their success.
        </p>
      </section>

      <section className="relative max-w-5xl mx-auto mt-12 md:mt-20 h-[68vh] md:h-[750px]">
        {/* scattered photos */}
        {layout.map((pos, idx) => {
          const src = photos[idx % photos.length];
          return (
            <div
              key={idx}
              className="absolute drop-shadow-2xl"
              style={{
                left: pos.left,
                top: pos.top,
                transform: `rotate(${pos.rotate}deg)`,
                width: `${pos.w}px`,
              }}
            >
              <div className="bg-white border-8 min-w-96 border-white">
                <img
                  src={src}
                  alt={`gallery-${idx + 1}`}
                  onError={(e) => {
                    // fallback to a known public asset if gallery images are missing
                    (e.currentTarget as HTMLImageElement).src = "/logo.png";
                  }}
                  className="block w-full h-48 object-cover"
                />
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
