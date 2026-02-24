/* ========================================
   ALESSANDRO FAVA - PORTFOLIO WEBSITE
   Modern JavaScript with Design System Integration
======================================== */

// DOM Elements
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.navbar__toggle');
const navMenu = document.querySelector('.navbar__menu');
const navLinks = document.querySelectorAll('.navbar__link');
const backToTopBtn = document.getElementById('back-to-top');

// ========================================
// THEME MANAGEMENT
// ========================================

const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
};

// ========================================
// NAVIGATION FUNCTIONALITY
// ========================================

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');

        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
    });
}

// Close mobile menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navToggle) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Navbar scroll effects
let lastScrollTop = 0;
const handleNavbarScroll = () => {
    if (!navbar) return;
    const scrollTop = window.scrollY ?? document.documentElement.scrollTop;

    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
};

// ========================================
// SMOOTH SCROLLING
// ========================================

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ========================================

const sections = document.querySelectorAll('section[id]');
const highlightNavOnScroll = () => {
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.navbar__link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
};

// ========================================
// BACK TO TOP FUNCTIONALITY
// ========================================

const handleBackToTop = () => {
    if (window.scrollY > 300) {
        backToTopBtn?.classList.remove('hidden');
        backToTopBtn?.classList.add('block');
    } else {
        backToTopBtn?.classList.add('hidden');
        backToTopBtn?.classList.remove('block');
    }
};

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');

            // Add staggered delay for timeline items
            if (entry.target.classList.contains('timeline-item')) {
                entry.target.classList.add('visible');
                const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                const delay = index * 100;
                entry.target.style.transitionDelay = `${delay}ms`;
            }
        }
    });
}, observerOptions);

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================

const animateElements = () => {
    const elementsToAnimate = document.querySelectorAll('.scroll-reveal, .card');

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
};

// ========================================
// TIMELINE ANIMATIONS
// ========================================

const initializeTimeline = () => {
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach((item) => {
        item.classList.add('fade-in-up');
        observer.observe(item);
    });
};

// ========================================
// SIDE PANEL FUNCTIONALITY
// ========================================

const openSidePanel = (panelId) => {
    const panel = document.getElementById(panelId);
    const overlay = document.getElementById('panel-overlay');

    if (panel && overlay) {
        panel.classList.add('active');
        overlay.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');

        // Make page content inert
        const main = document.querySelector('main');
        const nav = document.querySelector('.navbar');
        if (main) main.setAttribute('inert', '');
        if (nav) nav.setAttribute('inert', '');

        // Focus management
        const closeButton = panel.querySelector('.panel-close');
        if (closeButton) closeButton.focus();

        // Focus trap
        const focusableElements = panel.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        panel._trapFocus = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        };
        panel.addEventListener('keydown', panel._trapFocus);

        // Add escape key listener
        document.addEventListener('keydown', handlePanelEscapeKey);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
};

const closeSidePanel = (panelId) => {
    const panel = document.getElementById(panelId);
    const overlay = document.getElementById('panel-overlay');

    if (panel && overlay) {
        panel.classList.remove('active');
        overlay.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');

        // Restore page content
        const main = document.querySelector('main');
        const nav = document.querySelector('.navbar');
        if (main) main.removeAttribute('inert');
        if (nav) nav.removeAttribute('inert');

        // Remove focus trap
        if (panel._trapFocus) {
            panel.removeEventListener('keydown', panel._trapFocus);
        }

        // Remove escape key listener
        document.removeEventListener('keydown', handlePanelEscapeKey);

        // Restore body scroll
        document.body.style.overflow = '';

        // Return focus to trigger button
        const triggerButton = document.querySelector(`[data-panel-trigger="${panelId}"]`);
        if (triggerButton) triggerButton.focus();
    }
};

const handlePanelEscapeKey = (e) => {
    if (e.key === 'Escape') {
        const activePanel = document.querySelector('.side-panel.active');
        if (activePanel) {
            closeSidePanel(activePanel.id);
        }
    }
};

// Event delegation for panel triggers and closers
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-panel-trigger]');
    if (trigger) {
        openSidePanel(trigger.dataset.panelTrigger);
        return;
    }

    const closer = e.target.closest('[data-panel-close]');
    if (closer) {
        closeSidePanel(closer.dataset.panelClose);
        return;
    }

    // Close panel when clicking overlay
    if (e.target.id === 'panel-overlay' && e.target.classList.contains('active')) {
        const activePanel = document.querySelector('.side-panel.active');
        if (activePanel) {
            closeSidePanel(activePanel.id);
        }
    }
});

// Make functions globally available
window.openSidePanel = openSidePanel;
window.closeSidePanel = closeSidePanel;

// ========================================
// LAZY LOADING IMAGES
// ========================================

const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
};

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

// Scroll handler using requestAnimationFrame
let ticking = false;
const handleScroll = () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            handleNavbarScroll();
            highlightNavOnScroll();
            handleBackToTop();
            ticking = false;
        });
        ticking = true;
    }
};

// ========================================
// REDUCED MOTION PREFERENCES
// ========================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ========================================
// INITIALIZATION
// ========================================

const init = () => {
    // Initialize theme
    initTheme();

    // Initialize animations (only if motion is preferred)
    if (!prefersReducedMotion) {
        animateElements();
        initializeTimeline();
    }

    // Initialize lazy loading
    lazyLoadImages();

    // Add scroll event listener with passive flag
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial scroll handler execution
    handleNavbarScroll();
    highlightNavOnScroll();
    handleBackToTop();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
