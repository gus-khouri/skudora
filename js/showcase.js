/* Homepage screenshot cover flow. */
(function () {
  var root = document.querySelector('.showcase');
  if (!root) return;

  var stage = root.querySelector('.showcase-stage');
  var slides = Array.prototype.slice.call(root.querySelectorAll('.showcase-slide'));
  var caption = root.querySelector('.showcase-caption');
  var dotsWrap = root.querySelector('.showcase-dots');
  var lightbox = root.querySelector('.showcase-lightbox');
  var lbImg = lightbox.querySelector('img');
  // The page wrapper is transformed, which would trap a fixed overlay, so the lightbox lives on <body>.
  document.body.appendChild(lightbox);
  var n = slides.length;
  var current = 0;
  var timer = null;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var dots = slides.map(function (s, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'showcase-dot';
    b.setAttribute('aria-label', 'Show screenshot ' + (i + 1) + ' of ' + n);
    b.addEventListener('click', function () { stop(); go(i); });
    dotsWrap.appendChild(b);
    return b;
  });

  function box() {
    var vw = window.innerWidth;
    var h = vw <= 480 ? 340 : vw <= 768 ? 380 : 440;
    var maxW = Math.min(vw <= 768 ? vw * 0.86 : vw * 0.62, 680);
    return { h: h, maxW: maxW };
  }

  function sizeOf(s, b) {
    var r = s.dataset.w / s.dataset.h;
    var h = b.h, w = h * r;
    if (w > b.maxW) { w = b.maxW; h = w / r; }
    return { w: w, h: h };
  }

  function layout() {
    var b = box();
    var mobile = window.innerWidth <= 768;
    var sideScale = mobile ? 0.72 : 0.78;
    var angle = mobile ? 40 : 34;
    var sizes = slides.map(function (s) { return sizeOf(s, b); });
    // On phones the stage shrinks to the active slide so wide screenshots don't leave a gap.
    var stageH = mobile ? Math.max(sizes[current].h, 160) : b.h;
    stage.style.setProperty('--sc-h', stageH + 'px');

    // Place neighbours outward from the centre slide, each partly tucked behind the one before.
    var offsets = {};
    offsets[current] = 0;
    [1, -1].forEach(function (dir) {
      var x = sizes[current].w / 2;
      for (var k = 1; k <= 3; k++) {
        var i = (current + dir * k + n) % n;
        var w = sizes[i].w * sideScale;
        var visible = k === 1 ? 0.42 : 0.2;
        x += (k === 1 ? 24 : 0) + w * visible;
        offsets[i] = dir * x;
        x += w * (k === 1 ? 0.08 : 0.02);
      }
    });

    slides.forEach(function (s, i) {
      var d = i - current;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      var sz = sizes[i];
      s.style.width = sz.w + 'px';
      s.style.height = sz.h + 'px';
      var y = (stageH - sz.h) / 2;
      var ad = Math.abs(d);
      var hidden = ad > (mobile ? 1 : 3);
      s.classList.toggle('is-active', d === 0);
      s.classList.toggle('is-side', d !== 0);
      s.classList.toggle('is-hidden', hidden);
      s.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
      s.tabIndex = d === 0 ? 0 : -1;
      var x = offsets[i] !== undefined ? offsets[i] : (d > 0 ? 1 : -1) * window.innerWidth;
      var t = 'translate3d(' + (x - sz.w / 2) + 'px,' + y + 'px,' + (d === 0 ? 0 : -120 - ad * 60) + 'px)';
      if (d !== 0) t += ' rotateY(' + (d > 0 ? -angle : angle) + 'deg) scale(' + sideScale + ')';
      s.style.transform = t;
      s.style.zIndex = String(100 - ad);
      s.style.opacity = hidden ? '0' : d === 0 ? '1' : String(Math.max(0.35, 0.85 - ad * 0.2));
    });

    dots.forEach(function (dt, i) {
      dt.classList.toggle('is-active', i === current);
      dt.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
    var s = slides[current];
    caption.innerHTML = '<strong>' + s.dataset.title + '</strong>' + s.dataset.caption;
  }

  function go(i) { current = (i + n) % n; layout(); }
  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  var interacted = false;
  function start() { if (!reduced && !interacted && !timer) timer = setInterval(next, 5000); }
  // stop() is a visitor choice and ends auto-advance; pause() is temporary (hover, off screen).
  function pause() { clearInterval(timer); timer = null; }
  function stop() { interacted = true; pause(); }

  root.querySelector('.showcase-next').addEventListener('click', function () { stop(); next(); });
  root.querySelector('.showcase-prev').addEventListener('click', function () { stop(); prev(); });

  slides.forEach(function (s, i) {
    s.addEventListener('click', function () {
      stop();
      if (i === current) open(); else go(i);
    });
    s.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { stop(); next(); }
    if (e.key === 'ArrowLeft') { stop(); prev(); }
  });

  // Swipe
  var sx = null, sy = null;
  stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { stop(); dx < 0 ? next() : prev(); swiped = true; setTimeout(function () { swiped = false; }, 350); }
    sx = null;
  });
  var swiped = false;
  stage.addEventListener('click', function (e) { if (swiped) { e.stopPropagation(); e.preventDefault(); } }, true);

  // Lightbox
  function open() {
    var img = slides[current].querySelector('img');
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add('is-open');
    lightbox.querySelector('button').focus({ preventScroll: true });
  }
  function close() { lightbox.classList.remove('is-open'); slides[current].focus({ preventScroll: true }); }
  lightbox.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') { next(); open(); }
    if (e.key === 'ArrowLeft') { prev(); open(); }
  });

  // Pause while hovered or off screen
  root.addEventListener('mouseenter', pause);
  root.addEventListener('mouseleave', start);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : pause(); }, { threshold: 0.4 }).observe(stage);
  } else { start(); }

  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 80); });
  layout();
})();
