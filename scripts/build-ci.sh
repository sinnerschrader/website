#!/bin/bash
set -e

# fix timestamp issue with gh-pages and set it to be in the future (10 minutes)
date --set="10min"

COMMIT_MESSAGE="$(git log --format=%s -n 1)"

if [[ "$COMMIT_MESSAGE" == *"[skip-ci]"* ]]; then
	echo "Commit subject ends with \"[skip-ci]\", skipping."
	exit 0
fi

STATICS='--src-statics node_modules/sinnerschrader-website-static/statics' npm run build
