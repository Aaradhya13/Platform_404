import React, { useState, useRef, useEffect } from 'react';

const KochiMetroMap = () => {
  const [selectedStation, setSelectedStation] = useState(null);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);

  const stations = [
    { "name": "Aluva", "lat": 10.1047, "lng": 76.3565, "status": "Operational", "landmark": "Aluva Railway Station" },
    { "name": "Pulinchodu", "lat": 10.09505, "lng": 76.34678, "status": "Operational", "landmark": "Pulinchodu Junction" },
    { "name": "Companypady", "lat": 10.0910, "lng": 76.3430, "status": "Operational", "landmark": "Company Pady" },
    { "name": "Ambattukavu", "lat": 10.0878, "lng": 76.3419, "status": "Operational", "landmark": "Ambattukavu Temple" },
    { "name": "Muttom", "lat": 10.0810, "lng": 76.3380, "status": "Operational", "landmark": "Muttom Church" },
    { "name": "Kalamassery", "lat": 10.0678, "lng": 76.3320, "status": "Operational", "landmark": "Kalamassery Town" },
    { "name": "Cochin University (CUSAT)", "lat": 10.046879, "lng": 76.318377, "status": "Operational", "landmark": "CUSAT Campus" },
    { "name": "Pathadippalam", "lat": 10.035948, "lng": 76.314371, "status": "Operational", "landmark": "Pathadippalam Bridge" },
    { "name": "Edappally", "lat": 10.02549, "lng": 76.30799, "status": "Operational", "landmark": "Edappally Church" },
    { "name": "Changampuzha Park", "lat": 10.0200, "lng": 76.3050, "status": "Operational", "landmark": "Changampuzha Park" },
    { "name": "Palarivattom", "lat": 10.015145, "lng": 76.302286, "status": "Operational", "landmark": "Palarivattom Bridge" },
    { "name": "Jawaharlal Nehru Stadium", "lat": 10.0140, "lng": 76.2990, "status": "Operational", "landmark": "JLN Stadium" },
    { "name": "Kaloor", "lat": 10.0120, "lng": 76.2950, "status": "Operational", "landmark": "Kaloor Junction" },
    { "name": "Town Hall", "lat": 10.0060, "lng": 76.2880, "status": "Operational", "landmark": "Ernakulam Town Hall" },
    { "name": "MG Road", "lat": 9.9816, "lng": 76.2827, "status": "Operational", "landmark": "MG Road Shopping Area" },
    { "name": "Maharaja's College", "lat": 9.9715, "lng": 76.2858, "status": "Operational", "landmark": "Maharaja's College" },
    { "name": "Ernakulam South", "lat": 9.9664, "lng": 76.2910, "status": "Operational", "landmark": "Ernakulam South Railway Station" },
    { "name": "Kadavanthra", "lat": 9.9636, "lng": 76.2990, "status": "Operational", "landmark": "Kadavanthra Junction" },
    { "name": "Vyttila", "lat": 9.9639, "lng": 76.3123, "status": "Operational", "landmark": "Vyttila Mobility Hub" },
    { "name": "Thaikoodam", "lat": 9.959964, "lng": 76.323733, "status": "Operational", "landmark": "Thaikoodam Bridge" },
    { "name": "Petta", "lat": 9.9530, "lng": 76.3330, "status": "Operational", "landmark": "Petta Market" }
  ];

  const handleStationClick = (station, index) => {
    // Station click only highlights - no map movement
    setSelectedStation({ ...station, index });
    
    // Update marker styles only
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker, i) => {
        const isSelected = i === index;
        marker.setStyle({
          fillColor: isSelected ? '#ff6b35' : '#c21f3a',
          radius: isSelected ? 8 : 6
        });
      });
    }
  };

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload = () => {
      if (mapRef.current && window.L && !leafletMapRef.current) {
        // Initialize map
        const map = window.L.map(mapRef.current, {
          center: [10.0261, 76.3129],
          zoom: 11,
          zoomControl: true
        });

        // Add tile layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Create route polyline
        const routeCoordinates = stations.map(station => [station.lat, station.lng]);
        const polyline = window.L.polyline(routeCoordinates, {
          color: '#c21f3a',
          weight: 4,
          opacity: 0.8,
          smoothFactor: 1
        }).addTo(map);

        // Add station markers
        stations.forEach((station, index) => {
          const marker = window.L.circleMarker([station.lat, station.lng], {
            radius: 6,
            fillColor: '#c21f3a',
            color: 'white',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
          }).addTo(map);

          // Add detailed tooltip
          marker.bindTooltip(`
            <div style="min-width: 220px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="border-bottom: 2px solid #c21f3a; padding-bottom: 6px; margin-bottom: 8px;">
                <div style="font-weight: bold; font-size: 16px; color: #1f2937;">${station.name}</div>
                <div style="font-size: 11px; color: #6b7280; display: flex; justify-content: space-between; align-items: center; margin-top: 2px;">
                  <span>Station ${index + 1} of ${stations.length}</span>
                  <span style="background: #dcfce7; color: #166534; padding: 1px 6px; border-radius: 4px; font-size: 10px;">${station.status}</span>
                </div>
              </div>
              
              <div style="margin-bottom: 8px;">
                <div style="font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 4px;">📍 ${station.landmark}</div>
                <div style="font-size: 11px; color: #6b7280; margin-bottom: 6px;">
                  <div>🚇 Blue Line | Zone: ${index < 7 ? 'North' : index < 14 ? 'Central' : 'South'}</div>
                  <div style="margin-top: 2px;">📊 Distance from Aluva: ~${(index * 1.2).toFixed(1)} km</div>
                </div>
              </div>

              <div style="background: #f8f9fa; padding: 6px; border-radius: 4px; margin-bottom: 6px;">
                <div style="font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 3px;">🏢 Key Facilities</div>
                <div style="font-size: 10px; color: #6b7280;">
                  ${index === 0 || index === stations.length - 1 ? '🚌 Major Bus Terminus • 🚗 Parking' : '🚌 Bus Connectivity • 🚶 Pedestrian Access'}
                  ${index === 6 ? ' • 🎓 University Campus' : ''}
                  ${index === 8 || index === 11 || index === 18 ? ' • 🏥 Medical Facilities' : ''}
                  ${index === 14 ? ' • 🛍 Shopping District' : ''}
                  ${index === 18 ? ' • 🚌 Multi-modal Hub' : ''}
                </div>
              </div>

              <div style="background: #f0f9ff; padding: 6px; border-radius: 4px;">
                <div style="font-size: 11px; font-weight: 600; color: #0369a1; margin-bottom: 3px;">🚌 Connectivity</div>
                <div style="font-size: 10px; color: #0369a1;">
                  ${index === 0 ? 'Railway Station • AC/Volvo Buses' : 
                    index === 8 ? 'Mall Access • City Buses' :
                    index === 14 ? 'Commercial Hub • Auto Stand' :
                    index === 16 ? 'South Railway • KSRTC' :
                    index === 18 ? 'Bus Terminal • Water Metro' :
                    'Local Bus Routes • Auto Rickshaws'}
                </div>
              </div>

              <div style="text-align: center; margin-top: 8px; padding-top: 6px; border-top: 1px solid #e5e7eb;">
                <div style="font-size: 10px; color: #9ca3af;">
                  ${index === 0 ? '🚩 Terminal Station (North)' : 
                    index === stations.length - 1 ? '🏁 Terminal Station (South)' : 
                    '⭕ Intermediate Station'}
                </div>
                <div style="font-size: 9px; color: #d1d5db; margin-top: 2px;">${station.lat.toFixed(4)}, ${station.lng.toFixed(4)}</div>
              </div>
            </div>
          `, {
            direction: 'top',
            offset: [0, -15],
            opacity: 0.95,
            className: 'custom-tooltip'
          });

          // Add comprehensive popup with all details
          marker.bindPopup(`
            <div style="padding: 12px; min-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="border-bottom: 3px solid #c21f3a; padding-bottom: 8px; margin-bottom: 12px;">
                <h3 style="font-weight: bold; font-size: 20px; margin: 0 0 4px 0; color: #1f2937;">${station.name}</h3>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Station ${index + 1} of ${stations.length}</span>
                  <span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: 500;">${station.status}</span>
                </div>
              </div>
              
              <div style="display: grid; gap: 10px; margin-bottom: 12px;">
                <div style="background: #f3f4f6; padding: 8px; border-radius: 6px;">
                  <div style="font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 4px;">🚇 Metro Information</div>
                  <div style="font-size: 11px; color: #6b7280;">Line: Kochi Metro Blue Line</div>
                  <div style="font-size: 11px; color: #6b7280;">Zone: ${index < 7 ? 'North Zone' : index < 14 ? 'Central Zone' : 'South Zone'}</div>
                </div>
                
                <div style="background: #f3f4f6; padding: 8px; border-radius: 6px;">
                  <div style="font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 4px;">📍 Location Details</div>
                  <div style="font-size: 11px; color: #6b7280; margin-bottom: 2px;">Landmark: ${station.landmark}</div>
                  <div style="font-size: 10px; color: #9ca3af; font-family: monospace;">Coordinates: ${station.lat.toFixed(6)}, ${station.lng.toFixed(6)}</div>
                </div>
                
                <div style="background: #f3f4f6; padding: 8px; border-radius: 6px;">
                  <div style="font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 4px;">🏢 Station Facilities</div>
                  <div style="font-size: 11px; color: #6b7280;">
                    ${index === 0 || index === stations.length - 1 ? 'Major Bus Terminus, Parking Area, Ticket Counter' : 'Bus Connectivity, Pedestrian Access, Ticket Counter'}
                    ${index === 6 ? ', University Campus Access' : ''}
                    ${index === 8 || index === 11 || index === 18 ? ', Medical Facilities Nearby' : ''}
                    ${index === 14 ? ', Shopping District Access' : ''}
                    ${index === 18 ? ', Multi-modal Transport Hub' : ''}
                  </div>
                </div>
                
                <div style="background: #f3f4f6; padding: 8px; border-radius: 6px;">
                  <div style="font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 4px;">🚌 Connectivity</div>
                  <div style="font-size: 11px; color: #6b7280;">
                    ${index === 0 ? 'Railway Station, AC/Volvo Buses, KSRTC Services' : 
                      index === 8 ? 'Mall Access, City Buses, Shopping Centers' :
                      index === 14 ? 'Commercial Hub, Auto Stand, Shopping District' :
                      index === 16 ? 'South Railway Station, KSRTC Buses' :
                      index === 18 ? 'Bus Terminal, Water Metro, Multi-modal Hub' :
                      'Local Bus Routes, Auto Rickshaws, City Transport'}
                  </div>
                </div>
              </div>

              <div style="text-align: center; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                <span style="font-size: 10px; color: #9ca3af;">
                  ${index === 0 ? '🚩 Starting Station - Aluva' : index === stations.length - 1 ? '🏁 Terminal Station - Petta' : '⭕ Intermediate Station'}
                </span>
              </div>
            </div>
          `);

          // Add click handler
          marker.on('click', () => {
            setSelectedStation({ ...station, index });
            // Update marker styles
            markersRef.current.forEach((m, i) => {
              const isSelected = i === index;
              m.setStyle({
                fillColor: isSelected ? '#ff6b35' : '#c21f3a',
                radius: isSelected ? 8 : 6
              });
            });
          });

          markersRef.current.push(marker);
        });

        // Fit bounds to show all stations
        const bounds = stations.map(station => [station.lat, station.lng]);
        map.fitBounds(bounds, { padding: [20, 20] });

        leafletMapRef.current = map;
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
            <h1 className="text-xl font-bold text-white">Kochi Metro Rail</h1>
          </div>
          <div className="text-sm text-gray-400 mb-6">
            Aluva ↔ Petta • {stations.length} Stations
          </div>
          
          <div className="space-y-2">
            {stations.map((station, index) => (
              <div
                key={index}
                onClick={() => handleStationClick(station, index)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700 ${
                  selectedStation && selectedStation.index === index
                    ? 'bg-red-900 border border-red-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className={`w-3 h-3 rounded-full mr-3 ${
                        selectedStation && selectedStation.index === index
                          ? 'bg-red-400'
                          : 'bg-red-600'
                      }`}
                    ></div>
                    <div>
                      <div className="font-medium text-sm">{station.name}</div>
                      <div className="text-xs text-gray-400">{station.landmark}</div>
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className="bg-green-600 px-2 py-1 rounded text-xs">
                      {station.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-lg font-semibold mb-2">Kochi Metro Route Map</h2>
          <div className="text-sm text-gray-300">
            <div>• Click "Operational" to zoom in</div>
            <div>• Hover markers for quick info</div>
            <div>• Total Distance: ~25.6 km</div>
          </div>
          
          {selectedStation && (
            <div className="mt-3 pt-3 border-t border-gray-600">
              <div className="text-xs text-gray-400">Currently Viewing:</div>
              <div className="font-medium text-sm text-white">{selectedStation.name}</div>
              <button
                onClick={() => {
                  // Reset to full view
                  if (leafletMapRef.current) {
                    const bounds = stations.map(station => [station.lat, station.lng]);
                    leafletMapRef.current.fitBounds(bounds, { padding: [20, 20] });
                  }
                  setSelectedStation(null);
                  // Reset all marker styles
                  markersRef.current.forEach((marker) => {
                    marker.setStyle({
                      fillColor: '#c21f3a',
                      radius: 6
                    });
                  });
                }}
                className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
              >
                View All Stations
              </button>
            </div>
          )}
        </div>

        <div 
          ref={mapRef}
          className="w-full h-full"
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  );
};

export default KochiMetroMap;