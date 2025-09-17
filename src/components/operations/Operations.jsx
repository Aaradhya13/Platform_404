import React from 'react'
import { useNavigate } from 'react-router-dom'
import OperationsDashboard from './Operationdashboard';
export default function Operations() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
      <div>
        <h1 className="text-2xl font-bold">Operations Management</h1>
        <p>Operations functionality coming soon...</p>
      </div>
      <button onClick={() => navigate('/operationdashboard')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        Go to Operations Dashboard
      </button>
    </div>
  )
}
