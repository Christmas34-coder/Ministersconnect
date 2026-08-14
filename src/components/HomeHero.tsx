import React from 'react';
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
  Globe2, 
  BookOpen, 
  HeartHandshake, 
  CheckCircle2 
} from 'lucide-react';
import { Programme, SiteSettings } from '../types';
import { DEFAULT_SITE_SETTINGS } from '../data/seedData';

interface HomeHeroProps {
  featuredProgramme?: Programme;
  siteSettings?: SiteSettings;
  totalMinistersCount: number;
  totalProgrammesCount: number;
  onNavigate: (tab: 'home' | 'programmes' | 'register' | 'gallery' | 'admin') => void;
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
  return (
    <div className="space-y-16">
      {/* Main Hero Header */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-14 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Dynamic Custom Background Banner Image */}
        {siteSettings.heroBannerImageUrl && (
          <img
            src={siteSettings.heroBannerImageUrl}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Dynamic Dark Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" 
          style={{ opacity: (siteSettings.heroOverlayOpacity ?? 85) / 100 }}
        />

        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-amber-600 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold tracking-wide uppercase shadow-inner">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{siteSettings.heroBadge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight text-white leading-tight max-w-4xl mx-auto">
            {siteSettings.heroHeadline}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              {siteSettings.heroHeadlineHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
            {siteSettings.heroSubtitle}
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <button
              onClick={() => {
                if (featuredProgramme) {
                  onSelectProgrammeForRegister(featuredProgramme.id);
                } else {
                  onNavigate('register');
                }
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <UserCheck className="w-5 h-5" />
              <span>Register for Programme</span>
            </button>

            <button
              onClick={() => onNavigate('programmes')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-white font-semibold text-sm sm:text-base border border-slate-700 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>View All Programmes</span>
            </button>
          </div>

          {/* Quick Lookup Link */}
          <div className="pt-2">
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
            <div className="pt-3 text-xs sm:text-sm text-amber-300/90 italic font-serif max-w-xl mx-auto border-t border-slate-800/60 mt-4">
              "{siteSettings.heroScriptureQuote}"
            </div>
          )}

          {/* Key Metric Highlights Bar */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif">
                {totalMinistersCount > 0 ? `${totalMinistersCount}+` : '500+'}
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
                12+
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Denominations United</div>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Programme Callout Banner */}
      {featuredProgramme && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
          <div className="bg-white border-2 border-amber-500/40 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Image Column */}
            <div className="lg:col-span-5 relative h-56 lg:h-auto min-h-[220px]">
              <img
                src={featuredProgramme.bannerUrl}
                alt={featuredProgramme.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-md">
                  ★ Next Major Convocation
                </span>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-gradient-to-br from-white to-amber-50/30">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                  <span>{featuredProgramme.category}</span>
                  <span>•</span>
                  <span>{featuredProgramme.city}, {featuredProgramme.country}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 leading-snug">
                  {featuredProgramme.title}
                </h3>

                <p className="text-sm font-serif italic text-amber-900 mt-1 font-semibold">
                  Theme: "{featuredProgramme.theme}"
                </p>

                <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {featuredProgramme.description}
                </p>

                {/* Logistics */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>{featuredProgramme.startDate} to {featuredProgramme.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>{featuredProgramme.registeredCount} Ministers Registered</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectProgrammeForRegister(featuredProgramme.id)}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <span>Register for this Convocation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('programmes')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer"
                >
                  View Full Schedule
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4 Core Ministerial Pillars */}
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
              Apostolic Alignment
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prophetic impartation, sound New Testament doctrine, and ministerial brotherhood to fortify your local assembly.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
              Pastoral Care & Health
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Confidential prayer support, burnout prevention clinics, emotional renewal, and family wellness for clergy.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
              Leadership Resources
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Practical church administration models, digital outreach strategies, financial governance, and discipleship modules.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
              Verified Accreditation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unique registration certificates, digital confirmation letters, and seamless accreditation for your entire ministerial team.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
