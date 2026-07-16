# 400 A Liquid-Cooled DC Charging System
## Technical Specification Sheet

**Product:** Modular 280 kW / 400 A DC Charging System for Battery Energy Storage
**Configuration:** 7 paralleled liquid-cooled AC/DC conversion modules
**Revision:** Client draft
**Compliance target:** CE - IEC 61439 - NEN 1010 - IEC 61000 (industrial EMC)

---

### 1. System Overview
A fully integrated, liquid-cooled AC/DC charging system delivering up to **280 kW** of
continuous DC power with an AC input rated for **400 A** service. The system is built from
seven parallel conversion modules operating under unified control, providing high
efficiency, galvanic isolation, redundancy, and hot-swap serviceability for demanding
industrial and mobile battery-container applications.

---

### 2. AC Input

| Parameter | Specification |
|---|---|
| Input voltage range | 260 - 530 VAC, 3-phase |
| Input frequency | 50 / 60 Hz |
| Rated input current (nominal) | ~= 420 A |
| Maximum input current | < 532 A |
| Power factor | >= 0.99 at rated load |
| Total harmonic distortion (THDi) | < 5 % |
| AC connection | 400 / 500 A Powerlock set (3P + PE) |
| Inrush behaviour | Compatible with C-type breaker (C80) |

---

### 3. DC Output

| Parameter | Specification |
|---|---|
| Output voltage range | 150 - 1000 VDC |
| Recommended operating window | 600 - 800 VDC |
| Rated output power | 280 kW (continuous) |
| Rated output current | 280 A |
| Maximum output current (constant-power region) | up to 933 A |
| Voltage stabilization accuracy | <= +/-0.5 % |
| Current stabilization accuracy | <= +/-1 % |
| Voltage set-point error | <= +/-0.5 % |
| Power flow | Unidirectional |
| Isolation | Galvanic isolation between AC and DC |

---

### 4. Performance & Efficiency

| Parameter | Specification |
|---|---|
| Peak efficiency | > 97 % |
| Standby power consumption | < 70 W (system) |
| Minimum settable power | >= 55 kW / 80 A |
| Power resolution | Modular steps of 40 kW |
| Redundancy | N+1 capable (module-level) |

---

### 5. Cooling System

| Parameter | Specification |
|---|---|
| Cooling method | Liquid (closed loop) |
| Coolant | 6:4 ethylene-glycol / water mixture |
| Coolant flow rate | 42 - 70 L/min (system) |
| Inlet pressure | < 2 bar |
| Acoustic noise | Near-silent operation |

---

### 6. Control & Communication

| Parameter | Specification |
|---|---|
| Primary industrial protocol | Modbus TCP (via integrated gateway) |
| Module communication | CAN bus (internal) |
| Operation | Software grouping, master/slave current sharing |
| Local interface | HMI LED display: voltage, current, group, address, mode, fault status |
| Remote update | OTA firmware upgrade supported |

---

### 7. Environmental & Mechanical

| Parameter | Specification |
|---|---|
| Operating temperature | -40 C to +75 C (derates from +60 C) |
| Storage temperature | -40 C to +85 C |
| Humidity | <= 95 % RH, non-condensing |
| Altitude / pressure | up to 2000 m / 79 - 110 kPa |
| Protection rating (modules) | IP65 |
| Vibration / mobility | Suitable for mobile / vibration-exposed installations |
| Serviceability | Hot-swappable modules; service without microgrid interruption |

---

### 8. Compliance & Safety

| Parameter | Specification |
|---|---|
| Certification | CE |
| Installation standards | IEC 61439, NEN 1010 |
| EMC | IEC 61000 (industrial) |
| Protection features | Battery back-feed protection - residual voltage discharge circuit - fault monitoring |
| System reliability | > 98 % uptime (design target) |

---

*All values represent the complete 7-module system configuration. Specifications are
indicative and subject to final confirmation and factory acceptance testing.*
