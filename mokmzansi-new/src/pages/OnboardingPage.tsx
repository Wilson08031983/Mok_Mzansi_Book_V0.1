import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const OnboardingSchema = Yup.object().shape({
  companyName: Yup.string().required('Company name is required'),
  companyType: Yup.string().required('Company type is required'),
  industry: Yup.string().required('Industry is required'),
  registrationNumber: Yup.string(),
  vatNumber: Yup.string(),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.string().required('Phone number is required')
});

const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    try {
      setIsSubmitting(true);

      // Save company profile to Supabase
      const { error: companyError } = await supabase
        .from('companies')
        .insert([
          {
            user_id: user?.id,
            name: values.companyName,
            company_type: values.companyType,
            industry: values.industry,
            registration_number: values.registrationNumber,
            vat_number: values.vatNumber
          }
        ]);

      if (companyError) throw companyError;

      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user?.id,
            first_name: values.firstName,
            last_name: values.lastName,
            phone: values.phone,
            onboarding_completed: true
          }
        ]);

      if (profileError) throw profileError;

      // Redirect to payment page if not on a free trial
      if (values.plan === 'premium') {
        navigate('/payment');
      } else {
        // Free trial
        navigate('/dashboard');
      }

    } catch (error) {
      console.error('Error saving onboarding data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to MOKMzansiBooks</h1>
        <p className="mt-2 text-gray-600">
          Let's set up your account to get you started
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium">Business Info</span>
          </div>
          <div className={`flex-1 border-t ${currentStep >= 2 ? 'border-primary-600' : 'border-gray-200'} mx-4`}></div>
          <div className="flex items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">Your Details</span>
          </div>
          <div className={`flex-1 border-t ${currentStep >= 3 ? 'border-primary-600' : 'border-gray-200'} mx-4`}></div>
          <div className="flex items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              3
            </div>
            <span className="ml-2 text-sm font-medium">Subscription</span>
          </div>
        </div>
      </div>

      <Formik
        initialValues={{
          companyName: '',
          companyType: '',
          industry: '',
          registrationNumber: '',
          vatNumber: '',
          firstName: '',
          lastName: '',
          phone: '',
          plan: 'trial'
        }}
        validationSchema={OnboardingSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className="bg-white shadow-md rounded-lg p-6">
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Business Information</h2>
                
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name *
                  </label>
                  <Field
                    type="text"
                    name="companyName"
                    id="companyName"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  <ErrorMessage name="companyName" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="companyType" className="block text-sm font-medium text-gray-700">
                    Company Type *
                  </label>
                  <Field
                    as="select"
                    name="companyType"
                    id="companyType"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select company type</option>
                    <option value="sole_proprietor">Sole Proprietor</option>
                    <option value="partnership">Partnership</option>
                    <option value="pty_ltd">Pty Ltd</option>
                    <option value="close_corporation">Close Corporation</option>
                    <option value="non_profit">Non-Profit Organization</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage name="companyType" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                    Industry *
                  </label>
                  <Field
                    as="select"
                    name="industry"
                    id="industry"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select industry</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="construction">Construction</option>
                    <option value="services">Professional Services</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="technology">Technology</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="transport">Transportation</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage name="industry" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                    Company Registration Number (Optional)
                  </label>
                  <Field
                    type="text"
                    name="registrationNumber"
                    id="registrationNumber"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  <ErrorMessage name="registrationNumber" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700">
                    VAT Number (Optional)
                  </label>
                  <Field
                    type="text"
                    name="vatNumber"
                    id="vatNumber"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  <ErrorMessage name="vatNumber" component="div" className="text-red-600 text-sm mt-1" />
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Your Details</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <Field
                      type="text"
                      name="firstName"
                      id="firstName"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <ErrorMessage name="firstName" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <Field
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <ErrorMessage name="lastName" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="mt-1 block w-full border border-gray-300 bg-gray-50 rounded-md shadow-sm py-2 px-3"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <Field
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="+27 XX XXX XXXX"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-600 text-sm mt-1" />
                </div>
              </div>
            )}

            {/* Step 3: Subscription Plan */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Choose Your Plan</h2>
                
                <div className="space-y-4">
                  <label className="flex p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                    <Field
                      type="radio"
                      name="plan"
                      value="trial"
                      className="h-5 w-5 text-primary-600 mt-1"
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-gray-900">Free 30-Day Trial</span>
                      <span className="block text-sm text-gray-500">Try all features for 30 days</span>
                      <span className="block text-sm font-semibold text-primary-600 mt-1">R0</span>
                    </div>
                  </label>
                  
                  <label className="flex p-4 border-2 border-primary-200 rounded-md cursor-pointer bg-primary-50 hover:bg-primary-100">
                    <Field
                      type="radio"
                      name="plan"
                      value="premium"
                      className="h-5 w-5 text-primary-600 mt-1"
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-gray-900">Premium Subscription</span>
                      <span className="block text-sm text-gray-500">Full access to all features</span>
                      <span className="block text-sm font-semibold text-primary-600 mt-1">R60/month</span>
                    </div>
                  </label>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mt-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3 text-sm text-blue-700">
                        <p>
                          Your free trial includes all premium features for 30 days. You won't be charged until your trial ends.
                          You can upgrade or cancel anytime from your account settings.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${currentStep === 1 || currentStep === 2 ? 'ml-auto' : ''} py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
              >
                {currentStep < 3 ? 'Next' : isSubmitting ? 'Processing...' : values.plan === 'premium' ? 'Continue to Payment' : 'Start Free Trial'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OnboardingPage;
