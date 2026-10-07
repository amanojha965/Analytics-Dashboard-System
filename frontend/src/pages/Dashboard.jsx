import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FilterBar from '../components/FilterBar';
import MetricCard from '../components/MetricCard';
import { RevenueTrendChart, FulfillmentChart, CategoryChart } from '../components/Charts';
import { Download, RefreshCw } from 'lucide-react';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category !== 'All') params.append('category', filters.category);
      if (filters.deliveryStatus !== 'All') params.append('deliveryStatus', filters.deliveryStatus);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await api.get(`/analytics/summary?${params.toString()}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchData();
      }, 30000); // 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const downloadReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Orders,${data.summary["Total Orders"]}\n`
      + `Total Revenue,${data.summary["Total Revenue"]}\n`
      + `Delayed Orders,${data.summary["Total Delayed Orders"]}\n`
      + `Delivery Success Rate,${data.summary["Delivery Success Rate"]}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#67748E] font-sans selection:bg-[#cb0c9f]/30 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 max-w-[1400px] w-full px-4 sm:px-6 py-4 mx-auto relative overflow-x-hidden">
        <Navbar loading={loading} onRefresh={fetchData} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {loading && (
          <div className="absolute inset-0 bg-[#F8F9FA]/60 backdrop-blur-sm z-40 flex items-center justify-center rounded-2xl mx-6 mt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cb0c9f]"></div>
          </div>
        )}

        <div className="space-y-6 mt-6">
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
            <div className="w-full lg:w-auto flex-1">
              <FilterBar filters={filters} onFilterChange={handleFilterChange} />
            </div>
            
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border-0 h-full w-full lg:w-auto justify-between sm:justify-start">
              <button 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all flex-1 sm:flex-none justify-center ${autoRefresh ? 'bg-[#cb0c9f]/10 text-[#cb0c9f]' : 'text-[#67748E] hover:bg-gray-50'}`}
              >
                <RefreshCw size={16} className={autoRefresh ? "animate-spin-slow" : ""} />
                <span className="hidden sm:inline">{autoRefresh ? 'Auto Sync On' : 'Auto Sync Off'}</span>
                <span className="sm:hidden">Sync</span>
              </button>
              
              <div className="w-px h-8 bg-gray-200"></div>
              
              <button 
                onClick={downloadReport}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#141727] text-white rounded-lg text-sm font-bold hover:bg-[#252f40] transition-colors shadow-sm flex-1 sm:flex-none"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
          </div>

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

export default Dashboard;
