# 13Forage

A static site producing high-level equity research on institutional funds with
reported exposure to late-stage **private** companies (Anthropic, Anduril,
OpenAI, etc.), pairing a curated analysis layer with two live in-browser data
feeds.

## Files

```
index.html        Coverage index — hero, LIVE indicator, fund table w/ charts
report.html       Per-fund research note (reads ?fund=<slug>)
about.html        Method & limitations
assets/style.css  Design system
assets/app.js     Live EDGAR + Stooq fetch, sparkline generator, helpers
data/funds.js     ← THE FILE YOU EDIT to add/update coverage (10 funds seeded)
```

Keep the `assets/` and `data/` subfolders intact — the HTML references
`assets/style.css`, `data/funds.js`, etc. Flattening them breaks the site.

## Hosting (GitHub Pages)

Push the folder to your repo, then Settings → Pages → Deploy from branch →
`main` → `/ (root)` → Save. Your URL appears as
`https://<user>.github.io/<repo>/`. Serve over https (not `file://`) or the live
fetches won't run.

## The two live layers

1. **Latest 13F-HR date** — from SEC EDGAR full-text search (`efts.sec.gov`),
   CORS-open, no key. Only funds with a real `cik` in `funds.js` are fetched;
   others show "no 13F on file."
2. **1-month price chart + % change** — from Stooq CSV, CORS-open, no key. Only
   funds with a listed `proxy` ticker are charted; others show "no listed
   proxy." Green line = up over the window, amber = down.

The red **LIVE** dot in the top-right pulses when at least one live source
loaded; it falls back to a static "offline" state if both are unreachable. Both
layers degrade gracefully — the curated analysis always renders.

## The core limitation (still true)

A 13F discloses only listed securities, so a fund's **direct** private stake
never appears in it. All private-exposure content is curated in `funds.js` from
public reporting, and the charts track a listed **proxy**, never the private
stake itself. The seed data reflects public reporting through ~July 2026 and is
illustrative — **verify every figure before publishing.**

### On proxies specifically
Most funds are private partnerships with no ticker and can't be charted. Some
funds *are* listed and chart honestly: Destiny Tech100 (DXYZ), ARK Innovation
(ARKK), ARK Venture (ARKVX, an interval fund priced on NAV). Others use a loose
proxy — e.g. Baillie Gifford → Scottish Mortgage (SMT.UK), T. Rowe Price → its
own listed stock (TROW). Always read the `proxyNote` so the chart isn't mistaken
for the fund's actual performance.

## Add a fund

Edit `data/funds.js`, copy a block, change the fields. Set `cik` for live filing
dates (find it at <https://www.sec.gov/cgi-bin/browse-edgar>), and `proxy` (with
a `.us`/`.uk` suffix) for a live chart — or `null` to skip. No rebuild; refresh.

## Not investment advice

Independent research/education aggregator. Nothing here is a recommendation.
Inferred private exposure may be stale, partial, or wrong.
