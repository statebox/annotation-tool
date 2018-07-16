const m = require('mithril')

const Header = require('./header.js')

var Layout = {
    view: (vnode) => m(".flexContainer.flexColumn.fullHeight", [
        m(Header, vnode.attrs),
        m('.flexContainer.flexItem', vnode.children)
    ])
}

module.exports = Layout