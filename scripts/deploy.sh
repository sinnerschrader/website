#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

#
# Based on https://gist.github.com/domenic/ec8b0fc8ab45f39403dd
#

if [ "$TRAVIS" != "true" ]; then
	echo "Skipping deploy - this is not running on Travis; skipping."
	exit 0
fi

if [ $(git log  -n 1 --oneline |grep "Deploy to GitHub Pages" |wc -l) -eq 1 ] ; then
    echo "Last commit done by travis itself; skipping."
    exit 0
fi

if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    echo "Skipping deploy - this is not a pull request; skipping."
    exit 0
fi

if [ "$TRAVIS_SECURE_ENV_VARS" != "true" ]; then
    echo "Skipping deploy - this has no access to secure env vars; skipping."
    exit 0
fi

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

# Now let's go have some fun with the cloned repo
git config user.name "SinnerSchrader"
#git config user.email "$COMMIT_AUTHOR_EMAIL"
git config user.email "jobs@sinnerschrader.com"

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
if [ $(git status --porcelain docs | wc -l) -lt 1 ]; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add --all docs
git commit -m "Deploy to GitHub Pages: ${SHA}" --author $(git --no-pager show -s --format='%an <%ae>' $TRAVIS_COMMIT)

# Get the deploy key by using Travis's stored variables to decrypt deploy_key.enc
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in deploy_key.enc -out deploy_key -d
chmod 600 deploy_key
eval `ssh-agent -s`
ssh-add deploy_key

# Now that we're all set up, we can push.
git push $SSH_REPO HEAD:$TRAVIS_PULL_REQUEST_BRANCH
