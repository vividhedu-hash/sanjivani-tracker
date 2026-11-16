import React, { useEffect, useState } from 'react';
import { X, Printer, Download, ThermometerSnowflake, ShieldAlert, ArrowUpRight } from 'lucide-react';
import QRCode from 'qrcode';
import { ColdChainBox } from '../types';

interface QRLabelModalProps {
  box: ColdChainBox | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QRLabelModal: React.FC<QRLabelModalProps> = ({
  box,
  isOpen,
  onClose
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (box && isOpen) {
      QRCode.toDataURL(box.qrPayload, {
        width: 320,
        margin: 1,
        color: {
          dark: '#020617',
          light: '#ffffff'
        }
      })
      .then(url => setQrDataUrl(url))
      .catch(console.error);
    }
  }, [box, isOpen]);

  if (!isOpen || !box) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `SANJIVANI_QR_LABEL_${box.id}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in print:bg-white print:p-0">
      
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:border-none print:shadow-none print:max-w-none">
        
        {/* Header - Hidden on Print */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 print:hidden">
          <div className="flex items-center gap-2">
            <ThermometerSnowflake className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                Official Box Cold-Chain Label
              </h2>
              <p className="text-xs text-slate-400">
                Weatherproof physical asset sticker for box lid
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Physical Sticker Card */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-950/40 print:p-8">
          
          <div 
            id="printable-label"
            className="w-full max-w-sm rounded-2xl bg-white text-slate-950 p-6 shadow-2xl border-4 border-slate-950 space-y-4 print:shadow-none print:border-4 print:border-black"
          >
            {/* Sticker Top Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold text-sm">
                  SJ
                </div>
                <div>
                  <span className="font-heading font-black text-sm tracking-tight text-slate-950 block leading-tight">
                    SANJIVANI (संजीवनी)
                  </span>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-slate-600 uppercase block">
                    Smart Cold-Chain Box
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-400 uppercase">
                  WHO PQS
                </span>
              </div>
            </div>

            {/* QR Code Centrepiece */}
            <div className="flex flex-col items-center justify-center py-1">
              <div className="p-2 border-2 border-slate-900 rounded-xl bg-white">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Box QR Code" className="w-48 h-48" />
                ) : (
                  <div className="w-48 h-48 bg-slate-100 animate-pulse flex items-center justify-center text-xs font-mono">
                    Generating QR...
                  </div>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-600 mt-2 font-medium">
                SCAN WITH MOBILE CAMERA TO TRACK
              </span>
            </div>

            {/* Box ID & Temperature Strict Limits */}
            <div className="bg-slate-100 rounded-xl p-3 border border-slate-300 space-y-1.5 text-center">
              <div className="text-xl font-mono font-black tracking-widest text-slate-950">
                {box.id}
              </div>
              <div className="text-xs font-bold text-slate-800">
                {box.name}
              </div>
              <div className="inline-block text-[11px] font-mono font-bold px-3 py-1 rounded-md bg-cyan-100 text-cyan-950 border border-cyan-300">
                STRICT COLD STORAGE: +2.0°C TO +8.0°C
              </div>
            </div>

            {/* Physical Warning Strip */}
            <div className="pt-2 border-t-2 border-slate-950 flex items-center justify-between text-[9px] font-mono text-slate-700">
              <span className="flex items-center gap-1 font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                KEEP UPRIGHT • DO NOT FREEZE
              </span>
              <span>SEAL: {box.digitalSealHash.slice(0, 10)}</span>
            </div>

          </div>

        </div>

        {/* Modal Action Controls - Hidden on Print */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 print:hidden">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Physical Sticker</span>
          </button>
        </div>

      </div>

    </div>
  );
};
