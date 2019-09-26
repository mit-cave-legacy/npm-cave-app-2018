const path = require('path')
const Bundler = require('parcel')
const bundler = new Bundler(path.resolve(__dirname + '/src/index.html'), {
  cache: false,
  minify: true,
  detailedReport: true,
  autoInstall: false
})
bundler
  .bundle()
  .then(x => {
    process.exit(0)
  })
  .catch(e => {
      console.error(e)
      process.exit(1)
    }
  )
