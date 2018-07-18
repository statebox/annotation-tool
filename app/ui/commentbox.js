const m = require('mithril')
const stream = require('mithril/stream')

const md = require('markdown-it')()
    .use(require('markdown-it-katex'))

function setHeight(domNode) {
    domNode.style.height = ''; // reset before recalculating
    domNode.style.height = `${domNode.scrollHeight}px`;
}

// ![](https://media.giphy.com/media/l3UcrZHrGW2CjHXqM/giphy.gif)

const example = `Type some *markdown* here!

This supports $\\KaTeX$ math, such as

$$
\\tau_i : \\mathcal{M}^\\mathbb{Z}_P \\rightarrow \\mathcal{M}^\\mathbb{Z}_P
$$
`

function MarkdownComment () {

    const value = stream(example)
    const markdown = value.map(md.render.bind(md))
    
    function Textarea () {
        return {
            oncreate({ dom }) {
                value.map(() => setHeight(dom))
            },
            view() {
                return m('textarea', {
                        style: 'width: 100%',
                        value: value(),
                        placeholder: 'Enter some text',
                        oninput: m.withAttr('value', value)
                    })
            }
        }
    }

    return {
        view() {
            return m('.markdown-comment', [
                    m('div', m.trust(markdown())),
                    m('hr'),
                    m(Textarea),
                    m('hr'),
                    m('.buttons', [
                        m('button', 'delete'),
                        m('button', 'save')
                    ])
            ])
        }
    }
}

module.exports = MarkdownComment