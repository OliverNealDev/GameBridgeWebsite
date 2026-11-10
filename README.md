# Game Bridge website

A one-page landing site for **Game Bridge**, the North East games industry networking night, and its
**GaMaYo Coach**. Vanilla HTML, CSS and JavaScript. No framework, no build step, no backend.

The brief, as given: *"just a landing page, links to our socials and newsletter sign up, and then
links to our two events: Game Bridge and GaMaYo coach. For now anyway."*

## Running it

Open `index.html` in a browser. Everything except `404.html` uses relative paths, so it works from
`file://` or any static host.

## What is here

| File | What it is |
|---|---|
| `index.html` | The page: hero with the next date and a tickets button, the two events, newsletter signup, footer with socials, and the gallery popup |
| `privacy.html` | Privacy policy: the newsletter, Eventbrite bookings, hosting, cookies (none), rights |
| `404.html` | Not-found page. GitHub Pages serves it for any missing URL, so its paths are root-relative |
| `site-config.js` | **The only file that needs editing between events.** Event dates and ticket links, gallery photos, contact email, socials |
| `styles.css` | One stylesheet. Every colour and size is a custom property in `:root` at the top |
| `script.js` | Fills the event dates and the hero from the config, runs the gallery popup and the newsletter form, sets contact links |
| `assets/fonts/` | Archivo, self-hosted, with its SIL Open Font License. Headings use its width axis, set slightly wide |
| `assets/img/` | Logo variants, favicon, social card, the hero photo and the GaMaYo wordmark (see [Where the content came from](#where-the-content-came-from)) |
| `robots.txt`, `sitemap.xml` | For search engines |

## Updating an event

Edit `site-config.js`:

```js
gameBridge: {
  next: { date: '2026-12-03', ticketUrl: 'https://www.eventbrite.co.uk/e/...' },
},
```

Each card carries one line of copy, the date and a button, and nothing else. With a future
`next.date`, the card shows the date, its **Get tickets** button goes straight to that Eventbrite
page, and the top of the page shows the soonest date with its own **Get tickets** button. Once the
date passes, the card drops back to *"Date to be announced"* with a **Get notified** button that
jumps to the newsletter, so a forgotten update never advertises an event that already happened.

A one-off edition can carry a `name`, which sits beside the date at the top of the page:

```js
next: {
  date: '2026-11-17',
  ticketUrl: 'https://www.eventbrite.co.uk/e/...',
  name: 'Game Bridge X Animex',
},
```

Venue, times and coach details live on the Eventbrite listing, not on the site.

## Adding gallery photos

Put the photos in `assets/img/gallery/` and list them in `site-config.js`, in the order to show them:

```js
gallery: [
  { src: 'assets/img/gallery/june-2026-01.jpg', alt: 'A packed room at Game Bridge, June 2026' },
  { src: 'assets/img/gallery/june-2026-02.jpg', alt: 'Two developers trying a demo' },
],
```

A **Gallery** button then appears in the header and in the hero. It opens the photos in a popup over
the page: the left and right arrow keys, the on-screen arrows or a swipe step through them, and
Escape, the close button or a click outside the photo closes it. While the list is empty the buttons
stay hidden. Around 1600px wide and under 300KB each keeps the popup quick.

## The newsletter (Mailchimp)

The signup form in `index.html` is wired to the Game Bridge audience. It subscribes people in place,
without leaving the page, using Mailchimp's JSONP endpoint, and Mailchimp's double opt-in email still
applies. If `script.js` doesn't run, the same form posts to Mailchimp's own signup page in a new tab.

Everything Mailchimp-specific is on the `<form>` itself, so moving to a different audience means
changing three things there, all from **Audience → Signup forms → Embedded form** in Mailchimp:

1. The form's `action` URL, which looks like
   `https://XXXX.usNN.list-manage.com/subscribe/post?u=...&id=...`
2. The bot-trap input's `name`, which is `b_<u>_<id>` using the two values from that URL.
3. The hidden `gdpr[...]` input, which ticks the audience's "Email" marketing permission. Remove it
   if GDPR fields are turned off in Mailchimp.

If the `XXXX.usNN.list-manage.com` host changes, update `script-src` in the Content-Security-Policy
at the top of `index.html` to match, or the signup will be blocked.

The form sends `EMAIL`, `FNAME` and `LNAME`, which are Mailchimp's default merge tags. If the audience
uses different tags for the names, rename the inputs' `name` in `index.html`.

## Where the content came from

Everything on the page is sourced from Game Bridge's own public channels, last checked 10 November
2026. Nothing is invented.

| Content | Source |
|---|---|
| Event description and venue | Game Bridge's [June 2026 Eventbrite listing](https://www.eventbrite.co.uk/e/game-bridge-june-2026-tickets-1987684355414) |
| The 17 November 2026 date and its name | The [Game Bridge X Animex Eventbrite listing](https://www.eventbrite.co.uk/e/game-bridge-x-animex-registration-2004063342405) |
| "Since 2013" | Animex's November 2023 listing: *"Game Bridge is 10 years old"* |
| GaMaYo Coach pick-up points | The [GaMaYo Coach Eventbrite listing](https://www.eventbrite.co.uk/e/gamayo-coach-tickets-1801954988879), 13 November 2025 |
| GaMaYo description (twice a year, in Yorkshire) | [gamayo.co.uk/about-us](https://gamayo.co.uk/about-us/) and Game Republic |
| Logo | Cut from the Game Bridge Eventbrite banner into transparent PNGs, with a white-wordmark version for dark backgrounds |
| Hero photo `game-bridge-night.jpg` | Game Bridge's Facebook page |
| GaMaYo wordmark `gamayo-logo.png` | gamayo.co.uk |

## Privacy and security

**The privacy policy is written to be accurate for this site, but it speaks for Game Bridge, so they
need to read and confirm it before launch.** In particular: who "the organisers" are, the contact
route (it uses `contactEmail` from `site-config.js`, falling back to Facebook), and the description of
how they use Eventbrite attendee data, which is based on their own listing (the coach passenger list
goes to the driver and a Game Bridge rep).

The site sets no cookies of its own and runs no analytics, which is why there is no cookie banner.
The only third-party request is the newsletter signup: submitting the form calls Mailchimp, which
sets its own cookies on `list-manage.com` (`_mcid`, `_abck`, `bm_sz`). The privacy policy says so.
Keep it that way, or update the policy: adding Google Analytics, a Meta pixel or an embedded video
would need a consent banner under UK PECR.

Each page carries a Content-Security-Policy in a `<meta>` tag. It allows scripts only from this site
and, on the home page, from the audience's Mailchimp host, and blocks everything else. If you add an embed or a
third-party script, add its domain to the policy on each page, or it will be silently blocked.
GitHub Pages can't set response headers, so `frame-ancestors` and HSTS aren't available; GitHub
enforces HTTPS itself.

## Open questions for Game Bridge

1. ~~The Mailchimp form URL~~ Connected 10 November 2026.
2. **Confirmation of the privacy policy**, per the section above.
3. **A contact email** for privacy requests. Until there is one, they go to the Facebook page. Set
   `contactEmail` in `site-config.js`.
4. **The next GaMaYo Coach date**, with its Eventbrite link. Game Bridge X Animex (17 November 2026)
   is already in.
5. **Copy.** The line under the headline and the one-line description on each event card are short
   stand-ins until Olly's paragraphs arrive. They are the three `<p>` tags with the classes `lede` and
   `event-summary` in `index.html`.
6. **Any other socials** (Instagram, LinkedIn, Bluesky, Discord). Only X, Facebook and Eventbrite were
   found publicly.
7. **Photos.** The gallery is built but empty, so its buttons are hidden: see
   [Adding gallery photos](#adding-gallery-photos). The hero photo is 960px wide, pulled from
   Facebook; an original from a recent event would sharpen it.
8. **Branding.** The logo is the existing mark. If a refresh is coming, the files to replace are the
   four in `assets/img/` that start with `gb-` plus the favicon, and the two brand colours at the top
   of `styles.css`.

## Going live

The site is live at **https://gamebridge.dev/** on GitHub Pages, deployed from `main` / root. Every
push to `main` redeploys it within a minute or two. The `CNAME` file holds the domain, so leave it in.

DNS is at GoDaddy: four `A` records on `@` pointing at GitHub Pages (`185.199.108.153` to
`185.199.111.153`) and a `www` `CNAME` to the owning account's `github.io` address. If the repo moves
to another GitHub account, update that `www` record to the new account's `<username>.github.io`.
`.dev` domains only work over HTTPS, so keep **Enforce HTTPS** ticked in Settings → Pages.

If the domain ever changes, search the repo for `gamebridge.dev` and replace it: that covers the
canonical, social-card and structured-data URLs, `sitemap.xml`, `robots.txt` and the `CNAME` file.
