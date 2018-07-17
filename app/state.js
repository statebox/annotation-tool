const R = require('ramda')
const toc = require('../toc.json')

const exampleDocuments = [
    {
        slug: 'monograph'
    },
    {
        slug: 'qpl-2018'
    }
]

const exampleRevisions = [
    {
        timestamp: '2018-07-16T23:32:12+00:00',
        revision: 'c4a29add5ee31e49031650e5c610a2de3bf76eaa',
        url: 'https://arxiv.org/pdf/1805.05988.pdf',
        totalPages: 18,
        toc: toc
    },
    {
        timestamp: '2018-07-16T23:32:44+00:00',
        revision: '7d5d9651e2b4b2fefa52772a86c160c86c10f4f0',
        url: 'pdfs/main.pdf',
        totalPages: 18,
        toc: toc
    }
]

const exampleSelection = {
    page: 12,
    comment: [4, 3]
}

const current = {
    document: {},
    revision: {},
    selection: {}
}

const init = async () => {
}

const documents = () => exampleDocuments
const document = () => current.document // all slugs
const revisions = () => exampleRevisions // all revs for slug
const revision = () => current.revision
const selection = () => current.selection

const f = (prop, val, list) => R.head(R.filter(R.propEq(prop, val), list)) || {}

const set_document = async (slug) => {
    console.log(`load ${slug}`)
    current.document = f('slug', slug, documents())
}

const set_revision = async (revision) => {
    console.log(`load ${current.document.slug}/${revision}`)
    current.revision = f('revision', revision, revisions())
}

const set_selection = (page, comment) => {
    current.selection.page = page
    current.selection.comment = comment || [0,0]
}

module.exports = {
    init,
    document, documents, set_document,
    revision, revisions, set_revision,
    selection, set_selection
}
