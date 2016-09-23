// change all locations after click on location nav

function changeLocation(locationArea) {
	var locationBtn = locationArea.querySelectorAll('.js_chooseLocation');
	var allLocation = locationArea.querySelectorAll('[data-location]');

	for(var i = 0; i < locationBtn.length; i++){
		locationBtn[i].addEventListener('click', function() {

			var location = this.getAttribute('data-location');
			var choosenLocation =  locationArea.querySelectorAll('[data-location="'+ location +'"]');

			for(var i = 0; i < allLocation.length; i++){
				allLocation[i].classList.remove('is-active');
			}

			for(var x = 0; x < choosenLocation.length; x++) {
				choosenLocation[x].classList.add('is-active');
			}

		}, false);
	}
}

var locations = document.querySelectorAll('[data-locations]');

if(locations.length) {
	for(var i = 0; i < locations.length; i++){
		changeLocation(locations[i]);
	}
}