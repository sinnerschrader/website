express      = require('express')
morgan       = require('morgan')
errorhandler = require('errorhandler')
compression  = require('compression')
bodyParser   = require('body-parser')
favicon      = require('serve-favicon')

cons         = require('consolidate')
path         = require('path')

config       = require('../package.json').config;
jsCompiler   = require('./lib/js-compiler')
cssCompiler  = require('./lib/css-compiler')

app = express()

app.engine('html', cons.ect)
app.set('port', process.env.PORT or 3000)
app.set('view engine', 'ect')
app.set('views', path.join(__dirname, '../styleguide/pages') )
app.use(compression())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(favicon(path.join(__dirname, '../static/images/favicons/fi_favicon.ico')))
app.use(express.static(path.join(__dirname, '../static')))

app.use('/js/app.js',    jsCompiler.middleware(path.join(__dirname, '../src/js/app.coffee'), app.get('env') isnt 'production'))
app.use('/css/app.css', cssCompiler.middleware(path.join(__dirname, '../src/css', 'app.'+config.css.engine), app.get('env') isnt 'production'))

if process.env.NODE_ENV is 'development'
  app.use(morgan('dev'))
  app.use(errorhandler())
else
  app.use(morgan('short'))

app.use(require('./router'))

app.listen(app.get('port'), ->
  console.info('\x1b[36mExpress server using \x1b[1m%s\x1b[0m \x1b[36mas CSS pre-processor\x1b[0m', config.css.engine)
  console.info('\x1b[36mExpress server started in \x1b[1m%s\x1b[0m \x1b[36mmode, listening on port \x1b[1m%s\x1b[0m\x1b[0m', app.get('env'), app.get('port'))
)
