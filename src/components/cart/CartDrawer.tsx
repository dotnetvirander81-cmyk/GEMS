import React, { useState } from 'react';
import { CartItem } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { X, Trash2, ShoppingBag, ArrowRight, Check, Tag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedVariant?: string) => void;
  onRemoveItem: (productId: string, selectedSize?: string, selectedVariant?: string) => void;
  onProceedToCheckout: () => void;
  freeShippingThreshold: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  freeShippingThreshold,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const discountAmount = subtotal * (discountPercent / 100);
  const finalTotal = subtotal - discountAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const clean = promoCode.trim().toUpperCase();
    if (clean === 'ARTISAN10' || clean === 'WELCOME10') {
      setDiscountPercent(10);
      setPromoSuccess('10% artisan discount applied!');
    } else if (clean === 'FREESHIP') {
      setDiscountPercent(5);
      setPromoSuccess('Promotional 5% discount applied!');
    } else {
      setPromoError('Invalid coupon. Try code "ARTISAN10" for 10% off.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-2xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F8F5F0] border-l border-[#DED6CD] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#DED6CD] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#B89559]" />
              <h3 className="font-serif-luxury text-xl text-[#292521] uppercase tracking-wider">
                Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#716A63] hover:text-[#292521] cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#F0EAE2] px-6 py-2.5 border-b border-[#DED6CD] text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-[#716A63]">
                Add <span className="font-semibold text-[#292521]">₹{remainingForFreeShipping.toFixed(0)}</span> more for Free Insured Shipping!
              </p>
            ) : (
              <p className="text-[#2e6930] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Congratulations! You unlocked Free Shipping.
              </p>
            )}
            <div className="w-full bg-[#DED6CD] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#B89559] h-full transition-all duration-300"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#DED6CD]/60">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <ShoppingBag className="w-12 h-12 text-[#B9A99A] mb-3 stroke-[1.2]" />
                <p className="font-serif-luxury text-xl text-[#292521]">Your bag is empty</p>
                <p className="text-xs text-[#716A63] mt-1 max-w-xs mb-6">
                  Discover our handmade collections created by independent jewelers.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#292521] text-white text-xs uppercase tracking-widest hover:bg-[#B89559] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={`${item.productId}-${item.selectedSize}-${item.selectedVariant}-${idx}`} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 shrink-0 bg-[#E5D9CC] border border-[#DED6CD] overflow-hidden">
                    <ImageWithFallback
                      src={item.product.mainImage}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif-luxury text-[15px] text-[#292521] leading-snug truncate pr-2">
                        {item.product.name}
                      </h4>
                      <span className="text-xs font-semibold text-[#292521] font-mono-nums">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#716A63] mt-0.5">
                      by {item.product.artisanName}
                    </p>

                    {(item.selectedSize || item.selectedVariant) && (
                      <div className="text-[11px] text-[#716A63] mt-1 flex gap-2">
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedVariant && <span>Variant: {item.selectedVariant}</span>}
                      </div>
                    )}

                    {/* Quantity controls & Remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#DED6CD] bg-white h-7">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.productId, item.quantity - 1, item.selectedSize, item.selectedVariant)
                          }
                          className="px-2 text-xs text-[#292521] hover:bg-[#F8F5F0]"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono-nums">{item.quantity}</span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.productId, item.quantity + 1, item.selectedSize, item.selectedVariant)
                          }
                          className="px-2 text-xs text-[#292521] hover:bg-[#F8F5F0]"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.productId, item.selectedSize, item.selectedVariant)}
                        className="text-[11px] text-[#716A63] hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="bg-white border-t border-[#DED6CD] px-6 py-5 space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Coupon code (try ARTISAN10)"
                    className="w-full bg-[#F8F5F0] border border-[#DED6CD] px-3 py-1.5 text-xs text-[#292521] uppercase placeholder:normal-case focus:outline-none focus:border-[#292521]"
                  />
                  <Tag className="w-3 h-3 text-[#716A63] absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#F0EAE2] hover:bg-[#E5D9CC] text-[#292521] text-xs font-medium uppercase tracking-wider transition-colors border border-[#DED6CD]"
                >
                  Apply
                </button>
              </form>

              {promoSuccess && <p className="text-[11px] text-emerald-700">{promoSuccess}</p>}
              {promoError && <p className="text-[11px] text-red-600">{promoError}</p>}

              {/* Subtotal, discount, total */}
              <div className="space-y-1.5 text-xs text-[#716A63] border-t border-[#DED6CD]/60 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono-nums font-medium text-[#292521]">₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Artisan Promo (-{discountPercent}%)</span>
                    <span className="font-mono-nums">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{remainingForFreeShipping === 0 ? 'FREE' : '₹50.00'}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#292521] pt-2 border-t border-[#DED6CD]">
                  <span>Total</span>
                  <span className="font-mono-nums">
                    ₹{(finalTotal + (remainingForFreeShipping === 0 ? 0 : 50)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3 bg-[#292521] hover:bg-[#B89559] text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
