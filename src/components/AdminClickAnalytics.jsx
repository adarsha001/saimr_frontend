import React, { useState, useEffect, useMemo } from 'react';
import { 
  fetchClickAnalytics, 
  fetchClickStatsByType, 
  fetchPopularClicks, 
  fetchClickTrends, 
  exportClickData 
} from '../api/adminApi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const AdminClickAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [timeframe, setTimeframe] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [filters, setFilters] = useState({
    itemType: '',
    dateRange: ''
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

  // Item type options for filtering
  const itemTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' },
    { value: 'social', label: 'Social Media' },
    { value: 'navigation', label: 'Navigation' },
    { value: 'service', label: 'Services' },
    { value: 'legal', label: 'Legal' },
    { value: 'website', label: 'Website' }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe, filters]);

  // Safe data extraction with fallbacks
  const getSummaryData = () => {
    if (!analytics) {
      return {
        totalClicks: 0,
        uniqueItemsCount: 0,
        uniqueUsersCount: 0,
        avgClicksPerItem: 0
      };
    }

    if (analytics.summary) {
      return analytics.summary;
    }
    
    if (analytics.totalClicks !== undefined) {
      return analytics;
    }
    
    return {
      totalClicks: analytics.totalClicks || 0,
      uniqueItemsCount: analytics.uniqueItemsCount || 0,
      uniqueUsersCount: analytics.uniqueUsersCount || 0,
      avgClicksPerItem: analytics.avgClicksPerItem || 0
    };
  };

  const getClicksByType = () => {
    return analytics?.clicksByType || analytics?.data?.clicksByType || [];
  };

  const getPopularClicks = () => {
    return analytics?.popularClicks || analytics?.data?.popularClicks || [];
  };

  const getDailyTrends = () => {
    return analytics?.dailyTrends || analytics?.data?.dailyTrends || [];
  };

  // Memoized calculations for better performance
  const summary = useMemo(() => getSummaryData(), [analytics]);
  const clicksByType = useMemo(() => getClicksByType(), [analytics]);
  const popularClicks = useMemo(() => getPopularClicks(), [analytics]);
  const dailyTrends = useMemo(() => getDailyTrends(), [analytics]);

  const topPerformers = useMemo(() => {
    return popularClicks.slice(0, 10);
  }, [popularClicks]);

  const totalClicksByType = useMemo(() => {
    return clicksByType.reduce((sum, item) => sum + (item.totalClicks || 0), 0);
  }, [clicksByType]);

  const conversionRate = useMemo(() => {
    const totalClicks = summary.totalClicks;
    const uniqueUsers = summary.uniqueUsersCount;
    return uniqueUsers > 0 ? ((totalClicks / uniqueUsers) * 100).toFixed(1) : 0;
  }, [summary]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchClickAnalytics(timeframe, filters.itemType);
      
      if (response.data && response.data.success) {
        setAnalytics(response.data.data);
      } else {
        setAnalytics(response.data || response);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      setExportLoading(true);
      
      if (format === 'excel') {
        await exportToExcel();
      } else if (format === 'json') {
        await exportToJson();
      } else {
        await exportClickData(format, timeframe);
      }
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export data');
    } finally {
      setExportLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Summary Sheet
      const summaryData = [
        ['Metric', 'Value'],
        ['Total Clicks', summary.totalClicks],
        ['Unique Items', summary.uniqueItemsCount],
        ['Unique Users', summary.uniqueUsersCount],
        ['Average Clicks Per Item', Math.round(summary.avgClicksPerItem)],
        ['Timeframe', timeframe],
        ['Generated On', new Date().toLocaleString()]
      ];
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

      // Clicks by Type Sheet
      const typeData = [
        ['Item Type', 'Total Clicks', 'Unique Items', 'Average Clicks']
      ];
      clicksByType.forEach(item => {
        typeData.push([
          item.itemType,
          item.totalClicks,
          item.uniqueItemsCount,
          Math.round(item.avgClicksPerItem)
        ]);
      });
      const typeSheet = XLSX.utils.aoa_to_sheet(typeData);
      XLSX.utils.book_append_sheet(workbook, typeSheet, 'Clicks by Type');

      // Popular Clicks Sheet
      const popularData = [
        ['Rank', 'Display Name', 'Item Type', 'Item Value', 'Click Count', 'Last Clicked']
      ];
      popularClicks.forEach((item, index) => {
        popularData.push([
          index + 1,
          item.displayName,
          item.itemType,
          item.itemValue,
          item.clickCount,
          new Date(item.lastClicked).toLocaleDateString()
        ]);
      });
      const popularSheet = XLSX.utils.aoa_to_sheet(popularData);
      XLSX.utils.book_append_sheet(workbook, popularSheet, 'Popular Items');

      // Trends Sheet
      const trendsData = [
        ['Date', 'Clicks', 'Unique Users']
      ];
      dailyTrends.forEach(item => {
        trendsData.push([
          item.date,
          item.clicks,
          item.uniqueUsersCount || 0
        ]);
      });
      const trendsSheet = XLSX.utils.aoa_to_sheet(trendsData);
      XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Daily Trends');

      // Generate and download
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, `click-analytics-${timeframe}-${new Date().toISOString().split('T')[0]}.xlsx`);
      
    } catch (error) {
      console.error('Excel export error:', error);
      throw error;
    }
  };

  const exportToJson = () => {
    try {
      const exportData = {
        metadata: {
          exportedAt: new Date().toISOString(),
          timeframe: timeframe,
          filters: filters
        },
        summary: summary,
        clicksByType: clicksByType,
        popularClicks: popularClicks,
        dailyTrends: dailyTrends
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const data = new Blob([dataStr], { type: 'application/json' });
      saveAs(data, `click-analytics-${timeframe}-${new Date().toISOString().split('T')[0]}.json`);
    } catch (error) {
      console.error('JSON export error:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Analytics</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 text-center">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Analytics Data</h3>
        <p className="text-gray-500 mb-4">No click analytics data available yet.</p>
        <button
          onClick={fetchAnalytics}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Click Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive tracking of user interactions and engagement</p>
        </div>
        
        {/* Filters and Export */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Timeframe Filter */}
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
            <option value="all">All Time</option>
          </select>

          {/* Item Type Filter */}
          <select
            value={filters.itemType}
            onChange={(e) => setFilters(prev => ({ ...prev, itemType: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {itemTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Export Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('excel')}
              disabled={exportLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-400 text-sm flex items-center space-x-2"
            >
              {exportLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              <span>Excel</span>
            </button>
            
            <button
              onClick={() => handleExport('json')}
              disabled={exportLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 text-sm flex items-center space-x-2"
            >
              {exportLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              <span>JSON</span>
            </button>

            <button
              onClick={() => handleExport('csv')}
              disabled={exportLoading}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-purple-400 text-sm flex items-center space-x-2"
            >
              {exportLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-md text-white">
          <h3 className="text-lg font-semibold">Total Clicks</h3>
          <p className="text-3xl font-bold mt-2">{summary.totalClicks.toLocaleString()}</p>
          <p className="text-blue-100 text-sm mt-1">Across all contact methods</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md text-white">
          <h3 className="text-lg font-semibold">Unique Items</h3>
          <p className="text-3xl font-bold mt-2">{summary.uniqueItemsCount.toLocaleString()}</p>
          <p className="text-green-100 text-sm mt-1">Tracked contact methods</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-md text-white">
          <h3 className="text-lg font-semibold">Unique Users</h3>
          <p className="text-3xl font-bold mt-2">{summary.uniqueUsersCount.toLocaleString()}</p>
          <p className="text-purple-100 text-sm mt-1">Engaged users</p>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg shadow-md text-white">
          <h3 className="text-lg font-semibold">Avg. Clicks/Item</h3>
          <p className="text-3xl font-bold mt-2">
            {Math.round(summary.avgClicksPerItem).toLocaleString()}
          </p>
          <p className="text-orange-100 text-sm mt-1">Per contact method</p>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg shadow-md text-white">
          <h3 className="text-lg font-semibold">Engagement Rate</h3>
          <p className="text-3xl font-bold mt-2">{conversionRate}%</p>
          <p className="text-red-100 text-sm mt-1">Clicks per user</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'by-type', 'popular', 'trends', 'insights'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clicks by Type Chart */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Clicks Distribution by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={clicksByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ itemType, percent }) => `${itemType} (${(percent * 100).toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="totalClicks"
                >
                  {clicksByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Clicks']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Trends */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Daily Click Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="clicks" fill="#8884d8" stroke="#8884d8" fillOpacity={0.3} />
                <Line type="monotone" dataKey="uniqueUsersCount" stroke="#ff7300" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Most Popular Type</span>
                <span className="font-semibold text-blue-600">
                  {clicksByType[0]?.itemType || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Top Performing Item</span>
                <span className="font-semibold text-green-600">
                  {topPerformers[0]?.displayName || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Peak Day</span>
                <span className="font-semibold text-purple-600">
                  {dailyTrends.reduce((max, day) => day.clicks > max.clicks ? day : max, {clicks: 0}).date || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Top Performing Items */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Top Performing Contact Methods</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {topPerformers.map((click, index) => (
                <div key={click._id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <span className="font-medium block text-sm">{click.displayName || click.itemValue}</span>
                      <span className="text-xs text-gray-500 capitalize">{click.itemType}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-blue-600 block text-sm">{click.clickCount} clicks</span>
                    <span className="text-xs text-gray-500">
                      {new Date(click.lastClicked).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'by-type' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Clicks by Type - Bar Chart</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={clicksByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="itemType" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalClicks" fill="#8884d8" name="Total Clicks" />
                <Bar dataKey="uniqueItemsCount" fill="#82ca9d" name="Unique Items" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Detailed Statistics by Type</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unique Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Clicks/Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clicksByType.map((stat, index) => (
                    <tr key={stat._id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-3" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {stat.itemType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {stat.totalClicks?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.uniqueItemsCount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(stat.avgClicksPerItem)?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {totalClicksByType > 0 ? 
                          ((stat.totalClicks / totalClicksByType) * 100).toFixed(1) + '%' : '0%'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'popular' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Most Popular Contact Methods</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unique Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Clicked
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Clicked
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {popularClicks.map((click, index) => (
                  <tr key={click._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {click.displayName}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {click.itemValue}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {click.itemType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {click.clickCount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {click.uniqueUsersCount?.toLocaleString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {click.firstClicked ? new Date(click.firstClicked).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(click.lastClicked).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Click Trends Over Time</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="uniqueUsersCount" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Weekly Pattern</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyTrends.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Trend Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Average Daily Clicks</span>
                  <span className="font-semibold">
                    {dailyTrends.length > 0 ? 
                      Math.round(dailyTrends.reduce((sum, day) => sum + day.clicks, 0) / dailyTrends.length) : 0
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Growth Rate</span>
                  <span className={`font-semibold ${
                    dailyTrends.length > 1 && dailyTrends[0].clicks < dailyTrends[dailyTrends.length - 1].clicks ? 
                    'text-green-600' : 'text-red-600'
                  }`}>
                    {dailyTrends.length > 1 ? 
                      (((dailyTrends[dailyTrends.length - 1].clicks - dailyTrends[0].clicks) / dailyTrends[0].clicks) * 100).toFixed(1) + '%' : 
                      '0%'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Peak Day</span>
                  <span className="font-semibold">
                    {dailyTrends.reduce((max, day) => day.clicks > max.clicks ? day : max, {clicks: 0}).date || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Top Performing Category</h4>
                <p className="text-blue-700">
                  {clicksByType[0]?.itemType || 'N/A'} leads with {clicksByType[0]?.totalClicks || 0} clicks
                  ({totalClicksByType > 0 ? ((clicksByType[0]?.totalClicks / totalClicksByType) * 100).toFixed(1) : 0}% of total)
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">User Engagement</h4>
                <p className="text-green-700">
                  Average of {Math.round(summary.avgClicksPerItem)} clicks per item with {conversionRate}% engagement rate
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Trend Analysis</h4>
                <p className="text-purple-700">
                  {dailyTrends.length > 1 ? 
                    (dailyTrends[dailyTrends.length - 1].clicks > dailyTrends[0].clicks ? 
                      'Positive growth trend observed' : 'Stable performance maintained') : 
                    'Insufficient data for trend analysis'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <div className="space-y-3">
              {clicksByType.slice(0, 3).map((type, index) => (
                <div key={type.itemType} className="p-3 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {index + 1}. {type.itemType.charAt(0).toUpperCase() + type.itemType.slice(1)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {type.totalClicks} clicks - Consider {index === 0 ? 'maintaining' : 'improving'} visibility and accessibility
                  </p>
                </div>
              ))}
              
              {popularClicks.slice(0, 2).map((click, index) => (
                <div key={click._id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-1">
                    High Performer: {click.displayName}
                  </h4>
                  <p className="text-sm text-yellow-700">
                    {click.clickCount} clicks - This contact method is highly effective
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClickAnalytics;