import React, { useState } from 'react';
import { 
  Flame, 
  Calendar, 
  UserCheck, 
  Image as ImageIcon, 
  ShieldCheck, 
  Search, 
  Menu, 
  X, 
  Sparkles,
  PhoneCall,
  Megaphone,
  ArrowRight
} from 'lucide-react';
import { SiteSettings } from '../types';
import { DEFAULT_SITE_SETTINGS } from '../data/seedData';

interface NavbarProps {
  activeTab: 'home' | 'programmes' | 'register' | 'gallery' | 'admin';
  setActiveTab: (tab: 'home' | 'programmes' | 'register' | 'gallery' | 'admin') => void;
  onOpenLookup: () => void;
  selectedProgrammeId?: string | null;
  registrationsCount: number;
  siteSettings?: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLookup,
  registrationsCount,
  siteSettings = DEFAULT_SITE_SETTINGS,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  interface NavItem {
    id: 'home' | 'programmes' | 'register' | 'gallery' | 'admin';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    highlight?: boolean;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Flame },
    { id: 'programmes', label: 'Programmes', icon: Calendar },
    { id: 'register', label: 'Register', icon: UserCheck, highlight: true },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Broadcast Announcement Alert Bar (if active) */}
      {siteSettings.announcementActive && siteSettings.announcementText && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 text-xs py-2 px-4 font-bold flex items-center justify-between shadow-xs">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <Megaphone className="w-3.5 h-3.5 shrink-0 animate-bounce" />
              <span className="truncate">{siteSettings.announcementText}</span>
            </div>

            {siteSettings.announcementLinkText && (
              <button
                onClick={() => {
                  if (siteSettings.announcementLinkTab) {
                    setActiveTab(siteSettings.announcementLinkTab);
                  } else {
                    setActiveTab('register');
                  }
                }}
                className="shrink-0 text-[11px] uppercase tracking-wider bg-slate-950 hover:bg-slate-900 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 transition cursor-pointer shadow-2xs"
              >
                <span>{siteSettings.announcementLinkText}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Ministerial Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-amber-400 font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            {siteSettings.orgName}
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-400">
            {siteSettings.heroScriptureRef || '"That they all may be one" (John 17:21)'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenLookup}
            className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 font-medium transition cursor-pointer"
          >
            <Search className="w-3 h-3" />
            <span>Find My Registration</span>
          </button>
          {siteSettings.supportPhone && (
            <a
              href={`tel:${siteSettings.supportPhone.split('/')[0].trim()}`}
              className="hidden sm:flex items-center gap-1 text-slate-400 hover:text-white transition"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Secretariat Hotline</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-serif">
                  {siteSettings.orgName.split(' ')[0] || 'Ministers'} {siteSettings.orgName.split(' ')[1] || 'Connect'}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-amber-100 text-amber-900 border border-amber-300/60">
                  {siteSettings.orgShortCode || 'Global'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-tight truncate max-w-[200px] sm:max-w-xs">
                {siteSettings.orgTagline || 'Fellowship • Programmes • Accreditation'}
              </p>
            </div>
          </div>


          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`ml-2 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                      isActive
                        ? 'bg-amber-600 text-white ring-2 ring-amber-500/50 shadow-amber-600/20'
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-white shadow-amber-500/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-amber-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'admin' && registrationsCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[11px] font-semibold">
                      {registrationsCount}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Find letter quick trigger */}
            <button
              onClick={onOpenLookup}
              className="ml-1 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Search Registration / Letter"
            >
              <Search className="w-4 h-4" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenLookup}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Find Registration"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1.5 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-base font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-50 text-amber-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'register' && (
                  <span className="px-2 py-0.5 text-xs bg-amber-500 text-slate-950 rounded-full font-bold">
                    Join
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 mt-2">
            <button
              onClick={() => {
                onOpenLookup();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 text-sm hover:bg-slate-50 rounded-xl"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Verify & Download Registration Letter</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
