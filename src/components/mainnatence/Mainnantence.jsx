import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Mainnantence() {
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
        <h1 className="text-2xl font-bold">Maintenance Management</h1>
        <p>Maintenance functionality coming soon...</p>
        <button onClick={() => navigate('/maintenance/dashboard')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        Go to Maintenance Dashboard
      </button>
      </div>
    </div>
  )
}
