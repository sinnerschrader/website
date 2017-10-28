module.exports = function initTabList(tabsContainer) {
	const tabs = Array.prototype.slice.call(tabsContainer.querySelectorAll('[role="tab"]'));

	tabs.forEach((tab) => {
		tab.addEventListener('click', function (el) {
			tabs.forEach((tab) => {
				tab.setAttribute('aria-selected', false);
			});

			el.setAttribute('aria-selected', true);
		})
	});
}
