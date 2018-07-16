const m = require('mithril')
const R = require('ramda')

const Documents = require('../documents.js')
const Pager = require('./pager.js')

const Revision = require('./revision.js')
const FBUI = require('./fbui.js')

module.exports = {
    oninit: function (vnode) {
        Documents.load(vnode.attrs.revision)
    },
    view: function (vnode) {
        
        var pager = m('div', '-')
        if(vnode.attrs.revision && Documents.current.totalPages) {
            pager = Pager(
                vnode.attrs.revision,
                vnode.attrs.page,
                vnode.attrs.selectedComment,
                Documents.current.totalPages
            )
        }

        return m(".flexContainer.blueBackground",[
            m(".flexItem.flexStart", m(FBUI)),
            m(".flexMain.flexMiddle", pager),
            m(".flexItem.flexEnd", m(Revision, vnode.attrs))
        ])
    }
}