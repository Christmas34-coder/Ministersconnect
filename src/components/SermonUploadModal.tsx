import React, { useState } from 'react';
import {
  X,
  Upload,
  FileAudio,
  Film,
  FileText,
  Sparkles,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Tag,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MediaType, MinisterialTitle, SermonMedia, MemberUser } from '../types';
import { addSermon } from '../utils/storage';

interface SermonUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newSermon: SermonMedia) => void;
  currentMember?: MemberUser | null;
}

const MINISTERIAL_TITLES: MinisterialTitle[] = [
  'Pastor',
  'Reverend',
  'Bishop',
  'Apostle',
  'Evangelist',
  'Prophet',
  'Prophetess',
  'Teacher',
  'Minister',
  'Dr.',
  'Other',
];

const SERMON_CATEGORIES = [
  'Apostolic Leadership',
  'Spiritual Growth & Discipleship',
  'Church Governance & Administration',
  'Prayer & Spiritual Warfare',
  'Pastoral Care & Wellness',
  'Youth & NextGen Ministry',
  'Praise & Worship Theology',
  'Evangelism & Missions',
  'Syllabus & Study Outlines',
];

const PRESET_COVERS = [
  {
    name: 'Worship Stage',
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sacred Bible',
    url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Podium Keynote',
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Prayer Altar',
    url: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Youth Revival',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
  },
];

export const SermonUploadModal: React.FC<SermonUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentMember,
}) => {
  const [mediaType, setMediaType] = useState<MediaType>('audio');
  const [title, setTitle] = useState('');
  const [speakerTitle, setSpeakerTitle] = useState<MinisterialTitle>(currentMember?.title || 'Pastor');
  const [speaker, setSpeaker] = useState(currentMember?.fullName || '');
  const [speakerRole, setSpeakerRole] = useState(currentMember?.ministerialPosition || 'Guest Minister');
  const [churchName, setChurchName] = useState(currentMember?.churchName || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Apostolic Leadership');
  const [scriptureRef, setScriptureRef] = useState('');
  const [duration, setDuration] = useState('45:00');
  const [mediaUrl, setMediaUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState(PRESET_COVERS[0].url);
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('Spiritual Exploits, Leadership');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'media' | 'document' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert('File size is over 4MB. For large media, please provide a direct URL link or embed URL.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (type === 'media') {
        setMediaUrl(base64);
      } else if (type === 'document') {
        setFileUrl(base64);
        setFileName(file.name);
      } else if (type === 'cover') {
        setCoverImageUrl(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Sermon title is required';
    if (!speaker.trim()) newErrors.speaker = 'Preacher / Speaker name is required';
    if (!mediaUrl.trim()) {
      newErrors.mediaUrl =
        mediaType === 'video'
          ? 'Please provide a YouTube/Vimeo embed or video stream URL'
          : 'Please upload an audio/file or enter a valid URL';
    }
    if (!description.trim()) newErrors.description = 'Please write a brief summary or study note';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setTimeout(() => {
      const newSermon = addSermon({
        title: title.trim(),
        speaker: speaker.trim(),
        speakerTitle,
        speakerRole: speakerRole.trim() || undefined,
        churchName: churchName.trim() || undefined,
        date,
        mediaType,
        mediaUrl: mediaUrl.trim(),
        fileUrl: fileUrl.trim() || undefined,
        fileName: fileName.trim() || (fileUrl ? 'Study_Notes_Outline.pdf' : undefined),
        fileSizeBytes: fileUrl ? '1.5 MB' : undefined,
        duration: duration.trim() || undefined,
        coverImageUrl: coverImageUrl || undefined,
        category,
        scriptureRef: scriptureRef.trim() || undefined,
        description: description.trim(),
        tags: tags.length > 0 ? tags : undefined,
        isFeatured: false,
        uploadedBy: currentMember ? `${currentMember.title} ${currentMember.fullName}` : 'Presbytery Media Team',
      });

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
      });

      setSubmitting(false);
      onSuccess(newSermon);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-7 relative border-b border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Word & Media Repository</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">Upload Sermon & Message Media</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Archive audio messages, video recordings, and study notes/PDF files for ministers and church delegates.
          </p>

          {/* Media Format Selector */}
          <div className="grid grid-cols-3 bg-slate-800/90 p-1 rounded-xl mt-4 border border-slate-700 gap-1">
            <button
              type="button"
              onClick={() => {
                setMediaType('audio');
                setMediaUrl('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mediaType === 'audio' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileAudio className="w-4 h-4" />
              <span>Audio Message</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMediaType('video');
                setMediaUrl('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mediaType === 'video' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Video Sermon</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMediaType('file');
                setMediaUrl('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mediaType === 'file' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Study Notes / File</span>
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>1. Sermon Message Details</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sermon / Message Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Architecture of Apostolic Authority"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:ring-2 focus:ring-amber-500 ${
                  errors.title ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                }`}
              />
              {errors.title && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.title}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Speaker Salutation</label>
                <select
                  value={speakerTitle}
                  onChange={(e) => setSpeakerTitle(e.target.value as MinisterialTitle)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:ring-2 focus:ring-amber-500"
                >
                  {MINISTERIAL_TITLES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-8">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preacher / Speaker Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  placeholder="e.g. Emmanuel Adeyemi"
                  className={`w-full px-3 py-2 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 ${
                    errors.speaker ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.speaker && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.speaker}
                  </p>
                )}
              </div>

              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Church / Ministry</label>
                <input
                  type="text"
                  value={churchName}
                  onChange={(e) => setChurchName(e.target.value)}
                  placeholder="e.g. Covenant Light Ministries Global"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Theological Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:ring-2 focus:ring-amber-500"
                >
                  {SERMON_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Scripture Reference</label>
                <input
                  type="text"
                  value={scriptureRef}
                  onChange={(e) => setScriptureRef(e.target.value)}
                  placeholder="e.g. Daniel 11:32b, Acts 4:29-33"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date Preached</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration / Length</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 52:14"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Upload className="w-4 h-4 text-amber-600" />
              <span>2. {mediaType.toUpperCase()} Media Source & File</span>
            </h3>

            {mediaType === 'audio' && (
              <div className="space-y-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Audio File URL / Streaming Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://example.com/audio/sermon.mp3 or sample link"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-slate-500">Or use sample sermon audio:</span>
                    <button
                      type="button"
                      onClick={() => setMediaUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')}
                      className="text-[11px] font-bold text-amber-800 hover:underline cursor-pointer"
                    >
                      Use High-Quality Sample Audio 1
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Or Upload MP3 Audio File (Under 4MB)
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileUpload(e, 'media')}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {mediaType === 'video' && (
              <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-200/60">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    YouTube Embed URL or Video Stream Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-slate-500">Quick Test:</span>
                    <button
                      type="button"
                      onClick={() => setMediaUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')}
                      className="text-[11px] font-bold text-blue-800 hover:underline cursor-pointer"
                    >
                      Fill Sample Video URL
                    </button>
                  </div>
                </div>
              </div>
            )}

            {mediaType === 'file' && (
              <div className="space-y-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/60">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Study Notes / PDF Document URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={(e) => {
                      setMediaUrl(e.target.value);
                      if (!fileUrl) setFileUrl(e.target.value);
                    }}
                    placeholder="https://example.com/sermon_notes.pdf"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Or Upload PDF / DOC Study Notes (Under 4MB)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileUpload(e, 'document')}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {mediaType !== 'file' && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attach Downloadable Study Outline / PDF (Optional)
                </label>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://example.com/outline.pdf"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 mb-2"
                />
              </div>
            )}

            {errors.mediaUrl && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.mediaUrl}
              </p>
            )}
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>3. Summary, Outline & Cover Image</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sermon Outline & Key Insights <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a concise overview of the sermon message, main theological points, and practical ministry applications..."
                className={`w-full p-3 rounded-xl border text-sm leading-relaxed focus:ring-2 focus:ring-amber-500 ${
                  errors.description ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Cover Thumbnail Image</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
                {PRESET_COVERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCoverImageUrl(preset.url)}
                    className={`relative rounded-xl overflow-hidden border-2 h-16 transition cursor-pointer ${
                      coverImageUrl === preset.url ? 'border-amber-600 ring-2 ring-amber-400' : 'border-slate-200'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] p-0.5 text-center font-medium truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60 text-sm"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Archiving Media...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Publish Sermon to Media Archive</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
