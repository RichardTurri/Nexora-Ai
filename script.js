/**
 * Nexora AI - Main JavaScript
 * Smooth scroll, scroll animations, chat demo, mobile nav
 */

(function() {
    'use strict';

    // ============================================================
    // Configuration
    // ============================================================
    const CONFIG = {
        headerHeight: 72,
        animationThreshold: 0.1,
        animationRootMargin: '0px 0px -50px 0px',
        chatAutoPlayDelay: 1000,
        chatMessageDelay: 1500,
    };

    // ============================================================
    // Utility Functions
    // ============================================================
    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    };

    const prefersReducedMotion = () =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ============================================================
    // Smooth Scroll for Anchor Links
    // ============================================================
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', e => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                const target = $(href);
                if (!target) return;

                e.preventDefault();

                const header = $('.header');
                const headerOffset = header ? header.offsetHeight : CONFIG.headerHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth'
                });

                // Update URL without scroll
                history.pushState(null, '', href);

                // Focus target for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            });
        });
    }

    // ============================================================
    // Scroll-Triggered Animations (IntersectionObserver)
    // ============================================================
    function initScrollAnimations() {
        if (prefersReducedMotion()) {
            // Show all immediately if reduced motion
            $$('.animate-in').forEach(el => el.style.opacity = '1');
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.animationThreshold,
            rootMargin: CONFIG.animationRootMargin
        });

        $$('.animate-in').forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }

    // ============================================================
    // Chat Demo Auto-Play
    // ============================================================
    function initChatDemo() {
        const chatWindow = $('.chat-window');
        if (!chatWindow) return;

        const messages = $$('.chat-messages .message');
        if (messages.length === 0) return;

        // Initially hide all messages except first
        messages.forEach((msg, i) => {
            if (i > 0) {
                msg.style.opacity = '0';
                msg.style.transform = 'translateY(10px)';
                msg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            }
        });

        let currentIndex = 0;

        function showNextMessage() {
            if (currentIndex >= messages.length - 1) return;

            currentIndex++;
            const msg = messages[currentIndex];
            msg.style.opacity = '1';
            msg.style.transform = 'translateY(0)';

            // Scroll to bottom
            const chatMessages = $('.chat-messages');
            if (chatMessages) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            // Schedule next
            if (currentIndex < messages.length - 1) {
                setTimeout(showNextMessage, CONFIG.chatMessageDelay);
            }
        }

        // Start auto-play when chat comes into view
        const chatObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(showNextMessage, CONFIG.chatAutoPlayDelay);
                    chatObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        chatObserver.observe(chatWindow);
    }

    // ============================================================
    // Mobile Navigation
    // ============================================================
    function initMobileNav() {
        const header = $('.header');
        const nav = $('.nav');
        const navList = $('.nav-list');

        if (!header || !nav || !navList) return;

        // Detect language from HTML lang attribute
        const isEnglish = document.documentElement.lang === 'en';

        // Create hamburger button
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.setAttribute('aria-label', isEnglish ? 'Open menu' : 'Abrir menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'mobile-nav');
        hamburger.innerHTML = `
            <span class="hamburger-line" aria-hidden="true"></span>
            <span class="hamburger-line" aria-hidden="true"></span>
            <span class="hamburger-line" aria-hidden="true"></span>
        `;

        // Build mobile nav links from desktop nav
        const desktopLinks = $$('.nav-link', navList);
        const mobileLinksHtml = desktopLinks.map(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            const isCta = link.classList.contains('btn-demo');
            const ctaClass = isCta ? ' mobile-nav-cta' : '';
            return `<li><a href="${href}" class="mobile-nav-link${ctaClass}">${text}</a></li>`;
        }).join('');

        // Add demo CTA if not in desktop nav (mobile only)
        const demoLink = $('.btn-demo');
        const hasDemoInNav = desktopLinks.some(l => l.getAttribute('href') === '#demo');
        const extraLinks = !hasDemoInNav && demoLink
            ? `<li><a href="#demo" class="mobile-nav-link mobile-nav-cta">${isEnglish ? 'Request demo' : 'Solicitar demonstração'}</a></li>`
            : '';

        // Language switcher for mobile nav
        const mobileLangSwitcher = `
            <li class="mobile-nav-lang">
                <button class="mobile-lang-btn ${isEnglish ? '' : 'is-active'}" data-lang="pt" aria-pressed="${!isEnglish}">PT</button>
                <button class="mobile-lang-btn ${isEnglish ? 'is-active' : ''}" data-lang="en" aria-pressed="${isEnglish}">EN</button>
            </li>
        `;

        // Create mobile nav panel
        const mobileNav = document.createElement('nav');
        mobileNav.id = 'mobile-nav';
        mobileNav.className = 'mobile-nav';
        mobileNav.setAttribute('role', 'dialog');
        mobileNav.setAttribute('aria-label', isEnglish ? 'Navigation menu' : 'Menu de navegação');
        mobileNav.innerHTML = `
            <ul class="mobile-nav-list">
                ${mobileLinksHtml}
                ${extraLinks}
                ${mobileLangSwitcher}
            </ul>
        `;

        // Insert elements
        header.querySelector('.header-container').appendChild(hamburger);
        document.body.appendChild(mobileNav);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);

        // Mobile language switcher event listeners
        $$('.mobile-lang-btn', mobileNav).forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                if (lang === 'en' && !isEnglish) {
                    window.location.href = 'index-en.html';
                } else if (lang === 'pt' && isEnglish) {
                    window.location.href = 'index.html';
                }
            });
        });

        let isOpen = false;

        function openMenu() {
            isOpen = true;
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.setAttribute('aria-label', isEnglish ? 'Close menu' : 'Fechar menu');
            mobileNav.classList.add('is-open');
            overlay.classList.add('is-open');
            document.body.style.overflow = 'hidden';

            // Focus first link
            const firstLink = mobileNav.querySelector('.mobile-nav-link');
            if (firstLink) firstLink.focus();

            // Trap focus
            document.addEventListener('keydown', trapFocus);
        }

        function closeMenu() {
            isOpen = false;
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', isEnglish ? 'Open menu' : 'Abrir menu');
            mobileNav.classList.remove('is-open');
            overlay.classList.remove('is-open');
            document.body.style.overflow = '';

            // Return focus to hamburger
            hamburger.focus();

            document.removeEventListener('keydown', trapFocus);
        }

        function toggleMenu() {
            isOpen ? closeMenu() : openMenu();
        }

        function trapFocus(e) {
            if (e.key !== 'Tab') return;

            const focusableElements = mobileNav.querySelectorAll(
                'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }

        // Event listeners
        hamburger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);

        // Close on link click
        $$('.mobile-nav-link', mobileNav).forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close on Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && isOpen) closeMenu();
        });

        // Close on resize > mobile breakpoint
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth >= 768 && isOpen) closeMenu();
        }, 250));
    }

    // ============================================================
    // Header Scroll Effect
    // ============================================================
    function initHeaderScroll() {
        const header = $('.header');
        if (!header) return;

        let lastScroll = 0;
        const threshold = 100;

        window.addEventListener('scroll', debounce(() => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > threshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, 50));
    }

    // ============================================================
    // Language Switcher
    // ============================================================
    function initLanguageSwitcher() {
        const langButtons = $$('.lang-btn');
        if (langButtons.length === 0) return;

        const isEnglish = document.documentElement.lang === 'en';
        const targetUrl = isEnglish ? 'index.html' : 'index-en.html';

        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                if (lang === 'en' && !isEnglish) {
                    window.location.href = 'index-en.html';
                } else if (lang === 'pt' && isEnglish) {
                    window.location.href = 'index.html';
                }
            });
        });

        // Keyboard support for switcher
        langButtons.forEach(btn => {
            btn.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
        });
    }

    // ============================================================
    // Demo CTA - Mailto with Prefilled Data
    // ============================================================
    function initDemoCTA() {
        $$('a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', e => {
                // Allow default mailto behavior
                // Could add analytics tracking here
            });
        });
    }

    // ============================================================
    // Performance: Lazy Load Non-Critical Images
    // ============================================================
    function initLazyLoad() {
        if (!('IntersectionObserver' in window)) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        $$('img[data-src]').forEach(img => imageObserver.observe(img));
    }

    // ============================================================
    // Initialize All
    // ============================================================
    function init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        initSmoothScroll();
        initScrollAnimations();
        initChatDemo();
        initLanguageSwitcher();
        initMobileNav();
        initHeaderScroll();
        initDemoCTA();
        initLazyLoad();

        // Mark as loaded for CSS
        document.documentElement.classList.add('js-loaded');
    }

    // Start
    init();

    // Expose for debugging
    window.NexoraAI = {
        CONFIG,
        initSmoothScroll,
        initScrollAnimations,
        initChatDemo,
        initMobileNav
    };
})();