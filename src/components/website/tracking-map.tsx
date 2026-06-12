"use client";

import { useEffect, useState, useRef } from "react";
import { Clock, MapPin } from "lucide-react";

const svgCountryCenters: Record<string, { x: number; y: number }> = {
  "AE": { x: 556.24, y: 223 },
  "AF": { x: 586.83, y: 196.46 },
  "AL": { x: 471.45, y: 175.69 },
  "AM": { x: 533.83, y: 179.09 },
  "AO": { x: 465.66, y: 314.92 },
  "AR": { x: 261.9, y: 384.91 },
  "AT": { x: 454.08, y: 155.35 },
  "AU": { x: 755.2, y: 349.9 },
  "AZ": { x: 540.19, y: 178.83 },
  "BA": { x: 465.22, y: 167.09 },
  "BD": { x: 647.34, y: 223.93 },
  "BE": { x: 431.84, y: 146.29 },
  "BF": { x: 416.83, y: 253.73 },
  "BG": { x: 484.62, y: 170.98 },
  "BI": { x: 495.96, y: 293.35 },
  "BJ": { x: 426.67, y: 261.76 },
  "BN": { x: 708.52, y: 273.1 },
  "BO": { x: 261.86, y: 326.28 },
  "BR": { x: 284.87, y: 322.12 },
  "BS": { x: 225.74, y: 222.37 },
  "BT": { x: 647.47, y: 214.26 },
  "BW": { x: 482.54, y: 341.65 },
  "BY": { x: 490.91, y: 135.34 },
  "BZ": { x: 198.96, y: 241.45 },
  "CA": { x: 174.73, y: 118.34 },
  "CD": { x: 475.17, y: 294.99 },
  "CF": { x: 473.28, y: 267.78 },
  "CG": { x: 458, y: 286.44 },
  "CH": { x: 441.54, y: 158.34 },
  "CI": { x: 407.02, y: 266.29 },
  "CL": { x: 242.41, y: 382.19 },
  "CM": { x: 451.57, y: 266.53 },
  "CN": { x: 682.12, y: 184.98 },
  "CO": { x: 238.11, y: 274.42 },
  "CR": { x: 209.93, y: 260.42 },
  "CU": { x: 221.93, y: 230.14 },
  "CY": { x: 503.57, y: 193.88 },
  "CZ": { x: 459.75, y: 148.57 },
  "DE": { x: 447.2, y: 144 },
  "DJ": { x: 527.34, y: 255.17 },
  "DK": { x: 444.68, y: 126.8 },
  "DO": { x: 245.35, y: 237.33 },
  "DZ": { x: 425.06, y: 212.02 },
  "EC": { x: 225.46, y: 289.34 },
  "EE": { x: 485.36, y: 118.56 },
  "EG": { x: 497.79, y: 216.01 },
  "EH": { x: 387.55, y: 225.2 },
  "ER": { x: 520.23, y: 246.52 },
  "ES": { x: 413.08, y: 179.35 },
  "ET": { x: 521.89, y: 261.82 },
  "FI": { x: 486.36, y: 92.69 },
  "FJ": { x: 866.66, y: 330.01 },
  "FK": { x: 272.05, y: 427.32 },
  "FR": { x: 425.23, y: 158.24 },
  "GA": { x: 450.03, y: 286.94 },
  "GB": { x: 415.36, y: 133.24 },
  "GE": { x: 529.44, y: 172.2 },
  "GH": { x: 418.13, y: 265.04 },
  "GL": { x: 313.83, y: 56.57 },
  "GM": { x: 381.59, y: 250.88 },
  "GN": { x: 392.28, y: 259.88 },
  "GQ": { x: 446.76, y: 280.71 },
  "GR": { x: 479.48, y: 181.75 },
  "GT": { x: 194.71, y: 245 },
  "GW": { x: 382.96, y: 255.04 },
  "GY": { x: 273.21, y: 272.82 },
  "HN": { x: 204.84, y: 248.34 },
  "HR": { x: 462.96, y: 164.85 },
  "HT": { x: 239.46, y: 236.75 },
  "HU": { x: 469.72, y: 157.09 },
  "ID": { x: 761.13, y: 296.56 },
  "IE": { x: 401.02, y: 136.8 },
  "IL": { x: 508.2, y: 204.9 },
  "IN": { x: 628.35, y: 228.54 },
  "IQ": { x: 530.06, y: 198.32 },
  "IR": { x: 555.45, y: 200.41 },
  "IS": { x: 373.5, y: 93.57 },
  "IT": { x: 452.54, y: 171.27 },
  "JM": { x: 227.39, y: 239.04 },
  "JO": { x: 513.73, y: 204 },
  "JP": { x: 760.74, y: 189.78 },
  "KE": { x: 515.61, y: 283.83 },
  "KG": { x: 608.37, y: 175.24 },
  "KH": { x: 683.83, y: 253.4 },
  "KP": { x: 740.14, y: 178.08 },
  "KR": { x: 741.01, y: 189.39 },
  "KW": { x: 539.94, y: 209.43 },
  "KZ": { x: 588.52, y: 153.5 },
  "LA": { x: 681.06, y: 238.78 },
  "LB": { x: 510.82, y: 196.75 },
  "LK": { x: 623.14, y: 265.19 },
  "LR": { x: 397.23, y: 268.77 },
  "LS": { x: 491.48, y: 361.36 },
  "LT": { x: 480.62, y: 130.72 },
  "LU": { x: 435.88, y: 148.78 },
  "LV": { x: 482.57, y: 124.86 },
  "LY": { x: 464.15, y: 216.95 },
  "MA": { x: 398.23, y: 210.91 },
  "MD": { x: 491.9, y: 157.66 },
  "ME": { x: 469.5, y: 170.75 },
  "MG": { x: 538.3, y: 332.92 },
  "MK": { x: 475.3, y: 174.35 },
  "ML": { x: 411.08, y: 240.24 },
  "MM": { x: 663.21, y: 235.46 },
  "MN": { x: 680.83, y: 157.84 },
  "MR": { x: 393.05, y: 231.41 },
  "MW": { x: 506.69, y: 317.71 },
  "MX": { x: 165.7, y: 223.9 },
  "MY": { x: 707.52, y: 275.22 },
  "MZ": { x: 509.78, y: 332.25 },
  "NA": { x: 462.5, y: 343.71 },
  "NC": { x: 835.54, y: 338.9 },
  "NE": { x: 441.19, y: 240.09 },
  "NG": { x: 442.55, y: 262.11 },
  "NI": { x: 207.28, y: 252.45 },
  "NL": { x: 434.31, y: 140.73 },
  "NO": { x: 466.06, y: 93.61 },
  "NP": { x: 631.58, y: 211.81 },
  "NZ": { x: 860.67, y: 385.16 },
  "OM": { x: 561.02, y: 231.98 },
  "PA": { x: 220.39, y: 263.76 },
  "PE": { x: 233.04, y: 308.2 },
  "PG": { x: 786.22, y: 301.62 },
  "PH": { x: 726.49, y: 245.55 },
  "PK": { x: 594.87, y: 205.94 },
  "PL": { x: 468.72, y: 141.31 },
  "PR": { x: 254.6, y: 238.73 },
  "PS": { x: 509.29, y: 201.97 },
  "PT": { x: 400.97, y: 180.33 },
  "PY": { x: 274.52, y: 344.77 },
  "QA": { x: 549.11, y: 220.06 },
  "RO": { x: 483.56, y: 160.9 },
  "RS": { x: 473.31, y: 166.28 },
  "RU": { x: 693.15, y: 105.22 },
  "RW": { x: 495.9, y: 290 },
  "SA": { x: 534.04, y: 222.46 },
  "SB": { x: 819.86, y: 305.02 },
  "SD": { x: 496.46, y: 246.08 },
  "SE": { x: 464.61, y: 103.16 },
  "SI": { x: 458.77, y: 160.38 },
  "SK": { x: 470.23, y: 152.43 },
  "SL": { x: 391.33, y: 263.74 },
  "SN": { x: 384.65, y: 248.41 },
  "SO": { x: 536.28, y: 271.75 },
  "SR": { x: 280.66, y: 275.05 },
  "SS": { x: 495.25, y: 265.08 },
  "SV": { x: 198.33, y: 250.15 },
  "SY": { x: 518.55, y: 194.16 },
  "SZ": { x: 499.51, y: 352.8 },
  "TD": { x: 467.84, y: 245.74 },
  "TF": { x: 595.31, y: 419.23 },
  "TG": { x: 423.18, y: 263.58 },
  "TH": { x: 675.15, y: 244.16 },
  "TJ": { x: 599.29, y: 182.44 },
  "TL": { x: 736.7, y: 307.01 },
  "TM": { x: 570.27, y: 181.83 },
  "TN": { x: 444.77, y: 196.62 },
  "TR": { x: 509.79, y: 181.99 },
  "TT": { x: 267.34, y: 258.63 },
  "TW": { x: 724, y: 224.44 },
  "TZ": { x: 508.35, y: 300.89 },
  "UA": { x: 498.82, y: 153.16 },
  "UG": { x: 501.85, y: 281.44 },
  "US": { x: 180.99, y: 185.42 },
  "UY": { x: 281.12, y: 369.36 },
  "UZ": { x: 582.25, y: 174.77 },
  "VE": { x: 254.3, y: 268.79 },
  "VN": { x: 685.84, y: 244.29 },
  "VU": { x: 838.94, y: 323.25 },
  "YE": { x: 540.85, y: 244.95 },
  "ZA": { x: 482.47, y: 358.43 },
  "ZM": { x: 490.27, y: 317.91 },
  "ZW": { x: 493.84, y: 332.82 },
};

const nameToCode: Record<string, string> = {
  "United States": "US", "USA": "US", "United Kingdom": "GB", "UK": "GB",
  "Germany": "DE", "France": "FR", "Italy": "IT", "Spain": "ES", "Portugal": "PT",
  "Netherlands": "NL", "Belgium": "BE", "Switzerland": "CH", "Sweden": "SE",
  "Norway": "NO", "Denmark": "DK", "Finland": "FI", "Poland": "PL",
  "Austria": "AT", "Russia": "RU", "Ukraine": "UA", "Turkey": "TR", "Greece": "GR",
  "Saudi Arabia": "SA", "UAE": "AE", "United Arab Emirates": "AE", "Qatar": "QA",
  "Kuwait": "KW", "Israel": "IL", "Jordan": "JO", "Iraq": "IQ", "Iran": "IR",
  "Yemen": "YE", "Oman": "OM", "Nigeria": "NG", "South Africa": "ZA",
  "Kenya": "KE", "Ethiopia": "ET", "Egypt": "EG", "Morocco": "MA",
  "Algeria": "DZ", "Tanzania": "TZ", "Senegal": "SN", "Ivory Coast": "CI",
  "Cameroon": "CM", "Ghana": "GH", "China": "CN", "Japan": "JP", "India": "IN",
  "South Korea": "KR", "Singapore": "SG", "Malaysia": "MY", "Indonesia": "ID",
  "Thailand": "TH", "Vietnam": "VN", "Philippines": "PH", "Pakistan": "PK",
  "Bangladesh": "BD", "Sri Lanka": "LK", "Australia": "AU", "New Zealand": "NZ",
  "Canada": "CA", "Mexico": "MX", "Brazil": "BR", "Argentina": "AR",
  "Colombia": "CO", "Chile": "CL", "Peru": "PE",
};

export function TrackingMap({
  destinationCountry,
  city,
  currentStep,
  productName,
}: {
  destinationCountry: string;
  city?: string | null;
  currentStep: number;
  productName?: string;
}) {
  const [svgHtml, setSvgHtml] = useState("");
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string } | null>(null);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const innerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/map.svg?v=" + Date.now())
      .then((res) => res.text())
      .then((text) => setSvgHtml(text))
      .catch((err) => console.error("Error loading map SVG:", err));
  }, []);

  // Auto-center the route's bounding box in the visible container after SVG loads.
  // Uses getScreenCTM() on the group element so coordinate math is correct regardless
  // of the SVG's internal preserveAspectRatio letterboxing or CSS scale transforms.
  useEffect(() => {
    if (!svgHtml) return;
    const timer = setTimeout(() => {
      const svgEl = svgDivRef.current?.querySelector("svg") as SVGSVGElement | null;
      const groupEl = svgDivRef.current?.querySelector("g") as SVGGraphicsElement | null;
      const containerEl = containerRef.current;
      if (!svgEl || !groupEl || !containerEl) return;

      const ctm = groupEl.getScreenCTM();
      if (!ctm) return;

      const containerRect = containerEl.getBoundingClientRect();

      const gh = svgCountryCenters["GH"];
      if (!gh) return;

      const toIso = (raw: string) => {
        const m = raw.match(/\(([A-Z]{2})\)\s*$/);
        return m ? m[1] : raw;
      };
      const code = nameToCode[toIso(destinationCountry)] || toIso(destinationCountry);
      const dest = svgCountryCenters[code];

      // Converts path-space coordinates to screen coordinates using the group's CTM.
      // This correctly accounts for the group transform, SVG preserveAspectRatio, and CSS scale.
      const toScreen = (x: number, y: number) => {
        const pt = svgEl.createSVGPoint();
        pt.x = x; pt.y = y;
        const sp = pt.matrixTransform(ctm);
        return { x: sp.x, y: sp.y };
      };

      let centerSvgX = gh.x;
      let centerSvgY = gh.y;

      if (dest) {
        // Replicate the arc control point calculation from getSvgWithMarkers
        const dx = dest.x - gh.x;
        const dy = dest.y - gh.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const midX = (gh.x + dest.x) / 2;
        const midY = (gh.y + dest.y) / 2;
        const perpX = -dy / dist;
        const perpY = dx / dist;
        const curveAmount = dist * 0.30;
        let cpX = midX + perpX * curveAmount;
        let cpY = midY + perpY * curveAmount;
        if (cpY > midY) { cpX = midX - perpX * curveAmount; cpY = midY - perpY * curveAmount; }

        // Use the bounding box of all route points (including the arc peak) as center
        const minX = Math.min(gh.x, dest.x, cpX);
        const maxX = Math.max(gh.x, dest.x, cpX);
        const minY = Math.min(gh.y, dest.y, cpY);
        const maxY = Math.max(gh.y, dest.y, cpY);
        centerSvgX = (minX + maxX) / 2;
        centerSvgY = (minY + maxY) / 2;
      }

      const centerScreen = toScreen(centerSvgX, centerSvgY);
      const containerCenterX = containerRect.left + containerRect.width / 2;
      const containerCenterY = containerRect.top + containerRect.height / 2;

      setPan({
        x: containerCenterX - centerScreen.x,
        y: containerCenterY - centerScreen.y,
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [svgHtml, destinationCountry]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX - pan.x, y: clientY - pan.y });
  };

  const handleMouseMoveMap = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging) {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      setPan({
        x: clientX - dragStart.x,
        y: clientY - dragStart.y
      });
    }

    // Tooltip logic for mouse only
    if (!('touches' in e) && !isDragging) {
      const target = e.target as HTMLElement;
      const isPath = target.tagName.toLowerCase() === "path";
      const dataCode = target.getAttribute("data-code");
      
      if (isPath && dataCode && innerRef.current) {
        const rect = innerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const countryName = Object.keys(nameToCode).find((key) => nameToCode[key] === dataCode) || dataCode;

        setTooltip({ x, y, name: countryName });
      } else {
        setTooltip(null);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setTooltip(null);
    handleMouseUp();
  };

  const getSvgWithMarkers = () => {
    if (!svgHtml) return { __html: "" };
    let modifiedSvg = svgHtml;

    let linesHtml = "";
    let markersHtml = "";

    // Determine destination colour from product
    const pName = (productName || "").toLowerCase();
    const destColor = pName.includes("honey") ? "#eea000" : pName.includes("cashew") ? "#9c4921" : "#0ea5e9";

    // Ghana origin marker (blue)
    const gh = svgCountryCenters["GH"];
    if (gh) {
      markersHtml += `<circle cx="${gh.x}" cy="${gh.y}" r="4" fill="#0ea5e9" fill-opacity="1" stroke="#0ea5e9" stroke-width="8" stroke-opacity="0.22" pointer-events="none"></circle>`;
    }

    // Destination country logic
    const toIso = (raw: string): string => {
      const m = raw.match(/\(([A-Z]{2})\)\s*$/);
      return m ? m[1] : raw;
    };
    
    const extractedIso = toIso(destinationCountry);
    const code = nameToCode[extractedIso] || extractedIso;
    const dest = svgCountryCenters[code];

    if (dest && gh) {
      const dx = dest.x - gh.x;
      const dy = dest.y - gh.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const midX = (gh.x + dest.x) / 2;
      const midY = (gh.y + dest.y) / 2;

      // Perpendicular unit vector — pick the direction that arcs northward (lower Y)
      const perpX1 = -dy / dist;
      const perpY1 = dx / dist;
      const curveAmount = dist * 0.30; // 30% of chord = gentle arc

      let cpX = midX + perpX1 * curveAmount;
      let cpY = midY + perpY1 * curveAmount;
      
      if (cpY > midY) {
        cpX = midX - perpX1 * curveAmount;
        cpY = midY - perpY1 * curveAmount;
      }

      const pathD = `M ${gh.x},${gh.y} Q ${cpX.toFixed(1)},${cpY.toFixed(1)} ${dest.x},${dest.y}`;

      if (currentStep >= 2) {
        // Layer 1 — static faint trail so the full arc is always visible
        linesHtml += `<path d="${pathD}" fill="none" stroke="#969ba4" stroke-width="1.2" stroke-dasharray="5,5" stroke-opacity="0.25" stroke-linecap="round"/>`;

        // Layer 2 — animated flowing dashes
        linesHtml += `<path d="${pathD}" fill="none" stroke="#969ba4" stroke-width="1.8" stroke-dasharray="8,6" stroke-opacity="0.85" stroke-linecap="round"><animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.8s" repeatCount="indefinite"/></path>`;

        // Destination marker (product colour, no animation)
        markersHtml += `<circle cx="${dest.x}" cy="${dest.y}" r="4" fill="${destColor}" fill-opacity="1" stroke="${destColor}" stroke-width="8" stroke-opacity="0.22" pointer-events="none"></circle>`;
      }
    }

    // Inject: lines first (behind), then markers (on top) — both INSIDE transform group
    modifiedSvg = modifiedSvg.replace(
      "</g></svg>",
      `<g class="map-trade-lines">${linesHtml}</g><g class="map-markers">${markersHtml}</g></g></svg>`
    );

    return { __html: modifiedSvg };
  };

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative flex items-center justify-center bg-[#fdfaf7] overflow-hidden group select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMoveMap}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMoveMap}
      onTouchEnd={handleMouseUp}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        path[data-code] {
          fill: #e1e7e7 !important;
          transition: fill 0.2s ease;
          cursor: inherit;
          stroke: #FFFFFF !important;
          stroke-width: 0.5px !important;
        }
        path[data-code]:hover {
          fill: #cbd5e1 !important;
        }
        .dark path[data-code] {
          fill: #3f4145 !important;
          stroke: #282828 !important;
        }
      `}} />
      
      {/* Moving wrapper for Map + Hover Tooltip */}
      <div 
        ref={innerRef}
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)`, transition: isDragging ? 'none' : 'transform 0.1s ease-out' }} 
        className="w-[300%] h-[300%] absolute left-[-100%] top-[-100%] transition-transform flex items-center justify-center"
      >
        <div
          ref={svgDivRef}
          className="w-[33.33%] h-[33.33%] flex items-center justify-center pt-48 pl-20 max-md:pt-0 max-md:pl-0 [&>svg]:h-full [&>svg]:w-full [&>svg]:scale-[1.15] max-md:[&>svg]:!w-auto max-md:[&>svg]:scale-100 transition-transform duration-700 ease-in-out"
          dangerouslySetInnerHTML={getSvgWithMarkers()}
        />

        {/* Custom Tooltip */}
        {tooltip && (
          <div
            className="absolute pointer-events-none bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-lg z-50 transform -translate-x-1/2 -translate-y-full transition-all duration-75 ease-out"
            style={{
              left: tooltip.x,
              top: tooltip.y - 10,
            }}
          >
            {tooltip.name}
          </div>
        )}
      </div>

      {/* Map Tooltip for actual Destination */}
      <div className="absolute top-1/2 right-12 transform -translate-y-1/2 mt-10 pointer-events-none max-md:hidden">
          <div className="bg-[#1a1a1a] text-white p-4 rounded-xl shadow-2xl relative min-w-[250px]">
            {/* Tooltip triangle */}
            <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 bg-[#1a1a1a] rotate-45"></div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm mb-1">Destination Port Hub</p>
                <p className="text-xs text-gray-400 leading-relaxed mb-2">{city || "City Area"}, {destinationCountry}</p>
                <p className="text-xs font-mono text-gray-300 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Tracking Active
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
