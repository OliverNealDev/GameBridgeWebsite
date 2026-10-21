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

  events: {
    gameBridge: {
      next: { date: '', ticketUrl: '' },
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
    { name: 'Radical Forge', url: 'https://radicalforge.com/' },
    { name: 'Nosebleed Interactive', url: 'https://nosebleedinteractive.com/' },
    { name: 'Coatsink', url: 'https://coatsink.com/' },
    { name: 'Double Eleven', url: 'https://double11.com/' },
    { name: 'Boneloaf', url: 'https://gangbeasts.game/' },
  ],
};
