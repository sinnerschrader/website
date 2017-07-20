const intersectionVideo = require('./intersection-video');
const slider = require('./slider');

window.addEventListener('DOMContentLoaded', main);

function main() {
	const intersected = query('.intersection-video video')
		.map(el => intersectionVideo(el));

	const sliders = query('.js_simple_dots')
		.map(el => slider(el));
}

function query(q) {
	return Array.prototype.slice.call(document.querySelectorAll(q));
}
