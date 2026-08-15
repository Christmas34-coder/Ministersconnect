import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Trash2, Check, AlertCircle, SwitchCamera } from 'lucide-react';

interface PassportPhotoSelectorProps {
  value?: string;
  onChange: (photoUrl: string) => void;
  label?: string;
  required?: boolean;
}

export const PassportPhotoSelector: React.FC<PassportPhotoSelectorProps> = ({
  value,
  onChange,
  label = 'Official Ministerial Passport / Identification Photo',
  required = false,
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
    setCountdown(null);
  };

  const startCamera = async (mode = facingMode) => {
    setCameraError(null);
    stopCamera();
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera capture is not supported by your current browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => {
          console.warn('Video play error:', err);
        });
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      let message = 'Unable to access camera. Please check permissions or upload a photo instead.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Camera permission was denied. Please allow camera access in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'No camera device found on this system.';
      }
      setCameraError(message);
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const switchCameraMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (isCameraActive) {
      startCamera(nextMode);
    }
  };

  const performCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    if (facingMode === 'user') {
      ctx.translate(400, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, startX, startY, size, size, 0, 0, 400, 400);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    onChange(dataUrl);
    stopCamera();
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          performCapture();
          return null;
        }
        return prev - 1;
      });
    }, 800);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, or WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo is too large. Please select an image under 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange(result);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const removePhoto = () => {
    onChange('');
    stopCamera();
  };

  return (
    <div id="passport-photo-selector-root" className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-800">
          {label} {required && <span className="text-amber-600">*</span>}
        </label>
        <span className="text-xs text-slate-500 font-medium">For Official Accreditation & Badge</span>
      </div>

      <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 transition-all">
        {value && !isCameraActive ? (
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-amber-500 shadow-md bg-slate-900 flex-shrink-0">
                <img src={value} alt="Minister Passport" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white rounded-full p-1 shadow-md border-2 border-white">
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-700 font-semibold text-sm">
                <Check className="w-4 h-4" />
                <span>Passport Photo Attached</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                This photo will be affixed to your Official Confirmation Letter, Accreditation QR Badge, and Ministerial Directory.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  id="btn-retake-camera"
                  onClick={() => startCamera()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-600" />
                  Retake with Camera
                </button>
                <button
                  type="button"
                  id="btn-change-upload"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  Upload Different
                </button>
                <button
                  type="button"
                  id="btn-remove-passport"
                  onClick={removePhoto}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : isCameraActive ? (
          <div className="space-y-4">
            <div className="relative mx-auto w-full max-w-xs aspect-square bg-slate-950 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-56 border-2 border-dashed border-amber-400/80 rounded-full flex flex-col items-center justify-center shadow-lg">
                  <span className="bg-slate-900/90 text-amber-300 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full mb-auto mt-2 shadow-xs">
                    Center Face Here
                  </span>
                </div>
              </div>
              {countdown !== null && (
                <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-amber-500 text-slate-950 text-4xl font-extrabold flex items-center justify-center">
                    {countdown}
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={switchCameraMode}
                title="Switch Camera (Front / Back)"
                className="absolute top-3 right-3 p-2 bg-slate-900/90 text-white rounded-full hover:bg-slate-800 transition-colors shadow-md border border-slate-700 cursor-pointer"
              >
                <SwitchCamera className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                id="btn-snap-photo"
                disabled={countdown !== null}
                onClick={capturePhoto}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md hover:from-amber-400 hover:to-amber-500 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                {countdown !== null ? `Capturing in ${countdown}...` : 'Capture Passport Photo'}
              </button>
              <button
                type="button"
                id="btn-cancel-camera"
                onClick={stopCamera}
                className="px-4 py-2.5 bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
            <p className="text-center text-xs text-slate-500">
              Look directly into the camera with good lighting.
            </p>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              isDragging
                ? 'border-amber-500 bg-amber-50/50'
                : 'border-slate-300 bg-white/70 hover:border-slate-400 hover:bg-white'
            }`}
          >
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100/80 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Take a Live Photo or Upload Passport</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-resolution headshot recommended for official accreditation ID & letterhead.
                </p>
              </div>
              {cameraError && (
                <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 text-left">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  id="btn-launch-camera"
                  onClick={() => startCamera()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-amber-400 text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  Take Photo with Camera
                </button>
                <span className="text-xs text-slate-400 font-medium">or</span>
                <button
                  type="button"
                  id="btn-browse-file"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  Browse Image File
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Supports JPG, PNG, WEBP up to 5MB. Drag & drop image directly here.
              </p>
            </div>
          </div>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
    </div>
  );
};
