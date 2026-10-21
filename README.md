# Game Bridge website

A one-page landing site for **Game Bridge**, the North East games industry networking night, and its
**GaMaYo Coach**. Vanilla HTML, CSS and JavaScript. No framework, no build step, no backend.

The brief, as given: *"just a landing page, links to our socials and newsletter sign up, and then
links to our two events: Game Bridge and GaMaYo coach. For now anyway."*

## Running it

Open `index.html` in a browser. Everything is relative, so it works from `file://` or any static host.

## What is here

| File | What it is |
|---|---|
| `index.html` | The page: hero, the two events, sponsors, newsletter signup, footer with socials |
| `site-config.js` | **The only file that needs editing between events.** Event dates and ticket links, the Mailchimp form URL, socials, sponsors |
| `styles.css` | One stylesheet. Every colour and size is a custom property in `:root` at the top. Type is Archivo from Google Fonts, with headings set slightly wide on its width axis |
| `script.js` | Fills the event status lines from the config, renders sponsors, runs the newsletter form |
| `assets/img/` | Logo variants, favicon, social card, the hero photo and the GaMaYo wordmark (see [Where the content came from](#where-the-content-came-from)) |

## Updating an event

Edit `site-config.js`:

```js
gameBridge: {
  next: { date: '2026-12-03', ticketUrl: 'https://www.eventbrite.co.uk/e/...' },
  last: { date: '2026-06-04' },
},
```

With a future `next.date`, the card shows **Next: Thursday 3 December 2026** with a green dot and the
button goes straight to that Eventbrite page. Once the date passes, the card drops back to *"Next date
to be announced"* on its own, so a forgotten update never advertises an event that already happened.
Move the old date into `last` when you add the next one.

## Connecting the newsletter (Mailchimp)

1. In Mailchimp: **Audience → Signup forms → Embedded form**.
2. In the generated code, copy the form's `action` URL. It looks like
   `https://XXXX.usNN.list-manage.com/subscribe/post?u=...&id=...`
3. Paste it into `mailchimpAction` in `site-config.js`.

The form then subscribes people in place, without leaving the page, using Mailchimp's JSONP endpoint.
Mailchimp's double opt-in email still applies. Until it is set, the form validates normally but says
plainly that it is not connected yet and sends nothing.

The form sends `EMAIL` and `FNAME`, which are Mailchimp's default merge tags. If the audience uses a
different tag for first name, rename the input's `name` in `index.html`.

## Where the content came from

Everything on the page is sourced from Game Bridge's own public channels as of 21 October 2026.
Nothing is invented.

| Content | Source |
|---|---|
| Event description, venue, times, coach details, audience and 18+ rule | Game Bridge's [June 2026 Eventbrite listing](https://www.eventbrite.co.uk/e/game-bridge-june-2026-tickets-1987684355414) |
| "25+ events", "5k+ attendees" | Game Bridge's Eventbrite organiser stats (25 events, 5.1k total attendees) |
| "Since 2013" | Animex's November 2023 listing: *"Game Bridge is 10 years old"* |
| Sponsors | June 2026 silver sponsors (Behaviour, Radical Forge, Nosebleed, Coatsink) and the November 2024 sponsors (Double Eleven, Boneloaf) posted on [@Game_Bridge](https://x.com/Game_Bridge) |
| GaMaYo Coach date and route | The [GaMaYo Coach Eventbrite listing](https://www.eventbrite.co.uk/e/gamayo-coach-tickets-1801954988879), 13 November 2025 |
| GaMaYo description (300+ makers, twice a year) | [gamayo.co.uk/about-us](https://gamayo.co.uk/about-us/) and Game Republic |
| Logo | Cut from the Game Bridge Eventbrite banner into transparent PNGs, with a white-wordmark version for dark backgrounds |
| Hero photo `game-bridge-night.jpg` | Game Bridge's Facebook page |
| GaMaYo wordmark `gamayo-logo.png` | gamayo.co.uk |

## Open questions for Game Bridge

1. **The Mailchimp form URL**, per the steps above.
2. **A contact email** for sponsor and exhibitor enquiries. Until there is one, "Get in touch" goes to
   the Facebook page. Set `contactEmail` in `site-config.js`.
3. **The next dates** for Game Bridge and the GaMaYo Coach, with their Eventbrite links.
4. **Any other socials** (Instagram, LinkedIn, Bluesky, Discord). Only X, Facebook and Eventbrite were
   found publicly.
5. **Better photos.** The hero photo is 960px wide, pulled from Facebook. An original from a recent
   event would sharpen it.
6. **Branding.** The logo is the existing mark. If a refresh is coming, the files to replace are the
   four in `assets/img/` that start with `gb-` plus the favicon, and the two brand colours at the top
   of `styles.css`.

## Going live

The site is live on GitHub Pages at **https://olivernealdev.github.io/GameBridgeWebsite/**, deployed
from `main` / root. Every push to `main` redeploys it within a minute or two.

Any static host works. If it moves to its own domain, update the `og:url` and `og:image` URLs in
`index.html` to match, because link previews on X, Facebook and Discord need a full URL.
