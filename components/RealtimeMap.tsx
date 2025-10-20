"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getLaporan } from "@/lib/serverAction/getLaporan";

export interface Report {
  id: string;
  lokasi: string;
  lat: number;
  lng: number;
  jenisBencana: string;
  deskripsi: string;
  urgency: number;
  reporters: number;
}

interface RealtimeMapProps {
  reports?: Report[];
  onMarkerClick?: (report: Report) => void;
  height?: string;
}

export default function RealtimeMap({
  onMarkerClick,
  height = "400px",
}: RealtimeMapProps) {
  const [mapReports, setMapReports] = useState<Report[]>([]);

  // cache warna biar konsisten per id
  const [colorCache, setColorCache] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchReports = async () => {
      const data = await getLaporan();
      setMapReports(data);
    };

    fetchReports();
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRandomColor = (id: string) => {
    if (colorCache[id]) return colorCache[id];
    const colors = [
      "#EF4444", "#3B82F6", "#F97316", "#06B6D4", "#A855F7",
      "#F59E0B", "#DC2626", "#6B7280", "#1E40AF", "#16A34A",
      "#9333EA", "#14B8A6", "#E11D48", "#BE123C", "#64748B"
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    setColorCache((prev) => ({ ...prev, [id]: color }));
    return color;
  };

  const getDisasterIcon = (report: Report) => {
    const color = getRandomColor(report.id);
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="
        background-color:${color};
        width:18px;
        height:18px;
        border-radius:50%;
        border:2px solid white;
        box-shadow:0 0 4px rgba(0,0,0,0.4);
      "></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
  };

  return (
    <div className="relative w-full z-0" style={{ height }}>
      <MapContainer
        center={[-2.5, 118]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapReports.map((report) => (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={getDisasterIcon(report)}
            eventHandlers={{
              click: () => onMarkerClick?.(report),
            }}
          >
            <Popup>
              <div>
                <h4 className="font-semibold">{report.jenisBencana}</h4>
                <p className="text-sm">{report.lokasi}</p>
                <p className="text-xs text-gray-600">{report.deskripsi}</p>
                {report.urgency > 0 && (
                  <p className="text-xs mt-1">Urgensi: {report.urgency}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
