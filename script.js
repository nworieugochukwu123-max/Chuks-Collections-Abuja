const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

const pageLoader = document.querySelector('.page-loader');
if (pageLoader) {
  const loaderCount = pageLoader.querySelector('.loader-count');
  const loaderProgress = pageLoader.querySelector('.loader-progress');
  const progressFill = loaderProgress?.querySelector('span');
  if (!(loaderCount instanceof HTMLElement) || !(loaderProgress instanceof HTMLElement) || !(progressFill instanceof HTMLElement)) {
    throw new Error('The page loader is missing its counter or progress indicator.');
  }

  let count = 1;
  const countTimer = window.setInterval(() => {
    count += 1;
    loaderCount.textContent = String(count);
    loaderProgress.setAttribute('aria-valuenow', String(count));
    progressFill.style.transform = `scaleX(${count / 100})`;

    if (count === 100) {
      window.clearInterval(countTimer);
      window.setTimeout(() => {
        pageLoader.classList.add('is-done');
        document.documentElement.classList.remove('is-loading');
      }, 250);
    }
  }, 18);
}

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    menuBtn.setAttribute('aria-expanded', nav.classList.toggle('open'));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

if (
  'IntersectionObserver' in window &&
  typeof CSS !== 'undefined' &&
  typeof CSS.supports === 'function' &&
  !CSS.supports('animation-timeline', 'view()') &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.block, .facts, .shop-top, .toolbar, .pcard, .timeline li, .shop')
    .forEach((element) => {
      element.classList.add('scroll-reveal');
      revealObserver.observe(element);
    });
}