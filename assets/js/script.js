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

// ========================================
// NETFLIX-STYLE EXPERIENCE CAROUSEL
// ========================================

class NetflixCarousel {
    constructor() {
        this.carousel = document.querySelector('.netflix-carousel');
        if (!this.carousel) return;

        this.track = this.carousel.querySelector('.netflix-carousel__track');
        this.cards = Array.from(this.carousel.querySelectorAll('.netflix-card'));
        this.arrowLeft = this.carousel.querySelector('.netflix-carousel__arrow--left');
        this.arrowRight = this.carousel.querySelector('.netflix-carousel__arrow--right');
        this.dots = Array.from(document.querySelectorAll('.netflix-carousel__dot'));
        this.years = Array.from(document.querySelectorAll('.netflix-timeline__year'));
        this.progressBar = document.querySelector('.netflix-timeline__progress');

        this.currentIndex = 0;
        this.totalCards = this.cards.length;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.swipeThreshold = 50;
        this.isHovered = false;

        this.init();
    }

    init() {
        if (!this.carousel) return;

        // Set initial state
        this.navigate(0);

        // Arrow click handlers
        if (this.arrowLeft) {
            this.arrowLeft.addEventListener('click', () => {
                const newIndex = this.currentIndex <= 0
                    ? this.totalCards - 1
                    : this.currentIndex - 1;
                this.navigate(newIndex);
            });
        }

        if (this.arrowRight) {
            this.arrowRight.addEventListener('click', () => {
                const newIndex = this.currentIndex >= this.totalCards - 1
                    ? 0
                    : this.currentIndex + 1;
                this.navigate(newIndex);
            });
        }

        // Card expand button handlers
        this.cards.forEach(card => {
            const expandBtn = card.querySelector('.netflix-card__expand');
            if (expandBtn) {
                expandBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleExpand(card);
                });
            }
        });

        // Dot navigation handlers
        this.dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index, 10);
                this.navigate(index);
            });
        });

        // Year navigation handlers
        this.years.forEach(year => {
            year.addEventListener('click', () => {
                const index = parseInt(year.dataset.index, 10);
                this.navigate(index);
            });
        });

        // Keyboard support
        this.handleKeyboard();

        // Touch/swipe support
        this.handleSwipe();

        // Track hover state for keyboard navigation
        this.carousel.addEventListener('mouseenter', () => {
            this.isHovered = true;
        });
        this.carousel.addEventListener('mouseleave', () => {
            this.isHovered = false;
        });
    }

    navigate(index) {
        if (index < 0 || index >= this.totalCards) return;

        this.currentIndex = index;

        // Update active card
        this.cards.forEach((card, i) => {
            if (i === index) {
                card.classList.add('netflix-card--active');
            } else {
                card.classList.remove('netflix-card--active');
            }
        });

        // Scroll to center the active card
        this.scrollToCard(index);

        // Update dots
        this.updateDots(index);

        // Update timeline
        this.updateTimeline(index);

        // Update arrow visibility
        this.updateArrows(index);
    }

    scrollToCard(index) {
        if (!this.track || !this.cards[index]) return;

        const card = this.cards[index];
        const trackRect = this.track.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();

        // Calculate the scroll position to center the card in the track viewport
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const trackVisibleWidth = this.track.clientWidth;
        const scrollTarget = cardCenter - trackVisibleWidth / 2;

        this.track.scrollTo({
            left: scrollTarget,
            behavior: 'smooth'
        });
    }

    toggleExpand(card) {
        const isExpanded = card.classList.contains('netflix-card--expanded');
        const expandBtn = card.querySelector('.netflix-card__expand');
        const details = card.querySelector('.netflix-card__details');

        // Collapse all other cards first
        if (!isExpanded) {
            this.collapseAll();
        }

        // Toggle this card
        card.classList.toggle('netflix-card--expanded');

        if (expandBtn) {
            const nowExpanded = card.classList.contains('netflix-card--expanded');
            expandBtn.setAttribute('aria-expanded', nowExpanded.toString());
            const expandText = expandBtn.querySelector('.netflix-card__expand-text');
            if (expandText) {
                expandText.textContent = nowExpanded ? 'Chiudi' : 'Scopri di più';
            }
        }

        if (details) {
            const nowExpanded = card.classList.contains('netflix-card--expanded');
            details.setAttribute('aria-hidden', (!nowExpanded).toString());
        }
    }

    collapseAll() {
        this.cards.forEach(card => {
            card.classList.remove('netflix-card--expanded');

            const expandBtn = card.querySelector('.netflix-card__expand');
            if (expandBtn) {
                expandBtn.setAttribute('aria-expanded', 'false');
                const expandText = expandBtn.querySelector('.netflix-card__expand-text');
                if (expandText) {
                    expandText.textContent = 'Scopri di più';
                }
            }

            const details = card.querySelector('.netflix-card__details');
            if (details) {
                details.setAttribute('aria-hidden', 'true');
            }
        });
    }

    updateDots(index) {
        this.dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('netflix-carousel__dot--active');
            } else {
                dot.classList.remove('netflix-carousel__dot--active');
            }
        });
    }

    updateTimeline(index) {
        // Update active year
        this.years.forEach((year, i) => {
            if (i === index) {
                year.classList.add('netflix-timeline__year--active');
            } else {
                year.classList.remove('netflix-timeline__year--active');
            }
        });

        // Animate progress bar
        if (this.progressBar) {
            const maxSteps = this.totalCards - 1;
            const progressPercent = maxSteps > 0
                ? (index / maxSteps) * 100
                : 0;
            this.progressBar.style.width = `${progressPercent}%`;
        }
    }

    updateArrows(index) {
        if (this.arrowLeft) {
            if (index === 0) {
                this.arrowLeft.style.opacity = '0.3';
                this.arrowLeft.style.pointerEvents = 'none';
            } else {
                this.arrowLeft.style.opacity = '1';
                this.arrowLeft.style.pointerEvents = 'auto';
            }
        }

        if (this.arrowRight) {
            if (index === this.totalCards - 1) {
                this.arrowRight.style.opacity = '0.3';
                this.arrowRight.style.pointerEvents = 'none';
            } else {
                this.arrowRight.style.opacity = '1';
                this.arrowRight.style.pointerEvents = 'auto';
            }
        }
    }

    handleSwipe() {
        if (!this.track) return;

        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            const diff = this.touchStartX - this.touchEndX;

            if (Math.abs(diff) >= this.swipeThreshold) {
                if (diff > 0) {
                    // Swiped left -> go to next card
                    const newIndex = this.currentIndex >= this.totalCards - 1
                        ? 0
                        : this.currentIndex + 1;
                    this.navigate(newIndex);
                } else {
                    // Swiped right -> go to previous card
                    const newIndex = this.currentIndex <= 0
                        ? this.totalCards - 1
                        : this.currentIndex - 1;
                    this.navigate(newIndex);
                }
            }
        }, { passive: true });
    }

    handleKeyboard() {
        document.addEventListener('keydown', (e) => {
            // Only respond when carousel is focused or hovered
            const carouselHasFocus = this.carousel.contains(document.activeElement);
            if (!carouselHasFocus && !this.isHovered) return;

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevIndex = this.currentIndex <= 0
                        ? this.totalCards - 1
                        : this.currentIndex - 1;
                    this.navigate(prevIndex);
                    break;

                case 'ArrowRight':
                    e.preventDefault();
                    const nextIndex = this.currentIndex >= this.totalCards - 1
                        ? 0
                        : this.currentIndex + 1;
                    this.navigate(nextIndex);
                    break;

                case 'Escape':
                    this.collapseAll();
                    break;
            }
        });
    }
}

// Initialize Netflix Carousel when DOM is ready
const initNetflixCarousel = () => {
    if (document.querySelector('.netflix-carousel')) {
        new NetflixCarousel();
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNetflixCarousel);
} else {
    initNetflixCarousel();
}
