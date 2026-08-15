import React, { useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCcw, Share2, Sparkles, Check, Phone, MapPin, Calendar, Flame } from 'lucide-react';
import { MINISTERS_CONNECT_FLIER_PORTRAIT } from '../assets/flierImage';

interface FlyerPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlyerPosterModal: React.FC<FlyerPosterModalProps> = ({ isOpen, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = MINISTERS_CONNECT_FLIER_PORTRAIT;
    link.download = 'Ministers_Connect_Reigning_In_The_Storm_Flier.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="bg-slate-900 w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-serif">
                Ministers Connect — Reigning in the Storm
              </h3>
              <p className="text-[11px] text-slate-400">
                Official Programme Flyer • Third Friday 21st – 22nd August 2026 • Maitama, Abuja
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-300 px-2">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save Flyer</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition border border-slate-700 cursor-pointer"
              title="Share Programme Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition border border-slate-700 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Flyer Stage */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-950/60 flex items-center justify-center">
          <div
            className="transition-transform duration-200 ease-out origin-center shadow-2xl rounded-2xl overflow-hidden bg-white max-w-lg w-full border border-slate-700"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={MINISTERS_CONNECT_FLIER_PORTRAIT}
              alt="Ministers Connect - Reigning in the Storm Flyer"
              className="w-full h-auto object-contain block select-none"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Modal Footer Strip */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>21st–22nd Aug 2026</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Maitama, Abuja</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Host: Pastor John EZE</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Phone className="w-3.5 h-3.5 text-sky-400" />
            <span>Enquiries: <strong className="text-white">09110376410 | 08131587655 | 070 31216586</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
