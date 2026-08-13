/* ============================================
   ENCODIUS - Animations
   Scroll-reveal via IntersectionObserver
   ============================================ */

function initScrollReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        items.forEach(el => el.classList.add('is-revealed'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const delay = Number(el.getAttribute('data-reveal-delay')) || 0;
            setTimeout(() => el.classList.add('is-revealed'), delay);
            observer.unobserve(el);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    items.forEach(el => observer.observe(el));
}

function initStatCounters() {
    const stats = document.querySelectorAll('[data-count-to]');
    if (!stats.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count-to'), 10);
            const suffix = el.getAttribute('data-count-suffix') || '';
            if (!target) return;
            observer.unobserve(el);

            const duration = 900;
            const start = performance.now();

            function step(now) {
                const progress = Math.min(1, (now - start) / duration);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            }

            el.textContent = '0' + suffix;
            requestAnimationFrame(step);
        });
    }, { threshold: 0.4 });

    stats.forEach(el => observer.observe(el));
}
