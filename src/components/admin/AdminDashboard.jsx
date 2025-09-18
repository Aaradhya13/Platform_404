// // import React, { useState, useEffect } from 'react';
// // import { User, Settings, Train, Calendar, Wrench, Eye, Trash2, Plus, Edit, Building, UserPlus, Save, X, Users, Briefcase } from 'lucide-react';
// // import { adminService } from '../services/adminapi.js';
// // // Import your adminService
// // // import { adminService } from './adminapi.js';

// // // For demo purposes, assuming adminService is available globally or imported
// // const AdminDashboard = () => {
// //   const [activeTab, setActiveTab] = useState('users');
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [success, setSuccess] = useState('');
  
// //   // State for different entities
// //   const [users, setUsers] = useState([]);
// //   const [roles, setRoles] = useState([]);
// //   const [departments, setDepartments] = useState([]);
// //   const [operations, setOperations] = useState([]);
// //   const [operationLanes, setOperationLanes] = useState([]);
// //   const [timetable, setTimetable] = useState([]);
// //   const [cleaning, setCleaning] = useState([]);
// //   const [cleaningLanes, setCleaningLanes] = useState([]);
// //   const [inspections, setInspections] = useState([]);
// //   const [inspectionLanes, setInspectionLanes] = useState([]);
// //   const [maintenance, setMaintenance] = useState([]);
// //   const [maintenanceLanes, setMaintenanceLanes] = useState([]);

// //   // Form states
// //   const [showForm, setShowForm] = useState(false);
// //   const [editingItem, setEditingItem] = useState(null);
// //   const [formData, setFormData] = useState({});

// //   // Navigation items
// //   const navItems = [
// //     { id: 'users', label: 'Users', icon: User },
// //     { id: 'roles', label: 'Roles', icon: Settings },
// //     { id: 'departments', label: 'Departments', icon: Building },
// //     { id: 'operations', label: 'Operations', icon: Train },
// //     { id: 'operation-lanes', label: 'Operation Lanes', icon: Train },
// //     { id: 'timetable', label: 'Timetable', icon: Calendar },
// //     { id: 'cleaning', label: 'Cleaning', icon: Wrench },
// //     { id: 'cleaning-lanes', label: 'Cleaning Lanes', icon: Wrench },
// //     { id: 'inspections', label: 'Inspections', icon: Eye },
// //     { id: 'inspection-lanes', label: 'Inspection Lanes', icon: Eye },
// //     { id: 'maintenance', label: 'Maintenance', icon: Settings },
// //     { id: 'maintenance-lanes', label: 'Maintenance Lanes', icon: Settings },
// //   ];

// //   // Generic error handler
// //   const handleError = (error) => {
// //     console.error('API Error:', error);
// //     setError(error.message || 'An error occurred');
// //     setTimeout(() => setError(''), 5000);
// //   };

// //   // Generic success handler
// //   const handleSuccess = (message) => {
// //     setSuccess(message);
// //     setTimeout(() => setSuccess(''), 3000);
// //   };

// //   // Load data based on active tab
// //   useEffect(() => {
// //     loadData();
// //   }, [activeTab]);

// //   const loadData = async () => {
// //     setLoading(true);
// //     setError('');
    
// //     try {
// //       switch (activeTab) {
// //         case 'users':
// //           const usersData = await adminService.getUsers();
// //           setUsers(usersData);
// //           break;
// //         case 'roles':
// //           const rolesData = await adminService.getRoles();
// //           setRoles(rolesData);
// //           break;
// //         case 'departments':
// //           const deptData = await adminService.getDepartments();
// //           setDepartments(deptData);
// //           break;
// //         case 'operations':
// //           const opsData = await adminService.getOperations();
// //           setOperations(opsData);
// //           break;
// //         case 'operation-lanes':
// //           const opLanesData = await adminService.getOperationLanes();
// //           setOperationLanes(opLanesData);
// //           break;
// //         case 'timetable':
// //           const timetableData = await adminService.getTimetable();
// //           setTimetable(Object.values(timetableData).flat());
// //           break;
// //         case 'cleaning':
// //           const cleaningData = await adminService.getCleaningSchedules();
// //           setCleaning(cleaningData);
// //           break;
// //         case 'cleaning-lanes':
// //           const cleanLanesData = await adminService.getCleaningLanes();
// //           setCleaningLanes(cleanLanesData);
// //           break;
// //         case 'inspections':
// //           const inspectionData = await adminService.getInspections();
// //           setInspections(inspectionData);
// //           break;
// //         case 'inspection-lanes':
// //           const inspectLanesData = await adminService.getInspectionLanes();
// //           setInspectionLanes(inspectLanesData);
// //           break;
// //         case 'maintenance':
// //           const maintData = await adminService.getMaintenanceEntries();
// //           setMaintenance(maintData);
// //           break;
// //         case 'maintenance-lanes':
// //           const maintLanesData = await adminService.getMaintenanceLanes();
// //           setMaintenanceLanes(maintLanesData);
// //           break;
// //       }
// //     } catch (error) {
// //       handleError(error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Generic create handler
// //   const handleCreate = async (data) => {
// //     setLoading(true);
// //     try {
// //       switch (activeTab) {
// //         case 'users':
// //           await adminService.createUser(data);
// //           break;
// //         case 'roles':
// //           await adminService.createRole(data);
// //           break;
// //         case 'departments':
// //           await adminService.createDepartment(data);
// //           break;
// //         case 'operations':
// //           await adminService.createOperation(data);
// //           break;
// //         case 'operation-lanes':
// //           await adminService.createOperationLane(data);
// //           break;
// //         case 'timetable':
// //           await adminService.createTimetableEntry(data);
// //           break;
// //         case 'cleaning':
// //           await adminService.createCleaningEntry(data);
// //           break;
// //         case 'cleaning-lanes':
// //           await adminService.createCleaningLane(data);
// //           break;
// //         case 'inspections':
// //           await adminService.createInspectionEntry(data);
// //           break;
// //         case 'inspection-lanes':
// //           await adminService.createInspectionLane(data);
// //           break;
// //         case 'maintenance':
// //           await adminService.createMaintenanceEntry(data);
// //           break;
// //         case 'maintenance-lanes':
// //           await adminService.createMaintenanceLane(data);
// //           break;
// //       }
// //       handleSuccess('Item created successfully');
// //       setShowForm(false);
// //       setFormData({});
// //       loadData();
// //     } catch (error) {
// //       handleError(error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Generic update handler
// //   const handleUpdate = async (data) => {
// //     setLoading(true);
// //     try {
// //       switch (activeTab) {
// //         case 'users':
// //           await adminService.updateUser(data);
// //           break;
// //         case 'roles':
// //           await adminService.updateRole(data);
// //           break;
// //         case 'departments':
// //           await adminService.updateDepartment(data);
// //           break;
// //         case 'operations':
// //           await adminService.updateOperation(data);
// //           break;
// //         case 'operation-lanes':
// //           await adminService.updateOperationLane(data);
// //           break;
// //         case 'timetable':
// //           await adminService.updateTimetableEntry(data);
// //           break;
// //         case 'cleaning':
// //           await adminService.updateCleaningEntry(data);
// //           break;
// //         case 'cleaning-lanes':
// //           await adminService.updateCleaningLane(data);
// //           break;
// //         case 'inspections':
// //           await adminService.updateInspectionEntry(data);
// //           break;
// //         case 'inspection-lanes':
// //           await adminService.updateInspectionLane(data);
// //           break;
// //         case 'maintenance':
// //           await adminService.updateMaintenanceEntry(data);
// //           break;
// //         case 'maintenance-lanes':
// //           await adminService.updateMaintenanceLane(data);
// //           break;
// //       }
// //       handleSuccess('Item updated successfully');
// //       setShowForm(false);
// //       setEditingItem(null);
// //       setFormData({});
// //       loadData();
// //     } catch (error) {
// //       handleError(error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Generic delete handler
// //   const handleDelete = async (id) => {
// //     if (!confirm('Are you sure you want to delete this item?')) return;
    
// //     setLoading(true);
// //     try {
// //       switch (activeTab) {
// //         case 'operations':
// //           await adminService.deleteOperation(id);
// //           break;
// //         case 'operation-lanes':
// //           await adminService.deleteOperationLane(id);
// //           break;
// //         case 'timetable':
// //           await adminService.deleteTimetableEntry(id);
// //           break;
// //         case 'cleaning':
// //           await adminService.deleteCleaningEntry(id);
// //           break;
// //         case 'cleaning-lanes':
// //           await adminService.deleteCleaningLane(id);
// //           break;
// //         case 'inspections':
// //           await adminService.deleteInspectionEntry(id);
// //           break;
// //         case 'inspection-lanes':
// //           await adminService.deleteInspectionLane(id);
// //           break;
// //         case 'maintenance':
// //           await adminService.deleteMaintenanceEntry(id);
// //           break;
// //         case 'maintenance-lanes':
// //           await adminService.deleteMaintenanceLane(id);
// //           break;
// //         default:
// //           throw new Error('Delete not supported for this entity');
// //       }
// //       handleSuccess('Item deleted successfully');
// //       loadData();
// //     } catch (error) {
// //       handleError(error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Get current data based on active tab
// //   const getCurrentData = () => {
// //     switch (activeTab) {
// //       case 'users': return users;
// //       case 'roles': return roles;
// //       case 'departments': return departments;
// //       case 'operations': return operations;
// //       case 'operation-lanes': return operationLanes;
// //       case 'timetable': return timetable;
// //       case 'cleaning': return cleaning;
// //       case 'cleaning-lanes': return cleaningLanes;
// //       case 'inspections': return inspections;
// //       case 'inspection-lanes': return inspectionLanes;
// //       case 'maintenance': return maintenance;
// //       case 'maintenance-lanes': return maintenanceLanes;
// //       default: return [];
// //     }
// //   };

// //   // Get form fields based on entity type
// //   const getFormFields = () => {
// //     switch (activeTab) {
// //       case 'users':
// //         return [
// //           { key: 'username', label: 'Username', type: 'text', required: true },
// //           { key: 'password', label: 'Password', type: 'password', required: !editingItem },
// //           { key: 'first_name', label: 'First Name', type: 'text' },
// //           { key: 'last_name', label: 'Last Name', type: 'text' },
// //           { key: 'email', label: 'Email', type: 'email' },
// //           { key: 'department', label: 'Department ID', type: 'number' },
// //           { key: 'designation', label: 'Designation ID', type: 'number' },
// //           { key: 'depot', label: 'Depot ID', type: 'number' },
// //         ];
// //       case 'roles':
// //         return [
// //           { key: 'name', label: 'Role Name', type: 'text', required: true },
// //         ];
// //       case 'departments':
// //         return [
// //           { key: 'name', label: 'Department Name', type: 'text', required: true },
// //         ];
// //       case 'operations':
// //         return [
// //           { key: 'lane', label: 'Lane ID', type: 'number', required: true },
// //           { key: 'train', label: 'Train ID', type: 'number', required: true },
// //           { key: 'scheduledStart', label: 'Scheduled Start', type: 'datetime-local' },
// //           { key: 'scheduledEnd', label: 'Scheduled End', type: 'datetime-local' },
// //           { key: 'enterd', label: 'Entered', type: 'datetime-local' },
// //           { key: 'exited', label: 'Exited', type: 'datetime-local' },
// //         ];
// //       case 'operation-lanes':
// //         return [
// //           { key: 'lane_number', label: 'Lane Number', type: 'number', required: true },
// //           { key: 'depot', label: 'Depot ID', type: 'number', required: true },
// //         ];
// //       case 'timetable':
// //         return [
// //           { key: 'date', label: 'Date', type: 'date', required: true },
// //           { key: 'train_number', label: 'Train Number', type: 'text' },
// //           { key: 'starting_point', label: 'Starting Point', type: 'text' },
// //           { key: 'starting_time', label: 'Starting Time', type: 'datetime-local' },
// //           { key: 'ending_point', label: 'Ending Point', type: 'text' },
// //           { key: 'ending_time', label: 'Ending Time', type: 'datetime-local' },
// //           { key: 'train_id', label: 'Train ID', type: 'number' },
// //         ];
// //       case 'cleaning':
// //         return [
// //           { key: 'lane', label: 'Lane ID', type: 'number', required: true },
// //           { key: 'train', label: 'Train ID', type: 'number', required: true },
// //           { key: 'scheduledStart', label: 'Scheduled Start', type: 'datetime-local' },
// //           { key: 'scheduledEnd', label: 'Scheduled End', type: 'datetime-local' },
// //           { key: 'enterd', label: 'Entered', type: 'datetime-local' },
// //           { key: 'exited', label: 'Exited', type: 'datetime-local' },
// //         ];
// //       case 'cleaning-lanes':
// //         return [
// //           { key: 'bay_number', label: 'Bay Number', type: 'number', required: true },
// //           { key: 'depot', label: 'Depot ID', type: 'number', required: true },
// //         ];
// //       case 'inspections':
// //         return [
// //           { key: 'lane', label: 'Lane ID', type: 'number', required: true },
// //           { key: 'train', label: 'Train ID', type: 'number', required: true },
// //           { key: 'scheduledStart', label: 'Scheduled Start', type: 'datetime-local' },
// //           { key: 'scheduledEnd', label: 'Scheduled End', type: 'datetime-local' },
// //           { key: 'enterd', label: 'Entered', type: 'datetime-local' },
// //           { key: 'exited', label: 'Exited', type: 'datetime-local' },
// //         ];
// //       case 'inspection-lanes':
// //         return [
// //           { key: 'lane_number', label: 'Lane Number', type: 'number', required: true },
// //           { key: 'depot', label: 'Depot ID', type: 'number', required: true },
// //         ];
// //       case 'maintenance':
// //         return [
// //           { key: 'lane', label: 'Lane ID', type: 'number', required: true },
// //           { key: 'train', label: 'Train ID', type: 'number', required: true },
// //           { key: 'scheduledStart', label: 'Scheduled Start', type: 'datetime-local' },
// //           { key: 'scheduledEnd', label: 'Scheduled End', type: 'datetime-local' },
// //           { key: 'enterd', label: 'Entered', type: 'datetime-local' },
// //           { key: 'exited', label: 'Exited', type: 'datetime-local' },
// //         ];
// //       case 'maintenance-lanes':
// //         return [
// //           { key: 'lane_number', label: 'Lane Number', type: 'number', required: true },
// //           { key: 'depot', label: 'Depot ID', type: 'number', required: true },
// //         ];
// //       default:
// //         return [];
// //     }
// //   };

// //   const handleFormSubmit = (e) => {
// //     e.preventDefault();
// //     if (editingItem) {
// //       handleUpdate({ ...formData, id: editingItem.id });
// //     } else {
// //       handleCreate(formData);
// //     }
// //   };

// //   const openForm = (item = null) => {
// //     setEditingItem(item);
// //     setFormData(item ? { ...item } : {});
// //     setShowForm(true);
// //   };

// //   const closeForm = () => {
// //     setShowForm(false);
// //     setEditingItem(null);
// //     setFormData({});
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header */}
// //       <header className="bg-white shadow-sm border-b">
// //         <div className="max-w-7xl mx-auto px-4 py-4">
// //           <h1 className="text-2xl font-bold text-gray-900">Railway Admin Dashboard</h1>
// //         </div>
// //       </header>

// //       <div className="max-w-7xl mx-auto flex">
// //         {/* Sidebar */}
// //         <nav className="w-64 bg-white shadow-sm min-h-screen p-4">
// //           <div className="space-y-2">
// //             {navItems.map((item) => {
// //               const Icon = item.icon;
// //               return (
// //                 <button
// //                   key={item.id}
// //                   onClick={() => setActiveTab(item.id)}
// //                   className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
// //                     activeTab === item.id
// //                       ? 'bg-blue-50 text-blue-700 border border-blue-200'
// //                       : 'text-gray-700 hover:bg-gray-50'
// //                   }`}
// //                 >
// //                   <Icon size={18} />
// //                   <span className="text-sm font-medium">{item.label}</span>
// //                 </button>
// //               );
// //             })}
// //           </div>
// //         </nav>

// //         {/* Main Content */}
// //         <main className="flex-1 p-6">
// //           {/* Alerts */}
// //           {error && (
// //             <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
// //               {error}
// //             </div>
// //           )}
// //           {success && (
// //             <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
// //               {success}
// //             </div>
// //           )}

// //           {/* Content Header */}
// //           <div className="flex justify-between items-center mb-6">
// //             <h2 className="text-xl font-semibold text-gray-900 capitalize">
// //               {activeTab.replace('-', ' ')}
// //             </h2>
// //             <button
// //               onClick={() => openForm()}
// //               className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
// //             >
// //               <Plus size={16} />
// //               <span>Add New</span>
// //             </button>
// //           </div>

// //           {/* Loading State */}
// //           {loading && (
// //             <div className="text-center py-12">
// //               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// //               <p className="mt-2 text-gray-600">Loading...</p>
// //             </div>
// //           )}

// //           {/* Data Table */}
// //           {!loading && (
// //             <div className="bg-white rounded-lg shadow overflow-hidden">
// //               <div className="overflow-x-auto">
// //                 <table className="min-w-full divide-y divide-gray-200">
// //                   <thead className="bg-gray-50">
// //                     <tr>
// //                       {getCurrentData().length > 0 && Object.keys(getCurrentData()[0]).map((key) => (
// //                         <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                           {key.replace(/_/g, ' ')}
// //                         </th>
// //                       ))}
// //                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Actions
// //                       </th>
// //                     </tr>
// //                   </thead>
// //                   <tbody className="bg-white divide-y divide-gray-200">
// //                     {getCurrentData().map((item, index) => (
// //                       <tr key={item.id || index} className="hover:bg-gray-50">
// //                         {Object.entries(item).map(([key, value]) => (
// //                           <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                             {typeof value === 'object' && value !== null 
// //                               ? JSON.stringify(value) 
// //                               : String(value || '')
// //                             }
// //                           </td>
// //                         ))}
// //                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
// //                           <button
// //                             onClick={() => openForm(item)}
// //                             className="text-blue-600 hover:text-blue-900 p-1"
// //                           >
// //                             <Edit size={16} />
// //                           </button>
// //                           {['operations', 'operation-lanes', 'timetable', 'cleaning', 'cleaning-lanes', 
// //                             'inspections', 'inspection-lanes', 'maintenance', 'maintenance-lanes'].includes(activeTab) && (
// //                             <button
// //                               onClick={() => handleDelete(item.id)}
// //                               className="text-red-600 hover:text-red-900 p-1"
// //                             >
// //                               <Trash2 size={16} />
// //                             </button>
// //                           )}
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
              
// //               {getCurrentData().length === 0 && (
// //                 <div className="text-center py-12">
// //                   <p className="text-gray-500">No data available</p>
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* Form Modal */}
// //           {showForm && (
// //             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //               <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-screen overflow-y-auto">
// //                 <form onSubmit={handleFormSubmit} className="p-6">
// //                   <div className="flex justify-between items-center mb-4">
// //                     <h3 className="text-lg font-medium text-gray-900">
// //                       {editingItem ? 'Edit' : 'Add'} {activeTab.replace('-', ' ')}
// //                     </h3>
// //                     <button
// //                       type="button"
// //                       onClick={closeForm}
// //                       className="text-gray-400 hover:text-gray-600 p-1"
// //                     >
// //                       <X size={20} />
// //                     </button>
// //                   </div>

// //                   <div className="space-y-4">
// //                     {getFormFields().map((field) => (
// //                       <div key={field.key}>
// //                         <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-1">
// //                           {field.label} {field.required && <span className="text-red-500">*</span>}
// //                         </label>
// //                         <input
// //                           id={field.key}
// //                           name={field.key}
// //                           type={field.type}
// //                           required={field.required}
// //                           value={formData[field.key] || ''}
// //                           onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
// //                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                         />
// //                       </div>
// //                     ))}
// //                   </div>

// //                   <div className="flex justify-end space-x-3 mt-6">
// //                     <button
// //                       type="button"
// //                       onClick={closeForm}
// //                       className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
// //                     >
// //                       Cancel
// //                     </button>
// //                     <button
// //                       type="submit"
// //                       disabled={loading}
// //                       className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
// //                     >
// //                       <Save size={16} />
// //                       <span>{editingItem ? 'Update' : 'Create'}</span>
// //                     </button>
// //                   </div>
// //                 </form>
// //               </div>
// //             </div>
// //           )}
// //         </main>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;
// import React, { useState, useEffect } from 'react';
// import { 
//   User, Settings, Train, Calendar, Wrench, Eye, Trash2, Plus, Edit, 
//   Building, Save, X, Users, Briefcase, Search, Filter, RefreshCw,
//   ChevronDown, Bell, LogOut, Menu, Home, AlertCircle, CheckCircle
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { adminService } from '../services/adminapi.js';
// // Header Component
// const Header = ({ onMenuToggle, isSidebarOpen }) => {
//   return (
//     <header className="bg-white border-b border-gray-200 shadow-sm">
//       <div className="px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={onMenuToggle}
//               className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
//             >
//               <Menu size={20} />
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Railway Admin</h1>
//               <p className="text-sm text-gray-500">Management Dashboard</p>
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <button className="p-2 rounded-lg hover:bg-gray-100 relative">
//               <Bell size={20} className="text-gray-600" />
//               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//             </button>
            
//             <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
//               <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                 <User size={16} className="text-white" />
//               </div>
//               <div className="hidden md:block">
//                 <p className="text-sm font-medium text-gray-900">Admin User</p>
//                 <p className="text-xs text-gray-500">Administrator</p>
//               </div>
//               <ChevronDown size={16} className="text-gray-400" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// // Sidebar Component
// const Sidebar = ({ activeTab, onTabChange, isOpen, onClose }) => {
//   const navItems = [
//     { id: 'users', label: 'Users', icon: User, category: 'Management' },
//     { id: 'roles', label: 'Roles', icon: Settings, category: 'Management' },
//     { id: 'departments', label: 'Departments', icon: Building, category: 'Management' },
//     { id: 'operations', label: 'Operations', icon: Train, category: 'Operations' },
//     { id: 'operation-lanes', label: 'Operation Lanes', icon: Train, category: 'Operations' },
//     { id: 'timetable', label: 'Timetable', icon: Calendar, category: 'Operations' },
//     { id: 'cleaning', label: 'Cleaning', icon: Wrench, category: 'Maintenance' },
//     { id: 'cleaning-lanes', label: 'Cleaning Lanes', icon: Wrench, category: 'Maintenance' },
//     { id: 'inspections', label: 'Inspections', icon: Eye, category: 'Quality' },
//     { id: 'inspection-lanes', label: 'Inspection Lanes', icon: Eye, category: 'Quality' },
//     { id: 'maintenance', label: 'Maintenance', icon: Settings, category: 'Maintenance' },
//     { id: 'maintenance-lanes', label: 'Maintenance Lanes', icon: Settings, category: 'Maintenance' },
//   ];

//   const categories = [...new Set(navItems.map(item => item.category))];

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isOpen && (
//         <div 
//           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={onClose}
//         />
//       )}
      
//       {/* Sidebar */}
//       <aside className={`
//         fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 
//         transform transition-transform duration-300 ease-in-out
//         ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//       `}>
//         <div className="h-full flex flex-col">
//           <div className="p-6 border-b border-gray-200 lg:hidden">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
//               <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
//                 <X size={20} />
//               </button>
//             </div>
//           </div>
          
//           <nav className="flex-1 px-4 py-6 overflow-y-auto">
//             <div className="space-y-8">
//               {categories.map((category) => (
//                 <div key={category}>
//                   <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
//                     {category}
//                   </h3>
//                   <div className="space-y-1">
//                     {navItems
//                       .filter(item => item.category === category)
//                       .map((item) => {
//                         const Icon = item.icon;
//                         return (
//                           <button
//                             key={item.id}
//                             onClick={() => {
//                               onTabChange(item.id);
//                               onClose();
//                             }}
//                             className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
//                               activeTab === item.id
//                                 ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
//                                 : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
//                             }`}
//                           >
//                             <Icon size={18} />
//                             <span className="text-sm font-medium">{item.label}</span>
//                           </button>
//                         );
//                       })}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </nav>
          
//           <div className="p-4 border-t border-gray-200">
//             <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
//               <LogOut size={18} />
//               <span className="text-sm font-medium">Logout</span>
//             </button>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// };

// // Alert Component
// const Alert = ({ type, message, onClose }) => {
//   const icons = {
//     error: AlertCircle,
//     success: CheckCircle
//   };
  
//   const styles = {
//     error: 'bg-red-50 border-red-200 text-red-800',
//     success: 'bg-green-50 border-green-200 text-green-800'
//   };

//   const Icon = icons[type];

//   return (
//     <div className={`flex items-center justify-between p-4 rounded-lg border ${styles[type]} mb-6`}>
//       <div className="flex items-center space-x-2">
//         <Icon size={20} />
//         <span className="text-sm font-medium">{message}</span>
//       </div>
//       <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//         <X size={16} />
//       </button>
//     </div>
//   );
// };

// // Data Table Component
// const DataTable = ({ data, onEdit, onDelete, canDelete, loading }) => {
//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <div className="flex items-center justify-center py-12">
//           <div className="text-center">
//             <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
//             <p className="text-gray-600">Loading data...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!data || data.length === 0) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <div className="text-center py-12">
//           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Briefcase size={24} className="text-gray-400" />
//           </div>
//           <p className="text-gray-500 text-lg mb-2">No data available</p>
//           <p className="text-gray-400 text-sm">Start by creating your first entry</p>
//         </div>
//       </div>
//     );
//   }

//   const columns = Object.keys(data[0]).filter(key => key !== 'id');

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               {columns.map((column) => (
//                 <th 
//                   key={column}
//                   className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
//                 >
//                   {column.replace(/_/g, ' ')}
//                 </th>
//               ))}
//               <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-100">
//             {data.map((item, index) => (
//               <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
//                 {columns.map((column) => (
//                   <td key={column} className="px-6 py-4 text-sm text-gray-900">
//                     <div className="max-w-xs truncate">
//                       {typeof item[column] === 'object' && item[column] !== null 
//                         ? JSON.stringify(item[column]) 
//                         : String(item[column] || '-')
//                       }
//                     </div>
//                   </td>
//                 ))}
//                 <td className="px-6 py-4 text-right">
//                   <div className="flex items-center justify-end space-x-2">
//                     <button
//                       onClick={() => onEdit(item)}
//                       className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
//                       title="Edit"
//                     >
//                       <Edit size={16} />
//                     </button>
//                     {canDelete && (
//                       <button
//                         onClick={() => onDelete(item.id)}
//                         className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
//                         title="Delete"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// // Form Modal Component
// const FormModal = ({ isOpen, onClose, title, fields, formData, onChange, onSubmit, loading }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         <form onSubmit={onSubmit}>
//           <div className="px-6 py-4 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//           </div>

//           <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
//             {fields.map((field) => (
//               <div key={field.key}>
//                 <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-2">
//                   {field.label} {field.required && <span className="text-red-500">*</span>}
//                 </label>
//                 <input
//                   id={field.key}
//                   name={field.key}
//                   type={field.type}
//                   required={field.required}
//                   value={formData[field.key] || ''}
//                   onChange={(e) => onChange({ ...formData, [field.key]: e.target.value })}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//                   placeholder={`Enter ${field.label.toLowerCase()}`}
//                 />
//               </div>
//             ))}
//           </div>

//           <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={loading}
//               className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
//             >
//               {loading ? (
//                 <RefreshCw size={16} className="animate-spin" />
//               ) : (
//                 <Save size={16} />
//               )}
//               <span>{loading ? 'Saving...' : 'Save'}</span>
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Main Dashboard Component
// const AdminDashboard = () => {
//   // Import the actual adminService
//   const adminService = {
//     checkRole: async () => {},
//     getUsers: async () => [],
//     getRoles: async () => [],
//     getDepartments: async () => [],
//     getOperations: async () => [],
//     getOperationLanes: async () => [],
//     getTimetable: async () => ({}),
//     getCleaningSchedules: async () => [],
//     getCleaningLanes: async () => [],
//     getInspections: async () => [],
//     getInspectionLanes: async () => [],
//     getMaintenanceEntries: async () => [],
//     getMaintenanceLanes: async () => [],
//     createUser: async (data) => {},
//     updateUser: async (data) => {},
//     createRole: async (data) => {},
//     updateRole: async (data) => {},
//     createDepartment: async (data) => {},
//     updateDepartment: async (data) => {},
//     createOperation: async (data) => {},
//     updateOperation: async (data) => {},
//     deleteOperation: async (id) => {},
//     createOperationLane: async (data) => {},
//     updateOperationLane: async (data) => {},
//     deleteOperationLane: async (id) => {},
//     createTimetableEntry: async (data) => {},
//     updateTimetableEntry: async (data) => {},
//     deleteTimetableEntry: async (id) => {},
//     createCleaningEntry: async (data) => {},
//     updateCleaningEntry: async (data) => {},
//     deleteCleaningEntry: async (id) => {},
//     createCleaningLane: async (data) => {},
//     updateCleaningLane: async (data) => {},
//     deleteCleaningLane: async (id) => {},
//     createInspectionEntry: async (data) => {},
//     updateInspectionEntry: async (data) => {},
//     deleteInspectionEntry: async (id) => {},
//     createInspectionLane: async (data) => {},
//     updateInspectionLane: async (data) => {},
//     deleteInspectionLane: async (id) => {},
//     createMaintenanceEntry: async (data) => {},
//     updateMaintenanceEntry: async (data) => {},
//     deleteMaintenanceEntry: async (id) => {},
//     createMaintenanceLane: async (data) => {},
//     updateMaintenanceLane: async (data) => {},
//     deleteMaintenanceLane: async (id) => {},
//   };

//   const [activeTab, setActiveTab] = useState('users');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
//   // State for different entities
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [operations, setOperations] = useState([]);
//   const [operationLanes, setOperationLanes] = useState([]);
//   const [timetable, setTimetable] = useState([]);
//   const [cleaning, setCleaning] = useState([]);
//   const [cleaningLanes, setCleaningLanes] = useState([]);
//   const [inspections, setInspections] = useState([]);
//   const [inspectionLanes, setInspectionLanes] = useState([]);
//   const [maintenance, setMaintenance] = useState([]);
//   const [maintenanceLanes, setMaintenanceLanes] = useState([]);

//   // Form states
//   const [showForm, setShowForm] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [formData, setFormData] = useState({});

//   const handleError = (error) => {
//     console.error('API Error:', error);
//     setError(error.message || 'An error occurred');
//     setTimeout(() => setError(''), 5000);
//   };

//   const handleSuccess = (message) => {
//     setSuccess(message);
//     setTimeout(() => setSuccess(''), 3000);
//   };

//   useEffect(() => {
//     loadData();
//   }, [activeTab]);

//   const loadData = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       switch (activeTab) {
//         case 'users':
//           const usersData = await adminService.getUsers();
//           setUsers(usersData);
//           break;
//         case 'roles':
//           const rolesData = await adminService.getRoles();
//           setRoles(rolesData);
//           break;
//         case 'departments':
//           const deptData = await adminService.getDepartments();
//           setDepartments(deptData);
//           break;
//         case 'operations':
//           const opsData = await adminService.getOperations();
//           setOperations(opsData);
//           break;
//         case 'operation-lanes':
//           const opLanesData = await adminService.getOperationLanes();
//           setOperationLanes(opLanesData);
//           break;
//         case 'timetable':
//           const timetableData = await adminService.getTimetable();
//           setTimetable(Object.values(timetableData).flat());
//           break;
//         case 'cleaning':
//           const cleaningData = await adminService.getCleaningSchedules();
//           setCleaning(cleaningData);
//           break;
//         case 'cleaning-lanes':
//           const cleanLanesData = await adminService.getCleaningLanes();
//           setCleaningLanes(cleanLanesData);
//           break;
//         case 'inspections':
//           const inspectionData = await adminService.getInspections();
//           setInspections(inspectionData);
//           break;
//         case 'inspection-lanes':
//           const inspectLanesData = await adminService.getInspectionLanes();
//           setInspectionLanes(inspectLanesData);
//           break;
//         case 'maintenance':
//           const maintData = await adminService.getMaintenanceEntries();
//           setMaintenance(maintData);
//           break;
//         case 'maintenance-lanes':
//           const maintLanesData = await adminService.getMaintenanceLanes();
//           setMaintenanceLanes(maintLanesData);
//           break;
//       }
//     } catch (error) {
//       handleError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreate = async (data) => {
//     setLoading(true);
//     try {
//       switch (activeTab) {
//         case 'users':
//           await adminService.createUser(data);
//           break;
//         case 'roles':
//           await adminService.createRole(data);
//           break;
//         case 'departments':
//           await adminService.createDepartment(data);
//           break;
//         case 'operations':
//           await adminService.createOperation(data);
//           break;
//         case 'operation-lanes':
//           await adminService.createOperationLane(data);
//           break;
//         case 'timetable':
//           await adminService.createTimetableEntry(data);
//           break;
//         case 'cleaning':
//           await adminService.createCleaningEntry(data);
//           break;
//         case 'cleaning-lanes':
//           await adminService.createCleaningLane(data);
//           break;
//         case 'inspections':
//           await adminService.createInspectionEntry(data);
//           break;
//         case 'inspection-lanes':
//           await adminService.createInspectionLane(data);
//           break;
//         case 'maintenance':
//           await adminService.createMaintenanceEntry(data);
//           break;
//         case 'maintenance-lanes':
//           await adminService.createMaintenanceLane(data);
//           break;
//       }
//       handleSuccess('Item created successfully');
//       setShowForm(false);
//       setFormData({});
//       loadData();
//     } catch (error) {
//       handleError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdate = async (data) => {
//     setLoading(true);
//     try {
//       switch (activeTab) {
//         case 'users':
//           await adminService.updateUser(data);
//           break;
//         case 'roles':
//           await adminService.updateRole(data);
//           break;
//         case 'departments':
//           await adminService.updateDepartment(data);
//           break;
//         case 'operations':
//           await adminService.updateOperation(data);
//           break;
//         case 'operation-lanes':
//           await adminService.updateOperationLane(data);
//           break;
//         case 'timetable':
//           await adminService.updateTimetableEntry(data);
//           break;
//         case 'cleaning':
//           await adminService.updateCleaningEntry(data);
//           break;
//         case 'cleaning-lanes':
//           await adminService.updateCleaningLane(data);
//           break;
//         case 'inspections':
//           await adminService.updateInspectionEntry(data);
//           break;
//         case 'inspection-lanes':
//           await adminService.updateInspectionLane(data);
//           break;
//         case 'maintenance':
//           await adminService.updateMaintenanceEntry(data);
//           break;
//         case 'maintenance-lanes':
//           await adminService.updateMaintenanceLane(data);
//           break;
//       }
//       handleSuccess('Item updated successfully');
//       setShowForm(false);
//       setEditingItem(null);
//       setFormData({});
//       loadData();
//     } catch (error) {
//       handleError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this item?')) return;
    
//     setLoading(true);
//     try {
//       switch (activeTab) {
//         case 'operations':
//           await adminService.deleteOperation(id);
//           break;
//         case 'operation-lanes':
//           await adminService.deleteOperationLane(id);
//           break;
//         case 'timetable':
//           await adminService.deleteTimetableEntry(id);
//           break;
//         case 'cleaning':
//           await adminService.deleteCleaningEntry(id);
//           break;
//         case 'cleaning-lanes':
//           await adminService.deleteCleaningLane(id);
//           break;
//         case 'inspections':
//           await adminService.deleteInspectionEntry(id);
//           break;
//         case 'inspection-lanes':
//           await adminService.deleteInspectionLane(id);
//           break;
//         case 'maintenance':
//           await adminService.deleteMaintenanceEntry(id);
//           break;
//         case 'maintenance-lanes':
//           await adminService.deleteMaintenanceLane(id);
//           break;
//         default:
//           throw new Error('Delete not supported for this entity');
//       }
//       handleSuccess('Item deleted successfully');
//       loadData();
//     } catch (error) {
//       handleError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCurrentData = () => {
//     switch (activeTab) {
//       case 'users': return users;
//       case 'roles': return roles;
//       case 'departments': return departments;
//       case 'operations': return operations;
//       case 'operation-lanes': return operationLanes;
//       case 'timetable': return timetable;
//       case 'cleaning': return cleaning;
//       case 'cleaning-lanes': return cleaningLanes;
//       case 'inspections': return inspections;
//       case 'inspection-lanes': return inspectionLanes;
//       case 'maintenance': return maintenance;
//       case 'maintenance-lanes': return maintenanceLanes;
//       default: return [];
//     }
//   };

//   const getFormFields = () => {
//     switch (activeTab) {
//       case 'users':
//         return [
//           { key: 'username', label: 'Username', type: 'text', required: true },
//           { key: 'password', label: 'Password', type: 'password', required: !editingItem },
//           { key: 'first_name', label: 'First Name', type: 'text' },
//           { key: 'last_name', label: 'Last Name', type: 'text' },
//           { key: 'email', label: 'Email', type: 'email' },
//           { key: 'department', label: 'Department ID', type: 'number' },
//           { key: 'designation', label: 'Designation ID', type: 'number' },
//           { key: 'depot', label: 'Depot ID', type: 'number' },
//         ];
//       case 'roles':
//         return [
//           { key: 'name', label: 'Role Name', type: 'text', required: true },
//         ];
//       case 'departments':
//         return [
//           { key: 'name', label: 'Department Name', type: 'text', required: true },
//         ];
//       case 'operations':
//         return [
//           { key: 'lane', label: 'Lane ID', type: 'number', required: true },
//           { key: 'train', label: 'Train ID', type: 'number', required: true },
//           { key: 'scheduledStart', label: 'Scheduled Start', type: 'datetime-local' },
//           { key: 'scheduledEnd', label: 'Scheduled End', type: 'datetime-local' },
//           { key: 'enterd', label: 'Entered', type: 'datetime-local' },
//           { key: 'exited', label: 'Exited', type: 'datetime-local' },
//         ];
//       case 'inspection-lanes':
//         return [
//           { key: 'lane_number', label: 'Lane Number', type: 'number', required: true },
//           { key: 'depot', label: 'Depot ID', type: 'number', required: true },
//         ];
//       case 'maintenance':
//         return [
//           { key: 'lane', label: 'Lane ID', type: 'number', required: true },
//           { key: 'train', label: 'Train ID', type: 'number', required: true },
//           { key: 'scheduledStart', label: 'Scheduled Start', type: 'datetime-local' },
//           { key: 'scheduledEnd', label: 'Scheduled End', type: 'datetime-local' },
//           { key: 'enterd', label: 'Entered', type: 'datetime-local' },
//           { key: 'exited', label: 'Exited', type: 'datetime-local' },
//         ];
//       case 'maintenance-lanes':
//         return [
//           { key: 'lane_number', label: 'Lane Number', type: 'number', required: true },
//           { key: 'depot', label: 'Depot ID', type: 'number', required: true },
//         ];
//       default:
//         return [];
//     }
//   };

//   const canDelete = () => {
//     return ['operations', 'operation-lanes', 'timetable', 'cleaning', 'cleaning-lanes', 
//             'inspections', 'inspection-lanes', 'maintenance', 'maintenance-lanes'].includes(activeTab);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     if (editingItem) {
//       handleUpdate({ ...formData, id: editingItem.id });
//     } else {
//       handleCreate(formData);
//     }
//   };

//   const openForm = (item = null) => {
//     setEditingItem(item);
//     setFormData(item ? { ...item } : {});
//     setShowForm(true);
//   };

//   const closeForm = () => {
//     setShowForm(false);
//     setEditingItem(null);
//     setFormData({});
//   };

//   const getTabDisplayName = () => {
//     return activeTab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header 
//         onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
//         isSidebarOpen={isSidebarOpen}
//       />

//       <div className="flex">
//         <Sidebar 
//           activeTab={activeTab}
//           onTabChange={setActiveTab}
//           isOpen={isSidebarOpen}
//           onClose={() => setIsSidebarOpen(false)}
//         />

//         <main className="flex-1 lg:ml-0 p-6">
//           {/* Alerts */}
//           {error && (
//             <Alert 
//               type="error" 
//               message={error} 
//               onClose={() => setError('')} 
//             />
//           )}
//           {success && (
//             <Alert 
//               type="success" 
//               message={success} 
//               onClose={() => setSuccess('')} 
//             />
//           )}

//           {/* Content Header */}
//           <div className="mb-8">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">{getTabDisplayName()}</h2>
//                 <p className="text-gray-600 mt-1">Manage {activeTab.replace('-', ' ')} in your railway system</p>
//               </div>
              
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={loadData}
//                   disabled={loading}
//                   className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
//                 >
//                   <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
//                   <span>Refresh</span>
//                 </button>
                
//                 <button
//                   onClick={() => openForm()}
//                   className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
//                 >
//                   <Plus size={16} />
//                   <span>Add New</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Records</p>
//                   <p className="text-2xl font-bold text-gray-900">{getCurrentData().length}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                   <Briefcase size={24} className="text-blue-600" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Active Items</p>
//                   <p className="text-2xl font-bold text-gray-900">{getCurrentData().length}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//                   <CheckCircle size={24} className="text-green-600" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Last Updated</p>
//                   <p className="text-2xl font-bold text-gray-900">Now</p>
//                 </div>
//                 <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
//                   <RefreshCw size={24} className="text-yellow-600" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Status</p>
//                   <p className="text-2xl font-bold text-green-600">Online</p>
//                 </div>
//                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Data Table */}
//           <DataTable 
//             data={getCurrentData()}
//             onEdit={openForm}
//             onDelete={handleDelete}
//             canDelete={canDelete()}
//             loading={loading}
//           />

//           {/* Form Modal */}
//           <FormModal
//             isOpen={showForm}
//             onClose={closeForm}
//             title={`${editingItem ? 'Edit' : 'Add'} ${getTabDisplayName()}`}
//             fields={getFormFields()}
//             formData={formData}
//             onChange={setFormData}
//             onSubmit={handleFormSubmit}
//             loading={loading}
//           />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { 
  User, Settings, Train, Calendar, Wrench, Eye, Trash2, Plus, Edit, 
  Building, Save, X, Users, Briefcase, Search, Filter, RefreshCw,
  ChevronDown, Bell, LogOut, Menu, Home, AlertCircle, CheckCircle, MapPin,
  Download, Upload, MoreVertical, Archive, FileText,Camera
} from 'lucide-react';
import { adminService } from '../../services/adminapi';

// Header Component
const Header = ({ onMenuToggle, isSidebarOpen }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
              <p className="text-sm text-gray-500">Management Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Sidebar Component
const Sidebar = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const navItems = [
    { id: 'users', label: 'Users', icon: User, category: 'Management' },
    { id: 'roles', label: 'Roles', icon: Settings, category: 'Management' },
    { id: 'departments', label: 'Departments', icon: Building, category: 'Management' },
    { id: 'operations', label: 'Operations', icon: Train, category: 'Operations' },
    { id: 'operation-lanes', label: 'Operation Lanes', icon: Train, category: 'Operations' },
    { id: 'timetable', label: 'Timetable', icon: Calendar, category: 'Operations' },
    { id: 'cleaning', label: 'Cleaning', icon: Wrench, category: 'Maintenance' },
    { id: 'cleaning-lanes', label: 'Cleaning Lanes', icon: Wrench, category: 'Maintenance' },
    { id: 'inspections', label: 'Inspections', icon: Eye, category: 'Quality' },
    { id: 'inspection-lanes', label: 'Inspection Lanes', icon: Eye, category: 'Quality' },
    { id: 'job-cards', label: 'Job Cards', icon: FileText, category: 'Quality' },
    { id: 'maintenance', label: 'Maintenance', icon: Settings, category: 'Maintenance' },
    { id: 'maintenance-lanes', label: 'Maintenance Lanes', icon: Settings, category: 'Maintenance' },
  ];

  const categories = [...new Set(navItems.map(item => item.category))];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200 lg:hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category}>
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {navItems
                      .filter(item => item.category === category)
                      .map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              onTabChange(item.id);
                              onClose();
                            }}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                              activeTab === item.id
                                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <Icon size={18} />
                            <span className="text-sm font-medium">{item.label}</span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

// Alert Component
const Alert = ({ type, message, onClose }) => {
  const icons = {
    error: AlertCircle,
    success: CheckCircle
  };
  
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };

  const Icon = icons[type];

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${styles[type]} mb-6`}>
      <div className="flex items-center space-x-2">
        <Icon size={20} />
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <X size={16} />
      </button>
    </div>
  );
};

// Job Cards Component
const JobCardsGrid = ({ data, onEdit, onDelete, canDelete, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading job cards...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-2">No job cards available</p>
          <p className="text-gray-400 text-sm">Job cards will appear here when created</p>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="mr-2" size={20} />
          Job Cards ({data.length})
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((jobCard, index) => {
          // Clean the photo URL by removing angle brackets if present
          const cleanPhotoUrl = jobCard.photo ? jobCard.photo.replace(/[<>]/g, '') : null;
          
          return (
            <div key={jobCard.id || index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              {/* Card Header with Photo */}
              <div className="relative h-48 bg-gray-100">
                {cleanPhotoUrl && cleanPhotoUrl !== 'http://example.com/photo.png' ? (
                  <img 
                    src={cleanPhotoUrl} 
                    alt="Job Card Photo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200" style={{display: (cleanPhotoUrl && cleanPhotoUrl !== 'http://example.com/photo.png') ? 'none' : 'flex'}}>
                  <div className="text-center">
                    <Camera size={32} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No Photo Available</p>
                  </div>
                </div>
                
                {/* Status Badge based on closed_at */}
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    jobCard.closed_at ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100'
                  }`}>
                    {jobCard.closed_at ? 'Closed' : 'Open'}
                  </span>
                </div>
                
                {/* Job Card ID Badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
                    #{jobCard.id}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <div className="space-y-4">
                  {/* Title/Description */}
                  {jobCard.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {jobCard.description}
                      </h3>
                    </div>
                  )}

                  {/* Key Information Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {/* Train Info */}
                    {jobCard.train && (
                      <div className="flex items-center space-x-2">
                        <Train size={16} className="text-gray-400" />
                        <div>
                          <p className="text-gray-500 text-xs">Train</p>
                          <p className="font-medium text-gray-900">
                            Train {jobCard.train}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Status Info */}
                    <div className="flex items-center space-x-2">
                      <AlertCircle size={16} className="text-gray-400" />
                      <div>
                        <p className="text-gray-500 text-xs">Status</p>
                        <p className={`font-medium capitalize ${
                          jobCard.closed_at ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {jobCard.closed_at ? 'Closed' : 'Open'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2 text-sm">
                    {jobCard.created_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Created:</span>
                        <span className="font-medium text-gray-900">
                          {formatDateTime(jobCard.created_at)}
                        </span>
                      </div>
                    )}
                    {jobCard.closed_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Closed:</span>
                        <span className="font-medium text-gray-900">
                          {formatDateTime(jobCard.closed_at)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Job Card ID */}
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Job Card ID:</span>
                      <span className="font-medium text-gray-900">#{jobCard.id}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    title="More options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Data Table Component
const DataTable = ({ data, onEdit, onDelete, canDelete, loading, activeTab }) => {
  // Use Job Cards Grid for job-cards tab
  if (activeTab === 'job-cards') {
    return <JobCardsGrid data={data} onEdit={onEdit} onDelete={onDelete} canDelete={canDelete} loading={loading} />;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-2">No data available</p>
          <p className="text-gray-400 text-sm">Start by creating your first entry</p>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    if (!status) return 'text-gray-600 bg-gray-100';
    switch (status.toLowerCase()) {
      case 'completed': case 'active': case 'online': return 'text-green-600 bg-green-100';
      case 'in-progress': case 'pending': return 'text-blue-600 bg-blue-100';
      case 'scheduled': case 'waiting': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderCellContent = (item, column) => {
    const value = item[column];
    
    // Handle datetime fields
    if (column.includes('time') || column.includes('date') || column.includes('Start') || column.includes('End') || column.includes('created') || column.includes('updated') || column === 'scheduledStart' || column === 'scheduledEnd' || column === 'enterd' || column === 'exited') {
      return (
        <span className="text-sm font-bold text-gray-900">
          {formatDateTime(value)}
        </span>
      );
    }
    
    // Handle status fields
    if (column.toLowerCase().includes('status') || column === 'active' || column === 'enabled') {
      const statusText = value ? (typeof value === 'boolean' ? (value ? 'Active' : 'Inactive') : String(value)) : 'Unknown';
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(statusText)}`}>
          {statusText}
        </span>
      );
    }
    
    // Handle ID fields with icons
    if (column.includes('id') || column.includes('Id') || column === 'train' || column === 'lane' || column === 'lane_number' || column === 'bay_number' || column === 'depot') {
      const icon = column.includes('train') ? <Train className="h-4 w-4 text-gray-400 mr-1" /> : 
                   (column.includes('lane') || column === 'lane_number' || column === 'bay_number') ? null :
                   column === 'depot' ? <Train className="h-4 w-4 text-gray-400 mr-1" /> :
                   <Briefcase className="h-4 w-4 text-gray-400 mr-1" />;
      return (
        <div className={icon ? "flex items-center" : ""}>
          {icon}
          <span className="text-sm font-bold text-gray-900">{value || '-'}</span>
        </div>
      );
    }
    
    // Handle email fields
    if (column === 'email' && value) {
      return (
        <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-800 text-sm">
          {value}
        </a>
      );
    }
    
    // Handle depot name specifically
    if (column === 'depot_name') {
      return (
        <div className="flex items-center">
          <Train className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm font-bold text-gray-900">{value || '-'}</span>
        </div>
      );
    }
    
    // Handle other name fields (but not depot_name)
    if ((column.includes('name') || column === 'username' || column === 'first_name' || column === 'last_name') && column !== 'depot_name') {
      return (
        <div className="flex items-center">
          <User className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm font-bold text-gray-900">{value || '-'}</span>
        </div>
      );
    }
    
    // Handle object data professionally
    if (typeof value === 'object' && value !== null) {
      // If it's an array, show count
      if (Array.isArray(value)) {
        return (
          <div className="text-sm text-gray-900">
            {value.length} items
          </div>
        );
      }
      // If it's an object with a name property, show the name
      if (value.name) {
        return (
          <span className="text-sm font-bold text-gray-900">
            {value.name}
          </span>
        );
      }
      // If it's an object with username property, show username
      if (value.username) {
        return (
          <span className="text-sm font-bold text-gray-900">
            {value.username}
          </span>
        );
      }
      // If it's an object with id and name, show formatted
      if (value.id && value.name) {
        return (
          <span className="text-sm font-bold text-gray-900">
            {value.name} <span className="text-gray-500">(#{value.id})</span>
          </span>
        );
      }
      // For other objects, show a generic representation
      return (
        <span className="text-sm font-bold text-gray-900">
          Object data
        </span>
      );
    }
    
    return (
      <span className="text-sm font-bold text-gray-900">
        {String(value || '-')}
      </span>
    );
  };

  const columns = Object.keys(data[0]).filter(key => key !== 'id');

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">{activeTab?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Entries</h2>
      </div>
      <div className="overflow-hidden">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column}
                  className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider break-words"
                >
                  {column === 'enterd' ? 'entered' : 
                   column === 'scheduledStart' ? 'scheduled start' :
                   column === 'scheduledEnd' ? 'scheduled end' :
                   column.replace(/_/g, ' ')}
                </th>
              ))}
              <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50">
                {columns.map((column) => {
                  const isDateField = column.includes('time') || column.includes('date') || column.includes('Start') || column.includes('End') || column === 'scheduledStart' || column === 'scheduledEnd' || column === 'enterd' || column === 'exited';
                  return (
                    <td key={column} className={`px-3 py-4 ${isDateField ? 'break-words' : 'truncate'}`}>
                      {renderCellContent(item, column)}
                    </td>
                  );
                })}
                <td className="px-3 py-4 text-sm font-medium w-32">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {canDelete && (
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Form Modal Component
const FormModal = ({ isOpen, onClose, title, fields, formData, onChange, onSubmit, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={onSubmit}>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
            {fields.map((field) => (
              <div key={field.key}>
                <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  id={field.key}
                  name={field.key}
                  type={field.type}
                  required={field.required}
                  value={formData[field.key] || ''}
                  onChange={(e) => onChange({ ...formData, [field.key]: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>{loading ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Main Dashboard Component
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for different entities
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [operations, setOperations] = useState([]);
  const [operationLanes, setOperationLanes] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [cleaning, setCleaning] = useState([]);
  const [cleaningLanes, setCleaningLanes] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [inspectionLanes, setInspectionLanes] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [maintenanceLanes, setMaintenanceLanes] = useState([]);
  const [jobCards, setJobCards] = useState([]);
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const handleError = (error) => {
    console.error('API Error:', error);
    setError(error.message || 'An error occurred');
    setTimeout(() => setError(''), 5000);
  };

  const handleSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      switch (activeTab) {
        case 'users':
          const usersData = await adminService.getUsers();
          setUsers(Array.isArray(usersData) ? usersData : []);
          break;
        case 'roles':
          const rolesData = await adminService.getRoles();
          setRoles(Array.isArray(rolesData) ? rolesData : []);
          break;
        case 'departments':
          const deptData = await adminService.getDepartments();
          setDepartments(Array.isArray(deptData) ? deptData : []);
          break;
        case 'operations':
          const opsData = await adminService.getOperations();
          setOperations(Array.isArray(opsData) ? opsData : []);
          break;
        case 'operation-lanes':
          const opLanesData = await adminService.getOperationLanes();
          setOperationLanes(Array.isArray(opLanesData) ? opLanesData : []);
          break;
        case 'timetable':
          const timetableData = await adminService.getTimetable();
          // Handle timetable data which might be an object with nested arrays
          if (timetableData && typeof timetableData === 'object') {
            const flattenedData = Object.values(timetableData).flat();
            setTimetable(Array.isArray(flattenedData) ? flattenedData : []);
          } else {
            setTimetable(Array.isArray(timetableData) ? timetableData : []);
          }
          break;
        case 'cleaning':
          const cleaningData = await adminService.getCleaningSchedules();
          setCleaning(Array.isArray(cleaningData) ? cleaningData : []);
          break;
        case 'cleaning-lanes':
          const cleanLanesData = await adminService.getCleaningLanes();
          setCleaningLanes(Array.isArray(cleanLanesData) ? cleanLanesData : []);
          break;
        case 'inspections':
          const inspectionData = await adminService.getInspections();
          setInspections(Array.isArray(inspectionData) ? inspectionData : []);
          break;
        case 'inspection-lanes':
          const inspectLanesData = await adminService.getInspectionLanes();
          setInspectionLanes(Array.isArray(inspectLanesData) ? inspectLanesData : []);
          break;
        case 'job-cards':
          const jobCardsData = await adminService.getJobCards();
          setJobCards(Array.isArray(jobCardsData) ? jobCardsData : []);
          break;
        case 'maintenance':
          const maintData = await adminService.getMaintenanceEntries();
          setMaintenance(Array.isArray(maintData) ? maintData : []);
          break;
        case 'maintenance-lanes':
          const maintLanesData = await adminService.getMaintenanceLanes();
          setMaintenanceLanes(Array.isArray(maintLanesData) ? maintLanesData : []);
          break;
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'users':
          await adminService.createUser(data);
          break;
        case 'roles':
          await adminService.createRole(data);
          break;
        case 'departments':
          await adminService.createDepartment(data);
          break;
        case 'operations':
          await adminService.createOperation(data);
          break;
        case 'operation-lanes':
          await adminService.createOperationLane(data);
          break;
        case 'timetable':
          await adminService.createTimetableEntry(data);
          break;
        case 'cleaning':
          await adminService.createCleaningEntry(data);
          break;
        case 'cleaning-lanes':
          await adminService.createCleaningLane(data);
          break;
        case 'inspections':
          await adminService.createInspectionEntry(data);
          break;
        case 'inspection-lanes':
          await adminService.createInspectionLane(data);
          break;
        case 'maintenance':
          await adminService.createMaintenanceEntry(data);
          break;
        case 'maintenance-lanes':
          await adminService.createMaintenanceLane(data);
          break;
      }
      handleSuccess('Item created successfully');
      setShowForm(false);
      setFormData({});
      loadData();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'users':
          await adminService.updateUser(data);
          break;
        case 'roles':
          await adminService.updateRole(data);
          break;
        case 'departments':
          await adminService.updateDepartment(data);
          break;
        case 'operations':
          await adminService.updateOperation(data);
          break;
        case 'operation-lanes':
          await adminService.updateOperationLane(data);
          break;
        case 'timetable':
          await adminService.updateTimetableEntry(data);
          break;
        case 'cleaning':
          await adminService.updateCleaningEntry(data);
          break;
        case 'cleaning-lanes':
          await adminService.updateCleaningLane(data);
          break;
        case 'inspections':
          await adminService.updateInspectionEntry(data);
          break;
        case 'inspection-lanes':
          await adminService.updateInspectionLane(data);
          break;
        case 'maintenance':
          await adminService.updateMaintenanceEntry(data);
          break;
        case 'maintenance-lanes':
          await adminService.updateMaintenanceLane(data);
          break;
      }
      handleSuccess('Item updated successfully');
      setShowForm(false);
      setEditingItem(null);
      setFormData({});
      loadData();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    setLoading(true);
    try {
      switch (activeTab) {
        case 'operations':
          await adminService.deleteOperation(id);
          break;
        case 'operation-lanes':
          await adminService.deleteOperationLane(id);
          break;
        case 'timetable':
          await adminService.deleteTimetableEntry(id);
          break;
        case 'cleaning':
          await adminService.deleteCleaningEntry(id);
          break;
        case 'cleaning-lanes':
          await adminService.deleteCleaningLane(id);
          break;
        case 'inspections':
          await adminService.deleteInspectionEntry(id);
          break;
        case 'inspection-lanes':
          await adminService.deleteInspectionLane(id);
          break;
        case 'maintenance':
          await adminService.deleteMaintenanceEntry(id);
          break;
        case 'maintenance-lanes':
          await adminService.deleteMaintenanceLane(id);
          break;
        default:
          throw new Error('Delete not supported for this entity');
      }
      handleSuccess('Item deleted successfully');
      loadData();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'users': return users;
      case 'roles': return roles;
      case 'departments': return departments;
      case 'operations': return operations;
      case 'operation-lanes': return operationLanes;
      case 'timetable': return timetable;
      case 'cleaning': return cleaning;
      case 'cleaning-lanes': return cleaningLanes;
      case 'inspections': return inspections;
      case 'inspection-lanes': return inspectionLanes;
      case 'job-cards': return jobCards;
      case 'maintenance': return maintenance;
      case 'maintenance-lanes': return maintenanceLanes;
      default: return [];
    }
  };

  const getFormFields = () => {
    switch (activeTab) {
      case 'users':
        return [
          { key: 'username', label: 'Username', type: 'text', required: true },
          { key: 'password', label: 'Password', type: 'password', required: !editingItem },
          { key: 'first_name', label: 'First Name', type: 'text' },
          { key: 'last_name', label: 'Last Name', type: 'text' },
          { key: 'email', label: 'Email', type: 'email' },
          { key: 'department', label: 'Department ID', type: 'number' },
          { key: 'designation', label: 'Designation ID', type: 'number' },
          { key: 'depot', label: 'Depot ID', type: 'number' },
        ];
      case 'roles':
        return [
          { key: 'name', label: 'Role Name', type: 'text', required: true },
        ];
      case 'departments':
        return [
          { key: 'name', label: 'Department Name', type: 'text', required: true },
        ];
      case 'operations':
        return [
          { key: 'lane', label: 'Lane ID', type: 'number', required: true },
          { key: 'train', label: 'Train ID', type: 'number', required: true },
          { key: 'scheduledStart', label: 'Scheduled Start', type: 'datetime-local' },
          { key: 'scheduledEnd', label: 'Scheduled End', type: 'datetime-local' },
          { key: 'enterd', label: 'Entered', type: 'datetime-local' },
          { key: 'exited', label: 'Exited', type: 'datetime-local' },
        ];
      case 'operation-lanes':
        return [
          { key: 'lane_number', label: 'Lane Number', type: 'number', required: true },
          { key: 'depot', label: 'Depot ID', type: 'number', required: true },
        ];
      case 'timetable':
        return [
          { key: 'date', label: 'Date', type: 'date', required: true },
          { key: 'train_number', label: 'Train Number', type: 'text' },
          { key: 'starting_point', label: 'Starting Point', type: 'text' },
          { key: 'starting_time', label: 'Starting Time', type: 'datetime-local' },
          { key: 'ending_point', label: 'Ending Point', type: 'text' },
          { key: 'ending_time', label: 'Ending Time', type: 'datetime-local' },
          { key: 'train_id', label: 'Train ID', type: 'number' },
        ];
      case 'cleaning':
        return [
          { key: 'lane', label: 'Lane ID', type: 'number', required: true },
          { key: 'train', label: 'Train ID', type: 'number', required: true },
          { key: 'scheduledStart', label: 'Scheduled Start', type: 'datetime-local' },
          { key: 'scheduledEnd', label: 'Scheduled End', type: 'datetime-local' },
          { key: 'enterd', label: 'Entered', type: 'datetime-local' },
          { key: 'exited', label: 'Exited', type: 'datetime-local' },
        ];
      case 'cleaning-lanes':
        return [
          { key: 'bay_number', label: 'Bay Number', type: 'number', required: true },
          { key: 'depot', label: 'Depot ID', type: 'number', required: true },
        ];
      case 'inspections':
        return [
          { key: 'lane', label: 'Lane ID', type: 'number', required: true },
          { key: 'train', label: 'Train ID', type: 'number', required: true },
          { key: 'scheduledStart', label: 'Scheduled Start', type: 'datetime-local' },
          { key: 'scheduledEnd', label: 'Scheduled End', type: 'datetime-local' },
          { key: 'enterd', label: 'Entered', type: 'datetime-local' },
          { key: 'exited', label: 'Exited', type: 'datetime-local' },
        ];
      case 'inspection-lanes':
        return [
          { key: 'lane_number', label: 'Lane Number', type: 'number', required: true },
          { key: 'depot', label: 'Depot ID', type: 'number', required: true },
        ];
      case 'maintenance':
        return [
          { key: 'lane', label: 'Lane ID', type: 'number', required: true },
          { key: 'train', label: 'Train ID', type: 'number', required: true },
          { key: 'scheduledStart', label: 'Scheduled Start', type: 'datetime-local' },
          { key: 'scheduledEnd', label: 'Scheduled End', type: 'datetime-local' },
          { key: 'enterd', label: 'Entered', type: 'datetime-local' },
          { key: 'exited', label: 'Exited', type: 'datetime-local' },
        ];
      case 'maintenance-lanes':
        return [
          { key: 'lane_number', label: 'Lane Number', type: 'number', required: true },
          { key: 'depot', label: 'Depot ID', type: 'number', required: true },
        ];
      default:
        return [];
    }
  };

  const canDelete = () => {
    return ['operations', 'operation-lanes', 'timetable', 'cleaning', 'cleaning-lanes', 
            'inspections', 'inspection-lanes', 'maintenance', 'maintenance-lanes'].includes(activeTab);
  };

  const canCreate = () => {
    // Job cards are read-only, cannot be created from this interface
    return activeTab !== 'job-cards';
  };

  const canEdit = () => {
    // Job cards are read-only, cannot be edited from this interface
    return activeTab !== 'job-cards';
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      handleUpdate({ ...formData, id: editingItem.id });
    } else {
      handleCreate(formData);
    }
  };

  const openForm = (item = null) => {
    setEditingItem(item);
    setFormData(item ? { ...item } : {});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({});
  };

  const getTabDisplayName = () => {
    return activeTab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getActiveCount = (data) => {
    if (!Array.isArray(data)) return 0;
    // You can add logic here to count active items based on status fields
    return data.length;
  };

  const getLastUpdated = () => {
    return new Date().toLocaleString();
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex">
        <Sidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 lg:ml-0 p-6">
          {/* Alerts */}
          {error && (
            <Alert 
              type="error" 
              message={error} 
              onClose={() => setError('')} 
            />
          )}
          {success && (
            <Alert 
              type="success" 
              message={success} 
              onClose={() => setSuccess('')} 
            />
          )}

          {/* Content Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{getTabDisplayName()}</h2>
                <p className="text-gray-600 mt-1">Manage {activeTab.replace('-', ' ')} in your railway system</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={loadData}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>
                
                <button
                  onClick={() => openForm()}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus size={16} />
                  <span>Add New</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">{getCurrentData().length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Items</p>
                  <p className="text-2xl font-bold text-gray-900">{getActiveCount(getCurrentData())}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Updated</p>
                  <p className="text-sm font-bold text-gray-900">{getLastUpdated()}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <RefreshCw size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-2xl font-bold text-green-600">Online</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <DataTable 
            data={getCurrentData()}
            onEdit={openForm}
            onDelete={handleDelete}
            canDelete={canDelete()}
            loading={loading}
            activeTab={activeTab}
          />

          {/* Form Modal */}
          <FormModal
            isOpen={showForm}
            onClose={closeForm}
            title={`${editingItem ? 'Edit' : 'Add'} ${getTabDisplayName()}`}
            fields={getFormFields()}
            formData={formData}
            onChange={setFormData}
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;