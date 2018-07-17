const m = require('mithril')
const R = require('ramda')

const State = require('../state.js')

var TOC = {
    view: function (vnode) {
        
        const line = ({title,level,page}) => m('a', {
            class: 'toc-entry',
            href: `#/edit/${vnode.attrs.revision}/${page}`,
            style: `padding-left: ${(level - 1) * 16}px`
        }, title)
        
        const toc = State.revision().toc ? State.revision().toc : []

        return m('div', {class: 'tocTree'}, [
            m('pre', {style: {fontSize: '0.8em'}}, `ref: ${vnode.attrs.revision}`),
            m('h3', 'Table of Contents'),
            m('div.tocTree', R.map(line, toc))
        ])
    }
}

module.exports = TOC