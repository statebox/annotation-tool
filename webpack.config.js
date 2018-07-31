const path = require('path')

module.exports = {
    mode: 'production',
    entry: path.join(__dirname, 'app', 'app.js'),
    output: {
        path: path.join(__dirname, 'public'),
        filename: "bundle.js",
        library: 'Commenter',
        libraryTarget: 'var',
    }
}
