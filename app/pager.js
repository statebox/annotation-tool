const m = require('mithril')

var Pager = function (revision, page, totalPages) {
    const prevPage = Math.max(1, parseInt(page) - 1)
    const nextPage = Math.min(totalPages, parseInt(page) + 1)
    const currentPage = Math.max(1, Math.min(totalPages, parseInt(page)))
    const prev = m('a', { href: `/edit/${revision}/${prevPage}`, oncreate: m.route.link }, '«««')
    const next = m('a', { href: `/edit/${revision}/${nextPage}`, oncreate: m.route.link }, '»»»')
    const current = m('span', ` ${currentPage} / ${totalPages} `)
    return m('div', { class: 'pager' }, [prev, current, next])
}

module.exports = Pager