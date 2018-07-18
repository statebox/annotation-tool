// const firebase = require('firebase')
const m = require('mithril')
const R = require('ramda')

const Firebase = require('./util/firebase.js')

const State = require('./state.js')

async function init () {
}

const addComment = async function (pageNumber, comment) {
    let rev = State.revision().revision
    let slug = State.document().slug

    var comments = pageComments(pageNumber)

    // get the integer screen coordinates
    let [x,y,w,h] = R.map(Math.floor, comment)
    let c = {x,y,w,h}
    
    // add the comment identifier
    const id = comments.length + 1
    c.comment = [pageNumber, id]
    
    // append it to get our new value
    comments.push(c)
    
    // do firebase update
    const upd = {}
    upd[`comments/${slug}/${rev}/${pageNumber}`] = comments
    
    const database = await Firebase.database()
    await database.ref().update(upd)
    console.log('comment stored in firebase', pageNumber, id)

    selectComment(pageNumber, id)
}

const pageComments = function (pageNumber) {
    return R.filter(({comment}) => R.equals(comment[0], pageNumber), State.comments())
}

const selectComment = (pageNumber, selection) => {    
    console.log('CLIKCED COMMENS', pageNumber, selection)
    m.route.set('/documents/:slug/:revision/:page/:selectedComment', {
        slug: State.document().slug,
        revision: State.revision().revision,
        page: pageNumber,
        selectedComment: [pageNumber, selection]
    })
}

const selectedComment = () => State.comment().comment || [0,0]

init()

module.exports = {addComment,pageComments,selectComment,selectedComment}