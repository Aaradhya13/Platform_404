import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Train, Settings, Users, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const department = localStorage.getItem('department');

  const adminModules = [
    {
      title: 'Cleaning Management',
      description: 'Manage cleaning schedules, create entries, and manage lanes',
      icon: Train,
      color: 'bg-blue-600 hover:bg-blue-700',
      path: '/cleaning'
    },
    {
      title: 'Inspection Management',
      description: 'Manage train inspections and maintenance schedules',
      icon: Settings,
      color: 'bg-green-600 hover:bg-green-700',
      path: '/inspection'
    },
    {
      title: 'Operations Management',
      description: 'Manage daily operations and schedules',
      icon: BarChart3,
      color: 'bg-purple-600 hover:bg-purple-700',
      path: '/operations'
    },
    {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: Users,
      color: 'bg-orange-600 hover:bg-orange-700',
      path: '/users'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {username}!</h1>
        <p className="text-gray-600">Role: {userRole} | Department: {department}</p>
      </div>

      {userRole === 'admin' && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminModules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <div
                  key={index}
                  onClick={() => navigate(module.path)}
                  className="cursor-pointer transform transition-all duration-200 hover:scale-105"
                >
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md">
                    <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center mb-4 transition-colors`}>
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                    <p className="text-gray-600 text-sm">{module.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Active Schedules</h3>
            <p className="text-2xl font-bold text-blue-900">12</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Completed Today</h3>
            <p className="text-2xl font-bold text-green-900">8</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-600">Pending</h3>
            <p className="text-2xl font-bold text-yellow-900">4</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;