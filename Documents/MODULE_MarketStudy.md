# Module-Level Market Study: Battery Charging Power Modules
## e-PU10 BESS — 400 A / ~300 kW AC/DC Charger

> **Replaces / improves:** `Documents/MarketStudy_400A_Charger.xlsx` (cabinet-level study)
> **Scope:** Individual power conversion **modules only** — the DC/DC or AC/DC building blocks
> that are paralleled to build the 400 A charger, not full charger cabinets, EVSE stations,
> on-board vehicle chargers, or complete systems.
> **Research date:** 2026-06-29
> **Project lead:** Lennard Rietkerk
> **TRL stage:** TRL 2 → TRL 3 hand-off (component selection for conceptual design)

---

## 1. Scope & Method

### 1.1 Hard Scope Rule

**MODULES ONLY.** This study evaluates individual power conversion modules — standalone AC/DC
rectifier modules and isolated DC/DC converter modules — that can be purchased and paralleled to
build the complete charger system. Products evaluated and excluded are listed in §4.

### 1.2 Research Methodology

- Vendor product pages, publicly available datasheets, and third-party distributor pages were
  reviewed for each candidate module.
- Web searches were conducted on 2026-06-29 for current specifications.
- Where a confirmed datasheet could be located, specifications are marked **[DS]** (datasheet-confirmed).
- Where figures come from marketplace/distributor listings or vendor marketing material only,
  they are marked **[IND]** (indicative — needs vendor confirmation before TRL 3 commit).
- For modules where no public datasheet was found, price and efficiency are marked **[RFQ]**
  (request-for-quote only).

### 1.3 Target System Parameters

From `Documents/project.txt`:
- Output: **400 A into a 600–800 VDC battery** (e-PU10 BESS main battery)
- Total power: approximately **250–320 kW** (400 A × 625–800 V)
- Input: 3-phase 400 V AC (Powerlock 400/500 A, 3P+PE)
- Deadline: November 2026

---

## 2. Requirements Checklist

| # | Requirement | Priority | Target Value | Source |
|---|---|---|---|---|
| R01 | Galvanic isolation between AC/DC | **Must** | Reinforced or functional isolation; isolation voltage ≥ 2 kVDC | project.txt |
| R02 | Unidirectional (charging) operation | **Must** | Charging direction; bidirectional-capable modules acceptable if charging mode is well-supported | project.txt |
| R03 | Liquid cooling | **Must** | Water/glycol loop; no fan-only modules | project.txt |
| R04 | DC output voltage range | **Must** | Covers at least 600–800 VDC; wider is preferred | project.txt |
| R05 | Module power range | **Must** | 30–100 kW per module preferred | project.txt |
| R06 | Minimum settable output power | **Must / Rec** | ≤ 55 kW / 80 A (must); ≤ 20 kW / 32 A (recommended) | project.txt |
| R07 | System efficiency | **Must** | > 97.5% at system level (total heat < 7 kW); module efficiency ideally ≥ 97.5% | project.txt |
| R08 | Communications protocol | **Must** | ModbusTCP (favoured), CAN, PROFINET or EtherCAT; CAN-only is acceptable with gateway | project.txt |
| R09 | EU / CE compliance | **Must** | CE marking; compliant with IEC 61439, NEN 1010 where applicable | project.txt |
| R10 | Mobile / vibration & shock resistance | **Must** | IEC 60068 vibration/shock rating; conformal coating or potting preferred | project.txt |
| R11 | Full-set weight | **Must** | < 500 kg for all modules combined | project.txt |
| R12 | Full-set material cost | **Must** | < €20,000 for module set | project.txt |
| R13 | PFC (for AC/DC modules) | **Must** | Power factor ≥ 0.99; THD ≤ 5% | project.txt |
| R14 | Inrush behaviour | **Must** | Compatible with C-type C80 circuit breaker (must) and B-type B32 (recommended) | project.txt |
| R15 | Size envelope | **Must** | Must fit within the e-PU10 power-module mechanical envelope | project.txt |
| R16 | Multi-module / paralleling capability | **Rec** | Hot-plug, CAN/addressing scheme for ≥ 8 modules | project.txt |
| R17 | Serviceability without BESS interruption | **Rec** | Hot-swappable preferred | project.txt |
| R18 | Reliability | **Rec** | > 98% system uptime; MTBF > 200,000 h per module | project.txt |
| R19 | EU-based supplier | **Rec** | Preferred for CE documentation quality and supply security | project.txt |
| R20 | Price per kW | **Rec** | < €200/kW indicative target for modules | project.txt |

---

## 3. Excluded & Out-of-Scope Products

The following were evaluated and excluded. They are listed here for completeness.

| Product | Reason for Exclusion | Category |
|---|---|---|
| **Tame-Power CONVY-DCDC-800V** (100 kW) | Non-isolated DC/DC — **fails R01 (galvanic isolation)** | Fails must-have |
| **Brusa NLG664** (22 kW) | On-board charger; DC output max 450 VDC — **fails R04 (600–800 V)** | Fails must-have |
| **Zekalabs TinoPrime 24kW** | LV output side limited to 120 VDC; HV side 900 V but low-voltage output not suitable for 600–800 V BESS charging — **fails R04** | Fails must-have |
| **ABB ACS880-1604LC** | Drive/lab supply, not a charging module — out of scope | Out of scope |
| **Magna-Power TS Series** | Laboratory programmable supply — out of scope | Out of scope |
| **Brusa BSC625** | DC/DC for 48 V auxiliary bus; max HV output 450 V — **fails R04** | Fails must-have |
| **Eltek Flatpack2 HE** | 2 kW telecom rectifier; output 43.5–57.6 VDC — fails R04 and R05 | Fails must-have |
| **Phoenix Contact QUINT series** | 24/48 VDC PSU; output voltage below 600 V — fails R04 | Fails must-have |

---

## 4. Module Comparison Table

> **Legend:** [DS] = datasheet-confirmed | [IND] = indicative/marketplace listing | [RFQ] = request-for-quote only
> Efficiency targets: peak ≥ 97.5% (must-have), full-load ≥ 96% (practical minimum)

| # | Vendor / Module | Type | Power / module | DC Voltage Range | Galvanic Isolation | Cooling | Comms | Efficiency Peak / Full-load | IP / Vibration Rating | Dimensions (mm) L×W×H / Weight | Country of Origin | Unit Price (indicative) | Price / kW | Lead Time | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Infypower LRG1K0100G** | AC/DC | 30 kW [DS] | 150–1000 VDC [DS] | Yes [DS] | Liquid (G65) [DS] | CAN bus, up to 48 modules [DS] | ≥96.5% / ≥96.2% [DS] | IP30 [DS]; conformal coating + potted [DS] | 453×300×123 / ≤30 kg [DS] | China | ~$2,900–4,200 [IND] | ~$97–140/kW [IND] | 4–12 wk [IND] | **High** — datasheet on file |
| 2 | **Winline UXR100030B** | AC/DC | 30 kW [DS] | 100–1000 VDC (CP 300–1000 V) [DS] | Yes [DS] | **Air (fan)** [DS] — liquid **unconfirmed** [IND] | CAN bus, up to 60 modules [DS] | ~95.5% FL [DS]; ~97% peak [IND] | Not stated [IND] | 459×360×85 / ≤20 kg [DS] | China (Shenzhen) | ~$3,000–4,000 [IND] | ~$100–133/kW [IND] | 4–12 wk [IND] | **Medium** — DS for electrical; cooling needs vendor confirmation |
| 3 | **IMAX Power BIDC1K0100** | DC/DC isolated, **unidirectional** | 30 kW [IND] | 50–1000 VDC, 0–100 A [IND] | Yes (galvanic) [IND] | Liquid (potted) [IND] | CAN [IND] | >96.5% [IND] | IP67 claimed [IND]; potted [IND] | Not confirmed [RFQ] | China | On request [RFQ] | On request [RFQ] | On request | **Low** — no datasheet found; all from marketplace listings |
| 4 | **Advantics ADB-PC-DC01** | DC/DC isolated, **bidirectional** | 100 kW [DS] | Port B: 200–1500 VDC [DS] (Port A: 750–950 V bus) | Reinforced galvanic [DS] | Liquid (IP67) [DS] | Isolated CAN 2.0B [DS] | ~98% peak (SiC) [DS] | IP67 [DS]; IEC-compliant | 725×440×176 / 47 kg [DS] | France (EU) | On request [RFQ] | On request [RFQ] | On request | **High** — full datasheet and documentation online |
| 5 | **Converdan CDC350KAC** | DC/DC isolated, **bidirectional** | 50 kW [DS] | Up to 1000 VDC (bidirectional) [DS] | Yes (galvanic) [DS] | **Air (3U rack)** [DS] — liquid **on request** [IND] | CAN bus, up to 16 units [DS] | >98% claimed [IND] | Not stated for mobile [IND]; rack-mount design | 19" rack, 3U [DS] / Not stated | Denmark (EU) | On request [RFQ] | On request [RFQ] | On request | **Medium** — product page confirmed; liquid cooling and full specs need vendor RFQ |
| 6 | **Phoenix Contact CHARX PS-M2/3AC/1000DC/30KW** | AC/DC | 30 kW [DS] | 30–1000 VDC, 0–100 A [DS] | Yes; 2121 VDC isolation [DS] | **Air (fan)** [DS] — liquid **unconfirmed** | CAN (CANopen) [DS]; ModbusTCP at system controller level only [DS] | ≥95% at >50% load [DS] | IP20 [DS] (needs enclosure) | 483×550×134 (19" 3U) / ~31 kg [DS] | Germany (EU) | Not listed [RFQ] | Not listed [RFQ] | 4–8 wk (estimated) | **High** — full datasheet; but air-cooled standard |
| 7 | **Huawei Digital Power / Gresgying / Sinexcel generic 30–40 kW** | AC/DC | 30–40 kW [IND] | Up to 1000 VDC [IND] | Yes [IND] | Liquid [IND] | CAN [IND] | >96% [IND] | Not stated [IND] | Varies by OEM [IND] | China | ~$2,500–4,000/unit [IND] | ~$83–100/kW [IND] | 4–16 wk [IND] | **Low** — marketplace/marketing only; needs RFQ with specific datasheet |

---

## 5. Per-Criterion Verdict

### Key:  ✅ Meets  |  ⚠️ Partially meets / conditional  |  ❌ Fails

| Criterion | Infypower LRG1K0100G | Winline UXR100030B | IMAX Power BIDC1K0100 | Advantics ADB-PC-DC01 | Converdan CDC350KAC | Phoenix Contact CHARX 30kW | Huawei/Sinexcel generic |
|---|---|---|---|---|---|---|---|
| **R01 Isolation** | ✅ Yes, galvanic [DS] | ✅ Yes [DS] | ✅ Yes, galvanic [IND] | ✅ Reinforced [DS] | ✅ Yes [DS] | ✅ Yes, 2121 VDC [DS] | ✅ Yes [IND] |
| **R02 Unidirectional** | ✅ AC/DC charging only | ✅ AC/DC charging only | ✅ Unidirectional DC/DC | ⚠️ Bidirectional — charging mode supported [DS] | ⚠️ Bidirectional — configure for charge mode | ✅ AC/DC charging only | ✅ AC/DC charging only |
| **R03 Liquid cooled** | ✅ Liquid (G65) [DS] | ❌ Air standard; liquid unconfirmed | ✅ Liquid potted [IND] | ✅ Liquid IP67 [DS] | ⚠️ Air standard; liquid on request | ❌ Air standard; liquid unconfirmed | ✅ Liquid [IND] |
| **R04 DC 600–800 V** | ✅ 150–1000 V covers range [DS] | ✅ 100–1000 V covers range [DS] | ✅ 50–1000 V covers range [IND] | ✅ 200–1500 V (Port B) covers range [DS] | ✅ Up to 1000 V covers range [DS] | ✅ 30–1000 V covers range [DS] | ✅ Up to 1000 V [IND] |
| **R05 30–100 kW/module** | ✅ 30 kW [DS] | ✅ 30 kW [DS] | ✅ 30 kW [IND] | ✅ 100 kW [DS] | ✅ 50 kW [DS] | ✅ 30 kW [DS] | ✅ 30–40 kW [IND] |
| **R06 Min settable power** | ⚠️ Min power not stated in DS; CAN settable but threshold unconfirmed [RFQ] | ⚠️ Not stated [RFQ] | ⚠️ Not stated [RFQ] | ⚠️ Not stated in DS; likely software-configurable [RFQ] | ⚠️ Not stated [RFQ] | ⚠️ Not stated [RFQ] | ⚠️ Not stated [RFQ] |
| **R07 Efficiency ≥ 97.5%** | ❌ 96.5% peak / 96.2% FL — **below target** [DS] | ❌ ~95.5% FL — **well below target** [DS] | ❌ >96.5% — **below target** [IND] | ✅ ~98% peak (SiC) [DS] | ✅ >98% claimed [IND] — needs confirmation | ❌ ≥95% — **well below target** [DS] | ❌ >96% — **below target** [IND] |
| **R08 Comms protocol** | ⚠️ CAN only — gateway needed for ModbusTCP | ⚠️ CAN only — gateway needed | ⚠️ CAN only — gateway needed | ⚠️ Isolated CAN — gateway needed | ⚠️ CAN — gateway needed; bidirectional CAN master/slave | ⚠️ CAN (CANopen); ModbusTCP at system controller only | ⚠️ CAN only — gateway needed |
| **R09 EU / CE** | ✅ CE, TUV, UL2202 [DS] | ✅ CE, UL2202, TUV [DS] | ⚠️ CE claimed [IND] — verify documentation | ✅ IEC 61851, IEC 62477, UL 2202 [DS] | ✅ EU (DK), EU standards [IND] | ✅ CE, IEC 61851, UL2202 [DS] — excellent EU documentation | ⚠️ CE claimed [IND] — documentation quality varies |
| **R10 Mobile / vibration** | ⚠️ Conformal coating + potting noted [DS]; IEC 60068 rating not stated — confirm with vendor | ⚠️ Not stated [RFQ] | ✅ Potted design [IND] — mobile focus; IEC 60068 rating [RFQ] | ✅ IP67; liquid sealed; designed for harsh/marine/mining [DS] | ⚠️ Rack-mount design — mobile suitability unconfirmed [RFQ] | ⚠️ IP20, rack-mount — not mobile-rated [RFQ] | ⚠️ Not stated [RFQ] |
| **R11 Full-set weight < 500 kg** | ⚠️ 10 × 30 kg = 300 kg (module only) — within limit with structural margin [DS] | ⚠️ 10 × 20 kg = 200 kg — within limit [DS] | ⚠️ Weight not confirmed [RFQ] | ✅ 3 × 47 kg = 141 kg — well within limit [DS] | ⚠️ Weight not stated [RFQ] | ⚠️ 10 × 31 kg = 310 kg — within limit [DS] | ⚠️ Not stated [RFQ] |
| **R12 Material cost < €20k** | ❌ 10 × ~€2,800–3,800 = **€28k–38k** — above target [IND] | ❌ 10 × ~€2,700–3,600 = **€27k–36k** — above target [IND] | ⚠️ Price on request [RFQ] | ⚠️ Price on request; 3 × 100 kW [RFQ] | ⚠️ Price on request [RFQ] | ⚠️ Price on request [RFQ] | ❌ 8–10 × ~€2,300–3,600 = **€18k–36k** — may meet target at low end [IND] |
| **R13 PFC** | ✅ PF ≥ 0.99, THD ≤ 5% [DS] | ✅ PF ≥ 0.99 [DS] | N/A (DC/DC — no AC input) | N/A (DC/DC) | N/A (DC/DC) | ✅ PF 0.99, THDi < 5% [DS] | ✅ PF ≥ 0.99 [IND] |
| **R14 Inrush behaviour** | ✅ Soft-start via CAN; EN61851-23 [DS] | ✅ Soft-start; EN61851-23 [DS] | N/A (DC/DC) | N/A (DC/DC) | N/A (DC/DC) | ✅ Active PFC; IEC 61851 [DS] | ✅ Soft-start [IND] |

---

## 6. System-Level Architecture Options

To deliver **400 A** into a **600–800 V** battery (nominal ~750 V → **300 kW** at full charge rate):

### Architecture A — 10 × 30 kW AC/DC modules (Infypower-class)

| Parameter | Value |
|---|---|
| Number of modules | 10 |
| Module | Infypower LRG1K0100G (or equivalent) |
| Total power | 10 × 30 kW = **300 kW** |
| Output current | 10 × 40 A = 400 A @ 750 V [✅ meets 400 A target] |
| Total module weight | 10 × 30 kg = **300 kg** [✅ < 500 kg] |
| Size per module | 453 × 300 × 123 mm |
| Redundancy | 11 modules = N+1 hot-swap (≥ 90% uptime even with one failed) |
| Serviceability | Hot-plug connectors; individual module swap without full shutdown |
| Comms complexity | CAN bus daisy-chain to 1 × CAN→ModbusTCP gateway |
| Indicative cost | 10 × ~€2,800–3,800 = **€28,000–38,000** [❌ above €20k target] |
| Efficiency risk | 96.5% peak → system heat ~10.5 kW [❌ above 7 kW heat budget] |
| Notes | Largest number of modules; good redundancy; efficiency shortfall requires derating or active cooling upgrade |

### Architecture B — 6 × 50 kW DC/DC modules (Converdan CDC350KAC-class)

| Parameter | Value |
|---|---|
| Number of modules | 6 |
| Module | Converdan CDC350KAC (bidirectional DC/DC) |
| Total power | 6 × 50 kW = **300 kW** |
| Output current | 6 × 66.7 A = 400 A @ 750 V [✅ meets 400 A target] |
| Total module weight | Not confirmed — rack modules; estimate 6 × ~20 kg = **120 kg** [✅] |
| Cooling | Air-cooled standard; **liquid cooling must be requested and confirmed** |
| Redundancy | 7 modules = N+1; or use 6 with controlled derating |
| Comms complexity | CAN master/slave to 1 × gateway |
| Upstream AC/DC | Requires separate AC/DC stage (400 VAC → 800 VDC bus) [additional cost and complexity] |
| Indicative cost | Price on request [RFQ]; EU supplier pricing typically higher |
| Efficiency | >98% claimed [IND] — if confirmed, meets efficiency target |
| Notes | Fewest components once AC/DC front-end is added; EU (Denmark) supplier; liquid cooling needs confirmation |

### Architecture C — 3 × 100 kW DC/DC modules (Advantics ADB-PC-DC01)

| Parameter | Value |
|---|---|
| Number of modules | 3 |
| Module | Advantics ADB-PC-DC01 |
| Total power | 3 × 100 kW = **300 kW** |
| Output current | 3 × 133 A = 400 A @ 750 V [✅ meets 400 A target] |
| Total module weight | 3 × 47 kg = **141 kg** [✅ well within 500 kg] |
| Size per module | 725 × 440 × 176 mm |
| Cooling | IP67 liquid-cooled [DS] |
| Comms | Isolated CAN 2.0B → 1 × gateway |
| Port A (bus side) | 750–950 V; requires upstream AC/DC or DC bus at 750–950 V [important constraint] |
| Upstream AC/DC | Requires separate 400 VAC → ~800 V DC bus stage (e.g. 3 × 100 kW active front-end) |
| Redundancy | 4 modules = N+1; or 3 + derated operation |
| Indicative cost | Price on request [RFQ]; estimated €12,000–20,000/unit based on SiC 100 kW class |
| Efficiency | ~98% peak (SiC, DS-confirmed) [✅] |
| Vibration/IP | IP67, SiC design, suitable for harsh environments |
| Notes | Most compact and lightest option; meets efficiency target; best IP rating; but requires a separate AC/DC front-end bus stage (adds cost and complexity). EU (French) supplier with full documentation. |

### Architecture D — 8 × 30 kW AC/DC + SiC upgrade (hybrid / future path)

This represents the intermediate-term path: use 8 × 30 kW CAN-bus modules as a baseline
(accepting the efficiency shortfall initially), with a swap path to SiC-based or higher-efficiency
modules when these become available at the right price point.

| Parameter | Value |
|---|---|
| Number of modules | 8–10 (8 for 240 kW, 10 for 300 kW) |
| Total power | 240–300 kW |
| Efficiency risk | System heat 10–12 kW → cooling system must be uprated |
| Notes | Low-risk procurement, known module design, but does not meet efficiency must-have as-is |

### Architecture Recommendation Summary

| Architecture | Modules | Power | Weight | Efficiency | Cost (indicative) | EU Supplier | Liquid Cooled | Verdict |
|---|---|---|---|---|---|---|---|---|
| A — 10 × 30 kW AC/DC | 10 | 300 kW | ~300 kg | ❌ 96.5% | ❌ €28–38k | ❌ China | ✅ | Fails eff. + cost |
| B — 6 × 50 kW DC/DC | 6 (+front-end) | 300 kW | ~120 kg | ✅ >98% (IND) | RFQ | ✅ Denmark | ⚠️ Confirm | Promising if liquid confirmed |
| C — 3 × 100 kW DC/DC | 3 (+front-end) | 300 kW | **141 kg** | ✅ ~98% | RFQ | ✅ France | ✅ IP67 | **Best technical fit** |
| D — 10 × 30 kW + future SiC | 10 | 300 kW | ~300 kg | ❌ 96.5% now | ❌ €28–38k | ❌ China | ✅ | Interim only |

---

## 7. Comms Gap Analysis

### 7.1 ModbusTCP Availability per Module

| Module | Native ModbusTCP | CAN | PROFINET | EtherCAT | Modbus RTU | Gateway needed |
|---|---|---|---|---|---|---|
| Infypower LRG1K0100G | ❌ | ✅ | ❌ | ❌ | ❌ | Yes |
| Winline UXR100030B | ❌ | ✅ | ❌ | ❌ | ❌ | Yes |
| IMAX Power BIDC1K0100 | ❌ | ✅ | ❌ | ❌ | ❌ | Yes |
| Advantics ADB-PC-DC01 | ❌ | ✅ (isolated) | ❌ | ❌ | ❌ | Yes |
| Converdan CDC350KAC | ❌ | ✅ | ❌ | ❌ | ❌ | Yes |
| Phoenix Contact CHARX 30kW | ❌ (system controller) | ✅ (CANopen) | ❌ | ❌ | ❌ | Yes (or use CHARX controller) |
| Zekalabs TinoPrime* | ❌ | ✅ | ❌ | ❌ | ✅ RS485 | Partial — RS485 gateway |

> *Zekalabs TinoPrime excluded from main comparison (fails R04) but noted here as the only
>  evaluated module with native Modbus (RTU over RS485, not TCP).

**Finding:** No evaluated module offers native **ModbusTCP** at the module level. All require either
a CAN→ModbusTCP gateway or a system controller layer.

### 7.2 CAN→ModbusTCP Gateway Fallback

The recommended approach for all architectures is to implement a **system controller** that:
1. Acts as CAN bus master for all power modules
2. Exposes a ModbusTCP slave interface to the e-PU10 BESS controller

**Recommended gateway products:**

| Gateway | Vendor | Protocols | Form Factor | Notes |
|---|---|---|---|---|
| **Anybus Communicator CAN→ModbusTCP** | HMS Networks (Sweden) | CAN 2.0B / J1939 / CANopen → ModbusTCP | DIN rail | Industry standard; €200–400; data mapping via GUI tool |
| **Hilscher netTAP 100** | Hilscher (Germany) | Multi-protocol including CAN → ModbusTCP | DIN rail | Flexible; supports CAN, DeviceNet, PROFIBUS → ModbusTCP/EtherNet/IP |
| **IXXAT CAN@net NT** | HMS Networks | CAN→Ethernet (raw CAN tunnelling + protocol conversion) | DIN rail / embedded | For custom CAN protocol implementations |

**Gateway implementation note:** The CAN protocols used by EV charging modules are typically
proprietary variants, not standard CANopen or J1939. The gateway configuration will require
the vendor CAN message specifications (DBC file or protocol document). Request these at RFQ stage.

### 7.3 Phoenix Contact CHARX Controller Option

Phoenix Contact offers the **CHARX control modular** system controller which provides:
- Native ModbusTCP/EtherCAT/PROFINET interface
- Direct CAN management of CHARX PS-M modules
- This effectively solves the ModbusTCP gap for Architecture A if CHARX modules are chosen,
  but adds system controller cost (~€1,500–3,000)

---

## 8. Cost Analysis

### 8.1 Total Module Cost per Architecture

> All prices are **indicative** [IND] or **on request** [RFQ] as of 2026-06-29.
> Exchange rate used: 1 USD ≈ 0.92 EUR.

| Architecture | Module | Qty | Unit Price (indicative) | Total Module Cost | vs. €20k Target |
|---|---|---|---|---|---|
| **A — 10 × 30 kW Infypower** | LRG1K0100G | 10 | ~€2,700–3,900 [IND] | **€27,000–39,000** | ❌ 35–95% over budget |
| **A+1 redundancy** | LRG1K0100G | 11 | ~€2,700–3,900 [IND] | **€29,700–42,900** | ❌ |
| **A generic Chinese OEM** | Huawei/Sinexcel class | 10 | ~€2,300–3,700 [IND] | **€23,000–37,000** | ❌ Marginal at best |
| **B — 6 × 50 kW Converdan** | CDC350KAC | 6 | RFQ (EU pricing est. €5,000–12,000) | **€30,000–72,000** [RFQ] | ❌ (plus AC/DC front-end cost) |
| **C — 3 × 100 kW Advantics** | ADB-PC-DC01 | 3 | RFQ (est. €12,000–20,000/unit) | **€36,000–60,000** [RFQ] | ❌ (plus AC/DC front-end cost) |
| **Gateway (all architectures)** | Anybus/Hilscher | 1 | ~€250–500 | **€250–500** | Included in above |

### 8.2 Price per kW Comparison

| Module | Power | Indicative unit price | Price / kW | Target < €200/kW |
|---|---|---|---|---|
| Infypower LRG1K0100G | 30 kW | ~€2,700–3,900 [IND] | ~€90–130/kW | ✅ Below €200/kW |
| Winline UXR100030B | 30 kW | ~€2,700–3,700 [IND] | ~€90–123/kW | ✅ Below €200/kW |
| IMAX Power BIDC1K0100 | 30 kW | RFQ | RFQ | Unknown |
| Advantics ADB-PC-DC01 | 100 kW | RFQ (est. €12–20k) | ~€120–200/kW | ⚠️ At or above €200/kW |
| Converdan CDC350KAC | 50 kW | RFQ | RFQ | Unknown |
| Phoenix Contact CHARX 30kW | 30 kW | RFQ | RFQ | Unknown |

### 8.3 Cost Analysis Conclusion

**The €20,000 material cost target is extremely challenging for off-the-shelf module sets at
this power level.** Key findings:

1. Chinese AC/DC 30 kW modules are the most price-competitive at ~€90–130/kW, but 10 units
   still total ~€27k–39k — 35–95% over the €20k target.
2. The only realistic path to meeting €20k is:
   - Direct OEM volume pricing negotiation (possible at production volumes, not TRL 3)
   - A future SiC module falling significantly in price
   - Relaxing the target to €30k–35k for TRL 3 conceptual design
3. EU-sourced modules (Advantics, Converdan) will command premium pricing but offer better
   CE documentation, support, and supply chain security.
4. **Recommendation:** Set a revised cost target of **< €35,000** for TRL 3 conceptual design
   and flag the original €20,000 target as a series-production goal for procurement negotiation.

---

## 9. Top 3 Recommendations

### Recommendation 1: Advantics ADB-PC-DC01 (3 × 100 kW, Architecture C)
**Confidence level: High (datasheet-confirmed)**

**Rationale:**
- ✅ Reinforced galvanic isolation confirmed [DS]
- ✅ 98% peak efficiency (SiC) — only module to meet the 97.5% target [DS]
- ✅ IP67 liquid-cooled, designed for harsh/marine/mining environments — directly applicable to mobile BESS
- ✅ DC output 200–1500 V (Port B) — covers 600–800 V BESS with significant margin [DS]
- ✅ European supplier (France); full online documentation and IEC/UL compliance [DS]
- ✅ Lightest total weight: 3 × 47 kg = 141 kg [DS]
- ⚠️ **DC/DC only** — requires a separate AC/DC front-end (400 VAC → 800 VDC bus); add this cost
- ⚠️ Port A voltage range is 750–950 V (narrow); system must maintain bus voltage in this window
- ⚠️ Bidirectional module used in charge-only mode; configure accordingly
- ⚠️ CAN-only comms; CAN→ModbusTCP gateway required
- ⚠️ Price not public; RFQ required

**Action for TRL 3:** Request RFQ + application engineering session with Advantics (sales@advantics.fr);
clarify: (a) Port A bus precharged configuration, (b) unidirectional mode lock, (c) volume pricing,
(d) CE documentation package.

---

### Recommendation 2: Converdan CDC350KAC (6 × 50 kW, Architecture B)
**Confidence level: Medium (product page confirmed; specs need RFQ)**

**Rationale:**
- ✅ Galvanic isolation confirmed [DS]
- ✅ Claimed >98% efficiency [IND — needs DS confirmation]
- ✅ European supplier (Denmark); EU compliance, good documentation expected
- ✅ Bidirectional — can configure for charge-only
- ✅ CAN master/slave with up to 16 modules — scalable
- ✅ Modular 50 kW building blocks: 6 modules for 300 kW
- ⚠️ **Standard product is air-cooled (3U rack)** — liquid cooling must be requested; this is a critical unknown
- ⚠️ **DC/DC only** — requires separate AC/DC front-end bus stage
- ⚠️ CAN-only; gateway required
- ⚠️ Rack-mount form factor — mobile/vibration suitability unconfirmed

**Action for TRL 3:** Contact Converdan A/S directly; ask for: (a) liquid-cooled variant availability,
(b) full datasheet including efficiency curve, (c) vibration/shock test data, (d) indicative unit price.

---

### Recommendation 3: Infypower LRG1K0100G (10 × 30 kW, Architecture A) — Baseline / Risk Hedge
**Confidence level: High (full datasheet on file)**

**Rationale:**
- ✅ Complete datasheet available with confirmed specs
- ✅ Galvanic isolation, CE/TUV/UL2202, liquid-cooled [DS]
- ✅ DC output 150–1000 V covers the BESS range [DS]
- ✅ Hot-plug coolant and electrical connectors; designed for paralleling up to 48 units [DS]
- ✅ Conformal coating + potting for vibration/humidity resistance [DS]
- ✅ Lowest procurement risk (known product, multiple distributors)
- ❌ **Efficiency 96.5% peak** — fails the 97.5% must-have; system heat ~10.5 kW vs. 7 kW budget
- ❌ **10-module total cost ~€27k–39k** — above €20k material target
- ⚠️ CAN-only comms; gateway required
- ⚠️ IP30 rating — not fully sealed; mobile/vibration applicability needs IEC 60068 confirmation

**Action for TRL 3:** Obtain formal quotation for 10+1 units; request IEC 60068 vibration test report;
obtain CAN DBC/protocol spec for gateway configuration; get efficiency curve at partial load.
Use as fallback if Architecture C/B RFQs are unfavorable.

---

## 10. Risks & Open Questions

| # | Risk / Open Question | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| RK01 | **Efficiency shortfall:** All AC/DC 30 kW modules are 95–96.5% — below 97.5% must-have | High (excess heat, CE compliance) | High | Use SiC modules (Advantics); or uprate cooling system and revisit efficiency requirement |
| RK02 | **ModbusTCP gap:** No module offers native ModbusTCP | Medium (integration complexity) | Certain | Plan CAN→ModbusTCP gateway (Anybus/Hilscher) in system design; budget €250–500 + SW time |
| RK03 | **Cost target:** €20k target appears unachievable for off-the-shelf module sets at TRL 3 | High (project budget) | High | Revise target to €30–35k for TRL 3; negotiate volume pricing for series production |
| RK04 | **Liquid cooling confirmation:** Winline and Converdan need confirmation that liquid-cooled variants exist | High (R03 must-have) | Medium | Send RFQ explicitly requesting liquid-cooled part numbers before conceptual design commit |
| RK05 | **Isolation documentation for CE:** Chinese module CE certificates need scrutiny (TÜV vs. CB vs. self-cert) | High (CE compliance) | Medium | Request TÜV certificate number and scope; EU suppliers (Advantics, Converdan) preferred |
| RK06 | **Vibration/shock rating:** IEC 60068 test data not publicly available for most modules | High (mobile application) | Medium | Request test reports at RFQ stage; Advantics IP67 + potted design is highest confidence |
| RK07 | **Architecture C/B require separate AC/DC front-end:** Adds cost, weight, and design complexity | Medium | Certain | Size AC/DC front-end (3-phase AFE, ~300 kW); add to BOM and mechanical envelope assessment |
| RK08 | **Advantics Port A bus voltage 750–950 V:** Precharge circuit required; no internal precharge | Medium | Certain | Design external precharge circuit; documented in Advantics application notes |
| RK09 | **Single-module size vs. e-PU10 envelope:** Advantics module 725 × 440 × 176 mm may be large for the power module bay | Medium | Medium | Compare with e-PU10 mechanical envelope drawings; 3 × Advantics may fit vertically |
| RK10 | **Lead time:** Chinese module lead time 4–16 weeks; EU custom modules potentially 12–26 weeks | Medium | Medium | Place development order (2 units) immediately at TRL 3 start; confirm lead times at RFQ |
| RK11 | **IMAX Power BIDC1K0100 spec confidence:** All specifications are from marketplace listings — no datasheet found | High if selected | Medium | Do not select for TRL 3 until datasheet is obtained from IMAX Power directly |
| RK12 | **Minimum settable power (R06):** No module has confirmed minimum settable power ≤ 55 kW / 80 A threshold | High (charging control) | Medium | Verify with all vendors at RFQ; check if CAN allows arbitrary setpoint down to 0 A |

---

## 11. Needs Vendor Confirmation

The following specifications are taken from marketplace listings, marketing material, or distributor
pages rather than manufacturer datasheets. These **must be confirmed via RFQ/datasheet** before
any module is committed to the TRL 3 conceptual design.

| # | Module | Specification | Indicative Value | Source | Action Required |
|---|---|---|---|---|---|
| VC01 | Winline UXR100030B | Cooling type | Liquid (some sources say air-cooled) | Distributor listings [IND] | Request datasheet confirming liquid-cooled variant part number |
| VC02 | Winline UXR100030B | Peak efficiency | ~97% | Distributor marketing [IND] | Obtain efficiency curve from official DS; DS shows 95.5% FL |
| VC03 | IMAX Power BIDC1K0100 | All electrical specs | 30 kW, 50–1000 V, >96.5% | Marketplace listing [IND] | Request full datasheet directly from IMAX Power |
| VC04 | IMAX Power BIDC1K0100 | IP rating / vibration | IP67 claimed, potted | Marketplace listing [IND] | Request IEC 60068 test report and IP certification |
| VC05 | IMAX Power BIDC1K0100 | Unit price | On request | — | Obtain formal quotation |
| VC06 | Converdan CDC350KAC | Liquid cooling availability | On request (standard is air) | Converdan product page [IND] | Explicitly request liquid-cooled variant and confirm power/efficiency unchanged |
| VC07 | Converdan CDC350KAC | Efficiency curve | >98% claimed | Product page [IND] | Request datasheet with efficiency vs. load curve |
| VC08 | Converdan CDC350KAC | Unit price and lead time | On request | — | Request formal quotation |
| VC09 | Converdan CDC350KAC | Vibration / shock rating | Not stated | — | Request IEC 60068 test data or clarify suitability for mobile application |
| VC10 | Advantics ADB-PC-DC01 | Unit price | Not published | — | Request formal quotation including volume pricing |
| VC11 | Advantics ADB-PC-DC01 | Lead time | Not published | — | Confirm at RFQ |
| VC12 | Advantics ADB-PC-DC01 | Minimum output setpoint | Not stated in DS | DS | Request clarification from Advantics |
| VC13 | Infypower LRG1K0100G | Vibration/shock test rating (IEC 60068) | Conformal coating + potting noted; no test rating stated | DS [partial] | Request IEC 60068-2-6 (vibration) and -2-27 (shock) test reports |
| VC14 | Infypower LRG1K0100G | Minimum settable output current | Not stated in DS | DS | Request from vendor or obtain CAN protocol doc |
| VC15 | Phoenix Contact CHARX 30kW | Liquid cooling variant | Unconfirmed | Web search | Contact Phoenix Contact; request liquid-cooled variant if available |
| VC16 | Huawei / Sinexcel / Gresgying generic | All specs, CE cert quality | Various [IND] | Marketplace [IND] | Request specific part numbers, datasheets, and TÜV cert numbers |
| VC17 | All modules | CAN protocol documentation (DBC / message spec) | — | — | Required for CAN→ModbusTCP gateway configuration |
| VC18 | All modules | Inrush current profile at startup | — | — | Required to confirm C80 / B32 circuit breaker compatibility |

---

## 12. Sources

> Items marked [DS] have been verified against publicly available datasheets or official documentation pages.
> Items marked [IND] are from distributor or marketplace listings.
> Items marked [RFQ] require direct vendor quotation.

### Module Sources

1. **Infypower LRG1K0100G official product page [DS]:**
   https://www.infypower.com/products/power-module-solution-liquid-cooled-power-module-acdc-module-30kw/85

2. **Infypower LRG1K0100G — distributor listing with specs [IND]:**
   https://accraine.co.uk/product/lrg1k0100g-ac-dc-power-module-30kw-liquid-cooling-ev-charger-module/

3. **Infypower LRG1K0100G — made-in-china listing [IND]:**
   https://infypower.en.made-in-china.com/product/mFdaixyCCATv/China-Liquid-Cooled-30kw-60kw-1000V-Rectifier-Module-Acdc-Power-Converter-for-EV-Charger-Zero-Noise.html

4. **Winline UXR100030B official page [DS]:**
   https://en.szwinline.com/product/uxr100030b-30kw-1000v-dc-charging-module/

5. **Winline UXR100030B datasheet PDF [DS]:**
   https://en.szwinline.com/wp-content/uploads/2023/10/UXR100030B-Power-Module-Data-Sheet.pdf

6. **Winline UXR100030B — MIDA distributor [IND]:**
   https://www.midacharger.com/30kw-ac-dc-power-module-uxr100030b-emc-class-b-ev-charging-module-product/

7. **Advantics ADB-PC-DC01 — official PDF datasheet [DS]:**
   https://advantics.fr/pdf/ADB-PC-DC01.pdf

8. **Advantics ADB-PC-DC01 — official documentation portal [DS]:**
   https://documentation.advantics.fr/adb-pc-dc01/

9. **Advantics ADB-PC-DC01 — electrical specifications [DS]:**
   https://documentation.advantics.fr/adb-pc-dc01/electrical_specs/

10. **Advantics ADB-PC-DC01 — mechanical specifications [DS]:**
    https://documentation.advantics.fr/adb-pc-dc01/mechanical_specs/

11. **Converdan CDC350KAC — official product page [IND/partial DS]:**
    https://www.converdan.com/products/cdc350kac/

12. **Converdan product overview:**
    https://www.converdan.com/products/

13. **Phoenix Contact CHARX PS-M2/3AC/1000DC/30KW — datasheet PDF [DS]:**
    https://assets.alliedelec.com/image/upload/v1628503278/Datasheets/730f52cac097fcdfc2a79c4737c1dae0.pdf

14. **Phoenix Contact CHARX — official product page [DS]:**
    https://www.phoenixcontact.com/en-us/products/dc-power-module-charx-ps-m23ac1000dc30kw-1232243

15. **Zekalabs TinoPrime 24kW 900V (excluded — fails R04) [IND]:**
    https://zekalabs.com/products/isolated-power-converters/dc-dc-isolated-converter-24kw-300a/

16. **Brusa NLG664 datasheet (excluded — fails R04) [DS]:**
    https://www.brusahypower.com/wp-content/uploads/2021/03/BRUSA_DB_EN_NLG664_03.2021.pdf

### Gateway Sources

17. **Anybus Communicator CAN→ModbusTCP [DS]:**
    https://www.anybus.com/products/gateway-index/anybus-communicator/can-bus

18. **Anybus Communicator CAN→ModbusTCP manual PDF:**
    https://cdn.hms-networks.com/docs/librariesprovider7/default-document-library/manuals-design-guides/abc-ethernet-tcpip-can.pdf

19. **Hilscher netTAP 100 multi-protocol gateway [DS]:**
    https://www.hilscher.com/products/product-groups/gateways/nettap-100/

### Project References

20. **Project brief:** `Documents/project.txt` (this repository)
21. **TRL task breakdown:** `Documents/TRL_Tasks_400A_Charger.txt` (this repository)
22. **Prior market study (cabinet level):** `Documents/MarketStudy_400A_Charger.xlsx` (this repository)

---

*End of document. Research date: 2026-06-29. Review and update at TRL 3 kick-off.*
