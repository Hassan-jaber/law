const items = [
  { value: '+15', label: 'عامًا من الخبرة' },
  { value: '●', label: 'استشارات قانونية متخصصة', icon: true },
  { value: '✓', label: 'ثقة مبنية على النتائج', icon: true },
]

/** Glass trust strip shown under the CTAs. */
export default function TrustBar() {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3" data-reveal>
      {items.map((it) => (
        <li key={it.label} className="glass flex items-center gap-3 rounded-2xl px-4 py-3.5">
          <span
            className={
              it.icon
                ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-sm text-gold-300'
                : 'font-display text-2xl font-extrabold text-gold-gradient'
            }
          >
            {it.icon ? it.value : it.value}
          </span>
          <span className="text-[13px] leading-snug text-slate-300">{it.label}</span>
        </li>
      ))}
    </ul>
  )
}
