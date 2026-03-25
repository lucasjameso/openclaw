---
name: document-builder
description: Convert markdown drafts to professional PDF, XLSX, and HTML products
---

# Document Builder Skill

You convert markdown drafts into customer-ready final products.

## Available Tools

All of these are installed in your container:

- `pandoc` -- markdown to PDF, HTML, DOCX
- `wkhtmltopdf` -- HTML to PDF with CSS styling
- `imagemagick` (convert) -- image manipulation, cropping, resizing
- `pdftotext` / `pdftoppm` -- PDF text extraction and image conversion
- `tesseract` -- OCR for image-based PDFs
- Node `xlsx` module -- create Excel spreadsheets
- Python `openpyxl` -- create/read Excel spreadsheets

If tools are missing after a container restart, run:
```bash
bash /workspace/scripts/install-tools.sh
```
(Requires root -- use the escalation process if you cannot run as root.)

## Markdown to Styled PDF

Use pandoc with a custom HTML template for brand consistency:

```bash
pandoc input.md -o output.pdf \
  --pdf-engine=wkhtmltopdf \
  --css=/workspace/styles/bwl-brand.css \
  --metadata title="Document Title"
```

## Markdown to Styled HTML

```bash
pandoc input.md -o output.html --standalone \
  --css=/workspace/styles/bwl-brand.css \
  --metadata title="Document Title"
```

## Excel Spreadsheet Creation

Use Python with openpyxl for formatted spreadsheets:

```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

wb = Workbook()
ws = wb.active
ws.title = "72-Hour Mirror"

# Brand colors
navy = PatternFill(start_color="1B3A52", fill_type="solid")
cream = PatternFill(start_color="FAF8F5", fill_type="solid")
orange = Font(color="D85A30", bold=True)

wb.save("/workspace/products/72-hour-mirror-toolkit.xlsx")
```

## Brand Standards

- Navy #1B3A52
- Cream #FAF8F5
- Orange accent #D85A30
- Font: Open Sans or clean sans-serif
- Headers must be visually distinct from body
- No wall of undifferentiated text at any price point

## Quality Check Before Submission

1. Open the final file -- does it look professional?
2. Is the typography hierarchy visible and consistent?
3. Would someone pay the listed price and feel they got more?
4. Self-score 0-10 and state what needs improvement
