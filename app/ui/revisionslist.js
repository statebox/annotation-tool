const m = require('mithril')

const State = require('../state.js')

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
            return m("a.revision-list-item", attrs,
                [
                    m('span.timestamp', r.timestamp),
                    m('code', r.revision)
                ]
            )
        })

        return m("div#revisions", [
            m("h1", vnode.attrs.slug),
            m("h2", "revisions"),
            m(".revision-list", revisions)
        ])
    }
}

module.exports = RevisionsList