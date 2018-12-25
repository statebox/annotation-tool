const argv = require('minimist')(process.argv.slice(2));

const R = require('ramda')
const fs = require('fs')
const cheerio = require('cheerio')

const str = fs.readFileSync(argv.i)
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

const out = JSON.stringify(toc)
if (argv.o) { fs.writeFileSync(argv.o, out) }
else console.log(out);