import React, { useState } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  User,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { SiteContent } from '../../types';

import { KridayLogo } from './KridayLogo';

interface HeaderProps {
  content: SiteContent;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  content,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  onOpenAdmin,
  onSearchChange,
  searchQuery,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('INR ₹');
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigateSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F5F0] border-b border-[#DED6CD] transition-all">
      {/* 1. TOP ANNOUNCEMENT STRIP */}
      <div className="bg-[#F0EAE2] border-b border-[#DED6CD] text-[11px] text-[#292521] py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-3 text-[#716A63]">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 hover:text-[#292521] text-[11px] tracking-wider uppercase transition-colors"
              title="Open Admin Management Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#B89559]" />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Centered Announcement Message */}
          <div className="flex-1 text-center font-medium tracking-wide">
            <span>{content.announcementText}</span>
          </div>

          {/* Right Top Utilities */}
          <div className="hidden sm:flex items-center gap-4 text-[#716A63]">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 hover:text-[#292521] text-[11px] tracking-wider uppercase transition-colors"
              >
                <span>{selectedCurrency}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
              {currencyDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-[#DED6CD] shadow-sm py-1 rounded text-left z-50 min-w-[90px]">
                  {['INR ₹', 'USD $', 'EUR €', 'GBP £'].map((cur) => (
                    <button
                      key={cur}
                      onClick={() => {
                        setSelectedCurrency(cur);
                        setCurrencyDropdownOpen(false);
                      }}
                      className="block w-full text-left px-3 py-1 text-[11px] hover:bg-[#F8F5F0] text-[#292521]"
                    >
                      {cur}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-[#DED6CD]">|</span>

            {/* Sign in */}
            <button
              onClick={onOpenAccount}
              className="hover:text-[#292521] text-[11px] transition-colors"
            >
              Sign in
            </button>

            <span className="text-[#DED6CD]">|</span>

            {/* Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              className="hover:text-[#292521] transition-colors relative"
              title="Saved Pieces"
            >
              <Heart className="w-3.5 h-3.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B89559] text-white text-[9px] w-3 h-3 rounded-full flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={onOpenCart}
              className="hover:text-[#292521] transition-colors relative"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#292521] text-white text-[9px] w-3 h-3 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER AND NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Navigation: Hamburger + Main Links */}
          <div className="flex-1 flex items-center justify-start gap-4 sm:gap-6 lg:gap-8">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#292521] hover:text-[#B89559] transition-colors p-1.5 -ml-1.5 cursor-pointer rounded-xs"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[12px] xl:text-[13px] tracking-[0.14em] uppercase font-medium text-[#292521]">
              <button
                onClick={() => handleNavClick('shop-collection')}
                className="hover:text-[#B89559] transition-colors cursor-pointer"
              >
                Shop
              </button>
              <button
                onClick={() => handleNavClick('meet-makers')}
                className="hover:text-[#B89559] transition-colors cursor-pointer"
              >
                Artisans
              </button>
              <button
                onClick={() => handleNavClick('featured-pieces')}
                className="hover:text-[#B89559] transition-colors cursor-pointer"
              >
                Collections
              </button>
            </nav>
          </div>

          {/* Center: Brand Logo & Subtitle (Mathematically & Optically Centered) */}
          <div
            className="shrink-0 flex items-center justify-center cursor-pointer select-none px-2 py-0.5"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title="Kriday — Gems & Jeweler Marketplace"
          >
            <KridayLogo variant="header" size="md" />
          </div>

          {/* Right Navigation: Stories, About & Search */}
          <div className="flex-1 flex items-center justify-end gap-3 sm:gap-5 lg:gap-6">
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[12px] xl:text-[13px] tracking-[0.14em] uppercase font-medium text-[#292521]">
              <button
                onClick={() => handleNavClick('journal-section')}
                className="hover:text-[#B89559] transition-colors cursor-pointer"
              >
                Stories
              </button>
              <button
                onClick={() => handleNavClick('material-stories')}
                className="hover:text-[#B89559] transition-colors cursor-pointer"
              >
                About
              </button>
            </nav>

            {/* Desktop Search Input */}
            <div className="relative hidden md:block w-36 lg:w-44 xl:w-56">
              <input
                type="text"
                placeholder="Search gems & jewelry..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#F0EAE2] border border-[#DED6CD] rounded-sm py-1.5 pl-3 pr-8 text-[12px] text-[#292521] placeholder-[#716A63] focus:outline-none focus:border-[#B89559] transition-colors"
              />
              <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#716A63] pointer-events-none" />
            </div>

            {/* Mobile icon buttons (Wishlist & Cart) */}
            <div className="flex items-center gap-2.5 lg:hidden">
              <button
                onClick={onOpenWishlist}
                className="text-[#292521] relative p-1.5 hover:text-[#B89559] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#B89559] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-medium shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={onOpenCart}
                className="text-[#292521] relative p-1.5 hover:text-[#B89559] transition-colors"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#292521] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-medium shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by name, stone, artisan or Product ID..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#F0EAE2] border border-[#DED6CD] rounded-sm py-1.5 pl-3 pr-8 text-[12px] text-[#292521] placeholder-[#716A63] focus:outline-none focus:border-[#B89559]"
            />
            <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#716A63] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* MOBILE & EXPANDED DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="bg-[#F8F5F0] border-b border-[#DED6CD] px-6 py-6 transition-all animate-fadeIn">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-[13px]">
            <div>
              <h3 className="font-serif-luxury text-base font-semibold uppercase tracking-wider mb-3 text-[#292521]">
                Shop Collections
              </h3>
              <ul className="space-y-2 text-[#716A63]">
                <li>
                  <button
                    onClick={() => handleNavClick('category-strip')}
                    className="hover:text-[#B89559]"
                  >
                    All Jewelry Categories
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('featured-pieces')}
                    className="hover:text-[#B89559]"
                  >
                    Featured Pieces
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('shop-collection')}
                    className="hover:text-[#B89559]"
                  >
                    Best Sellers & New Arrivals
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif-luxury text-base font-semibold uppercase tracking-wider mb-3 text-[#292521]">
                Makers & Craft
              </h3>
              <ul className="space-y-2 text-[#716A63]">
                <li>
                  <button
                    onClick={() => handleNavClick('meet-makers')}
                    className="hover:text-[#B89559]"
                  >
                    Meet Our Artisans
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('material-stories')}
                    className="hover:text-[#B89559]"
                  >
                    Ethical Materials & Sourcing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('journal-section')}
                    className="hover:text-[#B89559]"
                  >
                    The Journal & Care Guides
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif-luxury text-base font-semibold uppercase tracking-wider mb-3 text-[#292521]">
                Account & Admin
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAccount();
                  }}
                  className="flex items-center gap-2 text-[#292521] hover:text-[#B89559]"
                >
                  <User className="w-4 h-4 text-[#B89559]" />
                  <span>My Account & Orders</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="flex items-center gap-2 text-[#292521] hover:text-[#B89559] font-medium"
                >
                  <ShieldCheck className="w-4 h-4 text-[#B89559]" />
                  <span>Admin Management Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
