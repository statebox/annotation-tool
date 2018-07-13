const R = require('ramda')
const m = require('mithril')

const {Authing} = require('./auth.js')
const Document = require('./document.js')
const Pager = require('./pager.js')

function revision (revision) {
    let r = R.slice(0, 10, revision) + '⋯'
    return m("span.revision", r)
}

module.exports = {
    oninit: function (vnode) {
        Document.load(vnode.attrs.revision)
    },
    view: function (vnode) {
        const pager = Pager(vnode.attrs.revision, vnode.attrs.page, Document.current.totalPages)
        const au = m(Authing)
        const rev = m(".menu", R.concat(
            [
                m("a", {
                    href: '/list',
                    oncreate: m.route.link
                }, "Revisions")
            ],
            vnode.attrs.revision ? [m("span", ` » `), revision(vnode.attrs.revision)] : []
        ))

        return m(".flexContainer.blueBackground",
            [
                m(".flexItem.flexStart", rev),
                m(".flexMain.flexMiddle", pager),
                m(".flexItem.flexEnd", au)
            ]
        )
    }
}