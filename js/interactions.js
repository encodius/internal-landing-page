/* ============================================
   ENCODIUS - Interactions
   Header scroll state, product tabs
   ============================================ */

function initHeaderScrollState() {
    const header = document.getElementById('header');
    if (!header) return;

    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ============================================
   HOW IT WORKS — autoplaying step tabs + crossfade media
   ============================================ */
function initHowItWorks() {
    const steps = document.querySelectorAll('[data-how-step]');
    const images = document.querySelectorAll('[data-how-image]');
    if (!steps.length || !images.length) return;

    let timer = null;

    function select(index) {
        steps.forEach(step => {
            step.classList.toggle('is-active', Number(step.getAttribute('data-how-step')) === index);
        });
        images.forEach(img => {
            img.classList.toggle('is-active', Number(img.getAttribute('data-how-image')) === index);
        });
    }

    function startAutoplay() {
        clearInterval(timer);
        timer = setInterval(() => {
            const active = document.querySelector('[data-how-step].is-active');
            const current = active ? Number(active.getAttribute('data-how-step')) : 0;
            select((current + 1) % steps.length);
        }, 4500);
    }

    steps.forEach(step => {
        step.addEventListener('click', () => {
            select(Number(step.getAttribute('data-how-step')));
            startAutoplay();
        });
    });

    // Don't start the carousel until the section actually scrolls into view —
    // otherwise it's already several steps in by the time the user gets there.
    const section = steps[0].closest('section');
    if (!section || !('IntersectionObserver' in window)) {
        startAutoplay();
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            startAutoplay();
            observer.disconnect();
        });
    }, { threshold: 0.3 });
    observer.observe(section);
}
