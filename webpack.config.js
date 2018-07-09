const path = require('path')

module.exports = {
    mode: 'development',
    // mode: 'production',
    entry: path.join(__dirname, 'src', 'main.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "bundle.js",
        library: 'Commenter',
        libraryTarget: 'var',
    }
}
