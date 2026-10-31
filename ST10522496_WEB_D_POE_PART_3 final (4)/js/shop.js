/* ==========================================================================
   Aura Luxe — shop.js  (products page)
   - Dynamic content: product cards are built from AURA_PRODUCTS with DOM methods
   - Search + filter + sort
   - Quick-view modal, checkout modal
   - Persistent cart (localStorage)
   ========================================================================== */
(function () {
  'use strict';
  var Aura = window.Aura, el = Aura.el, money = Aura.formatPrice;
  var products = window.AURA_PRODUCTS || [];
  var grid = document.getElementById('productGrid');
  if (!grid) return;

  var CART_KEY = 'auraLuxeCart';
  var byId = {};
  products.forEach(function (p) { byId[p.id] = p; });

  /* ---------- element references ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var searchInput = $('searchInput'), familyFilter = $('familyFilter'), audienceFilter = $('audienceFilter'),
      sortSelect = $('sortSelect'), priceRange = $('priceRange'), priceOutput = $('priceOutput'),
      resetBtn = $('resetFilters'), resultsCount = $('resultsCount'), emptyState = $('emptyState');
  var cartItemsEl = $('cartItems'), cartCount = $('cartCount'), cartTotal = $('cartTotal'),
      checkoutBtn = $('checkoutButton'), clearBtn = $('clearCartButton'), cartMessage = $('cartMessage');

  /* ---------- populate filters from the data ---------- */
  var families = [], audiences = [];
  products.forEach(function (p) {
    if (families.indexOf(p.family) < 0) families.push(p.family);
    if (audiences.indexOf(p.audience) < 0) audiences.push(p.audience);
  });
  families.forEach(function (f) { familyFilter.append(el('option', { value: f, text: f })); });
  audiences.forEach(function (a) { audienceFilter.append(el('option', { value: a, text: a })); });

  var prices = products.map(function (p) { return p.price; });
  var minPrice = Math.min.apply(null, prices), maxPrice = Math.max.apply(null, prices);
  priceRange.min = minPrice; priceRange.max = maxPrice; priceRange.value = maxPrice;
  priceOutput.textContent = money(maxPrice);

  /* allow links such as products.html?family=Floral or ?q=oud */
  var params = new URLSearchParams(location.search);
  if (params.get('q')) searchInput.value = params.get('q').slice(0, 60);
  if (params.get('family') && families.indexOf(params.get('family')) > -1) familyFilter.value = params.get('family');

  /* ---------- search / filter / sort ---------- */
  function visibleProducts() {
    var terms = searchInput.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    var limit = Number(priceRange.value);
    var list = products.filter(function (p) {
      var hay = [p.name, p.family, p.audience, p.notes, p.description].join(' ').toLowerCase();
      return terms.every(function (t) { return hay.indexOf(t) > -1; }) &&
        (familyFilter.value === 'all' || p.family === familyFilter.value) &&
        (audienceFilter.value === 'all' || p.audience === audienceFilter.value) &&
        p.price <= limit;
    });
    var sorters = {
      'price-asc': function (a, b) { return a.price - b.price; },
      'price-desc': function (a, b) { return b.price - a.price; },
      'name-asc': function (a, b) { return a.name.localeCompare(b.name); },
      'name-desc': function (a, b) { return b.name.localeCompare(a.name); }
    };
    if (sorters[sortSelect.value]) list.sort(sorters[sortSelect.value]);
    return list;
  }

  function buildCard(p) {
    var imgBtn = el('button', { type: 'button', class: 'card-media', 'aria-label': 'Quick view of ' + p.name }, [
      el('img', Object.assign(Aura.imgAttrs(p, '(max-width: 560px) 88vw, (max-width: 900px) 44vw, 300px'), { alt: p.alt, loading: 'lazy' }))
    ]);
    imgBtn.addEventListener('click', function () { openQuickView(p, imgBtn); });

    var quick = el('button', { type: 'button', class: 'btn btn-outline quick-view', text: 'Quick view' });
    quick.addEventListener('click', function () { openQuickView(p, quick); });
    var add = el('button', { type: 'button', class: 'btn add-to-cart', text: 'Add to cart' });
    add.addEventListener('click', function () { addToCart(p.id); });

    var card = el('article', { class: 'product-card', id: 'product-' + p.id, dataset: { id: p.id } }, [
      imgBtn,
      el('p', { class: 'tag', text: p.family + ' | ' + p.audience }),
      el('h3', { text: p.name }),
      el('p', { class: 'notes', text: p.notes }),
      el('div', { class: 'price', text: money(p.price) + ' \u2013 ' + p.size }),
      el('div', { class: 'card-actions' }, [quick, add])
    ]);
    return card;
  }

  function render() {
    var list = visibleProducts();
    var cards = list.map(buildCard);
    grid.replaceChildren.apply(grid, cards);
    Aura.reveal(cards);
    emptyState.hidden = list.length > 0;
    grid.hidden = list.length === 0;
    resultsCount.textContent = 'Showing ' + list.length + ' of ' + products.length + ' fragrances';
  }

  var renderSoon = Aura.debounce(render, 150);
  searchInput.addEventListener('input', renderSoon);
  [familyFilter, audienceFilter, sortSelect].forEach(function (n) { n.addEventListener('change', render); });
  priceRange.addEventListener('input', function () {
    priceOutput.textContent = money(priceRange.value);
    renderSoon();
  });
  resetBtn.addEventListener('click', function () {
    searchInput.value = ''; familyFilter.value = 'all'; audienceFilter.value = 'all';
    sortSelect.value = 'featured'; priceRange.value = maxPrice; priceOutput.textContent = money(maxPrice);
    render();
    searchInput.focus();
  });
  var searchForm = $('searchForm');
  if (searchForm) searchForm.addEventListener('submit', function (e) { e.preventDefault(); render(); });

  /* ---------- quick view modal ---------- */
  var qv = $('quickView');
  function openQuickView(p, opener) {
    var img = $('qvImage');
    var q = Aura.imgAttrs(p, '(max-width: 900px) 88vw, 360px');
    img.sizes = q.sizes; img.srcset = q.srcset; img.src = 'pictures/' + p.image + '-800.webp';
    img.alt = p.alt;
    $('qvTag').textContent = p.family + ' | ' + p.audience;
    $('qvTitle').textContent = p.name;
    $('qvDesc').textContent = p.description;
    $('qvNotes').textContent = p.notes;
    $('qvPrice').textContent = money(p.price) + ' \u2013 ' + p.size;
    var add = $('qvAdd');
    add.onclick = function () { addToCart(p.id); Aura.closeModal(); };
    Aura.openModal(qv, opener);
  }

  /* ---------- cart ---------- */
  var cart = (Aura.storage.get(CART_KEY, []) || []).map(function (item) {
    // Part 2 stored items by name only — migrate them to ids
    var match = byId[item.id] || products.filter(function (p) { return p.name === item.name; })[0];
    return match ? { id: match.id, quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)) } : null;
  }).filter(Boolean);

  function saveCart() { Aura.storage.set(CART_KEY, cart); }
  function cartTotals() {
    return cart.reduce(function (t, item) {
      t.count += item.quantity;
      t.sum += byId[item.id].price * item.quantity;
      return t;
    }, { count: 0, sum: 0 });
  }

  function cartButton(label, action, id, text, cls) {
    var b = el('button', { type: 'button', class: cls, 'aria-label': label, dataset: { action: action, id: id }, text: text });
    return b;
  }

  function renderCart() {
    var t = cartTotals();
    cartCount.textContent = t.count + (t.count === 1 ? ' item' : ' items');
    cartTotal.textContent = money(t.sum);
    checkoutBtn.disabled = cart.length === 0;
    clearBtn.hidden = cart.length === 0;

    if (!cart.length) {
      cartItemsEl.replaceChildren(el('p', { class: 'cart-empty', text: 'Your cart is empty. Add a fragrance to begin.' }));
      return;
    }
    cartItemsEl.replaceChildren.apply(cartItemsEl, cart.map(function (item) {
      var p = byId[item.id];
      return el('div', { class: 'cart-item' }, [
        el('div', {}, [el('strong', { text: p.name }), el('span', { text: money(p.price) + ' each' })]),
        el('div', { class: 'cart-controls' }, [
          cartButton('Decrease ' + p.name + ' quantity', 'decrease', p.id, '\u2212', 'quantity-button'),
          el('span', { text: String(item.quantity), 'aria-label': 'Quantity ' + item.quantity }),
          cartButton('Increase ' + p.name + ' quantity', 'increase', p.id, '+', 'quantity-button'),
          cartButton('Remove ' + p.name + ' from cart', 'remove', p.id, 'Remove', 'remove-item')
        ])
      ]);
    }));
  }

  function addToCart(id) {
    var existing = cart.filter(function (i) { return i.id === id; })[0];
    if (existing) existing.quantity += 1; else cart.push({ id: id, quantity: 1 });
    saveCart(); renderCart();
    cartMessage.textContent = byId[id].name + ' added to your cart.';
    cartCount.classList.remove('bump'); void cartCount.offsetWidth; cartCount.classList.add('bump');
  }

  cartItemsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var item = cart.filter(function (i) { return i.id === btn.dataset.id; })[0];
    if (!item) return;
    if (btn.dataset.action === 'increase') item.quantity += 1;
    if (btn.dataset.action === 'decrease') item.quantity -= 1;
    if (btn.dataset.action === 'remove' || item.quantity < 1) cart = cart.filter(function (i) { return i !== item; });
    saveCart(); renderCart();
  });

  clearBtn.addEventListener('click', function () {
    cart = []; saveCart(); renderCart();
    cartMessage.textContent = 'Your cart has been cleared.';
  });

  /* ---------- checkout modal ---------- */
  var checkoutModal = $('checkoutModal');
  checkoutBtn.addEventListener('click', function () {
    var list = $('checkoutList');
    list.replaceChildren.apply(list, cart.map(function (item) {
      var p = byId[item.id];
      return el('li', {}, [el('span', { text: item.quantity + ' \u00d7 ' + p.name }), el('span', { text: money(p.price * item.quantity) })]);
    }));
    $('checkoutTotal').textContent = money(cartTotals().sum);
    Aura.openModal(checkoutModal, checkoutBtn);
  });

  render();
  renderCart();
})();
