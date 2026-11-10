/*
 * Everything that changes between events lives here. Edit this file, commit, done.
 *
 * Dates are YYYY-MM-DD. A "next" date that has passed is ignored automatically,
 * so a stale entry falls back to "date to be announced" rather than advertising
 * an event that already happened.
 */
window.GAMEBRIDGE = {
  // Paste the form action URL from Mailchimp: Audience > Signup forms > Embedded form.
  // It looks like https://XXXX.usNN.list-manage.com/subscribe/post?u=...&id=...
  // Leave it empty and the form still validates, but says it is not connected yet.
  mailchimpAction: '',

  // Shown on the sponsor/exhibit prompt. Leave empty to point people at Facebook instead.
  contactEmail: '',

  socials: {
    x: 'https://x.com/Game_Bridge',
    facebook: 'https://www.facebook.com/gamebridge',
    eventbrite: 'https://www.eventbrite.co.uk/o/game-bridge-4494242007',
  },

  // "next" takes two optional extras for a one-off edition:
  //   name: shown under the date and in the banner at the top of the page
  //   note: one or two sentences on anything different this time (room, coach time)
  // Once a "next" date passes it is shown as "the last one was...", so "last" only
  // needs updating if you clear "next" by hand.
  events: {
    gameBridge: {
      next: {
        date: '2026-11-17',
        ticketUrl: 'https://www.eventbrite.co.uk/e/game-bridge-x-animex-registration-2004063342405',
        name: 'Game Bridge X Animex',
        note: 'Part of the Animex festival, in The Hub on the top floor of the Students’ Union. You don’t need an Animex ticket. The coach leaves Newcastle at 4:45pm.',
      },
      last: { date: '2026-06-04' },
    },
    gamayoCoach: {
      next: { date: '', ticketUrl: '' },
      last: { date: '2025-11-13' },
    },
  },

  // Most recent first. Shown as a plain list of names, so no logo files to chase.
  sponsors: [
    { name: 'Behaviour Interactive', url: 'https://www.bhvr.com/' },
    { name: 'Coatsink', url: 'https://coatsink.com/' },
    { name: 'Double Eleven', url: 'https://double11.com/' },
    { name: 'Radical Forge', url: 'https://radicalforge.com/' },
    { name: 'Dink', url: 'https://dinkdevs.com/' },
    { name: 'Silent Games', url: 'https://www.silentgames-studio.com/' },
  ],
};
