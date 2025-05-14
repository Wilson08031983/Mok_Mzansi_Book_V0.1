import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

// Define invoice types
type Invoice = {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name: string;
  amount: number;
  due_date: string;
  issue_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  created_at: string;
};

const InvoicesPage: React.FC = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'sent' | 'paid' | 'overdue'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('invoices')
          .select('*, clients(name)')
          .eq('user_id', user.id);
          
        // Filter by status if not showing all
        if (activeTab !== 'all') {
          query = query.eq('status', activeTab);
        }
        
        // Apply search filter if search term exists
        if (searchTerm) {
          query = query.or(`invoice_number.ilike.%${searchTerm}%,clients.name.ilike.%${searchTerm}%`);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const formattedInvoices = data?.map(invoice => ({
          ...invoice,
          client_name: invoice.clients?.name || 'Unknown Client',
        })) || [];
        
        setInvoices(formattedInvoices);
        
        // Calculate total amount
        const total = formattedInvoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
        setTotalAmount(total);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvoices();
  }, [user, activeTab, searchTerm]);

  // Toggle selection of an invoice
  const toggleSelection = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId) 
        : [...prev, invoiceId]
    );
  };

  // Select all visible invoices
  const selectAll = () => {
    if (selectedInvoices.length === invoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(invoices.map(invoice => invoice.id));
    }
  };

  // Get status badge color
  const getStatusBadge = (status: Invoice['status']) => {
    switch(status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Invoices & Quotations</h1>
          <p className="text-gray-600">Manage your invoices and track payments</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/invoices/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Invoice
          </Link>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-500">Total Invoices</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{invoices.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-500">Total Amount</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-500">Paid</p>
          <p className="mt-1 text-2xl font-semibold text-green-600">
            {formatCurrency(invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.amount || 0), 0))}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-500">Outstanding</p>
          <p className="mt-1 text-2xl font-semibold text-red-600">
            {formatCurrency(invoices.filter(inv => ['sent', 'overdue'].includes(inv.status)).reduce((sum, inv) => sum + (inv.amount || 0), 0))}
          </p>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-4">
          <div className="bg-white rounded-md border border-gray-300 flex">
            <button 
              className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'all' ? 'bg-primary-100 text-primary-700 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'draft' ? 'bg-primary-100 text-primary-700 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('draft')}
            >
              Draft
            </button>
            <button 
              className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'sent' ? 'bg-primary-100 text-primary-700 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('sent')}
            >
              Sent
            </button>
            <button 
              className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'paid' ? 'bg-primary-100 text-primary-700 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('paid')}
            >
              Paid
            </button>
            <button 
              className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'overdue' ? 'bg-primary-100 text-primary-700 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('overdue')}
            >
              Overdue
            </button>
          </div>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search invoices..."
            className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-4 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <div className="mb-4 flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
          <span className="text-sm font-medium text-gray-700">{selectedInvoices.length} selected</span>
          <button className="text-sm text-primary-600 hover:text-primary-800">Mark as Paid</button>
          <button className="text-sm text-primary-600 hover:text-primary-800">Send Reminder</button>
          <button className="text-sm text-red-600 hover:text-red-800">Delete</button>
          <button 
            className="text-sm text-gray-600 hover:text-gray-800 ml-auto"
            onClick={() => setSelectedInvoices([])}
          >
            Cancel
          </button>
        </div>
      )}
      
      {/* Invoice List */}
      <div className="bg-white shadow overflow-hidden rounded-md">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={selectedInvoices.length === invoices.length && invoices.length > 0}
                        onChange={selectAll}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={() => toggleSelection(invoice.id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/invoices/${invoice.id}`} className="text-primary-600 hover:text-primary-900">
                        {invoice.invoice_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.client_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{new Date(invoice.issue_date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{new Date(invoice.due_date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <Link to={`/invoices/${invoice.id}`} className="text-primary-600 hover:text-primary-900">
                          View
                        </Link>
                        <Link to={`/invoices/${invoice.id}/edit`} className="text-primary-600 hover:text-primary-900">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new invoice.
            </p>
            <div className="mt-6">
              <Link
                to="/invoices/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Invoice
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesPage;
