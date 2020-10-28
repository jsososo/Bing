const updateData = require('./util/updateData');
const {createServer} = require('http');
const {parse} = require('url');
const next = require('next');
const moment = require('moment');

const dev = process.argv.slice(2)[0] === 'dev';
const app = next({dev});
const handle = app.getRequestHandler();
const port = 3002;
app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const {pathname, query} = parsedUrl

    if (pathname === '/') {
      app.render(req, res, `/${moment().format('YYYYMMDD')}`, query);
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(port, (err) => {
    if (err) throw err;
    updateData(true);
    console.log(`> Ready on http://localhost:${port}`)
  })
})
