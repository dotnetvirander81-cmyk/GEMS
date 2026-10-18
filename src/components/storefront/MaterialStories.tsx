import React, { useState } from 'react';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface MaterialStoriesProps {
  onSelectMaterialFilter?: (materialName: string) => void;
}

export const MaterialStories: React.FC<MaterialStoriesProps> = ({ onSelectMaterialFilter }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const materials = [
    {
      id: 'mat-gold',
      title: 'RECYCLED GOLD',
      tag: 'Gold',
      description: 'Naturally beautiful, consciously made.',
      image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=500&q=80',
      longStory: 'All of our gold is 100% recycled from verified post-consumer jewelry and electronic components, certified by the Responsible Jewellery Council. It carries identical purity to freshly mined metal without any environmental displacement.',
    },
    {
      id: 'mat-silver',
      title: 'STERLING SILVER',
      tag: 'Silver',
      description: 'Timeless metal, crafted to last.',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=500&q=80',
      longStory: 'Forged from 925 parts pure silver per thousand, our sterling silver develops a distinctive, warm patina over decades of personal touch. Hypoallergenic and nickel-free.',
    },
    {
      id: 'mat-gems',
      title: 'FAIR TRADE GEMS',
      tag: 'Gemstone',
      description: 'Ethical stones with a real impact.',
      image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=500&q=80',
      longStory: 'Our colored gemstones—emeralds, tourmalines, and moonstones—are sourced directly from artisanal family cooperatives that guarantee living wages, safe working conditions, and ecological restoration.',
    },
    {
      id: 'mat-pearls',
      title: 'PEARLS',
      tag: 'Pearl',
      description: "Nature's classic, always in style.",
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80',
      longStory: 'Every baroque and freshwater pearl is grown in undisturbed inland waters, selected by hand for its organic irregularity, natural iridescence, and deep orient luster.',
    },
  ];

  return (
    <section id="material-stories" className="bg-[#F0EAE2] border-b border-[#DED6CD] py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Introduction */}
          <div className="lg:col-span-4 pr-0 lg:pr-6">
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#716A63] font-medium block mb-2">
              MATERIAL STORIES
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#292521] leading-[1.18] font-normal mb-4">
              Honest Materials.<br />
              Thoughtful Choices.
            </h2>
            <p className="text-sm text-[#716A63] font-light leading-relaxed mb-6">
              We believe beautiful jewelry starts with responsible materials and transparent sourcing.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] font-medium text-[#292521] hover:text-[#B89559] transition-colors group cursor-pointer"
            >
              <span>LEARN MORE</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          {/* Right Column: 4 Material Cards Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
              {materials.map((mat) => (
                <div
                  key={mat.id}
                  onClick={() => onSelectMaterialFilter && onSelectMaterialFilter(mat.tag)}
                  className="group cursor-pointer text-center"
                >
                  {/* Square Image Card */}
                  <div className="aspect-square overflow-hidden bg-[#E5D9CC] mb-3 border border-[#DED6CD]/70 transition-transform duration-300 group-hover:scale-[1.02]">
                    <ImageWithFallback
                      src={mat.image}
                      alt={mat.title}
                      title={mat.title}
                      fallbackType="ring"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-[12px] font-medium tracking-[0.14em] text-[#292521] uppercase mb-1">
                    {mat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] text-[#716A63] font-light leading-snug line-clamp-2 px-1">
                    {mat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sourcing Transparency Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#F8F5F0] border border-[#DED6CD] max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6 border-b border-[#DED6CD] pb-4">
              <div>
                <span className="text-[11px] tracking-[0.2em] uppercase text-[#716A63]">OUR COMMITMENT</span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#292521] font-normal">
                  Ethical Materials & Provenance
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#716A63] hover:text-[#292521] text-xl font-light p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 text-sm text-[#716A63] font-light leading-relaxed">
              {materials.map((m) => (
                <div key={m.id} className="border-b border-[#DED6CD]/60 pb-4 last:border-b-0">
                  <h4 className="text-[13px] font-semibold text-[#292521] uppercase tracking-wider mb-1">
                    {m.title}
                  </h4>
                  <p>{m.longStory}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#DED6CD] text-right">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 text-[12px] uppercase tracking-widest bg-[#292521] text-white hover:bg-[#B89559] transition-colors"
              >
                Close Sourcing Charter
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
