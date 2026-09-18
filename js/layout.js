/* =====================================================================
   Shared page chrome: icon sprite, top bar, header tabs, footer, the
   WhatsApp button and the phone action bar. Every page loads this file,
   so the header and footer (including the Stunity Tech credit) are
   written once and stay identical on every tab.

   Usage in a page:
     <body data-page="rto">
     <script src="js/layout.js"></script>          <- header renders here
     <main id="main"> ... </main>
     <script>SiteLayout.renderFooter();</script>   <- footer renders here

   Business details (name, phone, email...) are filled in afterwards by
   main.js from js/config.js.
   ===================================================================== */
(function () {
  "use strict";

  // The tabs in the header, in order. The "Book now" button is added after them.
  var TABS = [
    { id: "home", href: "index.html", label: "Home" },
    { id: "courses", href: "courses.html", label: "Driving courses" },
    { id: "rto", href: "rto.html", label: "RTO services" },
    { id: "test", href: "test.html", label: "LL mock test" },
    { id: "contact", href: "contact.html", label: "Contact" },
  ];

  // Credit shown at the foot of every page.
  var CREDIT_COMPANY = "Stunity Tech";
  var CREDIT_AUTHOR = "Prateek";

  var page = document.body.getAttribute("data-page") || "home";
  var current = function (id) { return id === page ? ' aria-current="page"' : ""; };
  var icon = function (name) { return '<svg class="icon"><use href="#i-' + name + '"/></svg>'; };

  var SPRITE = [
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true">',
    '<symbol id="i-logo" viewBox="0 0 32 32"><circle cx="16" cy="16" r="11.5" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="16" cy="16" r="3.2" fill="currentColor"/><path d="M5 14.5c4-1.6 7.6-1.6 11-1.6s7 0 11 1.6M16 19.2V27.5" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/></symbol>',
    '<symbol id="i-wheel" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="2.2"/><path d="M3.2 10.5C6 9.4 9 9.2 12 9.2s6 .2 8.8 1.3M12 14.2v7.3"/></symbol>',
    '<symbol id="i-car" viewBox="0 0 24 24"><path d="M5 16H3.5v-4.2l1.8-4.7A2 2 0 0 1 7.2 6h9.6a2 2 0 0 1 1.9 1.1l1.8 4.7V16H19"/><path d="M3.5 12h17M9 16h6"/><circle cx="7" cy="16.5" r="2"/><circle cx="17" cy="16.5" r="2"/></symbol>',
    '<symbol id="i-id" viewBox="0 0 24 24"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><circle cx="8.5" cy="11" r="2.3"/><path d="M5 16.3c.6-1.6 2-2.4 3.5-2.4s2.9.8 3.5 2.4M14.5 9.5h4M14.5 13h4"/></symbol>',
    '<symbol id="i-doc" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15l2 2 4-4"/></symbol>',
    '<symbol id="i-swap" viewBox="0 0 24 24"><path d="M4 8h14l-4-4M20 16H6l4 4"/></symbol>',
    '<symbol id="i-bank" viewBox="0 0 24 24"><path d="M3 9.5 12 4l9 5.5M4.5 20h15M6 10.5v7M10 10.5v7M14 10.5v7M18 10.5v7"/></symbol>',
    '<symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.6 2.8 3.8 6 3.8 9.5s-1.2 6.7-3.8 9.5c-2.6-2.8-3.8-6-3.8-9.5S9.4 5.3 12 2.5z"/></symbol>',
    '<symbol id="i-truck" viewBox="0 0 24 24"><path d="M2 6h11v10H2zM13 9.5h4.5l3.5 3.8V16h-8"/><circle cx="6.5" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></symbol>',
    '<symbol id="i-plate" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 10.5v3M9 10.5h2v3M14 10.5h3M14 13.5h3"/></symbol>',
    '<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></symbol>',
    '<symbol id="i-rupee" viewBox="0 0 24 24"><path d="M6 4h12M6 9h12M13.5 20 7 13h2.5a4.5 4.5 0 0 0 0-9"/></symbol>',
    '<symbol id="i-route" viewBox="0 0 24 24"><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H17a3.5 3.5 0 0 0 0-7H7a3.5 3.5 0 0 1 0-7h8.5"/></symbol>',
    '<symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01"/></symbol>',
    '<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.9-3.9"/></symbol>',
    '<symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>',
    '<symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></symbol>',
    '<symbol id="i-mail" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></symbol>',
    '<symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></symbol>',
    '<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol>',
    '<symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>',
    '<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></symbol>',
    '<symbol id="i-users" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></symbol>',
    '<symbol id="i-award" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/></symbol>',
    '<symbol id="i-bolt" viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></symbol>',
    '<symbol id="i-chat" viewBox="0 0 24 24"><path d="M21 12a8.5 8.5 0 0 1-12.4 7.6L3 21l1.4-5.4A8.5 8.5 0 1 1 21 12z"/><path d="M8.5 10.5h7M8.5 14h4.5"/></symbol>',
    '<symbol id="i-gift" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="4.5" rx="1"/><path d="M5 12.5V21h14v-8.5M12 8v13M12 8S10.5 3 7.8 3.6C5.5 4.1 6.4 8 12 8zm0 0s1.5-5 4.2-4.4C18.5 4.1 17.6 8 12 8z"/></symbol>',
    '<symbol id="i-whatsapp" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></symbol>',
    '</svg>',
  ].join("");

  var BRAND =
    '<span class="brand-mark"><svg><use href="#i-logo"/></svg></span>' +
    '<span class="brand-text"><span class="brand-name" data-text="businessName">Rushikesh Motor Driving School</span>' +
    '<span class="brand-sub" data-text="tagline">Driving School &amp; RTO Services</span></span>';

  var HEADER =
    SPRITE +
    '<a class="skip-link" href="#main">Skip to content</a>' +
    '<div class="topbar"><div class="container topbar-inner">' +
      '<a data-href="tel" href="contact.html">' + icon("phone") + '<span data-text="phone">+91 77209 09706</span></a>' +
      '<span class="open-status" data-open-status>' + icon("clock") + '<span data-text="hours">Mon – Sat, 7:00 AM – 8:00 PM</span></span>' +
      '<a class="topbar-cta" href="book.html"><span data-next-batch>New batches every week</span> ' + icon("arrow") + '</a>' +
    '</div></div>' +
    '<header class="site-header" id="site-header"><div class="container header-inner">' +
      '<a href="index.html" class="brand">' + BRAND + '</a>' +
      '<nav class="nav" id="nav" aria-label="Main">' +
        TABS.map(function (t) { return '<a href="' + t.href + '"' + current(t.id) + '>' + t.label + '</a>'; }).join("") +
        '<a href="book.html" class="btn btn-amber nav-cta"' + current("book") + '>Book now</a>' +
      '</nav>' +
      '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav" aria-label="Open menu"><span></span><span></span><span></span></button>' +
    '</div></header>';

  var FOOTER_LINKS = [
    ["courses.html", "Driving courses &amp; prices"],
    ["rto.html#licence", "Licence services"],
    ["rto.html#vehicle", "Vehicle &amp; RC services"],
    ["rto.html#commercial", "Commercial &amp; permits"],
    ["test.html", "Free LL mock test"],
  ];

  var FOOTER =
    '<footer class="site-footer"><div class="container">' +
      '<div class="footer-grid">' +
        '<div>' +
          '<a href="index.html" class="brand brand-light">' + BRAND + '</a>' +
          '<p class="footer-blurb">Learn to drive with patient, certified instructors — and get every RTO job done at a fair, fixed price, without the queues.</p>' +
          '<p class="footer-owner">Owner: <span data-text="owner">Rushikesh Nalawade</span></p>' +
          '<p class="footer-areas">Serving <span data-areas>Ichalkaranji and nearby</span></p>' +
        '</div>' +
        '<div><h4>Services</h4><ul>' +
          FOOTER_LINKS.map(function (s) { return '<li><a href="' + s[0] + '">' + s[1] + '</a></li>'; }).join("") +
        '</ul></div>' +
        '<div><h4>Explore</h4><ul>' +
          TABS.map(function (t) { return '<li><a href="' + t.href + '">' + t.label + '</a></li>'; }).join("") +
          '<li><a href="book.html">Book now</a></li>' +
        '</ul></div>' +
        '<div><h4>Visit us</h4><ul class="footer-contact">' +
          '<li><a data-href="tel" href="contact.html"><span data-text="phone">+91 77209 09706</span></a></li>' +
          '<li><a data-href="mailto" href="contact.html"><span data-text="email">hello@yourdomain.com</span></a></li>' +
          '<li><span data-text="address">Ichalkaranji, Dist. Kolhapur, Maharashtra – 416115</span></li>' +
          '<li><span data-text="hours">Mon – Sat, 7:00 AM – 8:00 PM</span></li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>© <span data-year>2026</span> <span data-text="businessName">Rushikesh Motor Driving School</span>. All rights reserved.</span>' +
        '<span>Government fees are charged at actuals, as per the official receipt.</span>' +
      '</div>' +
      '<div class="stunity-credit" id="stunityCredit"><span class="sc-dot"></span><span>' + CREDIT_COMPANY + ' — by <b>' + CREDIT_AUTHOR + '</b></span></div>' +
    '</div></footer>' +
    '<a class="wa-float" data-href="whatsapp" href="contact.html" aria-label="Chat on WhatsApp">' + icon("whatsapp") + '</a>' +
    '<nav class="action-bar" aria-label="Quick actions">' +
      '<a data-href="tel" href="contact.html">' + icon("phone") + '<span>Call</span></a>' +
      '<a data-href="whatsapp" href="contact.html" class="ab-wa">' + icon("whatsapp") + '<span>WhatsApp</span></a>' +
      '<a href="book.html" class="ab-book">' + icon("calendar") + '<span>Book now</span></a>' +
    '</nav>';

  document.currentScript.insertAdjacentHTML("beforebegin", HEADER);

  window.SiteLayout = {
    renderFooter: function () {
      document.currentScript.insertAdjacentHTML("beforebegin", FOOTER);
    },
  };
})();
