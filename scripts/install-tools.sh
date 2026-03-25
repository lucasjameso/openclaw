#!/bin/bash
# Install document processing tools inside the OpenClaw container
# This runs inside the container as root

set -e

echo "=== Installing document processing tools ==="

apt-get update -qq

# PDF text extraction (poppler-utils gives pdftotext, pdfinfo, pdfimages)
apt-get install -y -qq poppler-utils

# OCR engine + English language data
apt-get install -y -qq tesseract-ocr tesseract-ocr-eng

# Image processing (needed for OCR preprocessing)
apt-get install -y -qq imagemagick ghostscript

# Document conversion (Word, ePub, HTML, markdown, etc.)
apt-get install -y -qq pandoc

# PDF rendering from HTML
apt-get install -y -qq wkhtmltopdf

# Additional image tools
apt-get install -y -qq libimage-exiftool-perl

# Clean up apt cache to save space
apt-get clean && rm -rf /var/lib/apt/lists/*

# Node packages for data processing
npm install -g xlsx 2>/dev/null

echo ""
echo "=== Installed tools ==="
echo "pdftotext: $(which pdftotext)"
echo "pdfinfo:   $(which pdfinfo)"
echo "pdfimages: $(which pdfimages)"
echo "tesseract: $(which tesseract)"
echo "convert:   $(which convert)"
echo "pandoc:    $(which pandoc)"
echo "gs:        $(which gs)"
echo "exiftool:  $(which exiftool)"
echo ""
echo "=== Done ==="
