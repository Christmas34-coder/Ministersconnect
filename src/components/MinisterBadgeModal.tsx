import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  Sparkles,
  Award,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { Registration, Programme } from '../types';

interface MinisterBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: Registration | null;
  programme?: Programme;
}

export const MinisterBadgeModal: React.FC<MinisterBadgeModalProps> = ({
  isOpen,
  onClose,
  registration,
  programme,
}) => {
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen || !registration) return null;

  const qrPayload = registration.qrCodeData || `${registration.id}|${registration.title} ${registration.fullName}|${registration.churchName}|${registration.programmeId}`;

  const copyRegId = () => {
    navigator.clipboard.writeText(registration.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrintBadge = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!badgeRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const canvas = await html2canvas(badgeRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100, 150], // Standard lanyard badge dimensions
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 100, 150);
      pdf.save(`Minister_Badge_${registration.id}.pdf`);
    } catch (err) {
      console.error('Badge PDF generation error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        id="minister-badge-modal-card"
        className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Modal Top Bar */}
        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800 text-white">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold tracking-wide">
              Official Ministerial Accreditation Badge
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Badge View */}
        <div className="p-6 overflow-y-auto flex flex-col items-center justify-center space-y-6">
          {/* Printable Badge Container (Sized 100mm x 150mm ratio) */}
          <div
            ref={badgeRef}
            id="printable-delegate-badge"
            className="w-full max-w-[340px] bg-white text-slate-900 rounded-2xl shadow-2xl border-4 border-slate-900 overflow-hidden relative flex flex-col font-sans"
          >
            {/* Lanyard Hole Guide */}
            <div className="bg-slate-900 h-7 flex items-center justify-center">
              <div className="w-16 h-2 rounded-full bg-slate-700/80 border border-slate-600" />
            </div>

            {/* Badge Header with Crest */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-3 text-center text-white relative">
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-xs">
                  ✝
                </div>
                <span className="font-extrabold text-sm tracking-wider uppercase text-amber-400">
                  Ministers Connect
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-widest text-slate-300 font-semibold mt-0.5">
                Official Delegate Accreditation Pass
              </p>
              <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[8px] font-black uppercase rounded-xs">
                {registration.status === 'vip' ? 'VIP' : 'DELEGATE'}
              </div>
            </div>

            {/* Photo & Delegate Identification */}
            <div className="p-4 flex flex-col items-center text-center space-y-3 bg-gradient-to-b from-white to-slate-50">
              {/* Passport Photo Frame */}
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-3 border-amber-500 shadow-md bg-slate-900">
                  {registration.passportPhotoUrl ? (
                    <img
                      src={registration.passportPhotoUrl}
                      alt={registration.fullName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-amber-400 bg-slate-800">
                      <span className="text-3xl font-black">{registration.fullName.charAt(0)}</span>
                      <span className="text-[9px] text-slate-400 uppercase mt-1">Minister</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-1 bg-emerald-600 text-white rounded-full p-1 border-2 border-white shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Minister Title & Name */}
              <div className="space-y-0.5">
                <span className="inline-block text-[11px] font-extrabold text-amber-700 uppercase tracking-wider">
                  {registration.title}
                </span>
                <h2 className="text-lg font-black text-slate-900 leading-tight">
                  {registration.fullName}
                </h2>
                <p className="text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1">
                  <Building className="w-3 h-3 text-amber-600 flex-shrink-0" />
                  <span className="truncate max-w-[240px]">{registration.churchName}</span>
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {registration.ministerialPosition}
                </p>
              </div>

              {/* Programme Section */}
              <div className="w-full bg-slate-100 rounded-xl p-2.5 border border-slate-200 text-left space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
                  Enrolled Convocation
                </span>
                <p className="text-[11px] font-black text-slate-900 line-clamp-1">
                  {registration.programmeTitle}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-600 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {registration.city}, {registration.country}
                  </span>
                  <span className="font-bold text-amber-800">
                    {registration.attendeesCount} Delegate(s)
                  </span>
                </div>
              </div>

              {/* QR Code & Barcode Section */}
              <div className="w-full pt-1 flex flex-col items-center space-y-2">
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-center">
                  <QRCodeSVG
                    value={qrPayload}
                    size={96}
                    level="H"
                    includeMargin={false}
                    fgColor="#0f172a"
                  />
                </div>

                {/* Simulated 1D Barcode */}
                <div className="w-full px-2 space-y-0.5 text-center">
                  <div className="h-6 bg-slate-900 rounded-xs flex items-center justify-center px-2 py-0.5">
                    <div className="w-full h-full flex justify-between items-center opacity-85">
                      {[1,3,2,4,1,2,4,3,1,4,2,3,1,2,4,1,3,2,4,1,2,3,4,1,2,3,4,1,3,2].map((w, idx) => (
                        <div
                          key={idx}
                          style={{ width: `${w}px` }}
                          className="h-full bg-white"
                        />
                      ))}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] font-black tracking-widest text-slate-700 block">
                    {registration.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Badge Footer */}
            <div className="bg-slate-900 text-slate-300 text-[8px] uppercase tracking-wider py-1.5 px-3 text-center border-t border-slate-800 flex items-center justify-between">
              <span>Official Accreditation Pass</span>
              <span className="text-amber-400 font-bold">2026/2027</span>
            </div>
          </div>

          {/* Quick Actions Under Badge */}
          <div className="w-full flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              id="btn-print-badge"
              onClick={handlePrintBadge}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-md hover:bg-slate-100 transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-600" />
              Print Accreditation Badge
            </button>

            <button
              type="button"
              id="btn-download-badge-pdf"
              disabled={isGeneratingPdf}
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPdf ? 'Generating PDF...' : 'Download Badge PDF'}
            </button>

            <button
              type="button"
              onClick={copyRegId}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedId ? 'Copied ID' : 'Copy ID'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
