import React, { useState, useEffect, useRef } from 'react';
import { KosListing } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Navigation, 
  Info, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Layers, 
  Sparkles,
  Search,
  Check
} from 'lucide-react';

interface MapContainerProps {
  listings: KosListing[];
  userLocation: { lat: number; lng: number };
  onSelectListing: (listing: KosListing) => void;
  selectedListing?: KosListing;
}

// Haversine Formula to calculate distance in km
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export default function MapContainer({ listings, userLocation, onSelectListing, selectedListing }: MapContainerProps) {
  const [searchRadius, setSearchRadius] = useState<number>(5); // km
  const [nearestListings, setNearestListings] = useState<(KosListing & { distance: number })[]>([]);
  const [mapTheme, setMapTheme] = useState<'dark' | 'light'>('dark');
  
  // Set initial map center to selected listing coordinates or the user's current city center
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(() => {
    if (selectedListing) return selectedListing.coordinates;
    if (listings.length > 0) return listings[0].coordinates;
    return userLocation;
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const circleRef = useRef<L.Circle | null>(null);

  // Sync map center if selected listing changes from outside (e.g. details page click)
  useEffect(() => {
    if (selectedListing) {
      setMapCenter(selectedListing.coordinates);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([selectedListing.coordinates.lat, selectedListing.coordinates.lng], 15);
      }
    }
  }, [selectedListing]);

  // Handle map initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map instance
      const map = L.map(mapContainerRef.current, {
        center: [mapCenter.lat, mapCenter.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      mapInstanceRef.current = map;

      // Update map center state when user finished panning the map
      map.on('moveend', () => {
        const center = map.getCenter();
        setMapCenter({ lat: center.lat, lng: center.lng });
      });
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync tiles when map theme changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const url = mapTheme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    tileLayerRef.current = L.tileLayer(url, {
      maxZoom: 20
    }).addTo(map);
  }, [mapTheme]);

  // Render search radius circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (circleRef.current) {
      circleRef.current.remove();
    }

    circleRef.current = L.circle([mapCenter.lat, mapCenter.lng], {
      color: '#10b981', // emerald-500
      fillColor: '#10b981',
      fillOpacity: 0.05,
      radius: searchRadius * 1000,
      weight: 1.5,
      dashArray: '5, 5'
    }).addTo(map);
  }, [mapCenter, searchRadius]);

  // Update distance lists and place map markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Calculate distances from active map search center
    const calculated = listings
      .map((l) => {
        const d = calculateDistance(mapCenter.lat, mapCenter.lng, l.coordinates.lat, l.coordinates.lng);
        return { ...l, distance: d };
      })
      .sort((a, b) => a.distance - b.distance);

    setNearestListings(calculated);

    // 2. Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // 3. Add search center pulsing pin
    const centerIcon = L.divIcon({
      className: 'custom-center-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute inline-flex h-6 w-6 rounded-full bg-blue-500 opacity-40 animate-ping"></span>
          <div class="relative bg-blue-600 p-1.5 rounded-full border border-white text-white shadow-lg shadow-blue-500/40">
            <svg class="h-3 w-3 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const centerMarker = L.marker([mapCenter.lat, mapCenter.lng], { icon: centerIcon }).addTo(map);
    centerMarker.bindTooltip("Pusat Radar Pencarian", { direction: 'top', className: 'custom-tooltip' });
    markersRef.current.push(centerMarker);

    // 4. Draw markers with Airbnb-style dynamic price badges
    listings.forEach((l) => {
      const isSelected = selectedListing?.id === l.id;
      
      const pinColor = l.type === 'putra' 
        ? 'bg-blue-600' 
        : l.type === 'putri' 
          ? 'bg-rose-600' 
          : 'bg-purple-600';

      const ringStyle = isSelected 
        ? 'ring-4 ring-emerald-400 scale-110 z-[2000] border-emerald-500' 
        : 'border-slate-700 hover:scale-105';

      const priceText = l.price >= 1000000 
        ? `Rp ${(l.price / 1000000).toFixed(1)}jt` 
        : `Rp ${l.price / 1000}rb`;

      const badgeHtml = `
        <div class="flex flex-col items-center select-none cursor-pointer">
          <div class="px-2.5 py-1 rounded-full bg-slate-900 border text-white shadow-lg text-[10px] font-black flex items-center gap-1 transition-all ${ringStyle}">
            <span class="w-1.5 h-1.5 rounded-full ${pinColor}"></span>
            <span>${priceText}</span>
          </div>
          <div class="mt-0.5 whitespace-nowrap bg-slate-900/95 border border-slate-700 text-slate-100 text-[8px] font-bold px-1 rounded shadow-sm">
            ${l.title.replace('Kos ', '').replace('Kost ', '').substring(0, 10)}..
          </div>
        </div>
      `;

      const listingIcon = L.divIcon({
        className: 'custom-listing-marker',
        html: badgeHtml,
        iconSize: [80, 42],
        iconAnchor: [40, 21]
      });

      const marker = L.marker([l.coordinates.lat, l.coordinates.lng], { icon: listingIcon }).addTo(map);
      
      marker.on('click', () => {
        onSelectListing(l);
      });

      marker.bindTooltip(`
        <div class="font-sans p-1">
          <div class="font-black text-[10px] text-slate-800 uppercase tracking-tight">${l.title}</div>
          <div class="text-[9px] text-slate-500 mt-0.5">${l.city} • ${l.address}</div>
          <div class="flex items-center justify-between mt-1 pt-1 border-t border-slate-100">
            <span class="text-emerald-600 font-extrabold text-[9px]">Rp ${l.price.toLocaleString('id-ID')}/bln</span>
            <span class="text-[8px] uppercase font-bold text-slate-400">${l.type} sewa</span>
          </div>
        </div>
      `, { direction: 'top' });

      markersRef.current.push(marker);
    });
  }, [listings, mapCenter, selectedListing, onSelectListing]);

  // Adjust zoom controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };
  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  // Center map on listing click or search coordinates
  const handleRecenter = (lat: number, lng: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15);
    }
  };

  return (
    <div className="relative w-full h-[400px] bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200/50 flex flex-col md:flex-row">
      <style>{`
        .leaflet-container {
          font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
          background-color: #0f172a !important;
        }
        .leaflet-grab {
          cursor: grab !important;
        }
        .leaflet-grabbing {
          cursor: grabbing !important;
        }
        .leaflet-tooltip {
          background-color: white !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1) !important;
          padding: 8px 12px !important;
          color: #1e293b !important;
        }
        .leaflet-tooltip-top:before {
          border-top-color: white !important;
        }
        .custom-tooltip {
          background-color: #1e293b !important;
          border: 1px solid #334155 !important;
          color: #f8fafc !important;
        }
        .custom-tooltip:before {
          border-top-color: #1e293b !important;
        }
      `}</style>

      {/* Actual Map viewport */}
      <div className="relative flex-1 h-full min-h-[260px] md:min-h-0 z-10">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Custom HUD Overlay Controls */}
        <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-[1000]">
          {/* Zoom In */}
          <button 
            onClick={handleZoomIn}
            className="p-2 bg-white hover:bg-slate-50 text-slate-800 rounded-xl shadow-lg border border-slate-200 active:scale-95 transition-all"
            title="Perbesar Peta"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          {/* Zoom Out */}
          <button 
            onClick={handleZoomOut}
            className="p-2 bg-white hover:bg-slate-50 text-slate-800 rounded-xl shadow-lg border border-slate-200 active:scale-95 transition-all"
            title="Perkecil Peta"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
        </div>

        {/* Map Theme Toggle Control (Layers) */}
        <div className="absolute left-4 bottom-4 z-[1000] flex gap-1 bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-lg">
          <button
            onClick={() => setMapTheme('dark')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 transition-all ${
              mapTheme === 'dark' 
                ? 'bg-slate-900 text-white shadow' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Gelap</span>
          </button>
          <button
            onClick={() => setMapTheme('light')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 transition-all ${
              mapTheme === 'light' 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Terang</span>
          </button>
        </div>

        {/* Map Search Radius Indicator / Location info */}
        <div className="absolute left-4 top-4 z-[1000] bg-slate-900/95 backdrop-blur-sm border border-slate-800 px-3 py-2 rounded-2xl flex items-center gap-2.5 shadow-xl">
          <Compass className="h-4 w-4 text-emerald-400 animate-spin-slow" />
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Radar Lokasi Terintegrasi</span>
            <span className="text-[10px] text-white font-extrabold block">
              Peta Nyata OpenStreetMap aktif
            </span>
          </div>
        </div>
      </div>

      {/* Side list of properties in selected radius */}
      <div className="w-full md:w-[240px] bg-slate-900 p-4 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col justify-between overflow-hidden shrink-0 z-20">
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Hasil Terdekat</h4>
            <div className="text-[9px] bg-emerald-500/10 text-emerald-400 font-black px-2 py-0.5 rounded-full border border-emerald-500/20">
              {nearestListings.filter(l => l.distance <= searchRadius).length} Properti
            </div>
          </div>

          {/* Slider for radius filter */}
          <div className="mb-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 shrink-0">
            <div className="flex justify-between items-center text-[10px] mb-1.5">
              <span className="text-slate-400 font-bold">Radius Radar:</span>
              <span className="text-emerald-400 font-extrabold">{searchRadius} km</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="15" 
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
            />
            <div className="flex justify-between text-[8px] text-slate-500 font-bold mt-1">
              <span>1 km</span>
              <span>15 km</span>
            </div>
          </div>

          {/* Listings listing section */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {nearestListings
              .filter((l) => l.distance <= searchRadius)
              .map((l) => {
                const isSelected = selectedListing?.id === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => {
                      onSelectListing(l);
                      handleRecenter(l.coordinates.lat, l.coordinates.lng);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all border text-xs flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-slate-800 border-emerald-500 text-slate-100 shadow-md ring-1 ring-emerald-500/30' 
                        : 'bg-slate-950/50 hover:bg-slate-800/40 border-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-extrabold truncate max-w-[130px]">{l.title}</span>
                      <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase shrink-0 ${
                        l.type === 'putra' 
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' 
                          : l.type === 'putri' 
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' 
                            : 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                      }`}>
                        {l.type}
                      </span>
                    </div>
                    
                    <div className="text-[10px] text-slate-400 mt-1 truncate">
                      {l.city} • {l.address}
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800/80">
                      <span className="text-emerald-400 font-black">
                        Rp {l.price.toLocaleString('id-ID')}/bln
                      </span>
                      <span className="text-amber-400 font-bold flex items-center gap-0.5 text-[9px]">
                        <Navigation className="h-2.5 w-2.5 rotate-45 text-amber-500 animate-pulse" />
                        {l.distance.toFixed(1)} km
                      </span>
                    </div>
                  </button>
                );
              })}

            {nearestListings.filter((l) => l.distance <= searchRadius).length === 0 && (
              <div className="text-center py-10 bg-slate-950/30 border border-slate-800/50 rounded-2xl p-4">
                <MapPin className="h-6 w-6 text-slate-600 mx-auto mb-1.5" />
                <p className="text-[10px] font-black text-slate-400">Tidak ada hunian terdekat</p>
                <p className="text-[9px] text-slate-500 mt-0.5 leading-relaxed">
                  Coba perluas radius radar pencarian Anda.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
