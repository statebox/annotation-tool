const m = require('mithril')

const PDFHelper = require('./pdf.js')

function makeDoc () {
    const pdf = new PDFHelper()
    var Docuu = {
        p: null,
        oncreate: async function (vnode) {
            const canvas = vnode.dom
            await pdf.init(
                canvas, 'pdfs/main.pdf',
                vnode.attrs.addComment, vnode.attrs.pageComments,
                vnode.attrs.selectComment, vnode.attrs.selectedComment
            )
            await pdf.updatePage(vnode.attrs.page)
            await pdf.updateCanvas()
            // return Docuu.p.renderPage(vnode.attrs.page)        
        },
        onupdate: async function(vnode) {
            await pdf.updatePage(vnode.attrs.page)
            await pdf.updateCanvas()
        },
        view: function(vnode) {
            return m('canvas')
        }
    }

    return Docuu
}

module.exports = makeDoc