# Technology Readiness Levels (TRL) — General Guide

This document explains what each **Technology Readiness Level (TRL)** phase means in general:
what the goal of the phase is, what should typically be done in it, and what is normally used to
prove you have reached it. It is written as a general reference so it can be applied to any of the
hardware/engineering projects in this repository (e.g. the *400 A Charger*, the *e-PU Cabinet V2*
BESS, etc.).

> **What is TRL?**
> TRL is a 1–9 scale, originally developed by **NASA** and later adopted by the **European Union**
> (Horizon 2020 / Horizon Europe) and industry worldwide, to measure how mature a technology is —
> from a first idea (TRL 1) to a fully proven, commercially deployed product (TRL 9). Each step up
> means more evidence, more integration, and a more realistic environment.

---

## Quick overview

| TRL | Name | Core question answered | Environment |
|-----|------|------------------------|-------------|
| 1 | Basic principles observed | *"Is this physically possible?"* | Pure research / paper |
| 2 | Technology concept formulated | *"What could we build with it?"* | Concept / paper |
| 3 | Experimental proof of concept | *"Does the key idea actually work?"* | Lab (analytical / small test) |
| 4 | Technology validated in lab | *"Do the parts work together?"* | Lab (breadboard) |
| 5 | Technology validated in relevant environment | *"Does it work in realistic conditions?"* | Simulated / relevant environment |
| 6 | Technology demonstrated in relevant environment | *"Does a full prototype work?"* | Relevant environment |
| 7 | System prototype in operational environment | *"Does it work in the real setting?"* | Operational environment |
| 8 | System complete and qualified | *"Is it finished, tested and certified?"* | Operational (final form) |
| 9 | Actual system proven in operations | *"Is it in real use and reliable?"* | Live operation / production |

A useful mental split:
- **TRL 1–3** → *Research* (prove the idea).
- **TRL 4–6** → *Development* (build and validate prototypes).
- **TRL 7–9** → *Deployment* (qualify, release, operate).

---

## TRL 1 — Basic principles observed

**Official definition.** *NASA:* "Basic principles observed and reported." *EU (Horizon 2020,
Annex G):* "Basic principles observed." This is the lowest level of technology maturity. At TRL 1
scientific research is just beginning to be translated into applied research and development. No
experimental proof exists yet — only observed and reported physical, electrical, chemical or
mathematical principles.

**Goal.** Establish that the underlying scientific/engineering principle actually exists and is
sound, and capture it clearly enough that it could later be turned into a useful application. The
core question is simply: *"Is this physically possible?"*

**What is normally done:**
- Literature review and study of existing research, patents, textbooks and standards.
- Observation and reporting of the basic physical/electrical/chemical principle that could be
  exploited (for a power charger this is, e.g., the physics of AC/DC power conversion, galvanic
  isolation via magnetic coupling, power-factor correction, and semiconductor switching).
- Purely theoretical / analytical work — equations, first-principle calculations, and paper studies.
- No application is defined yet, no hardware is built, and no components are selected.

**How to know you have reached it (exit criteria).** You can point to a written record that the
governing principle is real and understood, with references. There is nothing to test in a lab yet.

**Typical output / evidence:** research notes, a short technical memo or literature survey, a list
of governing equations, and references to papers, patents or standards.

**Common pitfalls.** Skipping the reference/traceability step (later phases need to justify *why*
an approach was chosen), or confusing "the principle is known" with "the application works" — the
latter is TRL 3+.

**In this repo.** TRL 1 is the prior, general engineering knowledge that AC/DC conversion, galvanic
isolation and liquid cooling are established physics. It is not usually called out as an explicit
task in the project plans (the 400 A charger and e-PU Cabinet V2 both start their planned work at
TRL 2), because the underlying principles are already mature and industry-standard.

---

## TRL 2 — Technology concept formulated

**Official definition.** *NASA:* "Technology concept and/or application formulated." *EU:*
"Technology concept formulated." Once basic principles are observed, practical applications can be
invented. The application is still speculative: there is no experimental proof or detailed analysis
to support it, only analytic studies and the formulation of a concept.

**Goal.** Turn the principle from TRL 1 into a *possible* practical application and define what you
would build with it. The core question is: *"What could we build with it, and what exactly must it
do?"* This is where a fuzzy idea becomes a bounded engineering problem.

**What is normally done:**
- Define the concept and its intended use, users and boundaries.
- Formulate the project scope and key results, and write the technical specification split into
  **must-have** and **nice-to-have** criteria.
- Initial **risk analysis** and **scope-change analysis** (what could go wrong, and how changes will
  be handled).
- **Market / component research:** which suppliers and devices exist, at what price, with what
  quality of documentation. No hardware is built or bought yet — this is a paper study.
- Rough feasibility reasoning to confirm the concept is at least plausible against the requirements.

**How to know you have reached it (exit criteria).** A documented, agreed scope and specification
exist, the main risks are listed, and a market survey shows that credible components/suppliers are
available to build the concept.

**Typical output / evidence:** a project/scope document, a specification list (must-have /
nice-to-have), a risk register, and a market/component study.

**Common pitfalls.** Writing vague, untestable requirements (every must-have should later be
verifiable in a measurement plan), or freezing on a single supplier before the market study is done.

**In this repo.** TRL 2 is an explicit phase in both projects. For the **400 A charger** it is
budgeted at ~32 h in week 3 and covers defining scope/key results, the technical specification
(e.g. galvanic isolation, 400/500 A Powerlock set, liquid cooling, 600–800 VDC, material cost
< €20 000, ModbusTCP/CAN, EMC per IEC 61000, weight < 500 kg), risk/scope-change analysis, and the
supplier/module market study (`MODULE_MarketStudy.md`, `MarketStudy_400A_Charger.xlsx`). The e-PU
Cabinet V2 project plan captures the same scope-and-requirements step for the BESS platform.

---

## TRL 3 — Experimental proof of concept

**Official definition.** *NASA:* "Analytical and experimental critical function and/or
characteristic proof of concept." *EU:* "Experimental proof of concept." Active research and
development is initiated. This includes analytical studies and laboratory studies to physically
validate the analytical predictions of the separate elements of the technology.

**Goal.** Prove that the *critical, risky function* of the idea actually works — analytically or
with a small, focused test — before committing to a full detailed design. The core question is:
*"Does the key idea actually work?"*

**What is normally done:**
- Analytical studies and/or small-scale lab experiments on the single most risky element (for the
  charger, e.g. the galvanic-isolation topology, the inrush behaviour against a C-type breaker, or
  achieving > 97.5 % efficiency / < 7 kW total heat).
- **Conceptual design:** decide which components are required and how they together satisfy the
  scope; select candidate modules from the TRL 2 market study.
- First engineering artefacts: **single-line electrical diagram**, mechanical concept description
  (e.g. fitting the charger within the existing power-module envelope), cooling concept.
- **Material cost estimate** based on the conceptual design, plus a rough estimate of engineering
  effort, cost price and planning.

**How to know you have reached it (exit criteria).** The critical function is shown to work in
principle (by calculation or a small test), a coherent conceptual design exists, and cost/effort
are estimated well enough to justify continuing. The phase ends with a formal **tollgate review**.

**Typical output / evidence:** proof-of-concept results, a conceptual design, a single-line diagram,
a mechanical concept, and a cost/planning estimate.

**Common pitfalls.** Moving into detailed design before the riskiest function is proven, or
under-estimating engineering effort because the concept was not detailed enough.

**In this repo.** For the **400 A charger** TRL 3 is ~20 h in week 5: select components and show how
they meet the scope, create the single-line diagram, write the mechanical concept (fit within the
power module), estimate material price from the concept, and estimate engineering impact, cost price
and planning — closed by a TRL 3 tollgate. `project.txt` lists exactly these conceptual-design and
cost-estimation tasks.

---

## TRL 4 — Technology validated in the laboratory

**Official definition.** *NASA:* "Component and/or breadboard validation in laboratory
environment." *EU:* "Technology validated in lab." Basic technological components are integrated to
establish that they will work together. This is relatively "low fidelity" compared with the eventual
system — it is often an ad-hoc "breadboard" build in the lab.

**Goal.** Show that the basic components work *together* (integration), not just individually, in a
controlled laboratory setting. The core question is: *"Do the parts work together?"*

**What is normally done:**
- Build and test a simple prototype ("breadboard") that integrates the key components (e.g. a
  rectifier + isolation stage + control on the bench, not yet in the final enclosure).
- Begin **detailed design** work across disciplines — mechanical, electrical and software.
- Lab measurements to confirm the integrated parts behave as predicted in TRL 3 (voltages,
  currents, isolation, basic control loop, communication link).
- Compare measured behaviour against the must-have specification and feed back into the design.

**How to know you have reached it (exit criteria).** A breadboard/integrated set-up demonstrates the
combined function in the lab, and detailed design is under way with measurement evidence backing the
design choices.

**Typical output / evidence:** breadboard test results, detailed design drawings/schematics, and lab
measurement reports.

**Common pitfalls.** Treating a breadboard result as production-ready; low-fidelity lab conditions
(ideal supply, no vibration, no thermal load) can hide problems that only appear in TRL 5–6.

**In this repo.** TRL 4 is handled together with TRL 5 as the **detailed-design** phase (see below).
The plan does not build a separate throwaway breadboard; instead the integration evidence is produced
as part of the detailed electrical/mechanical/software design that feeds the prototype build.

---

## TRL 5 — Technology validated in a relevant environment

**Official definition.** *NASA:* "Component and/or breadboard validation in relevant environment."
*EU:* "Technology validated in relevant environment (industrially relevant environment in the case
of key enabling technologies)." The fidelity of the technology increases significantly: the basic
components are integrated with reasonably realistic supporting elements and tested in a *simulated*
or otherwise *relevant* environment.

**Goal.** Increase fidelity — test the integrated technology under conditions that *resemble* real
use rather than an ideal bench. The core question is: *"Does it work in realistic conditions?"*

**What is normally done:**
- Test the prototype/subsystem in a simulated or relevant environment: realistic DC load
  (600–800 VDC battery), temperature, vibration (mobile applicability), and EMC conditions rather
  than an idealised bench.
- Achieve more complete integration than TRL 4 (closer to the intended power-module form factor).
- Complete the **detailed engineering**: galvanic isolation, EMC compliance, inrush current
  handling, liquid cooling, mechanical envelope and weight (< 500 kg), efficiency (> 97.5 %).
- Produce **CE / compliance documentation**, the **build book** and assembly instructions.

**How to know you have reached it (exit criteria).** The integrated subsystem is validated under
relevant (not ideal) conditions, the full detailed design package is complete, and CE documentation
is drafted. The combined TRL 4/5 phase ends with a **tollgate review**.

**Typical output / evidence:** validation results in a relevant environment, a complete detailed
design package (mechanical, electrical, software), draft CE documentation, and a build book.

**Common pitfalls.** Under-testing the "relevant" conditions (e.g. skipping EMC or thermal/vibration
representativeness) so problems surface only at the operational TRL 6/7 prototype.

**In this repo.** TRL 4 and 5 are combined into the **detailed-design** phase — for the 400 A charger
~180 h in week 12: mechanical detailed design (liquid cooling, envelope, weight), electrical detailed
design (galvanic isolation, EMC, inrush), e-PU10 software development/integration (ModbusTCP/CAN),
CE documentation (manual, design calculations, operating instructions), the build book, and internal/
external coordination — closed by a TRL 4/5 tollgate. The e-PU Cabinet V2 measurement plan is built
around verifying exactly these requirements.

---

## TRL 6 — Technology demonstrated in a relevant environment

**Official definition.** *NASA:* "System/subsystem model or prototype demonstration in a relevant
environment." *EU:* "Technology demonstrated in relevant environment (industrially relevant
environment in the case of key enabling technologies)." A representative model or prototype system —
well beyond the breadboard of TRL 4 — is tested in a relevant environment. This is a major step up in
demonstrated readiness.

**Goal.** Demonstrate a full **system/subsystem prototype** and verify its performance against the
must-have criteria in a relevant environment. The core question is: *"Does a full prototype work?"*

**What is normally done:**
- Build the prototype (proto build) in (close to) its intended form and enclosure.
- **Functional testing** of all features and **performance validation** against the must-have
  specification (rated power, DC voltage range, settable minimum power, communication protocol).
- Verify the key risky behaviours: **EMC** (industrial, IEC 61000), **inrush current** against the
  specified breaker types (C80 / B32), **thermal behaviour** (heat < 7 kW, efficiency > 97.5 %),
  ingress protection and mechanical robustness.
- Record every measured result against the corresponding requirement so nothing is left unverified.

**How to know you have reached it (exit criteria).** A working prototype passes the functional and
performance tests against the must-have criteria, with a documented test/verification report. The
phase ends with a **tollgate review**.

**Typical output / evidence:** a working prototype, a functional test report, and performance
validation against requirements — exactly what a **measurement / verification plan** checks off.

**Common pitfalls.** Declaring success on functional tests while skipping the hard environmental
tests (EMC, thermal, inrush); these are usually the ones that fail and are hardest to fix late.

**In this repo.** TRL 6 is an explicit phase — for the 400 A charger ~56 h in week 16: build the
prototype charger (~40 h) and run functional testing, performance validation against must-haves, and
EMC/inrush/thermal verification (~16 h), closed by a TRL 6 tollgate. The **e-PU Cabinet V2 Measurement
Plan** (`e-PU Cabinet V2 Measurement Plan.md/.docx`) is the requirements-verification matrix used in
this phase to confirm every requirement is tested and passes.

---

## TRL 7 — System prototype demonstration in an operational environment

**Official definition.** *NASA:* "System prototype demonstration in an operational environment."
*EU:* "System prototype demonstration in operational environment." The prototype is at or near the
planned operational system and is demonstrated in an **operational environment** — the actual setting
where the product will be used, not just a representative one.

**Goal.** Demonstrate a near-final prototype in the **real operational environment**. The core
question is: *"Does it work in the real setting?"*

**What is normally done:**
- Field trials / pilot installation in the real operating setting — e.g. the charger installed on
  site in an e-PU10 BESS, connected to the real grid or microgrid and the actual main battery.
- Full-scale operational testing under real-world conditions (real load profiles, ambient
  temperature swings, real EMC environment, real service/maintenance access).
- Confirm the reliability and serviceability targets (> 98 % uptime, ideally serviceable without
  interrupting the machine) under realistic duty.

**How to know you have reached it (exit criteria).** The near-final prototype runs successfully in
the actual operational environment, with an operational demonstration/pilot report.

**Typical output / evidence:** field/pilot test results and an operational demonstration report.

**Common pitfalls.** Assuming a good result in a "relevant" lab (TRL 6) guarantees success in the
real installation; earthing conflicts, grid disturbances and real thermal conditions can behave
differently on site.

**In this repo.** The projects usually go directly from TRL 6 (prototype test) to TRL 8 (sales
readiness), so TRL 7 is not called out as a separate budgeted task. It is where a real on-site
operational pilot would sit if one is performed — effectively folded into the prototype test and the
subsequent product release.

---

## TRL 8 — Actual system completed and qualified

**Official definition.** *NASA:* "Actual system completed and 'flight qualified' through test and
demonstration." *EU:* "System complete and qualified." The technology has been proven to work in its
final form and under the expected conditions. In almost all cases this is the end of true system
development — the remaining step (TRL 9) is about operational use.

**Goal.** Bring the technology to its **final form**, fully tested, qualified and certified, and
prepare it commercially. The core question is: *"Is it finished, tested and certified?"*

**What is normally done:**
- Final product and process qualification — the design is frozen and verified in its production form.
- **Certification / compliance sign-off**: CE marking, and demonstrated compliance with the
  applicable standards (e.g. IEC 61439, NEN 1010, IEC 61000 EMC) as required by the project.
- Full integration into the host system (e-PU10) and pre-commercial preparation.
- **Commercial preparation:** create the sales **one-pager** and the **technical datasheet**.

**How to know you have reached it (exit criteria).** The system is complete in final form, qualified
and certified, with the commercial documents ready. The phase ends with a **tollgate review**.

**Typical output / evidence:** qualification/certification records, a technical datasheet, and a sales
one-pager.

**Common pitfalls.** Leaving certification (CE, EMC) to the very end and discovering a
non-compliance that forces a design change after the design was thought to be frozen.

**In this repo.** TRL 8 is the **sales-readiness** phase — for the 400 A charger ~8 h in week 18:
create the sales one-pager and prepare the technical datasheet, closed by a TRL 8 tollgate. Note the
repo maps the "completed and qualified" step onto sales readiness, with CE/compliance evidence
produced earlier (TRL 4/5 documentation and TRL 6 testing).

---

## TRL 9 — Actual system proven through successful operations

**Official definition.** *NASA:* "Actual system 'flight proven' through successful mission
operations." *EU:* "Actual system proven in operational environment (competitive manufacturing in the
case of key enabling technologies; or in space)." The technology is in its final form and operated
under the full range of real operating conditions, in routine use. This is the highest, fully mature
level.

**Goal.** The technology is in **real, routine operational use** and proven reliable in series
production. The core question is: *"Is it in real use and reliable?"*

**What is normally done:**
- Finalize and update all documentation to reflect the as-built, released product.
- Make the product **series-ready** (production-ready): stable BOM, build book, and production/test
  instructions.
- **Transfer the product to the sales matrix** / into production and the sales catalogue.
- Ongoing monitoring, field feedback and maintenance to confirm sustained reliability
  (e.g. the > 98 % uptime target).

**How to know you have reached it (exit criteria).** The product is released, series-ready and in the
sales catalogue, running reliably in real operations. The phase ends with a final acceptance
**tollgate review**.

**Typical output / evidence:** a released, series-ready product; final documentation; and the product
listed in the sales matrix/catalogue.

**Common pitfalls.** Treating release as the end and neglecting the monitoring/maintenance feedback
loop that actually confirms long-term reliability.

**In this repo.** TRL 9 is the **product-release** phase — for the 400 A charger the final milestone
(target 02-11-2026, ~8 h): finalize/update all documentation, make the product series-ready, and
transfer it to the sales matrix, closed by a final-acceptance TRL 9 tollgate.

---

## How this maps to the projects in this repo

The engineering projects here use a slightly condensed TRL flow with **tollgate reviews** between
phases:

- **TRL 2** – Scope & market research (scope, spec, risk analysis, component market study).
- **TRL 3** – Conceptual design (component selection, single-line diagram, mechanical concept, cost/planning).
- **TRL 4/5** – Detailed design (mechanical, electrical, software, CE documentation, build book).
- **TRL 6** – Prototype build & test (proto build, functional/performance/EMC/thermal validation).
- **TRL 8** – Sales readiness (one-pager, technical datasheet).
- **TRL 9** – Product release (finalize docs, make series-ready, transfer to sales matrix).

(TRL 1 and TRL 7 are usually not called out explicitly: TRL 1 is prior research, and the on-site
operational pilot of TRL 7 is effectively folded into the prototype test and product release steps.)

---

## References

- **NASA** Technology Readiness Level definitions (TRL 1–9) — NASA defined the original 9-level TRL
  scale; see NASA's technology readiness level descriptions at
  <https://www.nasa.gov/directorates/somd/space-communications-navigation-program/technology-readiness-levels/>.
- **European Commission / Horizon 2020** TRL definitions (Work Programme 2014–2015, General Annex G)
  — the EU wording quoted above ("Basic principles observed", "Technology validated in lab", etc.):
  <https://ec.europa.eu/research/participants/data/ref/h2020/wp/2014_2015/annexes/h2020-wp1415-annex-g-trl_en.pdf>
- **Horizon Europe** carries the same TRL definitions forward in its General Annexes.
- **ISO 16290:2013** — *Space systems — Definition of the Technology Readiness Levels (TRLs) and
  their criteria of assessment* (international standardisation of the TRL scale).
