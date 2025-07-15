import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axiosInstance from '@/config/axiosInstance';
import { useToast } from '@/hooks/use-toast';
import { StripeDebug } from './StripeDebug';

// Main export component
export default function OnlinePaymentCheckout() {
  const { search } = useLocation();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Initialize Stripe only once
    if (!stripePromise) {
      setStripePromise(loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY));
    }
  }, []);

  useEffect(() => {
    // Get client secret and payment ID from URL
    const params = new URLSearchParams(search);
    const secretParam = params.get('clientSecret');
    const idParam = params.get('paymentId');
    const isEmiPayment = params.get('emiPayment') === 'true';
    
    console.log("URL Parameters:", { 
      clientSecret: secretParam ? "present" : "missing", 
      paymentId: idParam,
      isEmiPayment 
    });
    
    if (!secretParam || !idParam) {
      setError('Missing payment information. Please try again.');
      setLoading(false);
      return;
    }
    
    setClientSecret(secretParam);
    setPaymentId(idParam);
    
    // Fetch payment details
    const fetchPaymentDetails = async () => {
      try {
        console.log("Fetching payment details for ID:", idParam);
        
        // Check if it's an EMI payment from URL parameter
        const isEmiPayment = params.get('emiPayment') === 'true';
        console.log("Is EMI payment from URL:", isEmiPayment);
        
        let response;
        if (isEmiPayment) {
          // For EMI payments, we need to use a different approach since there's no direct endpoint
          try {
            // Get all EMI payments and find the matching one
            const emiResponse = await axiosInstance.get('/payments/emi');
            console.log("Fetched all EMI payments, looking for:", idParam);
            
            // Find the specific EMI payment by ID
            const emiPayment = emiResponse.data.find(emi => emi._id === idParam);
            
            if (emiPayment) {
              console.log("Found matching EMI payment:", emiPayment);
              response = { data: emiPayment };
            } else {
              throw new Error("EMI payment not found");
            }
          } catch (emiErr) {
            console.error("Error fetching EMI payment:", emiErr);
            throw emiErr;
          }
        } else {
          // Regular payment
          response = await axiosInstance.get(`/payments/${idParam}`);
          console.log("Found as regular payment:", response.data);
        }
        
        // Also fetch student details if not included in payment
        if (response.data && response.data.student && !response.data.studentName) {
          try {
            const studentId = typeof response.data.student === 'object' ? 
              response.data.student._id : response.data.student;
              
            if (studentId) {
              console.log("Fetching student details for ID:", studentId);
              const studentResponse = await axiosInstance.get(`/students/${studentId}`);
            if (studentResponse.data) {
              response.data.studentName = studentResponse.data.name;
                console.log("Found student name:", response.data.studentName);
              }
            }
          } catch (studentErr) {
            console.error('Error fetching student details:', studentErr);
          }
        }
        
        setPaymentDetails(response.data);
      } catch (err) {
        console.error('Error fetching payment details:', err);
        setError('Could not load payment details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentDetails();
  }, [search]);
  
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0f766e',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '8px',
        spacingUnit: '4px',
        fontSizeBase: '16px',
        fontWeightNormal: '400',
        fontWeightBold: '600',
      },
      rules: {
        '.Input': {
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          padding: '12px 16px',
          transition: 'all 0.2s ease'
        },
        '.Input:focus': {
          border: '2px solid #0f766e',
          boxShadow: '0 0 0 1px rgba(15, 118, 110, 0.3)'
        },
        '.Label': {
          fontWeight: '500',
          marginBottom: '8px',
          color: '#374151'
        },
        '.Tab': {
          padding: '10px 16px',
          border: 'none',
          backgroundColor: '#f9fafb'
        },
        '.Tab:hover': {
          backgroundColor: '#f3f4f6'
        },
        '.Tab--selected': {
          borderColor: '#0f766e',
          backgroundColor: '#ecfdf5',
          color: '#0f766e'
        },
        '.CheckboxInput': {
          borderColor: '#d1d5db',
          borderWidth: '2px'
        },
        '.CheckboxInput--checked': {
          backgroundColor: '#0f766e',
          borderColor: '#0f766e'
        }
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-teal-600 animate-spin"></div>
            <div className="absolute inset-3 rounded-full bg-teal-600/20 animate-pulse"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto max-w-md p-4 sm:p-6">
        <Card className="border border-red-100 shadow-lg">
          <CardHeader className="bg-red-50 border-b border-red-100">
            <CardTitle className="text-red-700">Payment Error</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              onClick={() => window.history.back()} 
              className="w-full mt-4"
              variant="outline"
            >
              Return to Payment Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!stripePromise || !clientSecret) {
    return (
      <div className="container mx-auto max-w-md p-4 sm:p-6">
        <Card>
          <CardContent className="pt-6">
            <Alert className="mb-4">
              <AlertDescription>Loading payment system...</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-[80vh] w-full bg-gradient-to-b from-gray-50 to-white px-4 py-8 sm:px-6 sm:py-12">
      <div className="container mx-auto max-w-3xl">
        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 text-white p-2 rounded-lg shadow-lg flex items-center justify-center">
              {/* Using a more compatible SVG icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-800">EduFlow</span>
          </div>
        </div>

        <Card className="overflow-hidden border-gray-200/50 shadow-xl transition-all hover:shadow-2xl">
          <CardHeader className="space-y-1 bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-6">
            <CardTitle className="text-2xl font-bold tracking-tight text-white">Complete Your Payment</CardTitle>
            <CardDescription className="text-teal-100">
              Secure payment processing powered by Stripe
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 p-6">
            {paymentDetails && (
              <div className="rounded-lg bg-gray-50 p-5 border border-gray-100 shadow-sm">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-sm font-medium text-gray-600">Student Name</span>
                    <span className="font-semibold text-gray-900">
                      {paymentDetails.studentName || 
                       (paymentDetails.student && typeof paymentDetails.student === 'object' ? 
                        paymentDetails.student.name : 'Student')}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-sm font-medium text-gray-600">Course</span>
                    <span className="font-semibold text-gray-900">{paymentDetails.courseName || 'Course'}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-sm font-medium text-gray-600">Invoice Number</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {paymentDetails.invoiceNumber || `INV-${paymentDetails._id?.slice(-6)}`}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-sm font-medium text-gray-600">Amount</span>
                    <span className="text-lg font-semibold text-teal-700">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: paymentDetails.currency || 'INR'
                      }).format(
                        parseFloat(paymentDetails.remainingAmount || paymentDetails.amount || paymentDetails.totalAmount || 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-1 rounded-lg border border-gray-200 bg-white shadow-sm">
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm paymentId={paymentId} />
              </Elements>
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 px-6 py-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 justify-center">
              <div className="flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Secure Payment</span>
              </div>
              <Separator orientation="vertical" className="h-5" />
              <div className="flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Encrypted Data</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              By proceeding with the payment, you agree to our terms and conditions. Your payment information is securely processed by Stripe.
            </p>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} EduFlow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

// Checkout form component that uses Stripe Elements
function CheckoutForm({ paymentId }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // Check payment status on mount and after 3DS redirect
  useEffect(() => {
    console.log('Stripe Webhook Effect Initialized', { 
        stripeLoaded: !!stripe,
        paymentId: paymentId
    });

    if (!stripe) {
      console.warn('Stripe not loaded');
      return;
    }

    // Retrieve the "payment_intent_client_secret" query parameter
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    console.log('Client Secret Retrieved', { 
        clientSecret: clientSecret ? 'Present' : 'Missing' 
    });

    if (!clientSecret) {
      console.warn('No client secret found in URL');
      return;
    }

    // Retrieve payment intent status
    stripe.retrievePaymentIntent(clientSecret).then(async ({ paymentIntent }) => {
      console.log('Payment Intent Retrieved', {
        status: paymentIntent.status,
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert to readable amount
        clientSecret: clientSecret
      });

      switch (paymentIntent.status) {
        case "succeeded":
          try {
            console.log('Payment Succeeded - Attempting Status Update', { 
              paymentId: paymentId, 
              paymentIntentId: paymentIntent.id 
            });

            // Enhanced logging for network request
            const startTime = Date.now();
            // Use axios directly to bypass authentication for the manual update endpoint
            const isEmiPayment = new URLSearchParams(window.location.search).get('emiPayment') === 'true';
            console.log("Updating payment status with:", {
              paymentId: paymentId,
              paymentIntentId: paymentIntent.id,
              isEMI: isEmiPayment
            });
            
            let response;
            if (isEmiPayment) {
              // For EMI payments, use the specific EMI update endpoint
              console.log("Using EMI payment update endpoint with data:", {
                paymentId,
                endpoint: `${import.meta.env.VITE_API_BASE_URL || 'https://student-server-ten.vercel.app/api'}/payments/emi/${paymentId}/update`,
                payload: {
                  status: 'paid',
                  paidDate: new Date().toISOString(),
                  paymentMethod: 'online',
                  paymentIntentId: paymentIntent.id,
                  transactionId: paymentIntent.id
                }
              });
              
              response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'https://student-server-ten.vercel.app/api'}/payments/emi/${paymentId}/update`, {
                status: 'paid',
                paidDate: new Date().toISOString(),
                paymentMethod: 'online',
                paymentIntentId: paymentIntent.id,
                transactionId: paymentIntent.id
              }, {
                timeout: 10000,
                validateStatus: function (status) {
                  return (status >= 200 && status < 300) || status === 400 || status === 404 || status === 500;
                }
              });
            } else {
              // For regular payments, use the standard manual update endpoint
              console.log("Using standard payment update endpoint with data:", {
                paymentId,
                endpoint: `${import.meta.env.VITE_API_BASE_URL || 'https://student-server-ten.vercel.app/api'}/stripe/manual-update`,
                payload: {
                  paymentId: paymentId,
                  paymentIntentId: paymentIntent.id
                }
              });
              
              response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'https://student-server-ten.vercel.app/api'}/stripe/manual-update`, {
              paymentId: paymentId,
              paymentIntentId: paymentIntent.id
            }, {
              timeout: 10000,
              validateStatus: function (status) {
                return (status >= 200 && status < 300) || status === 400 || status === 404 || status === 500;
              }
            });
            }

            const endTime = Date.now();
            console.log('Manual Update Response', {
              status: response.status,
              data: response.data,
              duration: `${endTime - startTime}ms`
            });

            // Handle different response scenarios
            if (response.status === 200) {
              console.log('Payment Status Successfully Updated');
              toast({
                title: 'Payment Successful',
                description: response.data.message || 'Your payment has been processed successfully.',
                variant: 'success'
              });
              navigate('/payment-success');
            } else {
              console.warn('Payment Status Update Issue', {
                status: response.status,
                error: response.data
              });
              toast({
                variant: "destructive",
                title: "Payment Status Update Issue",
                description: response.data.error || 
                            response.data.message || 
                            "Payment successful, but status update encountered an issue. Please contact support.",
                duration: 10000
              });
            }
          } catch (error) {
            console.error('Manual Payment Status Update Failed', {
              error: error.response?.data || error.message,
              paymentId: paymentId,
              paymentIntentId: paymentIntent.id,
              fullError: error
            });
            
            toast({
              variant: "destructive",
              title: "Payment Update Error",
              description: error.response?.data?.error || 
                          error.response?.data?.details || 
                          "Payment successful, but status update failed. Please contact support.",
              duration: 10000
            });
          }
          break;
        case "processing":
          console.log('Payment Currently Processing');
          toast({
            title: 'Payment Processing',
            description: 'Your payment is processing. We\'ll update you when payment is received.',
            variant: 'info'
          });
          break;
        case "requires_payment_method":
          console.warn('Payment Method Required');
          toast({
            variant: "destructive",
            title: "Payment Failed",
            description: "Please try another payment method."
          });
          break;
        default:
          console.warn('Unexpected Payment Status', { status: paymentIntent.status });
          toast({
            variant: "destructive",
            title: "Payment Error",
            description: `Unexpected payment status: ${paymentIntent.status}`
          });
          break;
      }
    }).catch(error => {
      console.error('Payment Intent Retrieval Error', {
        error: error.message,
        fullError: error
      });
      toast({
        variant: "destructive",
        title: "Payment Retrieval Error",
        description: "Unable to verify payment status. Please contact support."
      });
    });
}, [stripe, paymentId, navigate, toast]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      // Get the client secret from the URL
      const currentClientSecret = new URLSearchParams(window.location.search).get("clientSecret");
      
      // Create a return URL with all necessary parameters
      const isEmiPayment = new URLSearchParams(window.location.search).get('emiPayment') === 'true';
      let returnUrl = `${window.location.origin}/payment-success?paymentId=${paymentId}`;
      if (currentClientSecret) {
        returnUrl += `&clientSecret=${currentClientSecret}`;
      }
      if (isEmiPayment) {
        returnUrl += `&emiPayment=true`;
      }
      
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Include paymentId and clientSecret in return URL to ensure proper handling
          return_url: returnUrl,
          payment_method_data: {
            billing_details: {
              // Add any additional billing details if needed
            },
          },
        },
      });
      
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`.
      if (error) {
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: error.message
        });
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <h3 className="text-base font-medium text-gray-700">Payment Details</h3>
        <div className="rounded-lg border border-gray-200 p-4">
          <PaymentElement className="mb-6" />
        </div>
      </div>
      
      <Button 
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 transition-all duration-200 py-6"
      >
        {processing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Processing Payment...</span>
          </div>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Pay Securely Now
          </span>
        )}
      </Button>
      
      <div className="flex items-center justify-center gap-4 pt-2">
        {/* Using inline SVGs instead of external images to prevent broken images */}
        <div className="h-6">
          <svg viewBox="0 0 36 24" height="24" width="36" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <rect fill="#252525" height="24" rx="2" width="36" />
              <circle cx="12" cy="12" fill="#eb001b" r="7" />
              <circle cx="24" cy="12" fill="#f79e1b" r="7" />
              <path d="M18 16.9c-2.7-2-5.4-4-8.1-5.9 2.7-2 5.4-4 8.1-5.9 2.7 2 5.4 4 8.1 5.9-2.7 1.9-5.4 3.9-8.1 5.9z" fill="#ff5f00" />
            </g>
          </svg>
        </div>
        <div className="h-6">
          <svg viewBox="0 0 36 24" height="24" width="36" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <rect fill="#fff" height="24" rx="2" stroke="#d9d9d9" width="36" />
              <path d="M10 9h2.5v6H10z" fill="#00579f" />
              <path d="M15.98 9.25c-.5-.2-1.08-.25-1.78-.25h-2.2v6h2.2c.7 0 1.4-.08 1.87-.3.5-.2.9-.5 1.2-.9.4-.6.6-1.3.6-2.3 0-.9-.2-1.5-.5-2-.3-.5-.7-.9-1.4-1.2z" fill="#00579f" />
              <path d="M23.2 11.5c0-1-.6-1.7-2-1.7-.5 0-1 .1-1.3.2l.1 1c.3-.2.7-.3 1.1-.3.6 0 .9.2.9.7v.2h-.7c-1.3 0-2 .5-2 1.5 0 .6.4 1.2 1.4 1.2.6 0 1-.2 1.3-.5h.1l.1.4h1.2c0-.2-.1-.7-.1-1.2v-1.5zm-1.2 1c0 .1 0 .2-.1.3-.1.3-.4.5-.8.5-.3 0-.6-.2-.6-.6 0-.5.5-.7 1.2-.7h.3v.5z" fill="#00579f" />
              <path d="M24 9h1.3v3.7c0 .6.2 1 .8 1 .3 0 .5-.1.7-.2V9h1.3v6h-1.2l-.1-.4h-.1c-.3.3-.7.5-1.3.5-1.2 0-1.5-.8-1.5-2V9z" fill="#00579f" />
              <path d="M12.6 9.3c.3 0 .5 0 .7.2l.2-1.2c-.2 0-.5-.1-.8-.1-1 0-1.6.5-2 1.2L10.5 9H9.2l-.2 1h1v3.7h1.3V10h1c.1-.4.4-.7 1.3-.7z" fill="#faa61a" />
              <path d="M17 12.3c0-.3-.2-.5-.6-.7-.3-.2-.5-.3-.5-.5 0-.2.2-.3.5-.3.3 0 .6.1.8.2l.1-1c-.3-.1-.6-.2-1-.2-1.2 0-1.9.6-1.9 1.5 0 .6.5 1 .9 1.2.4.2.5.4.5.6 0 .2-.2.4-.6.4-.3 0-.7-.1-1-.3l-.2 1c.3.2.8.3 1.3.3 1.3 0 2-.7 2-1.7z" fill="#faa61a" />
            </g>
          </svg>
        </div>
        <div className="h-6">
          <svg viewBox="0 0 36 24" height="24" width="36" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <rect fill="#016fd0" height="24" rx="2" width="36" />
              <path d="M18.5 15.5h-7V17h7z" fill="#fff" />
              <path d="M12.5 7.5h5v8h-5z" fill="#fff" />
              <path d="M22.5 7.5h1v1h-1z" fill="#fff" />
              <path d="M24.5 9.5h-3v1h3zM24.5 11.5h-3v1h3zM24.5 13.5h-3v1h3zM24.5 15.5h-3v1h3z" fill="#fff" />
            </g>
          </svg>
        </div>
      </div>
    </form>
  );
} 