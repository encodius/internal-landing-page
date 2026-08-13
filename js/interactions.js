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
   PRODUCT SCREENSHOT TABS (Correlis page)
   ============================================ */
function initShotTabs() {
    const tabs = document.querySelectorAll('[data-shot-tab]');
    const image = document.querySelector('[data-shot-image]');
    const caption = document.getElementById('shot-caption');
    if (!tabs.length || !image) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const src = tab.getAttribute('data-shot-src');
            const alt = tab.getAttribute('data-shot-alt') || '';
            const key = tab.getAttribute('data-shot-key');

            image.style.transition = 'opacity 0.32s ease';
            image.style.opacity = '0';
            setTimeout(() => {
                image.src = src;
                image.alt = alt;
                if (caption && key) {
                    caption.setAttribute('data-i18n', key);
                    const lang = localStorage.getItem('encodius-lang') || 'en';
                    const translation = window.translations?.[lang]?.[key];
                    if (translation) caption.textContent = translation;
                }
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    image.style.opacity = '1';
                }));
            }, 160);
        });
    });
}
