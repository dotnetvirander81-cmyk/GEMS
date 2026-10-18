import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: 'ring' | 'necklace' | 'earrings' | 'bracelet' | 'artisan' | 'journal' | 'hero';
  title?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackType = 'ring',
  title,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F0EAE2] border border-[#DED6CD] text-[#716A63] p-4 text-center select-none ${className}`}
        role="img"
        aria-label={alt || 'Jewellery image'}
      >
        <svg
          className="w-10 h-10 mb-2 stroke-[#B89559] opacity-80"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {fallbackType === 'ring' && (
            <>
              <circle cx="12" cy="14" r="7" />
              <polygon points="12 3 15 7 9 7" fill="#B89559" fillOpacity="0.2" />
            </>
          )}
          {fallbackType === 'necklace' && (
            <>
              <path d="M6 3c0 6 3 13 6 13s6-7 6-13" />
              <circle cx="12" cy="18" r="2.5" fill="#B89559" fillOpacity="0.2" />
            </>
          )}
          {fallbackType === 'earrings' && (
            <>
              <circle cx="8" cy="8" r="3" />
              <path d="M8 11v6" />
              <circle cx="16" cy="8" r="3" />
              <path d="M16 11v6" />
            </>
          )}
          {fallbackType === 'bracelet' && (
            <>
              <ellipse cx="12" cy="12" rx="8" ry="5" />
              <circle cx="12" cy="7" r="1.5" fill="#B89559" />
            </>
          )}
          {fallbackType === 'artisan' && (
            <>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </>
          )}
          {(fallbackType === 'journal' || fallbackType === 'hero') && (
            <>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </>
          )}
        </svg>
        <span className="text-[11px] uppercase tracking-wider text-[#716A63] line-clamp-1">
          {title || alt || 'Artisan Craft'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || 'Kriday Gems & Jeweler Marketplace'}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      loading="lazy"
      className={className}
      {...props}
    />
  );
};
