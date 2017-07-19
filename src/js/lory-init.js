document.addEventListener('DOMContentLoaded', function () {
	var simple_dots       = document.querySelector('.js_simple_dots');

	/**
	 * if slider is not on the page return
	 */
	if(!simple_dots) {
		return;
	}

	var dot_count         = simple_dots.querySelectorAll('.js_slide').length;
	var dot_container     = simple_dots.querySelector('.js_dots');
	var dot_list_item     = document.createElement('li');

	/**
	 * dot naviagtion init function
	 * @param {*} e
	 */
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

	simple_dots.addEventListener('before.lory.init', handleDotEvent);
	simple_dots.addEventListener('after.lory.init', handleDotEvent);
	simple_dots.addEventListener('after.lory.slide', handleDotEvent);
	simple_dots.addEventListener('on.lory.resize', handleDotEvent);

	/**
	 * lory dot slider options
	 */
	var dot_navigation_slider = lory(simple_dots, {
		infinite: 1,
		enableMouseEvents: true
	});
});
