const m = require('mithril')

const Comments = require('./comments.js')
const PDFHelper = require('./pdf.js')

const pdf = new PDFHelper()
var Annotations = {
    p: null,
    oncreate: async function (vnode) {
        const canvas = vnode.dom
        await pdf.init(
            canvas,
            'pdfs/main.pdf',
            Comments.addComment,
            Comments.pageComments,
            Comments.selectComment,
            Comments.selectedComment
        )
        await this.onupdate(vnode)
    },
    onupdate: async function(vnode) {
        const p = parseInt(vnode.attrs.page)
        await pdf.updatePage(p)
        await pdf.updateCanvas()
    },
    view: function(vnode) {
        return m('canvas')
    }
}

module.exports = Annotations