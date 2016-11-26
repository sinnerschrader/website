#!/bin/bash
##
# Assumes to be run in npm context:
# - node_modules/.bin in $PATH
##
set -e

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

if [ $(git log  -n 1 --oneline |grep "Deploy to GitHub Pages" |wc -l) -eq 1 ] ; then
    echo "Last commit done by travis itself; skipping."
    exit 0
fi

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
if [ $(git status --porcelain docs | wc -l) -lt 1 ]; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi

# Save some useful information
SHA=`git rev-parse --verify HEAD`

git config user.name "SinnerSchrader"
git config user.email "jobs@sinnerschrader.com"
git remote add upstream "https://$GH_TOKEN@github.com/$TRAVIS_REPO_SLUG.git"

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add --all docs
git commit -m "Deploy to GitHub Pages: ${SHA}" --author "$(git --no-pager show -s --format='%an <%ae>' $TRAVIS_COMMIT)"

# Now that we're all set up, we can push.
git push -q upstream "HEAD:refs/heads/deploy-$TRAVIS_COMMIT"

# - GH_TOKEN
OUTPUT=$(pull-request \
	--base "$TRAVIS_REPO_SLUG:master" \
	--head "$TRAVIS_REPO_SLUG:deploy-$TRAVIS_COMMIT" \
	--title "Deploy to GitHub Pages" \
	--body "Deploy to GitHub Pages: #${TRAVIS_PULL_REQUEST} - ${SHA}" \
	--message "Deploy to GitHub Pages: ${SHA}"  \
	--token "$GH_TOKEN")

TRIMMED=${OUTPUT#Success}
URL=$(node -e "console.log(($TRIMMED).html_url)")

# - GITHUB_USERNAME
# - GITHUB_ACCESS_TOKEN
issue-comment \
	--once \
	"$TRAVIS_REPO_SLUG#$TRAVIS_PULL_REQUEST" \
	"Deploy to production by merging $URL"
