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
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
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
            const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
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
    const scrollY = window.pageYOffset;
    
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
    if (window.pageYOffset > 300) {
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
    const elementsToAnimate = document.querySelectorAll('.scroll-reveal, .timeline-item, .card');
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
};

// ========================================
// TIMELINE ANIMATIONS
// ========================================

const initializeTimeline = () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        // Add fade-in-up class for animation
        item.classList.add('fade-in-up');
        
        // Observe for intersection
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
        
        // Focus management
        const closeButton = panel.querySelector('.panel-close');
        if (closeButton) closeButton.focus();
        
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
        
        // Remove escape key listener
        document.removeEventListener('keydown', handlePanelEscapeKey);
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to trigger button
        const triggerButton = document.querySelector(`[onclick="openSidePanel('${panelId}')"]`);
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

// Make functions globally available
window.openSidePanel = openSidePanel;
window.closeSidePanel = closeSidePanel;

// ========================================
// LAZY LOADING IMAGES
// ========================================

const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
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

// Throttled scroll handler
let scrollTimeout;
const throttleScroll = (func, delay) => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
        func();
        scrollTimeout = null;
    }, delay);
};

// Optimized scroll event handler
const handleScroll = () => {
    throttleScroll(() => {
        handleNavbarScroll();
        highlightNavOnScroll();
        handleBackToTop();
    }, 10);
};

// ========================================
// REDUCED MOTION PREFERENCES
// ========================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ========================================
// COUNTER ANIMATIONS
// ========================================

const animateCounters = () => {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const increment = target / 50;
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is visible
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && current === 0) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counterObserver.observe(counter);
    });
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Scroll to contact section
const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
};

// Open case study (scrolls to experience)
const openCaseStudy = () => {
    const experienceSection = document.getElementById('experience');
    if (experienceSection) {
        experienceSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
};

// Open consulting services (scrolls to skills)
const openConsultingServices = () => {
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        skillsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
};

// Competency expansion (legacy support)
const expandCompetency = (card) => {
    const allCards = document.querySelectorAll('.competency-card');
    const isExpanded = card.classList.contains('expanded');
    
    allCards.forEach(c => c.classList.remove('expanded'));
    
    if (!isExpanded) {
        card.classList.add('expanded');
    }
};

// Show detail (legacy support)
const showDetail = (detailType) => {
    const allDetails = document.querySelectorAll('.detail-card');
    const targetDetail = document.getElementById(`detail-${detailType}`);
    
    allDetails.forEach(d => d.style.display = 'none');
    
    if (targetDetail) {
        targetDetail.style.display = 'block';
        targetDetail.classList.add('fade-in');
    }
};

// Toggle CAR story (legacy support)
const toggleCAR = (element) => {
    const carStory = element.closest('.car-story');
    if (carStory) {
        carStory.classList.toggle('collapsed');
        const expandText = element.querySelector('.expand-indicator');
        if (expandText) {
            expandText.textContent = carStory.classList.contains('collapsed') ? 'Espandi →' : 'Comprimi ↑';
        }
    }
};

// Toggle scenario (legacy support)
const toggleScenario = (card) => {
    const allCards = document.querySelectorAll('.scenario-card');
    const isOpen = card.classList.contains('open');
    
    allCards.forEach(c => {
        if (c !== card) {
            c.classList.remove('open');
            const toggleIcon = c.querySelector('.toggle-icon');
            if (toggleIcon) toggleIcon.textContent = '+';
        }
    });
    
    card.classList.toggle('open');
    const toggleIcon = card.querySelector('.toggle-icon');
    if (toggleIcon) {
        toggleIcon.textContent = card.classList.contains('open') ? '−' : '+';
    }
};

// Story navigation (legacy support)
let currentStory = 1;
const showStory = (storyNumber) => {
    const allStories = document.querySelectorAll('.story-card');
    allStories.forEach(story => {
        story.classList.remove('active');
        if (story.dataset.story === storyNumber.toString()) {
            story.classList.add('active');
        }
    });
    currentStory = storyNumber;
};

const showNextStory = () => {
    currentStory = currentStory >= 3 ? 1 : currentStory + 1;
    showStory(currentStory);
};

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
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial scroll handler execution
    handleNavbarScroll();
    highlightNavOnScroll();    
    handleBackToTop();
};

// ========================================
// DOM READY AND EVENT LISTENERS
// ========================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Initialize counters and other features
document.addEventListener('DOMContentLoaded', () => {
    animateCounters();
    
    // Initialize default states
    showDetail('manufacturing');
});

// ========================================
// SERVICE WORKER REGISTRATION
// ========================================

// Register service worker for PWA functionality (if available)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .catch(() => {
                // Silently fail if service worker is not available
            });
    });
}

// ========================================
// GLOBAL FUNCTION EXPORTS
// ========================================

// Make all functions globally available for backwards compatibility
window.scrollToContact = scrollToContact;
window.openCaseStudy = openCaseStudy;
window.openConsultingServices = openConsultingServices;
window.expandCompetency = expandCompetency;
window.showDetail = showDetail;
window.toggleCAR = toggleCAR;
window.toggleScenario = toggleScenario;
window.showStory = showStory;
window.showNextStory = showNextStory;