const path = require('path')

module.exports = {
    mode: 'development',
    // mode: 'production',
    entry: "./demo.js",
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "bundle.js",
        library: 'Summit',
        libraryTarget: 'var',
    }
}
