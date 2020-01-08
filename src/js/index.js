const intersectionVideo = require('./intersection-video');
const slider = require('./slider');
const initAriaExpanded = require('./init-aria-expanded');
const initTabList = require('./init-tab-list');

window.addEventListener('DOMContentLoaded', main);

function main() {
	const intersected = query('[data-js="intersection-video"] video')
		.map(el => intersectionVideo(el));

	const sliders = query('[data-js="simple-dots"]')
		.map(el => slider(el));

	const ariaExpandedList = query('[data-js="aria-expanded"]')
		.map(el => initAriaExpanded(el));

	const tabs = query('[role="tablist"]')
		.map(el => initTabList(el));
	console.log('tabs', tabs);
}

function query(q) {
	return Array.prototype.slice.call(document.querySelectorAll(q));
}
