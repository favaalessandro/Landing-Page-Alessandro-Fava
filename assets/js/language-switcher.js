// Language Switcher Module
class LanguageSwitcher {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'it';
        this.init();
    }
    
    init() {
        // Apply saved language on load
        this.applyLanguage(this.currentLang);
        
        // Create and inject language switcher button
        this.createLanguageSwitcher();
        
        // Set document language attribute
        document.documentElement.lang = this.currentLang;
    }
    
    createLanguageSwitcher() {
        // Create the language switcher container
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <button class="language-switcher__btn" aria-label="Switch language" data-lang="${this.currentLang}">
                <span class="language-switcher__flag">${this.currentLang === 'it' ? '🇮🇹' : '🇬🇧'}</span>
                <span class="language-switcher__text">${this.currentLang.toUpperCase()}</span>
            </button>
        `;
        
        // Find the navbar menu
        const navbarMenu = document.querySelector('.navbar__menu');
        if (navbarMenu) {
            // Insert the switcher after the menu
            navbarMenu.parentNode.insertBefore(switcher, navbarMenu.nextSibling);
        }
        
        // Add click event
        const btn = switcher.querySelector('.language-switcher__btn');
        btn.addEventListener('click', () => this.toggleLanguage());
    }
    
    toggleLanguage() {
        this.currentLang = this.currentLang === 'it' ? 'en' : 'it';
        localStorage.setItem('language', this.currentLang);
        this.applyLanguage(this.currentLang);
        
        // Update button appearance
        const btn = document.querySelector('.language-switcher__btn');
        if (btn) {
            btn.dataset.lang = this.currentLang;
            btn.querySelector('.language-switcher__flag').textContent = this.currentLang === 'it' ? '🇮🇹' : '🇬🇧';
            btn.querySelector('.language-switcher__text').textContent = this.currentLang.toUpperCase();
        }
        
        // Update document language
        document.documentElement.lang = this.currentLang;
    }
    
    applyLanguage(lang) {
        const t = window.translations[lang];
        if (!t) return;
        
        // Update meta tags
        this.updateMetaTags(t);
        
        // Update navigation
        this.updateNavigation(t);
        
        // Update all sections
        this.updateHeroSection(t);
        this.updateAboutSection(t);
        this.updateExperienceSection(t);
        this.updateHelpSection(t);
        this.updateSkillsSection(t);
        this.updateEducationSection(t);
        this.updateContactSection(t);
        this.updateSidePanel(t);
        
        // Update other elements
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) skipLink.textContent = t.skipContent;
        const backToTop = document.querySelector('#back-to-top');
        if (backToTop) {
            backToTop.setAttribute('aria-label', t.backToTop);
            backToTop.setAttribute('title', t.backToTop);
        }
    }
    
    updateMetaTags(t) {
        document.title = t.metaTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = t.metaDescription;
        
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.content = t.metaTitle;
    }
    
    updateNavigation(t) {
        const navLinks = document.querySelectorAll('.navbar__link');
        const navKeys = ['home', 'about', 'experience', 'help', 'skills', 'education', 'contact'];
        
        navLinks.forEach((link, index) => {
            if (navKeys[index]) {
                link.textContent = t.nav[navKeys[index]];
            }
        });
    }
    
    updateHeroSection(t) {
        const subtitle = document.querySelector('.hero__subtitle');
        if (subtitle) subtitle.textContent = t.hero.subtitle;
        
        const description = document.querySelector('.hero__description');
        if (description) description.textContent = t.hero.description;
        
        const contactBtn = document.querySelector('.hero__actions .btn--primary');
        if (contactBtn) contactBtn.textContent = t.hero.contactBtn;
        
        const downloadBtn = document.querySelector('.hero__actions .btn--secondary');
        if (downloadBtn) {
            const icon = downloadBtn.querySelector('svg');
            downloadBtn.innerHTML = '';
            if (icon) downloadBtn.appendChild(icon);
            downloadBtn.appendChild(document.createTextNode(' ' + t.hero.downloadCV));
        }
    }
    
    updateAboutSection(t) {
        const title = document.querySelector('#about .section-title');
        if (title) title.textContent = t.about.title;
        
        const tagline = document.querySelector('#about .text-xl');
        if (tagline) tagline.textContent = t.about.tagline;
        
        // Update value cards
        const cards = document.querySelectorAll('#about .card');
        const cardKeys = ['integration', 'expansion', 'roi'];
        
        cards.forEach((card, index) => {
            if (index < 3 && cardKeys[index]) {
                const cardTitle = card.querySelector('h3');
                const cardDesc = card.querySelector('p');
                if (cardTitle) cardTitle.textContent = t.about.cards[cardKeys[index]].title;
                if (cardDesc) cardDesc.textContent = t.about.cards[cardKeys[index]].desc;
            }
        });
        
        // Update stats
        const stats = document.querySelectorAll('#about .scroll-reveal > div');
        const statKeys = ['years', 'countries', 'projects'];
        
        stats.forEach((stat, index) => {
            const text = stat.querySelector('.text-neutral-600');
            if (text && statKeys[index]) {
                text.textContent = t.about.stats[statKeys[index]];
            }
        });
    }
    
    updateExperienceSection(t) {
        const title = document.querySelector('#experience .section-title');
        if (title) title.textContent = t.experience.title;
        
        const tagline = document.querySelector('#experience .text-xl');
        if (tagline) tagline.textContent = t.experience.tagline;
        
        // Update timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        const roleKeys = ['current', 'breton', 'coo', 'salesDirector', 'areaManager'];
        
        timelineItems.forEach((item, index) => {
            if (roleKeys[index]) {
                const role = t.experience.roles[roleKeys[index]];
                
                // Update title and company
                const h3 = item.querySelector('h3');
                if (h3) h3.textContent = role.title;
                
                const h4 = item.querySelector('h4');
                if (h4 && role.company) h4.textContent = role.company;
                
                const date = item.querySelector('.timeline-date');
                if (date) date.textContent = role.date;
                
                // Update CAR sections
                const carSections = item.querySelectorAll('.car-section');
                const carKeys = ['challenge', 'action', 'result'];
                
                carSections.forEach((section, carIndex) => {
                    const h5 = section.querySelector('h5');
                    const p = section.querySelector('p');
                    
                    if (carKeys[carIndex] && role[carKeys[carIndex]]) {
                        if (h5) h5.textContent = role[carKeys[carIndex]].title;
                        if (p) p.textContent = role[carKeys[carIndex]].desc;
                    }
                });
                
                // Update detail button if exists
                const detailBtn = item.querySelector('.story-detail');
                if (detailBtn && role.detailBtn) {
                    detailBtn.textContent = role.detailBtn;
                }
            }
        });
    }
    
    updateHelpSection(t) {
        const title = document.querySelector('#help .section-title');
        if (title) title.textContent = t.help.title;
        
        // Update service cards
        const cards = document.querySelectorAll('#help .card');
        const serviceKeys = ['investment', 'expansion', 'integration'];
        
        cards.forEach((card, index) => {
            if (serviceKeys[index]) {
                const cardTitle = card.querySelector('h3');
                const cardDesc = card.querySelector('p');
                
                if (cardTitle) cardTitle.textContent = t.help.services[serviceKeys[index]].title;
                if (cardDesc) cardDesc.textContent = t.help.services[serviceKeys[index]].desc;
            }
        });
        
        // Update CTA
        const cta = document.querySelector('#help .text-lg');
        if (cta) {
            const link = cta.querySelector('a');
            cta.innerHTML = t.help.cta + ' ';
            if (link) {
                link.textContent = t.help.ctaLink;
                cta.appendChild(link);
            }
        }
    }
    
    updateSkillsSection(t) {
        const title = document.querySelector('#skills .section-title');
        if (title) title.textContent = t.skills.title;
        
        // Update skill categories
        const cards = document.querySelectorAll('#skills .card');
        const categoryKeys = ['business', 'sales', 'technical', 'software'];
        
        cards.forEach((card, index) => {
            if (categoryKeys[index]) {
                const cardTitle = card.querySelector('h3');
                if (cardTitle) cardTitle.textContent = t.skills.categories[categoryKeys[index]].title;
                
                // Update skill badges
                const badges = card.querySelectorAll('.badge');
                const items = t.skills.categories[categoryKeys[index]].items;
                
                badges.forEach((badge, badgeIndex) => {
                    if (items[badgeIndex]) {
                        badge.textContent = items[badgeIndex];
                    }
                });
            }
        });
    }
    
    updateEducationSection(t) {
        const title = document.querySelector('#education .section-title');
        if (title) title.textContent = t.education.title;
        
        // Update education cards
        const cards = document.querySelectorAll('#education .card');
        const degreeKeys = ['master', 'bachelor', 'professional'];
        
        cards.forEach((card, index) => {
            if (degreeKeys[index]) {
                const degree = t.education.degrees[degreeKeys[index]];
                
                const h3 = card.querySelector('h3');
                if (h3) h3.textContent = degree.title;
                
                const h4 = card.querySelector('h4');
                if (h4) h4.textContent = degree.institution;
                
                const date = card.querySelector('.text-sm');
                if (date) date.textContent = degree.date;
                
                const desc = card.querySelector('.text-neutral-600');
                if (desc) desc.textContent = degree.desc;
            }
        });
    }
    
    updateContactSection(t) {
        const title = document.querySelector('#contact .section-title');
        if (title) title.textContent = t.contact.title;
        
        const description = document.querySelector('#contact .text-lg');
        if (description) description.textContent = t.contact.description;
        
        // Update contact buttons
        const emailBtn = document.querySelector('a[href^="mailto"]');
        if (emailBtn) {
            const icon = emailBtn.querySelector('svg');
            emailBtn.innerHTML = '';
            if (icon) emailBtn.appendChild(icon);
            emailBtn.appendChild(document.createTextNode(' ' + t.contact.email));
        }
        
        const linkedInBtn = document.querySelector('a[href*="linkedin"]');
        if (linkedInBtn) {
            const icon = linkedInBtn.querySelector('svg');
            linkedInBtn.innerHTML = '';
            if (icon) linkedInBtn.appendChild(icon);
            linkedInBtn.appendChild(document.createTextNode(' ' + t.contact.linkedIn));
        }
        
        const gitHubBtn = document.querySelector('a[href*="github"]');
        if (gitHubBtn) {
            const icon = gitHubBtn.querySelector('svg');
            gitHubBtn.innerHTML = '';
            if (icon) gitHubBtn.appendChild(icon);
            gitHubBtn.appendChild(document.createTextNode(' ' + t.contact.gitHub));
        }
        
        // Update copyright
        const copyright = document.querySelector('.text-sm.text-neutral-500');
        if (copyright) copyright.textContent = t.contact.copyright;
    }
    
    updateSidePanel(t) {
        const panelTitle = document.querySelector('#panel-title');
        if (panelTitle) panelTitle.textContent = t.panel.title;
        
        const panelContent = document.querySelector('.panel-body');
        if (panelContent) {
            // Update panel content maintaining structure
            const h4 = panelContent.querySelector('h4');
            if (h4) h4.textContent = t.panel.subtitle;
            
            const subtitle = panelContent.querySelector('.panel-subtitle');
            if (subtitle) subtitle.textContent = t.panel.subsubtitle;
            
            // Update paragraphs and lists
            const paragraphs = panelContent.querySelectorAll('p:not(.panel-subtitle)');
            if (paragraphs[0]) paragraphs[0].textContent = t.panel.intro;
            
            const h5s = panelContent.querySelectorAll('h5');
            if (h5s[0]) h5s[0].textContent = t.panel.keyFunctions;
            
            // Update function list
            const listItems = panelContent.querySelectorAll('.panel-list li');
            listItems.forEach((item, index) => {
                if (t.panel.functions[index]) {
                    item.textContent = t.panel.functions[index];
                }
            });
            
            if (h5s[1]) h5s[1].textContent = t.panel.lessons;
            
            // Update lessons paragraphs
            if (paragraphs[1]) paragraphs[1].textContent = t.panel.lessonsText1;
            if (paragraphs[2]) paragraphs[2].textContent = t.panel.lessonsText2;
            if (paragraphs[3]) {
                paragraphs[3].innerHTML = t.panel.lessonsText3 + ' <strong>' + t.panel.lessonsText4 + '</strong>' + t.panel.lessonsText5;
            }
            
            // Update final result
            const highlight = panelContent.querySelector('.panel-highlight');
            if (highlight) {
                const h5 = highlight.querySelector('h5');
                const p = highlight.querySelector('p');
                if (h5) h5.textContent = t.panel.finalResult;
                if (p) p.textContent = t.panel.finalResultText;
            }
        }
        
        // Update close button aria-label
        const closeBtn = document.querySelector('.panel-close');
        if (closeBtn) closeBtn.setAttribute('aria-label', t.panel.closePanel);
    }
}

// Initialize language switcher when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LanguageSwitcher();
    });
} else {
    new LanguageSwitcher();
}