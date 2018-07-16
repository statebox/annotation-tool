const m = require('mithril')
const R = require('ramda')

const Document = require('./document.js')
const Pager = require('./pager.js')

const FBUI = require('./fbui.js')

function revision (revision) {
    let r = R.slice(0, 10, revision) + '⋯'
    return m("span.revision", r)
}


module.exports = {
    oninit: function (vnode) {
        Document.load(vnode.attrs.revision)
    },
    view: function (vnode) {
        
        var pager = m('div', '-')
        if(vnode.attrs.revision && Document.current.totalPages) {
            pager = Pager(
                vnode.attrs.revision,
                vnode.attrs.page,
                vnode.attrs.selectedComment,
                Document.current.totalPages
            )
        }

        const rev = m(".menu", R.concat(
            [
                m("a", {
                    href: '/list',
                    oncreate: m.route.link
                }, "Revisions")
            ],
            vnode.attrs.revision ? [m("span", ` » `), revision(vnode.attrs.revision)] : []
        ))

        const au = m(FBUI)

        // return pager

        // const pager = m('div', JSON.stringify(Document.current))
        return m(".flexContainer.blueBackground",
            [
                m(".flexItem.flexStart", au),
                m(".flexMain.flexMiddle", pager),
                m(".flexItem.flexEnd", rev)
            ])
    }
}