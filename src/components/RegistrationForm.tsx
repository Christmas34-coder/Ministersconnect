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
  Camera
} from 'lucide-react';
import { 
  Programme, 
  Registration, 
  MinisterialTitle, 
  MinisterialPosition 
} from '../types';
import { addRegistration } from '../utils/storage';
import { PassportPhotoSelector } from './PassportPhotoSelector';

interface RegistrationFormProps {
  programmes: Programme[];
  selectedProgrammeId?: string | null;
  onRegistrationSuccess: (newRegistration: Registration) => void;
  onCancel: () => void;
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
}) => {
  const activeProgrammes = programmes.filter((p) => p.status !== 'completed' && p.status !== 'cancelled');

  const [title, setTitle] = useState<MinisterialTitle>('Pastor');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [churchName, setChurchName] = useState('');
  const [ministerialPosition, setMinisterialPosition] = useState<MinisterialPosition>('Senior Pastor / General Overseer');
  const [customPosition, setCustomPosition] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [passportPhotoUrl, setPassportPhotoUrl] = useState<string>('');
  
  // Programme Selection
  const [programmeId, setProgrammeId] = useState<string>(
    selectedProgrammeId || (activeProgrammes.length > 0 ? activeProgrammes[0].id : '')
  );
  
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [attendeesCount, setAttendeesCount] = useState<number>(1);
  const [additionalAttendees, setAdditionalAttendees] = useState<string[]>([]);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [prayerRequests, setPrayerRequests] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-set default arrival date based on selected programme
  useEffect(() => {
    if (selectedProgrammeId) {
      setProgrammeId(selectedProgrammeId);
    }
  }, [selectedProgrammeId]);

  useEffect(() => {
    const selected = programmes.find((p) => p.id === programmeId);
    if (selected && !arrivalDate) {
      setArrivalDate(selected.startDate);
      setDepartureDate(selected.endDate);
    }
  }, [programmeId, programmes]);

  // Adjust additional attendees fields
  const handleAttendeesCountChange = (count: number) => {
    const validCount = Math.max(1, Math.min(20, count));
    setAttendeesCount(validCount);
    
    // adjust attendee names array
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

  const selectedProgramme = programmes.find((p) => p.id === programmeId);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required';
    if (!churchName.trim()) newErrors.churchName = 'Church/Ministry name is required';
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
      `${title} ${fullName}`,
      ...additionalAttendees.filter((n) => n.trim().length > 0),
    ];

    const programmeTitle = selectedProgramme ? selectedProgramme.title : 'Ministers Fellowship Programme';

    setTimeout(() => {
      const newRegistration = addRegistration({
        title,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        churchName: churchName.trim(),
        ministerialPosition,
        customPosition: ministerialPosition === 'Other' ? customPosition.trim() : undefined,
        city: city.trim(),
        state: state.trim(),
        country: country.trim(),
        programmeId,
        programmeTitle,
        arrivalDate,
        departureDate: departureDate || undefined,
        attendeesCount,
        attendeeNames: attendeeNamesList,
        specialRequirements: specialRequirements.trim() || undefined,
        prayerRequests: prayerRequests.trim() || undefined,
        passportPhotoUrl: passportPhotoUrl || undefined,
        status: 'confirmed',
      });

      // Fire festive confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d97706', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
      });

      setSubmitting(false);
      onRegistrationSuccess(newRegistration);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-8 border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <Flame className="w-64 h-64 text-amber-400" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Official Accreditation Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
            Ministers Programme Registration
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Please provide accurate details for official credentialing, name badges, and ministerial certification. An official <strong className="text-amber-300">Confirmation Letter</strong> will be generated immediately.
          </p>
        </div>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Programme Selection */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Select Programme to Attend
              </h2>
              <p className="text-xs text-slate-500">
                Choose the upcoming convocation, summit, or retreat
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
                {activeProgrammes.map((p) => (
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

            {/* Selected Programme Summary Box */}
            {selectedProgramme && (
              <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-4 text-xs sm:text-sm text-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 font-serif text-sm">
                    {selectedProgramme.title}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-200/70 text-amber-900 font-semibold text-[11px]">
                    {selectedProgramme.category}
                  </span>
                </div>
                <p className="text-slate-600 italic font-serif">
                  Theme: "{selectedProgramme.theme}"
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    <span>{selectedProgramme.startDate} to {selectedProgramme.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    <span>{selectedProgramme.venue}, {selectedProgramme.city}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: Minister Profile & Contact */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Ministerial Identification & Contact
              </h2>
              <p className="text-xs text-slate-500">
                Accreditation credentials and contact channels
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6">
            {/* Title */}
            <div className="sm:col-span-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Title / Salutation <span className="text-red-500">*</span>
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
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pastor@churchname.org"
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
                Phone Number <span className="text-red-500">*</span>
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
                  WhatsApp Number (For Programme Updates & Broadcasts) <span className="text-red-500">*</span>
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
                Ministerial Position / Role <span className="text-red-500">*</span>
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
                  Specify Ministerial Position
                </label>
                <input
                  type="text"
                  value={customPosition}
                  onChange={(e) => setCustomPosition(e.target.value)}
                  placeholder="e.g. Diocesan Youth Chaplain, Media Director"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            {/* Passport Photo Capture / Upload */}
            <div className="sm:col-span-12 pt-2 border-t border-slate-100">
              <PassportPhotoSelector
                value={passportPhotoUrl}
                onChange={(photo) => setPassportPhotoUrl(photo)}
                label="Official Ministerial Passport / Identification Headshot"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Location, Travel & Attendees */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Location, Travel Logistics & Attendees
              </h2>
              <p className="text-xs text-slate-500">
                Delegation details and arrival schedule
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                City / Town <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Ibadan"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 transition ${
                  errors.city ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                }`}
              />
            </div>

            {/* State / Province */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                State / Province
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Oyo State"
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
                Total Delegates / Attendees
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
                Primary delegate: <strong>{title} {fullName || '(Your Name)'}</strong>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {additionalAttendees.map((name, idx) => (
                  <div key={idx}>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Delegate #{idx + 2} Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleAttendeeNameChange(idx, e.target.value)}
                      placeholder={`e.g. Pastor John Doe`}
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
                Additional Information & Prayer Requests
              </h2>
              <p className="text-xs text-slate-500">
                Optional requirements to assist our hospitality and intercessory teams
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Special Requirements (Accommodation Assistance, Dietary, Accessibility, Translation)
              </label>
              <textarea
                rows={2}
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder="e.g. Seeking hotel recommendations near venue, wheelchair access needed for associate minister..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Personal / Ministry Prayer Requests (Kept in Confidence with the Intercessory Presbytery)
              </label>
              <textarea
                rows={2}
                value={prayerRequests}
                onChange={(e) => setPrayerRequests(e.target.value)}
                placeholder="e.g. Divine direction for upcoming church building project, spiritual breakthrough..."
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
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white text-base font-bold rounded-xl shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Accreditation...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Complete Registration & Generate Letter</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
