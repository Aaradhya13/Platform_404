import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Train, Calendar, MapPin, Clock, Activity, TrendingUp, AlertCircle, CheckCircle, Users, Database, ArrowRight, Settings } from 'lucide-react';
import { operationsService } from '../../services/operationapi';

import LogoutButton from '../LogoutButton.jsx';

// import { operationsService } from './operationapi.js'; // Uncomment this line in your actual implementation

// For demo purposes only - remove this in actual implementation
// const operationsService = window.operationsService || {
//   getParkingOperations: async () => { throw new Error('operationsService not imported'); },
//   getTimetables: async () => { throw new Error('operationsService not imported'); },
//   getLanes: async () => { throw new Error('operationsService not imported'); }
// };

const OperationsDashboard = () => {
  const [parkingData, setParkingData] = useState([]);
  const [timetableData, setTimetableData] = useState({});
  const [lanesData, setLanesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Color schemes for charts
  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  const RAMP_COLORS = ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD'];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the imported operationsService functions
        const [parking, timetables, lanes] = await Promise.all([
          operationsService.getParkingOperations(),
          operationsService.getTimetables(), 
          operationsService.getLanes()
        ]);

        setParkingData(parking);
        setTimetableData(timetables);
        setLanesData(lanes);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Data processing functions
  const processLaneUtilization = () => {
    if (!parkingData.length || !lanesData.length) return [];
    
    const laneUsage = lanesData.map(lane => {
      const occupiedCount = parkingData.filter(p => 
        p.lane === lane.lane_number && p.enterd && !p.exited
      ).length;
      const totalOperations = parkingData.filter(p => p.lane === lane.lane_number).length;
      
      return {
        name: `Lane ${lane.lane_number}`,
        occupied: occupiedCount,
        total: totalOperations,
        utilization: totalOperations > 0 ? Math.round((occupiedCount / totalOperations) * 100) : 0
      };
    });
    
    return laneUsage;
  };

  const processOperationalStatus = () => {
    if (!parkingData.length) return [];
    
    const parked = parkingData.filter(p => p.enterd && !p.exited).length;
    const completed = parkingData.filter(p => p.enterd && p.exited).length;
    const scheduled = parkingData.filter(p => !p.enterd && !p.exited).length;
    
    return [
      { name: 'Currently Parked', value: parked, color: '#3B82F6' },
      { name: 'Completed', value: completed, color: '#10B981' },
      { name: 'Scheduled', value: scheduled, color: '#F59E0B' }
    ];
  };

  const processDailyOperations = () => {
    if (!Object.keys(timetableData).length) return [];
    
    return Object.entries(timetableData).map(([date, schedules]) => ({
      date: new Date(date).toLocaleDateString(),
      operations: schedules.length,
      trains: new Set(schedules.map(s => s.train_schedule?.train?.id)).size
    }));
  };

  const getKPIData = () => {
    const totalLanes = lanesData.length;
    const totalOperations = parkingData.length;
    const activeOperations = parkingData.filter(p => p.enterd && !p.exited).length;
    const totalSchedules = Object.values(timetableData).flat().length;
    
    return { totalLanes, totalOperations, activeOperations, totalSchedules };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading operations data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const kpiData = getKPIData();
  const laneUtilization = processLaneUtilization();
  const operationalStatus = processOperationalStatus();
  const dailyOperations = processDailyOperations();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Operations Department</h1>
              <p className="text-gray-600 mt-1">Real-time operational insights and management</p>
            </div>
            <div className="flex space-x-3">
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total Lanes</p>
                <p className="text-3xl font-bold text-gray-900">{kpiData.totalLanes}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total Operations</p>
                <p className="text-3xl font-bold text-gray-900">{kpiData.totalOperations}</p>
              </div>
              <Train className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Active Operations</p>
                <p className="text-3xl font-bold text-gray-900">{kpiData.activeOperations}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Scheduled Operations</p>
                <p className="text-3xl font-bold text-gray-900">{kpiData.totalSchedules}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Lane Utilization Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lane Utilization</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={laneUtilization}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="occupied" fill="#3B82F6" name="Currently Occupied" />
                <Bar dataKey="total" fill="#E5E7EB" name="Total Operations" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Operational Status Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={operationalStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {operationalStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Operations Trend */}
        {dailyOperations.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Operations Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyOperations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="operations" stroke="#3B82F6" name="Total Operations" />
                <Line type="monotone" dataKey="trains" stroke="#10B981" name="Trains Scheduled" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveSection('parking')}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Train className="h-6 w-6 text-blue-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Parking Operations</p>
                  <p className="text-sm text-gray-600">Manage train parking</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </button>

            <button
              onClick={() => setActiveSection('timetable')}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Timetable Management</p>
                  <p className="text-sm text-gray-600">Schedule operations</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </button>

            <button
              onClick={() => setActiveSection('lanes')}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-orange-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Lane Management</p>
                  <p className="text-sm text-gray-600">Configure parking lanes</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Active Section Content Placeholder */}
        {activeSection !== 'dashboard' && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeSection === 'parking' && 'Parking Operations Management'}
                {activeSection === 'timetable' && 'Timetable Management'}
                {activeSection === 'lanes' && 'Lane Management'}
              </h3>
              <p className="text-gray-600 mb-4">
                This section will contain the detailed management interface for {activeSection}.
              </p>
              <button
                onClick={() => setActiveSection('dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationsDashboard;
// import React, { useEffect, useState } from "react";

// const OperationDashboard = () => {
//   const [parkingData, setParkingData] = useState([]);
//   const [lanesData, setLanesData] = useState([]);
//   const [timetableData, setTimetableData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // ---------------- Hardcoded Parking ----------------
//         const parking = [
//           { id: 1, location: "Muttom Depot", capacity: 50, occupied: 32 },
//           { id: 2, location: "Aluva Station", capacity: 20, occupied: 18 },
//           { id: 3, location: "Kalamassery Station", capacity: 25, occupied: 10 },
//         ];

//         // ---------------- Hardcoded Lanes ----------------
//         const lanes = [
//           { id: 1, name: "Lane A", status: "Active", trains: 5 },
//           { id: 2, name: "Lane B", status: "Inactive", trains: 0 },
//           { id: 3, name: "Lane C", status: "Active", trains: 3 },
//         ];

//         // ---------------- Hardcoded Timetable ----------------
//         const timetable = {
//           "2025-08-29": [
//             {
//               id: 1,
//               date: "2025-08-29T05:30:00+05:30",
//               day: 4,
//               train_number: 100,
//               starting_point: "Depot Muttom",
//               starting_time: "2025-08-29T10:30:00+05:30",
//               ending_point: "Depot Muttom",
//               ending_time: "2025-08-29T14:30:00+05:30",
//               train_schedule: {
//                 id: 1,
//                 train: {
//                   id: 18,
//                   train_id: 18,
//                   total_distance_travelled: 241182,
//                   distance_travelled_since_last_service: 707,
//                 },
//                 slot: 1,
//               },
//             },
//             {
//               id: 2,
//               date: "2025-08-29T05:30:00+05:30",
//               day: 4,
//               train_number: 101,
//               starting_point: "Depot Muttom",
//               starting_time: "2025-08-29T12:30:00+05:30",
//               ending_point: "Depot Muttom",
//               ending_time: "2025-08-29T16:30:00+05:30",
//               train_schedule: {
//                 id: 2,
//                 train: {
//                   id: 22,
//                   train_id: 22,
//                   total_distance_travelled: 78490,
//                   distance_travelled_since_last_service: 24607,
//                 },
//                 slot: 2,
//               },
//             },
//           ],
//         };

//         // ✅ Set all mocked data
//         setParkingData(parking);
//         setLanesData(lanes);
//         setTimetableData(timetable);

//       } catch (err) {
//         setError(err.message);
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, []);

//   if (loading) return <p>Loading data...</p>;
//   if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

//   return (
//     <div>
//       <h1>🚉 Operations Dashboard</h1>

//       <h2>🅿️ Parking Data</h2>
//       <ul>
//         {parkingData.map((p) => (
//           <li key={p.id}>
//             {p.location} - {p.occupied}/{p.capacity} occupied
//           </li>
//         ))}
//       </ul>

//       <h2>🛤️ Lanes Data</h2>
//       <ul>
//         {lanesData.map((l) => (
//           <li key={l.id}>
//             {l.name} - {l.status} ({l.trains} trains)
//           </li>
//         ))}
//       </ul>

//       <h2>📅 Timetable</h2>
//       {Object.entries(timetableData).map(([date, trains]) => (
//         <div key={date}>
//           <h3>{date}</h3>
//           <ul>
//             {trains.map((t) => (
//               <li key={t.id}>
//                 Train {t.train_number} from {t.starting_point} at{" "}
//                 {new Date(t.starting_time).toLocaleTimeString()} →{" "}
//                 {t.ending_point} at{" "}
//                 {new Date(t.ending_time).toLocaleTimeString()}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default OperationDashboard;
