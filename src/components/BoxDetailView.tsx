import React, { useState } from 'react';
import { ColdChainBox, RouteCheckpoint } from '../types';
import { 
  ArrowLeft, 
  QrCode, 
  Thermometer, 
  Snowflake, 
  Battery, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Truck, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Share2, 
  Radio, 
  Check,
  FileText,
  Sliders,
  ChevronDown
} from 'lucide-react';

interface BoxDetailViewProps {
  box: ColdChainBox;
  onBack: () => void;
  onOpenQRLabel: (box: ColdChainBox) => void;
  onUpdateBox: (updated: ColdChainBox) => void;
}

export const BoxDetailView: React.FC<BoxDetailViewProps> = ({
  box,
  onBack,
  onOpenQRLabel,
  onUpdateBox
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSimPanel, setShowSimPanel] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isTempSafe = box.internalTemp >= 2.0 && box.internalTemp <= 8.0;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname + '#/box/' + box.id;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      showToast('Tracking URL copied to clipboard');
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // Field Simulation Actions
  const handleSimulateHeatwave = () => {
    const newAmbient = Number((box.ambientTemp + 7.5).toFixed(1));
    const newInternal = Number((box.internalTemp + 0.9).toFixed(1));
    const updated: ColdChainBox = {
      ...box,
      ambientTemp: newAmbient,
      internalTemp: newInternal,
      peltierState: 'ACTIVE_COOLING',
      peltierWatts: 22.4,
      pcmLevel: Math.max(10, box.pcmLevel - 8),
      auditLogs: [
        {
          id: `LOG-HEAT-${Date.now()}`,
          timestamp: 'Just now',
          type: 'SENSOR',
          title: 'Ambient Temperature Surge',
          description: `External temperature increased to ${newAmbient}°C. Peltier shifted to 22.4W boost mode.`,
          operator: 'Telemetry Gateway',
          location: box.currentLocation.locationName
        },
        ...box.auditLogs
      ]
    };
    onUpdateBox(updated);
    showToast(`Ambient spiked to ${newAmbient}°C. Peltier boost activated.`);
  };

  const handleSimulateLidTamper = () => {
    const isNowOpened = box.lidStatus === 'SEALED';
    const updated: ColdChainBox = {
      ...box,
      lidStatus: isNowOpened ? 'OPENED' : 'SEALED',
      status: isNowOpened ? 'ALERT_TEMP_BREACH' : 'IN_TRANSIT',
      internalTemp: isNowOpened ? Number((box.internalTemp + 1.8).toFixed(1)) : 3.4,
      auditLogs: [
        {
          id: `LOG-LID-${Date.now()}`,
          timestamp: 'Just now',
          type: isNowOpened ? 'ALERT' : 'VERIFICATION',
          title: isNowOpened ? 'Hall Tamper Alert: Lid Opened' : 'Magnetic Lid Re-Sealed',
          description: isNowOpened 
            ? 'Box latch opened outside verified checkpoint geofence.'
            : 'Box securely latched and verified.',
          operator: 'Field Inspection',
          location: box.currentLocation.locationName
        },
        ...box.auditLogs
      ]
    };
    onUpdateBox(updated);
    showToast(isNowOpened ? 'Hall-effect tamper alert logged!' : 'Lid seal re-established.');
  };

  const handleAdvanceCheckpoint = () => {
    const upcomingIdx = box.checkpoints.findIndex(c => c.status === 'UPCOMING');
    if (upcomingIdx === -1) {
      showToast('All checkpoints already completed.');
      return;
    }

    const updatedCheckpoints: RouteCheckpoint[] = box.checkpoints.map((cp, idx) => {
      if (idx === upcomingIdx) {
        return {
          ...cp,
          status: 'COMPLETED',
          timestamp: 'Just now',
          operator: 'Field Officer',
          notes: 'Handheld QR optical verification successful.'
        };
      }
      return cp;
    });

    const isAllDone = !updatedCheckpoints.some(c => c.status === 'UPCOMING');

    const updated: ColdChainBox = {
      ...box,
      status: isAllDone ? 'DELIVERED' : box.status,
      checkpoints: updatedCheckpoints,
      destination: {
        ...box.destination,
        distanceRemainingKm: Math.max(0, box.destination.distanceRemainingKm - 25)
      },
      auditLogs: [
        {
          id: `LOG-CP-${Date.now()}`,
          timestamp: 'Just now',
          type: 'SCAN',
          title: `Checkpoint Scan: ${updatedCheckpoints[upcomingIdx].name}`,
          description: `QR tag scanned at ${updatedCheckpoints[upcomingIdx].city}. Chain of custody verified.`,
          operator: 'Checkpoint Specialist',
          location: updatedCheckpoints[upcomingIdx].city
        },
        ...box.auditLogs
      ]
    };

    onUpdateBox(updated);
    showToast(`Checkpoint "${updatedCheckpoints[upcomingIdx].name}" completed!`);
  };

  const handleResetIdeal = () => {
    const updated: ColdChainBox = {
      ...box,
      internalTemp: 3.4,
      ambientTemp: 30.0,
      lidStatus: 'SEALED',
      status: 'IN_TRANSIT',
      peltierState: 'PULSE_MAINTAIN',
      peltierWatts: 10.5,
      pcmLevel: 88,
      pcmPhase: 'SOLID'
    };
    onUpdateBox(updated);
    showToast('Reset to nominal baseline telemetry (3.4°C).');
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-24">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 inset-x-4 max-w-sm mx-auto z-50 p-3 rounded-xl bg-slate-900 border border-teal-500/60 text-teal-200 text-xs font-mono flex items-center justify-between shadow-2xl animate-fade-in">
          <span>{toastMessage}</span>
          <span className="text-[10px] text-teal-400 font-bold uppercase">Sync</span>
        </div>
      )}

      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between gap-2">
          
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Boxes</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenQRLabel(box)}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-teal-400" />
              <span>QR Label</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>

        </div>

        {/* Box Title Bar */}
        <div className="panel p-3.5 sm:p-4 rounded-xl">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-mono text-base sm:text-lg font-bold text-teal-400 tracking-wide">
              {box.id}
            </span>
            <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
              box.status === 'IN_TRANSIT'
                ? 'bg-teal-950 text-teal-300 border border-teal-800'
                : box.status === 'DELIVERED'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-red-950 text-red-300 border border-red-800'
            }`}>
              {box.status.replace('_', ' ')}
            </span>
          </div>
          <h1 className="text-sm sm:text-base font-bold text-white leading-snug">
            {box.name}
          </h1>
          <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
            {box.category}
          </span>
        </div>
      </div>

      {/* Primary Telemetry Strip (2x2 on mobile, 4 columns on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* Chamber Temp */}
        <div className="panel p-3.5 sm:p-4 rounded-xl relative">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-teal-400" />
              CHAMBER
            </span>
            <span className={`w-2 h-2 rounded-full ${isTempSafe ? 'bg-emerald-400' : 'bg-red-400'}`} />
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className={`text-2xl sm:text-3xl font-mono font-black ${
              isTempSafe ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {box.internalTemp > 0 ? `+${box.internalTemp}` : box.internalTemp}°C
            </span>
          </div>

          <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>Limit: 2–8°C</span>
            <span>Amb: {box.ambientTemp}°C</span>
          </div>
        </div>

        {/* PCM Buffer & Peltier */}
        <div className="panel p-3.5 sm:p-4 rounded-xl">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Snowflake className="w-3.5 h-3.5 text-sky-400" />
              PCM BUFFER
            </span>
            <span className="text-[10px] font-mono text-slate-400">{box.pcmPhase}</span>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
              {box.pcmLevel}%
            </span>
          </div>

          <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>Peltier: {box.peltierState === 'ACTIVE_COOLING' ? 'Boost' : box.peltierState === 'PULSE_MAINTAIN' ? 'Pulse' : 'Idle'}</span>
            <span>{box.peltierWatts}W</span>
          </div>
        </div>

        {/* Battery Autonomy */}
        <div className="panel p-3.5 sm:p-4 rounded-xl">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-slate-400" />
              BATTERY
            </span>
            <span className="text-[10px] font-mono text-teal-400">LiFePO4</span>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
              {box.batteryPct}%
            </span>
            <span className="text-[11px] text-teal-400 font-mono">
              ~{box.estimatedAutonomyHours}h
            </span>
          </div>

          <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>Cell: {box.batteryVoltage}V</span>
            <span>Autonomy OK</span>
          </div>
        </div>

        {/* Lid Lock & Security */}
        <div className="panel p-3.5 sm:p-4 rounded-xl">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              TAMPER SEAL
            </span>
            <span className={`w-2 h-2 rounded-full ${box.lidStatus === 'SEALED' ? 'bg-emerald-400' : 'bg-red-400'}`} />
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className={`text-base sm:text-lg font-mono font-bold ${
              box.lidStatus === 'SEALED' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {box.lidStatus === 'SEALED' ? 'SECURE' : 'BREACH'}
            </span>
          </div>

          <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>Tilt: {box.tiltDegrees}°</span>
            <span>Shock: {box.shockG}g</span>
          </div>
        </div>

      </div>

      {/* Discrete Field Testing Dropdown (Cleaner than AI Simulation Bar) */}
      <div className="panel rounded-xl overflow-hidden text-xs">
        <button
          onClick={() => setShowSimPanel(!showSimPanel)}
          className="w-full p-3 flex items-center justify-between text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          <span className="flex items-center gap-2 font-mono text-[11px]">
            <Sliders className="w-3.5 h-3.5 text-teal-400" />
            Field Operator Diagnostic Controls
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showSimPanel ? 'rotate-180' : ''}`} />
        </button>

        {showSimPanel && (
          <div className="p-3 pt-0 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs">
            <button
              onClick={handleSimulateHeatwave}
              className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 font-mono text-[11px] transition"
            >
              Test Heat Spike (+7°C)
            </button>
            <button
              onClick={handleSimulateLidTamper}
              className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-red-300 font-mono text-[11px] transition"
            >
              Toggle Lid Sensor
            </button>
            <button
              onClick={handleAdvanceCheckpoint}
              className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-teal-300 font-mono text-[11px] transition"
            >
              Step Checkpoint Scan
            </button>
            <button
              onClick={handleResetIdeal}
              className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 font-mono text-[11px] transition"
            >
              Reset Nominal
            </button>
          </div>
        )}
      </div>

      {/* Route & Waypoint Log */}
      <div className="panel p-4 sm:p-5 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-400" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Logistics Route & Checkpoints
            </h2>
          </div>
          <span className="text-[11px] font-mono text-teal-400">
            {box.destination.distanceRemainingKm > 0 ? `${box.destination.distanceRemainingKm} km remaining` : 'Delivered'}
          </span>
        </div>

        {/* Carrier Call Bar */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-slate-200 block">{box.carrier.agency}</span>
            <span className="text-[11px] text-slate-400">{box.carrier.driverName} ({box.carrier.vehicleNo})</span>
          </div>
          <a
            href={`tel:${box.carrier.phone}`}
            className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-300 border border-slate-700 text-xs font-mono flex items-center gap-1.5"
          >
            <Phone className="w-3 h-3" />
            <span>Call Driver</span>
          </a>
        </div>

        {/* Vertical Stepper */}
        <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {box.checkpoints.map((cp) => {
            const isCompleted = cp.status === 'COMPLETED';
            const isCurrent = cp.status === 'CURRENT';

            return (
              <div key={cp.id} className="relative">
                <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                    : isCurrent
                      ? 'bg-teal-500 border-teal-300 text-slate-950'
                      : 'bg-slate-900 border-slate-700'
                }`}>
                  {isCompleted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>

                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className={`text-xs font-semibold ${isCompleted || isCurrent ? 'text-slate-100' : 'text-slate-500'}`}>
                      {cp.name}
                    </span>
                    {cp.timestamp && (
                      <span className="text-[10px] font-mono text-teal-400">{cp.timestamp}</span>
                    )}
                  </div>
                  {cp.notes && (
                    <p className="text-[11px] text-slate-400 italic leading-snug">
                      "{cp.notes}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Temperature Profile SVG Chart */}
      <div className="panel p-4 sm:p-5 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800 pb-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Chamber Temperature Profile
          </h2>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-teal-400">■ Core Temp</span>
            <span className="text-amber-400">■ Ambient</span>
            <span className="text-emerald-500 text-[10px]">Safe: 2–8°C</span>
          </div>
        </div>

        {/* Chart View */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[320px] h-36 relative flex flex-col justify-between pt-2">
            
            {/* Safe 2-8°C Zone */}
            <div className="absolute inset-x-0 top-12 bottom-6 bg-emerald-500/5 border-y border-emerald-500/15 pointer-events-none" />

            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
              <line x1="0" y1="30" x2="400" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2="400" y2="90" stroke="#1e293b" strokeDasharray="3 3" />

              {/* Ambient Line */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.8"
                points={box.telemetryHistory.map((pt, i) => {
                  const x = (i / (box.telemetryHistory.length - 1 || 1)) * 380 + 10;
                  const y = 100 - ((pt.ambientTemp - 15) / 30) * 80;
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Internal Chamber Temp Line */}
              <polyline
                fill="none"
                stroke="#14b8a6"
                strokeWidth="2.5"
                strokeLinecap="round"
                points={box.telemetryHistory.map((pt, i) => {
                  const x = (i / (box.telemetryHistory.length - 1 || 1)) * 380 + 10;
                  const y = 95 - (pt.internalTemp / 10) * 50;
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Points */}
              {box.telemetryHistory.map((pt, i) => {
                const x = (i / (box.telemetryHistory.length - 1 || 1)) * 380 + 10;
                const y = 95 - (pt.internalTemp / 10) * 50;
                return (
                  <circle key={i} cx={x} cy={y} r="3" fill="#14b8a6" />
                );
              })}
            </svg>

            <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
              {box.telemetryHistory.map((pt, i) => (
                <span key={i}>{pt.time}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cargo Manifest (Mobile Cards + Clean Desktop Table) */}
      <div className="panel p-4 sm:p-5 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Cargo Manifest & Batch Numbers
            </h2>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">WHO PQS E003</span>
        </div>

        {/* Mobile View: Clean stacked cards */}
        <div className="space-y-2.5 sm:hidden">
          {box.manifest.map((item) => (
            <div key={item.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="font-semibold text-slate-100">{item.name}</div>
              <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                <span>Batch: <b className="text-slate-300">{item.batchNumber}</b></span>
                <span className="text-emerald-400 font-bold">{item.quantity} {item.unit}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[10px] font-mono pt-1 border-t border-slate-900">
                <span>{item.tempRequirement}</span>
                <span>Exp: {item.expiryDate}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                <th className="py-2 px-2">CARGO ITEM</th>
                <th className="py-2 px-2">BATCH #</th>
                <th className="py-2 px-2">QTY</th>
                <th className="py-2 px-2">STORAGE TEMP</th>
                <th className="py-2 px-2">EXPIRY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-xs">
              {box.manifest.map((item) => (
                <tr key={item.id}>
                  <td className="py-2.5 px-2 font-sans font-medium text-slate-200">{item.name}</td>
                  <td className="py-2.5 px-2 text-slate-400">{item.batchNumber}</td>
                  <td className="py-2.5 px-2 text-emerald-400 font-bold">{item.quantity} {item.unit}</td>
                  <td className="py-2.5 px-2 text-slate-300">{item.tempRequirement}</td>
                  <td className="py-2.5 px-2 text-slate-500">{item.expiryDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custody Audit Trail */}
      <div className="panel p-4 sm:p-5 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Audit Trail
          </h2>
          <span className="text-[10px] font-mono text-slate-500">
            Seal: {box.digitalSealHash.slice(0, 10)}
          </span>
        </div>

        <div className="space-y-2">
          {box.auditLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">{log.title}</span>
                <span className="text-[10px] font-mono text-teal-400">{log.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{log.description}</p>
              <div className="text-[10px] font-mono text-slate-500">
                {log.operator} • {log.location}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
