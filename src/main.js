require('./ready.js')

const R = require('ramda')

const firebase = require('firebase')
const firebaseui = require('firebaseui')

// PDFJS.disableWorker = true;

const tocData = require('../toc.json')
const m = require('mithril')

function tocDOM () {
    const line = ({title,level,page}) => m('a', {
        class: 'toc-entry',
        href: `#page=${page}`,
        // onclick: function () {console.log(`goto #page=${page}`)},
        style: `padding-left: ${level * 16}px`
    }, title)
    return m('div', {class: 'tocTree'}, R.map(line, tocData))
}

const providers = [
    // Leave the lines as is for the providers you want to offer your users.
    //   firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //   firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //   firebase.auth.PhoneAuthProvider.PROVIDER_ID
]

async function signOut () {
    await firebase.auth().signOut()    
}

async function signIn () {
    const ui = new firebaseui.auth.AuthUI(firebase.auth())
    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
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

const signOutBtn = user => m('button', {id: 'logout', onclick: signOut}, `${user.email} — Log Out`)
const signInBtn = m('button', {id: 'login', onclick: signIn}, 'Login/Signup')

function authDOM (user) {
    return m('div', {id: 'auth'}, user ? signOutBtn(user) : signInBtn)
}

module.exports = async function start (url, canvas, toc, comments, auth) {
    // TODO dont monkey patch
    await document.ready

    // Initialize Firebase
    const config = {
        apiKey: "AIzaSyDn-oqjahzC8Y_MSPRV2IykP9u6nm_BGDM",
        authDomain: "saywat-ce50a.firebaseapp.com",
        databaseURL: "https://saywat-ce50a.firebaseio.com",
        projectId: "saywat-ce50a",
        storageBucket: "",
        messagingSenderId: "537650547693"
    }

    await firebase.initializeApp(config);

    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

    m.render(auth, authDOM())

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            m.render(auth, authDOM(user))
            //   // User is signed in.
            //   var displayName = user.displayName;
            //   var email = user.email;
            //   var emailVerified = user.emailVerified;
            //   var photoURL = user.photoURL;
            //   var isAnonymous = user.isAnonymous;
            //   var uid = user.uid;
            //   var providerData = user.providerData;
        } else {
            m.render(auth, authDOM(null))
        }
    })

    window.addEventListener('input', function (e) {
        console.log("input event detected! coming from this element:", e.target);
    }, false);
       

    const context = canvas.getContext('2d');

    m.render(toc, tocDOM())

    const pdf = await PDFJS.getDocument(url)
    const page = await pdf.getPage(5)

    var scale = 1.0;
    var viewport = page.getViewport(scale);
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({
        canvasContext: context,
        viewport: viewport
    })
    
    var bg = canvas.toDataURL("image/png");
    var fcanvas = new fabric.Canvas("pdfcanvas", {
        // selection: false
    });

    fcanvas.setBackgroundImage(bg,fcanvas.renderAll.bind(fcanvas));
    // fcanvas.setWidth(canvas.width);
    // fcanvas.setHeight(canvas.height);
    

    fcanvas.on('mouse:down', function(options) {
        // TODO hook comment selection / creation
      console.log(options.e.clientX, options.e.clientY, options.target);
    });

    var rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 120,
        height: 80,
        fill: '#00FF00',
        opacity: 0.5,
        transparentCorners: true,
        borderColor: "gray",
        cornerColor: "gray",
        hasRotatingPoint: false,
        // strokeWidth: '1px',
        // stroke: 'black'
        // TODO only select 
        // selectable: false
    });

    fcanvas.add(rect);
    fcanvas.renderAll();
}