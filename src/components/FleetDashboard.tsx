import React, { useState, useEffect } from 'react';
import { 
  BoxStatus, 
  ColdChainBox, 
  FleetStats 
} from '../types';
import { 
  Thermometer, 
  Battery, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  ArrowRight, 
  Zap, 
  Snowflake, 
  MapPin, 
  ChevronRight,
  Plus
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

  useEffect(() => {
    boxes.forEach(box => {
      QRCode.toDataURL(box.qrPayload, {
        width: 140,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' }
      })
      .then(url => {
        setQrThumbnails(prev => ({ ...prev, [box.id]: url }));
      })
      .catch(console.error);
    });
  }, [boxes]);

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
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-teal-950 text-teal-300 border border-teal-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            In Transit
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Delivered
          </span>
        );
      case 'ALERT_TEMP_BREACH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-red-950 text-red-300 border border-red-800/80">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            Temp Alert
          </span>
        );
      case 'PRE_COOLING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <Snowflake className="w-3 h-3 text-sky-400" />
            Pre-Cooling
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-20">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight">
              Cold-Chain Fleet
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {boxes.length} Units
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time thermal monitoring and QR custody tracking
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewBoxModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>New Box</span>
          </button>

          <button
            onClick={onOpenScanner}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Box QR</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* Safe Temperature Range */}
        <div className="panel p-3.5 sm:p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>2°C – 8°C SAFE</span>
            <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-emerald-400">
              {Math.round((stats.inSafeTempRange / (stats.totalBoxes || 1)) * 100)}%
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              ({stats.inSafeTempRange}/{stats.totalBoxes})
            </span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">WHO PQS compliant</p>
        </div>

        {/* Active In Transit */}
        <div className="panel p-3.5 sm:p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>IN TRANSIT</span>
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-white">
              {stats.inTransit}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              / {stats.totalBoxes} total
            </span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">Active sector dispatches</p>
        </div>

        {/* Hybrid Cooling Assists */}
        <div className="panel p-3.5 sm:p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>PELTIER ASSIST</span>
            <Snowflake className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-sky-400">
              {stats.peltierAssistsActive}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Active</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">Thermoelectric boost</p>
        </div>

        {/* Average Battery */}
        <div className="panel p-3.5 sm:p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>AVG BATTERY</span>
            <Battery className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-white">
              {stats.avgBatteryLevel}%
            </span>
            <span className="text-[11px] text-teal-400 font-mono">~26h</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">Autonomous runtime</p>
        </div>

      </div>

      {/* Filter Horizontal Scroll Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800 text-xs">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer font-medium ${
            activeFilter === 'ALL'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All ({boxes.length})
        </button>

        <button
          onClick={() => setActiveFilter('IN_TRANSIT')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer font-medium ${
            activeFilter === 'IN_TRANSIT'
              ? 'bg-slate-800 text-teal-300 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          In Transit ({boxes.filter(b => b.status === 'IN_TRANSIT').length})
        </button>

        <button
          onClick={() => setActiveFilter('DELIVERED')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer font-medium ${
            activeFilter === 'DELIVERED'
              ? 'bg-slate-800 text-emerald-300 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Delivered ({boxes.filter(b => b.status === 'DELIVERED').length})
        </button>

        <button
          onClick={() => setActiveFilter('ALERT_TEMP_BREACH')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer font-medium ${
            activeFilter === 'ALERT_TEMP_BREACH'
              ? 'bg-slate-800 text-red-300 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Alerts ({boxes.filter(b => b.status === 'ALERT_TEMP_BREACH').length})
        </button>

        <button
          onClick={() => setActiveFilter('PRE_COOLING')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer font-medium ${
            activeFilter === 'PRE_COOLING'
              ? 'bg-slate-800 text-slate-200 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Pre-Cooling ({boxes.filter(b => b.status === 'PRE_COOLING').length})
        </button>
      </div>

      {/* Boxes List/Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredBoxes.map((box) => {
          const isTempCompliant = box.internalTemp >= 2.0 && box.internalTemp <= 8.0;
          const qrSrc = qrThumbnails[box.id];

          return (
            <div
              key={box.id}
              className="panel panel-interactive rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                
                {/* Header: ID + Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-teal-400">
                      {box.id}
                    </span>
                    {box.priority === 'CRITICAL' && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-950/80 text-red-300 border border-red-800">
                        CRITICAL
                      </span>
                    )}
                  </div>
                  <div>
                    {getStatusBadge(box.status)}
                  </div>
                </div>

                {/* Cargo Title */}
                <h2 className="text-sm font-semibold text-slate-100 line-clamp-1 mb-3">
                  {box.name}
                </h2>

                {/* Telemetry Numbers Strip */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 mb-3">
                  
                  {/* Internal Temp */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block">CHAMBER TEMP</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-xl font-mono font-bold ${
                        isTempCompliant ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {box.internalTemp > 0 ? `+${box.internalTemp}` : box.internalTemp}°C
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">(2–8°C)</span>
                    </div>
                  </div>

                  {/* PCM Buffer */}
                  <div className="border-l border-slate-800/80 pl-2.5">
                    <span className="text-[10px] font-mono text-slate-500 block">PCM BUFFER</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-mono font-bold text-slate-200">
                        {box.pcmLevel}%
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {box.peltierState === 'ACTIVE_COOLING' ? 'Peltier ON' : box.peltierState === 'PULSE_MAINTAIN' ? 'Pulsing' : 'Standby'}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Route Information */}
                <div className="space-y-1 mb-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="truncate max-w-[120px]">{box.origin.city}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                    <span className="font-medium text-slate-200 truncate max-w-[130px]">{box.destination.city}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                    <span>{box.batteryPct}% battery</span>
                    <span>•</span>
                    <span>{box.lidStatus === 'SEALED' ? 'Lid Sealed' : 'Lid Opened'}</span>
                    <span>•</span>
                    <span>{box.destination.distanceRemainingKm > 0 ? `${box.destination.distanceRemainingKm} km left` : 'Arrived'}</span>
                  </div>
                </div>

              </div>

              {/* Card Footer: Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                
                {/* QR Sticker Thumbnail Trigger */}
                <button 
                  onClick={() => onOpenQRLabel(box)}
                  title="View QR Label"
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {qrSrc ? (
                    <img src={qrSrc} alt="QR" className="w-6 h-6 rounded bg-white p-0.5" />
                  ) : (
                    <QrCode className="w-6 h-6 text-teal-400" />
                  )}
                </button>

                {/* Open Box Dashboard */}
                <button
                  onClick={() => onSelectBox(box)}
                  className="flex-1 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-300 border border-slate-800 hover:border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>Track Box Telemetry</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
