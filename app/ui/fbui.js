const m = require('mithril')
const Firebase = require('../util/firebase.js')


const displayNone = {style: {display: 'none'}}

const FirebaseUI = {
    view: function () {
        const attrs = Firebase.showingUI ? {} : displayNone
        return m(`div${Firebase.elementSelector}`, attrs, 'firebase ui will be rendered here')
    }
}

const UserDisplay = {
    view: function (vnode) {
        const user = vnode.attrs.user
        if(!user)
        {
            return m('div#firebase-user', displayNone)
        }
        else
        {
            return m('code#firebase-user',  user.email)
            // return m('div#firebase-user', JSON.stringify({
            //     uid: user.uid,
            //     email: user.email,
            //     photoUrl: user.photoUrl
            // }))
        }
    }
}

const signIn = Firebase.signIn.bind(Firebase)
const signOut = Firebase.signOut.bind(Firebase)
const AuthButton = {
    view: function (vnode) {
        const user = vnode.attrs.user
        if(!user)
            return m('button#firebase-signin-button', {onclick: signIn}, 'sign in')
        else
            return m('button#firebase-signout-button', {onclick: signOut}, 'sign out')
    }
}

const FBUI = {
    oncreate: async function (vnode) {
        console.log('FB: initializing')
        await Firebase.init()
        console.log('FB: initialized')
    },
    view: function () {
        const args = {user: Firebase.user}
        return m('div.fbui', [
            m(AuthButton, args),
            m(UserDisplay, args),
            m(FirebaseUI)
        ])
    }
}

module.exports = FBUI