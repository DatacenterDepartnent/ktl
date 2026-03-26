// @ts-nocheck
'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
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

// พิกัดวิทยาลัยเทคนิคกันทรลักษ์
const COLLEGE_LOCATION = [14.754043, 104.65807];
const IN_SITE_RADIUS = 200; // 200 Meters (Office Boundary)
const MAX_RADIUS = 200000; // 200 Kilometers (Allowed Area)

export default function MapDashboard({ markers }: { markers: any[] }) {
  if (typeof window === 'undefined') return null;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden z-0 bg-slate-100">
      <MapContainer 
        center={COLLEGE_LOCATION} // จุดศูนย์กลางเริ่มต้น (KTLTC)
        zoom={15} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* 200 KM Radius (Outer Area) */}
        <Circle
          center={COLLEGE_LOCATION}
          radius={MAX_RADIUS}
          pathOptions={{ 
            color: '#10b981', // emerald-500
            fillColor: '#10b981', 
            fillOpacity: 0.05,
            weight: 2,
            dashArray: '10, 10'
          }}
        />

        {/* 200 M Radius (Office Boundary) */}
        <Circle
          center={COLLEGE_LOCATION}
          radius={IN_SITE_RADIUS}
          pathOptions={{ 
            color: '#3b82f6', // blue-500
            fillColor: '#3b82f6', 
            fillOpacity: 0.15,
            weight: 2,
            dashArray: '5, 10'
          }}
        />
        
        <Marker position={COLLEGE_LOCATION} icon={icon}>
          <Popup>
            <div className="text-center">
              <p className="font-bold text-blue-600">วิทยาลัยเทคนิคกันทรลักษ์</p>
              <p className="text-[10px] text-slate-500 line-clamp-2">82 หมู่ 1 ต.จานใหญ่ อ.กันทรลักษ์ จ.ศรีสะเกษ 33110</p>
              <p className="text-[9px] mt-1 bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full inline-block font-bold uppercase">Official Office</p>
            </div>
          </Popup>
        </Marker>
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
