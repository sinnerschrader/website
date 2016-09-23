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
const matter = require('gray-matter');

if (!semver.satisfies(process.version, '>=6')) {
	console.error('At least node 6 is required');
	process.exit(1); // eslint-disable-line xo/no-process-exit
}

const src = {
	less: 'src/css/app.less',
	pages: 'src/pages/**/*.html',
	templates: 'src/templates/**/*.html',
	static: 'static'
};
const dest = {
	dist: 'dist',
	css: 'dist/static/css/app.css',
	static: 'dist/static'
};

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
	const parsed = matter(code);
	const name = uppercaseFirst(camelcase(path.basename(filepath, '.html')));
	const compCode = transformJsx(parsed.content);

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
	return globby([src.templates])
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
				const parsed = matter(content.toString());
				const sandbox = Object.assign(
					{},
					components,
					{
						React,
						__html__: undefined
					}
				);
				vm.runInNewContext('__html__ = ' + transformJsx(parsed.content), sandbox);
				return '<!DOCTYPE html>' + ReactDOM.renderToStaticMarkup(sandbox.__html__);
			})
			.then(html => sander.writeFile(getDestinationPath(filepath), html));
	}));
}

function logError(err) {
	console.error(err);
	throw err;
}

sander.copydir(path.join(process.cwd(), src.static)).to(path.join(process.cwd(), dest.static))
	.then(() => createReactComponents())
	.then(components =>
		globby([src.pages])
			.then(filepaths => renderPages(filepaths, components))
	.then(() => console.log('Done.')))
	.catch(err => logError(err));
