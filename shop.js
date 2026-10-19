// Prices are placeholders in naira. Change them here.
const WHATSAPP = '2348037880175';
const PRODUCTS = [
  { id: 'quiet-suit', name: 'The Quiet Suit', desc: 'Soft tailoring in deep umber.', cat: 'clothing', price: 85000, img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=85', alt: 'Man wearing a relaxed brown suit' },
  { id: 'everyday-uniform', name: 'Everyday Uniform', desc: 'Layering in natural cotton.', cat: 'clothing', price: 35000, img: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85', alt: 'Textured neutral menswear on a clothing rack' },
  { id: 'after-hours', name: 'After Hours', desc: 'Sharp separates in midnight.', cat: 'clothing', price: 45000, img: 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=900&q=85', alt: 'Man in a dark shirt and trousers outdoors' },
  { id: 'daily-step', name: 'The Daily Step', desc: 'Leather sneakers in easy white.', cat: 'shoes', price: 28000, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85', alt: 'Clean white and red leather sneakers' },
  { id: 'boardroom', name: 'The Boardroom', desc: 'Polished brown leather loafer.', cat: 'shoes', price: 40000, img: 'https://media.gettyimages.com/id/1070339582/photo/businessman-with-leather-shoes-tying-shoe-laces.jpg?s=612x612&w=0&k=20&c=0S3BaT4GG7aJz1fJ0Cprt_ED-sdPoSSMOPf90WuOWl0=', alt: 'Polished brown leather corporate loafer' },
  { id: 'on-time', name: 'On Time', desc: 'Steel watch with a black dial.', cat: 'accessories', price: 25000, img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85', alt: 'Classic silver wristwatch with a black face' },
  { id: 'off-duty', name: 'Off-Duty', desc: 'Casual layers for the weekend.', cat: 'clothing', price: 18000, img: 'https://media.gettyimages.com/id/1365136707/photo/confident-young-man-against-brown-background.jpg?s=612x612&w=0&k=20&c=zKsJbmayrm3GMOUfQyMgew6OtPgiDzMBdmd7V_ezrvg=', alt: 'African man wearing a casual T-shirt and jeans' }
];

const $ = (s) => document.querySelector(s);
const money = (n) => '₦' + n.toLocaleString('en-NG');
let cart = [];
try { cart = JSON.parse(localStorage.getItem('cc-cart')) || []; } catch (e) { cart = []; }
let filter = 'all';
let sort = 'featured';

function renderProducts() {
  let list = PRODUCTS.filter((p) => filter === 'all' || p.cat === filter);
  if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
  $('#products').innerHTML = list.map((p) => `
    <article class="pcard">
      <div class="pimg"><img loading="lazy" src="${p.img}" alt="${p.alt}"></div>
      <div class="pmeta"><h3>${p.name}</h3><span class="price">${money(p.price)}</span></div>
      <p class="pdesc">${p.desc}</p>
      <button class="btn" type="button" data-add="${p.id}">Add to cart</button>
    </article>`).join('');
}

function renderCart() {
  const rows = cart.map((c) => ({ ...c, p: PRODUCTS.find((p) => p.id === c.id) })).filter((r) => r.p);
  const count = rows.reduce((n, r) => n + r.qty, 0);
  const total = rows.reduce((n, r) => n + r.qty * r.p.price, 0);
  $('#count').textContent = count;
  $('#cart-empty').hidden = count > 0;
  $('#cart-foot').hidden = count === 0;
  $('#total').textContent = money(total);
  $('#cart-items').innerHTML = rows.map((r) => `
    <li class="cart-row">
      <img src="${r.p.img}" alt="">
      <div>
        <h3>${r.p.name}</h3>
        <p>${money(r.p.price)}</p>
        <div class="qty">
          <button type="button" data-dec="${r.id}" aria-label="Remove one ${r.p.name}">−</button>
          <span>${r.qty}</span>
          <button type="button" data-inc="${r.id}" aria-label="Add one more ${r.p.name}">+</button>
        </div>
      </div>
      <button class="remove" type="button" data-rm="${r.id}" aria-label="Remove ${r.p.name} from cart">Remove</button>
    </li>`).join('');
  const lines = rows.map((r) => `- ${r.qty} x ${r.p.name} (${money(r.p.price * r.qty)})`).join('\n');
  const msg = `Hello Chuks Collections, I would like to order:\n${lines}\nTotal: ${money(total)}`;
  $('#checkout').href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  try { localStorage.setItem('cc-cart', JSON.stringify(cart)); } catch (e) { /* storage unavailable */ }
}

function setCart(open) {
  $('#cart').classList.toggle('open', open);
  $('#scrim').classList.toggle('open', open);
  (open ? $('#close-cart') : $('#open-cart')).focus();
}

function change(id, delta) {
  const line = cart.find((c) => c.id === id);
  if (!line) { if (delta > 0) cart.push({ id, qty: 1 }); }
  else { line.qty += delta; if (line.qty <= 0) cart = cart.filter((c) => c.id !== id); }
  renderCart();
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-add],[data-inc],[data-dec],[data-rm],[data-f]');
  if (!t) return;
  if (t.dataset.add) { change(t.dataset.add, 1); setCart(true); }
  else if (t.dataset.inc) change(t.dataset.inc, 1);
  else if (t.dataset.dec) change(t.dataset.dec, -1);
  else if (t.dataset.rm) { cart = cart.filter((c) => c.id !== t.dataset.rm); renderCart(); }
  else if (t.dataset.f) {
    filter = t.dataset.f;
    document.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', c === t));
    renderProducts();
  }
});
$('#sort').addEventListener('change', (e) => { sort = e.target.value; renderProducts(); });
$('#open-cart').addEventListener('click', () => setCart(true));
$('#close-cart').addEventListener('click', () => setCart(false));
$('#scrim').addEventListener('click', () => setCart(false));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('#cart').classList.contains('open')) setCart(false); });

renderProducts();
renderCart();