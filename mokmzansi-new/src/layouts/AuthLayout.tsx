import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Brand info */}
      <div className="hidden md:flex md:flex-col md:w-1/2 bg-gradient-to-br from-primary-500 via-accent-500 to-teal-500 p-10 justify-center">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-6">MOKMzansiBooks</h1>
            <p className="text-white text-xl mb-4">
              The South African accounting solution for growing businesses
            </p>
            <p className="text-white opacity-80">
              Simplify your accounting, invoicing, and financial management with a solution designed specifically for South African businesses.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
            <p className="text-white font-medium italic mb-4">
              "I was a business man who tried almost every business you can think of. In all my trials and errors, running on a loss, I realized that there might be other South Africans suffering the same fate as me on a daily basis."
            </p>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-primary-500 font-bold">
                WM
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">Wilson Mokgethwa Moabelo</p>
                <p className="text-white text-sm opacity-80">Founder, MOKMzansiBooks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Auth forms */}
      <div className="flex flex-col w-full md:w-1/2">
        <div className="flex justify-between items-center p-6 md:p-10">
          <div className="md:hidden">
            <h1 className="text-xl font-bold text-primary-600">MOKMzansiBooks</h1>
          </div>
          <div>
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary-600">
              Back to Home
            </Link>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <Outlet />
          </div>
        </div>
        
        <div className="p-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Morwa Moabelo (Pty) Ltd. All rights reserved.</p>
          <p>Reg No. 2018/421571/07</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
