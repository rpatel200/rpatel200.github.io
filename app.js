/* ============================================================================
   13FORAGE — app.js
   Live data: SEC EDGAR full-text search (efts.sec.gov) is CORS-open and needs
   no key, so a static page CAN fetch it from the browser. We use it to pull
   the most recent 13F-HR filing for each fund's CIK and surface the filing
   date + a link. This is genuine live data with no backend.

   What we DON'T do: fetch the structured holdings XML. Those live under
   data.sec.gov (no CORS) or www.sec.gov/Archives (Akamai). Neither is
   reliable from a static page without a proxy, so holdings analysis stays in
   the curated dataset. If you later add a proxy, extend fetchHoldings() here.
   ========================================================================== */

// EDGAR full-text search JSON endpoint. CORS-open, no key. Path casing
// matters: /LATEST/ must be uppercase (lowercase 404s). Verified response
// shape: results under hits.hits, each with _source.{file_date, adsh, form}.
const FTS_URL = "https://efts.sec.gov/LATEST/search-index";

function padCik(cik) {
  return String(cik).replace(/\D/g, "").padStart(10, "0");
}
function cikInt(cik) {
  return String(parseInt(String(cik).replace(/\D/g, ""), 10));
}
// adsh from the index has no dashes; add them to build a filing-index URL.
function dashAdsh(adsh) {
  const a = String(adsh || "").replace(/-/g, "");
  if (a.length !== 18) return adsh || "";
  return a.slice(0, 10) + "-" + a.slice(10, 12) + "-" + a.slice(12);
}

/* Fetch latest 13F-HR filing metadata for a CIK from EDGAR full-text search.
   Returns { date, accession, url } or null. A 13F can yield multiple hits
   (one per exhibit), so we dedupe implicitly by keeping the newest file_date. */
async function fetchLatest13F(cik) {
  const params = new URLSearchParams({
    q: "13F-HR",          // q is required; kept broad, forms does the filtering
    forms: "13F-HR",
    ciks: padCik(cik),
  });
  const url = `${FTS_URL}?${params.toString()}`;
  try {
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const hits = (data && data.hits && data.hits.hits) || [];
    if (!hits.length) return null;
    let best = null;
    for (const h of hits) {
      const src = h._source || {};
      const d = src.file_date || "";
      if (!d) continue;
      if (!best || d > best.date) {
        const adshDashed = dashAdsh(src.adsh);
        const ci = cikInt(cik);
        best = {
          date: d,
          accession: adshDashed,
          url: adshDashed
            ? `https://www.sec.gov/Archives/edgar/data/${ci}/${String(src.adsh).replace(/-/g,"")}/${adshDashed}-index.htm`
            : edgarFilingsLink(cik),
        };
      }
    }
    return best;
  } catch (err) {
    console.warn("EDGAR fetch failed for CIK", cik, err.message);
    return null;
  }
}

/* Convenience link to a fund's EDGAR filing history (always works, no fetch). */
function edgarFilingsLink(cik) {
  return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cikInt(cik)}&type=13F-HR&dateb=&owner=include&count=40`;
}

/* Count private-exposure companies for a fund. */
function peCompanies(fund) {
  return (fund.privateExposure || []).map((p) => p.company);
}

/* Escape text for safe HTML insertion. */
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Set a live-status pill's state. */
function setLive(el, state, text) {
  if (!el) return;
  el.className = "live " + (state || "");
  el.innerHTML = `<span class="dot"></span>${esc(text || "")}`;
}

/* ============================================================================
   STOOQ PRICE LAYER — live ~1-month sparkline + % change for a listed proxy.
   Stooq daily-history CSV is CORS-open and needs no key. Format:
     Date,Open,High,Low,Close,Volume
     2026-07-01,42.10,42.90,41.80,42.55,1234567
   US tickers use ".us" (arkk.us), London ".uk" (smt.uk). We take the last ~22
   trading rows (~1 month), build a tiny SVG sparkline, and compute % change
   from first to last close. Everything degrades: if the fetch fails, callers
   render the row without a chart.
   ========================================================================== */

const STOOQ_HISTORY = "https://stooq.com/q/d/l/";

/* Fetch daily closes for a Stooq ticker (e.g. "arkk.us"). Returns an array of
   { date, close } oldest→newest, or null on failure. */
async function fetchStooqDaily(ticker) {
  if (!ticker) return null;
  const t = String(ticker).toLowerCase();
  const url = `${STOOQ_HISTORY}?s=${encodeURIComponent(t)}&i=d`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    // Stooq returns "N/D" or an HTML error page when a symbol is unknown.
    if (!text || /^N\/D/i.test(text.trim()) || text.trim()[0] === "<") return null;
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return null;
    const header = lines[0].toLowerCase();
    const closeIdx = header.split(",").indexOf("close");
    const dateIdx = header.split(",").indexOf("date");
    if (closeIdx < 0) return null;
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      const close = parseFloat(cols[closeIdx]);
      if (!isFinite(close)) continue;
      rows.push({ date: cols[dateIdx] || "", close: close });
    }
    return rows.length ? rows : null;
  } catch (err) {
    console.warn("Stooq fetch failed for", ticker, err.message);
    return null;
  }
}

/* Reduce a daily series to the last ~1 month (default 22 trading days) and
   compute summary stats. Returns { series, pct, first, last, up } or null. */
function monthWindow(rows, days) {
  if (!rows || !rows.length) return null;
  const n = days || 22;
  const series = rows.slice(-n);
  if (series.length < 2) return null;
  const first = series[0].close;
  const last = series[series.length - 1].close;
  const pct = ((last - first) / first) * 100;
  return { series: series, pct: pct, first: first, last: last, up: pct >= 0 };
}

/* Build a compact inline SVG sparkline from a series of {close}. Colored by
   direction using the stylesheet's signal (up) / flag (down) tones. */
function sparklineSVG(win, w, h) {
  if (!win || !win.series || win.series.length < 2) return "";
  const width = w || 120, height = h || 32, pad = 2;
  const vals = win.series.map(function (d) { return d.close; });
  const min = Math.min.apply(null, vals);
  const max = Math.max.apply(null, vals);
  const span = (max - min) || 1;
  const stepX = (width - pad * 2) / (vals.length - 1);
  const pts = vals.map(function (v, i) {
    const x = pad + i * stepX;
    const y = pad + (height - pad * 2) * (1 - (v - min) / span);
    return x.toFixed(1) + "," + y.toFixed(1);
  });
  const stroke = win.up ? "var(--signal)" : "var(--flag)";
  const lastPt = pts[pts.length - 1].split(",");
  // Area fill path (subtle) + line + endpoint dot.
  const areaPts = pts.join(" ") +
    " " + (pad + (vals.length - 1) * stepX).toFixed(1) + "," + (height - pad) +
    " " + pad + "," + (height - pad);
  return (
    '<svg class="spark" width="' + width + '" height="' + height + '" ' +
    'viewBox="0 0 ' + width + ' ' + height + '" role="img" ' +
    'aria-label="1-month price trend" preserveAspectRatio="none">' +
      '<polyline points="' + areaPts + '" fill="' + stroke +
        '" opacity="0.08" stroke="none"></polyline>' +
      '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + stroke +
        '" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">' +
      '</polyline>' +
      '<circle cx="' + lastPt[0] + '" cy="' + lastPt[1] + '" r="2" fill="' +
        stroke + '"></circle>' +
    '</svg>'
  );
}

/* Format a percentage with sign, e.g. +4.2% / -1.8%. */
function fmtPct(pct) {
  if (pct == null || !isFinite(pct)) return "—";
  const sign = pct >= 0 ? "+" : "";
  return sign + pct.toFixed(1) + "%";
}
