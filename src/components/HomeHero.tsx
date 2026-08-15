import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Calendar,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Search,
  Church,
  Users,
  BookOpen,
  HeartHandshake,
  FileAudio,
  Award,
  Eye,
  MapPin,
  Clock,
  Phone,
} from 'lucide-react';
import { Programme, SiteSettings } from '../types';
import { AppTab } from './Navbar';
import { DEFAULT_SITE_SETTINGS } from '../data/seedData';
import { MINISTERS_CONNECT_FLIER_PORTRAIT } from '../assets/flierImage';
import { FlyerPosterModal } from './FlyerPosterModal';

interface HomeHeroProps {
  featuredProgramme?: Programme;
  siteSettings?: SiteSettings;
  totalMinistersCount: number;
  totalProgrammesCount: number;
  onNavigate: (tab: AppTab) => void;
  onSelectProgrammeForRegister: (programmeId: string) => void;
  onOpenLookup: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  featuredProgramme,
  siteSettings = DEFAULT_SITE_SETTINGS,
  totalMinistersCount,
  totalProgrammesCount,
  onNavigate,
  onSelectProgrammeForRegister,
  onOpenLookup,
}) => {
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* Main Hero Header */}
      <section className="bg-slate-950 text-white pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-600/40 text-xs font-semibold tracking-wide uppercase">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{siteSettings.heroBadge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight text-white leading-tight max-w-4xl mx-auto">
            {siteSettings.heroHeadline}{' '}
            <span className="text-amber-400">{siteSettings.heroHeadlineHighlight}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed font-sans">
            {siteSettings.heroSubtitle}
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto">
            <button
              onClick={() => {
                if (featuredProgramme) {
                  onSelectProgrammeForRegister(featuredProgramme.id);
                } else {
                  onNavigate('register');
                }
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm sm:text-base transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-5 h-5" />
              <span>Register for Convocation</span>
            </button>

            <button
              onClick={() => setIsFlyerModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-sm sm:text-base border border-slate-700 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5 text-amber-400" />
              <span>View Official Flyer</span>
            </button>
          </div>

          {/* Quick Lookup Link */}
          <div className="pt-1">
            <button
              onClick={onOpenLookup}
              className="text-xs sm:text-sm text-slate-400 hover:text-amber-300 transition inline-flex items-center gap-1.5 cursor-pointer underline underline-offset-4"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Already registered? Search & re-download your Confirmation Letter</span>
            </button>
          </div>

          {/* Scripture Verse Bar */}
          {siteSettings.heroScriptureQuote && (
            <div className="pt-3 text-xs sm:text-sm text-amber-300/90 italic font-serif max-w-xl mx-auto border-t border-slate-800/80 mt-4">
              "{siteSettings.heroScriptureQuote}"
            </div>
          )}

          {/* Key Metric Highlights Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif">
                {totalMinistersCount > 0 ? `${totalMinistersCount}+` : '750+'}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Accredited Ministers</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                {totalProgrammesCount}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Active Convocations</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif">
                100%
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Instant PDF Letters</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                Fruit Fast
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Consecrated Encounter</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Convocation Showcase Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border-2 border-amber-500/40 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 text-white">
          {/* Image & Interactive Flyer Card */}
          <div className="lg:col-span-5 relative bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-800">
            <div
              className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 cursor-pointer group"
              onClick={() => setIsFlyerModalOpen(true)}
            >
              <img
                src={MINISTERS_CONNECT_FLIER_PORTRAIT}
                alt="Ministers Connect - Reigning in the Storm"
                className="w-full h-auto object-cover group-hover:scale-102 transition duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 text-white font-bold text-sm backdrop-blur-[2px]">
                <Eye className="w-5 h-5 text-amber-400" />
                <span>Click to View Full Flyer</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between w-full max-w-sm text-xs text-slate-400 px-1">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Official Convocation Poster</span>
              </span>
              <button
                type="button"
                onClick={() => setIsFlyerModalOpen(true)}
                className="text-amber-300 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
              >
                <span>Expand Poster</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Details & Program Logistics */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300">
                  Monthly Program
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  Maitama, Abuja (FCT)
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white leading-tight">
                {featuredProgramme?.title || 'Ministers Connect Monthly Program: Reigning in the Storm'}
              </h2>

              <p className="text-base sm:text-lg font-serif italic text-amber-300 mt-2 font-semibold">
                Theme: "{featuredProgramme?.theme || 'REIGNING in the STORM — As Ministers of God, We Thrive in Trials'}"
              </p>

              {/* 4 Core Pillars */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>The 4 Core Ministerial Pillars</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span><strong>1.</strong> Stay Rooted in God's Word</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span><strong>2.</strong> Stay Focused on His Purpose</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span><strong>3.</strong> Stay Fired by His Spirit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span><strong>4.</strong> Stay Faithful in Every Season</span>
                  </div>
                </div>
              </div>

              {/* Event Time & Fasting Note */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Third Friday 21st - 22nd Aug 2026</strong>
                    <span>9:00 AM to 12:00 PM Afternoon</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Fruit Fast Protocol 🍇🍎🍌</strong>
                    <span>All attendees will be on a Fruit Fast</span>
                  </div>
                </div>
              </div>

              {/* Host & Hotlines */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-800 pt-3">
                <span>Host: <strong className="text-white">Pastor John EZE</strong></span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  <span>Enquiries: <strong className="text-amber-300">09110376410 | 08131587655 | 070 31216586</strong></span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (featuredProgramme) {
                    onSelectProgrammeForRegister(featuredProgramme.id);
                  } else {
                    onNavigate('register');
                  }
                }}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Register for this Convocation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsFlyerModalOpen(true)}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition border border-slate-700 cursor-pointer flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>View Full Flyer</span>
              </button>

              <button
                onClick={() => onNavigate('programmes')}
                className="px-4 py-3 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer"
              >
                All Convocations
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Portal Banners for Church Leaders & Sermon Audio/Video */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Leaders Directory Portal Card */}
          <div className="bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-2xl p-6 sm:p-7 border border-amber-900/50 shadow-md flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Leadership Registry</span>
                </span>
                <Users className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold font-serif text-white mb-2">
                Church Leaders & Pastors Directory
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Explore accredited church leaders, senior pastors, and apostolic overseers. Leaders can register their ministerial profile, upload portraits, and describe their key pastoral calling.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('leaders')}
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Explore Leaders & Register Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Word & Sermon Media Portal Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-6 sm:p-7 border border-blue-900/50 shadow-md flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <FileAudio className="w-3.5 h-3.5" />
                  <span>Word & Media Archive</span>
                </span>
                <BookOpen className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold font-serif text-white mb-2">
                Sermons, Audio, Video & Study Notes
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Stream anointed audio messages, watch video sermons from past convocations, download theological study outlines, or upload new message recordings for the delegates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('sermons')}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Access Sermon Media & Uploads</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4 Core Ministerial Pillars Overview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold text-amber-700 tracking-wider">
            Our Ministerial Commitment
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-1">
            Built for Apostolic Strength & Spiritual Refreshment
          </h2>
          <p className="text-sm text-slate-600 mt-1.5 max-w-2xl mx-auto">
            Supporting pastors, teachers, evangelists, and church leaders at every stage of their divine assignment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <Church className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
              Stay Rooted in the Word
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prophetic impartation, sound New Testament doctrine, and ministerial brotherhood to fortify your spirit in trials.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
              Stay Focused on Purpose
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ministers endurance, divine vision alignment, pastoral care, and fruit fasting consecration.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
              Stay Fired by the Spirit
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Spiritual stamina, apostolic fire, prophetic prayers, and fresh anointing upon your ministerial altar.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
              Stay Faithful in Every Season
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              "Storms don't last. Our calling does." Continuous accreditation, digital certificates, and fellowship support.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Flyer Poster Modal */}
      <FlyerPosterModal
        isOpen={isFlyerModalOpen}
        onClose={() => setIsFlyerModalOpen(false)}
      />
    </div>
  );
};
