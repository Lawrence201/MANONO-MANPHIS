"use client";

import { useEffect, useRef, useState } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";

type BillboardLocation = {
  id: number;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  clients?: { name: string; duration: string; daysRemaining: number }[];
};

const BOUNCE_STYLES = `
  @keyframes gm-bounce {
    0%, 100% { transform: translateY(0px);   }
    50%       { transform: translateY(-16px); }
  }
  @keyframes gm-shadow {
    0%, 100% { opacity: 0.35; transform: scale(1);    }
    50%       { opacity: 0.12; transform: scale(0.55); }
  }
`;

interface MarkersProps {
  locations: BillboardLocation[];
  onMarkerClick: (b: BillboardLocation) => void;
}

function Markers({ locations, onMarkerClick }: MarkersProps) {
  const map = useMap();
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  // Keep callback in a ref so markers are never recreated just because the callback reference changed
  const callbackRef = useRef(onMarkerClick);
  useEffect(() => { callbackRef.current = onMarkerClick; }, [onMarkerClick]);

  useEffect(() => {
    if (!map) return;

    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];

    locations.forEach((loc) => {
      const wrap = document.createElement("div");
      wrap.style.cssText =
        "display:flex;flex-direction:column;align-items:center;" +
        "animation:gm-bounce 1.6s cubic-bezier(0.28,0.84,0.42,1) infinite;" +
        "filter:drop-shadow(0 4px 8px rgba(0,0,0,0.35));cursor:pointer;";

      wrap.innerHTML = `
        <svg width="22" height="30" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M12 0C5.373 0 0 5.373 0 12c0 8.5 12 20 12 20S24 20.5 24 12C24 5.373 18.627 0 12 0z
               M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0z"
            fill="#EA4335"/>
        </svg>
        <div style="width:6px;height:3px;background:rgba(0,0,0,0.25);border-radius:50%;filter:blur(1px);margin-top:1px;animation:gm-shadow 1.6s cubic-bezier(0.28,0.84,0.42,1) infinite;"></div>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: loc.latitude, lng: loc.longitude },
        content: wrap,
        title: loc.name,
      });

      marker.addListener("click", () => callbackRef.current(loc));
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((m) => (m.map = null));
      markersRef.current = [];
    };
  // Only recreate markers when map or locations actually change — not when callback changes
  }, [map, locations]);

  return null;
}

function FlyTo({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap();
  const prevTarget = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!map || !target) return;
    const prev = prevTarget.current;
    const same = prev && prev.lat === target.lat && prev.lng === target.lng;
    if (!same) {
      map.panTo(target);
      map.setZoom(15);
    }
    prevTarget.current = target;
  }, [map, target]);

  return null;
}

interface Props {
  locations: BillboardLocation[];
  selectedId?: number | null;
  onMarkerClick: (b: BillboardLocation) => void;
}

export default function BillboardMap({ locations, selectedId, onMarkerClick }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const [initialCenter] = useState(() =>
    locations.length > 0
      ? {
          lat: locations.reduce((s, b) => s + b.latitude, 0) / locations.length,
          lng: locations.reduce((s, b) => s + b.longitude, 0) / locations.length,
        }
      : { lat: 7.95, lng: -1.02 }
  );

  const selected = locations.find((b) => b.id === selectedId);
  const flyTarget = selected
    ? { lat: selected.latitude, lng: selected.longitude }
    : null;

  return (
    <>
      <style>{BOUNCE_STYLES}</style>
      <APIProvider apiKey={apiKey} libraries={["marker"]}>
        <Map
          defaultCenter={initialCenter}
          defaultZoom={7}
          mapId="billboard-map"
          style={{ width: "100%", height: "100%" }}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          <FlyTo target={flyTarget} />
          <Markers locations={locations} onMarkerClick={onMarkerClick} />
        </Map>
      </APIProvider>
    </>
  );
}
