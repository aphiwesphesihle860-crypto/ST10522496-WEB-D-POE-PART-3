/* ==========================================================================
   Aura Luxe — main.js  (WEDE5020 Part 3)
   Shared behaviour used on every page:
   helpers, mobile navigation, accordion, tabs, modal (focus trap),
   scroll-reveal animations and social sharing links.
   ========================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('js-ready');

  var Aura = (window.Aura = window.Aura || {});

  /* ---------- helpers ---------- */
  Aura.formatPrice = function (value) {
    return 'R ' + Number(value).toFixed(2);
  };

  /* Build a DOM node safely (text is always inserted as text, never as HTML) */
  Aura.el = function (tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      var val = attrs[key];
      if (val === null || val === undefined || val === false) return;
      if (key === 'class') node.className = val;
      else if (key === 'text') node.textContent = val;
      else if (key === 'dataset') Object.assign(node.dataset, val);
      else if (key.indexOf('on') === 0 && typeof val === 'function') node.addEventListener(key.slice(2), val);
      else node.setAttribute(key, val === true ? '' : val);
    });
    [].concat(children || []).forEach(function (child) {
      if (child === null || child === undefined || child === false) return;
      node.append(child.nodeType ? child : document.createTextNode(String(child)));
    });
    return node;
  };

  /* Responsive image attributes for a product (3 widths; the browser picks the best one) */
  Aura.imgAttrs = function (p, sizes) {
    var base = 'pictures/' + p.image;
    return {
      src: base + '-480.webp',
      srcset: base + '-480.webp 480w, ' + base + '-800.webp 800w, ' + base + '-1200.webp 1200w',
      sizes: sizes,
      width: 480, height: 480
    };
  };

  Aura.storage = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked */ }
    }
  };

  Aura.debounce = function (fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  };

  /* ---------- responsive navigation ---------- */
  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');
  if (navToggle && siteNav) {
    var setNav = function (open) {
      siteNav.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    navToggle.addEventListener('click', function () {
      setNav(!siteNav.classList.contains('is-open'));
    });
    // close after choosing a link (same-page links) ...
    siteNav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    // ... when tapping outside the header ...
    document.addEventListener('click', function (e) {
      if (siteNav.classList.contains('is-open') && !e.target.closest('.site-header')) setNav(false);
    });
    // ... with Escape (focus returns to the button) ...
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && siteNav.classList.contains('is-open')) { setNav(false); navToggle.focus(); }
    });
    // ... and when the window grows to desktop width.
    window.addEventListener('resize', Aura.debounce(function () {
      if (window.innerWidth > 1000) setNav(false);
    }, 100));
  }

  /* ---------- modal with focus trap ---------- */
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  var current = null;

  function onKeydown(e) {
    if (!current) return;
    if (e.key === 'Escape') { Aura.closeModal(); return; }
    if (current.onKey) current.onKey(e);
    if (e.key === 'Tab') {
      var items = [].slice.call(current.modal.querySelectorAll(FOCUSABLE)).filter(function (n) { return n.offsetParent !== null || n === document.activeElement; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  Aura.openModal = function (modal, opener, opts) {
    if (!modal) return;
    if (current) Aura.closeModal(true);
    current = { modal: modal, opener: opener || document.activeElement, onKey: opts && opts.onKey };
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onKeydown);
    var target = modal.querySelector('[data-autofocus]') || modal.querySelector('[data-close]') || modal.querySelector(FOCUSABLE);
    if (target) target.focus();
  };

  Aura.closeModal = function (silent) {
    if (!current) return;
    var c = current;
    current = null;
    c.modal.classList.remove('is-open');
    c.modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onKeydown);
    if (!silent && c.opener && c.opener.focus) c.opener.focus();
  };

  document.querySelectorAll('.modal').forEach(function (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('[data-close]')) Aura.closeModal();
    });
  });

  /* ---------- accordion (FAQ) ---------- */
  document.querySelectorAll('[data-accordion]').forEach(function (acc) {
    var items = [].slice.call(acc.querySelectorAll('.accordion-item'));

    function setOpen(item, open) {
      var btn = item.querySelector('.accordion-trigger');
      var panel = item.querySelector('.accordion-panel');
      btn.setAttribute('aria-expanded', String(open));
      item.classList.toggle('is-open', open);
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
    }

    items.forEach(function (item, i) {
      var btn = item.querySelector('.accordion-trigger');
      var panel = item.querySelector('.accordion-panel');
      panel.id = panel.id || 'acc-panel-' + i;
      btn.id = btn.id || 'acc-btn-' + i;
      btn.setAttribute('aria-controls', panel.id);
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', btn.id);
      setOpen(item, i === 0); // first question open by default
      btn.addEventListener('click', function () {
        setOpen(item, btn.getAttribute('aria-expanded') !== 'true');
      });
    });

    var toggleAll = document.querySelector('[data-accordion-toggle]');
    if (toggleAll) {
      toggleAll.addEventListener('click', function () {
        var expand = toggleAll.dataset.state !== 'open';
        items.forEach(function (item) { setOpen(item, expand); });
        toggleAll.dataset.state = expand ? 'open' : 'closed';
        toggleAll.textContent = expand ? 'Collapse all' : 'Expand all';
      });
    }

    window.addEventListener('resize', Aura.debounce(function () {
      items.forEach(function (item) {
        if (item.classList.contains('is-open')) {
          var p = item.querySelector('.accordion-panel');
          p.style.maxHeight = p.scrollHeight + 'px';
        }
      });
    }, 150));
  });

  /* ---------- tabs (About page) ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (wrap) {
    var tabs = [].slice.call(wrap.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

    function select(index, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (focus) tabs[index].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i); });
      tab.addEventListener('keydown', function (e) {
        var n = tabs.length, next = null;
        if (e.key === 'ArrowRight') next = (i + 1) % n;
        if (e.key === 'ArrowLeft') next = (i - 1 + n) % n;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = n - 1;
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });

    var start = tabs.findIndex(function (t) { return '#' + t.id === location.hash; });
    select(start > -1 ? start : 0);
  });

  /* ---------- scroll reveal animation ---------- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var observer = ('IntersectionObserver' in window && !reduce)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;

  Aura.reveal = function (nodes) {
    [].forEach.call(nodes, function (node, i) {
      if (!observer) { node.classList.add('is-visible'); return; }
      node.classList.add('reveal');
      node.style.transitionDelay = Math.min(i % 6, 5) * 70 + 'ms';
      observer.observe(node);
    });
  };
  Aura.reveal(document.querySelectorAll('.card, .family-card, .feature-list li, .chip-list li, .faq-item, .gallery-item, .form-card'));

  /* ---------- social sharing (off-page SEO) ---------- */
  var pageUrl = encodeURIComponent(location.href.split('#')[0]);
  var pageTitle = encodeURIComponent(document.title);
  document.querySelectorAll('[data-share]').forEach(function (a) {
    var network = a.dataset.share;
    if (location.protocol === 'file:') return; // keep the canonical URLs written in the HTML
    if (network === 'facebook') a.href = 'https://www.facebook.com/sharer/sharer.php?u=' + pageUrl;
    if (network === 'whatsapp') a.href = 'https://wa.me/?text=' + pageTitle + '%20' + pageUrl;
    if (network === 'x') a.href = 'https://twitter.com/intent/tweet?text=' + pageTitle + '&url=' + pageUrl;
  });

  /* ---------- footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });
})();
