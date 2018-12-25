#!/bin/sh

NAME=monograph-c4b244be683b8d23948cdcea420a84bd08299faa
dumppdf.py -T public/pdfs/${NAME}.pdf > public/pdfs/${NAME}.xmlish-toc
node scripts/make-outline.js -i public/pdfs/${NAME}.xmlish-toc -o public/pdfs/${NAME}.json
