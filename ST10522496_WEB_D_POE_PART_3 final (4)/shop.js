/* ==========================================================================
   Aura Luxe — gallery.js
   Filterable image gallery with an accessible lightbox
   (click / keyboard arrows / Escape / touch swipe).
   ========================================================================== */
(function () {
  'use strict';
  var Aura = window.Aura;
  var gallery = document.getElementById('galleryGrid');
  if (!gallery) return;

  var items = [].slice.call(gallery.querySelectorAll('.gallery-item'));
  var filterBtns = [].slice.call(document.querySelectorAll('[data-filter]'));
  var status = document.getElementById('galleryStatus');
  var box = document.getElementById('lightbox');
  var img = document.getElementById('lbImage');
  var caption = document.getElementById('lbCaption');
  var counter = document.getElementById('lbCounter');
  var index = 0;

  function visible() {
    return items.filter(function (a) { return !a.parentElement.hidden; });
  }

  /* ---------- filter buttons ---------- */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var family = btn.dataset.filter;
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      items.forEach(function (a) {
        a.parentElement.hidden = !(family === 'all' || a.dataset.family === family);
      });
      var n = visible().length;
      status.textContent = 'Showing ' + n + (n === 1 ? ' image' : ' images') + (family === 'all' ? '' : ' in ' + family);
    });
  });

  /* ---------- lightbox ---------- */
  function show(i) {
    var list = visible();
    if (!list.length) return;
    index = (i + list.length) % list.length;
    var a = list[index];
    var thumb = a.querySelector('img');
    var big = a.getAttribute('href'), stem = big.replace('-1200.webp', '');
    img.sizes = '(max-width: 700px) 94vw, 700px';
    img.srcset = stem + '-800.webp 800w, ' + big + ' 1200w';
    img.src = big;
    img.alt = thumb.alt;
    caption.replaceChildren();
    var strong = document.createElement('strong');
    strong.textContent = a.dataset.name;
    caption.append(strong, a.dataset.family + ' | ' + a.dataset.audience + ' | ' + a.dataset.price);
    counter.textContent = (index + 1) + ' / ' + list.length;
    // preload neighbours so next/previous feel instant
    [index + 1, index - 1].forEach(function (n) {
      var pre = new Image();
      pre.src = list[(n + list.length) % list.length].getAttribute('href');
    });
  }

  function onKey(e) {
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  }

  items.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      show(visible().indexOf(a));
      Aura.openModal(box, a, { onKey: onKey });
    });
  });

  document.getElementById('lbNext').addEventListener('click', function () { show(index + 1); });
  document.getElementById('lbPrev').addEventListener('click', function () { show(index - 1); });

  var startX = null;
  box.addEventListener('touchstart', function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });
})();
