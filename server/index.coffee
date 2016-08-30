express      = require('express')
morgan       = require('morgan')
errorhandler = require('errorhandler')
compression  = require('compression')
bodyParser   = require('body-parser')
favicon      = require('serve-favicon')

basicAuth    = require('basic-auth-connect');

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

app.use(favicon(path.join(__dirname, '../static/images/favicons/favicon.ico')))
app.use(express.static(path.join(__dirname, '../static')))

app.use('/js/app.js',    jsCompiler.middleware(path.join(__dirname, '../src/js/app.coffee'), app.get('env') isnt 'production'))
app.use('/css/app.css', cssCompiler.middleware(path.join(__dirname, '../src/css', 'app.'+config.css.engine), app.get('env') isnt 'production'))

if app.get('env') is 'development'
  app.use(morgan('dev'))
  app.use(errorhandler())
else
  app.use(morgan('short'))

if app.get('env') is 'production'
  credentials =
    's2-2016'  : 'stillDay0ne'

  app.use(basicAuth( (user, pass) ->
    return credentials[user] and credentials[user] is pass;
  ))

app.use(require('./router'))

app.listen(app.get('port'), ->
  console.info('\x1b[36mExpress server using \x1b[1m%s\x1b[0m \x1b[36mas CSS pre-processor\x1b[0m', config.css.engine)
  console.info('\x1b[36mExpress server started in \x1b[1m%s\x1b[0m \x1b[36mmode, listening on port \x1b[1m%s\x1b[0m\x1b[0m', app.get('env'), app.get('port'))
)
