/* ============================================================================
   13FORAGE — FUND DATASET
   ----------------------------------------------------------------------------
   This is the file you edit to add or update coverage.

   WHY THIS FILE EXISTS
   13F filings only disclose 13(f) securities — essentially US-listed equities,
   ADRs, and some options/convertibles. A fund's DIRECT equity stake in a
   private company (OpenAI, Anthropic, Anduril, SpaceX, etc.) does NOT appear
   in a 13F. So the "private-company exposure" angle has to be assembled by
   hand, using publicly known facts about which listed vehicles carry that
   exposure. That analytical layer lives here.

   The site fetches live filing metadata (latest 13F date, links) from SEC
   EDGAR full-text search at runtime and merges it onto these records. You
   supply the analysis; EDGAR supplies the freshness.

   HOW TO ADD A FUND
   Copy a block below, change the fields. `cik` is the SEC Central Index Key
   (find it at https://www.sec.gov/cgi-bin/browse-edgar). Pad to 10 digits or
   not — the code normalizes it. Everything in `privateExposure` is your own
   research; nothing there is auto-verified, so cite what you can.

   NOTE ON ACCURACY
   The seed entries below use publicly reported relationships as illustrative
   examples. Verify every figure against primary sources before publishing —
   private-company valuations and fund stakes move constantly and are often
   reported second-hand. Treat this as scaffolding, not gospel.
   ========================================================================== */

const FUNDS = [
  {
    slug: "ark-invest",
    name: "ARK Investment Management LLC",
    cik: "1697748",
    manager: "Catherine Wood",
    aumNote: "Multi-billion; varies by flows across ARK ETFs",
    thesis:
      "Thematic growth manager whose listed ETFs have, at points, held " +
      "vehicles and holding companies with reported private-tech exposure. " +
      "13F reflects the listed sleeve only.",
    privateExposure: [
      {
        company: "OpenAI",
        vehicle: "Held indirectly via reported stakes in private funds and " +
                 "SPVs disclosed in ARK Venture Fund materials (not the 13F).",
        basis: "reported",
        note: "ARK's Venture Fund (a listed closed-end-style product) has " +
              "publicly discussed OpenAI exposure. This is disclosed in fund " +
              "literature, not in the 13F holdings table.",
      },
    ],
    tags: ["thematic", "growth", "etf"],
  },
  {
    slug: "baillie-gifford",
    name: "Baillie Gifford & Co",
    cik: "1088875",
    manager: "Partnership",
    aumNote: "Large global growth manager",
    thesis:
      "Long-horizon growth investor with a substantial private book held " +
      "outside 13F scope. Listed positions appear in the 13F; the private " +
      "stakes are disclosed through its investment trusts and fund reports.",
    privateExposure: [
      {
        company: "SpaceX",
        vehicle: "Scottish Mortgage Investment Trust (LSE: SMT) and other " +
                 "Baillie Gifford vehicles have reported SpaceX holdings.",
        basis: "reported",
        note: "Scottish Mortgage is a UK-listed investment trust, not a 13F " +
              "filer position; exposure is disclosed in trust reports.",
      },
      {
        company: "OpenAI / Anthropic-adjacent",
        vehicle: "Growth trusts have discussed AI private exposure in reports.",
        basis: "reported",
        note: "Verify current holdings against the latest trust factsheet.",
      },
    ],
    tags: ["growth", "long-horizon", "trust"],
  },
  {
    slug: "coatue",
    name: "Coatue Management LLC",
    cik: "1135730",
    manager: "Philippe Laffont",
    aumNote: "Large crossover manager",
    thesis:
      "Crossover fund active in both public and private technology. The 13F " +
      "shows the public book; the private book (where names like Anthropic, " +
      "OpenAI and Anduril have been reported) sits outside 13F disclosure.",
    privateExposure: [
      {
        company: "Anthropic",
        vehicle: "Reported participation in private rounds via Coatue's " +
                 "private funds (not 13F-disclosed).",
        basis: "reported",
        note: "Crossover private positions are disclosed to LPs, not in 13Fs.",
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
];

if (typeof module !== "undefined") module.exports = FUNDS;
