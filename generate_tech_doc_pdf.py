"""
Generate PDF documentation from Markdown
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    Table,
    TableStyle,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.lib import colors
import re


def create_pdf():
    # Read markdown file
    with open("TECHNOLOGY_STACK_DOCUMENTATION.md", "r", encoding="utf-8") as f:
        content = f.read()

    # Create PDF
    pdf_filename = "MentorAid_Technology_Stack_Documentation.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=A4,
        rightMargin=0.75 * inch,
        leftMargin=0.75 * inch,
        topMargin=1 * inch,
        bottomMargin=1 * inch,
    )

    # Container for the 'Flowable' objects
    elements = []

    # Define styles
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "CustomTitle",
        parent=styles["Heading1"],
        fontSize=24,
        textColor=colors.HexColor("#1e3a8a"),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName="Helvetica-Bold",
    )

    h1_style = ParagraphStyle(
        "CustomH1",
        parent=styles["Heading1"],
        fontSize=16,
        textColor=colors.HexColor("#1e40af"),
        spaceAfter=12,
        spaceBefore=12,
        fontName="Helvetica-Bold",
    )

    h2_style = ParagraphStyle(
        "CustomH2",
        parent=styles["Heading2"],
        fontSize=14,
        textColor=colors.HexColor("#2563eb"),
        spaceAfter=10,
        spaceBefore=10,
        fontName="Helvetica-Bold",
    )

    h3_style = ParagraphStyle(
        "CustomH3",
        parent=styles["Heading3"],
        fontSize=12,
        textColor=colors.HexColor("#3b82f6"),
        spaceAfter=8,
        spaceBefore=8,
        fontName="Helvetica-Bold",
    )

    normal_style = ParagraphStyle(
        "CustomNormal",
        parent=styles["Normal"],
        fontSize=10,
        spaceAfter=6,
        alignment=TA_JUSTIFY,
    )

    code_style = ParagraphStyle(
        "Code",
        parent=styles["Normal"],
        fontSize=9,
        fontName="Courier",
        textColor=colors.HexColor("#1e293b"),
        backColor=colors.HexColor("#f1f5f9"),
        leftIndent=20,
        spaceAfter=6,
    )

    bullet_style = ParagraphStyle(
        "Bullet", parent=styles["Normal"], fontSize=10, leftIndent=20, spaceAfter=4
    )

    # Split content into lines
    lines = content.split("\n")

    in_code_block = False
    code_buffer = []

    for line in lines:
        # Skip empty lines in some cases
        if not line.strip():
            if not in_code_block:
                elements.append(Spacer(1, 0.1 * inch))
            continue

        # Handle code blocks
        if line.strip().startswith("```"):
            if in_code_block:
                # End code block
                code_text = "<br/>".join(code_buffer)
                elements.append(Paragraph(code_text, code_style))
                code_buffer = []
                in_code_block = False
            else:
                # Start code block
                in_code_block = True
            continue

        if in_code_block:
            # Escape special characters
            escaped_line = (
                line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            )
            code_buffer.append(escaped_line)
            continue

        # Title (first # heading)
        if line.startswith("# ") and "MentorAid" in line:
            text = line[2:].strip()
            elements.append(Paragraph(text, title_style))
            elements.append(Spacer(1, 0.3 * inch))
            continue

        # H2 headings (##)
        if line.startswith("## "):
            text = line[3:].strip()
            elements.append(PageBreak())
            elements.append(Paragraph(text, h1_style))
            continue

        # H3 headings (###)
        if line.startswith("### "):
            text = line[4:].strip()
            elements.append(Paragraph(text, h2_style))
            continue

        # H4 headings (####)
        if line.startswith("#### "):
            text = line[5:].strip()
            elements.append(Paragraph(text, h3_style))
            continue

        # Horizontal rules
        if line.strip() == "---":
            elements.append(Spacer(1, 0.2 * inch))
            continue

        # Bullet points
        if line.strip().startswith("- ") or line.strip().startswith("* "):
            text = line.strip()[2:]
            # Handle bold
            text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
            text = re.sub(
                r"`(.+?)`", r'<font face="Courier" color="#1e293b">\1</font>', text
            )
            elements.append(Paragraph(f"• {text}", bullet_style))
            continue

        # Numbered lists
        if re.match(r"^\d+\. ", line.strip()):
            text = re.sub(r"^\d+\. ", "", line.strip())
            text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
            text = re.sub(
                r"`(.+?)`", r'<font face="Courier" color="#1e293b">\1</font>', text
            )
            elements.append(Paragraph(text, bullet_style))
            continue

        # Normal paragraphs
        text = line.strip()
        # Handle bold
        text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
        # Handle inline code
        text = re.sub(
            r"`(.+?)`", r'<font face="Courier" color="#1e293b">\1</font>', text
        )
        # Handle links
        text = re.sub(r"\[(.+?)\]\((.+?)\)", r'<a href="\2" color="blue">\1</a>', text)

        if text:
            elements.append(Paragraph(text, normal_style))

    # Build PDF
    doc.build(elements)
    print(f"\n✅ PDF generated successfully: {pdf_filename}")


if __name__ == "__main__":
    create_pdf()
