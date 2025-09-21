import React, { useState, useEffect } from 'react';
import { 
  Train, Calendar, Clock, Eye, MapPin, RefreshCw, 
  TrendingUp, Timer, AlertCircle, CheckCircle, 
  Zap, Activity, Users, DollarSign, Award
} from 'lucide-react';

// Import your existing admin service
import {adminService} from "../../services/adminapi";

const BrandingDealsComponent = () => {
  console.log("BrandingDealsComponent rendered");
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalDeals: 0,
    activeDeals: 0,
    totalExposure: 0,
    avgRuntime: 0
  });

  // Load branding deals data
  const loadBrandingDeals = async () => {
    console.log("Loading branding deals...");
    setLoading(true);
    setError('');
    
    try {
      console.log("Fetching branding deals...");
      const dealsData = await adminService.fetchBrandingDeals();
      console.log("Branding Deals Response:", dealsData);
      
      if (Array.isArray(dealsData)) {
        setDeals(dealsData);
        calculateStats(dealsData);
      } else {
        setDeals([]);
        console.warn("Expected array but got:", typeof dealsData);
      }
    } catch (err) {
      console.error("Error fetching branding deals:", err);
      setError(err.message || 'Failed to load branding deals');
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate various statistics
  const calculateStats = (dealsData) => {
    if (!Array.isArray(dealsData) || dealsData.length === 0) {
      setStats({ totalDeals: 0, activeDeals: 0, totalExposure: 0, avgRuntime: 0 });
      return;
    }

    const now = new Date();
    let activeCount = 0;
    let totalExposure = 0;
    let totalRuntime = 0;

    dealsData.forEach(deal => {
      if (deal.details) {
        const startDate = new Date(deal.details.start_date);
        const endDate = new Date(deal.details.end_date);
        
        // Check if deal is currently active
        if (now >= startDate && now <= endDate) {
          activeCount++;
        }
        
        // Sum up exposure values
        totalExposure += deal.details.exposure || 0;
        
        // Calculate runtime in days
        const runtimeMs = endDate - startDate;
        const runtimeDays = runtimeMs / (1000 * 60 * 60 * 24);
        totalRuntime += runtimeDays;
      }
    });

    const avgRuntime = dealsData.length > 0 ? totalRuntime / dealsData.length : 0;

    setStats({
      totalDeals: dealsData.length,
      activeDeals: activeCount,
      totalExposure,
      avgRuntime: Math.round(avgRuntime * 10) / 10
    });
  };

  // Calculate runtime for individual deal
  const calculateDealRuntime = (startDate, endDate) => {
    if (!startDate || !endDate) return { days: 0, hours: 0, status: 'Invalid dates' };
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    const totalMs = end - start;
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    let status = 'Completed';
    if (now < start) {
      status = 'Upcoming';
    } else if (now >= start && now <= end) {
      status = 'Active';
    }
    
    return {
      days: totalDays,
      hours: totalHours,
      status,
      totalDuration: `${totalDays}d ${totalHours}h`
    };
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  useEffect(() => {
    loadBrandingDeals();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#24B6C9] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading branding deals...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Error: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Branding Deals</h2>
          <p className="text-gray-600 mt-1">Monitor train branding campaigns and their performance</p>
        </div>
        <button
          onClick={loadBrandingDeals}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-[#24B6C9] text-white rounded-lg hover:bg-[#1fa5b8] transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDeals}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Award size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Deals</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeDeals}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Activity size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exposure</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalExposure.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Eye size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Runtime</p>
              <p className="text-2xl font-bold text-orange-600">{stats.avgRuntime} days</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Timer size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      {deals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Award size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Branding Deals Found</h3>
          <p className="text-gray-600">There are no branding deals to display at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {deals.map((deal) => {
            const runtime = deal.details ? calculateDealRuntime(deal.details.start_date, deal.details.end_date) : null;
            
            return (
              <div 
                key={`${deal.id}-${deal.trainset?.train_id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#24B6C9] to-[#1fa5b8] p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2">
                      <Train size={20} />
                      <span className="font-semibold">Train #{deal.trainset?.train_id || 'N/A'}</span>
                    </div>
                    {runtime && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(runtime.status)}`}>
                        {runtime.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Deal Name */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {deal.details?.name || 'Unknown Deal'}
                    </h3>
                    <p className="text-sm text-gray-600">Deal ID: #{deal.details?.id || deal.id}</p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Eye size={16} className="text-purple-600" />
                        <span className="text-xs font-medium text-purple-700">Exposure</span>
                      </div>
                      <p className="text-lg font-bold text-purple-900">
                        {deal.details?.exposure?.toLocaleString() || '0'}
                      </p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin size={16} className="text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">Distance</span>
                      </div>
                      <p className="text-lg font-bold text-blue-900">
                        {deal.trainset?.total_distance_travelled?.toLocaleString() || '0'} km
                      </p>
                    </div>
                  </div>

                  {/* Runtime Info */}
                  {runtime && (
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock size={16} className="text-orange-600" />
                        <span className="text-xs font-medium text-orange-700">Campaign Duration</span>
                      </div>
                      <p className="text-lg font-bold text-orange-900">{runtime.totalDuration}</p>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-2" />
                      <span>Start: {formatDate(deal.details?.start_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-2" />
                      <span>End: {formatDate(deal.details?.end_date)}</span>
                    </div>
                  </div>

                  {/* Service Info */}
                  {deal.trainset?.distance_travelled_since_last_service && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Distance since service: {deal.trainset.distance_travelled_since_last_service.toLocaleString()} km
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrandingDealsComponent;