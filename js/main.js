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

// Quiz slide-in toast — appears after scrolling ~25% of the page
(function() {
  var toast = document.getElementById('quizToast');
  var closeBtn = document.getElementById('quizToastClose');
  if (!toast) return;

  // Don't show on the survey page itself
  if (window.location.pathname.indexOf('survey') !== -1) return;

  // Respect dismissal for 7 days
  var dismissedAt = localStorage.getItem('quizToastDismissed');
  if (dismissedAt && (Date.now() - Number(dismissedAt)) < 7 * 24 * 60 * 60 * 1000) return;

  var shown = false;

  function onScroll() {
    if (shown) return;
    var scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    if (scrollPct > 0.25) {
      shown = true;
      toast.classList.add('visible');
      window.removeEventListener('scroll', onScroll);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toast.classList.remove('visible');
      toast.classList.add('dismissed');
      localStorage.setItem('quizToastDismissed', String(Date.now()));
    });
  }
})();
