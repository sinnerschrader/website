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


const tabs = document.querySelectorAll('[role="tab"]');
console.log(document);
// set first tab to aria-selected true
for (var i=0; i < tabs.length; i++) {
    tabs[i].addEventListener('change', function(){                         
        this.parentElement.querySelectorAll('[role="tab"]').forEach.call(tabs, function(tab) {
            if(tab.checked) {
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.removeAttribute('aria-selected');
            }
        });
    });
}