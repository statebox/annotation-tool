# Online annotation tool for PDFs

### Supports Multiple Documents

![](docs/overview.png)

### Supports Multiple Revisions

![](docs/revisions.png)

### Firebase E-mail Authentication

![](docs/auth.png)

### Debugging Window

![](docs/debug.png)

### Annotation Tool

![](docs/annotation.png)

# Usage

## Installation

Git clone and then

        npm install

## Run server

Start auto reloading development server

        npm run dev

## Generaring Table of Contents

Uses https://github.com/euske/pdfminer

        dumppdf.py -T pdfs/main.pdf > toc.xmlish
        node scripts/outline.js --i toc.xmlish --o toc.json
