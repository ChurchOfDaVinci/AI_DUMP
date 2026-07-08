# e-PU Cabinet V2 — Measurement Plan (Requirements Verification Plan)

**Document:** e-PU Cabinet V2 Measurement Plan  
**Based on:** e-PU cabinet V2 project plan (2).docx  
**Version:** 1.0  
**Date:** 2026-07-08

---

## 1. Introduction

This document is the **Measurement Plan** for the e-PU Cabinet V2 project — a low-cost, high-performance stationary Battery Energy Storage System (BESS) platform that uses Solar East cabinet hardware together with VDL Energy Systems control software.

**Purpose:** To ensure that every requirement from the project plan is verified and tested during the test phase, with nothing missed.

**How to use this plan:**
1. Each requirement has its own row in the verification matrix (Section 3).
2. During the test phase, fill in the **Result** column with the measured value or observation.
3. Mark **Status** as **Pass** or **Fail** based on whether the acceptance criterion was met.
4. Use the Coverage Checklist (Section 4) to confirm all categories have been checked off.
5. Complete the Sign-off section (Section 6) when all testing is done.

---

## 2. Legend

### 2.1 Status Values

| Status | Meaning |
|---|---|
| **Not started** | Test has not been performed yet |
| **In progress** | Test is currently being executed |
| **Pass** | Requirement verified — acceptance criterion met |
| **Fail** | Acceptance criterion not met — corrective action required |
| **Blocked** | Test cannot proceed — dependency or tooling issue |
| **N/A** | Not applicable for this configuration |

### 2.2 Verification Methods

| Code | Method | Plain language description |
|---|---|---|
| **T** | Test | Physically operate the system and measure it with instruments (power analyser, multimeter, oscilloscope, etc.) |
| **I** | Inspection | Look at it — visual check, dimensional check, or document review (e.g. check IP-rating sticker, measure physical dimensions, review CE certificate) |
| **A** | Analysis | Calculation, simulation, or engineering analysis (e.g. efficiency calculation from measured P_in / P_out, FEM model, datasheet review) |
| **D** | Demonstration | Show that a feature works under normal operating conditions without dedicated measurements (e.g. demonstrate HMI responds correctly, black start sequence completes) |

---

## 3. Requirements Verification Matrix

> **Notes:**
> - IDs are grouped by category: **ELEC** (Electrical), **FUNC** (Functional), **COMM** (Communication), **MECH** (Mechanical), **THERM** (Thermal/Environmental), **SAFE** (Safety/Compliance), **COST** (Cost).
> - Requirements come from the System Requirements table (Table 2), hardware datasheet (Table 4), project scope, and objectives in the project plan.
> - Rows marked *(Assumption)* contain an interpretation of a vague requirement — review before testing.

### 3.1 Electrical Requirements

| ID | Requirement | Source | Method | Test Step | Acceptance Criterion | Equipment / Tooling | Test Stage | Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| ELEC-001 | Rated AC output power is 125 kW | System Requirements table; Hardware datasheet | T | Connect rated resistive/reactive load. Measure AC output power at rated conditions with a power analyser. | Measured output power ≥ 125 kW at 400 V AC, 50 Hz | Power analyser (e.g. Yokogawa WT500 or equivalent), calibrated CT/PT | TRL 4 / TRL 5 | | |
| ELEC-002 | Peak power sustained at 110% (continuous) and 120% for 1 minute | System Requirements table | T | Run system at 110% of rated power for ≥ 5 minutes; then at 120% of rated power for exactly 1 minute. Log power and temperature. | 110% peak (137.5 kW) sustained without trip or derating; 120% peak (150 kW) held for 1 min without trip | Power analyser, thermal camera, data logger | TRL 5 | | |
| ELEC-003 | Usable energy capacity ≥ 250 kWh at SOH 99% | System Requirements table | T | Fully charge the battery from empty (0% SOC). Discharge at rated power and measure total energy delivered. | Discharged energy ≥ 250 kWh when battery SOH ≥ 99% | Power analyser, energy meter, BMS readout | TRL 5 | | |
| ELEC-004 | Rated DC voltage 832 V, range 702–936 V | Hardware datasheet | T | Monitor DC bus voltage during full charge/discharge cycle. | DC bus voltage stays within 702–936 V throughout; nominal at 832 V | Calibrated DC voltmeter / data logger on DC bus | TRL 4 | | |
| ELEC-005 | Rated AC voltage 400 V ±15% (on-grid); 400 V ±3% (off-grid/island) | Hardware datasheet | T | Measure AC output voltage in both grid-following and grid-forming modes under varying loads. | Grid-following: AC voltage 400 V ±15% (340–460 V); Grid-forming (island): 400 V ±3% (388–412 V) | True-RMS voltmeter / power analyser | TRL 4 / TRL 5 | | |
| ELEC-006 | Grid frequency 50 Hz / 60 Hz supported | System Requirements table; Hardware datasheet | T | Switch system configuration between 50 Hz and 60 Hz grid settings. Verify output frequency in each mode. | Output frequency: 50.00 ±0.5 Hz (50 Hz mode); 60.00 ±0.5 Hz (60 Hz mode) | Frequency meter / power analyser | TRL 4 | | |
| ELEC-007 | Total Harmonic Distortion (THD) < 3% with linear load | System Requirements table; Hardware datasheet | T | Measure THD of AC output voltage and current at rated load with a linear (resistive) load. | THD voltage < 3% and THD current < 3% at rated linear load | Power quality analyser with THD measurement capability | TRL 5 | | |
| ELEC-008 | Power factor range −1 to +1 (full four-quadrant operation) | Hardware datasheet | T | Command the system to deliver leading, lagging, and unity power factor at rated power. Record P and Q. | Power factor controllable across range −1.0 to +1.0 without fault | Power analyser with reactive power measurement | TRL 5 | | |
| ELEC-009 | System round-trip efficiency > 88% | System Requirements table | A / T | Measure total AC energy input during charging (E_charge) and total AC energy output during discharging (E_discharge). Calculate efficiency = E_discharge / E_charge × 100%. | Calculated round-trip efficiency ≥ 88% | Energy meter on AC input and output, data logger | TRL 5 | | |
| ELEC-010 | Grid response time < 100 ms (from command to power delivery) | System Requirements table | T | Send a step change command (e.g. 0 → 100% power setpoint) via controller and timestamp start and end of power ramp. | Time from command to reaching ≥ 90% of setpoint < 100 ms | Oscilloscope or data logger with ≥ 1 ms timestamp resolution; power analyser | TRL 4 / TRL 5 | | |

### 3.2 Functional Requirements

| ID | Requirement | Source | Method | Test Step | Acceptance Criterion | Equipment / Tooling | Test Stage | Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| FUNC-001 | Grid-following operation: system follows grid voltage and frequency, injecting/absorbing real and reactive power on command | Project scope; Objectives | T / D | Connect system to a simulated or live grid. Command active (P) and reactive (Q) power setpoints via controller. Verify system tracks setpoints. | P setpoint followed within ±5% of commanded value; Q setpoint followed within ±5 kVAr; stable for ≥ 5 min | Power analyser, grid simulator or live grid connection | TRL 4 | | |
| FUNC-002 | Grid-forming operation: system forms its own AC voltage and frequency in island/microgrid mode | Project scope; Objectives | T / D | Disconnect from external grid (island mode). Connect a local load. Verify system maintains stable AC voltage and frequency without external reference. | Stable island AC voltage 400 V ±3%, 50 Hz ±0.5 Hz with load steps applied | Power analyser, programmable load bank, oscilloscope | TRL 4 / TRL 5 | | |
| FUNC-003 | Multi-BESS parallel operation: up to 1 MW total power with multiple e-PU cabinets | System Requirements table; Objectives | T | Connect ≥ 2 e-PU cabinets in parallel. Verify load sharing and total power output up to 1 MW (8 × 125 kW). *(Assumption: test with ≥ 2 units if full 1 MW not available; scale to confirm principle.)* | Each unit shares load within ±10% of expected share; combined output reaches commanded total without instability | Power analyser per unit, master controller, communication network | TRL 5 / TRL 6 | | |
| FUNC-004 | Peak shaving and load management: system reduces grid peak demand on command | Project scope | D | Configure a peak shaving setpoint. Apply a step-load above the setpoint. Verify system responds to limit grid import to the setpoint. | Grid import does not exceed configured setpoint ± 5 kW within 100 ms of load step | Power analyser at grid connection point, programmable load | TRL 5 / TRL 6 | | |
| FUNC-005 | PV control and curtailment: system integrates with PV source and can curtail PV output | Objectives; Deliverables | D / T | Connect a PV simulator or actual PV array. Issue curtailment command. Measure PV power output before and after command. | PV power curtailed to commanded setpoint ±5% within 500 ms of command | PV simulator or real PV array with power measurement, controller interface | TRL 6 | | |
| FUNC-006 | Generator control (fixed power): system coordinates with a generator at fixed power setpoint | Objectives; Deliverables | D | Connect a generator simulator or real generator. Verify system accepts generator's fixed power and adjusts BESS to compensate load variation. | Generator power stays within ±5% of setpoint; BESS compensates load variation smoothly without generator trip | Generator or simulator, power analysers, controller | TRL 6 | | |
| FUNC-007 | Black start capability: system can start from zero and energise a dead microgrid | Objectives; Deliverables | D / T | With grid disconnected and local load de-energised, initiate black start sequence from BMS/controller. | System forms AC voltage (400 V ±3%, 50 Hz ±0.5 Hz) from dead bus and energises local load within 60 s *(Assumption: 60 s accepted if no spec given)* | Oscilloscope, power analyser, stopwatch/data logger | TRL 6 | | |
| FUNC-008 | Automatic mains failure (AMF) recovery: system detects grid loss and automatically switches to island mode | Deliverables | D / T | Simulate grid outage while system is running in grid-following mode. Verify automatic transfer to island/grid-forming mode. | Transfer to island mode completed without load interruption > 100 ms; system remains stable in island mode | Power analyser, oscilloscope (voltage drop on load side), data logger | TRL 6 | | |
| FUNC-009 | Microgrid operation with load sharing across multiple BESS units | Objectives; Deliverables | T | Run ≥ 2 BESS units in island microgrid. Apply variable loads. Verify automatic load sharing between units. | Load sharing deviation between units ≤ ±10% of each unit's rated power; no instability over 10-min test | Power analysers per unit, programmable load, controller | TRL 5 / TRL 6 | | |
| FUNC-010 | Redundancy and fail-safe operation: one unit failure does not cause complete system shutdown | Objectives; Deliverables | D | In multi-BESS setup, force one unit offline (simulate fault). Verify remaining units continue to supply load. | Remaining BESS units take over load within 5 s; total system remains operational; alarms correctly raised | Controller logs, power analysers | TRL 5 / TRL 6 | | |
| FUNC-011 | HMI / service portal: monitoring and diagnostics accessible via web/local interface | Deliverables | D | Open service portal / HMI on a PC. Verify real-time display of: SOC, power, voltage, frequency, alarms, and manual setpoint commands. | All listed parameters visible and updating in real-time; manual setpoint command reflected on system within 5 s | PC or tablet with browser/HMI software, network connection | TRL 6 | | |
| FUNC-012 | System uptime ≥ 98% in operational deployment | System Requirements table; TRL 7 | A | Record total operational time and unplanned downtime over a defined pilot period (≥ 30 days). Calculate uptime % = (total time − downtime) / total time × 100%. *(Assumption: measured during TRL 7 pilot.)* | Uptime ≥ 98% over the measurement period | Data logger, controller uptime log, maintenance records | TRL 7 | | |

### 3.3 Communication Requirements

| ID | Requirement | Source | Method | Test Step | Acceptance Criterion | Equipment / Tooling | Test Stage | Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| COMM-001 | Modbus TCP communication functional | System Requirements table | T | Connect an external EMS/SCADA client. Read and write all defined Modbus registers over TCP/IP. | All defined Modbus registers readable and writable; correct values reflected on system; no communication errors over 1-hour test | Modbus TCP client (e.g. Modscan, custom script), network switch, PC | TRL 3 / TRL 5 | | |
| COMM-002 | CAN bus communication functional | System Requirements table; Hardware datasheet | T | Connect CAN analyser to system CAN bus. Verify all expected CAN frames transmitted and received correctly between BMS, inverter, and VDL controller. | All defined CAN messages present on bus; correct data values; no lost frames over 30-min test | CAN analyser (e.g. PCAN, Vector CANalyzer), CAN interface cable | TRL 3 | | |
| COMM-003 | Ethernet communication functional | System Requirements table; Hardware datasheet | T | Ping all networked devices. Execute full data exchange (HMI, controller, BMS, monitoring) over Ethernet. | All devices reachable; data exchange successful; latency < 50 ms *(Assumption)* | Network switch, PC, ping/traceroute tools | TRL 3 | | |
| COMM-004 | RS485 communication functional | Hardware datasheet | T | Connect RS485 device (e.g. power meter or sensor). Verify data exchange using the defined protocol (Modbus RTU or similar). | RS485 data exchange successful; correct register values; no framing errors | RS485 USB adapter, Modbus RTU client | TRL 3 | | |

### 3.4 Mechanical Requirements

| ID | Requirement | Source | Method | Test Step | Acceptance Criterion | Equipment / Tooling | Test Stage | Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| MECH-001 | Cabinet dimensions: 1000 mm (W) × 2300 mm (H) × 1350 mm (D) | Hardware datasheet | I | Measure width, height, and depth of the assembled cabinet with a tape measure. | W: 1000 ±5 mm; H: 2300 ±5 mm; D: 1350 ±5 mm | Steel tape measure or laser distance meter | TRL 3 (incoming inspection) | | |
| MECH-002 | Cabinet weight ≤ 2450 kg | Hardware datasheet | I / A | Verify weight from shipping documentation or weigh using calibrated floor scale. | Documented or measured weight ≤ 2450 kg | Calibrated industrial scale or supplier weight certificate | TRL 3 (incoming inspection) | | |
| MECH-003 | IP54 ingress protection rating | System Requirements table; Hardware datasheet | I / T | Inspect cabinet seals and enclosure for completeness. Verify IP54 test certificate from manufacturer. *(If independent test required: perform IP5X dust test and IP X4 water splash test per IEC 60529.)* | IP54 rating confirmed by manufacturer certificate; or independently tested to IEC 60529 IP54 | IP54 test certificate, IEC 60529 test setup (if independent test needed) | TRL 3 / TRL 6 | | |
| MECH-004 | Maximum operating altitude 2000 m | Hardware datasheet | I / A | Review manufacturer datasheet; confirm derating tables are acceptable for intended installation altitude. | Manufacturer specifies operation at ≤ 2000 m altitude; installation site confirmed to be within this limit | Manufacturer datasheet, site survey data | TRL 2 (design review) | | |

### 3.5 Thermal and Environmental Requirements

| ID | Requirement | Source | Method | Test Step | Acceptance Criterion | Equipment / Tooling | Test Stage | Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| THERM-001 | Operating temperature range: −20 °C to +55 °C | System Requirements table; Hardware datasheet | T / A | If climate chamber available: test start-up at −20 °C and continuous operation at +55 °C. Otherwise: verify via manufacturer thermal qualification data and confirm cooling design by analysis. *(Assumption: full climate chamber test if available; otherwise accepted by analysis + datasheet.)* | System starts successfully at −20 °C; operates continuously at +55 °C without derating beyond spec; no thermal shutdowns | Climate chamber (−20 to +55 °C), thermal camera, data logger; or manufacturer thermal datasheet | TRL 5 / TRL 6 | | |
| THERM-002 | Acoustic noise level < 75 dB(A) at 1 m | System Requirements table | T | Measure A-weighted sound pressure level at 1 m distance from each face of the cabinet during full-load operation. | Maximum measured noise < 75 dB(A) at 1 m under full-load operating conditions | Calibrated sound level meter (Class 1 or 2 per IEC 61672) | TRL 5 / TRL 6 | | |
| THERM-003 | Fire protection system (Aerosol suppression) installed and functional | Hardware datasheet | I / D | Inspect aerosol fire suppression units for correct installation, expiry date, and activation connectivity. Perform functional test of activation signal (without triggering aerosol). | Aerosol units installed per manufacturer layout; within service life; activation signal test succeeds | Visual inspection checklist, activation test procedure from supplier | TRL 3 / TRL 6 | | |

### 3.6 Safety and Compliance Requirements

| ID | Requirement | Source | Method | Test Step | Acceptance Criterion | Equipment / Tooling | Test Stage | Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| SAFE-001 | CE marking: system complies with applicable EU directives (LVD, EMC, Machinery) | Objectives; Deliverables | I / A | Review CE technical file. Verify all applicable EU directives are addressed. Confirm test reports from notified body or self-declaration with supporting test evidence. | Valid CE declaration of conformity issued; technical file complete; all applicable directives addressed | CE technical file, notified body test reports or self-declaration | TRL 6 | | |
| SAFE-002 | PGS 37-1 compliance (Dutch safety guideline for stationary battery systems) | Objectives; Deliverables | I / A | Review PGS 37-1 checklist against system design. Verify all applicable paragraphs are addressed (installation, fire safety, ventilation, electrical safety). | PGS 37-1 compliance documentation complete; no open deviations without approved mitigation | PGS 37-1 document, compliance checklist, safety engineer review | TRL 6 | | |
| SAFE-003 | Overcurrent protection: system disconnects safely on AC or DC overcurrent | Project plan (Risk — protection testing) | T | Inject overcurrent condition (via load bank or simulated fault). Verify protection trips within specified time. *(Assumption: trip time ≤ 100 ms for AC short circuit; verify exact setpoints from protection study.)* | System trips on overcurrent within ≤ 100 ms; no permanent component damage; alarms raised; system can restart after fault clearance | Load bank / fault injection setup, oscilloscope, data logger | TRL 5 | | |
| SAFE-004 | Overvoltage protection: system disconnects safely on AC or DC overvoltage | Project plan (Risk — overvoltage validation) | T | Apply overvoltage condition (DC or AC) above defined threshold. Verify protection trips within specified time. *(Assumption: AC overvoltage trip at 115% of rated voltage; DC trip at upper DC limit 936 V.)* | System trips on overvoltage within specified time; no permanent damage; alarms raised | Programmable AC/DC source or field voltage injection, oscilloscope | TRL 5 | | |
| SAFE-005 | EMC compliance per IEC 61000 series (electromagnetic emissions and immunity) | Hardware datasheet compliance standard; Project plan (Risk — EMC) | I / T | Review manufacturer EMC test reports (IEC 61000-3-2, -3-3 emissions; IEC 61000-4-2 to -4-11 immunity). If independent EMC testing is required: perform in certified EMC test lab. | All IEC 61000 applicable parts passed; documented in CE technical file | EMC test reports from manufacturer or accredited test lab | TRL 6 | | |
| SAFE-006 | Battery cell safety: LFP cells compliant with UN38.3 (transport) and IEC 62619 (stationary storage safety) | Hardware datasheet compliance standard | I | Verify manufacturer's UN38.3 and IEC 62619 certificates/test reports are available and valid for the LFP 314 Ah cells used. | Valid UN38.3 and IEC 62619 certificates from battery cell manufacturer on file | Manufacturer certificates | TRL 2 / TRL 3 (design & incoming inspection) | | |
| SAFE-007 | Power electronics compliance per IEC 62477 | Hardware datasheet compliance standard | I | Verify manufacturer's IEC 62477 test report is available and valid for the inverter/power electronics. | Valid IEC 62477 test report on file | Manufacturer test report | TRL 2 / TRL 3 | | |
| SAFE-008 | Safe operation under fault and island conditions: system enters a defined safe state on fault detection | Project scope | T / D | Simulate fault conditions (grid loss, communication loss, BMS fault). Verify system responds with correct protective action (e.g. safe shutdown, island mode, alarms). | System enters correct safe state for each fault type within specified time; no uncontrolled energy release; all alarms correct | Fault simulation tools, controller logs, power analysers | TRL 5 / TRL 6 | | |

### 3.7 Cost Requirement

| ID | Requirement | Source | Method | Test Step | Acceptance Criterion | Equipment / Tooling | Test Stage | Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| COST-001 | Additional VDL controller hardware material cost < €3,500 per system | Project plan — Cost/Budget section | A | Sum the BOM cost of all VDL-added controller hardware components (not including base Solar East cabinet). Compare to €3,500 target. | Total VDL controller BOM cost ≤ €3,500 per system unit | Bill of Materials, supplier quotations | TRL 2 / TRL 3 (design review) | | |

---

## 4. Coverage Checklist

This table confirms that every requirement category has at least one verification method assigned. Check this off before starting the test phase.

| Category | # Requirements | All have method? | All have acceptance criterion? | Confirmed |
|---|---|---|---|---|
| Electrical (ELEC) | 10 | ✅ | ✅ | ☐ |
| Functional (FUNC) | 12 | ✅ | ✅ | ☐ |
| Communication (COMM) | 4 | ✅ | ✅ | ☐ |
| Mechanical (MECH) | 4 | ✅ | ✅ | ☐ |
| Thermal / Environmental (THERM) | 3 | ✅ | ✅ | ☐ |
| Safety / Compliance (SAFE) | 8 | ✅ | ✅ | ☐ |
| Cost (COST) | 1 | ✅ | ✅ | ☐ |
| **Total** | **42** | **✅** | **✅** | ☐ |

**Confirmation:** Before testing begins, the test lead should review this checklist and sign off that all 42 requirements are covered.

---

## 5. Test Phase Overview

Testing is structured to follow the TRL (Technology Readiness Level) phases defined in the project plan. Each stage builds on the previous one.

| Stage | TRL Phase | What is tested | Requirement IDs |
|---|---|---|---|
| **Stage 1 — Design & Incoming Inspection** | TRL 1–2 | Document review, hardware specification checks, certificate verification, dimensional check, BOM cost check | MECH-001, MECH-002, MECH-003 (cert), MECH-004, SAFE-006, SAFE-007, COST-001 |
| **Stage 2 — Controller Integration & Subsystem Tests** | TRL 3 | Controller fitted, communication buses verified, fire protection installed, initial electrical checks | COMM-001, COMM-002, COMM-003, COMM-004, THERM-003, MECH-001 (post-build) |
| **Stage 3 — Stable Grid Control Validation** | TRL 4 | Grid following and grid forming stable operation, frequency and voltage control, grid response time | ELEC-001, ELEC-004, ELEC-005, ELEC-006, ELEC-010, FUNC-001, FUNC-002 |
| **Stage 4 — Performance Validation** | TRL 5 | Full performance tests: power, capacity, peak, efficiency, THD, protection, multi-BESS basics, redundancy | ELEC-002, ELEC-003, ELEC-007, ELEC-008, ELEC-009, FUNC-003, FUNC-004, FUNC-009, FUNC-010, SAFE-003, SAFE-004, SAFE-008, THERM-001, THERM-002 |
| **Stage 5 — Field Readiness Validation** | TRL 6 | PV control, generator control, microgrid, black start, AMF, HMI, CE/PGS documentation, IP rating, EMC | FUNC-005, FUNC-006, FUNC-007, FUNC-008, FUNC-011, MECH-003 (independent test), SAFE-001, SAFE-002, SAFE-005, SAFE-008, THERM-001 (if climate chamber) |
| **Stage 6 — Pilot & Reliability Validation** | TRL 7 | Uptime monitoring over pilot deployment, customer feedback, reliability | FUNC-012 |

**Progression rule:** Each stage must be completed and approved (tollgate review) before moving to the next stage, as described in the project plan tollgate process.

---

## 6. Sign-off

Complete this table when all testing for a given stage or the full test campaign is finished.

| Role | Name | Signature | Date |
|---|---|---|---|
| Tester / Test Engineer | | | |
| Test Lead / Project Lead | | | |
| Quality / Safety Engineer | | | |
| Approver | | | |

**Declaration:** All requirements listed in this measurement plan have been verified. Results are recorded in the Result and Status columns of Section 3. Any failures or open items are documented in the project's action tracking system (GitHub).

---

*This measurement plan is based on the content of `e-PU cabinet V2 project plan (2).docx`. Requirements marked "(Assumption)" contain an interpretation of a requirement that was not explicitly quantified in the source document — these should be reviewed and confirmed by the project team before testing.*
