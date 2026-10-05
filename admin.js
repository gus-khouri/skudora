// admin.js: dresses Skudora admin views for Surf Beach Supplies / FlyGuy Fitness screenshots.
// Browser view only; nothing is saved. Requires dress.js loaded first (window.__dress).
(() => {
  const D = window.__dress;
  const f2 = (n) => n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  window.__loadH2C = async () => {
    if (window.html2canvas) return true;
    await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'; s.onload = res; s.onerror = () => rej(new Error('html2canvas blocked')); document.head.appendChild(s); });
    return true;
  };
  window.__save = (data, name) => {
    const bin = atob(data.split(',')[1]); const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    const u = URL.createObjectURL(new Blob([arr], { type: 'image/jpeg' }));
    const a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(u), 60000); return name + ' ' + arr.length;
  };
  window.__capture = async (el, name, opts = {}) => {
    await window.__loadH2C();
    const cv = await html2canvas(el, Object.assign({ scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false }, opts));
    return window.__save(cv.toDataURL('image/jpeg', 0.9), name);
  };

  // generic text replacement over the page (skips product cards)
  window.__replaceText = (pairs, root = document.body) => {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n, c = 0;
    while ((n = w.nextNode())) {
      if (n.parentElement.closest('script,style,a.component-sku-card')) continue;
      const v = n.nodeValue.trim(); if (!v) continue;
      for (const [re, to] of pairs) { if (re.test(v)) { n.nodeValue = n.nodeValue.replace(re.source.startsWith('^') ? v : re, to); c++; break; } }
    }
    return c;
  };

  window.__dressUser = () => {
    window.__replaceText([[/^Gus Khouri$/, 'Kai Mercer'], [/gkhouri@.*/, 'kai@surfbeachsupplies.ca'], [/^GK$/, 'KM']]);
    [...document.querySelectorAll('div,button,a')].filter((e) => getComputedStyle(e).position === 'fixed' && /Need Help/.test(e.textContent)).forEach((e) => (e.style.visibility = 'hidden'));
  };

  window.__dressSkuPage = () => {
    const p = D.P[0];
    document.querySelectorAll('h1 .manufacturer-name').forEach((e) => (e.textContent = 'FlyGuy Fitness™ '));
    document.querySelectorAll('h1 .part-number').forEach((e) => (e.textContent = 'FG-HEX-25 '));
    document.querySelectorAll('h1 .name').forEach((e) => (e.textContent = 'Rubber Hex Dumbbell, 25 lb, Pair'));
    document.querySelectorAll('img').forEach((im) => {
      if (im.closest('a.component-sku-card') || im.src.startsWith('data:') || /logo/i.test(im.className) || /company_logos/.test(im.src)) return;
      if (/sku_image|uploads/.test(im.src)) { im.src = p.img; im.srcset = ''; }
    });
    const c = window.__replaceText([
      [/^Size$/, 'Weight'], [/^Small$/, '15 lb'], [/^Medium\/Large$/, '25 lb'], [/^X-Large$/, '35 lb'], [/^2X-Large$/, '50 lb'],
      [/^Gym Flooring$/, 'Strength Training'], [/^Fall Protection$/, 'Strength Training'], [/^Body Harnesses$/, 'Dumbbells'],
      [/^Part # .*/, 'Part # FG-HEX-25'], [/L3Y7B3/, 'V0R 2Z0'], [/^\$116$/, '$89.99'], [/^145$/, '112.49'], [/^3M™ ?$/, 'FlyGuy Fitness™ '], [/^1161542C$/, 'FG-HEX-25'],
      [/^Mexico$/, 'Canada'], [/^Created: .*/, 'Created: Feb 12, 2024 at 09:15 AM (2 years ago) by Kai Mercer'],
      [/^Quantity Sold: .*/, 'Quantity Sold: 412'], [/^Number Added to Quotes: .*/, 'Number Added to Quotes: 168'], [/^Impression Count: .*/, 'Impression Count: 18,904'],
      [/^Sku ID: .*/, 'Sku ID: 48213'], [/^00076308400620$/, '06280000123456'],
    ]);
    document.title = 'FlyGuy Fitness™ FG-HEX-25 Rubber Hex Dumbbell | Surf Beach Supplies';
    window.__dressUser();
    return c;
  };

  const LIST = 112.49, LANDED = 59.62;
  const FX = [1.37, 1.36, 1.38, 1.36, 1.35, 1.37, 1.39, 1.38];
  const DATES = ['2026-10-01 06:00am', '2026-09-02 06:00am', '2026-08-01 06:00am', '2026-07-02 06:00am', '2026-06-01 06:00am', '2026-05-01 06:00am', '2026-04-01 06:00am', '2026-03-02 06:00am'];

  window.__dressPricing = () => {
    const T = document.querySelectorAll('table'); const g = [...T].find((t) => t.rows.length === 5 && t.rows[0].cells.length > 20);
    if (g) [...g.rows[0].cells].forEach((c, i) => { const d = i / 100, sell = LIST * (1 - d), gp = sell - LANDED; g.rows[1].cells[i].textContent = '$' + f2(sell); g.rows[2].cells[i].textContent = '$' + f2(LIST - sell); g.rows[3].cells[i].textContent = '$' + f2(gp); g.rows[4].cells[i].textContent = f2(gp / sell * 100) + '%'; });
    const h = [...T].find((t) => t.rows[0] && /List Price/.test(t.rows[0].textContent) && /MAP/.test(t.rows[0].textContent));
    if (h) {
      const H = [...h.rows[0].cells].map((c) => c.textContent.trim()); const col = (n) => H.indexOf(n);
      [...h.rows].slice(1).forEach((r, i) => {
        if (i >= FX.length) { r.style.display = 'none'; return; }
        const fx = FX[i], cost = 39.5 * fx, landed = cost * 1.08 * 1.02, list = i === 0 ? LIST : landed / 0.53;
        const set = (n, v) => { const j = col(n); if (j >= 0 && r.cells[j]) r.cells[j].textContent = v; };
        set('List Price', 'CAD$' + f2(list)); set('MAP', 'CAD$99.99'); set('Date Calculated', DATES[i]); set('Last Updated', DATES[i]);
        set('Effective until', ''); set('Vendor', 'FLYGUY FITNESS INC.'); set('Vendor Cost', 'USD$39.50'); set('Cost', f2(cost)); set('Landed Cost', 'CAD$' + f2(i === 0 ? LANDED : landed));
        set('Bank Fee X', '1.02'); set('Freight Factor X', '1.08'); set('Buffer X', ''); set('Exchange Rate X', String(fx)); set('Profit Margin', '0.47');
        set('Profit Margin Source', 'Category - Strength Training'); set('Cost Lookup Info', ''); set('Pricing Entry ID', String(8204511 - i * 1730));
        set('Pricing Entry Source', 'spire'); set('Price List ID', '3104'); set('ID', String(2290450 - i * 977));
      });
    }
    const c = window.__replaceText([
      [/^CAD\$145\.00$/, 'CAD$112.49'], [/^\$145\.00$/, '$112.49'], [/^145\.00$/, '112.49'], [/^CAD\$77\.39$/, 'CAD$59.62'], [/^\$77\.39$/, '$59.62'], [/^77\.39$/, '59.62'],
      [/^Vendor: .*/, 'Vendor: FLYGUY FITNESS INC.'], [/^Calculated at: .*/, 'Calculated at: October 1st, 2026, 6:00am'],
    ]);
    const lbl = [...document.querySelectorAll('label,span,div')].find((e) => e.children.length < 3 && /Enable Minimum Advertised Price/.test(e.textContent));
    const cb = lbl && (lbl.querySelector('input') || lbl.parentElement.querySelector('input[type=checkbox]')); if (cb) cb.checked = true;
    return { grid: !!g, hist: !!h, text: c, map: !!cb };
  };

  window.__drawChart = () => {
    const c = document.querySelector('canvas.raw-islp-chart'); if (!c) return 'no chart';
    const W = c.width, H = c.height, cssW = c.getBoundingClientRect().width, s = W / cssW, h = H / s;
    const ctx = c.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.scale(s, s);
    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']; const fx = FX.slice().reverse();
    const landed = fx.map((f) => 39.5 * f * 1.08 * 1.02), list = landed.map((v) => v / 0.53);
    const L = 56, R = cssW - 24, T = 40, B = h - 40, ymin = 40, ymax = 130;
    const X = (i) => L + (R - L) * i / (months.length - 1), Y = (v) => B - (v - ymin) / (ymax - ymin) * (B - T);
    ctx.font = '12px Arial'; ctx.lineWidth = 1; ctx.strokeStyle = '#ececec'; ctx.fillStyle = '#6b7280'; ctx.textAlign = 'right';
    for (let v = ymin; v <= ymax; v += 10) { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(R, Y(v)); ctx.stroke(); ctx.fillText(String(v), L - 8, Y(v) + 4); }
    ctx.textAlign = 'center'; months.forEach((m, i) => { ctx.beginPath(); ctx.moveTo(X(i), T); ctx.lineTo(X(i), B); ctx.stroke(); ctx.fillText(m + ' 2026', X(i), B + 20); });
    ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(L, Y(60), R - L, B - Y(60));
    const step = (vals, color, dash) => {
      ctx.setLineDash(dash); ctx.strokeStyle = color; ctx.lineWidth = 1.8; ctx.beginPath();
      vals.forEach((v, i) => { if (i === 0) ctx.moveTo(X(i), Y(v)); else { ctx.lineTo(X(i), Y(vals[i - 1])); ctx.lineTo(X(i), Y(v)); } });
      ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#fff';
      vals.forEach((v, i) => { ctx.beginPath(); ctx.arc(X(i), Y(v), 3.4, 0, 7); ctx.fill(); ctx.strokeStyle = color; ctx.stroke(); });
    };
    step(list, '#8fa5f5', []); step(landed, '#2f4fd6', [5, 4]);
    ctx.setLineDash([7, 5]); ctx.strokeStyle = '#ff6b5b'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(L, Y(99.99)); ctx.lineTo(R, Y(99.99)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#ff6b5b'; ctx.textAlign = 'left'; ctx.fillText('MAP $99.99', L + 8, Y(99.99) - 7);
    const leg = [['#8fa5f5', 'FLYGUY FITNESS INC. - List price', false], ['#2f4fd6', 'FLYGUY FITNESS INC. - Landed cost', true], ['#ff6b5b', 'MAP (brand rule)', true]];
    let x = L + 40; const ly = 16; ctx.font = '12px Arial'; ctx.textAlign = 'left';
    leg.forEach(([col, txt, d]) => { ctx.fillStyle = d ? '#fff' : col; ctx.strokeStyle = col; if (d) ctx.setLineDash([3, 2]); ctx.fillRect(x, ly - 9, 30, 12); ctx.strokeRect(x, ly - 9, 30, 12); ctx.setLineDash([]); ctx.fillStyle = '#4b5563'; ctx.fillText(txt, x + 36, ly + 1); x += ctx.measureText(txt).width + 58; });
    return 'chart drawn';
  };

  window.__section = (heading, up = 4) => {
    const t = [...document.querySelectorAll('*')].find((e) => e.children.length === 0 && e.textContent.trim() === heading);
    let el = t; for (let i = 0; i < up && el; i++) el = el.parentElement; return el;
  };
  return 'admin helpers ready';
})();
