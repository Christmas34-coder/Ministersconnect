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
  Megaphone,
  ArrowRight,
  Users,
  BookOpen,
  LogIn,
  LogOut,
  BadgePercent,
  Download,
  UserPlus,
} from 'lucide-react';
import { SiteSettings, MemberUser } from '../types';
import { DEFAULT_SITE_SETTINGS } from '../data/seedData';

export type AppTab =
  | 'home'
  | 'programmes'
  | 'register'
  | 'leaders'
  | 'sermons'
  | 'gallery'
  | 'admin';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onOpenLookup: () => void;
  onOpenBadgeLookup?: (defaultQuery?: string) => void;
  selectedProgrammeId?: string | null;
  registrationsCount: number;
  siteSettings?: SiteSettings;
  currentMember?: MemberUser | null;
  onOpenMemberAuth: (initialMode?: 'signin' | 'signup') => void;
  onMemberLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLookup,
  onOpenBadgeLookup,
  registrationsCount,
  siteSettings = DEFAULT_SITE_SETTINGS,
  currentMember,
  onOpenMemberAuth,
  onMemberLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  interface NavItem {
    id: AppTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    highlight?: boolean;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Flame },
    { id: 'programmes', label: 'Programmes', icon: Calendar },
    { id: 'register', label: 'Register', icon: UserCheck, highlight: true },
    { id: 'leaders', label: 'Leaders', icon: Users },
    { id: 'sermons', label: 'Word & Media', icon: BookOpen },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Broadcast Announcement Alert Bar (if active) */}
      {siteSettings.announcementActive && siteSettings.announcementText && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 text-xs py-2 px-4 font-bold flex items-center justify-between shadow-xs">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <Megaphone className="w-3.5 h-3.5 shrink-0 text-slate-950" />
              <span className="truncate">{siteSettings.announcementText}</span>
            </div>
            {siteSettings.announcementLinkText && (
              <button
                type="button"
                onClick={() => {
                  if (siteSettings.announcementLinkTab) {
                    setActiveTab(siteSettings.announcementLinkTab as AppTab);
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

      {/* Top Ministerial Info Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2 truncate">
          <span className="inline-flex items-center gap-1 text-amber-400 font-medium tracking-wide">
            <Sparkles className="w-3 h-3" /> {siteSettings.orgName}
          </span>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline text-slate-400 truncate">
            {siteSettings.heroScriptureRef || '"That they all may be one" (John 17:21)'}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (onOpenBadgeLookup) {
                onOpenBadgeLookup();
              } else {
                onOpenLookup();
              }
            }}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold transition cursor-pointer text-[11px] border border-amber-500/40"
            title="Download your Minister Accreditation Badge"
          >
            <BadgePercent className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">Download</span> Badge
          </button>

          <button
            type="button"
            onClick={onOpenLookup}
            className="hidden sm:flex items-center gap-1 text-slate-300 hover:text-amber-400 font-medium transition cursor-pointer text-[11px]"
          >
            <Search className="w-3 h-3" />
            <span>Find Registration</span>
          </button>

          {/* Member Auth Header Buttons */}
          {currentMember ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition text-[11px] font-bold cursor-pointer border border-slate-700 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="truncate max-w-[120px]">
                  {currentMember.title} {currentMember.fullName.split(' ')[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-60 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-2 z-50 text-slate-200">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="font-bold text-xs text-white truncate">
                      {currentMember.title} {currentMember.fullName}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{currentMember.email}</p>
                    <p className="text-[10px] text-amber-400 font-medium truncate mt-0.5">
                      {currentMember.churchName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onOpenBadgeLookup) {
                        onOpenBadgeLookup(currentMember.email);
                      } else {
                        onOpenLookup();
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-amber-300 hover:bg-slate-800 rounded-xl flex items-center gap-2 cursor-pointer transition font-bold"
                  >
                    <BadgePercent className="w-3.5 h-3.5 text-amber-400" />
                    <span>Accreditation Badge</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setActiveTab('register');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded-xl flex items-center gap-2 cursor-pointer transition"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Register for Programme</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setActiveTab('leaders');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded-xl flex items-center gap-2 cursor-pointer transition"
                  >
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>Church Leaders Segment</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onMemberLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-950/40 rounded-xl flex items-center gap-2 mt-1 border-t border-slate-800 cursor-pointer transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenMemberAuth('signup')}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition cursor-pointer text-[11px] shadow-2xs"
              >
                <UserPlus className="w-3 h-3" />
                <span>Sign Up</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenMemberAuth('signin')}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold transition cursor-pointer text-[11px] border border-slate-700"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Flame className="w-4.5 h-4.5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-serif">
                  {siteSettings.orgName.split(' ')[0] || 'Ministers'}{' '}
                  {siteSettings.orgName.split(' ')[1] || 'Connect'}
                </span>
                <span className="px-1.5 py-0.2 text-[9px] uppercase font-bold tracking-wider rounded bg-amber-100 text-amber-900 border border-amber-300/60">
                  {siteSettings.orgShortCode || 'Global'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight truncate max-w-[170px] sm:max-w-xs leading-none">
                {siteSettings.orgTagline || 'Fellowship • Programmes • Leaders Directory'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`ml-1 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      isActive
                        ? 'bg-amber-600 text-white ring-2 ring-amber-500/50'
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-amber-700 font-bold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'admin' && registrationsCount > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px] font-bold">
                      {registrationsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile & Tablet Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setActiveTab('register')}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg shadow-xs transition"
            >
              Register
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-3 pt-2 pb-4 space-y-1 shadow-2xl text-slate-200">
          {/* Member status on mobile */}
          {currentMember ? (
            <div className="p-2.5 bg-slate-800/90 rounded-xl mb-2 flex items-center justify-between border border-slate-700/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate">
                    {currentMember.title} {currentMember.fullName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{currentMember.churchName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onMemberLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-semibold text-red-400 hover:text-red-300 ml-2 shrink-0 bg-red-950/40 px-2 py-1 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={() => {
                  onOpenMemberAuth('signup');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up (New)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenMemberAuth('signin');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign In</span>
              </button>
            </div>
          )}

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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'register' && (
                  <span className="px-2 py-0.5 text-[9px] bg-amber-500 text-slate-950 rounded-md font-bold">
                    Join
                  </span>
                )}
                {item.id === 'admin' && registrationsCount > 0 && (
                  <span className="px-2 py-0.5 bg-slate-800 text-amber-400 rounded-md text-[9px] font-bold border border-slate-700">
                    {registrationsCount}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800 mt-2 space-y-1.5">
            <button
              onClick={() => {
                if (onOpenBadgeLookup) {
                  onOpenBadgeLookup();
                } else {
                  onOpenLookup();
                }
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-amber-300 hover:text-amber-200 text-xs hover:bg-slate-800 rounded-xl transition font-bold bg-amber-500/10 border border-amber-500/20"
            >
              <BadgePercent className="w-4 h-4 text-amber-400" />
              <span>Download Minister Accreditation Badge</span>
            </button>

            <button
              onClick={() => {
                onOpenLookup();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-amber-300 text-xs hover:bg-slate-800 rounded-xl transition"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Verify & Download Registration Letter</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
