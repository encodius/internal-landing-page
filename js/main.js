/* ============================================
   ENCODIUS - Main JavaScript
   GSAP Animations & Interactions
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
    initLanguage();
    initTheme();
    initLoader();
    initNavigation();
    initHeroAnimations();
    initScrollAnimations();
    initFloatingShapes();
    initCodeWindowAnimation();
    initContactForm();
    initFooter();
    initSmoothScroll();
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

    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = window.translations?.[lang]?.[key];

        if (translation) {
            if (animate) {
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
            } else {
                el.textContent = translation;
            }
        }
    });

    // Handle placeholders
    placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = window.translations?.[lang]?.[key];

        if (translation) {
            el.setAttribute('placeholder', translation);
        }
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
        gsap.fromTo(activeIcon,
            { rotate: -30, scale: 0.5 },
            { rotate: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );
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
// PAGE LOADER / INITIAL ANIMATIONS
// ============================================
function initLoader() {
    // Set initial states
    gsap.set('.hero__badge', { opacity: 0, y: 30 });
    gsap.set('.hero__title .title-line', { opacity: 0, y: 80, rotateX: -40 });
    gsap.set('.hero__description', { opacity: 0, y: 40 });
    gsap.set('.hero__actions', { opacity: 0, y: 30 });
    gsap.set('.code-window', { opacity: 0, scale: 0.9, rotateY: -15 });
    gsap.set('.hero__scroll', { opacity: 0 });
    gsap.set('.nav', { opacity: 0, y: -20 });
    gsap.set('.floating-shape', { opacity: 0, scale: 0 });

    // Main entrance timeline
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to('.nav', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    })
    .to('.hero__badge', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
    }, '-=0.4')
    .to('.hero__title .title-line', {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    }, '-=0.3')
    .to('.hero__description', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
    }, '-=0.4')
    .to('.hero__actions', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
    }, '-=0.3')
    .to('.code-window', {
        opacity: 1,
        scale: 1,
        rotateY: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.6')
    .to('.floating-shape', {
        opacity: 0.6,
        scale: 1,
        duration: 0.8,
        stagger: {
            each: 0.1,
            from: 'random'
        },
        ease: 'back.out(1.7)'
    }, '-=0.8')
    .to('.hero__scroll', {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.4');
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ============================================
// HERO ANIMATIONS
// ============================================
function initHeroAnimations() {
    // Parallax effect on mouse move
    const hero = document.querySelector('.hero');
    const shapes = document.querySelectorAll('.floating-shape');
    const codeWindow = document.querySelector('.code-window');

    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xPercent = (clientX / innerWidth - 0.5) * 2;
        const yPercent = (clientY / innerHeight - 0.5) * 2;

        // Move shapes
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 10;
            gsap.to(shape, {
                x: xPercent * speed,
                y: yPercent * speed,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        // Subtle code window movement
        gsap.to(codeWindow, {
            rotateY: xPercent * 5,
            rotateX: -yPercent * 5,
            duration: 0.5,
            ease: 'power2.out'
        });
    });

    // Reset on mouse leave
    hero.addEventListener('mouseleave', () => {
        gsap.to(shapes, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
        });

        gsap.to(codeWindow, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // Glow pulsing animation
    gsap.to('.hero__glow--1', {
        scale: 1.2,
        opacity: 0.3,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to('.hero__glow--2', {
        scale: 1.3,
        opacity: 0.15,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1
    });
}

// ============================================
// FLOATING SHAPES ANIMATION
// ============================================
function initFloatingShapes() {
    const shapes = document.querySelectorAll('.floating-shape');

    shapes.forEach((shape, index) => {
        // Continuous floating animation
        gsap.to(shape, {
            y: 'random(-30, 30)',
            x: 'random(-20, 20)',
            rotation: 'random(-15, 15)',
            duration: 'random(3, 5)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.2
        });
    });
}

// ============================================
// CODE WINDOW ANIMATION
// ============================================
function initCodeWindowAnimation() {
    const codeLines = document.querySelectorAll('.code-window__body code > span');

    // Typing effect simulation with highlighting
    gsap.set(codeLines, { opacity: 0.3 });

    const highlightTimeline = gsap.timeline({ repeat: -1, repeatDelay: 2 });

    codeLines.forEach((line, index) => {
        highlightTimeline.to(line, {
            opacity: 1,
            duration: 0.1,
            ease: 'none'
        }, index * 0.15)
        .to(line, {
            opacity: 0.3,
            duration: 0.3,
            ease: 'power2.out'
        }, (index * 0.15) + 0.8);
    });

    // Subtle glow effect on the code window
    gsap.to('.code-window', {
        boxShadow: '0 0 0 1px rgba(0, 212, 255, 0.2), 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 120px rgba(0, 212, 255, 0.15)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

// ============================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================
function initScrollAnimations() {
    // Services Section
    gsap.from('.services .section-tag', {
        scrollTrigger: {
            trigger: '.services',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power3.out'
    });

    gsap.from('.services .section-title span', {
        scrollTrigger: {
            trigger: '.services .section-title',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 60,
        rotateX: -30,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });

    gsap.from('.services .section-description', {
        scrollTrigger: {
            trigger: '.services .section-description',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        ease: 'power3.out'
    });

    // Service cards - staggered entrance from different directions
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach((card, index) => {
        const direction = index % 2 === 0 ? -1 : 1;

        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            x: direction * 80,
            rotateY: direction * 10,
            duration: 0.8,
            delay: (index % 2) * 0.15,
            ease: 'power3.out'
        });
    });

    // About Section
    gsap.from('.about__content .section-tag', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -50,
        duration: 0.6,
        ease: 'power3.out'
    });

    gsap.from('.about__content .section-title span', {
        scrollTrigger: {
            trigger: '.about .section-title',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -80,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });

    gsap.from('.about__text p', {
        scrollTrigger: {
            trigger: '.about__text',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Value cards - slide in from right with stagger
    const valueCards = document.querySelectorAll('.value-card');

    valueCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            x: 100,
            rotateY: -15,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power3.out'
        });

        // Animate the number
        gsap.from(card.querySelector('.value-card__number'), {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            scale: 0,
            duration: 0.6,
            delay: index * 0.15 + 0.3,
            ease: 'back.out(1.7)'
        });
    });

    // Animate about section lines
    gsap.from('.about__line', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1.5,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Contact Section
    gsap.from('.contact__info .section-tag', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power3.out'
    });

    gsap.from('.contact__info .section-title span', {
        scrollTrigger: {
            trigger: '.contact .section-title',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 60,
        rotateX: -30,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });

    gsap.from('.contact__description', {
        scrollTrigger: {
            trigger: '.contact__description',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power3.out'
    });

    gsap.from('.contact__detail', {
        scrollTrigger: {
            trigger: '.contact__details',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -30,
        duration: 0.6,
        ease: 'power3.out'
    });

    // Contact form animation
    gsap.from('.contact__form-wrapper', {
        scrollTrigger: {
            trigger: '.contact__form-wrapper',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: 100,
        rotateY: -10,
        duration: 1,
        ease: 'power3.out'
    });

    // Form elements stagger
    gsap.from('.form-group', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.3,
        ease: 'power3.out'
    });

    gsap.from('.contact-form .btn', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        scale: 0.9,
        duration: 0.6,
        delay: 0.7,
        ease: 'back.out(1.7)'
    });

    // Footer animation
    gsap.from('.footer__grid > div', {
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
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

            if (response.ok) {
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
                throw new Error('Failed to send');
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

// ============================================
// BUTTON HOVER EFFECTS
// ============================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// ============================================
// SERVICE CARD HOVER EFFECTS
// ============================================
document.querySelectorAll('.service-card').forEach(card => {
    const icon = card.querySelector('.service-card__icon');

    card.addEventListener('mouseenter', () => {
        gsap.to(icon, {
            scale: 1.1,
            rotate: 5,
            duration: 0.4,
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(icon, {
            scale: 1,
            rotate: 0,
            duration: 0.4,
            ease: 'power2.out'
        });
    });
});

// ============================================
// VALUE CARD HOVER EFFECTS
// ============================================
document.querySelectorAll('.value-card').forEach(card => {
    const number = card.querySelector('.value-card__number');

    card.addEventListener('mouseenter', () => {
        gsap.to(number, {
            scale: 1.2,
            opacity: 0.2,
            duration: 0.4,
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(number, {
            scale: 1,
            opacity: 0.1,
            duration: 0.4,
            ease: 'power2.out'
        });
    });
});

// ============================================
// MAGNETIC EFFECT ON CTA BUTTONS
// ============================================
document.querySelectorAll('.btn--primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
    });
});

// ============================================
// SCROLL PROGRESS INDICATOR (Optional - adds to header)
// ============================================
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 2px;
        background: linear-gradient(90deg, #00d4ff, #8b5cf6);
        z-index: 9999;
        transform-origin: left;
        transform: scaleX(0);
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = window.pageYOffset / scrollHeight;
        progressBar.style.transform = `scaleX(${scrollProgress})`;
    });
}

// Initialize scroll progress
initScrollProgress();
