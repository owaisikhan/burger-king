export function Footer() {
  return (
    <footer className="border-t border-stroke bg-bg">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row md:px-12">
        <div className="flex flex-col leading-none">
          <span className="font-display text-base tracking-[0.25em] text-text">SMASH</span>
          <span className="font-display text-[9px] tracking-[0.4em] text-muted">GRIDDLE-FORGED</span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-display text-[11px] tracking-[0.2em] text-muted md:flex-nowrap md:justify-start md:gap-6">
          {["INSTAGRAM", "TIKTOK", "RESERVATIONS", "CONTACT"].map((l) => (
            <a key={l} href="#" className="transition-colors hover:text-text">
              {l}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="font-display text-[11px] tracking-[0.2em] text-muted">OPEN DAILY 12–22</span>
        </div>
      </div>
    </footer>
  );
}
