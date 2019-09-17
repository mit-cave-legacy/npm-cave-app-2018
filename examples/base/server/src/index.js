require('dotenv').config()
import Express from 'express'
import * as config from './config'
import './events'
import { sevt } from './serverEventTypes'
import { configureIo, dispatch } from './store'

const startServer = () => {
  const app = new Express()
  app.use(Express.static(config.RESOURCE_DIR))

  if (!config.isProduction) {
    const path = require('path')
    const Bundler = require('parcel')
    const bundler = new Bundler(
      // todo. see if parcel builds in docker without html in client/src
      path.resolve(__dirname + './../../client/src/index.html'),
      { cacheDir: '.cache-client', outDir: 'dist-client' }
    )
    app.use(Express.static(path.resolve(__dirname + './../dist-client')))
    app.use(bundler.middleware())
  }

  app.get('*', (req, res) => {
    res.sendFile(config.RESOURCE_DIR + '/index.html')
  })
  return app.listen(config.PORT)
}

const server = startServer()
dispatch(sevt.INITIALIZE_DB)
export const io = require('socket.io')(server)
configureIo(io)
