$target = "c:\Users\HP\Desktop\Import_System\src\components\dashboard\charts.tsx"

$code = @"

// ─── Most Sales Location ────────────────────────────────────────────────────
const salesLocations = [
  { country: "United Kingdom", units: "620 Unit", pct: 78, color: "#6aabfc", cx: 375, cy: 124 },
  { country: "United States",  units: "540 Unit", pct: 72, color: "#6aabfc", cx: 137, cy: 150 },
  { country: "France",         units: "480 Unit", pct: 65, color: "#fbbf24", cx: 430, cy: 172 },
  { country: "Brazil",         units: "400 Unit", pct: 55, color: "#fbbf24", cx: 219, cy: 251 },
  { country: "India",          units: "350 Unit", pct: 48, color: "#10b981", cx: 614, cy: 215 },
];
const GHANA_CX = 376;
const GHANA_CY = 257;

function RadialRing({ pct, color, size = 48 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ display: "block", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={3.5} strokeOpacity={0.1} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round"
        strokeDasharray={`${`${filled} ${circ - filled}`}`} strokeDashoffset={circ * 0.25}
        style={{ transition: "stroke-dasharray 0.6s ease" }} />
      <text x={size/2} y={size/2+4} textAnchor="middle" fontSize={10} fontWeight={600} fill="currentColor">{pct}%</text>
    </svg>
  );
}

export function MostSalesLocationChart() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <div className="mb-5">
        <h3 className="font-display font-semibold text-base">Most Sales Location</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Export destinations from Ghana hub</p>
      </div>
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-h-[240px] overflow-hidden rounded-lg" style={{ background: "var(--color-secondary)" }}>
          <svg viewBox="0 0 900 470" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
            <path d="M68,74 L200,68 L230,90 L230,180 L190,200 L160,190 L130,210 L100,200 L68,150 Z" fill="currentColor" fillOpacity={0.08} />
            <path d="M200,230 L280,220 L310,280 L300,360 L260,400 L220,380 L195,310 Z" fill="currentColor" fillOpacity={0.08} />
            <path d="M390,100 L480,90 L500,130 L480,160 L430,170 L400,150 Z" fill="currentColor" fillOpacity={0.08} />
            <path d="M380,190 L470,185 L490,250 L480,340 L430,370 L380,350 L355,280 L360,220 Z" fill="currentColor" fillOpacity={0.08} />
            <path d="M500,100 L760,80 L780,150 L750,200 L700,220 L640,210 L580,190 L520,170 L495,140 Z" fill="currentColor" fillOpacity={0.08} />
            <path d="M590,195 L640,195 L650,260 L610,270 Z" fill="currentColor" fillOpacity={0.08} />
            <path d="M680,300 L780,290 L790,360 L720,370 L680,340 Z" fill="currentColor" fillOpacity={0.08} />
            <defs>
              <style>{"@keyframes msl-dash{to{stroke-dashoffset:-36}}.msl-arc{animation:msl-dash 1.6s linear infinite}"}</style>
            </defs>
            {salesLocations.map((loc, i) => {
              const mx = (GHANA_CX + loc.cx) / 2;
              const my = Math.min(GHANA_CY, loc.cy) - 75;
              return (
                <path key={i} d={`${'M${GHANA_CX},${GHANA_CY} Q${mx},${my} ${loc.cx},${loc.cy}'}`}
                  fill="none" stroke="var(--color-muted-foreground)" strokeWidth={1}
                  strokeLinecap="round" strokeDasharray="6 3" className="msl-arc"
                  style={{ animationDelay: `${'${i * 0.28}s'}` }} />
              );
            })}
            {salesLocations.map((loc, i) => (
              <g key={i}>
                <circle cx={loc.cx} cy={loc.cy} r={6} fill={loc.color} fillOpacity={0.22} />
                <circle cx={loc.cx} cy={loc.cy} r={3} fill={loc.color} />
              </g>
            ))}
            <circle cx={GHANA_CX} cy={GHANA_CY} r={10} fill="var(--color-chart-1)" fillOpacity={0.18}>
              <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={GHANA_CX} cy={GHANA_CY} r={4} fill="var(--color-chart-1)" />
            <text x={GHANA_CX+8} y={GHANA_CY-9} fontSize={9} fill="var(--color-chart-1)" fontWeight={700}>Ghana</text>
          </svg>
        </div>
        <div className="flex flex-col gap-1 xl:w-60 justify-center">
          {salesLocations.map((loc) => (
            <div key={loc.country} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-secondary/60 transition-colors">
              <div>
                <p className="text-sm font-semibold leading-tight">{loc.country}</p>
                <p className="text-xs text-muted-foreground">{loc.units}</p>
              </div>
              <RadialRing pct={loc.pct} color={loc.color} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
"@

Add-Content -Path $target -Value $code -Encoding UTF8
Write-Host "Done."
