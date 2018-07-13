const m = require('mithril')
const stream = require('mithril/stream')
const R = require('ramda')
const marked = require('marked')

const TOC = require('./toc.js')
const Header = require('./header.js')
const Annotations = require('./annotation.js')
const Comments = require('./comments.js')

// TODO move toc and select to here
// var state = {
//     toc: require('../toc.json')
// }


function setHeight(domNode) {
    domNode.style.height = ''; // reset before recalculating
    domNode.style.height = `${domNode.scrollHeight}px`;
}
  
function Textarea() {
    const value = stream(`Type some *markdown* here!
---
<img src="https://statebox.org/assets/images/background-images/stbx_palms_text.png" style="width:200px">
---
## it really works
_oh yeah_
But <a href="javascript:alert('hi')">this is not good</a>
can make a comment stealing the session?
`)
    const markdown = value.map(marked)
    return {
        oncreate({ dom }) {
            value.map(() => setHeight(dom))
        },
        view() {
            return [
                m('textarea', {
                    value: value(),
                    placeholder: 'Enter some text',
                    oninput: m.withAttr('value', value)
                }),
                m('div', m.trust(markdown()))
            ]
        }
    }
}

var Comment = {
    view: function () {
        return m('div.comments', [
            m('div', JSON.stringify(Comments.selectedComment())),
            m(Textarea)
        ])
    }
}

const UI = {
    view: (vnode) => m(".flexContainer.flexColumn.fullHeight", [
        m(Header, vnode.attrs),
        m('.flexContainer.flexItem', [
            m('aside.sidebar.sidebarLeft', m(Comment)),
            m('main.flexItem.main', m(Annotations, vnode.attrs)),
            m('aside.sidebar.sidebarRight', m(TOC, vnode.attrs))
        ])
    ])
}

module.exports = UI