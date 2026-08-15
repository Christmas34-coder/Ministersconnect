import React, { useState } from 'react';
import {
  Sparkles,
  Save,
  RotateCcw,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  Building,
  FileCheck,
  Type,
  LayoutTemplate,
  Globe,
  Radio,
  BookOpen,
  MapPin,
  Shield,
} from 'lucide-react';
import { SiteSettings } from '../types';
import {
  MINISTERS_CONNECT_FLIER_LANDSCAPE,
  MINISTERS_CONNECT_FLIER_PORTRAIT,
} from '../assets/flierImage';

interface SiteSettingsEditorProps {
  settings: SiteSettings;
  onSave: (updatedSettings: SiteSettings) => void;
  onResetToDefault: () => void;
}

const HERO_IMAGE_PRESETS = [
  {
    label: 'Ministers Connect: Reigning in the Storm (Landscape Banner)',
    url: MINISTERS_CONNECT_FLIER_LANDSCAPE,
  },
  {
    label: 'Ministers Connect: Official Event Flyer (Portrait)',
    url: MINISTERS_CONNECT_FLIER_PORTRAIT,
  },
];

export const SiteSettingsEditor: React.FC<SiteSettingsEditorProps> = ({
  settings,
  onSave,
  onResetToDefault,
}) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [activeSubTab, setActiveSubTab] = useState<
    'branding' | 'hero' | 'announcements' | 'letter' | 'contact'
  >('branding');
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const handleChange = <K extends keyof SiteSettings>(field: K, value: SiteSettings[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {showSavedNotification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-sm">
              Site branding and content settings saved successfully!
            </span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Visual Branding & Content Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
            Site & Secretariat Customizer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Live editor for homepage banner, ministry slogans, scripture quotes, official confirmation letters, signatories, and global secretariat notices.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onResetToDefault}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save All Customizations</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubTab('branding')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'branding'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>General Identity</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('hero')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'hero'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>Homepage Hero & Quotes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('announcements')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'announcements'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-amber-500" />
          <span>Broadcast Notice Bar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('letter')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'letter'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Official Confirmation Letter</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('contact')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'contact'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Secretariat Contacts</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SUBTAB 1: BRANDING */}
        {activeSubTab === 'branding' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <h3 className="font-bold font-serif text-lg text-slate-900 border-b border-slate-100 pb-3">
              Organization Name & Primary Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={formData.orgName}
                  onChange={(e) => handleChange('orgName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tagline / Sub-Title
                </label>
                <input
                  type="text"
                  value={formData.orgTagline}
                  onChange={(e) => handleChange('orgTagline', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Short Code / Moniker
                </label>
                <input
                  type="text"
                  value={formData.orgShortCode}
                  onChange={(e) => handleChange('orgShortCode', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium"
                />
              </div>
            </div>

            {/* Event Terminology Customization */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-amber-700" />
                <h4 className="font-bold text-sm text-slate-900">
                  Event Terminology & Custom Wording
                </h4>
              </div>
              <p className="text-xs text-slate-600">
                Customize the terminology used throughout the portal. Default is <strong>Programme</strong> (not convocation). You can change this to "Meeting", "Gathering", "Fellowship", "Conference", or whatever suits your ministry.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Singular Term (e.g. Programme, Gathering)
                  </label>
                  <input
                    type="text"
                    value={formData.programmeTermSingular || 'Programme'}
                    onChange={(e) => handleChange('programmeTermSingular', e.target.value)}
                    placeholder="Programme"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Plural Term (e.g. Programmes, Gatherings)
                  </label>
                  <input
                    type="text"
                    value={formData.programmeTermPlural || 'Programmes'}
                    onChange={(e) => handleChange('programmeTermPlural', e.target.value)}
                    placeholder="Programmes"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Footer Copyright Notice
              </label>
              <input
                type="text"
                value={formData.copyrightNotice}
                onChange={(e) => handleChange('copyrightNotice', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium"
              />
            </div>
          </div>
        )}

        {/* SUBTAB 2: HERO & SCRIPTURE */}
        {activeSubTab === 'hero' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <h3 className="font-bold font-serif text-lg text-slate-900 border-b border-slate-100 pb-3">
              Homepage Hero Section & Anchor Scriptures
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Hero Badge Text
                  </label>
                  <input
                    type="text"
                    value={formData.heroBadge}
                    onChange={(e) => handleChange('heroBadge', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Headline Accent Word
                  </label>
                  <input
                    type="text"
                    value={formData.heroHeadlineHighlight}
                    onChange={(e) => handleChange('heroHeadlineHighlight', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hero Main Headline
                </label>
                <input
                  type="text"
                  value={formData.heroHeadline}
                  onChange={(e) => handleChange('heroHeadline', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-serif font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hero Subtitle Paragraph
                </label>
                <textarea
                  rows={2}
                  value={formData.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Scriptural Verse Quote
                  </label>
                  <textarea
                    rows={2}
                    value={formData.heroScriptureQuote}
                    onChange={(e) => handleChange('heroScriptureQuote', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm italic"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Scripture Reference
                  </label>
                  <input
                    type="text"
                    value={formData.heroScriptureRef}
                    onChange={(e) => handleChange('heroScriptureRef', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Hero Image Presets */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Hero Background Image URL or Choose Preset
                </label>
                <input
                  type="text"
                  value={formData.heroBannerImageUrl}
                  onChange={(e) => handleChange('heroBannerImageUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                />

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                  {HERO_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleChange('heroBannerImageUrl', preset.url)}
                      className={`relative h-20 rounded-xl overflow-hidden border-2 transition cursor-pointer group text-left ${
                        formData.heroBannerImageUrl === preset.url
                          ? 'border-amber-500 ring-2 ring-amber-400'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-950/60 p-1 flex items-end">
                        <span className="text-[10px] text-white font-bold line-clamp-1">
                          {preset.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: ANNOUNCEMENT BROADCAST */}
        {activeSubTab === 'announcements' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <h3 className="font-bold font-serif text-lg text-slate-900 border-b border-slate-100 pb-3">
              Top Header Announcement Marquee
            </h3>

            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.announcementActive}
                  onChange={(e) => handleChange('announcementActive', e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <span className="text-sm font-bold text-slate-800">
                  Enable Live Announcement Banner at Top of Website
                </span>
              </label>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Broadcast Message Text
                </label>
                <textarea
                  rows={2}
                  value={formData.announcementText}
                  onChange={(e) => handleChange('announcementText', e.target.value)}
                  placeholder="e.g. 📢 Early registration for GMC 2026 is currently open! Limited VIP delegate seats available."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Action Link Button Label (Optional)
                </label>
                <input
                  type="text"
                  value={formData.announcementLinkText || ''}
                  onChange={(e) => handleChange('announcementLinkText', e.target.value)}
                  placeholder="e.g. Register Now"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: CONFIRMATION LETTER */}
        {activeSubTab === 'letter' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <h3 className="font-bold font-serif text-lg text-slate-900 border-b border-slate-100 pb-3">
              Official Ministerial Confirmation Letter & Accreditation Rules
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Letter Organization Header
                  </label>
                  <input
                    type="text"
                    value={formData.letterOrgHeader}
                    onChange={(e) => handleChange('letterOrgHeader', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={formData.letterDocumentTitle}
                    onChange={(e) => handleChange('letterDocumentTitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Letter Opening Paragraph
                </label>
                <textarea
                  rows={3}
                  value={formData.letterOpeningParagraph}
                  onChange={(e) => handleChange('letterOpeningParagraph', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Primary Signatory Name
                  </label>
                  <input
                    type="text"
                    value={formData.signatory1Name}
                    onChange={(e) => handleChange('signatory1Name', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Primary Signatory Title
                  </label>
                  <input
                    type="text"
                    value={formData.signatory1Title}
                    onChange={(e) => handleChange('signatory1Title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Secondary Signatory Name
                  </label>
                  <input
                    type="text"
                    value={formData.signatory2Name}
                    onChange={(e) => handleChange('signatory2Name', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Secondary Signatory Title
                  </label>
                  <input
                    type="text"
                    value={formData.signatory2Title}
                    onChange={(e) => handleChange('signatory2Title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 5: CONTACT */}
        {activeSubTab === 'contact' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <h3 className="font-bold font-serif text-lg text-slate-900 border-b border-slate-100 pb-3">
              Secretariat Contact Information & Helpdesk
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Support Email Address
                </label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Support Helpline Phone Number
                </label>
                <input
                  type="text"
                  value={formData.supportPhone}
                  onChange={(e) => handleChange('supportPhone', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  WhatsApp Helpline / Hotlines
                </label>
                <input
                  type="text"
                  value={formData.whatsappContact}
                  onChange={(e) => handleChange('whatsappContact', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Ministers Connect Headquarters Physical Address
                </label>
                <input
                  type="text"
                  value={formData.headquartersAddress}
                  onChange={(e) => handleChange('headquartersAddress', e.target.value)}
                  placeholder="e.g. Ministers Connect Headquarters, Maitama District, Abuja (FCT), Nigeria"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save All Customizations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
