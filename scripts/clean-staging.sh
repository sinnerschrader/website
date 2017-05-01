#!/bin/bash
set -e
set -u

if [ "$TRAVIS" != "true" ]; then
	echo "Skipping clean-staging - this is not running on Travis; skipping."
	exit 0
fi

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
	echo "Skipping clean-staging - this is a Pull Request; skipping."
	exit 0
fi

if [ "$TRAVIS_BRANCH" != "master" ]; then
	echo "Skipping clean-staging - this is not on master; skipping."
	exit 0
fi

if [ "$TRAVIS_SECURE_ENV_VARS" != "true" ]; then
	echo "Skipping clean-staging - this has no access to secure env vars; skipping."
	exit 0
fi

git clone --depth=1 "https://$GH_TOKEN@github.com/sinnerschrader/website-staging.git" .stage

cd .stage
git config user.name "Patternplate Hubot"
git config user.email "jobs@sinnerschrader.com"

for PR in `../scripts/get-prs.js $TRAVIS_REPO_SLUG`
do
	if [ -d "$PR" ]; then
		echo "Removing artifacts for #$PR"
		rm -rf "$PR"
		git add --all .
		git commit -m "chore: remove artifacts for $TRAVIS_REPO_SLUG#$PR" --author "Patternplate Hubot <jobs@sinnerschrader.com>"
	fi
done

git push -q origin master
cd ..
