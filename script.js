(function () {
  'use strict';

  var config = window.GAMEBRIDGE || {};

  // ---------- Dates ----------

  function parseDate(value) {
    if (!value) return null;
    var parts = value.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatDate(date) {
    return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function today() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  // "Today", "Tomorrow" or "In 9 days" for anything inside three weeks, otherwise nothing.
  function countdown(date) {
    var days = Math.round((date - today()) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return days <= 21 ? 'In ' + days + ' days' : '';
  }

  function node(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  function icon(id) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    var use = document.createElementNS(ns, 'use');
    use.setAttribute('href', '#' + id);
    svg.setAttribute('aria-hidden', 'true');
    svg.appendChild(use);
    return svg;
  }

  // ---------- Event cards ----------

  var upcoming = [];

  function renderEvent(card) {
    var data = (config.events || {})[card.dataset.event];
    if (!data) return;

    var status = card.querySelector('[data-status]');
    var tickets = card.querySelector('[data-tickets]');
    var ticketsLabel = card.querySelector('[data-tickets-label]');
    var isCoach = card.dataset.event === 'gamayoCoach';
    var label = isCoach ? 'Next coach' : 'Next date';
    var now = today();

    var info = data.next || {};
    var next = parseDate(info.date);
    var last = data.last && parseDate(data.last.date);

    status.textContent = '';

    if (next && next >= now) {
      var soon = countdown(next);
      var when = node('time', 'status-value', formatDate(next));
      when.dateTime = info.date;

      card.classList.add('is-confirmed');
      status.append(node('span', 'status-label', label + (soon ? ' · ' + soon : '')), when);
      if (info.name) status.append(node('span', 'status-name', info.name));
      if (info.note) status.append(node('span', 'status-note', info.note));

      if (info.ticketUrl) {
        tickets.href = info.ticketUrl;
        ticketsLabel.textContent = isCoach ? 'Book your seat' : 'Get tickets';
      }
      upcoming.push({
        date: next,
        name: info.name || card.querySelector('h3').textContent,
        href: info.ticketUrl || '#' + card.id,
      });
      return;
    }

    // A "next" date that has passed counts as the most recent one.
    if (next && (!last || next > last)) last = next;

    status.append(node('span', 'status-label', label), node('span', 'status-value', 'To be announced'));
    if (last) status.append(node('small', '', 'The last one was ' + formatDate(last) + '.'));
  }

  document.querySelectorAll('[data-event]').forEach(renderEvent);

  // The banner in the hero points at whichever event is soonest.
  var heroNext = document.querySelector('[data-hero-next]');
  if (heroNext && upcoming.length) {
    var soonest = upcoming.sort(function (a, b) { return a.date - b.date; })[0];
    var day = soonest.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    // The date never breaks mid-way, so on a phone the banner wraps as name / date.
    heroNext.querySelector('[data-hero-next-text]').append(node('strong', '', soonest.name), ' ', node('span', 'nowrap', day));
    heroNext.href = soonest.href;
    heroNext.hidden = false;
  }

  // ---------- Socials, sponsors, contact ----------

  var socials = config.socials || {};
  document.querySelectorAll('[data-social]').forEach(function (link) {
    var url = socials[link.dataset.social];
    if (url) link.href = url;
  });

  // The sponsor band stays hidden unless there is at least one name to show.
  var sponsorList = document.querySelector('[data-sponsors]');
  var sponsors = config.sponsors || [];
  if (sponsorList && sponsors.length) {
    sponsors.forEach(function (sponsor) {
      var item = document.createElement('li');
      var inner = node(sponsor.url ? 'a' : 'span', 'sponsor', '');
      inner.append(node('span', '', sponsor.name));
      if (sponsor.url) {
        inner.href = sponsor.url;
        inner.rel = 'noopener';
        inner.append(icon('i-out'));
      }
      item.appendChild(inner);
      sponsorList.appendChild(item);
    });
    document.querySelector('[data-sponsors-wrap]').hidden = false;
  }

  // Contact links use the email when there is one, otherwise the Facebook page.
  document.querySelectorAll('[data-contact]').forEach(function (link) {
    if (config.contactEmail) {
      var subject = link.dataset.contact === 'sponsor' ? '?subject=' + encodeURIComponent('Sponsoring or exhibiting at Game Bridge') : '';
      link.href = 'mailto:' + config.contactEmail + subject;
      if (link.hasAttribute('data-contact-show')) link.textContent = config.contactEmail;
    } else if (socials.facebook) {
      link.href = socials.facebook;
    }
  });

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Newsletter (Mailchimp) ----------

  var form = document.querySelector('[data-signup]');
  if (!form) return;

  var email = form.querySelector('#email');
  var emailError = form.querySelector('#email-error');
  var message = form.querySelector('[data-form-message]');
  var button = form.querySelector('button[type="submit"]');
  var action = (config.mailchimpAction || '').trim();

  // Without JavaScript the form still posts straight to Mailchimp in a new tab.
  if (action) {
    form.action = action;
    form.method = 'post';
    form.target = '_blank';
  }

  function showError(text) {
    emailError.textContent = text;
    emailError.hidden = !text;
    email.setAttribute('aria-invalid', text ? 'true' : 'false');
  }

  function showMessage(text, kind) {
    message.textContent = text;
    message.className = 'form-message' + (kind ? ' is-' + kind : '');
    message.hidden = !text;
  }

  // Mailchimp messages arrive as HTML with a leading "0 - " field index. DOMParser
  // builds an inert document, so nothing in the message can run or load.
  function cleanMailchimpMessage(html) {
    var text = String(html || '').replace(/^\d+\s*-\s*/, '');
    return new DOMParser().parseFromString(text, 'text/html').body.textContent.trim();
  }

  // Mailchimp's post-json endpoint only speaks JSONP, so this is a script tag, not fetch.
  function subscribe(fields) {
    return new Promise(function (resolve, reject) {
      var callback = 'gbMailchimp' + Date.now();
      var script = document.createElement('script');
      var timer = setTimeout(function () { cleanup(); reject(new Error('timeout')); }, 12000);

      function cleanup() {
        clearTimeout(timer);
        delete window[callback];
        script.remove();
      }

      window[callback] = function (data) { cleanup(); resolve(data); };
      script.onerror = function () { cleanup(); reject(new Error('network')); };
      script.src = action.replace('/post?', '/post-json?') + '&' + new URLSearchParams(fields).toString() + '&c=' + callback;
      document.body.appendChild(script);
    });
  }

  email.addEventListener('input', function () {
    if (email.getAttribute('aria-invalid') === 'true' && email.validity.valid) showError('');
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    showMessage('');

    var value = email.value.trim();
    if (!value) { showError('Enter your email address.'); email.focus(); return; }
    if (!email.validity.valid) { showError('That doesn’t look like an email address.'); email.focus(); return; }
    showError('');

    if (form.querySelector('[name="hp"]').value) return;

    if (!action) {
      showMessage('Preview only: the newsletter isn’t connected to Mailchimp yet, so nothing was sent.', '');
      return;
    }

    var fields = { EMAIL: value, FNAME: form.querySelector('#fname').value.trim() };
    // Mailchimp's own honeypot field is named b_<u>_<id>; send it empty.
    var params = new URL(action).searchParams;
    fields['b_' + params.get('u') + '_' + params.get('id')] = '';

    button.disabled = true;
    button.textContent = 'Subscribing…';

    subscribe(fields)
      .then(function (data) {
        if (data.result === 'success') {
          form.reset();
          showMessage('Nearly there. Check your inbox to confirm your subscription.', 'ok');
        } else {
          var text = cleanMailchimpMessage(data.msg);
          if (/already subscribed/i.test(text)) showMessage('You’re already on the list. See you at the next one.', 'ok');
          else showMessage(text || 'Something went wrong. Please try again.', 'error');
        }
      })
      .catch(function () {
        showMessage('Couldn’t reach Mailchimp. Check your connection and try again.', 'error');
      })
      .then(function () {
        button.disabled = false;
        button.textContent = 'Subscribe';
      });
  });
})();
