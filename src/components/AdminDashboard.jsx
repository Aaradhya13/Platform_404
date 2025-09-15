import React, { useState, useEffect } from 'react';
import { User, Settings, Train, Calendar, Wrench, Eye, Trash2, Plus, Edit, Building, UserPlus, Save, X, Users, Briefcase } from 'lucide-react';

// Import your adminService
// import { adminService } from './adminapi.js';

// For demo purposes, assuming adminService is available globally or imported
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Navigation items
  const navItems = [
    { id: 'users', label: 'Users', icon: User },
    { id: 'roles', label: 'Roles', icon: Settings },
    { id: 'departments', label: 'Departments', icon: Building },
    { id: 'operations', label: 'Operations', icon: Train },
    { id: 'operation-lanes', label: 'Operation Lanes', icon: Train },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'cleaning', label: 'Cleaning', icon: Wrench },
    { id: 'cleaning-lanes', label: 'Cleaning Lanes', icon: Wrench },
    { id: 'inspections', label: 'Inspections', icon: Eye },
    { id: 'inspection-lanes', label: 'Inspection Lanes', icon: Eye },
    { id: 'maintenance', label: 'Maintenance', icon: Settings },
    { id: 'maintenance-lanes', label: 'Maintenance Lanes', icon: Settings },
  ];

  // Generic error handler
  const handleError = (error) => {
    console.error('API Error:', error);
    setError(error.message || 'An error occurred');
    setTimeout(() => setError(''), 5000);
  };

  // Generic success handler
  const handleSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  // Load data based on active tab
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
          setUsers(usersData);
          break;
        case 'roles':
          const rolesData = await adminService.getRoles();
          setRoles(rolesData);
          break;
        case 'departments':
          const deptData = await adminService.getDepartments();
          setDepartments(deptData);
          break;
        case 'operations':
          const opsData = await adminService.getOperations();
          setOperations(opsData);
          break;
        case 'operation-lanes':
          const opLanesData = await adminService.getOperationLanes();
          setOperationLanes(opLanesData);
          break;
        case 'timetable':
          const timetableData = await adminService.getTimetable();
          setTimetable(Object.values(timetableData).flat());
          break;
        case 'cleaning':
          const cleaningData = await adminService.getCleaningSchedules();
          setCleaning(cleaningData);
          break;
        case 'cleaning-lanes':
          const cleanLanesData = await adminService.getCleaningLanes();
          setCleaningLanes(cleanLanesData);
          break;
        case 'inspections':
          const inspectionData = await adminService.getInspections();
          setInspections(inspectionData);
          break;
        case 'inspection-lanes':
          const inspectLanesData = await adminService.getInspectionLanes();
          setInspectionLanes(inspectLanesData);
          break;
        case 'maintenance':
          const maintData = await adminService.getMaintenanceEntries();
          setMaintenance(maintData);
          break;
        case 'maintenance-lanes':
          const maintLanesData = await adminService.getMaintenanceLanes();
          setMaintenanceLanes(maintLanesData);
          break;
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Generic create handler
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

  // Generic update handler
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

  // Generic delete handler
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
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

  // Get current data based on active tab
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
      case 'maintenance': return maintenance;
      case 'maintenance-lanes': return maintenanceLanes;
      default: return [];
    }
  };

  // Get form fields based on entity type
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Railway Admin Dashboard</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Alerts */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Content Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
            <button
              onClick={() => openForm()}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span>Add New</span>
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}

          {/* Data Table */}
          {!loading && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {getCurrentData().length > 0 && Object.keys(getCurrentData()[0]).map((key) => (
                        <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {key.replace(/_/g, ' ')}
                        </th>
                      ))}
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getCurrentData().map((item, index) => (
                      <tr key={item.id || index} className="hover:bg-gray-50">
                        {Object.entries(item).map(([key, value]) => (
                          <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {typeof value === 'object' && value !== null 
                              ? JSON.stringify(value) 
                              : String(value || '')
                            }
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => openForm(item)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                          >
                            <Edit size={16} />
                          </button>
                          {['operations', 'operation-lanes', 'timetable', 'cleaning', 'cleaning-lanes', 
                            'inspections', 'inspection-lanes', 'maintenance', 'maintenance-lanes'].includes(activeTab) && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-900 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {getCurrentData().length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          )}

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-screen overflow-y-auto">
                <form onSubmit={handleFormSubmit} className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingItem ? 'Edit' : 'Add'} {activeTab.replace('-', ' ')}
                    </h3>
                    <button
                      type="button"
                      onClick={closeForm}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {getFormFields().map((field) => (
                      <div key={field.key}>
                        <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          id={field.key}
                          name={field.key}
                          type={field.type}
                          required={field.required}
                          value={formData[field.key] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Save size={16} />
                      <span>{editingItem ? 'Update' : 'Create'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;