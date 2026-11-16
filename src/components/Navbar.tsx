import React, { useState } from 'react';
import { 
  Package, 
  QrCode, 
  Search, 
  ShieldCheck, 
  PlusCircle, 
  ThermometerSnowflake, 
  Radio, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ColdChainBox } from '../types';

interface NavbarProps {
  boxes: ColdChainBox[];
  selectedBox: ColdChainBox | null;
  onSelectBox: (box: ColdChainBox) => void;
  onBackToFleet: () => void;
  onOpenScanner: () => void;
  onOpenNewBoxModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  boxes,
  selectedBox,
  onSelectBox,
  onBackToFleet,
  onOpenScanner,
  onOpenNewBoxModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredBoxes = searchQuery.trim() === '' ? [] : boxes.filter(b => 
    b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.destination.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchResultClick = (box: ColdChainBox) => {
    onSelectBox(box);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const activeCount = boxes.filter(b => b.status === 'IN_TRANSIT').length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onBackToFleet}>
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-slate-950">
            <ThermometerSnowflake className="w-6 h-6 stroke-[2.2] text-white" />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                SANJIVANI
              </span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                Cold-Chain Fleet
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Smart PCM–Peltier Box Telemetry & Tracking System
            </p>
          </div>
        </div>

        {/* Center Breadcrumb or Live Status Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold">{activeCount} Boxes Active</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400">100% Telemetry Online</span>
          {selectedBox && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                {selectedBox.id}
              </span>
            </>
          )}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5">
          
          {/* Quick Search */}
          <div className="relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search Box ID or Cargo..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-40 sm:w-56 pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 pointer-events-none" />
            </div>

            {/* Search Dropdown */}
            {isSearchOpen && filteredBoxes.length > 0 && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs"
                onMouseLeave={() => setIsSearchOpen(false)}
              >
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 py-1 mb-1 border-b border-slate-800">
                  Matching Boxes ({filteredBoxes.length})
                </div>
                {filteredBoxes.map(box => (
                  <div
                    key={box.id}
                    onClick={() => handleSearchResultClick(box)}
                    className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-mono font-bold text-cyan-400 group-hover:text-cyan-300">
                        {box.id}
                      </div>
                      <div className="text-slate-300 text-[11px] truncate max-w-[180px]">
                        {box.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {box.destination.city}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block font-mono text-[11px] font-bold px-1.5 py-0.5 rounded ${
                        box.internalTemp >= 2 && box.internalTemp <= 8
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-red-950 text-red-300 border border-red-800'
                      }`}>
                        {box.internalTemp}°C
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Register New Box Button */}
          <button
            onClick={onOpenNewBoxModal}
            title="Register New Cold-Chain Box"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>New Box</span>
          </button>

          {/* Primary CTA: Scan Box QR */}
          <button
            onClick={onOpenScanner}
            className="relative group inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 shadow-md shadow-cyan-500/25 transition-all transform active:scale-95 cursor-pointer"
          >
            <QrCode className="w-4 h-4 stroke-[2.3] transition-transform group-hover:rotate-6" />
            <span>Scan Box QR</span>
            <span className="hidden lg:inline-block text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded-full font-mono font-bold">
              Instant
            </span>
          </button>

        </div>

      </div>
    </header>
  );
};
