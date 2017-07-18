var options = {
    root: document.querySelector('.main'),
    rootMargin: '0px',
    threshold: 1.0 // trigger only when element comes into view completely
};
var ob = new IntersectionObserver((entries, observer) => {
  entries[0].target.classList.toggle('red');
}, options);

// observe all paragraphs, when coming into view, change color
document.querySelectorAll('p').forEach((item) => {
  ob.observe(item);
});
