const m = require('mithril')
const R = require('ramda')
const State = require('../state.js')

const CommentBox = require('./commentbox.js')

var SelectedComment = {
    view: () => {
        let c = State.comment()
        let [page, comment] = c.comment || [0,0]
        let {x,y,w,h} = c
        const cds = m('div.coordinates', `${x},${y},${w},${h}`)
        return m('div',
            page !==0 ? [m('h3', `Pg ${page}, remark ${comment}`),cds] : []
        )
    }
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
const g = c => `pg ${c.comment[0]}, remark ${c.comment[1]}: ${c.comments[0].subject}`

var AllComments = {
    view: () => {
        let comments = State.comments()
        return m('div.all-comments',
            R.map(c => m('div', [
                m('a', {
                    href: f(c),
                    oncreate: m.route.link
                }, g(c))
            ]), comments)
        )
    }
}

var Comment = {
    view: function () {
        let c = State.comment().comment
        return m('div.comments', [
            m('h2', 'Comment Thread'),
            m('div', m('a', {
                oncreate: m.route.link,
                href: `/documents/${State.document().slug}/${State.revision().revision}/${State.page()}/0,0`
            }, 'Back to comments overview')),
            m('div', (c && c[0] !== 0) ?
                [
                    m(SelectedComment),
                    m('hr'),
                    m(Thread),
                    m('hr'),
                    m(CommentBox)
                ]
                : m('div',[
                    m('p', 'click on a box to select a thread add drag a new box to add a thread'),
                    m(AllComments)
                ])
            )])
    }
}

module.exports = Comment