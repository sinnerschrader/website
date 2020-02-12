#!/bin/bash
set -e
set -x
set -u

if [ "$TRAVIS" != "true" ]; then
    echo "Skipping deploy - this is not running on Travis; skipping."
    exit 0
fi

if [ "$TRAVIS_BRANCH" != "master" ]; then
    echo "Skipping deploy - this is not the master branch; skipping."
    exit 0
fi

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
    echo "Skipping deploy - this is a pull request; skipping."
    exit 0
fi

if [ "$TRAVIS_SECURE_ENV_VARS" != "true" ]; then
    echo "Skipping deploy - this has no access to secure env vars; skipping."
    exit 0
fi

COMMIT_MESSAGE="$(git log --format=%s -n 1)"

if [[ "$COMMIT_MESSAGE" == *"[skip-ci]"* ]]; then
	echo "Commit subject ends with \"[skip-ci]\", skipping."
	exit 0
fi

SHORT_COMMIT=$(git log --format=%h -n 1 $TRAVIS_COMMIT)
AUTHOR="$(git --no-pager show -s --format='%an <%ae>' $TRAVIS_COMMIT)"

cd docs

git init .
git config user.name "S2 Github Bot"
git config user.email "s2-github-bot@sinnerschrader.com"
git remote add upstream "git@github.com:sinnerschrader/website-production.git"
git add --all .

git commit -m "Deploy sinnerschrader/sinnerschrader-website#${SHORT_COMMIT}: ${COMMIT_MESSAGE}" --author "$AUTHOR"

# Now that we're all set up, we can push.
git push --force --quiet upstream master
