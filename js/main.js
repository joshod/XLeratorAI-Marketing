// XLeratorAI — shared site JS

document.addEventListener('DOMContentLoaded', function() {
  var hamburger = document.querySelector('.nav-hamburger');
  var mobileNav = document.getElementById('mobileNav');

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  var links = mobileNav.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function() {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});
