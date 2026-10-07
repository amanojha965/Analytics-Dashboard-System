import React, { useRef, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// Common Chart.js styling options for dark theme
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#94a3b8',
        font: { family: "'Inter', sans-serif", size: 12 }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleColor: '#f1f5f9',
      bodyColor: '#cbd5e1',
      borderColor: 'rgba(51, 65, 85, 0.5)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: '#64748b',
        font: { family: "'Inter', sans-serif" }
      }
    },
    y: {
      grid: {
        color: 'rgba(51, 65, 85, 0.3)',
        drawBorder: false,
      },
      ticks: {
        color: '#64748b',
        font: { family: "'Inter', sans-serif" },
        callback: function(value) {
          return '$' + value.toLocaleString();
        }
      }
    }
  }
};

export function RevenueTrendChart({ data }) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ datasets: [] });

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    // Create Gradient for Line Chart
    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)'); // Indigo-500
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    setChartData({
      labels: data.map(d => d.order_date),
      datasets: [
        {
          label: 'Revenue',
          data: data.map(d => d.revenue),
          borderColor: '#6366f1',
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.4, // Smooth curves
          pointRadius: 0, // Hide points
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: '#6366f1',
          pointHoverBorderWidth: 2,
        }
      ]
    });
  }, [data]);

  return (
    <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 relative z-10 text-slate-100">
        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
        Revenue Trend
      </h2>
      <div className="h-[300px] w-full relative z-10">
        <Line ref={chartRef} data={chartData} options={commonOptions} />
      </div>
    </div>
  );
}

export function FulfillmentChart({ data }) {
  const chartData = {
    labels: data.map(d => d.status),
    datasets: [
      {
        data: data.map(d => d.count),
        backgroundColor: [
          '#10b981', // Delivered (Emerald)
          '#f59e0b', // Delayed (Amber)
          '#3b82f6', // In Transit (Blue)
        ],
        hoverBackgroundColor: [
          '#059669',
          '#d97706',
          '#2563eb',
        ],
        borderWidth: 0,
        hoverOffset: 4,
      }
    ]
  };

  const options = {
    ...commonOptions,
    scales: { x: { display: false }, y: { display: false } },
    cutout: '75%',
    plugins: {
      ...commonOptions.plugins,
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          usePointStyle: true,
          padding: 20,
          font: { family: "'Inter', sans-serif", size: 12 }
        }
      }
    }
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 relative z-10 text-slate-100">
        <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]"></span>
        Fulfillment Status
      </h2>
      <div className="h-[300px] w-full relative z-10 flex items-center justify-center">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}

export function CategoryChart({ data }) {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  const chartData = {
    labels: data.map(d => d.Category),
    datasets: [
      {
        label: 'Revenue',
        data: data.map(d => d.revenue),
        backgroundColor: data.map((_, i) => colors[i % colors.length]),
        borderRadius: 6, // Rounded corners on bars!
        borderSkipped: false,
        barPercentage: 0.6,
      }
    ]
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        display: false // Hide legend for bar chart since x-axis has labels
      }
    }
  };

  return (
    <div className="lg:col-span-3 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-black/20 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 relative z-10 text-slate-100">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
        Revenue by Category
      </h2>
      <div className="h-[300px] w-full relative z-10">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
