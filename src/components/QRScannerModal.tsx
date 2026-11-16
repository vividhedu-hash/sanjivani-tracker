import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  X, 
  Camera, 
  QrCode, 
  RefreshCw,
  Search,
  AlertCircle
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
  const [activeTab, setActiveTab] = useState<'CAMERA' | 'SAMPLES' | 'MANUAL'>('SAMPLES');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualId, setManualId] = useState('');
  const [sampleQRs, setSampleQRs] = useState<Record<string, string>>({});
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (isOpen) {
      availableBoxes.forEach(box => {
        QRCode.toDataURL(box.qrPayload, {
          width: 140,
          margin: 1,
          color: { dark: '#0f172a', light: '#ffffff' }
        }).then(url => {
          setSampleQRs(prev => ({ ...prev, [box.id]: url }));
        }).catch(console.error);
      });
    }
  }, [isOpen, availableBoxes]);

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
          fps: 12,
          qrbox: { width: 220, height: 220 }
        },
        (decodedText) => {
          handleDecodedPayload(decodedText);
        },
        () => {}
      );
      setCameraActive(true);
    } catch (err: any) {
      setCameraError('Camera access unavailable. You can use the Quick Sample or Enter Code tabs.');
      setCameraActive(false);
    }
  };

  const handleDecodedPayload = (text: string) => {
    stopCamera();
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

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      handleDecodedPayload(manualId.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      
      <div className="relative w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold text-white font-mono">
              Scan Box QR Tag
            </h2>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950 text-xs font-mono">
          <button
            onClick={() => {
              stopCamera();
              setActiveTab('SAMPLES');
            }}
            className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
              activeTab === 'SAMPLES'
                ? 'border-teal-400 text-teal-400 font-bold bg-slate-900'
                : 'border-transparent text-slate-400'
            }`}
          >
            Sample Boxes
          </button>

          <button
            onClick={() => {
              setActiveTab('CAMERA');
              setTimeout(startCamera, 100);
            }}
            className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
              activeTab === 'CAMERA'
                ? 'border-teal-400 text-teal-400 font-bold bg-slate-900'
                : 'border-transparent text-slate-400'
            }`}
          >
            Live Camera
          </button>

          <button
            onClick={() => {
              stopCamera();
              setActiveTab('MANUAL');
            }}
            className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
              activeTab === 'MANUAL'
                ? 'border-teal-400 text-teal-400 font-bold bg-slate-900'
                : 'border-transparent text-slate-400'
            }`}
          >
            Enter ID
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto space-y-3">
          
          {/* TAB 1: SAMPLES */}
          {activeTab === 'SAMPLES' && (
            <div className="space-y-2.5">
              <p className="text-[11px] text-slate-400">
                Tap any box to simulate scanning its physical QR code tag:
              </p>

              <div className="space-y-2">
                {availableBoxes.map((box) => (
                  <div
                    key={box.id}
                    onClick={() => handleDecodedPayload(box.id)}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 active:bg-slate-800 transition flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      {sampleQRs[box.id] ? (
                        <img src={sampleQRs[box.id]} alt="QR" className="w-10 h-10 rounded bg-white p-0.5 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-slate-800" />
                      )}
                      <div>
                        <div className="font-mono font-bold text-xs text-teal-400">{box.id}</div>
                        <div className="text-[11px] text-slate-200 line-clamp-1">{box.name}</div>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 shrink-0">
                      Scan →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LIVE CAMERA */}
          {activeTab === 'CAMERA' && (
            <div className="space-y-3 text-center">
              <div className="relative mx-auto max-w-xs rounded-xl overflow-hidden border border-slate-700 bg-black min-h-[220px] flex items-center justify-center">
                <div id="qr-reader-container" className="w-full"></div>

                {!cameraActive && !cameraError && (
                  <div className="text-slate-400 text-xs flex flex-col items-center gap-2 p-6">
                    <RefreshCw className="w-5 h-5 animate-spin text-teal-400" />
                    <span>Opening camera...</span>
                  </div>
                )}
              </div>

              {cameraError ? (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-xs text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{cameraError}</span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Align the QR sticker inside the viewfinder frame.
                </p>
              )}
            </div>
          )}

          {/* TAB 3: MANUAL INPUT */}
          {activeTab === 'MANUAL' && (
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-mono text-slate-400 uppercase">
                  Box Identifier
                </label>
                <input
                  type="text"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  placeholder="e.g. SNJ-BX-9042"
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={!manualId.trim()}
                className="w-full py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Open Box Dashboard
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
