// TypeScript версия для компиляции (если нужно)

interface ThemeElements {
    themeToggle: HTMLButtonElement | null;
    menuToggle: HTMLButtonElement | null;
    navLinks: HTMLElement | null;
    prevBtn: HTMLButtonElement | null;
    nextBtn: HTMLButtonElement | null;
    currentSlideEl: HTMLElement | null;
    totalSlidesEl: HTMLElement | null;
}

class TikhoretskWebsite {
    private elements: ThemeElements;
    private navLinksAll: NodeListOf<HTMLAnchorElement>;
    private sections: NodeListOf<HTMLElement>;
    private currentSlide: number = 1;
    private readonly totalSlides: number = 4;

    constructor() {
        this.elements = {
            themeToggle: document.getElementById('themeToggle') as HTMLButtonElement,
            menuToggle: document.getElementById('menuToggle') as HTMLButtonElement,
            navLinks: document.querySelector('.nav-links'),
            prevBtn: document.getElementById('prevBtn') as HTMLButtonElement,
            nextBtn: document.getElementById('nextBtn') as HTMLButtonElement,
            currentSlideEl: document.getElementById('currentSlide'),
            totalSlidesEl: document.getElementById('totalSlides')
        };

        this.navLinksAll = document.querySelectorAll('.nav-links a');
        this.sections = document.querySelectorAll('section');
    }

    public init(): void {
        this.initTheme();
        this.initGallery();
        this.initEventListeners();
        this.initTimelineExpand();
        this.addAnimationStyles();
        this.updateActiveNavLink();
        
        console.log('Сайт "Тихорецк: Летопись города" успешно загружен!');
    }

    private initTheme(): void {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.updateThemeIcon(savedTheme);
        }
    }

    private updateThemeIcon(theme: string): void {
        if (!this.elements.themeToggle) return;
        
        const icon = this.elements.themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    private toggleTheme(): void {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    private toggleMenu(): void {
        if (this.elements.navLinks) {
            this.elements.navLinks.classList.toggle('active');
        }
    }

    private closeMenuOnClick(): void {
        if (this.elements.navLinks) {
            this.elements.navLinks.classList.remove('active');
        }
    }

    private updateActiveNavLink(): void {
        let current: string = '';
        const scrollPosition = window.scrollY;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= (sectionTop - 200)) {
                current = section.getAttribute('id') || '';
            }
        });

        this.navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    private initGallery(): void {
        if (this.elements.totalSlidesEl) {
            this.elements.totalSlidesEl.textContent = this.totalSlides.toString();
        }
        this.updateSlideDisplay();
    }

    private updateSlideDisplay(): void {
        if (this.elements.currentSlideEl) {
            this.elements.currentSlideEl.textContent = this.currentSlide.toString();
        }
    }

    private showPrevSlide(): void {
        this.currentSlide = this.currentSlide > 1 ? this.currentSlide - 1 : this.totalSlides;
        this.updateSlideDisplay();
    }

    private showNextSlide(): void {
        this.currentSlide = this.currentSlide < this.totalSlides ? this.currentSlide + 1 : 1;
        this.updateSlideDisplay();
    }

    private initEventListeners(): void {
        // Переключение темы
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Переключение меню
        if (this.elements.menuToggle) {
            this.elements.menuToggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Закрытие меню при клике на ссылку
        this.navLinksAll.forEach(link => {
            link.addEventListener('click', () => this.closeMenuOnClick());
        });
        
        // Навигация по галерее
        if (this.elements.prevBtn) {
            this.elements.prevBtn.addEventListener('click', () => this.showPrevSlide());
        }
        
        if (this.elements.nextBtn) {
            this.elements.nextBtn.addEventListener('click', () => this.showNextSlide());
        }
        
        // Обновление активного пункта меню при скролле
        window.addEventListener('scroll', () => this.updateActiveNavLink());
        
        // Плавный скролл
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                if (href === '#') return;
                
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Анимация появления элементов
        this.initIntersectionObserver();
    }

    private initTimelineExpand(): void {
        const timelineItems = document.querySelectorAll('.timeline-item[data-expand]');
        
        timelineItems.forEach(item => {
            const title = item.querySelector('.timeline-content h3');
            const details = item.querySelector('.timeline-details');
            
            if (!title || !details) return;
            
            title.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Закрываем другие открытые карточки
                timelineItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('expanded')) {
                        otherItem.classList.remove('expanded');
                        const otherDetails = otherItem.querySelector('.timeline-details');
                        if (otherDetails) {
                            otherDetails.setAttribute('hidden', '');
                        }
                    }
                });
                
                // Переключаем текущую карточку
                if (item.classList.contains('expanded')) {
                    item.classList.remove('expanded');
                    details.setAttribute('hidden', '');
                } else {
                    item.classList.add('expanded');
                    details.removeAttribute('hidden');
                }
            });
        });
    }

    private initIntersectionObserver(): void {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.history-card, .timeline-item, .fact-card').forEach(el => {
            observer.observe(el);
        });
    }

    private addAnimationStyles(): void {
        const style = document.createElement('style');
        style.textContent = this.getAnimationStyles();
        document.head.appendChild(style);
    }

    private getAnimationStyles(): string {
        return `
            .history-card, .timeline-item, .fact-card {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .history-card.animated, 
            .timeline-item.animated, 
            .fact-card.animated {
                opacity: 1;
                transform: translateY(0);
            }
            
            .history-card:nth-child(1) { transition-delay: 0.1s; }
            .history-card:nth-child(2) { transition-delay: 0.2s; }
            .history-card:nth-child(3) { transition-delay: 0.3s; }
            .history-card:nth-child(4) { transition-delay: 0.4s; }
            .history-card:nth-child(5) { transition-delay: 0.5s; }
            .history-card:nth-child(6) { transition-delay: 0.6s; }
            
            .timeline-item:nth-child(1) { transition-delay: 0.1s; }
            .timeline-item:nth-child(2) { transition-delay: 0.2s; }
            .timeline-item:nth-child(3) { transition-delay: 0.3s; }
            .timeline-item:nth-child(4) { transition-delay: 0.4s; }
            .timeline-item:nth-child(5) { transition-delay: 0.5s; }
            .timeline-item:nth-child(6) { transition-delay: 0.6s; }
            .timeline-item:nth-child(7) { transition-delay: 0.7s; }
            
            .fact-card:nth-child(1) { transition-delay: 0.1s; }
            .fact-card:nth-child(2) { transition-delay: 0.2s; }
            .fact-card:nth-child(3) { transition-delay: 0.3s; }
            .fact-card:nth-child(4) { transition-delay: 0.4s; }
        `;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const website = new TikhoretskWebsite();
    website.init();
});