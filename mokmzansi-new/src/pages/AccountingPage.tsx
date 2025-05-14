import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Define types
type Account = {
  id: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
  code: string;
};

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  account_id: string;
  account_name: string;
  reference: string;
};

const AccountingPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'accounts' | 'transactions' | 'journal'>('accounts');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    const fetchAccountingData = async () => {
      try {
        setIsLoading(true);
        
        if (!user?.id) return;
        
        // Fetch accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_id', user.id);
          
        if (accountsError) throw accountsError;
        
        setAccounts(accountsData || []);
        
        // Fetch transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*, accounts(name)')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
          
        if (transactionsError) throw transactionsError;
        
        const formattedTransactions = transactionsData?.map(transaction => ({
          ...transaction,
          account_name: transaction.accounts?.name || 'Unknown Account',
        })) || [];
        
        setTransactions(formattedTransactions);
      } catch (error) {
        console.error('Error fetching accounting data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAccountingData();
  }, [user]);

  // Group accounts by type
  const accountsByType = accounts.reduce((groups, account) => {
    const group = groups[account.type] || [];
    group.push(account);
    groups[account.type] = group;
    return groups;
  }, {} as Record<string, Account[]>);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Accounting</h1>
        <p className="text-gray-600">Manage your chart of accounts and transactions</p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              className={`${
                activeTab === 'accounts'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('accounts')}
            >
              Chart of Accounts
            </button>
            <button
              className={`${
                activeTab === 'transactions'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </button>
            <button
              className={`${
                activeTab === 'journal'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('journal')}
            >
              Journal Entries
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
          {/* Chart of Accounts Tab */}
          {activeTab === 'accounts' && (
            <div>
              <div className="flex justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Chart of Accounts</h2>
                </div>
                <div>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Add Account
                  </button>
                </div>
              </div>
              
              {accounts.length === 0 ? (
                <div className="bg-white shadow overflow-hidden rounded-md p-6 text-center">
                  <p className="text-gray-500">No accounts have been created yet.</p>
                  <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Set Up Default Accounts
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Assets */}
                  <div className="bg-white shadow overflow-hidden rounded-md">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="text-md font-medium text-gray-900">Assets</h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {accountsByType.asset?.map((account) => (
                        <li key={account.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{account.name}</p>
                            <p className="text-xs text-gray-500">Code: {account.code}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(account.balance)}
                          </div>
                        </li>
                      )) || (
                        <li className="px-4 py-3 text-sm text-gray-500 italic">No asset accounts</li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Liabilities */}
                  <div className="bg-white shadow overflow-hidden rounded-md">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="text-md font-medium text-gray-900">Liabilities</h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {accountsByType.liability?.map((account) => (
                        <li key={account.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{account.name}</p>
                            <p className="text-xs text-gray-500">Code: {account.code}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(account.balance)}
                          </div>
                        </li>
                      )) || (
                        <li className="px-4 py-3 text-sm text-gray-500 italic">No liability accounts</li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Equity */}
                  <div className="bg-white shadow overflow-hidden rounded-md">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="text-md font-medium text-gray-900">Equity</h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {accountsByType.equity?.map((account) => (
                        <li key={account.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{account.name}</p>
                            <p className="text-xs text-gray-500">Code: {account.code}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(account.balance)}
                          </div>
                        </li>
                      )) || (
                        <li className="px-4 py-3 text-sm text-gray-500 italic">No equity accounts</li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Revenue */}
                  <div className="bg-white shadow overflow-hidden rounded-md">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="text-md font-medium text-gray-900">Revenue</h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {accountsByType.revenue?.map((account) => (
                        <li key={account.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{account.name}</p>
                            <p className="text-xs text-gray-500">Code: {account.code}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(account.balance)}
                          </div>
                        </li>
                      )) || (
                        <li className="px-4 py-3 text-sm text-gray-500 italic">No revenue accounts</li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Expenses */}
                  <div className="bg-white shadow overflow-hidden rounded-md">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="text-md font-medium text-gray-900">Expenses</h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {accountsByType.expense?.map((account) => (
                        <li key={account.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{account.name}</p>
                            <p className="text-xs text-gray-500">Code: {account.code}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(account.balance)}
                          </div>
                        </li>
                      )) || (
                        <li className="px-4 py-3 text-sm text-gray-500 italic">No expense accounts</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div>
              <div className="flex justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Transactions</h2>
                </div>
                <div>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Add Transaction
                  </button>
                </div>
              </div>
              
              {transactions.length === 0 ? (
                <div className="bg-white shadow overflow-hidden rounded-md p-6 text-center">
                  <p className="text-gray-500">No transactions have been recorded yet.</p>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Account
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reference
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Debit
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Credit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.account_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.reference}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {transaction.type === 'debit' ? formatCurrency(transaction.amount) : ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {transaction.type === 'credit' ? formatCurrency(transaction.amount) : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {/* Journal Entries Tab */}
          {activeTab === 'journal' && (
            <div>
              <div className="flex justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Journal Entries</h2>
                </div>
                <div>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    New Journal Entry
                  </button>
                </div>
              </div>
              
              <div className="bg-white shadow overflow-hidden rounded-md p-6 text-center">
                <p className="text-gray-500">No journal entries have been created yet.</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AccountingPage;
