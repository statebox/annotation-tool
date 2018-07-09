# annotation tool for monograph

![](screenshot.png)


# toc

uses https://github.com/euske/pdfminer

        dumppdf.py -T pdfs/main.pdf > toc.xmlish
        node outline.js < toc.xmlish > toc.json

