/* ============================================
   ENCODIUS - Animations
   GSAP Loader, Hero, Scroll-triggered Animations
   ============================================ */

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
// HERO ANIMATIONS
// ============================================
function initHeroAnimations() {
    // Parallax effect on mouse move
    const hero = document.querySelector('.hero');
    const shapes = document.querySelectorAll('.floating-shape');
    const codeWindow = document.querySelector('.code-window');

    if (!hero) return;

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
        if (codeWindow) {
            gsap.to(codeWindow, {
                rotateY: xPercent * 5,
                rotateX: -yPercent * 5,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    });

    // Reset on mouse leave
    hero.addEventListener('mouseleave', () => {
        gsap.to(shapes, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
        });

        if (codeWindow) {
            gsap.to(codeWindow, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.8,
                ease: 'power2.out'
            });
        }
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

    if (!codeLines.length) return;

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
        const number = card.querySelector('.value-card__number');
        if (number) {
            gsap.from(number, {
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
        }
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

// Expose functions globally
window.initLoader = initLoader;
window.initHeroAnimations = initHeroAnimations;
window.initFloatingShapes = initFloatingShapes;
window.initCodeWindowAnimation = initCodeWindowAnimation;
window.initScrollAnimations = initScrollAnimations;
