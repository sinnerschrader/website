initAriaExpandedTriggers();
initTabLists();

function initAriaExpandedTriggers() {
 const ariaExpandedTriggers = nodeListToArray(document.querySelectorAll('.js-aria-expanded'));

 ariaExpandedTriggers.forEach((trigger) => {
   /**
    * set aria-expanend initial
    * this is needed to ensure that the page
    * is accesable without javascript
    */
   setElementAttribute(trigger, 'aria-expanded', false);

   /** 
    * toggle aria expanded attribute for current target element
    */
   trigger.addEventListener('click', function() {
       if(trigger.getAttribute('aria-expanded') === 'false') {
           setElementAttribute(trigger, 'aria-expanded', true);
       } else {
           setElementAttribute(trigger, 'aria-expanded', false);
       }
   });
 });

 /** 
  * if keycode is equal to escape key
  * set checkbox state false
  * set aria expanded false
  * and set focus to trigger element
  */ 
 document.addEventListener('keydown', function(event) {
     if(event.keyCode === 27) {
       ariaExpandedTriggers.forEach((trigger) => {
         const triggerCheckbox = trigger.previousSibling;

         triggerCheckbox.checked = false;
         trigger.setAttribute('aria-expanded', 'false');
         trigger.focus();
       });
     }
 });
}

function initTabLists() {
 const tabLists = document.querySelectorAll('[role="tablist"]');

 /** 
  * set target element aria selected attribute true
  * and set sibling aria selected attribute false
  */ 
 nodeListToArray(tabLists).forEach((tabList) => {
   const tabs = nodeListToArray(tabList.querySelectorAll('[role="tab"]'));
   
   tabs.forEach((tab) => {
     tab.addEventListener('click', function() {
       setElementAttribute(tabs, 'aria-selected', false);
       setElementAttribute(tab, 'aria-selected', true);
     })
   });
 });  
}

/** 
* convert a nodeList to an array of nodes
*/
function nodeListToArray(nodeList) {
 const returnValue = [];

 for (let i = 0; i < nodeList.length; i++) {
   returnValue.push(nodeList.item(i));
 }

 return returnValue;
}

/**
* set attribute to element /element Array
* 
* @param element - target element or element Array
* @param attribute - target element attribute
* @param value - attribute value
* 
*/
function setElementAttribute(element, attribute, value) {
  if (element instanceof Element) {
     element.setAttribute(attribute, value);
     return;
 }

 if (element instanceof Array) {
   element.forEach((currentElement) => {
     currentElement.setAttribute(attribute, value);
   });
 }
}