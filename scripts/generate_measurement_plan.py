#!/usr/bin/env python3
"""
generate_measurement_plan.py
============================
Generates 'ACDC charger/400A Charger Measurement Plan.docx' by:
  1. Copying the template (styles, headers/footers, theme, media, numbering) from
     'ACDC charger/e-PU Cabinet V2 Measurement Plan.docx'
  2. Clearing the document body while preserving all style / layout artefacts
  3. Writing new content that mirrors the e-PU Cabinet V2 measurement plan chapter
     structure (Introduction + How to use, Legend, Verification Cross-Reference
     Matrix, Test Sheets grouped per TRL, Test Phase Overview, Sign-off) for the
     400A AC/DC charger project.

Usage
-----
  cd <repo root>
  python3 scripts/generate_measurement_plan.py

Dependencies
------------
  pip install python-docx
"""

import copy
import io
import os
import shutil
import zipfile
from datetime import date

from docx import Document
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
REPO_ROOT = os.path.join(os.path.dirname(__file__), "..")
TEMPLATE_PATH = os.path.join(REPO_ROOT, "ACDC charger", "e-PU Cabinet V2 Measurement Plan.docx")
OUTPUT_PATH = os.path.join(REPO_ROOT, "ACDC charger", "400A Charger Measurement Plan.docx")

# ---------------------------------------------------------------------------
# Helper – low-level XML utilities
# ---------------------------------------------------------------------------

def _set_cell_bg(cell, hex_color: str):
    """Set table-cell background shading."""
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    existing = tcPr.find(qn("w:shd"))
    if existing is not None:
        tcPr.remove(existing)
    tcPr.append(shd)


def _bold_cell(cell):
    """Make all runs in a cell bold."""
    for para in cell.paragraphs:
        for run in para.runs:
            run.bold = True
        if not para.runs:
            run = para.add_run(para.text)
            run.bold = True


def _make_row_header(row, hex_color: str = "1F3864"):
    """Apply dark-blue background + white bold text to a table row."""
    for cell in row.cells:
        _set_cell_bg(cell, hex_color)
        for para in cell.paragraphs:
            for run in para.runs:
                run.bold = True
                run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            if not para.runs and para.text:
                run = para.add_run(para.text)
                run.bold = True
                run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)


def _make_label_cell(cell, hex_color: str = "D9E1F2"):
    """Light-blue background for label cells."""
    _set_cell_bg(cell, hex_color)
    for para in cell.paragraphs:
        for run in para.runs:
            run.bold = True
        if not para.runs and para.text:
            run = para.add_run(para.text)
            run.bold = True


def _add_paragraph(doc, text: str, style: str = "Normal", bold: bool = False) -> object:
    para = doc.add_paragraph(style=style)
    if text:
        run = para.add_run(text)
        if bold:
            run.bold = True
    return para


def _page_break(doc):
    para = doc.add_paragraph()
    run = para.add_run()
    run.add_break(docx_break_type=1)  # WD_BREAK.PAGE
    return para


# ---------------------------------------------------------------------------
# Test-sheet data model
# ---------------------------------------------------------------------------

class TestSheet:
    def __init__(self, ts_id, title, objective, standard, equipment,
                 setup, procedure_steps, measured_qty, acceptance, method="T"):
        self.ts_id = ts_id
        self.title = title
        self.objective = objective
        self.standard = standard
        self.equipment = equipment
        self.setup = setup
        self.procedure_steps = procedure_steps  # list of strings
        self.measured_qty = measured_qty
        self.acceptance = acceptance
        self.method = method


# ---------------------------------------------------------------------------
# All test-sheet content (derived from project.txt, TRL_Tasks and SCORE csv)
# ---------------------------------------------------------------------------

TRL_DATA = [
    # -----------------------------------------------------------------------
    # TRL 2 — Scope & Market Research
    # -----------------------------------------------------------------------
    {
        "number": "2",
        "title": "Scope & Market Research",
        "weeks": "Week 1–3",
        "effort": "32 h",
        "objective": (
            "Confirm the project scope, define and record all technical requirements "
            "(must-have and recommended), perform a component market survey to identify "
            "available AC/DC converter modules that can satisfy the 400 A charger specification, "
            "and assess the quality of supplier documentation."
        ),
        "entry_criteria": [
            "Project kick-off meeting has taken place (23-06-2026).",
            "Project plan document (ProjectPlan_400A_Charger.docx) is available and baselined.",
        ],
        "exit_criteria": [
            "Project-scope document is finalised and approved by the project lead.",
            "Technical requirements list (must-have / recommended) is complete.",
            "At least three candidate converter modules have been evaluated against the requirements.",
            "Risk register has been created.",
            "Tollgate TRL 2 review is signed off by project lead (L. Rietkerk).",
        ],
        "sheets": [
            TestSheet(
                ts_id="TS-2-01",
                title="Must-Have Specification Compliance Checklist",
                objective=(
                    "Verify that the project scope document contains all mandatory requirements "
                    "and that each requirement is traceable to the project plan."
                ),
                standard="Internal project plan; IEC 61439; NEN 1010",
                equipment="Project plan document; requirements checklist template",
                setup=(
                    "Review ProjectPlan_400A_Charger.docx against the 11 must-have items "
                    "(galvanic AC/DC isolation; 400/500 A Powerlock 3P+PE; unidirectional; "
                    "liquid cooling; DC ≥ 600–800 VDC; material cost < €20,000; "
                    "ModbusTCP/CAN/Profinet/EtherCAT; EU compliant; mobile/vibration-resistant; "
                    "min. settable power ≥ 55 kW/80 A; inrush acceptable for a C-type C80 breaker). "
                    "Tick each Present or Missing and log any missing item as a non-conformance."
                ),
                procedure_steps=[],
                measured_qty="Number of must-have requirements addressed (count / 11)",
                acceptance="All 11 must-have requirements are present and unambiguously formulated. No missing items.",
                method="I / A",
            ),
            TestSheet(
                ts_id="TS-2-02",
                title="Supplier & Component Documentation Quality Assessment",
                objective=(
                    "Evaluate the availability and completeness of technical documentation "
                    "for each candidate AC/DC converter module identified in the market survey."
                ),
                standard="Internal quality criteria; IEC 61439",
                equipment="Supplier datasheets, test reports, certificates; SCORE evaluation matrix (400A - 275kW AC-DC Converters(SCORE).csv)",
                setup=(
                    "For each candidate module, use the SCORE spreadsheet to score 0/5/10 the "
                    "availability of: complete datasheet (power, voltage range, efficiency, "
                    "dimensions, weight); CE/TÜV certificate or DoC; communication docs "
                    "(register map / CAN DBC); mechanical drawing or 3D model; and cooling specs "
                    "(flow rate, pressure drop, inlet temperature). Record the overall score per candidate."
                ),
                procedure_steps=[],
                measured_qty="Documentation completeness score per candidate (0–10 per criterion)",
                acceptance=(
                    "At least two candidates score ≥ 7.0 overall. "
                    "Each selected candidate has a valid CE/TUV declaration on file."
                ),
                method="I / A",
            ),
            TestSheet(
                ts_id="TS-2-03",
                title="Component Availability vs. Requirements Verification",
                objective=(
                    "Confirm that at least one commercially available converter module meets "
                    "all must-have requirements from the 400 A charger specification."
                ),
                standard="Internal project specification; IEC 61439; NEN 1010",
                equipment="SCORE evaluation matrix; supplier datasheets",
                setup=(
                    "Take the ranked candidate list from TS-2-02 and mark each of the 11 must-have "
                    "requirements Pass/Fail/Unknown per candidate. Identify the top candidate(s) with "
                    "≤ 1 Unknown item and document any gaps for follow-up in TRL 3."
                ),
                procedure_steps=[],
                measured_qty="Number of must-have requirements met per candidate (count / 11)",
                acceptance=(
                    "At least one candidate meets all 11 must-have requirements or has at most "
                    "one Unknown item (to be resolved in TRL 3)."
                ),
                method="A",
            ),
        ],
    },
    # -----------------------------------------------------------------------
    # TRL 3 — Conceptual Design
    # -----------------------------------------------------------------------
    {
        "number": "3",
        "title": "Conceptual Design",
        "weeks": "Week 4–5",
        "effort": "20 h",
        "objective": (
            "Select the required components, define how the conceptual design meets the "
            "project scope, create a single-line electrical diagram and mechanical concept, "
            "and validate the design concept against cost, thermal and mechanical constraints."
        ),
        "entry_criteria": [
            "TRL 2 tollgate is signed off.",
            "At least one candidate module identified and short-listed.",
            "Technical requirements list is complete.",
        ],
        "exit_criteria": [
            "Single-line electrical diagram is reviewed and approved.",
            "Mechanical concept description is complete (dimensions, weight estimate).",
            "Material cost estimate is within budget.",
            "Thermal/efficiency budget confirms the design is feasible.",
            "Tollgate TRL 3 review is signed off by project lead.",
        ],
        "sheets": [
            TestSheet(
                ts_id="TS-3-01",
                title="Single-Line Electrical Design Review",
                objective=(
                    "Verify that the single-line electrical diagram correctly represents the "
                    "400 A charger architecture and includes all required functional blocks."
                ),
                standard="IEC 61439; NEN 1010; internal design standard",
                equipment="Single-line diagram (CAD/PDF); design review checklist",
                setup=(
                    "In a structured design review, confirm the single-line diagram shows all 9 elements "
                    "correctly connected: AC input (3P+PE, 400/500 A Powerlock); AC protection (C80 C-type "
                    "breaker); galvanic isolation barrier; AC/DC converter module(s); DC bus (600–800 VDC); "
                    "DC protection (fuse/switch); liquid-cooling connections; control/comms interface "
                    "(ModbusTCP/CAN); and PE bonding/routing. Record any missing element or error and sign the diagram."
                ),
                procedure_steps=[],
                measured_qty="Number of required elements present and correctly connected (count / 9)",
                acceptance="All 9 required elements are present. Zero design errors recorded. Diagram is signed off.",
                method="I / A",
            ),
            TestSheet(
                ts_id="TS-3-02",
                title="Thermal & Efficiency Budget Check",
                objective=(
                    "Verify by calculation that the conceptual design achieves the required "
                    "efficiency and stays within the e-PU10 heat dissipation limit."
                ),
                standard="e-PU10 restrictions (project plan); IEC 61439",
                equipment="Calculator / spreadsheet; converter efficiency data from datasheets",
                setup=(
                    "From the converter datasheet full-load efficiency and estimated cable/connector "
                    "losses P_cable, compute P_in = P_out/η_converter + P_cable, heat P_heat = P_in − P_out, "
                    "and system efficiency η_sys = P_out/P_in × 100. Record η_sys and P_heat and compare "
                    "against η_sys ≥ 97.5 % and P_heat < 7 000 W."
                ),
                procedure_steps=[],
                measured_qty="System efficiency η_sys [%]; total heat P_heat [W]",
                acceptance="η_sys ≥ 97.5 % AND P_heat < 7 000 W at rated output power.",
                method="A",
            ),
            TestSheet(
                ts_id="TS-3-03",
                title="Mechanical Envelope & Weight Pre-Check",
                objective=(
                    "Verify that the conceptual mechanical design fits within the e-PU10 "
                    "power-module envelope and does not exceed the maximum weight."
                ),
                standard="e-PU10 restrictions (project plan); mechanical concept drawing",
                equipment="Mechanical concept sketch / CAD model; tape measure (if physical mock-up exists)",
                setup=(
                    "From the converter datasheet and mechanical concept, add module and enclosure "
                    "dimensions and confirm the assembly fits the e-PU10 power-module envelope. Sum the "
                    "weights of modules, enclosure, cooling system and cabling and check total < 500 kg."
                ),
                procedure_steps=[],
                measured_qty="Overall assembly dimensions [mm × mm × mm]; estimated total weight [kg]",
                acceptance=(
                    "Assembly dimensions fit within e-PU10 power-module size. "
                    "Estimated total weight < 500 kg."
                ),
                method="A / I",
            ),
            TestSheet(
                ts_id="TS-3-04",
                title="Material Cost Check",
                objective=(
                    "Verify that the estimated bill-of-materials (BOM) cost of the conceptual "
                    "design is within budget."
                ),
                standard="Project plan (cost constraint < €20,000)",
                equipment="Component quotations / list prices; BOM spreadsheet",
                setup=(
                    "Compile a preliminary BOM (converter module(s), enclosure, cooling components, "
                    "connectors, cables, protection devices, control hardware) with unit prices from the "
                    "TS-2-02 supplier list. Sum Σ(qty × unit price), add 15 % contingency, and check total < €20,000."
                ),
                procedure_steps=[],
                measured_qty="Total estimated material cost [€]",
                acceptance="Total estimated BOM cost (including 15 % contingency) < €20,000.",
                method="A",
            ),
        ],
    },
    # -----------------------------------------------------------------------
    # TRL 4/5 — Detailed Design
    # -----------------------------------------------------------------------
    {
        "number": "4.5",
        "title": "Detailed Design",
        "weeks": "Week 6–12",
        "effort": "180 h",
        "objective": (
            "Execute the full detailed design: mechanical, electrical and software. "
            "Verify on paper / by analysis that the detailed design satisfies all must-have "
            "requirements before prototype build is authorised."
        ),
        "entry_criteria": [
            "TRL 3 tollgate is signed off.",
            "Conceptual design is approved.",
            "Component selection is confirmed (at least one module meets all must-haves).",
        ],
        "exit_criteria": [
            "All six detailed-design test sheets are passed (or accepted with derogation).",
            "Detailed mechanical and electrical drawings are released.",
            "Software architecture and communication register map are documented.",
            "CE documentation package is started.",
            "Tollgate TRL 4/5 review is signed off by project lead.",
        ],
        "sheets": [
            TestSheet(
                ts_id="TS-4.5-01",
                title="Galvanic Isolation / Dielectric Withstand Verification",
                objective=(
                    "Verify by design analysis that the AC/DC converter module provides "
                    "galvanic isolation between AC input and DC output, and that the isolation "
                    "level meets IEC 61439 / NEN 1010 requirements."
                ),
                standard="IEC 61439-1; NEN 1010; converter module datasheet / test report",
                equipment="Converter datasheet; IEC 61439 standard (design analysis – no physical test required at this TRL)",
                setup=(
                    "From the converter dielectric-withstand / hi-pot report, confirm the test voltage meets "
                    "or exceeds the IEC 61439 requirement for the rated working voltage, verify creepage and "
                    "clearance against IEC 61439 Table F.2, and confirm the datasheet states galvanic isolation. "
                    "Record test voltage, isolation class, creepage and clearance; if no report exists, flag for the TRL 6 physical test."
                ),
                procedure_steps=[],
                measured_qty="Dielectric withstand voltage [V AC or V DC]; isolation class; creepage [mm]; clearance [mm]",
                acceptance=(
                    "Dielectric withstand ≥ 3 750 V AC (or per IEC 61439 for rated voltage). "
                    "Galvanic isolation confirmed in datasheet. "
                    "Creepage and clearance within IEC 61439 limits."
                ),
                method="I / A",
            ),
            TestSheet(
                ts_id="TS-4.5-02",
                title="DC Output Voltage Range Verification",
                objective=(
                    "Verify by design analysis that the converter module can operate across "
                    "the required DC output voltage range of 600–800 VDC (minimum)."
                ),
                standard="Project specification; converter module datasheet",
                equipment="Converter datasheet; voltage range specification from project plan",
                setup=(
                    "From the converter datasheet, record the DC output V_min and V_max and confirm "
                    "V_min ≤ 600 V and V_max ≥ 800 V. Check voltage-regulation accuracy (e.g. ± 1 %) and that "
                    "the range is settable via the communication interface."
                ),
                procedure_steps=[],
                measured_qty="DC output voltage range: V_min [V DC] and V_max [V DC]",
                acceptance="V_min ≤ 600 V DC AND V_max ≥ 800 V DC as specified in datasheet.",
                method="I / A",
            ),
            TestSheet(
                ts_id="TS-4.5-03",
                title="Minimum Settable Power Setpoint Verification",
                objective=(
                    "Verify by design analysis that the converter module supports a minimum "
                    "settable power setpoint of at least 55 kW / 80 A (must-have)."
                ),
                standard="Project specification (must-have); converter module communication datasheet",
                equipment="Converter communication register map / datasheet",
                setup=(
                    "From the datasheet / register map, record minimum settable P_min [kW] and I_min [A] and "
                    "confirm P_min ≤ 55 kW and I_min ≤ 80 A with a setpoint resolution ≤ 1 kW/1 A. Also check "
                    "whether the recommended minimum (20 kW / 32 A) is achievable."
                ),
                procedure_steps=[],
                measured_qty="Minimum settable power P_min [kW]; minimum settable current I_min [A]",
                acceptance=(
                    "P_min ≤ 55 kW AND I_min ≤ 80 A (must-have met). "
                    "P_min ≤ 20 kW AND I_min ≤ 32 A is preferred (recommended spec)."
                ),
                method="I / A",
            ),
            TestSheet(
                ts_id="TS-4.5-04",
                title="Communication Protocol Verification",
                objective=(
                    "Verify that the detailed software design implements a supported communication "
                    "protocol (ModbusTCP preferred; alternatively CAN, Profinet or EtherCAT) "
                    "and that a complete register map / message definition is documented."
                ),
                standard="Project specification; Modbus Application Protocol v1.1b3; CAN ISO 11898",
                equipment=(
                    "Software architecture document; register map / DBC file; "
                    "Modbus analyser (Modbus Poll or equivalent) — for TRL 6 physical test"
                ),
                setup=(
                    "Confirm the implemented protocol is one of ModbusTCP (preferred), CAN, Profinet or "
                    "EtherCAT, and that the versioned register map / DBC maps all 5 required commands: "
                    "enable/disable charging; set output power or current; set output voltage; read measured "
                    "power/current/voltage; and read fault/status word. Verify the map is in the documentation package."
                ),
                procedure_steps=[],
                measured_qty=(
                    "Protocol type (ModbusTCP / CAN / Profinet / EtherCAT); "
                    "number of required commands mapped (count / 5)"
                ),
                acceptance=(
                    "Protocol is one of the four accepted types. "
                    "All 5 required control commands are mapped and documented."
                ),
                method="I / A",
            ),
            TestSheet(
                ts_id="TS-4.5-05",
                title="EMC Pre-Compliance Design Review",
                objective=(
                    "Verify by design analysis that the detailed design incorporates appropriate "
                    "EMC mitigation measures to meet industrial EMC requirements (IEC 61000)."
                ),
                standard="IEC 61000-4 series; IEC 61000-6-2 (industrial immunity); IEC 61000-6-4 (industrial emission)",
                equipment="Detailed electrical drawings; EMC design checklist; converter EMC test report (if available)",
                setup=(
                    "Confirm the converter has an EMC report / CE declaration covering IEC 61000 and record its "
                    "EMC class, then review the electrical drawings for the 4 EMC measures: input EMC/line filter; "
                    "cable shielding plan; PE/ground bonding topology; and separation of power from signal cables. "
                    "Log any gaps as action items."
                ),
                procedure_steps=[],
                measured_qty="EMC class of converter (Class A / B); number of EMC design measures implemented (count / 4)",
                acceptance=(
                    "Converter module EMC class is industrial (IEC 61000-6-2/6-4 or equivalent). "
                    "All 4 EMC design measures are addressed in the design."
                ),
                method="I / A",
            ),
            TestSheet(
                ts_id="TS-4.5-06",
                title="Liquid-Cooling Circuit Design Verification",
                objective=(
                    "Verify by design analysis that the liquid-cooling circuit is correctly "
                    "designed to remove the required heat dissipation within the e-PU10 "
                    "cooling system constraints."
                ),
                standard="e-PU10 restrictions (project plan); converter module cooling datasheet",
                equipment=(
                    "Converter module cooling specification (flow rate, inlet temperature, pressure drop); "
                    "e-PU10 cooling system specification; hydraulic calculation spreadsheet"
                ),
                setup=(
                    "From the converter datasheet record required coolant flow rate, max pressure drop and max "
                    "inlet temperature, and confirm the e-PU10 cooling system can supply them. Compute heat "
                    "removal Q = ṁ × c_p × ΔT and verify Q ≥ P_heat from TS-3-02 (< 7 000 W). Check all cooling "
                    "connections (inlet, outlet, venting) appear on the mechanical drawing."
                ),
                procedure_steps=[],
                measured_qty="Coolant flow rate [L/min]; pressure drop [bar]; inlet temperature [°C]; heat removal capacity Q [W]",
                acceptance=(
                    "Cooling circuit supplies sufficient flow and temperature to remove ≥ 7 000 W. "
                    "Pressure drop within e-PU10 cooling system limits. "
                    "All cooling connections are shown in mechanical drawings."
                ),
                method="A / I",
            ),
        ],
    },
    # -----------------------------------------------------------------------
    # TRL 6 — Prototype Build & Test
    # -----------------------------------------------------------------------
    {
        "number": "6",
        "title": "Prototype Build & Test",
        "weeks": "Week 13–16",
        "effort": "56 h",
        "objective": (
            "Build the first physical prototype of the 400 A AC/DC charger and perform "
            "all physical validation tests to confirm that the prototype meets the must-have "
            "requirements. Results are recorded in this measurement plan."
        ),
        "entry_criteria": [
            "TRL 4/5 tollgate is signed off.",
            "All detailed drawings are released.",
            "Component procurement is complete.",
            "Test environment (AC supply, load bank, measurement instruments) is available and calibrated.",
        ],
        "exit_criteria": [
            "All eight TRL 6 test sheets are completed (Pass or accepted deviation with corrective action).",
            "Test results are recorded and signed off by the test engineer.",
            "Any deviations are documented with root cause and corrective action plan.",
            "Tollgate TRL 6 review is signed off by project lead.",
        ],
        "sheets": [
            TestSheet(
                ts_id="TS-6-01",
                title="Full-Load Continuous Operation at 25 °C",
                objective=(
                    "Verify that the charger delivers 100 % of rated output power continuously "
                    "at 25 °C ambient temperature without fault, shutdown or de-rating."
                ),
                standard="Project acceptance criteria; IEC 61439",
                equipment=(
                    "Calibrated AC power analyser (e.g. Yokogawa WT series or equivalent, calibrated ≤ 12 months); "
                    "calibrated DC power analyser; "
                    "resistive/electronic load bank rated ≥ rated charger output power; "
                    "temperature probe (calibrated); timer"
                ),
                setup=(
                    "Connect the charger to a 3-phase 400 V AC supply via a C80 breaker and the DC output to a "
                    "calibrated electronic load set within 600–800 VDC, at 25 °C ± 3 °C ambient; stabilise for 10 min. "
                    "Command 100 % rated power and run 60 min, recording AC/DC power, DC voltage/current and ambient "
                    "at 0/15/30/45/60 min while monitoring for any fault, shutdown or thermal de-rating; log final values and alarm codes."
                ),
                procedure_steps=[],
                measured_qty="DC output power [kW]; DC output current [A]; DC output voltage [V]; ambient temperature [°C]; duration without fault [min]",
                acceptance=(
                    "DC output power ≥ rated power (100 %) for ≥ 60 min without fault, "
                    "thermal de-rating or shutdown at 25 °C ± 3 °C ambient."
                ),
                method="T",
            ),
            TestSheet(
                ts_id="TS-6-02",
                title="Efficiency Measurement (Input vs. Output Power)",
                objective=(
                    "Measure the AC-to-DC conversion efficiency at 100 % rated load and "
                    "verify that the system efficiency exceeds 97.5 % (e-PU10 restriction)."
                ),
                standard="e-PU10 restrictions (project plan); IEC 61439",
                equipment=(
                    "Calibrated AC power analyser (≤ 12 months calibration, ±0.1 % accuracy); "
                    "calibrated DC power analyser (same accuracy); "
                    "electronic load bank"
                ),
                setup=(
                    "Using the TS-6-01 setup with AC and DC power analysers connected simultaneously (auxiliary "
                    "power included in the AC measurement), record P_AC_in and P_DC_out at steady state and compute "
                    "η = P_DC_out/P_AC_in × 100 at 100 %, 75 % and 50 % load. At 100 % load also compute "
                    "P_heat = P_AC_in − P_DC_out."
                ),
                procedure_steps=[],
                measured_qty="P_AC_in [W]; P_DC_out [W]; η [%]; P_heat [W]",
                acceptance=(
                    "η ≥ 97.5 % at 100 % rated load. "
                    "P_heat < 7 000 W at 100 % rated load."
                ),
                method="T",
            ),
            TestSheet(
                ts_id="TS-6-03",
                title="AC Inrush Behaviour under C80 / B32 Circuit Breaker",
                objective=(
                    "Verify that the inrush current on AC startup is acceptable for the "
                    "specified C-type C80 breaker (must-have) and preferably also for a "
                    "B-type B32 breaker (recommended)."
                ),
                standard="IEC 60947-2; project specification (must-have: C80; recommended: B32); IEC 60898-1",
                equipment=(
                    "Calibrated current clamp or Rogowski coil (bandwidth ≥ 10 kHz, calibrated); "
                    "oscilloscope (≥ 100 MHz, ≥ 4 channels); "
                    "C-type 80 A circuit breaker (for must-have test); "
                    "B-type 32 A circuit breaker (for recommended test)"
                ),
                setup=(
                    "Install the C80 breaker in the AC supply with current clamps on all three phases and the "
                    "oscilloscope triggered on AC switch-on. Close the breaker from cold and record peak inrush "
                    "I_peak and duration t_inrush, confirming no trip; repeat 3 times with 5-min cooling intervals. "
                    "If a B32 breaker is available, repeat for the recommended spec. Record all peaks and trip/no-trip outcomes."
                ),
                procedure_steps=[],
                measured_qty="Peak inrush current I_peak [A]; inrush duration t [ms]; breaker trip status (trip / no trip)",
                acceptance=(
                    "MUST-HAVE: C80 breaker does not trip on any of 3 cold-start attempts. "
                    "RECOMMENDED: B32 breaker does not trip on any of 3 cold-start attempts."
                ),
                method="T",
            ),
            TestSheet(
                ts_id="TS-6-04",
                title="Thermal / Liquid-Cooling Performance at Full Load",
                objective=(
                    "Verify that the liquid-cooling circuit maintains component temperatures "
                    "within limits at 100 % rated load and that total heat dissipation is < 7 kW."
                ),
                standard="e-PU10 restrictions; converter module datasheet (max component temperature)",
                equipment=(
                    "Calibrated thermocouple logger (≥ 4 channels, ±0.5 °C, calibrated); "
                    "calibrated flow meter on cooling circuit; "
                    "calibrated inlet/outlet temperature sensors"
                ),
                setup=(
                    "Fit thermocouples on the converter heatsink, coolant inlet/outlet and ambient, and a "
                    "calibrated flow meter in the cooling loop. Run 100 % rated load for 60 min (same run as TS-6-01), "
                    "recording T_hs, T_in, T_out, flow Q_cool and T_amb every 10 min. At steady state compute "
                    "P_removed = ṁ × c_p × (T_out − T_in) with ṁ = Q_cool × ρ_water, and compare T_hs against the "
                    "module's rated maximum heatsink temperature."
                ),
                procedure_steps=[],
                measured_qty="T_hs [°C]; T_in [°C]; T_out [°C]; Q_cool [L/min]; P_removed [W]",
                acceptance=(
                    "T_hs ≤ converter module rated maximum heatsink temperature. "
                    "P_removed ≥ P_heat from TS-6-02 (i.e. cooling is sufficient). "
                    "No thermal alarm or shutdown during 60-minute full-load run."
                ),
                method="T",
            ),
            TestSheet(
                ts_id="TS-6-05",
                title="EMC Emissions and Immunity",
                objective=(
                    "Verify that the assembled charger prototype meets industrial EMC "
                    "requirements for emissions and immunity."
                ),
                standard=(
                    "IEC 61000-6-2 (industrial immunity); "
                    "IEC 61000-6-4 (industrial emission); "
                    "IEC 61000-4-2 (ESD); IEC 61000-4-4 (EFT); IEC 61000-4-5 (surge)"
                ),
                equipment=(
                    "EMC test laboratory (accredited preferred) or semi-anechoic test chamber; "
                    "spectrum analyser; LISN (line impedance stabilisation network); "
                    "ESD gun; EFT/burst generator; surge generator"
                ),
                setup=(
                    "With the prototype in standard operating configuration on rated AC supply and DC load (accredited "
                    "EMC lab or on-site pre-compliance), run: conducted and radiated emissions per IEC 61000-6-4 / "
                    "CISPR 11 Class A; ESD per IEC 61000-4-2 (Level 3: 6 kV contact, 8 kV air); EFT/burst per "
                    "IEC 61000-4-4 (Level 3); and surge per IEC 61000-4-5 (Level 3: 1 kV diff, 2 kV common). "
                    "Record pass/fail and log any failure with frequency, level and description."
                ),
                procedure_steps=[],
                measured_qty=(
                    "Conducted emission level [dBμV]; radiated emission level [dBμV/m]; "
                    "ESD, EFT, surge immunity results (Pass / Fail)"
                ),
                acceptance=(
                    "All conducted and radiated emission levels below IEC 61000-6-4 Class A limits. "
                    "All immunity tests pass at Level 3 per IEC 61000-6-2."
                ),
                method="T",
            ),
            TestSheet(
                ts_id="TS-6-06",
                title="Vibration Resistance / Mobile Applicability",
                objective=(
                    "Verify that the charger can withstand transportation vibrations and "
                    "is suitable for mobile applications as required by the project specification."
                ),
                standard="IEC 60068-2-6 (vibration sinusoidal) or IEC 60068-2-64 (random vibration); project specification (mobile-capable)",
                equipment=(
                    "Vibration test table or shake table (if available); "
                    "alternatively: perform a road-transport simulation or review based on module datasheet vibration rating. "
                    "Torque wrench; visual inspection checklist."
                ),
                setup=(
                    "Option A (shake table): mount the assembly and run IEC 60068-2-64 road-transport profile "
                    "(5–100 Hz, 0.1 g²/Hz) for 1 hour per axis (X, Y, Z), then inspect for loose fasteners, connector "
                    "damage and coolant leaks. Option B (no shake table): verify the module datasheet vibration rating "
                    "meets IEC 60068-2-6/-64 road-transport class and that all fasteners are torqued to spec, connectors "
                    "latch-secured and cooling hoses strain-relieved. Record the outcome."
                ),
                procedure_steps=[],
                measured_qty="Vibration test level [g or g²/Hz]; inspection result (Pass / Fail); any defects found",
                acceptance=(
                    "No structural damage, loose fasteners, connector failures or coolant leaks after vibration test. "
                    "Converter module vibration rating is suitable for road/mobile application."
                ),
                method="T / I",
            ),
            TestSheet(
                ts_id="TS-6-07",
                title="DC Leakage Current vs. e-PU10 Precharge Capacity",
                objective=(
                    "Verify that the DC leakage current of the charger is lower than the "
                    "e-PU10 battery precharge circuit capacity to prevent precharge failure."
                ),
                standard="e-PU10 restrictions (project plan); IEC 61557-8",
                equipment=(
                    "Calibrated insulation / leakage current meter (≤ 12 months calibration); "
                    "e-PU10 battery system precharge specification document"
                ),
                setup=(
                    "With the charger powered (AC connected, DC output open or at rated voltage), measure DC leakage "
                    "current from the DC+ and DC− buses to chassis ground. Obtain the e-PU10 precharge circuit maximum "
                    "current rating and compare the measured leakage against it."
                ),
                procedure_steps=[],
                measured_qty="DC leakage current I_leak_DC+ [mA]; I_leak_DC− [mA]",
                acceptance=(
                    "Both I_leak_DC+ and I_leak_DC− < e-PU10 precharge circuit current rating. "
                    "Specific limit to be confirmed from e-PU10 V2 development spec."
                ),
                method="T",
            ),
            TestSheet(
                ts_id="TS-6-08",
                title="Reliability / Uptime — 72-Hour Endurance Run",
                objective=(
                    "Verify that the charger achieves an operational uptime ≥ 98 % "
                    "during a representative endurance run."
                ),
                standard="Project specification (reliability > 98 % uptime); IEC 61439",
                equipment=(
                    "Automated test controller (to cycle load / charger commands); "
                    "event logger or data acquisition system; "
                    "AC power supply; DC electronic load"
                ),
                setup=(
                    "Connect the charger to rated AC supply and DC electronic load and run an automated cycle "
                    "(30 min full load → 5 min 50 % load, repeated) continuously for ≥ 72 hours, auto-logging every "
                    "fault (timestamp, code, downtime). Afterwards compute total downtime and "
                    "uptime % = (72×60 − Σ downtime)/(72×60) × 100 and review the log for recurring faults."
                ),
                procedure_steps=[],
                measured_qty="Total test duration [h]; total downtime [min]; uptime [%]",
                acceptance="Uptime ≥ 98 % over the 72-hour endurance run. No unrecoverable fault.",
                method="T",
            ),
        ],
    },
    # -----------------------------------------------------------------------
    # TRL 8 — Sales Readiness
    # -----------------------------------------------------------------------
    {
        "number": "8",
        "title": "Sales Readiness",
        "weeks": "Week 17–18",
        "effort": "8 h",
        "objective": (
            "Prepare and validate the commercial-facing documents (technical datasheet and "
            "sales one-pager) for the 400 A charger, ensuring all stated specifications are "
            "supported by verified test results from TRL 6."
        ),
        "entry_criteria": [
            "TRL 6 tollgate is signed off.",
            "All TRL 6 test sheets have been completed and signed.",
        ],
        "exit_criteria": [
            "Technical datasheet is reviewed and figures match test results.",
            "Sales one-pager is approved by project lead.",
            "Tollgate TRL 8 review is signed off.",
        ],
        "sheets": [
            TestSheet(
                ts_id="TS-8-01",
                title="Technical Datasheet Figure Verification",
                objective=(
                    "Verify that all performance figures stated in the technical datasheet "
                    "are consistent with the measured results from TRL 6 test sheets."
                ),
                standard="Internal document control; ISO 9001 (document accuracy)",
                equipment="Technical datasheet draft; TRL 6 test results (TS-6-01 through TS-6-08)",
                setup=(
                    "For each of the 7 key datasheet parameters — rated power, efficiency, DC voltage range, weight, "
                    "dimensions, cooling specs and communication protocol — compare the stated figure against the "
                    "corresponding TRL 6 result (≤ for max limits, ≥ for min limits, plus tolerance), mark "
                    "Consistent/Inconsistent and correct any inconsistency."
                ),
                procedure_steps=[],
                measured_qty="Number of parameters consistent with test results (count / 7)",
                acceptance="All 7 key parameters in the datasheet are consistent with measured TRL 6 results. No overstated figures.",
                method="I / A",
            ),
            TestSheet(
                ts_id="TS-8-02",
                title="Sales One-Pager Specification Sign-Off",
                objective=(
                    "Obtain formal approval of the sales one-pager document by the project "
                    "lead and at least one sales stakeholder."
                ),
                standard="Internal document approval process",
                equipment="Sales one-pager draft; sign-off sheet",
                setup=(
                    "Present the final one-pager to project lead (L. Rietkerk) and a sales representative, reviewing "
                    "accuracy of technical specs, clearly stated USPs and compliance claims supported by certificates. "
                    "Incorporate comments, obtain both signed approvals and file the document in the DMS."
                ),
                procedure_steps=[],
                measured_qty="Number of approvals obtained (count / 2)",
                acceptance="Both project lead and sales representative have signed the one-pager. All comments resolved.",
                method="I",
            ),
        ],
    },
    # -----------------------------------------------------------------------
    # TRL 9 — Product Release
    # -----------------------------------------------------------------------
    {
        "number": "9",
        "title": "Product Release",
        "weeks": "Week 19 – 02-11-2026",
        "effort": "8 h",
        "objective": (
            "Finalise all product documentation, verify series-readiness of the design, "
            "and formally transfer the 400 A charger product to the sales matrix."
        ),
        "entry_criteria": [
            "TRL 8 tollgate is signed off.",
            "All test sheets (TRL 2 through TRL 8) are complete and signed.",
            "CE documentation package is complete.",
        ],
        "exit_criteria": [
            "Documentation completeness check is passed.",
            "Series-ready verification is signed off.",
            "Product is entered in the sales matrix.",
            "Final tollgate TRL 9 is signed off (deadline: 02-11-2026).",
        ],
        "sheets": [
            TestSheet(
                ts_id="TS-9-01",
                title="Final Documentation Completeness Check",
                objective=(
                    "Verify that all required product documents are complete, approved, "
                    "version-controlled and archived."
                ),
                standard="IEC 61439; NEN 1010; CE marking directive; internal document management",
                equipment="Document management system; document checklist",
                setup=(
                    "Check the availability and approval status of the 11 required documents — signed final project "
                    "plan; this Measurement Plan (all sheets completed and signed); released electrical and mechanical "
                    "drawings; final BOM (part numbers and suppliers); software docs (architecture, register map, "
                    "version); CE Declaration of Conformity; IEC 61439 design verification record; NEN 1010 compliance "
                    "record; user manual; and assembly/build book. Mark each Complete/Incomplete/Missing and raise "
                    "non-conformances for gaps."
                ),
                procedure_steps=[],
                measured_qty="Number of documents Complete (count / 11)",
                acceptance="All 11 required documents are Complete, approved and version-controlled. Zero missing items.",
                method="I",
            ),
            TestSheet(
                ts_id="TS-9-02",
                title="Series-Ready Verification",
                objective=(
                    "Verify that the design is reproducible and manufacturable in series "
                    "production without further design changes."
                ),
                standard="Internal series-readiness criteria; IEC 61439",
                equipment="Series-readiness checklist; assembly instructions; BOM",
                setup=(
                    "Review the design package against the 5 series-readiness criteria: all BOM components "
                    "commercially available with lead time < 8 weeks; assembly achievable by a trained technician "
                    "from the build book alone; software flashable/configurable from the build book; no "
                    "prototype-specific workarounds remaining; and production quality-control steps defined. Record any open items."
                ),
                procedure_steps=[],
                measured_qty="Number of series-readiness criteria met (count / 5); number of open items",
                acceptance="All 5 criteria met. Zero open items. Design is cleared for series production.",
                method="I / A",
            ),
            TestSheet(
                ts_id="TS-9-03",
                title="Transfer to Sales Matrix Sign-Off",
                objective=(
                    "Formally transfer the validated 400 A charger product to the sales matrix "
                    "and confirm that all product information is correctly entered."
                ),
                standard="Internal sales and product management process",
                equipment="Sales matrix template; approved datasheet; pricing information",
                setup=(
                    "Enter the product in the sales matrix with all 7 fields — product name (400A AC/DC Charger for "
                    "e-PU10), rated power, DC voltage range, efficiency, communication protocol, compliance standards "
                    "(IEC 61439, NEN 1010, CE) and lead time/price indication — then obtain sign-off from project lead "
                    "(L. Rietkerk) and the sales representative and archive the signed transfer document."
                ),
                procedure_steps=[],
                measured_qty="Number of sales matrix fields completed (count / 7); number of signatures obtained (count / 2)",
                acceptance="All 7 sales matrix fields are completed. Both signatures obtained. Transfer document archived.",
                method="I",
            ),
        ],
    },
]


# ---------------------------------------------------------------------------
# Document generation
# ---------------------------------------------------------------------------

def _add_cover(doc):
    """Add cover/title page content."""
    doc.add_paragraph()
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = para.add_run("400A AC/DC Charger")
    run.bold = True
    run.font.size = Pt(36)

    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = para.add_run("Measurement Plan")
    run.bold = True
    run.font.size = Pt(28)

    doc.add_paragraph()
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = para.add_run("Requirements Verification Plan")
    run.font.size = Pt(16)

    doc.add_paragraph()
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = para.add_run("Based on: ProjectPlan_400A_Charger.docx")

    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = para.add_run("Version: 1.0")

    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = para.add_run(f"Date: {date.today().isoformat()}")

    doc.add_paragraph()
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = para.add_run("Project Lead: Lennard Rietkerk")

    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = para.add_run("Kickoff: 23-06-2026  |  Target: 02-11-2026")


def _add_introduction(doc):
    """Introduction section (mirrors the e-PU Cabinet V2 layout)."""
    doc.add_heading("Introduction", level=1)
    doc.add_paragraph(
        "This document is the Measurement Plan for the 400A AC/DC Charger project "
        "— an unidirectional, liquid-cooled AC/DC battery charger with galvanic isolation, "
        "designed for charging the main battery (600–800 VDC) of the e-PU10 BESS."
    )
    doc.add_paragraph(
        "Purpose: to make sure every requirement from the project plan is verified during "
        "the test phase, with nothing missed."
    )
    doc.add_paragraph(
        "This plan follows the standard verification approach (Verification Cross-Reference "
        "Matrix + test sheets). It is split into two easy-to-use parts:"
    )
    for item in [
        "Section 3 — Verification Cross-Reference Matrix: a short, at-a-glance list of every "
        "requirement with its method and status. Use it to see overall progress.",
        "Section 4 — Test Sheets: one small card per requirement with the exact test steps, "
        "pass criteria and equipment. Use it while performing each test.",
    ]:
        p = doc.add_paragraph(style="List Paragraph")
        p.add_run(item)

    doc.add_heading("How to use this plan", level=2)
    for step in [
        "Work through the Test Sheets (Section 4), one requirement at a time.",
        'For each sheet, follow "How to test", then write the measured value in "Result".',
        "Set Status to Pass or Fail based on the acceptance criterion.",
        "Copy the Pass/Fail result back into the matrix (Section 3) to track overall progress.",
        "Complete the Sign-off (Section 6) when all test sheets for a TRL phase are finished.",
    ]:
        p = doc.add_paragraph(style="List Paragraph")
        p.add_run(step)


def _add_legend(doc):
    """Legend section with verification methods and status values tables."""
    doc.add_heading("Legend", level=1)
    doc.add_heading("Verification Methods", level=2)
    tbl = doc.add_table(rows=1, cols=3)
    tbl.style = "Table Grid"
    hdr = tbl.rows[0]
    for i, h in enumerate(["Code", "Method", "What it means"]):
        hdr.cells[i].text = h
    _make_row_header(hdr)
    data = [
        ("T", "Test", "Physically operate and measure with instruments."),
        ("I", "Inspection", "Visual check, dimensional check, certificate review."),
        ("A", "Analysis", "Calculation, simulation, or engineering judgement."),
        ("D", "Demonstration", "Show it works under normal operation, without measuring."),
    ]
    for code, method, desc in data:
        row = tbl.add_row()
        row.cells[0].text = code
        row.cells[1].text = method
        row.cells[2].text = desc

    doc.add_heading("Status Values", level=2)
    tbl2 = doc.add_table(rows=1, cols=2)
    tbl2.style = "Table Grid"
    hdr2 = tbl2.rows[0]
    hdr2.cells[0].text = "Status"
    hdr2.cells[1].text = "Meaning"
    _make_row_header(hdr2)
    for status, meaning in [
        ("Not started", "Test not performed yet."),
        ("In progress", "Test currently being executed."),
        ("Pass", "Verified — acceptance criterion met."),
        ("Fail", "Acceptance criterion not met — corrective action required."),
    ]:
        row = tbl2.add_row()
        row.cells[0].text = status
        row.cells[1].text = meaning


def _add_vcrm(doc, trl_data):
    """Verification Cross-Reference Matrix — at-a-glance list of every requirement.

    Mirrors the e-PU Cabinet V2 matrix: ID | Requirement | Method | Test stage | Status.
    """
    doc.add_heading("Verification Cross-Reference Matrix", level=1)
    doc.add_paragraph(
        "At-a-glance list of every requirement. Full test details are in Section 4 "
        "(Test Sheets). Fill in the Status column as testing progresses."
    )
    tbl = doc.add_table(rows=1, cols=5)
    tbl.style = "Table Grid"
    hdr = tbl.rows[0]
    for i, h in enumerate(["ID", "Requirement", "Method", "Test stage", "Status"]):
        hdr.cells[i].text = h
    _make_row_header(hdr)

    for trl in trl_data:
        for sheet in trl["sheets"]:
            row = tbl.add_row()
            row.cells[0].text = sheet.ts_id
            row.cells[1].text = sheet.title
            row.cells[2].text = sheet.method
            row.cells[3].text = f"TRL {trl['number']}"
            row.cells[4].text = ""  # blank for filling in


def _add_test_sheet(doc, sheet: TestSheet, test_stage: str):
    """Render a single test sheet as a 2-column table (label | value).

    Uses the identical row structure as the e-PU Cabinet V2 test sheets:
    Requirement, Source, Verification method, How to test, Acceptance criterion,
    Equipment / tooling, Test stage, Result, Status.
    """
    tbl = doc.add_table(rows=0, cols=2)
    tbl.style = "Table Grid"
    # Set column widths roughly 30 / 70
    tbl.columns[0].width = Inches(2.1)
    tbl.columns[1].width = Inches(4.4)

    # Build the "How to test" cell from the setup + numbered procedure steps so
    # that no procedural detail is lost while keeping the e-PU row layout.
    how_to_test = sheet.setup.strip()
    if sheet.procedure_steps:
        steps = "\n".join(f"{i + 1}. {s}" for i, s in enumerate(sheet.procedure_steps))
        how_to_test = (how_to_test + "\n" if how_to_test else "") + steps

    acceptance = sheet.acceptance
    if sheet.measured_qty:
        acceptance = f"{acceptance}\nMeasured quantity: {sheet.measured_qty}"

    rows_data = [
        ("Requirement", sheet.objective),
        ("Source", sheet.standard),
        ("Verification method", sheet.method),
        ("How to test", how_to_test),
        ("Acceptance criterion (pass condition)", acceptance),
        ("Equipment / tooling", sheet.equipment),
        ("Test stage", test_stage),
        ("Result (fill in during testing)", ""),
        ("Status (Pass / Fail)", ""),
    ]

    for label, value in rows_data:
        row = tbl.add_row()
        row.cells[0].text = label
        row.cells[1].text = value
        # White background, bold label only (no cell shading) — matches the
        # e-PU Cabinet V2 test-sheet style.
        _bold_cell(row.cells[0])

    doc.add_paragraph()  # spacing between sheets


def _add_test_sheets(doc, trl_data):
    """Add the Test Sheets chapter: one TRL sub-section per phase (e-PU layout)."""
    doc.add_heading("Test Sheets", level=1)
    doc.add_paragraph(
        'One card per requirement. Follow "How to test", record the "Result", '
        "then mark Pass or Fail."
    )
    for trl in trl_data:
        doc.add_heading(f"TRL {trl['number']} — {trl['title']}", level=2)
        test_stage = f"TRL {trl['number']}"
        for sheet in trl["sheets"]:
            p = doc.add_paragraph()
            run = p.add_run(f"{sheet.ts_id}  —  {sheet.title}")
            run.bold = True
            _add_test_sheet(doc, sheet, test_stage)


def _add_test_phase_overview(doc):
    """Summary table of TRL phases and what is tested (e-PU Cabinet V2 layout)."""
    doc.add_heading("Test Phase Overview", level=1)
    doc.add_paragraph(
        "Testing follows the TRL (Technology Readiness Level) phases from the project plan. "
        "Each stage builds on the previous one and ends with a formal tollgate review."
    )
    tbl = doc.add_table(rows=1, cols=4)
    tbl.style = "Table Grid"
    hdr = tbl.rows[0]
    for i, h in enumerate(["Stage", "TRL", "What is tested", "Requirement IDs"]):
        hdr.cells[i].text = h
    _make_row_header(hdr)
    for i, trl in enumerate(TRL_DATA):
        row = tbl.add_row()
        row.cells[0].text = f"{i + 1} — {trl['title']}"
        row.cells[1].text = f"TRL {trl['number']}"
        row.cells[2].text = trl["objective"]
        row.cells[3].text = "; ".join(s.ts_id for s in trl["sheets"])


def _add_signoff(doc):
    """Sign-off table."""
    doc.add_heading("Sign-Off", level=1)
    doc.add_paragraph(
        "Complete this table when testing for a TRL phase or the full campaign is finished."
    )
    doc.add_paragraph(
        "Declaration: all requirements in this plan have been verified. "
        "Results are recorded in the Test Sheets above."
    )
    tbl = doc.add_table(rows=1, cols=4)
    tbl.style = "Table Grid"
    hdr = tbl.rows[0]
    for i, h in enumerate(["Role", "Name", "Signature", "Date"]):
        hdr.cells[i].text = h
    _make_row_header(hdr)
    for role in [
        "Tester / Test Engineer",
        "Test Lead / Project Lead",
        "Quality / Safety Engineer",
        "Approver",
    ]:
        row = tbl.add_row()
        row.cells[0].text = role
        for j in range(1, 4):
            row.cells[j].text = ""


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print(f"Opening template: {TEMPLATE_PATH}")
    doc = Document(TEMPLATE_PATH)

    # --- Clear all body content, keep sectPr ---
    from docx.oxml.ns import qn as _qn
    body = doc.element.body
    sect_pr = body.find(_qn("w:sectPr"))
    # Remove everything except sectPr
    to_remove = [child for child in list(body) if child.tag != _qn("w:sectPr")]
    for el in to_remove:
        body.remove(el)

    # --- Build new content (mirrors the e-PU Cabinet V2 chapter structure) ---
    _add_cover(doc)
    doc.add_page_break()

    _add_introduction(doc)
    doc.add_page_break()

    _add_legend(doc)
    doc.add_page_break()

    _add_vcrm(doc, TRL_DATA)
    doc.add_page_break()

    _add_test_sheets(doc, TRL_DATA)
    doc.add_page_break()

    _add_test_phase_overview(doc)
    doc.add_page_break()

    _add_signoff(doc)

    # --- Save ---
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    doc.save(OUTPUT_PATH)
    print(f"Saved: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
