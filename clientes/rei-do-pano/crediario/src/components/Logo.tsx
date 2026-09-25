export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="45" fill="#c20605" stroke="#c6a000" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="#c6a000" strokeWidth="1.5" />
      <path d="M30 65 L70 65 L65 52 L57 58 L50 42 L43 58 L35 52 Z" fill="#ffe44d" stroke="#c6a000" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="30" cy="65" r="2" fill="#fff199" />
      <circle cx="70" cy="65" r="2" fill="#fff199" />
      <circle cx="65" cy="52" r="2" fill="#fff199" />
      <circle cx="57" cy="58" r="1.5" fill="#fff199" />
      <circle cx="50" cy="42" r="2.5" fill="#fff199" />
      <circle cx="43" cy="58" r="1.5" fill="#fff199" />
      <circle cx="35" cy="52" r="2" fill="#fff199" />
      <rect x="35" y="67" width="30" height="4" rx="1.5" fill="#c6a000" />
    </svg>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <LogoMark />
      <div className="leading-tight">
        <div className="font-display text-xl font-extrabold tracking-wide text-brand">REI DO PANO</div>
        <div className="text-[0.62rem] font-bold uppercase tracking-[0.26em] text-gold">Rainha Modas</div>
      </div>
    </div>
  );
}

export function WhatsappIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M10 0C4.477 0 0 4.477 0 10c0 1.765.458 3.42 1.26 4.86L0 20l5.302-1.39A9.96 9.96 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm5.29 14.073c-.22.617-1.297 1.18-1.768 1.22-.471.04-.91.21-3.065-.638-2.605-1.026-4.27-3.7-4.397-3.873-.126-.173-1.03-1.37-1.03-2.613 0-1.243.652-1.854.883-2.108.23-.253.504-.316.672-.316l.484.009c.155.007.363-.059.568.434.21.504.714 1.74.776 1.866.062.126.103.274.02.442-.083.167-.124.271-.247.417-.124.146-.26.326-.37.438-.124.124-.253.26-.11.51.144.253.638 1.053 1.368 1.704.94.836 1.732 1.094 1.976 1.216.244.124.387.104.53-.063.144-.166.617-.72.782-.968.165-.247.33-.206.558-.124.228.082 1.45.683 1.697.808.248.124.413.186.475.29.062.103.062.6-.158 1.217z" />
    </svg>
  );
}
