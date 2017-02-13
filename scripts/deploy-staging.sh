#!/bin/bash
##
# Assumes to be run in npm context:
# - node_modules/.bin in $PATH
# - GH_TOKEN
# - GITHUB_USERNAME
# - GITHUB_PASSWORD
##
set -e

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

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
# currently disabled
#if [ $(git status --porcelain docs | wc -l) -lt 1 ]; then
#	echo "No changes to the output on this push; exiting."
#	issue-comment \
#		--once \
#		"$TRAVIS_REPO_SLUG#$TRAVIS_PULL_REQUEST" \
#		"Hello!<br/>
#		I built $TRAVIS_COMMIT and found out it produces no changes to the website \`docs\`.<br/>
#		Because of this I decided to create no Pull Request to sinnerschrader/sinnerschrader-website-staging.<br/>
#		Cheers"
#	exit 0
#fi

# Save some useful information
SHA=`git rev-parse --verify HEAD`
DEPLOYMENT_ID="sinnerschrader-website-staging/${TRAVIS_PULL_REQUEST}"
DEPLOYMENT_URL="https://sinnerschrader.github.io/sinnerschrader-website-staging/${TRAVIS_PULL_REQUEST}/index.html"
DEPLOYMENT_LINK="[$DEPLOYMENT_ID]($DEPLOYMENT_URL)"

git clone "https://$GH_TOKEN@github.com/sinnerschrader/sinnerschrader-website-staging.git" .stage
cp -r ./docs ./.stage/$TRAVIS_PULL_REQUEST

cd .stage/
git add --all .
git config user.name "Patternplate Hubot"
git config user.email "jobs@sinnerschrader.com"
git commit -m "Stage changes for #${TRAVIS_PULL_REQUEST}" --author "$(git --no-pager show -s --format='%an <%ae>' $TRAVIS_COMMIT)"

PR_EXISTS=$((git show-ref --quiet --verify -- "refs/remotes/origin/deploy-$TRAVIS_PULL_REQUEST" && echo "true") || echo "false")

# Now that we're all set up, we can push.
git push -f -q origin "HEAD:refs/heads/deploy-$TRAVIS_PULL_REQUEST"

if [ PR_EXISTS == "true" ]; then
	echo "Pull request for staging changes of $TRAVIS_PULL_REQUEST already exists."
	exit 0
fi

read -d '' BODY << EOF || true
Hey there,<br />
This pull requests contains the changes proposed by sinnerschrader/sinnerschrader-website#${TRAVIS_PULL_REQUEST}.<br/>
When you merge this the changes will be deployed to $DEPLOYMENT_LINK.<br/>
Cheers<br />
**Target**: Staging :construction:<br />
**Source**: Pull request
EOF

# - GH_TOKEN
OUTPUT=$(pull-request \
	--base "sinnerschrader/sinnerschrader-website-staging:master" \
	--head "sinnerschrader/sinnerschrader-website-staging:deploy-$TRAVIS_PULL_REQUEST" \
	--title "Stage changes for #${TRAVIS_PULL_REQUEST}" \
	--body "$BODY" \
	--message "Stage changes for #${TRAVIS_PULL_REQUEST}" \
	--token "$GH_TOKEN")

TRIMMED=${OUTPUT#Success}
URL=$(node -e "console.log(($TRIMMED).html_url)")
NUMBER=$(node -e "console.log(($TRIMMED).number)")

read -d '' COMMENT << EOF || true
Hey there,<br/>
I created pull request [sinnerschrader/sinnerschrader-website-staging\#$NUMBER]($URL) for you.<br/>
Merging it will make the changes of sinnerschrader/sinnerschrader-website#$TRAVIS_PULL_REQUEST available at $DEPLOYMENT_LINK. :rocket:<br/>
Cheers<br />
---<br />
**Target**: Staging :construction:<br />
**Source**: Pull request
EOF

# - GITHUB_USERNAME
# - GITHUB_ACCESS_TOKEN
issue-comment \
	--once \
	"$TRAVIS_REPO_SLUG#$TRAVIS_PULL_REQUEST" \
	"$COMMENT"
