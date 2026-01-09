// Сбор базовой аналитики
document.addEventListener('DOMContentLoaded', function() {
    // Сохраняем данные о посещении
    trackVisit();
    
    // Загружаем и отображаем аналитику
    loadAnalytics();
});

function trackVisit() {
    const analytics = getAnalyticsData();
    
    const today = new Date().toLocaleDateString();
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
    
    // Сохраняем данные
    localStorage.setItem('siteAnalytics', JSON.stringify(analytics));
}

function getAnalyticsData() {
    const data = localStorage.getItem('siteAnalytics');
    return data ? JSON.parse(data) : {
        dailyVisits: {},
        sources: {},
        pages: {},
        totalVisits: 0
    };
}

function loadAnalytics() {
    const analytics = getAnalyticsData();
    
    // Отображаем общую статистику
    displayStats(analytics);
    
    // Строим графики
    createDailyChart(analytics.dailyVisits);
    createSourcesChart(analytics.sources);
}

function displayStats(analytics) {
    const tableBody = document.querySelector('#statsTable tbody');
    
    const stats = [
        ['Общее количество посещений', analytics.totalVisits],
        ['Уникальных дней', Object.keys(analytics.dailyVisits).length],
        ['Количество источников', Object.keys(analytics.sources).length],
        ['Количество отслеживаемых страниц', Object.keys(analytics.pages).length],
        ['Самая популярная страница', getMostPopularPage(analytics.pages)]
    ];
    
    tableBody.innerHTML = stats.map(stat => `
        <tr>
            <td>${stat[0]}</td>
            <td><strong>${stat[1]}</strong></td>
        </tr>
    `).join('');
}

function getMostPopularPage(pages) {
    let maxVisits = 0;
    let popularPage = 'Нет данных';
    
    for (const [page, visits] of Object.entries(pages)) {
        if (visits > maxVisits) {
            maxVisits = visits;
            popularPage = `${page} (${visits} посещений)`;
        }
    }
    
    return popularPage;
}

function createDailyChart(dailyVisits) {
    const ctx = document.getElementById('dailyChart').getContext('2d');
    const labels = Object.keys(dailyVisits);
    const data = Object.values(dailyVisits);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Посещений в день',
                data: data,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

function createSourcesChart(sources) {
    const ctx = document.getElementById('sourcesChart').getContext('2d');
    const labels = Object.keys(sources);
    const data = Object.values(sources);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)',
                    'rgb(255, 159, 64)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}
