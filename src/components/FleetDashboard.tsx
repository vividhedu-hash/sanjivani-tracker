import React, { useState, useEffect } from 'react';
import { 
  BoxStatus, 
  ColdChainBox, 
  FleetStats 
} from '../types';
import { 
  Thermometer, 
  Battery, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  QrCode, 
  ArrowRight, 
  Zap, 
  Snowflake, 
  ShieldCheck, 
  MapPin, 
  Filter,
  Eye,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import QRCode from 'qrcode';

interface FleetDashboardProps {
  boxes: ColdChainBox[];
  onSelectBox: (box: ColdChainBox) => void;
  onOpenScanner: () => void;
  onOpenQRLabel: (box: ColdChainBox) => void;
  onOpenNewBoxModal: () => void;
}

export const FleetDashboard: React.FC<FleetDashboardProps> = ({
  boxes,
  onSelectBox,
  onOpenScanner,
  onOpenQRLabel,
  onOpenNewBoxModal
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | BoxStatus>('ALL');
  const [qrThumbnails, setQrThumbnails] = useState<Record<string, string>>({});

  // Generate mini QR thumbnails for each box
  useEffect(() => {
    boxes.forEach(box => {
      QRCode.toDataURL(box.qrPayload, {
        width: 120,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#f8fafc'
        }
      })
      .then(url => {
        setQrThumbnails(prev => ({ ...prev, [box.id]: url }));
      })
      .catch(console.error);
    });
  }, [boxes]);

  // Compute fleet stats
  const stats: FleetStats = {
    totalBoxes: boxes.length,
    inTransit: boxes.filter(b => b.status === 'IN_TRANSIT').length,
    delivered: boxes.filter(b => b.status === 'DELIVERED').length,
    inSafeTempRange: boxes.filter(b => b.internalTemp >= 2.0 && b.internalTemp <= 8.0).length,
    criticalAlerts: boxes.filter(b => b.status === 'ALERT_TEMP_BREACH' || b.internalTemp > 8.0 || b.internalTemp < 2.0).length,
    peltierAssistsActive: boxes.filter(b => b.peltierState === 'ACTIVE_COOLING' || b.peltierState === 'PULSE_MAINTAIN').length,
    avgBatteryLevel: Math.round(boxes.reduce((acc, b) => acc + b.batteryPct, 0) / (boxes.length || 1))
  };

  const filteredBoxes = activeFilter === 'ALL' 
    ? boxes 
    : boxes.filter(b => b.status === activeFilter);

  const getStatusBadge = (status: BoxStatus) => {
    switch (status) {
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            In Transit
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Delivered
          </span>
        );
      case 'ALERT_TEMP_BREACH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950/80 text-red-300 border border-red-800/60 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            Temp Alert
          </span>
        );
      case 'PRE_COOLING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60">
            <Snowflake className="w-3 h-3 text-blue-400" />
            Pre-Cooling
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero / Quick Action Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE FLEET TELEMETRY & QR DISPATCH
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Products & Cold-Chain Tracking
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every Sanjivani smart cold box carries a unique cryptographically signed QR code. 
              Scan the physical box QR sticker using your camera or click any box below to inspect 
              its live internal chamber temperature, PCM phase buffer, GPS transit route, and audit custody.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={onOpenScanner}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <QrCode className="w-5 h-5 stroke-[2.3]" />
              <span>Scan Any Box QR</span>
            </button>

            <button
              onClick={onOpenNewBoxModal}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Register Box</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total & In Transit */}
        <div className="glass-panel p-5 rounded-xl space-y-2 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ACTIVE FLEET</span>
            <Truck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{stats.totalBoxes}</span>
            <span className="text-xs text-cyan-400 font-semibold font-mono">
              ({stats.inTransit} In Transit)
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Active medical transit boxes tracked
          </p>
        </div>

        {/* Temperature Compliance (2°C - 8°C) */}
        <div className="glass-panel p-5 rounded-xl space-y-2 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>SAFE COLD-CHAIN</span>
            <Thermometer className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">
              {Math.round((stats.inSafeTempRange / (stats.totalBoxes || 1)) * 100)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {stats.inSafeTempRange}/{stats.totalBoxes} Compliant
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Target 2.0°C – 8.0°C strictly maintained
          </p>
        </div>

        {/* Peltier Assists Active */}
        <div className="glass-panel p-5 rounded-xl space-y-2 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>HYBRID COOLING</span>
            <Snowflake className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-400 font-mono">
              {stats.peltierAssistsActive}
            </span>
            <span className="text-xs text-slate-400 font-mono">Units Active</span>
          </div>
          <p className="text-[11px] text-slate-400">
            PCM buffer + Peltier thermoelectric assist
          </p>
        </div>

        {/* Fleet Battery Autonomy */}
        <div className="glass-panel p-5 rounded-xl space-y-2 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>AVG BATTERY LEVEL</span>
            <Battery className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {stats.avgBatteryLevel}%
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              ~28h Autonomy
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Smart LiFePO4 cold-rated cells
          </p>
        </div>

      </div>

      {/* Filter Tabs & Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            All Boxes ({boxes.length})
          </button>

          <button
            onClick={() => setActiveFilter('IN_TRANSIT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeFilter === 'IN_TRANSIT'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            In Transit ({boxes.filter(b => b.status === 'IN_TRANSIT').length})
          </button>

          <button
            onClick={() => setActiveFilter('DELIVERED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeFilter === 'DELIVERED'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Delivered ({boxes.filter(b => b.status === 'DELIVERED').length})
          </button>

          <button
            onClick={() => setActiveFilter('ALERT_TEMP_BREACH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeFilter === 'ALERT_TEMP_BREACH'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Alerts ({boxes.filter(b => b.status === 'ALERT_TEMP_BREACH').length})
          </button>

          <button
            onClick={() => setActiveFilter('PRE_COOLING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeFilter === 'PRE_COOLING'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Pre-Cooling ({boxes.filter(b => b.status === 'PRE_COOLING').length})
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <span>Showing {filteredBoxes.length} of {boxes.length} tracking units</span>
        </div>

      </div>

      {/* Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBoxes.map((box) => {
          const isTempCompliant = box.internalTemp >= 2.0 && box.internalTemp <= 8.0;
          const qrSrc = qrThumbnails[box.id];

          return (
            <div
              key={box.id}
              className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                box.status === 'ALERT_TEMP_BREACH' 
                  ? 'bg-red-500' 
                  : isTempCompliant 
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500' 
                    : 'bg-amber-500'
              }`} />

              <div>
                
                {/* Header: Box ID, Status, Priority */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-extrabold text-cyan-400 tracking-wider">
                        {box.id}
                      </span>
                      {box.priority === 'CRITICAL' && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                          CRITICAL
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                      {box.category}
                    </span>
                  </div>

                  <div>
                    {getStatusBadge(box.status)}
                  </div>
                </div>

                {/* Cargo Title */}
                <h3 className="text-sm font-bold text-slate-100 line-clamp-1 mb-4 group-hover:text-cyan-300 transition">
                  {box.name}
                </h3>

                {/* Dual Telemetry Highlight Panel */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 mb-4">
                  
                  {/* Internal Temp */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-cyan-400" />
                      CHAMBER TEMP
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-xl font-mono font-black ${
                        isTempCompliant ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {box.internalTemp > 0 ? `+${box.internalTemp}` : box.internalTemp}°C
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        (2–8°C)
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Ambient: {box.ambientTemp}°C
                    </div>
                  </div>

                  {/* Cooling Mechanism / PCM */}
                  <div className="space-y-1 border-l border-slate-800 pl-3">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Snowflake className="w-3 h-3 text-blue-400" />
                      PCM BUFFER
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-mono font-black text-cyan-300">
                        {box.pcmLevel}%
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {box.pcmPhase === 'SOLID' ? 'Solid' : 'Latent'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Zap className={`w-2.5 h-2.5 ${box.peltierState !== 'IDLE' ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span>{box.peltierState === 'ACTIVE_COOLING' ? 'Peltier ON' : box.peltierState === 'PULSE_MAINTAIN' ? 'Peltier Pulse' : 'Peltier Standby'}</span>
                    </div>
                  </div>

                </div>

                {/* Logistics Route Row */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {box.origin.city}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="flex items-center gap-1 font-semibold text-slate-200 text-[11px]">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {box.destination.city}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <Battery className="w-3 h-3 text-teal-400" />
                      {box.batteryPct}% ({box.estimatedAutonomyHours}h)
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      {box.lidStatus}
                    </span>
                    <span>
                      {box.destination.distanceRemainingKm > 0 ? `${box.destination.distanceRemainingKm} km left` : 'At Facility'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Box Footer & QR Quick Scan Bar */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                
                {/* Mini QR sticker thumbnail */}
                <div 
                  onClick={() => onOpenQRLabel(box)}
                  title="View Printable Physical QR Sticker"
                  className="relative group/qr flex items-center gap-2 bg-slate-900 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition"
                >
                  {qrSrc ? (
                    <img src={qrSrc} alt="QR Thumbnail" className="w-7 h-7 rounded bg-white p-0.5" />
                  ) : (
                    <QrCode className="w-7 h-7 text-cyan-400" />
                  )}
                  <div className="hidden sm:block text-left">
                    <span className="text-[10px] font-mono font-semibold text-slate-300 block leading-tight">
                      QR Label
                    </span>
                    <span className="text-[9px] text-cyan-400">
                      Print / Scan
                    </span>
                  </div>
                </div>

                {/* Primary Box Button: Open Box Dashboard */}
                <button
                  onClick={() => onSelectBox(box)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer shadow-sm"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Track Box Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

              </div>

            </div>
          );
        })}
      </div>

      {/* Explanatory Banner for User / Judges */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-slate-300 space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <QrCode className="w-4 h-4" />
          <span>How Box QR Tracking Works in SANJIVANI</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Each Sanjivani smart cold-chain box is equipped with an external weatherproof QR sticker tag linked to its cryptographically signed digital twin. 
          When an operator, field nurse, or checkpoint inspector scans the QR code using any smartphone or the built-in scanner:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-cyan-400 font-mono font-bold block mb-1">1. Zero-Install Optical Scan</span>
            <p className="text-slate-400 text-[11px]">Instant optical scan resolves to the box's unique hardware ID and loads its secure telemetry view.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-emerald-400 font-mono font-bold block mb-1">2. Live Sensor Telemetry</span>
            <p className="text-slate-400 text-[11px]">Chamber core temp, ambient heat, PCM phase charge, Peltier activity, and lid tamper status.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-blue-400 font-mono font-bold block mb-1">3. Verifiable Custody Handoff</span>
            <p className="text-slate-400 text-[11px]">Checkpoints, batch manifests, cold-chain compliance proofs, and electronic delivery sign-off.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
