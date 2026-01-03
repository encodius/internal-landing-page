/* ============================================
   ENCODIUS - Interactions
   Hover Effects, Magnetic Buttons, Scroll Progress
   ============================================ */

// ============================================
// BUTTON HOVER EFFECTS
// ============================================
function initButtonHovers() {
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
}

// ============================================
// SERVICE CARD HOVER EFFECTS
// ============================================
function initServiceCardHovers() {
    document.querySelectorAll('.service-card').forEach(card => {
        const icon = card.querySelector('.service-card__icon');

        if (!icon) return;

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
}

// ============================================
// VALUE CARD HOVER EFFECTS
// ============================================
function initValueCardHovers() {
    document.querySelectorAll('.value-card').forEach(card => {
        const number = card.querySelector('.value-card__number');

        if (!number) return;

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
}

// ============================================
// MAGNETIC EFFECT ON CTA BUTTONS
// ============================================
function initMagneticButtons() {
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
}

// ============================================
// SCROLL PROGRESS INDICATOR
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

// ============================================
// INITIALIZE ALL INTERACTIONS
// ============================================
function initInteractions() {
    initButtonHovers();
    initServiceCardHovers();
    initValueCardHovers();
    initMagneticButtons();
    initScrollProgress();
}

// Expose functions globally
window.initInteractions = initInteractions;
window.initButtonHovers = initButtonHovers;
window.initServiceCardHovers = initServiceCardHovers;
window.initValueCardHovers = initValueCardHovers;
window.initMagneticButtons = initMagneticButtons;
window.initScrollProgress = initScrollProgress;
