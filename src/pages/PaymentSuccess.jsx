import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function PaymentSuccess() {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Initialize Stripe
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        
        // Get the payment intent client secret and payment ID from the URL
        const clientSecret = new URLSearchParams(location.search).get('payment_intent_client_secret') || 
                            new URLSearchParams(location.search).get('clientSecret');
        const paymentId = new URLSearchParams(location.search).get('paymentId');

        if (!clientSecret) {
          setError('Payment verification failed. Missing payment information.');
          return;
        }

        // Retrieve the payment intent
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        
        console.log('Payment Intent Retrieved in Success Page', {
          status: paymentIntent.status,
          id: paymentIntent.id,
          paymentId: paymentId
        });
        
        // Set payment data for display
        setPaymentData({
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          id: paymentIntent.id,
          paymentMethod: paymentIntent.payment_method_types?.[0] || 'card'
        });
        
        switch (paymentIntent.status) {
          case 'succeeded':
            setStatus('success');
            
            // Call manual update endpoint to ensure database is updated
            if (paymentId) {
              try {
                console.log('Attempting to update payment status in database');
                const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'https://student-server-ten.vercel.app/api'}/stripe/manual-update`, {
                  paymentId: paymentId,
                  paymentIntentId: paymentIntent.id
                });
                
                console.log('Manual update response:', response.data);
                
                toast({
                  title: 'Payment Successful',
                  description: 'Thank you for your payment. Your transaction has been completed.',
                  variant: 'success'
                });
              } catch (updateError) {
                console.error('Error updating payment status:', updateError);
                // Still show success to user since payment succeeded in Stripe
                toast({
                  title: 'Payment Successful',
                  description: 'Your payment was successful, but we encountered an issue updating our records. Our team will verify your payment shortly.',
                  variant: 'success'
                });
              }
            } else {
              toast({
                title: 'Payment Successful',
                description: 'Thank you for your payment. Your transaction has been completed.',
                variant: 'success'
              });
            }
            break;
          case 'processing':
            setStatus('processing');
            toast({
              title: 'Payment Processing',
              description: 'Your payment is being processed. We\'ll update you when it\'s complete.',
              variant: 'info'
            });
            break;
          case 'requires_payment_method':
            setStatus('failed');
            setError('Payment failed. Please try another payment method.');
            toast({
              variant: "destructive",
              title: "Payment Failed",
              description: "Please try another payment method."
            });
            break;
          default:
            setStatus('failed');
            setError('Something went wrong with your payment.');
            toast({
              variant: "destructive",
              title: "Payment Error",
              description: "Something went wrong with your payment."
            });
            break;
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setStatus('failed');
        setError('Failed to verify payment status.');
      }
    };

    verifyPayment();
  }, [location.search, toast]);

  const getStatusContent = () => {
    switch (status) {
      case 'success':
        return {
          title: 'Payment Successful!',
          description: 'Your payment has been processed successfully.',
          icon: (
            <div className="rounded-full bg-green-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          ),
          color: 'bg-gradient-to-r from-green-600 to-emerald-700'
        };
      case 'processing':
        return {
          title: 'Processing Payment',
          description: 'Your payment is being processed. Please wait...',
          icon: (
            <div className="rounded-full bg-blue-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" fill="none" />
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" strokeOpacity="0.75" fill="none" />
                <path d="M12 2C6.47715 2 2 6.47715 2 12" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          ),
          color: 'bg-gradient-to-r from-blue-600 to-indigo-700'
        };
      case 'failed':
        return {
          title: 'Payment Failed',
          description: error || 'There was an error processing your payment.',
          icon: (
            <div className="rounded-full bg-red-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          ),
          color: 'bg-gradient-to-r from-red-600 to-rose-700'
        };
      default:
        return {
          title: 'Verifying Payment',
          description: 'Please wait while we verify your payment...',
          icon: (
            <div className="rounded-full bg-gray-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
          ),
          color: 'bg-gradient-to-r from-gray-600 to-gray-700'
        };
    }
  };

  const content = getStatusContent();

  return (
    <div className="min-h-[80vh] w-full bg-gradient-to-b from-gray-50 to-white px-4 py-8 sm:px-6 sm:py-12">
      <div className="container mx-auto max-w-2xl">
        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 text-white p-2 rounded-lg shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-800">Student Registration System</span>
          </div>
        </div>

        <Card className="overflow-hidden border-gray-200/50 shadow-xl">
          <CardHeader className={`space-y-1 ${content.color} px-6 py-6 text-center`}>
            <div className="flex justify-center mb-4">
              {content.icon}
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              {content.title}
            </CardTitle>
            <CardDescription className="text-white/80">
              {content.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {status === 'success' && paymentData && (
              <div className="rounded-lg bg-green-50 p-5 border border-green-100 shadow-sm">
                <div className="space-y-3">
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <p className="text-sm text-green-800 mb-1">
                      A confirmation email will be sent to your registered email address.
                    </p>
                    <p className="text-xs text-green-700">
                      Transaction Reference: <span className="font-mono bg-green-100 px-2 py-1 rounded">{paymentData.id.slice(-8)}</span>
                    </p>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-sm font-medium text-gray-600">Amount Paid</span>
                    <span className="text-lg font-semibold text-green-700">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: paymentData.currency?.toUpperCase() || 'INR'
                      }).format(paymentData.amount)}
                    </span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-sm font-medium text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-800">
                      {paymentData.paymentMethod === 'card' ? 'Credit/Debit Card' : paymentData.paymentMethod}
                    </span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-sm font-medium text-gray-600">Date</span>
                    <span className="font-medium text-gray-800">
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {status === 'processing' && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center gap-4 bg-gray-50/50 px-6 py-4">
            <Button
              onClick={() => navigate('/fees')}
              variant={status === 'success' ? 'default' : 'outline'}
              className={`min-w-[160px] ${status === 'success' ? 'bg-teal-600 hover:bg-teal-700' : ''}`}
            >
              {status === 'success' ? 'View Dashboard' : 'Go to Dashboard'}
            </Button>
            {status === 'failed' && (
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="min-w-[160px]"
              >
                Try Again
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Student Registration System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
} 