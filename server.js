/**
 * server.js — Production entry point for Hostinger Node.js Application Manager
 * Compatible with Hostinger hPanel Node.js, cPanel, PM2, and VPS deployments.
 */
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error handling request:', req.url, err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err
    console.log(`> SigsHub Autos running on http://${hostname}:${port}`)
  })
})
