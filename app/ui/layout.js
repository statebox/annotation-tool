const m = require('mithril')
const R = require('ramda')

const Header = require('./header.js')

const State = require('../state.js')

const parseSelectedComment = R.compose(R.map(parseInt), R.split(','))

// returns x if x is not equal to y, false otherwise
const if_changed = (x, y) => {
    console.log(x,y)
    return (x && R.not(R.equals(y,x))) ? x : false
}

async function updateStores (props) {
    // load initial state
    await State.init()

    // set document
    let slug = if_changed(props.slug, State.document().slug)
    if (slug) {
        await State.set_document(props.slug)
    }

    // set revision
    let revision = if_changed(props.revision, State.revision().revision)
    if (revision) {
        await State.set_revision(props.revision)
    }

    // set current selection
    let curPage = State.selection().page
    let newPage = (props.page && parseInt(props.page)) || 0
    let page = if_changed(newPage, curPage)
    
    let curComment = State.selection().comment
    let newComment = (props.selectedComment && parseSelectedComment(props.selectedComment)) || [0,0]
    let comment = if_changed(newComment, curComment)
    
    if (page || comment) {
        let p = page || curPage
        let q = comment || curComment
        await State.set_selection(p, q)
    }

    if(slug || revision || page || comment)
        m.redraw()
}

var debug = false
var Layout = {
    oninit: (vnode) => updateStores(vnode.attrs),
    onupdate: (vnode) => updateStores(vnode.attrs),
    view: (vnode) => {
        let c = State.selection().comment
        return m(".flexContainer.flexColumn.fullHeight", [
            m(Header, vnode.attrs),
            m('div', {onclick: () => debug = !debug}, debug ? 'hide debug' : 'show debug'),
            m('pre.debug', {style: {display: debug ? 'block' : 'none'}, wrap:true}, JSON.stringify({
                count: `${State.documents().length} docs, ${State.revisions().length} revisions`,
                revision: R.omit(['toc'], State.revision()),
                document: State.document().slug,
                page: State.selection().page,
                comment: `page ${c && c[0]}, comment ${c && c[1]}`
            }, null, 2)),
            m('.flexContainer.flexItem', vnode.children)
        ])
    }
}

module.exports = Layout