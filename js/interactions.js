/* ============================================
   ENCODIUS - Interactions
   Mobile nav, header scroll state, product tabs
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

function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMobile = document.getElementById('nav-mobile');
    const navMobileClose = document.getElementById('nav-mobile-close');
    const navBackdrop = document.getElementById('nav-backdrop');

    if (!navMobile) return;

    const navMobileLinks = navMobile.querySelectorAll('a');

    function closeMenu() {
        navMobile.classList.remove('active');
        navBackdrop?.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openMenu() {
        navMobile.classList.add('active');
        navBackdrop?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    navToggle?.addEventListener('click', openMenu);
    navMobileClose?.addEventListener('click', closeMenu);
    navBackdrop?.addEventListener('click', closeMenu);
    navMobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
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

    startAutoplay();
}
