const R = require('ramda')

const m = require("mithril")


const exampleDocuments = [
    {
        slug: 'monograph',
        title: 'The Mathematical Specification of the Statebox language'
    },
    {
        slug: 'computational',
        title: 'Computational Petri Nets: Adjunctions Considered Harmful'
    },
    {
        slug: 'executions',
        title: 'Executions in (Semi-)Integer Petri Nets are Compact Closed Categories'
    },
    {
        slug: 'bricks',
        title: 'Foundations of brick diagrams'
    },
    {
        slug: 'zksnarks',
        title: 'Mapping finite state machines to zk-SNARKS Using Category Theory'
    },
    {
        slug: 'idrisct',
        title: 'Idris-ct:A Library to do Category Theory in Idris'
    }
]

// using a rawgit url is not possible because the gh repo is private
// url: 'https://github.com/statebox/monograph/raw/32588f68459f1076c84775c8fcdc7d6cd73387b3/build/main.pdf',
// url: 'https://cdn.rawgit.com/statebox/monograph/32588f68459f1076c84775c8fcdc7d6cd73387b3/build/main.pdf',

// const qplRevisions = [
//     {
//         timestamp: '2018-05-18T10:02:13+00:00',
//         revision: 'v2',
//         url: 'https://arxiv.org/pdf/1805.05988.pdf',
//         totalPages: 18,
//         toc: toc
//     }
// ]    

const allRevisions = {
    monograph: [{
        timestamp: '2018-07-16T00:00:00+00:00',
        revision: '32588f68459f1076c84775c8fcdc7d6cd73387b3',
        url: 'pdfs/monograph-32588f68459f1076c84775c8fcdc7d6cd73387b3.pdf',
        totalPages: 79
    },
    {
        timestamp: '2018-12-25T00:00:00+00:00',
        revision: 'c4b244be683b8d23948cdcea420a84bd08299faa',
        url: 'pdfs/monograph-c4b244be683b8d23948cdcea420a84bd08299faa.pdf',
        totalPages: 91
    }],
    bricks: [{
        timestamp: '2019-08-28T00:00:00+00:00',
        revision: 'v1',
        url: 'https://arxiv.org/pdf/1908.10660.pdf',
        totalPages: 12
    }],
    computational: [{
        timestamp: '2019-05-08T00:00:00+00:00',
        revision: 'v2',
        url: 'https://arxiv.org/pdf/1904.12974.pdf',
        totalPages: 29
    }],
    executions: [{
        timestamp: '2019-01-29T00:00:00+00:00',
        revision: 'v3',
        url: 'https://arxiv.org/pdf/1805.05988.pdf',
        totalPages: 18
    }],
    zksnarks: [{
        timestamp: '2019-09-14T00:00:00+00:00',
        revision: 'v2',
        url: 'https://arxiv.org/pdf/1909.02893.pdf',
        totalPages: 18
    }],
    idrisct: [{
        timestamp: '2019-12-16T00:00:00+00:00',
        revision: 'v1',
        url: 'https://arxiv.org/pdf/1912.06191.pdf',
        totalPages: 13
    }]
}


const loaded = {
  comments: []
}

const current = {
    document: {},
    revision: {},
    page: 0,
    comment: {},
    toc: [],
}

const init = async () => {
}

const documents = () => exampleDocuments
const revisions = () => allRevisions[current.document.slug] || [] // all revs for slug

// transform comments
// {"k":[{x,y,w,h}]} |--> [{comment:[k,i],x,y,w,h}]
const mapIndexed = R.addIndex(R.map)
const addComment = k => (d,i) => R.assoc('comment', [parseInt(k), (i+1)], d)
const g = cs => R.flatten(R.map(k => mapIndexed(addComment(k), cs[k]), R.keys(cs)))
// const addComment = k => (d,i) => R.compose(
//     R.assoc('comment', i),
//     R.assoc('page', parseInt(k))
//   )(d)

// all comments for /slug/rev/page
// let exComments = g(exampleComments)
const comments = () => loaded.comments

const document = () => current.document // all slugs
const revision = () => current.revision
const page = () => current.page
const comment = () => current.comment
const toc = () => current.toc

const f = (prop, val, list) => R.head(R.filter(R.propEq(prop, val), list)) || {}

const set_document = async (slug) => {
    console.log(`$$$: SET DOCUMENT: ${slug}`)
    current.document = f('slug', slug, documents())
    loaded.comments = []
    window.document.title = current.document.title + ' – Annotation Tool – Statebox';
}

const set_toc = (toc) => {
    current.toc = toc
    m.redraw()
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
    
    // update comments
    set_comment(current.comment.comment)

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

const add_comment_to_thread = async (subject, markdown, opts = {}) => {
    const timestamp = new Date().toISOString()
    const author = Firebase.user.email
    const msg = {timestamp, author, subject, markdown}
    current.comment.comments = current.comment.comments || []
    current.comment.comments.push(msg)
    if (opts.closed !== undefined) {
        current.comment.closed = opts.closed
    }

    // do firebase update
    const slug = current.document.slug
    const rev = current.revision.revision
    const [page, commentNr] = current.comment.comment
    const key = `comments/${slug}/${rev}/${page}/${commentNr - 1}`
    const upd = {}
    upd[key] = current.comment
    
    console.log(upd)
    const database = await Firebase.database()
    await database.ref().update(upd)
    console.log('comment stored in firebase', page, commentNr)
}

module.exports = {
    init,
    document, documents, set_document,
    revision, revisions, set_revision,
    comments, comment, set_comment,
    toc, set_toc,
    page, set_page,
    add_comment_to_thread
}
