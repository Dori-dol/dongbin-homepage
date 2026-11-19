(function () {
  var els = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach(function (e) { e.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (list) {
      list.forEach(function (x) {
        if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var text = b.getAttribute("data-copy"), label = b.textContent;
      var p = navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject();
      p.catch(function () {
        var a = document.createElement("textarea");
        a.value = text; document.body.appendChild(a); a.select();
        try { document.execCommand("copy"); } catch (e) {}
        a.remove();
      }).then(function () {
        b.textContent = "복사되었습니다";
        setTimeout(function () { b.textContent = label; }, 2000);
      });
    });
  });
})();

/* 히어로 경혈 라인: 마우스(터치)가 가까워지면 경혈 위치가 드러남 */
(function () {
  var host = document.getElementById("meridian");
  if (!host) return;
  var hero = host.parentNode, NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ▼ d: 히어로 영역 비율(0~1) 좌표의 곡선 / at: 곡선을 따라 경혈이 놓일 위치(0~1) ▼ */
  var MERIDIANS = [
    { d: "M.70 -.10 C.62 .20 .84 .35 .76 .60 S.66 .85 .74 1.10", at: [.12, .3, .5, .7, .88] },
    { d: "M.88 -.10 C.80 .20 .94 .40 .87 .62 S.82 .86 .90 1.10", at: [.15, .38, .6, .82] },
    { d: "M.56 -.05 C.50 .25 .64 .50 .59 .75 S.56 .95 .62 1.10", at: [.2, .5, .8] }
  ];
  /* ▲ 여기까지 ▲ */

  var fig, paths = [], dots = [], raf = 0, mx = 0, my = 0, hover = false, bw = 0, bh = 0;

  function el(n, a, p) {
    var e = document.createElementNS(NS, n);
    for (var k in a) e.setAttribute(k, a[k]);
    if (p) p.appendChild(e);
    return e;
  }
  function scale(d, w, h) {
    var i = 0;
    return d.replace(/-?\d*\.?\d+/g, function (n) { return (i++ % 2 === 0 ? n * w : n * h).toFixed(1); });
  }

  function build() {
    var w = bw = host.clientWidth, h = bh = host.clientHeight, delay = 0;
    if (!w || !h) return;
    host.textContent = ""; paths = []; dots = [];
    var svg = el("svg", { width: w, height: h, viewBox: "0 0 " + w + " " + h, focusable: "false" }, host);
    fig = el("g", { "class": "fig" }, svg);
    MERIDIANS.forEach(function (m) {
      delay += 0.25;
      var path = el("path", { "class": "ml", d: scale(m.d, w, h), pathLength: 1, style: "animation-delay:" + delay.toFixed(2) + "s" }, fig);
      var item = { path: path, dots: [] }, len = path.getTotalLength();
      m.at.forEach(function (t) {
        var p = path.getPointAtLength(len * t);
        var g = el("g", { "class": "pt" }, fig);
        var halo = el("circle", { "class": "halo", cx: p.x, cy: p.y, r: 4 }, g);
        var core = el("circle", { "class": "core", cx: p.x, cy: p.y, r: 2.2, style: "animation-delay:" + (Math.random() * 3).toFixed(1) + "s" }, g);
        var d = { x: p.x, y: p.y, halo: halo, core: core };
        dots.push(d); item.dots.push(d);
      });
      paths.push(item);
    });
  }

  function update() {
    raf = 0;
    var r = host.getBoundingClientRect();
    var nx = (mx - r.left) / r.width - 0.5, ny = (my - r.top) / r.height - 0.5;
    var tx = hover ? nx * -12 : 0, ty = hover ? ny * -8 : 0;
    fig.style.transform = "translate(" + tx + "px," + ty + "px)";
    var px = mx - r.left - tx, py = my - r.top - ty;
    paths.forEach(function (m) {
      var best = 0;
      m.dots.forEach(function (d) {
        var t = hover ? Math.max(0, 1 - Math.hypot(d.x - px, d.y - py) / 170) : 0;
        t = t * t * (3 - 2 * t);
        d.halo.setAttribute("r", 4 + 14 * t);
        d.halo.style.opacity = 0.08 + 0.5 * t;
        d.core.setAttribute("r", 2.2 + 1.4 * t);
        d.core.style.opacity = 0.5 + 0.5 * t;
        if (t > best) best = t;
      });
      m.path.style.strokeOpacity = 0.3 + 0.45 * best;
    });
  }
  function ask() { if (!raf && fig) raf = requestAnimationFrame(update); }

  build();
  if (reduce) return;
  setTimeout(function () { host.classList.add("ready"); }, 4500);

  hero.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; hover = true; ask(); });
  hero.addEventListener("mouseleave", function () { hover = false; ask(); });
  hero.addEventListener("touchmove", function (e) { var t = e.touches[0]; mx = t.clientX; my = t.clientY; hover = true; ask(); }, { passive: true });
  hero.addEventListener("touchend", function () { hover = false; ask(); }, { passive: true });

  function resized() {
    if (Math.abs(host.clientWidth - bw) > 40 || Math.abs(host.clientHeight - bh) > 40) { build(); ask(); }
  }
  if (window.ResizeObserver) new ResizeObserver(resized).observe(host);
  else window.addEventListener("resize", resized);
})();

/* 왼쪽 페이지 위치 표시: 스크롤하면 현재 구간의 점이 커짐 */
(function () {
  var secs = document.querySelectorAll("[data-nav]");
  if (secs.length < 2) return;
  var rail = document.createElement("nav"), cnt = document.createElement("div"),
      box = document.createElement("div"), bar = document.createElement("i"),
      list = document.createElement("ul"), links = [], cur = -1;
  rail.className = "rail"; rail.setAttribute("aria-label", "페이지 위치");
  cnt.className = "cnt"; box.className = "lst";
  box.appendChild(bar); box.appendChild(list); rail.appendChild(cnt); rail.appendChild(box);
  Array.prototype.forEach.call(secs, function (s) {
    var li = document.createElement("li"), a = document.createElement("a");
    a.href = "#"; a.setAttribute("aria-label", s.getAttribute("data-nav"));
    a.innerHTML = "<b></b><em></em>"; a.lastChild.textContent = s.getAttribute("data-nav");
    a.addEventListener("click", function (e) { e.preventDefault(); s.scrollIntoView({ behavior: "smooth", block: "start" }); });
    li.appendChild(a); list.appendChild(li); links.push(a);
  });
  document.body.appendChild(rail);
  function set(i) {
    if (i === cur) return;
    cur = i;
    links.forEach(function (a, k) { a.classList.toggle("on", k === i); });
    rail.style.setProperty("--p", i / (links.length - 1));
    cnt.innerHTML = "0" + (i + 1) + "<small>/0" + links.length + "</small>";
    rail.classList.toggle("dark", secs[i].hasAttribute("data-dark"));
  }
  set(0);
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) set(Array.prototype.indexOf.call(secs, e.target)); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Array.prototype.forEach.call(secs, function (s) { io.observe(s); });
  }
})();

/* 한약 가감 시각화: 몸 상태 카드에 마우스를 올리거나 누르면 해당 약재가 굵게 표시됨 + 처음 한 번 파동 */
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  Array.prototype.forEach.call(document.querySelectorAll("[data-hviz]"), function (v) {
    var cards = Array.prototype.slice.call(v.querySelectorAll(".pat")),
        gs = Array.prototype.slice.call(v.querySelectorAll(".addg")), touched = false;
    function sel(i) {
      cards.forEach(function (c, k) { c.classList.toggle("on", k === i); c.setAttribute("aria-pressed", k === i ? "true" : "false"); });
      gs.forEach(function (g, k) { g.classList.toggle("on", k === i); });
    }
    function stop() {
      if (touched) return;
      touched = true;
      cards.forEach(function (c) { c.classList.remove("pulse"); });
    }
    cards.forEach(function (c, k) {
      c.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { stop(); sel(k); } });
      c.addEventListener("click", function () { stop(); sel(k); });
      c.addEventListener("focus", function () { stop(); sel(k); });
    });
    if (!reduce && "IntersectionObserver" in window && cards[1]) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { if (!touched) cards[1].classList.add("pulse"); io.disconnect(); }
        });
      }, { threshold: 0.7 });
      io.observe(v.querySelector(".pats"));
    }
  });
})();
