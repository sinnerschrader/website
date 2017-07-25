var IntersectionObserver = require('intersection-observer-polyfill/dist/IntersectionObserver');

module.exports = function intersectionVideo(el) {
	if (!(el instanceof HTMLVideoElement)) {
		console.warn('intersectionVideo() expects an HTMLVideoElement. Received', el, 'of type', typeof el);
		return;
	}

	if (!IntersectionObserver) {
		console.warn('Could not start intersection-video as it uses IntersectionObserver which is unavailable. Use the polyfill.');
		return;
	}

	const observerOptions = {
		threshold: [0.5, 0.75, 1.0]
	};

	const observer = new IntersectionObserver(observerCallback, observerOptions);
	observer.observe(el);

	function observerCallback(entries, observer) {
		entries.forEach(entry => {
			if (entry.intersectionRatio >= .75){
				entry.target.play();
			} else {
				entry.target.pause();
			}
		});
	};

	return observer;
}


