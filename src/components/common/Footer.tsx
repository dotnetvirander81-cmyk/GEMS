import React, { useState } from 'react';
import { Instagram, Facebook, Twitter, ShieldCheck } from 'lucide-react';
import { KridayLogo } from './KridayLogo';

interface FooterProps {
  onSelectCategory: (catId: string) => void;
  onOpenAdmin: () => void;
  onOpenAccount: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAdmin,
  onOpenAccount,
  onNavigateSection,
}) => {
  const currentYear = new Date().getFullYear();
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'shipping' | 'faq' | null>(null);

  return (
    <footer className="bg-[#F8F5F0] border-t border-[#DED6CD] pt-12 pb-8 text-[#292521]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12 border-b border-[#DED6CD]/60 text-xs">
          {/* Column 1: KRIDAY Brand & Socials */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <div className="mb-3">
              <KridayLogo variant="header" />
            </div>
            <p className="text-[12px] text-[#716A63] font-light leading-relaxed mb-4 max-w-sm">
              Bringing you closer to the finest gemstones, artisans, and heirlooms crafted with soul.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 text-[#292521]">
              <a
                href="#instagram"
                onClick={(e) => e.preventDefault()}
                className="w-7 h-7 rounded-full border border-[#DED6CD] flex items-center justify-center hover:border-[#B89559] hover:text-[#B89559] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="#facebook"
                onClick={(e) => e.preventDefault()}
                className="w-7 h-7 rounded-full border border-[#DED6CD] flex items-center justify-center hover:border-[#B89559] hover:text-[#B89559] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="#twitter"
                onClick={(e) => e.preventDefault()}
                className="w-7 h-7 rounded-full border border-[#DED6CD] flex items-center justify-center hover:border-[#B89559] hover:text-[#B89559] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: SHOP */}
          <div>
            <h4 className="font-medium tracking-[0.18em] uppercase text-[11px] mb-3 text-[#292521]">
              SHOP
            </h4>
            <ul className="space-y-2 text-[#716A63] font-light">
              <li>
                <button
                  onClick={() => onNavigateSection('shop-collection')}
                  className="hover:text-[#292521] transition-colors"
                >
                  All Jewelry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('cat-rings')}
                  className="hover:text-[#292521] transition-colors"
                >
                  Rings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('cat-necklaces')}
                  className="hover:text-[#292521] transition-colors"
                >
                  Necklaces
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('cat-earrings')}
                  className="hover:text-[#292521] transition-colors"
                >
                  Earrings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('cat-bracelets')}
                  className="hover:text-[#292521] transition-colors"
                >
                  Bracelets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('shop-collection')}
                  className="hover:text-[#292521] transition-colors"
                >
                  Gift Cards
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: ARTISANS */}
          <div>
            <h4 className="font-medium tracking-[0.18em] uppercase text-[11px] mb-3 text-[#292521]">
              ARTISANS
            </h4>
            <ul className="space-y-2 text-[#716A63] font-light">
              <li>
                <button
                  onClick={() => onNavigateSection('meet-makers')}
                  className="hover:text-[#292521] transition-colors"
                >
                  All Artisans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('meet-makers')}
                  className="hover:text-[#292521] transition-colors"
                >
                  Become a Maker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('journal-section')}
                  className="hover:text-[#292521] transition-colors"
                >
                  Artisan Stories
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-[#B89559] transition-colors flex items-center gap-1"
                >
                  <span>Maker Portal (Admin)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: ABOUT */}
          <div>
            <h4 className="font-medium tracking-[0.18em] uppercase text-[11px] mb-3 text-[#292521]">
              ABOUT
            </h4>
            <ul className="space-y-2 text-[#716A63] font-light">
              <li>
                <button
                  onClick={() => onNavigateSection('material-stories')}
                  className="hover:text-[#292521] transition-colors"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('material-stories')}
                  className="hover:text-[#292521] transition-colors"
                >
                  Materials
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('material-stories')}
                  className="hover:text-[#292521] transition-colors"
                >
                  Sustainability
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType('shipping')}
                  className="hover:text-[#292521] transition-colors"
                >
                  Shipping & Ethics
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: HELP + Handcrafted Emblem */}
          <div>
            <h4 className="font-medium tracking-[0.18em] uppercase text-[11px] mb-3 text-[#292521]">
              HELP
            </h4>
            <ul className="space-y-2 text-[#716A63] font-light mb-6">
              <li>
                <button onClick={() => setModalType('faq')} className="hover:text-[#292521] transition-colors">
                  FAQs
                </button>
              </li>
              <li>
                <button onClick={() => setModalType('shipping')} className="hover:text-[#292521] transition-colors">
                  Shipping & Returns
                </button>
              </li>
              <li>
                <button onClick={onOpenAccount} className="hover:text-[#292521] transition-colors">
                  Track Order
                </button>
              </li>
            </ul>

            {/* Emblem illustration */}
            <div className="pt-2 text-center border-t border-[#DED6CD]/60">
              <svg className="w-10 h-10 mx-auto stroke-[#B89559] mb-1.5" viewBox="0 0 40 40" fill="none" strokeWidth="1.2">
                <path d="M20 5v30M10 20l10-10 10 10M13 27l7-7 7 7" />
              </svg>
              <p className="font-serif-luxury text-[13px] text-[#292521] leading-tight">
                Handmade with purpose.<br />
                <span className="italic text-[#716A63]">Worn with meaning.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#716A63] font-light">
          <div>
            © {currentYear} Kriday. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setModalType('privacy')}
              className="hover:text-[#292521] transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setModalType('terms')}
              className="hover:text-[#292521] transition-colors"
            >
              Terms & Conditions
            </button>
            <button
              onClick={onOpenAdmin}
              className="hover:text-[#B89559] transition-colors font-medium flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-[#B89559]" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#F8F5F0] border border-[#DED6CD] max-w-lg w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#DED6CD]">
              <h3 className="font-serif-luxury text-2xl text-[#292521]">
                {modalType === 'privacy' && 'Privacy Policy'}
                {modalType === 'terms' && 'Terms & Conditions'}
                {modalType === 'shipping' && 'Shipping & Returns'}
                {modalType === 'faq' && 'Frequently Asked Questions'}
              </h3>
              <button onClick={() => setModalType(null)} className="text-[#716A63] hover:text-[#292521] text-lg">✕</button>
            </div>
            <div className="text-xs text-[#716A63] leading-relaxed space-y-3">
              {modalType === 'privacy' && (
                <>
                  <p>At Kriday, we treat your personal privacy with the same delicate care as our artisan gemstones.</p>
                  <p>1. Data Collection: We collect only necessary details to fulfill orders, process payments, and ensure smooth delivery.</p>
                  <p>2. Security: We do not store raw payment card data on our servers. All transactions use industry-standard encryption.</p>
                </>
              )}
              {modalType === 'terms' && (
                <>
                  <p>Welcome to Kriday Gems & Jeweler Marketplace. By using this platform, you agree to our terms of service.</p>
                  <p>Each piece is individually handmade by independent artisans. Slight natural variations in gemstones, hammer texturing, and gold tone are celebrated signatures of genuine handmade craft.</p>
                </>
              )}
              {modalType === 'shipping' && (
                <>
                  <p>We provide insured delivery worldwide on every single order.</p>
                  <p>· Orders over ₹250 qualify for complimentary insured standard shipping.</p>
                  <p>· Domestic orders typically arrive within 2-4 business days.</p>
                  <p>· 30-Day Effortless Returns: If a piece doesn't resonate, return it unworn within 30 days for a full refund or exchange.</p>
                </>
              )}
              {modalType === 'faq' && (
                <>
                  <p><strong>Q: How do I know my ring size?</strong><br />A: We offer standard US ring sizes 5 through 9. Refer to our size guide on any ring product page or contact us for a complimentary ring sizer.</p>
                  <p><strong>Q: Are all materials recycled?</strong><br />A: Yes, all solid gold and silver used by our artisans is 100% recycled and certified by RJC standards.</p>
                  <p><strong>Q: How can I become a featured artisan?</strong><br />A: Independent jewelers can apply directly through our maker portal in the admin dashboard.</p>
                </>
              )}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setModalType(null)}
                className="px-5 py-2 bg-[#292521] text-white text-[11px] uppercase tracking-widest hover:bg-[#B89559]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
