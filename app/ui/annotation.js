const m = require('mithril')

const State = require('../state.js')
const PDFHelper = require('../util/pdf.js')

const Comments = require('../comments.js')

const pdf = new PDFHelper()
var Annotations = {
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
        const p = State.page()
        await pdf.updatePage(p)
        await pdf.updateCanvas()
    },
    view: function(vnode) {
        return m('canvas')
    }
}

module.exports = Annotations