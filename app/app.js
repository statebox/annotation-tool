const m = require('mithril')
const R = require('ramda')

const firebase = require('firebase')

const ready = require('./ready.js')

module.exports = async function app(eltId) {

    // TODO dont monkey patch
    await ready()

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

    const Document = require('./document.js')
    const UI = require('./ui.js')
    const {SignIn} = require('./auth.js')

    var DocumentList = {
        oninit: Document.loadList,
        view: function () {
            return m(".user-list", Document.list.map(function (user) {
                return m("a.user-list-item", { href: `/edit/${user.revision}/1`, oncreate: m.route.link },
                    m('code', user.revision)
                )
            }))
        }
    }

    const root = document.getElementById(eltId)
    m.route.prefix('#')
    m.route(root, "/list", {
        "/login/do": {
            render: function () {
                return m(SignIn)
            }
        },
        "/list": {
            render: function () {
                return m(DocumentList)
            }
        },
        "/edit/:revision/:page": {
        render: function (vnode) {
                return m(UI, vnode.attrs)
            }
        }
    })
}