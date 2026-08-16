/* ============================================
   ENCODIUS - App Core
   Initialization, Navigation, Language, Contact Form
   ============================================ */

// Mark JS as available so CSS can hide [data-reveal] only when it will actually be revealed
document.documentElement.classList.add('js');

// Direct file previews do not have a web server to resolve root-relative routes.
// Derive the project root from this script so those links can point to the
// corresponding local index files without changing production URLs.
const filePreviewRoot = (() => {
    if (window.location.protocol !== 'file:' || !document.currentScript?.src) return null;
    return new URL('../', document.currentScript.src);
})();

// ============================================
// LANGUAGE - Initialize before DOM to prevent flash
// ============================================
(function initLanguageEarly() {
    const savedLang = localStorage.getItem('encodius-lang') || 'en';
    document.documentElement.setAttribute('lang', savedLang);
})();

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initFilePreviewLinks();
    initFooter();
    initSmoothScroll();
    initScrollTopTrigger();
    initMobileNavigation();
    initHeaderScrollState();
    initContactForm();
    initHowItWorks();
    initLanguage();
    initScrollReveal();
});

// ============================================
// LOCAL FILE PREVIEW
// ============================================
function initFilePreviewLinks() {
    if (!filePreviewRoot) return;

    document.querySelectorAll('a[href^="/"]').forEach(link => {
        const publicUrl = new URL(link.getAttribute('href'), 'https://encodius.com');
        let localPath = publicUrl.pathname.replace(/^\/+/, '');

        if (!localPath || localPath.endsWith('/')) {
            localPath += 'index.html';
        }

        const localUrl = new URL(localPath, filePreviewRoot);
        localUrl.search = publicUrl.search;
        localUrl.hash = publicUrl.hash;
        link.href = localUrl.href;
    });
}

// ============================================
// LANGUAGE TOGGLE (EN / SR)
// ============================================
function initLanguage() {
    const buttons = document.querySelectorAll('[data-lang-btn]');
    if (!buttons.length) return;

    let currentLang = localStorage.getItem('encodius-lang') || 'en';

    function updateButtons(lang) {
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === lang);
        });
    }

    updateButtons(currentLang);
    applyTranslations(currentLang);

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const newLang = btn.getAttribute('data-lang-btn');
            if (newLang === currentLang) return;

            currentLang = newLang;
            localStorage.setItem('encodius-lang', currentLang);
            document.documentElement.setAttribute('lang', currentLang);
            updateButtons(currentLang);
            applyTranslations(currentLang);
        });
    });
}

function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    const ariaLabels = document.querySelectorAll('[data-i18n-aria-label]');

    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = window.translations?.[lang]?.[key];
        if (translation) el.textContent = translation;
    });

    placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = window.translations?.[lang]?.[key];
        if (translation) el.setAttribute('placeholder', translation);
    });

    ariaLabels.forEach(el => {
        const key = el.getAttribute('data-i18n-aria-label');
        const translation = window.translations?.[lang]?.[key];
        if (translation) el.setAttribute('aria-label', translation);
    });

    const titleKey = document.body.getAttribute('data-i18n-title');
    if (titleKey) {
        const translation = window.translations?.[lang]?.[titleKey];
        if (translation) document.title = translation;
    }
}

function getTranslation(key, fallback) {
    const lang = document.documentElement.getAttribute('lang') || 'en';
    return window.translations?.[lang]?.[key] || fallback;
}

// ============================================
// MOBILE NAVIGATION
// ============================================
function initMobileNavigation() {
    const header = document.getElementById('header');
    const toggle = header?.querySelector('.nav__menu-toggle');
    const menu = header?.querySelector('.nav__links');

    if (!header || !toggle || !menu) return;

    const desktopQuery = window.matchMedia('(min-width: 769px)');
    const mobileCta = menu.querySelector('.nav__mobile-cta');

    function setOpen(isOpen, returnFocus = false) {
        header.classList.toggle('menu-open', isOpen);
        document.body.classList.toggle('nav-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));

        const labelKey = isOpen ? 'nav.menuClose' : 'nav.menuOpen';
        toggle.setAttribute('data-i18n-aria-label', labelKey);
        toggle.setAttribute('aria-label', getTranslation(labelKey, isOpen ? 'Close menu' : 'Open menu'));

        if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', () => {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setOpen(false));
    });

    header.querySelector('.nav__logo')?.addEventListener('click', () => setOpen(false));

    document.addEventListener('click', (event) => {
        if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) {
            setOpen(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            setOpen(false, true);
        }
    });

    const syncViewport = (event) => {
        const isDesktop = event.matches;
        toggle.hidden = isDesktop;
        if (mobileCta) mobileCta.hidden = isDesktop;
        if (isDesktop) setOpen(false);
    };

    syncViewport(desktopQuery);

    if (desktopQuery.addEventListener) {
        desktopQuery.addEventListener('change', syncViewport);
    } else {
        desktopQuery.addListener(syncViewport);
    }
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;

        submitBtn.innerHTML = `<span>${getTranslation('contact.form.sending', 'Sending...')}</span>`;
        submitBtn.disabled = true;
        form.setAttribute('aria-busy', 'true');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            const result = await response.json();

            if (result.success) {
                formStatus.textContent = getTranslation('contact.form.success', "Message sent successfully. We'll get back to you soon.");
                formStatus.className = 'form-status success';
                form.reset();
            } else {
                throw new Error(result.message || 'Failed to send');
            }
        } catch (error) {
            formStatus.textContent = getTranslation('contact.form.error', 'Something went wrong. Please try again or email us directly.');
            formStatus.className = 'form-status error';
        }

        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        form.removeAttribute('aria-busy');
        applyTranslations(document.documentElement.getAttribute('lang') || 'en');

        setTimeout(() => {
            formStatus.className = 'form-status';
        }, 6000);
    });
}

// ============================================
// FOOTER
// ============================================
function initFooter() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ============================================
// SCROLL TO TOP (header logo)
// ============================================
function initScrollTopTrigger() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.querySelectorAll('[data-scroll-top]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: reduceMotion.matches ? 'auto' : 'smooth'
            });
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();
            const headerOffset = 88;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        });
    });
}
