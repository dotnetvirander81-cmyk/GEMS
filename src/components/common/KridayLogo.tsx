import React from 'react';

interface KridayLogoProps {
  className?: string;
  variant?: 'header' | 'stacked' | 'mark-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
}

export const KridayLogo: React.FC<KridayLogoProps> = ({
  className = '',
  variant = 'header',
  size = 'md',
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  // Premium jewelry gradients (Champagne gold, Warm Rose gold, Brilliant cut Diamond)
  const gradientDefs = (
    <defs>
      {/* 24K Rich Artisan Gold */}
      <linearGradient id="kridayGoldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DFB260" />
        <stop offset="30%" stopColor="#F9E2AF" />
        <stop offset="55%" stopColor="#C4933F" />
        <stop offset="85%" stopColor="#E8C37B" />
        <stop offset="100%" stopColor="#9B6E27" />
      </linearGradient>

      {/* Royal Rose Gold Bevel */}
      <linearGradient id="kridayRoseGold" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#9E6845" />
        <stop offset="40%" stopColor="#E6BA9A" />
        <stop offset="70%" stopColor="#F5D2BA" />
        <stop offset="100%" stopColor="#B37750" />
      </linearGradient>

      {/* Brilliant Diamond Ice Facets */}
      <linearGradient id="kridayDiamondIce1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="45%" stopColor="#E8F4FA" />
        <stop offset="80%" stopColor="#A5D0E4" />
        <stop offset="100%" stopColor="#FFFFFF" />
      </linearGradient>
      <linearGradient id="kridayDiamondIce2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#D5ECF8" />
        <stop offset="60%" stopColor="#91C3DC" />
        <stop offset="100%" stopColor="#F7FCFE" />
      </linearGradient>

      <filter id="kridayGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="0.7" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  );

  // The Royal Kriday Jewel Crest SVG: Multifaceted Brilliant Cut Diamond + 'K' Monogram
  const renderEmblem = (emblemSizeClass: string) => (
    <svg
      viewBox="0 0 100 100"
      className={`${emblemSizeClass} shrink-0 transition-transform duration-300 group-hover:scale-105`}
      aria-hidden="true"
    >
      {gradientDefs}

      {/* Outer Hexagonal Gemstone Silhouette Frame */}
      <polygon
        points="50,4 88,24 88,76 50,96 12,76 12,24"
        fill="none"
        stroke="url(#kridayGoldMetallic)"
        strokeWidth="1.8"
      />
      <polygon
        points="50,9 83,27 83,73 50,91 17,73 17,27"
        fill={isDark ? '#231F1C' : '#FAF7F2'}
        stroke="url(#kridayRoseGold)"
        strokeWidth="0.75"
        strokeOpacity="0.8"
      />

      {/* Top Crown Facet Triangles */}
      <polygon points="50,9 66,27 50,34 34,27" fill="url(#kridayDiamondIce1)" stroke="#89B4C9" strokeWidth="0.4" />
      <polygon points="34,27 17,27 34,42" fill="url(#kridayDiamondIce2)" stroke="#89B4C9" strokeWidth="0.4" />
      <polygon points="66,27 83,27 66,42" fill="url(#kridayDiamondIce2)" stroke="#89B4C9" strokeWidth="0.4" />

      {/* Royal 'K' Monogram in Handcrafted Fine Gold */}
      <g fill="url(#kridayGoldMetallic)" stroke={isDark ? '#6B4C25' : '#8A5E2E'} strokeWidth="0.6">
        {/* Left Vertical Pillar with Classic Serif Caps */}
        <path d="M 31,30 L 40,30 L 40,33 L 37,33 L 37,67 L 40,67 L 40,70 L 31,70 L 31,67 L 34,67 L 34,33 L 31,33 Z" />
        {/* Upper Diagonal Arm with Serif Terminal */}
        <path d="M 37,51 L 55,30 L 51,27 L 66,27 L 66,30 L 61,30 L 46,48 L 41,52 Z" />
        {/* Lower Diagonal Arm with Flourish */}
        <path d="M 43,45 L 63,67 L 69,67 L 69,70 L 52,70 L 52,67 L 57,67 L 40,49 Z" />
      </g>

      {/* Center Brilliant Cut Solitaire Gem nested between arms */}
      <g transform="translate(56, 38) scale(0.65)">
        <polygon points="12,2 20,2 24,7 8,7" fill="url(#kridayDiamondIce1)" stroke="#5B8296" strokeWidth="0.5" />
        <polygon points="4,7 16,21 8,7" fill="url(#kridayDiamondIce2)" stroke="#5B8296" strokeWidth="0.5" />
        <polygon points="8,7 16,21 16,7" fill="#FFFFFF" stroke="#5B8296" strokeWidth="0.5" />
        <polygon points="16,7 16,21 24,7" fill="#C4E0EF" stroke="#5B8296" strokeWidth="0.5" />
        <polygon points="24,7 16,21 28,7" fill="url(#kridayDiamondIce1)" stroke="#5B8296" strokeWidth="0.5" />
        {/* Diamond Flare / Starburst Sparkle */}
        <circle cx="16" cy="7" r="1.8" fill="#FFFFFF" filter="url(#kridayGlow)" />
        <line x1="16" y1="2" x2="16" y2="12" stroke="#FFFFFF" strokeWidth="0.75" />
        <line x1="11" y1="7" x2="21" y2="7" stroke="#FFFFFF" strokeWidth="0.75" />
      </g>

      {/* Bottom Diamond Pavilion Facet Ribs */}
      <line x1="50" y1="70" x2="50" y2="91" stroke="url(#kridayGoldMetallic)" strokeWidth="0.75" strokeOpacity="0.7" />
      <line x1="37" y1="67" x2="17" y2="73" stroke="url(#kridayGoldMetallic)" strokeWidth="0.5" strokeOpacity="0.6" />
      <line x1="63" y1="67" x2="83" y2="73" stroke="url(#kridayGoldMetallic)" strokeWidth="0.5" strokeOpacity="0.6" />
    </svg>
  );

  // Variant 1: Mark Only (e.g. favicon, mobile app icons, small badges)
  if (variant === 'mark-only') {
    const markDimensions =
      size === 'sm'
        ? 'w-8 h-8'
        : size === 'lg'
        ? 'w-16 h-16'
        : size === 'xl'
        ? 'w-20 h-20'
        : 'w-12 h-12';
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderEmblem(markDimensions)}
      </div>
    );
  }

  // Variant 2: Stacked (Centered vertical lockup for Footers, Modals, Welcome screens)
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none group ${className}`}>
        {renderEmblem(
          size === 'sm'
            ? 'w-12 h-12'
            : size === 'lg'
            ? 'w-20 h-20'
            : size === 'xl'
            ? 'w-24 h-24'
            : 'w-16 h-16'
        )}

        {/* Wordmark KRIDAY */}
        <h2
          className={`font-serif-luxury font-semibold tracking-[0.26em] uppercase leading-none mt-3 transition-colors ${
            isDark ? 'text-[#F8F5F0] group-hover:text-[#DFB260]' : 'text-[#24201D] group-hover:text-[#A66E49]'
          } ${
            size === 'sm'
              ? 'text-2xl'
              : size === 'lg'
              ? 'text-4xl'
              : size === 'xl'
              ? 'text-5xl'
              : 'text-3xl'
          }`}
        >
          KRIDAY
        </h2>

        {/* Subtitle */}
        <div className="flex items-center gap-2 mt-2">
          <span className={`h-px w-3 sm:w-4 ${isDark ? 'bg-[#5A5046]' : 'bg-[#DED6CD]'}`} />
          <p
            className={`text-[9px] sm:text-[10.5px] tracking-[0.26em] font-medium uppercase whitespace-nowrap ${
              isDark ? 'text-[#B9A99A]' : 'text-[#716A63]'
            }`}
          >
            GEMS &amp; JEWELER MARKETPLACE
          </p>
          <span className={`h-px w-3 sm:w-4 ${isDark ? 'bg-[#5A5046]' : 'bg-[#DED6CD]'}`} />
        </div>
      </div>
    );
  }

  // Variant 3: Default 'header' Horizontal Luxury Lockup
  // Perfectly calibrated for top navbar, responsive, high-contrast, zero-flicker
  const headerMarkSize =
    size === 'sm'
      ? 'w-8 h-8 sm:w-9 sm:h-9'
      : size === 'lg'
      ? 'w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15'
      : size === 'xl'
      ? 'w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18'
      : 'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-13 lg:h-13';

  const wordmarkSize =
    size === 'sm'
      ? 'text-lg sm:text-xl'
      : size === 'lg'
      ? 'text-2xl sm:text-3xl md:text-4xl'
      : size === 'xl'
      ? 'text-3xl sm:text-4xl md:text-5xl'
      : 'text-xl sm:text-2xl md:text-[26px] lg:text-[28px]';

  const subtitleSize =
    size === 'sm'
      ? 'text-[7px] sm:text-[8px] tracking-[0.20em]'
      : size === 'lg'
      ? 'text-[8.5px] sm:text-[10px] md:text-[11.5px] tracking-[0.24em]'
      : size === 'xl'
      ? 'text-[10px] sm:text-[12px] md:text-[13px] tracking-[0.26em]'
      : 'text-[7.5px] sm:text-[8.5px] md:text-[9.5px] lg:text-[10.5px] tracking-[0.22em]';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3.5 cursor-pointer select-none group ${className}`}>
      {/* Handcrafted Jewel Emblem */}
      {renderEmblem(headerMarkSize)}

      {/* Brand Text Stack */}
      <div className="flex flex-col justify-center text-left">
        <span
          className={`font-serif-luxury font-bold tracking-[0.24em] uppercase leading-none transition-colors duration-200 ${
            isDark
              ? 'text-[#F8F5F0] group-hover:text-[#DFB260]'
              : 'text-[#24201D] group-hover:text-[#A66E49]'
          } ${wordmarkSize}`}
        >
          KRIDAY
        </span>
        <span
          className={`${subtitleSize} font-medium uppercase mt-0.5 sm:mt-1 whitespace-nowrap transition-colors ${
            isDark ? 'text-[#B9A99A]' : 'text-[#716A63]'
          }`}
        >
          GEMS &amp; JEWELER MARKETPLACE
        </span>
      </div>
    </div>
  );
};
