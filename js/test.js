/* =====================================================================
   Learner's licence mock test. Signs are drawn as inline SVG (no images).
   15 questions are picked at random from the bank on each attempt; the
   pass mark follows the common RTO rule of 60% (9 of 15).
   ===================================================================== */
(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
  };

  var QUESTIONS_PER_TEST = 15;
  var PASS_MARK = 9;
  var SECONDS = 30;

  /* ---------- Signs ---------- */
  var RED = "#D93A2B", BLUE = "#1F5FBF", INK = "#16181D";
  var ring = '<circle cx="50" cy="50" r="43" fill="#fff" stroke="' + RED + '" stroke-width="9"/>';
  var slash = '<path d="M20 20 80 80" stroke="' + RED + '" stroke-width="8"/>';
  var warn = '<path d="M50 9 93 86H7z" fill="#fff" stroke="' + RED + '" stroke-width="7" stroke-linejoin="round"/>';
  var txt = function (t, size, y, fill) {
    return '<text x="50" y="' + y + '" text-anchor="middle" font-family="Outfit, system-ui, sans-serif" font-weight="800" font-size="' + size + '" fill="' + (fill || INK) + '">' + t + "</text>";
  };

  var SIGNS = {
    stop: { name: "Stop", svg: '<polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill="' + RED + '" stroke="#fff" stroke-width="3"/>' + txt("STOP", 25, 59, "#fff") },
    noEntry: { name: "No entry", svg: '<circle cx="50" cy="50" r="46" fill="' + RED + '"/><rect x="18" y="41" width="64" height="18" rx="2" fill="#fff"/>' },
    speed50: { name: "Speed limit 50", svg: ring + txt("50", 36, 63) },
    noParking: { name: "No parking", svg: ring + txt("P", 44, 66) + slash },
    noHorn: { name: "Horn prohibited", svg: ring + '<path d="M27 43h10l17-12v38L37 57H27z" fill="' + INK + '"/><path d="M62 40q6 10 0 20M69 34q10 16 0 32" stroke="' + INK + '" stroke-width="4" fill="none" stroke-linecap="round"/>' + slash },
    noUturn: { name: "U-turn prohibited", svg: ring + '<path d="M62 72V46a12 12 0 0 0-24 0v18" stroke="' + INK + '" stroke-width="7" fill="none"/><path d="M28 60l10 14 10-14z" fill="' + INK + '"/>' + slash },
    noRight: { name: "Right turn prohibited", svg: ring + '<path d="M40 76V52h20" stroke="' + INK + '" stroke-width="7" fill="none"/><path d="M58 40l14 12-14 12z" fill="' + INK + '"/>' + slash },
    noOvertake: { name: "Overtaking prohibited", svg: ring + '<rect x="29" y="30" width="17" height="38" rx="6" fill="' + INK + '"/><rect x="54" y="30" width="17" height="38" rx="6" fill="' + RED + '"/>' },
    keepLeft: { name: "Compulsory turn left", svg: '<circle cx="50" cy="50" r="46" fill="' + BLUE + '"/><path d="M70 70V50H38" stroke="#fff" stroke-width="9" fill="none"/><path d="M42 34 24 50l18 16z" fill="#fff"/>' },
    giveWay: { name: "Give way", svg: '<path d="M7 13H93L50 90z" fill="#fff" stroke="' + RED + '" stroke-width="7" stroke-linejoin="round"/>' },
    pedestrian: { name: "Pedestrian crossing", svg: warn + '<circle cx="50" cy="38" r="5" fill="' + INK + '"/><path d="M50 45l-3 14 7 9M47 59l-7 9M49 49l-8 5M50 49l8 3" stroke="' + INK + '" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M26 76h48" stroke="' + INK + '" stroke-width="5" stroke-dasharray="6 4"/>' },
    rightCurve: { name: "Right hand curve", svg: warn + '<path d="M42 78V62q0-12 12-16" stroke="' + INK + '" stroke-width="6" fill="none"/><path d="M50 36l14 8-12 10z" fill="' + INK + '"/>' },
    narrowRoad: { name: "Narrow road ahead", svg: warn + '<path d="M36 80q0-16 8-22V40M64 80q0-16-8-22V40" stroke="' + INK + '" stroke-width="5" fill="none" stroke-linecap="round"/>' },
    hospital: { name: "Hospital", svg: '<rect x="6" y="6" width="88" height="88" rx="10" fill="' + BLUE + '"/><rect x="22" y="22" width="56" height="56" rx="4" fill="#fff"/><path d="M50 32v36M32 50h36" stroke="' + RED + '" stroke-width="11"/>' },
    hump: { name: "Speed breaker ahead", svg: warn + '<path d="M24 74q26-30 52 0z" fill="' + INK + '"/>' },
    signal: { name: "Traffic signal ahead", svg: warn + '<rect x="41" y="33" width="18" height="44" rx="5" fill="' + INK + '"/><circle cx="50" cy="42" r="4.5" fill="' + RED + '"/><circle cx="50" cy="55" r="4.5" fill="#FFB300"/><circle cx="50" cy="68" r="4.5" fill="#2BD46B"/>' },
  };
  var signSvg = function (id) { return '<svg viewBox="0 0 100 100" role="img" aria-label="Road sign">' + SIGNS[id].svg + "</svg>"; };

  /* ---------- Question bank: a = index of the correct option ---------- */
  var BANK = [
    { sign: "stop", q: "What does this sign mean?", o: ["Slow down", "Stop completely", "No entry", "Parking ahead"], a: 1, why: "An octagonal red sign always means STOP — come to a full stop, then go when safe." },
    { sign: "noEntry", q: "What does this sign mean?", o: ["One way", "Road closed for repairs", "No entry", "Stop"], a: 2, why: "A red disc with a white bar means vehicles must not enter." },
    { sign: "speed50", q: "What does this sign tell you?", o: ["Minimum speed 50 km/h", "Maximum speed 50 km/h", "50 metres to the junction", "Highway number 50"], a: 1, why: "A number in a red ring is a speed limit — do not go faster." },
    { sign: "noParking", q: "What does this sign mean?", o: ["Parking allowed", "No stopping or standing", "No parking", "Pay-and-park area"], a: 2, why: "A crossed-out P means no parking here." },
    { sign: "noHorn", q: "What does this sign mean?", o: ["Horn prohibited", "Use horn compulsorily", "Loudspeaker area", "Radio station nearby"], a: 0, why: "A crossed-out horn means do not sound your horn — common near hospitals and schools." },
    { sign: "noUturn", q: "What does this sign mean?", o: ["U-turn ahead", "Road bends left", "U-turn prohibited", "Turn back"], a: 2, why: "A crossed-out U-shaped arrow means U-turns are not allowed." },
    { sign: "noRight", q: "What does this sign mean?", o: ["Right turn prohibited", "Compulsory turn right", "Right lane ends", "Side road on the right"], a: 0, why: "A crossed-out right arrow means you must not turn right here." },
    { sign: "noOvertake", q: "What does this sign mean?", o: ["Two-way traffic", "Overtaking prohibited", "Car parking", "Keep in lane"], a: 1, why: "Two cars side by side in a red ring means no overtaking." },
    { sign: "keepLeft", q: "What does this blue sign mean?", o: ["Left turn prohibited", "Compulsory turn left", "One-way road", "Hospital on the left"], a: 1, why: "Blue circular signs are mandatory — here, you must turn left." },
    { sign: "giveWay", q: "What does this sign mean?", o: ["Stop", "Danger ahead", "Give way to traffic on the main road", "No entry"], a: 2, why: "The inverted triangle means give way — let traffic on the major road go first." },
    { sign: "pedestrian", q: "What does this sign warn you about?", o: ["School ahead", "Pedestrian crossing ahead", "Men at work", "Footpath closed"], a: 1, why: "A walking figure over stripes warns of a pedestrian crossing — slow down and be ready to stop." },
    { sign: "rightCurve", q: "What does this sign warn you about?", o: ["Right hand curve", "Right turn prohibited", "Compulsory turn right", "Side road on the right"], a: 0, why: "Red-bordered triangles are warnings — this one shows the road curving right." },
    { sign: "narrowRoad", q: "What does this sign warn you about?", o: ["Bridge ahead", "Road widens", "Narrow road ahead", "Dual carriageway ends"], a: 2, why: "Lines pinching together warn that the road ahead gets narrower." },
    { sign: "hospital", q: "What does this sign indicate?", o: ["First-aid post", "Hospital", "Ambulance only", "Blood bank"], a: 1, why: "Blue rectangular signs give information — this one marks a hospital." },
    { sign: "hump", q: "What does this sign warn you about?", o: ["Hill ahead", "Speed breaker ahead", "Loose gravel", "Tunnel ahead"], a: 1, why: "A bump in a warning triangle means a speed breaker or hump ahead — slow down." },
    { sign: "signal", q: "What does this sign warn you about?", o: ["Traffic signal ahead", "Railway crossing", "Police check post", "Level crossing with gates"], a: 0, why: "A traffic light in a warning triangle means there's a signal ahead." },

    { q: "How long is a learner's licence valid?", o: ["1 month", "3 months", "6 months", "1 year"], a: 2, why: "A learner's licence is valid for six months." },
    { q: "How long must you hold a learner's licence before taking the driving test?", o: ["7 days", "15 days", "30 days", "90 days"], a: 2, why: "Your learner's licence must be at least 30 days old." },
    { q: "What is the minimum age for a car (LMV) licence?", o: ["16 years", "17 years", "18 years", "21 years"], a: 2, why: "You must be 18 to get a licence for a private car." },
    { q: "From which side should you overtake?", o: ["Left", "Right", "Either side", "Whichever side is free"], a: 1, why: "In India you overtake from the right." },
    { q: "An ambulance with its siren on comes up behind you. You should:", o: ["Speed up to clear the way", "Stop where you are", "Move to the left and let it pass", "Continue normally"], a: 2, why: "Give way to emergency vehicles by moving to the left." },
    { q: "The signal turns amber as you approach. You should:", o: ["Speed up to cross", "Stop, if it is safe to do so", "Sound your horn and go", "Switch lanes"], a: 1, why: "Amber means stop — unless stopping suddenly would be unsafe." },
    { q: "People are waiting at a zebra crossing. You should:", o: ["Honk so they wait", "Pass quickly before they step out", "Stop and let them cross", "Flash your headlights"], a: 2, why: "Pedestrians on or at a zebra crossing have the right of way." },
    { q: "The legal limit for alcohol in a driver's blood is:", o: ["30 mg per 100 ml", "50 mg per 100 ml", "80 mg per 100 ml", "There is no limit"], a: 0, why: "More than 30 mg of alcohol per 100 ml of blood is an offence." },
    { q: "Which documents must you carry while driving?", o: ["Only your licence", "Licence, RC, insurance and PUC", "Aadhaar and PAN", "Only the RC"], a: 1, why: "Carry your licence, registration certificate, insurance and pollution certificate (physical or on DigiLocker/mParivahan)." },
    { q: "Driving without a valid licence can be fined up to:", o: ["₹500", "₹1,000", "₹2,000", "₹5,000"], a: 3, why: "Under the Motor Vehicles (Amendment) Act, 2019, the fine is up to ₹5,000." },
    { q: "Using a hand-held mobile phone while driving is:", o: ["Allowed at low speed", "Allowed at a red light", "An offence", "Allowed for short calls"], a: 2, why: "Using a hand-held phone while driving is an offence and very dangerous." },
    { q: "Who must wear a seat belt in a car?", o: ["Only the driver", "Driver and front passenger", "Everyone in the car", "Only on highways"], a: 2, why: "Seat belts save lives — the rules apply to front and rear seats." },
    { q: "Your right arm is held straight out, palm facing forward. You are signalling:", o: ["I am slowing down", "I am turning right", "Overtake me", "I am stopping"], a: 1, why: "An outstretched right arm signals a right turn." },
    { q: "Where must you NOT park?", o: ["In a marked parking bay", "On a footpath or near a bus stop", "In a pay-and-park area", "In your own driveway"], a: 1, why: "Never park on footpaths, near bus stops, at corners or in front of gates." },
    { q: "At an unguarded railway crossing you should:", o: ["Cross quickly", "Stop, look both ways, then cross", "Honk and cross", "Follow the vehicle ahead closely"], a: 1, why: "Stop, look and listen in both directions before crossing." },
    { q: "On a two-wheeler, who must wear a helmet?", o: ["Only the rider", "Only the pillion", "Both rider and pillion", "Only on highways"], a: 2, why: "Both rider and pillion must wear a properly fastened helmet." },
    { q: "When is it safe to follow the vehicle ahead?", o: ["As close as possible", "At a distance that lets you stop safely", "One car length at any speed", "Distance doesn't matter"], a: 1, why: "Keep enough distance to stop safely if the vehicle ahead brakes suddenly." },
  ];

  /* ---------- Sign reference grid ---------- */
  var grid = $("#sign-grid");
  if (grid) {
    grid.innerHTML = Object.keys(SIGNS).map(function (id) {
      return '<div class="sign-tile reveal">' + signSvg(id).replace('aria-label="Road sign"', 'aria-hidden="true"') + "<span>" + SIGNS[id].name + "</span></div>";
    }).join("");
  }

  /* ---------- Test engine ---------- */
  var root = $("#test");
  if (!root) return;

  var screens = { start: $("#t-start"), q: $("#t-question"), result: $("#t-result") };
  var timedBox = $("#t-timed");
  var state;
  var tick = null;

  function show(name) {
    Object.keys(screens).forEach(function (k) { screens[k].hidden = k !== name; });
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function start() {
    // Shuffle the options too, so answers can't be learnt by position.
    var picked = shuffle(BANK).slice(0, QUESTIONS_PER_TEST).map(function (item) {
      var order = shuffle([0, 1, 2, 3]);
      return { sign: item.sign, q: item.q, why: item.why, o: order.map(function (i) { return item.o[i]; }), a: order.indexOf(item.a) };
    });
    state = { list: picked, i: 0, answers: [], timed: timedBox.checked };
    show("q");
    renderQuestion();
    root.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function renderQuestion() {
    var item = state.list[state.i];
    $("#t-count").innerHTML = "Question <strong>" + (state.i + 1) + "</strong> of " + state.list.length;
    $("#t-bar").style.width = (state.i / state.list.length) * 100 + "%";
    var main = $("#t-main");
    main.classList.toggle("no-sign", !item.sign);
    $("#t-sign").hidden = !item.sign;
    $("#t-sign").innerHTML = item.sign ? signSvg(item.sign) : "";
    $("#t-q").textContent = item.q;
    $("#t-opts").innerHTML = item.o.map(function (text, i) {
      return '<button type="button" class="opt" data-i="' + i + '"><b>' + (i + 1) + "</b><span></span></button>";
    }).join("");
    Array.prototype.forEach.call($("#t-opts").children, function (btn, i) { btn.lastChild.textContent = item.o[i]; });
    $("#t-explain").hidden = true;
    $("#t-next").hidden = true;
    $("#t-opts").firstChild.focus({ preventScroll: true });
    startTimer();
  }

  function startTimer() {
    clearInterval(tick);
    var timer = $("#t-timer");
    timer.hidden = !state.timed;
    if (!state.timed) return;
    var left = SECONDS;
    var fg = $(".t-fg", timer);
    var paint = function () {
      $("span", timer).textContent = left;
      fg.style.strokeDashoffset = 113.1 * (1 - left / SECONDS);
      timer.classList.toggle("low", left <= 5);
    };
    paint();
    tick = setInterval(function () {
      left -= 1;
      paint();
      if (left <= 0) { clearInterval(tick); answer(-1); }
    }, 1000);
  }

  function answer(choice) {
    if (state.answers.length > state.i) return;
    clearInterval(tick);
    var item = state.list[state.i];
    state.answers.push(choice);
    Array.prototype.forEach.call($("#t-opts").children, function (btn, i) {
      btn.disabled = true;
      if (i === item.a) btn.classList.add("is-right");
      if (i === choice && choice !== item.a) btn.classList.add("is-wrong");
    });
    var ex = $("#t-explain");
    ex.innerHTML = "<strong>" + (choice === item.a ? "Correct. " : choice === -1 ? "Time's up. " : "Not quite. ") + "</strong>";
    ex.appendChild(document.createTextNode(item.why));
    ex.hidden = false;
    var next = $("#t-next");
    next.textContent = state.i + 1 < state.list.length ? "Next question →" : "See my result →";
    next.hidden = false;
    next.focus({ preventScroll: true });
  }

  function next() {
    state.i += 1;
    if (state.i < state.list.length) renderQuestion();
    else finish();
  }

  function finish() {
    var score = state.answers.filter(function (a, i) { return a === state.list[i].a; }).length;
    var total = state.list.length;
    var pass = score >= PASS_MARK;
    var best = Math.max(score, store.get("ll-best") || 0);
    store.set("ll-best", best);

    show("result");
    $("#t-bar").style.width = "100%";
    $("#r-score").textContent = score;
    $("#r-total").textContent = "out of " + total;
    var verdict = $("#r-verdict");
    verdict.className = "verdict " + (pass ? "pass" : "fail");
    verdict.textContent = pass ? "Pass" : "Not yet";
    $("#r-msg").textContent = pass
      ? "You'd pass the real test (pass mark " + PASS_MARK + "/" + total + "). Your best so far: " + best + "/" + total + "."
      : "The pass mark is " + PASS_MARK + "/" + total + ". Go through the answers below and try another set — your best so far: " + best + "/" + total + ".";

    var fg = $("#r-ring");
    fg.style.stroke = pass ? "#2BD46B" : "#FF4D3D";
    fg.style.strokeDashoffset = 452.4;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { fg.style.strokeDashoffset = 452.4 * (1 - score / total); });
    });

    var list = $("#r-review");
    list.innerHTML = "";
    state.list.forEach(function (item, i) {
      var li = document.createElement("li");
      var ok = state.answers[i] === item.a;
      if (!ok) li.className = "wrong";
      var span = document.createElement("span");
      span.textContent = (item.sign ? "[" + SIGNS[item.sign].name + " sign] " : "") + item.q + " ";
      var em = document.createElement("em");
      em.textContent = ok ? "✓ " + item.o[item.a] : "Answer: " + item.o[item.a];
      span.appendChild(em);
      li.appendChild(span);
      list.appendChild(li);
    });
  }

  $("#t-go").addEventListener("click", start);
  $("#r-again").addEventListener("click", start);
  $("#t-next").addEventListener("click", next);
  $("#t-opts").addEventListener("click", function (e) {
    var btn = e.target.closest(".opt");
    if (btn && !btn.disabled) answer(Number(btn.getAttribute("data-i")));
  });
  document.addEventListener("keydown", function (e) {
    if (screens.q.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    var n = Number(e.key);
    if (n >= 1 && n <= 4 && state.answers.length === state.i) answer(n - 1);
  });

  var best = store.get("ll-best");
  if (best) {
    var b = $("#t-best");
    b.textContent = "Your best score on this device: " + best + "/" + QUESTIONS_PER_TEST;
    b.hidden = false;
  }
})();
