const m = require('mithril')
const R = require('ramda')

const TOC = require('./toc.js')
const Header = require('./header.js')
const Annotations = require('./annotation.js')

const Comments = require('./comments.js')

const CommentBox = require('./commentbox.js')

// TODO move toc and select to here
// var state = {
//     toc: require('../toc.json')
// }

    var Comment = {
    view: function () {
        return m('div.comments', [
            m('div', JSON.stringify(Comments.selectedComment())),
            m(CommentBox)
        ])
    }
}

const UI = {
    view: (vnode) => m(".flexContainer.flexColumn.fullHeight", [
        m(Header, vnode.attrs),
        m('.flexContainer.flexItem', [
            m('aside.sidebar.sidebarLeft', m(Comment)),
            m('main.flexItem.main', m(Annotations, vnode.attrs)),
            m('aside.sidebar.sidebarRight', m(TOC, vnode.attrs))
        ])
    ])
}

module.exports = UI