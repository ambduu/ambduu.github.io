/* CodeBrew portfolio data: ONE source of truth for every scene that shows stores.
   Everything here is copied from the old site (themes.html, shopify-plus.html, apps.html). No invented facts.
   img = assets/work/<key>.jpg (all 16:10 above-the-fold captures; 1400x875 for the 4 case studies, 1024x640 for the rest).
   plus = named as Shopify Plus on the old site.
   note = the old site's own one-line case copy, where one exists. Otherwise scenes fall back to the playful STYLE note. */
(function () {
  const W = [
    // key, name, industry, domain, plus, note (from the old site, verbatim or trimmed)
    ["abstrax", "Abstrax Tech", null, "abstraxtech.com", true, "A fully custom Shopify Plus store on Horizon, with Lottie animation, HubSpot forms and B2B pricing brewed right into the theme."],
    ["cheribundi", "Cheribundi", null, "cheribundi.com", true, "Poured straight from a Figma design, section by section, with a custom Recharge subscription integration."],
    ["zugu", "Zugu Case", "Bags & covers", "zugucase.com", true, "A Shopify Plus regular, with B2B and Markets setups so one store can sell to the world in the right currency."],
    ["aavrani", "Aavrani", "Cosmetics", "aavrani.com", true, "A Shopify Plus regular from the cosmetics shelf."],
    ["woolandoak", "Wool & Oak", "Bags & covers", "woolandoak.com", true, "A Shopify Plus regular from the bags & covers shelf."],
    ["wearetto", "Wearetto", "Footwear", "wearetto.com", false, "A footwear store poured straight from a Figma design into custom sections, so the brand's look survived the trip to production."],
    ["sabah", "Sabah", "Footwear", "sabah.am", false, "A headless storefront on the Storefront API for a handmade leather footwear brand."],
    ["dylanlex", "Dylan Lex", "Jewellery", "dylanlex.com"], ["maitea", "Maitea", "Jewellery", "maitea.de"],
    ["miro", "Miro Jewelers", "Jewellery", "mirojewelers.com"], ["brooklyn", "Brooklyn Jewelers", "Jewellery", "brooklynjewelers.com"],
    ["purelei", "Purelei", "Jewellery", "purelei.com"],
    ["monkeeroos", "Monkeeroos", "Clothing", "monkeeroos.com"], ["mattym", "Shop Matty M", "Clothing", "shopmattym.com"],
    ["recolution", "Recolution", "Clothing", "recolution.de"],
    ["buebchen", "Bübchen", "Cosmetics", "buebchen.de"], ["waad", "Waad Skin", "Cosmetics", "waadskin.com"],
    ["blue", "Blue Skincare", "Cosmetics", "blue-skincare.com"], ["phystine", "Phystine", "Cosmetics", "phystine.com"],
    ["myeco", "My Eco World", "Pet", "myecoworld.com"], ["dirtydog", "Dirty Dog Beauty Club", "Pet", "dirtydogbeautyclub.com"],
    ["aliceeli", "Alice and Eli", "Pet", "aliceandeli.com"],
    ["ena", "ENA Athletics", "Footwear", "enaathletics.com"],
    ["luxorro", "Luxorro", "Bags & covers", "luxorro.com"],
    ["monte", "Monte Design", "Furniture", "montedesign.com"],
    ["vics", "Vic's Meat", "Food", "vicsmeat.com.au"]
  ].map(([key, name, ind, domain, plus = false, note = ""]) => ({ key, name, ind, domain, plus, note, img: `assets/work/${key}.jpg`, url: `https://${domain}/` }));

  // "Styles" = industries, each poured as a beer style. Beer colours drive the pour; names are bar talk, not claims.
  const STYLES = [
    { id: "plus", label: "Plus Reserve", short: "Plus ★", beer: "Barrel-aged", col: "#7c171b", beerCol: "#8a2c12", handle: ["#6e1418", "#b8262c"], match: w => w.plus },
    { id: "Jewellery", label: "Jewellery", beer: "Golden lager", col: "#d8a531", beerCol: "#f2c14e", handle: ["#b98a1c", "#f2c14e"] },
    { id: "Clothing", label: "Clothing", beer: "Pale ale", col: "#3fa0d8", beerCol: "#e9a03a", handle: ["#2a7bb0", "#62b6e6"] },
    { id: "Cosmetics", label: "Cosmetics", beer: "Rosé saison", col: "#e58aa0", beerCol: "#e8a07a", handle: ["#c4607a", "#f2a9ba"] },
    { id: "Pet", label: "Pet", beer: "Scruffy red", col: "#c9562f", beerCol: "#b5521f", handle: ["#9e3d1e", "#e0744a"] },
    { id: "Footwear", label: "Footwear", beer: "Session IPA", col: "#7cc243", beerCol: "#e0a23a", handle: ["#5d9a2e", "#9bd65f"] },
    { id: "Bags & covers", label: "Bags & covers", short: "Bags", beer: "Brown ale", col: "#8a5124", beerCol: "#8a4418", handle: ["#6a3b16", "#b77a3e"] },
    { id: "Furniture", label: "Furniture", beer: "Oak stout", col: "#4b3a2e", beerCol: "#2b1a12", handle: ["#2b1a12", "#5c4636"] },
    { id: "Food", label: "Food", beer: "Smoked porter", col: "#e2463a", beerCol: "#4a2412", handle: ["#b52d24", "#ee6a5c"] }
  ];
  STYLES.forEach(s => { s.match = s.match || (w => w.ind === s.id); s.stores = W.filter(s.match); });
  const NOTES = { // playful tasting notes per style (bar talk, no claims) — same lines as 60-bottling
    "Jewellery": "Bright, polished and a little bit extra. Best enjoyed up close.",
    "Clothing": "Easy-drinking, comes in every size. Pairs well with a lookbook.",
    "Cosmetics": "Smooth, clean finish. No harsh additives.",
    "Pet": "Friendly, playful and a bit scruffy around the edges. Good dogs only.",
    "Footwear": "Light on its feet with a long, comfortable finish.",
    "Bags & covers": "Sturdy body. Carries well.",
    "Furniture": "Full-bodied and built to last. Sit down for this one.",
    "Food": "Rich and hearty. Serve next to a hot grill."
  };
  const MORE = ["Amyo Jewelry", "A Life and Kickin", "Grillgott", "Sproos", "Create Good Sinks", "Picard Fashion", "Panac Edition"];
  // Plain-language bits for the portfolio views (tap room + stores.html). Visitor-facing, no bar talk.
  // indFor: the industry to print ("Shopify Plus" for the two Plus builds the old site lists without one).
  // caseFor: the old site's case line where one exists; otherwise a neutral line built from the old site's own wording
  // ("Real Shopify stores Germanjit has had his hands in, still pouring today." - themes.html). Never a new claim.
  const indFor = w => w.ind || "Shopify Plus";
  const caseFor = w => w.note || `A ${w.ind ? w.ind.toLowerCase() + " " : ""}store on Shopify that Germanjit has worked on, still live today.`;
  // one stable order for "store n of 26" + prev/next: Plus first, then each industry in tap order
  const ORDER = [...new Set(STYLES.flatMap(s => s.stores))];
  STYLES.forEach(s => { s.name = s.id === "plus" ? "Shopify Plus" : s.label; }); // plain button label
  window.WORK = { stores: W, styles: STYLES, notes: NOTES, more: MORE, byKey: Object.fromEntries(W.map(w => [w.key, w])),
    noteFor: w => w.note || NOTES[w.ind] || "", indFor, caseFor, order: ORDER,
    thumb: w => `assets/work/${w.key}-256.webp` };
})();
