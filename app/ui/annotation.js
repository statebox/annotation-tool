const m = require('mithril')

const Comments = require('../comments.js')
const PDFHelper = require('../util/pdf.js')

const pdf = new PDFHelper()
var Annotations = {
    p: null,
    oncreate: async function (vnode) {
        const canvas = vnode.dom
        const p = parseInt(vnode.attrs.page)
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
        // try {
        //     let [pageNumber, selection] = JSON.parse(vnode.attrs.selectedComment)
        //     Comments.selectComment(pageNumber, selection)
        //     // (pageNumber, selection) => {
        //     //     return m.route.set(`/edit/${vnode.attrs.revision}/${p}/[${pageNumber},${selection}]`)
        //     // },
        // }
        // catch(e){
        //     console.log('FAILED TO PARSE SELECTED COMMENT OHNOES', vnode.attrs)
        // }
        await pdf.updatePage(p)
        await pdf.updateCanvas()
    },
    view: function(vnode) {
        return m('canvas')
    }
}

module.exports = Annotations