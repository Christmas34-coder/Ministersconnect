import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Calendar,
  X,
  Download,
  Maximize2,
  Search,
  Tag,
  Edit3,
} from 'lucide-react';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  gallery: GalleryItem[];
  onEditItem?: (item: GalleryItem) => void;
  isAdmin?: boolean;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  gallery,
  onEditItem,
  isAdmin = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  const categories = ['All', ...Array.from(new Set(gallery.map((g) => g.category)))];

  const filteredGallery = gallery.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.programmeTitle && item.programmeTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60 text-xs font-bold uppercase tracking-wider mb-2">
          <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
          Fellowship Archives
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 tracking-tight">
          Ministers Connect Photo Archives
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          A sacred visual record of altar encounters, apostolic impartations, leadership masterclasses,
          consecration prayer sessions, and vibrant ministerial fellowship.
        </p>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto mt-5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search photos by title, caption, tags or programme..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm shadow-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      {filteredGallery.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Photos Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search keywords or select a different category filter.
          </p>
          {(selectedCategory !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxItem(item)}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all group cursor-pointer flex flex-col"
            >
              {/* Photo Container */}
              <div className="relative h-60 overflow-hidden bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                  <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-amber-400" /> Click to view full photo
                  </span>
                  {onEditItem && isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditItem(item);
                      }}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 text-amber-300 text-[10px] font-bold border border-amber-400/30 shadow-xs">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Photo Details */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {item.tags.slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-600"
                        >
                          #{t}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate max-w-[180px]">{item.programmeTitle || 'Ministers Connect'}</span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3 text-amber-600" />
                    {item.eventDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-3 sm:p-5 backdrop-blur-xs"
          onClick={() => setActiveLightboxItem(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="pr-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-700/50">
                  {activeLightboxItem.category}
                </span>
                <h3 className="font-bold text-base sm:text-lg text-white font-serif mt-1">
                  {activeLightboxItem.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeLightboxItem.programmeTitle} • {activeLightboxItem.eventDate}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {onEditItem && isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      const itm = activeLightboxItem;
                      setActiveLightboxItem(null);
                      onEditItem(itm);
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Photo / Words</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveLightboxItem(null)}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Image */}
            <div className="overflow-auto max-h-[60vh] bg-black flex items-center justify-center p-2">
              <img
                src={activeLightboxItem.imageUrl}
                alt={activeLightboxItem.title}
                className="max-w-full max-h-[58vh] object-contain rounded-lg shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Lightbox Footer */}
            <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
              <div className="max-w-xl space-y-2">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif">
                  {activeLightboxItem.caption}
                </p>
                {activeLightboxItem.tags && activeLightboxItem.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <Tag className="w-3 h-3 text-amber-400" />
                    {activeLightboxItem.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-amber-300 font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <a
                href={activeLightboxItem.imageUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open / Download Full Image</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
