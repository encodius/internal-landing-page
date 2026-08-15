/* ============================================
   ENCODIUS - App Core
   Initialization, Navigation, Language, Contact Form
   ============================================ */

// Mark JS as available so CSS can hide [data-reveal] only when it will actually be revealed
document.documentElement.classList.add('js');

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
    initFooter();
    initSmoothScroll();
    initScrollTopTrigger();
    initHeaderScrollState();
    initContactForm();
    initHowItWorks();
    initLanguage();
    initScrollReveal();
});

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

    const titleKey = document.body.getAttribute('data-i18n-title');
    if (titleKey) {
        const translation = window.translations?.[lang]?.[titleKey];
        if (translation) document.title = translation;
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

        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            const result = await response.json();

            if (result.success) {
                formStatus.textContent = "Message sent successfully! We'll get back to you soon.";
                formStatus.className = 'form-status success';
                form.reset();
            } else {
                throw new Error(result.message || 'Failed to send');
            }
        } catch (error) {
            formStatus.textContent = 'Something went wrong. Please try again or email us directly.';
            formStatus.className = 'form-status error';
        }

        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;

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
