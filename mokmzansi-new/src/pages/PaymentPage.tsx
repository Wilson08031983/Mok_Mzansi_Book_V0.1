import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PaymentPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'eft' | 'payfast'>('credit');

  // Monthly subscription amount in Rand
  const subscriptionAmount = 60;
  
  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      // In a real implementation, this would redirect to PayFast or process the payment
      console.log(`Processing ${paymentMethod} payment for user:`, user?.id);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to dashboard after successful payment
      navigate('/dashboard');
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
        <p className="mt-2 text-gray-600">
          Subscribe to MOKMzansiBooks Premium for R{subscriptionAmount}/month
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Subscription Summary</h2>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">MOKMzansiBooks Premium</span>
            <span className="text-gray-900">R{subscriptionAmount}/month</span>
          </div>
          
          <div className="flex justify-between py-2 border-t border-gray-100">
            <span className="text-gray-600">VAT (15%)</span>
            <span className="text-gray-900">Included</span>
          </div>
          
          <div className="flex justify-between py-2 border-t border-gray-100 font-medium">
            <span>Total</span>
            <span>R{subscriptionAmount}/month</span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
        
        <div className="space-y-4">
          <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === 'credit'}
              onChange={() => setPaymentMethod('credit')}
              className="h-5 w-5 text-primary-600"
            />
            <div className="ml-3">
              <span className="block text-sm font-medium text-gray-900">Credit Card</span>
              <span className="block text-sm text-gray-500">Visa, Mastercard, American Express</span>
            </div>
          </label>
          
          <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === 'payfast'}
              onChange={() => setPaymentMethod('payfast')}
              className="h-5 w-5 text-primary-600"
            />
            <div className="ml-3">
              <span className="block text-sm font-medium text-gray-900">PayFast</span>
              <span className="block text-sm text-gray-500">Pay using PayFast secure gateway</span>
            </div>
          </label>
          
          <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === 'eft'}
              onChange={() => setPaymentMethod('eft')}
              className="h-5 w-5 text-primary-600"
            />
            <div className="ml-3">
              <span className="block text-sm font-medium text-gray-900">EFT (Bank Transfer)</span>
              <span className="block text-sm text-gray-500">Manual bank transfer</span>
            </div>
          </label>
        </div>
      </div>

      {paymentMethod === 'credit' && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Card Details</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                Name on card
              </label>
              <input
                type="text"
                id="cardName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                Card number
              </label>
              <input
                type="text"
                id="cardNumber"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expDate" className="block text-sm font-medium text-gray-700">
                  Expiry date
                </label>
                <input
                  type="text"
                  id="expDate"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'eft' && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Bank Transfer Details</h2>
          
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Account Name:</span> Morwa Moabelo (Pty) Ltd</p>
            <p><span className="font-medium">Bank:</span> First National Bank</p>
            <p><span className="font-medium">Account Number:</span> 1234567890</p>
            <p><span className="font-medium">Branch Code:</span> 250655</p>
            <p><span className="font-medium">Reference:</span> MOK-{user?.id?.substring(0, 8) || 'INVOICE'}</p>
            <p className="text-gray-500 italic mt-2">
              Please use your reference number when making the payment. Your subscription will be activated once the payment has been confirmed.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
          I agree to the{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">
            Privacy Policy
          </a>
        </label>
      </div>

      <div className="mt-6">
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>Subscribe - R{subscriptionAmount}/month</>
          )}
        </button>
        
        <p className="mt-3 text-xs text-gray-500 text-center">
          You can cancel your subscription at any time from the account settings.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
