import React, { useState } from 'react';
import { Artisan, Product } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { MapPin, Sparkles, X } from 'lucide-react';

interface MeetMakersProps {
  artisans: Artisan[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const MeetMakers: React.FC<MeetMakersProps> = ({
  artisans,
  products,
  onSelectProduct,
}) => {
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);

  const activeArtisans = artisans.filter((a) => a.isActive).slice(0, 5);

  const artisanProducts = selectedArtisan
    ? products.filter((p) => p.artisanId === selectedArtisan.id && p.status === 'active')
    : [];

  return (
    <section id="meet-makers" className="bg-[#F0EAE2] border-b border-[#DED6CD] py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Introduction */}
          <div className="lg:col-span-4 pr-0 lg:pr-6">
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#716A63] font-medium block mb-2">
              MEET THE MAKERS
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#292521] leading-[1.18] font-normal mb-4">
              Real People.<br />
              True Passion.
            </h2>
            <p className="text-sm text-[#716A63] font-light leading-relaxed mb-6">
              Get to know the hands and hearts behind the pieces you love.
            </p>
            <button
              onClick={() => setSelectedArtisan(activeArtisans[0])}
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] font-medium text-[#292521] hover:text-[#B89559] transition-colors group cursor-pointer"
            >
              <span>MEET OUR ARTISANS</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          {/* Right Column: 5 Circular Artisan Portraits */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 text-center">
              {activeArtisans.map((artisan) => (
                <div
                  key={artisan.id}
                  onClick={() => setSelectedArtisan(artisan)}
                  className="group cursor-pointer flex flex-col items-center"
                >
                  {/* Circular Portrait Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border-2 border-white/80 shadow-2xs group-hover:border-[#B89559] transition-all duration-300">
                    <ImageWithFallback
                      src={artisan.avatar}
                      alt={artisan.name}
                      title={artisan.name}
                      fallbackType="artisan"
                      className="w-full h-full object-cover grayscale-25 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-[13px] font-medium text-[#292521] group-hover:text-[#B89559] transition-colors">
                    {artisan.name}
                  </h3>

                  {/* Location */}
                  <p className="text-[11px] text-[#716A63] font-light mt-0.5">
                    {artisan.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Artisan Profile Modal */}
      {selectedArtisan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#F8F5F0] border border-[#DED6CD] max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedArtisan(null)}
              className="absolute top-4 right-4 text-[#716A63] hover:text-[#292521] p-1 cursor-pointer"
              aria-label="Close Artisan Profile"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 pb-6 border-b border-[#DED6CD]">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#B89559] shrink-0">
                <ImageWithFallback
                  src={selectedArtisan.avatar}
                  alt={selectedArtisan.name}
                  fallbackType="artisan"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center sm:text-left">
                <span className="text-[10px] uppercase tracking-widest text-[#B89559] font-medium block">
                  PARTNER ARTISAN · SINCE {selectedArtisan.joinedYear}
                </span>
                <h3 className="font-serif-luxury text-2xl text-[#292521] font-normal mt-0.5">
                  {selectedArtisan.name}
                </h3>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-[12px] text-[#716A63] mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#B89559]" />
                  <span>{selectedArtisan.location}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 mt-2 bg-[#F0EAE2] px-2.5 py-1 text-[11px] text-[#292521] rounded-xs">
                  <Sparkles className="w-3 h-3 text-[#B89559]" />
                  <span>{selectedArtisan.craftSpecialty}</span>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="mb-6">
              <h4 className="text-[11px] uppercase tracking-[0.16em] text-[#716A63] font-medium mb-2">
                ATELIER BIOGRAPHY
              </h4>
              <p className="text-sm text-[#292521] font-light leading-relaxed">
                {selectedArtisan.fullBio}
              </p>
            </div>

            {/* Artisan Handcrafted Pieces */}
            {artisanProducts.length > 0 && (
              <div>
                <h4 className="text-[11px] uppercase tracking-[0.16em] text-[#716A63] font-medium mb-3">
                  PIECES CRAFTED BY {selectedArtisan.name.toUpperCase()} ({artisanProducts.length})
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {artisanProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedArtisan(null);
                        onSelectProduct(p);
                      }}
                      className="group cursor-pointer flex items-center gap-3 p-2 bg-[#F0EAE2] border border-[#DED6CD]/60 hover:border-[#B89559] transition-colors"
                    >
                      <div className="w-12 h-12 shrink-0 bg-[#E5D9CC] overflow-hidden">
                        <ImageWithFallback
                          src={p.mainImage}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] text-[#292521] font-medium truncate">{p.name}</p>
                        <p className="text-[11px] text-[#716A63]">₹{p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
