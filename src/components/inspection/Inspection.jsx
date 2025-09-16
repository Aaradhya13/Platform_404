import React from 'react'
import { useNavigate } from 'react-router-dom'
import InspectionAnalytics from './InspectionAnalytics'

export default function Inspection() {
  const nav = useNavigate();
  
  const handleNavigateToJobCards = () => {
    nav('/inspection/jobcard');
  };
  
  return (
    <div className="space-y-6">
      <InspectionAnalytics onNavigateToJobCards={handleNavigateToJobCards} />
    </div>
  )
}
