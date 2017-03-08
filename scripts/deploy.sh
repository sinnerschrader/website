#!/bin/bash
##
# Assumes to be run in npm context:
# - node_modules/.bin in $PATH
##
set -e
set -x

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

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
# disabled for now, because status is not enough for remote repo diff
#if [ $(git status --porcelain docs | wc -l) -lt 1 ]; then
#    echo "No changes to the output on this push; exiting."
#    exit 0
#fi

## get into the docs folder -> the published page just needs this data
cd docs

SHORT_COMMIT=$(git log --format=%h -n 1 $TRAVIS_COMMIT)
PULL_REQUEST_ID="$(git log --format=%s -n 1 $TRAVIS_COMMIT | perl -nle 'print $1 if /#(\d+)/' | tail -n 1)"

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
# disabled for now, because status is not enough for remote repo diff
#if [ $(git status --porcelain docs | wc -l) -lt 1 ]; then
#	echo "No changes to the output on this push; exiting."
#	if [ -n "$PULL_REQUEST_ID" ]; then
#		issue-comment \
#			--once \
#			"$TRAVIS_REPO_SLUG#$PULL_REQUEST_ID" \
#			"Hello!<br/>
#			I built the commit $TRAVIS_COMMIT caused by this pull request and found out it produces no changes to the website \`docs\`.<br/>
#			Because of this I decided to create no Pull Request to sinnerschrader/sinnerschrader-website to deploy changes to production.<br/>
#			Cheers"
#	fi
#	exit 0
#fi

AUTHOR="$(git --no-pager show -s --format='%an <%ae>' $TRAVIS_COMMIT)"

git init .
git config user.name "SinnerSchrader"
git config user.email "jobs@sinnerschrader.com"
git remote add upstream "git@github-deploy:sinnerschrader/sinnerschrader-website-githubpage.git"
git add --all .

if [ -n "$PULL_REQUEST_ID" ]; then
	git commit -m "Deploy build changes for ${SHORT_COMMIT} of #${PULL_REQUEST_ID} [skip-ci]" --author "$AUTHOR"
else
	git commit -m "Deploy build changes for ${SHORT_COMMIT} [skip-ci]" --author "$AUTHOR"
fi

# Now that we're all set up, we can push.
git push --force --quiet upstream master
