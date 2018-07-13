// revisions actually
const m = require('mithril')
const R = require('ramda')

const exampleDocuments = [
    {
        revision: 'c4a29add5ee31e49031650e5c610a2de3bf76eaa',
        url: 'pfds/main.pdf',
        totalPages: 46
    },
    {
        revision: '7d5d9651e2b4b2fefa52772a86c160c86c10f4f0',
        url: 'pfds/main.pdf',
        totalPages: 60
    }
]

const delayer = (ts, fn) => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('resolving')
        resolve(fn())
        m.redraw()
    }, ts)
})

var Document = {
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
            Document.current = R.head(R.filter(R.propEq('revision', revision), Document.list))
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

module.exports = Document