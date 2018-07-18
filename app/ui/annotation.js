const m = require('mithril')

const State = require('../state.js')
const PDFHelper = require('../util/pdf.js')

const Comments = require('../comments.js')

const pdf = new PDFHelper()

var inited = false

var Annotations = {
    oncreate: async function (vnode) {
        await this.onupdate(vnode)
    },
    onupdate: async function(vnode) {
        const canvas = vnode.dom
        const url = State.revision().url
        
        if (url) {
            if (!inited) {
                console.log('lading:', url)
                await pdf.init(
                    canvas,
                    url,
                    Comments.addComment,
                    Comments.pageComments,
                    Comments.selectComment,
                    Comments.selectedComment
                )
            }
            if(inited) {
                const p = State.page()
                await pdf.updatePage(p)
                await pdf.updateCanvas()    
            }
        }
    },
    view: function(vnode) {
        return m('canvas')
    }
}

module.exports = Annotations