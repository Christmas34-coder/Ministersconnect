import React, { useState } from 'react';
import { 
  Search, 
  X, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Sparkles,
  Flame,
  ScanLine,
  Camera
} from 'lucide-react';
import { Registration } from '../types';
import { findRegistrationByIdOrEmail } from '../utils/storage';
import { BarcodeScannerModal } from './BarcodeScannerModal';

interface RegistrationLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRegistration: (reg: Registration) => void;
}

export const RegistrationLookupModal: React.FC<RegistrationLookupModalProps> = ({
  isOpen,
  onClose,
  onSelectRegistration,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Registration[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
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
        className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div 
          className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>Accreditation Verification & Lookup</span>
            </div>
            <h2 className="text-xl font-bold font-serif text-white">
              Find Your Confirmation Letter & Credentials
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Search by Registration ID, Email, Name, or use your Camera to scan your QR code.
            </p>
          </div>

          {/* Search Input Body */}
          <div className="p-6 space-y-5">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Registration ID (e.g. MC-...), email or name..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  autoFocus
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition shadow-xs cursor-pointer shrink-0"
              >
                Search
              </button>
            </form>

            {/* Quick Camera Barcode / QR Scanner Trigger */}
            <div className="bg-amber-50/80 border border-amber-300/80 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Have a QR Code or Barcode Badge?</h4>
                  <p className="text-[11px] text-slate-600">Scan instantly with your device camera to load credentials</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shrink-0 shadow-2xs flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan QR</span>
              </button>
            </div>

            {/* Search Results */}
            {hasSearched && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Search Results ({results.length})
                </h3>

                {results.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-800">No matching registration found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Please verify the spelling or check your email for the correct Registration ID.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {results.map((reg) => (
                      <div
                        key={reg.id}
                        onClick={() => {
                          onSelectRegistration(reg);
                          onClose();
                        }}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-amber-50/50 hover:border-amber-300 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-900 border border-amber-400 shrink-0 flex items-center justify-center">
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
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900 group-hover:text-amber-800">
                                {reg.title} {reg.fullName}
                              </span>
                              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                                {reg.id}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {reg.programmeTitle} • {reg.churchName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 group-hover:translate-x-0.5 transition-transform shrink-0">
                          <span>View Letter</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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
            onSelectRegistration(reg);
            onClose();
          }}
        />
      )}
    </>
  );
};
