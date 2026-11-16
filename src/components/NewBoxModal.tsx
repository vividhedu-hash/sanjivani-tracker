import React, { useState } from 'react';
import { X, PlusCircle, ThermometerSnowflake, ShieldCheck } from 'lucide-react';
import { ColdChainBox, PriorityLevel } from '../types';

interface NewBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBox: (newBox: ColdChainBox) => void;
}

export const NewBoxModal: React.FC<NewBoxModalProps> = ({
  isOpen,
  onClose,
  onAddBox
}) => {
  const [boxId, setBoxId] = useState(`SNJ-BX-${Math.floor(1000 + Math.random() * 9000)}`);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Pediatric Vaccines (WHO PQS)');
  const [priority, setPriority] = useState<PriorityLevel>('HIGH');
  const [originCity, setOriginCity] = useState('');
  const [destCity, setDestCity] = useState('');
  const [driverName, setDriverName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !boxId.trim()) return;

    const cleanId = boxId.trim().toUpperCase();
    const origin = originCity.trim() || 'Central Medical Hub';
    const destination = destCity.trim() || 'Regional PHC';

    const newBox: ColdChainBox = {
      id: cleanId,
      name: name.trim(),
      category: category,
      priority: priority,
      status: 'IN_TRANSIT',
      
      internalTemp: 3.5,
      targetTempRange: { min: 2.0, max: 8.0 },
      ambientTemp: 31.2,
      pcmLevel: 90,
      pcmPhase: 'SOLID',
      peltierState: 'PULSE_MAINTAIN',
      peltierWatts: 10.8,
      
      batteryPct: 95,
      batteryVoltage: 14.8,
      estimatedAutonomyHours: 32.0,
      lidStatus: 'SEALED',
      tiltDegrees: 1.1,
      shockG: 0.10,
      humidityPct: 42,
      
      signalStrength: 'EXCELLENT',
      lastPing: 'Just now',
      connectivityType: '4G-LTE',
      
      origin: {
        facility: `${origin} Medical Depot`,
        city: origin,
        state: 'Transit State',
        dispatchedAt: 'Today, 08:00 IST'
      },
      destination: {
        facility: `${destination} Primary Health Wing`,
        city: destination,
        state: 'Target State',
        eta: 'Today, 22:00 IST',
        distanceRemainingKm: 75.0,
        receiverContact: 'Medical Officer on Duty'
      },
      carrier: {
        agency: 'Sanjivani Rapid Cold-Chain',
        driverName: driverName.trim() || 'Designated Driver',
        vehicleNo: 'IND-DL-09-XX',
        phone: '+91 98111-XXXXX'
      },
      currentLocation: {
        latitude: 28.6139,
        longitude: 77.2090,
        locationName: `En Route from ${origin} to ${destination}`,
        speedKmH: 45.0,
        altitudeMeters: 250
      },
      
      checkpoints: [
        {
          id: 'CP-1',
          name: `${origin} Dispatch Bay`,
          city: origin,
          type: 'DISPATCH',
          status: 'COMPLETED',
          timestamp: '08:00 IST',
          operator: 'Dispatch Lead',
          notes: 'Pre-cooled PCM charged. QR Tag applied.',
          coords: [28.6139, 77.2090]
        },
        {
          id: 'CP-2',
          name: 'Highway Transit Checkpoint',
          city: 'Midway',
          type: 'TRANSIT_HUB',
          status: 'CURRENT',
          timestamp: '14:30 IST',
          notes: 'Active telemetry stream confirmed.',
          coords: [28.7000, 77.1000]
        },
        {
          id: 'CP-3',
          name: `${destination} Health Centre`,
          city: destination,
          type: 'PHC',
          status: 'UPCOMING',
          coords: [28.8000, 77.0000]
        }
      ],
      
      manifest: [
        {
          id: 'ITEM-1',
          name: name.trim(),
          category: 'Vaccine',
          batchNumber: `BATCH-${cleanId}`,
          quantity: '200',
          unit: 'vials',
          tempRequirement: '+2°C to +8°C',
          expiryDate: '2028-10-31',
          manufacturer: 'Bharat Bio / Serum Institute'
        }
      ],
      
      auditLogs: [
        {
          id: `LOG-NEW-${Date.now()}`,
          timestamp: 'Today, 08:00 IST',
          type: 'DISPATCH',
          title: 'Box Initialized & Dispatched',
          description: `Box ${cleanId} verified with PCM-Peltier hybrid cooling online.`,
          operator: 'Fleet Dispatcher',
          location: origin
        }
      ],
      
      telemetryHistory: [
        { time: '12:00', internalTemp: 3.2, ambientTemp: 29.0, peltierActive: false, batteryPct: 98 },
        { time: '13:00', internalTemp: 3.4, ambientTemp: 30.2, peltierActive: true, batteryPct: 96 },
        { time: '14:00', internalTemp: 3.5, ambientTemp: 31.2, peltierActive: true, batteryPct: 95 }
      ],
      
      digitalSealHash: `0x${cleanId}-SEC-${Date.now().toString().slice(-4)}`,
      qrPayload: window.location.origin + `/#/box/${cleanId}`
    };

    onAddBox(newBox);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                Register New Cold-Chain Box
              </h2>
              <p className="text-xs text-slate-400">
                Enroll a new smart IoT box with PCM–Peltier tracking
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-400 font-mono uppercase tracking-wider block">
                Box ID
              </label>
              <input
                type="text"
                required
                value={boxId}
                onChange={(e) => setBoxId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono uppercase tracking-wider block">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="CRITICAL">CRITICAL (Emergency)</option>
                <option value="HIGH">HIGH (Standard Bio)</option>
                <option value="STANDARD">STANDARD (Depot)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-mono uppercase tracking-wider block">
              Medical Cargo Name / Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Hepatitis-B & DTP Booster Vials"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-mono uppercase tracking-wider block">
              Cargo Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Pediatric Vaccines (WHO PQS)">Pediatric Vaccines (WHO PQS)</option>
              <option value="Emergency Serums & Antidotes">Emergency Serums & Antidotes</option>
              <option value="Blood & Packed RBCs">Blood & Packed RBCs</option>
              <option value="Biologics & Insulin">Biologics & Insulin</option>
              <option value="Organ / Perfusate Cargo">Organ / Perfusate Cargo</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-400 font-mono uppercase tracking-wider block">
                Origin City
              </label>
              <input
                type="text"
                placeholder="e.g. Chandigarh"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono uppercase tracking-wider block">
                Destination City
              </label>
              <input
                type="text"
                placeholder="e.g. Manali Outpost"
                value={destCity}
                onChange={(e) => setDestCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-mono uppercase tracking-wider block">
              Driver / Courier Name
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-md transition cursor-pointer mt-4"
          >
            Register & Generate QR Tag
          </button>
        </form>

      </div>
    </div>
  );
};
