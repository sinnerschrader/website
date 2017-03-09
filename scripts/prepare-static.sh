#!/bin/bash
set -x
set -e

if [ ! -d node_modules/sinnerschrader-website-static ] ; then
	mkdir -p node_modules/sinnerschrader-website-static/statics/fonts
	mkdir -p node_modules/sinnerschrader-website-static/statics/icons
	mkdir -p node_modules/sinnerschrader-website-static/statics/images
	mkdir -p node_modules/sinnerschrader-website-static/statics/videos
	echo '{"name": "website-static", "version": "0.0.1"}' > node_modules/website-static/package.json
	echo 'const path = require("path");module.exports = path.join(__dirname, "statics");'  > node_modules/website-static/index.js
fi
