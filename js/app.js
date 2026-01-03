/* ============================================
   ENCODIUS - App Core
   Initialization, Navigation, Theme, Language, Form
   ============================================ */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ============================================
// THEME - Initialize before DOM to prevent flash
// ============================================
(function initThemeEarly() {
    const savedTheme = localStorage.getItem('encodius-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'dark'); // Default to dark

    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }
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
    // Use requestAnimationFrame to avoid blocking initial paint
    requestAnimationFrame(() => {
        // Core features - non-visual first
        initFooter();
        initSmoothScroll();
        initNavigation();
        initContactForm();

        // Language and theme after a frame to avoid reflow
        requestAnimationFrame(() => {
            initLanguage();
            initTheme();

            // Animations (from animations.js)
            initLoader();
            initHeroAnimations();
            initScrollAnimations();
            initCodeWindowAnimation();

            // Interactions (from interactions.js)
            initInteractions();
        });
    });
});

// ============================================
// LANGUAGE TOGGLE
// ============================================
function initLanguage() {
    const langToggle = document.getElementById('lang-toggle');
    const langText = langToggle?.querySelector('.lang-toggle__text');
    if (!langToggle || !langText) return;

    // Get current language
    let currentLang = localStorage.getItem('encodius-lang') || 'en';

    // Update button text
    langText.textContent = currentLang.toUpperCase();

    // Apply translations on load
    applyTranslations(currentLang);

    langToggle.addEventListener('click', () => {
        // Toggle language
        currentLang = currentLang === 'en' ? 'sr' : 'en';

        // Save preference
        localStorage.setItem('encodius-lang', currentLang);
        document.documentElement.setAttribute('lang', currentLang);

        // Animate button
        gsap.to(langToggle, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });

        // Animate text change
        gsap.to(langText, {
            opacity: 0,
            y: -10,
            duration: 0.15,
            ease: 'power2.in',
            onComplete: () => {
                langText.textContent = currentLang.toUpperCase();
                gsap.fromTo(langText,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }
                );
            }
        });

        // Apply translations with animation
        applyTranslations(currentLang, true);
    });
}

function applyTranslations(lang, animate = false) {
    const elements = document.querySelectorAll('[data-i18n]');
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');

    // Batch all reads first to avoid forced reflow
    const elementData = [];
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = window.translations?.[lang]?.[key];
        if (translation) {
            elementData.push({ el, translation });
        }
    });

    const placeholderData = [];
    placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = window.translations?.[lang]?.[key];
        if (translation) {
            placeholderData.push({ el, translation });
        }
    });

    // Now perform all writes
    if (animate) {
        elementData.forEach(({ el, translation }) => {
            gsap.to(el, {
                opacity: 0,
                y: -5,
                duration: 0.15,
                ease: 'power2.in',
                onComplete: () => {
                    el.textContent = translation;
                    gsap.to(el, {
                        opacity: 1,
                        y: 0,
                        duration: 0.15,
                        ease: 'power2.out'
                    });
                }
            });
        });
    } else {
        elementData.forEach(({ el, translation }) => {
            el.textContent = translation;
        });
    }

    placeholderData.forEach(({ el, translation }) => {
        el.setAttribute('placeholder', translation);
    });

    // Update page title
    const titles = {
        en: 'Encodius | Fintech & Software Engineering Experts',
        sr: 'Encodius | Fintech i Softverski Inženjering Eksperti'
    };
    document.title = titles[lang] || titles.en;
}

// ============================================
// THEME TOGGLE
// ============================================
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('encodius-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('encodius-theme', 'dark');
        }

        // Animate the toggle button
        gsap.to(themeToggle, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });

        // Animate icon rotation
        const activeIcon = isDark ? themeToggle.querySelector('.icon-sun') : themeToggle.querySelector('.icon-moon');
        if (activeIcon) {
            gsap.fromTo(activeIcon,
                { rotate: -30, scale: 0.5 },
                { rotate: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
            );
        }
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('encodius-theme')) {
            if (e.matches) {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        }
    });
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMobile = document.getElementById('nav-mobile');
    const navMobileClose = document.getElementById('nav-mobile-close');
    const navBackdrop = document.getElementById('nav-backdrop');

    if (!navMobile) return;

    const navMobileLinks = navMobile.querySelectorAll('.nav__link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });

    // Helper to close menu
    function closeMenu() {
        navMobile.classList.remove('active');
        navBackdrop?.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Helper to open menu
    function openMenu() {
        navMobile.classList.add('active');
        navBackdrop?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Open menu on hamburger click
    navToggle?.addEventListener('click', openMenu);

    // Close menu on close button click
    navMobileClose?.addEventListener('click', closeMenu);

    // Close menu on backdrop click
    navBackdrop?.addEventListener('click', closeMenu);

    // Close menu on link click
    navMobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
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
        const originalText = submitBtn.innerHTML;

        // Loading state
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();

            if (result.success) {
                formStatus.textContent = 'Message sent successfully! We\'ll get back to you soon.';
                formStatus.className = 'form-status success';
                form.reset();

                // Animate success
                gsap.from(formStatus, {
                    opacity: 0,
                    y: 20,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            } else {
                throw new Error(result.message || 'Failed to send');
            }
        } catch (error) {
            formStatus.textContent = 'Something went wrong. Please try again or email us directly.';
            formStatus.className = 'form-status error';

            gsap.from(formStatus, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: 'power2.out'
            });
        }

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Hide status after 5 seconds
        setTimeout(() => {
            gsap.to(formStatus, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    formStatus.className = 'form-status';
                    formStatus.style.opacity = '';
                }
            });
        }, 5000);
    });

    // Input focus animations
    const inputs = form.querySelectorAll('.form-input');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        input.addEventListener('blur', () => {
            gsap.to(input, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// ============================================
// FOOTER
// ============================================
function initFooter() {
    // Set current year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
