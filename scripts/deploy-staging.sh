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

if [ $(git log  -n 1 --oneline |grep "Deploy to GitHub Pages" |wc -l) -eq 1 ] ; then
	echo "Last commit done by travis itself; skipping."
	exit 0
fi

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
if [ $(git status --porcelain docs | wc -l) -lt 1 ]; then
	echo "No changes to the output on this push; exiting."
	issue-comment \
		--once \
		"$TRAVIS_REPO_SLUG#$TRAVIS_PULL_REQUEST" \
		"Hello!<br/>
		<br/>
		I built $TRAVIS_COMMIT and found out it produces no changes to the website \`docs\`.<br/>
		Because of this I decided to create no Pull Request to sinnerschrader/sinnerschrader-website-staging. <br/>
		<br/>
		Cheers"

	exit 0
fi

# Save some useful information
SHA=`git rev-parse --verify HEAD`

git clone "https://$GH_TOKEN@github.com/sinnerschrader/sinnerschrader-website-staging.git" .stage
cp -r ./docs ./.stage/$TRAVIS_PULL_REQUEST

cd .stage/
git add --all .
git config user.name "SinnerSchrader"
git config user.email "jobs@sinnerschrader.com"
git commit -m "Deploy to GitHub Pages: ${SHA}" --author "$(git --no-pager show -s --format='%an <%ae>' $TRAVIS_COMMIT)"

# Now that we're all set up, we can push.
git push -q origin "HEAD:refs/heads/deploy-$TRAVIS_COMMIT"

read -d '' BODY << EOF || true
Hey there,<br />
<br/>
This pull requests contains the changes proposed by sinnerschrader/sinnerschrader-website#${TRAVIS_PULL_REQUEST}.<br/>
When you merge this the changes will be deployed to [sinnerschrader/sinnerschrader-website-staging/${TRAVIS_PULL_REQUEST}](https://sinnerschrader.github.io/sinnerschrader/sinnerschrader-website-staging/${TRAVIS_PULL_REQUEST}).<br/>
<br/>
Cheers
EOF

# - GH_TOKEN
OUTPUT=$(pull-request \
	--base "sinnerschrader/sinnerschrader-website-staging:master" \
	--head "sinnerschrader/sinnerschrader-website-staging:deploy-$TRAVIS_COMMIT" \
	--title "Deploy #${TRAVIS_PULL_REQUEST} to [sinnerschrader/sinnerschrader-website-staging/${TRAVIS_PULL_REQUEST}](https://sinnerschrader.github.io/sinnerschrader/sinnerschrader-website-staging/${TRAVIS_PULL_REQUEST})" \
	--body "$BODY" \
	--message "Deploy #${TRAVIS_PULL_REQUEST} to [sinnerschrader/sinnerschrader-website-staging/${TRAVIS_PULL_REQUEST}](https://sinnerschrader.github.io/sinnerschrader/sinnerschrader-website-staging/${TRAVIS_PULL_REQUEST})" \
	--token "$GH_TOKEN")

TRIMMED=${OUTPUT#Success}
URL=$(node -e "console.log(($TRIMMED).html_url)")

read -d '' COMMENT << EOF || true
Hey there,<br/>
<br/>
I created a Pull Reqest at [sinnerschrader-website-static]($URL) for you.<br/>
Merging it will make your changes available at the staging Github Page. :rocket:<br/>
<br/>
Cheers
EOF

# - GITHUB_USERNAME
# - GITHUB_ACCESS_TOKEN
issue-comment \
	--once \
	"$TRAVIS_REPO_SLUG#$TRAVIS_PULL_REQUEST" \
	"$COMMENT"
