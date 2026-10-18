import React, { useState } from 'react';
import { Order, Product } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { User, Package, Heart, X, MapPin, ExternalLink, ShoppingBag } from 'lucide-react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  wishlistProducts: Product[];
  onAddToCart: (product: Product) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  orders,
  wishlistProducts,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-[#F8F5F0] border border-[#DED6CD] max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#716A63] hover:text-[#292521] p-1 cursor-pointer"
          aria-label="Close Account"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Lockup */}
        <div className="flex items-center gap-4 pb-6 border-b border-[#DED6CD]">
          <div className="w-12 h-12 rounded-full bg-[#E5D9CC] border border-[#DED6CD] flex items-center justify-center text-[#292521]">
            <User className="w-6 h-6 stroke-[1.4]" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#B89559] font-medium">
              ARTISAN PATRON ACCOUNT
            </span>
            <h3 className="font-serif-luxury text-2xl text-[#292521]">Olivia Martinez</h3>
            <p className="text-xs text-[#716A63]">olivia.m@example.com · Collector since 2025</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#DED6CD] text-xs font-medium uppercase tracking-wider mt-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#292521] text-[#292521]'
                : 'border-transparent text-[#716A63] hover:text-[#292521]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'wishlist'
                ? 'border-[#292521] text-[#292521]'
                : 'border-transparent text-[#716A63] hover:text-[#292521]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Pieces ({wishlistProducts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#292521] text-[#292521]'
                : 'border-transparent text-[#716A63] hover:text-[#292521]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Addresses & Profile</span>
          </button>
        </div>

        {/* TAB 1: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="pt-6 space-y-4">
            {orders.length === 0 ? (
              <p className="text-center py-10 text-xs text-[#716A63]">No previous orders placed yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white border border-[#DED6CD] p-4 text-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#DED6CD]/60">
                    <div>
                      <span className="font-mono font-bold text-[#292521] text-sm">{order.orderNumber}</span>
                      <span className="text-[#716A63] ml-3">{new Date(order.date).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                          order.fulfillmentStatus === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.fulfillmentStatus === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.fulfillmentStatus}
                      </span>
                      <span className="font-mono font-semibold text-[#292521]">₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 bg-[#E5D9CC] overflow-hidden">
                          <ImageWithFallback src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#292521] truncate">{item.productName}</p>
                          <p className="text-[11px] text-[#716A63]">
                            Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ''}
                          </p>
                        </div>
                        <span className="font-mono text-[#292521]">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {order.trackingNumber && (
                    <div className="pt-2 border-t border-[#DED6CD]/40 flex items-center justify-between text-[11px] text-[#716A63]">
                      <span>Carrier: {order.carrier || 'Insured Delivery'}</span>
                      <span className="font-mono text-[#B89559] flex items-center gap-1 font-medium">
                        Tracking: {order.trackingNumber} <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: SAVED WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="pt-6">
            {wishlistProducts.length === 0 ? (
              <p className="text-center py-10 text-xs text-[#716A63]">
                Your wishlist is empty. Tap the heart icon on any jewelry piece to save it here.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlistProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-white border border-[#DED6CD]">
                    <div className="w-16 h-16 shrink-0 bg-[#E5D9CC] overflow-hidden">
                      <ImageWithFallback src={p.mainImage} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif-luxury text-[14px] text-[#292521] truncate">{p.name}</h4>
                      <p className="text-[11px] text-[#716A63]">by {p.artisanName}</p>
                      <p className="font-mono text-xs font-semibold text-[#292521] mt-0.5">₹{p.price}</p>
                    </div>
                    <button
                      onClick={() => onAddToCart(p)}
                      className="px-2.5 py-1.5 bg-[#292521] text-white hover:bg-[#B89559] text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1"
                      title="Add to Bag"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE & ADDRESS */}
        {activeTab === 'profile' && (
          <div className="pt-6 space-y-4 text-xs">
            <div className="bg-white border border-[#DED6CD] p-5 space-y-3">
              <h4 className="font-medium uppercase tracking-wider text-[#292521] text-[11px] pb-2 border-b border-[#DED6CD]">
                Default Shipping Address
              </h4>
              <p className="font-medium text-[#292521]">Olivia Martinez</p>
              <p className="text-[#716A63]">742 Evergreen Terrace</p>
              <p className="text-[#716A63]">San Francisco, CA 94102</p>
              <p className="text-[#716A63]">United States</p>
              <p className="text-[#716A63]">Phone: +1 (555) 234-5678</p>
            </div>

            <div className="bg-white border border-[#DED6CD] p-5 space-y-2">
              <h4 className="font-medium uppercase tracking-wider text-[#292521] text-[11px] pb-2 border-b border-[#DED6CD]">
                Preferences
              </h4>
              <label className="flex items-center gap-2 text-[#716A63] cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#292521]" />
                <span>Receive artisan studio journals & private vault invitations</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
