# SANJIVANI (संजीवनी) — Smart Products & Cold-Chain Box Tracking Dashboard

> **Senior Bal Vigyan 2026-2027**  
> Design and Development of a Sensor-Triggered Hybrid PCM–Peltier Cooling System for Extended Medical Cold-Chain Storage.

This repository is the dedicated **Products Tracking & Telemetry Dashboard** for Sanjivani Smart Cold-Chain Boxes.

---

## 🎯 Key Features

1. **Central Products & Fleet Tracking Dashboard**
   - Live overview of all active cold-chain boxes in transit, delivered, or pre-cooling.
   - Real-time fleet KPI metrics (Safe Temp Range % at 2°C–8°C, Active Peltier Cooling Assists, Average Battery Autonomy, Critical Alerts).
   - Filter by status and search by Box ID, medical payload, or destination city.

2. **Cryptographic QR Code Scanning & Deep Linking**
   - **Live Optical Camera Scanner**: Scan physical QR sticker on any box using a webcam or mobile camera.
   - **Quick Demo 1-Click Scanner**: Instant sample box selector with real scannable QR codes for quick desktop testing and judge demos.
   - **Image Upload Scanner**: Drop in or upload any picture of a QR code.
   - **Direct URL Hash Routing**: Scanning a box QR sticker immediately loads `#/box/<BOX_ID>` showing that exact box's live telemetry dashboard.

3. **Box Detail & Telemetry Deep-Dive Dashboard (`/box/:id`)**
   - **Chamber Core Temperature Gauge**: Big digital readout with target 2.0°C–8.0°C safe range indicator and ambient temperature differential ($ΔT$).
   - **Hybrid PCM–Peltier Mechanism**: Real-time status of Phase Change Material buffer (Solid/Latent) and thermoelectric Peltier power consumption (Watts).
   - **Power & Battery Health**: LiFePO4 battery pack level, voltage, and remaining autonomous cooling hours.
   - **Physical Integrity & Tamper Monitoring**: Magnetic Hall-effect lid seal (LOCKED vs. BREACH), transport tilt degrees, and tri-axial shock ($g$-force).
   - **Interactive SVG Temperature Chart**: Dual line profile showing chamber temperature vs. ambient heat over time.
   - **Logistics Waypoint Stepper & GPS Route**: Chronological checkpoints from depot dispatch to destination PHC with operator signatures.
   - **Cargo Manifest**: WHO PQS compliant batch listing with vial counts, temperatures, and expiry dates.
   - **Immutable Chain of Custody**: Cryptographically signed event log.
   - **Live Simulation Toolbar**: Interactive buttons to simulate an ambient heatwave (+7°C), trigger a lid seal breach, or advance the route to the next checkpoint!

4. **Printable Physical Asset Sticker**
   - Click "Print Physical QR Sticker" on any box to preview, download, or print an official, high-resolution weatherproof QR label with WHO PQS compliance markings, temperature limits, and deep-link QR code.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v22+)
- npm

### Installation & Running Locally

```bash
# Navigate to project folder
cd sanjivani-tracker

# Install dependencies (already installed)
npm install

# Start local development server
npm run dev
```

The app will run at `http://localhost:5174/`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🔒 Separation of Repositories Notice
This project was created in a completely fresh directory with its own independent Git repository. The original presentation/website in `website/` remains completely untouched.
