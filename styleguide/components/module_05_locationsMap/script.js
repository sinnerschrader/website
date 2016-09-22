function changeLocation() {
	var locationBtn = document.querySelectorAll('.js_chooseLocation');
	var allLocation = document.querySelectorAll('[data-location]');

	for(var i = 0; i < locationBtn.length; i++){
		locationBtn[i].addEventListener('click', function() {

			var location = this.getAttribute('data-location');
			var choosenLocation =  document.querySelectorAll('[data-location="'+ location +'"]');

			for(var i = 0; i < allLocation.length; i++){
				allLocation[i].classList.remove('isActive');
			}

			for(var x = 0; x < choosenLocation.length; x++) {
				choosenLocation[x].classList.add('isActive');
			}

		}, false);
	}
}

changeLocation();