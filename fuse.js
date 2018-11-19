const { FuseBox, WebIndexPlugin, EnvPlugin } = require('fuse-box')

const fuse = FuseBox.init({
  homeDir: 'src',
  target: 'browser@es6',
  output: 'dist/$name.js',
  automaticAlias: false,
  alias: {
    src: '~/'
  },
  plugins: [
    WebIndexPlugin({
      template: 'static/index.html'
    }),
    EnvPlugin({
      NODE_ENV: 'dev'
    })
  ]
})

fuse.dev({
  port: 3000
})

fuse
  .bundle('app')
  .instructions('> index.ts')
  .hmr()
  .watch()

fuse.run()