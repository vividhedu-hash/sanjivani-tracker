import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  X, 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  ChevronRight, 
  Keyboard,
  RefreshCw,
  Search
} from 'lucide-react';
import { ColdChainBox } from '../types';
import QRCode from 'qrcode';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBoxScanned: (boxId: string) => void;
  availableBoxes: ColdChainBox[];
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onBoxScanned,
  availableBoxes
}) => {
  const [activeTab, setActiveTab] = useState<'CAMERA' | 'SAMPLES' | 'UPLOAD' | 'MANUAL'>('SAMPLES');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualId, setManualId] = useState('');
  const [sampleQRs, setSampleQRs] = useState<Record<string, string>>({});
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Generate QR images for sample boxes for the demo picker
  useEffect(() => {
    if (isOpen) {
      availableBoxes.forEach(box => {
        QRCode.toDataURL(box.qrPayload, {
          width: 160,
          margin: 1,
          color: { dark: '#0f172a', light: '#f8fafc' }
        }).then(url => {
          setSampleQRs(prev => ({ ...prev, [box.id]: url }));
        }).catch(console.error);
      });
    }
  }, [isOpen, availableBoxes]);

  // Clean up camera when modal closes or tab changes
  useEffect(() => {
    if (!isOpen || activeTab !== 'CAMERA') {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const stopCamera = async () => {
    if (html5QrCodeRef.current && cameraActive) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Camera stop error:', err);
      } finally {
        setCameraActive(false);
      }
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const qrScanner = new Html5Qrcode('qr-reader-container');
      html5QrCodeRef.current = qrScanner;

      await qrScanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          // Success callback
          handleDecodedPayload(decodedText);
        },
        (errorMessage) => {
          // QR code not detected in this frame, normal polling
        }
      );
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera start failed:', err);
      setCameraError(
        err?.message?.includes('Permission') 
          ? 'Camera permission denied. Please allow camera access in browser settings or use the Quick Sample Scanner tab.'
          : 'Unable to access camera or no webcam detected. You can use the Quick Sample Scanner or manual input!'
      );
      setCameraActive(false);
    }
  };

  // Parse decoded payload
  const handleDecodedPayload = (text: string) => {
    stopCamera();
    
    // Check if URL contains box ID: e.g. "#/box/SNJ-BX-9042" or "/box/SNJ-BX-9042"
    let extractedId = text.trim();
    if (text.includes('/box/')) {
      const parts = text.split('/box/');
      extractedId = parts[parts.length - 1].split('?')[0].split('&')[0];
    } else if (text.includes('id=')) {
      const match = text.match(/id=([A-Za-z0-9_-]+)/);
      if (match && match[1]) extractedId = match[1];
    }

    onBoxScanned(extractedId);
    onClose();
  };

  // Handle image upload scan
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const scanner = new Html5Qrcode('qr-reader-file-temp');
      const result = await scanner.scanFile(file, true);
      handleDecodedPayload(result);
    } catch (err) {
      alert('Could not decode a valid QR code from this image. Please try another image or use the Quick Sample buttons.');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      handleDecodedPayload(manualId.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      
      {/* Hidden container for file scanner */}
      <div id="qr-reader-file-temp" className="hidden" />

      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Scan Box QR Code
              </h2>
              <p className="text-xs text-slate-400">
                Identify box and launch its live cold-chain telemetry dashboard
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 text-xs font-medium">
          <button
            onClick={() => {
              stopCamera();
              setActiveTab('SAMPLES');
            }}
            className={`flex-1 py-3 px-3 text-center border-b-2 transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'SAMPLES'
                ? 'border-cyan-400 text-cyan-400 font-bold bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sample Demo QR (Instant)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('CAMERA');
              setTimeout(startCamera, 100);
            }}
            className={`flex-1 py-3 px-3 text-center border-b-2 transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'CAMERA'
                ? 'border-cyan-400 text-cyan-400 font-bold bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setActiveTab('UPLOAD');
            }}
            className={`flex-1 py-3 px-3 text-center border-b-2 transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'UPLOAD'
                ? 'border-cyan-400 text-cyan-400 font-bold bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setActiveTab('MANUAL');
            }}
            className={`flex-1 py-3 px-3 text-center border-b-2 transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'MANUAL'
                ? 'border-cyan-400 text-cyan-400 font-bold bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Enter Code</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* TAB 1: QUICK SAMPLE QR BOXES (Great for demoing without a camera!) */}
          {activeTab === 'SAMPLES' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-cyan-950/50 border border-cyan-800/60 text-xs text-cyan-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p>
                  <b>Instant 1-Click Scan:</b> Below are active Sanjivani boxes with their authentic physical QR tags. 
                  Click <b>"Scan This Box"</b> or scan the on-screen QR code with your mobile camera!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {availableBoxes.map((box) => (
                  <div
                    key={box.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      {sampleQRs[box.id] ? (
                        <img 
                          src={sampleQRs[box.id]} 
                          alt="QR" 
                          className="w-14 h-14 rounded-lg bg-white p-1 shrink-0" 
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-slate-800 flex items-center justify-center">
                          <QrCode className="w-8 h-8 text-cyan-400" />
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-xs text-cyan-400 group-hover:text-cyan-300">
                          {box.id}
                        </span>
                        <div className="text-[11px] font-semibold text-slate-200 line-clamp-1">
                          {box.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {box.internalTemp}°C • {box.destination.city}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDecodedPayload(box.id)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs border border-cyan-500/30 transition shrink-0 cursor-pointer"
                    >
                      Scan Box
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LIVE CAMERA SCANNER */}
          {activeTab === 'CAMERA' && (
            <div className="space-y-4 text-center">
              <div className="relative mx-auto max-w-sm rounded-xl overflow-hidden border border-slate-700 bg-black min-h-[260px] flex items-center justify-center">
                <div id="qr-reader-container" className="w-full"></div>

                {!cameraActive && !cameraError && (
                  <div className="text-slate-400 text-xs flex flex-col items-center gap-2 p-6">
                    <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                    <span>Initializing camera video feed...</span>
                  </div>
                )}
              </div>

              {cameraError ? (
                <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/80 text-red-300 text-xs text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">Camera Notice</span>
                    <span>{cameraError}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Point your device camera at the QR sticker on the Sanjivani box lid.
                </p>
              )}
            </div>
          )}

          {/* TAB 3: FILE UPLOAD */}
          {activeTab === 'UPLOAD' && (
            <div className="space-y-4 text-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-8 cursor-pointer bg-slate-950/40 hover:bg-slate-950/70 transition flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-200 block">
                    Click to browse QR code image
                  </span>
                  <span className="text-xs text-slate-500">
                    Supports PNG, JPG, WEBP, or SVG
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* TAB 4: MANUAL BOX ID INPUT */}
          {activeTab === 'MANUAL' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2 text-left">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Enter Box Tracking Identifier:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    placeholder="e.g. SNJ-BX-9042 or any custom Box ID"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    autoFocus
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Tip: You can enter any of the fleet IDs (like <b>SNJ-BX-9042</b>, <b>SNJ-BX-8104</b>) or type your own test ID!
                </p>
              </div>

              <button
                type="submit"
                disabled={!manualId.trim()}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-md transition cursor-pointer"
              >
                Track Box Details
              </button>
            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-500">
          <span>Sanjivani Optical Telemetry Gateway v2.4</span>
          <span>Encrypted ISO/IEC 18004</span>
        </div>

      </div>
    </div>
  );
};
