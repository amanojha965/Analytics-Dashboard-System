import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import MetricCard from './components/MetricCard';
import { RevenueTrendChart, FulfillmentChart, CategoryChart } from './components/Charts';

const API_URL = 'http://localhost:8000';

function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: {
      "Total Orders": 0,
      "Total Revenue": 0,
      "Total Delayed Orders": 0,
      "Average Delivery Days": 0,
      "Delivery Success Rate": "0%"
    },
    revenueTrend: [],
    categoryBreakdown: [],
    fulfillmentMetrics: []
  });

  const [filters, setFilters] = useState({
    category: 'All',
    deliveryStatus: 'All',
    startDate: '',
    endDate: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category !== 'All') params.append('category', filters.category);
      if (filters.deliveryStatus !== 'All') params.append('deliveryStatus', filters.deliveryStatus);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(`${API_URL}/analytics/summary?${params.toString()}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500/30">
      <Navbar loading={loading} onRefresh={fetchData} />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {loading && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Revenue" 
            value={`$${data.summary["Total Revenue"].toLocaleString()}`} 
            icon={<TrendingUp size={24} />} 
            color="from-green-500/20 to-emerald-500/5" 
            textColor="text-emerald-400" 
          />
          <MetricCard 
            title="Total Orders" 
            value={data.summary["Total Orders"]} 
            icon={<Package size={24} />} 
            color="from-blue-500/20 to-indigo-500/5" 
            textColor="text-blue-400" 
          />
          <MetricCard 
            title="Delayed Orders" 
            value={data.summary["Total Delayed Orders"]} 
            icon={<AlertTriangle size={24} />} 
            color="from-orange-500/20 to-red-500/5" 
            textColor="text-orange-400" 
          />
          <MetricCard 
            title="Success Rate" 
            value={data.summary["Delivery Success Rate"]} 
            icon={<CheckCircle size={24} />} 
            color="from-purple-500/20 to-pink-500/5" 
            textColor="text-purple-400" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RevenueTrendChart data={data.revenueTrend} />
          <FulfillmentChart data={data.fulfillmentMetrics} />
          <CategoryChart data={data.categoryBreakdown} />
        </div>
      </main>
    </div>
  );
}

export default App;
