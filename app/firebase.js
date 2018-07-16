const m = require('mithril')

const firebase = require('firebase/app')
require('firebase/auth')
require('firebase/database')

const firebaseui = require('firebaseui')

const providers = [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //   firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //   firebase.auth.GithubAuthProvider.PROVIDER_ID,
    //   firebase.auth.PhoneAuthProvider.PROVIDER_ID
]

// Initialize Firebase
const config = {
    apiKey: "AIzaSyDn-oqjahzC8Y_MSPRV2IykP9u6nm_BGDM",
    authDomain: "saywat-ce50a.firebaseapp.com",
    databaseURL: "https://saywat-ce50a.firebaseio.com",
    projectId: "saywat-ce50a",
    storageBucket: "",
    messagingSenderId: "537650547693"
}

const urls = {
    success: 'http://localhost:3000/success',
    tos: 'http://localhost:3000/tos.html'
}

const Firebase = {
    elementSelector: '#firebaseui-auth-container',
    user: null,
    showingUI: false,
    ui: null,
    init: async function init () {

        // made idempotent
        if (firebase.apps.length) {
            console.log('already initialized')
            return
        }

        await firebase.initializeApp(config);

        // ensure user is persisted accross browser sessions
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)    
    
        // listen to authentication status changes
        firebase.auth().onAuthStateChanged((u) => {
            console.log('FB => AUTH STATE CHANGE', u)
            Firebase.user = u ? u : null
            m.redraw()
        })

        // create FB ui
        if (!Firebase.ui) {
            Firebase.ui = new firebaseui.auth.AuthUI(firebase.auth())
            console.log(Firebase.ui.isPendingRedirect())
        }
        
        // login after user used accountchooser
        if (Firebase.ui.isPendingRedirect()) {
            Firebase.signIn()
        }

    },
    signIn: async function signIn () {
        const config = {
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    console.log('FB => SIGN IN SUCCESS', authResult, redirectUrl)
                    user = authResult.user
                    Firebase.showingUI = false
                    m.redraw()
                    return false
                },
                uiShown: function() {
                    console.log('FB => SHOWING UI')
                    Firebase.showingUI = true
                    m.redraw()
                }
            },
            signInFlow: 'popup',
            signInSuccessUrl: urls.success,
            tosUrl: urls.tos,
            signInOptions: providers
        }
        return await Firebase.ui.start(Firebase.elementSelector, config)
    },
    signOut: async function signOut () {
        return await firebase.auth().signOut()
    },
    database: async function database () {
        // ensure app is initialized
        await Firebase.init()
        
        // return root database reference
        return firebase.database()
    }
}

module.exports = Firebase
