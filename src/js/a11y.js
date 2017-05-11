const navigationState = document.querySelector('#navigation-state');
const navigationButton = document.querySelector('.js-burger');

navigationButton.setAttribute('aria-expanded', 'false');

navigationButton.addEventListener('click', function(e){
    navigationButton.setAttribute('aria-expanded', navigationButton.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
}); 

document.addEventListener('keydown', function(e){
    if(e.keyCode === 27) { // ESC
        navigationState.checked = false;
        navigationButton.setAttribute('aria-expanded', 'false');
        navigationButton.focus();
    }
});