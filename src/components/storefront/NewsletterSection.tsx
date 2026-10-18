import React, { useState } from 'react';
import { subscribeEmail } from '../../services/storageService';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = subscribeEmail(email);
    if (res.success) {
      setStatus({ type: 'success', message: res.message });
      setEmail('');
    } else {
      setStatus({ type: 'error', message: res.message });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#DED6CD] py-14 sm:py-16">
      {/* Background with fine jewellery chain texture */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1800&q=80"
          alt="Fine jewellery chains background texture"
          className="w-full h-full object-cover opacity-25 filter blur-xs"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-[#E5D9CC]/85" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-[13px] sm:text-[14px] font-medium tracking-[0.25em] text-[#292521] uppercase mb-2">
          STAY INSPIRED
        </h2>
        <p className="text-sm text-[#716A63] font-light max-w-md mx-auto mb-6">
          Join our community for new arrivals, stories, and special offers.
        </p>

        {/* Input & Subscribe Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status.type) setStatus({ type: null, message: '' });
            }}
            placeholder="Enter your email"
            className="flex-1 bg-white border border-[#B9A99A] px-4 py-2.5 text-xs text-[#292521] placeholder-[#716A63] focus:outline-none focus:border-[#292521] shadow-2xs"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#292521] text-white hover:bg-[#B89559] text-[11px] uppercase tracking-[0.18em] font-medium transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            SUBSCRIBE
          </button>
        </form>

        {/* Real Status Feedback */}
        {status.type && (
          <div
            className={`mt-3 inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-xs ${
              status.type === 'success'
                ? 'text-[#2e6930] bg-[#e8f5e9] border border-[#c8e6c9]'
                : 'text-[#c62828] bg-[#ffebee] border border-[#ffcdd2]'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            <span>{status.message}</span>
          </div>
        )}
      </div>
    </section>
  );
};
