// Sport-specific line art used for profile covers and post cards.
// Each sport is drawn from the markings of its field of play.
const family = (sport = '') => {
  const s = sport.toLowerCase()
  if (s.includes('swim') || s.includes('aquatic') || s.includes('canoe')) return 'pool'
  if (s.includes('athletic') || s.includes('marathon') || s.includes('throw') || s.includes('sprint')) return 'track'
  if (s.includes('archery') || s.includes('shooting') || s.includes('precision')) return 'target'
  if (s.includes('badminton') || s.includes('table tennis') || s.includes('racket') || s.includes('tennis')) return 'court'
  if (s.includes('wrestl') || s.includes('box') || s.includes('judo') || s.includes('combat')) return 'mat'
  if (s.includes('lift') || s.includes('strength') || s.includes('power')) return 'plates'
  if (s.includes('hockey') || s.includes('football')) return 'pitch'
  if (s.includes('climb')) return 'wall'
  return 'rings'
}

export function SportPattern({ sport, className = '', tone = 'dark' }) {
  const f = family(sport)
  const stroke = tone === 'dark' ? 'rgba(255,255,255,.22)' : 'rgba(11,58,91,.16)'
  const strong = tone === 'dark' ? 'rgba(255,255,255,.4)' : 'rgba(11,58,91,.28)'
  const common = { fill: 'none', stroke, strokeWidth: 2 }
  return (
    <svg className={className} viewBox="0 0 800 240" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {f === 'pool' && <>
        {[30, 80, 130, 180, 230].map(y => <line key={y} x1="0" x2="800" y1={y} y2={y} {...common} strokeDasharray="14 8" />)}
        {[55, 105, 155, 205].map(y => <g key={y}><line x1="40" x2="760" y1={y} y2={y} stroke={strong} strokeWidth="5" strokeLinecap="round" /><line x1="740" x2="740" y1={y - 12} y2={y + 12} stroke={strong} strokeWidth="5" /></g>)}
        <line x1="600" x2="600" y1="0" y2="240" {...common} strokeWidth="3" />
      </>}
      {f === 'track' && [0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <path key={i} d={`M -40 ${260 - i * 22} C 200 ${260 - i * 22}, 380 ${40 + i * 4}, 860 ${30 + i * 18}`} {...common} stroke={i === 3 ? strong : stroke} />
      ))}
      {f === 'target' && <g transform="translate(620 120)">{[24, 52, 80, 108, 136, 164, 192].map((r, i) => <circle key={r} r={r} {...common} stroke={i < 2 ? strong : stroke} />)}<circle r="6" fill={strong} /></g>}
      {f === 'court' && <g>
        <rect x="80" y="20" width="640" height="200" {...common} />
        <rect x="80" y="40" width="640" height="160" {...common} />
        <line x1="400" x2="400" y1="10" y2="230" stroke={strong} strokeWidth="4" />
        <line x1="300" x2="300" y1="40" y2="200" {...common} /><line x1="500" x2="500" y1="40" y2="200" {...common} />
        <line x1="80" x2="300" y1="120" y2="120" {...common} /><line x1="500" x2="720" y1="120" y2="120" {...common} />
      </g>}
      {f === 'mat' && <g transform="translate(560 120)"><circle r="190" {...common} /><circle r="130" {...common} stroke={strong} strokeWidth="5" /><circle r="22" {...common} /><rect x="-240" y="-240" width="480" height="480" {...common} /></g>}
      {f === 'plates' && <g>{[0, 1, 2, 3, 4].map(i => <g key={i}><rect x={470 + i * 34} y={30 + i * 10} width="24" height={180 - i * 20} rx="6" {...common} stroke={i === 0 ? strong : stroke} /></g>)}<line x1="0" x2="800" y1="120" y2="120" stroke={strong} strokeWidth="8" /></g>}
      {f === 'pitch' && <g><rect x="40" y="20" width="720" height="200" {...common} /><line x1="400" x2="400" y1="20" y2="220" {...common} /><circle cx="400" cy="120" r="50" {...common} stroke={strong} /><path d="M 40 50 A 90 90 0 0 1 40 190" {...common} /><path d="M 760 50 A 90 90 0 0 0 760 190" {...common} /></g>}
      {f === 'wall' && <g>{Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={(i * 97) % 800} cy={(i * 53) % 240} r={6 + (i % 4) * 3} {...common} stroke={i % 5 === 0 ? strong : stroke} />)}</g>}
      {f === 'rings' && <g>{[0, 1, 2, 3, 4, 5].map(i => <circle key={i} cx={520 + i * 40} cy={120} r={60 + i * 12} {...common} />)}</g>}
    </svg>
  )
}

export function Cover({ sport, role, className = '' }) {
  const bg = role === 'foundation' || role === 'committee' || role === 'federation' || role === 'government' ? '#0B3A5B'
    : role === 'brand' ? '#26323F' : role === 'media' ? '#3A1F27' : role === 'coach' ? '#16523A' : role === 'gym' ? '#4A2E1C' : '#0F4B70'
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: bg }}>
      <SportPattern sport={sport} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
