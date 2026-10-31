/* ==========================================================================
   Aura Luxe — forms.js
   Shared client-side validation (HTML5 attributes + JavaScript), error
   handling, sanitising, and AJAX submission.
   ========================================================================== */
(function () {
  'use strict';
  var Aura = window.Aura;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^(?:\+27|0)[1-9][0-9]{8}$/;               // South African numbers
  var NAME_RE = /^[A-Za-z\u00C0-\u024F][A-Za-z\u00C0-\u024F'\u2019\- ]{1,59}$/;

  /* strip tags / control characters and trim — used before anything is displayed or sent */
  function clean(value) {
    return String(value == null ? '' : value)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
      .replace(/[<>]/g, '')
      .trim();
  }

  function fieldOf(control) { return control.closest('.field'); }

  function labelOf(control) {
    return control.dataset.label || (document.querySelector('label[for="' + control.id + '"]') || {}).textContent || control.name;
  }

  function validateControl(c, form, checks) {
    if (c.closest('[hidden]')) return '';                      // skip hidden conditional fields
    var label = String(labelOf(c)).replace('*', '').trim().toLowerCase();
    var isBox = c.type === 'checkbox';
    var val = isBox ? '' : clean(c.value);

    if (c.required) {
      if (isBox && !c.checked) return c.dataset.msgRequired || 'Please tick this box to continue.';
      if (!isBox && val === '') return c.dataset.msgRequired || 'Please enter your ' + label + '.';
    }
    if (val === '') return '';

    if (c.type === 'email' && !EMAIL_RE.test(val)) return 'Please enter a valid email address, e.g. name@example.com.';
    var check = (c.dataset.check || '').split(' ').filter(Boolean);
    if (check.indexOf('phone') > -1 && !PHONE_RE.test(val.replace(/[\s\-()]/g, ''))) return 'Please enter a valid South African number, e.g. 031 123 4567 or +27 82 123 4567.';
    if (check.indexOf('name') > -1 && !NAME_RE.test(val)) return 'Names may only contain letters, spaces, hyphens and apostrophes (2\u201360 characters).';
    if (c.minLength > 0 && val.length < c.minLength) return 'Please enter at least ' + c.minLength + ' characters (you have ' + val.length + ').';
    if (c.maxLength > 0 && val.length > c.maxLength) return 'Please keep this under ' + c.maxLength + ' characters.';

    if (c.type === 'number') {
      var n = Number(val);
      if (isNaN(n) || n !== Math.floor(n)) return 'Please enter a whole number.';
      if (c.min !== '' && n < Number(c.min)) return 'The minimum is ' + c.min + '.';
      if (c.max !== '' && n > Number(c.max)) return 'The maximum is ' + c.max + '.';
    }
    if (c.type === 'date') {
      if (c.min && val < c.min) return 'Please choose today\u2019s date or a future date.';
      if (c.max && val > c.max) return 'Please choose a date within the next year.';
    }
    for (var i = 0; i < check.length; i++) {
      if (checks && checks[check[i]]) {
        var msg = checks[check[i]](c, form);
        if (msg) return msg;
      }
    }
    return '';
  }

  function validateGroup(g) {
    if (g.closest('[hidden]')) return '';
    var min = Number(g.dataset.min || 1);
    var n = g.querySelectorAll('input:checked').length;
    return n < min ? (g.dataset.msg || 'Please make a selection.') : '';
  }

  function setState(wrapper, message, control) {
    if (!wrapper) return;
    var err = wrapper.querySelector('.field-error');
    wrapper.classList.toggle('is-invalid', !!message);
    wrapper.classList.toggle('is-valid', !message && !!(control && control.value));
    if (err) err.textContent = message;
    [].forEach.call(wrapper.querySelectorAll('input,select,textarea'), function (n) {
      if (message) { n.setAttribute('aria-invalid', 'true'); if (err) n.setAttribute('aria-describedby', err.id); }
      else n.removeAttribute('aria-invalid');
    });
  }

  function init(form, options) {
    options = options || {};
    var summary = form.querySelector('.error-summary');
    var controls = [].slice.call(form.querySelectorAll('input:not([type="hidden"]):not([type="radio"]),select,textarea'))
      .filter(function (c) { return !c.closest('[data-group]') && !c.closest('.honeypot'); });
    var groups = [].slice.call(form.querySelectorAll('[data-group]'));
    var radios = [].slice.call(form.querySelectorAll('input[type="radio"]'));

    // set a sensible date range at run time
    [].forEach.call(form.querySelectorAll('input[type="date"]'), function (d) {
      var today = new Date(), max = new Date();
      max.setFullYear(max.getFullYear() + 1);
      var iso = function (x) { return new Date(x.getTime() - x.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
      d.min = iso(today); d.max = iso(max);
    });

    // live character counters
    [].forEach.call(form.querySelectorAll('textarea[maxlength]'), function (t) {
      var out = form.querySelector('[data-counter-for="' + t.id + '"]');
      if (!out) return;
      var update = function () {
        out.textContent = t.value.length + ' / ' + t.maxLength + ' characters';
        out.classList.toggle('is-near', t.value.length > t.maxLength * 0.9);
      };
      t.addEventListener('input', update); update();
    });

    controls.forEach(function (c) {
      c.addEventListener('blur', function () { if (c.value !== '' || c.required) setState(fieldOf(c), validateControl(c, form, options.checks), c); });
      c.addEventListener('input', function () { if (fieldOf(c) && fieldOf(c).classList.contains('is-invalid')) setState(fieldOf(c), validateControl(c, form, options.checks), c); });
      c.addEventListener('change', function () { setState(fieldOf(c), validateControl(c, form, options.checks), c); });
    });
    groups.forEach(function (g) {
      g.addEventListener('change', function () { setState(g, validateGroup(g), null); });
    });
    radios.forEach(function (r) { r.addEventListener('change', function () { var g = r.closest('[data-group]'); if (g) setState(g, validateGroup(g), null); }); });

    function validateAll() {
      var problems = [];
      controls.concat(groups).forEach(function (node) {
        var isGroup = node.hasAttribute('data-group');
        var msg = isGroup ? validateGroup(node) : validateControl(node, form, options.checks);
        setState(isGroup ? node : fieldOf(node), msg, isGroup ? null : node);
        if (msg) problems.push({ node: node, msg: msg, label: isGroup ? (node.dataset.label || 'Selection') : String(labelOf(node)).replace('*', '').trim() });
      });
      // list the problems in the order they appear on the page
      problems.sort(function (x, y) { return x.node.compareDocumentPosition(y.node) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1; });
      return problems;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // spam trap: bots fill the hidden field, people never see it
      var trap = form.querySelector('.honeypot input');
      if (trap && trap.value) return;

      var problems = validateAll();
      if (problems.length) {
        if (summary) {
          var list = summary.querySelector('ul');
          list.replaceChildren();
          problems.forEach(function (p) {
            var a = document.createElement('a');
            var target = p.node.id ? p.node : p.node.querySelector('input');
            a.href = '#' + target.id;
            a.textContent = p.label + ': ' + p.msg;
            a.addEventListener('click', function (ev) { ev.preventDefault(); target.focus(); });
            var li = document.createElement('li'); li.append(a); list.append(li);
          });
          summary.hidden = false;
        }
        var first = problems[0].node;
        (first.id ? first : first.querySelector('input')).focus();
        return;
      }
      if (summary) summary.hidden = true;
      options.onValid(form);
    });

    form.addEventListener('reset', function () {
      setTimeout(function () {
        [].forEach.call(form.querySelectorAll('.field'), function (w) { setState(w, '', null); });
        if (summary) summary.hidden = true;
      }, 0);
    });
  }

  /* ---------- AJAX submission ---------- */
  function send(payload) {
    var cfg = window.AURA_CONFIG || {};
    var ctrl = ('AbortController' in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 10000);
    return fetch(cfg.ajaxEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      clearTimeout(timer);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json().catch(function () { return {}; });
    }).then(function (data) {
      if (data && (data.success === false || data.success === 'false')) throw new Error(data.message || 'Not accepted');
      return { ok: true };
    }).catch(function (err) {
      clearTimeout(timer);
      return { ok: false, reason: err && err.message };
    });
  }

  function reference(prefix) {
    var d = new Date();
    var stamp = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    return prefix + '-' + stamp + '-' + String(Math.floor(1000 + Math.random() * 9000));
  }

  function mailto(to, subject, body) {
    return 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  Aura.forms = { init: init, send: send, clean: clean, reference: reference, mailto: mailto };
})();
