import React from 'react';
import { Check } from 'lucide-react';
import Button from './ui/Button';

const plans = [
  { 
    name: 'Free Tier',
    price: '$0/month',
    features: ['✓Access to GPT-40 and Claude 3 Opus', '✓ Standard voice model', '✓ 1000 tokens per day'],
    current: true,
  },
  {
    name: 'Pro Upgrade',
    price: '$5/month',
    features: ['✓ Everything in free', '✓ Access to GPT-40 and Claude 3 Opus', '✓ Enhanced access', '✓ 5000 tokens per day'],
    current: false,
    
  },
  {
    name: 'Pro+ Upgrade',
    price: '$10/month',
    features: ['✓ Everything in Pro', '✓ Premium features', '✓ Full access', '✓ 10000 tokens per day'],
    current: false,
    bestValue: true,
  },
];

const SubscriptionPlans: React.FC = () => {
  return (
    <div className="min-h-2 bg-dark-300 text-white py-12 shadow-glow rounded-3xl ">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-8">Subscription Plans</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 rounded-3xl shadow-lg border-blue-200 hover:bg-primary-500/10 transition-colors duration-300
                ${plan.current ? 'bg-primary-500/20' : 'bg-dark-200'}`}
            >
              <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
              <p className="text-xl mb-4">{plan.price}</p>
              <ul className="mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center mb-2">
                    <Check className="h-5 w-5 text-primary-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              {!plan.current && (
                <Button size="md" className="w-full rounded-full">
                  Upgrade
                </Button>
              )}
              {plan.bestValue && (
                <p className="mt-5 text-sm justify-self-start rounded-full text-white border border-blue-300 bg-blue-500/30 px-3 py-1" >
                  Best Value
                </p>
              )}
              {plan.current && (
                <p className="mt-4 text-sm text-green-500">
                  Current Plan
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
