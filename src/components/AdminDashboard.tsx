import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Users,
  Calendar,
  Image as ImageIcon,
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  FileText,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RotateCcw,
  MessageSquare,
  Church,
  Sparkles,
  Eye,
  EyeOff,
  UserCheck,
  ScanLine,
  BadgePercent,
  Copy,
  LayoutGrid,
  Table as TableIcon,
  Shield,
  UserCog,
  Star,
  RefreshCw,
} from 'lucide-react';
import {
  Programme,
  Registration,
  GalleryItem,
  RegistrationStatus,
  SiteSettings,
  AdminUser,
  ChurchLeader,
} from '../types';
import {
  isAdminAuthenticated,
  setAdminAuthenticated,
  deleteProgramme,
  deleteRegistration,
  updateRegistration,
  deleteGalleryItem,
  deleteChurchLeader,
  updateChurchLeader,
  resetAllDataToDefault,
  resetSiteSettingsToDefault,
  getCurrentAdmin,
  authenticateAdmin,
  addProgramme,
} from '../utils/storage';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { MinisterBadgeModal } from './MinisterBadgeModal';
import { SiteSettingsEditor } from './SiteSettingsEditor';
import { MinisterEditModal } from './MinisterEditModal';
import { AdminTeamManager } from './AdminTeamManager';
import { DEFAULT_SITE_SETTINGS, INITIAL_ADMINS } from '../data/seedData';

interface AdminDashboardProps {
  programmes: Programme[];
  registrations: Registration[];
  gallery: GalleryItem[];
  churchLeaders?: ChurchLeader[];
  siteSettings?: SiteSettings;
  onUpdateSiteSettings?: (updated: SiteSettings) => void;
  onOpenProgrammeModal: (programmeToEdit?: Programme) => void;
  onOpenGalleryModal: (itemToEdit?: GalleryItem) => void;
  onViewConfirmationLetter: (registration: Registration) => void;
  onDataRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  programmes,
  registrations,
  gallery,
  churchLeaders = [],
  siteSettings = DEFAULT_SITE_SETTINGS,
  onUpdateSiteSettings,
  onOpenProgrammeModal,
  onOpenGalleryModal,
  onViewConfirmationLetter,
  onDataRefresh,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());
  const [currentAdmin, setCurrentAdminState] = useState<AdminUser | null>(
    getCurrentAdmin() || (isAdminAuthenticated() ? INITIAL_ADMINS[0] : null)
  );

  // Login Form State
  const [adminEmail, setAdminEmail] = useState('asamuelbukunmi@gmail.com');
  const [adminPin, setAdminPin] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'ministers' | 'leaders' | 'programmes' | 'team' | 'gallery' | 'customizer' | 'settings'
  >('ministers');

  // Selected registered ministers for bulk operations
  const [selectedRegIds, setSelectedRegIds] = useState<string[]>([]);

  // Presbytery Leaders Search
  const [leaderSearch, setLeaderSearch] = useState('');

  // Admin Delete Confirmation Modal State
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'registration' | 'leader' | 'bulk_registrations';
    id?: string;
    ids?: string[];
    name: string;
    details?: string;
    churchName?: string;
    photoUrl?: string;
  } | null>(null);

  // Programme Manager View Mode
  const [programmeViewMode, setProgrammeViewMode] = useState<'table' | 'grid'>('table');
  const [programmeSearch, setProgrammeSearch] = useState('');
  const [programmeCategoryFilter, setProgrammeCategoryFilter] = useState('All');

  // Filters for Ministers Registry
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgrammeFilter, setSelectedProgrammeFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [selectedPositionFilter, setSelectedPositionFilter] = useState('All');

  // Filters for Gallery Archives
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('All');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(
    null
  );

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedBadgeReg, setSelectedBadgeReg] = useState<Registration | null>(null);
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      const logged = getCurrentAdmin();
      setCurrentAdminState(logged || INITIAL_ADMINS[0]);
    }
  }, [isAuthenticated]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Authentication handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const result = authenticateAdmin(adminEmail, adminPin);
    if (result.success && result.admin) {
      setIsAuthenticated(true);
      setCurrentAdminState(result.admin);
      setAuthError('');
      showToast(`Welcome back, ${result.admin.name}!`);
    } else {
      setAuthError(result.error || 'Invalid credentials. Please verify your email and passcode.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminAuthenticated(false);
    setCurrentAdminState(null);
  };

  // Quick bypass for owner
  const handleQuickOwnerAccess = () => {
    const owner = INITIAL_ADMINS[0];
    const result = authenticateAdmin(owner.email, 'admin123');
    if (result.success && result.admin) {
      setIsAuthenticated(true);
      setCurrentAdminState(result.admin);
      showToast(`Signed in as Master Administrator (${owner.email})`);
    }
  };

  // Status changer for minister with instant feedback
  const handleStatusChange = (id: string, newStatus: RegistrationStatus) => {
    const updated = updateRegistration(id, { status: newStatus });
    if (updated) {
      showToast(`Updated status for ${updated.fullName} to "${newStatus.toUpperCase()}".`);
      onDataRefresh();
    }
  };

  // Save edited minister from modal
  const handleSaveMinisterEdit = (updatedReg: Registration) => {
    updateRegistration(updatedReg.id, updatedReg);
    showToast(`Updated credentials and details for ${updatedReg.fullName}.`);
    onDataRefresh();
  };

  // Delete Programme
  const handleDeleteProgramme = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete programme "${title}"? This will remove it from active listings.`)) {
      deleteProgramme(id);
      showToast(`Programme "${title}" deleted.`);
      onDataRefresh();
    }
  };

  // Duplicate Programme
  const handleDuplicateProgramme = (programme: Programme) => {
    const { id: _id, registeredCount: _regCount, ...rest } = programme;
    const duplicatedData: Omit<Programme, 'id' | 'registeredCount'> = {
      ...rest,
      title: `${programme.title} (Copy)`,
      status: 'upcoming',
    };
    const created = addProgramme(duplicatedData);
    showToast(`Created duplicate programme "${created.title}".`);
    onDataRefresh();
  };

  // Trigger Admin Delete Confirmation Modal for Single Minister
  const handleOpenDeleteMinister = (reg: Registration) => {
    setDeleteModalState({
      isOpen: true,
      type: 'registration',
      id: reg.id,
      name: `${reg.title} ${reg.fullName}`,
      churchName: reg.churchName,
      details: `ID: ${reg.id} • Programme: ${reg.programmeTitle} • Registered: ${new Date(reg.registeredAt).toLocaleDateString()}`,
      photoUrl: reg.passportPhotoUrl,
    });
  };

  // Trigger Admin Delete Confirmation Modal for Bulk Selection
  const handleOpenBulkDelete = () => {
    if (selectedRegIds.length === 0) return;
    setDeleteModalState({
      isOpen: true,
      type: 'bulk_registrations',
      ids: [...selectedRegIds],
      name: `${selectedRegIds.length} Selected Ministers / Delegates`,
      details: `Registration IDs: ${selectedRegIds.slice(0, 5).join(', ')}${selectedRegIds.length > 5 ? ` +${selectedRegIds.length - 5} more` : ''}`,
    });
  };

  // Trigger Admin Delete Confirmation Modal for Church Leader
  const handleOpenDeleteLeader = (leader: ChurchLeader) => {
    setDeleteModalState({
      isOpen: true,
      type: 'leader',
      id: leader.id,
      name: `${leader.title} ${leader.fullName}`,
      churchName: leader.churchName,
      details: `${leader.keyPosition} • ${leader.city}, ${leader.country}`,
      photoUrl: leader.photoUrl,
    });
  };

  // Execute deletion upon admin modal confirmation
  const handleExecuteDelete = () => {
    if (!deleteModalState) return;

    if (deleteModalState.type === 'registration' && deleteModalState.id) {
      deleteRegistration(deleteModalState.id);
      setSelectedRegIds((prev) => prev.filter((id) => id !== deleteModalState.id));
      showToast(`Accredited registration for ${deleteModalState.name} deleted permanently.`);
      onDataRefresh();
    } else if (deleteModalState.type === 'bulk_registrations' && deleteModalState.ids) {
      const count = deleteModalState.ids.length;
      deleteModalState.ids.forEach((id) => deleteRegistration(id));
      setSelectedRegIds([]);
      showToast(`Successfully deleted ${count} registered ministers.`);
      onDataRefresh();
    } else if (deleteModalState.type === 'leader' && deleteModalState.id) {
      deleteChurchLeader(deleteModalState.id);
      showToast(`Church leader profile for ${deleteModalState.name} deleted.`);
      onDataRefresh();
    }

    setDeleteModalState(null);
  };

  // Toggle leader verification status
  const handleToggleLeaderVerification = (leader: ChurchLeader) => {
    const updated = updateChurchLeader(leader.id, { isVerified: !leader.isVerified });
    if (updated) {
      showToast(`Leader ${leader.fullName} verification ${updated.isVerified ? 'enabled' : 'revoked'}.`);
      onDataRefresh();
    }
  };

  // Delete Registration fallback
  const handleDeleteRegistration = (id: string, name: string) => {
    const reg = registrations.find((r) => r.id === id);
    if (reg) {
      handleOpenDeleteMinister(reg);
    } else {
      deleteRegistration(id);
      showToast(`Registration for ${name} deleted.`);
      onDataRefresh();
    }
  };

  // Delete Gallery Item
  const handleDeleteGalleryItem = (id: string, title: string) => {
    if (window.confirm(`Delete photo "${title}" from the gallery?`)) {
      deleteGalleryItem(id);
      showToast(`Gallery photo "${title}" deleted.`);
      onDataRefresh();
    }
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
      `"${r.whatsapp || ''}"`,
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

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Ministers_Connect_Registrations_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported filtered registrations to CSV file.');
  };

  // Filter registered ministers
  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.churchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery);

    const matchesProgramme =
      selectedProgrammeFilter === 'All' || r.programmeId === selectedProgrammeFilter;
    const matchesStatus =
      selectedStatusFilter === 'All' || r.status === selectedStatusFilter;
    const matchesPosition =
      selectedPositionFilter === 'All' || r.ministerialPosition === selectedPositionFilter;

    return matchesSearch && matchesProgramme && matchesStatus && matchesPosition;
  });

  // Filter programmes
  const filteredProgrammes = programmes.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(programmeSearch.toLowerCase()) ||
      p.theme.toLowerCase().includes(programmeSearch.toLowerCase()) ||
      p.venue.toLowerCase().includes(programmeSearch.toLowerCase()) ||
      p.city.toLowerCase().includes(programmeSearch.toLowerCase());

    const matchesCategory =
      programmeCategoryFilter === 'All' || p.category === programmeCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Filter church leaders
  const filteredLeaders = churchLeaders.filter((l) => {
    const q = leaderSearch.toLowerCase();
    return (
      !leaderSearch ||
      l.fullName.toLowerCase().includes(q) ||
      l.churchName.toLowerCase().includes(q) ||
      l.keyPosition.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.country.toLowerCase().includes(q) ||
      (l.denomination || '').toLowerCase().includes(q)
    );
  });

  // Selection toggle helpers
  const handleToggleSelectAll = () => {
    if (selectedRegIds.length === filteredRegistrations.length) {
      setSelectedRegIds([]);
    } else {
      setSelectedRegIds(filteredRegistrations.map((r) => r.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedRegIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalAttendeesCount = registrations.reduce(
    (acc, curr) => acc + (curr.attendeesCount || 1),
    0
  );

  // If not authenticated, show secure login gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner border border-amber-200">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs uppercase font-bold text-amber-700 tracking-wider">
              Secretariat Portal Access
            </span>
            <h2 className="text-2xl font-bold font-serif text-slate-900 mt-1">
              Admin & Planning Console
            </h2>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Restricted portal for authorized Secretariat officers and Super Admin to manage
              programmes, delegate accreditations, content customizer, and admin accounts.
            </p>
          </div>

          {/* Master Owner Notice */}
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-left text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-slate-900">
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span>Primary Master Account</span>
            </div>
            <p className="text-slate-600">
              Assigned to:{' '}
              <strong className="text-slate-900 font-mono">asamuelbukunmi@gmail.com</strong>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="e.g. asamuelbukunmi@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Security Passcode / Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter passcode (default: admin123)"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In to Secretariat Portal</span>
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleQuickOwnerAccess}
              className="text-xs text-amber-700 hover:text-amber-800 font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer py-2 px-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition border border-amber-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>One-Click Super Admin Access (asamuelbukunmi@gmail.com)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-4 sm:right-8 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 ${
            toastMessage.type === 'success'
              ? 'bg-slate-900 text-white border-slate-700'
              : 'bg-red-900 text-white border-red-700'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Top Banner with Stats & Controls */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> Secretariat Admin Console
              </div>
              {currentAdmin && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs border border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-semibold text-white">{currentAdmin.name}</span>
                  <span className="text-[10px] text-amber-400 uppercase font-mono">
                    ({currentAdmin.role.replace('_', ' ')})
                  </span>
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Ministers Connect Management Portal
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Live registration desk, programme scheduler, accreditation badges, site customizer, and admin team governance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs sm:text-sm font-bold rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
              title="Open Barcode & QR Scanner Desk"
            >
              <ScanLine className="w-4 h-4" />
              <span>Scan QR / Barcode</span>
            </button>

            <button
              onClick={() => onOpenProgrammeModal()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>New Programme</span>
            </button>

            <button
              onClick={onDataRefresh}
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-slate-800 hover:bg-red-900/60 border border-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer text-xs font-semibold flex items-center gap-1.5"
              title="Log out from Secretariat"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
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
            <div className="text-[10px] text-slate-400 mt-0.5">Programmes Listed</div>
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

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('ministers')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'ministers'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Ministers ({registrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leaders')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'leaders'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Church className="w-4 h-4 text-amber-500" />
          <span>Presbytery Leaders ({churchLeaders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('programmes')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'programmes'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Programme Manager ({programmes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'team'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <UserCog className="w-4 h-4 text-amber-500" />
          <span>Admin Team & Roles</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
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
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
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
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Data Backups</span>
        </button>
      </div>

      {/* TAB 1: REGISTERED MINISTERS REGISTRY */}
      {activeTab === 'ministers' && (
        <div className="space-y-6">
          {/* Filters & Search Header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by Minister name, church, phone, email, registration ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
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

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Filter by Programme
                </label>
                <select
                  value={selectedProgrammeFilter}
                  onChange={(e) => setSelectedProgrammeFilter(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="All">All Programmes ({registrations.length})</option>
                  {programmes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Filter by Status
                </label>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="All">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="vip">VIP Delegates</option>
                  <option value="checked_in">Checked In</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Filter by Position
                </label>
                <select
                  value={selectedPositionFilter}
                  onChange={(e) => setSelectedPositionFilter(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="All">All Ministerial Positions</option>
                  <option value="Senior Pastor / General Overseer">Senior Pastor / General Overseer</option>
                  <option value="Associate / Resident Pastor">Associate / Resident Pastor</option>
                  <option value="Youth / Campus Pastor">Youth / Campus Pastor</option>
                  <option value="Music / Worship Director">Music / Worship Director</option>
                  <option value="Evangelist / Outreach Director">Evangelist / Outreach Director</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ministers Data Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">
                  Showing {filteredRegistrations.length} of {registrations.length} delegate records
                </span>
                {selectedRegIds.length > 0 && (
                  <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                    {selectedRegIds.length} selected
                  </span>
                )}
              </div>

              {/* Admin Bulk Actions */}
              {selectedRegIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenBulkDelete}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Delete all selected registered ministers permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected ({selectedRegIds.length})</span>
                  </button>
                  <button
                    onClick={() => setSelectedRegIds([])}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              )}

              <span className="text-[11px] text-amber-700 font-medium">
                Tip: Click any row or the Edit button to update minister data
              </span>
            </div>

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
                      <th className="py-3.5 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            filteredRegistrations.length > 0 &&
                            selectedRegIds.length === filteredRegistrations.length
                          }
                          onChange={handleToggleSelectAll}
                          className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                          title="Select / Deselect all"
                        />
                      </th>
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
                      <tr
                        key={reg.id}
                        className={`hover:bg-amber-50/40 transition cursor-pointer ${
                          selectedRegIds.includes(reg.id) ? 'bg-amber-50/60' : ''
                        }`}
                        onClick={() => setEditingRegistration(reg)}
                      >
                        {/* Select Checkbox */}
                        <td
                          className="py-3.5 px-3 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selectedRegIds.includes(reg.id)}
                            onChange={() => handleToggleSelectOne(reg.id)}
                            className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                          />
                        </td>

                        {/* Photo & ID */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
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
                        <td
                          className="py-3.5 px-4 text-xs whitespace-nowrap space-y-1"
                          onClick={(e) => e.stopPropagation()}
                        >
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
                        <td
                          className="py-3.5 px-4 whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={reg.status}
                            onChange={(e) =>
                              handleStatusChange(reg.id, e.target.value as RegistrationStatus)
                            }
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
                        <td
                          className="py-3.5 px-4 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit Button */}
                            <button
                              onClick={() => setEditingRegistration(reg)}
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-lg text-xs flex items-center gap-1 transition cursor-pointer shadow-2xs"
                              title="Edit full registration details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            {/* Delegate Badge Button */}
                            <button
                              onClick={() => setSelectedBadgeReg(reg)}
                              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition cursor-pointer shadow-2xs"
                              title="View & print Accreditation Badge with QR"
                            >
                              <BadgePercent className="w-3.5 h-3.5 text-amber-400" />
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

                            {/* Admin Delete button */}
                            <button
                              onClick={() => handleOpenDeleteMinister(reg)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                              title="Delete registered member (Admin Only)"
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

      {/* TAB: PRESBYTERY CHURCH LEADERS DIRECTORY & MANAGEMENT */}
      {activeTab === 'leaders' && (
        <div className="space-y-6">
          {/* Header & Controls */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search leaders by name, church ministry, key calling, city, or country..."
                value={leaderSearch}
                onChange={(e) => setLeaderSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                Total Leaders: {churchLeaders.length}
              </span>
            </div>
          </div>

          {/* Leaders Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                Showing {filteredLeaders.length} of {churchLeaders.length} registered church leaders
              </span>
              <span className="text-[11px] text-amber-700 font-medium">
                Admin controls: Toggle accredited verification or delete leader profiles
              </span>
            </div>

            {filteredLeaders.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Church className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <h4 className="font-bold text-slate-700">No church leaders found</h4>
                <p className="text-xs text-slate-400 mt-1">Try resetting your search query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Leader Profile</th>
                      <th className="py-3.5 px-4">Ministry & Church</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4 text-center">Tenure / Calling</th>
                      <th className="py-3.5 px-4 text-center">Accreditation</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-normal">
                    {filteredLeaders.map((leader) => (
                      <tr key={leader.id} className="hover:bg-amber-50/40 transition">
                        {/* Leader Profile */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-amber-400/80 shrink-0">
                              {leader.photoUrl ? (
                                <img
                                  src={leader.photoUrl}
                                  alt={leader.fullName}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-amber-400">
                                  {leader.fullName.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>
                                  {leader.title} {leader.fullName}
                                </span>
                                {leader.isVerified && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                )}
                              </div>
                              <div className="text-xs text-amber-800 font-medium">
                                {leader.keyPosition}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Ministry & Church */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{leader.churchName}</div>
                          {leader.denomination && (
                            <div className="text-xs text-slate-500">{leader.denomination}</div>
                          )}
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 font-medium">{leader.city}</div>
                          <div className="text-xs text-slate-500">{leader.country}</div>
                        </td>

                        {/* Tenure */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-full text-slate-700">
                            {leader.yearsInMinistry} yrs in Ministry
                          </span>
                        </td>

                        {/* Verification toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleToggleLeaderVerification(leader)}
                            className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer border ${
                              leader.isVerified
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {leader.isVerified ? 'Verified Leader' : 'Unverified'}
                          </button>
                        </td>

                        {/* Admin Delete Action */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleOpenDeleteLeader(leader)}
                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-lg text-xs flex items-center gap-1 transition cursor-pointer ml-auto"
                            title="Delete church leader profile (Admin Only)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
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
          {/* Header & Controls */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search programmes by title, theme, city, venue..."
                  value={programmeSearch}
                  onChange={(e) => setProgrammeSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <select
                value={programmeCategoryFilter}
                onChange={(e) => setProgrammeCategoryFilter(e.target.value)}
                className="text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="All">All Categories</option>
                <option value="Conferences">Conferences</option>
                <option value="Leadership Summits">Leadership Summits</option>
                <option value="Ministers Retreats">Ministers Retreats</option>
                <option value="Pastoral Workshops">Pastoral Workshops</option>
                <option value="Worship Conclaves">Worship Conclaves</option>
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* View Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setProgrammeViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                    programmeViewMode === 'table'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Table View"
                >
                  <TableIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Table</span>
                </button>
                <button
                  onClick={() => setProgrammeViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                    programmeViewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Grid Cards View"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Cards</span>
                </button>
              </div>

              <button
                onClick={() => onOpenProgrammeModal()}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create Programme</span>
              </button>
            </div>
          </div>

          {/* TABLE VIEW */}
          {programmeViewMode === 'table' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Showing {filteredProgrammes.length} of {programmes.length} programmes
                </span>
                <span className="text-[11px] text-amber-700 font-medium">
                  Click Edit or any row to update programme content and dates
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Banner & Title</th>
                      <th className="py-3.5 px-4">Category & Theme</th>
                      <th className="py-3.5 px-4">Dates & Time</th>
                      <th className="py-3.5 px-4">Venue & City</th>
                      <th className="py-3.5 px-4">Capacity & Registrations</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProgrammes.map((p) => {
                      const capacityPercent = Math.min(
                        100,
                        Math.round((p.registeredCount / p.capacity) * 100)
                      );
                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-amber-50/40 transition cursor-pointer"
                          onClick={() => onOpenProgrammeModal(p)}
                        >
                          {/* Banner & Title */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                                <img
                                  src={p.bannerUrl}
                                  alt={p.title}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 font-serif flex items-center gap-1.5">
                                  <span>{p.title}</span>
                                  {p.isFeatured && (
                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ID: {p.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category & Theme */}
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold inline-block mb-1">
                              {p.category}
                            </span>
                            <div className="text-xs text-amber-900 italic line-clamp-1">
                              "{p.theme}"
                            </div>
                          </td>

                          {/* Dates */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-medium text-slate-900">
                              {p.startDate} to {p.endDate}
                            </div>
                            <div className="text-xs text-slate-500">{p.time}</div>
                          </td>

                          {/* Venue */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800 line-clamp-1">{p.venue}</div>
                            <div className="text-xs text-slate-400">
                              {p.city}, {p.country}
                            </div>
                          </td>

                          {/* Capacity */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-slate-900">{p.registeredCount}</span>
                              <span className="text-slate-400">
                                / {p.capacity} ({capacityPercent}%)
                              </span>
                            </div>
                            <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-amber-600 h-full rounded-full"
                                style={{ width: `${capacityPercent}%` }}
                              />
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                p.status === 'upcoming'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : p.status === 'ongoing'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : p.status === 'completed'
                                  ? 'bg-slate-100 text-slate-800 border-slate-300'
                                  : 'bg-red-50 text-red-800 border-red-300'
                              }`}
                            >
                              {p.status.toUpperCase()}
                            </span>
                          </td>

                          {/* Actions */}
                          <td
                            className="py-3.5 px-4 text-right whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onOpenProgrammeModal(p)}
                                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-lg text-xs flex items-center gap-1 transition cursor-pointer"
                                title="Edit programme details"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDuplicateProgramme(p)}
                                className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition cursor-pointer"
                                title="Duplicate programme"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProgramme(p.id, p.title)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                title="Delete programme"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GRID VIEW */}
          {programmeViewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProgrammes.map((programme) => {
                const capacityPercent = Math.min(
                  100,
                  Math.round((programme.registeredCount / programme.capacity) * 100)
                );
                return (
                  <div
                    key={programme.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition"
                  >
                    <div className="relative h-44 bg-slate-900">
                      <img
                        src={programme.bannerUrl}
                        alt={programme.title}
                        className="w-full h-full object-cover opacity-85"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 text-amber-300 text-[10px] font-bold">
                          {programme.category}
                        </span>
                        {programme.isFeatured && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-slate-950" /> Featured
                          </span>
                        )}
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
                            <span>
                              {programme.startDate} to {programme.endDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            <span>
                              {programme.venue}, {programme.city}
                            </span>
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
                          className="flex-1 py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit Programme</span>
                        </button>
                        <button
                          onClick={() => handleDuplicateProgramme(programme)}
                          className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold transition"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProgramme(programme.id, programme.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition flex items-center justify-center cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ADMIN TEAM & ROLES */}
      {activeTab === 'team' && (
        <AdminTeamManager
          currentLoggedInAdmin={currentAdmin}
          onAdminsUpdated={onDataRefresh}
        />
      )}

      {/* TAB 4: GALLERY MANAGEMENT */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-600" />
                <span>Programme Gallery Archive ({gallery.length} Photos)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload new photos or edit existing archive entries (both pictures and textual descriptions).
              </p>
            </div>
            <button
              onClick={() => onOpenGalleryModal()}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Picture</span>
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={gallerySearch}
                onChange={(e) => setGallerySearch(e.target.value)}
                placeholder="Search by title, caption, tags..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {gallerySearch && (
                <button
                  onClick={() => setGallerySearch('')}
                  className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-slate-500 shrink-0">Category:</span>
              <select
                value={galleryCategoryFilter}
                onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium text-slate-700 cursor-pointer"
              >
                <option value="All">All Categories ({gallery.length})</option>
                {Array.from(new Set(gallery.map((g) => g.category))).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gallery Items Grid */}
          {(() => {
            const filtered = gallery.filter((item) => {
              const matchesCat =
                galleryCategoryFilter === 'All' || item.category === galleryCategoryFilter;
              const matchesQuery =
                gallerySearch.trim() === '' ||
                item.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                item.caption.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                (item.programmeTitle &&
                  item.programmeTitle.toLowerCase().includes(gallerySearch.toLowerCase())) ||
                (item.tags &&
                  item.tags.some((t) => t.toLowerCase().includes(gallerySearch.toLowerCase())));
              return matchesCat && matchesQuery;
            });

            if (filtered.length === 0) {
              return (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
                  <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800">No Photo Matches Found</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Try clearing your search query or selecting a different category filter.
                  </p>
                  <button
                    onClick={() => {
                      setGallerySearch('');
                      setGalleryCategoryFilter('All');
                    }}
                    className="mt-3 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition"
                  >
                    Reset Filters
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div className="relative h-48 bg-slate-900 group">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-900/85 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                          {item.category}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-medium">
                          {item.eventDate}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-sm text-slate-900 font-serif line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {item.caption}
                        </p>
                        {item.programmeTitle && (
                          <div className="text-[11px] text-amber-700 font-medium truncate pt-1">
                            📌 {item.programmeTitle}
                          </div>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.tags.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenGalleryModal(item)}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition border border-amber-200"
                        >
                          <Edit className="w-3.5 h-3.5 text-amber-600" />
                          <span>Edit Photo & Words</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryItem(item.id, item.title)}
                          className="px-2.5 py-1.5 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 5: SITE & CONTENT CUSTOMIZER */}
      {activeTab === 'customizer' && (
        <SiteSettingsEditor
          settings={siteSettings}
          onSave={(updated) => {
            if (onUpdateSiteSettings) {
              onUpdateSiteSettings(updated);
              showToast(
                'Site branding, banners, confirmation letter & write-ups saved successfully!'
              );
            }
          }}
          onResetToDefault={() => {
            resetSiteSettingsToDefault();
            onDataRefresh();
            showToast('Reset all site customizations to default template.');
          }}
        />
      )}

      {/* TAB 6: DATA & BACKUPS */}
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
                <p className="text-xs text-slate-500">
                  Download complete dataset of programmes, registrations, admins, and gallery items.
                </p>
              </div>
              <button
                onClick={() => {
                  const dataStr =
                    'data:text/json;charset=utf-8,' +
                    encodeURIComponent(
                      JSON.stringify(
                        { programmes, registrations, gallery, siteSettings },
                        null,
                        2
                      )
                    );
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute(
                    'download',
                    `MinistersConnect_Backup_${Date.now()}.json`
                  );
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                  showToast('Exported full database backup.');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Download JSON
              </button>
            </div>

            <div className="p-4 bg-red-50/50 border border-red-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-red-900">Reset to Default Seeds</h4>
                <p className="text-xs text-red-700">
                  Restore default demo programmes, sample registered ministers, and admin accounts.
                </p>
              </div>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'Reset all app data to default demonstration seeds? Any custom programmes or registrations will be replaced.'
                    )
                  ) {
                    resetAllDataToDefault();
                    onDataRefresh();
                    showToast('Reset system to default seeds.');
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

      {/* Minister Edit Details Modal */}
      {editingRegistration && (
        <MinisterEditModal
          isOpen={!!editingRegistration}
          onClose={() => setEditingRegistration(null)}
          registration={editingRegistration}
          programmes={programmes}
          onSave={handleSaveMinisterEdit}
        />
      )}

      {/* Barcode & QR Live Camera Scanner Modal */}
      {isScannerOpen && (
        <BarcodeScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onSuccessfulCheckIn={(reg) => {
            onDataRefresh();
            showToast(`Minister ${reg.fullName} successfully accredited & checked in!`);
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

      {/* Admin Delete Confirmation Modal (Admin-Only Restriction) */}
      {deleteModalState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4 pb-3 border-b border-red-100">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {deleteModalState.type === 'bulk_registrations'
                    ? `Delete ${deleteModalState.ids?.length} Registered Members?`
                    : `Delete ${deleteModalState.type === 'leader' ? 'Church Leader' : 'Registered Member'}?`}
                </h3>
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Admin-Only Authority</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              This action is restricted exclusively to Secretariat Administrators. This will permanently remove
              the record, revoke delegate accreditation, and invalidate any issued QR gate passes.
            </p>

            {deleteModalState.name && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-5 space-y-1.5 text-xs">
                <div className="flex items-center gap-3">
                  {deleteModalState.photoUrl ? (
                    <img
                      src={deleteModalState.photoUrl}
                      alt={deleteModalState.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover border border-slate-300 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 font-bold flex items-center justify-center shrink-0 text-sm">
                      {deleteModalState.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{deleteModalState.name}</div>
                    {deleteModalState.churchName && (
                      <div className="text-slate-600 flex items-center gap-1 mt-0.5">
                        <Church className="w-3.5 h-3.5 text-slate-400" />
                        <span>{deleteModalState.churchName}</span>
                      </div>
                    )}
                  </div>
                </div>
                {deleteModalState.details && (
                  <div className="text-slate-500 font-mono text-[11px] pt-1 border-t border-slate-200/60">
                    {deleteModalState.details}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteModalState(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer border border-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm & Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
