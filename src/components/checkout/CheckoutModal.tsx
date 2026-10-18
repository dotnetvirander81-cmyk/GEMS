import React, { useState } from 'react';
import { CartItem, Order } from '../../types';
import { createOrder } from '../../services/storageService';
import { CheckCircle2, ShieldCheck, Lock, ArrowLeft, Truck, CreditCard } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  freeShippingThreshold: number;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  freeShippingThreshold,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: 'Olivia Martinez',
    email: 'olivia.m@example.com',
    phone: '+1 (555) 234-5678',
    street: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    country: 'United States',
    shippingMethod: 'standard', // 'standard' | 'express'
    paymentMethod: 'credit_card' as 'credit_card' | 'cod' | 'paypal',
    // Mock card data
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '•••',
    notes: 'Please leave with reception if not home.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeStandard = subtotal >= freeShippingThreshold;
  const shippingFee =
    formData.shippingMethod === 'express' ? 25 : isFreeStandard ? 0 : 15;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + shippingFee + tax).toFixed(2));

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderPayload: Omit<Order, 'id' | 'orderNumber' | 'date'> = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.product.name,
          productSku: i.product.sku,
          price: i.price,
          quantity: i.quantity,
          size: i.selectedSize,
          variant: i.selectedVariant,
          image: i.product.mainImage,
        })),
        subtotal,
        discount: 0,
        shippingFee,
        tax,
        total,
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'paid',
        fulfillmentStatus: 'processing',
        carrier: formData.shippingMethod === 'express' ? 'FedEx Priority' : 'USPS Insured Priority',
        notes: formData.notes,
      };

      const newOrder = createOrder(orderPayload);
      setCreatedOrder(newOrder);
      setIsSubmitting(false);
      setStep('confirmation');
      onOrderSuccess(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-[#F8F5F0] border border-[#DED6CD] max-w-2xl w-full p-6 sm:p-10 relative shadow-2xl my-auto">
        {step !== 'confirmation' && (
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-[#DED6CD]">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B89559] font-medium block">
                SAFE & ENCRYPTED CHECKOUT
              </span>
              <h3 className="font-serif-luxury text-2xl text-[#292521]">
                {step === 'shipping' ? 'Shipping & Delivery' : 'Payment Details'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-[#716A63] hover:text-[#292521] text-lg p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* STEP 1: SHIPPING INFORMATION */}
        {step === 'shipping' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep('payment');
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-xs text-[#292521] focus:outline-none focus:border-[#292521]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                  Email Address (for tracking & receipt) *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-xs text-[#292521] focus:outline-none focus:border-[#292521]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-xs text-[#292521] focus:outline-none focus:border-[#292521]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-xs text-[#292521] focus:outline-none focus:border-[#292521]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-xs text-[#292521] focus:outline-none focus:border-[#292521]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                  State / Region *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-xs text-[#292521] focus:outline-none focus:border-[#292521]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-xs text-[#292521] focus:outline-none focus:border-[#292521]"
                />
              </div>
            </div>

            {/* Shipping Method Selection */}
            <div className="pt-2">
              <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-2">
                Shipping Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label
                  className={`p-3 border flex items-center justify-between cursor-pointer ${
                    formData.shippingMethod === 'standard'
                      ? 'border-[#292521] bg-white'
                      : 'border-[#DED6CD] bg-[#F0EAE2]/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={() => setFormData({ ...formData, shippingMethod: 'standard' })}
                      className="accent-[#292521]"
                    />
                    <div>
                      <p className="font-medium text-[#292521]">Insured Standard (3-5 days)</p>
                      <p className="text-[11px] text-[#716A63]">Direct from artisan ateliers</p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#292521]">
                    {isFreeStandard ? 'FREE' : '₹50.00'}
                  </span>
                </label>

                <label
                  className={`p-3 border flex items-center justify-between cursor-pointer ${
                    formData.shippingMethod === 'express'
                      ? 'border-[#292521] bg-white'
                      : 'border-[#DED6CD] bg-[#F0EAE2]/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      checked={formData.shippingMethod === 'express'}
                      onChange={() => setFormData({ ...formData, shippingMethod: 'express' })}
                      className="accent-[#292521]"
                    />
                    <div>
                      <p className="font-medium text-[#292521]">Express Courier (1-2 days)</p>
                      <p className="text-[11px] text-[#716A63]">Priority signature dispatch</p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#292521]">₹100.00</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#DED6CD] flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-[#716A63] hover:text-[#292521] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Bag
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#292521] hover:bg-[#B89559] text-white text-xs uppercase tracking-widest font-medium transition-colors"
              >
                Continue to Payment →
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: PAYMENT METHOD & REVIEW */}
        {step === 'payment' && (
          <form onSubmit={handlePlaceOrder} className="space-y-5">
            {/* Payment Method Selector */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'credit_card' })}
                  className={`flex-1 py-2.5 px-3 border text-xs flex items-center justify-center gap-2 font-medium transition-colors ${
                    formData.paymentMethod === 'credit_card'
                      ? 'border-[#292521] bg-white text-[#292521]'
                      : 'border-[#DED6CD] text-[#716A63]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#B89559]" />
                  <span>Credit Card (Test Mode)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                  className={`flex-1 py-2.5 px-3 border text-xs flex items-center justify-center gap-2 font-medium transition-colors ${
                    formData.paymentMethod === 'cod'
                      ? 'border-[#292521] bg-white text-[#292521]'
                      : 'border-[#DED6CD] text-[#716A63]'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#B89559]" />
                  <span>Pay on Delivery</span>
                </button>
              </div>

              {formData.paymentMethod === 'credit_card' && (
                <div className="p-4 bg-white border border-[#DED6CD] space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#716A63] border-b border-[#DED6CD]/60 pb-2">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#2e6930]" /> End-to-End Test Gateway Active
                    </span>
                    <span className="font-mono">Demo: 4242</span>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#716A63] block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      disabled
                      value="4242 •••• •••• 4242 (Pre-authorized sandbox card)"
                      className="w-full bg-[#F8F5F0] border border-[#DED6CD] px-3 py-2 text-xs font-mono text-[#292521]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#716A63] block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        disabled
                        value="12/28"
                        className="w-full bg-[#F8F5F0] border border-[#DED6CD] px-3 py-2 text-xs font-mono text-[#292521]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#716A63] block mb-1">
                        CVC Security Code
                      </label>
                      <input
                        type="text"
                        disabled
                        value="888"
                        className="w-full bg-[#F8F5F0] border border-[#DED6CD] px-3 py-2 text-xs font-mono text-[#292521]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Review Summary */}
            <div className="bg-[#F0EAE2] p-4 text-xs space-y-2 border border-[#DED6CD]">
              <h4 className="font-medium uppercase tracking-wider text-[#292521] text-[11px] pb-1 border-b border-[#DED6CD]">
                Order Summary ({items.length} items)
              </h4>
              <div className="flex justify-between text-[#716A63]">
                <span>Items Subtotal:</span>
                <span className="font-mono-nums">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#716A63]">
                <span>Shipping ({formData.shippingMethod}):</span>
                <span className="font-mono-nums">₹{shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#716A63]">
                <span>Estimated Tax (8%):</span>
                <span className="font-mono-nums">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#292521] pt-2 border-t border-[#DED6CD]">
                <span>Total Amount Due:</span>
                <span className="font-mono-nums">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DED6CD] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="text-xs text-[#716A63] hover:text-[#292521] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Shipping
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#292521] hover:bg-[#B89559] text-white text-xs uppercase tracking-widest font-medium transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'Verifying & Securing Order...' : `Pay ₹${total.toFixed(2)} & Complete`}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: ORDER CONFIRMATION */}
        {step === 'confirmation' && createdOrder && (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-[#e8f5e9] text-[#2e6930] rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-[11px] uppercase tracking-[0.2em] text-[#B89559] font-medium block">
              ORDER CONFIRMED & RECEIVED
            </span>

            <h3 className="font-serif-luxury text-3xl text-[#292521]">
              Thank You, {createdOrder.customerName}
            </h3>

            <p className="text-xs text-[#716A63] max-w-md mx-auto leading-relaxed">
              Your order <strong className="text-[#292521] font-mono">{createdOrder.orderNumber}</strong> has been transmitted to our independent jewelry ateliers. A confirmation receipt has been sent to {createdOrder.customerEmail}.
            </p>

            <div className="bg-white border border-[#DED6CD] p-5 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-[#DED6CD]/60 pb-2">
                <span className="text-[#716A63]">Order Reference:</span>
                <span className="font-mono font-bold text-[#292521]">{createdOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-[#DED6CD]/60 pb-2">
                <span className="text-[#716A63]">Carrier / Tracking:</span>
                <span className="font-mono text-[#B89559]">Pre-dispatched ({createdOrder.carrier})</span>
              </div>
              <div className="flex justify-between border-b border-[#DED6CD]/60 pb-2">
                <span className="text-[#716A63]">Destination:</span>
                <span className="text-[#292521]">
                  {createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.state}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-medium text-[#292521]">Total Paid:</span>
                <span className="font-mono font-bold text-[#292521]">₹{createdOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#292521] hover:bg-[#B89559] text-white text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                Return to Marketplace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
