const R = require('ramda')
const toc = require('../toc.json')
const m = require("mithril")

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

const loaded = {
  comments: []
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
// let exComments = g(exampleComments)
const comments = () => loaded.comments

const document = () => current.document // all slugs
const revision = () => current.revision
const page = () => current.page
const comment = () => current.comment

const f = (prop, val, list) => R.head(R.filter(R.propEq(prop, val), list)) || {}

const set_document = async (slug) => {
    console.log(`$$$: SET DOCUMENT: ${slug}`)
    current.document = f('slug', slug, documents())
    loaded.comments = []
}

const Firebase = require('./util/firebase.js')

var commentsListenerReference

async function subscribeToComments (slug, revision) {
  const db = await Firebase.database()
  
  // unsubscribe to updates
  if (commentsListenerReference)
    await commentsListenerReference.off()

  // subscribe to updates
  let refpath = `comments/${slug}/${revision}`
  console.log('firebase listening to updates on', refpath)
  commentsListenerReference = db.ref(refpath)
  commentsListenerReference.on('value', function(snapshot) {
    const comments = snapshot.val() || {}
    console.log('received comments update from firebase', comments)
    
    // transform to the right format
    loaded.comments = g(comments)
    console.log('transformed to right format', loaded.comments)
    m.redraw()
  })
}


const set_revision = async (revision) => {
    console.log(`$$$: SET REVISION: ${revision}`)
    current.revision = f('revision', revision, revisions())
    loaded.comments = []
    subscribeToComments(current.document.slug, current.revision.revision)
}

const set_page = (page) => {
    console.log(`$$$: SET PAGE ${page}`)
    current.page = page || 0
}

const set_comment = (c) => {
    console.log(`$$$: SET COMMENT ${JSON.stringify(c)}`)
    console.log('[[[[[[[[[[[[[[[', comments())
    current.comment = f('comment', c, comments())
    console.log('}}}}}}}}}}}}}}}', current.comment)
    current.comment.comment = c
    // const z = R.filter(cc => cc.comment[0]-1===c[0] && cc.comment[1]===c[1], comments())
    console.log('$($($($($($', comment(), current.comment, c)
}

module.exports = {
    init,
    document, documents, set_document,
    revision, revisions, set_revision,
    comments, comment, set_comment,
    page, set_page
}
