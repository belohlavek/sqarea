const { FuseBox, WebIndexPlugin, EnvPlugin } = require('fuse-box')
const { TypeHelper } = require('fuse-box-typechecker')

class TypeCheckerPlugin {
  constructor() {
    this.checker = TypeHelper({
      tsConfig: './tsconfig.json',
      basePath: './',
      tsLint: './tslint.json',
      name: 'Test Sync'
    })
    this.checker.startTreadAndWait()
  }

  postBundle() {
    this.checker.useThreadAndTypecheck()
  }
}

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
    }),
    new TypeCheckerPlugin()
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
