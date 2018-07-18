const m = require('mithril')
const R = require('ramda')

const State = require('../state.js')

// truncate string
function revision (revision) {
    let r = R.slice(0, 10, revision) + '⋯'
    return m("span.revision", r)
}

module.exports = {
    view: (vnode) => {
 
        const docs = m("a", {
            onclick: () => m.route.set('/documents/')
        }, "Documents")

        const slug = State.document().slug
        const slugDOM = slug ? [m("span", ` » `), m("a", {
            onclick: () => m.route.set('/documents/:slug', {
                    slug: slug
                })
        }, slug)] : []

        const rev = State.revision().revision
        const revDOM = rev ? [m("span", ` » `), rev] : []
        
        const elems = R.flatten([docs, slugDOM, revDOM])
        return m('div.path', elems)
    }
}