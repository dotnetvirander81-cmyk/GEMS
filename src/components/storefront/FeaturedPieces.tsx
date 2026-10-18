import React from 'react';
import { Heart, Eye, Plus } from 'lucide-react';
import { Product } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface FeaturedPiecesProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  onViewAllClick: () => void;
}

export const FeaturedPieces: React.FC<FeaturedPiecesProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
  onViewAllClick,
}) => {
  // Filter only active featured products (up to 5 for desktop layout)
  const featured = products.filter((p) => p.isFeatured && p.status === 'active').slice(0, 5);

  return (
    <section id="featured-pieces" className="bg-[#F8F5F0] border-b border-[#DED6CD] py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#DED6CD]/60">
          <h2 className="text-[14px] sm:text-[15px] font-medium tracking-[0.2em] text-[#292521] uppercase">
            FEATURED PIECES
          </h2>
          <button
            onClick={onViewAllClick}
            className="group flex items-center gap-1.5 text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-[#716A63] hover:text-[#292521] transition-colors cursor-pointer"
          >
            <span>View all</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>

        {/* 5-Column Desktop Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {featured.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.lowStockThreshold;
            const isOutOfStock = product.stockQuantity <= 0;

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between bg-transparent transition-all duration-200"
              >
                {/* Product Card Top: Image + Floating Wishlist */}
                <div className="relative aspect-[4/4.2] overflow-hidden bg-[#F0EAE2] border border-[#DED6CD]/70">
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

                  {/* Wishlist Heart Icon Top-Right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/70 hover:bg-white text-[#292521] transition-all cursor-pointer shadow-2xs"
                    aria-label={`Save ${product.name} to wishlist`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        isWishlisted ? 'fill-[#B89559] stroke-[#B89559]' : 'stroke-[#292521]'
                      }`}
                    />
                  </button>

                  {/* Stock notice banner if low */}
                  {isLowStock && (
                    <span className="absolute bottom-2 left-2 text-[10px] tracking-wider uppercase bg-[#292521]/80 text-[#F8F5F0] px-2 py-0.5 backdrop-blur-xs">
                      Only {product.stockQuantity} Left
                    </span>
                  )}
                  {isOutOfStock && (
                    <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-[11px] tracking-widest uppercase text-white font-medium">
                      Sold Out
                    </span>
                  )}

                  {/* Quick Action Overlay on hover */}
                  {!isOutOfStock && (
                    <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="flex-1 py-1.5 bg-white/95 text-[#292521] hover:bg-[#292521] hover:text-white text-[10px] uppercase tracking-wider font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Quick View</span>
                      </button>
                      <button
                        onClick={() => onQuickAddToCart(product)}
                        className="p-1.5 bg-[#B89559] text-white hover:bg-[#9e7d45] transition-colors cursor-pointer shadow-xs"
                        title="Add to Bag"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Product Metadata */}
                <div className="pt-3 text-left">
                  {/* Title */}
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="font-serif-luxury text-[15px] sm:text-[16px] text-[#292521] font-normal leading-snug line-clamp-1 cursor-pointer hover:text-[#B89559] transition-colors"
                  >
                    {product.name}
                  </h3>

                  {/* Artisan Subtitle */}
                  <p className="text-[11px] text-[#716A63] font-light mt-0.5 line-clamp-1">
                    by {product.artisanName}
                  </p>

                  {/* Price */}
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-[13px] sm:text-[14px] font-medium text-[#292521] font-mono-nums">
                      ₹{product.price}
                    </span>
                    {product.salePrice && (
                      <span className="text-[12px] text-[#716A63] line-through font-mono-nums">
                        ₹{product.salePrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
