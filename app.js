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
