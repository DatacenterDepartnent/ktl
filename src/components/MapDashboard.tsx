// @ts-nocheck
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix typical Leaflet icon issue in Next.js missing marker images
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapDashboard({ markers }: { markers: any[] }) {
  if (typeof window === 'undefined') return null;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden z-0 bg-slate-100">
      <MapContainer 
        center={[14.636681, 104.6469]} // จุดศูนย์กลางเริ่มต้น (KTLTC)
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]} icon={icon}>
            <Popup className="rounded-xl overflow-hidden p-0">
              <div className="flex flex-col items-center min-w-[120px] pb-2">
                {m.photoUrl ? (
                  <img src={m.photoUrl} alt="face" className="w-full h-24 object-cover mb-2" />
                ) : (
                  <div className="w-full h-24 bg-slate-200 flex items-center justify-center mb-2">No Photo</div>
                )}
                <p className="font-bold text-slate-800 text-sm">{m.name}</p>
                <p className="text-xs text-slate-500">{new Date(m.time).toLocaleTimeString('th-TH')} น.</p>
                <span className={`px-2 py-0.5 mt-1 text-[10px] uppercase font-bold tracking-wider rounded-sm ${m.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                   {m.status}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
