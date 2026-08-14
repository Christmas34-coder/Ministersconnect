import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  Check, 
  Image as ImageIcon, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Flame, 
  Plus, 
  Trash2, 
  Upload, 
  Eye, 
  Building2, 
  Phone, 
  Mail, 
  Globe2, 
  BookOpen, 
  Award, 
  HelpCircle,
  Megaphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SiteSettings } from '../types';
import { CURATED_PRESET_IMAGES, DEFAULT_SITE_SETTINGS } from '../data/seedData';

interface SiteSettingsEditorProps {
  settings: SiteSettings;
  onSave: (updated: SiteSettings) => void;
  onResetToDefault: () => void;
}

export const SiteSettingsEditor: React.FC<SiteSettingsEditorProps> = ({
  settings,
  onSave,
  onResetToDefault,
}) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'letter' | 'rights' | 'contacts' | 'presets'>('hero');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newInstruction, setNewInstruction] = useState('');
  const [uploadError, setUploadError] = useState('');

  const handleChange = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddInstruction = () => {
    if (!newInstruction.trim()) return;
    setFormData((prev) => ({
      ...prev,
      letterImportantInstructions: [...prev.letterImportantInstructions, newInstruction.trim()],
    }));
    setNewInstruction('');
  };

  const handleRemoveInstruction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      letterImportantInstructions: prev.letterImportantInstructions.filter((_, i) => i !== index),
    }));
  };

  const handleInstructionChange = (index: number, val: string) => {
    const updated = [...formData.letterImportantInstructions];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, letterImportantInstructions: updated }));
  };

  // Image Upload helper
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Image size exceeds 4MB. Please choose a smaller file.');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        handleChange('heroBannerImageUrl', event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Save Strip */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Content Management & Customizer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
            Customise App Content, Images, Write-ups & Rights
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Update your homepage banner imagery, slogans, scripture quotes, confirmation letter write-ups, signatories, legal rights, and secretariat contact information in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all write-ups and site settings to default?')) {
                onResetToDefault();
                setFormData({ ...DEFAULT_SITE_SETTINGS });
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 2500);
              }
            }}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer border border-slate-700 flex items-center gap-1.5"
            title="Reset to default text"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-sm font-bold rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-950" />
                <span>Changes Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All text write-ups, banner images, letter signatories, and rights have been saved and applied across the app!</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('hero')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'hero'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Hero Banner & Write-ups</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('letter')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'letter'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Confirmation Letter & Signatories</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('rights')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'rights'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Rights, Copyright & Security</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('contacts')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'contacts'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Secretariat Headquarters & Contacts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('presets')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'presets'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Curated Banner Presets</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: HERO BANNER & WRITE-UPS */}
        {/* ========================================================================= */}
        {activeSubTab === 'hero' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-600" />
                <span>Homepage Hero Banner & Main Slogans</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the high-impact visual banner and key messages displayed when ministers visit the portal.
              </p>
            </div>

            {/* Live Banner Preview & Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Current Hero Background Banner Image
              </label>

              <div className="relative rounded-2xl overflow-hidden h-52 sm:h-64 border-2 border-amber-400 shadow-md bg-slate-950 flex flex-col justify-end p-6 text-white">
                <img
                  src={formData.heroBannerImageUrl}
                  alt="Hero Banner Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent" 
                  style={{ opacity: formData.heroOverlayOpacity / 100 }}
                />

                <div className="relative z-10 space-y-1.5">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                    {formData.heroBadge}
                  </div>
                  <h4 className="text-lg sm:text-2xl font-bold font-serif leading-tight">
                    {formData.heroHeadline} <span className="text-amber-400">{formData.heroHeadlineHighlight}</span>
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 max-w-xl">
                    {formData.heroSubtitle}
                  </p>
                </div>
              </div>

              {/* Banner Image URL / Upload Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Image Direct URL
                  </label>
                  <input
                    type="url"
                    value={formData.heroBannerImageUrl}
                    onChange={(e) => handleChange('heroBannerImageUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Or Upload From Device
                  </label>
                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold cursor-pointer transition">
                    <Upload className="w-4 h-4 text-amber-600" />
                    <span>Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {uploadError && (
                <p className="text-xs text-red-600 font-medium">{uploadError}</p>
              )}

              {/* Overlay Opacity Slider */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Banner Dark Overlay Intensity</span>
                  <span className="text-amber-700 font-mono">{formData.heroOverlayOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="95"
                  value={formData.heroOverlayOpacity}
                  onChange={(e) => handleChange('heroOverlayOpacity', Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Hero Write-ups Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Top Pill Badge Text
                </label>
                <input
                  type="text"
                  value={formData.heroBadge}
                  onChange={(e) => handleChange('heroBadge', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Main Headline (Prefix)
                </label>
                <input
                  type="text"
                  value={formData.heroHeadline}
                  onChange={(e) => handleChange('heroHeadline', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 font-serif"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Highlighted Headline Word(s)
                </label>
                <input
                  type="text"
                  value={formData.heroHeadlineHighlight}
                  onChange={(e) => handleChange('heroHeadlineHighlight', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 font-serif text-amber-700"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Hero Subtitle Write-up & Welcome Pitch
                </label>
                <textarea
                  rows={3}
                  value={formData.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Theme Scripture Quote
                </label>
                <input
                  type="text"
                  value={formData.heroScriptureQuote}
                  onChange={(e) => handleChange('heroScriptureQuote', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 font-serif"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Secondary Scripture Reference
                </label>
                <input
                  type="text"
                  value={formData.heroScriptureRef}
                  onChange={(e) => handleChange('heroScriptureRef', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 font-serif"
                />
              </div>
            </div>

            {/* Global Announcement Alert Bar */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Megaphone className="w-4 h-4 text-amber-600" />
                    <span>Top Announcement Broadcast Bar</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Display a high-priority alert across the top of every page.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.announcementActive}
                    onChange={(e) => handleChange('announcementActive', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {formData.announcementActive && (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                  <div className="sm:col-span-8 space-y-1">
                    <label className="text-xs font-medium text-slate-700">Broadcast Alert Text</label>
                    <input
                      type="text"
                      value={formData.announcementText}
                      onChange={(e) => handleChange('announcementText', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-xs font-medium text-slate-700">Button Label</label>
                    <input
                      type="text"
                      value={formData.announcementLinkText || ''}
                      onChange={(e) => handleChange('announcementLinkText', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CONFIRMATION LETTER & SIGNATORIES */}
        {/* ========================================================================= */}
        {activeSubTab === 'letter' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <span>Official Confirmation Letter & Signatories</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the official letterhead, apostolic salutation, body write-ups, signatories, and instructions printed on each delegate confirmation letter.
              </p>
            </div>

            {/* Letter Headings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Letterhead Organization Name
                </label>
                <input
                  type="text"
                  value={formData.letterOrgHeader}
                  onChange={(e) => handleChange('letterOrgHeader', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold font-serif focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Letterhead Commission / Secretariat Title
                </label>
                <input
                  type="text"
                  value={formData.letterSubHeader}
                  onChange={(e) => handleChange('letterSubHeader', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Document Title Banner
                </label>
                <input
                  type="text"
                  value={formData.letterDocumentTitle}
                  onChange={(e) => handleChange('letterDocumentTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-amber-500 uppercase"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Apostolic Salutation / Blessing Intro
                </label>
                <input
                  type="text"
                  value={formData.letterGreetingText}
                  onChange={(e) => handleChange('letterGreetingText', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Opening Body Paragraph Write-up
                </label>
                <textarea
                  rows={3}
                  value={formData.letterOpeningParagraph}
                  onChange={(e) => handleChange('letterOpeningParagraph', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Official Signatories */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Authorized Signatories</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Signatory 1 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Signatory 1 (Presiding Convener)
                  </span>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Full Name & Title</label>
                    <input
                      type="text"
                      value={formData.signatory1Name}
                      onChange={(e) => handleChange('signatory1Name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Official Position</label>
                    <input
                      type="text"
                      value={formData.signatory1Title}
                      onChange={(e) => handleChange('signatory1Title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Fellowship / Secretariat Role</label>
                    <input
                      type="text"
                      value={formData.signatory1Role}
                      onChange={(e) => handleChange('signatory1Role', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-500"
                    />
                  </div>
                </div>

                {/* Signatory 2 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Signatory 2 (General Secretary)
                  </span>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Full Name & Title</label>
                    <input
                      type="text"
                      value={formData.signatory2Name}
                      onChange={(e) => handleChange('signatory2Name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Official Position</label>
                    <input
                      type="text"
                      value={formData.signatory2Title}
                      onChange={(e) => handleChange('signatory2Title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Board / Committee Role</label>
                    <input
                      type="text"
                      value={formData.signatory2Role}
                      onChange={(e) => handleChange('signatory2Role', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Important Delegate Instructions */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">
                  Important Delegate Instructions & Arrival Protocol
                </h4>
                <span className="text-xs text-slate-500">
                  {formData.letterImportantInstructions.length} instruction items
                </span>
              </div>

              <div className="space-y-2">
                {formData.letterImportantInstructions.map((instruction, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="w-6 h-8 flex items-center justify-center font-mono font-bold text-xs text-amber-700 shrink-0">
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(index)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                      title="Remove line"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Instruction Input */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInstruction();
                    }
                  }}
                  placeholder="Type a new guideline and click Add..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddInstruction}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Add Instruction</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: RIGHTS, COPYRIGHT & SECURITY */}
        {/* ========================================================================= */}
        {activeSubTab === 'rights' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span>Legal Rights, Copyright & Access Permissions</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust the copyright statements, terms of registration, accreditation policy, and admin security passcode.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Global Copyright Statement (Footer & Letters)
                </label>
                <input
                  type="text"
                  value={formData.copyrightNotice}
                  onChange={(e) => handleChange('copyrightNotice', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Accreditation Rights & Non-Transferability Notice
                </label>
                <textarea
                  rows={3}
                  value={formData.accreditationRightsNotice}
                  onChange={(e) => handleChange('accreditationRightsNotice', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Data Protection & Privacy Notice
                </label>
                <textarea
                  rows={2}
                  value={formData.privacyNotice}
                  onChange={(e) => handleChange('privacyNotice', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Convocation Terms & Decorum Policy
                </label>
                <textarea
                  rows={2}
                  value={formData.termsNotice}
                  onChange={(e) => handleChange('termsNotice', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Admin Passcode Update */}
              <div className="pt-4 border-t border-slate-100">
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Lock className="w-4 h-4 text-amber-700" />
                    <span>Secretariat Admin Portal Passcode</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    Change the password required to log into the Admin & Secretariat Dashboard. (Default was <code className="bg-amber-200 px-1.5 py-0.5 rounded font-mono font-bold">admin123</code>).
                  </p>
                  <div className="pt-1 max-w-sm">
                    <input
                      type="text"
                      value={formData.adminPasscode}
                      onChange={(e) => handleChange('adminPasscode', e.target.value)}
                      placeholder="Enter new admin passcode"
                      className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SECRETARIAT HEADQUARTERS & CONTACTS */}
        {/* ========================================================================= */}
        {activeSubTab === 'contacts' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                <span>Secretariat Headquarters & Support Channels</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update the official address, contact telephone numbers, email addresses, and WhatsApp support line.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Secretariat Headquarters Physical Address
                </label>
                <textarea
                  rows={2}
                  value={formData.headquartersAddress}
                  onChange={(e) => handleChange('headquartersAddress', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-amber-600" />
                  <span>Official Support Email</span>
                </label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Support Telephone Numbers</span>
                </label>
                <input
                  type="text"
                  value={formData.supportPhone}
                  onChange={(e) => handleChange('supportPhone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  WhatsApp Support Line
                </label>
                <input
                  type="text"
                  value={formData.whatsappContact}
                  onChange={(e) => handleChange('whatsappContact', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Fellowship Organization Acronym / Code
                </label>
                <input
                  type="text"
                  value={formData.orgShortCode}
                  onChange={(e) => handleChange('orgShortCode', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CURATED BANNER PRESETS */}
        {/* ========================================================================= */}
        {activeSubTab === 'presets' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-600" />
                <span>Curated High-Resolution Convocation Presets</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any high-resolution image below to instantly set it as the primary Hero Banner across the platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CURATED_PRESET_IMAGES.map((preset, idx) => {
                const isSelected = formData.heroBannerImageUrl === preset.url;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      handleChange('heroBannerImageUrl', preset.url);
                    }}
                    className={`group relative rounded-xl overflow-hidden border-2 transition cursor-pointer flex flex-col justify-end h-48 ${
                      isSelected
                        ? 'border-amber-500 ring-2 ring-amber-500 ring-offset-2 shadow-md'
                        : 'border-slate-200 hover:border-amber-400'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    <div className="relative z-10 p-3 text-white">
                      <span className="text-[10px] uppercase font-bold text-amber-400 block">
                        {preset.category}
                      </span>
                      <h5 className="text-xs font-bold leading-tight mt-0.5">
                        {preset.name}
                      </h5>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Save Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-slate-950 font-extrabold text-sm rounded-xl transition shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-950" />
                <span>All Changes Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
