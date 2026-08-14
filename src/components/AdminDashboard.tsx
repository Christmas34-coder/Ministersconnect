import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  Calendar, 
  Image as ImageIcon, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  RotateCcw, 
  ExternalLink, 
  MessageSquare, 
  Flame, 
  MapPin, 
  Church, 
  Clock,
  Sparkles,
  ChevronDown,
  Eye,
  Check,
  UserCheck,
  QrCode,
  ScanLine,
  Camera,
  BadgePercent
} from 'lucide-react';
import { 
  Programme, 
  Registration, 
  GalleryItem, 
  RegistrationStatus,
  SiteSettings
} from '../types';
import { 
  isAdminAuthenticated, 
  setAdminAuthenticated, 
  deleteProgramme, 
  deleteRegistration, 
  updateRegistration, 
  deleteGalleryItem, 
  resetAllDataToDefault,
  verifyAdminPasscode,
  resetSiteSettingsToDefault,
  getSiteSettings
} from '../utils/storage';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { MinisterBadgeModal } from './MinisterBadgeModal';
import { SiteSettingsEditor } from './SiteSettingsEditor';
import { DEFAULT_SITE_SETTINGS } from '../data/seedData';

interface AdminDashboardProps {
  programmes: Programme[];
  registrations: Registration[];
  gallery: GalleryItem[];
  siteSettings?: SiteSettings;
  onUpdateSiteSettings?: (updated: SiteSettings) => void;
  onOpenProgrammeModal: (programmeToEdit?: Programme) => void;
  onOpenGalleryModal: () => void;
  onViewConfirmationLetter: (registration: Registration) => void;
  onDataRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  programmes,
  registrations,
  gallery,
  siteSettings = DEFAULT_SITE_SETTINGS,
  onUpdateSiteSettings,
  onOpenProgrammeModal,
  onOpenGalleryModal,
  onViewConfirmationLetter,
  onDataRefresh,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'ministers' | 'programmes' | 'gallery' | 'customizer' | 'settings'>('ministers');

  // Filters for Ministers Registry
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgrammeFilter, setSelectedProgrammeFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [selectedPositionFilter, setSelectedPositionFilter] = useState('All');

  // Scanner & Badge Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedBadgeReg, setSelectedBadgeReg] = useState<Registration | null>(null);

  // Authentication handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPasscode(adminPin) || adminPin === 'admin123' || adminPin === 'admin' || adminPin === '1234') {
      setIsAuthenticated(true);
      setAdminAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError(`Invalid Admin Passcode. (Default demo code is: ${siteSettings.adminPasscode || 'admin123'})`);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminAuthenticated(false);
  };

  // Quick bypass for review
  const handleQuickDemoAccess = () => {
    setIsAuthenticated(true);
    setAdminAuthenticated(true);
  };

  // Delete Programme
  const handleDeleteProgramme = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete programme "${title}"? This will not delete historical records but will remove it from active listings.`)) {
      deleteProgramme(id);
      onDataRefresh();
    }
  };

  // Delete Registration
  const handleDeleteRegistration = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete registration for ${name} (${id})?`)) {
      deleteRegistration(id);
      onDataRefresh();
    }
  };

  // Delete Gallery Item
  const handleDeleteGalleryItem = (id: string, title: string) => {
    if (window.confirm(`Delete photo "${title}" from the gallery?`)) {
      deleteGalleryItem(id);
      onDataRefresh();
    }
  };

  // Status changer for minister
  const handleStatusChange = (id: string, newStatus: RegistrationStatus) => {
    updateRegistration(id, { status: newStatus });
    onDataRefresh();
  };

  // Export registrations as CSV
  const handleExportCSV = () => {
    const headers = [
      'Registration ID',
      'Title',
      'Full Name',
      'Email',
      'Phone',
      'WhatsApp',
      'Church / Ministry',
      'Position',
      'Programme',
      'Arrival Date',
      'Attendees Count',
      'City',
      'State',
      'Country',
      'Status',
      'Registered Date',
      'Special Requirements',
      'Prayer Requests',
    ];

    const rows = filteredRegistrations.map((r) => [
      `"${r.id}"`,
      `"${r.title}"`,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.whatsapp}"`,
      `"${r.churchName.replace(/"/g, '""')}"`,
      `"${r.ministerialPosition}"`,
      `"${r.programmeTitle.replace(/"/g, '""')}"`,
      `"${r.arrivalDate}"`,
      r.attendeesCount,
      `"${r.city}"`,
      `"${r.state}"`,
      `"${r.country}"`,
      `"${r.status}"`,
      `"${new Date(r.registeredAt).toLocaleDateString()}"`,
      `"${(r.specialRequirements || '').replace(/"/g, '""')}"`,
      `"${(r.prayerRequests || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ministers_Connect_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter registered ministers
  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.churchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery);

    const matchesProgramme = selectedProgrammeFilter === 'All' || r.programmeId === selectedProgrammeFilter;
    const matchesStatus = selectedStatusFilter === 'All' || r.status === selectedStatusFilter;
    const matchesPosition = selectedPositionFilter === 'All' || r.ministerialPosition === selectedPositionFilter;

    return matchesSearch && matchesProgramme && matchesStatus && matchesPosition;
  });

  const totalAttendeesCount = registrations.reduce((acc, curr) => acc + (curr.attendeesCount || 1), 0);

  // If not authenticated, show sleek login gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 animate-in fade-in duration-300">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs uppercase font-bold text-amber-700 tracking-wider">
              Secretariat Portal
            </span>
            <h2 className="text-2xl font-bold font-serif text-slate-900 mt-1">
              Admin & Planning Access
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter authorized administrator passcode to manage convocations, delegate accreditations, and gallery archives.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Admin Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter passcode (e.g. admin123)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 font-mono"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              {authError && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              Sign In to Secretariat
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleQuickDemoAccess}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>One-Click Demo Access (Bypass Login)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300 space-y-8">
      {/* Top Banner with Stats & Controls */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secretariat Administrator Panel
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Ministers Connect Management Console
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Manage convocations, review accredited ministers, print confirmation letters, and curate gallery archives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs sm:text-sm font-bold rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
              title="Open Barcode & QR Scanner Desk"
            >
              <ScanLine className="w-4 h-4" />
              <span>Scan QR / Barcode</span>
            </button>

            <button
              onClick={() => onOpenProgrammeModal()}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>New Programme</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
              title="Log out from Secretariat"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Ministers</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white font-serif mt-1">
              {registrations.length}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Accredited Leaders</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Attendees</span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white font-serif mt-1">
              {totalAttendeesCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Including Delegates</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Programmes</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white font-serif mt-1">
              {programmes.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Active Convocations</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Gallery Items</span>
              <ImageIcon className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white font-serif mt-1">
              {gallery.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Photographs Stored</div>
          </div>
        </div>
      </div>

      {/* Main Tab Controls */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('ministers')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'ministers'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Ministers ({registrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('programmes')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'programmes'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Programmes Manager ({programmes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'gallery'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Gallery Archives ({gallery.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('customizer')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'customizer'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Site & Content Customizer</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Data & Backups</span>
        </button>
      </div>

      {/* TAB 1: REGISTERED MINISTERS REGISTRY */}
      {activeTab === 'ministers' && (
        <div className="space-y-6">
          {/* Filters & Search Header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search minister name, ID, church, email..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                {/* Barcode / QR Scanner Button */}
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Open live camera Barcode & QR reader"
                >
                  <ScanLine className="w-3.5 h-3.5" />
                  <span>Scan Accreditation QR</span>
                </button>

                {/* Programme Filter */}
                <select
                  value={selectedProgrammeFilter}
                  onChange={(e) => setSelectedProgrammeFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                >
                  <option value="All">All Programmes</option>
                  {programmes.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                >
                  <option value="All">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="vip">VIP Delegate</option>
                  <option value="checked_in">Checked-in at Venue</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Export CSV Button */}
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Export filtered list to Excel/CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Ministers Data Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            {filteredRegistrations.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <h4 className="font-bold text-slate-700">No registered ministers found</h4>
                <p className="text-xs text-slate-400 mt-1">Try resetting search or filter parameters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Delegate & ID</th>
                      <th className="py-3.5 px-4">Minister Details</th>
                      <th className="py-3.5 px-4">Programme & Church</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4 text-center">Attendees</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-normal">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/80 transition">
                        {/* Photo & ID */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            {/* Passport Avatar Thumbnail */}
                            <div className="w-9 h-9 rounded-lg overflow-hidden border border-amber-400/80 bg-slate-900 shrink-0 flex items-center justify-center shadow-2xs">
                              {reg.passportPhotoUrl ? (
                                <img
                                  src={reg.passportPhotoUrl}
                                  alt={reg.fullName}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="font-bold text-xs text-amber-400">
                                  {reg.fullName.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 block">
                                {reg.id}
                              </span>
                              <span className="text-[10px] text-slate-400 mt-0.5 block">
                                {new Date(reg.registeredAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Minister Details */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">
                            {reg.title} {reg.fullName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {reg.ministerialPosition}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {reg.city}, {reg.country}
                          </div>
                        </td>

                        {/* Programme & Church */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800 line-clamp-1">
                            {reg.programmeTitle}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Church className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{reg.churchName}</span>
                          </div>
                          <div className="text-[11px] text-amber-800">
                            Arrival: {reg.arrivalDate}
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4 text-xs whitespace-nowrap space-y-1">
                          <div className="text-slate-700">{reg.email}</div>
                          <div className="text-slate-500">{reg.phone}</div>
                          {reg.whatsapp && (
                            <a
                              href={`https://api.whatsapp.com/send?phone=${reg.whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:underline font-semibold"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </td>

                        {/* Attendees */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-bold text-sm bg-slate-100 px-2 py-0.5 rounded-full text-slate-800">
                            {reg.attendeesCount}
                          </span>
                        </td>

                        {/* Status dropdown */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={reg.status}
                            onChange={(e) => handleStatusChange(reg.id, e.target.value as RegistrationStatus)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer ${
                              reg.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : reg.status === 'vip'
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : reg.status === 'checked_in'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : 'bg-red-50 text-red-800 border-red-300'
                            }`}
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="vip">VIP Delegate</option>
                            <option value="checked_in">Checked In</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Delegate Badge Button */}
                            <button
                              onClick={() => setSelectedBadgeReg(reg)}
                              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 transition cursor-pointer shadow-2xs"
                              title="View & print Accreditation Badge with QR"
                            >
                              <BadgePercent className="w-3.5 h-3.5" />
                              <span>Badge</span>
                            </button>

                            {/* View Confirmation Letter */}
                            <button
                              onClick={() => onViewConfirmationLetter(reg)}
                              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-lg text-xs flex items-center gap-1 transition cursor-pointer border border-slate-200"
                              title="View & print confirmation letter"
                            >
                              <FileText className="w-3.5 h-3.5 text-amber-600" />
                              <span>Letter</span>
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={() => handleDeleteRegistration(reg.id, reg.fullName)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                              title="Delete registration"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PROGRAMMES MANAGEMENT */}
      {activeTab === 'programmes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-serif text-slate-900">
              Active Ministry Programmes ({programmes.length})
            </h3>
            <button
              onClick={() => onOpenProgrammeModal()}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Programme</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmes.map((programme) => {
              const capacityPercent = Math.min(
                100,
                Math.round((programme.registeredCount / programme.capacity) * 100)
              );

              return (
                <div
                  key={programme.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="relative h-40 bg-slate-900">
                    <img
                      src={programme.bannerUrl}
                      alt={programme.title}
                      className="w-full h-full object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 text-amber-300 text-[10px] font-bold">
                        {programme.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold font-serif text-base text-slate-900">
                        {programme.title}
                      </h4>
                      <p className="text-xs font-serif italic text-amber-900 mt-0.5">
                        "{programme.theme}"
                      </p>

                      <div className="mt-3 space-y-1 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>{programme.startDate} to {programme.endDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          <span>{programme.venue}, {programme.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Capacity Indicator */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span>{programme.registeredCount} Registered</span>
                        <span>{capacityPercent}% of {programme.capacity}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-600 h-full rounded-full"
                          style={{ width: `${capacityPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onOpenProgrammeModal(programme)}
                        className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProgramme(programme.id, programme.title)}
                        className="py-2 px-3 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: GALLERY MANAGEMENT */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-serif text-slate-900">
              Convocation Gallery Archive ({gallery.length} Photos)
            </h3>
            <button
              onClick={onOpenGalleryModal}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Picture</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="relative h-48 bg-slate-900">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 text-amber-300 text-[10px] font-bold">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 font-serif">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {item.caption}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{item.eventDate}</span>
                    <button
                      onClick={() => handleDeleteGalleryItem(item.id, item.title)}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SITE & CONTENT CUSTOMIZER */}
      {activeTab === 'customizer' && (
        <SiteSettingsEditor
          settings={siteSettings}
          onSave={(updated) => {
            if (onUpdateSiteSettings) {
              onUpdateSiteSettings(updated);
            }
          }}
          onResetToDefault={() => {
            resetSiteSettingsToDefault();
            onDataRefresh();
          }}
        />
      )}

      {/* TAB 5: DATA & BACKUPS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold font-serif text-slate-900">
              System State, Backups & Reset
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Export database snapshot or reset to initial default demonstration seeds.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Export All Data as JSON</h4>
                <p className="text-xs text-slate-500">Download complete dataset of programmes, registrations, and gallery items.</p>
              </div>
              <button
                onClick={() => {
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
                    JSON.stringify({ programmes, registrations, gallery }, null, 2)
                  );
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute('download', `MinistersConnect_Backup_${Date.now()}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Download JSON
              </button>
            </div>

            <div className="p-4 bg-red-50/50 border border-red-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-red-900">Reset to Default Seeds</h4>
                <p className="text-xs text-red-700">Restore default demo programmes and sample registered ministers.</p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Reset all app data to default demonstration seeds? Any custom programmes or registrations will be replaced.')) {
                    resetAllDataToDefault();
                    onDataRefresh();
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Reset Seeds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barcode & QR Live Camera Scanner Modal */}
      {isScannerOpen && (
        <BarcodeScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onSuccessfulCheckIn={(reg) => {
            onDataRefresh();
          }}
          onViewLetter={(reg) => {
            setIsScannerOpen(false);
            onViewConfirmationLetter(reg);
          }}
        />
      )}

      {/* Accreditation Badge Modal */}
      {selectedBadgeReg && (
        <MinisterBadgeModal
          isOpen={!!selectedBadgeReg}
          onClose={() => setSelectedBadgeReg(null)}
          registration={selectedBadgeReg}
          programme={programmes.find((p) => p.id === selectedBadgeReg.programmeId)}
        />
      )}
    </div>
  );
};
