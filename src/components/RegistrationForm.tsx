import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserCheck,
  Church,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  FileText,
  Sparkles,
  HelpCircle,
  MessageSquare,
  AlertCircle,
  Flame,
  CheckCircle,
  Plus,
  Trash2,
  Copy,
  Camera,
  LogIn,
  Lock,
  ShieldCheck,
  User,
  Search,
  BookOpen,
  Clock,
  ExternalLink,
  ChevronRight,
  Info,
  Check,
  Award,
  ArrowRight,
  Download,
  Printer,
  Share2,
  UserPlus,
  Eye,
  EyeOff,
  BadgePercent,
} from 'lucide-react';
import {
  Programme,
  Registration,
  MinisterialTitle,
  MinisterialPosition,
  MemberUser,
} from '../types';
import {
  addRegistration,
  findRegistrationByIdOrEmail,
  getRegistrations,
  registerMember,
  authenticateMember,
  getMembers,
} from '../utils/storage';
import { PassportPhotoSelector } from './PassportPhotoSelector';
import { INITIAL_PROGRAMMES } from '../data/seedData';
import { exportElementToPDF, printConfirmationLetter } from '../utils/pdfGenerator';
import { MinisterBadgeModal } from './MinisterBadgeModal';

interface RegistrationFormProps {
  programmes: Programme[];
  selectedProgrammeId?: string | null;
  onRegistrationSuccess: (newRegistration: Registration) => void;
  onCancel: () => void;
  currentMember?: MemberUser | null;
  onRequestSignIn?: () => void;
  onViewExistingRegistration?: (registration: Registration) => void;
  onMemberAuthSuccess?: (member: MemberUser) => void;
}

const MINISTERIAL_TITLES: MinisterialTitle[] = [
  'Pastor',
  'Reverend',
  'Bishop',
  'Apostle',
  'Evangelist',
  'Prophet',
  'Prophetess',
  'Teacher',
  'Deacon',
  'Deaconess',
  'Elder',
  'Minister',
  'Brother',
  'Sister',
  'Dr.',
  'Other',
];

const MINISTERIAL_POSITIONS: MinisterialPosition[] = [
  'Senior Pastor / General Overseer',
  'Associate / Resident Pastor',
  'Youth / Campus Pastor',
  'Children / Teens Minister',
  'Music / Worship Director',
  'Evangelist / Outreach Director',
  'Missions Coordinator',
  'Church Administrator / Executive',
  'Prayer / Intercession Leader',
  'Bible Study / Christian Education Teacher',
  'Church Worker / Deacon / Elder',
  'Other',
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  programmes,
  selectedProgrammeId,
  onRegistrationSuccess,
  onCancel,
  currentMember,
  onRequestSignIn,
  onViewExistingRegistration,
  onMemberAuthSuccess,
}) => {
  // Ensure we have active programmes, fallback to initial programmes if empty
  const availableProgrammes =
    programmes && programmes.length > 0 ? programmes : INITIAL_PROGRAMMES;
  const activeProgrammes = availableProgrammes.filter(
    (p) => p.status !== 'completed' && p.status !== 'cancelled'
  );
  const displayProgrammes = activeProgrammes.length > 0 ? activeProgrammes : availableProgrammes;

  // Active Sub-Tab in the Register Portal
  const [portalMode, setPortalMode] = useState<'form' | 'lookup' | 'programmes' | 'guidelines'>('form');

  // Inline Auth Gate Mode (When !currentMember)
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Inline Sign Up Fields
  const [authTitle, setAuthTitle] = useState<MinisterialTitle>('Pastor');
  const [authFullName, setAuthFullName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authChurch, setAuthChurch] = useState('');
  const [authPosition, setAuthPosition] = useState<MinisterialPosition>('Senior Pastor / General Overseer');
  const [authCity, setAuthCity] = useState('Abuja');
  const [authState, setAuthState] = useState('FCT');
  const [authCountry, setAuthCountry] = useState('Nigeria');
  const [authPhoto, setAuthPhoto] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);

  // Form Field States (Populated when logged in)
  const [title, setTitle] = useState<MinisterialTitle>(currentMember?.title || 'Pastor');
  const [fullName, setFullName] = useState(currentMember?.fullName || '');
  const [email, setEmail] = useState(currentMember?.email || '');
  const [phone, setPhone] = useState(currentMember?.phone || '');
  const [whatsapp, setWhatsapp] = useState(currentMember?.whatsapp || currentMember?.phone || '');
  const [churchName, setChurchName] = useState(currentMember?.churchName || '');
  const [denomination, setDenomination] = useState('');
  const [ministerialPosition, setMinisterialPosition] = useState<MinisterialPosition>(
    currentMember?.ministerialPosition || 'Senior Pastor / General Overseer'
  );
  const [customPosition, setCustomPosition] = useState('');
  const [city, setCity] = useState(currentMember?.city || 'Abuja');
  const [state, setState] = useState(currentMember?.state || 'FCT');
  const [country, setCountry] = useState(currentMember?.country || 'Nigeria');
  const [passportPhotoUrl, setPassportPhotoUrl] = useState<string>(currentMember?.avatarUrl || '');

  // Programme Selection
  const defaultProgId =
    selectedProgrammeId || (displayProgrammes.length > 0 ? displayProgrammes[0].id : '');
  const [programmeId, setProgrammeId] = useState<string>(defaultProgId);
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [attendeesCount, setAttendeesCount] = useState<number>(1);
  const [additionalAttendees, setAdditionalAttendees] = useState<string[]>([]);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [prayerRequests, setPrayerRequests] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Lookup Sub-Section State
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResults, setLookupResults] = useState<Registration[]>([]);
  const [hasSearchedLookup, setHasSearchedLookup] = useState(false);

  // Post-Registration Success Dialog State
  const [createdRegistration, setCreatedRegistration] = useState<Registration | null>(null);
  const [badgeModalRegistration, setBadgeModalRegistration] = useState<Registration | null>(null);

  // Sync if currentMember updates
  useEffect(() => {
    if (currentMember) {
      setTitle(currentMember.title);
      setFullName(currentMember.fullName);
      setEmail(currentMember.email);
      setPhone(currentMember.phone);
      setWhatsapp(currentMember.whatsapp || currentMember.phone);
      setChurchName(currentMember.churchName);
      setMinisterialPosition(currentMember.ministerialPosition);
      setCity(currentMember.city);
      if (currentMember.state) setState(currentMember.state);
      setCountry(currentMember.country);
      if (currentMember.avatarUrl) setPassportPhotoUrl(currentMember.avatarUrl);
    }
  }, [currentMember]);

  useEffect(() => {
    if (selectedProgrammeId) {
      setProgrammeId(selectedProgrammeId);
    }
  }, [selectedProgrammeId]);

  // Set default dates when programme changes
  useEffect(() => {
    const selected = displayProgrammes.find((p) => p.id === programmeId);
    if (selected) {
      if (!arrivalDate) setArrivalDate(selected.startDate);
      if (!departureDate) setDepartureDate(selected.endDate);
    }
  }, [programmeId, displayProgrammes]);

  const selectedProgramme =
    displayProgrammes.find((p) => p.id === programmeId) || displayProgrammes[0];

  const handleAttendeesCountChange = (count: number) => {
    const validCount = Math.max(1, Math.min(25, count));
    setAttendeesCount(validCount);
    const extraCount = validCount - 1;
    if (extraCount <= 0) {
      setAdditionalAttendees([]);
    } else {
      const current = [...additionalAttendees];
      while (current.length < extraCount) {
        current.push('');
      }
      setAdditionalAttendees(current.slice(0, extraCount));
    }
  };

  const handleAttendeeNameChange = (index: number, val: string) => {
    const updated = [...additionalAttendees];
    updated[index] = val;
    setAdditionalAttendees(updated);
  };

  const handleCopyPhoneToWhatsapp = () => {
    if (phone) {
      setWhatsapp(phone);
    }
  };

  // Inline Sign-Up Handler
  const handleInlineSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!authFullName.trim()) {
      setAuthError('Please enter your Full Name (e.g. Pastor Samuel Adeleke).');
      return;
    }
    if (!authEmail.trim() || !/\S+@\S+\.\S+/.test(authEmail)) {
      setAuthError('Please enter a valid Email address.');
      return;
    }
    if (!authPassword || authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }
    if (!authPhone.trim()) {
      setAuthError('Please enter your Phone or WhatsApp number.');
      return;
    }
    if (!authChurch.trim()) {
      setAuthError('Please enter your Church or Ministry name.');
      return;
    }
    if (!authCity.trim()) {
      setAuthError('Please enter your City / Location.');
      return;
    }

    setAuthLoading(true);
    setTimeout(() => {
      const res = registerMember({
        email: authEmail.trim().toLowerCase(),
        password: authPassword,
        title: authTitle,
        fullName: authFullName.trim(),
        phone: authPhone.trim(),
        whatsapp: authPhone.trim(),
        churchName: authChurch.trim(),
        ministerialPosition: authPosition,
        city: authCity.trim(),
        state: authState.trim() || undefined,
        country: authCountry.trim(),
        avatarUrl: authPhoto || undefined,
      });

      setAuthLoading(false);

      if (res.success && res.member) {
        if (onMemberAuthSuccess) {
          onMemberAuthSuccess(res.member);
        }
      } else {
        setAuthError(res.error || 'Registration failed. An account with this email may already exist.');
      }
    }, 350);
  };

  // Inline Sign-In Handler
  const handleInlineSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!authEmail.trim()) {
      setAuthError('Please enter your member email address.');
      return;
    }
    if (!authPassword) {
      setAuthError('Please enter your password.');
      return;
    }

    setAuthLoading(true);
    setTimeout(() => {
      const res = authenticateMember(authEmail, authPassword);
      setAuthLoading(false);

      if (res.success && res.member) {
        if (onMemberAuthSuccess) {
          onMemberAuthSuccess(res.member);
        }
      } else {
        setAuthError(res.error || 'Authentication failed. Please check your email and password.');
      }
    }, 350);
  };

  const handleQuickDemoLogin = (emailSample: string) => {
    setAuthEmail(emailSample);
    setAuthPassword('password123');
    setAuthError(null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required for official credentialing';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required for programme broadcasts';
    if (!churchName.trim()) newErrors.churchName = 'Church or Ministry name is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!country.trim()) newErrors.country = 'Country is required';
    if (!programmeId) newErrors.programmeId = 'Please select a programme';
    if (!arrivalDate) newErrors.arrivalDate = 'Arrival date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentMember) {
      setAuthError('Please create an account or sign in with your password before submitting.');
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    if (!validate()) {
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    const attendeeNamesList = [
      `${title} ${fullName.trim()}`,
      ...additionalAttendees.filter((n) => n.trim().length > 0),
    ];

    const programmeTitle = selectedProgramme
      ? selectedProgramme.title
      : 'Ministers Connect Monthly Program: Reigning in the Storm';

    setTimeout(() => {
      const newRegistration = addRegistration({
        title,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        churchName: churchName.trim(),
        denomination: denomination.trim() || undefined,
        ministerialPosition,
        customPosition: ministerialPosition === 'Other' ? customPosition.trim() : undefined,
        city: city.trim(),
        state: state.trim() || undefined,
        country: country.trim(),
        programmeId: programmeId || 'prog-2026-001',
        programmeTitle,
        arrivalDate,
        departureDate: departureDate || undefined,
        attendeesCount,
        attendeeNames: attendeeNamesList,
        specialRequirements: specialRequirements.trim() || undefined,
        prayerRequests: prayerRequests.trim() || undefined,
        passportPhotoUrl: passportPhotoUrl || undefined,
        status: 'confirmed',
        checkInStatus: 'not_checked_in',
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#d97706', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
        });
      } catch (err) {
        // Safe fallback
      }

      setSubmitting(false);
      setCreatedRegistration(newRegistration);
      onRegistrationSuccess(newRegistration);
    }, 400);
  };

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    const matches = findRegistrationByIdOrEmail(lookupQuery);
    setLookupResults(matches);
    setHasSearchedLookup(true);
  };

  // Get user's own registrations if logged in
  const memberRegistrations = currentMember
    ? getRegistrations().filter(
        (r) =>
          r.email.toLowerCase() === currentMember.email.toLowerCase() ||
          r.phone === currentMember.phone
      )
    : [];

  const sampleMembers = getMembers().slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ========================================================================= */}
      {/* 1. PORTAL HERO BANNER */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 mb-8 border border-amber-500/20 shadow-xl relative overflow-hidden">
        {/* Background Decorative Graphic */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10 pointer-events-none">
          <Flame className="w-80 h-80 text-amber-400" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Official Accreditation Portal
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
              <CheckCircle className="w-3 h-3" /> Registration is 100% Free
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight text-white leading-tight">
            Ministers Accreditation & Programme Registration
          </h1>

          <p className="text-slate-300 text-sm sm:text-base mt-2.5 max-w-3xl leading-relaxed">
            Welcome to the official accreditation desk. Sign up with your password to complete your
            programme registration, generate your <strong className="text-amber-300">Official Confirmation Letter (PDF)</strong>,
            and download your personalized <strong className="text-amber-300">Digital Gate Pass & Accreditation Badge</strong>.
          </p>

          {/* Quick Hotline Summary Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-300">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Next Programme: 21st - 22nd Aug 2026
              </span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" /> Maitama, Abuja FCT
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs">Secretariat Hotlines:</span>
              <a
                href="tel:09110376410"
                className="text-amber-300 hover:text-amber-200 font-mono font-bold hover:underline"
              >
                09110376410
              </a>
              <span className="text-slate-600">/</span>
              <a
                href="https://wa.me/2348131587655"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-mono font-bold hover:underline"
              >
                08131587655 (WhatsApp)
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PORTAL NAVIGATION SWITCHER */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl mb-8 border border-slate-300/60 shadow-xs">
        <button
          type="button"
          onClick={() => setPortalMode('form')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            portalMode === 'form'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
          }`}
        >
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span>Accreditation Form</span>
        </button>

        <button
          type="button"
          onClick={() => setPortalMode('lookup')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            portalMode === 'lookup'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
          }`}
        >
          <Search className="w-4 h-4 text-amber-400" />
          <span>Find My Badge / Letter</span>
        </button>

        <button
          type="button"
          onClick={() => setPortalMode('programmes')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            portalMode === 'programmes'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Programmes ({displayProgrammes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setPortalMode('guidelines')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            portalMode === 'guidelines'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Fasting & Guidelines</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: REGISTRATION & ACCREDITATION FLOW */}
      {/* ========================================================================= */}
      {portalMode === 'form' && (
        <div className="space-y-8">
          {/* STEP 1: MANDATORY MEMBER SIGN-UP / SIGN-IN GATE */}
          {!currentMember ? (
            <div className="bg-white border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Gate Header */}
                <div className="text-center space-y-2 pb-4 border-b border-slate-100">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Mandatory Presbytery Requirement</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                    Step 1: Sign Up or Sign In with Your Password
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
                    All delegates and ministers <strong>must create an account with their own password</strong> before
                    filling any registration form. Your account secures your official accreditation badge and
                    confirmation letter.
                  </p>
                </div>

                {/* Tab Switcher: Sign Up vs Sign In */}
                <div className="grid grid-cols-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setAuthError(null);
                    }}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Member Account (Sign Up)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setAuthError(null);
                    }}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      authMode === 'signin'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Member Sign In</span>
                  </button>
                </div>

                {/* Auth Error Banner */}
                {authError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="font-semibold">{authError}</div>
                  </div>
                )}

                {/* TAB A: SIGN UP FORM */}
                {authMode === 'signup' && (
                  <form onSubmit={handleInlineSignUp} className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={authTitle}
                          onChange={(e) => setAuthTitle(e.target.value as MinisterialTitle)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-amber-500"
                        >
                          {MINISTERIAL_TITLES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={authFullName}
                          onChange={(e) => setAuthFullName(e.target.value)}
                          placeholder="e.g. Samuel Bukunmi Adeleke"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="pastor@churchname.org"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                          />
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Set Account Password <span className="text-red-500">*</span> (min 6 chars)
                        </label>
                        <div className="relative">
                          <input
                            type={showAuthPassword ? 'text' : 'password'}
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="Create your password"
                            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                          />
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <button
                            type="button"
                            onClick={() => setShowAuthPassword(!showAuthPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Phone / WhatsApp Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value)}
                            placeholder="+234 803 123 4567"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                          />
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Church / Ministry Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={authChurch}
                            onChange={(e) => setAuthChurch(e.target.value)}
                            placeholder="e.g. Dominion Faith Bible Church"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                          />
                          <Church className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={authCity}
                          onChange={(e) => setAuthCity(e.target.value)}
                          placeholder="e.g. Abuja"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">State / Province</label>
                        <input
                          type="text"
                          value={authState}
                          onChange={(e) => setAuthState(e.target.value)}
                          placeholder="e.g. FCT"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                        <input
                          type="text"
                          value={authCountry}
                          onChange={(e) => setAuthCountry(e.target.value)}
                          placeholder="e.g. Nigeria"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <PassportPhotoSelector
                        value={authPhoto}
                        onChange={(photo) => setAuthPhoto(photo)}
                        label="Member Passport Photo / Portrait (Optional for Badge)"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white font-bold text-base rounded-xl shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
                    >
                      {authLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating Account & Unlocking Form...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          <span>Sign Up & Unlock Accreditation Form</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* TAB B: SIGN IN FORM */}
                {authMode === 'signin' && (
                  <form onSubmit={handleInlineSignIn} className="space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                        Member Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="e.g. pastor@churchname.org"
                          className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                          autoFocus
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs sm:text-sm font-bold text-slate-700">
                          Account Password <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-500">Your created password</span>
                      </div>
                      <div className="relative">
                        <input
                          type={showAuthPassword ? 'text' : 'password'}
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <button
                          type="button"
                          onClick={() => setShowAuthPassword(!showAuthPassword)}
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-base rounded-xl shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
                    >
                      {authLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying Credentials...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="w-5 h-5" />
                          <span>Sign In & Unlock Accreditation Form</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    {/* Demo Accounts Quick Login */}
                    {sampleMembers.length > 0 && (
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>One-Click Demo Member Logins:</span>
                        </p>
                        <div className="space-y-1.5">
                          {sampleMembers.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => handleQuickDemoLogin(m.email)}
                              className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition text-xs flex items-center justify-between group cursor-pointer"
                            >
                              <div className="truncate">
                                <span className="font-bold text-slate-800">
                                  {m.title} {m.fullName}
                                </span>
                                <span className="text-slate-500 text-[11px] block">{m.email}</span>
                              </div>
                              <span className="text-[11px] font-semibold text-amber-700 opacity-0 group-hover:opacity-100 transition">
                                Select Demo →
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          ) : (
            /* STEP 2: VERIFIED MEMBER STATUS CARD */
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {currentMember.avatarUrl ? (
                  <img
                    src={currentMember.avatarUrl}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                    {currentMember.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-emerald-950">
                      {currentMember.title} {currentMember.fullName}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-[11px] font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Member Authenticated
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 font-medium mt-0.5">
                    {currentMember.churchName} • {currentMember.city}, {currentMember.country} • {currentMember.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-white/80 px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-2xs">
                  ✓ Form Unlocked & Ready
                </span>
              </div>
            </div>
          )}

          {/* Member's Existing Registrations Fast Access (if any) */}
          {currentMember && memberRegistrations.length > 0 && (
            <div className="bg-white border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Your Previous Registrations ({memberRegistrations.length})</span>
                </h3>
                <span className="text-xs text-slate-500">Click any record to reprint confirmation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {memberRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    onClick={() => {
                      if (onViewExistingRegistration) {
                        onViewExistingRegistration(reg);
                      } else {
                        onRegistrationSuccess(reg);
                      }
                    }}
                    className="p-3 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-400 rounded-xl transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                        {reg.id}
                      </span>
                      <p className="text-xs font-bold text-slate-800 mt-1">{reg.programmeTitle}</p>
                      <p className="text-[11px] text-slate-500">Arrival: {reg.arrivalDate}</p>
                    </div>
                    <div className="text-xs font-bold text-amber-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      View Letter →
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MAIN REGISTRATION FORM (ENABLED WHEN LOGGED IN) */}
          {currentMember && (
            <form onSubmit={handleSubmit} className="space-y-8 relative">
              {/* SECTION 1: Personal and Ministerial Credentials */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Ministerial Identity & Credentials
                    </h2>
                    <p className="text-xs text-slate-500">
                      These details will appear on your official Confirmation Letter and Delegate Badge.
                    </p>
                  </div>
                </div>

                {/* Passport Photo Selector */}
                <div className="mb-6">
                  <PassportPhotoSelector
                    value={passportPhotoUrl}
                    onChange={(photo) => setPassportPhotoUrl(photo)}
                    label="Official Passport Photo / Portrait for Delegate Badge (Optional)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  {/* Ministerial Title */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Title / Salutation <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={title}
                      onChange={(e) => setTitle(e.target.value as MinisterialTitle)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:ring-2 focus:ring-amber-500"
                    >
                      {MINISTERIAL_TITLES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Full Name */}
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name (Surname First or Preferred) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Samuel Bukunmi Adeleke"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 transition ${
                          errors.fullName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                        }`}
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Official Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="pastor@churchname.org"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 transition ${
                          errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                        }`}
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 803 123 4567"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 transition ${
                          errors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                        }`}
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div className="sm:col-span-6">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      {phone && (
                        <button
                          type="button"
                          onClick={handleCopyPhoneToWhatsapp}
                          className="text-[11px] text-amber-700 hover:underline cursor-pointer font-medium"
                        >
                          Copy from Phone
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+234 803 123 4567"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 transition ${
                          errors.whatsapp ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                        }`}
                      />
                      <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  {/* Church Name */}
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Church / Ministry Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={churchName}
                        onChange={(e) => setChurchName(e.target.value)}
                        placeholder="e.g. Dominion Faith Bible Church"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 transition ${
                          errors.churchName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                        }`}
                      />
                      <Church className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  {/* Position */}
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Ministerial Role / Calling <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={ministerialPosition}
                      onChange={(e) => setMinisterialPosition(e.target.value as MinisterialPosition)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:ring-2 focus:ring-amber-500"
                    >
                      {MINISTERIAL_POSITIONS.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Denomination */}
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Denomination / Network (Optional)
                    </label>
                    <input
                      type="text"
                      value={denomination}
                      onChange={(e) => setDenomination(e.target.value)}
                      placeholder="e.g. Pentecostal / Apostolic Network"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* City, State, Country */}
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      City / Town <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Abuja"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      State / Province
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. FCT"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Nigeria"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Programme Selection & Logistics */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Programme Selection & Convocation Schedule
                    </h2>
                    <p className="text-xs text-slate-500">
                      Select which programme you are registering for and confirm arrival dates.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Select Convocation Programme <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={programmeId}
                      onChange={(e) => setProgrammeId(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-amber-500"
                    >
                      {displayProgrammes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.startDate} - {p.endDate} • {p.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedProgramme && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/80 to-amber-100/40 border border-amber-200 text-xs sm:text-sm text-slate-800 space-y-1.5">
                      <div className="font-bold text-amber-950 font-serif text-sm sm:text-base">
                        {selectedProgramme.title}
                      </div>
                      {selectedProgramme.theme && (
                        <div className="italic text-amber-900 font-serif">
                          Theme: "{selectedProgramme.theme}"
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-700" />
                          {selectedProgramme.startDate} to {selectedProgramme.endDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-700" />
                          {selectedProgramme.venue}, {selectedProgramme.city}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Expected Arrival Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={arrivalDate}
                        onChange={(e) => setArrivalDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Departure Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Delegation Size & Additional Attendees */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Delegation Size & Accompanying Leaders
                    </h2>
                    <p className="text-xs text-slate-500">
                      Register accompanying associate pastors, choir leaders, or ministry delegates.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Total Number of Attendees (Including Yourself)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        max="25"
                        value={attendeesCount}
                        onChange={(e) => handleAttendeesCountChange(parseInt(e.target.value) || 1)}
                        className="w-28 px-3.5 py-2.5 rounded-xl border border-slate-300 text-base font-bold text-center focus:ring-2 focus:ring-amber-500"
                      />
                      <span className="text-xs text-slate-500">
                        {attendeesCount === 1
                          ? '1 Delegate (Yourself)'
                          : `${attendeesCount} Delegates (You + ${attendeesCount - 1} Accompanying)`}
                      </span>
                    </div>
                  </div>

                  {additionalAttendees.length > 0 && (
                    <div className="pt-3 space-y-2 border-t border-slate-100">
                      <label className="block text-xs font-semibold text-slate-700">
                        Names of Accompanying Delegates for Badge Printing:
                      </label>
                      {additionalAttendees.map((name, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 w-6 text-right">
                            #{idx + 2}
                          </span>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => handleAttendeeNameChange(idx, e.target.value)}
                            placeholder={`e.g. Pastor John Doe (Associate Pastor)`}
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4: Special Requirements & Prayer Points */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Special Requirements & Prayer Requests
                    </h2>
                    <p className="text-xs text-slate-500">
                      Hospitality assistance and confidential prayer requests for the Presbytery
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Special Requirements (Accommodation Guidance, Protocol Pickup, Accessibility)
                    </label>
                    <textarea
                      rows={2}
                      value={specialRequirements}
                      onChange={(e) => setSpecialRequirements(e.target.value)}
                      placeholder="e.g. Seeking hotel recommendations in Maitama Abuja, wheelchair accessibility..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Confidential Prayer Requests (Submitted directly to the Intercessory Presbytery)
                    </label>
                    <textarea
                      rows={2}
                      value={prayerRequests}
                      onChange={(e) => setPrayerRequests(e.target.value)}
                      placeholder="e.g. Wisdom for church expansion, health and renewed fire upon the altar..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* In-Page Submit Action Bar */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Instant Accreditation Certification</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-serif text-white">
                    Ready to Generate Your Official Confirmation Letter?
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Clicking below will issue your unique Registration ID and download-ready PDF document.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-base font-black rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Processing Official Accreditation...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Submit & Download Confirmation Letter</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Sticky Floating Bottom Bar for Easy Submission */}
              <div className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/90 backdrop-blur-md border-t border-amber-500/30 p-3 sm:p-4 shadow-2xl">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-white text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>
                      Accrediting for: <strong>{selectedProgramme?.title}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={onCancel}
                      className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs sm:text-sm font-black rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>Processing...</span>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Submit & Generate Letter (PDF)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: SELF-SERVICE LOOKUP & BADGE RETRIEVAL */}
      {/* ========================================================================= */}
      {portalMode === 'lookup' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                <Search className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                Retrieve Confirmation Letter & Digital Badge
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Enter your Registration ID (e.g. <span className="font-mono font-bold text-slate-700">MC-2026-AUG-82419</span>),
                email address, or full name to access and print your credentials.
              </p>
            </div>

            <form onSubmit={handleLookupSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  placeholder="Registration ID, email address, or name..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  autoFocus
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition shadow-xs cursor-pointer shrink-0"
              >
                Find Credentials
              </button>
            </form>

            {/* Lookup Results */}
            {hasSearchedLookup && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Search Results ({lookupResults.length})
                </h3>

                {lookupResults.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-800">No matching registration found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Please double-check your registration ID or email address, or submit a new
                      registration.
                    </p>
                    <button
                      type="button"
                      onClick={() => setPortalMode('form')}
                      className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Register Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {lookupResults.map((reg) => (
                      <div
                        key={reg.id}
                        onClick={() => {
                          if (onViewExistingRegistration) {
                            onViewExistingRegistration(reg);
                          } else {
                            onRegistrationSuccess(reg);
                          }
                        }}
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-amber-50/50 hover:border-amber-300 transition cursor-pointer flex items-center justify-between group shadow-2xs"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-900 border border-amber-400 shrink-0 flex items-center justify-center">
                            {reg.passportPhotoUrl ? (
                              <img
                                src={reg.passportPhotoUrl}
                                alt={reg.fullName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="font-bold text-sm text-amber-400">
                                {reg.fullName.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900 group-hover:text-amber-800">
                                {reg.title} {reg.fullName}
                              </span>
                              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                                {reg.id}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {reg.programmeTitle} • {reg.churchName}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {reg.attendeesCount} Delegate(s) • Arrival: {reg.arrivalDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 group-hover:bg-amber-100 transition shrink-0">
                          <span>View Letter & Badge</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: ACTIVE PROGRAMMES DIRECTORY */}
      {/* ========================================================================= */}
      {portalMode === 'programmes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
              Open Programmes & Accreditation Status
            </h2>
            <span className="text-xs text-slate-500">
              {displayProgrammes.length} Active Programme(s)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayProgrammes.map((prog) => (
              <div
                key={prog.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {prog.bannerUrl && (
                    <div className="h-44 w-full overflow-hidden bg-slate-900 relative">
                      <img
                        src={prog.bannerUrl}
                        alt={prog.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-400/30">
                          {prog.category}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-5 sm:p-6 space-y-3">
                    <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug">
                      {prog.title}
                    </h3>
                    <p className="text-xs font-serif italic text-amber-800">
                      "{prog.theme}"
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{prog.startDate} to {prog.endDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{prog.venue}, {prog.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>
                          {prog.registeredCount || 0} / {prog.capacity || 1000} Ministers Registered
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      setProgrammeId(prog.id);
                      setPortalMode('form');
                      window.scrollTo({ top: 150, behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Register for this Programme</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: FASTING & ACCREDITATION GUIDELINES */}
      {/* ========================================================================= */}
      {portalMode === 'guidelines' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>Ministerial Guidelines & Consecration Protocol</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Instructions for all attending pastors, church workers, and ministerial delegates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Guideline 1: Fruit Fast */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-sm text-amber-950">
                Consecrated Fruit Fasting Protocol
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                As instructed by the Convener, <strong>Pastor John EZE</strong>, all delegates are
                expected to observe a consecrated <strong>Fruit Fast</strong> starting from Friday
                morning (21st August, 9:00 AM) through Saturday afternoon (22nd August, 12:00 PM). Fresh
                fruits and water refreshments will be made available during the plenary communion.
              </p>
            </div>

            {/* Guideline 2: Accreditation & Name Badge */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                Digital Gate Pass & Name Badge
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Please present your <strong>Official Confirmation Letter</strong> with its QR code or
                quote your <strong>Registration ID</strong> at the accreditation scanner desk upon
                arrival. Your personalized lanyard badge will be issued at check-in and must be worn
                for all sessions.
              </p>
            </div>

            {/* Guideline 3: Dress Code */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                Ministerial Dress Code
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Formal / Pastoral / Clerical attire or dignified cultural wear is recommended for all
                ministerial programmes and gatherings.
              </p>
            </div>

            {/* Guideline 4: Hotlines & Secretariat Support */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="font-bold text-sm text-emerald-950">
                Secretariat & Logistics Desk
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                For accommodation inquiries, Abuja airport protocol pickup, or registration
                assistance, please contact the secretariat directly at{' '}
                <a href="tel:09110376410" className="font-bold text-emerald-800 underline">
                  09110376410
                </a>{' '}
                or WhatsApp{' '}
                <a href="https://wa.me/2348131587655" className="font-bold text-emerald-800 underline">
                  08131587655
                </a>.
              </p>
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={() => setPortalMode('form')}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              Proceed to Accreditation Form
            </button>
          </div>
        </div>
      )}

      {/* Badge Modal Trigger if requested */}
      {badgeModalRegistration && (
        <MinisterBadgeModal
          isOpen={!!badgeModalRegistration}
          onClose={() => setBadgeModalRegistration(null)}
          registration={badgeModalRegistration}
          programme={programmes.find((p) => p.id === badgeModalRegistration.programmeId)}
        />
      )}
    </div>
  );
};
