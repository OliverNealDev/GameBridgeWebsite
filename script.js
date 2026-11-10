(function () {
  'use strict';

  var config = window.GAMEBRIDGE || {};
  var socials = config.socials || {};

  function node(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  // ---------- Dates ----------

  function parseDate(value) {
    if (!value) return null;
    var parts = value.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function today() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  // "Tuesday 17 November", with the year added only when it isn't this one.
  function formatDate(date) {
    var options = { weekday: 'long', day: 'numeric', month: 'long' };
    if (date.getFullYear() !== new Date().getFullYear()) options.year = 'numeric';
    return date.toLocaleDateString('en-GB', options);
  }

  // ---------- Header ----------

  // The header starts transparent over the hero and turns solid once the page scrolls.
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 16); };
    header.classList.add('is-fixed');
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- Event cards ----------

  var upcoming = [];

  document.querySelectorAll('[data-event]').forEach(function (card) {
    var info = ((config.events || {})[card.dataset.event] || {}).next || {};
    var date = parseDate(info.date);
    var tickets = card.querySelector('[data-tickets]');

    // No confirmed date: there is nothing to book, so offer the newsletter instead.
    if (!date || date < today()) {
      tickets.textContent = 'Get notified';
      tickets.href = '#newsletter';
      tickets.className = 'btn btn-outline';
      return;
    }

    var when = node('time', '', formatDate(date));
    when.dateTime = info.date;
    card.querySelector('[data-date]').replaceChildren(when);
    card.classList.add('is-confirmed');
    if (info.ticketUrl) tickets.href = info.ticketUrl;

    upcoming.push({
      date: date,
      name: info.name || card.querySelector('h3').textContent,
      href: tickets.href,
    });
  });

  // The hero carries whichever event is soonest: its date, and a button straight to tickets.
  var soonest = upcoming.sort(function (a, b) { return a.date - b.date; })[0];
  var heroNext = document.querySelector('[data-hero-next]');
  var heroCta = document.querySelector('[data-hero-cta]');
  if (soonest && heroNext && heroCta) {
    heroNext.append(node('strong', '', formatDate(soonest.date)), node('span', '', soonest.name));
    heroNext.hidden = false;
    heroCta.textContent = 'Get tickets';
    heroCta.href = soonest.href;
    heroCta.rel = 'noopener';
  }

  // ---------- Gallery ----------

  var photos = (config.gallery || []).filter(function (photo) { return photo && photo.src; });
  var lightbox = document.querySelector('[data-lightbox]');

  if (lightbox && lightbox.showModal && photos.length) {
    var photoEl = lightbox.querySelector('[data-lightbox-img]');
    var countEl = lightbox.querySelector('[data-lightbox-count]');
    var current = 0;
    var touchX = null;

    var show = function (index) {
      current = (index + photos.length) % photos.length;
      photoEl.src = photos[current].src;
      photoEl.alt = photos[current].alt || '';
      countEl.textContent = (current + 1) + ' / ' + photos.length;
      // Fetch the next photo now so the arrow press shows it straight away.
      new Image().src = photos[(current + 1) % photos.length].src;
    };

    lightbox.classList.toggle('is-single', photos.length === 1);

    document.querySelectorAll('[data-gallery-open]').forEach(function (button) {
      button.hidden = false;
      button.addEventListener('click', function () {
        show(current);
        lightbox.showModal();
      });
    });
    document.querySelectorAll('[data-gallery-fallback]').forEach(function (el) { el.hidden = true; });

    lightbox.querySelector('[data-lightbox-prev]').addEventListener('click', function () { show(current - 1); });
    lightbox.querySelector('[data-lightbox-next]').addEventListener('click', function () { show(current + 1); });
    lightbox.querySelector('[data-lightbox-close]').addEventListener('click', function () { lightbox.close(); });

    // Escape closes a <dialog> on its own; the arrow keys are ours.
    lightbox.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
    });

    // A click on the dark area around the photo closes the popup.
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener('touchstart', function (event) {
      touchX = event.touches.length === 1 ? event.touches[0].clientX : null;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (event) {
      if (touchX === null) return;
      var moved = event.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(moved) > 48) show(current + (moved < 0 ? 1 : -1));
    });
  }

  // ---------- Socials, contact, year ----------

  document.querySelectorAll('[data-social]').forEach(function (link) {
    var url = socials[link.dataset.social];
    if (url) link.href = url;
  });

  // Contact links use the email when there is one, otherwise the Facebook page.
  document.querySelectorAll('[data-contact]').forEach(function (link) {
    if (config.contactEmail) {
      link.href = 'mailto:' + config.contactEmail;
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

    var fields = {
      EMAIL: value,
      FNAME: form.querySelector('#fname').value.trim(),
      LNAME: form.querySelector('#lname').value.trim(),
    };
    if (config.mailchimpConsentField) fields[config.mailchimpConsentField] = 'Y';
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
