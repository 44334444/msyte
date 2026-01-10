// Добавьте в начало файла:
(function() {
    // Базовый трекинг аналитики
    const trackVisit = () => {
        const analytics = getAnalyticsData();
        const today = new Date().toLocaleDateString();
        const page = window.location.pathname;
        
        // Увеличиваем счетчики
        analytics.totalVisits = (analytics.totalVisits || 0) + 1;
        analytics.dailyVisits = analytics.dailyVisits || {};
        analytics.dailyVisits[today] = (analytics.dailyVisits[today] || 0) + 1;
        
        // Сохраняем
        localStorage.setItem('siteAnalytics', JSON.stringify(analytics));
    };
    
    const getAnalyticsData = () => {
        const data = localStorage.getItem('siteAnalytics');
        return data ? JSON.parse(data) : { totalVisits: 0, dailyVisits: {} };
    };
    
    // Трекинг при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackVisit);
    } else {
        trackVisit();
    }
})();

// TypeScript-подобный код с JSDoc комментариями
"use strict";

/** @type {HTMLButtonElement | null} */
const themeToggle = document.getElementById('themeToggle');
/** @type {HTMLButtonElement | null} */
const menuToggle = document.getElementById('menuToggle');
/** @type {HTMLElement | null} */
const navLinks = document.querySelector('.nav-links');
/** @type {HTMLButtonElement | null} */
const prevBtn = document.getElementById('prevBtn');
/** @type {HTMLButtonElement | null} */
const nextBtn = document.getElementById('nextBtn');
/** @type {HTMLElement | null} */
const currentSlideEl = document.getElementById('currentSlide');
/** @type {HTMLElement | null} */
const totalSlidesEl = document.getElementById('totalSlides');

/** @type {NodeListOf<HTMLAnchorElement>} */
const navLinksAll = document.querySelectorAll('.nav-links a');
/** @type {NodeListOf<HTMLElement>} */
const sections = document.querySelectorAll('section');

/** @type {string | null} */
const savedTheme = localStorage.getItem('theme');
let currentSlide = 1;
const totalSlides = 4; // Количество изображений в галерее

/**
 * Инициализация темы
 */
function initTheme() {
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
}

/**
 * Обновление иконки темы
 * @param {string} theme - Текущая тема ('dark' или 'light')
 */
function updateThemeIcon(theme) {
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

/**
 * Переключение темы
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

/**
 * Переключение мобильного меню
 */
function toggleMenu() {
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

/**
 * Закрытие меню при клике на ссылку
 */
function closeMenuOnClick() {
    if (navLinks) {
        navLinks.classList.remove('active');
    }
}

/**
 * Обновление активного пункта меню при скролле
 */
function updateActiveNavLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id') || '';
        }
    });
    
    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Обновление отображения текущего слайда
 */
function updateSlideDisplay() {
    if (currentSlideEl) {
        currentSlideEl.textContent = currentSlide.toString();
    }
}

/**
 * Показать предыдущий слайд
 */
function showPrevSlide() {
    currentSlide = currentSlide > 1 ? currentSlide - 1 : totalSlides;
    updateSlideDisplay();
    // Здесь можно добавить логику для реальной галереи
}

/**
 * Показать следующий слайд
 */
function showNextSlide() {
    currentSlide = currentSlide < totalSlides ? currentSlide + 1 : 1;
    updateSlideDisplay();
    // Здесь можно добавить логику для реальной галереи
}

/**
 * Инициализация галереи
 */
function initGallery() {
    if (totalSlidesEl) {
        totalSlidesEl.textContent = totalSlides.toString();
    }
    updateSlideDisplay();
}

/**
 * Инициализация всех обработчиков событий
 */
function initEventListeners() {
    // Переключение темы
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Переключение меню
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    // Закрытие меню при клике на ссылку
    navLinksAll.forEach(link => {
        link.addEventListener('click', closeMenuOnClick);
    });
    
    // Навигация по галерее
    if (prevBtn) {
        prevBtn.addEventListener('click', showPrevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', showNextSlide);
    }
    
    // Обновление активного пункта меню при скролле
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Плавный скролл для всех внутренних ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
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
    
    // Анимация появления элементов при скролле
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
    
    // Наблюдаем за элементами, которые нужно анимировать
    document.querySelectorAll('.history-card, .timeline-item, .fact-card').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Добавление CSS для анимаций
 */
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
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
    document.head.appendChild(style);
}

/**
 * Инициализация расширяемых карточек timeline
 */
function initTimelineExpand() {
    const timelineItems = document.querySelectorAll('.timeline-item[data-expand]');
    
    timelineItems.forEach(item => {
        const title = item.querySelector('.timeline-content h3');
        const details = item.querySelector('.timeline-details');
        
        if (!title || !details) return;
        
        title.addEventListener('click', function(e) {
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

/**
 * Инициализация при загрузке страницы
 */
function init() {
    initTheme();
    initGallery();
    initEventListeners();
    initTimelineExpand();
    addAnimationStyles();
    updateActiveNavLink(); // Установить активный пункт при загрузке
    
    console.log('Сайт "Тихорецк: Летопись города" успешно загружен!');
}

// Запуск инициализации при полной загрузке DOM
document.addEventListener('DOMContentLoaded', init);