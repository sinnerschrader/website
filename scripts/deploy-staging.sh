#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

if [ "$TRAVIS" != "true" ]; then
    echo "Skipping deploy - this is not running on Travis; skipping."
    exit 0
fi

if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    echo "Skipping deploy - this is not a Pull Request; skipping."
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

git clone "https://$GH_TOKEN@github.com/sinnerschrader/sinnerschrader-website-staging.git" .stage
cp -r ./docs ./stage/$TRAVIS_PULL_REQUEST

cd .stage/
git add --all .
git commit -m "Deploy to GitHub Pages: ${SHA}" --author "$(git --no-pager show -s --format='%an <%ae>' $TRAVIS_COMMIT)"
git push -q upstream HEAD:refs/heads/master
