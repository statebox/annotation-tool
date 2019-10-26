const m = require('mithril')
const R = require('ramda')
const State = require('../state.js')
const Firebase = require('../util/firebase.js')

const CommentBox = require('./commentbox.js')

var SelectedComment = {
    view: () => {
        let c = State.comment()
        let [page, comment] = c.comment || [0,0]
        let {x,y,w,h} = c
        // const cds = m('div.coordinates', `${x},${y},${w},${h}`)
        return m('div',
            page !==0 ? [m('h3', `Pg ${page}, remark ${comment}`)] : []
        )
    }
}

const closeComment = async () => { 
    await State.add_comment_to_thread('closed comment', '', { closed: true })
}
const reopenComment = async () => { 
    await State.add_comment_to_thread('reopened comment', '', { closed: false })
}


const md = require('markdown-it')()
    .use(require('markdown-it-katex'))

const renderComment = (comment) => {
    let html = m.trust(md.render(comment.markdown))
    return m('.comment', [
        m('.subject', comment.subject || 'Untitled'),
        m('.body', html),
        m('.author', comment.author || 'foo@example.com'),
        m('.timestamp', comment.timestamp),
    ])
}

var Thread = {
    view: () => {
        let comments = State.comment().comments || []
        return m('.thread', R.map(renderComment, comments))
    }
}

const mkc = c => m('li',
    m('u'))

const f = c => `/documents/${State.document().slug}/${State.revision().revision}/${c.comment[0]}/${c.comment[0]},${c.comment[1]}`
const g = c => `pg ${c.comment[0]}, remark ${c.comment[1]}: ${c.comments ? c.comments[0].subject : 'Untitled'}`

var AllComments = {
    view: () => {
        const list = (comments) => R.map(c => m('div', [
            m('a', {
                href: f(c),
                oncreate: m.route.link
            }, g(c))
        ]), R.filter(c => (c.w && c.h) || c.comments, comments))

        const comments = State.comments()
        const openComments = R.filter(c => !c.closed, comments)
        const closedComments = R.filter(c => c.closed, comments)
        return m('div.all-comments', [
            comments.length ? '' : 'No comments yet.',
            list(openComments),
            closedComments.length ? [
                m('h4', 'Closed comments'),
                list(closedComments),
            ] : []
        ])
    }
}

var showCommentBox = false

var Comment = {
    view: function () {
        const c = State.comment()
        const hasSelected = c.comment && c.comment[0] !== 0
        return m('div.comments', [
            m('h2', 'Comment Thread'),
            hasSelected && m('div', m('a', {
                oncreate: m.route.link,
                href: `/documents/${State.document().slug}/${State.revision().revision}/${State.page()}/0,0`
            }, 'Back to comments overview')),
            m('div', hasSelected ?
                [
                    m(SelectedComment),
                    m(Thread),
                    Firebase.user && [
                        showCommentBox ? m(CommentBox) : m('button', {onclick: () => { showCommentBox = !showCommentBox; m.redraw() }}, 'reply'),
                        showCommentBox 
                            ? m('button', {onclick: () => {showCommentBox = false; m.redraw()}}, 'cancel') 
                            : c.closed 
                                ? m('button', {onclick: async() => { await reopenComment() }}, 'reopen')
                                : m('button', {onclick: async() => { await closeComment() }}, 'close')
                    ]
                ]
                : m('div',[
                    m('p', [
                        'Click on a box to select a thread. ',
                        Firebase.user 
                            ? 'Drag a new box on the page to create a new comment thread.'
                            : m('b', 'Login to add comments.')
                    ]),
                    m(AllComments)
                ])
            )])
    }
}

module.exports = Comment