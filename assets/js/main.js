/* ==========================================
   PUREWATTS - Main JavaScript
   GSAP Animations + Interactions
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    if (hasGsap) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ========== NAVBAR ==========
    const navbar = document.getElementById('navbar');
    const navBurger = document.getElementById('navBurger');
    const mobileMenu = document.getElementById('mobileMenu');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    navBurger.addEventListener('click', () => {
        navBurger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navBurger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 20;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ========== HERO ANIMATIONS ==========
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && hasGsap) {
        // Hero entrance
        const heroTl = gsap.timeline({ delay: 0.3 });
        heroTl
            .to('.hero-bg img', { scale: 1, duration: 1.8, ease: 'power2.out' })
            .from('.hero-tag', { opacity: 0, x: -30, duration: 0.6, ease: 'power3.out' }, 0.4)
            .from('.hero-title .title-line', {
                opacity: 0, y: 60, duration: 0.8,
                stagger: 0.15, ease: 'power3.out'
            }, 0.5)
            .from('.hero-sub', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' }, 1)
            .from('.hero-actions', { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' }, 1.2)
            .from('.hero-scroll', { opacity: 0, duration: 0.5 }, 1.4);

        // ========== SCROLL REVEAL ==========
        const reveals = document.querySelectorAll('.reveal-up');
        reveals.forEach(el => {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 88%',
                onEnter: () => el.classList.add('revealed'),
                once: true
            });
        });

        // ========== PARALLAX EFFECTS ==========
        // Hero parallax
        gsap.to('.hero-bg img', {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Parallax break section
        gsap.to('.parallax-bg img', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.parallax-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        // CTA band parallax
        gsap.to('.cta-bg img', {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: '.cta-band',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        // ========== SERVICE CARDS STAGGER ==========
        gsap.utils.toArray('.service-card').forEach((card, i) => {
            const img = card.querySelector('.service-img');
            const content = card.querySelector('.service-content');
            const isReverse = card.classList.contains('service-card--reverse');

            gsap.from(img, {
                x: isReverse ? 60 : -60,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    once: true
                }
            });

            gsap.from(content, {
                x: isReverse ? -60 : 60,
                opacity: 0,
                duration: 0.8,
                delay: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    once: true
                }
            });
        });

        // ========== PORTFOLIO ITEM STAGGER ==========
        gsap.utils.toArray('.portfolio-item').forEach((item, i) => {
            gsap.from(item, {
                opacity: 0,
                y: 40,
                scale: 0.95,
                duration: 0.6,
                delay: i * 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    once: true
                }
            });
        });

        // ========== CLIENT TYPES STAGGER ==========
        gsap.utils.toArray('.client-type').forEach((item, i) => {
            gsap.from(item, {
                opacity: 0,
                y: 30,
                duration: 0.5,
                delay: i * 0.06,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    once: true
                }
            });
        });
    } else {
        // Reduced motion or missing GSAP: just show everything
        document.querySelectorAll('.reveal-up').forEach(el => el.classList.add('revealed'));
    }

    // ========== STAT COUNTER ==========
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 2000;
                const start = performance.now();

                const animate = (now) => {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(target * eased);
                    if (progress < 1) requestAnimationFrame(animate);
                };

                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // ========== FAQ ACCORDION ==========
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                activeItem.classList.remove('active');
                activeItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked (if it was closed)
            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ========== BEFORE/AFTER SLIDER ==========
    const baSliders = document.querySelectorAll('.ba-slider');
    baSliders.forEach(slider => {
        const afterImg = slider.querySelector('.ba-after');
        const handle = slider.querySelector('.ba-handle');
        let isDragging = false;

        const updateSlider = (x) => {
            const rect = slider.getBoundingClientRect();
            let pct = ((x - rect.left) / rect.width) * 100;
            pct = Math.max(2, Math.min(98, pct));
            afterImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
            handle.style.left = pct + '%';
        };

        slider.addEventListener('mousedown', (e) => { isDragging = true; updateSlider(e.clientX); });
        slider.addEventListener('touchstart', (e) => { isDragging = true; updateSlider(e.touches[0].clientX); }, { passive: true });
        window.addEventListener('mousemove', (e) => { if (isDragging) updateSlider(e.clientX); });
        window.addEventListener('touchmove', (e) => { if (isDragging) updateSlider(e.touches[0].clientX); }, { passive: true });
        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('touchend', () => { isDragging = false; });
    });

    // ========== CONTACT FORM ==========
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Envoi en cours...';
            btn.disabled = true;

            // Simulate send (replace with actual form handling)
            setTimeout(() => {
                btn.textContent = 'Message envoye !';
                btn.style.background = '#10B981';
                form.reset();
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
});
