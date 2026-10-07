import React, { useMemo, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const COLORS = {
  primary: '#cb0c9f',
  info: '#17c1e8',
  success: '#82d616',
  warning: '#fbcf33',
  danger: '#ea0606',
  dark: '#344767',
  gray: '#67748E'
};

const CATEGORY_COLORS = [
  COLORS.primary,
  COLORS.info,
  COLORS.success,
  COLORS.warning,
  COLORS.danger,
];

const formatCurrency = (value) => {
  const number = Number(value) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(number);
};

const formatDate = (date) => {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
};

const normalizeData = (data) => Array.isArray(data) ? data : [];

const commonPlugins = {
  legend: {
    labels: {
      color: COLORS.gray,
      font: { family: "'Open Sans', sans-serif", size: 12 },
      usePointStyle: true,
      boxWidth: 8,
      padding: 18,
    },
  },
  tooltip: {
    backgroundColor: '#fff',
    titleColor: COLORS.dark,
    bodyColor: COLORS.gray,
    borderColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    padding: 12,
    cornerRadius: 8,
    displayColors: true,
    titleFont: { size: 13, weight: '600' },
    bodyFont: { size: 12 },
    boxShadow: '0 8px 26px -4px rgba(20,20,20,0.15)',
  },
};

const commonAnimation = { duration: 900, easing: 'easeOutQuart' };

const cartesianScales = {
  x: {
    border: { display: false },
    grid: { display: false },
    ticks: { color: '#9ca2b7', font: { family: "'Open Sans', sans-serif", size: 11 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
  },
  y: {
    border: { display: false },
    grid: { color: 'rgba(0, 0, 0, 0.03)', drawTicks: false, borderDash: [5, 5] },
    ticks: { color: '#9ca2b7', padding: 8, font: { family: "'Open Sans', sans-serif", size: 11 }, callback: (value) => formatCurrency(value) },
  },
};

function ChartEmptyState({ message = 'No data available' }) {
  return (
    <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center">
      <p className="text-sm font-medium text-gray-400">{message}</p>
    </div>
  );
}

function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <div className={`bg-white border-0 rounded-2xl p-5 sm:p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] relative h-full flex flex-col ${className}`}>
      <div className="mb-4">
        <h6 className="text-[#344767] font-bold text-base mb-1">{title}</h6>
        {subtitle && <p className="text-sm text-[#67748E] font-medium">{subtitle}</p>}
      </div>
      <div className="relative z-10 flex-1 w-full min-h-[280px]">
        {children}
      </div>
    </div>
  );
}

export function RevenueTrendChart({ data }) {
  const chartRef = useRef(null);
  const safeData = normalizeData(data);

  const chartData = useMemo(() => {
    return {
      labels: safeData.map((item) => formatDate(item.order_date)),
      datasets: [
        {
          label: 'Revenue',
          data: safeData.map((item) => Number(item.revenue) || 0),
          borderColor: COLORS.success,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(130, 214, 22, 0.1)';
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(130, 214, 22, 0.2)');
            gradient.addColorStop(1, 'rgba(130, 214, 22, 0)');
            return gradient;
          },
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: COLORS.success,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
          pointHitRadius: 15,
        },
      ],
    };
  }, [safeData]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    animation: commonAnimation,
    plugins: {
      ...commonPlugins,
      legend: { display: false },
      tooltip: { ...commonPlugins.tooltip, callbacks: { label: (c) => ` Revenue: ${formatCurrency(c.raw)}` } },
    },
    scales: cartesianScales,
  }), []);

  return (
    <ChartCard title="Daily Sales" subtitle="(+15%) increase in today sales." className="lg:col-span-2">
      {safeData.length === 0 ? <ChartEmptyState /> : <Line ref={chartRef} data={chartData} options={options} />}
    </ChartCard>
  );
}

export function FulfillmentChart({ data }) {
  const safeData = normalizeData(data);

  const chartData = useMemo(() => {
    const statusColors = {
      Delivered: COLORS.success,
      Delayed: COLORS.warning,
      'In Transit': COLORS.info,
      Cancelled: COLORS.danger,
      Pending: COLORS.gray,
    };
    return {
      labels: safeData.map((item) => item.status || 'Unknown'),
      datasets: [
        {
          data: safeData.map((item) => Number(item.count) || 0),
          backgroundColor: safeData.map((item, i) => statusColors[item.status] || CATEGORY_COLORS[i % CATEGORY_COLORS.length]),
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 4,
        },
      ],
    };
  }, [safeData]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    animation: commonAnimation,
    plugins: {
      ...commonPlugins,
      legend: { position: 'bottom', labels: { ...commonPlugins.legend.labels, padding: 20 } },
    },
  }), []);

  return (
    <ChartCard title="Orders Overview" subtitle="Fulfillment status breakdown">
      {safeData.length === 0 ? <ChartEmptyState /> : <Doughnut data={chartData} options={options} />}
    </ChartCard>
  );
}

export function CategoryChart({ data }) {
  const safeData = normalizeData(data);

  const chartData = useMemo(() => {
    return {
      labels: safeData.map((item) => item.Category || 'Unknown'),
      datasets: [
        {
          label: 'Revenue',
          data: safeData.map((item) => Number(item.revenue) || 0),
          backgroundColor: COLORS.dark,
          borderRadius: 4,
          borderSkipped: false,
          barPercentage: 0.5,
          maxBarThickness: 30,
        },
      ],
    };
  }, [safeData]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: commonAnimation,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      ...commonPlugins,
      legend: { display: false },
      tooltip: { ...commonPlugins.tooltip, callbacks: { label: (c) => ` Revenue: ${formatCurrency(c.raw)}` } },
    },
    scales: {
      ...cartesianScales,
      x: { ...cartesianScales.x, grid: { display: false } },
      y: { ...cartesianScales.y, grid: { color: 'rgba(0,0,0,0.03)', borderDash: [5, 5] } }
    },
  }), []);

  return (
    <ChartCard title="Website Views" subtitle="Revenue breakdown by category" className="lg:col-span-3">
      {safeData.length === 0 ? <ChartEmptyState /> : <Bar data={chartData} options={options} />}
    </ChartCard>
  );
}