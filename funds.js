/* ============================================================================
   13FORAGE — FUND DATASET
   ----------------------------------------------------------------------------
   This is the file you edit to add or update coverage.

   WHY THIS FILE EXISTS
   13F filings only disclose 13(f) securities — essentially US-listed equities,
   ADRs, and some options/convertibles. A fund's DIRECT equity stake in a
   private company (OpenAI, Anthropic, Anduril, etc.) does NOT appear in a 13F.
   So the "private-company exposure" angle is assembled by hand from public
   reporting about which listed vehicles carry that exposure. That analytical
   layer lives here.

   TWO LIVE LAYERS FEED OFF THIS FILE
   1. SEC EDGAR full-text search supplies each fund's latest 13F-HR date (via
      the CIK field), fetched in-browser.
   2. Stooq supplies a live ~1-month price chart + % change for the fund's
      listed PROXY ticker (the `proxy` field), fetched in-browser.

   IMPORTANT ON `proxy`
   Most funds are private partnerships with no ticker — you cannot chart them.
   Where a fund IS itself listed (e.g. Destiny Tech100 = DXYZ) or has a clean
   listed vehicle (e.g. ARK = ARKK/ARKVX), put that ticker in `proxy` with a
   Stooq-style suffix: US listings use ".us", London uses ".uk". Set `proxy`
   to null when nothing listed cleanly represents the fund — the row then shows
   "no listed proxy" instead of a fake chart. Always label what the proxy is in
   `proxyNote` so readers don't mistake it for the fund itself.

   ACCURACY
   Figures below are drawn from public reporting through ~July 2026 and move
   constantly. Every number is a snapshot, not a live truth. Verify against
   primary sources before relying on anything. Fields marked basis:"reported"
   are second-hand; "disclosed" means it appears in a regulated filing/fund doc.
   ========================================================================== */

const FUNDS = [
  {
    slug: "situational-awareness",
    name: "Situational Awareness LP",
    cik: "",
    manager: "Leopold Aschenbrenner",
    founded: "2024",
    aumNote: "Peaked near $45B (reported); collapsed sharply in Jul 2026",
    proxy: null,
    proxyNote: "Private partnership — no listed vehicle. Public book reported " +
               "sold to Citadel in a single block trade on 30 Jul 2026.",
    thesis:
      "AGI-infrastructure thesis fund built on Aschenbrenner's 2024 essay: " +
      "that scaling AI demands a build-out of compute, semiconductors, memory " +
      "and power, and that the infrastructure suppliers capture the value. The " +
      "book concentrated in names like SK Hynix and power/compute plays, with " +
      "reported short positions in software. After steep AI-infrastructure " +
      "losses in July 2026 the fund reportedly unwound its entire public " +
      "portfolio to Citadel and sought fresh capital.",
    performance:
      "Reported an extraordinary rise from ~$225M seed capital to a book " +
      "marked in the billions within roughly a year, then a severe drawdown in " +
      "July 2026 tied to a selloff in AI-infrastructure equities and adverse " +
      "software shorts. Current NAV unconfirmed. Treat all figures as fluid — " +
      "this is a developing story.",
    privateExposure: [
      {
        company: "Anthropic",
        vehicle: "Direct private stake, reported to be retained even after the " +
                 "public book was sold.",
        basis: "reported",
        note: "Reporting (Jul 2026) indicates the Anthropic position was NOT " +
              "part of the public-portfolio sale to Citadel. Not a 13F item.",
      },
    ],
    tags: ["agi-thesis", "hedge-fund", "ai-infrastructure", "developing"],
  },
  {
    slug: "ark-venture",
    name: "ARK Venture Fund",
    cik: "",
    manager: "Cathie Wood / ARK Investment Management",
    founded: "2022",
    aumNote: "Crossed ~$1B AUM in mid-2026 (reported)",
    proxy: "ARKVX.US",
    proxyNote: "ARKVX is the fund itself — an interval fund, NOT exchange-" +
               "traded, so its price updates on a NAV basis and is far less " +
               "liquid than an ETF. Chart reflects reported NAV marks.",
    thesis:
      "A rare retail-accessible interval fund holding both public and private " +
      "disruptive-tech names. Roughly 80% of assets sit in private companies, " +
      "giving everyday investors indirect pre-IPO exposure that normally " +
      "requires accreditation. The vehicle is the whole point: the private " +
      "book is the product.",
    performance:
      "Reported ~68-70 holdings with the top five concentrated around 40%+ of " +
      "assets. Reported top positions have included OpenAI (~11%), Anthropic " +
      "(~4%) and other frontier names. NAV has been volatile with the AI " +
      "private-valuation cycle. Fees are high (~2.9% total). Verify the current " +
      "factsheet for live weights.",
    privateExposure: [
      {
        company: "OpenAI",
        vehicle: "Direct private position; reported as a top-five holding.",
        basis: "disclosed",
        note: "Disclosed in ARK Venture Fund materials (not a 13F).",
      },
      {
        company: "Anthropic",
        vehicle: "Direct private position, reportedly held since 2023.",
        basis: "disclosed",
        note: "Early entry reported at a low-single-digit-billion valuation.",
      },
      {
        company: "xAI / Figure AI / others",
        vehicle: "Additional private frontier-tech positions in the book.",
        basis: "disclosed",
        note: "Weights shift; check the latest fund factsheet.",
      },
    ],
    tags: ["interval-fund", "retail-accessible", "private-heavy", "thematic"],
  },
  {
    slug: "destiny-tech100",
    name: "Destiny Tech100 Inc.",
    cik: "",
    manager: "Destiny XYZ Inc.",
    founded: "2024 (NYSE listing)",
    aumNote: "Closed-end fund; trades at a notable premium/discount to NAV",
    proxy: "DXYZ.US",
    proxyNote: "DXYZ is the fund itself, NYSE-listed — the chart genuinely " +
               "tracks this fund. Note it has historically traded at a large " +
               "premium to NAV, so price does not equal underlying asset value.",
    thesis:
      "A NYSE-listed closed-end fund designed to hold ~100 top private tech " +
      "companies, giving ordinary investors a single-ticker route into names " +
      "usually gated to qualified buyers. The listing makes it one of the very " +
      "few retail-tradable private-exposure vehicles — with the well-known " +
      "caveat that its market price can detach sharply from underlying NAV.",
    performance:
      "As a listed CEF, DXYZ's price is set by supply and demand and has at " +
      "times traded at a very large premium to reported NAV. Reported to carry " +
      "one of the more concentrated retail-accessible OpenAI positions among " +
      "listed vehicles. Watch premium/discount to NAV as closely as price.",
    privateExposure: [
      {
        company: "OpenAI",
        vehicle: "Direct private position; among the larger positions in NAV.",
        basis: "disclosed",
        note: "Reported as one of the fund's most concentrated single bets.",
      },
      {
        company: "SpaceX (now public)",
        vehicle: "Historically held pre-IPO; SpaceX listed (SPCX) in Jun 2026.",
        basis: "reported",
        note: "SpaceX is no longer private — included only for continuity.",
      },
    ],
    tags: ["closed-end-fund", "nyse-listed", "retail-accessible", "premium-to-nav"],
  },
  {
    slug: "coatue",
    name: "Coatue Management LLC",
    cik: "1135730",
    manager: "Philippe Laffont",
    founded: "1999",
    aumNote: "Large crossover manager (tens of billions)",
    proxy: null,
    proxyNote: "Private crossover manager — no single listed vehicle. Its 13F " +
               "covers only the public book; the private book is separate.",
    thesis:
      "A crossover technology investor active across public and private " +
      "markets. The public book appears in its quarterly 13F; the private book " +
      "— where frontier-AI names have been reported — is disclosed only to LPs. " +
      "Coatue has participated in marquee private AI rounds, making it a " +
      "bellwether for institutional private-AI positioning.",
    performance:
      "Public 13F holdings skew toward large-cap technology and AI beneficiaries. " +
      "Private-side performance is not publicly marked. Use the 13F for the " +
      "liquid sleeve; treat private marks as opaque.",
    privateExposure: [
      {
        company: "Anthropic",
        vehicle: "Reported participation in Anthropic's 2026 Series H round.",
        basis: "reported",
        note: "Named among Series H participants in press coverage. Not a 13F item.",
      },
      {
        company: "Anduril",
        vehicle: "Reported private-round participation.",
        basis: "reported",
        note: "Verify against primary reporting before publishing figures.",
      },
    ],
    tags: ["crossover", "technology", "hedge-fund"],
  },
  {
    slug: "baillie-gifford",
    name: "Baillie Gifford & Co",
    cik: "1088875",
    manager: "Partnership",
    founded: "1908",
    aumNote: "Large global growth manager",
    proxy: "SMT.UK",
    proxyNote: "SMT = Scottish Mortgage Investment Trust, a London-listed trust " +
               "managed by Baillie Gifford. It's a proxy for the firm's growth " +
               "style and private book — NOT the whole firm.",
    thesis:
      "A long-horizon growth investor with a substantial private book held " +
      "outside 13F scope. US-listed positions show up in the 13F; the private " +
      "stakes are disclosed through its listed investment trusts (notably " +
      "Scottish Mortgage) and fund reports. Its patient style makes it a " +
      "recurring name in late-stage private technology rounds.",
    performance:
      "Scottish Mortgage's listed price offers a daily read on the growth-and-" +
      "private-tech style, though it trades at a premium/discount to NAV and " +
      "includes far more than any single private name. Reported participant in " +
      "Anthropic's 2026 Series H round.",
    privateExposure: [
      {
        company: "Anthropic",
        vehicle: "Reported additional participation in the 2026 Series H round; " +
                 "exposure surfaced via Baillie Gifford vehicles/trusts.",
        basis: "reported",
        note: "Disclosed via fund/trust reporting, not the 13F. Verify weights.",
      },
    ],
    tags: ["growth", "long-horizon", "trust", "uk-listed"],
  },
  {
    slug: "capital-group",
    name: "Capital Group",
    cik: "",
    manager: "Capital Research & Management",
    founded: "1931",
    aumNote: "One of the world's largest active managers",
    proxy: null,
    proxyNote: "Mutual-fund complex — individual funds (e.g. AGTHX) price on " +
               "NAV. Set proxy to a specific fund ticker if you want one charted.",
    thesis:
      "A giant active manager whose growth mutual funds have quietly become " +
      "among the largest institutional holders of private AI equity. The " +
      "exposure is buried inside mainstream funds many retail investors already " +
      "own, which is what makes it notable: private-AI risk delivered through " +
      "ordinary retirement vehicles.",
    performance:
      "Reported as the largest fund sponsor by dollar exposure to Anthropic, " +
      "led by Growth Fund of America (AGTHX), which has reported the single " +
      "largest disclosed Anthropic position among funds. Figures are as of the " +
      "Q1 2026 reporting period and move each quarter.",
    privateExposure: [
      {
        company: "Anthropic",
        vehicle: "Growth Fund of America (AGTHX) and related growth funds; " +
                 "reported to hold Series F-1 and G-1 preferred.",
        basis: "disclosed",
        note: "Disclosed in fund holdings reports; reported as the largest " +
              "single fund position in Anthropic. Not a 13F equity line.",
      },
      {
        company: "OpenAI",
        vehicle: "Additional growth-fund exposure reported across the complex.",
        basis: "disclosed",
        note: "Verify per-fund weights in the latest shareholder reports.",
      },
    ],
    tags: ["active-manager", "mutual-funds", "largest-holder", "retail-embedded"],
  },
  {
    slug: "fidelity",
    name: "Fidelity (FMR LLC)",
    cik: "315066",
    manager: "FMR LLC",
    founded: "1946",
    aumNote: "Multi-trillion asset manager",
    proxy: null,
    proxyNote: "Fund complex — exposure is spread across dozens of funds " +
               "(e.g. Contrafund/FCNTX prices on NAV). No single proxy captures it.",
    thesis:
      "The broadest distributor of private-AI exposure by fund count. Fidelity " +
      "marks its private positions periodically, and those marks have become a " +
      "closely-watched reference for private valuations. The exposure reaches " +
      "millions of ordinary investors through mainstream funds.",
    performance:
      "Reported to spread Anthropic and OpenAI exposure across dozens of funds " +
      "— the widest distribution of any sponsor, though behind Capital Group " +
      "and T. Rowe Price on total dollar value. Fidelity's periodic remarks of " +
      "private stakes can move sentiment on those companies' valuations.",
    privateExposure: [
      {
        company: "Anthropic",
        vehicle: "Reported across ~40+ Fidelity funds.",
        basis: "disclosed",
        note: "Disclosed in fund holdings; broad but individually small weights.",
      },
      {
        company: "OpenAI",
        vehicle: "Reported across ~30+ Fidelity funds.",
        basis: "disclosed",
        note: "Verify per-fund exposure in the latest reports.",
      },
    ],
    tags: ["active-manager", "mutual-funds", "widest-distribution", "valuation-setter"],
  },
  {
    slug: "t-rowe-price",
    name: "T. Rowe Price",
    cik: "1113169",
    manager: "T. Rowe Price Associates",
    founded: "1937",
    aumNote: "Large active manager",
    proxy: "TROW.US",
    proxyNote: "TROW is the listed stock of the asset manager itself, not any " +
               "of its funds. It reflects the firm's equity, not fund NAV or " +
               "any private position — treat as a loose sentiment proxy only.",
    thesis:
      "The deepest bench of OpenAI exposure by fund count among traditional " +
      "sponsors. T. Rowe's growth funds have taken private-AI positions across " +
      "many vehicles, embedding frontier-AI risk in mainstream active products.",
    performance:
      "Reported as the OpenAI 'house' by fund count — the most separate fund " +
      "vehicles reporting OpenAI exposure among traditional sponsors. Dollar " +
      "exposure is meaningful though not the largest. Q1 2026 snapshot.",
    privateExposure: [
      {
        company: "OpenAI",
        vehicle: "Reported across ~19 T. Rowe Price fund vehicles.",
        basis: "disclosed",
        note: "Broadest OpenAI fund count reported among traditional sponsors.",
      },
      {
        company: "Anthropic",
        vehicle: "Reported across several additional funds.",
        basis: "disclosed",
        note: "Fewer vehicles than its OpenAI exposure per reporting.",
      },
    ],
    tags: ["active-manager", "mutual-funds", "openai-house"],
  },
  {
    slug: "kraneshares-ai",
    name: "KraneShares AI & Technology Public-Private ETF",
    cik: "",
    manager: "Krane Funds Advisors",
    founded: "2025",
    aumNote: "Listed ETF; premium expense ratio (~0.99%)",
    proxy: null,
    proxyNote: "A listed ETF blending public and private AI exposure. Add its " +
               "exchange ticker to `proxy` (with .us) once confirmed to chart it.",
    thesis:
      "An ETF built explicitly to wrap a private-market 'kicker' inside a " +
      "daily-liquid, non-accredited product. It packages a slice of private AI " +
      "(reported to include OpenAI) alongside listed AI names — an unusually " +
      "direct attempt to retail-ize private-company exposure.",
    performance:
      "Daily-liquid and exchange-traded, so price discovery is continuous " +
      "— but the private sleeve is marked, not traded, so NAV embeds valuation " +
      "assumptions. Premium expense ratio (~0.99%) reflects the private access.",
    privateExposure: [
      {
        company: "OpenAI",
        vehicle: "Private sleeve inside the ETF wrapper.",
        basis: "disclosed",
        note: "Disclosed in ETF holdings; provides retail pre-IPO exposure.",
      },
    ],
    tags: ["etf", "public-private", "retail-accessible", "daily-liquid"],
  },
  {
    slug: "ark-innovation",
    name: "ARK Innovation ETF",
    cik: "",
    manager: "Cathie Wood / ARK Investment Management",
    founded: "2014",
    aumNote: "Flagship ARK ETF; multi-billion, flow-sensitive",
    proxy: "ARKK.US",
    proxyNote: "ARKK is the ETF itself, exchange-traded — the chart tracks it " +
               "directly. Its private exposure is small relative to NAV; most " +
               "holdings are listed disruptive-tech names.",
    thesis:
      "The flagship listed ARK ETF, mostly public disruptive-tech names but " +
      "reported to carry a small direct OpenAI position plus 'layered' exposure " +
      "through holders like Alphabet and Amazon that have invested in Anthropic. " +
      "A liquid, familiar wrapper with a thin private kicker.",
    performance:
      "Fully exchange-traded with daily liquidity, so the chart is a true price. " +
      "Highly sensitive to growth/rate sentiment and flows. Reported ~0.75% " +
      "expense ratio. The private sleeve is minor versus the listed book.",
    privateExposure: [
      {
        company: "OpenAI",
        vehicle: "Small direct private position inside the ETF.",
        basis: "disclosed",
        note: "Minor relative to NAV; most exposure is listed equities.",
      },
      {
        company: "Anthropic (layered)",
        vehicle: "Indirect via holdings in Alphabet and Amazon, both Anthropic " +
                 "strategic investors.",
        basis: "reported",
        note: "Layered/indirect exposure, not a direct stake.",
      },
    ],
    tags: ["etf", "flagship", "daily-liquid", "layered-exposure"],
  },
];

if (typeof module !== "undefined") module.exports = FUNDS;
