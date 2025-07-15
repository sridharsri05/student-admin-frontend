import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function StripeDebug() {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const maskedKey = stripeKey ? `${stripeKey.slice(0, 7)}...${stripeKey.slice(-4)}` : 'Not found';
  
  return (
    <div className="p-4">
      <Alert variant={stripeKey ? "default" : "destructive"}>
        <AlertDescription>
          Stripe Key Status: {stripeKey ? 'Found' : 'Missing'}<br />
          Key Format: {maskedKey}<br />
          Valid Format: {stripeKey?.startsWith('pk_') ? 'Yes' : 'No'}<br />
          Environment: {import.meta.env.MODE}
        </AlertDescription>
      </Alert>
    </div>
  );
} 