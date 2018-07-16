const m = require('mithril')
const R = require('ramda')

const ready = require('./ready.js')

module.exports = async function app(eltId) {
    
    // wait for document to load
    await ready()
    
    const Layout = require('./layout.js')
    const UI = require('./ui.js')
    const DocumentList = require('./documentlist.js')

    const TOC = require('./toc.js')
    const Annotations = require('./annotation.js')

    const Comments = require('./comments.js')
    const CommentBox = require('./commentbox.js')

    var Comment = {
        view: function () {
            return m('div.comments', [
                m('div', JSON.stringify(Comments.selectedComment())),
                m(CommentBox)
            ])
        }
    }

    const root = document.getElementById(eltId)
    
    m.route.prefix('#')
    m.route(root, "/list", {
        "/list": {
            render: function () {
                return m(Layout, m(DocumentList))
            }
        },
        "/edit/:revision/:page/:selectedComment": {
        render: function (vnode) {
                return m(Layout, vnode.attrs, [
                    m('aside.sidebar.sidebarLeft', m(Comment)),
                    m('main.flexItem.main', m(Annotations, vnode.attrs)),
                    m('aside.sidebar.sidebarRight', m(TOC, vnode.attrs))
                ])
            }
        }
    })
}