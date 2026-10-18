import React from 'react';
import { Truck, ShieldCheck, RotateCcw, HeartHandshake, Leaf } from 'lucide-react';

export const ServiceBenefits: React.FC = () => {
  const benefits = [
    {
      icon: Truck,
      title: 'FREE SHIPPING',
      description: 'On orders over ₹250',
    },
    {
      icon: ShieldCheck,
      title: 'SECURE PAYMENTS',
      description: 'Safe & Encrypted',
    },
    {
      icon: RotateCcw,
      title: 'EASY RETURNS',
      description: '30-day returns',
    },
    {
      icon: HeartHandshake,
      title: 'SUPPORT ARTISANS',
      description: 'Directly empower makers',
    },
    {
      icon: Leaf,
      title: 'SUSTAINABLE CHOICES',
      description: 'Ethical & Responsible',
    },
  ];

  return (
    <section className="bg-[#F8F5F0] border-b border-[#DED6CD] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 text-center">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} className="flex flex-col items-center">
                <Icon className="w-5 h-5 text-[#B89559] mb-2 stroke-[1.4]" />
                <h4 className="text-[11px] font-medium tracking-[0.16em] text-[#292521] uppercase">
                  {b.title}
                </h4>
                <p className="text-[11px] text-[#716A63] font-light mt-0.5">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
