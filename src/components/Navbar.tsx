import React, { useState } from 'react';
import { 
  QrCode, 
  Search, 
  X, 
  ChevronRight,
  Plus
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2.5">
        
        {/* Left: Brand */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none py-1"
          onClick={onBackToFleet}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal-600 flex items-center justify-center font-heading font-black text-white text-sm tracking-wider shadow-sm">
            SJ
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-base sm:text-lg text-white tracking-tight">
                SANJIVANI
              </span>
              <span className="text-[10px] font-mono font-semibold text-teal-400 bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-800/60 hidden sm:inline-block">
                Cold-Chain
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block -mt-0.5">
              PCM–Peltier Box Telemetry
            </p>
          </div>
        </div>

        {/* Center: Mobile Breadcrumb or Status */}
        {selectedBox ? (
          <div 
            onClick={onBackToFleet}
            className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white cursor-pointer truncate max-w-[140px] sm:max-w-xs"
          >
            <span className="text-slate-500 hidden sm:inline">Fleet</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
            <span className="text-teal-400 font-bold truncate">{selectedBox.id}</span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-200 font-medium">{activeCount} In Transit</span>
            <span className="text-slate-600">•</span>
            <span>4G Online</span>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          
          {/* Search Toggle / Input */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="fixed inset-x-0 top-0 h-14 bg-slate-900 border-b border-slate-700 px-4 flex items-center gap-2 z-50 sm:static sm:h-auto sm:bg-transparent sm:border-none sm:p-0">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search Box ID or cargo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 sm:w-52 py-1.5 px-2 bg-transparent sm:bg-slate-900 sm:border sm:border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                title="Search"
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center gap-1.5 text-xs transition"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline text-slate-400">Search</span>
              </button>
            )}

            {/* Dropdown Results */}
            {isSearchOpen && filteredBoxes.length > 0 && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs">
                {filteredBoxes.map(box => (
                  <div
                    key={box.id}
                    onClick={() => handleSearchResultClick(box)}
                    className="p-2.5 hover:bg-slate-800 rounded-lg cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <div className="font-mono font-bold text-teal-400">{box.id}</div>
                      <div className="text-slate-300 text-[11px] truncate max-w-[170px]">{box.name}</div>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      {box.internalTemp}°C
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New Box Button (Desktop) */}
          <button
            onClick={onOpenNewBoxModal}
            title="Register Box"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            <Plus className="w-3.5 h-3.5 text-teal-400" />
            <span>Add Box</span>
          </button>

          {/* Scan QR Code Button (Primary Mobile & Desktop CTA) */}
          <button
            onClick={onOpenScanner}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 transition active:scale-95 cursor-pointer shadow-sm"
          >
            <QrCode className="w-4 h-4 stroke-[2.2]" />
            <span>Scan QR</span>
          </button>

        </div>

      </div>
    </header>
  );
};
