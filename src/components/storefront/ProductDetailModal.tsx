import React, { useState } from 'react';
import { Product } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { Heart, ShoppingBag, X, Check, Truck, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number, selectedSize?: string, selectedVariant?: string) => void;
  onSelectArtisan?: (artisanId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(product.mainImage);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.availableSizes && product.availableSizes.length > 0 ? product.availableSizes[0] : ''
  );
  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.variants && product.variants.length > 0 ? product.variants[0].name : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.lowStockThreshold;

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity, selectedSize, selectedVariant);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2200);
  };

  const allImages = product.images && product.images.length > 0 ? product.images : [product.mainImage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#F8F5F0] border border-[#DED6CD] max-w-4xl w-full max-h-[92vh] overflow-y-auto relative shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-[#716A63] hover:text-[#292521] p-1.5 bg-white/80 rounded-full cursor-pointer transition-colors"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
          {/* Left Column: Gallery */}
          <div>
            <div className="aspect-[4/4.5] overflow-hidden bg-[#F0EAE2] border border-[#DED6CD] mb-3 relative">
              <ImageWithFallback
                src={selectedImage}
                alt={product.name}
                fallbackType={
                  product.categoryId.includes('ring')
                    ? 'ring'
                    : product.categoryId.includes('neck')
                    ? 'necklace'
                    : product.categoryId.includes('earr')
                    ? 'earrings'
                    : 'bracelet'
                }
                className="w-full h-full object-cover"
              />
              {/* Product ID Watermark badge for authenticity */}
              <span className="absolute bottom-2 left-2 text-[10px] tracking-widest font-mono text-[#716A63] bg-white/80 px-2 py-0.5 border border-[#DED6CD]">
                {product.productId}
              </span>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 shrink-0 overflow-hidden border transition-all cursor-pointer ${
                      selectedImage === img ? 'border-[#292521] scale-105' : 'border-[#DED6CD] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ImageWithFallback src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Purchase Form */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Artisan & Category breadcrumb */}
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-[#716A63] mb-1.5">
                <span>{product.categoryName}</span>
                <span className="font-mono text-[10px]">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#292521] font-normal leading-snug">
                {product.name}
              </h2>

              {/* Artisan Attribution */}
              <p className="text-[12px] text-[#716A63] font-light mt-1 mb-4">
                Handcrafted by <span className="font-medium text-[#292521] underline decoration-[#B89559] underline-offset-4">{product.artisanName}</span>
              </p>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 pb-4 mb-4 border-b border-[#DED6CD]">
                <span className="text-2xl font-medium text-[#292521] font-mono-nums">
                  ₹{product.salePrice ?? product.price}
                </span>
                {product.salePrice && (
                  <span className="text-base text-[#716A63] line-through font-mono-nums">
                    ₹{product.price}
                  </span>
                )}
                {/* Stock Indicator */}
                <div className="ml-auto">
                  {isOutOfStock ? (
                    <span className="text-[11px] uppercase tracking-wider text-red-600 font-medium">Sold Out</span>
                  ) : isLowStock ? (
                    <span className="text-[11px] uppercase tracking-wider text-amber-700 font-medium">
                      Only {product.stockQuantity} left
                    </span>
                  ) : (
                    <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> In Stock & Ready to Ship
                    </span>
                  )}
                </div>
              </div>

              {/* Short & Full Description */}
              <p className="text-xs text-[#292521] font-light leading-relaxed mb-4">
                {product.shortDescription}
              </p>

              {/* Materials & Gemstone spec */}
              <div className="bg-[#F0EAE2] p-3 text-[11px] text-[#292521] space-y-1 mb-5 rounded-xs border border-[#DED6CD]/60">
                <div className="flex justify-between">
                  <span className="text-[#716A63]">Material:</span>
                  <span className="font-medium">{product.material}</span>
                </div>
                {product.gemstone && product.gemstone !== 'None' && (
                  <div className="flex justify-between">
                    <span className="text-[#716A63]">Gemstone:</span>
                    <span className="font-medium text-[#B89559]">{product.gemstone}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between">
                    <span className="text-[#716A63]">Weight / Dimensions:</span>
                    <span>{product.weight} · {product.dimensions || 'Standard fine gauge'}</span>
                  </div>
                )}
              </div>

              {/* Available Sizes Selector */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div className="mb-5">
                  <div className="flex justify-between text-[11px] uppercase tracking-wider text-[#716A63] mb-2">
                    <span>Select Size</span>
                    <span className="text-[#292521] underline cursor-pointer text-[10px]">Size Guide</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[42px] h-9 px-3 text-xs font-medium border transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'bg-[#292521] text-white border-[#292521]'
                            : 'bg-white text-[#292521] border-[#DED6CD] hover:border-[#292521]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Variants (if applicable) */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-5">
                  <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-2">
                    Finish / Variant
                  </label>
                  <select
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                    className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-xs text-[#292521] focus:outline-none focus:border-[#B89559]"
                  >
                    {product.variants.map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name} {v.stock <= 3 ? `(Only ${v.stock} left)` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity Stepper & Add to Bag Row */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border border-[#DED6CD] bg-white h-11">
                  <button
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 text-[#292521] hover:bg-[#F8F5F0] disabled:opacity-30 cursor-pointer text-base"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-medium font-mono-nums">{quantity}</span>
                  <button
                    disabled={quantity >= product.stockQuantity || isOutOfStock}
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 text-[#292521] hover:bg-[#F8F5F0] disabled:opacity-30 cursor-pointer text-base"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  disabled={isOutOfStock}
                  onClick={handleAdd}
                  className={`flex-1 h-11 text-xs uppercase tracking-[0.18em] font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    addedSuccess
                      ? 'bg-emerald-700 text-white'
                      : isOutOfStock
                      ? 'bg-[#B9A99A] text-white cursor-not-allowed'
                      : 'bg-[#292521] text-white hover:bg-[#B89559]'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Sold Out</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag — ₹{(product.salePrice ?? product.price) * quantity}</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className="h-11 w-11 shrink-0 border border-[#DED6CD] bg-white flex items-center justify-center hover:border-[#B89559] transition-colors cursor-pointer"
                  title="Save piece"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? 'fill-[#B89559] stroke-[#B89559]' : 'stroke-[#292521]'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Trust Assurances */}
            <div className="pt-4 border-t border-[#DED6CD] grid grid-cols-2 gap-3 text-[11px] text-[#716A63]">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#B89559]" />
                <span>Free shipping on orders over ₹250</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#B89559]" />
                <span>30-day effortless returns</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B89559]" />
                <span>Certificate of Artisan Authenticity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B89559]" />
                <span>Signature gift packaging included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
