import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { GalleryItem, Programme } from '../types';

interface GalleryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (item: Omit<GalleryItem, 'id'>) => void;
  programmes: Programme[];
}

const CATEGORIES = [
  'Impartation',
  'Prayer & Intercession',
  'Leadership Workshops',
  'Worship',
  'Fellowship',
  'Youth Ministry',
  'Special Gatherings',
];

export const GalleryUploadModal: React.FC<GalleryUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  programmes,
}) => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Impartation');
  const [programmeTitle, setProgrammeTitle] = useState(
    programmes.length > 0 ? programmes[0].title : 'Global Ministers Programme'
  );
  const [tagsInput, setTagsInput] = useState('Apostolic, Prayer, Ministers');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!imageUrl.trim()) {
      setError('Please provide an image URL or upload an image file');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onUpload({
      title: title.trim(),
      caption: caption.trim() || `${title} during the programme sessions.`,
      imageUrl: imageUrl.trim(),
      eventDate,
      category,
      programmeTitle,
      tags,
    });

    setTitle('');
    setCaption('');
    setImageUrl('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg font-serif">Upload Programme Picture</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm overflow-y-auto max-h-[80vh]">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-1.5 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 text-xs">
              Photo Preview & Upload Source <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="w-full sm:w-36 h-28 rounded-xl bg-slate-100 border border-slate-300 overflow-hidden flex items-center justify-center shrink-0">
                {imageUrl ? (
                  <img src={imageUrl} alt="Upload preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span className="text-[10px]">No image yet</span>
                  </div>
                )}
              </div>
              <div className="space-y-2 flex-1 w-full">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste direct Image URL (https://...)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
                <div>
                  <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer text-slate-700 inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Local File</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 text-xs">
              Photo Title / Headline <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Laying on of Hands during Morning Anointing Service"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">Category</label>
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
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">Event Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 text-xs">Associated Programme</label>
            <input
              type="text"
              value={programmeTitle}
              onChange={(e) => setProgrammeTitle(e.target.value)}
              placeholder="e.g. Global Ministers Conference 2026"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 text-xs">Caption & Description</label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe the moment and ministers present in the photograph..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 text-xs">Tags (Comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Apostolic, Worship, Ministers, Impartation"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Upload to Gallery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
