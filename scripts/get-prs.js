#!/usr/bin/env node
const fetch = require('node-fetch');

const input = process.argv.slice(2)[0];
const uri = 'https://api.github.com/graphql';

const AUTH_TOKEN = process.env.GH_TOKEN;

main(input)
	.then((result = {}) => {
		if (result.message) {
			console.log(result.message);
		}
		process.exit(result.code || 0);
	})
	.catch(err => {
		setTimeout(() => {
			throw err;
		}, 0);
	});

process.on('unhandledRejection', err => {
	throw err;
});

function main(repo) {
	return new Promise(resolve => {
		if (!repo) {
			help();
			return resolve({
				code: 1,
				message: '<repo> is required'
			});
		}

		if (!process.env.GH_TOKEN) {
			help();
			return resolve({
				code: 1,
				message: 'global environment variable GH_TOKEN is required'
			});
		}

		request(repo)
			.then(data => {
				const repository = data.repository;

				if (!repository) {
					throw new Error(`Could not find repository ${repo}`);
				}

				const message = repository.pullRequests.nodes
					.map(node => node.number)
					.join('  ');
				resolve({code: 0, message: message});
			})
			.catch(err => {
				resolve({code: 1, message: err.message});
			});
	});
}

function request(repo) {
	const [owner, name] = repo.split('/');

	return fetch(uri, {
		method: 'POST',
		body: JSON.stringify({query: `{
			repository(name: "${name}", owner: "${owner}") {
				pullRequests(states: CLOSED, first: 100) {
					nodes {number}
				}
			}
		}`}),
		headers: {
			Authorization: `Bearer ${AUTH_TOKEN}`
		}
	})
	.then(r => r.json())
	.then(j => {
		if (typeof j.data === 'object' && j.data !== null) {
			return j.data;
		}
		if (Array.isArray(j.errors)) {
			throw new Error(`Failed querying PRs: ${j.errors.map(err => `${err.message}\n`)}`);
		}
		if (!j.data && j.message) {
			throw new Error(`Failed querying PRs: ${j.message} - ${j.documentation_url}`);
		}
	});
}

function help() {
	const helpText = `
get-prs
  List open prs for <repo>

  Ussage
    $ get-prs sinnerschrader/sinnerschrader-website
    280  278  276  274
`;
	console.log(helpText);
}
