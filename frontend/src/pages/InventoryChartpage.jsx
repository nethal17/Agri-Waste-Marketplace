import React, { useState, useEffect } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { FiPackage, FiTrendingUp, FiAlertCircle, FiRefreshCw, FiFilter, FiSearch } from 'react-icons/fi';

Chart.register(...registerables);

const InventoryChartpage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [existingWasteTypes] = useState([
    { type: 'Crop Residue', quantity: 1200 },
    { type: 'Animal Manure', quantity: 800 },
    { type: 'Food Waste', quantity: 650 },
    { type: 'Agri Plastics', quantity: 420 },
    { type: 'Processing Waste', quantity: 350 },
  ]);

  // Sample data for charts
  const pieData = {
    labels: existingWasteTypes.map(item => item.type),
    datasets: [
      {
        data: existingWasteTypes.map(item => item.quantity),
        backgroundColor: [
          '#4F46E5',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Waste Collected',
        data: [1200, 1900, 1500, 2000, 1800, 2200],
        backgroundColor: '#4F46E5',
        borderRadius: 6,
      },
      {
        label: 'Waste Processed',
        data: [800, 1200, 1000, 1500, 1300, 1800],
        backgroundColor: '#10B981',
        borderRadius: 6,
      },
    ],
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Inventory Value ($)',
        data: [4500, 5200, 4800, 6000],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const stats = [
    { title: 'Total Inventory', value: '3,420 KG', icon: <FiPackage className="text-indigo-500" />, change: '+12%' },
    { title: 'Recycling Rate', value: '78%', icon: <FiTrendingUp className="text-green-500" />, change: '+5%' },
    { title: 'Low Stock Items', value: '4', icon: <FiAlertCircle className="text-yellow-500" />, change: '-2' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Inventory Management</h1>
            <p className="text-gray-600">Monitor and manage agricultural waste inventory</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center">
              <FiRefreshCw className="mr-2" /> Refresh Data
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('details')}
          >
            Detailed View
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'alerts' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('alerts')}
          >
            Alerts
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-3">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50">
              <FiFilter className="mr-2" /> Filters
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change} from last {timeRange}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Waste Distribution</h2>
              <select className="text-sm border-none bg-gray-100 rounded px-2 py-1">
                <option>By Quantity</option>
                <option>By Value</option>
              </select>
            </div>
            <div className="h-64 md:h-80 relative">
              <Pie 
                data={pieData} 
                options={{
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: ${context.raw} KG`;
                        }
                      },
                      displayColors: false,
                      backgroundColor: '#4B5563',
                      titleFont: { size: 14, weight: 'bold' },
                      bodyFont: { size: 10 },
                      padding: 12,
                      cornerRadius: 8
                    },
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 12,
                        padding: 16,
                        font: {
                          size: 12,
                          family: 'Inter'
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                      }
                    }
                  },
                  elements: {
                    arc: {
                      borderWidth: 0,
                      borderColor: '#fff'
                    }
                  },
                  cutout: '40%',
                  maintainAspectRatio: false
                }}
              />
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:col-span-2 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Collection vs Processing</h2>
              <select className="text-sm border-none bg-gray-100 rounded px-2 py-1">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Quarterly</option>
              </select>
            </div>
            <div className="h-64 md:h-80">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      beginAtZero: true,
                      grid: {
                        drawBorder: false
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Inventory Value Trend</h2>
              <select className="text-sm border-none bg-gray-100 rounded px-2 py-1">
                <option>Last 4 Weeks</option>
                <option>Last 8 Weeks</option>
              </select>
            </div>
            <div className="h-64">
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      grid: {
                        drawBorder: false
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-start pb-3 border-b border-gray-100 last:border-0">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <FiPackage className="text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Crop Residue Added</h3>
                      <span className="text-sm text-gray-500">2h ago</span>
                    </div>
                    <p className="text-sm text-gray-600">Added 250 KG to inventory</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryChartpage;