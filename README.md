# Online annotation tool for PDFs

### Supports Multiple Documents

![](docs/overview.png)

### Supports Multiple Revisions

![](docs/revisions.png)

### Firebase E-mail Authentication

![](docs/auth.png)

### Annotation Tool

![](annotation.png)

### Debugging Window

![](debug.png)

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
        node scripts/outline.js < toc.xmlish > toc.json
