(function () {
  "use strict";

  var C = window.SITE_CONFIG || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var waNumber = String(C.whatsapp || "").replace(/\D/g, "");
  var telNumber = String(C.phone || "").replace(/[^\d+]/g, "");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var courses = C.courses || [];
  var services = C.rtoServices || [];

  var inr = function (n) { return "₹" + Math.round(n).toLocaleString("en-IN"); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  };
  var icon = function (name) { return '<svg class="icon"><use href="#i-' + name + '"/></svg>'; };
  var byId = function (list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; };
  var waLink = function (text) { return "https://wa.me/" + waNumber + (text ? "?text=" + encodeURIComponent(text) : ""); };
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
  };

  /* ---------- Business details from config.js ---------- */
  $$("[data-text]").forEach(function (el) {
    var value = C[el.getAttribute("data-text")];
    if (value) el.textContent = value;
  });

  $$("[data-href]").forEach(function (el) {
    var kind = el.getAttribute("data-href");
    if (kind === "tel" && telNumber) el.href = "tel:" + telNumber;
    if (kind === "mailto" && C.email) el.href = "mailto:" + C.email;
    if (kind === "whatsapp" && waNumber) {
      el.href = waLink();
      el.target = "_blank";
      el.rel = "noopener";
    }
  });

  // Page titles are written with the default name; swap in the configured one.
  var DEFAULT_NAME = "Raftaar Driving School";
  if (C.businessName && C.businessName !== DEFAULT_NAME) {
    document.title = document.title.replace(DEFAULT_NAME, C.businessName);
  }

  var map = $(".map");
  if (map && C.mapQuery) {
    map.querySelector("iframe").src =
      "https://maps.google.com/maps?q=" + encodeURIComponent(C.mapQuery) + "&z=15&output=embed";
    map.hidden = false;
  }

  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  $$("[data-min-price]").forEach(function (el) {
    var list = el.getAttribute("data-min-price") === "courses"
      ? courses.map(function (c) { return c.price; })
      : services.map(function (s) { return s.fee; });
    if (list.length) el.textContent = inr(Math.min.apply(null, list));
  });

  window.addEventListener("load", function () {
    setTimeout(function () { document.documentElement.classList.add("ready"); }, 50);
  });

  var ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "DrivingSchool",
    name: C.businessName,
    description: "Driving lessons in dual-control cars and RTO services: learner's licence, driving licence, renewal, RC transfer, NOC, permits and more.",
    telephone: C.phone,
    email: C.email,
    address: C.address,
    openingHours: C.hours,
    url: location.origin + location.pathname.replace(/[^/]*$/, ""),
  });
  document.head.appendChild(ld);

  /* ---------- Open now / next batch ---------- */
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var toMin = function (hhmm) { var p = String(hhmm || "0:0").split(":"); return (+p[0]) * 60 + (+p[1] || 0); };
  var clock = function (min) {
    var h = Math.floor(min / 60), m = min % 60, ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + (m ? ":" + (m < 10 ? "0" : "") + m : "") + " " + ap;
  };

  function openState() {
    var days = C.openDays || [];
    if (!days.length || !C.openTime || !C.closeTime) return null;
    var now = new Date();
    var mins = now.getHours() * 60 + now.getMinutes();
    var o = toMin(C.openTime), c = toMin(C.closeTime);
    if (days.indexOf(now.getDay()) > -1 && mins >= o && mins < c) {
      return { open: true, text: "Open now · till " + clock(c) };
    }
    for (var i = 0; i < 8; i++) {
      var d = (now.getDay() + i) % 7;
      if (days.indexOf(d) === -1 || (i === 0 && mins >= o)) continue;
      return { open: false, text: "Closed · opens " + (i === 0 ? "today" : i === 1 ? "tomorrow" : DAYS[d]) + " " + clock(o) };
    }
    return null;
  }

  function renderOpen() {
    var st = openState();
    if (!st) return;
    $$("[data-open-status], [data-open-live]").forEach(function (el) {
      var pill = '<span class="live ' + (st.open ? "is-open" : "is-closed") + '">' + st.text + "</span>";
      if (el.hasAttribute("data-open-status")) el.innerHTML = icon("clock") + pill;
      else el.innerHTML = pill;
    });
  }
  renderOpen();
  setInterval(renderOpen, 60000);

  var batch = (function () {
    var day = typeof C.batchStartDay === "number" ? C.batchStartDay : 1;
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    while (d.getDay() !== day) d.setDate(d.getDate() + 1);
    var inDays = Math.round((d - new Date().setHours(0, 0, 0, 0)) / 864e5);
    return { date: d, inDays: inDays, label: DAYS[d.getDay()] + ", " + d.getDate() + " " + MONTHS[d.getMonth()] };
  })();
  $$("[data-next-batch]").forEach(function (el) { el.textContent = "Next batch: " + batch.label; });
  $$("[data-batch]").forEach(function (el) {
    var k = el.getAttribute("data-batch");
    el.textContent = k === "day" ? batch.date.getDate()
      : k === "month" ? MONTHS[batch.date.getMonth()]
      : k === "label" ? batch.label
      : batch.inDays === 1 ? "Starts tomorrow" : "Starts in " + batch.inDays + " days";
  });

  /* ---------- Header: shadow on scroll + mobile menu + phone action bar ---------- */
  var header = $("#site-header");
  var toggle = $(".menu-toggle");
  var bar = $(".action-bar");

  if (header && toggle) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
      if (bar) bar.classList.toggle("show", window.scrollY > 240);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var setMenu = function (open) {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () { setMenu(!header.classList.contains("nav-open")); });
    $$("#nav a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* ---------- Scroll reveal + count-up ---------- */
  function countUp(el) {
    var target = Number(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion || !target) return;
    var start = null;
    var step = function (t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / 1400);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-IN") + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function observeReveals() {
    var reveals = $$(".reveal:not(.is-visible)");
    var counters = $$("[data-count]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.hasAttribute("data-count")) countUp(el);
        else el.classList.add("is-visible");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.concat(counters).forEach(function (el) { io.observe(el); });

    // Opening a page at a section link jumps past the observer; reveal what's already on screen.
    var revealInView = function () {
      reveals.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
      });
    };
    revealInView();
    window.addEventListener("load", function () { revealInView(); setTimeout(revealInView, 700); });
  }

  /* ---------- Quick sign quiz (home) ---------- */
  $$("[data-quick-quiz]").forEach(function (box) {
    var opts = $$(".qt-opt", box);
    var out = $(".qt-result", box);
    opts.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var right = btn.hasAttribute("data-correct");
        opts.forEach(function (b) {
          b.disabled = true;
          if (b.hasAttribute("data-correct")) b.classList.add("is-right");
        });
        if (!right) btn.classList.add("is-wrong");
        out.textContent = right
          ? "Correct! A STOP sign means a full stop — even if the road looks clear."
          : "Not quite. A STOP sign means you must stop completely, then go only when it's safe.";
      });
    });
  });

  /* =====================================================================
     COURSES PAGE: price cards + plan builder
     ===================================================================== */
  var courseGrid = $("#course-grid");
  if (courseGrid && courses.length) {
    var bundleFull = (C.bundleServices || []).reduce(function (sum, id) {
      var s = byId(services, id); return sum + (s ? s.fee : 0);
    }, 0);
    var bundleSave = Math.max(0, bundleFull - (C.bundlePrice || 0));
    var addons = C.addons || [];

    courseGrid.innerHTML = courses.map(function (c) {
      return '<article class="course reveal' + (c.popular ? " popular" : "") + '">' +
        (c.popular ? '<span class="ribbon">Most popular</span>' : "") +
        "<h3>" + esc(c.name) + "</h3>" +
        '<p class="course-meta">' + c.sessions + " sessions · " + c.minutes + " min each</p>" +
        '<div class="price" data-course-price="' + c.id + '">' + inr(c.price) + "</div>" +
        '<p class="price-note" data-course-note></p>' +
        "<p>" + esc(c.blurb) + "</p>" +
        '<ul class="ticks">' + c.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" +
        '<button type="button" class="btn ' + (c.popular ? "btn-ghost" : "btn-ghost") + ' btn-block" data-choose="' + c.id + '">Build this plan ' + icon("arrow") + "</button>" +
      "</article>";
    }).join("");

    var savePill = $("#save-pill");
    if (savePill) {
      if (bundleSave > 0) savePill.textContent = "Save " + inr(bundleSave);
      else savePill.hidden = true;
    }
    $$("[data-bundle-price]").forEach(function (el) { el.textContent = inr(C.bundlePrice || 0); });
    $$("[data-bundle-full]").forEach(function (el) { el.textContent = inr(bundleFull); });
    if (!bundleSave) $$("[data-bundle-compare]").forEach(function (el) { el.hidden = true; });

    // Builder options
    $("#b-courses").innerHTML = courses.map(function (c, i) {
      return '<label class="opt-card"><input type="radio" name="b-course" value="' + c.id + '"' + (c.popular || (i === 0 && !courses.some(function (x) { return x.popular; })) ? " checked" : "") + ">" +
        '<span class="opt-main"><span class="tick"></span><span><strong>' + esc(c.name) + "</strong><small>" + c.sessions + " × " + c.minutes + " min</small></span></span>" +
        '<span class="opt-price">' + inr(c.price) + "</span></label>";
    }).join("");
    $("#b-auto-price").textContent = C.automaticExtra ? "+" + inr(C.automaticExtra) : "Same price";
    $("#b-addons").innerHTML = addons.map(function (a) {
      return '<label class="opt-card"><input type="checkbox" name="b-addon" value="' + a.id + '">' +
        '<span class="opt-main"><span class="tick"></span><span><strong>' + esc(a.name) + "</strong></span></span>" +
        '<span class="opt-price">' + (a.price ? "+" + inr(a.price) : "Free") + "</span></label>";
    }).join("");

    var bundleBox = $("#b-bundle");
    var modeBtns = $$("[data-mode]");

    var plan = {};
    function readPlan() {
      var course = byId(courses, ($('input[name="b-course"]:checked') || {}).value) || courses[0];
      var auto = ($('input[name="b-car"]:checked') || {}).value === "automatic";
      var chosen = $$('input[name="b-addon"]:checked').map(function (i) { return byId(addons, i.value); });
      var bundle = bundleBox.checked;
      var lines = [[course.name + " course", course.price]];
      if (auto) lines.push(["Automatic car", C.automaticExtra || 0]);
      if (bundle) lines.push(["Learner's + permanent licence", C.bundlePrice || 0]);
      chosen.forEach(function (a) { lines.push([a.name, a.price]); });
      var total = lines.reduce(function (s, l) { return s + l[1]; }, 0);
      plan = { course: course, auto: auto, addons: chosen, bundle: bundle, lines: lines, total: total };
      return plan;
    }

    function planText(p) {
      return p.lines.map(function (l) { return "• " + l[0] + " — " + (l[1] ? inr(l[1]) : "Free"); }).join("\n") +
        "\nTotal: " + inr(p.total) + (p.bundle ? " (+ govt. licence fees at actuals)" : "");
    }

    var totalEl = $("#sum-total");
    function renderSummary() {
      var p = readPlan();
      $("#sum-lines").innerHTML = p.lines.map(function (l) {
        return "<li><span>" + esc(l[0]) + "</span><span>" + (l[1] ? inr(l[1]) : "Free") + "</span></li>";
      }).join("") + (p.bundle && bundleSave ? '<li class="saving"><span>Bundle saving</span><span>−' + inr(bundleSave) + " vs separate</span></li>" : "");
      totalEl.textContent = inr(p.total);
      totalEl.classList.remove("bump"); void totalEl.offsetWidth; totalEl.classList.add("bump");

      var params = "course=" + p.course.id + "&car=" + (p.auto ? "automatic" : "manual") +
        (p.bundle ? "&bundle=1" : "") + (p.addons.length ? "&addons=" + p.addons.map(function (a) { return a.id; }).join(",") : "");
      $("#sum-book").href = "book.html?" + params;
      var wa = $("#sum-wa");
      if (waNumber) {
        wa.href = waLink("Hi! I'd like to join this plan at " + (C.businessName || "your school") + ":\n" + planText(p));
        wa.target = "_blank"; wa.rel = "noopener";
      } else wa.hidden = true;
    }

    function setMode(bundle) {
      bundleBox.checked = bundle;
      modeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String((b.getAttribute("data-mode") === "bundle") === bundle)); });
      courses.forEach(function (c) {
        var el = $('[data-course-price="' + c.id + '"]');
        el.innerHTML = inr(c.price + (bundle ? C.bundlePrice || 0 : 0)) + (bundle ? " <small>incl. licence</small>" : "");
        el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump");
        el.nextElementSibling.textContent = bundle ? "LL + DL handled for you" + (bundleSave ? " · save " + inr(bundleSave) : "") : "";
      });
      renderSummary();
    }

    modeBtns.forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode") === "bundle"); }); });
    bundleBox.addEventListener("change", function () { setMode(bundleBox.checked); });
    $("#builder").addEventListener("change", renderSummary);

    $$("[data-choose]", courseGrid).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var radio = $('input[name="b-course"][value="' + btn.getAttribute("data-choose") + '"]');
        radio.checked = true;
        renderSummary();
        $("#builder").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      });
    });

    setMode(false);
  }

  /* =====================================================================
     RTO PAGE: searchable services + documents checklist
     ===================================================================== */
  var CAT_LABEL = { licence: "Licence", vehicle: "Vehicle & RC", commercial: "Commercial" };
  var SVC_ICON = {
    ll: "id", dl: "wheel", renew: "calendar", "dup-dl": "id", "dl-change": "pin", "add-class": "car", idp: "globe",
    "rc-transfer": "swap", "hp-remove": "bank", "hp-add": "bank", "dup-rc": "doc", noc: "route", "rc-address": "pin",
    "rc-renew": "calendar", hsrp: "plate", insurance: "shield", badge: "truck", fitness: "shield", permit: "doc", challan: "rupee",
  };

  var rtoGrid = $("#rto-grid");
  if (rtoGrid && services.length) {
    var search = $("#rto-search");
    var catBtns = $$("[data-cat]");
    var countEl = $("#rto-count");
    var empty = $("#rto-empty");
    var cat = "all";

    var hashCat = location.hash.replace("#", "");
    if (CAT_LABEL[hashCat]) cat = hashCat;

    catBtns.forEach(function (b) {
      var c = b.getAttribute("data-cat");
      var n = c === "all" ? services.length : services.filter(function (s) { return s.cat === c; }).length;
      b.insertAdjacentHTML("beforeend", ' <span class="save-pill">' + n + "</span>");
    });

    var highlight = function (text, q) {
      var safe = esc(text);
      if (!q) return safe;
      var re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      return safe.replace(re, "<mark>$1</mark>");
    };

    function renderServices() {
      var q = search.value.trim().toLowerCase();
      var list = services.filter(function (s) {
        if (cat !== "all" && s.cat !== cat) return false;
        if (!q) return true;
        return (s.name + " " + s.blurb + " " + s.docs.join(" ") + " " + CAT_LABEL[s.cat]).toLowerCase().indexOf(q) > -1;
      });
      catBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === cat)); });
      rtoGrid.innerHTML = list.map(function (s) {
        return '<button type="button" class="svc" data-svc="' + s.id + '">' +
          '<span class="svc-top"><span class="svc-icon">' + icon(SVC_ICON[s.id] || "doc") + '</span><span class="svc-cat">' + CAT_LABEL[s.cat] + "</span></span>" +
          "<h3>" + highlight(s.name, q) + "</h3>" +
          "<p>" + esc(s.blurb) + "</p>" +
          '<span class="chips"><span class="chip">' + icon("clock") + esc(s.time) + '</span><span class="chip">' + icon("doc") + s.docs.length + " documents</span></span>" +
          '<span class="svc-foot"><span class="svc-fee"><strong>' + inr(s.fee) + "</strong><small>service charge + govt. fee</small></span>" +
          '<span class="svc-go">Checklist ' + icon("arrow") + "</span></span>" +
        "</button>";
      }).join("");
      countEl.textContent = list.length === services.length
        ? "All " + list.length + " services"
        : "Showing " + list.length + " of " + services.length + " services";
      empty.hidden = list.length > 0;
      rtoGrid.hidden = list.length === 0;
    }

    search.addEventListener("input", renderServices);
    catBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        cat = b.getAttribute("data-cat");
        history.replaceState(null, "", cat === "all" ? location.pathname : "#" + cat);
        renderServices();
      });
    });
    $$("[data-hint]").forEach(function (b) {
      b.addEventListener("click", function () {
        search.value = b.getAttribute("data-hint");
        cat = "all";
        renderServices();
        $("#services").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
    renderServices();

    // Checklist dialog
    var sheet = $("#sheet");
    var current = null;

    function updateProgress() {
      var boxes = $$("#sheet-docs input");
      var done = boxes.filter(function (b) { return b.checked; }).length;
      $("#sheet-progress").style.width = (boxes.length ? (done / boxes.length) * 100 : 0) + "%";
      $("#sheet-done").textContent = done + " of " + boxes.length + " ready";
      $("#sheet-ready").hidden = done !== boxes.length;
      store.set("rto-docs-" + current.id, boxes.map(function (b) { return b.checked; }));

      var have = [], missing = [];
      boxes.forEach(function (b, i) { (b.checked ? have : missing).push(current.docs[i]); });
      var wa = $("#sheet-wa");
      if (waNumber) {
        wa.href = waLink("Hi! I need help with: " + current.name + " (" + inr(current.fee) + " + govt. fee).\n\n" +
          (have.length ? "Documents I have:\n✅ " + have.join("\n✅ ") + "\n\n" : "") +
          (missing.length ? "Still need:\n⬜ " + missing.join("\n⬜ ") : "I have all the documents ready."));
        wa.target = "_blank"; wa.rel = "noopener";
      } else wa.hidden = true;
    }

    function openSheet(id) {
      current = byId(services, id);
      if (!current) return;
      var saved = store.get("rto-docs-" + id) || [];
      $("#sheet-cat").textContent = CAT_LABEL[current.cat];
      $("#sheet-title").textContent = current.name;
      $("#sheet-blurb").textContent = current.blurb;
      $("#sheet-fee").textContent = inr(current.fee);
      $("#sheet-time").textContent = current.time;
      $("#sheet-docs").innerHTML = current.docs.map(function (d, i) {
        return '<li><label><input type="checkbox"' + (saved[i] ? " checked" : "") + "><span>" + esc(d) + "</span></label></li>";
      }).join("");
      $("#sheet-book").href = "book.html?service=" + current.id;
      updateProgress();
      if (typeof sheet.showModal === "function") sheet.showModal();
      else sheet.setAttribute("open", "");
    }

    rtoGrid.addEventListener("click", function (e) {
      var card = e.target.closest("[data-svc]");
      if (card) openSheet(card.getAttribute("data-svc"));
    });
    $("#sheet-docs").addEventListener("change", updateProgress);
    $("#sheet-print").addEventListener("click", function () { window.print(); });
    var closeSheet = function () { if (sheet.close) sheet.close(); else sheet.removeAttribute("open"); };
    $(".sheet-close").addEventListener("click", closeSheet);
    sheet.addEventListener("click", function (e) { if (e.target === sheet) closeSheet(); }); // backdrop

    var deep = new URLSearchParams(location.search).get("service");
    if (deep && byId(services, deep)) openSheet(deep);
  }

  /* =====================================================================
     BOOK PAGE: fill the selects, show/hide by need, pre-fill from links
     ===================================================================== */
  var bookForm = $("#book-form");
  if (bookForm) {
    var courseSel = $("#b-course-sel");
    var serviceSel = $("#b-service-sel");
    courseSel.insertAdjacentHTML("beforeend", courses.map(function (c) {
      return '<option value="' + esc(c.name) + '" data-id="' + c.id + '">' + esc(c.name) + " — " + inr(c.price) + " (" + c.sessions + " sessions)</option>";
    }).join(""));
    serviceSel.insertAdjacentHTML("beforeend", ["licence", "vehicle", "commercial"].map(function (k) {
      return '<optgroup label="' + CAT_LABEL[k] + '">' + services.filter(function (s) { return s.cat === k; }).map(function (s) {
        return '<option value="' + esc(s.name) + '" data-id="' + s.id + '">' + esc(s.name) + " — " + inr(s.fee) + "</option>";
      }).join("") + "</optgroup>";
    }).join(""));

    var dateEl = $("#b-date");
    var iso = function (d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); };
    dateEl.min = iso(new Date());
    dateEl.value = iso(batch.date);

    var needInputs = $$('input[name="need"]');
    function syncNeed() {
      var checked = $('input[name="need"]:checked');
      var need = checked ? checked.getAttribute("data-need") : "course";
      $$("[data-show-for]", bookForm).forEach(function (el) {
        var show = el.getAttribute("data-show-for").split(" ").indexOf(need) > -1;
        el.hidden = !show;
        $$("select, input", el).forEach(function (f) { f.disabled = !show; });
      });
    }
    needInputs.forEach(function (i) { i.addEventListener("change", syncNeed); });

    var qs = new URLSearchParams(location.search);
    var pick = function (need) { var r = $('input[name="need"][data-need="' + need + '"]'); if (r) r.checked = true; };
    var selectById = function (sel, id) {
      $$("option", sel).forEach(function (o) { if (o.getAttribute("data-id") === id) sel.value = o.value; });
    };
    var note = [];
    if (qs.get("course")) {
      pick(qs.get("bundle") ? "both" : "course");
      selectById(courseSel, qs.get("course"));
      var car = $('input[name="car"][value="' + (qs.get("car") === "automatic" ? "Automatic" : "Manual") + '"]');
      if (car) car.checked = true;
      var c = byId(courses, qs.get("course"));
      if (c) note.push(c.name);
      if (qs.get("bundle")) { selectById(serviceSel, "ll"); note.push("licence bundle"); $("#b-extra").value = "Licence bundle: learner's + permanent licence"; }
      var ad = (qs.get("addons") || "").split(",").map(function (id) { return byId(C.addons || [], id); }).filter(Boolean);
      if (ad.length) {
        $("#b-extra").value = ($("#b-extra").value ? $("#b-extra").value + "\n" : "") + "Add-ons: " + ad.map(function (a) { return a.name; }).join(", ");
        note.push(ad.length + " add-on" + (ad.length > 1 ? "s" : ""));
      }
    } else if (qs.get("service")) {
      pick("rto");
      selectById(serviceSel, qs.get("service"));
      var s = byId(services, qs.get("service"));
      if (s) note.push(s.name);
    }
    if (note.length) {
      var box = $("#prefill");
      box.innerHTML = icon("check") + "<span>We've filled in your choice: <strong>" + esc(note.join(" + ")) + "</strong>. Just add your name and number.</span>";
      box.hidden = false;
    }
    syncNeed();
  }

  /* ---------- Lead forms (booking + contact) ---------- */
  function labelFor(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    if (!el) return name;
    if (el.getAttribute("data-label")) return el.getAttribute("data-label");
    var group = el.closest("[data-label]");
    return group ? group.getAttribute("data-label") : name;
  }

  function summarize(form) {
    var fd = new FormData(form);
    var rows = [];
    var seen = {};
    fd.forEach(function (_, key) {
      if (seen[key] || key.charAt(0) === "_") return;
      seen[key] = true;
      var values = fd.getAll(key).map(function (v) { return String(v).trim(); }).filter(Boolean);
      if (values.length) rows.push(labelFor(form, key) + ": " + values.join(", "));
    });
    return rows;
  }

  function showStatus(form, type, message, links) {
    var box = form.querySelector(".form-status");
    box.className = "form-status " + type;
    box.textContent = message;
    (links || []).forEach(function (link) {
      box.appendChild(document.createTextNode(" "));
      var a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.text;
      if (/^https?:/.test(link.href)) { a.target = "_blank"; a.rel = "noopener"; }
      box.appendChild(a);
    });
    box.hidden = false;
  }

  function fallbackLinks(title, rows) {
    var links = [];
    var body = title + "\n\n" + rows.join("\n");
    if (waNumber) links.push({ text: "Send on WhatsApp", href: waLink(body) });
    if (C.email) links.push({ text: "Send by email", href: "mailto:" + C.email + "?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(body) });
    if (telNumber) links.push({ text: "Call " + C.phone, href: "tel:" + telNumber });
    return links;
  }

  $$("[data-lead-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector('[name="_gotcha"]').value) return; // spam bot

      var title = form.getAttribute("data-form-name") + " — " + (C.businessName || "website");
      var rows = summarize(form);
      var submitBtn = form.querySelector('[type="submit"]');

      // No form service configured: hand the details to WhatsApp / email instead.
      if (!C.formEndpoint) {
        var links = fallbackLinks(title, rows);
        if (!links.length) {
          showStatus(form, "error", "Contact details haven't been set up yet. Please try again later.");
          return;
        }
        window.open(links[0].href, links[0].href.indexOf("http") === 0 ? "_blank" : "_self");
        showStatus(form, "info", "We've opened " + (waNumber ? "WhatsApp" : "your email app") + " with your details filled in — just press send. Didn't open?", links);
        return;
      }

      var data = new FormData(form);
      data.append("_subject", title);
      submitBtn.disabled = true;
      showStatus(form, "info", "Sending…");

      fetch(C.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          form.reset();
          showStatus(form, "success", "Thank you! We've received your request and will call you back shortly.");
        })
        .catch(function () {
          showStatus(form, "error", "Sorry, your message couldn't be sent. Please reach us directly:", fallbackLinks(title, rows));
        })
        .finally(function () { submitBtn.disabled = false; });
    });
  });

  // Run last, so cards rendered above are observed too.
  observeReveals();
})();
