const m = require('mithril')
const R = require('ramda')

const Header = require('./header.js')

const State = require('../state.js')

const parseSelectedComment = R.compose(R.map(parseInt), R.split(','))

// returns x if x is not equal to y, false otherwise
const if_changed = (x, y) => {
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

    // set page
    let curPage = State.page()
    let newPage = (props.page && parseInt(props.page)) || 0
    let page = if_changed(newPage, curPage)
    if (page) {
        await State.set_page(page)
    }

    // set comment
    let curComment = State.comment().comment || [0,0]
    let newComment = (props.comment && parseSelectedComment(props.comment)) || [0,0]
    var comment = false
    if (newComment[0] !== curComment[0] || newComment[1] !== curComment[1]) {
        comment = newComment
    }
    
    if(comment) {
        await State.set_comment((comment !== [0,0]) ? comment : undefined)
    }

    if(slug || revision || page || comment) {
        console.log('>>>>>>>>>>>', !!slug , !!revision , !!page , !!comment)
        m.redraw()
    }
}

var debug = false
var Layout = {
    oncreate: (vnode) => updateStores(vnode.attrs),
    onupdate: (vnode) => updateStores(vnode.attrs),
    view: (vnode) => {
        let c = State.comment()
        return m(".layout-div.flexContainer.flexColumn.fullHeight", [
            m(Header, vnode.attrs),
            m('div.debug', {onclick: () => debug = !debug}, debug ? 'hide debug' : 'show debug'),
            m('pre.debug', {style: {display: debug ? 'block' : 'none'}, wrap:true}, JSON.stringify({
                count: `${State.documents().length} docs, ${State.revisions().length} revisions`,
                revision: R.omit(['toc'], State.revision()),
                document: State.document().slug,
                page: State.page(),
                comment: State.comment(),
                attrs: vnode.attrs,
                comments: State.comments().length
            }, null, 2)),
            m('.flexContainer.flexItem.noOverflow', vnode.children)
        ])
    }
}

module.exports = Layout