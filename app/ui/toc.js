const m = require('mithril')
const R = require('ramda')

const State = require('../state.js')

var TOC = {
    view: function (vnode) {
        
        let slug = State.document().slug
        let rev = State.revision().revision

        const line = ({title,level,page}) => m('a', {
            class: 'toc-entry',
            href: `/documents/${slug}/${rev}/${parseInt(page) + 1}/0,0`,
            style: `padding-left: ${(level - 1) * 16}px`,
            oncreate: m.route.link
        }, title)

        const toc = State.toc()

        return m('div.table-of-contents', [
            m('h2', 'Table of Contents'),
            m('div.tocTree', toc.length ? R.map(line, toc) : 'No table of contents found'),
            m('pre', `ref: ${vnode.attrs.revision}`)
        ])
    }
}

module.exports = TOC