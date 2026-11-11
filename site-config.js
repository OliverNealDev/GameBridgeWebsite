/*
 * Everything that changes between events lives here. Edit this file, commit, done.
 *
 * Dates are YYYY-MM-DD. A "next" date that has passed is ignored automatically,
 * so a stale entry falls back to "Date to be announced" rather than advertising
 * an event that already happened.
 */
window.GAMEBRIDGE = {
  // Shown on the privacy page. Leave empty to point people at Facebook instead.
  contactEmail: '',

  socials: {
    x: 'https://x.com/Game_Bridge',
    facebook: 'https://www.facebook.com/gamebridge',
    eventbrite: 'https://www.eventbrite.co.uk/o/game-bridge-4494242007',
  },

  // Each card shows the date and a Get tickets button, nothing else.
  // "name" is optional, for a one-off edition: it sits beside the date at the top of the page.
  // "ticketLabel" is optional too, and replaces "Get tickets" on the button, e.g. once sold out.
  events: {
    gameBridge: {
      next: {
        date: '2026-11-17',
        ticketUrl: 'https://www.eventbrite.co.uk/e/game-bridge-x-animex-registration-2004063342405',
        name: 'Game Bridge X Animex',
      },
    },
    gamayoCoach: {
      // Sold out with a waiting list. The button still says Get tickets: the listing explains.
      next: {
        date: '2026-11-26',
        ticketUrl: 'https://gamayocoachnov26.eventbrite.co.uk',
      },
    },
  },

  // Photos for the gallery popup, in the order shown. Put the files in assets/img/gallery/
  // and list them here. The Gallery buttons stay hidden while this list is empty.
  gallery: [
    // { src: 'assets/img/gallery/june-2026-01.jpg', alt: 'A packed room at Game Bridge, June 2026' },
  ],
};
