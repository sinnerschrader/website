const observerTarget = document.querySelector('.intersection-video video');

if(observerTarget) {
	const observerOptions = {
		root: null,
		rootMargin: '0px',
		threshold: [0.5,0.75,1.0]
	}

	const observer = new IntersectionObserver(observerCallback, observerOptions);
	observer.observe(observerTarget);
}

function observerCallback(entries, observer) {
		entries.forEach(entry => {
		if(entry.intersectionRatio>=.75){
			entry.target.play();
		} else {
			entry.target.pause();
		}
	});
};
