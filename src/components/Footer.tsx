import React from 'react';
import { Flame, Mail, Phone, MapPin, ShieldCheck, Heart, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { SiteSettings } from '../types';
import { DEFAULT_SITE_SETTINGS } from '../data/seedData';

interface FooterProps {
  onNavigate: (tab: 'home' | 'programmes' | 'register' | 'gallery' | 'admin') => void;
  onOpenLookup: () => void;
  siteSettings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigate, 
  onOpenLookup,
  siteSettings = DEFAULT_SITE_SETTINGS,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 shadow-md">
                <Flame className="w-5 h-5 fill-slate-950" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                {siteSettings.orgName}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {siteSettings.heroSubtitle || 'A sacred convocation and global relational network fostering apostolic alignment, pastoral care, leadership equipping, and unity across the Body of Christ.'}
            </p>
            {siteSettings.heroScriptureQuote && (
              <div className="pt-2 text-xs text-amber-400/90 italic font-serif border-l-2 border-amber-500 pl-3">
                "{siteSettings.heroScriptureQuote}"
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Navigation & Access
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-slate-400 hover:text-amber-400 transition cursor-pointer"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('programmes')}
                  className="text-slate-400 hover:text-amber-400 transition cursor-pointer"
                >
                  Upcoming Programmes & Summits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register')}
                  className="text-slate-400 hover:text-amber-400 transition cursor-pointer font-medium text-amber-300"
                >
                  Programme Delegate Registration
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLookup}
                  className="text-slate-400 hover:text-amber-400 transition cursor-pointer flex items-center gap-1"
                >
                  <span>Find My Confirmation Letter</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="text-slate-400 hover:text-amber-400 transition cursor-pointer"
                >
                  Convocation Gallery & Archives
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-slate-400 hover:text-amber-400 transition cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <span>Admin & Secretariat Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Secretariat & Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Secretariat Desk
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  {siteSettings.headquartersAddress}
                </span>
              </li>
              {siteSettings.supportEmail && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                  <a href={`mailto:${siteSettings.supportEmail}`} className="hover:text-white transition">
                    {siteSettings.supportEmail}
                  </a>
                </li>
              )}
              {siteSettings.supportPhone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{siteSettings.supportPhone}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Delegate Assistance & Rights */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Accreditation Notice & Rights
            </h4>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                {siteSettings.accreditationRightsNotice || 'Every registered minister receives an official Confirmation of Registration Letter with a unique Registration ID for express security and tag issuance at the venue.'}
              </p>
              <button
                onClick={() => onNavigate('register')}
                className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition shadow cursor-pointer text-center"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{siteSettings.copyrightNotice || `© ${new Date().getFullYear()} Ministers Connect Global. All rights reserved.`}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Dedicated to Kingdom Unity <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            </span>
            <span>•</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
            >
              Secretariat Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

