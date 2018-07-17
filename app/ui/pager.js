const R = require('ramda')
const m = require('mithril')

const State = require('../state.js')

var Pager = {
    view: function (vnode) {

        const slug = State.document().slug
        const rev = State.revision().revision

        const comment = State.selection().comment
        const totalPages = State.revision().totalPages || 0

        const mkL = (page) => ({
            onclick: () => m.route.set('/documents/:slug/:revision/:page/:selectedComment', {
                selectedComment: comment,
                page: page,
                revision: rev,
                slug: slug
            })
        })

        const page = parseInt(vnode.attrs.page)
        const prevPage = Math.max(1, page - 1)
        const nextPage = Math.min(totalPages, page + 1)
        // return m('div', page, prevPage, nextPage)
        const currentPage = Math.max(1, Math.min(totalPages, page))
        const prev = m('a', mkL(prevPage), '«««')
        const next = m('a', mkL(nextPage), '»»»')
        const current = m('span', ` ${currentPage} / ${totalPages} `)
        return m('div', { class: 'pager' }, [prev, current, next])
    }
}

module.exports = Pager