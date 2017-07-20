var lory = require('lory.js').lory;

module.exports = function slider(el) {
	if (!(el instanceof HTMLElement)) {
		console.warn('slider() expects an HTMLElement. Received', el, 'of type', typeof el);
		return;
	}

	var dot_count = el.querySelectorAll('.js_slide').length;
	var dot_container = el.querySelector('.js_dots');
	var dot_list_item = document.createElement('li');

	function handleDotEvent(e) {
		if (e.type === 'before.lory.init') {
			for (var i = 0, len = dot_count; i < len; i++) {
			var clone = dot_list_item.cloneNode();
			dot_container.appendChild(clone);
			}
			dot_container.childNodes[0].classList.add('active');
		}
		if (e.type === 'after.lory.init') {
			for (var i = 0, len = dot_count; i < len; i++) {
			dot_container.childNodes[i].addEventListener('click', function(e) {
				dot_navigation_slider.slideTo(Array.prototype.indexOf.call(dot_container.childNodes, e.target));
			});
			}
		}
		if (e.type === 'after.lory.slide') {
			for (var i = 0, len = dot_container.childNodes.length; i < len; i++) {
			dot_container.childNodes[i].classList.remove('active');
			}
			dot_container.childNodes[e.detail.currentSlide - 1].classList.add('active');
		}
		if (e.type === 'on.lory.resize') {
			for (var i = 0, len = dot_container.childNodes.length; i < len; i++) {
				dot_container.childNodes[i].classList.remove('active');
			}
			dot_container.childNodes[0].classList.add('active');
		}
	}

	el.addEventListener('before.lory.init', handleDotEvent);
	el.addEventListener('after.lory.init', handleDotEvent);
	el.addEventListener('after.lory.slide', handleDotEvent);
	el.addEventListener('on.lory.resize', handleDotEvent);

	console.log(lory, typeof lory);
	return lory(el, {
		infinite: 1,
		enableMouseEvents: true
	});
};
