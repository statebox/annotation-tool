const m = require('mithril')
const R = require('ramda')

const toc = require('../../toc.json')

var TOC = {
    view: function (vnode) {
        const line = ({title,level,page}) => m('a', {
            class: 'toc-entry',
            href: `#/edit/${vnode.attrs.revision}/${page}`,
            style: `padding-left: ${(level - 1) * 16}px`
        }, title)
        
        return m('div', {class: 'tocTree'}, R.map(line, toc))
    }
}

module.exports = TOC