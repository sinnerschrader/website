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

	// set tabs once based on hashs in the url
	if(window.location.hash) {
		const hash = window.location.hash.substring(1);
		tabs.forEach((tab) => {
			if(tab.id === hash) {
				tab.setAttribute('aria-selected', true);
				tab.checked = true;
			} else {
				tab.setAttribute('aria-selected', false);
				tab.checked = false;
			}
		});
	}
};

