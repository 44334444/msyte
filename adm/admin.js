// ===== АНАЛИТИКА САЙТА =====

document.addEventListener('DOMContentLoaded', function() {
    // Сохраняем данные о посещении (только если это не админка)
    if (!window.location.pathname.includes('/adm/')) {
        trackVisit();
    }
    
    // Загружаем и отображаем аналитику (если мы на странице админки)
    if (window.location.pathname.includes('/adm/index.html')) {
        loadAnalytics();
    }
});

// Функция для отслеживания посещений
function trackVisit() {
    const analytics = getAnalyticsData();
    
    const today = new Date().toLocaleDateString('ru-RU');
    const referrer = document.referrer || 'Прямой заход';
    const page = window.location.pathname;
    
    // Увеличиваем счетчик для сегодняшнего дня
    if (!analytics.dailyVisits[today]) {
        analytics.dailyVisits[today] = 0;
    }
    analytics.dailyVisits[today]++;
    
    // Отслеживаем источник
    if (!analytics.sources[referrer]) {
        analytics.sources[referrer] = 0;
    }
    analytics.sources[referrer]++;
    
    // Отслеживаем страницы
    if (!analytics.pages[page]) {
        analytics.pages[page] = 0;
    }
    analytics.pages[page]++;
    
    // Сохраняем общее количество посещений
    analytics.totalVisits++;
    
    // Сохраняем последнее обновление
    analytics.lastUpdate = new Date().toISOString();
    
    // Сохраняем данные
    localStorage.setItem('siteAnalytics', JSON.stringify(analytics));
}

// Получить данные аналитики
function getAnalyticsData() {
    const data = localStorage.getItem('siteAnalytics');
    return data ? JSON.parse(data) : {
        dailyVisits: {},
        sources: {},
        pages: {},
        totalVisits: 0,
        lastUpdate: null
    };
}

// Загрузить и отобразить аналитику
function loadAnalytics() {
    const analytics = getAnalyticsData();
    
    // Отображаем основную статистику
    displayMainStats(analytics);
    
    // Заполняем таблицы
    displayPagesTable(analytics.pages);
    displaySourcesTable(analytics.sources);
    
    // Строим графики
    createDailyChart(analytics.dailyVisits);
    createSourcesChart(analytics.sources);
}

// Отобразить основную статистику
function displayMainStats(analytics) {
    // Общее количество посещений
    document.getElementById('totalVisits').textContent = analytics.totalVisits;
    
    // Посещений сегодня
    const today = new Date().toLocaleDateString('ru-RU');
    const todayVisits = analytics.dailyVisits[today] || 0;
    document.getElementById('todayVisits').textContent = todayVisits;
    document.getElementById('todayDate').textContent = today;
    
    // Уникальные источники
    document.getElementById('uniqueSources').textContent = Object.keys(analytics.sources).length;
    
    // Отслеживаемые страницы
    document.getElementById('trackedPages').textContent = Object.keys(analytics.pages).length;
}

// Отобразить таблицу популярных страниц
function displayPagesTable(pages) {
    const tbody = document.querySelector('#pagesTable tbody');
    
    // Сортируем страницы по количеству посещений
    const sortedPages = Object.entries(pages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    tbody.innerHTML = sortedPages.map(([page, visits]) => `
        <tr>
            <td>${page || 'Главная'}</td>
            <td><strong>${visits}</strong></td>
        </tr>
    `).join('') || '<tr><td colspan="2" class="text-center text-muted">Нет данных</td></tr>';
}

// Отобразить таблицу источников трафика
function displaySourcesTable(sources) {
    const tbody = document.querySelector('#sourcesTable tbody');
    
    // Сортируем источники по количеству посещений
    const sortedSources = Object.entries(sources)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    tbody.innerHTML = sortedSources.map(([source, visits]) => `
        <tr>
            <td>${source}</td>
            <td><strong>${visits}</strong></td>
        </tr>
    `).join('') || '<tr><td colspan="2" class="text-center text-muted">Нет данных</td></tr>';
}

// Создать график посещений по дням
function createDailyChart(dailyVisits) {
    const canvas = document.getElementById('dailyChart');
    if (!canvas) return;
    
    const labels = Object.keys(dailyVisits).slice(-30); // Последние 30 дней
    const data = labels.map(label => dailyVisits[label]);
    
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Посещений в день',
                data: data,
                borderColor: '#7cb9e8',
                backgroundColor: 'rgba(124, 185, 232, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#7cb9e8',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#b0b0c0'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#b0b0c0'
                    },
                    grid: {
                        color: 'rgba(124, 185, 232, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#b0b0c0'
                    },
                    grid: {
                        color: 'rgba(124, 185, 232, 0.1)'
                    }
                }
            }
        }
    });
}

// Создать круговую диаграмму источников
function createSourcesChart(sources) {
    const canvas = document.getElementById('sourcesChart');
    if (!canvas) return;
    
    const labels = Object.keys(sources).slice(0, 8);
    const data = labels.map(label => sources[label]);
    
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(124, 185, 232, 0.8)',
                    'rgba(157, 91, 139, 0.8)',
                    'rgba(45, 95, 141, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(244, 67, 54, 0.8)',
                    'rgba(33, 150, 243, 0.8)',
                    'rgba(156, 39, 176, 0.8)'
                ],
                borderColor: '#0a0a0f',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#b0b0c0',
                        padding: 15
                    }
                }
            }
        }
    });
}
