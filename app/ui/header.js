const m = require('mithril')
const R = require('ramda')

// State
const State = require('../state.js')

// UI
const FirebaseUI = require('./fbui.js')
const Revision = require('./revision.js')

module.exports = {
    view: function (vnode) {
        return m(".flexContainer.blueBackground",[
            m(".flexItem.flexStart", m(Revision, vnode.attrs)),
            m(".flexItem.flexEnd", m(FirebaseUI))
        ])
    }
}