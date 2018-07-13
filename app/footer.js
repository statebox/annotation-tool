const m = require('mithril')

module.exports = {
    view: () => m(
        "footer.flexContainer.flexCenter.blueBackground.whiteText.height50",
        ('a', {href: "https://statebox.org"}, "statebox.org")
    )
}