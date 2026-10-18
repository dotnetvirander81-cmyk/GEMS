import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../../types';

interface CustomerReviewsProps {
  reviews: Review[];
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews }) => {
  const featured = reviews.filter((r) => r.isHomepageFeatured).slice(0, 3);

  return (
    <section className="bg-[#F8F5F0] border-b border-[#DED6CD] py-14 sm:py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <h2 className="text-[13px] sm:text-[14px] font-medium tracking-[0.2em] text-[#292521] uppercase">
            WHAT OUR CUSTOMERS SAY
          </h2>
        </div>

        {/* 3 Evenly Spaced Testimonial Columns Separated by Subtle Vertical Lines */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#DED6CD]">
          {featured.map((rev) => (
            <div key={rev.id} className="flex flex-col items-center text-center px-4 sm:px-8 py-6 md:py-2">
              {/* 5 Gold Stars */}
              <div className="flex items-center gap-1 mb-3.5">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#B89559] stroke-[#B89559]" />
                ))}
              </div>

              {/* Review Quote */}
              <p className="font-serif-luxury text-[17px] sm:text-[18px] text-[#292521] font-normal leading-relaxed italic max-w-xs mb-4">
                "{rev.comment}"
              </p>

              {/* Author */}
              <span className="text-[12px] uppercase tracking-[0.16em] text-[#716A63] font-medium">
                — {rev.author}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
