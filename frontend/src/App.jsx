import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import FilterBar from './components/FilterBar';
import MetricCard from './components/MetricCard';
import { RevenueTrendChart, FulfillmentChart, CategoryChart } from './components/Charts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
    <div className="min-h-screen bg-[#F8F9FA] text-[#67748E] font-sans selection:bg-[#cb0c9f]/30 flex">
      <Sidebar />
      
      <main className="flex-1 max-w-[1400px] w-full px-6 py-4 mx-auto relative overflow-x-hidden">
        <Navbar loading={loading} onRefresh={fetchData} />

        {loading && (
          <div className="absolute inset-0 bg-[#F8F9FA]/60 backdrop-blur-sm z-40 flex items-center justify-center rounded-2xl mx-6 mt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cb0c9f]"></div>
          </div>
        )}

        <div className="space-y-6 mt-6">
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Today's Money" 
              value={`$${data.summary["Total Revenue"].toLocaleString()}`} 
              percentage="+55%"
              iconName="wallet"
            />
            <MetricCard 
              title="Today's Users" 
              value={data.summary["Total Orders"]} 
              percentage="+3%"
              iconName="globe"
            />
            <MetricCard 
              title="New Clients" 
              value={data.summary["Total Delayed Orders"]} 
              percentage="-2%"
              percentageColor="text-red-500"
              iconName="file"
            />
            <MetricCard 
              title="Sales" 
              value={data.summary["Delivery Success Rate"]} 
              percentage="+5%"
              iconName="cart"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CategoryChart data={data.categoryBreakdown} />
            <RevenueTrendChart data={data.revenueTrend} />
            <FulfillmentChart data={data.fulfillmentMetrics} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
