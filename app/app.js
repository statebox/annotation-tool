const m = require('mithril')
const R = require('ramda')

const ready = require('./util/ready.js')

module.exports = {
    State: require('./state.js'),
    Comments: require('./comments.js'),
    R: require('ramda'),
    m: require('mithril'),
    start: start
}

const State = module.exports.State

async function start (eltId) {
    
    // wait for document to load
    await ready()
    
    const Layout = require('./ui/layout.js')
    const DocumentList = require('./ui/documentlist.js')
    const RevisionsList = require('./ui/revisionslist.js')

    const Pager = require('./ui/pager.js')
    
    const ToC = require('./ui/toc.js')
    const Annotations = require('./ui/annotation.js')

    const Comments = require('./comments.js')
    const CommentBox = require('./ui/commentbox.js')

    var Comment = {
        view: function () {
            let [page, comment] = State.comment().comment || [0,0]
            return m('div.comments', [
                m('div', [
                    m('span.page-pre', 'page: '), m('span.page',page),
                    m('span.split', ' — '),
                    m('span.comment-pre', 'comment: '), m('span.comment', comment)
                ]),
                m('hr'),
                m(CommentBox)
            ])
        }
    }

    const root = document.getElementById(eltId)
    
    m.route.prefix('#')
    m.route(root, "/documents", {
        "/documents": {
            render: function (vnode) {
                return m(Layout, vnode.attrs,
                    m(DocumentList, vnode.attrs)
                )
            }
        },
        "/documents/:slug": {
            render: function (vnode) {
                return m(Layout, vnode.attrs,
                    m(RevisionsList, vnode.attrs)
                )
            }
        },
        "/documents/:slug/:revision/:page/:comment": {
            render: function (vnode) {
                return m(Layout, vnode.attrs, [
                    m('aside.sidebar.sidebarLeft', m(Comment, vnode.attrs)),
                    m('main.flexItem.main', [
                        m(Pager, vnode.attrs),
                        m(Annotations, vnode.attrs)
                    ]),
                    m('aside.sidebar.sidebarRight', m(ToC, vnode.attrs))
                ])
            }
        }
    })
}


