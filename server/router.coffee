express = require('express')
request = require('request')

proxy = (res, target) ->
  request(target)
    .on('error', (e) ->
      res.send(500, e)
    )
    .pipe(res)

router = express.Router()


router.route('/')
  .get((req, res) ->
    res.render('index.html')
  )

router.route('/sinnerschrader/*')
  .get((req, res) ->
    proxy(res, 'https://sinnerschrader.com' + req.url.replace(/sinnerschrader\/(.*)/, "$1"))
  )


#generic route handler
router.route('*')
  .get((req, res) ->
    res.render req.url.replace(/^\/?([^?#]+).*$/, "$1")
  )

router.use((req, res) ->
  res.status(404)
)

router.use((err, req, res, next) ->
  console.error(err.stack)

  res.status(500)
)

module.exports = router
