// const firebase = require('firebase')
const m = require('mithril')
const R = require('ramda')

const Firebase = require('./util/firebase.js')

const State = require('./state.js')

async function init () {
    const db = await Firebase.database()
    db.ref('comments/').on('value', function(snapshot) {
        comments = snapshot.val() || {}
        m.redraw()
    })
}

const addComment = async function (pageNumber, comment) {
    let [x,y,w,h] = comment
    let c = {x,y,w,h}
    var cs = [c]
    if (R.has('' + pageNumber, comments)) {
        comments[pageNumber].push(c)
    } else {
        comments[pageNumber] = cs
    }
    m.redraw()

    const upd = {}
    upd[`comments/${pageNumber}`] = comments[pageNumber]
    
    const database = await Firebase.database()
    database.ref().update(upd).then(() => {
        let x = comments[pageNumber].length
        selectComment(pageNumber, x)
        console.log('comment stored in firebase')
    })
}

const pageComments = function (pageNumber) {
    if (R.has(pageNumber, comments)) {
        return comments[pageNumber]
    } else {
        return []
    }
}

const selectComment = (pageNumber, selection) => {    
    m.route.set('/documents/:slug/:revision/:page/:selectedComment', {
        slug: State.document().slug,
        revision: State.revision().revision,
        page: pageNumber,
        selectedComment: [pageNumber, selection]
    })
}

const selectedComment = () => State.selection().comment

init()

module.exports = {addComment,pageComments,selectComment,selectedComment}