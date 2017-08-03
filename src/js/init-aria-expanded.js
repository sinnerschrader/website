module.exports = function initAriaExpanded(el) {
	/**
	 * set aria-expanend initial
	 * this is needed to ensure that the page
	 * is accesable without javascript
	 */
	el.setAttribute('aria-expanded', false);

	/**
	 * toggle aria expanded attribute for current target element
	 */
	el.addEventListener('click', function () {
		if (el.getAttribute('aria-expanded') === 'false') {
			el.setAttribute('aria-expanded', true);
		} else {
			el.setAttribute('aria-expanded', false);
		}
	});

	/**
	 * if keycode is equal to escape key
	 * set checkbox state false
	 * set aria expanded false
	 * and set focus to trigger element
	 */
	document.addEventListener('keydown', function (event) {
		if (event.keyCode === 27) {
			const elCheckbox = el.previousSibling;

			triggerCheckbox.checked = false;
			el.setAttribute('aria-expanded', 'false');
			el.focus();
		}
	});
}
