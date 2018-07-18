const m = require('mithril')
const Revision = require('./revision.js')

// UI
const FirebaseUI = require('./fbui.js')
module.exports = {
    view: function (vnode) {
        return m(".flexContainer.blueBackground",[
            m(".flexItem.flexStart", [
                m(FirebaseUI),
                m(Revision, vnode.attrs)
            ])
        ])
    }
}