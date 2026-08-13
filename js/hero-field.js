/* ============================================
   ENCODIUS - Hero Field
   Animated node network behind the hero section:
   drifting nodes, hairline links, travelling packets.
   Canvas, DPR-aware, pointer-reactive, scroll-parallaxed,
   skipped for reduced-motion.
   ============================================ */
(function () {
    var INK = "12, 16, 23";
    var ACCENT = "43, 79, 209";

    function init() {
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        var sec = document.querySelector("section");
        if (!sec || sec.hasAttribute("data-hero-field")) return;
        sec.setAttribute("data-hero-field", "");

        sec.style.position = "relative";
        Array.prototype.forEach.call(sec.children, function (c) {
            if (getComputedStyle(c).position === "static") c.style.position = "relative";
            c.style.zIndex = "1";
        });

        var mask = "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 52%, rgba(0,0,0,0) 86%)";
        var cv = document.createElement("canvas");
        cv.setAttribute("aria-hidden", "true");
        cv.style.position = "absolute";
        cv.style.top = "-68px";
        cv.style.left = "50%";
        cv.style.zIndex = "0";
        cv.style.pointerEvents = "none";
        cv.style.maskImage = mask;
        cv.style.webkitMaskImage = mask;
        sec.insertBefore(cv, sec.firstChild);

        var ctx = cv.getContext("2d");
        var W = 0, H = 0, dpr = 1, nodes = [], packets = [], linkDist = 160;
        var pointer = { x: -9999, y: -9999, active: false };
        var par = { mx: 0, my: 0, tx: 0, ty: 0 };
        var lastSpawn = 0;

        function size() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = window.innerWidth;
            H = Math.max(420, Math.min(sec.offsetHeight + 68, 940));
            cv.style.width = W + "px";
            cv.style.height = H + "px";
            cv.style.transform = "translateX(-50%)";
            cv.width = Math.round(W * dpr);
            cv.height = Math.round(H * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            linkDist = W < 900 ? 140 : 168;
            build();
        }

        function build() {
            var n = Math.max(26, Math.min(58, Math.round(W / 32)));
            nodes = [];
            for (var i = 0; i < n; i++) {
                nodes.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.16,
                    vy: (Math.random() - 0.5) * 0.16,
                    r: Math.random() < 0.14 ? 2.4 : 1.5,
                    hot: Math.random() < 0.14
                });
            }
            packets = [];
        }

        function spawn() {
            if (nodes.length < 2) return;
            for (var t = 0; t < 12; t++) {
                var a = nodes[(Math.random() * nodes.length) | 0];
                var b = nodes[(Math.random() * nodes.length) | 0];
                if (a === b) continue;
                var d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d > linkDist * 1.15 || d < 40) continue;
                packets.push({ a: a, b: b, t: 0, dur: 900 + Math.random() * 700 });
                return;
            }
        }

        function frame(now) {
            requestAnimationFrame(frame);
            var scrolled = window.scrollY || 0;
            var vis = Math.max(0, Math.min(1, 1 - scrolled / (H * 0.85)));
            cv.style.opacity = String(vis);
            if (vis < 0.02) return;

            par.tx += (par.mx - par.tx) * 0.06;
            par.ty += (par.my - par.ty) * 0.06;

            ctx.clearRect(0, 0, W, H);
            ctx.save();
            ctx.translate(par.tx - scrolled * 0.07, par.ty - scrolled * 0.13);

            var i, j, a, b, d, alpha;
            for (i = 0; i < nodes.length; i++) {
                a = nodes[i];
                a.x += a.vx; a.y += a.vy;
                if (a.x < -20) a.x = W + 20; else if (a.x > W + 20) a.x = -20;
                if (a.y < -20) a.y = H + 20; else if (a.y > H + 20) a.y = -20;
            }

            ctx.lineWidth = 1;
            for (i = 0; i < nodes.length; i++) {
                a = nodes[i];
                for (j = i + 1; j < nodes.length; j++) {
                    b = nodes[j];
                    d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (d > linkDist) continue;
                    alpha = (1 - d / linkDist) * 0.11;
                    ctx.strokeStyle = "rgba(" + INK + "," + alpha.toFixed(3) + ")";
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            if (pointer.active) {
                var px = pointer.x - (par.tx - scrolled * 0.07);
                var py = pointer.y - (par.ty - scrolled * 0.13);
                for (i = 0; i < nodes.length; i++) {
                    a = nodes[i];
                    d = Math.hypot(a.x - px, a.y - py);
                    if (d > 200) continue;
                    alpha = (1 - d / 200) * 0.3;
                    ctx.strokeStyle = "rgba(" + ACCENT + "," + alpha.toFixed(3) + ")";
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(px, py);
                    ctx.stroke();
                }
            }

            for (i = 0; i < nodes.length; i++) {
                a = nodes[i];
                ctx.fillStyle = a.hot ? "rgba(" + ACCENT + ",0.42)" : "rgba(" + INK + ",0.2)";
                ctx.beginPath();
                ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
                ctx.fill();
            }

            if (now - lastSpawn > 780) { lastSpawn = now; spawn(); }
            for (i = packets.length - 1; i >= 0; i--) {
                var p = packets[i];
                p.t += 16.7 / p.dur;
                if (p.t >= 1) { packets.splice(i, 1); continue; }
                var e = p.t < 0.5 ? 2 * p.t * p.t : 1 - Math.pow(-2 * p.t + 2, 2) / 2;
                var x = p.a.x + (p.b.x - p.a.x) * e;
                var y = p.a.y + (p.b.y - p.a.y) * e;
                var tail = Math.max(0, e - 0.16);
                var fade = Math.sin(Math.PI * p.t);
                ctx.strokeStyle = "rgba(" + ACCENT + "," + (0.34 * fade).toFixed(3) + ")";
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.moveTo(p.a.x + (p.b.x - p.a.x) * tail, p.a.y + (p.b.y - p.a.y) * tail);
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.fillStyle = "rgba(" + ACCENT + "," + (0.75 * fade).toFixed(3) + ")";
                ctx.beginPath();
                ctx.arc(x, y, 2.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.lineWidth = 1;
            }

            ctx.restore();
        }

        window.addEventListener("resize", function () { size(); }, { passive: true });
        window.addEventListener("mousemove", function (e) {
            var r = cv.getBoundingClientRect();
            pointer.x = e.clientX - r.left;
            pointer.y = e.clientY - r.top;
            pointer.active = pointer.y > -40 && pointer.y < H + 40;
            par.mx = (e.clientX / window.innerWidth - 0.5) * -22;
            par.my = (pointer.y / H - 0.5) * -12;
        }, { passive: true });
        window.addEventListener("mouseleave", function () { pointer.active = false; }, { passive: true });

        size();
        requestAnimationFrame(frame);

        // Parallax inside the hero screenshot frame, when present (home page)
        var plate = document.querySelector('img[src*="corellis-hero"]');
        if (plate) {
            plate.style.willChange = "transform";
            var onScroll = function () {
                var p = Math.max(-34, Math.min(0, -(window.scrollY || 0) * 0.075));
                plate.style.transform = "translateY(" + p.toFixed(2) + "px) scale(1.06)";
            };
            window.addEventListener("scroll", onScroll, { passive: true });
            onScroll();
        }
    }

    window.ENCODIUS_FIELD = { init: init };
})();
