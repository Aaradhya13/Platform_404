import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function Inspection() {
  const nav= useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <button
          onClick={() => nav('/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
      <div>
        <h1 className="text-2xl font-bold">Inspection Management</h1>
        <p>Inspection functionality coming soon...</p>
        <button onClick={() => nav('/inspectiondashboard')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        Go to Inspection Dashboard
      </button>
      </div>
    </div>
  )
}
