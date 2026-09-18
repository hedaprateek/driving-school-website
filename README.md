# Driving school & RTO services website

A website for a car driving school that also handles RTO (Regional Transport Office) work. It is split into separate pages (tabs), and every page shares the same header and footer.

| Tab            | Page            | What's on it                                                                     |
| -------------- | --------------- | -------------------------------------------------------------------------------- |
| Home           | `index.html`    | Animated hero, the two services, price comparison, road-to-licence timeline, FAQ |
| Driving courses| `courses.html`  | Price cards with a "course + licence" toggle, and a plan builder with a live total |
| RTO services   | `rto.html`      | Searchable list of RTO services, each with a tick-off documents checklist        |
| LL mock test   | `test.html`     | Free learner's licence practice test with road signs, plus a sign reference      |
| Book now       | `book.html`     | Booking form, pre-filled from the plan builder or a service checklist            |
| Contact        | `contact.html`  | Phone, WhatsApp, email, hours with a live "open now" badge, map, message form     |

The site is plain HTML, CSS and JavaScript. There is no build step, no library and no image file — the illustrations and road signs are drawn in code.

**Live site:** https://hedaprateek.github.io/driving-school-website/

## Files

```
index.html, courses.html, rto.html, test.html, book.html, contact.html
css/styles.css      Styles
js/config.js        ← Business details AND all prices (edit this first)
js/layout.js        Header tabs, footer and phone action bar shared by every page (includes the Stunity Tech credit)
js/main.js          Open-now badge, plan builder, RTO finder, booking form, form delivery
js/test.js          The learner's licence mock test and its question bank
assets/favicon.svg  Browser tab icon
```

## 1. Add your business details and prices

Open `js/config.js`. Everything a customer sees — name, phone, hours, course prices, RTO service charges and document lists — comes from this one file.

| Setting                       | What it is                                                                  |
| ----------------------------- | --------------------------------------------------------------------------- |
| `businessName`, `tagline`     | Shown in the header, footer and page titles                                  |
| `phone`, `whatsapp`, `email`  | `whatsapp` is digits only with country code, e.g. `919812345678`             |
| `hours`                       | Hours as text, shown on the site                                            |
| `openDays`, `openTime`, `closeTime` | Hours as numbers, for the live "Open now / Closed" badge              |
| `batchStartDay`               | Weekday new batches start (1 = Monday), for "Next batch starts …"            |
| `mapQuery`                    | Text to search on Google Maps for the Contact page map. Empty hides the map |
| `formEndpoint`                | Where form submissions go (see step 3)                                      |
| `courses`                     | Each course: name, price, sessions, minutes, short description, points. `popular: true` highlights one |
| `automaticExtra`, `addons`    | Extra charges in the plan builder (a price of `0` shows as "Free")          |
| `bundlePrice`, `bundleServices` | The "course + licence" bundle price, and which RTO services it replaces (used to show the saving) |
| `rtoServices`                 | Each service: category, name, your fee, usual time, description and documents list |

Prices are your service charges as plain numbers (`3500`, not `"₹3,500"`). Government fees are always described as "extra, at actuals".

For better search-engine results, also replace the business name in the `<title>` tag at the top of each page.

## 2. Replace the example content

These parts hold **example content**. Replace them with your real details before going live. Each is marked with an `EDIT:` comment in `index.html`.

- **Stats** on the home page (learners trained, RTO jobs, years).
- **Price-match promise** in the comparison section — keep it only if you will honour it.
- **"Free trial drive"** wording in the hero and the final call-to-action — remove it if you don't offer one.

Document lists in `config.js` follow the common national requirements; check them against your state's RTO once.

## Colour themes

Visitors can switch the site's colour with the palette button in the header. The choice is remembered on their device. There are four themes, all taken from road and RTO signage: **Highway yellow** (the default), **Signboard green**, **RTO blue** and **Signal red**. The animated car in the hero changes colour too.

- **To change a theme's colours,** edit its `:root[data-theme="…"]` block at the top of `css/styles.css`.
- **To add or rename a theme,** edit the `THEMES` list in `js/layout.js`.

## Header, tabs and footer

The header tabs and the footer are defined once, in `js/layout.js`:

- **To add or rename a tab,** edit the `TABS` list. For a new page, copy an existing page and set `data-page` on its `<body>` to the new tab's `id`.
- **To change the footer credit,** edit `CREDIT_COMPANY` and `CREDIT_AUTHOR`.

## 3. Set up form delivery

The booking and contact forms work in one of two ways:

- **With `formEndpoint` empty (the default):** WhatsApp opens with the visitor's details already typed in, and they just press send. If WhatsApp isn't set up, their email app opens instead.
- **With a form service:** submissions are emailed to you directly. [Formspree](https://formspree.io) has a free plan — create a form and paste its endpoint (like `https://formspree.io/f/abcdwxyz`) as `formEndpoint`.

The plan builder and each RTO checklist also have their own "Send on WhatsApp" buttons, which send the customer's exact plan or list of missing documents.

## Useful links to share

- `rto.html?service=rc-transfer` opens the RC transfer checklist directly (use any service `id` from `config.js`).
- `rto.html#vehicle` opens the RTO page filtered to vehicle services (`#licence`, `#commercial` also work).
- `book.html?service=ll` opens the booking form with the learner's licence already chosen.

## Preview locally

Open `index.html` in a browser, or run a small local server:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Publish

The site is published with GitHub Pages from the `main` branch. Any push to `main` goes live within a minute or two.
