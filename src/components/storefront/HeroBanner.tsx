import React from 'react';
import { SiteContent } from '../../types';

interface HeroBannerProps {
  content: SiteContent;
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ content, onExploreClick }) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#1E1B18] text-[#F8F5F0]">
      {/* Background Image Container with dark luxury gradient scrim */}
      <div className="relative min-h-[360px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[520px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={content.heroImage}
            alt="Handcrafted artisan gold rings and gemstones"
            className="w-full h-full object-cover object-right-top md:object-right"
            referrerPolicy="no-referrer"
          />
          {/* Subtle directional dark overlay on left to guarantee WCAG contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#181512]/90 via-[#181512]/60 to-transparent" />
          {/* Subtle bottom vignette to blend naturally */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#181512]/40 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-12 md:py-16 w-full">
          <div className="max-w-xl">
            {/* Main Editorial Heading */}
            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal tracking-wide text-white leading-[1.12] mb-4 whitespace-pre-line drop-shadow-sm">
              {content.heroHeading}
            </h2>

            {/* Subheading / Description */}
            <p className="text-sm sm:text-base text-[#E5D9CC] font-light tracking-wide leading-relaxed mb-8 max-w-md">
              {content.heroSubheading}
            </p>

            {/* Primary Action Button */}
            <div>
              <button
                onClick={onExploreClick}
                className="inline-block px-7 py-3 text-[11px] sm:text-[12px] uppercase tracking-[0.2em] font-medium text-[#F8F5F0] bg-black/30 hover:bg-white hover:text-[#292521] border border-[#F8F5F0]/60 hover:border-white transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99]"
              >
                {content.heroButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
