import React, { useState } from 'react';
import { Heart, Plus, Eye, Filter } from 'lucide-react';
import { Product } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface ShopCollectionProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  activeCategoryFilter: string | null;
  onCategoryFilterChange: (catId: string | null) => void;
  searchQuery: string;
}

export const ShopCollection: React.FC<ShopCollectionProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
  activeCategoryFilter,
  onCategoryFilterChange,
  searchQuery,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'best-sellers', label: 'Best Sellers' },
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'cat-necklaces', label: 'Necklaces' },
    { id: 'cat-rings', label: 'Rings' },
    { id: 'cat-earrings', label: 'Earrings' },
    { id: 'cat-bracelets', label: 'Bracelets' },
  ];

  // Apply tab, category, search, and sort logic
  let filtered = products.filter((p) => p.status === 'active');

  // Search query filter (matches name, description, artisan, gemstone, or Product ID)
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.productId.toLowerCase().includes(q) ||
        p.artisanName.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        (p.gemstone && p.gemstone.toLowerCase().includes(q)) ||
        p.material.toLowerCase().includes(q)
    );
  }

  // Category filter from top strip
  if (activeCategoryFilter) {
    filtered = filtered.filter((p) => p.categoryId === activeCategoryFilter);
  }

  // Collection Tab filter
  if (activeTab === 'best-sellers') {
    filtered = filtered.filter((p) => p.isBestSeller);
  } else if (activeTab === 'new-arrivals') {
    filtered = filtered.filter((p) => p.isNewArrival);
  } else if (activeTab.startsWith('cat-')) {
    filtered = filtered.filter((p) => p.categoryId === activeTab);
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <section id="shop-collection" className="bg-[#F8F5F0] border-b border-[#DED6CD] py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Heading */}
        <div className="text-center mb-6">
          <h2 className="text-[14px] sm:text-[15px] font-medium tracking-[0.2em] text-[#292521] uppercase">
            SHOP OUR COLLECTION
          </h2>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 mb-8 text-[12px] sm:text-[13px] tracking-wider uppercase">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.id && !activeCategoryFilter;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (activeCategoryFilter) onCategoryFilterChange(null);
                }}
                className={`pb-1 transition-all cursor-pointer font-medium whitespace-nowrap ${
                  isActive
                    ? 'text-[#292521] border-b-2 border-[#292521]'
                    : 'text-[#716A63] hover:text-[#292521]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          <button
            onClick={() => {
              setActiveTab('all');
              onCategoryFilterChange(null);
            }}
            className="text-[#716A63] hover:text-[#292521] pb-1 transition-colors cursor-pointer group flex items-center gap-1"
          >
            <span>View all products</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        </div>

        {/* Search / Active Filter Feedback & Sorter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 text-xs text-[#716A63] px-1">
          <div>
            <span>Showing {filtered.length} unique handcrafted pieces</span>
            {(searchQuery || activeCategoryFilter) && (
              <span className="ml-2 font-medium text-[#292521]">
                (filtered by {searchQuery ? `"${searchQuery}"` : ''} {activeCategoryFilter ? 'category' : ''})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="uppercase tracking-wider text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#F0EAE2] border border-[#DED6CD] text-[#292521] py-1 px-2.5 rounded-xs text-[11px] focus:outline-none focus:border-[#B89559]"
            >
              <option value="featured">Curated & Featured</option>
              <option value="newest">Newest Additions</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* 6-Column Desktop Product Grid */}
        {filtered.length === 0 ? (
          <div className="bg-[#F0EAE2] border border-[#DED6CD] py-16 px-6 text-center">
            <p className="font-serif-luxury text-2xl text-[#292521] mb-2">No pieces found</p>
            <p className="text-sm text-[#716A63] max-w-md mx-auto mb-6">
              We couldn't find any jewelry matching your current selection. Try resetting filters or browsing our all collection.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                onCategoryFilterChange(null);
              }}
              className="px-6 py-2.5 bg-[#292521] text-white text-xs uppercase tracking-widest hover:bg-[#B89559] transition-colors"
            >
              Show All Jewelry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-5">
            {filtered.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const isOutOfStock = product.stockQuantity <= 0;

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between bg-transparent transition-all duration-200"
                >
                  {/* Product Card Top: Image + Floating Wishlist */}
                  <div className="relative aspect-square overflow-hidden bg-[#F0EAE2] border border-[#DED6CD]/70">
                    <div
                      onClick={() => onSelectProduct(product)}
                      className="w-full h-full cursor-pointer"
                    >
                      <ImageWithFallback
                        src={product.mainImage}
                        alt={product.name}
                        title={product.name}
                        fallbackType={
                          product.categoryId.includes('ring')
                            ? 'ring'
                            : product.categoryId.includes('neck')
                            ? 'necklace'
                            : product.categoryId.includes('earr')
                            ? 'earrings'
                            : 'bracelet'
                        }
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Wishlist Heart Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/70 hover:bg-white text-[#292521] transition-all cursor-pointer shadow-2xs"
                      aria-label={`Save ${product.name} to wishlist`}
                    >
                      <Heart
                        className={`w-3 h-3 transition-colors ${
                          isWishlisted ? 'fill-[#B89559] stroke-[#B89559]' : 'stroke-[#292521]'
                        }`}
                      />
                    </button>

                    {/* Sold out badge */}
                    {isOutOfStock && (
                      <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] tracking-widest uppercase text-white font-medium">
                        Sold Out
                      </span>
                    )}

                    {/* Quick Add Overlay */}
                    {!isOutOfStock && (
                      <div className="absolute inset-x-0 bottom-0 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                        <button
                          onClick={() => onSelectProduct(product)}
                          className="flex-1 py-1 bg-white/95 text-[#292521] hover:bg-[#292521] hover:text-white text-[9px] uppercase tracking-wider font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-2.5 h-2.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => onQuickAddToCart(product)}
                          className="p-1 bg-[#B89559] text-white hover:bg-[#9e7d45] transition-colors cursor-pointer"
                          title="Add to Bag"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="pt-2.5 text-left">
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-serif-luxury text-[14px] text-[#292521] font-normal leading-snug line-clamp-1 cursor-pointer hover:text-[#B89559] transition-colors"
                    >
                      {product.name}
                    </h3>

                    <p className="text-[10px] text-[#716A63] font-light mt-0.5 line-clamp-1">
                      by {product.artisanName}
                    </p>

                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-[12px] sm:text-[13px] font-medium text-[#292521] font-mono-nums">
                        ₹{product.price}
                      </span>
                      {product.salePrice && (
                        <span className="text-[11px] text-[#716A63] line-through font-mono-nums">
                          ₹{product.salePrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
