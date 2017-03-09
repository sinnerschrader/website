#!/bin/bash
# - GITHUB_ACCESS_TOKEN
# - GITHUB_USERNAME
# - TRAVIS_PULL_REQUEST
# - TRAVIS_COMMIT
set -e
set -x

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

COMMIT_MESSAGE="$(git log --format=%s -n 1)"

echo $COMMIT_MESSAGE

if [[ "$COMMIT_MESSAGE" == *"[skip-ci]"* ]]; then
	echo "Commit subject ends with \"[skip-ci]\", skipping."
	exit 0
fi

# Save some useful information
AUTHOR=`git --no-pager show -s --format='%an <%ae>' $TRAVIS_COMMIT`
SHA=`git rev-parse --verify HEAD`
REPOSITORY_ID="sinnerschrader/website-staging"
DEPLOYMENT_ID="$REPOSITORY_ID/${TRAVIS_PULL_REQUEST}"
DEPLOYMENT_URL="https://sinnerschrader.github.io/website-staging/${TRAVIS_PULL_REQUEST}/index.html"
DEPLOYMENT_LINK="[$DEPLOYMENT_ID]($DEPLOYMENT_URL)"

git clone "https://$GH_TOKEN@github.com/sinnerschrader/website-staging.git" .stage
cp -r ./docs ./.stage/$TRAVIS_PULL_REQUEST

cd .stage/
git add --all .
git config user.name "Patternplate Hubot"
git config user.email "jobs@sinnerschrader.com"
git commit -m "chore: stage changes for #${TRAVIS_PULL_REQUEST}" --author "$AUTHOR"

git push -q origin master

read -d '' COMMENT << EOF || true
Hey there,<br/>
I pushed the effects of your changes to sinnerschrader/website-staging for you.
A preview is available at $DEPLOYMENT_LINK. :rocket:<br/>
Cheers<br />
---<br />
EOF

# - GITHUB_USERNAME
# - GITHUB_ACCESS_TOKEN
 $(npm bin)/issue-comment \
	--once \
	"$TRAVIS_REPO_SLUG#$TRAVIS_PULL_REQUEST" \
	"$COMMENT"
