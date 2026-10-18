import React, { useState, useEffect } from 'react';
import {
  Product,
  Category,
  Artisan,
  Order,
  Review,
  JournalArticle,
  SiteContent,
  Customer,
  CartItem,
} from './types';
import {
  getProducts,
  getCategories,
  getArtisans,
  getOrders,
  getReviews,
  getJournalArticles,
  getSiteContent,
  getCart,
  getWishlist,
  getCustomers,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  toggleWishlist,
  subscribeToStorage,
} from './services/storageService';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HeroBanner } from './components/storefront/HeroBanner';
import { CategoryStrip } from './components/storefront/CategoryStrip';
import { MaterialStories } from './components/storefront/MaterialStories';
import { FeaturedPieces } from './components/storefront/FeaturedPieces';
import { MeetMakers } from './components/storefront/MeetMakers';
import { ShopCollection } from './components/storefront/ShopCollection';
import { JournalSection } from './components/storefront/JournalSection';
import { CustomerReviews } from './components/storefront/CustomerReviews';
import { NewsletterSection } from './components/storefront/NewsletterSection';
import { ServiceBenefits } from './components/storefront/ServiceBenefits';

import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { CustomerModal } from './components/customer/CustomerModal';
import { AdminPortal } from './components/admin/AdminPortal';

export default function App() {
  // Database States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [journalArticles, setJournalArticles] = useState<JournalArticle[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(getSiteContent());
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);

  // Load and subscribe to database changes
  const reloadData = () => {
    setProducts(getProducts(true));
    setCategories(getCategories());
    setArtisans(getArtisans());
    setOrders(getOrders());
    setReviews(getReviews());
    setJournalArticles(getJournalArticles());
    setSiteContent(getSiteContent());
    setCustomers(getCustomers());
    setCart(getCart());
    setWishlist(getWishlist());
  };

  useEffect(() => {
    reloadData();
    const unsubscribe = subscribeToStorage(() => {
      reloadData();
    });
    return () => unsubscribe();
  }, []);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    quantity = 1,
    selectedSize?: string,
    selectedVariant?: string
  ) => {
    const updated = addToCart(product, quantity, selectedSize, selectedVariant);
    setCart(updated);
  };

  const handleUpdateCartQuantity = (
    productId: string,
    quantity: number,
    selectedSize?: string,
    selectedVariant?: string
  ) => {
    const updated = updateCartItemQuantity(productId, quantity, selectedSize, selectedVariant);
    setCart(updated);
  };

  const handleRemoveFromCart = (
    productId: string,
    selectedSize?: string,
    selectedVariant?: string
  ) => {
    const updated = removeFromCart(productId, selectedSize, selectedVariant);
    setCart(updated);
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: string) => {
    toggleWishlist(productId);
    setWishlist(getWishlist());
  };

  // Navigation smoothly scroll to sections
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0] text-[#292521] selection:bg-[#B89559]/20 selection:text-[#292521]">
      {/* 1 & 2: Header with announcement bar & top navigation */}
      <Header
        content={siteContent}
        cartCount={cartTotalCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setCustomerModalOpen(true)}
        onOpenAccount={() => setCustomerModalOpen(true)}
        onOpenAdmin={() => setAdminPortalOpen(true)}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim()) {
            handleNavigateSection('shop-collection');
          }
        }}
        searchQuery={searchQuery}
        onNavigateSection={handleNavigateSection}
      />

      <main className="flex-1">
        {/* 3: Hero Banner */}
        <HeroBanner
          content={siteContent}
          onExploreClick={() => handleNavigateSection('shop-collection')}
        />

        {/* 4: Jewellery Category Strip */}
        <CategoryStrip
          categories={categories}
          selectedCategoryId={selectedCategoryFilter}
          onSelectCategory={(catId) => {
            setSelectedCategoryFilter(catId);
            handleNavigateSection('shop-collection');
          }}
        />

        {/* 5: Material Stories */}
        <MaterialStories
          onSelectMaterialFilter={(mat) => {
            setSearchQuery(mat);
            handleNavigateSection('shop-collection');
          }}
        />

        {/* 6: Featured Pieces (5-Column Desktop Grid) */}
        <FeaturedPieces
          products={products}
          wishlistIds={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAddToCart={(p) => handleAddToCart(p, 1)}
          onViewAllClick={() => handleNavigateSection('shop-collection')}
        />

        {/* 7: Meet The Makers */}
        <MeetMakers
          artisans={artisans}
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        {/* 8: Shop Our Collection (Filter Tabs + 6-Column Grid) */}
        <ShopCollection
          products={products}
          wishlistIds={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAddToCart={(p) => handleAddToCart(p, 1)}
          activeCategoryFilter={selectedCategoryFilter}
          onCategoryFilterChange={(catId) => setSelectedCategoryFilter(catId)}
          searchQuery={searchQuery}
        />

        {/* 9: From The Journal */}
        <JournalSection articles={journalArticles} />

        {/* 10: Customer Reviews */}
        <CustomerReviews reviews={reviews} />

        {/* 11: Newsletter Subscription Strip */}
        <NewsletterSection />

        {/* 12: Service Benefits Strip */}
        <ServiceBenefits />
      </main>

      {/* 13: Footer */}
      <Footer
        onSelectCategory={(catId) => {
          setSelectedCategoryFilter(catId);
          handleNavigateSection('shop-collection');
        }}
        onOpenAdmin={() => setAdminPortalOpen(true)}
        onOpenAccount={() => setCustomerModalOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* MODALS & DRAWERS */}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        freeShippingThreshold={siteContent.freeShippingThreshold}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart}
        freeShippingThreshold={siteContent.freeShippingThreshold}
        onOrderSuccess={(order) => {
          reloadData();
        }}
      />

      {/* Customer Account & Orders Modal */}
      <CustomerModal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        orders={orders}
        wishlistProducts={wishlistProducts}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* Admin Portal Dashboard */}
      <AdminPortal
        isOpen={adminPortalOpen}
        onClose={() => setAdminPortalOpen(false)}
        products={products}
        categories={categories}
        artisans={artisans}
        orders={orders}
        customers={customers}
        siteContent={siteContent}
        onViewProductOnStorefront={(p) => {
          setAdminPortalOpen(false);
          setSelectedProduct(p);
        }}
      />
    </div>
  );
}
