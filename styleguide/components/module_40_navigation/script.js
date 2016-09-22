// JUST FOR DEMO PURPOSES

(function toggleNavColors(){

  var spotlightMode = 0;
  var contrastMode  = 0;
  var oldScrollPos  = 0
  var newScrollPos  = 0
  var modHeroElement = document.querySelector('.mod-hero');
  var modNavigation = document.querySelector('.mod-navigation');

  if (!modHeroElement || !modNavigation) {
    return;
  }

  var breakPoint = modHeroElement.offsetHeight;

  function check(timestamp) {
    oldScrollPos = newScrollPos;
    newScrollPos = window.scrollY;

    if( newScrollPos > oldScrollPos || newScrollPos == 0) {
      if( spotlightMode ) {
        modNavigation.classList.remove('spotlight');
        spotlightMode = 0;
      }
      if( !contrastMode && newScrollPos >= breakPoint ) {
        console.log('MOD-NAVIGATION:: mode hero is out of view port');
        modNavigation.classList.add('contrast');
        contrastMode = 1;
      } else if(contrastMode && newScrollPos < breakPoint) {
        console.log('MOD-NAVIGATION:: mode hero is in view port');
        modNavigation.classList.remove('contrast');
        contrastMode = 0;
      }
    } else if( newScrollPos < oldScrollPos && !spotlightMode) {
      console.log('MOD-NAVIGATION:: it\'s going back');
      modNavigation.classList.add('spotlight');
      spotlightMode = 1;
    }

    window.requestAnimationFrame(check);
  }

  window.requestAnimationFrame(check);

})();

(function toggleNavState(){
  var body          = document.body;
  var container     = document.querySelector('.container')
  var modNavigation = document.querySelector('.mod-navigation');

  if (!container || !modNavigation) {
    return;
  }

  var navToggle     = modNavigation.querySelector('.nav');

  if (!navToggle) {
    return;
  }

  var oldScrollPos  = 0;
  var defaultStyleContainer, defaultStyleBody;

  navToggle.addEventListener('click', function(e){
    modNavigation.classList.toggle('open');

    // :-/
    if( modNavigation.classList.contains('open') ) {
      oldScrollPos = window.scrollY;
      defaultStyleContainer = container.style.cssText;
      defaultStyleBody = body.style.cssText;
      body.style.cssText = "max-height: 100vH; overflow: hidden;";
      container.style.cssText = "margin-top: -" + oldScrollPos + "px;";
    } else {
      body.style.cssText = defaultStyleBody;
      container.style.cssText = defaultStyleContainer;
      window.scrollTo(0, oldScrollPos);
    }
  }, false);

})();
