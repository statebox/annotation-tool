const m = require('mithril')
const R = require('ramda')
const State = require('../state.js')

const CommentBox = require('./commentbox.js')

var SelectedComment = {
    view: () => {
        let c = State.comment()
        let [page, comment] = c.comment || [0,0]
        let {x,y,w,h} = c
        return m('div', [
            m('span.page-pre', 'page: '), m('span.page',page),
            m('span.split', ' — '),
            m('span.comment-pre', 'comment: '), m('span.comment', comment),
            m('div.coordinates', `${x},${y},${w},${h}`)
        ])
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

var Comment = {
    view: function () {
        return m('div.comments', [
            m(SelectedComment),
            m('hr'),
            m(Thread),
            m('hr'),
            m(CommentBox)
        ])
    }
}

module.exports = Comment