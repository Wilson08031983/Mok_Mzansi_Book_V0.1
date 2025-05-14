import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Define tax types
type TaxReturn = {
  id: string;
  name: string;
  due_date: string;
  status: 'pending' | 'submitted' | 'completed';
  tax_period: string;
  amount_due: number;
};

const TaxPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([]);
  const [vatSettings, setVatSettings] = useState({
    registered: false,
    vatNumber: '',
    vatRate: 15,
    filingFrequency: 'bimonthly'
  });
  const [activeTab, setActiveTab] = useState<'returns' | 'settings'>('returns');

  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        setIsLoading(true);
        
        if (!user?.id) return;
        
        // Fetch tax returns
        const { data: returnsData, error: returnsError } = await supabase
          .from('tax_returns')
          .select('*')
          .eq('user_id', user.id)
          .order('due_date', { ascending: true });
          
        if (returnsError) throw returnsError;
        
        setTaxReturns(returnsData || []);
        
        // Fetch VAT settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('tax_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (settingsError && settingsError.code !== 'PGRST116') {
          // PGRST116 is "not found", which is okay - we'll use defaults
          throw settingsError;
        }
        
        if (settingsData) {
          setVatSettings({
            registered: settingsData.vat_registered || false,
            vatNumber: settingsData.vat_number || '',
            vatRate: settingsData.vat_rate || 15,
            filingFrequency: settingsData.filing_frequency || 'bimonthly'
          });
        }
      } catch (error) {
        console.error('Error fetching tax data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTaxData();
  }, [user]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
  };

  const handleToggleVatRegistration = () => {
    setVatSettings(prev => ({
      ...prev,
      registered: !prev.registered
    }));
  };

  const handleSaveSettings = async () => {
    try {
      if (!user?.id) return;
      
      const { error } = await supabase
        .from('tax_settings')
        .upsert({
          user_id: user.id,
          vat_registered: vatSettings.registered,
          vat_number: vatSettings.vatNumber,
          vat_rate: vatSettings.vatRate,
          filing_frequency: vatSettings.filingFrequency
        });
        
      if (error) throw error;
      
      alert('Tax settings saved successfully');
    } catch (error) {
      console.error('Error saving tax settings:', error);
      alert('Failed to save tax settings');
    }
  };

  // Get status badge color
  const getStatusBadge = (status: TaxReturn['status']) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tax Management</h1>
        <p className="text-gray-600">Manage your VAT and tax returns</p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              className={`${
                activeTab === 'returns'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('returns')}
            >
              Tax Returns
            </button>
            <button
              className={`${
                activeTab === 'settings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('settings')}
            >
              Tax Settings
            </button>
          </nav>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Tax Returns Tab */}
          {activeTab === 'returns' && (
            <div>
              <div className="flex justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Tax Returns</h2>
                </div>
                <div>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Create Tax Return
                  </button>
                </div>
              </div>
              
              {taxReturns.length === 0 ? (
                <div className="bg-white shadow overflow-hidden rounded-md p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No tax returns found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating your first tax return.
                  </p>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {taxReturns.map((taxReturn) => (
                      <li key={taxReturn.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{taxReturn.name}</h3>
                            <p className="text-sm text-gray-500">
                              Period: {taxReturn.tax_period}
                            </p>
                            <p className="text-sm text-gray-500">
                              Due Date: {new Date(taxReturn.due_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className={`mr-4 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(taxReturn.status)}`}>
                              {taxReturn.status.charAt(0).toUpperCase() + taxReturn.status.slice(1)}
                            </span>
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(taxReturn.amount_due)}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* VAT Summary Card */}
              <div className="mt-6 bg-white shadow overflow-hidden rounded-md">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <h3 className="text-md font-medium text-gray-900">VAT Summary</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">VAT Collected</p>
                      <p className="text-lg font-medium text-gray-900">{formatCurrency(0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">VAT Paid</p>
                      <p className="text-lg font-medium text-gray-900">{formatCurrency(0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">VAT Due</p>
                      <p className="text-lg font-medium text-gray-900">{formatCurrency(0)}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      {vatSettings.registered 
                        ? `VAT Number: ${vatSettings.vatNumber || 'Not specified'}`
                        : 'VAT Registration: Not registered'}
                    </p>
                    <p>VAT Rate: {vatSettings.vatRate}%</p>
                  </div>
                </div>
              </div>
              
              {/* Tax Calendar */}
              <div className="mt-6 bg-white shadow overflow-hidden rounded-md">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <h3 className="text-md font-medium text-gray-900">Upcoming Tax Deadlines</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Provisional Tax Return
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>Due by August 31, 2025</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Tax Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900">Tax Settings</h2>
                <p className="text-gray-600">Configure your VAT and tax settings</p>
              </div>
              
              <div className="bg-white shadow overflow-hidden rounded-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-md font-medium text-gray-900">VAT Settings</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">VAT Registered</span>
                      <button 
                        onClick={handleToggleVatRegistration}
                        type="button" 
                        className={`${vatSettings.registered ? 'bg-primary-600' : 'bg-gray-200'} 
                          relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full 
                          transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                      >
                        <span 
                          className={`${vatSettings.registered ? 'translate-x-5' : 'translate-x-0'} 
                            pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow 
                            transform transition ease-in-out duration-200`}
                        ></span>
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Toggle if your business is registered for VAT
                    </p>
                  </div>
                  
                  {vatSettings.registered && (
                    <>
                      <div>
                        <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700">
                          VAT Number
                        </label>
                        <input
                          type="text"
                          id="vatNumber"
                          value={vatSettings.vatNumber}
                          onChange={(e) => setVatSettings({ ...vatSettings, vatNumber: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter your VAT number"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="vatRate" className="block text-sm font-medium text-gray-700">
                          VAT Rate (%)
                        </label>
                        <select
                          id="vatRate"
                          value={vatSettings.vatRate}
                          onChange={(e) => setVatSettings({ ...vatSettings, vatRate: Number(e.target.value) })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="15">15% (Standard)</option>
                          <option value="0">0% (Zero-rated)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="filingFrequency" className="block text-sm font-medium text-gray-700">
                          Filing Frequency
                        </label>
                        <select
                          id="filingFrequency"
                          value={vatSettings.filingFrequency}
                          onChange={(e) => setVatSettings({ ...vatSettings, filingFrequency: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="monthly">Monthly</option>
                          <option value="bimonthly">Every 2 Months</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="annually">Annually</option>
                        </select>
                      </div>
                    </>
                  )}
                  
                  <div className="pt-4">
                    <button
                      onClick={handleSaveSettings}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-white shadow overflow-hidden rounded-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-md font-medium text-gray-900">Income Tax Settings</h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Configure your income tax settings to help calculate provisional tax and prepare annual returns.
                  </p>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Configure Income Tax
                  </button>
                </div>
              </div>
              
              <div className="mt-6 bg-white shadow overflow-hidden rounded-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-md font-medium text-gray-900">SARS eFiling Integration</h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Connect your SARS eFiling account to streamline tax submissions and payments.
                  </p>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Connect eFiling
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaxPage;
