# e-PU Cabinet V2 — Measurement Plan (Requirements Verification Plan)

**Based on:** e-PU cabinet V2 project plan (2).docx  
**Version:** 2.0  
**Date:** 2026-07-08

---

## 1. Introduction

This document is the **Measurement Plan** for the e-PU Cabinet V2 project — a low-cost, high-performance stationary Battery Energy Storage System (BESS) that uses Solar East cabinet hardware together with VDL Energy Systems control software.

**Purpose:** to make sure every requirement from the project plan is verified during the test phase, with nothing missed.

This plan follows the standard verification approach (a **Verification Cross-Reference Matrix** plus **test sheets**). It is split into two easy-to-use parts:

- **Section 3 — Verification Cross-Reference Matrix:** a short, at-a-glance list of every requirement with its method and status. Use it to see overall progress.
- **Section 4 — Test Sheets:** one small card per requirement with the exact test steps, pass criteria and equipment. Use it while performing each test.

### How to use this plan

1. Work through the **Test Sheets** (Section 4), one requirement at a time.
2. For each sheet, follow **How to test**, then write the measured value in **Result**.
3. Set **Status** to Pass or Fail based on the acceptance criterion.
4. Copy the Pass/Fail result back into the **matrix** (Section 3) to track overall progress.
5. Confirm the **Coverage Checklist** (Section 5), then complete **Sign-off** (Section 7).

---

## 2. Legend

### Verification methods

| Code | Method | What it means |
|---|---|---|
| **T** | Test | Physically operate and measure it with instruments. |
| **I** | Inspection | Look at it — visual check, dimensions, or document/certificate review. |
| **A** | Analysis | Calculation, simulation, or engineering analysis (e.g. efficiency, FEM). |
| **D** | Demonstration | Show it works under normal operation, without dedicated measurement. |

### Status values

| Status | Meaning |
|---|---|
| **Not started** | Test not performed yet. |
| **In progress** | Test currently being executed. |
| **Pass** | Verified — acceptance criterion met. |
| **Fail** | Acceptance criterion not met — corrective action required. |

---

## 3. Verification Cross-Reference Matrix

At-a-glance list of every requirement. Full test details are in Section 4 (Test Sheets). Fill in the Status column as testing progresses.

| ID | Requirement | Method | Test stage | Status |
|---|---|:---:|:---:|:---:|
| MECH-004 | Max altitude 2000 m | I / A | TRL 2 (design review) | |
| SAFE-006 | Battery cell safety (UN38.3 / IEC 62619) | I | TRL 2 / 3 | |
| SAFE-007 | Power electronics (IEC 62477) | I | TRL 2 / 3 | |
| COST-001 | Controller material cost < EUR 3500 | A | TRL 2 / 3 | |
| COMM-001 | Modbus TCP | T | TRL 3 / 5 | |
| COMM-002 | CAN bus | T | TRL 3 | |
| COMM-003 | Ethernet | T | TRL 3 | |
| COMM-004 | RS485 | T | TRL 3 | |
| MECH-001 | Cabinet dimensions 1000x2300x1350 mm | I | TRL 3 (incoming) | |
| MECH-002 | Cabinet weight <= 2450 kg | I / A | TRL 3 (incoming) | |
| MECH-003 | IP54 ingress protection | I / T | TRL 3 / 6 | |
| THERM-003 | Aerosol fire protection | I / D | TRL 3 / 6 | |
| ELEC-001 | Rated AC output power 125 kW | T | TRL 4-5 | |
| ELEC-004 | DC voltage 832 V nominal (702-936 V range) | T | TRL 4 | |
| ELEC-005 | AC voltage 400 V (+-15% grid / +-3% island) | T | TRL 4-5 | |
| ELEC-006 | Grid frequency 50/60 Hz | T | TRL 4 | |
| ELEC-010 | Grid response time < 100 ms | T | TRL 4-5 | |
| FUNC-001 | Grid-following operation | T / D | TRL 4 | |
| FUNC-002 | Grid-forming (island) operation | T / D | TRL 4-5 | |
| ELEC-002 | Peak power 110% continuous / 120% for 1 min | T | TRL 5 | |
| ELEC-003 | Usable capacity >= 250 kWh at SOH 99% | T | TRL 5 | |
| ELEC-007 | THD < 3% with linear load | T | TRL 5 | |
| ELEC-008 | Power factor range -1 to +1 | T | TRL 5 | |
| ELEC-009 | Round-trip efficiency > 88% | A / T | TRL 5 | |
| FUNC-003 | Multi-BESS parallel up to 1 MW | T | TRL 5-6 | |
| FUNC-004 | Peak shaving / load management | D | TRL 5-6 | |
| FUNC-009 | Microgrid load sharing | T | TRL 5-6 | |
| FUNC-010 | Redundancy / fail-safe | D | TRL 5-6 | |
| THERM-001 | Operating temp -20 to +55 C | T / A | TRL 5-6 | |
| THERM-002 | Noise < 75 dB(A) at 1 m | T | TRL 5-6 | |
| SAFE-003 | Overcurrent protection | T | TRL 5 | |
| SAFE-004 | Overvoltage protection | T | TRL 5 | |
| SAFE-008 | Safe state on fault / island | T / D | TRL 5-6 | |
| FUNC-005 | PV control and curtailment | D / T | TRL 6 | |
| FUNC-006 | Generator control (fixed power) | D | TRL 6 | |
| FUNC-007 | Black start capability | D / T | TRL 6 | |
| FUNC-008 | Automatic mains failure recovery | D / T | TRL 6 | |
| FUNC-011 | HMI / service portal | D | TRL 6 | |
| SAFE-001 | CE marking | I / A | TRL 6 | |
| SAFE-002 | PGS 37-1 compliance | I / A | TRL 6 | |
| SAFE-005 | EMC (IEC 61000) | I / T | TRL 6 | |
| FUNC-012 | Uptime >= 98% | A | TRL 7 | |

---

## 4. Test Sheets

One card per requirement. Follow **How to test**, record the **Result**, then mark **Pass** or **Fail**.

### TRL 2

#### MECH-004 — Max altitude 2000 m

| Field | Detail |
|---|---|
| **Requirement** | The system operates at altitudes up to 2000 m. |
| **Source** | Hardware datasheet |
| **Verification method** | I / A |
| **How to test** | Review the manufacturer datasheet and confirm derating tables are acceptable for the installation altitude. |
| **Acceptance criterion (pass condition)** | Manufacturer specifies operation <= 2000 m; installation site confirmed within limit. |
| **Equipment / tooling** | Manufacturer datasheet, site survey data |
| **Test stage** | TRL 2 (design review) |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### SAFE-006 — Battery cell safety (UN38.3 / IEC 62619)

| Field | Detail |
|---|---|
| **Requirement** | LFP cells comply with UN38.3 (transport) and IEC 62619 (stationary storage safety). |
| **Source** | Hardware datasheet compliance standard |
| **Verification method** | I |
| **How to test** | Verify manufacturer UN38.3 and IEC 62619 certificates are available and valid for the LFP 314 Ah cells. |
| **Acceptance criterion (pass condition)** | Valid UN38.3 and IEC 62619 certificates on file. |
| **Equipment / tooling** | Manufacturer certificates |
| **Test stage** | TRL 2 / 3 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### SAFE-007 — Power electronics (IEC 62477)

| Field | Detail |
|---|---|
| **Requirement** | The power electronics comply with IEC 62477. |
| **Source** | Hardware datasheet compliance standard |
| **Verification method** | I |
| **How to test** | Verify the manufacturer's IEC 62477 test report is available and valid for the inverter/power electronics. |
| **Acceptance criterion (pass condition)** | Valid IEC 62477 test report on file. |
| **Equipment / tooling** | Manufacturer test report |
| **Test stage** | TRL 2 / 3 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### COST-001 — Controller material cost < EUR 3500

| Field | Detail |
|---|---|
| **Requirement** | Additional VDL controller hardware material cost is below EUR 3500 per system. |
| **Source** | Project plan - Cost/Budget section |
| **Verification method** | A |
| **How to test** | Sum the BOM cost of all VDL-added controller hardware (excluding the base Solar East cabinet) and compare to the EUR 3500 target. |
| **Acceptance criterion (pass condition)** | Total VDL controller BOM cost <= EUR 3500 per system. |
| **Equipment / tooling** | Bill of Materials, supplier quotations |
| **Test stage** | TRL 2 / 3 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

### TRL 3

#### COMM-001 — Modbus TCP

| Field | Detail |
|---|---|
| **Requirement** | Modbus TCP communication is functional. |
| **Source** | System Requirements table |
| **Verification method** | T |
| **How to test** | Connect an EMS/SCADA client and read/write all defined Modbus registers over TCP/IP. |
| **Acceptance criterion (pass condition)** | All registers readable/writable; correct values; no errors over a 1-hour test. |
| **Equipment / tooling** | Modbus TCP client (e.g. Modscan), network switch, PC |
| **Test stage** | TRL 3 / 5 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### COMM-002 — CAN bus

| Field | Detail |
|---|---|
| **Requirement** | CAN bus communication is functional. |
| **Source** | System Requirements table; Hardware datasheet |
| **Verification method** | T |
| **How to test** | Connect a CAN analyser and verify frames between BMS, inverter and VDL controller. |
| **Acceptance criterion (pass condition)** | All defined CAN messages present; correct data; no lost frames over a 30-min test. |
| **Equipment / tooling** | CAN analyser (e.g. PCAN/Vector), CAN interface cable |
| **Test stage** | TRL 3 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### COMM-003 — Ethernet

| Field | Detail |
|---|---|
| **Requirement** | Ethernet communication is functional. |
| **Source** | System Requirements table; Hardware datasheet |
| **Verification method** | T |
| **How to test** | Ping all networked devices and run full data exchange (HMI, controller, BMS, monitoring). |
| **Acceptance criterion (pass condition)** | All devices reachable; data exchange successful; latency < 50 ms. (Assumption.) |
| **Equipment / tooling** | Network switch, PC, ping/traceroute tools |
| **Test stage** | TRL 3 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### COMM-004 — RS485

| Field | Detail |
|---|---|
| **Requirement** | RS485 communication is functional. |
| **Source** | Hardware datasheet |
| **Verification method** | T |
| **How to test** | Connect an RS485 device and verify data exchange using the defined protocol (Modbus RTU or similar). |
| **Acceptance criterion (pass condition)** | RS485 exchange successful; correct register values; no framing errors. |
| **Equipment / tooling** | RS485 USB adapter, Modbus RTU client |
| **Test stage** | TRL 3 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### MECH-001 — Cabinet dimensions 1000x2300x1350 mm

| Field | Detail |
|---|---|
| **Requirement** | Cabinet dimensions are 1000 (W) x 2300 (H) x 1350 (D) mm. |
| **Source** | Hardware datasheet |
| **Verification method** | I |
| **How to test** | Measure width, height and depth of the assembled cabinet. |
| **Acceptance criterion (pass condition)** | W 1000 +-5 mm; H 2300 +-5 mm; D 1350 +-5 mm. |
| **Equipment / tooling** | Steel tape measure or laser distance meter |
| **Test stage** | TRL 3 (incoming) |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### MECH-002 — Cabinet weight <= 2450 kg

| Field | Detail |
|---|---|
| **Requirement** | Cabinet weight does not exceed 2450 kg. |
| **Source** | Hardware datasheet |
| **Verification method** | I / A |
| **How to test** | Verify weight from shipping documentation or weigh on a calibrated floor scale. |
| **Acceptance criterion (pass condition)** | Documented or measured weight <= 2450 kg. |
| **Equipment / tooling** | Calibrated industrial scale or supplier weight certificate |
| **Test stage** | TRL 3 (incoming) |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### MECH-003 — IP54 ingress protection

| Field | Detail |
|---|---|
| **Requirement** | The enclosure meets IP54 ingress protection. |
| **Source** | System Requirements table; Hardware datasheet |
| **Verification method** | I / T |
| **How to test** | Inspect seals/enclosure and verify the IP54 certificate. If independent testing is required, perform IP5X dust + IPX4 water splash per IEC 60529. |
| **Acceptance criterion (pass condition)** | IP54 confirmed by certificate, or independently tested to IEC 60529 IP54. |
| **Equipment / tooling** | IP54 certificate, IEC 60529 test setup (if independent test needed) |
| **Test stage** | TRL 3 / 6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### THERM-003 — Aerosol fire protection

| Field | Detail |
|---|---|
| **Requirement** | The aerosol fire suppression system is installed and functional. |
| **Source** | Hardware datasheet |
| **Verification method** | I / D |
| **How to test** | Inspect aerosol units for correct installation, expiry date and activation wiring; functional-test the activation signal (without triggering aerosol). |
| **Acceptance criterion (pass condition)** | Units installed per layout; within service life; activation signal test succeeds. |
| **Equipment / tooling** | Inspection checklist, supplier activation-test procedure |
| **Test stage** | TRL 3 / 6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

### TRL 4

#### ELEC-001 — Rated AC output power 125 kW

| Field | Detail |
|---|---|
| **Requirement** | The system delivers a rated AC output power of 125 kW. |
| **Source** | System Requirements table; Hardware datasheet |
| **Verification method** | T |
| **How to test** | Connect a rated load. Measure AC output power with a power analyser at rated conditions. |
| **Acceptance criterion (pass condition)** | Measured output power >= 125 kW at 400 V AC, 50 Hz. |
| **Equipment / tooling** | Power analyser (e.g. Yokogawa WT500), calibrated CT/PT |
| **Test stage** | TRL 4-5 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### ELEC-004 — DC voltage 832 V nominal (702-936 V range)

| Field | Detail |
|---|---|
| **Requirement** | DC bus operates at 832 V nominal within a 702-936 V range. |
| **Source** | Hardware datasheet |
| **Verification method** | T |
| **How to test** | Monitor DC bus voltage during a full charge/discharge cycle. |
| **Acceptance criterion (pass condition)** | DC bus voltage stays within 702-936 V throughout; nominal ~832 V. |
| **Equipment / tooling** | Calibrated DC voltmeter / data logger on DC bus |
| **Test stage** | TRL 4 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### ELEC-005 — AC voltage 400 V (+-15% grid / +-3% island)

| Field | Detail |
|---|---|
| **Requirement** | AC output is 400 V, +-15% on-grid and +-3% off-grid (island). |
| **Source** | Hardware datasheet |
| **Verification method** | T |
| **How to test** | Measure AC output voltage in grid-following and grid-forming modes under varying loads. |
| **Acceptance criterion (pass condition)** | Grid-following: 400 V +-15% (340-460 V); island: 400 V +-3% (388-412 V). |
| **Equipment / tooling** | True-RMS voltmeter / power analyser |
| **Test stage** | TRL 4-5 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### ELEC-006 — Grid frequency 50/60 Hz

| Field | Detail |
|---|---|
| **Requirement** | The system supports both 50 Hz and 60 Hz grid frequencies. |
| **Source** | System Requirements table; Hardware datasheet |
| **Verification method** | T |
| **How to test** | Switch configuration between 50 Hz and 60 Hz. Verify output frequency in each mode. |
| **Acceptance criterion (pass condition)** | 50.00 +-0.5 Hz (50 Hz mode); 60.00 +-0.5 Hz (60 Hz mode). |
| **Equipment / tooling** | Frequency meter / power analyser |
| **Test stage** | TRL 4 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### ELEC-010 — Grid response time < 100 ms

| Field | Detail |
|---|---|
| **Requirement** | The system responds to a power command within 100 ms. |
| **Source** | System Requirements table |
| **Verification method** | T |
| **How to test** | Send a step command (0 -> 100% setpoint) and timestamp the start and end of the power ramp. |
| **Acceptance criterion (pass condition)** | Time from command to >= 90% of setpoint < 100 ms. |
| **Equipment / tooling** | Oscilloscope or data logger (>= 1 ms resolution), power analyser |
| **Test stage** | TRL 4-5 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### FUNC-001 — Grid-following operation

| Field | Detail |
|---|---|
| **Requirement** | The system follows grid voltage/frequency and injects/absorbs P and Q on command. |
| **Source** | Project scope; Objectives |
| **Verification method** | T / D |
| **How to test** | Connect to a simulated or live grid. Command P and Q setpoints and verify tracking. |
| **Acceptance criterion (pass condition)** | P within +-5% of command; Q within +-5 kVAr; stable for >= 5 min. |
| **Equipment / tooling** | Power analyser, grid simulator or live grid connection |
| **Test stage** | TRL 4 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### FUNC-002 — Grid-forming (island) operation

| Field | Detail |
|---|---|
| **Requirement** | The system forms its own AC voltage/frequency in island/microgrid mode. |
| **Source** | Project scope; Objectives |
| **Verification method** | T / D |
| **How to test** | Disconnect from the grid (island mode), connect a local load, verify stable voltage/frequency without external reference. |
| **Acceptance criterion (pass condition)** | Stable island 400 V +-3%, 50 Hz +-0.5 Hz with load steps applied. |
| **Equipment / tooling** | Power analyser, programmable load bank, oscilloscope |
| **Test stage** | TRL 4-5 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

### TRL 5

#### ELEC-002 — Peak power 110% continuous / 120% for 1 min

| Field | Detail |
|---|---|
| **Requirement** | The system sustains 110% power continuously and 120% power for 1 minute. |
| **Source** | System Requirements table |
| **Verification method** | T |
| **How to test** | Run at 110% rated power for >= 5 min, then at 120% rated power for exactly 1 min. Log power and temperature. |
| **Acceptance criterion (pass condition)** | 110% (137.5 kW) sustained without trip/derating; 120% (150 kW) held for 1 min without trip. |
| **Equipment / tooling** | Power analyser, thermal camera, data logger |
| **Test stage** | TRL 5 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### ELEC-003 — Usable capacity >= 250 kWh at SOH 99%

| Field | Detail |
|---|---|
| **Requirement** | The system provides at least 250 kWh usable energy at 99% state of health. |
| **Source** | System Requirements table |
| **Verification method** | T |
| **How to test** | Fully charge from 0% SOC, then discharge at rated power and measure total energy delivered. |
| **Acceptance criterion (pass condition)** | Discharged energy >= 250 kWh when battery SOH >= 99%. |
| **Equipment / tooling** | Power analyser, energy meter, BMS readout |
| **Test stage** | TRL 5 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### ELEC-007 — THD < 3% with linear load

| Field | Detail |
|---|---|
| **Requirement** | Total harmonic distortion is below 3% with a linear load. |
| **Source** | System Requirements table; Hardware datasheet |
| **Verification method** | T |
| **How to test** | Measure THD of AC output voltage and current at rated load with a linear (resistive) load. |
| **Acceptance criterion (pass condition)** | THD voltage < 3% and THD current < 3% at rated linear load. |
| **Equipment / tooling** | Power quality analyser with THD capability |
| **Test stage** | TRL 5 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### ELEC-008 — Power factor range -1 to +1

| Field | Detail |
|---|---|
| **Requirement** | The system operates across the full power factor range -1 to +1 (four-quadrant). |
| **Source** | Hardware datasheet |
| **Verification method** | T |
| **How to test** | Command leading, lagging and unity power factor at rated power. Record P and Q. |
| **Acceptance criterion (pass condition)** | Power factor controllable across -1.0 to +1.0 without fault. |
| **Equipment / tooling** | Power analyser with reactive power measurement |
| **Test stage** | TRL 5 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### ELEC-009 — Round-trip efficiency > 88%

| Field | Detail |
|---|---|
| **Requirement** | System round-trip efficiency is greater than 88%. |
| **Source** | System Requirements table |
| **Verification method** | A / T |
| **How to test** | Measure charge energy (E_charge) and discharge energy (E_discharge). Compute efficiency = E_discharge / E_charge x 100%. |
| **Acceptance criterion (pass condition)** | Calculated round-trip efficiency >= 88%. |
| **Equipment / tooling** | Energy meters on AC input and output, data logger |
| **Test stage** | TRL 5 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### FUNC-003 — Multi-BESS parallel up to 1 MW

| Field | Detail |
|---|---|
| **Requirement** | Multiple cabinets operate in parallel up to 1 MW total power. |
| **Source** | System Requirements table; Objectives |
| **Verification method** | T |
| **How to test** | Connect >= 2 cabinets in parallel; verify load sharing and combined output up to 1 MW (8 x 125 kW). (Assumption: test with >= 2 units if full 1 MW not available.) |
| **Acceptance criterion (pass condition)** | Each unit shares load within +-10% of expected share; combined output reaches command without instability. |
| **Equipment / tooling** | Power analyser per unit, master controller, comms network |
| **Test stage** | TRL 5-6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### FUNC-004 — Peak shaving / load management

| Field | Detail |
|---|---|
| **Requirement** | The system reduces grid peak demand to a configured setpoint on command. |
| **Source** | Project scope |
| **Verification method** | D |
| **How to test** | Configure a peak-shaving setpoint, apply a step-load above it, verify the system limits grid import. |
| **Acceptance criterion (pass condition)** | Grid import does not exceed setpoint +-5 kW within 100 ms of load step. |
| **Equipment / tooling** | Power analyser at grid connection, programmable load |
| **Test stage** | TRL 5-6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### FUNC-009 — Microgrid load sharing

| Field | Detail |
|---|---|
| **Requirement** | Multiple BESS units share load automatically in a microgrid. |
| **Source** | Objectives; Deliverables |
| **Verification method** | T |
| **How to test** | Run >= 2 units in an island microgrid, apply variable loads, verify automatic load sharing. |
| **Acceptance criterion (pass condition)** | Load-sharing deviation <= +-10% of each unit's rated power; no instability over a 10-min test. |
| **Equipment / tooling** | Power analysers per unit, programmable load, controller |
| **Test stage** | TRL 5-6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### FUNC-010 — Redundancy / fail-safe

| Field | Detail |
|---|---|
| **Requirement** | A single unit failure does not cause complete system shutdown. |
| **Source** | Objectives; Deliverables |
| **Verification method** | D |
| **How to test** | In a multi-BESS setup, force one unit offline (simulate fault); verify remaining units keep supplying load. |
| **Acceptance criterion (pass condition)** | Remaining units take over load within 5 s; system stays operational; alarms raised correctly. |
| **Equipment / tooling** | Controller logs, power analysers |
| **Test stage** | TRL 5-6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### THERM-001 — Operating temp -20 to +55 C

| Field | Detail |
|---|---|
| **Requirement** | The system operates from -20 C to +55 C. |
| **Source** | System Requirements table; Hardware datasheet |
| **Verification method** | T / A |
| **How to test** | If a climate chamber is available, test start-up at -20 C and continuous operation at +55 C; otherwise verify via manufacturer thermal data and cooling-design analysis. |
| **Acceptance criterion (pass condition)** | Starts at -20 C; operates continuously at +55 C without derating beyond spec; no thermal shutdowns. |
| **Equipment / tooling** | Climate chamber (-20 to +55 C), thermal camera, data logger; or thermal datasheet |
| **Test stage** | TRL 5-6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### THERM-002 — Noise < 75 dB(A) at 1 m

| Field | Detail |
|---|---|
| **Requirement** | Acoustic noise is below 75 dB(A) at 1 m. |
| **Source** | System Requirements table |
| **Verification method** | T |
| **How to test** | Measure A-weighted sound pressure level at 1 m from each cabinet face during full-load operation. |
| **Acceptance criterion (pass condition)** | Maximum measured noise < 75 dB(A) at 1 m under full load. |
| **Equipment / tooling** | Calibrated sound level meter (Class 1/2 per IEC 61672) |
| **Test stage** | TRL 5-6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### SAFE-003 — Overcurrent protection

| Field | Detail |
|---|---|
| **Requirement** | The system disconnects safely on AC or DC overcurrent. |
| **Source** | Project plan (Risk - protection testing) |
| **Verification method** | T |
| **How to test** | Inject an overcurrent condition (load bank or simulated fault) and verify protection trips within the specified time. (Assumption: <= 100 ms for AC short circuit; confirm setpoints from the protection study.) |
| **Acceptance criterion (pass condition)** | Trips within <= 100 ms; no permanent damage; alarms raised; restart possible after fault clearance. |
| **Equipment / tooling** | Load bank / fault injection setup, oscilloscope, data logger |
| **Test stage** | TRL 5 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### SAFE-004 — Overvoltage protection

| Field | Detail |
|---|---|
| **Requirement** | The system disconnects safely on AC or DC overvoltage. |
| **Source** | Project plan (Risk - overvoltage validation) |
| **Verification method** | T |
| **How to test** | Apply an overvoltage condition above the defined threshold and verify protection trips within the specified time. (Assumption: AC trip at 115% rated; DC trip at 936 V.) |
| **Acceptance criterion (pass condition)** | Trips within the specified time; no permanent damage; alarms raised. |
| **Equipment / tooling** | Programmable AC/DC source or field injection, oscilloscope |
| **Test stage** | TRL 5 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### SAFE-008 — Safe state on fault / island

| Field | Detail |
|---|---|
| **Requirement** | The system enters a defined safe state on fault detection. |
| **Source** | Project scope |
| **Verification method** | T / D |
| **How to test** | Simulate fault conditions (grid loss, comms loss, BMS fault) and verify the correct protective action (safe shutdown, island mode, alarms). |
| **Acceptance criterion (pass condition)** | Correct safe state for each fault within the specified time; no uncontrolled energy release; alarms correct. |
| **Equipment / tooling** | Fault simulation tools, controller logs, power analysers |
| **Test stage** | TRL 5-6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

### TRL 6

#### FUNC-005 — PV control and curtailment

| Field | Detail |
|---|---|
| **Requirement** | The system integrates with a PV source and can curtail PV output. |
| **Source** | Objectives; Deliverables |
| **Verification method** | D / T |
| **How to test** | Connect a PV simulator/array, issue a curtailment command, measure PV power before and after. |
| **Acceptance criterion (pass condition)** | PV power curtailed to setpoint +-5% within 500 ms of command. |
| **Equipment / tooling** | PV simulator or array with power measurement, controller interface |
| **Test stage** | TRL 6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### FUNC-006 — Generator control (fixed power)

| Field | Detail |
|---|---|
| **Requirement** | The system coordinates with a generator at a fixed power setpoint. |
| **Source** | Objectives; Deliverables |
| **Verification method** | D |
| **How to test** | Connect a generator/simulator; verify the system accepts fixed generator power and adjusts BESS to compensate load variation. |
| **Acceptance criterion (pass condition)** | Generator power within +-5% of setpoint; BESS compensates smoothly without generator trip. |
| **Equipment / tooling** | Generator or simulator, power analysers, controller |
| **Test stage** | TRL 6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### FUNC-007 — Black start capability

| Field | Detail |
|---|---|
| **Requirement** | The system can start from zero and energise a dead microgrid. |
| **Source** | Objectives; Deliverables |
| **Verification method** | D / T |
| **How to test** | With grid disconnected and load de-energised, initiate the black-start sequence from the controller. |
| **Acceptance criterion (pass condition)** | Forms AC (400 V +-3%, 50 Hz +-0.5 Hz) from dead bus and energises load within 60 s. (Assumption: 60 s if no spec given.) |
| **Equipment / tooling** | Oscilloscope, power analyser, stopwatch/data logger |
| **Test stage** | TRL 6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### FUNC-008 — Automatic mains failure recovery

| Field | Detail |
|---|---|
| **Requirement** | The system detects grid loss and automatically switches to island mode. |
| **Source** | Deliverables |
| **Verification method** | D / T |
| **How to test** | Simulate a grid outage while in grid-following mode; verify automatic transfer to island/grid-forming mode. |
| **Acceptance criterion (pass condition)** | Transfer completed without load interruption > 100 ms; stable in island mode. |
| **Equipment / tooling** | Power analyser, oscilloscope on load side, data logger |
| **Test stage** | TRL 6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### FUNC-011 — HMI / service portal

| Field | Detail |
|---|---|
| **Requirement** | Monitoring and diagnostics are accessible via a web/local interface. |
| **Source** | Deliverables |
| **Verification method** | D |
| **How to test** | Open the service portal/HMI and verify real-time display of SOC, power, voltage, frequency, alarms, and manual setpoints. |
| **Acceptance criterion (pass condition)** | All parameters visible and updating live; a manual setpoint command reflected on the system within 5 s. |
| **Equipment / tooling** | PC/tablet with browser/HMI software, network connection |
| **Test stage** | TRL 6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### SAFE-001 — CE marking

| Field | Detail |
|---|---|
| **Requirement** | The system complies with applicable EU directives (LVD, EMC, Machinery) for CE marking. |
| **Source** | Objectives; Deliverables |
| **Verification method** | I / A |
| **How to test** | Review the CE technical file; verify all applicable directives are addressed with test reports (notified body or self-declaration). |
| **Acceptance criterion (pass condition)** | Valid CE Declaration of Conformity issued; technical file complete; all applicable directives addressed. |
| **Equipment / tooling** | CE technical file, notified body test reports |
| **Test stage** | TRL 6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### SAFE-002 — PGS 37-1 compliance

| Field | Detail |
|---|---|
| **Requirement** | The system complies with the Dutch PGS 37-1 guideline for stationary battery systems. |
| **Source** | Objectives; Deliverables |
| **Verification method** | I / A |
| **How to test** | Review the PGS 37-1 checklist against the design; verify installation, fire safety, ventilation and electrical-safety paragraphs. |
| **Acceptance criterion (pass condition)** | PGS 37-1 documentation complete; no open deviations without approved mitigation. |
| **Equipment / tooling** | PGS 37-1 document, compliance checklist, safety engineer review |
| **Test stage** | TRL 6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

#### SAFE-005 — EMC (IEC 61000)

| Field | Detail |
|---|---|
| **Requirement** | The system complies with the IEC 61000 series for EMC emissions and immunity. |
| **Source** | Hardware datasheet; Project plan (Risk - EMC) |
| **Verification method** | I / T |
| **How to test** | Review EMC test reports (IEC 61000-3-2/-3-3 emissions; 61000-4-2..-4-11 immunity). If independent testing is required, use a certified EMC lab. |
| **Acceptance criterion (pass condition)** | All applicable IEC 61000 parts passed; documented in the CE technical file. |
| **Equipment / tooling** | EMC test reports from manufacturer or accredited lab |
| **Test stage** | TRL 6 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

### TRL 7

#### FUNC-012 — Uptime >= 98%

| Field | Detail |
|---|---|
| **Requirement** | System uptime is at least 98% in operational deployment. |
| **Source** | System Requirements table; TRL 7 |
| **Verification method** | A |
| **How to test** | Record total operating time and unplanned downtime over a pilot period (>= 30 days). Compute uptime = (total - downtime) / total x 100%. |
| **Acceptance criterion (pass condition)** | Uptime >= 98% over the measurement period. |
| **Equipment / tooling** | Data logger, controller uptime log, maintenance records |
| **Test stage** | TRL 7 |
| **Result** (fill in during testing) | |
| **Status** (Pass / Fail) | |

---

## 5. Coverage Checklist

Confirms every category has at least one verification method and acceptance criterion. Review this before testing begins.

| Category | # Requirements | Method assigned? | Acceptance criterion? | Confirmed |
|---|:---:|:---:|:---:|:---:|
| Electrical | 10 | ✅ | ✅ | ☐ |
| Functional | 12 | ✅ | ✅ | ☐ |
| Communication | 4 | ✅ | ✅ | ☐ |
| Mechanical | 4 | ✅ | ✅ | ☐ |
| Thermal & Environmental | 3 | ✅ | ✅ | ☐ |
| Safety & Compliance | 8 | ✅ | ✅ | ☐ |
| Cost | 1 | ✅ | ✅ | ☐ |
| **Total** | **42** | ✅ | ✅ | ☐ |

---

## 6. Test Phase Overview

Testing follows the TRL (Technology Readiness Level) phases from the project plan. Each stage builds on the previous one and ends with a tollgate review.

| Stage | TRL | What is tested | Requirement IDs |
|---|:---:|---|---|
| 1 — Design & Incoming Inspection | TRL 1–2 | Document/certificate review, dimensional check, BOM cost check | MECH-001..004, SAFE-006, SAFE-007, COST-001 |
| 2 — Controller Integration | TRL 3 | Comms buses, fire protection, initial checks | COMM-001..004, THERM-003 |
| 3 — Stable Grid Control | TRL 4 | Grid following/forming, voltage/frequency, response time | ELEC-001, 004, 005, 006, 010; FUNC-001, 002 |
| 4 — Performance Validation | TRL 5 | Power, capacity, efficiency, THD, protection, redundancy | ELEC-002, 003, 007, 008, 009; FUNC-003, 004, 009, 010; SAFE-003, 004, 008; THERM-001, 002 |
| 5 — Field Readiness | TRL 6 | PV/generator, microgrid, black start, AMF, HMI, CE/PGS, IP, EMC | FUNC-005, 006, 007, 008, 011; MECH-003; SAFE-001, 002, 005, 008; THERM-001 |
| 6 — Pilot & Reliability | TRL 7 | Uptime monitoring, reliability, customer feedback | FUNC-012 |

---

## 7. Sign-off

Complete this table when testing for a stage or the full campaign is finished.

| Role | Name | Signature | Date |
|---|---|---|---|
| Tester / Test Engineer | | | |
| Test Lead / Project Lead | | | |
| Quality / Safety Engineer | | | |
| Approver | | | |

**Declaration:** all requirements in this plan have been verified. Results are recorded in the Test Sheets (Section 4). Any failures or open items are tracked in the project action system (GitHub).

*Note: requirements marked "(Assumption)" contain an interpretation of a requirement not explicitly quantified in the source project plan and should be confirmed by the project team before testing.*
