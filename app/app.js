const m = require('mithril')
const R = require('ramda')

const Doc = require('./doc.js')

const exampleDocuments = [
    {
        revision: 'c4a29add5ee31e49031650e5c610a2de3bf76eaa',
        url: 'pfds/main.pdf',
        totalPages: 46
    },
    {
        revision: '7d5d9651e2b4b2fefa52772a86c160c86c10f4f0',
        url: 'pfds/main.pdf',
        totalPages: 60
    }
]

const delayer = (ts, fn) => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('resolving')
        resolve(fn())
        m.redraw()
    }, ts)
})

module.exports = function app() {

    var Document = {
        list: exampleDocuments,
        loadList: function () {
            // return m.request({
            //     method: "GET",
            //     url: "https://rem-rest-api.herokuapp.com/api/users",
            //     withCredentials: true,
            // })
            // .then(function(result) {
            //     Document.list = result.data
            // })
        },

        current: {},
        load: function (revision) {
            console.log('loading', revision)
            return delayer(1000, () => {
                Document.current = R.head(R.filter(R.propEq('revision', revision), Document.list))
            })

            // return m.request({
            //     method: "GET",
            //     url: "https://rem-rest-api.herokuapp.com/api/users/" + id,
            //     withCredentials: true,
            // })
            // .then(function(result) {
            //     Document.current = result
            // })
        },

        save: function () {
            // return m.request({
            //     method: "PUT",
            //     url: "https://rem-rest-api.herokuapp.com/api/users/" + Document.current.id,
            //     data: Document.current,
            //     withCredentials: true,
            // })
        }
    }

    var DocumentList = {
        oninit: Document.loadList,
        view: function () {
            return m(".user-list", Document.list.map(function (user) {
                return m("a.user-list-item", { href: `/edit/${user.revision}/1`, oncreate: m.route.link },
                    m('code', user.revision)
                )
            }))
        }
    }

    var Pager = function (revision, page, totalPages) {
        const prevPage = Math.max(1, parseInt(page) - 1)
        const nextPage = Math.min(totalPages, parseInt(page) + 1)
        const currentPage = Math.max(1, Math.min(totalPages, parseInt(page)))
        const prev = m('a', { href: `/edit/${revision}/${prevPage}`, oncreate: m.route.link }, '«««')
        const next = m('a', { href: `/edit/${revision}/${nextPage}`, oncreate: m.route.link }, '»»»')
        const current = m('span', ` ${currentPage} / ${totalPages} `)
        return m('div', { class: 'pager' }, [prev, current, next])
    }

    var Comments = {
        current: {}
    }

    var CommentForm = {
        view: function (vnode) {
            const opts = {
                onsubmit: function (e) {
                    e.preventDefault()
                    console.log(Comments.current)
                    // Document.save()
                }
            }
            return m("form", opts, [
                m("label.label", "Summary"),
                m("input.input[placeholder=Summary]", {
                    oninput: m.withAttr("value", function (value) { Document.current.lastName = value }),
                    value: Document.current.lastName
                }),
                m("label.label", "Comment"),
                m("textarea.textarea[placeholder=The Comment]", {
                    oninput: m.withAttr("value", function (value) { Comments.current.comment = value }),
                    value: Comments.current.comment
                }),
                m("button.button[type=submit]", "Save")
            ])
        }
    }

    var selected = [-1,-1]
    const comments = {}
    const addComment = (pageNumber, comment) => {
        let cs = comments[pageNumber]
        if (cs) {
            cs.push(comment)
        } else {
            comments[pageNumber] = [comment]
        }
    }
    const pageComments = (pageNumber) => {
        let cs = comments[pageNumber]
        return cs ? cs : []
    }
    const selectComment = (pageNumber, selection) => selected = [pageNumber, selection]
    const selectedComment = () => selected

    var DocumentForm = {
        oninit: function (vnode) {
            Document.load(vnode.attrs.revision)
        },
        view: function (vnode) {
            const pager = Pager(vnode.attrs.revision, vnode.attrs.page, Document.current.totalPages)
            return m('div', {}, [
                pager,
                m(CommentForm),
                // m('pre', JSON.stringify(Document.current)),
                m(Doc, {
                    page: parseInt(vnode.attrs.page),
                    addComment: addComment,
                    pageComments: pageComments,
                    selectComment: selectComment,
                    selectedComment: selectedComment
                })
            ])
        }
    }

    var Layout = {
        view: function (vnode) {
            return m("main.layout", [
                m("nav.menu", R.concat(
                    [
                        m("a", {
                            href: '/list',
                            oncreate: m.route.link
                        }, "Revisions")
                    ],
                    vnode.attrs.revision ? [m("span", ` » ${vnode.attrs.revision}`)] : []
                )),
                m("section", vnode.children)
            ])
        }
    }

    m.route.prefix('#')
    m.route(document.body, "/list", {
        "/list": {
            render: function () {
                return m(Layout, m(DocumentList))
            }
        },
        "/edit/:revision/:page": {
            render: function (vnode) {
                return m(Layout, vnode.attrs, m(DocumentForm, vnode.attrs))
            }
        }
    })

}