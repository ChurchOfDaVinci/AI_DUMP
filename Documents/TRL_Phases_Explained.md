# Technology Readiness Levels (TRL) — General Guide

This document explains what each **Technology Readiness Level (TRL)** phase means in general:
a plain-language definition of the level, the goal of the phase, what is typically done in it, the
environment/fidelity it is tested at, what is normally used to prove you have reached it, common
pitfalls, and how the phase maps onto the projects in this repository. It is written as a general
reference so it can be applied to any of the hardware/engineering projects here (e.g. the
*400 A Charger*, the *e-PU Cabinet V2* BESS, etc.).

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

**Definition.** TRL 1 is the lowest level of technology maturity. Scientific research is just
beginning to be translated into applied research and development: basic scientific principles are
observed and reported, but no practical application has been identified yet. In the NASA and
EU Horizon 2020 definitions this is the "paper study" level — you understand *that* an effect
exists, not yet *how* to use it.

**Goal:** Establish and document that the underlying scientific/engineering principle the future
product will rely on genuinely exists and is understood.

**What is normally done:**
- Literature review and study of existing published research, standards and prior art.
- Observation and reporting of the basic physical, electrical, chemical or thermal principles that
  could be exploited.
- Purely theoretical or analytical work; any experiments only observe a phenomenon, they do not
  build anything.
- No application, requirement or design is defined yet — the work is knowledge-gathering.

**Environment & fidelity.** Entirely on paper / in the scientific literature. There is no hardware,
no device model, and no defined operating environment.

**How you prove you've reached it (exit criteria):** research notes or a short survey report that
identifies the relevant principle(s), with references to papers, textbooks or standards. Reviewers
should be able to answer *"is this physically possible?"* with a documented "yes".

**Common pitfalls.** Jumping to a solution before the principle is understood; confusing a known
principle with a proven application (that is TRL 3+, not TRL 1).

**How this applies to this repository.** For the power-electronics projects here (400 A AC/DC
charger, e-PU Cabinet V2 BESS) the basic principles — galvanic isolation, PFC rectification, DC/DC
conversion, liquid cooling, Li-ion storage — are long-established and well documented. TRL 1 is
therefore effectively "prior art"; it is assumed complete before the project starts and is not
called out as an explicit task.

---

## TRL 2 — Technology concept formulated

**Definition.** Once basic principles are observed, practical applications can be invented. TRL 2
is where a *specific* technology concept and its intended application are formulated. The concept
is still speculative — there is little or no experimental proof yet — but the intended use, the
analytical reasoning and the expected benefit are written down.

**Goal:** Turn the known principle into a defined, *possible* product concept: state what would be
built, for whom, and against which requirements — even though nothing has been proven.

**What is normally done:**
- Define the concept and its intended use (the product idea and its application).
- Formulate the project scope, key results, and technical specification, split into must-have and
  nice-to-have requirements.
- Perform an initial risk analysis and a scope-change analysis.
- Carry out market / component research: which suppliers and devices exist, at what price, and with
  what documentation quality.

**Environment & fidelity.** Still analytical / on paper. The work consists of specifications,
studies and comparisons rather than hardware.

**How you prove you've reached it:** a project/scope document, a written specification (requirements)
list, and a market/component study. These let a reviewer answer *"what could we build, and with
which parts?"*.

**Common pitfalls.** Writing requirements that are not measurable; skipping the must-have /
nice-to-have split; underestimating supplier lead-time or documentation-quality risk.

**How this applies to this repository.** TRL 2 is the first explicit task in the project scope. For
the 400 A charger it is where the must-have specification is fixed (galvanic isolation AC↔DC,
400/500 A Powerlock 3P+PE, 600–800 VDC, liquid cooled, material cost < €20 000, Modbus TCP,
IEC 61439 / NEN 1010 / IEC 61000 compliance, C80 inrush) and where the module market study compares
candidate converter modules and suppliers.

---

## TRL 3 — Experimental proof of concept

**Definition.** TRL 3 is where active research and development begins. Analytical studies and/or
small laboratory experiments are used to physically validate that the *critical function* or
analytical prediction of the concept actually works. It proves the single riskiest element — not
the whole system.

**Goal:** Prove that the *critical function* of the idea really works, analytically or with a
small-scale test, and translate the concept into a first conceptual design.

**What is normally done:**
- Analytical studies and/or small-scale lab experiments focused on the key risky element.
- Conceptual design: decide which components are required and show how they satisfy the scope.
- First engineering artefacts: single-line electrical diagram, mechanical concept description.
- Material cost estimate and a rough engineering/planning (hours, cost, schedule) estimate based on
  the concept.

**Environment & fidelity.** Laboratory or analytical. Any hardware used is ad-hoc and not
representative of the final product; the focus is on the proof, not on integration or packaging.

**How you prove you've reached it:** proof-of-concept results (analysis or bench test), a conceptual
design, a single-line diagram, and a cost/planning estimate. In this repo's flow the phase ends
with a **tollgate review**.

**Common pitfalls.** Proving an easy part while ignoring the real risk; conceptual designs that
ignore cost, size or cooling constraints; optimistic hour estimates.

**How this applies to this repository.** TRL 3 is the conceptual-design task: selecting converter
modules, drawing the single-line diagram, describing the mechanical layout inside the power-module
envelope, and estimating material cost (target < €20 000) and engineering hours. The tollgate
decides whether the concept is worth detailed engineering.

---

## TRL 4 — Technology validated in the laboratory

**Definition.** With the concept proven, the basic technological components are integrated to
establish that they will work together. At TRL 4 this integration is "low fidelity" — a laboratory
breadboard — compared with the eventual system. It is the first level where the pieces are combined
rather than tested in isolation.

**Goal:** Show that the basic components function *together* (integration) in a controlled
laboratory setting.

**What is normally done:**
- Build and test a simple prototype ("breadboard") that integrates the key components.
- Detailed design work begins in parallel (mechanical, electrical, software).
- Laboratory measurements confirm the combined parts behave as predicted.

**Environment & fidelity.** Controlled laboratory. The breadboard is functional but not packaged,
ruggedised or representative of the final form factor.

**How you prove you've reached it:** breadboard test results, the first detailed design
drawings/schematics, and laboratory measurement reports.

**Common pitfalls.** Treating a tidy bench demo as if it were a relevant-environment test; deferring
EMC, thermal and isolation questions that will dominate later levels.

**How this applies to this repository.** TRL 4 marks the start of detailed design. In this repo
TRL 4 and 5 are handled together as one "detailed design" step, so TRL 4 covers the first integrated
lab validation of the charger's power path (rectifier/PFC + isolated DC/DC + control) before it is
exercised under realistic conditions.

---

## TRL 5 — Technology validated in a relevant environment

**Definition.** The fidelity of the breadboard increases significantly. At TRL 5 the integrated
technology is tested in a *relevant* (realistic, though possibly simulated) environment, so that it
is validated under conditions much closer to the real application — for key enabling technologies,
an industrially relevant environment.

**Goal:** Increase fidelity — test the integrated technology under conditions that *resemble* real
use (realistic loads, temperatures, vibration, EMC), not an ideal bench.

**What is normally done:**
- Test the prototype/subsystem in a simulated or *relevant* environment (realistic load,
  temperature, vibration, EMC conditions rather than an ideal bench).
- Achieve more complete integration than at TRL 4.
- Complete the detailed engineering: galvanic isolation, EMC, inrush, cooling, envelope, weight.
- Produce CE / compliance documentation, the build book and assembly instructions.

**Environment & fidelity.** Relevant environment — realistic operating stresses applied, though
possibly still on a test rig rather than the final installation.

**How you prove you've reached it:** validation results obtained in a relevant environment, a
complete detailed design package, and draft CE documentation. (In this repo TRL 4 and 5 are handled
together as "detailed design".) Ends with a **tollgate review**.

**Common pitfalls.** Declaring success from a single nominal-condition test; leaving compliance
(CE, IEC 61439, EMC IEC 61000) documentation until after the hardware is frozen.

**How this applies to this repository.** TRL 5 completes detailed design for the charger:
liquid-cooling sizing (total heat < 7 kW, efficiency > 97.5 %), galvanic isolation, C-type inrush
behaviour, weight (< 500 kg) and envelope (within the power-module size), plus the CE dossier and
build book. It feeds directly into the prototype build.

---

## TRL 6 — Technology demonstrated in a relevant environment

**Definition.** TRL 6 is a major step up: a representative model or full system/subsystem prototype
is built and demonstrated in a relevant environment. The prototype is well beyond the breadboard of
TRL 5 and is close to the final configuration in form, fit and function.

**Goal:** Demonstrate a full **system/subsystem prototype** in a relevant environment, validated
against the must-have criteria.

**What is normally done:**
- Build the prototype (proto build).
- Functional testing and performance validation against the must-have criteria.
- Verify the key behaviours (EMC, inrush current, thermal behaviour, ingress protection,
  efficiency, control interface).

**Environment & fidelity.** Relevant environment with a near-representative prototype — much higher
fidelity than TRL 5, exercising the real power levels and interfaces.

**How you prove you've reached it:** a working prototype, a functional test report, and a
performance validation against requirements — exactly what a *measurement / verification plan*
checks off. Ends with a **tollgate review**.

**Common pitfalls.** Testing only a subset of requirements; no traceable pass/fail matrix; skipping
worst-case (maximum power, maximum temperature) points.

**How this applies to this repository.** TRL 6 is the testing task. The e-PU Cabinet V2
*Measurement Plan* is the TRL 6 instrument: it lists every requirement and records that the
prototype was measured and passes (power, efficiency, isolation, EMC, inrush, cooling,
Modbus TCP control, etc.).

---

## TRL 7 — System prototype demonstration in an operational environment

**Definition.** TRL 7 requires demonstration of a near-final ("system prototype") in the
*operational* environment — the real setting in which the product will be used. It differs from
TRL 6 in that the environment is the actual operational one, not a relevant/simulated one.

**Goal:** Demonstrate a near-final prototype in the **actual operational environment**.

**What is normally done:**
- Field trials / pilot installation in the real operating setting (installed on site, connected to
  the real grid or microgrid).
- Full-scale operational testing under real-world conditions and duty cycles.

**Environment & fidelity.** Operational environment — the real installation, real grid/microgrid,
real thermal and duty conditions. Fidelity is essentially final.

**How you prove you've reached it:** field/pilot test results and an operational demonstration
report from the real site.

**Common pitfalls.** Assuming a lab-passed prototype will behave identically on a real microgrid
(earthing, harmonics, ambient); insufficient monitoring during the pilot.

**How this applies to this repository.** The projects here often move directly from TRL 6 (prototype
test) to TRL 8 (sales readiness), so TRL 7 is not always an explicit task. It is where an on-site
operational pilot of the charger in an e-PU10 microgrid would sit — validating the > 98 % uptime and
serviceability goals under real conditions — if such a pilot is run.

---

## TRL 8 — Actual system completed and qualified

**Definition.** The technology has been proven to work in its final form and under the expected
conditions. At TRL 8 the actual system is completed and *qualified* through test and demonstration;
in almost all cases this is the end of true system development.

**Goal:** Reach the **final form** — fully tested, qualified and certified, and ready to be offered
commercially.

**What is normally done:**
- Final product and process qualification.
- Certification / compliance sign-off (e.g. CE marking).
- Full integration and pre-commercial preparation.
- Commercial preparation: sales one-pager, technical datasheet.

**Environment & fidelity.** Final form in the operational configuration; the product is the real
thing, qualified against its specification and standards.

**How you prove you've reached it:** qualification/certification records, a technical datasheet and
a sales one-pager. Ends with a **tollgate review**.

**Common pitfalls.** Treating certification as a formality; datasheet figures that don't match the
qualified test results; missing traceability from requirement → test → certificate.

**How this applies to this repository.** TRL 8 is the "create one-pager for sales" task. For the
charger it means the CE-marked, qualified 400 A unit with a datasheet reflecting the verified
specification (power, efficiency, isolation, cost, interfaces) ready to present to customers.

---

## TRL 9 — Actual system proven through successful operations

**Definition.** TRL 9 is the highest level: the actual system is proven through successful
operation. The technology is applied in its final form and under real, routine operating
conditions, and is no longer under development — only in-service monitoring and improvement remain.

**Goal:** The technology is in **real, routine operational use** and proven reliable, and is
released as a series product.

**What is normally done:**
- Finalize and update all documentation.
- Make the product series-ready (production-ready).
- Transfer the product to the sales matrix / into production.
- Ongoing monitoring and maintenance.

**Environment & fidelity.** Live operation / series production — the real product, in real use, at
production quality.

**How you prove you've reached it:** a released, series-ready product; final documentation; the
product in the sales catalogue; and field reliability data. Ends with a final acceptance
**tollgate review**.

**Common pitfalls.** Declaring TRL 9 from a single successful install rather than proven routine
operation; letting documentation drift out of date once the product ships; no feedback loop from
field data into maintenance.

**How this applies to this repository.** TRL 9 is the "finalize product and transfer to sales
matrix" task. For the 400 A charger and the e-PU Cabinet V2 BESS it means the production-ready unit,
complete documentation, and the product in VDL Energy Systems' sales matrix, with field uptime
(> 98 %) monitored in service.

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

- **NASA** Technology Readiness Level definitions —
  <https://www.nasa.gov/directorates/heo/scan/engineering/technology/technology_readiness_level>
- **European Commission / Horizon 2020** TRL definitions (Annex G) —
  <https://ec.europa.eu/research/participants/data/ref/h2020/wp/2014_2015/annexes/h2020-wp1415-annex-g-trl_en.pdf>
