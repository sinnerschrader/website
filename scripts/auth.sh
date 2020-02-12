#!/bin/bash
set -e

git config --global user.email "s2-github-bot@sinnerschrader.com"
git config --global user.name "S2 Github Bot"

$(npm bin)/set-up-ssh --key "$encrypted_b93e83ba6e4c_key" \
		      --iv "$encrypted_b93e83ba6e4c_iv" \
		      --path-encrypted-key ".travis/github_deploy_key.enc"
