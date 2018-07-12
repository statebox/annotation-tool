const firebaseui = require('firebaseui')
const m = require('mithril')

module.exports = function (firebase, providers) {
    var user = undefined

    async function signIn () {
        const ui = new firebaseui.auth.AuthUI(firebase.auth())
        const uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    user = authResult.user
                    m.redraw()
                    m.route.set('/login/success')
                    // User successfully signed in.
                    // Return type determines whether we continue the redirect automatically
                    // or whether we leave that to developer to handle.
                    return false;
                },
                uiShown: function() {
                    // The widget is rendered.
                    // Hide the loader.
                    // document.getElementById('loader').style.display = 'none';
                }
            },
            // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
            signInFlow: 'popup',
            signInSuccessUrl: 'http://localhost:3000/',
            signInOptions: providers,
            // Terms of service url.
            tosUrl: 'https://statebox.org/tos.html'
        };
        ui.start('#firebaseui-auth-container', uiConfig)
    }
    
    var SignIn = {
        oncreate: async function (vnode) {
            signIn()
        },
        view: function () {
            return m('div', {id: 'firebaseui-auth-container'})
        }
    }

    async function signOut () {
        await firebase.auth().signOut()    
    }
    
        
    const signOutBtn = (user) => m('button', {id: 'logout', onclick: signOut}, `${user.email} — Log Out`)
    const signInBtn = m('button', {id: 'login', onclick: () => m.route.set('/login/do')}, 'Login/Signup')

    var Authing = {
        view: function (vnode) {
            return m('div', [
                user ? signOutBtn(user) : signInBtn
            ])
        }
    }

    return {Authing, SignIn}
}