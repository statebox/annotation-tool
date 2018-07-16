// const firebase = require('firebase')
const m = require('mithril')
const R = require('ramda')

var selected = [-1,-1]
var comments = {}

const Firebase = require('./util/firebase.js')

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
        selected = [pageNumber, comments[pageNumber].length]
        m.redraw()
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
    selected = [pageNumber, selection]
    m.redraw()
}

const selectedComment = () => selected

init()

module.exports = {addComment,pageComments,selectComment,selectedComment}