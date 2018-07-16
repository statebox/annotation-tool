const Document = require('./document.js')
const m = require('mithril')

var DocumentList = {
    oninit: Document.loadList,
    view: function () {
        return m(".user-list", Document.list.map(function (user) {
            return m("a.user-list-item", { href: `/edit/${user.revision}/1/[0,0]`, oncreate: m.route.link },
                m('code', user.revision)
            )
        }))
    }
}

module.exports = DocumentList