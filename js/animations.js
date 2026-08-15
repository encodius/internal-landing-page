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
