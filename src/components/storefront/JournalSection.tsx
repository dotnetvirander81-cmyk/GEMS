import React, { useState } from 'react';
import { JournalArticle } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { Clock, Calendar, ArrowRight, X } from 'lucide-react';

interface JournalSectionProps {
  articles: JournalArticle[];
}

export const JournalSection: React.FC<JournalSectionProps> = ({ articles }) => {
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);

  const published = articles.filter((a) => a.isPublished).slice(0, 4);

  return (
    <section id="journal-section" className="bg-[#F8F5F0] border-b border-[#DED6CD] py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#DED6CD]/60">
          <h2 className="text-[14px] sm:text-[15px] font-medium tracking-[0.2em] text-[#292521] uppercase">
            FROM THE JOURNAL
          </h2>
          <button
            onClick={() => setActiveArticle(published[0])}
            className="group flex items-center gap-1.5 text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-[#716A63] hover:text-[#292521] transition-colors cursor-pointer"
          >
            <span>Read all articles</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>

        {/* 4-Column Editorial Grid with Wide Rectangular Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {published.map((article) => (
            <article
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Rectangular Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#E5D9CC] mb-3.5 border border-[#DED6CD]/70">
                  <ImageWithFallback
                    src={article.coverImage}
                    alt={article.title}
                    title={article.title}
                    fallbackType="journal"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle dark gradient scrim at bottom to ensure tag and title stand out */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex flex-col justify-end p-3.5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#E5D9CC] font-semibold mb-1">
                      {article.category}
                    </span>
                    <h3 className="font-serif-luxury text-[17px] text-white font-normal leading-snug drop-shadow-xs line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                </div>

                {/* Excerpt */}
                <p className="text-[12px] text-[#716A63] font-light leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </div>

              {/* Bottom metadata */}
              <div className="flex items-center justify-between mt-3 pt-2 text-[11px] text-[#716A63] border-t border-[#DED6CD]/40">
                <span className="font-mono-nums">{article.date}</span>
                <span className="flex items-center gap-1 text-[#292521] font-medium group-hover:text-[#B89559] transition-colors">
                  Read story <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#F8F5F0] border border-[#DED6CD] max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-6 sm:p-10">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 text-[#716A63] hover:text-[#292521] p-1 cursor-pointer"
              aria-label="Close Article"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[11px] uppercase tracking-[0.2em] text-[#B89559] font-medium block mb-2">
              {activeArticle.category} · {activeArticle.readTime}
            </span>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#292521] font-normal leading-tight mb-4">
              {activeArticle.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-[#716A63] mb-6 pb-4 border-b border-[#DED6CD]">
              <span>Words by {activeArticle.author}</span>
              <span>·</span>
              <span className="flex items-center gap-1 font-mono-nums">
                <Calendar className="w-3 h-3 text-[#B89559]" />
                {activeArticle.date}
              </span>
            </div>

            <div className="aspect-[16/9] w-full overflow-hidden bg-[#E5D9CC] mb-6 border border-[#DED6CD]">
              <ImageWithFallback
                src={activeArticle.coverImage}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-stone max-w-none text-sm text-[#292521] font-light leading-relaxed whitespace-pre-line space-y-4">
              {activeArticle.content}
            </div>

            <div className="mt-8 pt-6 border-t border-[#DED6CD] flex justify-between items-center">
              <span className="text-xs text-[#716A63] italic">Kriday Gems &amp; Jeweler Journal</span>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 text-[11px] uppercase tracking-widest bg-[#292521] text-white hover:bg-[#B89559] transition-colors"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
