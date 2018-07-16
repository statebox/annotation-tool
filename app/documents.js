// revisions actually
const m = require('mithril')
const R = require('ramda')

const exampleDocuments = [
    {
        revision: 'c4a29add5ee31e49031650e5c610a2de3bf76eaa',
        url: 'https://arxiv.org/pdf/1805.05988.pdf',
        totalPages: 18
    },
    {
        revision: '7d5d9651e2b4b2fefa52772a86c160c86c10f4f0',
        url: 'pdfs/main.pdf',
        totalPages: 18
    }
]

const delayer = (ts, fn) => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('resolving')
        resolve(fn())
        m.redraw()
    }, ts)
})

var Documents = {
    list: exampleDocuments,
    loadList: function () {
        // return m.request({
        //     method: "GET",
        //     url: "https://rem-rest-api.herokuapp.com/api/users",
        //     withCredentials: true,
        // })
        // .then(function(result) {
        //     Document.list = result.data
        // })
    },

    current: {},
    load: function (revision) {
        console.log('loading', revision)
        return delayer(1000, () => {
            Documents.current = R.head(R.filter(R.propEq('revision', revision), Documents.list))
        })

        // return m.request({
        //     method: "GET",
        //     url: "https://rem-rest-api.herokuapp.com/api/users/" + id,
        //     withCredentials: true,
        // })
        // .then(function(result) {
        //     Document.current = result
        // })
    },

    save: function () {
        // return m.request({
        //     method: "PUT",
        //     url: "https://rem-rest-api.herokuapp.com/api/users/" + Document.current.id,
        //     data: Document.current,
        //     withCredentials: true,
        // })
    }
}

module.exports = Documents