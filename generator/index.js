const vm = require('vm');
const path = require('path');
const ect = require('ect');
const globby = require('globby');
const sander = require('sander');
const camelcase = require('camelcase');
const uppercaseFirst = require('upper-case-first');

const React = require('react'); // eslint-disable-line no-unused-vars
const ReactDOM = require('react-dom/server');

const cssCompiler = require('../server/lib/css-compiler');

const renderer = ect({root: path.join(__dirname, '..'), ext: '.html'});

function renderPages(filepaths) {
	console.log(`Generating pages...`);
	return filepaths.map(filepath => renderPage(filepath));
}

function renderPage(filepath) {
	const html = renderer.render(path.join(__dirname, '..', filepath));
	const dest = path.join('dist', filepath.replace(/src\/pages/, ''));
	console.log(`... writing ${dest}`);
	return sander.writeFile(dest, html);
}

function createCss() {
	console.log(`Generating css...`);
	return new Promise((resolve, reject) => {
		cssCompiler.build(path.join(__dirname, '../src/css', 'app.less'), (err, css) => {
			if (err) {
				return reject(err);
			}
			resolve(css);
		});
	})
	.then(css => {
		return sander.writeFile('dist/css/app.css', css);
	});
}

function logError(err) {
	console.error(err);
	throw err;
}

globby(['src/pages/**/*.html', '!src/pages/**/*2.html'])
	.then(filepaths => renderPages(filepaths))
	.then(() => createCss())
	.then(() => console.log('Done.'))
	.catch(err => logError(err));

function createReactComponents() {
	return globby(['src/react/**/*.html'])
		.then(filepaths => {
			return Promise.all(filepaths.map(filepath => {
				return sander.readFile(filepath)
					.then(content => {
						const name = uppercaseFirst(camelcase(path.basename(filepath, '.html')));
						// Transform JSX
						const code = `
							const babel = require('babel-core');
							const options = {
								plugins: ['transform-react-jsx']
							};
							${name} = babel.transform(\`${content.toString()}\`, options).code;
						`;
						const sandbox = {
							require,
							name: undefined
						};
						vm.runInNewContext(code, sandbox, {filename: filepath});

						const sandbox2 = {
							React,
							name: undefined
						};
						vm.runInNewContext(`${name} = (props) => (${sandbox[name].replace(/;$/, '')})`, sandbox2);

						return {
							name,
							Component: sandbox2[name]
						};
					});
			}))
			.then(components => {
				return components.reduce((all, comp) => {
					all[comp.name] = comp.Component;
					return all;
				}, {});
			});
		});
}

globby(['src/pages/**/*2.html'])
	.then(filepaths => {
		return Promise.all(filepaths.map(filepath => {
			return createReactComponents()
				.then(components => {
					return sander.readFile(filepath)
						.then(content => {
							// Transform JSX
							const code = `
								const babel = require('babel-core');
								const options = {
									plugins: ['transform-react-jsx']
								};
								__jsx__ = '__html__ = ' + babel.transform(\`${content.toString()}\`, options).code;
							`;
							const sandbox = {
								require,
								__jsx__: undefined
							};
							vm.runInNewContext(code, sandbox);

							// Eval JSX
							const sandbox2 = Object.assign(
								{},
								components,
								{
									React,
									__html__: ''
								}
							);
							vm.runInNewContext(sandbox.__jsx__, sandbox2);

							// Render HTML
							const html = ReactDOM.renderToStaticMarkup(sandbox2.__html__);

							const dest = path.join('dist', filepath.replace(/src\/pages/, ''));
							return sander.writeFile(dest, html);
						});
				});
		}));
	})
	.catch(err => logError(err));
