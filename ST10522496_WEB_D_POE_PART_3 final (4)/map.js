/* ==========================================================================
   Aura Luxe — enquiry.js
   Product / service enquiry form. After validation the page answers the
   customer straight away with an estimated price, availability and delivery
   time, then sends the enquiry to the business with AJAX.
   ========================================================================== */
(function () {
  'use strict';
  var Aura = window.Aura, F = Aura.forms, el = Aura.el, money = Aura.formatPrice, cfg = window.AURA_CONFIG;
  var form = document.getElementById('enquiryForm');
  if (!form) return;

  var products = window.AURA_PRODUCTS || [];
  var byId = {};
  products.forEach(function (p) { byId[p.id] = p; });

  var DELIVERY = {
    durban: { label: 'Durban', time: 'same-day or next-day delivery' },
    kzn: { label: 'Elsewhere in KwaZulu-Natal', time: '1\u20132 days' },
    gauteng: { label: 'Gauteng', time: '2\u20135 days via The Courier Guy or Pargo' },
    wcape: { label: 'Western Cape', time: '2\u20135 days via The Courier Guy or Pargo' },
    other: { label: 'Another province', time: '2\u20135 days via The Courier Guy or Pargo' }
  };
  var TYPES = {
    product: 'Product availability & pricing',
    wholesale: 'Wholesale order',
    gifting: 'Gift, wedding or corporate order',
    partnership: 'Influencer or sponsorship partnership',
    consultation: '\u201cFind Your Aura\u201d scent consultation'
  };
  var CONTACT = { email: 'email', whatsapp: 'WhatsApp', phone: 'phone call' };
  var GIFT_WRAP = 30;

  /* build the fragrance checkboxes from the shared product data */
  var group = document.getElementById('fragranceGroup');
  products.forEach(function (p) {
    group.append(el('label', { class: 'choice' }, [
      el('input', { type: 'checkbox', name: 'fragrance', value: p.id }),
      el('span', { text: p.name + ' (' + money(p.price) + ')' })
    ]));
  });

  /* pre-select fragrances that are already in the cart */
  var cart = Aura.storage.get('auraLuxeCart', []) || [];
  var maxQty = 1, preselected = [];
  cart.forEach(function (item) {
    var cb = form.querySelector('input[name="fragrance"][value="' + item.id + '"]');
    if (cb) { cb.checked = true; preselected.push(byId[item.id].name); maxQty = Math.max(maxQty, Number(item.quantity) || 1); }
  });
  if (preselected.length) {
    form.elements.quantity.value = maxQty;
    var note = document.getElementById('cartNote');
    note.textContent = 'We pre-selected ' + preselected.join(', ') + ' from your cart.';
    note.hidden = false;
  }

  /* show only the fields that matter for the chosen enquiry type */
  var typeSel = form.elements.enquiryType;
  var qtyHint = document.getElementById('quantity-hint');
  function syncType() {
    var t = typeSel.value;
    [].forEach.call(form.querySelectorAll('[data-show-for]'), function (block) {
      block.hidden = !(t && block.dataset.showFor.split(' ').indexOf(t) > -1);
    });
    qtyHint.textContent = t === 'wholesale'
      ? 'Wholesale minimum: 10 units in total across your selection.'
      : 'How many bottles of each selected fragrance (1\u2013500).';
  }
  typeSel.addEventListener('change', syncType);
  syncType();

  function selectedProducts() {
    return [].map.call(form.querySelectorAll('input[name="fragrance"]:checked'), function (c) { return byId[c.value]; });
  }

  var checks = {
    wholesaleUnits: function (field) {
      if (typeSel.value !== 'wholesale') return '';
      var units = Number(field.value) * Math.max(selectedProducts().length, 1);
      return units < 10 ? 'Wholesale orders start at 10 units in total. Your selection is ' + units + ' unit' + (units === 1 ? '' : 's') + '.' : '';
    }
  };

  F.init(form, {
    checks: checks,
    onValid: function () {
      var d = {
        name: F.clean(form.elements.fullName.value),
        email: F.clean(form.elements.email.value),
        phone: F.clean(form.elements.phone.value),
        type: typeSel.value,
        contact: form.querySelector('input[name="contactMethod"]:checked').value,
        province: form.elements.province.value,
        qty: Number(form.elements.quantity.value) || 1,
        gift: form.elements.giftWrap.checked,
        message: F.clean(form.elements.message.value),
        items: selectedProducts()
      };
      var shopping = ['product', 'wholesale', 'gifting'].indexOf(d.type) > -1;
      var ref = F.reference('AL-ENQ');
      var response = document.getElementById('enquiryResponse');

      var children = [
        el('span', { class: 'ref-badge', text: ref }),
        el('h2', { id: 'responseHeading', text: 'Thank you, ' + d.name.split(' ')[0] + '!' }),
        el('p', { text: 'We have received your ' + TYPES[d.type].toLowerCase() + ' enquiry. Here is what we can tell you straight away:' })
      ];

      if (shopping && d.items.length) {
        var subtotal = 0;
        var rows = d.items.map(function (p) {
          var line = p.price * d.qty; subtotal += line;
          return el('tr', {}, [el('td', { text: p.name }), el('td', { class: 'num', text: String(d.qty) }), el('td', { class: 'num', text: money(p.price) }), el('td', { class: 'num', text: money(line) })]);
        });
        var total = subtotal + (d.gift ? GIFT_WRAP : 0);
        var foot = [];
        if (d.gift) foot.push(el('tr', {}, [el('td', { colspan: 3, text: 'Gift wrapping' }), el('td', { class: 'num', text: money(GIFT_WRAP) })]));
        foot.push(el('tr', {}, [el('td', { colspan: 3, text: d.type === 'wholesale' ? 'Retail value (wholesale quote to follow)' : 'Estimated total (excl. delivery)' }), el('td', { class: 'num', text: money(total) })]));
        children.push(el('table', { class: 'summary-table' }, [
          el('caption', { text: 'Your estimate' }),
          el('thead', {}, el('tr', {}, [el('th', { scope: 'col', text: 'Fragrance (50ml)' }), el('th', { scope: 'col', class: 'num', text: 'Qty' }), el('th', { scope: 'col', class: 'num', text: 'Price' }), el('th', { scope: 'col', class: 'num', text: 'Total' })])),
          el('tbody', {}, rows),
          el('tfoot', {}, foot)
        ]));
      }

      var dl = [];
      function row(k, v) { dl.push(el('dt', { text: k }), el('dd', { text: v })); }
      row('Enquiry type', TYPES[d.type]);
      if (shopping) {
        row('Availability', 'All selected fragrances are part of our current signature collection. We will confirm stock for ' + (d.qty * d.items.length) + ' unit' + (d.qty * d.items.length === 1 ? '' : 's') + ' when we reply.');
        var del = DELIVERY[d.province];
        row('Estimated delivery', del.label + ': ' + del.time + '.');
        if (d.type === 'wholesale') row('Wholesale pricing', 'Your order meets our 10-unit minimum. We will send the wholesale price list with our reply.');
      }
      if (d.type === 'partnership') row('Next step', 'Our brand team will review your message and contact you about collaboration options.');
      if (d.type === 'consultation') row('Next step', 'We will contact you to book your free \u201cFind Your Aura\u201d scent consultation.');
      row('How we will reply', 'By ' + CONTACT[d.contact] + ' (' + (d.contact === 'email' ? d.email : d.phone) + ').');
      children.push(el('dl', { class: 'detail-list' }, dl));

      var status = el('p', { class: 'send-status', role: 'status', text: 'Sending your enquiry to our team\u2026' });
      var summaryText = [
        'Reference: ' + ref, 'Name: ' + d.name, 'Email: ' + d.email, 'Phone: ' + d.phone,
        'Enquiry type: ' + TYPES[d.type], 'Preferred contact: ' + CONTACT[d.contact],
        shopping ? 'Fragrances: ' + d.items.map(function (p) { return p.name; }).join(', ') + ' x ' + d.qty : '',
        shopping ? 'Delivery area: ' + DELIVERY[d.province].label : '',
        d.gift ? 'Gift wrapping requested' : '', '', 'Message:', d.message
      ].filter(function (l, i, a) { return l !== '' || a[i - 1] !== ''; }).join('\n');
      var subject = '[Aura Luxe] ' + TYPES[d.type] + ' ' + ref;
      var openMail = el('a', { class: 'btn btn-outline', href: F.mailto(cfg.recipientEmail, subject, summaryText), text: 'Email this enquiry instead' });
      var again = el('button', { type: 'button', class: 'btn btn-primary', text: 'Make another enquiry' });
      children.push(status, el('div', { class: 'form-actions' }, [again, openMail]));

      response.replaceChildren.apply(response, children);
      form.hidden = true; response.hidden = false; response.focus();

      again.addEventListener('click', function () {
        form.reset(); syncType(); form.hidden = false; response.hidden = true;
        form.querySelector('[type="submit"]').disabled = false;
        form.elements.fullName.focus();
      });

      F.send({ _subject: subject, _template: 'table', _replyto: d.email, reference: ref, name: d.name, email: d.email, phone: d.phone,
               enquiryType: TYPES[d.type], preferredContact: CONTACT[d.contact],
               fragrances: d.items.map(function (p) { return p.name; }).join(', ') || 'n/a', quantityEach: shopping ? d.qty : 'n/a',
               deliveryArea: shopping ? DELIVERY[d.province].label : 'n/a', giftWrap: d.gift ? 'yes' : 'no', message: d.message })
        .then(function (res) {
          if (res.ok) { status.className = 'send-status is-ok'; status.textContent = 'Your enquiry has been sent to our team. Reference ' + ref + '.'; }
          else { status.className = 'send-status is-warn'; status.textContent = 'We could not reach our mail service just now. Please use \u201cEmail this enquiry instead\u201d so your details reach us.'; }
        });
    }
  });
})();
