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
        // Show the opposite language (the one we can switch to)
        const targetLang = this.currentLang === 'it' ? 'en' : 'it';
        switcher.innerHTML = `
            <button class="language-switcher__btn" aria-label="Switch to ${targetLang === 'it' ? 'Italian' : 'English'}" data-lang="${targetLang}">
                <span class="language-switcher__text">${targetLang.toUpperCase()}</span>
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
        
        // Update button appearance - show the opposite language (the one we can switch to)
        const btn = document.querySelector('.language-switcher__btn');
        if (btn) {
            const targetLang = this.currentLang === 'it' ? 'en' : 'it';
            btn.dataset.lang = targetLang;
            btn.querySelector('.language-switcher__text').textContent = targetLang.toUpperCase();
            btn.setAttribute('aria-label', `Switch to ${targetLang === 'it' ? 'Italian' : 'English'}`);
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
        const tagline = document.querySelector('.hero__tagline');
        if (tagline) tagline.textContent = t.hero.tagline;

        const subtitle = document.querySelector('.hero__subtitle');
        if (subtitle) subtitle.textContent = t.hero.subtitle;

        const description = document.querySelector('.hero__description');
        if (description) description.textContent = t.hero.description;

        // Update trust indicators
        if (t.hero.trust) {
            const trustItems = document.querySelectorAll('.hero__trust-item');
            const trustKeys = ['years', 'countries', 'projects'];
            trustItems.forEach((item, index) => {
                if (trustKeys[index] && t.hero.trust[trustKeys[index]]) {
                    const num = item.querySelector('.hero__trust-number');
                    const label = item.querySelector('.hero__trust-label');
                    if (num) num.textContent = t.hero.trust[trustKeys[index]].number;
                    if (label) label.textContent = t.hero.trust[trustKeys[index]].label;
                }
            });
        }

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
        
        // Update stats - preserve numbers, only update text labels
        const statsContainer = document.querySelector('#about .grid.text-center');
        if (statsContainer) {
            const statItems = statsContainer.querySelectorAll('.scroll-reveal');
            const statKeys = ['years', 'countries', 'projects'];
            
            statItems.forEach((stat, index) => {
                const textElement = stat.querySelector('.text-neutral-600');
                if (textElement && statKeys[index]) {
                    // Only update the description text, numbers are preserved
                    textElement.textContent = t.about.stats[statKeys[index]];
                }
            });
        }

        // Update quote
        if (t.about.quote) {
            const quoteBlock = document.querySelector('.testimonial-quote blockquote p');
            if (quoteBlock) quoteBlock.textContent = '"' + t.about.quote + '"';
            const quoteCite = document.querySelector('.testimonial-quote cite');
            if (quoteCite) quoteCite.textContent = t.about.quoteAuthor;
        }
    }

    updateExperienceSection(t) {
        const title = document.querySelector('#experience .section-title');
        if (title) title.textContent = t.experience.title;

        const tagline = document.querySelector('#experience .text-xl');
        if (tagline) tagline.textContent = t.experience.tagline;

        // Update Netflix carousel cards
        const cards = document.querySelectorAll('.netflix-card');
        const roleKeys = ['current', 'breton', 'coo', 'salesDirector', 'areaManager'];

        cards.forEach((card, index) => {
            if (roleKeys[index]) {
                const role = t.experience.roles[roleKeys[index]];

                const cardTitle = card.querySelector('.netflix-card__title');
                if (cardTitle) cardTitle.textContent = role.title;

                const company = card.querySelector('.netflix-card__company');
                if (company && role.company) company.textContent = role.company;

                const date = card.querySelector('.netflix-card__date');
                if (date) date.textContent = role.date;

                // Update preview
                const preview = card.querySelector('.netflix-card__preview p');
                if (preview && role.preview) preview.textContent = role.preview;

                // Update badge
                const badge = card.querySelector('.netflix-card__badge');
                if (badge && role.badge) badge.textContent = role.badge;

                // Update expand button text
                const expandText = card.querySelector('.netflix-card__expand-text');
                if (expandText) {
                    const isExpanded = card.classList.contains('netflix-card--expanded');
                    expandText.textContent = isExpanded
                        ? (t.experience.closeLabel || 'Chiudi')
                        : (t.experience.expandLabel || 'Scopri di più');
                }

                // Update detail sections
                const detailSections = card.querySelectorAll('.netflix-card__detail-section');
                const carKeys = ['challenge', 'action', 'result'];

                detailSections.forEach((section, carIndex) => {
                    const h5 = section.querySelector('h5');
                    const p = section.querySelector('p');

                    if (carKeys[carIndex] && role[carKeys[carIndex]]) {
                        if (h5) h5.textContent = role[carKeys[carIndex]].title;
                        if (p) p.textContent = role[carKeys[carIndex]].desc;
                    }
                });
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
            cta.textContent = '';
            cta.append(t.help.cta + ' ');
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

        // Update tagline
        if (t.contact.tagline) {
            const tagline = document.querySelector('#contact .text-xl');
            if (tagline) tagline.textContent = t.contact.tagline;
        }

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
                paragraphs[3].textContent = '';
                paragraphs[3].append(
                    t.panel.lessonsText3 + ' ',
                    Object.assign(document.createElement('strong'), {
                        textContent: t.panel.lessonsText4
                    }),
                    t.panel.lessonsText5
                );
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