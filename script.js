document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle (every page) ---------- */
  const navToggle = document.getElementById('navToggle');
  const navbar = document.getElementById('navbar');
  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => navbar.classList.toggle('open'));
  }

  /* ---------- Dropdown: only the small caret arrow toggles it open -----
     Tapping the "About Us" text itself always navigates to the page,
     on every device. Tapping the ▾ arrow next to it reveals the submenu. */
  document.querySelectorAll('.has-dropdown > a > .caret').forEach(caret => {
    caret.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parent = caret.closest('.has-dropdown');
      const wasOpen = parent.classList.contains('open');
      document.querySelectorAll('.has-dropdown.open').forEach(el => el.classList.remove('open'));
      if (!wasOpen) parent.classList.add('open');
    });
  });

  // Tapping/clicking anywhere outside an open dropdown closes it again
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.has-dropdown.open').forEach(group => {
      if (!group.contains(e.target)) group.classList.remove('open');
    });
  });

  /* ---------- Hero slideshow (home page only) ---------- */
  const slideshow = document.getElementById('slideshow');
  if (slideshow) {
    const slides = slideshow.querySelectorAll('.slide');
    const dotsWrap = document.getElementById('slideDots');
    let current = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('.dot');

    function goTo(i) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    let autoSlide = setInterval(() => goTo(current + 1), 5000);
    slideshow.addEventListener('mouseenter', () => clearInterval(autoSlide));
    slideshow.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => goTo(current + 1), 5000);
    });
  }

  /* ---------- Scroll reveal for cards (whichever exist on the page) ---------- */
  const revealEls = document.querySelectorAll(
    '.event-card, .team-card, .hub-card, .gallery-item, .quicklink-card, .contact-card'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));

  /* ---------- Graceful fallback for missing images (every page) ---------- */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => img.classList.add('img-broken'));
  });

  /* ---------- Auto-highlight the current page in the nav ----------
     This replaces hardcoding class="active" in each page's HTML, so the
     wrong link can never stay gold just because a header block got
     copy-pasted from another page. */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar a').forEach(link => {
    const linkPage = link.getAttribute('href').split('#')[0].split('/').pop();
    link.classList.toggle('active', linkPage === currentPage);
  });

  // If the active page is a dropdown item (e.g. Team, under About Us),
  // also highlight the dropdown's top-level trigger link.
  document.querySelectorAll('.has-dropdown').forEach(group => {
    const trigger = group.querySelector(':scope > a');
    const activeChild = group.querySelector('.dropdown a.active');
    if (trigger && activeChild) trigger.classList.add('active');
  });

});