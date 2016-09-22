const path = require('path');
const ect = require('ect');
const globby = require('globby');
const sander = require('sander');

const cssCompiler = require('../server/lib/css-compiler')

const renderer = ect({root: path.join(__dirname, '..'), ext: '.html'});

globby(['src/pages/**/*.html'])
	.then(filepaths => {
		console.log(`Generating pages...`);
		return filepaths.map(filepath => {
			return Promise.resolve(renderer.render(path.join(__dirname, '..', filepath)))
				.then(html => {
					const dest = path.join('dist', filepath.replace(/src\/pages/, ''));
					console.log(`... writing ${dest}`);
					return sander.writeFile(dest, html);
				});
		});
	})
	.then(() => {
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
	})
	.then(() => {
		console.log('Done.');
	})
	.catch(err => {
		console.error(err);
		throw err;
	});
