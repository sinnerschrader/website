#!/bin/bash
set -e

if [[ "$(git log --format=%s -n 1 $TRAVIS_COMMIT)" == *"[skip-ci]"* ]]; then
	echo "Commit subject ends with \"[skip-ci]\", skipping."
	exit 0
fi

STATICS='--src-statics node_modules/sinnerschrader-website-static/statics' npm run build
