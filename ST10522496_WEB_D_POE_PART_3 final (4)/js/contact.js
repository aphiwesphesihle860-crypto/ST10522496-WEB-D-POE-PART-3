/* ==========================================================================
   Aura Luxe — contact.js
   Validates the contact form, compiles the details into an e-mail addressed
   to the recipient defined in config.js, sends it with AJAX and offers a
   one-click "open in my e-mail app" fallback.
   ========================================================================== */
(function () {
  'use strict';
  var Aura = window.Aura, F = Aura.forms, cfg = window.AURA_CONFIG;
  var form = document.getElementById('contactForm');
  if (!form) return;

  var panel = document.getElementById('emailPanel');

  function compose(v) {
    var lines = [
      'Name: ' + v.name,
      'Email: ' + v.email,
      'Phone: ' + (v.phone || 'not provided'),
      'Type of message: ' + v.messageType,
      'Preferred date to be contacted: ' + (v.date || 'no preference'),
      'Subject: ' + v.subject,
      '',
      'Message:',
      v.message,
      '',
      '\u2014 Sent from the Aura Luxe contact form'
    ];
    return { subject: '[Aura Luxe] ' + v.messageType + ': ' + v.subject, body: lines.join('\n') };
  }

  F.init(form, {
    onValid: function () {
      var data = {
        name: F.clean(form.elements.name.value),
        email: F.clean(form.elements.email.value),
        phone: F.clean(form.elements.phone.value),
        messageType: F.clean(form.elements.messageType.value),
        date: form.elements.date.value,
        subject: F.clean(form.elements.subject.value),
        message: F.clean(form.elements.message.value)
      };
      var mail = compose(data);
      var submit = form.querySelector('[type="submit"]');
      submit.disabled = true; submit.textContent = 'Sending\u2026';

      var ref = F.reference('AL-MSG');
      var status = Aura.el('p', { class: 'send-status', role: 'status', text: 'Sending your message\u2026' });
      var openMail = Aura.el('a', { class: 'btn btn-primary', href: F.mailto(cfg.recipientEmail, mail.subject, mail.body), text: 'Open in my email app' });
      var again = Aura.el('button', { type: 'button', class: 'btn btn-outline', text: 'Send another message' });

      panel.replaceChildren(
        Aura.el('span', { class: 'ref-badge', text: ref }),
        Aura.el('h2', { id: 'emailHeading', text: 'Thank you, ' + data.name.split(' ')[0] + '!' }),
        Aura.el('p', { text: 'Your message has been prepared for ' + cfg.recipientEmail + '. This is exactly what we are sending:' }),
        Aura.el('pre', { class: 'email-preview', text: 'To: ' + cfg.recipientEmail + '\nSubject: ' + mail.subject + '\n\n' + mail.body }),
        status,
        Aura.el('div', { class: 'form-actions' }, [openMail, again])
      );
      form.hidden = true;
      panel.hidden = false;
      panel.focus();

      again.addEventListener('click', function () {
        form.reset(); form.hidden = false; panel.hidden = true;
        submit.disabled = false; submit.textContent = 'Send message';
        form.elements.name.focus();
      });

      F.send({ _subject: mail.subject, reference: ref, name: data.name, email: data.email, phone: data.phone || 'n/a',
               messageType: data.messageType, preferredDate: data.date || 'n/a', subject: data.subject, message: data.message,
               _replyto: data.email, _template: 'table' })
        .then(function (res) {
          if (res.ok) {
            status.className = 'send-status is-ok';
            status.textContent = 'Sent! Our team has received your message and will reply to ' + data.email + '.';
          } else {
            status.className = 'send-status is-warn';
            status.textContent = 'We could not reach our mail service just now. Please use \u201cOpen in my email app\u201d to send the message above directly to ' + cfg.recipientEmail + '.';
          }
        });
    }
  });
})();
