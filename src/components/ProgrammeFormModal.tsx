import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  BookOpen, 
  Users, 
  Clock, 
  Mail, 
  Phone,
  AlertCircle
} from 'lucide-react';
import { Programme, Speaker, ScheduleItem } from '../types';

interface ProgrammeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (programmeData: Omit<Programme, 'id' | 'registeredCount'>) => void;
  programmeToEdit?: Programme | null;
}

const CATEGORIES = [
  'Conferences',
  'Leadership Summits',
  'Ministers Retreats',
  'Pastoral Workshops',
  'Worship Conclaves',
  'Youth Summits',
];

const DEFAULT_BANNER_PRESETS = [
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
];

export const ProgrammeFormModal: React.FC<ProgrammeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  programmeToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [scripture, setScripture] = useState('');
  const [category, setCategory] = useState('Conferences');
  const [bannerUrl, setBannerUrl] = useState(DEFAULT_BANNER_PRESETS[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('09:00 AM Daily');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [capacity, setCapacity] = useState<number>(500);
  const [description, setDescription] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [contactEmail, setContactEmail] = useState('secretariat@ministersconnect.org');
  const [contactPhone, setContactPhone] = useState('+234 803 123 4567');
  const [isFree, setIsFree] = useState(true);
  const [registrationFee, setRegistrationFee] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'upcoming' | 'ongoing' | 'completed' | 'cancelled'>('upcoming');

  // Speakers
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [newSpeakerName, setNewSpeakerName] = useState('');
  const [newSpeakerRole, setNewSpeakerRole] = useState('');
  const [newSpeakerMinistry, setNewSpeakerMinistry] = useState('');

  // Schedule Items
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [newScheduleTime, setNewScheduleTime] = useState('');
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const [newScheduleSpeaker, setNewScheduleSpeaker] = useState('');

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (programmeToEdit) {
      setTitle(programmeToEdit.title);
      setTheme(programmeToEdit.theme);
      setScripture(programmeToEdit.scripture);
      setCategory(programmeToEdit.category);
      setBannerUrl(programmeToEdit.bannerUrl);
      setStartDate(programmeToEdit.startDate);
      setEndDate(programmeToEdit.endDate);
      setTime(programmeToEdit.time);
      setVenue(programmeToEdit.venue);
      setCity(programmeToEdit.city);
      setCountry(programmeToEdit.country);
      setCapacity(programmeToEdit.capacity);
      setDescription(programmeToEdit.description);
      setRegistrationDeadline(programmeToEdit.registrationDeadline);
      setContactEmail(programmeToEdit.contactEmail);
      setContactPhone(programmeToEdit.contactPhone);
      setIsFree(programmeToEdit.isFree);
      setRegistrationFee(programmeToEdit.registrationFee || '');
      setIsFeatured(programmeToEdit.isFeatured || false);
      setStatus(programmeToEdit.status);
      setSpeakers(programmeToEdit.speakers || []);
      setSchedule(programmeToEdit.schedule || []);
    } else {
      // Reset defaults
      setTitle('');
      setTheme('');
      setScripture('');
      setCategory('Conferences');
      setBannerUrl(DEFAULT_BANNER_PRESETS[0]);
      setStartDate('');
      setEndDate('');
      setTime('09:00 AM & 05:00 PM Daily');
      setVenue('Grace International Convention Grounds');
      setCity('Lagos');
      setCountry('Nigeria');
      setCapacity(500);
      setDescription('');
      setRegistrationDeadline('');
      setContactEmail('secretariat@ministersconnect.org');
      setContactPhone('+234 803 123 4567');
      setIsFree(true);
      setRegistrationFee('');
      setIsFeatured(false);
      setStatus('upcoming');
      setSpeakers([]);
      setSchedule([]);
    }
  }, [programmeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddSpeaker = () => {
    if (!newSpeakerName.trim()) return;
    const newSpk: Speaker = {
      id: `spk-${Date.now()}`,
      name: newSpeakerName.trim(),
      role: newSpeakerRole.trim() || 'Guest Speaker',
      ministry: newSpeakerMinistry.trim() || 'Kingdom Ministry',
    };
    setSpeakers([...speakers, newSpk]);
    setNewSpeakerName('');
    setNewSpeakerRole('');
    setNewSpeakerMinistry('');
  };

  const handleRemoveSpeaker = (id: string) => {
    setSpeakers(speakers.filter((s) => s.id !== id));
  };

  const handleAddScheduleItem = () => {
    if (!newScheduleTitle.trim()) return;
    const newItem: ScheduleItem = {
      id: `sch-${Date.now()}`,
      time: newScheduleTime.trim() || 'Session',
      sessionTitle: newScheduleTitle.trim(),
      speaker: newScheduleSpeaker.trim() || undefined,
    };
    setSchedule([...schedule, newItem]);
    setNewScheduleTime('');
    setNewScheduleTitle('');
    setNewScheduleSpeaker('');
  };

  const handleRemoveScheduleItem = (id: string) => {
    setSchedule(schedule.filter((s) => s.id !== id));
  };

  const handleFileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setBannerUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Programme title is required';
    if (!theme.trim()) newErrors.theme = 'Theme is required';
    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!endDate) newErrors.endDate = 'End date is required';
    if (!venue.trim()) newErrors.venue = 'Venue is required';
    if (!city.trim()) newErrors.city = 'City is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      title: title.trim(),
      theme: theme.trim(),
      scripture: scripture.trim() || 'Ephesians 4:11-12',
      category,
      bannerUrl: bannerUrl || DEFAULT_BANNER_PRESETS[0],
      startDate,
      endDate,
      time: time.trim(),
      venue: venue.trim(),
      city: city.trim(),
      country: country.trim(),
      speakers,
      schedule,
      description: description.trim() || `${title} - Convocation for equipping and spiritual refreshment.`,
      capacity: Number(capacity) || 500,
      isFeatured,
      status,
      registrationDeadline: registrationDeadline || startDate,
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      isFree,
      registrationFee: isFree ? undefined : registrationFee.trim(),
      materialsIncluded: ['Ministerial Conference Manual', 'Executive Accreditation Badge', 'Lunch Refreshments', 'Certificate of Participation'],
    });

    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              Secretariat Programme Desk
            </span>
            <h2 className="text-xl font-bold font-serif">
              {programmeToEdit ? 'Edit Programme Details' : 'Create New Ministry Programme'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-sm">
          {/* Basic Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1">
              1. General Convocation Information
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Programme Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Annual Global Ministers Conference 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 font-medium"
              />
              {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Convocation Theme <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. Ignited for Supernatural Exploits"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
                {errors.theme && <p className="text-xs text-red-600 mt-1">{errors.theme}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Scriptural Anchor Verse
              </label>
              <input
                type="text"
                value={scripture}
                onChange={(e) => setScripture(e.target.value)}
                placeholder='e.g. Daniel 11:32b — "The people who know their God shall be strong..."'
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Description & Objectives
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive summary of the programme, focus areas, and ministerial takeaways..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Logistics & Dates */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1">
              2. Dates, Location & Capacity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Daily Time / Schedule
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="08:30 AM & 05:00 PM Daily"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Venue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Grace Convention Auditorium"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Lagos"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Total Delegate Capacity
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Banner Image Selection */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1">
              3. Programme Banner Image
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-48 h-28 rounded-xl bg-slate-900 overflow-hidden border border-slate-300 shrink-0">
                <img
                  src={bannerUrl}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 space-y-3 w-full">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-xs">
                    Banner Image URL or Choose Preset
                  </label>
                  <input
                    type="text"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer text-slate-700 inline-flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Upload Local Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Speakers & Ministers */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                4. Speakers & Guest Ministers ({speakers.length})
              </h3>
            </div>

            {/* List current speakers */}
            {speakers.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {speakers.map((s) => (
                  <div key={s.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{s.name}</span>
                      <span className="text-xs text-slate-500">{s.role} • {s.ministry}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpeaker(s.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add speaker mini form */}
            <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                value={newSpeakerName}
                onChange={(e) => setNewSpeakerName(e.target.value)}
                placeholder="Minister's Name"
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
              <input
                type="text"
                value={newSpeakerRole}
                onChange={(e) => setNewSpeakerRole(e.target.value)}
                placeholder="Role / Title"
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
              <input
                type="text"
                value={newSpeakerMinistry}
                onChange={(e) => setNewSpeakerMinistry(e.target.value)}
                placeholder="Church / Ministry"
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddSpeaker}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Speaker
              </button>
            </div>
          </div>

          {/* Schedule Outline */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              5. Session Schedule Breakdown ({schedule.length})
            </h3>

            {schedule.length > 0 && (
              <div className="space-y-1.5">
                {schedule.map((item) => (
                  <div key={item.id} className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        {item.time}
                      </span>
                      <span className="font-semibold text-slate-800">{item.sessionTitle}</span>
                      {item.speaker && <span className="text-slate-500">({item.speaker})</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveScheduleItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Schedule item mini form */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                value={newScheduleTime}
                onChange={(e) => setNewScheduleTime(e.target.value)}
                placeholder="Time (e.g. 09:00 AM)"
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
              <input
                type="text"
                value={newScheduleTitle}
                onChange={(e) => setNewScheduleTitle(e.target.value)}
                placeholder="Session Topic / Activity"
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs sm:col-span-2"
              />
              <button
                type="button"
                onClick={handleAddScheduleItem}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Session
              </button>
            </div>
          </div>

          {/* Admin Feature Flags */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <span className="text-xs font-semibold text-slate-800">Highlight as Featured Convocation on Home</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Status:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs bg-white"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Sticky Modal Bottom Action */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-md transition cursor-pointer"
            >
              {programmeToEdit ? 'Save Programme Changes' : 'Publish Programme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
