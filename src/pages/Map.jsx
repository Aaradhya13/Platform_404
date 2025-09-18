import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const KochiMetroMap = () => {
  const [selectedStation, setSelectedStation] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);

  const handleBack = () => {
    window.history.back();
  };

  const getTrainsAtStation = (stationName, index) => {
    const trainNumbers = [101, 102, 103, 104, 105, 106];
    const randomTrains = trainNumbers.slice(0, Math.floor(Math.random() * 3) + 2);
    
    return randomTrains.map(trainNum => ({
      id: trainNum,
      number: `KM-${trainNum}`,
      destination: index < 10 ? 'Petta' : 'Aluva',
      arrivalTime: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      status: Math.random() > 0.3 ? 'On Time' : 'Delayed',
      platform: Math.floor(Math.random() * 2) + 1
    }));
  };

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
    setSelectedStation({ ...station, index });
    
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker, i) => {
        const isSelected = i === index;
        marker.setStyle({
          fillColor: isSelected ? '#3b82f6' : '#ef4444',
          radius: isSelected ? 8 : 6
        });
      });
    }
  };

  useEffect(() => {
    if (!showAnalytics) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload = () => {
        if (mapRef.current && window.L && !leafletMapRef.current) {
          const map = window.L.map(mapRef.current, {
            center: [10.0261, 76.3129],
            zoom: 11,
            zoomControl: true,
            closePopupOnClick: false
          });

          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

          const routeCoordinates = stations.map(station => [station.lat, station.lng]);
          const polyline = window.L.polyline(routeCoordinates, {
            color: '#ef4444',
            weight: 4,
            opacity: 0.8,
            smoothFactor: 1
          }).addTo(map);

          stations.forEach((station, index) => {
            const marker = window.L.circleMarker([station.lat, station.lng], {
              radius: 6,
              fillColor: '#ef4444',
              color: 'white',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.9
            }).addTo(map);

            const trains = getTrainsAtStation(station.name, index);
            
            const popup = window.L.popup({
              maxWidth: 350,
              className: 'custom-popup',
              closeButton: true,
              autoClose: false,
              closeOnClick: false,
              closeOnEscapeKey: false
            }).setContent(`
              <div style="min-width: 300px; font-family: system-ui, -apple-system, sans-serif;">
                <div style="border-bottom: 2px solid #ef4444; padding-bottom: 8px; margin-bottom: 12px;">
                  <div style="font-weight: bold; font-size: 16px; color: #1f2937;">${station.name}</div>
                  <div style="font-size: 12px; color: #6b7280;">${station.landmark}</div>
                </div>
                
                <div style="margin-bottom: 12px;">
                  <div style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px;">🚇 Trains at Station</div>
                  ${trains.map(train => `
                    <div style="background: #f8f9fa; padding: 8px; border-radius: 6px; margin-bottom: 6px; border-left: 3px solid ${train.status === 'On Time' ? '#10b981' : '#f59e0b'};">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                          <div style="font-weight: 600; color: #1f2937; font-size: 13px;">${train.number}</div>
                          <div style="font-size: 11px; color: #6b7280;">To: ${train.destination} | Platform ${train.platform}</div>
                        </div>
                        <div style="text-align: right;">
                          <div style="font-size: 12px; font-weight: 500; color: #374151;">${train.arrivalTime}</div>
                          <div style="font-size: 10px; color: ${train.status === 'On Time' ? '#10b981' : '#f59e0b'}; font-weight: 500;">${train.status}</div>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>

                <div style="text-align: center; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                  <button onclick="window.showStationAnalytics('${station.name}', ${index})" 
                          style="background: #3b82f6; color: white; padding: 6px 12px; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500;">
                    📊 Click Here for Analytics
                  </button>
                </div>
              </div>
            `);
            
            marker.bindPopup(popup);

            // Show popup on hover
            marker.on('mouseover', () => {
              clearTimeout(window.popupCloseTimeout);
              // Close all other popups first
              markersRef.current.forEach(m => m.closePopup());
              marker.openPopup();
            });

            // Hide popup when mouse leaves marker
            marker.on('mouseout', () => {
              window.popupCloseTimeout = setTimeout(() => {
                marker.closePopup();
              }, 300);
            });

            marker.on('click', () => {
              handleStationClick(station, index);
            });

            markersRef.current.push(marker);
          });

          const bounds = stations.map(station => [station.lat, station.lng]);
          map.fitBounds(bounds, { padding: [20, 20] });

          leafletMapRef.current = map;
        }
      };
      document.head.appendChild(script);

      // Global function for analytics button
      window.showStationAnalytics = (stationName, index) => {
        const station = stations.find(s => s.name === stationName);
        setSelectedStation({ ...station, index });
        setShowAnalytics(true);
      };

      // Add CSS to handle popup hover behavior
      const style = document.createElement('style');
      style.textContent = `
        .leaflet-popup {
          pointer-events: auto !important;
        }
        .leaflet-popup-content-wrapper {
          pointer-events: auto !important;
        }
      `;
      document.head.appendChild(style);

      // Add global event listener for popup hover
      document.addEventListener('mouseover', (e) => {
        if (e.target.closest('.leaflet-popup')) {
          clearTimeout(window.popupCloseTimeout);
        }
      });

      document.addEventListener('mouseout', (e) => {
        if (e.target.closest('.leaflet-popup') && !e.relatedTarget?.closest('.leaflet-popup')) {
          window.popupCloseTimeout = setTimeout(() => {
            if (leafletMapRef.current) {
              leafletMapRef.current.closePopup();
            }
          }, 300);
        }
      });
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [showAnalytics]);

  if (showAnalytics && selectedStation) {
    const analytics = {
      dailyPassengers: Math.floor(Math.random() * 5000) + 2000,
      trainsToday: Math.floor(Math.random() * 150) + 80,
      avgWaitTime: Math.floor(Math.random() * 8) + 2,
      efficiency: Math.floor(Math.random() * 20) + 85,
      hourlyData: [120, 180, 250, 320, 450, 380, 280, 520, 680, 750, 620, 480, 380, 420, 580, 720, 850, 920, 680, 520, 380, 280, 200, 150],
      weeklyData: [2800, 3200, 3100, 3400, 3600, 2200, 2100],
      trainTypes: { Express: 45, Local: 35, Special: 20 }
    };
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {selectedStation.name} Station
                </h1>
                <p className="text-lg text-gray-600 mt-2">{selectedStation.landmark} • Analytics Dashboard</p>
                <div className="flex items-center mt-3 space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm text-gray-600">Live Data</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAnalytics(false)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                ← Back to Map
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Daily Passengers</div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{analytics.dailyPassengers.toLocaleString()}</div>
              <div className="flex items-center text-sm">
                <span className="text-green-600 font-medium">↗ +12%</span>
                <span className="text-gray-500 ml-1">from yesterday</span>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Trains Today</div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{analytics.trainsToday}</div>
              <div className="flex items-center text-sm">
                <span className="text-green-600 font-medium">↗ +5%</span>
                <span className="text-gray-500 ml-1">from average</span>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Avg Wait Time</div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{analytics.avgWaitTime} min</div>
              <div className="flex items-center text-sm">
                <span className="text-red-600 font-medium">↗ +0.5 min</span>
                <span className="text-gray-500 ml-1">from target</span>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Efficiency</div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{analytics.efficiency}%</div>
              <div className="flex items-center text-sm">
                <span className="text-green-600 font-medium">↗ +3%</span>
                <span className="text-gray-500 ml-1">this week</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Train Distribution</h3>
                <div className="text-sm text-gray-500">By type</div>
              </div>
              <div className="flex items-center justify-center h-64 p-4">
                <div className="relative w-40 h-40">
                  <div className="w-full h-full rounded-full" style={{
                    background: `conic-gradient(
                      #3b82f6 0deg ${analytics.trainTypes.Express * 3.6}deg,
                      #10b981 ${analytics.trainTypes.Express * 3.6}deg ${(analytics.trainTypes.Express + analytics.trainTypes.Local) * 3.6}deg,
                      #f59e0b ${(analytics.trainTypes.Express + analytics.trainTypes.Local) * 3.6}deg 360deg
                    )`
                  }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{analytics.trainsToday}</div>
                        <div className="text-xs text-gray-500">Trains</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 mt-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                    <span className="text-sm font-medium">Express</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">{analytics.trainTypes.Express}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                    <span className="text-sm font-medium">Local</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">{analytics.trainTypes.Local}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                    <span className="text-sm font-medium">Special</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-600">{analytics.trainTypes.Special}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Hourly Passenger Traffic</h3>
                <div className="text-sm text-gray-500">Today</div>
              </div>
              <div className="h-80 overflow-hidden">
                <div className="space-y-3 h-full overflow-y-auto pr-2">
                  {['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'].map((hour, idx) => {
                    const traffic = [120, 450, 280, 320, 180, 520, 680, 340][idx];
                    const maxTraffic = 680;
                    return (
                      <div key={hour} className="flex items-center space-x-3">
                        <div className="w-12 text-sm font-medium text-gray-700 flex-shrink-0">{hour}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden min-w-0">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                            style={{ width: `${Math.min((traffic / maxTraffic) * 100, 100)}%` }}
                          >
                            <span className="text-xs font-medium text-white truncate">{traffic}</span>
                          </div>
                        </div>
                        <div className="w-12 text-xs text-gray-600 text-right flex-shrink-0">
                          {Math.round((traffic / maxTraffic) * 100)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Weekly Passenger Trend</h3>
              <div className="text-sm text-gray-500">Past 7 days</div>
            </div>
            <div className="space-y-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-700">{day}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                      style={{ width: `${(analytics.weeklyData[idx] / Math.max(...analytics.weeklyData)) * 100}%` }}
                    >
                      <span className="text-xs font-medium text-white">{analytics.weeklyData[idx].toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">
                    {Math.round((analytics.weeklyData[idx] / Math.max(...analytics.weeklyData)) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h4 className="text-lg font-bold text-gray-900 mb-6">Peak Hours</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Morning Rush</span>
                  <span className="font-medium">8:00-10:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Evening Rush</span>
                  <span className="font-medium">5:00-7:00 PM</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h4 className="text-lg font-bold text-gray-900 mb-6">Service Quality</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>On-time Performance</span>
                    <span>94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Customer Satisfaction</span>
                    <span>87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h4 className="text-lg font-bold text-gray-900 mb-6">Station Status</h4>
              <div className="space-y-2">
                <div className="text-sm">All Systems Operational</div>
                <div className="text-sm">Safety Protocols Active</div>
                <div className="text-xs text-gray-500 mt-2">Last updated: 2 minutes ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-gray-900">
      <div className="w-80 bg-gray-100 border-r border-gray-300 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <h1 className="text-xl font-bold text-gray-900">Kochi Metro Rail</h1>
            </div>
            <button
              onClick={handleBack}
              className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          </div>
          <div className="text-sm text-gray-600 mb-6">
            Aluva ↔ Petta • {stations.length} Stations
          </div>
          
          <div className="space-y-2">
            {stations.map((station, index) => (
              <div
                key={index}
                onClick={() => handleStationClick(station, index)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-200 ${
                  selectedStation && selectedStation.index === index
                    ? 'bg-blue-100 border border-blue-500'
                    : 'bg-white hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className={`w-3 h-3 rounded-full mr-3 ${
                        selectedStation && selectedStation.index === index
                          ? 'bg-blue-500'
                          : 'bg-red-500'
                      }`}
                    ></div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{station.name}</div>
                      <div className="text-xs text-gray-600">{station.landmark}</div>
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className="bg-green-600 px-2 py-1 rounded text-xs text-white">
                      {station.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">Kochi Metro Route Map</h2>
          <div className="text-sm text-gray-700">
            <div>• Hover over stations to see trains</div>
            <div>• Click "Click Here" for analytics</div>
            <div>• Total Distance: ~25.6 km</div>
          </div>
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