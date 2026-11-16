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
  Download, 
  Activity, 
  RefreshCw, 
  Radio, 
  SlidersHorizontal,
  Flame,
  Check,
  FileText
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
  const [simulationNote, setSimulationNote] = useState<string | null>(null);

  const isTempSafe = box.internalTemp >= 2.0 && box.internalTemp <= 8.0;

  // Copy tracking link to clipboard
  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname + '#/box/' + box.id;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // Simulation: Trigger Heatwave (+7°C Ambient)
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
          title: 'Simulated Ambient Heatwave Surge',
          description: `External temperature spiked to ${newAmbient}°C. Peltier cooling shifted to boost mode (22.4W) to protect vaccine cargo.`,
          operator: 'Simulator Engine',
          location: box.currentLocation.locationName
        },
        ...box.auditLogs
      ],
      telemetryHistory: [
        ...box.telemetryHistory,
        {
          time: 'Now',
          internalTemp: newInternal,
          ambientTemp: newAmbient,
          peltierActive: true,
          batteryPct: box.batteryPct - 1
        }
      ]
    };
    onUpdateBox(updated);
    setSimulationNote(`Ambient heatwave simulated (+7.5°C). Peltier cooling boosted to 22.4W!`);
    setTimeout(() => setSimulationNote(null), 4000);
  };

  // Simulation: Simulate Lid Opening / Tamper
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
          title: isNowOpened ? 'Hall-Effect Sensor Alert: Lid Seal Breached' : 'Lid Magnetic Lock Re-Sealed & Verified',
          description: isNowOpened 
            ? 'Box latch opened outside authorized depot geofence. Temperature loss risk logged.'
            : 'Box re-latched and magnetic lock confirmed secure.',
          operator: 'Field Technician',
          location: box.currentLocation.locationName
        },
        ...box.auditLogs
      ]
    };
    onUpdateBox(updated);
    setSimulationNote(isNowOpened ? 'Lid breach alert triggered!' : 'Lid seal securely re-established.');
    setTimeout(() => setSimulationNote(null), 4000);
  };

  // Simulation: Advance Next Checkpoint
  const handleAdvanceCheckpoint = () => {
    const upcomingIdx = box.checkpoints.findIndex(c => c.status === 'UPCOMING');
    if (upcomingIdx === -1) {
      setSimulationNote('All route checkpoints have already been completed!');
      setTimeout(() => setSimulationNote(null), 3000);
      return;
    }

    const updatedCheckpoints: RouteCheckpoint[] = box.checkpoints.map((cp, idx) => {
      if (idx === upcomingIdx) {
        return {
          ...cp,
          status: 'COMPLETED',
          timestamp: 'Just now',
          operator: 'Checkpoint Scanning Officer',
          notes: 'Handheld QR scan verified. Cold chain maintained.'
        };
      }
      if (idx === upcomingIdx - 1) {
        return { ...cp, status: 'COMPLETED' };
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
          title: `Checkpoint QR Scan: ${updatedCheckpoints[upcomingIdx].name}`,
          description: `Box QR scanned and authenticated at checkpoint. Cold-chain audit intact.`,
          operator: 'Officer On Duty',
          location: updatedCheckpoints[upcomingIdx].city
        },
        ...box.auditLogs
      ]
    };

    onUpdateBox(updated);
    setSimulationNote(`Checkpoint "${updatedCheckpoints[upcomingIdx].name}" marked as SCANNED & COMPLETED!`);
    setTimeout(() => setSimulationNote(null), 4000);
  };

  // Reset to Ideal State
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
    setSimulationNote('Telemetry restored to standard optimal cooling state (3.4°C).');
    setTimeout(() => setSimulationNote(null), 3500);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Simulation Feedback Alert */}
      {simulationNote && (
        <div className="p-3.5 rounded-xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-200 text-xs font-mono flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{simulationNote}</span>
          </div>
          <span className="text-[10px] text-cyan-400 uppercase font-bold">Live Updated</span>
        </div>
      )}

      {/* Top Navigation & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        
        <div className="flex items-start sm:items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
            title="Back to Fleet Overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xl sm:text-2xl font-black text-cyan-400 tracking-wider">
                {box.id}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {box.category}
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                box.status === 'IN_TRANSIT'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : box.status === 'DELIVERED'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
              }`}>
                {box.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white mt-1">
              {box.name}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => onOpenQRLabel(box)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>Print Physical QR Sticker</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-mono">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-400" />
                <span>Share QR Link</span>
              </>
            )}
          </button>

        </div>

      </div>

      {/* Live Simulation Controls Ribbon */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-mono">
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-bold uppercase tracking-wider">Demo / Simulation Toolbar:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSimulateHeatwave}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/80 text-xs font-medium transition cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Heat Spike (+7°C)</span>
          </button>

          <button
            onClick={handleSimulateLidTamper}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${
              box.lidStatus === 'SEALED'
                ? 'bg-red-950/60 hover:bg-red-900/80 text-red-300 border-red-800/80'
                : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-emerald-800/80'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{box.lidStatus === 'SEALED' ? 'Simulate Lid Breach' : 'Seal Lid'}</span>
          </button>

          <button
            onClick={handleAdvanceCheckpoint}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/80 text-xs font-medium transition cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scan Next Checkpoint</span>
          </button>

          <button
            onClick={handleResetIdeal}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition cursor-pointer"
            title="Reset to Ideal Cooling"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Telemetry & Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Chamber Temperature */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              CHAMBER CORE TEMP
            </span>
            <span className={`w-2 h-2 rounded-full ${isTempSafe ? 'bg-emerald-400' : 'bg-red-400 animate-ping'}`} />
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-4xl font-mono font-black tracking-tight ${
              isTempSafe ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {box.internalTemp > 0 ? `+${box.internalTemp}` : box.internalTemp}°C
            </span>
            <span className="text-xs font-mono text-slate-400">
              Safe Zone: 2°C – 8°C
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Ambient Air: <b className="text-slate-200">{box.ambientTemp}°C</b></span>
            <span className="text-cyan-400 font-mono font-semibold">
              Δ {Number((box.ambientTemp - box.internalTemp).toFixed(1))}°C Diff
            </span>
          </div>
        </div>

        {/* Hybrid Cooling Engine (PCM + Peltier) */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Snowflake className="w-4 h-4 text-blue-400" />
              HYBRID PCM–PELTIER
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              {box.pcmPhase}
            </span>
          </div>

          <div className="space-y-2 mb-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-mono font-bold text-white">{box.pcmLevel}% PCM Buffer</span>
              <span className="text-xs font-mono text-cyan-400">
                {box.peltierState === 'ACTIVE_COOLING' ? 'Boost ON' : box.peltierState === 'PULSE_MAINTAIN' ? 'Pulsing' : 'Standby'}
              </span>
            </div>
            
            {/* Progress bar of PCM */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${box.pcmLevel}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Peltier Draw: {box.peltierWatts}W
            </span>
            <span className="text-slate-500 font-mono">14.8V Solid State</span>
          </div>
        </div>

        {/* Battery & Autonomy */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Battery className="w-4 h-4 text-teal-400" />
              BATTERY & POWER
            </span>
            <span className="text-[10px] font-mono text-emerald-400">LiFePO4 Safe</span>
          </div>

          <div className="space-y-2 mb-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-mono font-bold text-white">{box.batteryPct}%</span>
              <span className="text-xs font-mono text-emerald-400">
                ~{box.estimatedAutonomyHours}h Left
              </span>
            </div>
            
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${box.batteryPct}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Cell Voltage: <b className="text-slate-200">{box.batteryVoltage}V</b></span>
            <span className="text-slate-400 font-mono">Aux Solar Capable</span>
          </div>
        </div>

        {/* Physical Security & Sensors */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              PHYSICAL INTEGRITY
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
              box.lidStatus === 'SEALED' 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                : 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
            }`}>
              {box.lidStatus}
            </span>
          </div>

          <div className="space-y-1 mb-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Hall Tamper Lock:</span>
              <span className={`font-mono font-bold ${box.lidStatus === 'SEALED' ? 'text-emerald-400' : 'text-red-400'}`}>
                {box.lidStatus === 'SEALED' ? 'MAGNETIC SECURE' : 'BREACH DETECTED'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Transport Tilt:</span>
              <span className="font-mono text-slate-200">{box.tiltDegrees}° (Upright)</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Tri-Axial Shock:</span>
              <span className="font-mono text-slate-200">{box.shockG}g (Smooth)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Humidity: <b className="text-slate-200">{box.humidityPct}% RH</b></span>
            <span className="text-cyan-400 font-mono">{box.connectivityType}</span>
          </div>
        </div>

      </div>

      {/* Route & GPS Timeline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Route Stepper & Waypoints */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                Logistics Waypoint Scans & Route
              </h2>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              {box.destination.distanceRemainingKm > 0 
                ? `${box.destination.distanceRemainingKm} km to Destination` 
                : 'Arrived at Destination'}
            </span>
          </div>

          {/* Carrier & Driver Info Strip */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-mono">CARRIER & VEHICLE</span>
                <span className="font-semibold text-slate-200">{box.carrier.agency} ({box.carrier.vehicleNo})</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px] font-mono">DRIVER</span>
                <span className="font-medium">{box.carrier.driverName}</span>
              </div>
              <a
                href={`tel:${box.carrier.phone}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono transition"
              >
                <Phone className="w-3 h-3" />
                <span>Call Courier</span>
              </a>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {box.checkpoints.map((cp, idx) => {
              const isCompleted = cp.status === 'COMPLETED';
              const isCurrent = cp.status === 'CURRENT';

              return (
                <div key={cp.id} className="relative group">
                  
                  {/* Stepper Pin */}
                  <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : isCurrent
                        ? 'bg-cyan-500 border-cyan-300 text-slate-950 shadow-md shadow-cyan-500/50'
                        : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    )}
                  </div>

                  {/* Waypoint details */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${
                          isCompleted || isCurrent ? 'text-slate-100' : 'text-slate-500'
                        }`}>
                          {cp.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {cp.city}
                        </span>
                      </div>
                      
                      {cp.timestamp && (
                        <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {cp.timestamp}
                        </span>
                      )}
                    </div>

                    {cp.operator && (
                      <p className="text-[11px] text-slate-400">
                        Scanned by: <span className="text-slate-300">{cp.operator}</span>
                      </p>
                    )}

                    {cp.notes && (
                      <p className="text-[11px] text-slate-400 italic">
                        "{cp.notes}"
                      </p>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* GPS Live Telemetry & Quick QR Tag Card */}
        <div className="space-y-6">
          
          {/* Quick QR Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Cryptographic Box QR Token
            </span>

            <div 
              onClick={() => onOpenQRLabel(box)}
              className="inline-block p-3 rounded-xl bg-white cursor-pointer hover:ring-4 hover:ring-cyan-500/40 transition shadow-lg"
              title="Click to expand official QR Box Label"
            >
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(box.qrPayload)}`}
                alt="Box QR Code"
                className="w-36 h-36 mx-auto"
              />
            </div>

            <div className="text-xs">
              <span className="font-mono font-bold text-cyan-400">{box.id}</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Scan with any smartphone camera to open this live dashboard instantly.
              </p>
            </div>

            <button
              onClick={() => onOpenQRLabel(box)}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition"
            >
              Expand Printable Sticker
            </button>
          </div>

          {/* Current GPS coordinates */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>CURRENT GPS COORDINATES</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" />
                Live 4G
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Latitude:</span>
                <span className="text-cyan-400 font-bold">{box.currentLocation.latitude.toFixed(4)}° N</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Longitude:</span>
                <span className="text-cyan-400 font-bold">{box.currentLocation.longitude.toFixed(4)}° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Speed:</span>
                <span className="text-slate-200">{box.currentLocation.speedKmH} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Altitude:</span>
                <span className="text-slate-200">{box.currentLocation.altitudeMeters} m ASL</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Location: <span className="text-slate-200 font-medium">{box.currentLocation.locationName}</span>
            </p>
          </div>

        </div>

      </div>

      {/* Temperature & Ambient History Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              Chamber Temperature vs Ambient Air Profile
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-0.5 bg-cyan-400 rounded"></span> Chamber Temp (°C)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-0.5 bg-amber-400 rounded"></span> Ambient Heat (°C)
            </span>
            <span className="text-emerald-400 hidden sm:inline-block">
              [Safe Range: 2.0°C – 8.0°C]
            </span>
          </div>
        </div>

        {/* SVG Multi-Line Chart */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] h-48 relative flex flex-col justify-between pt-4">
            
            {/* Safe Zone Ribbon (2°C - 8°C) */}
            <div className="absolute inset-x-0 top-16 bottom-12 bg-emerald-500/5 border-y border-emerald-500/20 pointer-events-none flex items-center justify-end pr-4">
              <span className="text-[10px] font-mono text-emerald-400/60 uppercase">
                Safe 2°C – 8°C Cold Chain Zone
              </span>
            </div>

            {/* SVG Data Lines */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
              
              {/* Grid lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#1e293b" strokeDasharray="4 4" />

              {/* Ambient Temp Line (Amber) */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
                points={box.telemetryHistory.map((pt, i) => {
                  const x = (i / (box.telemetryHistory.length - 1 || 1)) * 560 + 20;
                  // Map ambient 15-45 to Y: 140 to 20
                  const y = 140 - ((pt.ambientTemp - 15) / 30) * 120;
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Internal Chamber Temp Line (Cyan) */}
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={box.telemetryHistory.map((pt, i) => {
                  const x = (i / (box.telemetryHistory.length - 1 || 1)) * 560 + 20;
                  // Map internal 0-10 to Y: 130 to 50
                  const y = 130 - (pt.internalTemp / 10) * 70;
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Points on internal line */}
              {box.telemetryHistory.map((pt, i) => {
                const x = (i / (box.telemetryHistory.length - 1 || 1)) * 560 + 20;
                const y = 130 - (pt.internalTemp / 10) * 70;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="#06b6d4" stroke="#0f172a" strokeWidth="2" />
                    <text x={x} y={y - 8} fill="#06b6d4" fontSize="10" fontFamily="IBM Plex Mono" textAnchor="middle">
                      {pt.internalTemp}°C
                    </text>
                  </g>
                );
              })}

            </svg>

            {/* X-Axis Timestamps */}
            <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
              {box.telemetryHistory.map((pt, i) => (
                <span key={i}>{pt.time}</span>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Cargo Manifest & Medical Inventory */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              Cold-Chain Cargo Manifest & Batch Compliance
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            WHO PQS E003 Standards Compliant
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">CARGO ITEM</th>
                <th className="py-2.5 px-3">CATEGORY</th>
                <th className="py-2.5 px-3">BATCH #</th>
                <th className="py-2.5 px-3">QUANTITY</th>
                <th className="py-2.5 px-3">TEMP LIMIT</th>
                <th className="py-2.5 px-3">EXPIRY DATE</th>
                <th className="py-2.5 px-3">MANUFACTURER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {box.manifest.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/60 transition">
                  <td className="py-3 px-3 font-semibold text-slate-100 font-sans">
                    {item.name}
                  </td>
                  <td className="py-3 px-3 text-cyan-300">
                    {item.category}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {item.batchNumber}
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {item.tempRequirement}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {item.expiryDate}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-sans">
                    {item.manufacturer}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable Chain-of-Custody & Audit Trail */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              Chain-of-Custody & Audit Log
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Digital Seal: <b className="text-cyan-400">{box.digitalSealHash}</b>
          </span>
        </div>

        <div className="space-y-3">
          {box.auditLogs.map((log) => (
            <div 
              key={log.id} 
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    log.type === 'SCAN' 
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      : log.type === 'ALERT'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : log.type === 'HANDOVER'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-300'
                  }`}>
                    {log.type}
                  </span>
                  <span className="font-bold text-slate-100">{log.title}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {log.description}
                </p>
                <div className="text-[10px] font-mono text-slate-500 flex items-center gap-3">
                  <span>Operator: {log.operator}</span>
                  <span>•</span>
                  <span>Location: {log.location}</span>
                </div>
              </div>

              <div className="text-right text-[11px] font-mono text-cyan-400 shrink-0">
                {log.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
