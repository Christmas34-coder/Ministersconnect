import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  User, 
  Church, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Users, 
  Plus, 
  Trash2, 
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { 
  Registration, 
  MinisterialTitle, 
  MinisterialPosition, 
  RegistrationStatus,
  Programme 
} from '../types';

interface MinisterEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: Registration | null;
  programmes: Programme[];
  onSave: (updatedRegistration: Registration) => void;
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

export const MinisterEditModal: React.FC<MinisterEditModalProps> = ({
  isOpen,
  onClose,
  registration,
  programmes,
  onSave,
}) => {
  const [formData, setFormData] = useState<Registration | null>(null);
  const [newAttendeeName, setNewAttendeeName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (registration) {
      setFormData({ ...registration });
    } else {
      setFormData(null);
    }
  }, [registration, isOpen]);

  if (!isOpen || !formData) return null;

  const handleChange = <K extends keyof Registration>(key: K, value: Registration[K]) => {
    setFormData((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const handleAddAttendeeName = () => {
    if (!newAttendeeName.trim() || !formData) return;
    const updated = [...(formData.attendeeNames || []), newAttendeeName.trim()];
    setFormData({
      ...formData,
      attendeeNames: updated,
      attendeesCount: Math.max(formData.attendeesCount, updated.length + 1),
    });
    setNewAttendeeName('');
  };

  const handleRemoveAttendeeName = (index: number) => {
    if (!formData) return;
    const updated = (formData.attendeeNames || []).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      attendeeNames: updated,
      attendeesCount: Math.max(1, updated.length + 1),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Minister Accreditation Record
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                {formData.id}
              </span>
            </div>
            <h2 className="text-xl font-bold font-serif mt-1">
              Edit Minister Registration Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-sm">
          {/* Status & Programme Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Accreditation Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as RegistrationStatus)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="confirmed">Confirmed / Accredited</option>
                <option value="vip">VIP Minister / Key Delegate</option>
                <option value="checked_in">Checked In at Secretariat</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assigned Programme
              </label>
              <select
                value={formData.programmeId}
                onChange={(e) => {
                  const selected = programmes.find((p) => p.id === e.target.value);
                  handleChange('programmeId', e.target.value);
                  if (selected) {
                    handleChange('programmeTitle', selected.title);
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                {programmes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Personal & Ministerial Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-600" />
              <span>Minister Identity & Ministry</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
                <select
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value as MinisterialTitle)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  {MINISTERIAL_TITLES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Church / Ministry Name *</label>
                <input
                  type="text"
                  required
                  value={formData.churchName}
                  onChange={(e) => handleChange('churchName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Ministerial Position</label>
                <select
                  value={formData.ministerialPosition}
                  onChange={(e) => handleChange('ministerialPosition', e.target.value as MinisterialPosition)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  {MINISTERIAL_POSITIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-600" />
              <span>Contact & Location</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={formData.whatsapp || ''}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">State / Province</label>
                <input
                  type="text"
                  value={formData.state || ''}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Logistics & Attendees */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Delegation & Logistics</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Arrival Date</label>
                <input
                  type="date"
                  value={formData.arrivalDate}
                  onChange={(e) => handleChange('arrivalDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Departure Date</label>
                <input
                  type="date"
                  value={formData.departureDate || ''}
                  onChange={(e) => handleChange('departureDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Total Attendees Count</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.attendeesCount}
                  onChange={(e) => handleChange('attendeesCount', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-bold"
                />
              </div>
            </div>

            {/* Additional Delegate Names */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Accredited Delegation Names</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Pastor John Doe (Associate Pastor)"
                  value={newAttendeeName}
                  onChange={(e) => setNewAttendeeName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAttendeeName();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddAttendeeName}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {formData.attendeeNames && formData.attendeeNames.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  {formData.attendeeNames.map((name, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 shadow-2xs font-medium"
                    >
                      <span>{name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttendeeName(i)}
                        className="text-slate-400 hover:text-red-600 transition cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Secretariat Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Internal Secretariat Notes / Special Requests</label>
              <textarea
                rows={2}
                value={formData.notes || formData.specialRequirements || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Accommodation notes, dietary requirements, or protocol instructions..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                  <span>Changes Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Minister Details</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
