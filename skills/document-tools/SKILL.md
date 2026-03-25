---
name: document-tools
description: Read, convert, and OCR any document -- PDF, Word, ePub, images
user-invocable: true
---

# Document Processing Tools

You have these tools installed for working with documents. Use them directly via shell commands.

## PDF Operations

**Extract text from a PDF:**
```bash
pdftotext input.pdf output.txt
```

**Extract text preserving layout:**
```bash
pdftotext -layout input.pdf output.txt
```

**Get PDF metadata (page count, dimensions, etc.):**
```bash
pdfinfo input.pdf
```

**Extract images from a PDF:**
```bash
pdfimages -png input.pdf output_prefix
```

## OCR (Optical Character Recognition)

**OCR an image to text:**
```bash
tesseract image.png output_text
```

**OCR with specific language:**
```bash
tesseract image.png output_text -l eng
```

**OCR a PDF (convert pages to images first, then OCR):**
```bash
# Convert PDF pages to images
convert -density 300 input.pdf -quality 100 page-%03d.png
# OCR each page
for f in page-*.png; do tesseract "$f" "${f%.png}" -l eng; done
# Combine results
cat page-*.txt > full_text.txt
```

## Document Conversion

**Convert between formats (Word, ePub, HTML, Markdown, etc.):**
```bash
pandoc input.docx -t markdown -o output.md
pandoc input.epub -t markdown -o output.md
pandoc input.html -t markdown -o output.md
pandoc input.md -t html -o output.html
```

**ePub to plain text:**
```bash
pandoc input.epub -t plain -o output.txt
```

## Image Processing

**Resize an image:**
```bash
convert input.png -resize 800x800 output.png
```

**Crop an image:**
```bash
convert input.png -crop WIDTHxHEIGHT+X+Y output.png
```

**Convert image format:**
```bash
convert input.png output.jpg
```

**Get image metadata:**
```bash
exiftool image.png
```

## Important Notes

- These tools are installed inside the container. If the container restarts, run:
  `bash /workspace/scripts/install-tools.sh` as root to reinstall them.
- For large PDFs, process page by page to avoid memory issues.
- ImageMagick policy may block PDF conversion -- if so, the policy file is at
  /etc/ImageMagick-6/policy.xml and needs the PDF line commented out.
