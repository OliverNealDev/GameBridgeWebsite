/*
 * Everything that changes between events lives here. Edit this file, commit, done.
 *
 * Dates are YYYY-MM-DD. A "next" date that has passed is ignored automatically,
 * so a stale entry falls back to "Date to be announced" rather than advertising
 * an event that already happened.
 */
window.GAMEBRIDGE = {
  // Paste the form action URL from Mailchimp: Audience > Signup forms > Embedded form.
  // It looks like https://XXXX.usNN.list-manage.com/subscribe/post?u=...&id=...
  // Leave it empty and the form still validates, but says it is not connected yet.
  mailchimpAction: 'https://facebook.us8.list-manage.com/subscribe/post?u=bdd7c4345598779e1ee9fa563&id=2137a1345b&f_id=00b3c5e2f0',

  // The audience's "Email" marketing-permission tick box. The signup's consent line covers it,
  // so every signup sends it as ticked. Leave empty if GDPR fields are turned off in Mailchimp.
  mailchimpConsentField: 'gdpr[3953]',

  // Shown on the privacy page. Leave empty to point people at Facebook instead.
  contactEmail: '',

  socials: {
    x: 'https://x.com/Game_Bridge',
    facebook: 'https://www.facebook.com/gamebridge',
    eventbrite: 'https://www.eventbrite.co.uk/o/game-bridge-4494242007',
  },

  // Each card shows the date and a Get tickets button, nothing else.
  // "name" is optional, for a one-off edition: it sits beside the date at the top of the page.
  events: {
    gameBridge: {
      next: {
        date: '2026-11-17',
        ticketUrl: 'https://www.eventbrite.co.uk/e/game-bridge-x-animex-registration-2004063342405',
        name: 'Game Bridge X Animex',
      },
    },
    gamayoCoach: {
      next: { date: '', ticketUrl: '' },
    },
  },

  // Photos for the gallery popup, in the order shown. Put the files in assets/img/gallery/
  // and list them here. The Gallery buttons stay hidden while this list is empty.
  gallery: [
    // { src: 'assets/img/gallery/june-2026-01.jpg', alt: 'A packed room at Game Bridge, June 2026' },
  ],
};
