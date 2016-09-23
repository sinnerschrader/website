const vm = require('vm');
const path = require('path');
const globby = require('globby');
const sander = require('sander');
const camelcase = require('camelcase');
const uppercaseFirst = require('upper-case-first');
const babel = require('babel-core');
const React = require('react');
const ReactDOM = require('react-dom/server');
const semver = require('semver');

const cssCompiler = require('../server/lib/css-compiler');

if (!semver.satisfies(process.version, '>=6')) {
	console.error('At least node 6 is required');
	process.exit(1); // eslint-disable-line xo/no-process-exit
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
	.then(css => sander.writeFile('dist/static/css/app.css', css));
}

function getDestinationPath(filepath) {
	return path.join('dist', filepath.replace(/src\/pages/, ''));
}

function transformJsx(code) {
	const options = {
		plugins: ['transform-react-jsx']
	};
	return babel.transform(code, options).code.replace(/;?$/, '');
}

function createReactComponent(lazyComponentRegistry, filepath, code) {
	const name = uppercaseFirst(camelcase(path.basename(filepath, '.html')));
	const compCode = transformJsx(code);

	const sandbox = new Proxy({
		React,
		name: undefined
	}, {
		get: function (target, name) {
			if (lazyComponentRegistry[name]) {
				return lazyComponentRegistry[name];
			}
			return target[name];
		}
	});
	vm.runInNewContext(`${name} = (props) => (${compCode})`, sandbox);

	return {
		name,
		Component: sandbox[name]
	};
}

function createReactComponents() {
	// Create component object here and add all components when created to have the reference already and
	// resolve against it during runtime
	const lazyComponentRegistry = {};
	return globby(['src/react/**/*.html'])
		.then(filepaths => {
			return Promise.all(filepaths.map(filepath => {
				return sander.readFile(filepath)
					.then(content => createReactComponent(lazyComponentRegistry, filepath, content.toString()));
			}))
			.then(components => {
				return components.reduce((all, comp) => {
					all[comp.name] = comp.Component;
					return all;
				}, lazyComponentRegistry);
			});
		});
}

function renderPages(filepaths, components) {
	console.log(`Generating css...`);
	return Promise.all(filepaths.map(filepath => {
		console.log(`... ${filepath}`);
		return sander.readFile(filepath)
			.then(content => {
				const sandbox = Object.assign(
					{},
					components,
					{
						React,
						__html__: undefined
					}
				);
				vm.runInNewContext('__html__ = ' + transformJsx(content.toString()), sandbox);
				return '<!DOCTYPE html>' + ReactDOM.renderToStaticMarkup(sandbox.__html__);
			})
			.then(html => sander.writeFile(getDestinationPath(filepath), html));
	}));
}

function logError(err) {
	console.error(err);
	throw err;
}

sander.rimraf('dist')
	.then(() => sander.copydir('static').to('dist/static'))
	.then(() => createReactComponents())
	.then(components =>
		globby(['src/pages/**/*.html'])
			.then(filepaths => renderPages(filepaths, components))
	.then(() => createCss())
	.then(() => console.log('Done.')))
	.catch(err => logError(err));
