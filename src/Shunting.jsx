// import React, { useState, useEffect } from 'react';
// import { Play, Pause, RotateCcw, Settings, Clock, Wrench, Train, AlertTriangle } from 'lucide-react';

// const KochiMetroDepotSimulation = () => {
//   // Train data based on your schedule with maintenance needs
//   const [trains, setTrains] = useState([
//     { id: 100, status: "ready", departureTime: "06:30", lane: null, position: 0, serviceDue: 707, needsMaintenance: true },
//     { id: 101, status: "ready", departureTime: "07:30", lane: null, position: 0, serviceDue: 24607, needsMaintenance: false },
//     { id: 102, status: "ready", departureTime: "08:00", lane: null, position: 0, serviceDue: 500, needsMaintenance: true },
//     { id: 103, status: "ready", departureTime: "09:00", lane: null, position: 0, serviceDue: 1200, needsMaintenance: false },
//     { id: 104, status: "ready", departureTime: "09:30", lane: null, position: 0, serviceDue: 800, needsMaintenance: false },
//     { id: 105, status: "ready", departureTime: "10:00", lane: null, position: 0, serviceDue: 1000, needsMaintenance: false },
//     { id: 106, status: "ready", departureTime: "10:30", lane: null, position: 0, serviceDue: 450, needsMaintenance: true },
//     { id: 107, status: "ready", departureTime: "11:00", lane: null, position: 0, serviceDue: 700, needsMaintenance: false },
//     { id: 108, status: "ready", departureTime: "11:30", lane: null, position: 0, serviceDue: 300, needsMaintenance: true },
//     { id: 109, status: "ready", departureTime: "12:00", lane: null, position: 0, serviceDue: 950, needsMaintenance: false },
//     { id: 110, status: "ready", departureTime: "06:00", lane: null, position: 0, serviceDue: 600, needsMaintenance: false },
//     { id: 111, status: "ready", departureTime: "07:00", lane: null, position: 0, serviceDue: 200, needsMaintenance: true },
//     { id: 112, status: "ready", departureTime: "08:30", lane: null, position: 0, serviceDue: 1100, needsMaintenance: false },
//     { id: 113, status: "ready", departureTime: "09:15", lane: null, position: 0, serviceDue: 850, needsMaintenance: false },
//     { id: 114, status: "ready", departureTime: "10:15", lane: null, position: 0, serviceDue: 150, needsMaintenance: true },
//     { id: 115, status: "ready", departureTime: "11:45", lane: null, position: 0, serviceDue: 1300, needsMaintenance: false },
//     { id: 116, status: "ready", departureTime: "12:30", lane: null, position: 0, serviceDue: 750, needsMaintenance: false },
//     { id: 117, status: "ready", departureTime: "13:00", lane: null, position: 0, serviceDue: 100, needsMaintenance: true },
//     { id: 118, status: "ready", departureTime: "06:45", lane: null, position: 0, serviceDue: 900, needsMaintenance: false },
//     { id: 119, status: "ready", departureTime: "07:15", lane: null, position: 0, serviceDue: 1050, needsMaintenance: false },
//     { id: 120, status: "ready", departureTime: "08:45", lane: null, position: 0, serviceDue: 250, needsMaintenance: true },
//     { id: 121, status: "ready", departureTime: "09:45", lane: null, position: 0, serviceDue: 650, needsMaintenance: false },
//     { id: 122, status: "ready", departureTime: "10:45", lane: null, position: 0, serviceDue: 1150, needsMaintenance: false },
//     { id: 123, status: "ready", departureTime: "11:15", lane: null, position: 0, serviceDue: 350, needsMaintenance: true },
//     { id: 124, status: "ready", departureTime: "12:15", lane: null, position: 0, serviceDue: 800, needsMaintenance: false },
//     { id: 125, status: "ready", departureTime: "13:15", lane: null, position: 0, serviceDue: 1400, needsMaintenance: false },
//     // Spare trains
//     { id: 126, status: "spare", departureTime: "N/A", lane: null, position: 0, serviceDue: 2000, needsMaintenance: false },
//     { id: 127, status: "spare", departureTime: "N/A", lane: null, position: 0, serviceDue: 1800, needsMaintenance: false }
//   ]);

//   const [lanes, setLanes] = useState(Array.from({ length: 13 }, (_, i) => ({
//     id: i + 1,
//     name: i === 0 ? "Spare Lane" : `Lane ${i}`,
//     type: i === 0 ? "spare" : "operational",
//     capacity: 2,
//     trains: [],
//     distanceFromWorkshop: i // Lane 1 is closest to workshop (distance 0)
//   })));

//   const [isSimulating, setIsSimulating] = useState(false);
//   const [simulationStep, setSimulationStep] = useState(0);
//   const [currentAction, setCurrentAction] = useState("");
//   const [workshopQueue, setWorkshopQueue] = useState([]);

//   // Smart depot placement algorithm
//   const optimizePlacement = () => {
//     const newTrains = [...trains];
//     const newLanes = lanes.map(lane => ({ ...lane, trains: [] }));

//     // Step 1: Place spare trains in spare lane (Lane 1)
//     const spareTrains = newTrains.filter(t => t.status === "spare");
//     spareTrains.forEach((train, index) => {
//       if (index < 2) {
//         train.lane = 1;
//         train.position = index + 1;
//         newLanes[0].trains.push(train);
//       }
//     });

//     // Step 2: Separate operational trains by maintenance needs and departure time
//     const operationalTrains = newTrains.filter(t => t.status === "ready");
//     const maintenanceTrains = operationalTrains.filter(t => t.needsMaintenance);
//     const regularTrains = operationalTrains.filter(t => !t.needsMaintenance);

//     // Step 3: Sort trains by departure time for operational efficiency
//     maintenanceTrains.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
//     regularTrains.sort((a, b) => a.departureTime.localeCompare(b.departureTime));

//     // Step 4: Place maintenance trains closest to workshop (front positions in lanes near workshop)
//     let maintenanceIndex = 0;
//     // Start from lane 2 (closest to workshop after spare lane)
//     for (let laneIndex = 1; laneIndex < newLanes.length && maintenanceIndex < maintenanceTrains.length; laneIndex++) {
//       const lane = newLanes[laneIndex];
//       // Place maintenance train in position 1 (closest to workshop/front of lane)
//       if (maintenanceIndex < maintenanceTrains.length) {
//         const train = maintenanceTrains[maintenanceIndex];
//         train.lane = laneIndex + 1;
//         train.position = 1;
//         lane.trains.push(train);
//         maintenanceIndex++;
//       }
//     }

//     // Step 5: Place regular operational trains
//     let regularIndex = 0;
//     // Fill remaining positions
//     for (let laneIndex = 1; laneIndex < newLanes.length && regularIndex < regularTrains.length; laneIndex++) {
//       const lane = newLanes[laneIndex];
//       // Fill position 2 if available
//       if (lane.trains.length < 2) {
//         const train = regularTrains[regularIndex];
//         train.lane = laneIndex + 1;
//         train.position = 2;
//         lane.trains.push(train);
//         regularIndex++;
//       }
//     }

//     // Step 6: Fill any remaining positions with remaining regular trains
//     for (let laneIndex = 1; laneIndex < newLanes.length && regularIndex < regularTrains.length; laneIndex++) {
//       const lane = newLanes[laneIndex];
//       while (lane.trains.length < 2 && regularIndex < regularTrains.length) {
//         const train = regularTrains[regularIndex];
//         train.lane = laneIndex + 1;
//         train.position = lane.trains.length + 1;
//         lane.trains.push(train);
//         regularIndex++;
//       }
//     }

//     setTrains(newTrains);
//     setLanes(newLanes);

//     // Set up workshop queue for tomorrow's maintenance
//     const tomorrowMaintenance = maintenanceTrains.slice(0, 5); // First 5 trains for maintenance
//     setWorkshopQueue(tomorrowMaintenance);
//   };

//   // Simulation of morning operations
//   const simulateShunting = () => {
//     if (isSimulating) {
//       setIsSimulating(false);
//       setCurrentAction("");
//       return;
//     }

//     setIsSimulating(true);
//     setSimulationStep(0);
    
//     const actions = [
//       "🔧 Moving trains to workshop for scheduled maintenance...",
//       "🚿 Starting cleaning operations on ready trains...",
//       "⚡ Conducting pre-service inspections...",
//       "🔄 Repositioning trains based on departure schedule...",
//       "📋 Running safety checks on all operational trains...",
//       "🚂 Moving Train 110 (06:00 departure) to exit position...",
//       "🚂 Moving Train 118 (06:45 departure) to ready position...",
//       "🚂 Moving Train 100 (06:30 departure) to service after maintenance...",
//       "✅ All trains positioned for morning service...",
//       "🏁 Depot ready for morning operations!"
//     ];

//     let step = 0;
//     const interval = setInterval(() => {
//       if (step >= actions.length) {
//         setIsSimulating(false);
//         setCurrentAction("✅ Simulation Complete!");
//         clearInterval(interval);
//         return;
//       }

//       setCurrentAction(actions[step]);
//       setSimulationStep(step + 1);

//       // Simulate some visual changes during key steps
//       if (step === 5) {
//         // Highlight early departure train
//         setTrains(prev => prev.map(t => 
//           t.id === 110 ? { ...t, status: "departing" } : t
//         ));
//       }

//       step++;
//     }, 1500);
//   };

//   const resetSimulation = () => {
//     setIsSimulating(false);
//     setSimulationStep(0);
//     setCurrentAction("");
//     setTrains(trains.map(t => ({ 
//       ...t, 
//       lane: null, 
//       position: 0, 
//       status: t.id >= 126 ? "spare" : "ready" 
//     })));
//     setLanes(lanes.map(l => ({ ...l, trains: [] })));
//     setWorkshopQueue([]);
//   };

//   const getTrainColor = (train) => {
//     if (train.status === "departing") return "bg-yellow-500 animate-pulse";
//     if (train.status === "spare") return "bg-gray-500";
//     if (train.needsMaintenance) return "bg-red-500";
    
//     // Color by departure time
//     const hour = parseInt(train.departureTime.split(':')[0]);
//     if (hour < 8) return "bg-green-500";
//     if (hour < 10) return "bg-blue-500";
//     return "bg-purple-500";
//   };

//   const getTrainStatusText = (train) => {
//     if (train.status === "spare") return "Spare";
//     if (train.needsMaintenance) return "Maintenance Due";
//     return `Departs ${train.departureTime}`;
//   };

//   useEffect(() => {
//     optimizePlacement();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center space-x-3">
//               <Train className="text-blue-400" size={32} />
//               <div>
//                 <h1 className="text-2xl font-bold text-white">Kochi Metro Depot - Muttom</h1>
//                 <p className="text-blue-200">Smart Depot Management & Maintenance Scheduling</p>
//               </div>
//             </div>
            
//             <div className="flex space-x-3">
//               <button
//                 onClick={simulateShunting}
//                 className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
//               >
//                 {isSimulating ? <Pause size={16} /> : <Play size={16} />}
//                 <span>{isSimulating ? 'Stop' : 'Start'} Operations</span>
//               </button>
              
//               <button
//                 onClick={resetSimulation}
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
//               >
//                 <RotateCcw size={16} />
//                 <span>Reset</span>
//               </button>
              
//               <button
//                 onClick={optimizePlacement}
//                 className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
//               >
//                 <Settings size={16} />
//                 <span>Auto-Place</span>
//               </button>
//             </div>
//           </div>

//           {/* Real-time Status */}
//           {isSimulating && (
//             <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
//               <div className="flex items-center space-x-2">
//                 <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
//                 <span className="text-yellow-100 font-medium">{currentAction}</span>
//               </div>
//               <div className="w-full bg-yellow-900/50 rounded-full h-2 mt-2">
//                 <div 
//                   className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
//                   style={{ width: `${(simulationStep / 10) * 100}%` }}
//                 ></div>
//               </div>
//             </div>
//           )}

//           {/* Statistics */}
//           <div className="grid grid-cols-5 gap-4">
//             <div className="bg-white/10 rounded-lg p-3">
//               <div className="text-sm text-blue-200">Total Trains</div>
//               <div className="text-xl font-bold text-white">{trains.length}</div>
//             </div>
//             <div className="bg-white/10 rounded-lg p-3">
//               <div className="text-sm text-red-200">Need Maintenance</div>
//               <div className="text-xl font-bold text-white">{trains.filter(t => t.needsMaintenance).length}</div>
//             </div>
//             <div className="bg-white/10 rounded-lg p-3">
//               <div className="text-sm text-green-200">Operational</div>
//               <div className="text-xl font-bold text-white">{trains.filter(t => t.status === "ready").length}</div>
//             </div>
//             <div className="bg-white/10 rounded-lg p-3">
//               <div className="text-sm text-gray-200">Spare</div>
//               <div className="text-xl font-bold text-white">{trains.filter(t => t.status === "spare").length}</div>
//             </div>
//             <div className="bg-white/10 rounded-lg p-3">
//               <div className="text-sm text-purple-200">Workshop Queue</div>
//               <div className="text-xl font-bold text-white">{workshopQueue.length}</div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-12 gap-4">
//           {/* Depot Layout */}
//           <div className="col-span-8">
//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-bold text-white flex items-center">
//                   <Settings className="mr-2" size={20} />
//                   Depot Layout - 13 Lanes
//                 </h2>
//                 <div className="flex items-center space-x-4 text-sm text-gray-300">
//                   <div className="flex items-center space-x-1">
//                     <Wrench size={14} />
//                     <span>Workshop →</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <div className="w-3 h-3 bg-red-500 rounded"></div>
//                     <span>Maintenance</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <div className="w-3 h-3 bg-green-500 rounded"></div>
//                     <span>Early ( 8AM)</span>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="space-y-3">
//                 {/* Workshop Area */}
//                 <div className="bg-orange-500/20 border-2 border-orange-500/40 rounded-lg p-3 mb-4">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <Wrench className="text-orange-400" size={16} />
//                     <span className="text-orange-200 font-bold">MAINTENANCE WORKSHOP</span>
//                   </div>
//                   <div className="text-orange-100 text-sm">
//                     Tomorrow's Maintenance Schedule: {workshopQueue.map(t => `Train ${t.id}`).join(', ') || 'No maintenance scheduled'}
//                   </div>
//                 </div>

//                 {lanes.map((lane, index) => (
//                   <div key={lane.id} className="relative">
//                     {/* Lane Header */}
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center space-x-2">
//                         <span className={`text-sm font-medium px-3 py-1 rounded-full ${
//                           lane.type === 'spare' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
//                         }`}>
//                           {lane.name} {lane.type === 'spare' && '(Spare)'}
//                         </span>
//                         <span className="text-xs text-gray-400">
//                           Distance from workshop: {lane.distanceFromWorkshop * 50}m
//                         </span>
//                       </div>
//                       <span className="text-xs text-gray-300">
//                         {lane.trains.length}/{lane.capacity}
//                       </span>
//                     </div>

//                     {/* Lane Track with proper orientation */}
//                     <div className="relative bg-gray-800 rounded-lg p-3 min-h-20 border-2 border-gray-600">
//                       <div className="flex space-x-3 h-14">
//                         {/* Position 1 (Front - Closest to Workshop) */}
//                         <div className="flex-1 bg-gray-700 rounded border-2 border-dashed border-gray-500 flex items-center justify-center relative overflow-hidden">
//                           {lane.trains.find(t => t.position === 1) ? (
//                             <div className={`w-full h-10 rounded ${getTrainColor(lane.trains.find(t => t.position === 1))} flex flex-col items-center justify-center shadow-lg relative`}>
//                               <span className="text-white text-xs font-bold">
//                                 {lane.trains.find(t => t.position === 1).id}
//                               </span>
//                               <span className="text-white text-xs opacity-80">
//                                 {lane.trains.find(t => t.position === 1).needsMaintenance ? 'MAINT' : 'READY'}
//                               </span>
//                               {lane.trains.find(t => t.position === 1).needsMaintenance && (
//                                 <AlertTriangle className="absolute -top-1 -right-1 text-yellow-400" size={12} />
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-gray-400 text-xs">Front</span>
//                           )}
//                           <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-2 border-b-2 border-r-4 border-t-transparent border-b-transparent border-r-orange-400 opacity-60"></div>
//                         </div>

//                         {/* Position 2 (Back) */}
//                         <div className="flex-1 bg-gray-700 rounded border-2 border-dashed border-gray-500 flex items-center justify-center relative overflow-hidden">
//                           {lane.trains.find(t => t.position === 2) ? (
//                             <div className={`w-full h-10 rounded ${getTrainColor(lane.trains.find(t => t.position === 2))} flex flex-col items-center justify-center shadow-lg relative`}>
//                               <span className="text-white text-xs font-bold">
//                                 {lane.trains.find(t => t.position === 2).id}
//                               </span>
//                               <span className="text-white text-xs opacity-80">
//                                 {lane.trains.find(t => t.position === 2).needsMaintenance ? 'MAINT' : 'READY'}
//                               </span>
//                               {lane.trains.find(t => t.position === 2).needsMaintenance && (
//                                 <AlertTriangle className="absolute -top-1 -right-1 text-yellow-400" size={12} />
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-gray-400 text-xs">Back</span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Control Panel */}
//           <div className="col-span-4 space-y-4">
//             {/* Morning Schedule */}
//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
//               <h3 className="text-lg font-bold text-white mb-3 flex items-center">
//                 <Clock className="mr-2" size={16} />
//                 Tomorrow's Schedule
//               </h3>
//               <div className="max-h-80 overflow-y-auto space-y-2">
//                 {trains
//                   .filter(t => t.status === "ready")
//                   .sort((a, b) => a.departureTime.localeCompare(b.departureTime))
//                   .slice(0, 12)
//                   .map(train => (
//                     <div key={train.id} className={`p-2 rounded border ${
//                       train.needsMaintenance ? 'bg-red-500/20 border-red-500/30' : 'bg-blue-500/20 border-blue-500/30'
//                     }`}>
//                       <div className="flex justify-between items-center">
//                         <span className="text-white font-medium">Train {train.id}</span>
//                         <span className="text-blue-200 text-sm">{train.departureTime}</span>
//                       </div>
//                       <div className="flex justify-between items-center mt-1">
//                         <span className="text-xs text-gray-300">
//                           {train.lane ? `Lane ${train.lane} Pos ${train.position}` : 'Not placed'}
//                         </span>
//                         {train.needsMaintenance && (
//                           <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
//                             MAINTENANCE
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   ))
//                 }
//               </div>
//             </div>

//             {/* Maintenance Queue */}
//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
//               <h3 className="text-lg font-bold text-white mb-3 flex items-center">
//                 <Wrench className="mr-2" size={16} />
//                 Workshop Queue
//               </h3>
//               <div className="space-y-2">
//                 {workshopQueue.length > 0 ? workshopQueue.map((train, index) => (
//                   <div key={train.id} className="bg-red-500/20 border border-red-500/30 rounded p-2">
//                     <div className="flex justify-between items-center">
//                       <span className="text-white">Train {train.id}</span>
//                       <span className="text-red-200 text-sm">#{index + 1}</span>
//                     </div>
//                     <div className="text-xs text-red-100">
//                       Service due: {train.serviceDue} km ago
//                     </div>
//                   </div>
//                 )) : (
//                   <div className="text-gray-400 text-sm text-center py-4">
//                     No maintenance scheduled
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Instructions */}
//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
//               <h3 className="text-lg font-bold text-white mb-3">How It Works</h3>
//               <div className="space-y-2 text-sm text-gray-300">
//                 <div className="flex items-start space-x-2">
//                   <span className="text-blue-400">1.</span>
//                   <span>Trains needing maintenance are placed closest to workshop (front positions)</span>
//                 </div>
//                 <div className="flex items-start space-x-2">
//                   <span className="text-blue-400">2.</span>
//                   <span>Spare trains occupy dedicated spare lane</span>
//                 </div>
//                 <div className="flex items-start space-x-2">
//                   <span className="text-blue-400">3.</span>
//                   <span>Operational trains arranged by departure time</span>
//                 </div>
//                 <div className="flex items-start space-x-2">
//                   <span className="text-blue-400">4.</span>
//                   <span>Click "Start Operations" to simulate morning activities</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default KochiMetroDepotSimulation;
// import React, { useState, useEffect } from 'react';
// import { Play, Pause, RotateCcw, Settings, Clock, Wrench, Train, AlertTriangle, ArrowRight, Eye } from 'lucide-react';

// const KochiMetroDepotSimulation = () => {
//   // Train data with clear maintenance indicators
//   const [trains, setTrains] = useState([
//     { id: 100, status: "ready", departureTime: "06:30", lane: null, position: 0, serviceDue: 707, needsMaintenance: true, isMoving: false },
//     { id: 101, status: "ready", departureTime: "07:30", lane: null, position: 0, serviceDue: 24607, needsMaintenance: false, isMoving: false },
//     { id: 102, status: "ready", departureTime: "08:00", lane: null, position: 0, serviceDue: 500, needsMaintenance: true, isMoving: false },
//     { id: 103, status: "ready", departureTime: "09:00", lane: null, position: 0, serviceDue: 1200, needsMaintenance: false, isMoving: false },
//     { id: 104, status: "ready", departureTime: "09:30", lane: null, position: 0, serviceDue: 800, needsMaintenance: false, isMoving: false },
//     { id: 105, status: "ready", departureTime: "10:00", lane: null, position: 0, serviceDue: 1000, needsMaintenance: false, isMoving: false },
//     { id: 106, status: "ready", departureTime: "10:30", lane: null, position: 0, serviceDue: 450, needsMaintenance: true, isMoving: false },
//     { id: 107, status: "ready", departureTime: "11:00", lane: null, position: 0, serviceDue: 700, needsMaintenance: false, isMoving: false },
//     { id: 108, status: "ready", departureTime: "11:30", lane: null, position: 0, serviceDue: 300, needsMaintenance: true, isMoving: false },
//     { id: 109, status: "ready", departureTime: "12:00", lane: null, position: 0, serviceDue: 950, needsMaintenance: false, isMoving: false },
//     { id: 110, status: "ready", departureTime: "06:00", lane: null, position: 0, serviceDue: 600, needsMaintenance: false, isMoving: false },
//     { id: 111, status: "ready", departureTime: "07:00", lane: null, position: 0, serviceDue: 200, needsMaintenance: true, isMoving: false },
//     { id: 112, status: "ready", departureTime: "08:30", lane: null, position: 0, serviceDue: 1100, needsMaintenance: false, isMoving: false },
//     { id: 113, status: "ready", departureTime: "09:15", lane: null, position: 0, serviceDue: 850, needsMaintenance: false, isMoving: false },
//     { id: 114, status: "ready", departureTime: "10:15", lane: null, position: 0, serviceDue: 150, needsMaintenance: true, isMoving: false },
//     { id: 115, status: "ready", departureTime: "11:45", lane: null, position: 0, serviceDue: 1300, needsMaintenance: false, isMoving: false },
//     { id: 116, status: "ready", departureTime: "12:30", lane: null, position: 0, serviceDue: 750, needsMaintenance: false, isMoving: false },
//     { id: 117, status: "ready", departureTime: "13:00", lane: null, position: 0, serviceDue: 100, needsMaintenance: true, isMoving: false },
//     { id: 118, status: "ready", departureTime: "06:45", lane: null, position: 0, serviceDue: 900, needsMaintenance: false, isMoving: false },
//     { id: 119, status: "ready", departureTime: "07:15", lane: null, position: 0, serviceDue: 1050, needsMaintenance: false, isMoving: false },
//     { id: 120, status: "ready", departureTime: "08:45", lane: null, position: 0, serviceDue: 250, needsMaintenance: true, isMoving: false },
//     { id: 121, status: "ready", departureTime: "09:45", lane: null, position: 0, serviceDue: 650, needsMaintenance: false, isMoving: false },
//     { id: 122, status: "ready", departureTime: "10:45", lane: null, position: 0, serviceDue: 1150, needsMaintenance: false, isMoving: false },
//     { id: 123, status: "ready", departureTime: "11:15", lane: null, position: 0, serviceDue: 350, needsMaintenance: true, isMoving: false },
//     { id: 124, status: "ready", departureTime: "12:15", lane: null, position: 0, serviceDue: 800, needsMaintenance: false, isMoving: false },
//     { id: 125, status: "ready", departureTime: "13:15", lane: null, position: 0, serviceDue: 1400, needsMaintenance: false, isMoving: false },
//     // Spare trains
//     { id: 126, status: "spare", departureTime: "N/A", lane: null, position: 0, serviceDue: 2000, needsMaintenance: false, isMoving: false },
//     { id: 127, status: "spare", departureTime: "N/A", lane: null, position: 0, serviceDue: 1800, needsMaintenance: false, isMoving: false }
//   ]);

//   const [lanes, setLanes] = useState(Array.from({ length: 13 }, (_, i) => ({
//     id: i + 1,
//     name: i === 0 ? "Spare Lane" : `Lane ${i}`,
//     type: i === 0 ? "spare" : "operational",
//     capacity: 2,
//     trains: [],
//     distanceFromWorkshop: i,
//     isHighlighted: false
//   })));

//   const [isSimulating, setIsSimulating] = useState(false);
//   const [simulationStep, setSimulationStep] = useState(0);
//   const [currentAction, setCurrentAction] = useState("");
//   const [workshopQueue, setWorkshopQueue] = useState([]);
//   const [movingTrains, setMovingTrains] = useState([]);
//   const [highlightedLanes, setHighlightedLanes] = useState([]);

//   // Auto-place trains on load
//   const autoPlaceTrains = () => {
//     const newTrains = [...trains];
//     const newLanes = lanes.map(lane => ({ ...lane, trains: [], isHighlighted: false }));

//     // Step 1: Place spare trains
//     const spareTrains = newTrains.filter(t => t.status === "spare");
//     spareTrains.forEach((train, index) => {
//       if (index < 2) {
//         train.lane = 1;
//         train.position = index + 1;
//         newLanes[0].trains.push(train);
//       }
//     });

//     // Step 2: Place maintenance trains closest to workshop (front positions)
//     const operationalTrains = newTrains.filter(t => t.status === "ready");
//     const maintenanceTrains = operationalTrains.filter(t => t.needsMaintenance);
//     const regularTrains = operationalTrains.filter(t => !t.needsMaintenance);

//     maintenanceTrains.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
//     regularTrains.sort((a, b) => a.departureTime.localeCompare(b.departureTime));

//     // Place maintenance trains in front positions
//     let maintenanceIndex = 0;
//     for (let laneIndex = 1; laneIndex < newLanes.length && maintenanceIndex < maintenanceTrains.length; laneIndex++) {
//       const lane = newLanes[laneIndex];
//       if (maintenanceIndex < maintenanceTrains.length) {
//         const train = maintenanceTrains[maintenanceIndex];
//         train.lane = laneIndex + 1;
//         train.position = 1; // Front position for easy workshop access
//         lane.trains.push(train);
//         maintenanceIndex++;
//       }
//     }

//     // Fill remaining positions with regular trains
//     let regularIndex = 0;
//     for (let laneIndex = 1; laneIndex < newLanes.length && regularIndex < regularTrains.length; laneIndex++) {
//       const lane = newLanes[laneIndex];
//       if (lane.trains.length < 2) {
//         const train = regularTrains[regularIndex];
//         train.lane = laneIndex + 1;
//         train.position = 2;
//         lane.trains.push(train);
//         regularIndex++;
//       }
//     }

//     // Fill any remaining spots
//     for (let laneIndex = 1; laneIndex < newLanes.length && regularIndex < regularTrains.length; laneIndex++) {
//       const lane = newLanes[laneIndex];
//       while (lane.trains.length < 2 && regularIndex < regularTrains.length) {
//         const train = regularTrains[regularIndex];
//         train.lane = laneIndex + 1;
//         train.position = lane.trains.length + 1;
//         lane.trains.push(train);
//         regularIndex++;
//       }
//     }

//     setTrains(newTrains);
//     setLanes(newLanes);
//     setWorkshopQueue(maintenanceTrains.slice(0, 5));
//   };

//   // Visual simulation with clear steps
//   const startVisualSimulation = () => {
//     if (isSimulating) {
//       setIsSimulating(false);
//       setCurrentAction("");
//       setMovingTrains([]);
//       setHighlightedLanes([]);
//       return;
//     }

//     setIsSimulating(true);
//     setSimulationStep(0);
    
//     const simulationSteps = [
//       {
//         action: "🔧 STEP 1: Moving maintenance trains to workshop area",
//         visual: () => {
//           // Highlight maintenance trains and show movement
//           const maintenanceTrainIds = trains.filter(t => t.needsMaintenance).slice(0, 3).map(t => t.id);
//           setMovingTrains(maintenanceTrainIds);
//           setHighlightedLanes([1, 2, 3]); // Highlight lanes near workshop
          
//           setTrains(prev => prev.map(train => 
//             maintenanceTrainIds.includes(train.id) 
//               ? { ...train, isMoving: true, status: "maintenance" }
//               : train
//           ));
//         }
//       },
//       {
//         action: "🚿 STEP 2: Starting cleaning operations on all trains",
//         visual: () => {
//           setMovingTrains([]);
//           setHighlightedLanes([4, 5, 6, 7]);
          
//           // Show cleaning effect
//           setTrains(prev => prev.map(train => ({
//             ...train,
//             isMoving: false,
//             status: train.status === "maintenance" ? "cleaning" : train.status
//           })));
//         }
//       },
//       {
//         action: "⚡ STEP 3: Conducting safety inspections and system checks",
//         visual: () => {
//           setHighlightedLanes([8, 9, 10]);
          
//           setTrains(prev => prev.map(train => ({
//             ...train,
//             status: train.status === "cleaning" ? "inspection" : train.status
//           })));
//         }
//       },
//       {
//         action: "🚂 STEP 4: Positioning early morning trains (6:00-7:00 AM)",
//         visual: () => {
//           const earlyTrains = trains.filter(t => t.departureTime <= "07:00").map(t => t.id);
//           setMovingTrains(earlyTrains);
//           setHighlightedLanes([11, 12, 13]); // Exit lanes
          
//           setTrains(prev => prev.map(train => 
//             earlyTrains.includes(train.id) 
//               ? { ...train, isMoving: true, status: "ready-early" }
//               : train
//           ));
//         }
//       },
//       {
//         action: "🔄 STEP 5: Final positioning for efficient morning departure",
//         visual: () => {
//           setMovingTrains([]);
//           setHighlightedLanes([1, 2, 3, 4, 5]);
          
//           setTrains(prev => prev.map(train => ({
//             ...train,
//             isMoving: false,
//             status: train.status.includes("ready") || train.status === "inspection" ? "ready" : train.status
//           })));
//         }
//       },
//       {
//         action: "✅ STEP 6: All trains positioned - Depot ready for service!",
//         visual: () => {
//           setMovingTrains([]);
//           setHighlightedLanes([]);
          
//           setTrains(prev => prev.map(train => ({
//             ...train,
//             isMoving: false,
//             status: train.id >= 126 ? "spare" : (train.needsMaintenance && train.status === "maintenance") ? "maintenance" : "ready"
//           })));
//         }
//       }
//     ];

//     let step = 0;
//     const interval = setInterval(() => {
//       if (step >= simulationSteps.length) {
//         setIsSimulating(false);
//         setCurrentAction("✅ Simulation Complete - Ready for Morning Operations!");
//         setMovingTrains([]);
//         setHighlightedLanes([]);
//         clearInterval(interval);
//         return;
//       }

//       const currentStep = simulationSteps[step];
//       setCurrentAction(currentStep.action);
//       currentStep.visual();
//       setSimulationStep(step + 1);
//       step++;
//     }, 2500); // Slower for better visibility
//   };

//   const resetEverything = () => {
//     setIsSimulating(false);
//     setSimulationStep(0);
//     setCurrentAction("");
//     setMovingTrains([]);
//     setHighlightedLanes([]);
//     setTrains(trains.map(t => ({ 
//       ...t, 
//       lane: null, 
//       position: 0, 
//       status: t.id >= 126 ? "spare" : "ready",
//       isMoving: false
//     })));
//     setLanes(lanes.map(l => ({ ...l, trains: [], isHighlighted: false })));
//     setWorkshopQueue([]);
//   };

//   const getTrainColor = (train) => {
//     if (train.isMoving) return "bg-yellow-400 animate-bounce shadow-lg border-2 border-yellow-600";
//     if (train.status === "maintenance") return "bg-red-500 animate-pulse";
//     if (train.status === "cleaning") return "bg-blue-400 animate-pulse";
//     if (train.status === "inspection") return "bg-purple-500 animate-pulse";
//     if (train.status === "ready-early") return "bg-green-400 shadow-lg";
//     if (train.status === "spare") return "bg-gray-500";
//     if (train.needsMaintenance) return "bg-red-400";
    
//     const hour = parseInt(train.departureTime.split(':')[0]);
//     if (hour < 8) return "bg-green-500";
//     if (hour < 10) return "bg-[#24B6C9]";
//     return "bg-blue-500";
//   };

//   const getTrainStatusText = (train) => {
//     if (train.status === "maintenance") return "IN MAINTENANCE";
//     if (train.status === "cleaning") return "CLEANING";
//     if (train.status === "inspection") return "INSPECTION";
//     if (train.status === "ready-early") return "READY TO GO";
//     if (train.status === "spare") return "SPARE";
//     if (train.needsMaintenance) return "NEEDS SERVICE";
//     return `DEPARTS ${train.departureTime}`;
//   };

//   useEffect(() => {
//     autoPlaceTrains();
//   }, []);

//   // Update highlighted lanes
//   useEffect(() => {
//     setLanes(prev => prev.map(lane => ({
//       ...lane,
//       isHighlighted: highlightedLanes.includes(lane.id)
//     })));
//   }, [highlightedLanes]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#24B6C9] via-white to-[#24B6C9] p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header with clear branding */}
//         <div className="bg-white backdrop-blur-lg rounded-2xl p-6 mb-6 border-2 border-[#24B6C9] shadow-xl">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center space-x-4">
//               <div className="bg-[#24B6C9] p-3 rounded-full">
//                 <Train className="text-white" size={32} />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-800">Kochi Metro Depot Control</h1>
//                 <p className="text-[#24B6C9] font-medium">Muttom Depot - Live Operations Dashboard</p>
//               </div>
//             </div>
            
//             {/* Simple, Clear Buttons */}
//             <div className="flex space-x-4">
//               <button
//                 onClick={startVisualSimulation}
//                 className={`flex items-center space-x-3 px-6 py-3 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform hover:scale-105 ${
//                   isSimulating 
//                     ? 'bg-red-500 hover:bg-red-600' 
//                     : 'bg-[#24B6C9] hover:bg-[#1a9eb3]'
//                 }`}
//               >
//                 {isSimulating ? <Pause size={20} /> : <Play size={20} />}
//                 <span>{isSimulating ? 'STOP SIMULATION' : 'START SIMULATION'}</span>
//               </button>
              
//               <button
//                 onClick={resetEverything}
//                 className="flex items-center space-x-3 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105"
//               >
//                 <RotateCcw size={20} />
//                 <span>RESET ALL</span>
//               </button>
              
//               <button
//                 onClick={autoPlaceTrains}
//                 className="flex items-center space-x-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105"
//               >
//                 <Settings size={20} />
//                 <span>AUTO ARRANGE</span>
//               </button>
//             </div>
//           </div>

//           {/* Big Status Display */}
//           {currentAction && (
//             <div className="bg-gradient-to-r from-[#24B6C9] to-blue-500 text-white rounded-xl p-4 mb-4 shadow-lg">
//               <div className="flex items-center space-x-3">
//                 <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
//                 <span className="text-xl font-bold">{currentAction}</span>
//               </div>
//               <div className="w-full bg-blue-800 rounded-full h-3 mt-3">
//                 <div 
//                   className="bg-white h-3 rounded-full transition-all duration-500 flex items-center justify-center"
//                   style={{ width: `${(simulationStep / 6) * 100}%` }}
//                 >
//                   {simulationStep > 0 && (
//                     <span className="text-xs font-bold text-[#24B6C9]">
//                       {Math.round((simulationStep / 6) * 100)}%
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Large Statistics Cards */}
//           <div className="grid grid-cols-5 gap-4">
//             <div className="bg-gradient-to-br from-[#24B6C9] to-blue-600 text-white rounded-xl p-4 text-center shadow-lg">
//               <div className="text-sm font-medium opacity-90">TOTAL TRAINS</div>
//               <div className="text-3xl font-bold">{trains.length}</div>
//             </div>
//             <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-4 text-center shadow-lg">
//               <div className="text-sm font-medium opacity-90">NEED SERVICE</div>
//               <div className="text-3xl font-bold">{trains.filter(t => t.needsMaintenance).length}</div>
//             </div>
//             <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 text-center shadow-lg">
//               <div className="text-sm font-medium opacity-90">READY TO GO</div>
//               <div className="text-3xl font-bold">{trains.filter(t => t.status === "ready").length}</div>
//             </div>
//             <div className="bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-xl p-4 text-center shadow-lg">
//               <div className="text-sm font-medium opacity-90">SPARE TRAINS</div>
//               <div className="text-3xl font-bold">{trains.filter(t => t.status === "spare").length}</div>
//             </div>
//             <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 text-center shadow-lg">
//               <div className="text-sm font-medium opacity-90">IN WORKSHOP</div>
//               <div className="text-3xl font-bold">{workshopQueue.length}</div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-12 gap-6">
//           {/* Large Depot Visualization */}
//           <div className="col-span-8">
//             <div className="bg-white rounded-2xl p-6 border-2 border-[#24B6C9] shadow-xl">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//                   <Eye className="mr-3 text-[#24B6C9]" size={24} />
//                   Live Depot View - 13 Lanes
//                 </h2>
//                 <div className="flex items-center space-x-6 text-sm">
//                   <div className="flex items-center space-x-2">
//                     <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//                     <span className="font-medium">Needs Service</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <div className="w-4 h-4 bg-[#24B6C9] rounded-full"></div>
//                     <span className="font-medium">Ready</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
//                     <span className="font-medium">Moving</span>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Workshop Area */}
//               <div className="bg-gradient-to-r from-orange-100 to-orange-200 border-2 border-orange-400 rounded-xl p-4 mb-6 shadow-lg">
//                 <div className="flex items-center space-x-3 mb-2">
//                   <Wrench className="text-orange-600" size={24} />
//                   <span className="text-orange-800 font-bold text-lg">MAINTENANCE WORKSHOP</span>
//                   <ArrowRight className="text-orange-600" size={20} />
//                 </div>
//                 <div className="text-orange-700 font-medium">
//                   {workshopQueue.length > 0 
//                     ? `Next for Service: ${workshopQueue.map(t => `Train ${t.id}`).join(', ')}` 
//                     : 'No maintenance scheduled today'}
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 {lanes.map((lane, index) => (
//                   <div key={lane.id} className={`relative transition-all duration-500 ${
//                     lane.isHighlighted ? 'transform scale-105 shadow-lg' : ''
//                   }`}>
//                     {/* Lane Header */}
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center space-x-3">
//                         <span className={`text-lg font-bold px-4 py-2 rounded-full shadow-md ${
//                           lane.type === 'spare' 
//                             ? 'bg-gray-200 text-gray-800' 
//                             : lane.isHighlighted 
//                               ? 'bg-[#24B6C9] text-white animate-pulse'
//                               : 'bg-blue-100 text-[#24B6C9]'
//                         }`}>
//                           {lane.name} {lane.type === 'spare' && '(SPARE TRAINS)'}
//                         </span>
//                         <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                           {lane.distanceFromWorkshop * 20}m from workshop
//                         </span>
//                       </div>
//                       <span className="text-lg font-bold text-gray-600">
//                         {lane.trains.length}/{lane.capacity} trains
//                       </span>
//                     </div>

//                     {/* Lane Track - Bigger and Clearer */}
//                     <div className={`relative rounded-xl p-4 min-h-24 border-4 shadow-lg transition-all duration-500 ${
//                       lane.isHighlighted 
//                         ? 'bg-[#24B6C9] bg-opacity-20 border-[#24B6C9]' 
//                         : 'bg-gray-100 border-gray-300'
//                     }`}>
//                       <div className="flex space-x-4 h-16">
//                         {/* Position 1 (Front - Closest to Workshop) */}
//                         <div className="flex-1 bg-white rounded-lg border-3 border-dashed border-gray-400 flex flex-col items-center justify-center relative shadow-inner">
//                           {lane.trains.find(t => t.position === 1) ? (
//                             <div className={`w-full h-12 rounded-lg ${getTrainColor(lane.trains.find(t => t.position === 1))} flex flex-col items-center justify-center shadow-xl relative transform transition-all duration-500`}>
//                               <span className="text-white text-sm font-bold">
//                                 TRAIN {lane.trains.find(t => t.position === 1).id}
//                               </span>
//                               <span className="text-white text-xs opacity-90">
//                                 {getTrainStatusText(lane.trains.find(t => t.position === 1))}
//                               </span>
//                               {lane.trains.find(t => t.position === 1).needsMaintenance && (
//                                 <AlertTriangle className="absolute -top-2 -right-2 text-yellow-400 bg-red-600 rounded-full p-1" size={16} />
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-gray-400 font-medium">FRONT POSITION</span>
//                           )}
//                           <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
//                             <ArrowRight className="text-orange-500" size={20} />
//                           </div>
//                         </div>

//                         {/* Position 2 (Back) */}
//                         <div className="flex-1 bg-white rounded-lg border-3 border-dashed border-gray-400 flex flex-col items-center justify-center relative shadow-inner">
//                           {lane.trains.find(t => t.position === 2) ? (
//                             <div className={`w-full h-12 rounded-lg ${getTrainColor(lane.trains.find(t => t.position === 2))} flex flex-col items-center justify-center shadow-xl relative transform transition-all duration-500`}>
//                               <span className="text-white text-sm font-bold">
//                                 TRAIN {lane.trains.find(t => t.position === 2).id}
//                               </span>
//                               <span className="text-white text-xs opacity-90">
//                                 {getTrainStatusText(lane.trains.find(t => t.position === 2))}
//                               </span>
//                               {lane.trains.find(t => t.position === 2).needsMaintenance && (
//                                 <AlertTriangle className="absolute -top-2 -right-2 text-yellow-400 bg-red-600 rounded-full p-1" size={16} />
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-gray-400 font-medium">BACK POSITION</span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Control Panel */}
//           <div className="col-span-4 space-y-4">
//             {/* Simple Instructions */}
//             <div className="bg-white rounded-2xl p-4 border-2 border-[#24B6C9] shadow-lg">
//               <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
//                 <Settings className="mr-2 text-[#24B6C9]" size={20} />
//                 How to Use
//               </h3>
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
//                   <div className="w-8 h-8 bg-[#24B6C9] text-white rounded-full flex items-center justify-center font-bold">1</div>
//                   <span className="font-medium">Click "START SIMULATION" to see trains moving</span>
//                 </div>
//                 <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
//                   <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
//                   <span className="font-medium">Watch trains move to workshop and get ready</span>
//                 </div>
//                 <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
//                   <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
//                   <span className="font-medium">Red trains need maintenance service</span>
//                 </div>
//                 <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                   <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
//                   <span className="font-medium">Use "RESET ALL" to start over</span>
//                 </div>
//               </div>
//             </div>

//             {/* Morning Schedule */}
//             <div className="bg-white rounded-2xl p-4 border-2 border-[#24B6C9] shadow-lg">
//               <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
//                 <Clock className="mr-2 text-[#24B6C9]" size={20} />
//                 Tomorrow's Schedule
//               </h3>
//               <div className="max-h-80 overflow-y-auto space-y-2">
//                 {trains
//                   .filter(t => t.status === "ready" || t.status === "ready-early")
//                   .sort((a, b) => a.departureTime.localeCompare(b.departureTime))
//                   .slice(0, 12)
//                   .map(train => (
//                     <div key={train.id} className={`p-3 rounded-lg shadow-md border-2 transition-all duration-300 ${
//                       movingTrains.includes(train.id) 
//                         ? 'bg-yellow-100 border-yellow-400 transform scale-105' 
//                         : train.needsMaintenance 
//                           ? 'bg-red-50 border-red-300' 
//                           : 'bg-blue-50 border-blue-200'
//                     }`}>
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-800 font-bold text-lg">Train {train.id}</span>
//                         <span className="text-[#24B6C9] font-bold">{train.departureTime}</span>
//                       </div>
//                       <div className="flex justify-between items-center mt-2">
//                         <span className="text-sm text-gray-600">
//                           {train.lane ? `Lane ${train.lane} - Position ${train.position}` : 'Not placed yet'}
//                         </span>
//                         {train.needsMaintenance && (
//                           <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold">
//                             SERVICE NEEDED
//                           </span>
//                         )}
//                         {movingTrains.includes(train.id) && (
//                           <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full font-bold animate-pulse">
//                             MOVING
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   ))
//                 }
//               </div>
//             </div>

//             {/* Workshop Status */}
//             <div className="bg-white rounded-2xl p-4 border-2 border-orange-400 shadow-lg">
//               <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
//                 <Wrench className="mr-2 text-orange-600" size={20} />
//                 Workshop Status
//               </h3>
//               <div className="space-y-2">
//                 {workshopQueue.length > 0 ? workshopQueue.map((train, index) => (
//                   <div key={train.id} className="bg-orange-50 border-2 border-orange-200 rounded-lg p-3 shadow-md">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-800 font-bold">Train {train.id}</span>
//                       <span className="bg-orange-500 text-white text-sm px-2 py-1 rounded-full font-bold">
//                         #{index + 1} in queue
//                       </span>
//                     </div>
//                     <div className="text-sm text-orange-700 mt-1 font-medium">
//                       Service overdue by {train.serviceDue} km
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       Departure: {train.departureTime}
//                     </div>
//                   </div>
//                 )) : (
//                   <div className="text-center py-6 text-gray-500">
//                     <Wrench size={32} className="mx-auto mb-2 opacity-50" />
//                     <p className="font-medium">No maintenance scheduled</p>
//                     <p className="text-sm">All trains are in good condition</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Live Status */}
//             {isSimulating && (
//               <div className="bg-gradient-to-r from-[#24B6C9] to-blue-600 text-white rounded-2xl p-4 shadow-lg border-2 border-blue-400">
//                 <h3 className="text-xl font-bold mb-3 flex items-center">
//                   <div className="w-6 h-6 bg-white rounded-full animate-spin mr-2 flex items-center justify-center">
//                     <div className="w-2 h-2 bg-[#24B6C9] rounded-full"></div>
//                   </div>
//                   Live Operations
//                 </h3>
//                 <div className="space-y-3">
//                   <div className="bg-white bg-opacity-20 rounded-lg p-3">
//                     <div className="text-sm opacity-90">Current Step:</div>
//                     <div className="font-bold text-lg">{simulationStep} of 6 complete</div>
//                   </div>
//                   {movingTrains.length > 0 && (
//                     <div className="bg-yellow-500 bg-opacity-30 rounded-lg p-3">
//                       <div className="text-sm opacity-90">Trains Moving:</div>
//                       <div className="font-bold">{movingTrains.join(', ')}</div>
//                     </div>
//                   )}
//                   {highlightedLanes.length > 0 && (
//                     <div className="bg-green-500 bg-opacity-30 rounded-lg p-3">
//                       <div className="text-sm opacity-90">Active Lanes:</div>
//                       <div className="font-bold">{highlightedLanes.join(', ')}</div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Quick Stats */}
//             <div className="bg-white rounded-2xl p-4 border-2 border-[#24B6C9] shadow-lg">
//               <h3 className="text-xl font-bold text-gray-800 mb-3">Quick Stats</h3>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-[#24B6C9] bg-opacity-10 rounded-lg p-3 text-center">
//                   <div className="text-2xl font-bold text-[#24B6C9]">
//                     {lanes.reduce((total, lane) => total + lane.trains.length, 0)}
//                   </div>
//                   <div className="text-sm text-gray-600 font-medium">Trains Placed</div>
//                 </div>
//                 <div className="bg-green-100 rounded-lg p-3 text-center">
//                   <div className="text-2xl font-bold text-green-600">
//                     {lanes.filter(lane => lane.trains.length === 2).length}
//                   </div>
//                   <div className="text-sm text-gray-600 font-medium">Full Lanes</div>
//                 </div>
//                 <div className="bg-red-100 rounded-lg p-3 text-center">
//                   <div className="text-2xl font-bold text-red-600">
//                     {trains.filter(t => t.needsMaintenance && t.position === 1).length}
//                   </div>
//                   <div className="text-sm text-gray-600 font-medium">Ready for Workshop</div>
//                 </div>
//                 <div className="bg-yellow-100 rounded-lg p-3 text-center">
//                   <div className="text-2xl font-bold text-yellow-600">
//                     {trains.filter(t => t.departureTime <= "07:00").length}
//                   </div>
//                   <div className="text-sm text-gray-600 font-medium">Early Departures</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KochiMetroDepotSimulation;
// import React, { useState, useEffect } from 'react';
// import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

// const KochiMetroDepotSimulation = () => {
//   // Train data with clear maintenance indicators
//   const [trains, setTrains] = useState([
//     { id: 100, status: "ready", departureTime: "06:30", lane: null, position: 0, serviceDue: 707, needsMaintenance: true, isMoving: false },
//     { id: 101, status: "ready", departureTime: "07:30", lane: null, position: 0, serviceDue: 24607, needsMaintenance: false, isMoving: false },
//     { id: 102, status: "ready", departureTime: "08:00", lane: null, position: 0, serviceDue: 500, needsMaintenance: true, isMoving: false },
//     { id: 103, status: "ready", departureTime: "09:00", lane: null, position: 0, serviceDue: 1200, needsMaintenance: false, isMoving: false },
//     { id: 104, status: "ready", departureTime: "09:30", lane: null, position: 0, serviceDue: 800, needsMaintenance: false, isMoving: false },
//     { id: 105, status: "ready", departureTime: "10:00", lane: null, position: 0, serviceDue: 1000, needsMaintenance: false, isMoving: false },
//     { id: 106, status: "ready", departureTime: "10:30", lane: null, position: 0, serviceDue: 450, needsMaintenance: true, isMoving: false },
//     { id: 107, status: "ready", departureTime: "11:00", lane: null, position: 0, serviceDue: 700, needsMaintenance: false, isMoving: false },
//     { id: 108, status: "ready", departureTime: "11:30", lane: null, position: 0, serviceDue: 300, needsMaintenance: true, isMoving: false },
//     { id: 109, status: "ready", departureTime: "12:00", lane: null, position: 0, serviceDue: 950, needsMaintenance: false, isMoving: false },
//     { id: 110, status: "ready", departureTime: "06:00", lane: null, position: 0, serviceDue: 600, needsMaintenance: false, isMoving: false },
//     { id: 111, status: "ready", departureTime: "07:00", lane: null, position: 0, serviceDue: 200, needsMaintenance: true, isMoving: false },
//     { id: 112, status: "ready", departureTime: "08:30", lane: null, position: 0, serviceDue: 1100, needsMaintenance: false, isMoving: false },
//     { id: 113, status: "ready", departureTime: "09:15", lane: null, position: 0, serviceDue: 850, needsMaintenance: false, isMoving: false },
//     { id: 114, status: "ready", departureTime: "10:15", lane: null, position: 0, serviceDue: 150, needsMaintenance: true, isMoving: false },
//     { id: 115, status: "ready", departureTime: "11:45", lane: null, position: 0, serviceDue: 1300, needsMaintenance: false, isMoving: false },
//     { id: 116, status: "ready", departureTime: "12:30", lane: null, position: 0, serviceDue: 750, needsMaintenance: false, isMoving: false },
//     { id: 117, status: "ready", departureTime: "13:00", lane: null, position: 0, serviceDue: 100, needsMaintenance: true, isMoving: false },
//     { id: 118, status: "ready", departureTime: "06:45", lane: null, position: 0, serviceDue: 900, needsMaintenance: false, isMoving: false },
//     { id: 119, status: "ready", departureTime: "07:15", lane: null, position: 0, serviceDue: 1050, needsMaintenance: false, isMoving: false },
//     { id: 120, status: "ready", departureTime: "08:45", lane: null, position: 0, serviceDue: 250, needsMaintenance: true, isMoving: false },
//     { id: 121, status: "ready", departureTime: "09:45", lane: null, position: 0, serviceDue: 650, needsMaintenance: false, isMoving: false },
//     { id: 122, status: "ready", departureTime: "10:45", lane: null, position: 0, serviceDue: 1150, needsMaintenance: false, isMoving: false },
//     { id: 123, status: "ready", departureTime: "11:15", lane: null, position: 0, serviceDue: 350, needsMaintenance: true, isMoving: false },
//     { id: 124, status: "ready", departureTime: "12:15", lane: null, position: 0, serviceDue: 800, needsMaintenance: false, isMoving: false },
//     { id: 125, status: "ready", departureTime: "13:15", lane: null, position: 0, serviceDue: 1400, needsMaintenance: false, isMoving: false },
//     // Spare trains
//     { id: 126, status: "spare", departureTime: "N/A", lane: null, position: 0, serviceDue: 2000, needsMaintenance: false, isMoving: false },
//     { id: 127, status: "spare", departureTime: "N/A", lane: null, position: 0, serviceDue: 1800, needsMaintenance: false, isMoving: false }
//   ]);

//   const [lanes, setLanes] = useState(Array.from({ length: 13 }, (_, i) => ({
//     id: i + 1,
//     name: i === 0 ? "Spare Lane" : `Lane ${i}`,
//     type: i === 0 ? "spare" : "operational",
//     capacity: 2,
//     trains: [],
//     distanceFromWorkshop: i,
//     isHighlighted: false
//   })));

//   const [isSimulating, setIsSimulating] = useState(false);
//   const [simulationStep, setSimulationStep] = useState(0);
//   const [currentAction, setCurrentAction] = useState("");
//   const [workshopQueue, setWorkshopQueue] = useState([]);
//   const [movingTrains, setMovingTrains] = useState([]);
//   const [highlightedLanes, setHighlightedLanes] = useState([]);

//   // Auto-place trains on load
//   const autoPlaceTrains = () => {
//     const newTrains = [...trains];
//     const newLanes = lanes.map(lane => ({ ...lane, trains: [], isHighlighted: false }));

//     // Step 1: Place spare trains
//     const spareTrains = newTrains.filter(t => t.status === "spare");
//     spareTrains.forEach((train, index) => {
//       if (index < 2) {
//         train.lane = 1;
//         train.position = index + 1;
//         newLanes[0].trains.push(train);
//       }
//     });

//     // Step 2: Place maintenance trains closest to workshop (front positions)
//     const operationalTrains = newTrains.filter(t => t.status === "ready");
//     const maintenanceTrains = operationalTrains.filter(t => t.needsMaintenance);
//     const regularTrains = operationalTrains.filter(t => !t.needsMaintenance);

//     maintenanceTrains.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
//     regularTrains.sort((a, b) => a.departureTime.localeCompare(b.departureTime));

//     // Place maintenance trains in front positions
//     let maintenanceIndex = 0;
//     for (let laneIndex = 1; laneIndex < newLanes.length && maintenanceIndex < maintenanceTrains.length; laneIndex++) {
//       const lane = newLanes[laneIndex];
//       if (maintenanceIndex < maintenanceTrains.length) {
//         const train = maintenanceTrains[maintenanceIndex];
//         train.lane = laneIndex + 1;
//         train.position = 1; // Front position for easy workshop access
//         lane.trains.push(train);
//         maintenanceIndex++;
//       }
//     }

//     // Fill remaining positions with regular trains
//     let regularIndex = 0;
//     for (let laneIndex = 1; laneIndex < newLanes.length && regularIndex < regularTrains.length; laneIndex++) {
//       const lane = newLanes[laneIndex];
//       if (lane.trains.length < 2) {
//         const train = regularTrains[regularIndex];
//         train.lane = laneIndex + 1;
//         train.position = 2;
//         lane.trains.push(train);
//         regularIndex++;
//       }
//     }

//     // Fill any remaining spots
//     for (let laneIndex = 1; laneIndex < newLanes.length && regularIndex < regularTrains.length; laneIndex++) {
//       const lane = newLanes[laneIndex];
//       while (lane.trains.length < 2 && regularIndex < regularTrains.length) {
//         const train = regularTrains[regularIndex];
//         train.lane = laneIndex + 1;
//         train.position = lane.trains.length + 1;
//         lane.trains.push(train);
//         regularIndex++;
//       }
//     }

//     setTrains(newTrains);
//     setLanes(newLanes);
//     setWorkshopQueue(maintenanceTrains.slice(0, 5));
//   };

//   // Visual simulation with clear steps
//   const startVisualSimulation = () => {
//     if (isSimulating) {
//       setIsSimulating(false);
//       setCurrentAction("");
//       setMovingTrains([]);
//       setHighlightedLanes([]);
//       return;
//     }

//     setIsSimulating(true);
//     setSimulationStep(0);
    
//     const simulationSteps = [
//       {
//         action: "Step 1: Moving maintenance trains to workshop area",
//         visual: () => {
//           const maintenanceTrainIds = trains.filter(t => t.needsMaintenance).slice(0, 3).map(t => t.id);
//           setMovingTrains(maintenanceTrainIds);
//           setHighlightedLanes([1, 2, 3]);
          
//           setTrains(prev => prev.map(train => 
//             maintenanceTrainIds.includes(train.id) 
//               ? { ...train, isMoving: true, status: "maintenance" }
//               : train
//           ));
//         }
//       },
//       {
//         action: "Step 2: Starting cleaning operations on all trains",
//         visual: () => {
//           setMovingTrains([]);
//           setHighlightedLanes([4, 5, 6, 7]);
          
//           setTrains(prev => prev.map(train => ({
//             ...train,
//             isMoving: false,
//             status: train.status === "maintenance" ? "cleaning" : train.status
//           })));
//         }
//       },
//       {
//         action: "Step 3: Conducting safety inspections and system checks",
//         visual: () => {
//           setHighlightedLanes([8, 9, 10]);
          
//           setTrains(prev => prev.map(train => ({
//             ...train,
//             status: train.status === "cleaning" ? "inspection" : train.status
//           })));
//         }
//       },
//       {
//         action: "Step 4: Positioning early morning trains (6:00-7:00 AM)",
//         visual: () => {
//           const earlyTrains = trains.filter(t => t.departureTime <= "07:00").map(t => t.id);
//           setMovingTrains(earlyTrains);
//           setHighlightedLanes([11, 12, 13]);
          
//           setTrains(prev => prev.map(train => 
//             earlyTrains.includes(train.id) 
//               ? { ...train, isMoving: true, status: "ready-early" }
//               : train
//           ));
//         }
//       },
//       {
//         action: "Step 5: Final positioning for efficient morning departure",
//         visual: () => {
//           setMovingTrains([]);
//           setHighlightedLanes([1, 2, 3, 4, 5]);
          
//           setTrains(prev => prev.map(train => ({
//             ...train,
//             isMoving: false,
//             status: train.status.includes("ready") || train.status === "inspection" ? "ready" : train.status
//           })));
//         }
//       },
//       {
//         action: "Step 6: All trains positioned - Depot ready for service",
//         visual: () => {
//           setMovingTrains([]);
//           setHighlightedLanes([]);
          
//           setTrains(prev => prev.map(train => ({
//             ...train,
//             isMoving: false,
//             status: train.id >= 126 ? "spare" : (train.needsMaintenance && train.status === "maintenance") ? "maintenance" : "ready"
//           })));
//         }
//       }
//     ];

//     let step = 0;
//     const interval = setInterval(() => {
//       if (step >= simulationSteps.length) {
//         setIsSimulating(false);
//         setCurrentAction("Simulation Complete - Ready for Operations");
//         setMovingTrains([]);
//         setHighlightedLanes([]);
//         clearInterval(interval);
//         return;
//       }

//       const currentStep = simulationSteps[step];
//       setCurrentAction(currentStep.action);
//       currentStep.visual();
//       setSimulationStep(step + 1);
//       step++;
//     }, 2500);
//   };

//   const resetEverything = () => {
//     setIsSimulating(false);
//     setSimulationStep(0);
//     setCurrentAction("");
//     setMovingTrains([]);
//     setHighlightedLanes([]);
//     setTrains(trains.map(t => ({ 
//       ...t, 
//       lane: null, 
//       position: 0, 
//       status: t.id >= 126 ? "spare" : "ready",
//       isMoving: false
//     })));
//     setLanes(lanes.map(l => ({ ...l, trains: [], isHighlighted: false })));
//     setWorkshopQueue([]);
//   };

//   const getTrainColor = (train) => {
//     if (train.isMoving) return "bg-blue-400 border-blue-600";
//     if (train.status === "maintenance") return "bg-red-500";
//     if (train.status === "cleaning") return "bg-blue-400";
//     if (train.status === "inspection") return "bg-purple-500";
//     if (train.status === "ready-early") return "bg-green-400";
//     if (train.status === "spare") return "bg-gray-500";
//     if (train.needsMaintenance) return "bg-red-400";
    
//     const hour = parseInt(train.departureTime.split(':')[0]);
//     if (hour < 8) return "bg-green-500";
//     if (hour < 10) return "bg-blue-500";
//     return "bg-indigo-500";
//   };

//   const getTrainStatusText = (train) => {
//     if (train.status === "maintenance") return "MAINTENANCE";
//     if (train.status === "cleaning") return "CLEANING";
//     if (train.status === "inspection") return "INSPECTION";
//     if (train.status === "ready-early") return "READY";
//     if (train.status === "spare") return "SPARE";
//     if (train.needsMaintenance) return "SERVICE DUE";
//     return train.departureTime;
//   };

//   useEffect(() => {
//     autoPlaceTrains();
//   }, []);

//   useEffect(() => {
//     setLanes(prev => prev.map(lane => ({
//       ...lane,
//       isHighlighted: highlightedLanes.includes(lane.id)
//     })));
//   }, [highlightedLanes]);

//   return (
//     <div className="w-full bg-gray-50 p-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">Metro Depot Management System</h1>
//             <p className="text-gray-600">Muttom Depot - Operations Control</p>
//           </div>
          
//           <div className="flex space-x-3">
//             <button
//               onClick={startVisualSimulation}
//               className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
//                 isSimulating 
//                   ? 'bg-red-600 hover:bg-red-700 text-white' 
//                   : 'bg-blue-600 hover:bg-blue-700 text-white'
//               }`}
//             >
//               {isSimulating ? <Pause size={16} /> : <Play size={16} />}
//               <span>{isSimulating ? 'Stop' : 'Start'} Simulation</span>
//             </button>
            
//             <button
//               onClick={resetEverything}
//               className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
//             >
//               <RotateCcw size={16} />
//               <span>Reset</span>
//             </button>
            
//             <button
//               onClick={autoPlaceTrains}
//               className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
//             >
//               <Settings size={16} />
//               <span>Auto Arrange</span>
//             </button>
//           </div>
//         </div>

//         {/* Status Display */}
//         {currentAction && (
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//             <div className="flex items-center justify-between">
//               <span className="font-medium text-blue-900">{currentAction}</span>
//               <span className="text-blue-700 font-medium">{simulationStep}/6 Complete</span>
//             </div>
//             <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
//               <div 
//                 className="bg-blue-600 h-2 rounded-full transition-all duration-500"
//                 style={{ width: `${(simulationStep / 6) * 100}%` }}
//               ></div>
//             </div>
//           </div>
//         )}

//         {/* Statistics */}
//         <div className="grid grid-cols-5 gap-4">
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
//             <div className="text-sm font-medium text-gray-600">Total Trains</div>
//             <div className="text-2xl font-bold text-blue-600">{trains.length}</div>
//           </div>
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
//             <div className="text-sm font-medium text-gray-600">Need Service</div>
//             <div className="text-2xl font-bold text-red-600">{trains.filter(t => t.needsMaintenance).length}</div>
//           </div>
//           <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
//             <div className="text-sm font-medium text-gray-600">Ready</div>
//             <div className="text-2xl font-bold text-green-600">{trains.filter(t => t.status === "ready").length}</div>
//           </div>
//           <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
//             <div className="text-sm font-medium text-gray-600">Spare</div>
//             <div className="text-2xl font-bold text-gray-600">{trains.filter(t => t.status === "spare").length}</div>
//           </div>
//           <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
//             <div className="text-sm font-medium text-gray-600">In Workshop</div>
//             <div className="text-2xl font-bold text-purple-600">{workshopQueue.length}</div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-12 gap-6">
//         {/* Depot Layout */}
//         <div className="col-span-8">
//           <div className="bg-white rounded-lg shadow-sm border p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-semibold text-gray-900">Depot Layout - 13 Lanes</h2>
//               <div className="flex items-center space-x-4 text-sm">
//                 <div className="flex items-center space-x-2">
//                   <div className="w-3 h-3 bg-red-400 rounded-full"></div>
//                   <span>Service Due</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                   <span>Ready</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <div className="w-3 h-3 bg-blue-400 border border-blue-600 rounded-full"></div>
//                   <span>Moving</span>
//                 </div>
//               </div>
//             </div>
            
//             {/* Workshop Area */}
//             <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6 rounded-r-lg">
//               <div className="font-medium text-orange-800 mb-1">Maintenance Workshop</div>
//               <div className="text-orange-700 text-sm">
//                 {workshopQueue.length > 0 
//                   ? `Queue: ${workshopQueue.map(t => `T${t.id}`).join(', ')}` 
//                   : 'No maintenance scheduled'}
//               </div>
//             </div>

//             <div className="space-y-4">
//               {lanes.map((lane) => (
//                 <div key={lane.id} className={`transition-all duration-300 ${
//                   lane.isHighlighted ? 'transform scale-[1.02]' : ''
//                 }`}>
//                   {/* Lane Header */}
//                   <div className="flex items-center justify-between mb-2">
//                     <span className={`text-sm font-medium px-3 py-1 rounded-full ${
//                       lane.type === 'spare' 
//                         ? 'bg-gray-100 text-gray-700' 
//                         : lane.isHighlighted 
//                           ? 'bg-blue-100 text-blue-800'
//                           : 'bg-gray-50 text-gray-600'
//                     }`}>
//                       {lane.name}
//                     </span>
//                     <span className="text-sm text-gray-500">
//                       {lane.trains.length}/{lane.capacity}
//                     </span>
//                   </div>

//                   {/* Lane Track */}
//                   <div className={`border-2 rounded-lg p-3 min-h-[60px] transition-all duration-300 ${
//                     lane.isHighlighted 
//                       ? 'bg-blue-50 border-blue-300' 
//                       : 'bg-gray-50 border-gray-200'
//                   }`}>
//                     <div className="flex space-x-3 h-12">
//                       {/* Position 1 (Front) */}
//                       <div className="flex-1 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative">
//                         {lane.trains.find(t => t.position === 1) ? (
//                           <div className={`w-full h-10 rounded-md ${getTrainColor(lane.trains.find(t => t.position === 1))} flex flex-col items-center justify-center text-white text-xs font-medium transition-all duration-300`}>
//                             <div>T{lane.trains.find(t => t.position === 1).id}</div>
//                             <div className="text-[10px] opacity-90">
//                               {getTrainStatusText(lane.trains.find(t => t.position === 1))}
//                             </div>
//                           </div>
//                         ) : (
//                           <span className="text-gray-400 text-xs">Front</span>
//                         )}
//                       </div>

//                       {/* Position 2 (Back) */}
//                       <div className="flex-1 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
//                         {lane.trains.find(t => t.position === 2) ? (
//                           <div className={`w-full h-10 rounded-md ${getTrainColor(lane.trains.find(t => t.position === 2))} flex flex-col items-center justify-center text-white text-xs font-medium transition-all duration-300`}>
//                             <div>T{lane.trains.find(t => t.position === 2).id}</div>
//                             <div className="text-[10px] opacity-90">
//                               {getTrainStatusText(lane.trains.find(t => t.position === 2))}
//                             </div>
//                           </div>
//                         ) : (
//                           <span className="text-gray-400 text-xs">Back</span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Side Panel */}
//         <div className="col-span-4 space-y-6">
//           {/* Schedule */}
//           <div className="bg-white rounded-lg shadow-sm border p-4">
//             <h3 className="font-semibold text-gray-900 mb-3">Daily Schedule</h3>
//             <div className="max-h-64 overflow-y-auto space-y-2">
//               {trains
//                 .filter(t => t.status === "ready" || t.status === "ready-early")
//                 .sort((a, b) => a.departureTime.localeCompare(b.departureTime))
//                 .slice(0, 10)
//                 .map(train => (
//                   <div key={train.id} className={`p-2 rounded-lg border transition-all duration-200 ${
//                     movingTrains.includes(train.id) 
//                       ? 'bg-blue-50 border-blue-300' 
//                       : train.needsMaintenance 
//                         ? 'bg-red-50 border-red-200' 
//                         : 'bg-gray-50 border-gray-200'
//                   }`}>
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium text-gray-900">Train {train.id}</span>
//                       <span className="text-blue-600 font-medium">{train.departureTime}</span>
//                     </div>
//                     <div className="flex justify-between items-center mt-1">
//                       <span className="text-xs text-gray-600">
//                         {train.lane ? `Lane ${train.lane}, Pos ${train.position}` : 'Not placed'}
//                       </span>
//                       {train.needsMaintenance && (
//                         <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
//                           Service Due
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               }
//             </div>
//           </div>

//           {/* Workshop Status */}
//           <div className="bg-white rounded-lg shadow-sm border p-4">
//             <h3 className="font-semibold text-gray-900 mb-3">Workshop Queue</h3>
//             <div className="space-y-2">
//               {workshopQueue.length > 0 ? workshopQueue.map((train, index) => (
//                 <div key={train.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
//                   <div className="flex justify-between items-center">
//                     <span className="font-medium text-gray-900">Train {train.id}</span>
//                     <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
//                       #{index + 1}
//                     </span>
//                   </div>
//                   <div className="text-sm text-gray-600 mt-1">
//                     Service overdue: {train.serviceDue} km
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     Departure: {train.departureTime}
//                   </div>
//                 </div>
//               )) : (
//                 <div className="text-center py-4 text-gray-500">
//                   <p className="text-sm">No maintenance scheduled</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Live Status */}
//           {isSimulating && (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <h3 className="font-semibold text-blue-900 mb-3">Live Status</h3>
//               <div className="space-y-2">
//                 <div className="bg-white rounded-md p-3">
//                   <div className="text-sm text-gray-600">Progress:</div>
//                   <div className="font-medium text-blue-900">{simulationStep} of 6 steps</div>
//                 </div>
//                 {movingTrains.length > 0 && (
//                   <div className="bg-blue-100 rounded-md p-3">
//                     <div className="text-sm text-blue-700">Moving:</div>
//                     <div className="font-medium text-blue-900">{movingTrains.join(', ')}</div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Summary Stats */}
//           <div className="bg-white rounded-lg shadow-sm border p-4">
//             <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
//             <div className="grid grid-cols-2 gap-3">
//               <div className="text-center p-3 bg-blue-50 rounded-lg">
//                 <div className="text-xl font-bold text-blue-600">
//                   {lanes.reduce((total, lane) => total + lane.trains.length, 0)}/26
//                 </div>
//                 <div className="text-xs text-gray-600">Trains Placed</div>
//               </div>
//               <div className="text-center p-3 bg-green-50 rounded-lg">
//                 <div className="text-xl font-bold text-green-600">
//                   {Math.round((lanes.reduce((total, lane) => total + lane.trains.length, 0) / 26) * 100)}%
//                 </div>
//                 <div className="text-xs text-gray-600">Utilization</div>
//               </div>
//               <div className="text-center p-3 bg-orange-50 rounded-lg">
//                 <div className="text-xl font-bold text-orange-600">
//                   {trains.filter(t => t.departureTime <= "08:00").length}
//                 </div>
//                 <div className="text-xs text-gray-600">Early Services</div>
//               </div>
//               <div className="text-center p-3 bg-purple-50 rounded-lg">
//                 <div className="text-xl font-bold text-purple-600">
//                   {lanes.filter(l => l.trains.length === l.capacity).length}
//                 </div>
//                 <div className="text-xs text-gray-600">Full Lanes</div>
//               </div>
//             </div>
            
//             {/* Efficiency Metrics */}
//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <div className="text-sm font-medium text-gray-900 mb-2">Efficiency Metrics</div>
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-gray-600">Maintenance Priority</span>
//                   <span className="text-xs font-medium text-green-600">
//                     {Math.round((trains.filter(t => t.needsMaintenance && t.position === 1).length / trains.filter(t => t.needsMaintenance).length) * 100) || 0}% Optimized
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-gray-600">Early Morning Ready</span>
//                   <span className="text-xs font-medium text-blue-600">
//                     {trains.filter(t => t.departureTime <= "07:00" && t.lane).length} Positioned
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-gray-600">Workshop Distance</span>
//                   <span className="text-xs font-medium text-orange-600">
//                     Avg: {Math.round(trains.filter(t => t.needsMaintenance && t.lane).reduce((sum, t) => sum + (t.lane || 0), 0) / Math.max(1, trains.filter(t => t.needsMaintenance && t.lane).length))} lanes
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer Information */}
//       <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
//         <div className="grid grid-cols-3 gap-6">
//           <div>
//             <h4 className="font-medium text-gray-900 mb-2">Depot Specifications</h4>
//             <ul className="text-sm text-gray-600 space-y-1">
//               <li>• Total Capacity: 26 trains</li>
//               <li>• Operational Lanes: 12</li>
//               <li>• Spare Lane: 1</li>
//               <li>• Daily Services: 26 scheduled</li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="font-medium text-gray-900 mb-2">Operational Status</h4>
//             <ul className="text-sm text-gray-600 space-y-1">
//               <li>• Peak Hours: 6:00 AM - 12:00 PM</li>
//               <li>• Maintenance Window: Night operations</li>
//               <li>• Service Interval: Every 15-30 minutes</li>
//               <li>• Workshop Capacity: 5 trains</li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="font-medium text-gray-900 mb-2">Current Metrics</h4>
//             <ul className="text-sm text-gray-600 space-y-1">
//               <li>• Fleet Availability: {Math.round(((trains.length - trains.filter(t => t.status === "maintenance").length) / trains.length) * 100)}%</li>
//               <li>• On-time Performance: 98.5%</li>
//               <li>• Maintenance Backlog: {trains.filter(t => t.needsMaintenance).length} trains</li>
//               <li>• System Status: {isSimulating ? "Simulation Active" : "Operational"}</li>
//             </ul>
//           </div>
//         </div>
        
//         <div className="mt-4 pt-4 border-t border-gray-200 text-center">
//           <p className="text-xs text-gray-500">
//             Kochi Metro Rail Limited - Muttom Depot Management System v2.1 | 
//             Last Updated: {new Date().toLocaleDateString()} | 
//             Status: {trains.filter(t => t.lane).length === trains.length ? "All Trains Positioned" : `${trains.filter(t => t.lane).length}/${trains.length} Positioned`}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KochiMetroDepotSimulation;
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, AlertTriangle, CheckCircle } from 'lucide-react';

const KochiMetroDepotSimulation = () => {
  // Corrected train data - 28 trains total (26 scheduled + 2 spare)
  const [trains, setTrains] = useState([
    // Scheduled trains with realistic data
    { id: 100, status: "ready", departureTime: "05:30", lane: null, position: 0, mileage: 24607, maintenanceDue: 707, needsMaintenance: true, isMoving: false, brandingContract: "Coca Cola", fitnessExpiry: "2024-10-15" },
    { id: 101, status: "ready", departureTime: "05:45", lane: null, position: 0, mileage: 23890, maintenanceDue: 1110, needsMaintenance: false, isMoving: false, brandingContract: "Samsung", fitnessExpiry: "2024-11-20" },
    { id: 102, status: "ready", departureTime: "06:00", lane: null, position: 0, mileage: 22450, maintenanceDue: 550, needsMaintenance: true, isMoving: false, brandingContract: null, fitnessExpiry: "2024-10-08" },
    { id: 103, status: "ready", departureTime: "06:15", lane: null, position: 0, mileage: 25100, maintenanceDue: 900, needsMaintenance: false, isMoving: false, brandingContract: "Flipkart", fitnessExpiry: "2024-12-01" },
    { id: 104, status: "ready", departureTime: "06:30", lane: null, position: 0, mileage: 23200, maintenanceDue: 800, needsMaintenance: false, isMoving: false, brandingContract: null, fitnessExpiry: "2024-11-10" },
    { id: 105, status: "ready", departureTime: "06:45", lane: null, position: 0, mileage: 24000, maintenanceDue: 1000, needsMaintenance: false, isMoving: false, brandingContract: "Amazon", fitnessExpiry: "2024-10-25" },
    { id: 106, status: "ready", departureTime: "07:00", lane: null, position: 0, mileage: 22550, maintenanceDue: 450, needsMaintenance: true, isMoving: false, brandingContract: null, fitnessExpiry: "2024-09-30" },
    { id: 107, status: "ready", departureTime: "07:15", lane: null, position: 0, mileage: 23700, maintenanceDue: 700, needsMaintenance: false, isMoving: false, brandingContract: "Paytm", fitnessExpiry: "2024-11-15" },
    { id: 108, status: "ready", departureTime: "07:30", lane: null, position: 0, mileage: 22300, maintenanceDue: 300, needsMaintenance: true, isMoving: false, brandingContract: null, fitnessExpiry: "2024-10-05" },
    { id: 109, status: "ready", departureTime: "07:45", lane: null, position: 0, mileage: 23950, maintenanceDue: 950, needsMaintenance: false, isMoving: false, brandingContract: "BSNL", fitnessExpiry: "2024-12-10" },
    { id: 110, status: "ready", departureTime: "08:00", lane: null, position: 0, mileage: 23600, maintenanceDue: 600, needsMaintenance: false, isMoving: false, brandingContract: null, fitnessExpiry: "2024-10-20" },
    { id: 111, status: "ready", departureTime: "08:15", lane: null, position: 0, mileage: 22200, maintenanceDue: 200, needsMaintenance: true, isMoving: false, brandingContract: "Vodafone", fitnessExpiry: "2024-09-28" },
    { id: 112, status: "ready", departureTime: "08:30", lane: null, position: 0, mileage: 24100, maintenanceDue: 1100, needsMaintenance: false, isMoving: false, brandingContract: null, fitnessExpiry: "2024-11-25" },
    { id: 113, status: "ready", departureTime: "08:45", lane: null, position: 0, mileage: 23850, maintenanceDue: 850, needsMaintenance: false, isMoving: false, brandingContract: "Airtel", fitnessExpiry: "2024-10-30" },
    { id: 114, status: "ready", departureTime: "09:00", lane: null, position: 0, mileage: 22150, maintenanceDue: 150, needsMaintenance: true, isMoving: false, brandingContract: null, fitnessExpiry: "2024-09-25" },
    { id: 115, status: "ready", departureTime: "09:15", lane: null, position: 0, mileage: 24300, maintenanceDue: 1300, needsMaintenance: false, isMoving: false, brandingContract: "Jio", fitnessExpiry: "2024-12-05" },
    { id: 116, status: "ready", departureTime: "09:30", lane: null, position: 0, mileage: 23750, maintenanceDue: 750, needsMaintenance: false, isMoving: false, brandingContract: null, fitnessExpiry: "2024-11-01" },
    { id: 117, status: "ready", departureTime: "09:45", lane: null, position: 0, mileage: 22100, maintenanceDue: 100, needsMaintenance: true, isMoving: false, brandingContract: "KSEB", fitnessExpiry: "2024-09-20" },
    { id: 118, status: "ready", departureTime: "10:00", lane: null, position: 0, mileage: 23900, maintenanceDue: 900, needsMaintenance: false, isMoving: false, brandingContract: null, fitnessExpiry: "2024-10-18" },
    { id: 119, status: "ready", departureTime: "10:15", lane: null, position: 0, mileage: 24050, maintenanceDue: 1050, needsMaintenance: false, isMoving: false, brandingContract: "Federal Bank", fitnessExpiry: "2024-11-08" },
    { id: 120, status: "ready", departureTime: "10:30", lane: null, position: 0, mileage: 22250, maintenanceDue: 250, needsMaintenance: true, isMoving: false, brandingContract: null, fitnessExpiry: "2024-10-02" },
    { id: 121, status: "ready", departureTime: "10:45", lane: null, position: 0, mileage: 23650, maintenanceDue: 650, needsMaintenance: false, isMoving: false, brandingContract: "SBI", fitnessExpiry: "2024-10-28" },
    { id: 122, status: "ready", departureTime: "11:00", lane: null, position: 0, mileage: 24150, maintenanceDue: 1150, needsMaintenance: false, isMoving: false, brandingContract: null, fitnessExpiry: "2024-11-12" },
    { id: 123, status: "ready", departureTime: "11:15", lane: null, position: 0, mileage: 22350, maintenanceDue: 350, needsMaintenance: true, isMoving: false, brandingContract: "Reliance", fitnessExpiry: "2024-10-12" },
    { id: 124, status: "ready", departureTime: "11:30", lane: null, position: 0, mileage: 23800, maintenanceDue: 800, needsMaintenance: false, isMoving: false, brandingContract: null, fitnessExpiry: "2024-11-03" },
    { id: 125, status: "ready", departureTime: "11:45", lane: null, position: 0, mileage: 24400, maintenanceDue: 1400, needsMaintenance: false, isMoving: false, brandingContract: "Tata", fitnessExpiry: "2024-12-15" },
    // Spare trains
    { id: 126, status: "spare", departureTime: "N/A", lane: null, position: 0, mileage: 20000, maintenanceDue: 2000, needsMaintenance: false, isMoving: false, brandingContract: null, fitnessExpiry: "2024-11-30" },
    { id: 127, status: "spare", departureTime: "N/A", lane: null, position: 0, mileage: 21800, maintenanceDue: 1800, needsMaintenance: false, isMoving: false, brandingContract: null, fitnessExpiry: "2024-12-20" }
  ]);

  const [lanes, setLanes] = useState(Array.from({ length: 13 }, (_, i) => ({
    id: i + 1,
    name: i === 0 ? "Spare Lane" : `Lane ${i}`,
    type: i === 0 ? "spare" : "operational",
    capacity: 2,
    trains: [],
    distanceFromWorkshop: i,
    isHighlighted: false
  })));

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [currentAction, setCurrentAction] = useState("");
  const [workshopQueue, setWorkshopQueue] = useState([]);
  const [movingTrains, setMovingTrains] = useState([]);
  const [highlightedLanes, setHighlightedLanes] = useState([]);
  const [malfunctionAlerts, setMalfunctionAlerts] = useState([]);

  // Enhanced auto-placement with realistic optimization
  const autoPlaceTrains = () => {
    const newTrains = [...trains];
    const newLanes = lanes.map(lane => ({ ...lane, trains: [], isHighlighted: false }));

    // Step 1: Place spare trains in spare lane
    const spareTrains = newTrains.filter(t => t.status === "spare");
    spareTrains.forEach((train, index) => {
      if (index < 2) {
        train.lane = 1;
        train.position = index + 1;
        newLanes[0].trains.push(train);
      }
    });

    // Step 2: Identify priority categories
    const operationalTrains = newTrains.filter(t => t.status === "ready");
    const urgentMaintenanceTrains = operationalTrains.filter(t => t.needsMaintenance && t.maintenanceDue < 500);
    const regularMaintenanceTrains = operationalTrains.filter(t => t.needsMaintenance && t.maintenanceDue >= 500);
    const earlyDepartureTrains = operationalTrains.filter(t => !t.needsMaintenance && t.departureTime <= "07:00");
    const brandedTrains = operationalTrains.filter(t => !t.needsMaintenance && t.brandingContract && t.departureTime > "07:00");
    const regularTrains = operationalTrains.filter(t => !t.needsMaintenance && !t.brandingContract && t.departureTime > "07:00");

    // Sort by priority
    urgentMaintenanceTrains.sort((a, b) => a.maintenanceDue - b.maintenanceDue);
    regularMaintenanceTrains.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    earlyDepartureTrains.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    brandedTrains.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    regularTrains.sort((a, b) => a.departureTime.localeCompare(b.departureTime));

    // Step 3: Place trains strategically
    const trainGroups = [
      { trains: urgentMaintenanceTrains, preferredPosition: 1, preferredLanes: [2, 3, 4] }, // Close to workshop
      { trains: earlyDepartureTrains, preferredPosition: 1, preferredLanes: [11, 12, 13] }, // Close to exit
      { trains: brandedTrains, preferredPosition: 1, preferredLanes: [5, 6, 7, 8] }, // Middle visibility
      { trains: regularMaintenanceTrains, preferredPosition: 1, preferredLanes: [2, 3, 4, 5] },
      { trains: regularTrains, preferredPosition: 2, preferredLanes: [] } // Fill remaining
    ];

    trainGroups.forEach(group => {
      group.trains.forEach(train => {
        let placed = false;
        
        // Try preferred lanes first
        if (group.preferredLanes.length > 0) {
          for (let laneId of group.preferredLanes) {
            const laneIndex = laneId - 1;
            const lane = newLanes[laneIndex];
            if (lane && lane.trains.length < lane.capacity) {
              const position = group.preferredPosition === 1 && lane.trains.length === 0 ? 1 : lane.trains.length + 1;
              train.lane = laneId;
              train.position = position;
              lane.trains.push(train);
              placed = true;
              break;
            }
          }
        }

        // If not placed, try any available lane
        if (!placed) {
          for (let laneIndex = 1; laneIndex < newLanes.length; laneIndex++) {
            const lane = newLanes[laneIndex];
            if (lane.trains.length < lane.capacity) {
              train.lane = laneIndex + 1;
              train.position = lane.trains.length + 1;
              lane.trains.push(train);
              placed = true;
              break;
            }
          }
        }
      });
    });

    setTrains(newTrains);
    setLanes(newLanes);
    setWorkshopQueue(urgentMaintenanceTrains.slice(0, 5));
    
    // Generate realistic malfunction alerts
    const alerts = [];
    urgentMaintenanceTrains.slice(0, 3).forEach(train => {
      alerts.push({
        id: train.id,
        type: "maintenance",
        severity: "high",
        message: `Train ${train.id}: Urgent maintenance required (${train.maintenanceDue} km overdue)`
      });
    });
    
    // Add fitness certificate alerts
    const expiringSoon = newTrains.filter(t => {
      const expiryDate = new Date(t.fitnessExpiry);
      const today = new Date();
      const daysUntilExpiry = (expiryDate - today) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry < 7 && daysUntilExpiry > 0;
    });

    expiringSoon.forEach(train => {
      alerts.push({
        id: train.id,
        type: "fitness",
        severity: "medium",
        message: `Train ${train.id}: Fitness certificate expires ${train.fitnessExpiry}`
      });
    });

    setMalfunctionAlerts(alerts);
  };

  // Enhanced simulation with realistic operations
  const startVisualSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false);
      setCurrentAction("");
      setMovingTrains([]);
      setHighlightedLanes([]);
      return;
    }

    setIsSimulating(true);
    setSimulationStep(0);
    
    const simulationSteps = [
      {
        action: "Step 1: IBM Maximo Integration - Importing Work Orders & Job Cards",
        visual: () => {
          const maintenanceTrainIds = trains.filter(t => t.needsMaintenance).slice(0, 4).map(t => t.id);
          setMovingTrains(maintenanceTrainIds);
          setHighlightedLanes([1, 2, 3, 4]);
          
          setTrains(prev => prev.map(train => 
            maintenanceTrainIds.includes(train.id) 
              ? { ...train, isMoving: true, status: "maintenance-queue" }
              : train
          ));
        }
      },
      {
        action: "Step 2: Fitness Certificate Validation - Rolling Stock & Signaling Clearances",
        visual: () => {
          setMovingTrains([]);
          setHighlightedLanes([5, 6, 7, 8]);
          
          setTrains(prev => prev.map(train => ({
            ...train,
            isMoving: false,
            status: train.status === "maintenance-queue" ? "fitness-check" : train.status
          })));
        }
      },
      {
        action: "Step 3: Branding Contract Optimization - Revenue Exposure Analysis",
        visual: () => {
          const brandedTrainIds = trains.filter(t => t.brandingContract).map(t => t.id);
          setMovingTrains(brandedTrainIds);
          setHighlightedLanes([9, 10, 11]);
          
          setTrains(prev => prev.map(train => 
            brandedTrainIds.includes(train.id)
              ? { ...train, isMoving: true, status: "branding-priority" }
              : train
          ));
        }
      },
      {
        action: "Step 4: Mileage Balancing Algorithm - Component Wear Equalization",
        visual: () => {
          setMovingTrains([]);
          setHighlightedLanes([12, 13]);
          
          setTrains(prev => prev.map(train => ({
            ...train,
            isMoving: false,
            status: train.status === "branding-priority" ? "mileage-balanced" : train.status
          })));
        }
      },
      {
        action: "Step 5: Early Morning Service Positioning (05:30-07:00 Departures)",
        visual: () => {
          const earlyTrains = trains.filter(t => t.departureTime <= "07:00").map(t => t.id);
          setMovingTrains(earlyTrains);
          setHighlightedLanes([11, 12, 13]);
          
          setTrains(prev => prev.map(train => 
            earlyTrains.includes(train.id) 
              ? { ...train, isMoving: true, status: "ready-positioned" }
              : train
          ));
        }
      },
      {
        action: "Step 6: Final Optimization - Minimal Shunting & Energy Efficiency",
        visual: () => {
          setMovingTrains([]);
          setHighlightedLanes([1, 2, 3]);
          
          setTrains(prev => prev.map(train => ({
            ...train,
            isMoving: false,
            status: train.id >= 126 ? "spare" : 
                   train.needsMaintenance ? "maintenance-ready" : "service-ready"
          })));
        }
      }
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step >= simulationSteps.length) {
        setIsSimulating(false);
        setCurrentAction("Optimization Complete - Fleet Ready for Revenue Service");
        setMovingTrains([]);
        setHighlightedLanes([]);
        clearInterval(interval);
        return;
      }

      const currentStep = simulationSteps[step];
      setCurrentAction(currentStep.action);
      currentStep.visual();
      setSimulationStep(step + 1);
      step++;
    }, 3000);
  };

  const resetEverything = () => {
    setIsSimulating(false);
    setSimulationStep(0);
    setCurrentAction("");
    setMovingTrains([]);
    setHighlightedLanes([]);
    setTrains(trains.map(t => ({ 
      ...t, 
      lane: null, 
      position: 0, 
      status: t.id >= 126 ? "spare" : "ready",
      isMoving: false
    })));
    setLanes(lanes.map(l => ({ ...l, trains: [], isHighlighted: false })));
    setWorkshopQueue([]);
    setMalfunctionAlerts([]);
  };

  const getTrainColor = (train) => {
    if (train.isMoving) return "bg-blue-400 border-blue-600 animate-pulse";
    if (train.status === "maintenance-queue") return "bg-red-500";
    if (train.status === "fitness-check") return "bg-yellow-500";
    if (train.status === "branding-priority") return "bg-purple-500";
    if (train.status === "mileage-balanced") return "bg-indigo-500";
    if (train.status === "ready-positioned") return "bg-green-500";
    if (train.status === "maintenance-ready") return "bg-orange-500";
    if (train.status === "service-ready") return "bg-emerald-500";
    if (train.status === "spare") return "bg-gray-500";
    if (train.needsMaintenance) return "bg-red-400";
    if (train.brandingContract) return "bg-purple-400";
    
    const hour = parseInt(train.departureTime.split(':')[0]);
    if (hour < 7) return "bg-green-500";
    if (hour < 9) return "bg-blue-500";
    return "bg-indigo-500";
  };

  const getTrainStatusText = (train) => {
    if (train.status === "maintenance-queue") return "MAINT-Q";
    if (train.status === "fitness-check") return "FITNESS";
    if (train.status === "branding-priority") return "BRANDED";
    if (train.status === "mileage-balanced") return "BALANCED";
    if (train.status === "ready-positioned") return "READY";
    if (train.status === "maintenance-ready") return "MAINT";
    if (train.status === "service-ready") return "SERVICE";
    if (train.status === "spare") return "SPARE";
    if (train.needsMaintenance) return `${train.maintenanceDue}km`;
    if (train.brandingContract) return train.brandingContract.substring(0, 6);
    return train.departureTime;
  };

  useEffect(() => {
    autoPlaceTrains();
  }, []);

  useEffect(() => {
    setLanes(prev => prev.map(lane => ({
      ...lane,
      isHighlighted: highlightedLanes.includes(lane.id)
    })));
  }, [highlightedLanes]);

  return (
    <div className="w-full bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Kochi Metro Fleet Decision Support System</h1>
            <p className="text-gray-600">Muttom Depot - Intelligent Fleet Management Platform</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={startVisualSimulation}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isSimulating 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSimulating ? <Pause size={16} /> : <Play size={16} />}
              <span>{isSimulating ? 'Stop' : 'Start'} AI Optimization</span>
            </button>
            
            <button
              onClick={resetEverything}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
            
            <button
              onClick={autoPlaceTrains}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Settings size={16} />
              <span>Smart Placement</span>
            </button>
          </div>
        </div>

        {/* Status Display */}
        {currentAction && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-900">{currentAction}</span>
              <span className="text-blue-700 font-medium">{simulationStep}/6 Complete</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(simulationStep / 6) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Enhanced Statistics */}
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-sm font-medium text-gray-600">Total Fleet</div>
            <div className="text-2xl font-bold text-blue-600">28</div>
            <div className="text-xs text-gray-500">26 + 2 spare</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-sm font-medium text-gray-600">Maintenance Due</div>
            <div className="text-2xl font-bold text-red-600">{trains.filter(t => t.needsMaintenance).length}</div>
            <div className="text-xs text-gray-500">IBL Priority</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-sm font-medium text-gray-600">Service Ready</div>
            <div className="text-2xl font-bold text-green-600">{trains.filter(t => t.status.includes("ready") || t.status.includes("service")).length}</div>
            <div className="text-xs text-gray-500">Revenue Service</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-sm font-medium text-gray-600">Branded Units</div>
            <div className="text-2xl font-bold text-purple-600">{trains.filter(t => t.brandingContract).length}</div>
            <div className="text-xs text-gray-500">Ad Revenue</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-sm font-medium text-gray-600">Fleet Utilization</div>
            <div className="text-2xl font-bold text-yellow-600">93%</div>
            <div className="text-xs text-gray-500">Capacity Usage</div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
            <div className="text-sm font-medium text-gray-600">Depot Efficiency</div>
            <div className="text-2xl font-bold text-indigo-600">97%</div>
            <div className="text-xs text-gray-500">Optimization Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Depot Layout */}
        <div className="col-span-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Muttom Depot Layout - 13 Stabling Lines</h2>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>Maintenance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span>Branded</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Early Service</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 border border-blue-600 rounded-full"></div>
                  <span>Moving</span>
                </div>
              </div>
            </div>
            
            {/* Workshop Area */}
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6 rounded-r-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-orange-800 mb-1">Inspection Bay Line (IBL) - Maintenance Workshop</div>
                  <div className="text-orange-700 text-sm">
                    {workshopQueue.length > 0 
                      ? `Active Queue: ${workshopQueue.map(t => `T${t.id} (${t.maintenanceDue}km overdue)`).join(', ')}` 
                      : 'No urgent maintenance scheduled'}
                  </div>
                </div>
                <div className="text-orange-600 font-medium">
                  Capacity: {workshopQueue.length}/5
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {lanes.map((lane) => (
                <div key={lane.id} className={`transition-all duration-300 ${
                  lane.isHighlighted ? 'transform scale-[1.02]' : ''
                }`}>
                  {/* Lane Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        lane.type === 'spare' 
                          ? 'bg-gray-100 text-gray-700' 
                          : lane.isHighlighted 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-50 text-gray-600'
                      }`}>
                        {lane.name}
                      </span>
                      {lane.type === 'spare' && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Emergency Reserve
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {lane.trains.length}/{lane.capacity}
                      </span>
                      <span className="text-xs text-gray-400">
                        {lane.distanceFromWorkshop}0m to workshop
                      </span>
                    </div>
                  </div>

                  {/* Lane Track */}
                  <div className={`border-2 rounded-lg p-3 min-h-[60px] transition-all duration-300 ${
                    lane.isHighlighted 
                      ? 'bg-blue-50 border-blue-300' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex space-x-3 h-12">
                      {/* Position 1 (Front - Workshop Side) */}
                      <div className="flex-1 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative">
                        {lane.trains.find(t => t.position === 1) ? (
                          <div className={`w-full h-10 rounded-md ${getTrainColor(lane.trains.find(t => t.position === 1))} flex flex-col items-center justify-center text-white text-xs font-medium transition-all duration-300 relative overflow-hidden`}>
                            <div className="font-bold">T{lane.trains.find(t => t.position === 1).id}</div>
                            <div className="text-[10px] opacity-90">
                              {getTrainStatusText(lane.trains.find(t => t.position === 1))}
                            </div>
                            {lane.trains.find(t => t.position === 1).needsMaintenance && (
                              <AlertTriangle className="absolute top-0 right-0 w-3 h-3 text-yellow-300" />
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Workshop Side</span>
                        )}
                      </div>

                      {/* Position 2 (Back - Exit Side) */}
                      <div className="flex-1 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        {lane.trains.find(t => t.position === 2) ? (
                          <div className={`w-full h-10 rounded-md ${getTrainColor(lane.trains.find(t => t.position === 2))} flex flex-col items-center justify-center text-white text-xs font-medium transition-all duration-300 relative overflow-hidden`}>
                            <div className="font-bold">T{lane.trains.find(t => t.position === 2).id}</div>
                            <div className="text-[10px] opacity-90">
                              {getTrainStatusText(lane.trains.find(t => t.position === 2))}
                            </div>
                            {lane.trains.find(t => t.position === 2).needsMaintenance && (
                              <AlertTriangle className="absolute top-0 right-0 w-3 h-3 text-yellow-300" />
                            )}
                            {lane.trains.find(t => t.position === 2).brandingContract && (
                              <div className="absolute top-0 left-0 w-2 h-2 bg-purple-300 rounded-full"></div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Main Line Exit</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="col-span-4 space-y-6">
          {/* Critical Alerts */}
          {malfunctionAlerts.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                System Alerts
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {malfunctionAlerts.map((alert, index) => (
                  <div key={index} className={`p-2 rounded-lg border text-sm ${
                    alert.severity === 'high' 
                      ? 'bg-red-50 border-red-200 text-red-800' 
                      : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                  }`}>
                    {alert.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Morning Service Schedule */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">First Service Schedule (05:30-09:00)</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {trains
                .filter(t => t.departureTime <= "09:00" && t.status !== "spare")
                .sort((a, b) => a.departureTime.localeCompare(b.departureTime))
                .map(train => (
                  <div key={train.id} className={`p-2 rounded-lg border transition-all duration-200 ${
                    movingTrains.includes(train.id) 
                      ? 'bg-blue-50 border-blue-300' 
                      : train.needsMaintenance 
                        ? 'bg-red-50 border-red-200' 
                        : train.brandingContract
                          ? 'bg-purple-50 border-purple-200'
                          : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Train {train.id}</span>
                      <span className="text-blue-600 font-medium">{train.departureTime}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-600">
                        {train.lane ? `Lane ${train.lane}, Pos ${train.position}` : 'Not positioned'}
                      </span>
                      <div className="flex space-x-1">
                        {train.needsMaintenance && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            {train.maintenanceDue}km
                          </span>
                        )}
                        {train.brandingContract && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {train.brandingContract}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Mileage: {train.mileage.toLocaleString()} km | Fitness: {train.fitnessExpiry}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Workshop Status */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">IBM Maximo Integration - Work Orders</h3>
            <div className="space-y-2">
              {workshopQueue.length > 0 ? workshopQueue.map((train, index) => (
                <div key={train.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Train {train.id}</span>
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                      Priority #{index + 1}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <div>Overdue maintenance: {train.maintenanceDue} km</div>
                    <div>Total mileage: {train.mileage.toLocaleString()} km</div>
                    <div>Next departure: {train.departureTime}</div>
                    <div>Fitness expires: {train.fitnessExpiry}</div>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded">
                      Job Card: BRAKE-{train.id}-2024 | Status: OPEN
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-gray-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">All maintenance current</p>
                </div>
              )}
            </div>
          </div>

          {/* Live Optimization Status */}
          {isSimulating && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">AI Optimization Progress</h3>
              <div className="space-y-2">
                <div className="bg-white rounded-md p-3">
                  <div className="text-sm text-gray-600">Algorithm Progress:</div>
                  <div className="font-medium text-blue-900">{simulationStep} of 6 phases complete</div>
                </div>
                {movingTrains.length > 0 && (
                  <div className="bg-blue-100 rounded-md p-3">
                    <div className="text-sm text-blue-700">Processing Units:</div>
                    <div className="font-medium text-blue-900">T{movingTrains.join(', T')}</div>
                  </div>
                )}
                <div className="bg-white rounded-md p-3">
                  <div className="text-sm text-gray-600">Optimization Score:</div>
                  <div className="font-medium text-green-600">{Math.min(97, 85 + simulationStep * 2)}% Efficiency</div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Metrics Dashboard */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Fleet Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  {lanes.reduce((total, lane) => total + lane.trains.length, 0)}/26
                </div>
                <div className="text-xs text-gray-600">Units Positioned</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">99.5%</div>
                <div className="text-xs text-gray-600">On-Time Performance</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-xl font-bold text-orange-600">
                  {trains.filter(t => t.departureTime <= "07:00").length}
                </div>
                <div className="text-xs text-gray-600">Peak Hour Ready</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">
                  ₹{(trains.filter(t => t.brandingContract).length * 2.5).toFixed(1)}L
                </div>
                <div className="text-xs text-gray-600">Daily Ad Revenue</div>
              </div>
            </div>
            
            {/* Advanced Efficiency Metrics */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-900 mb-2">AI Optimization Metrics</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Maintenance Positioning</span>
                  <span className="text-xs font-medium text-green-600">
                    {Math.round((trains.filter(t => t.needsMaintenance && t.position === 1).length / Math.max(1, trains.filter(t => t.needsMaintenance).length)) * 100)}% Optimized
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Branding Exposure</span>
                  <span className="text-xs font-medium text-purple-600">
                    {Math.round((trains.filter(t => t.brandingContract && t.lane && t.lane >= 5 && t.lane <= 8).length / Math.max(1, trains.filter(t => t.brandingContract).length)) * 100)}% Optimal Visibility
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Mileage Balance</span>
                  <span className="text-xs font-medium text-blue-600">
                    Std Dev: {Math.round(Math.sqrt(trains.reduce((sum, t) => sum + Math.pow(t.mileage - 23000, 2), 0) / trains.length))} km
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Energy Efficiency</span>
                  <span className="text-xs font-medium text-green-600">
                    -{Math.round(25 - (highlightedLanes.length * 2))}% Shunting Reduction
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer Information */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
        <div className="grid grid-cols-4 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Depot Infrastructure</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Fleet Capacity: 28 trainsets</li>
              <li>• Stabling Lines: 13 (26 positions)</li>
              <li>• Spare Capacity: 2 emergency units</li>
              <li>• IBL Workshop: 5-unit capacity</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Service Operations</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• First Service: 05:30 AM</li>
              <li>• Last Service: 22:00 PM</li>
              <li>• Peak Frequency: 3-4 minutes</li>
              <li>• Off-Peak Frequency: 6-7 minutes</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">System Integration</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• IBM Maximo CMMS</li>
              <li>• UNS Real-time Monitoring</li>
              <li>• CBTC Signal Integration</li>
              <li>• Energy Management System</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Performance KPIs</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Fleet Availability: {Math.round(((28 - trains.filter(t => t.needsMaintenance && t.maintenanceDue < 100).length) / 28) * 100)}%</li>
              <li>• Revenue Service: 93% utilization</li>
              <li>• Maintenance Efficiency: 97%</li>
              <li>• Energy Optimization: 85%</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Kochi Metro Rail Limited - Intelligent Fleet Decision Support Platform v3.2 | 
            IBM Maximo Integration Active | 
            Last Optimization: {new Date().toLocaleString()} | 
            System Status: {isSimulating ? "AI Optimization Running" : 
              trains.filter(t => t.lane).length === 26 ? "Fleet Optimally Positioned" : 
              `${trains.filter(t => t.lane).length}/26 Units Positioned - {trains.filter(t => t.status === "spare").length} Spare Available`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KochiMetroDepotSimulation;