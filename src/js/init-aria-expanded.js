module.exports = function initAriaExpanded(el) {
	/**
	 * set aria-expanend initial
	 * this is needed to ensure that the page
	 * is accesable without javascript
	 */
	el.setAttribute("aria-expanded", false);

	/**
	 * toggle aria expanded attribute for current target element
	 */
	el.addEventListener("click", toggleAriaExpanded);
	function toggleAriaExpanded() {
		if (el.getAttribute("aria-expanded") === "false") {
			el.setAttribute("aria-expanded", true);
		} else {
			el.setAttribute("aria-expanded", false);
		}
	}

	/**
	 * control aria expanded attribute and checkbox checked attribute with enter and escape key
	 */
	function additionalKeys() {
		const elCheckbox = el.previousSibling;

		/**
		 * if keycode is equal to enter key
		 * toggle checkbox
		 * toggle aria expanded
		 */
		elCheckbox.addEventListener("keydown", function (event) {
			if (event.keyCode === 13) {
				elCheckbox.checked = !elCheckbox.checked;
				toggleAriaExpanded();
			}
		});

		/**
		 * if keycode is equal to escape key
		 * set checkbox state false
		 * set aria expanded false
		 * and set focus to trigger element
		 */
		document.addEventListener("keydown", function (event) {
			if (event.keyCode === 27) {
				elCheckbox.checked = false;
				el.setAttribute("aria-expanded", "false");
				el.focus();
			}
		});
	}
	additionalKeys();
};
