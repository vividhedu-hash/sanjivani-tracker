import React, { useState, useEffect } from 'react';
import { ColdChainBox } from './types';
import { INITIAL_BOXES, generateBoxById } from './data/mockBoxes';
import { Navbar } from './components/Navbar';
import { FleetDashboard } from './components/FleetDashboard';
import { BoxDetailView } from './components/BoxDetailView';
import { QRScannerModal } from './components/QRScannerModal';
import { QRLabelModal } from './components/QRLabelModal';
import { NewBoxModal } from './components/NewBoxModal';

export const App: React.FC = () => {
  const [boxes, setBoxes] = useState<ColdChainBox[]>(() => {
    const saved = localStorage.getItem('sanjivani_boxes_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_BOXES;
      }
    }
    return INITIAL_BOXES;
  });

  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isNewBoxModalOpen, setIsNewBoxModalOpen] = useState(false);
  const [qrLabelBox, setQrLabelBox] = useState<ColdChainBox | null>(null);

  useEffect(() => {
    localStorage.setItem('sanjivani_boxes_v2', JSON.stringify(boxes));
  }, [boxes]);

  // Handle URL hash routing (#/box/SNJ-BX-9042)
  useEffect(() => {
    const handleUrlRoute = () => {
      const hash = window.location.hash;
      const search = window.location.search;

      let targetId: string | null = null;

      if (hash.startsWith('#/box/')) {
        targetId = hash.replace('#/box/', '').trim();
      } else if (search.includes('box=')) {
        const params = new URLSearchParams(search);
        targetId = params.get('box');
      }

      if (targetId) {
        const found = boxes.find(b => b.id.toUpperCase() === targetId!.toUpperCase());
        if (found) {
          setSelectedBoxId(found.id);
        } else {
          const generated = generateBoxById(targetId);
          setBoxes(prev => [generated, ...prev.filter(b => b.id !== generated.id)]);
          setSelectedBoxId(generated.id);
        }
      } else {
        setSelectedBoxId(null);
      }
    };

    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    return () => window.removeEventListener('hashchange', handleUrlRoute);
  }, []);

  const handleSelectBox = (box: ColdChainBox) => {
    setSelectedBoxId(box.id);
    window.location.hash = `#/box/${box.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToFleet = () => {
    setSelectedBoxId(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBoxScanned = (scannedId: string) => {
    const cleanId = scannedId.trim().toUpperCase();
    const existing = boxes.find(b => b.id.toUpperCase() === cleanId);

    if (existing) {
      handleSelectBox(existing);
    } else {
      const newBox = generateBoxById(cleanId);
      setBoxes(prev => [newBox, ...prev]);
      handleSelectBox(newBox);
    }
  };

  const handleUpdateBox = (updated: ColdChainBox) => {
    setBoxes(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const handleAddBox = (newBox: ColdChainBox) => {
    setBoxes(prev => [newBox, ...prev]);
    handleSelectBox(newBox);
  };

  // Subtle telemetry tick
  useEffect(() => {
    const interval = setInterval(() => {
      setBoxes(prev => prev.map(b => {
        if (b.status === 'DELIVERED') return b;
        const delta = (Math.random() - 0.5) * 0.06;
        const newTemp = Number((b.internalTemp + delta).toFixed(1));
        return {
          ...b,
          internalTemp: Math.max(2.1, Math.min(7.9, newTemp))
        };
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const activeSelectedBox = boxes.find(b => b.id === selectedBoxId) || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        boxes={boxes}
        selectedBox={activeSelectedBox}
        onSelectBox={handleSelectBox}
        onBackToFleet={handleBackToFleet}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenNewBoxModal={() => setIsNewBoxModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {activeSelectedBox ? (
          <BoxDetailView
            box={activeSelectedBox}
            onBack={handleBackToFleet}
            onOpenQRLabel={(box) => setQrLabelBox(box)}
            onUpdateBox={handleUpdateBox}
          />
        ) : (
          <FleetDashboard
            boxes={boxes}
            onSelectBox={handleSelectBox}
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenQRLabel={(box) => setQrLabelBox(box)}
            onOpenNewBoxModal={() => setIsNewBoxModalOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onBoxScanned={handleBoxScanned}
        availableBoxes={boxes}
      />

      <QRLabelModal
        box={qrLabelBox}
        isOpen={!!qrLabelBox}
        onClose={() => setQrLabelBox(null)}
      />

      <NewBoxModal
        isOpen={isNewBoxModalOpen}
        onClose={() => setIsNewBoxModalOpen(false)}
        onAddBox={handleAddBox}
      />

      {/* Clean Utility Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 px-4 text-center text-[11px] text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SANJIVANI • Sensor-Triggered PCM–Peltier Medical Cold-Chain</span>
          <span>Senior Bal Vigyan 2026–2027</span>
        </div>
      </footer>

    </div>
  );
};

export default App;
