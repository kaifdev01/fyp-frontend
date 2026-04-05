'use client';
import { useState, useEffect } from 'react';
import ClientHeader from '../../../components/ClientHeader';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { BarChart3, TrendingUp, Download, Filter, Calendar, DollarSign, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const MOCK_SPENDING_DATA = [
  { month: 'Jan', amount: 2500 },
  { month: 'Feb', amount: 3200 },
  { month: 'Mar', amount: 2800 },
  { month: 'Apr', amount: 4100 },
  { month: 'May', amount: 3600 },
  { month: 'Jun', amount: 4500 }
];

const MOCK_PROJECT_PERFORMANCE = [
  {
    id: 1,
    name: 'React Dashboard Development',
    status: 'completed',
    budget: 2500,
    spent: 2200,
    timeline: 'On Time',
    quality: 4.8,
    freelancer: 'John Developer'
  },
  {
    id: 2,
    name: 'Mobile App UI Design',
    status: 'in-progress',
    budget: 1500,
    spent: 750,
    timeline: 'On Track',
    quality: 4.9,
    freelancer: 'Sarah Designer'
  },
  {
    id: 3,
    name: 'Backend API Development',
    status: 'in-progress',
    budget: 5000,
    spent: 2700,
    timeline: 'On Track',
    quality: 4.7,
    freelancer: 'Mike Backend'
  },
  {
    id: 4,
    name: 'WordPress Website Redesign',
    status: 'completed',
    budget: 1200,
    spent: 1200,
    timeline: 'Early',
    quality: 4.6,
    freelancer: 'David Developer'
  }
];

const MOCK_FREELANCER_STATS = [
  {
    id: 1,
    name: 'John Developer',
    projects: 3,
    rating: 4.8,
    totalEarned: 7500,
    onTimeDelivery: 100,
    repeatHire: true
  },
  {
    id: 2,
    name: 'Sarah Designer',
    projects: 2,
    rating: 4.9,
    totalEarned: 3200,
    onTimeDelivery: 100,
    repeatHire: true
  },
  {
    id: 3,
    name: 'Mike Backend',
    projects: 2,
    rating: 4.7,
    totalEarned: 5800,
    onTimeDelivery: 95,
    repeatHire: true
  },
  {
    id: 4,
    name: 'David Developer',
    projects: 1,
    rating: 4.6,
    totalEarned: 1200,
    onTimeDelivery: 100,
    repeatHire: false
  }
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('spending');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  const maxSpending = Math.max(...MOCK_SPENDING_DATA.map(d => d.amount));
  const totalSpending = MOCK_SPENDING_DATA.reduce((sum, d) => sum + d.amount, 0);
  const avgSpending = Math.round(totalSpending / MOCK_SPENDING_DATA.length);

  const completedProjects = MOCK_PROJECT_PERFORMANCE.filter(p => p.status === 'completed').length;
  const inProgressProjects = MOCK_PROJECT_PERFORMANCE.filter(p => p.status === 'in-progress').length;
  const avgQuality = (MOCK_PROJECT_PERFORMANCE.reduce((sum, p) => sum + p.quality, 0) / MOCK_PROJECT_PERFORMANCE.length).toFixed(1);

  const handleExport = () => {
    console.log(`Exporting report as ${exportFormat}`);
    setShowExportModal(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <ClientHeader />

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <BarChart3 className="text-green-600" size={32} />
                Reports & Analytics
              </h1>
              <p className="text-gray-600">Track your spending, project performance, and freelancer metrics</p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setDateRange('1month')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${dateRange === '1month' ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    1 Month
                  </button>
                  <button
                    onClick={() => setDateRange('3months')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${dateRange === '3months' ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    3 Months
                  </button>
                  <button
                    onClick={() => setDateRange('6months')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${dateRange === '6months' ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    6 Months
                  </button>
                  <button
                    onClick={() => setDateRange('1year')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${dateRange === '1year' ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    1 Year
                  </button>
                </div>

                <button
                  onClick={() => setShowExportModal(true)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm flex items-center gap-2 w-full lg:w-auto justify-center"
                >
                  <Download size={18} />
                  Export Report
                </button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                    <DollarSign size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">${totalSpending.toLocaleString()}</h3>
                <p className="text-gray-600 text-sm mt-1">Total Spending</p>
                <p className="text-xs text-green-600 mt-2">Avg: ${avgSpending.toLocaleString()}/month</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <CheckCircle size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{completedProjects}</h3>
                <p className="text-gray-600 text-sm mt-1">Completed Projects</p>
                <p className="text-xs text-blue-600 mt-2">{inProgressProjects} in progress</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                    <Users size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{MOCK_FREELANCER_STATS.length}</h3>
                <p className="text-gray-600 text-sm mt-1">Active Freelancers</p>
                <p className="text-xs text-purple-600 mt-2">Avg Rating: {avgQuality}⭐</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                    <TrendingUp size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{avgQuality}</h3>
                <p className="text-gray-600 text-sm mt-1">Avg Quality Rating</p>
                <p className="text-xs text-orange-600 mt-2">Out of 5.0</p>
              </div>
            </div>

            {/* Spending Trend Chart */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Spending Trend</h2>
              <div className="flex items-end justify-between gap-2 h-64">
                {MOCK_SPENDING_DATA.map((data, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-t-lg relative group cursor-pointer" style={{ height: `${(data.amount / maxSpending) * 100}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        ${data.amount.toLocaleString()}
                      </div>
                      <div className="w-full h-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg hover:from-green-700 hover:to-green-500 transition-colors"></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-600 mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Performance */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Performance</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Project</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Freelancer</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Budget</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Spent</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Timeline</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Quality</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_PROJECT_PERFORMANCE.map((project) => (
                      <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-gray-900 font-medium">{project.name}</td>
                        <td className="py-4 px-4 text-gray-600">{project.freelancer}</td>
                        <td className="py-4 px-4 text-gray-900 font-semibold">${project.budget.toLocaleString()}</td>
                        <td className="py-4 px-4 text-gray-900 font-semibold">${project.spent.toLocaleString()}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.timeline === 'On Time' || project.timeline === 'Early' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {project.timeline}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-900 font-semibold">{project.quality}⭐</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                            {project.status === 'completed' ? 'Completed' : 'In Progress'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Freelancer Statistics */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Freelancer Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_FREELANCER_STATS.map((freelancer) => (
                  <div key={freelancer.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{freelancer.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{freelancer.projects} projects completed</p>
                      </div>
                      {freelancer.repeatHire && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Repeat Hire</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Rating</p>
                        <p className="text-lg font-bold text-gray-900">{freelancer.rating}⭐</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">On-Time Delivery</p>
                        <p className="text-lg font-bold text-gray-900">{freelancer.onTimeDelivery}%</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Total Earned</p>
                      <p className="text-2xl font-bold text-green-600">${freelancer.totalEarned.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Export Report</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Select Format</label>
                  <div className="space-y-2">
                    {['pdf', 'excel', 'csv'].map(format => (
                      <label key={format} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="format"
                          value={format}
                          checked={exportFormat === format}
                          onChange={(e) => setExportFormat(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="font-medium text-gray-900 capitalize">{format}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Date Range</label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500">
                    <option>Last 1 Month</option>
                    <option>Last 3 Months</option>
                    <option>Last 6 Months</option>
                    <option>Last 1 Year</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Include detailed breakdown</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleExport}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Export
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
