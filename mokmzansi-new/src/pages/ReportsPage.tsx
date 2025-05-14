import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Define report types
type ReportType = 'profit-loss' | 'balance-sheet' | 'sales' | 'expenses';
type TimeFrame = 'month' | 'quarter' | 'year' | 'custom';

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<ReportType>('profit-loss');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('month');
  const [isLoading, setIsLoading] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const reportOptions = [
    { id: 'profit-loss', name: 'Profit & Loss' },
    { id: 'balance-sheet', name: 'Balance Sheet' },
    { id: 'sales', name: 'Sales Report' },
    { id: 'expenses', name: 'Expenses Report' },
  ];

  const handleGenerateReport = () => {
    setIsLoading(true);
    
    // In a real implementation, this would fetch data from the database
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Reports & Summaries</h1>
        <p className="text-gray-600">Generate financial reports and insights</p>
      </div>
      
      {/* Report Builder */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Report Builder</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              id="reportType"
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value as ReportType)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {reportOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="timeFrame" className="block text-sm font-medium text-gray-700 mb-1">
              Time Frame
            </label>
            <select
              id="timeFrame"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>
        </div>
        
        {timeFrame === 'custom' && (
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={customDateRange.startDate}
                onChange={(e) => setCustomDateRange({ ...customDateRange, startDate: e.target.value })}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="flex-1">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={customDateRange.endDate}
                onChange={(e) => setCustomDateRange({ ...customDateRange, endDate: e.target.value })}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center">
          <button
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
          <div className="ml-4 flex items-center">
            <button className="text-sm text-primary-600 hover:text-primary-700">Export PDF</button>
            <button className="ml-4 text-sm text-primary-600 hover:text-primary-700">Export Excel</button>
          </div>
        </div>
      </div>
      
      {/* Report Preview */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">
            {reportOptions.find(r => r.id === selectedReport)?.name} for {timeFrame === 'month' ? 'This Month' : 
              timeFrame === 'quarter' ? 'This Quarter' : 
              timeFrame === 'year' ? 'This Year' : 
              'Custom Period'}
          </h2>
        </div>
        
        <div className="p-6">
          {/* Sample report content */}
          <div className="bg-gray-100 rounded-md h-60 flex items-center justify-center mb-6">
            <p className="text-gray-500">Report Chart Visualization</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    This Month
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year to Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="font-medium">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Income</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(17000)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(88000)}</td>
                </tr>
                <tr>
                  <td className="pl-10 px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sales</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(15000)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(82000)}</td>
                </tr>
                <tr>
                  <td className="pl-10 px-6 py-4 whitespace-nowrap text-sm text-gray-500">Other Income</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(2000)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(6000)}</td>
                </tr>
                <tr className="font-medium">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Expenses</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(13500)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(72000)}</td>
                </tr>
                <tr>
                  <td className="pl-10 px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rent</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(3500)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(21000)}</td>
                </tr>
                <tr>
                  <td className="pl-10 px-6 py-4 whitespace-nowrap text-sm text-gray-500">Salaries</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(6500)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(39000)}</td>
                </tr>
                <tr>
                  <td className="pl-10 px-6 py-4 whitespace-nowrap text-sm text-gray-500">Utilities</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(1500)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(8000)}</td>
                </tr>
                <tr>
                  <td className="pl-10 px-6 py-4 whitespace-nowrap text-sm text-gray-500">Other Expenses</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(2000)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(4000)}</td>
                </tr>
                <tr className="font-medium bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Net Profit</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-bold">{formatCurrency(3500)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-bold">{formatCurrency(16000)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Saved Reports */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Saved Reports</h2>
        </div>
        
        <div className="p-6">
          <p className="text-gray-500 text-center py-4">You don't have any saved reports yet.</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
