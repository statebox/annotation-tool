const m = require('mithril')
const R = require('ramda')

// truncate string
function revision (revision) {
    let r = R.slice(0, 10, revision) + '⋯'
    return m("span.revision", r)
}

module.exports = {
    view: (vnode) => m(".menu", R.concat(
        [
            m("a", {
                href: '/list',
                oncreate: m.route.link
            }, "Revisions")
        ],
        vnode.attrs.revision ? [m("span", ` » `), revision(vnode.attrs.revision)] : []
    ))
}