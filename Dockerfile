FROM ghcr.io/openclaw/openclaw:latest

USER root

# Install system tools
RUN apt-get update -qq && \
    apt-get install -y -qq \
    pandoc \
    wkhtmltopdf \
    imagemagick \
    tesseract-ocr \
    poppler-utils \
    python3-pip \
    fonts-liberation \
    fonts-noto \
    librsvg2-bin \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
RUN python3 -m pip install --break-system-packages \
    openpyxl \
    cairosvg \
    Pillow \
    requests \
    beautifulsoup4 \
    gspread \
    oauth2client

# Ensure wkhtmltoimage is available (comes with wkhtmltopdf)
RUN which wkhtmltoimage || echo "wkhtmltoimage not found"

# Install NotebookLM CLI
RUN python3 -m pip install --break-system-packages notebooklm-mcp-cli

USER node
