const TILES = [
  { id: 1, img: "/grill/open-flame.webp", label: "MAILLARD SEAR", sub: "Flat-Top Steel · 230 °C", span: 2 },
  { id: 2, img: "/menu/wagyu.webp", label: "FRESH-GROUND BEEF", sub: "80/20 Blend · Single Smash", span: 1 },
  { id: 3, img: "/ingredients/brioche.webp", label: "TOASTED BRIOCHE", sub: "Butter-Glazed · House Baked", span: 1 },
  { id: 4, img: "/ingredients/cheddar.webp", label: "MELTED AMERICAN", sub: "Griddle-Melted · Edge to Edge", span: 1 },
  { id: 5, img: "/ingredients/bacon.webp", label: "SMOKED BACON", sub: "Applewood · Optional Add-On", span: 1 },
  { id: 6, img: "/ingredients/onions.webp", label: "SMASHED ONIONS", sub: "Griddle-Charred · Folded In", span: 1 },
  { id: 7, img: "/ingredients/truffle-mayo.webp", label: "SMASH SAUCE", sub: "House-Made · Tangy-Sweet", span: 1 },
  { id: 8, img: "/ingredients/egg.webp", label: "FARM EGG", sub: "Optional · Runny Yolk", span: 1 },
  { id: 9, img: "/ingredients/pickle.webp", label: "DILL PICKLE", sub: "House-Brined · Fresh Dill", span: 1 },
  { id: 10, img: "/menu/smoke.webp", label: "GRIDDLE FORGED", sub: "Direct Steel · Full Contact", span: 2 },
];

export function Craft() {
  return (
    <section className="bg-bg py-24 px-6 md:px-16">
      <div className="mb-14 flex items-end justify-between border-b border-stroke pb-6">
        <div>
          <p className="font-display text-xs tracking-[0.25em] text-accent mb-2">{"// 05. THE CRAFT"}</p>
          <h2 className="font-display text-3xl md:text-5xl tracking-tight text-text uppercase">
            One Patty.
            <br className="md:hidden" /> Uncompromised.
          </h2>
        </div>
        <p className="hidden md:block text-muted text-sm max-w-xs text-right leading-relaxed">
          Ten hand-selected components. Each sourced, cured, or griddle-charred to its peak, then smashed into one
          burger.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {TILES.map((t) => (
          <div
            key={t.id}
            className={`group relative overflow-hidden rounded-sm bg-surface h-40 md:h-52 ${
              t.span === 2 ? "col-span-2" : "col-span-1"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={t.img}
              alt={t.label}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 p-4 md:p-5">
              <p className="font-display text-[10px] md:text-xs tracking-[0.2em] text-accent mb-1">{t.label}</p>
              <p className="text-text/60 text-[10px] md:text-xs tracking-wide">{t.sub}</p>
            </div>
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-accent/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>
      <div className="mt-14 flex items-center gap-6 border-t border-stroke pt-6">
        <span className="font-display text-[10px] tracking-[0.3em] text-muted">
          SMASH · FRESH-GROUND · GRIDDLE-FORGED · SEARED
        </span>
        <div className="flex-1 h-px bg-stroke" />
        <span className="font-display text-[10px] tracking-[0.2em] text-accent/60">THE SEAR</span>
      </div>
    </section>
  );
}
