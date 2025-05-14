import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">About MOKMzansiBooks</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering South African businesses with innovative accounting solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            <p className="text-lg text-gray-600">
              At MOKMzansiBooks, we're on a mission to simplify financial management for South African businesses. 
              We believe that every business, regardless of size, deserves access to powerful accounting tools that 
              are tailored to the unique needs of the South African market.
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
            <p className="text-lg text-gray-600">
              To become the leading accounting solution provider in Africa, helping businesses streamline their 
              financial operations, comply with local regulations, and make informed decisions for growth.
            </p>
            
            <div className="pt-4">
              <a 
                href="/signup" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Join Us Today
              </a>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-primary-500 shadow-xl">
              <img 
                src="/images/founder.jpg" 
                alt="Wilson Moabelo - CEO and Founder" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">Wilson Moabelo</h3>
              <p className="text-primary-600 font-medium">CEO & Founder</p>
              <p className="mt-2 text-gray-600 max-w-md">
                With over 15 years of experience in accounting and software development, Wilson founded MOKMzansiBooks 
                to address the unique challenges faced by African businesses in managing their finances.
              </p>
              
              <div className="flex justify-center space-x-4 mt-4">
                <a href="#" className="text-gray-500 hover:text-primary-600">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary-600">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
