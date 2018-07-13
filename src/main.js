
require('./ready')
const app = require('./ui/app.js')

module.exports = async (idRef) => {
    await document.ready
    const root = document.getElementById(idRef)
    app(root)
}