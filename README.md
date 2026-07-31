# 13Forage

A static site producing high-level equity research on institutional funds with
reported exposure to late-stage **private** companies (Anthropic, Anduril,
OpenAI, SpaceX, etc.), pairing a curated analysis layer with live SEC filing
data fetched in the browser.

## Files

```
index.html        Coverage index — hero, disclosure, live fund table
report.html       Per-fund research note (reads ?fund=<slug>)
about.html        Method & limitations
assets/style.css  Design system
assets/app.js     Live EDGAR fetch + helpers
data/funds.js     ← THE FILE YOU EDIT to add/update coverage
```

## Hosting

It's pure static files — no build step. Host anywhere:

- **GitHub Pages:** push this folder to a repo, enable Pages on the branch.
- **Netlify / Cloudflare Pages / Vercel:** drag-and-drop or point at the repo.
- **Any web server / S3 bucket:** upload as-is.

Open `index.html` over `http(s)://`, not `file://` — the EDGAR `fetch` needs a
real origin.

## The one important limitation (read this)

A 13F filing only discloses **13(f) securities** — US-listed equities, ADRs,
some options. A fund's **direct** stake in a private company does **not** appear
in its 13F. So the private-exposure content is *not* auto-derived; it's your
curated analysis in `data/funds.js`, based on public reporting about listed
vehicles (trusts, holding companies, BDCs) that carry the exposure. The seed
entries are illustrative — **verify every figure before publishing.**

## What's actually live

Each fund's latest **13F-HR filing date + links** are fetched at page load from
SEC EDGAR full-text search (`efts.sec.gov`), which is CORS-open and needs no
key. If EDGAR is unreachable, the curated analysis still renders — only the live
date column is affected.

The structured holdings tables are **not** fetched live: the SEC endpoints that
serve them (`data.sec.gov`, `www.sec.gov/Archives`) don't allow reliable direct
browser access. To add live holdings later, stand up a small proxy (e.g. a
Cloudflare Worker) and extend `app.js`.

## Add a fund

Edit `data/funds.js`, copy an existing block, and change the fields. Find a
fund's CIK at <https://www.sec.gov/cgi-bin/browse-edgar>. Each
`privateExposure` entry has a `basis` field — set it to `reported`,
`disclosed`, or `confirmed` so readers see how well-substantiated each claim is.
No rebuild needed; just refresh.

## Not investment advice

This is a research/education aggregator. Nothing here is a recommendation to buy
or sell. Inferred private exposure may be stale, partial, or wrong.
