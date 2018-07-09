const R = require('ramda')
const fs = require('fs')
const cheerio = require('cheerio')

const str = fs.readFileSync('./outline.xmlish')
const $ = cheerio.load(str, {xmlMode: true})

const outlines = $('outlines > outline')

const titles = outlines.map((i, el) => $(el).attr('title')).get()
const levels = outlines.map((i, el) => $(el).attr('level')).get()
const pageno = outlines.map((i, el) => $(el).find('pageno').text()).get()

const s1 = R.zipWith((level, pageno) => ({
    level: level,
    page: pageno
}), levels, pageno)

const toc = R.zipWith(
    ({level,page}, title) => ({level, page, title}),
    s1, titles
)

fs.writeFileSync('toc.json', JSON.stringify(toc))