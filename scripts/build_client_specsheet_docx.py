"""
build_client_specsheet_docx.py
==============================
Converts Documents/400A_Charging_System_Client_Specsheet.md into a client-facing
Word (.docx) document that inherits styles, header/footer, and page setup from a
project-plan template document.

Usage (from the repository root):
    python scripts/build_client_specsheet_docx.py

Output:
    ACDC charger/400A Charging System Client Specsheet.docx

Requirements:
    pip install python-docx
"""

from __future__ import annotations

import re
from pathlib import Path

from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import RGBColor

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
REPO_ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = REPO_ROOT / "ACDC charger" / "ProjectPlan_400A_Charger.docx"
SOURCE_MD = REPO_ROOT / "Documents" / "400A_Charging_System_Client_Specsheet.md"
OUTPUT = REPO_ROOT / "ACDC charger" / "400A Charging System Client Specsheet.docx"
FORBIDDEN_TERMS = ("UR100040", "UUGreenPower")


# ---------------------------------------------------------------------------
# Helper: clear body content while keeping section properties (page/margin
# setup, header/footer links)
# ---------------------------------------------------------------------------
def _clear_body(doc: Document) -> None:
    """Remove all paragraphs and tables from the body, preserving sectPr."""
    body = doc.element.body
    to_remove = [child for child in body if child.tag != qn("w:sectPr")]
    for child in to_remove:
        body.remove(child)


# ---------------------------------------------------------------------------
# Helper: add a paragraph with optional bold/italic and inline markdown marks
# ---------------------------------------------------------------------------
def _add_para(doc: Document, text: str, style: str = "Normal", bold: bool = False, italic: bool = False) -> None:
    p = doc.add_paragraph(style=style)
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
    p = doc.add_paragraph(style="List Paragraph")
    p_pr = p._p.get_or_add_pPr()
    num_pr = OxmlElement("w:numPr")
    ilvl = OxmlElement("w:ilvl")
    ilvl.set(qn("w:val"), "0")
    num_id = OxmlElement("w:numId")
    num_id.set(qn("w:val"), "1")
    num_pr.append(ilvl)
    num_pr.append(num_id)
    p_pr.append(num_pr)
    p.add_run(text)


# ---------------------------------------------------------------------------
# Helper: add a horizontal rule (paragraph with bottom border)
# ---------------------------------------------------------------------------
def _add_hr(doc: Document) -> None:
    p = doc.add_paragraph(style="Normal")
    p_pr = p._p.get_or_add_pPr()
    p_bdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "6")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), "4472C4")
    p_bdr.append(bottom)
    p_pr.append(p_bdr)


# ---------------------------------------------------------------------------
# Helper: add a table from headers + rows
# ---------------------------------------------------------------------------
def _add_table(doc: Document, headers: list[str], rows: list[list[str]]) -> None:
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = "Table Grid"

    hdr_cells = table.rows[0].cells
    for idx, header in enumerate(headers):
        p = hdr_cells[idx].paragraphs[0]
        p.clear()
        p.add_run(header).bold = True

    for cell in hdr_cells:
        tc = cell._tc
        tc_pr = tc.get_or_add_tcPr()
        shd = OxmlElement("w:shd")
        shd.set(qn("w:val"), "clear")
        shd.set(qn("w:color"), "auto")
        shd.set(qn("w:fill"), "4472C4")
        tc_pr.append(shd)
        for para in cell.paragraphs:
            for run in para.runs:
                run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
                run.bold = True

    for r_idx, row in enumerate(rows):
        row_cells = table.rows[r_idx + 1].cells
        for c_idx, value in enumerate(row):
            row_cells[c_idx].text = value

    doc.add_paragraph(style="Normal")


# ---------------------------------------------------------------------------
# Markdown parsing
# ---------------------------------------------------------------------------
def _split_markdown_cells(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def _parse_sections(md_text: str) -> tuple[list[dict], str]:
    lines = md_text.splitlines()
    sections: list[dict] = []
    disclaimer_lines: list[str] = []
    current: dict | None = None

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        heading_match = re.match(r"^###\s+\d+\.\s+(.+)$", line)
        if heading_match:
            if current:
                sections.append(current)
            current = {"title": heading_match.group(1).strip(), "paragraphs": [], "table": None}
            i += 1
            continue

        if line.startswith("*All values"):
            disclaimer_lines = [line]
            i += 1
            while i < len(lines) and lines[i].strip():
                disclaimer_lines.append(lines[i].strip())
                i += 1
            break

        if current is None or line == "---" or not line:
            i += 1
            continue

        if line.startswith("|"):
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].strip())
                i += 1

            if len(table_lines) >= 2:
                headers = _split_markdown_cells(table_lines[0])
                row_lines = [ln for ln in table_lines[2:] if ln.strip()]
                rows = [_split_markdown_cells(ln) for ln in row_lines]
                current["table"] = {"headers": headers, "rows": rows}
            continue

        current["paragraphs"].append(line)
        i += 1

    if current:
        sections.append(current)

    disclaimer = " ".join(disclaimer_lines).strip()
    if disclaimer.startswith("*") and disclaimer.endswith("*"):
        disclaimer = disclaimer[1:-1].strip()

    return sections, disclaimer


# ---------------------------------------------------------------------------
# Validation helpers
# ---------------------------------------------------------------------------
def _iter_document_text(doc: Document):
    for paragraph in doc.paragraphs:
        if paragraph.text:
            yield paragraph.text
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                if cell.text:
                    yield cell.text


def _verify_no_forbidden_terms(docx_path: Path) -> None:
    doc = Document(str(docx_path))
    text_blob = "\n".join(_iter_document_text(doc)).lower()
    leaked = [term for term in FORBIDDEN_TERMS if term.lower() in text_blob]
    if leaked:
        raise ValueError(
            f"Forbidden internal terms found in generated document: {', '.join(leaked)}"
        )


# ---------------------------------------------------------------------------
# Build the document
# ---------------------------------------------------------------------------
def build(template_path: Path, source_md: Path, output_path: Path) -> None:
    md_text = source_md.read_text(encoding="utf-8")
    sections, disclaimer = _parse_sections(md_text)

    doc = Document(str(template_path))
    _clear_body(doc)

    # Title block
    _add_para(doc, "400 A Liquid-Cooled DC Charging System — Technical Specification Sheet", style="Normal", bold=True)
    _add_para(doc, "Client-Facing Integrated Product Specification", style="Normal")
    doc.add_paragraph(style="Normal")
    _add_para(doc, "Version: 1.0", style="Normal")
    _add_para(doc, "Date: 2026-07-16", style="Normal")
    _add_hr(doc)
    doc.add_paragraph(style="Normal")

    expected_headings = [
        "System Overview",
        "AC Input",
        "DC Output",
        "Performance & Efficiency",
        "Cooling System",
        "Control & Communication",
        "Environmental & Mechanical",
        "Compliance & Safety",
    ]

    by_title = {section["title"]: section for section in sections}
    for heading in expected_headings:
        section = by_title.get(heading)
        if section is None:
            raise ValueError(f"Missing required section in markdown: {heading}")

        doc.add_heading(heading, level=1)

        for paragraph in section["paragraphs"]:
            _add_para(doc, paragraph, style="Normal")

        table = section["table"]
        if table:
            _add_table(doc, table["headers"], table["rows"])
        else:
            doc.add_paragraph(style="Normal")

    if disclaimer:
        _add_para(doc, disclaimer, style="Normal", italic=True)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(output_path))

    _verify_no_forbidden_terms(output_path)


if __name__ == "__main__":
    build(TEMPLATE, SOURCE_MD, OUTPUT)
