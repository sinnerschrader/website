#!/bin/bash
set -e

git config --global user.email "s2-github-bot@sinnerschrader.com"
git config --global user.name "S2 Github Bot"

$(npm bin)/set-up-ssh --key "$encrypted_e0af519562d0_key" \
											--iv "$encrypted_e0af519562d0_iv" \
											--path-encrypted-key ".travis/patternplate-hubot.enc"
