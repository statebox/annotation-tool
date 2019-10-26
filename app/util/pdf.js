const R = require('ramda')

function PDFHelper () {
    this.scale = 1.4
    this.curPage = null
    this.dragState = null
    this.comments = {}
    this.mousePosition = null
    this.pageNumber = 0
}

PDFHelper.prototype.init = async function (canvas, url, addComment, pageComments, selectComment, selectedComment) {
    this.url = url
    this.canvas = canvas
    this._addComment = addComment
    this._pageComments = pageComments
    this._selectComment = selectComment
    this._selectedComment = selectedComment

    // load PDF file
    this.pdf = await PDFJS.getDocument(this.url)

    // bind mouse handler
    const handler = this.updateDragState.bind(this)
    this.canvas.addEventListener('mousemove', handler, false)
    this.canvas.addEventListener('mouseup', handler, false)
    this.canvas.addEventListener('mousedown', handler, false)
    this.canvas.addEventListener('mouseleave', () => { this.mousePosition = null; this.updateCanvas() }, false)
}

// get the dimensions of the canvas
// ie. the extends of the canvas coordinate system
// {(x,y) | 0 < x < w, 0 < y < h}
PDFHelper.prototype.canvasDimensions = function () {
    return this.viewport ? [this.viewport.width, this.viewport.height] : [0,0]
}

// transform event coordinates to canvas coordinates and return width, height
PDFHelper.prototype.canvasCoordinates = function (evt) {
    let rect = this.canvas.getBoundingClientRect()
    let x = evt.clientX - rect.left
    let y = evt.clientY - rect.top
    return [x,y]
}

PDFHelper.prototype.updatePage = async function (pageNumber) {
    
    // nothing changed, so don't do anything
    if(this.pageNumber === pageNumber)
        return;
    
    // load page
    this.pageNumber = pageNumber

    // check if loading was okay
    if(!this.pdf) {
        console.error('cannot update page, PDF failed to load')
        return
    }
    
    const page = await this.pdf.getPage(this.pageNumber)

    // get page dimensions and resize the canvas element
    this.viewport = page.getViewport(this.scale)
    this.canvas.height = this.viewport.height
    this.canvas.width = this.viewport.width
    
    // store the drawing context
    this.context = this.canvas.getContext('2d')
    
    // resize for HiDPI screens, so things look sharp
    const r = window.devicePixelRatio
    if( r > 1 ) {
        let canvasWidth = this.canvas.width
        let canvasHeight = this.canvas.height

        this.canvas.width = canvasWidth * window.devicePixelRatio
        this.canvas.height = canvasHeight * window.devicePixelRatio
        this.canvas.style.width = canvasWidth + 'px' 
        this.canvas.style.height = canvasHeight + 'px'

        this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    // render the page to the canvas
    await page.render({
        canvasContext: this.context,
        viewport: this.viewport
    })

    // store canvas ask background image
    this.bg = new Image()
    this.bg.src = this.canvas.toDataURL("image/png")
}

PDFHelper.prototype.selectedComment = function (sx, sy) {
    const comments = this.pageComments(this.pageNumber)
    var i = 1;
    function between(l, x, h) {
        return l > h ? between(h, x, l) : l <= x && x <= h;
    }
    for (k of comments) {
        if (k) {
            let {x,y,w,h} = k
            if (between(x, sx, x + w) && between(y, sy, y + h)) {
                return i
            }
        }
        i++
    }
    return 0
}

PDFHelper.prototype.updateDragState = function (evt) {
    const [x, y] = this.mousePosition = this.canvasCoordinates(evt)
    
    const [x0, y0, w0, h0] = this.dragState || [0,0,0,0]
    const [w, h] = [x - x0, y - y0]
    const drag = this.dragState

    // mouse release after drag
    if ((drag !== null) && (evt.buttons === 0)) {
        if (w && h) {
            this.addPageComment(this.pageNumber, [x0, y0, w, h])
        }
        this.dragState = null
    }

    // mouse press before drag
    if ((evt.buttons !== 0) && (drag === null)) {

        // check if we are on a comment
        let s = this.selectedComment(x, y)

        // else start dragging
        if (s === 0)
        {
            this.dragState = [x, y, 1, 1]
        }
        else
        {
            this._selectComment(this.pageNumber, s)
        }
    }

    // mouse press during drag
    if ((evt.buttons !== 0) && (drag !== null)) {
        this.dragState = [x0,y0,w,h]
    }

    this.updateCanvas()
}

PDFHelper.prototype.addPageComment = function (pageNumber, comment) {
    // const comments = 
    this._addComment(pageNumber, comment)  
}

PDFHelper.prototype.pageComments = function (pageNumber) {
    return this._pageComments(pageNumber)
    // const comments = this.comments[pageNumber]
    // return comments ? comments : []
}

PDFHelper.prototype.updateCanvas = function () {
    // draw background
    let [cw,ch] = this.canvasDimensions()
    
    // check if loading was okay
    if(!this.context) {
        console.error('cannot update canvas, something failed during initialization')
        return
    }


    if(this.bg)
        this.context.drawImage(this.bg, 0, 0, cw, ch)

    // draw crosshair
    if (this.mousePosition) {
        let [mx,my] = this.mousePosition
        this.context.beginPath()
        this.context.moveTo(mx + .5, 0)
        this.context.lineTo(mx + .5, ch)
        this.context.stroke()
        
        this.context.beginPath()
        this.context.moveTo(0, my + .5)
        this.context.lineTo(cw, my + .5)
        this.context.stroke()
    }

    // draw drag feedback
    if (this.dragState) {
        let [x,y, dw, dh] = this.dragState
        this.context.fillStyle = 'rgba(0, 100, 0, 0.4)'
        this.context.fillRect(x, y, dw, dh)
    }

    // draw comment rectangles
    const comments = this.pageComments(this.pageNumber)
    var i = 1
    
    // check if we are on page & then set the selected comment
    var s = 0;
    let [p, z] = this._selectedComment()
    if (p == this.pageNumber)
        s = z;
    
    for (k of comments) {
        if (k) {
            let {x,y,w,h,closed} = k
            this.context.fillStyle = s == i ? 'rgba(0,180,0,0.4)' : closed ? 'transparent' : 'rgba(0,0,0,0.4)'
            this.context.fillRect(x,y,w,h)
        }
        i++
    }
}

module.exports = PDFHelper