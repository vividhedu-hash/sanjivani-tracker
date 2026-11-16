import { ColdChainBox } from '../types';

export const INITIAL_BOXES: ColdChainBox[] = [
  {
    id: 'SNJ-BX-9042',
    name: 'Kinnaur Tribal Mission — Pediatric MMR & Polio Vials',
    category: 'Pediatric Vaccines (WHO PQS Certified)',
    priority: 'CRITICAL',
    status: 'IN_TRANSIT',
    
    internalTemp: 3.4,
    targetTempRange: { min: 2.0, max: 8.0 },
    ambientTemp: 32.8,
    pcmLevel: 86,
    pcmPhase: 'SOLID',
    peltierState: 'PULSE_MAINTAIN',
    peltierWatts: 11.2,
    
    batteryPct: 88,
    batteryVoltage: 14.7,
    estimatedAutonomyHours: 28.4,
    lidStatus: 'SEALED',
    tiltDegrees: 1.4,
    shockG: 0.12,
    humidityPct: 44,
    
    signalStrength: 'EXCELLENT',
    lastPing: '12 seconds ago',
    connectivityType: '4G-LTE',
    
    origin: {
      facility: 'State Vaccine Storage Depot (IGMC)',
      city: 'Shimla',
      state: 'Himachal Pradesh',
      dispatchedAt: '2026-11-16 06:15 IST'
    },
    destination: {
      facility: 'Pooh Sub-Divisional Primary Health Centre',
      city: 'Kinnaur High-Altitude Sector',
      state: 'Himachal Pradesh',
      eta: '2026-11-17 11:30 IST',
      distanceRemainingKm: 68.4,
      receiverContact: 'Dr. Tenzin Norbu (+91 98160-XXXXX)'
    },
    carrier: {
      agency: 'H.P. State Health Cold-Chain Logistics',
      driverName: 'Vikram Singh Thakur',
      vehicleNo: 'HP-07-E-4421',
      phone: '+91 94180-23910'
    },
    currentLocation: {
      latitude: 31.5421,
      longitude: 78.2715,
      locationName: 'NH-05 Valley Corridor (near Reckong Peo Bypass)',
      speedKmH: 34.2,
      altitudeMeters: 2290
    },
    
    checkpoints: [
      {
        id: 'CP-1',
        name: 'Central Cryo-Depot Shimla',
        city: 'Shimla',
        type: 'DISPATCH',
        status: 'COMPLETED',
        timestamp: 'Nov 16, 06:15 IST',
        operator: 'Store Officer Rajesh Sharma',
        notes: 'Pre-cooled PCM charged to 100%. Dual Peltier tested ok.',
        coords: [31.1048, 77.1734]
      },
      {
        id: 'CP-2',
        name: 'Theog Intermediate Transfer Node',
        city: 'Theog',
        type: 'TRANSIT_HUB',
        status: 'COMPLETED',
        timestamp: 'Nov 16, 09:40 IST',
        operator: 'Inspector K. Verma',
        notes: 'QR Tag & tamper seal inspected. Internal chamber 3.2°C.',
        coords: [31.1215, 77.3541]
      },
      {
        id: 'CP-3',
        name: 'Rampur Bushahr River Valley Checkpoint',
        city: 'Rampur',
        type: 'TRANSIT_HUB',
        status: 'COMPLETED',
        timestamp: 'Nov 16, 14:10 IST',
        operator: 'Logistics Officer Amit Negi',
        notes: 'External ambient rose to 31°C. PCM buffer held stable.',
        coords: [31.3968, 77.6292]
      },
      {
        id: 'CP-4',
        name: 'Wangtoo Mountain Outpost Checkpoint',
        city: 'Kinnaur Border',
        type: 'MOUNTAIN_CHECKPOINT',
        status: 'CURRENT',
        timestamp: 'Nov 16, 20:50 IST',
        operator: 'Field Technician R. Joshi',
        notes: 'In transit via 4WD cold-chain utility vehicle.',
        coords: [31.5421, 78.2715]
      },
      {
        id: 'CP-5',
        name: 'Pooh Remote PHC Cold Storage',
        city: 'Pooh, Upper Kinnaur',
        type: 'PHC',
        status: 'UPCOMING',
        coords: [31.7588, 78.5839],
        notes: 'Final handoff to Medical Officer with digital signature.'
      }
    ],
    
    manifest: [
      {
        id: 'CARGO-101',
        name: 'bOPV (Bivalent Oral Polio Vaccine)',
        category: 'Vaccine',
        batchNumber: 'POL-2026-881B',
        quantity: '400',
        unit: 'doses / 20 vials',
        tempRequirement: '+2°C to +8°C',
        expiryDate: '2028-04-30',
        manufacturer: 'Serum Institute of India'
      },
      {
        id: 'CARGO-102',
        name: 'MR Vaccine (Measles-Rubella Lyophilized)',
        category: 'Vaccine',
        batchNumber: 'MR-904-X',
        quantity: '250',
        unit: 'doses / 25 vials',
        tempRequirement: '+2°C to +8°C (Light Protected)',
        expiryDate: '2027-10-15',
        manufacturer: 'Biological E. Limited'
      },
      {
        id: 'CARGO-103',
        name: 'Rotavirus Liquid Oral Vaccine',
        category: 'Vaccine',
        batchNumber: 'ROTA-7741',
        quantity: '180',
        unit: 'single-dose tubes',
        tempRequirement: '+2°C to +8°C (Do Not Freeze)',
        expiryDate: '2027-08-20',
        manufacturer: 'Bharat Biotech Intl.'
      }
    ],
    
    auditLogs: [
      {
        id: 'LOG-401',
        timestamp: '2026-11-16 06:10 IST',
        type: 'DISPATCH',
        title: 'Payload Encapsulated & Digital Seal Applied',
        description: 'Chamber vacuum latch engaged. Cryptographic RFID & QR token SNJ-BX-9042 verified. PCM block at solid crystallization point.',
        operator: 'Depot Manager Rajesh Sharma',
        location: 'Shimla Cryo-Facility'
      },
      {
        id: 'LOG-402',
        timestamp: '2026-11-16 09:40 IST',
        type: 'SCAN',
        title: 'QR Code Handheld Scan & Seal Audit',
        description: 'Physical tamper seal intact. NFC cold-chain badge scanned by transit supervisor.',
        operator: 'K. Verma (ID: HP-LOG-812)',
        location: 'Theog Transit Bay 3'
      },
      {
        id: 'LOG-403',
        timestamp: '2026-11-16 13:25 IST',
        type: 'SENSOR',
        title: 'Thermal Spike Detected — Peltier Assisted Mode Triggered',
        description: 'Ambient reached 33.5°C outside. Peltier module pulsed at 12W duty cycle for 18 minutes. Internal core returned to 3.4°C.',
        operator: 'SANJIVANI Smart MCU (Automated)',
        location: 'NH-05 Mile Marker 84'
      },
      {
        id: 'LOG-404',
        timestamp: '2026-11-16 20:50 IST',
        type: 'SCAN',
        title: 'Checkpoint Waypoint QR Verification',
        description: 'Logged at Wangtoo mountain station. Battery level 88%, remaining autonomous duration > 28 hrs.',
        operator: 'Officer R. Joshi',
        location: 'Wangtoo Checkpost'
      }
    ],
    
    telemetryHistory: [
      { time: '18:00', internalTemp: 3.2, ambientTemp: 28.4, peltierActive: false, batteryPct: 94 },
      { time: '18:30', internalTemp: 3.3, ambientTemp: 29.1, peltierActive: false, batteryPct: 93 },
      { time: '19:00', internalTemp: 3.4, ambientTemp: 30.5, peltierActive: true, batteryPct: 91 },
      { time: '19:30', internalTemp: 3.5, ambientTemp: 31.8, peltierActive: true, batteryPct: 90 },
      { time: '20:00', internalTemp: 3.3, ambientTemp: 32.4, peltierActive: true, batteryPct: 89 },
      { time: '20:30', internalTemp: 3.4, ambientTemp: 32.8, peltierActive: false, batteryPct: 88 },
      { time: '21:00', internalTemp: 3.4, ambientTemp: 32.8, peltierActive: true, batteryPct: 88 }
    ],
    
    digitalSealHash: '0x9E7F-B4A1-88DC-4029',
    qrPayload: window.location.origin + '/#/box/SNJ-BX-9042'
  },
  
  {
    id: 'SNJ-BX-8104',
    name: 'Thar Desert Rapid Response — Polyvalent Snake Antivenom',
    category: 'Emergency Serums & Antidotes',
    priority: 'CRITICAL',
    status: 'ALERT_TEMP_BREACH',
    
    internalTemp: 4.8,
    targetTempRange: { min: 2.0, max: 8.0 },
    ambientTemp: 41.5,
    pcmLevel: 58,
    pcmPhase: 'LATENT_TRANSITION',
    peltierState: 'ACTIVE_COOLING',
    peltierWatts: 24.8,
    
    batteryPct: 64,
    batteryVoltage: 13.9,
    estimatedAutonomyHours: 14.2,
    lidStatus: 'SEALED',
    tiltDegrees: 3.1,
    shockG: 0.38,
    humidityPct: 22,
    
    signalStrength: 'GOOD',
    lastPing: '45 seconds ago',
    connectivityType: '4G-LTE',
    
    origin: {
      facility: 'SMS Medical College Central Antidote Bank',
      city: 'Jaipur',
      state: 'Rajasthan',
      dispatchedAt: '2026-11-16 11:00 IST'
    },
    destination: {
      facility: 'Sam Sand Dunes Community Health Centre',
      city: 'Jaisalmer Rural Outpost',
      state: 'Rajasthan',
      eta: '2026-11-17 04:00 IST',
      distanceRemainingKm: 112.0,
      receiverContact: 'Dr. Sunita Rathore (+91 94141-XXXXX)'
    },
    carrier: {
      agency: 'Desert Emergency Medical Courier Express',
      driverName: 'Manish Bhati',
      vehicleNo: 'RJ-14-UB-9002',
      phone: '+91 98290-71124'
    },
    currentLocation: {
      latitude: 26.9157,
      longitude: 71.3204,
      locationName: 'Pokhran Bypass Express Corridor',
      speedKmH: 68.0,
      altitudeMeters: 233
    },
    
    checkpoints: [
      {
        id: 'CP-1',
        name: 'SMS Medical Depot',
        city: 'Jaipur',
        type: 'DISPATCH',
        status: 'COMPLETED',
        timestamp: 'Nov 16, 11:00 IST',
        operator: 'Chief Pharmacist R. K. Meena',
        notes: 'Critical venom antidote emergency dispatch.',
        coords: [26.9124, 75.7873]
      },
      {
        id: 'CP-2',
        name: 'Jodhpur Trauma Transfer Bay',
        city: 'Jodhpur',
        type: 'TRANSIT_HUB',
        status: 'COMPLETED',
        timestamp: 'Nov 16, 15:45 IST',
        operator: 'Supervisor Devendra Dan',
        notes: 'Extreme heat zone entered. Ambient 40°C.',
        coords: [26.2389, 73.0243]
      },
      {
        id: 'CP-3',
        name: 'Pokhran Desert Checkpoint',
        city: 'Pokhran',
        type: 'TRANSIT_HUB',
        status: 'CURRENT',
        timestamp: 'Nov 16, 21:15 IST',
        operator: 'Checkpost Officer B. Singh',
        notes: 'Peltier running at max power. Chamber held under 5°C.',
        coords: [26.9157, 71.3204]
      },
      {
        id: 'CP-4',
        name: 'Sam Sand Dunes Primary Health Centre',
        city: 'Jaisalmer',
        type: 'PHC',
        status: 'UPCOMING',
        coords: [26.8285, 70.5052],
        notes: 'Urgent venom bite treatment supplies.'
      }
    ],
    
    manifest: [
      {
        id: 'CARGO-201',
        name: 'Lyophilized Polyvalent Anti-Snake Venom Serum',
        category: 'Antivenom',
        batchNumber: 'ASV-2026-90',
        quantity: '60',
        unit: 'vials (10ml each)',
        tempRequirement: '+2°C to +8°C',
        expiryDate: '2028-01-31',
        manufacturer: 'Haffkine Bio-Pharmaceutical'
      },
      {
        id: 'CARGO-202',
        name: 'Rabies Immunoglobulin (Human) 150 IU/ml',
        category: 'Emergency Biologic',
        batchNumber: 'RIG-442-B',
        quantity: '40',
        unit: 'vials',
        tempRequirement: '+2°C to +8°C',
        expiryDate: '2027-06-30',
        manufacturer: 'Bharat Serums & Vaccines'
      }
    ],
    
    auditLogs: [
      {
        id: 'LOG-301',
        timestamp: '2026-11-16 11:00 IST',
        type: 'DISPATCH',
        title: 'Emergency Flight Handoff & Dispatch',
        description: 'Priority Red emergency seal applied. Target: Jaisalmer snakebite casualty unit.',
        operator: 'R. K. Meena',
        location: 'Jaipur Depot'
      },
      {
        id: 'LOG-302',
        timestamp: '2026-11-16 18:20 IST',
        type: 'ALERT',
        title: 'Extreme Ambient Heat Advisory (42.1°C Ambient)',
        description: 'External sensor measured dangerous ambient desert temperatures. PCM absorption accelerated. Hybrid Peltier automatically stepped to 100% boost mode.',
        operator: 'SANJIVANI System Core',
        location: 'Highway 125'
      }
    ],
    
    telemetryHistory: [
      { time: '17:00', internalTemp: 3.6, ambientTemp: 38.0, peltierActive: true, batteryPct: 78 },
      { time: '18:00', internalTemp: 4.1, ambientTemp: 41.2, peltierActive: true, batteryPct: 74 },
      { time: '19:00', internalTemp: 4.5, ambientTemp: 42.1, peltierActive: true, batteryPct: 70 },
      { time: '20:00', internalTemp: 4.8, ambientTemp: 41.5, peltierActive: true, batteryPct: 66 },
      { time: '21:00', internalTemp: 4.8, ambientTemp: 40.8, peltierActive: true, batteryPct: 64 }
    ],
    
    digitalSealHash: '0x882B-C119-99E4-1044',
    qrPayload: window.location.origin + '/#/box/SNJ-BX-8104'
  },

  {
    id: 'SNJ-BX-7231',
    name: 'District Trauma Centre — O-Negative Packed RBCs & Fresh Frozen Plasma',
    category: 'Blood & Biological Fluid Products',
    priority: 'HIGH',
    status: 'DELIVERED',
    
    internalTemp: 3.8,
    targetTempRange: { min: 2.0, max: 6.0 },
    ambientTemp: 24.1,
    pcmLevel: 92,
    pcmPhase: 'SOLID',
    peltierState: 'IDLE',
    peltierWatts: 0.0,
    
    batteryPct: 91,
    batteryVoltage: 14.8,
    estimatedAutonomyHours: 36.0,
    lidStatus: 'SEALED',
    tiltDegrees: 0.8,
    shockG: 0.08,
    humidityPct: 40,
    
    signalStrength: 'EXCELLENT',
    lastPing: '2 minutes ago',
    connectivityType: '4G-LTE',
    
    origin: {
      facility: 'Rotary Apex Regional Blood Centre',
      city: 'Chandigarh',
      state: 'Punjab / UT',
      dispatchedAt: '2026-11-16 08:30 IST'
    },
    destination: {
      facility: 'Civil Hospital Emergency Surgery Wing',
      city: 'Rupnagar',
      state: 'Punjab',
      eta: '2026-11-16 13:45 IST (DELIVERED)',
      distanceRemainingKm: 0.0,
      receiverContact: 'Dr. Gurpreet Kaur (+91 98723-XXXXX)'
    },
    carrier: {
      agency: 'Red Cross Rapid Medical Transit',
      driverName: 'Harpreet Singh',
      vehicleNo: 'PB-65-AK-1022',
      phone: '+91 98144-88219'
    },
    currentLocation: {
      latitude: 30.9664,
      longitude: 76.5331,
      locationName: 'Rupnagar Civil Hospital Cold Bay',
      speedKmH: 0.0,
      altitudeMeters: 260
    },
    
    checkpoints: [
      {
        id: 'CP-1',
        name: 'Apex Blood Bank Handoff',
        city: 'Chandigarh',
        type: 'DISPATCH',
        status: 'COMPLETED',
        timestamp: 'Nov 16, 08:30 IST',
        operator: 'Blood Transfusion Officer M. Chawla',
        notes: 'Pre-screened O-Negative units loaded into SANJIVANI box.',
        coords: [30.7333, 76.7794]
      },
      {
        id: 'CP-2',
        name: 'Kharar Inter-City Corridor',
        city: 'Kharar',
        type: 'TRANSIT_HUB',
        status: 'COMPLETED',
        timestamp: 'Nov 16, 10:15 IST',
        operator: 'In-Transit Automatic Beacon',
        notes: 'Transit temperature consistently maintained between 3.6°C and 3.9°C.',
        coords: [30.7499, 76.6411]
      },
      {
        id: 'CP-3',
        name: 'Rupnagar Civil Hospital Receiving Dock',
        city: 'Rupnagar',
        type: 'DISTRICT_HOSPITAL',
        status: 'COMPLETED',
        timestamp: 'Nov 16, 13:42 IST',
        operator: 'Chief Surgeon Dr. G. Kaur',
        notes: 'Delivery completed. Tamper seal verified intact. Zero temperature excursion logged.',
        coords: [30.9664, 76.5331]
      }
    ],
    
    manifest: [
      {
        id: 'CARGO-301',
        name: 'O-Negative Leuko-Reduced Packed Red Blood Cells (PRBC)',
        category: 'Blood Product',
        batchNumber: 'RBC-O-NEG-904',
        quantity: '8',
        unit: 'units (350ml each)',
        tempRequirement: '+2°C to +6°C Strict Limit',
        expiryDate: '2026-12-14',
        manufacturer: 'Apex Blood Bank Chandigarh'
      },
      {
        id: 'CARGO-302',
        name: 'Fresh Frozen Plasma (FFP) Thawed for Transfusion',
        category: 'Blood Product',
        batchNumber: 'FFP-2026-18B',
        quantity: '4',
        unit: 'pouches (250ml)',
        tempRequirement: '+2°C to +6°C',
        expiryDate: '2026-11-21',
        manufacturer: 'Apex Blood Bank Chandigarh'
      }
    ],
    
    auditLogs: [
      {
        id: 'LOG-201',
        timestamp: '2026-11-16 08:30 IST',
        type: 'DISPATCH',
        title: 'Blood Units Verified & Sealed',
        description: 'Cross-matching tags verified. PCM core pre-stabilized at 3.5°C.',
        operator: 'M. Chawla',
        location: 'Chandigarh'
      },
      {
        id: 'LOG-202',
        timestamp: '2026-11-16 13:42 IST',
        type: 'HANDOVER',
        title: 'Destination Scan & Cryptographic Sign-Off',
        description: 'Box QR code scanned at Hospital gate. Cold-chain audit compliance score: 100%. Handed over to trauma OT.',
        operator: 'Dr. Gurpreet Kaur',
        location: 'Rupnagar Civil Hospital OT-1'
      }
    ],
    
    telemetryHistory: [
      { time: '09:00', internalTemp: 3.6, ambientTemp: 22.0, peltierActive: false, batteryPct: 98 },
      { time: '10:00', internalTemp: 3.7, ambientTemp: 23.5, peltierActive: false, batteryPct: 96 },
      { time: '11:00', internalTemp: 3.8, ambientTemp: 24.2, peltierActive: false, batteryPct: 95 },
      { time: '12:00', internalTemp: 3.8, ambientTemp: 25.0, peltierActive: false, batteryPct: 93 },
      { time: '13:40', internalTemp: 3.8, ambientTemp: 24.1, peltierActive: false, batteryPct: 91 }
    ],
    
    digitalSealHash: '0x771C-E890-41AA-7231',
    qrPayload: window.location.origin + '/#/box/SNJ-BX-7231'
  },

  {
    id: 'SNJ-BX-6055',
    name: 'Wayanad Hill Tribes — Insulin Glargine & Thermal Sensitive Antibiotics',
    category: 'Cold-Chain Biologics & Hormones',
    priority: 'HIGH',
    status: 'IN_TRANSIT',
    
    internalTemp: 4.1,
    targetTempRange: { min: 2.0, max: 8.0 },
    ambientTemp: 29.4,
    pcmLevel: 79,
    pcmPhase: 'SOLID',
    peltierState: 'PULSE_MAINTAIN',
    peltierWatts: 8.4,
    
    batteryPct: 82,
    batteryVoltage: 14.4,
    estimatedAutonomyHours: 24.0,
    lidStatus: 'SEALED',
    tiltDegrees: 2.2,
    shockG: 0.18,
    humidityPct: 68,
    
    signalStrength: 'GOOD',
    lastPing: '18 seconds ago',
    connectivityType: 'LoRaWAN',
    
    origin: {
      facility: 'Calicut Medical College Regional Warehouse',
      city: 'Kozhikode',
      state: 'Kerala',
      dispatchedAt: '2026-11-16 13:00 IST'
    },
    destination: {
      facility: 'Mananthavady Tribal Mobile Medical Clinic',
      city: 'Wayanad Ghats',
      state: 'Kerala',
      eta: '2026-11-17 01:15 IST',
      distanceRemainingKm: 34.2,
      receiverContact: 'Staff Nurse Anjali Menon (+91 94470-XXXXX)'
    },
    carrier: {
      agency: 'Kerala Arogya Cold Fleet',
      driverName: 'Sujith Kumar',
      vehicleNo: 'KL-11-BG-3044',
      phone: '+91 94462-11099'
    },
    currentLocation: {
      latitude: 11.5975,
      longitude: 76.0125,
      locationName: 'Thamarassery Ghat Section Hairpin #6',
      speedKmH: 26.5,
      altitudeMeters: 680
    },
    
    checkpoints: [
      {
        id: 'CP-1',
        name: 'Kozhikode Depot Gate',
        city: 'Kozhikode',
        type: 'DISPATCH',
        status: 'COMPLETED',
        timestamp: 'Nov 16, 13:00 IST',
        operator: 'Store Pharmacist P. Nambiar',
        notes: 'Pre-conditioned box verified at 3.9°C.',
        coords: [11.2588, 75.7804]
      },
      {
        id: 'CP-2',
        name: 'Adivaram Base Camp Station',
        city: 'Adivaram',
        type: 'TRANSIT_HUB',
        status: 'COMPLETED',
        timestamp: 'Nov 16, 17:30 IST',
        operator: 'Officer C. Babu',
        notes: 'Ghat ascent started. Switchover to LoRaWAN mesh relay.',
        coords: [11.5034, 75.9892]
      },
      {
        id: 'CP-3',
        name: 'Lakkidi Pass Checkpost',
        city: 'Wayanad Gateway',
        type: 'MOUNTAIN_CHECKPOINT',
        status: 'CURRENT',
        timestamp: 'Nov 16, 21:40 IST',
        operator: 'Field Inspector K. Varghese',
        notes: 'Ghat road mist. Internal temperature rock stable at 4.1°C.',
        coords: [11.5975, 76.0125]
      },
      {
        id: 'CP-4',
        name: 'Mananthavady Tribal Centre',
        city: 'Wayanad',
        type: 'PHC',
        status: 'UPCOMING',
        coords: [11.8028, 76.0035],
        notes: 'Final recipient handoff.'
      }
    ],
    
    manifest: [
      {
        id: 'CARGO-401',
        name: 'Lantus (Insulin Glargine 100 units/ml)',
        category: 'Insulin',
        batchNumber: 'GLA-7821-K',
        quantity: '120',
        unit: 'SoloStar pens',
        tempRequirement: '+2°C to +8°C (Strictly Do Not Freeze)',
        expiryDate: '2027-09-30',
        manufacturer: 'Sanofi Healthcare'
      },
      {
        id: 'CARGO-402',
        name: 'Oxytocin Injection 10 IU/ml (Maternal Care)',
        category: 'Emergency Biologic',
        batchNumber: 'OXY-4190',
        quantity: '300',
        unit: 'ampoules',
        tempRequirement: '+2°C to +8°C',
        expiryDate: '2028-02-15',
        manufacturer: 'Cipla India'
      }
    ],
    
    auditLogs: [
      {
        id: 'LOG-101',
        timestamp: '2026-11-16 13:00 IST',
        type: 'DISPATCH',
        title: 'Insulin Depot Cold-Pack Loaded',
        description: 'Magnetic seal latched. Dual PCM core checked.',
        operator: 'P. Nambiar',
        location: 'Kozhikode Regional Hub'
      },
      {
        id: 'LOG-102',
        timestamp: '2026-11-16 17:35 IST',
        type: 'SCAN',
        title: 'LoRaWAN Handshake & QR Scan',
        description: 'Ghat section network transition verified. GPS packet transmission active.',
        operator: 'C. Babu',
        location: 'Adivaram Outpost'
      }
    ],
    
    telemetryHistory: [
      { time: '17:00', internalTemp: 3.9, ambientTemp: 31.0, peltierActive: false, batteryPct: 92 },
      { time: '18:00', internalTemp: 4.0, ambientTemp: 29.8, peltierActive: false, batteryPct: 90 },
      { time: '19:00', internalTemp: 4.2, ambientTemp: 29.5, peltierActive: true, batteryPct: 87 },
      { time: '20:00', internalTemp: 4.0, ambientTemp: 29.4, peltierActive: true, batteryPct: 85 },
      { time: '21:00', internalTemp: 4.1, ambientTemp: 29.4, peltierActive: false, batteryPct: 82 }
    ],
    
    digitalSealHash: '0x33DA-71EE-9022-6055',
    qrPayload: window.location.origin + '/#/box/SNJ-BX-6055'
  },

  {
    id: 'SNJ-BX-5112',
    name: 'National Serum Depot — Pre-Conditioning Thermal Soak',
    category: 'Anti-Rabies Vaccines & Prophylaxis',
    priority: 'STANDARD',
    status: 'PRE_COOLING',
    
    internalTemp: 2.8,
    targetTempRange: { min: 2.0, max: 8.0 },
    ambientTemp: 20.5,
    pcmLevel: 98,
    pcmPhase: 'SOLID',
    peltierState: 'ACTIVE_COOLING',
    peltierWatts: 16.5,
    
    batteryPct: 100,
    batteryVoltage: 15.1,
    estimatedAutonomyHours: 42.0,
    lidStatus: 'SEALED',
    tiltDegrees: 0.1,
    shockG: 0.02,
    humidityPct: 38,
    
    signalStrength: 'EXCELLENT',
    lastPing: '5 seconds ago',
    connectivityType: '4G-LTE',
    
    origin: {
      facility: 'National Cold-Chain Conditioning Facility',
      city: 'Pune',
      state: 'Maharashtra',
      dispatchedAt: 'Under Pre-Dispatch Conditioning'
    },
    destination: {
      facility: 'Vidarbha Rural Health Mission Depot',
      city: 'Nagpur',
      state: 'Maharashtra',
      eta: 'Scheduled Dispatch Nov 17, 07:00 IST',
      distanceRemainingKm: 690.0,
      receiverContact: 'Chief Pharmacist V. Deshmukh'
    },
    carrier: {
      agency: 'Scheduled National Medical Courier',
      driverName: 'Assigned on Dispatch',
      vehicleNo: 'MH-12-QC-8801',
      phone: '+91 98220-00122'
    },
    currentLocation: {
      latitude: 18.5204,
      longitude: 73.8567,
      locationName: 'Pune Central Cryo-Hub Conditioning Bay 4',
      speedKmH: 0.0,
      altitudeMeters: 560
    },
    
    checkpoints: [
      {
        id: 'CP-1',
        name: 'Chamber Charging Bay',
        city: 'Pune',
        type: 'DISPATCH',
        status: 'CURRENT',
        timestamp: 'Nov 16, 22:00 IST',
        operator: 'Automation Lead S. Kulkarni',
        notes: 'Peltier driven pre-freeze cycling of organic paraffin PCM.',
        coords: [18.5204, 73.8567]
      },
      {
        id: 'CP-2',
        name: 'Nagpur Medical Depot',
        city: 'Nagpur',
        type: 'DISTRICT_HOSPITAL',
        status: 'UPCOMING',
        coords: [21.1458, 79.0882],
        notes: 'Pending scheduled dispatch.'
      }
    ],
    
    manifest: [
      {
        id: 'CARGO-501',
        name: 'Rabipur Human Diploid Cell Rabies Vaccine',
        category: 'Vaccine',
        batchNumber: 'RAB-2026-P9',
        quantity: '500',
        unit: 'vials',
        tempRequirement: '+2°C to +8°C',
        expiryDate: '2028-08-30',
        manufacturer: 'Chiron Behring Vaccines'
      }
    ],
    
    auditLogs: [
      {
        id: 'LOG-001',
        timestamp: '2026-11-16 21:00 IST',
        type: 'SENSOR',
        title: 'Thermal Conditioning Cycle Started',
        description: 'Chamber connected to mains charging dock. PCM temperature dropped to solid state at 2.8°C.',
        operator: 'S. Kulkarni',
        location: 'Pune Conditioning Bay 4'
      }
    ],
    
    telemetryHistory: [
      { time: '20:00', internalTemp: 6.2, ambientTemp: 21.0, peltierActive: true, batteryPct: 100 },
      { time: '20:30', internalTemp: 4.5, ambientTemp: 20.8, peltierActive: true, batteryPct: 100 },
      { time: '21:00', internalTemp: 3.4, ambientTemp: 20.6, peltierActive: true, batteryPct: 100 },
      { time: '21:30', internalTemp: 2.8, ambientTemp: 20.5, peltierActive: true, batteryPct: 100 }
    ],
    
    digitalSealHash: '0x5112-D9A0-33BC-9912',
    qrPayload: window.location.origin + '/#/box/SNJ-BX-5112'
  }
];

// Fallback generator if a user scans or enters ANY arbitrary QR code or custom Box ID
export function generateBoxById(id: string): ColdChainBox {
  const cleanId = id.trim().toUpperCase();
  const existing = INITIAL_BOXES.find(b => b.id.toUpperCase() === cleanId);
  if (existing) return existing;

  const hashNum = cleanId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const temp = Number((3.2 + (hashNum % 20) * 0.1).toFixed(1));
  const ambient = Number((28 + (hashNum % 12)).toFixed(1));
  const battery = 75 + (hashNum % 24);

  return {
    id: cleanId,
    name: `SANJIVANI Smart Asset Box [${cleanId}]`,
    category: 'Universal Medical Cold-Chain Cargo',
    priority: hashNum % 2 === 0 ? 'HIGH' : 'CRITICAL',
    status: 'IN_TRANSIT',
    
    internalTemp: temp,
    targetTempRange: { min: 2.0, max: 8.0 },
    ambientTemp: ambient,
    pcmLevel: 82,
    pcmPhase: 'SOLID',
    peltierState: 'PULSE_MAINTAIN',
    peltierWatts: 12.0,
    
    batteryPct: battery,
    batteryVoltage: 14.5,
    estimatedAutonomyHours: Number((battery * 0.32).toFixed(1)),
    lidStatus: 'SEALED',
    tiltDegrees: 1.2,
    shockG: 0.14,
    humidityPct: 45,
    
    signalStrength: 'EXCELLENT',
    lastPing: 'Just now',
    connectivityType: '4G-LTE',
    
    origin: {
      facility: 'National Central Cold-Storage Vault',
      city: 'New Delhi',
      state: 'Delhi NCR',
      dispatchedAt: 'Today, 07:00 IST'
    },
    destination: {
      facility: 'Regional Special Medical Centre',
      city: 'Sector Health Hub',
      state: 'Designated Zone',
      eta: 'Today, 23:30 IST',
      distanceRemainingKm: 42.5,
      receiverContact: 'Medical Officer on Duty'
    },
    carrier: {
      agency: 'Sanjivani Secure Health Transit',
      driverName: 'Assigned Courier Lead',
      vehicleNo: 'DL-01-MD-' + (1000 + (hashNum % 8999)),
      phone: '+91 98100-XXXXX'
    },
    currentLocation: {
      latitude: 28.6139,
      longitude: 77.2090,
      locationName: 'Active Sector Transit Corridor',
      speedKmH: 48.0,
      altitudeMeters: 216
    },
    
    checkpoints: [
      {
        id: 'CP-1',
        name: 'Origin Cold Depot',
        city: 'Origin Hub',
        type: 'DISPATCH',
        status: 'COMPLETED',
        timestamp: '07:00 IST',
        operator: 'Dispatch Supervisor',
        notes: 'Chamber temperature locked in range. Tamper seal applied.',
        coords: [28.6139, 77.2090]
      },
      {
        id: 'CP-2',
        name: 'Regional Checkpoint Waypoint',
        city: 'Transit Zone',
        type: 'TRANSIT_HUB',
        status: 'CURRENT',
        timestamp: '15:30 IST',
        operator: 'Field Cold-Chain Officer',
        notes: 'Sensor telemetry transmitting without loss.',
        coords: [28.7041, 77.1025]
      },
      {
        id: 'CP-3',
        name: 'Destination Medical Centre',
        city: 'Destination',
        type: 'PHC',
        status: 'UPCOMING',
        notes: 'Awaiting arrival scan.',
        coords: [28.8041, 77.0025]
      }
    ],
    
    manifest: [
      {
        id: 'CARGO-GEN-1',
        name: 'Critical Temperature-Sensitive Medical Payload',
        category: 'Vaccine',
        batchNumber: `BATCH-${cleanId}`,
        quantity: '100',
        unit: 'vials',
        tempRequirement: '+2°C to +8°C',
        expiryDate: '2028-12-31',
        manufacturer: 'Certified Bio-Pharma'
      }
    ],
    
    auditLogs: [
      {
        id: `LOG-${cleanId}-1`,
        timestamp: 'Today, 07:00 IST',
        type: 'DISPATCH',
        title: 'Payload Encapsulated & Initialized',
        description: `Box ${cleanId} registered into SANJIVANI live tracking network.`,
        operator: 'System Dispatch Unit',
        location: 'Central Vault'
      },
      {
        id: `LOG-${cleanId}-2`,
        timestamp: 'Today, 14:15 IST',
        type: 'SCAN',
        title: 'QR Code Waypoint Scan',
        description: 'QR Code verified through handheld optical scanner. Cold chain verified compliant.',
        operator: 'En-Route Logistics Specialist',
        location: 'Transit Station'
      }
    ],
    
    telemetryHistory: [
      { time: '17:00', internalTemp: temp - 0.2, ambientTemp: ambient - 2, peltierActive: false, batteryPct: battery + 2 },
      { time: '18:00', internalTemp: temp - 0.1, ambientTemp: ambient, peltierActive: true, batteryPct: battery + 1 },
      { time: '19:00', internalTemp: temp, ambientTemp: ambient + 1, peltierActive: true, batteryPct: battery }
    ],
    
    digitalSealHash: `0x${cleanId.replace(/[^A-Z0-9]/g, '')}-SEC-OK`,
    qrPayload: window.location.origin + `/#/box/${cleanId}`
  };
}
