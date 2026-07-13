"""
build_trl_docx.py
=================
Converts Documents/TRL_Phases_Explained.md into a Word (.docx) document that
inherits the styles, header/footer, and page setup from the existing
"e-PU Cabinet V2 Measurement Plan.docx" template.

Usage (from the repository root):
    python scripts/build_trl_docx.py

Output:
    e-PU Cabinet V2/TRL Phases Explained.docx

Requirements:
    pip install python-docx
"""

from __future__ import annotations

import copy
import re
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt, RGBColor

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
REPO_ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = REPO_ROOT / "e-PU Cabinet V2" / "e-PU Cabinet V2 Measurement Plan.docx"
SOURCE_MD = REPO_ROOT / "Documents" / "TRL_Phases_Explained.md"
OUTPUT = REPO_ROOT / "e-PU Cabinet V2" / "TRL Phases Explained.docx"


# ---------------------------------------------------------------------------
# Helper: clear body content while keeping section properties (page/margin
# setup, header/footer links)
# ---------------------------------------------------------------------------
def _clear_body(doc: Document) -> None:
    """Remove all paragraphs and tables from the body, preserving sectPr."""
    body = doc.element.body
    # Collect children to remove (everything except w:sectPr)
    to_remove = [
        child for child in body
        if child.tag != qn("w:sectPr")
    ]
    for child in to_remove:
        body.remove(child)


# ---------------------------------------------------------------------------
# Helper: add a paragraph with optional bold runs
# Supports inline **bold** markup in text.
# ---------------------------------------------------------------------------
def _add_para(doc: Document, text: str, style: str = "Normal",
               bold: bool = False, italic: bool = False) -> None:
    """Add a paragraph, supporting **bold** and *italic* inline markup."""
    p = doc.add_paragraph(style=style)

    # Split on **bold** and *italic* markers
    parts = re.split(r"(\*\*[^*]+\*\*|\*[^*]+\*)", text)
    for part in parts:
        if part.startswith("**") and part.endswith("**"):
            run = p.add_run(part[2:-2])
            run.bold = True
        elif part.startswith("*") and part.endswith("*"):
            run = p.add_run(part[1:-1])
            run.italic = True
        else:
            run = p.add_run(part)
            if bold:
                run.bold = True
            if italic:
                run.italic = True


# ---------------------------------------------------------------------------
# Helper: add a bullet list item
# ---------------------------------------------------------------------------
def _add_bullet(doc: Document, text: str) -> None:
    """Add a bullet-list paragraph (List Paragraph style with bullet numPr)."""
    p = doc.add_paragraph(style="List Paragraph")
    # Apply list bullet numbering via direct XML (word needs numId / ilvl)
    pPr = p._p.get_or_add_pPr()
    numPr = OxmlElement("w:numPr")
    ilvl = OxmlElement("w:ilvl")
    ilvl.set(qn("w:val"), "0")
    numId = OxmlElement("w:numId")
    numId.set(qn("w:val"), "1")  # numId 1 = first list definition in template
    numPr.append(ilvl)
    numPr.append(numId)
    pPr.append(numPr)

    # Parse inline bold/italic
    parts = re.split(r"(\*\*[^*]+\*\*|\*[^*]+\*)", text)
    for part in parts:
        if part.startswith("**") and part.endswith("**"):
            run = p.add_run(part[2:-2])
            run.bold = True
        elif part.startswith("*") and part.endswith("*"):
            run = p.add_run(part[1:-1])
            run.italic = True
        else:
            p.add_run(part)


# ---------------------------------------------------------------------------
# Helper: add a horizontal rule (paragraph with bottom border)
# ---------------------------------------------------------------------------
def _add_hr(doc: Document) -> None:
    p = doc.add_paragraph(style="Normal")
    pPr = p._p.get_or_add_pPr()
    pBdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "6")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), "4472C4")
    pBdr.append(bottom)
    pPr.append(pBdr)


# ---------------------------------------------------------------------------
# Helper: add a table from a list of rows (list of list of strings)
# ---------------------------------------------------------------------------
def _add_table(doc: Document, headers: list[str], rows: list[list[str]]) -> None:
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = "Table Grid"

    # Header row – bold
    hdr_cells = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr_cells[i].text = h
        for run in hdr_cells[i].paragraphs[0].runs:
            run.bold = True
        # Bold via direct run if text was set without runs
        if not hdr_cells[i].paragraphs[0].runs:
            hdr_cells[i].paragraphs[0].runs  # trigger
        p = hdr_cells[i].paragraphs[0]
        if p.runs:
            p.runs[0].bold = True
        else:
            run = p.add_run(h)
            run.bold = True
            # Remove the text set earlier
            p.clear()
            p.add_run(h).bold = True

    # Header row shading (blue, matching template heading color)
    for cell in hdr_cells:
        tc = cell._tc
        tcPr = tc.get_or_add_tcPr()
        shd = OxmlElement("w:shd")
        shd.set(qn("w:val"), "clear")
        shd.set(qn("w:color"), "auto")
        shd.set(qn("w:fill"), "4472C4")
        tcPr.append(shd)
        for para in cell.paragraphs:
            for run in para.runs:
                run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
                run.bold = True

    # Data rows
    for r_idx, row_data in enumerate(rows):
        row_cells = table.rows[r_idx + 1].cells
        for c_idx, val in enumerate(row_data):
            row_cells[c_idx].text = val

    doc.add_paragraph(style="Normal")  # spacing after table


# ---------------------------------------------------------------------------
# Build the document
# ---------------------------------------------------------------------------
def build(template_path: Path, source_md: Path, output_path: Path) -> None:
    doc = Document(str(template_path))
    _clear_body(doc)

    # ---- Title block -------------------------------------------------------
    _add_para(doc, "e-PU Cabinet V2", style="Normal")
    _add_para(doc, "TRL Phases Explained", style="Normal")
    doc.add_paragraph(style="Normal")
    _add_para(doc, "Technology Readiness Levels — General Reference Guide", style="Normal")
    doc.add_paragraph(style="Normal")
    _add_para(doc, "Version: 1.0", style="Normal")
    _add_para(doc, "Date: 2026-07-13", style="Normal")
    doc.add_paragraph(style="Normal")

    # ---- Introduction (Heading 1) ------------------------------------------
    doc.add_heading("Introduction", level=1)
    _add_para(doc,
        "This document explains what each Technology Readiness Level (TRL) phase means in "
        "general: what the goal of the phase is, what should typically be done in it, and what "
        "is normally used to prove you have reached it. It is written as a general reference so "
        "it can be applied to any of the hardware/engineering projects in this repository "
        "(e.g. the 400 A Charger, the e-PU Cabinet V2 BESS, etc.).",
        style="Normal")
    doc.add_paragraph(style="Normal")
    _add_para(doc,
        "What is TRL?  TRL is a 1–9 scale, originally developed by NASA and later adopted by "
        "the European Union (Horizon 2020 / Horizon Europe) and industry worldwide, to measure "
        "how mature a technology is — from a first idea (TRL 1) to a fully proven, commercially "
        "deployed product (TRL 9). Each step up means more evidence, more integration, and a "
        "more realistic environment.",
        style="Normal")
    doc.add_paragraph(style="Normal")

    # ---- Quick Overview (Heading 1) ----------------------------------------
    doc.add_heading("Quick Overview", level=1)

    _add_table(doc,
        headers=["TRL", "Name", "Core question answered", "Environment"],
        rows=[
            ["1", "Basic principles observed",
             '"Is this physically possible?"', "Pure research / paper"],
            ["2", "Technology concept formulated",
             '"What could we build with it?"', "Concept / paper"],
            ["3", "Experimental proof of concept",
             '"Does the key idea actually work?"', "Lab (analytical / small test)"],
            ["4", "Technology validated in lab",
             '"Do the parts work together?"', "Lab (breadboard)"],
            ["5", "Technology validated in relevant environment",
             '"Does it work in realistic conditions?"', "Simulated / relevant environment"],
            ["6", "Technology demonstrated in relevant environment",
             '"Does a full prototype work?"', "Relevant environment"],
            ["7", "System prototype in operational environment",
             '"Does it work in the real setting?"', "Operational environment"],
            ["8", "System complete and qualified",
             '"Is it finished, tested and certified?"', "Operational (final form)"],
            ["9", "Actual system proven in operations",
             '"Is it in real use and reliable?"', "Live operation / production"],
        ]
    )

    _add_para(doc, "A useful mental split:", style="Normal")
    _add_bullet(doc, "TRL 1–3 → Research (prove the idea).")
    _add_bullet(doc, "TRL 4–6 → Development (build and validate prototypes).")
    _add_bullet(doc, "TRL 7–9 → Deployment (qualify, release, operate).")
    doc.add_paragraph(style="Normal")

    # ---- Per-TRL sections --------------------------------------------------
    trl_sections = [
        (
            "TRL 1 — Basic Principles Observed",
            "Establish that the underlying scientific/engineering principle exists.",
            [
                "Literature review and study of existing research.",
                "Observation and reporting of basic physical, electrical, or chemical principles.",
                "Theoretical work; no application is defined yet.",
            ],
            "Research notes, a short report, references to papers or standards.",
            None,
        ),
        (
            "TRL 2 — Technology Concept Formulated",
            "Turn the principle into a possible practical application (still speculative, no proof yet).",
            [
                "Define the concept and its intended use.",
                "Formulate the project scope, key results, and technical specification (must-have / nice-to-have).",
                "Initial risk analysis and scope-change analysis.",
                "Market / component research: which suppliers, devices, prices, and documentation quality exist.",
            ],
            "A project/scope document, a specification list, a market study.",
            "In this repo, TRL 2 is where scope, requirements and supplier/component market research "
            "are done (see the charger project scope and the module market study).",
        ),
        (
            "TRL 3 — Experimental Proof of Concept",
            "Prove that the critical function of the idea actually works, analytically or with a small test.",
            [
                "Analytical studies and/or small-scale lab experiments on the key risky element.",
                "Conceptual design: which components are required and how they satisfy the scope.",
                "First engineering artefacts: single-line electrical diagram, mechanical concept description.",
                "Material cost estimate and rough engineering/planning estimate based on the concept.",
            ],
            "Proof-of-concept results, conceptual design, single-line diagram, cost/planning estimate. "
            "Ends with a tollgate review.",
            None,
        ),
        (
            "TRL 4 — Technology Validated in the Laboratory",
            "Show that the basic components work together (integration) in a controlled lab setting.",
            [
                "Build and test a simple prototype (\"breadboard\") integrating the key components.",
                "Detailed design work begins (mechanical, electrical, software).",
                "Lab measurements to confirm the parts behave as expected when combined.",
            ],
            "Breadboard test results, detailed design drawings/schematics, lab measurement reports.",
            None,
        ),
        (
            "TRL 5 — Technology Validated in a Relevant Environment",
            "Increase fidelity — test the integrated technology in conditions that resemble real use.",
            [
                "Test the prototype/subsystem in a simulated or relevant environment (e.g. realistic load, "
                "temperature, vibration, EMC conditions rather than an ideal bench).",
                "More complete integration than TRL 4.",
                "Complete detailed engineering: galvanic isolation, EMC, inrush, cooling, envelope, weight.",
                "CE / compliance documentation, build book and assembly instructions.",
            ],
            "Validation results in a relevant environment, complete detailed design package, draft CE "
            "documentation. (In this repo TRL 4 and 5 are handled together as \"detailed design\".) "
            "Ends with a tollgate review.",
            None,
        ),
        (
            "TRL 6 — Technology Demonstrated in a Relevant Environment",
            "Demonstrate a full system/subsystem prototype in a relevant environment.",
            [
                "Build the prototype (proto build).",
                "Functional testing and performance validation against the must-have criteria.",
                "Verify key behaviours (e.g. EMC, inrush current, thermal behaviour, ingress protection).",
            ],
            "Working prototype, functional test report, performance validation against requirements "
            "(this is what a measurement / verification plan checks off). Ends with a tollgate review.",
            None,
        ),
        (
            "TRL 7 — System Prototype Demonstration in an Operational Environment",
            "Demonstrate a near-final prototype in the actual operational environment.",
            [
                "Field trials / pilot installation in the real operating setting (e.g. installed on site, "
                "connected to the real grid or microgrid).",
                "Full-scale operational testing under real-world conditions.",
            ],
            "Field/pilot test results, operational demonstration report.",
            "The projects in this repo often go directly from TRL 6 (prototype test) to TRL 8 "
            "(sales readiness). TRL 7 is where a real on-site operational pilot would sit if performed.",
        ),
        (
            "TRL 8 — Actual System Completed and Qualified",
            "The technology is in its final form, fully tested, qualified and certified.",
            [
                "Final product and process qualification.",
                "Certification / compliance sign-off (e.g. CE marking).",
                "Full integration; pre-commercial preparation.",
                "Commercial preparation: sales one-pager, technical datasheet.",
            ],
            "Qualification/certification records, datasheet, sales one-pager. Ends with a tollgate review.",
            None,
        ),
        (
            "TRL 9 — Actual System Proven Through Successful Operations",
            "The technology is in real, routine operational use and proven reliable.",
            [
                "Finalize and update all documentation.",
                "Make the product series-ready (production-ready).",
                "Transfer the product to the sales matrix / into production.",
                "Ongoing monitoring and maintenance.",
            ],
            "Released, series-ready product; final documentation; product in the sales catalogue. "
            "Ends with a final acceptance tollgate review.",
            None,
        ),
    ]

    for title, goal, what_done, output_evidence, note in trl_sections:
        doc.add_heading(title, level=1)
        doc.add_heading("Goal", level=2)
        _add_para(doc, goal, style="Normal")
        doc.add_heading("What is normally done", level=2)
        for item in what_done:
            _add_bullet(doc, item)
        doc.add_heading("Typical output / evidence", level=2)
        _add_para(doc, output_evidence, style="Normal")
        if note:
            doc.add_paragraph(style="Normal")
            _add_para(doc, f"Note: {note}", style="Normal")
        doc.add_paragraph(style="Normal")

    # ---- Mapping to this repo (Heading 1) ----------------------------------
    doc.add_heading("How This Maps to the Projects in This Repo", level=1)
    _add_para(doc,
        "The engineering projects here use a slightly condensed TRL flow with tollgate reviews "
        "between phases:",
        style="Normal")
    _add_bullet(doc, "TRL 2 – Scope & market research (scope, spec, risk analysis, component market study).")
    _add_bullet(doc, "TRL 3 – Conceptual design (component selection, single-line diagram, mechanical concept, cost/planning).")
    _add_bullet(doc, "TRL 4/5 – Detailed design (mechanical, electrical, software, CE documentation, build book).")
    _add_bullet(doc, "TRL 6 – Prototype build & test (proto build, functional/performance/EMC/thermal validation).")
    _add_bullet(doc, "TRL 8 – Sales readiness (one-pager, technical datasheet).")
    _add_bullet(doc, "TRL 9 – Product release (finalize docs, make series-ready, transfer to sales matrix).")
    doc.add_paragraph(style="Normal")
    _add_para(doc,
        "(TRL 1 and TRL 7 are usually not called out explicitly: TRL 1 is prior research, and the "
        "on-site operational pilot of TRL 7 is effectively folded into the prototype test and "
        "product release steps.)",
        style="Normal")
    doc.add_paragraph(style="Normal")

    # ---- References (Heading 1) --------------------------------------------
    doc.add_heading("References", level=1)
    _add_bullet(doc,
        "NASA Technology Readiness Level definitions — "
        "https://www.nasa.gov/directorates/heo/scan/engineering/technology/technology_readiness_level")
    _add_bullet(doc,
        "European Commission / Horizon 2020 TRL definitions (Annex G) — "
        "https://ec.europa.eu/research/participants/data/ref/h2020/wp/2014_2015/annexes/"
        "h2020-wp1415-annex-g-trl_en.pdf")

    # ---- Save --------------------------------------------------------------
    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(output_path))
    print(f"Saved: {output_path}")


if __name__ == "__main__":
    build(TEMPLATE, SOURCE_MD, OUTPUT)
