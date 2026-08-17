import React, { useState, useRef } from 'react';
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
  Upload,
  Plus,
  Trash2,
  Key,
  Layers,
  Award,
  Eye,
  Sliders,
  Check,
} from 'lucide-react';
import { SiteSettings } from '../types';
import {
  MINISTERS_CONNECT_FLIER_LANDSCAPE,
  MINISTERS_CONNECT_FLIER_PORTRAIT,
} from '../assets/flierImage';
import { updatePrimaryAdminEmail, updatePrimaryAdminPasscode } from '../utils/storage';

interface SiteSettingsEditorProps {
  settings: SiteSettings;
  onSave: (updatedSettings: SiteSettings) => void;
  onResetToDefault: () => void;
}

const HERO_IMAGE_PRESETS = [
  {
    label: 'Ministers Connect: Reigning in the Storm (Landscape 16:9)',
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
    'branding' | 'hero' | 'showcase' | 'pillars' | 'announcements' | 'letter' | 'footer'
  >('branding');
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // New instruction input for Confirmation Letter
  const [newInstruction, setNewInstruction] = useState('');

  const handleChange = <K extends keyof SiteSettings>(field: K, value: SiteSettings[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Helper to handle image file upload and resize to Base64
  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: keyof SiteSettings
  ) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          handleChange(targetField, dataUrl as any);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddInstruction = () => {
    if (!newInstruction.trim()) return;
    const list = formData.letterImportantInstructions || [];
    handleChange('letterImportantInstructions', [...list, newInstruction.trim()]);
    setNewInstruction('');
  };

  const handleRemoveInstruction = (index: number) => {
    const list = formData.letterImportantInstructions || [];
    handleChange(
      'letterImportantInstructions',
      list.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If master admin email changed, synchronize it to admin account
    if (formData.primaryAdminEmail && formData.primaryAdminEmail.trim()) {
      updatePrimaryAdminEmail(formData.primaryAdminEmail.trim());
    }

    // If passcode changed, synchronize it
    if (formData.adminPasscode && formData.adminPasscode.trim()) {
      updatePrimaryAdminPasscode(formData.adminPasscode.trim());
    }

    onSave(formData);
    setNotificationMsg('All customizations, emails, words, images, and footer settings saved permanently to cloud!');
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {showSavedNotification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-sm">{notificationMsg}</span>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Visual Branding & Central Content Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
            Universal Site & Content Customizer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Edit all words, titles, emails, images, hero banners, 4 apostolic pillars, official letters, and footer content. Every update synchronizes live to all users across every device.
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
            className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save & Sync to All Users</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubTab('branding')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'branding'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>General & Admin Email</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('hero')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'hero'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>Hero Banner & Stats</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('showcase')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'showcase'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
          <span>August Showcase & Flyer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('pillars')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'pillars'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-sky-500" />
          <span>4 Apostolic Pillars</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('announcements')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'announcements'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-amber-500" />
          <span>Top Notice Marquee</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('letter')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'letter'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Confirmation Letter</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('footer')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'footer'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-purple-500" />
          <span>Footer & Contacts</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SUBTAB 1: GENERAL BRANDING & MASTER ADMIN ACCOUNT */}
        {activeSubTab === 'branding' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            {/* Master Admin Credentials Box */}
            <div className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-serif font-bold text-base">
                <Shield className="w-5 h-5 text-amber-700" />
                <span>Master Administrator Account & Security Passcode</span>
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                You can edit the primary admin login email and security passcode below. When saved, this account is permanently updated in Firestore so you can log into the Secretariat Console from any device with these new credentials.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Master Admin Login Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.primaryAdminEmail || 'asamuelbukunmi@gmail.com'}
                    onChange={(e) => handleChange('primaryAdminEmail', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-sm font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Default: <strong className="font-mono">asamuelbukunmi@gmail.com</strong>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Master Admin Security Passcode / Password
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.adminPasscode || 'admin123'}
                    onChange={(e) => handleChange('adminPasscode', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-sm font-mono font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Master passcode for secretariat dashboard login.
                  </span>
                </div>
              </div>
            </div>

            <h3 className="font-bold font-serif text-lg text-slate-900 border-b border-slate-100 pb-3">
              Organization Name & Primary Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Organization / Ministry Name
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
                  Tagline / Sub-Title Slogan
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
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-amber-700" />
                <h4 className="font-bold text-sm text-slate-900">
                  Event Terminology & Custom Wording
                </h4>
              </div>
              <p className="text-xs text-slate-600">
                Customize the terminology used throughout the portal. Default is <strong>Programme</strong> (not convocation). You can change this to "Meeting", "Gathering", "Fellowship", "Summit", or whatever suits your ministry.
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

            {/* Logo URL / Upload */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Organization Emblem / Logo Image
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="text"
                  value={formData.orgLogoUrl || ''}
                  onChange={(e) => handleChange('orgLogoUrl', e.target.value)}
                  placeholder="https://... or upload image"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono w-full"
                />
                <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0 border border-slate-300">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFileUpload(e, 'orgLogoUrl')}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: HERO SECTION & STATS */}
        {activeSubTab === 'hero' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <h3 className="font-bold font-serif text-lg text-slate-900 border-b border-slate-100 pb-3">
              Homepage Hero Section, Words & Anchor Scriptures
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
                    Headline Accent Word (Highlighted in Amber)
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
                  Hero Main Headline Prefix
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

              {/* Action Buttons Labels */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.heroRegisterButtonText || 'Register for August Programme'}
                    onChange={(e) => handleChange('heroRegisterButtonText', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Flyer CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.heroFlyerButtonText || 'View Official Flyer'}
                    onChange={(e) => handleChange('heroFlyerButtonText', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Lookup Link Text
                  </label>
                  <input
                    type="text"
                    value={
                      formData.heroLookupButtonText ||
                      'Already registered? Search & re-download your Confirmation Letter'
                    }
                    onChange={(e) => handleChange('heroLookupButtonText', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium"
                  />
                </div>
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
                    Scripture Reference & Date Strip
                  </label>
                  <input
                    type="text"
                    value={formData.heroScriptureRef}
                    onChange={(e) => handleChange('heroScriptureRef', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>

              {/* 4 Hero Stats Customization */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 pt-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Hero Metrics & Statistics Badges
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Stat 1 Count & Label
                    </label>
                    <input
                      type="text"
                      value={formData.heroStatsMinistersCount || '750+'}
                      onChange={(e) => handleChange('heroStatsMinistersCount', e.target.value)}
                      placeholder="750+"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs mb-1 font-bold"
                    />
                    <input
                      type="text"
                      value={formData.heroStatsMinistersLabel || 'Accredited Ministers'}
                      onChange={(e) => handleChange('heroStatsMinistersLabel', e.target.value)}
                      placeholder="Accredited Ministers"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Stat 2 Count & Label
                    </label>
                    <input
                      type="text"
                      value={formData.heroStatsProgrammesCount || '1'}
                      onChange={(e) => handleChange('heroStatsProgrammesCount', e.target.value)}
                      placeholder="1"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs mb-1 font-bold"
                    />
                    <input
                      type="text"
                      value={formData.heroStatsProgrammesLabel || 'Active Programmes'}
                      onChange={(e) => handleChange('heroStatsProgrammesLabel', e.target.value)}
                      placeholder="Active Programmes"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Stat 3 Count & Label
                    </label>
                    <input
                      type="text"
                      value={formData.heroStatsLettersCount || '100%'}
                      onChange={(e) => handleChange('heroStatsLettersCount', e.target.value)}
                      placeholder="100%"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs mb-1 font-bold"
                    />
                    <input
                      type="text"
                      value={formData.heroStatsLettersLabel || 'Instant PDF Letters'}
                      onChange={(e) => handleChange('heroStatsLettersLabel', e.target.value)}
                      placeholder="Instant PDF Letters"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Stat 4 Count & Label
                    </label>
                    <input
                      type="text"
                      value={formData.heroStatsFastCount || 'Fruit Fast'}
                      onChange={(e) => handleChange('heroStatsFastCount', e.target.value)}
                      placeholder="Fruit Fast"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs mb-1 font-bold"
                    />
                    <input
                      type="text"
                      value={formData.heroStatsFastLabel || 'Consecrated Encounter'}
                      onChange={(e) => handleChange('heroStatsFastLabel', e.target.value)}
                      placeholder="Consecrated Encounter"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Background Banner Image */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Hero Banner Background Image URL / File Upload
                  </label>
                  <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 border border-slate-300">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Banner Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, 'heroBannerImageUrl')}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.heroBannerImageUrl}
                  onChange={(e) => handleChange('heroBannerImageUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                />

                {/* Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
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

        {/* SUBTAB 3: AUGUST SHOWCASE CARD & OFFICIAL FLYER */}
        {activeSubTab === 'showcase' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <h3 className="font-bold font-serif text-lg text-slate-900 border-b border-slate-100 pb-3">
              August Programme Showcase Card & Official Flyer Poster
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Card Badge Label
                  </label>
                  <input
                    type="text"
                    value={formData.featuredProgramBadge || 'Monthly Program'}
                    onChange={(e) => handleChange('featuredProgramBadge', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Location Strip
                  </label>
                  <input
                    type="text"
                    value={formData.featuredProgramLocation || 'Maitama, Abuja (FCT)'}
                    onChange={(e) => handleChange('featuredProgramLocation', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Featured Programme Title
                </label>
                <input
                  type="text"
                  value={
                    formData.featuredProgramTitle ||
                    'Ministers Connect Monthly Program: Reigning in the Storm'
                  }
                  onChange={(e) => handleChange('featuredProgramTitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-serif font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Programme Theme Text
                </label>
                <input
                  type="text"
                  value={
                    formData.featuredProgramTheme ||
                    'REIGNING in the STORM — As Ministers of God, We Thrive in Trials'
                  }
                  onChange={(e) => handleChange('featuredProgramTheme', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm italic font-semibold text-amber-900 bg-amber-50/50"
                />
              </div>

              {/* Flyer Poster Image URL & Upload */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Official Flyer Poster Image (Portrait)
                  </label>
                  <label className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Poster Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, 'featuredProgramPosterUrl')}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.featuredProgramPosterUrl || MINISTERS_CONNECT_FLIER_PORTRAIT}
                  onChange={(e) => handleChange('featuredProgramPosterUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                />

                {/* Poster Preview */}
                <div className="flex items-center gap-4 pt-1">
                  <div className="w-20 h-28 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-900">
                    <img
                      src={formData.featuredProgramPosterUrl || MINISTERS_CONNECT_FLIER_PORTRAIT}
                      alt="Flyer Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800">
                      Live Event Flyer Preview
                    </p>
                    <p className="text-[11px] text-slate-500">
                      This poster displays prominently in the showcase card and can be enlarged in full high-resolution by visitors.
                    </p>
                  </div>
                </div>
              </div>

              {/* Logistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Dates Logistics Text
                  </label>
                  <input
                    type="text"
                    value={formData.featuredProgramDates || 'Third Friday 21st - 22nd Aug 2026'}
                    onChange={(e) => handleChange('featuredProgramDates', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Time Logistics Text
                  </label>
                  <input
                    type="text"
                    value={formData.featuredProgramTime || '9:00 AM to 12:00 PM Afternoon'}
                    onChange={(e) => handleChange('featuredProgramTime', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Fruit Fasting Protocol Text
                  </label>
                  <input
                    type="text"
                    value={
                      formData.featuredProgramFastProtocol ||
                      'Fruit Fast Protocol 🍇🍎🍌 (All attendees will be on a Fruit Fast)'
                    }
                    onChange={(e) => handleChange('featuredProgramFastProtocol', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Host Minister Name
                  </label>
                  <input
                    type="text"
                    value={formData.featuredProgramHost || 'Pastor John EZE'}
                    onChange={(e) => handleChange('featuredProgramHost', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Enquiries & Secretariat Hotlines
                </label>
                <input
                  type="text"
                  value={
                    formData.featuredProgramHotlines ||
                    '09110376410 | 08131587655 | 070 31216586'
                  }
                  onChange={(e) => handleChange('featuredProgramHotlines', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: 4 CORE APOSTOLIC PILLARS */}
        {activeSubTab === 'pillars' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <h3 className="font-bold font-serif text-lg text-slate-900 border-b border-slate-100 pb-3">
              The 4 Core Ministerial Pillars & Mandate
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Pillars Section Heading
                  </label>
                  <input
                    type="text"
                    value={
                      formData.pillarsSectionHeading ||
                      'Built for Apostolic Strength & Spiritual Refreshment'
                    }
                    onChange={(e) => handleChange('pillarsSectionHeading', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-serif font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Pillars Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={
                      formData.pillarsSectionSubtitle ||
                      'Supporting pastors, teachers, evangelists, and church leaders at every stage of their divine assignment.'
                    }
                    onChange={(e) => handleChange('pillarsSectionSubtitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* 4 Pillars Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-2">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    Pillar 1: Word
                  </span>
                  <input
                    type="text"
                    value={formData.pillar1Title || 'Stay Rooted in God\'s Word'}
                    onChange={(e) => handleChange('pillar1Title', e.target.value)}
                    placeholder="Pillar 1 Title"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                  />
                  <textarea
                    rows={2}
                    value={
                      formData.pillar1Desc ||
                      'Prophetic impartation, sound New Testament doctrine, and ministerial brotherhood to fortify your spirit in trials.'
                    }
                    onChange={(e) => handleChange('pillar1Desc', e.target.value)}
                    placeholder="Pillar 1 Description"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Pillar 2: Purpose
                  </span>
                  <input
                    type="text"
                    value={formData.pillar2Title || 'Stay Focused on His Purpose'}
                    onChange={(e) => handleChange('pillar2Title', e.target.value)}
                    placeholder="Pillar 2 Title"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                  />
                  <textarea
                    rows={2}
                    value={
                      formData.pillar2Desc ||
                      'Ministers endurance, divine vision alignment, pastoral care, and fruit fasting consecration.'
                    }
                    onChange={(e) => handleChange('pillar2Desc', e.target.value)}
                    placeholder="Pillar 2 Description"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>

                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/70 space-y-2">
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                    Pillar 3: Spirit
                  </span>
                  <input
                    type="text"
                    value={formData.pillar3Title || 'Stay Fired by His Spirit'}
                    onChange={(e) => handleChange('pillar3Title', e.target.value)}
                    placeholder="Pillar 3 Title"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                  />
                  <textarea
                    rows={2}
                    value={
                      formData.pillar3Desc ||
                      'Spiritual stamina, apostolic fire, prophetic prayers, and fresh anointing upon your ministerial altar.'
                    }
                    onChange={(e) => handleChange('pillar3Desc', e.target.value)}
                    placeholder="Pillar 3 Description"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>

                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200/70 space-y-2">
                  <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Pillar 4: Faithfulness
                  </span>
                  <input
                    type="text"
                    value={formData.pillar4Title || 'Stay Faithful in Every Season'}
                    onChange={(e) => handleChange('pillar4Title', e.target.value)}
                    placeholder="Pillar 4 Title"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                  />
                  <textarea
                    rows={2}
                    value={
                      formData.pillar4Desc ||
                      '"Storms don\'t last. Our calling does." Continuous accreditation, digital certificates, and fellowship support.'
                    }
                    onChange={(e) => handleChange('pillar4Desc', e.target.value)}
                    placeholder="Pillar 4 Description"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 5: TOP BROADCAST ANNOUNCEMENT MARQUEE */}
        {activeSubTab === 'announcements' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <h3 className="font-bold font-serif text-lg text-slate-900 border-b border-slate-100 pb-3">
              Top Header Announcement Banner
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
                  Enable Live Announcement Alert Bar at Top of Website
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
                  placeholder="e.g. 📢 Ministers Connect Monthly Program: 'REIGNING IN THE STORM' is holding on Third Friday 21st – 22nd August 2026 in Maitama, Abuja! Host: Pastor John EZE. All attendees will be on a Fruit Fast."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Destination Tab
                  </label>
                  <select
                    value={formData.announcementLinkTab || 'register'}
                    onChange={(e) =>
                      handleChange('announcementLinkTab', e.target.value as any)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="register">Registration Page</option>
                    <option value="programmes">Programmes List</option>
                    <option value="leaders">Church Leaders Directory</option>
                    <option value="sermons">Sermons & Word Repository</option>
                    <option value="gallery">Photo Gallery</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 6: CONFIRMATION LETTER & SIGNATORIES */}
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
                  Letter Opening Confirmation Paragraph
                </label>
                <textarea
                  rows={3}
                  value={formData.letterOpeningParagraph}
                  onChange={(e) => handleChange('letterOpeningParagraph', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              {/* Interactive Instructions List */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Important Delegate Instructions (Printed on PDF Letter)
                </label>

                <div className="space-y-2">
                  {(formData.letterImportantInstructions || []).map((instruction, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 text-xs">
                      <span className="font-bold text-amber-700 shrink-0">{idx + 1}.</span>
                      <span className="flex-1 text-slate-800">{instruction}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInstruction(idx)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer shrink-0"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
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
                    placeholder="Add new instruction point..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddInstruction}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Signatories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Primary Signatory (Host / Convener)
                  </span>
                  <div>
                    <label className="block text-[11px] text-slate-600 font-medium">Name</label>
                    <input
                      type="text"
                      value={formData.signatory1Name}
                      onChange={(e) => handleChange('signatory1Name', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 font-medium">Title</label>
                    <input
                      type="text"
                      value={formData.signatory1Title}
                      onChange={(e) => handleChange('signatory1Title', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Secondary Signatory (Secretariat Director)
                  </span>
                  <div>
                    <label className="block text-[11px] text-slate-600 font-medium">Name</label>
                    <input
                      type="text"
                      value={formData.signatory2Name}
                      onChange={(e) => handleChange('signatory2Name', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 font-medium">Title</label>
                    <input
                      type="text"
                      value={formData.signatory2Title}
                      onChange={(e) => handleChange('signatory2Title', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Official Seal Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Seal Stamp Text
                  </label>
                  <input
                    type="text"
                    value={formData.officialSealText || 'Accredited & Certified'}
                    onChange={(e) => handleChange('officialSealText', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Seal Stamp Subtext
                  </label>
                  <input
                    type="text"
                    value={formData.officialSealSubtext || 'MINISTERS CONNECT OFFICIAL SEAL'}
                    onChange={(e) => handleChange('officialSealSubtext', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 7: FOOTER & SECRETARIAT CONTACTS */}
        {activeSubTab === 'footer' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <h3 className="font-bold font-serif text-lg text-slate-900 border-b border-slate-100 pb-3">
              Footer Content, Addresses, Emails & Legal Notices
            </h3>

            {/* Footer Column 1: Brand & About */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Footer Brand Title
                  </label>
                  <input
                    type="text"
                    value={formData.footerAboutTitle || formData.orgName}
                    onChange={(e) => handleChange('footerAboutTitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-serif font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Footer Quote / Motto
                  </label>
                  <input
                    type="text"
                    value={formData.footerQuoteText || formData.heroScriptureQuote || 'Storms don\'t last. Our calling does.'}
                    onChange={(e) => handleChange('footerQuoteText', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm italic"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Footer Brand Description Paragraph
                </label>
                <textarea
                  rows={2}
                  value={formData.footerAboutText || formData.heroSubtitle || ''}
                  onChange={(e) => handleChange('footerAboutText', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              {/* Secretariat Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Support Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.supportEmail}
                    onChange={(e) => handleChange('supportEmail', e.target.value)}
                    placeholder="secretariat@ministersconnect.org"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Support Helpline Phone Numbers
                  </label>
                  <input
                    type="text"
                    value={formData.supportPhone}
                    onChange={(e) => handleChange('supportPhone', e.target.value)}
                    placeholder="09110376410 | 08131587655"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp Helpline / Contact
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappContact}
                    onChange={(e) => handleChange('whatsappContact', e.target.value)}
                    placeholder="09110376410"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
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
                    placeholder="Ministers Connect Headquarters, Maitama District, Abuja (FCT), Nigeria"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Accreditation & Legal Notices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Accreditation Notice Title
                  </label>
                  <input
                    type="text"
                    value={formData.footerNoticeTitle || 'Accreditation Notice & Rights'}
                    onChange={(e) => handleChange('footerNoticeTitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Notice Action Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.footerNoticeBtnText || 'Register Now'}
                    onChange={(e) => handleChange('footerNoticeBtnText', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Accreditation Notice Text
                </label>
                <textarea
                  rows={2}
                  value={
                    formData.footerNoticeText ||
                    formData.accreditationRightsNotice ||
                    'Every registered minister receives an official Confirmation of Registration Letter with a unique Registration ID for express security and tag issuance at the venue.'
                  }
                  onChange={(e) => {
                    handleChange('footerNoticeText', e.target.value);
                    handleChange('accreditationRightsNotice', e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Copyright Line
                  </label>
                  <input
                    type="text"
                    value={
                      formData.footerCopyrightNotice ||
                      formData.copyrightNotice ||
                      '© 2026 Ministers Connect Global. All rights reserved.'
                    }
                    onChange={(e) => {
                      handleChange('footerCopyrightNotice', e.target.value);
                      handleChange('copyrightNotice', e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Dedicated Text
                  </label>
                  <input
                    type="text"
                    value={formData.footerDedicatedText || 'Dedicated to Kingdom Unity'}
                    onChange={(e) => handleChange('footerDedicatedText', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button at Bottom */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="submit"
            className="px-7 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-sm transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save All Customizations & Sync</span>
          </button>
        </div>
      </form>
    </div>
  );
};
