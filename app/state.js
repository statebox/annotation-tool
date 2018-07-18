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

const exampleComments = {
    "1" : [ {
      "h" : 117,
      "w" : 498,
      "x" : 127.40625,
      "y" : 228
    }, {
      "h" : 809,
      "w" : 2,
      "x" : 447.625,
      "y" : 0
    } ],
    "2" : [ {
      "h" : 255,
      "w" : 312,
      "x" : 87.625,
      "y" : 177
    } ],
    "3" : [ {
      "h" : 69,
      "w" : 154,
      "x" : 101.40625,
      "y" : 172
    } ],
    "4" : [ {
      "h" : 38,
      "w" : 191,
      "x" : 90.875,
      "y" : 220
    }, {
      "h" : 42,
      "w" : 145,
      "x" : 95.875,
      "y" : 457
    } ],
    "6" : [ {
      "h" : 143,
      "w" : 176,
      "x" : 276.40625,
      "y" : 546
    }, {
      "h" : 40,
      "w" : 20,
      "x" : 285.40625,
      "y" : 248
    }, {
      "h" : 43,
      "w" : 68,
      "x" : 410.40625,
      "y" : 103
    }, {
      "h" : 71,
      "w" : 71,
      "x" : 470.40625,
      "y" : 287
    }, {
      "h" : 97,
      "w" : 89,
      "x" : 130.40625,
      "y" : 371
    } ],
    "15" : [ {
      "h" : 0,
      "w" : 0,
      "x" : 403.40625,
      "y" : 528
    }, {
      "h" : 91,
      "w" : 236,
      "x" : 250.40625,
      "y" : 493
    } ],
    "NaN" : [ {
      "h" : 0,
      "w" : 0,
      "x" : 242.40625,
      "y" : 230
    }, {
      "h" : 0,
      "w" : 0,
      "x" : 408.40625,
      "y" : 557
    }, {
      "h" : 95,
      "w" : 216,
      "x" : 257.40625,
      "y" : 489
    }, {
      "h" : 0,
      "w" : 0,
      "x" : 637.40625,
      "y" : 561
    } ]
  }
  

const exampleSelection = {
    comment: [4, 3]
}

const current = {
    document: {},
    revision: {},
    page: 0,
    comment: {}
}

const init = async () => {
}

const documents = () => exampleDocuments
const revisions = () => exampleRevisions // all revs for slug

// transform comments
// {"k":[{x,y,w,h}]} |--> [{comment:[k,i],x,y,w,h}]
const mapIndexed = R.addIndex(R.map)
// const addComment = k => (d,i) => R.compose(
//     R.assoc('comment', i),
//     R.assoc('page', parseInt(k))
//   )(d)
const addComment = k => (d,i) => R.assoc('comment', [parseInt(k), i], d)
const g = cs => R.flatten(R.map(k => mapIndexed(addComment(k), cs[k]), R.keys(cs)))

// all comments for /slug/rev/page
let exComments = g(exampleComments)
const comments = () => exComments 

const document = () => current.document // all slugs
const revision = () => current.revision
const page = () => current.page
const comment = () => current.comment

const f = (prop, val, list) => R.head(R.filter(R.propEq(prop, val), list)) || {}

const set_document = async (slug) => {
    console.log(`$$$: SET DOCUMENT: ${slug}`)
    current.document = f('slug', slug, documents())
}

const set_revision = async (revision) => {
    console.log(`$$$: SET REVISION: ${revision}`)
    current.revision = f('revision', revision, revisions())
}

const set_page = (page) => {
    console.log(`$$$: SET PAGE ${page}`)
    current.page = page || 0
}

const set_comment = (c) => {
    console.log(`$$$: SET COMMENT ${JSON.stringify(c)}`)
    current.comment.comment = c
}

module.exports = {
    init,
    document, documents, set_document,
    revision, revisions, set_revision,
    comments, comment, set_comment,
    page, set_page
}
