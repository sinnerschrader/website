const observerTarget = document.querySelector('.intersection-video video');

/**
 * if video is defined
 * create intersection observer
 */
if(observerTarget) {

	/**
	 * threshold is a single number or an array of numbers which indicate
	 * at what percentage of the target's visibility the observer's
	 * callback should be executed.
	 */
	const observerOptions = {
		threshold: [0.5,0.75,1.0]
	}

	const observer = new IntersectionObserver(observerCallback, observerOptions);
	observer.observe(observerTarget);
}

function observerCallback(entries, observer) {
	entries.forEach(entry => {

		/**
		 * Whenever the target meets a threshold
		 * >= 75% play the video else pause video
		 */
		if(entry.intersectionRatio>=.75){
			entry.target.play();
		} else {
			entry.target.pause();
		}
	});
};
