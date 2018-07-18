const State = require('../state.js')
const m = require('mithril')

var DocumentList = {
    view: function () {
        const docs = State.documents().map(function (doc) {
            const attrs = {
                onclick: () => {
                    m.route.set('/documents/:slug', {slug: doc.slug})
                }
            }
            return m("div.documents-list-item", attrs,
                m('code', doc.slug)
            )
        })

        return m(".documents-list", docs)
    }
}

module.exports = DocumentList