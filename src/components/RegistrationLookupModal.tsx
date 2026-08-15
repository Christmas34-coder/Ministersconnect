import React, { useState } from 'react';
import {
  Search,
  X,
  FileText,
  BadgePercent,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Calendar,
  MapPin,
  Sparkles,
  Flame,
  ScanLine,
  Camera,
  Download,
} from 'lucide-react';
import { Registration } from '../types';
import { findRegistrationByIdOrEmail } from '../utils/storage';
import { BarcodeScannerModal } from './BarcodeScannerModal';

interface RegistrationLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRegistration: (reg: Registration) => void;
  onSelectBadge?: (reg: Registration) => void;
  initialQuery?: string;
  defaultMode?: 'badge' | 'letter';
}

export const RegistrationLookupModal: React.FC<RegistrationLookupModalProps> = ({
  isOpen,
  onClose,
  onSelectRegistration,
  onSelectBadge,
  initialQuery = '',
  defaultMode = 'badge',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Registration[]>(() => {
    if (initialQuery.trim()) {
      return findRegistrationByIdOrEmail(initialQuery);
    }
    return [];
  });
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery.trim()));
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const matches = findRegistrationByIdOrEmail(query);
    setResults(matches);
    setHasSearched(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs"
        onClick={onClose}
      >
        <div
          className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 relative border-b border-slate-800">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              aria-label="Close lookup modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BadgePercent className="w-4 h-4" />
              <span>Minister Accreditation & Badge Portal</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
              Download Minister Badge & Letter
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your Registration ID (e.g. MC-...), registered Email, Phone, or full Name to download your badge pass or confirmation letter.
            </p>
          </div>

          {/* Search Input Body */}
          <div className="p-5 sm:p-6 space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Registration ID (MC-...), Email, or Full Name..."
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition shadow-2xs"
                  autoFocus
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 sm:top-3.5" />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 sm:py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs sm:text-sm font-bold rounded-xl transition shadow-xs cursor-pointer shrink-0"
              >
                Find Records
              </button>
            </form>

            {/* Quick Camera Barcode / QR Scanner Trigger */}
            <div className="bg-amber-50/80 border border-amber-300/80 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                  <ScanLine className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Have a QR Code Pass?</h4>
                  <p className="text-[11px] text-slate-600">Scan instantly with your camera</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 shadow-2xs flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan QR</span>
              </button>
            </div>

            {/* Search Results */}
            {hasSearched && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Search Results ({results.length})
                  </h3>
                  <span className="text-[11px] text-amber-700 font-medium">
                    Click Download Badge or View Letter below
                  </span>
                </div>

                {results.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-800">No matching registration found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Please check the spelling or search using the email address you entered during registration.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {results.map((reg) => (
                      <div
                        key={reg.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-amber-400 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 border border-amber-400 shrink-0 flex items-center justify-center">
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
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-slate-900">
                                {reg.title} {reg.fullName}
                              </span>
                              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                                {reg.id}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 font-medium line-clamp-1">
                              {reg.programmeTitle}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {reg.churchName} • {reg.city}, {reg.country}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons for Minister */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {onSelectBadge && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectBadge(reg);
                                onClose();
                              }}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                              title="Download Accreditation Badge (PNG / PDF)"
                            >
                              <BadgePercent className="w-3.5 h-3.5" />
                              <span>Download Badge</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              onSelectRegistration(reg);
                              onClose();
                            }}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs flex items-center gap-1 transition cursor-pointer shadow-2xs"
                            title="View Official Confirmation Letter"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-400" />
                            <span>View Letter</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barcode / QR Camera Scanner Modal */}
      {isScannerOpen && (
        <BarcodeScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onViewLetter={(reg) => {
            setIsScannerOpen(false);
            if (defaultMode === 'badge' && onSelectBadge) {
              onSelectBadge(reg);
            } else {
              onSelectRegistration(reg);
            }
            onClose();
          }}
        />
      )}
    </>
  );
};
