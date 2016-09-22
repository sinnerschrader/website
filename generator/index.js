const path = require('path');
const ect = require('ect');
const globby = require('globby');
const sander = require('sander');

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

globby(['src/pages/**/*.html'])
	.then(filepaths => renderPages(filepaths))
	.then(() => createCss())
	.then(() => console.log('Done.'))
	.catch(err => logError(err));
