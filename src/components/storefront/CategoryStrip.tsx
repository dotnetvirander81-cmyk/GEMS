import React from 'react';
import { Category } from '../../types';

interface CategoryStripProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export const CategoryStrip: React.FC<CategoryStripProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  // Line illustrations for each jewelry category
  const renderCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'rings':
        return (
          <svg className="w-9 h-9 stroke-[#B89559]" viewBox="0 0 36 36" fill="none" strokeWidth="1.2">
            <ellipse cx="18" cy="20" rx="10" ry="7" />
            <polygon points="18 8 22 13 14 13" fill="#B89559" fillOpacity="0.25" />
          </svg>
        );
      case 'necklaces':
        return (
          <svg className="w-9 h-9 stroke-[#B89559]" viewBox="0 0 36 36" fill="none" strokeWidth="1.2">
            <path d="M10 6c0 8 4 16 8 16s8-8 8-16" />
            <circle cx="18" cy="24" r="3" fill="#B89559" fillOpacity="0.25" />
          </svg>
        );
      case 'earrings':
        return (
          <svg className="w-9 h-9 stroke-[#B89559]" viewBox="0 0 36 36" fill="none" strokeWidth="1.2">
            <circle cx="13" cy="12" r="3.5" />
            <path d="M13 16v9" />
            <circle cx="23" cy="12" r="3.5" />
            <path d="M23 16v9" />
          </svg>
        );
      case 'bracelets':
        return (
          <svg className="w-9 h-9 stroke-[#B89559]" viewBox="0 0 36 36" fill="none" strokeWidth="1.2">
            <circle cx="18" cy="18" r="10" strokeDasharray="3 3" />
            <circle cx="18" cy="10" r="2" fill="#B89559" />
            <circle cx="24" cy="22" r="1.5" fill="#B89559" />
          </svg>
        );
      case 'custom-made':
        return (
          <svg className="w-9 h-9 stroke-[#B89559]" viewBox="0 0 36 36" fill="none" strokeWidth="1.2">
            <circle cx="18" cy="18" r="9" />
            <text x="18" y="22" textAnchor="middle" fontSize="10" fontFamily="serif" fill="#B89559" stroke="none">M</text>
          </svg>
        );
      case 'wedding':
        return (
          <svg className="w-9 h-9 stroke-[#B89559]" viewBox="0 0 36 36" fill="none" strokeWidth="1.2">
            <ellipse cx="15" cy="18" rx="8" ry="6" />
            <ellipse cx="21" cy="18" rx="8" ry="6" />
          </svg>
        );
      default:
        return (
          <svg className="w-9 h-9 stroke-[#B89559]" viewBox="0 0 36 36" fill="none" strokeWidth="1.2">
            <circle cx="18" cy="18" r="8" />
          </svg>
        );
    }
  };

  return (
    <section id="category-strip" className="bg-[#F8F5F0] border-b border-[#DED6CD] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 lg:divide-x divide-[#DED6CD]">
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                className={`group flex flex-col items-center text-center px-3 py-4 sm:py-2 transition-all relative cursor-pointer ${
                  isSelected ? 'bg-[#F0EAE2]' : 'hover:bg-[#F0EAE2]/50'
                }`}
              >
                {/* Visual Icon Illustration */}
                <div className="mb-2.5 transition-transform duration-200 group-hover:scale-110">
                  {renderCategoryIcon(cat.slug)}
                </div>

                {/* Category Name */}
                <h3 className="text-[12px] sm:text-[13px] font-medium tracking-[0.14em] text-[#292521] uppercase">
                  {cat.name}
                </h3>

                {/* Subtitle */}
                <p className="text-[11px] text-[#716A63] font-light mt-0.5 tracking-normal">
                  {cat.subtitle}
                </p>

                {/* Active Indicator Underline */}
                {isSelected && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#B89559]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
