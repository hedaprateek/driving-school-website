/*
 * SITE SETTINGS
 * Edit this file to put your own business details and prices on the website.
 * Every value appears in several places (top bar, header, price cards, RTO
 * services, booking form, footer, WhatsApp button), so change it here once.
 *
 * All prices are YOUR service charges in rupees, written as plain numbers
 * (3500, not "₹3,500"). Government fees are shown as "extra, at actuals".
 */
window.SITE_CONFIG = {
  businessName: "Rushikesh Motor Driving School",
  tagline: "Driving School & RTO Services",
  owner: "Rushikesh Nalawade",

  // Shown on the site and used for "tap to call".
  phone: "+91 77209 09706",

  // WhatsApp number: country code + number, digits only (no "+" or spaces).
  whatsapp: "917720909706",

  email: "hello@yourdomain.com",
  address: "Office address, City, State – PIN",

  // Working hours, as text (shown on the site)...
  hours: "Mon – Sat, 7:00 AM – 8:00 PM",
  // ...and as numbers, for the "Open now" badge. Days: 0 = Sunday … 6 = Saturday.
  openDays: [1, 2, 3, 4, 5, 6],
  openTime: "07:00",
  closeTime: "20:00",

  // New driving batches start on this weekday (1 = Monday). Shown as "Next batch starts …".
  batchStartDay: 1,

  // Google Maps search text for the map on the Contact page. Leave empty to hide the map.
  mapQuery: "",

  // Where the booking and contact forms are sent.
  // Create a free form at https://formspree.io and paste its endpoint here.
  // Leave empty and the forms open WhatsApp (or email) with the details
  // pre-filled, so the visitor just presses send.
  formEndpoint: "",

  /* ------------------------------------------------------------------
     DRIVING COURSES — shown on the Courses page and in the booking form.
     ------------------------------------------------------------------ */
  courses: [
    { id: "basic", name: "Quick Start", price: 3500, sessions: 15, minutes: 30,
      blurb: "Clutch, gears, steering and city traffic basics.",
      points: ["Dual-control car", "Traffic rules classroom", "Parking & reversing"] },
    { id: "standard", name: "Confident Driver", price: 5500, sessions: 21, minutes: 45, popular: true,
      blurb: "Our most chosen course — from first drive to test-ready.",
      points: ["Everything in Quick Start", "Hill start & reverse parking", "RTO test-track practice", "Mock driving test"] },
    { id: "pro", name: "Road Master", price: 7500, sessions: 30, minutes: 45,
      blurb: "For total beginners who want real-world confidence.",
      points: ["Everything in Confident Driver", "Highway & night driving", "Rain & heavy-traffic drills", "Basic car care"] },
    { id: "refresher", name: "Refresher", price: 2500, sessions: 7, minutes: 60,
      blurb: "Have a licence but out of practice? Get back on the road.",
      points: ["For licence holders", "Your route, your weak spots", "Your car or ours"] },
  ],

  // Extras in the plan builder on the Courses page.
  automaticExtra: 1000, // automatic car instead of manual
  addons: [
    { id: "pickup", name: "Home pick-up & drop", price: 1000 },
    { id: "extra5", name: "5 extra sessions", price: 1500 },
    { id: "weekend", name: "Weekend-only batch", price: 0 },
    { id: "lady", name: "Lady instructor", price: 0 },
  ],

  // "Course + licence" bundle: learner's + permanent licence, all RTO work done for you.
  // Separately it costs the two RTO services below; bundled it costs this.
  bundlePrice: 1500,
  bundleServices: ["ll", "dl"],

  /* ------------------------------------------------------------------
     RTO SERVICES — shown on the RTO page, with the documents checklist.
     cat: "licence" | "vehicle" | "commercial"
     ------------------------------------------------------------------ */
  rtoServices: [
    { id: "ll", cat: "licence", name: "Learner's licence", fee: 800, time: "Test slot in 2–7 days",
      blurb: "Form filling, slot booking and test preparation for your LL.",
      docs: ["Aadhaar card (age & address proof)", "Passport-size photograph", "Signature on white paper", "Medical certificate, Form 1A (only if age 40+)"] },
    { id: "dl", cat: "licence", name: "Permanent driving licence", fee: 1200, time: "Test 30 days after LL",
      blurb: "Driving test slot, our dual-control car for the test, card by post.",
      docs: ["Learner's licence (at least 30 days old)", "Aadhaar card", "Passport-size photograph", "Medical certificate, Form 1A (only if age 40+)"] },
    { id: "renew", cat: "licence", name: "Licence renewal", fee: 700, time: "7–15 days",
      blurb: "Renew before or after expiry — no test needed in most cases.",
      docs: ["Existing driving licence", "Aadhaar card", "Passport-size photograph", "Medical certificate, Form 1A (if age 40+)"] },
    { id: "dup-dl", cat: "licence", name: "Duplicate licence", fee: 700, time: "7–15 days",
      blurb: "Lost or damaged licence card? Get a fresh copy.",
      docs: ["Police report / FIR copy (if lost)", "Damaged licence (if damaged)", "Aadhaar card", "Passport-size photograph"] },
    { id: "dl-change", cat: "licence", name: "Address / name change in licence", fee: 600, time: "7–15 days",
      blurb: "Moved house or changed name? Update your licence.",
      docs: ["Existing driving licence", "New address proof (Aadhaar, rent agreement, bill)", "Gazette / marriage certificate (for name change)", "Passport-size photograph"] },
    { id: "add-class", cat: "licence", name: "Add a vehicle class", fee: 1000, time: "30+ days",
      blurb: "Add car to a bike licence (or the other way round).",
      docs: ["Existing driving licence", "Learner's licence for the new class", "Aadhaar card", "Passport-size photograph"] },
    { id: "idp", cat: "licence", name: "International Driving Permit", fee: 1000, time: "1–3 days",
      blurb: "Drive abroad legally — valid for one year.",
      docs: ["Valid Indian driving licence", "Passport", "Visa / air ticket copy", "Medical certificate, Form 1A", "Passport-size photographs (2)"] },

    { id: "rc-transfer", cat: "vehicle", name: "RC ownership transfer", fee: 1500, time: "15–30 days",
      blurb: "Bought or sold a used vehicle? Transfer it cleanly.",
      docs: ["Original RC", "Form 29 & Form 30 (signed by buyer and seller)", "Valid insurance", "Valid PUC certificate", "ID & address proof of buyer and seller", "Bank NOC (if the vehicle has a loan)"] },
    { id: "hp-remove", cat: "vehicle", name: "Loan (hypothecation) removal", fee: 1000, time: "7–15 days",
      blurb: "Loan closed? Get the bank's name removed from your RC.",
      docs: ["Original RC", "Bank NOC & Form 35 from the bank", "Valid insurance", "Valid PUC certificate", "Aadhaar card"] },
    { id: "hp-add", cat: "vehicle", name: "Loan (hypothecation) entry", fee: 900, time: "7–15 days",
      blurb: "Record a new vehicle loan on the RC.",
      docs: ["Original RC", "Form 34 signed by owner and bank", "Valid insurance", "Aadhaar card"] },
    { id: "dup-rc", cat: "vehicle", name: "Duplicate RC", fee: 1000, time: "15–30 days",
      blurb: "Lost or damaged registration certificate.",
      docs: ["Form 26", "Police report / FIR copy (if lost)", "Valid insurance", "Valid PUC certificate", "Aadhaar card", "Bank NOC (if the vehicle has a loan)"] },
    { id: "noc", cat: "vehicle", name: "NOC for another state", fee: 1500, time: "7–15 days",
      blurb: "Moving your vehicle to another state or RTO.",
      docs: ["Original RC", "Form 28", "Valid insurance", "Valid PUC certificate", "Chassis number pencil print", "Aadhaar card"] },
    { id: "rc-address", cat: "vehicle", name: "Address change in RC", fee: 800, time: "7–15 days",
      blurb: "Update the address on your registration certificate.",
      docs: ["Original RC", "Form 33", "New address proof", "Valid insurance", "Valid PUC certificate"] },
    { id: "rc-renew", cat: "vehicle", name: "RC renewal (15-year vehicle)", fee: 1500, time: "15–30 days",
      blurb: "Re-registration after 15 years, with the fitness inspection.",
      docs: ["Original RC", "Form 25", "Valid insurance", "Valid PUC certificate", "Road tax receipt", "Vehicle for inspection"] },
    { id: "hsrp", cat: "vehicle", name: "HSRP number plate booking", fee: 300, time: "Fitted in 5–10 days",
      blurb: "High-security number plates, booked and fitted.",
      docs: ["RC copy", "Owner's mobile number", "Vehicle for fitting"] },
    { id: "insurance", cat: "vehicle", name: "Insurance & PUC renewal", fee: 200, time: "Same day",
      blurb: "Compare insurance quotes and renew PUC without the running around.",
      docs: ["RC copy", "Previous insurance policy", "Vehicle for PUC check"] },

    { id: "badge", cat: "commercial", name: "Commercial (transport) licence", fee: 1500, time: "30+ days",
      blurb: "Upgrade to a transport licence for taxis, goods and buses.",
      docs: ["Existing driving licence", "Medical certificate, Form 1A", "Aadhaar card", "Passport-size photographs", "Education proof (if your state asks for it)"] },
    { id: "fitness", cat: "commercial", name: "Fitness certificate", fee: 1200, time: "1–7 days",
      blurb: "Fitness renewal for commercial vehicles, inspection arranged.",
      docs: ["Original RC", "Valid insurance", "Valid PUC certificate", "Permit copy", "Road tax receipt", "Vehicle for inspection"] },
    { id: "permit", cat: "commercial", name: "Permit (tourist / goods)", fee: 2000, time: "7–15 days",
      blurb: "New permits and permit renewals, state or national.",
      docs: ["Original RC", "Valid fitness certificate", "Valid insurance", "Road tax receipt", "Aadhaar card"] },
    { id: "challan", cat: "commercial", name: "Road tax & challan settlement", fee: 300, time: "Same day",
      blurb: "Pay road tax and clear pending e-challans correctly.",
      docs: ["Vehicle number", "RC copy", "Challan number (if you have it)"] },
  ],
};
