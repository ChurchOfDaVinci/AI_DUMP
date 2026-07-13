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

**Goal:** Establish that the underlying scientific/engineering principle exists.

**What is normally done:**
- Literature review and study of existing research.
- Observation and reporting of basic physical, electrical, or chemical principles.
- Theoretical work; no application is defined yet.

**Typical output / evidence:** research notes, a short report, references to papers or standards.

---

## TRL 2 — Technology concept formulated

**Goal:** Turn the principle into a *possible* practical application (still speculative, no proof yet).

**What is normally done:**
- Define the concept and its intended use.
- Formulate the project scope, key results, and technical specification (must-have / nice-to-have).
- Initial risk analysis and scope-change analysis.
- Market / component research: which suppliers, devices, prices, and documentation quality exist.

**Typical output / evidence:** a project/scope document, a specification list, a market study.

> In this repo, TRL 2 is where scope, requirements and supplier/component market research are done
> (see the charger project scope and the module market study).

---

## TRL 3 — Experimental proof of concept

**Goal:** Prove that the *critical function* of the idea actually works, analytically or with a small test.

**What is normally done:**
- Analytical studies and/or small-scale lab experiments on the key risky element.
- Conceptual design: which components are required and how they satisfy the scope.
- First engineering artefacts: single-line electrical diagram, mechanical concept description.
- Material cost estimate and rough engineering/planning estimate based on the concept.

**Typical output / evidence:** proof-of-concept results, conceptual design, single-line diagram,
cost/planning estimate. Ends with a **tollgate review**.

---

## TRL 4 — Technology validated in the laboratory

**Goal:** Show that the basic components work *together* (integration) in a controlled lab setting.

**What is normally done:**
- Build and test a simple prototype ("breadboard") integrating the key components.
- Detailed design work begins (mechanical, electrical, software).
- Lab measurements to confirm the parts behave as expected when combined.

**Typical output / evidence:** breadboard test results, detailed design drawings/schematics,
lab measurement reports.

---

## TRL 5 — Technology validated in a relevant environment

**Goal:** Increase fidelity — test the integrated technology in conditions that *resemble* real use.

**What is normally done:**
- Test the prototype/subsystem in a simulated or *relevant* environment (e.g. realistic
  load, temperature, vibration, EMC conditions rather than an ideal bench).
- More complete integration than TRL 4.
- Complete detailed engineering: galvanic isolation, EMC, inrush, cooling, envelope, weight.
- CE / compliance documentation, build book and assembly instructions.

**Typical output / evidence:** validation results in a relevant environment, complete detailed
design package, draft CE documentation. (In this repo TRL 4 and 5 are handled together as
"detailed design".) Ends with a **tollgate review**.

---

## TRL 6 — Technology demonstrated in a relevant environment

**Goal:** Demonstrate a full **system/subsystem prototype** in a relevant environment.

**What is normally done:**
- Build the prototype (proto build).
- Functional testing and performance validation against the must-have criteria.
- Verify key behaviours (e.g. EMC, inrush current, thermal behaviour, ingress protection).

**Typical output / evidence:** working prototype, functional test report, performance validation
against requirements (this is what a *measurement / verification plan* checks off). Ends with a
**tollgate review**.

---

## TRL 7 — System prototype demonstration in an operational environment

**Goal:** Demonstrate a near-final prototype in the **actual operational environment**.

**What is normally done:**
- Field trials / pilot installation in the real operating setting (e.g. installed on site,
  connected to the real grid or microgrid).
- Full-scale operational testing under real-world conditions.

**Typical output / evidence:** field/pilot test results, operational demonstration report.

> Note: The projects in this repo often go directly from TRL 6 (prototype test) to TRL 8
> (sales readiness). TRL 7 is where a real on-site operational pilot would sit if performed.

---

## TRL 8 — Actual system completed and qualified

**Goal:** The technology is in its **final form**, fully tested, qualified and certified.

**What is normally done:**
- Final product and process qualification.
- Certification / compliance sign-off (e.g. CE marking).
- Full integration; pre-commercial preparation.
- Commercial preparation: sales one-pager, technical datasheet.

**Typical output / evidence:** qualification/certification records, datasheet, sales one-pager.
Ends with a **tollgate review**.

---

## TRL 9 — Actual system proven through successful operations

**Goal:** The technology is in **real, routine operational use** and proven reliable.

**What is normally done:**
- Finalize and update all documentation.
- Make the product series-ready (production-ready).
- Transfer the product to the sales matrix / into production.
- Ongoing monitoring and maintenance.

**Typical output / evidence:** released, series-ready product; final documentation; product in the
sales catalogue. Ends with a final acceptance **tollgate review**.

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
