const m = require('mithril')
const R = require('ramda')

const State = require('../state.js')

var TOC = {
    view: function (vnode) {
        
        let slug = State.document().slug
        let rev = State.revision().revision

        const line = ({title,level,page}) => m('a', {
            class: 'toc-entry',
            href: `/documents/${slug}/${rev}/${page}/0,0`,
            style: `padding-left: ${(level - 1) * 16}px`,
            oncreate: m.route.link
        }, title)

        const toc = State.revision().toc ? State.revision().toc : []

        return m('div.table-of-contents', [
            m('h3', 'Table of Contents'),
            m('div.tocTree', R.map(line, toc)),
            m('pre', `ref: ${vnode.attrs.revision}`)
        ])
    }
}

module.exports = TOC