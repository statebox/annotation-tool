const m = require('mithril')

const State = require('../state.js')

const { distanceInWordsToNow } = require('date-fns')

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(datestring) {
    let s = 'published: ' + distanceInWordsToNow(new Date(datestring)) + ' ago'
    console.log(s)
    return s
}

var RevisionsList = {
    view: function (vnode) {
        const revisions = State.revisions().map(function (r) {
            const attrs = {
                onclick: () => m.route.set('/documents/:slug/:revision/:page/:selectedComment', {
                    slug: vnode.attrs.slug,
                    revision: r.revision,
                    page: 1,
                    selectedComment: [0,0]
                })
            }
            return m(".revision-list-item",
                [
                    m('a.timestamp',  attrs, prettyDate(r.timestamp)),
                    m('span', ['rev: ', m('a.revision', attrs, r.revision)]),
                    m('a.to-comments', attrs, 'click to browse online and annotate'),
                    m('a.download-pdf', {href: r.url, download: `${vnode.attrs.slug}.pdf`}, 'download PDF')
                ]
            )
        })

        return m("div#revisions", [
            m("h1", State.document().title),
            m("h2", "revisions"),
            m(".revision-list", revisions)
        ])
    }
}

module.exports = RevisionsList