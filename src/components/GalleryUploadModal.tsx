import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  Sparkles,
  Edit3,
  Check,
  RefreshCw,
  Tag,
  Calendar,
  Layers,
} from 'lucide-react';
import { GalleryItem, Programme } from '../types';
import { CURATED_PRESET_IMAGES } from '../data/seedData';

interface GalleryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (item: Omit<GalleryItem, 'id'>) => void;
  onUpdate?: (id: string, updates: Partial<Omit<GalleryItem, 'id'>>) => void;
  itemToEdit?: GalleryItem | null;
  programmes: Programme[];
}

const CATEGORIES = [
  'Programme Posters',
  'Keynote Banners',
  'Impartation',
  'Prayer & Intercession',
  'Leadership Workshops',
  'Worship & Praise',
  'Fellowship & Communion',
  'Youth Ministry',
  'Special Gatherings',
  'Altar Ministrations',
];

export const GalleryUploadModal: React.FC<GalleryUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  onUpdate,
  itemToEdit,
  programmes,
}) => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Impartation');
  const [customCategory, setCustomCategory] = useState('');
  const [programmeTitle, setProgrammeTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState('');

  // Sync state whenever modal opens or itemToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setTitle(itemToEdit.title || '');
        setCaption(itemToEdit.caption || '');
        setImageUrl(itemToEdit.imageUrl || '');
        setEventDate(itemToEdit.eventDate || new Date().toISOString().split('T')[0]);
        if (CATEGORIES.includes(itemToEdit.category)) {
          setCategory(itemToEdit.category);
          setCustomCategory('');
        } else {
          setCategory('Custom');
          setCustomCategory(itemToEdit.category || '');
        }
        setProgrammeTitle(
          itemToEdit.programmeTitle ||
            (programmes.length > 0 ? programmes[0].title : 'Ministers Connect Monthly Program')
        );
        setTagsInput(itemToEdit.tags ? itemToEdit.tags.join(', ') : '');
      } else {
        setTitle('');
        setCaption('');
        setImageUrl('');
        setEventDate(new Date().toISOString().split('T')[0]);
        setCategory('Impartation');
        setCustomCategory('');
        setProgrammeTitle(
          programmes.length > 0 ? programmes[0].title : 'Ministers Connect Monthly Program'
        );
        setTagsInput('Ministers Connect, Apostolic, Prayer, Impartation');
      }
      setError('');
    }
  }, [isOpen, itemToEdit, programmes]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size should be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          setError('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (presetUrl: string) => {
    setImageUrl(presetUrl);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Photo headline/title is required');
      return;
    }
    if (!imageUrl.trim()) {
      setError('Please provide an image URL or upload an image file');
      return;
    }

    const finalCategory = category === 'Custom' ? customCategory.trim() || 'General' : category;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const itemPayload = {
      title: title.trim(),
      caption: caption.trim() || `${title} during the programme sessions.`,
      imageUrl: imageUrl.trim(),
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      category: finalCategory,
      programmeTitle: programmeTitle.trim() || 'Ministers Connect Monthly Program',
      tags: tags.length > 0 ? tags : ['Ministers Connect'],
    };

    if (itemToEdit && onUpdate) {
      onUpdate(itemToEdit.id, itemPayload);
    } else {
      onUpload(itemPayload);
    }

    onClose();
  };

  const isEditMode = !!itemToEdit;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-3 sm:p-5 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              {isEditMode ? <Edit3 className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg font-serif">
                {isEditMode ? 'Edit Gallery Photo & Words' : 'Upload to Photo Archive'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditMode
                  ? 'Update both the picture/banner and its textual descriptions, theme, and tags'
                  : 'Add a new high-resolution photograph or event flyer to the ministry archive'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-sm overflow-y-auto max-h-[78vh]">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Picture Editor & Upload Section */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-800 text-xs uppercase tracking-wider">
                1. Picture / Photo Source <span className="text-red-500">*</span>
              </label>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-[11px] text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                >
                  Clear Photo
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Photo Preview Box */}
              <div className="w-full sm:w-44 h-36 rounded-xl bg-slate-900 border border-slate-300 overflow-hidden flex items-center justify-center shrink-0 relative group shadow-xs">
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                      <span className="text-white text-[10px] font-semibold text-center">
                        Active Photo Preview
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-3 text-slate-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50 text-slate-300" />
                    <span className="text-[11px]">No image selected</span>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="space-y-3 flex-1 w-full">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Direct Image URL:
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or paste image link"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer text-slate-800 inline-flex items-center gap-1.5 shadow-2xs transition">
                    <Upload className="w-3.5 h-3.5 text-amber-600" />
                    <span>Upload Local File</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                {/* Quick Presets Picker */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Or select Official Preset Graphics:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {CURATED_PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center gap-1 transition cursor-pointer ${
                          imageUrl === preset.url
                            ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{preset.name}</span>
                        {imageUrl === preset.url && <Check className="w-3 h-3 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Words & Descriptions Section */}
          <div className="space-y-4">
            <label className="block font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
              2. Words, Descriptions & Metadata
            </label>

            {/* Title / Headline */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">
                Photo Title / Headline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Laying on of Hands during Consecration Service"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            {/* Category & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Custom">+ Custom Category</option>
                </select>
                {category === 'Custom' && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category name"
                    className="w-full mt-2 px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">
                  Event Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* Associated Programme */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">
                Associated Ministry Programme / Gathering
              </label>
              <div className="space-y-1.5">
                {programmes.length > 0 && (
                  <select
                    value={programmeTitle}
                    onChange={(e) => setProgrammeTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    {programmes.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title} ({p.startDate})
                      </option>
                    ))}
                    <option value="Ministers Connect Monthly Program">
                      Ministers Connect Monthly Program
                    </option>
                  </select>
                )}
                <input
                  type="text"
                  value={programmeTitle}
                  onChange={(e) => setProgrammeTitle(e.target.value)}
                  placeholder="Or type custom programme name..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700"
                />
              </div>
            </div>

            {/* Caption Words / Full Story */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700 text-xs">
                  Caption & Narrative Words
                </label>
                <span className="text-[10px] text-slate-400">
                  {caption.length} characters
                </span>
              </div>
              <textarea
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Describe the moment, ministers present, spiritual significance, and altar insights..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs leading-relaxed"
              />
            </div>

            {/* Tags Input */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-600" />
                <span>Tags & Keywords (Comma separated)</span>
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Consecration, Fasting, Anointing, Pastors, Abuja"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Tags help delegates filter and find specific photos in the archives search.
              </p>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition flex items-center gap-1.5"
            >
              {isEditMode ? <Check className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
              <span>{isEditMode ? 'Save Photo & Words Changes' : 'Upload to Gallery'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
