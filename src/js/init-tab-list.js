module.exports = function initTabList(tabsContainer) {
	const tabs = Array.prototype.slice.call(tabsContainer.querySelectorAll('[role="tab"]'));
	console.log('here');
	tabs.forEach((tab) => {
		console.log('tab', tab);
		tab.addEventListener('click', function (el) {
			console.log('clicked', el);
			tabs.forEach((tab) => {
				tab.setAttribute('aria-selected', false);
			});

			el.setAttribute('aria-selected', true);
		})
	});
}
