export type BoxStatus = 
  | 'IN_TRANSIT' 
  | 'DELIVERED' 
  | 'PRE_COOLING' 
  | 'ALERT_TEMP_BREACH' 
  | 'HELD_AT_CHECKPOINT';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'STANDARD';

export type PeltierState = 'IDLE' | 'ACTIVE_COOLING' | 'PULSE_MAINTAIN';

export interface RouteCheckpoint {
  id: string;
  name: string;
  city: string;
  type: 'DISPATCH' | 'TRANSIT_HUB' | 'MOUNTAIN_CHECKPOINT' | 'DISTRICT_HOSPITAL' | 'PHC';
  status: 'COMPLETED' | 'CURRENT' | 'UPCOMING';
  timestamp?: string;
  operator?: string;
  notes?: string;
  coords: [number, number]; // [lat, lng]
}

export interface CargoItem {
  id: string;
  name: string;
  category: 'Vaccine' | 'Antivenom' | 'Blood Product' | 'Insulin' | 'Emergency Biologic';
  batchNumber: string;
  quantity: string;
  unit: string;
  tempRequirement: string;
  expiryDate: string;
  manufacturer: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  type: 'SCAN' | 'SENSOR' | 'DISPATCH' | 'ALERT' | 'HANDOVER' | 'VERIFICATION';
  title: string;
  description: string;
  operator: string;
  location: string;
  signature?: string;
}

export interface TelemetryPoint {
  time: string;
  internalTemp: number;
  ambientTemp: number;
  peltierActive: boolean;
  batteryPct: number;
}

export interface ColdChainBox {
  id: string; // e.g. "SNJ-BX-9042"
  name: string;
  category: string;
  priority: PriorityLevel;
  status: BoxStatus;
  
  // Real-time Sensor Telemetry
  internalTemp: number; // in Celsius
  targetTempRange: { min: number; max: number }; // [2.0, 8.0]
  ambientTemp: number;
  pcmLevel: number; // 0-100%
  pcmPhase: 'SOLID' | 'LATENT_TRANSITION' | 'LIQUID';
  peltierState: PeltierState;
  peltierWatts: number;
  
  // Power & Physical
  batteryPct: number;
  batteryVoltage: number;
  estimatedAutonomyHours: number;
  lidStatus: 'SEALED' | 'OPENED';
  tiltDegrees: number;
  shockG: number;
  humidityPct: number;
  
  // Connectivity
  signalStrength: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'OFFLINE';
  lastPing: string;
  connectivityType: '4G-LTE' | 'LoRaWAN' | 'Satellite-IoT';
  
  // Route & Logistics
  origin: {
    facility: string;
    city: string;
    state: string;
    dispatchedAt: string;
  };
  destination: {
    facility: string;
    city: string;
    state: string;
    eta: string;
    distanceRemainingKm: number;
    receiverContact: string;
  };
  carrier: {
    agency: string;
    driverName: string;
    vehicleNo: string;
    phone: string;
  };
  currentLocation: {
    latitude: number;
    longitude: number;
    locationName: string;
    speedKmH: number;
    altitudeMeters: number;
  };
  
  // Waypoints & History
  checkpoints: RouteCheckpoint[];
  manifest: CargoItem[];
  auditLogs: AuditLogEntry[];
  telemetryHistory: TelemetryPoint[];
  
  // Verification seal
  digitalSealHash: string;
  qrPayload: string;
}

export interface FleetStats {
  totalBoxes: number;
  inTransit: number;
  delivered: number;
  inSafeTempRange: number;
  criticalAlerts: number;
  peltierAssistsActive: number;
  avgBatteryLevel: number;
}
