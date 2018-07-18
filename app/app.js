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
    const LeftPanel = require('./ui/leftpanel.js')

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
                    // left
                    m('aside.sidebar.sidebarLeft',
                        m(LeftPanel, vnode.attrs)),
                    // center
                    m('main.flexItem.main', [
                        m(Pager, vnode.attrs),
                        m(Annotations, vnode.attrs)
                    ]),
                    // right
                    m('aside.sidebar.sidebarRight',
                        m(ToC, vnode.attrs))
                ])
            }
        }
    })
}


