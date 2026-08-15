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
} from 'lucide-react';
import {
  Programme,
  Registration,
  MinisterialTitle,
  MinisterialPosition,
  MemberUser,
} from '../types';
import { addRegistration, findRegistrationByIdOrEmail, getRegistrations } from '../utils/storage';
import { PassportPhotoSelector } from './PassportPhotoSelector';
import { INITIAL_PROGRAMMES } from '../data/seedData';

interface RegistrationFormProps {
  programmes: Programme[];
  selectedProgrammeId?: string | null;
  onRegistrationSuccess: (newRegistration: Registration) => void;
  onCancel: () => void;
  currentMember?: MemberUser | null;
  onRequestSignIn?: () => void;
  onViewExistingRegistration?: (registration: Registration) => void;
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

  // Form Field States
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
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#d97706', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
        });
      } catch (err) {
        // Safe fallback if canvas-confetti is not loaded
      }

      setSubmitting(false);
      onRegistrationSuccess(newRegistration);
    }, 450);
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
            Ministers Connect Accreditation & Registration Portal
          </h1>

          <p className="text-slate-300 text-sm sm:text-base mt-2.5 max-w-3xl leading-relaxed">
            Welcome to the official accreditation desk for Christian ministers, apostles, pastors,
            evangelists, and church leaders. Register to receive your official{' '}
            <strong className="text-amber-300">Confirmation Letter</strong>, personalized{' '}
            <strong className="text-amber-300">Digital Gate Pass with QR Code</strong>, and access to all
            plenary sessions and Fruit Fasting hospitality.
          </p>

          {/* Quick Hotline Summary Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-300">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Next Programme: 21st - 22nd Aug 2026
              </span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" /> Maitama, Abuja
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
          <span>New Accreditation Form</span>
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
      {/* 3. MEMBER AUTH STATUS CARD */}
      {/* ========================================================================= */}
      {!currentMember ? (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Member Account Authentication</span>
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-amber-200 text-amber-950 uppercase tracking-wide">
                  Optional Fast-Pass
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                Sign in to pre-fill your ministerial credentials automatically, view previous
                registrations, and print saved credentials. Or proceed below as a new delegate.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRequestSignIn}
            className="w-full sm:w-auto shrink-0 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-amber-400" />
            <span>Sign In with Password</span>
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            {currentMember.avatarUrl ? (
              <img
                src={currentMember.avatarUrl}
                alt=""
                className="w-11 h-11 rounded-xl object-cover border-2 border-emerald-500 shadow-xs"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                {currentMember.fullName.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-950">
                  Signed in as {currentMember.title} {currentMember.fullName}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Minister
                </span>
              </div>
              <p className="text-xs text-emerald-700">
                {currentMember.churchName} • {currentMember.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-lg border border-emerald-200">
              ✓ Credentials Auto-Loaded
            </span>
          </div>
        </div>
      )}

      {/* Member's Existing Registrations Fast Access (if any) */}
      {currentMember && memberRegistrations.length > 0 && portalMode === 'form' && (
        <div className="bg-white border border-amber-200 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Your Active Accreditations ({memberRegistrations.length})</span>
            </h3>
            <span className="text-xs text-slate-500">Click any registration to view letter</span>
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
                  <p className="text-xs font-bold text-slate-800 mt-1 truncate max-w-[220px]">
                    {reg.programmeTitle}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {reg.attendeesCount} Delegate(s) • Arrival: {reg.arrivalDate}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700">
                  <span>View Pass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: NEW ACCREDITATION FORM */}
      {/* ========================================================================= */}
      {portalMode === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: Programme Selection */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Select Programme to Attend</h2>
                <p className="text-xs text-slate-500">
                  Choose the upcoming monthly programme or leadership summit
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Target Programme <span className="text-red-500">*</span>
                </label>
                <select
                  value={programmeId}
                  onChange={(e) => setProgrammeId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition cursor-pointer text-sm"
                >
                  {displayProgrammes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.startDate} - {p.city}) {p.isFree ? '• [Free Registration]' : ''}
                    </option>
                  ))}
                </select>
                {errors.programmeId && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.programmeId}
                  </p>
                )}
              </div>

              {/* Selected Programme Summary Card */}
              {selectedProgramme && (
                <div className="bg-gradient-to-br from-amber-50/80 to-amber-100/40 border border-amber-200/80 rounded-xl p-4 sm:p-5 text-xs sm:text-sm text-slate-700 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-amber-950 font-serif text-sm sm:text-base">
                      {selectedProgramme.title}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold text-xs uppercase tracking-wide">
                      {selectedProgramme.category}
                    </span>
                  </div>

                  <p className="text-slate-800 italic font-serif text-sm leading-snug">
                    Theme: "{selectedProgramme.theme}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700 pt-2 border-t border-amber-200/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <span className="text-[11px] text-slate-500 block">Dates</span>
                        <span className="font-semibold text-xs text-slate-900">
                          {selectedProgramme.startDate} to {selectedProgramme.endDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <span className="text-[11px] text-slate-500 block">Venue</span>
                        <span className="font-semibold text-xs text-slate-900">
                          {selectedProgramme.venue}, {selectedProgramme.city}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <span className="text-[11px] text-slate-500 block">Accredited Capacity</span>
                        <span className="font-semibold text-xs text-slate-900">
                          {selectedProgramme.registeredCount || 785} / {selectedProgramme.capacity || 1200} Ministers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: Minister Profile & Contact Credentials */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Ministerial Identification & Contact Channels
                </h2>
                <p className="text-xs text-slate-500">
                  Accreditation credentials, official title, and name badge data
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6">
              {/* Title */}
              <div className="sm:col-span-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Ministerial Title / Salutation <span className="text-red-500">*</span>
                </label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value as MinisterialTitle)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-sm"
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
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name (Surname First or Preferred) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Samuel Bukunmi Adeleke"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 transition ${
                    errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email Address (For Confirmation Letter Delivery) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pastor@ministry.org"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 transition ${
                      errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
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

              {/* Phone Number */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Primary Mobile Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 123 4567"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 transition ${
                      errors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
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

              {/* WhatsApp Number */}
              <div className="sm:col-span-12">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    WhatsApp Number (For Programme Broadcasts & Arrival Updates){' '}
                    <span className="text-red-500">*</span>
                  </label>
                  {phone && (
                    <button
                      type="button"
                      onClick={handleCopyPhoneToWhatsapp}
                      className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Same as Phone</span>
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
                      errors.whatsapp ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                {errors.whatsapp && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.whatsapp}
                  </p>
                )}
              </div>

              {/* Church / Ministry Name */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Church / Ministry Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={churchName}
                    onChange={(e) => setChurchName(e.target.value)}
                    placeholder="e.g. Dominion Faith Bible Church"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 transition ${
                      errors.churchName ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  <Church className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                {errors.churchName && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.churchName}
                  </p>
                )}
              </div>

              {/* Ministerial Position */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Ministerial Role / Position <span className="text-red-500">*</span>
                </label>
                <select
                  value={ministerialPosition}
                  onChange={(e) => setMinisterialPosition(e.target.value as MinisterialPosition)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 transition text-sm"
                >
                  {MINISTERIAL_POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              {ministerialPosition === 'Other' && (
                <div className="sm:col-span-12">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Specify Ministerial Role
                  </label>
                  <input
                    type="text"
                    value={customPosition}
                    onChange={(e) => setCustomPosition(e.target.value)}
                    placeholder="e.g. Presiding Overseer, Diocesan Chaplain, Missions Director"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}

              {/* Passport Photo Capture / Upload Component */}
              <div className="sm:col-span-12 pt-2 border-t border-slate-100">
                <PassportPhotoSelector
                  value={passportPhotoUrl}
                  onChange={(photo) => setPassportPhotoUrl(photo)}
                  label="Official Ministerial Headshot / Passport (For Gate Pass & Name Badge)"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Location, Logistics & Attendees */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Location, Travel Logistics & Delegation Team
                </h2>
                <p className="text-xs text-slate-500">
                  Delegation size, arrival schedule, and seating arrangements
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  City / Base <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Abuja / Ibadan / Lagos"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 transition ${
                    errors.city ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.city && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.city}
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  State / Province
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. FCT / Oyo State"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Nigeria, Ghana, UK"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 transition ${
                    errors.country ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.country && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.country}
                  </p>
                )}
              </div>
            </div>

            {/* Logistics & Attendees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 border-t border-slate-100">
              {/* Arrival Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Expected Arrival Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 transition ${
                    errors.arrivalDate ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.arrivalDate && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.arrivalDate}
                  </p>
                )}
              </div>

              {/* Departure Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Departure Date
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>

              {/* Total Attendees */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Total Attendees in Delegation
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={attendeesCount}
                    onChange={(e) => handleAttendeesCountChange(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-center focus:ring-2 focus:ring-amber-500 transition"
                  />
                  <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                    Person(s)
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Delegate Names */}
            {attendeesCount > 1 && (
              <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>Names of Additional Ministers / Delegates in your Team</span>
                </div>
                <p className="text-xs text-slate-500">
                  Lead delegate: <strong>{title} {fullName || '(Your Name)'}</strong>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {additionalAttendees.map((name, idx) => (
                    <div key={idx}>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Delegate #{idx + 2} Name & Title
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => handleAttendeeNameChange(idx, e.target.value)}
                        placeholder="e.g. Pastor John Doe"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
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
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              Back to Home
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white text-base font-bold rounded-xl shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Accreditation Credentials...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Complete Registration & Generate Official Letter</span>
                </div>
              )}
            </button>
          </div>
        </form>
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
    </div>
  );
};
