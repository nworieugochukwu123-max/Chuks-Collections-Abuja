const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

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