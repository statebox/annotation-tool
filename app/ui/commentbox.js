const m = require('mithril')
const stream = require('mithril/stream')

const State = require('../state.js')

const md = require('markdown-it')()
    .use(require('markdown-it-katex'))

function setHeight(domNode) {
    domNode.style.height = ''; // reset before recalculating
    domNode.style.height = `${domNode.scrollHeight}px`;
}

const example = `Type some *markdown* here!

This supports $\\KaTeX$ math, such as

$$
\\tau_i : \\mathcal{M}^\\mathbb{Z}_P \\rightarrow \\mathcal{M}^\\mathbb{Z}_P
$$

And inline images

![](https://media.giphy.com/media/l3UcrZHrGW2CjHXqM/giphy.gif)

`

const example2 = `
You wrote

$$
\\tau_i : \\mathcal{M}^\\mathbb{Z}_P \\rightarrow \\mathcal{M}^\\mathbb{Z}_P
$$

But that should probably be:

$$1+1=2$$

What do you think?
`

function MarkdownComment () {
    const subject = stream('This Is Your Subject')
    const value = stream(example)
    const markdown = value.map(md.render.bind(md))
    
    function Textarea () {
        return {
            oncreate({ dom }) {
                value.map(() => setHeight(dom))
            },
            view() {
                return m('textarea.input', {
                        style: 'width: 100%',
                        value: value(),
                        placeholder: 'Enter some text',
                        oninput: m.withAttr('value', value)
                    })
            }
        }
    }

    function Subject () {
        return {
            view() {
                return m('input.input', {
                    type: 'text',
                    placeholder: 'Subject',
                    value: subject(),
                    oninput: m.withAttr('value', subject)
                })
            }
        }
    }

    return {
        view() {
            const f = () => {
                let c = State.comment().comment
                // TODO add firebase security rule
                if(c && c[0] === 0 || c[1] === 0) {
                    console.error('cannot add comment with page=0 or id=0')
                    return
                }

                State.add_comment_to_thread(subject.valueOf().trim(), value.valueOf().trim())
                console.log('sav', value.valueOf())
            }
            return m('.markdown-comment', [
                m('h4', subject()),
                m('div', m.trust(markdown())),
                m('hr'),
                m(Subject),
                m(Textarea),
                m('.buttons', [
                    m('button', {onclick: f}, 'save')
                ])
            ])
        },
        value() {
            value.valueOf()
        }
    }
}

module.exports = MarkdownComment