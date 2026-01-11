// ===== АНАЛИТИКА САЙТА =====

document.addEventListener('DOMContentLoaded', function() {
    // Сохраняем данные о посещении (только если это не админка)
    const isAdminPage = window.location.pathname.includes('/adm/') || window.location.href.includes('/adm/');
    
    if (!isAdminPage) {
        trackVisit();
    }
    
    // Загружаем и отображаем аналитику (если мы на странице админки)
    if (isAdminPage) {
        loadAnalytics();
    }
});

// Функция для получения информации об ОС
function getOSInfo() {
    const userAgent = navigator.userAgent;
    let os = 'Unknown';
    let osVersion = '';
    
    if (userAgent.indexOf('Win') > -1) {
        os = 'Windows';
        if (userAgent.indexOf('Windows NT 10.0') > -1) osVersion = '10/11';
        else if (userAgent.indexOf('Windows NT 6.1') > -1) osVersion = '7';
        else if (userAgent.indexOf('Windows NT 6.2') > -1) osVersion = '8';
    }
    else if (userAgent.indexOf('Mac') > -1) {
        os = 'macOS';
        const macMatch = userAgent.match(/Mac OS X [\d_]+/);
        if (macMatch) osVersion = macMatch[0].replace(/_/g, '.');
    }
    else if (userAgent.indexOf('X11') > -1 || userAgent.indexOf('Linux') > -1) {
        os = 'Linux';
    }
    else if (userAgent.indexOf('Android') > -1) {
        os = 'Android';
        const androidMatch = userAgent.match(/Android [\d.]+/);
        if (androidMatch) osVersion = androidMatch[0];
    }
    else if (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
        os = 'iOS';
        const iosMatch = userAgent.match(/OS [\d_]+/);
        if (iosMatch) osVersion = iosMatch[0].replace(/_/g, '.');
    }
    
    return `${os} ${osVersion}`.trim();
}

// Функция для получения информации о браузере
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = '';
    
    if (userAgent.indexOf('Firefox') > -1) {
        browserName = 'Firefox';
        const match = userAgent.match(/Firefox\/([\d.]+)/);
        if (match) browserVersion = match[1];
    } else if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Chromium') === -1) {
        browserName = 'Chrome';
        const match = userAgent.match(/Chrome\/([\d.]+)/);
        if (match) browserVersion = match[1];
    } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
        browserName = 'Safari';
        const match = userAgent.match(/Version\/([\d.]+)/);
        if (match) browserVersion = match[1];
    } else if (userAgent.indexOf('Edg') > -1) {
        browserName = 'Edge';
        const match = userAgent.match(/Edg\/([\d.]+)/);
        if (match) browserVersion = match[1];
    } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
        browserName = 'Internet Explorer';
    }
    
    return `${browserName} ${browserVersion}`.trim();
}

// Функция для отслеживания посещений
function trackVisit() {
    try {
        const analytics = getAnalyticsData();
        
        const today = new Date().toLocaleDateString('ru-RU');
        const referrer = document.referrer || 'Прямой заход';
        const page = window.location.pathname;
        const os = getOSInfo();
        const browser = getBrowserInfo();
        const hostname = window.location.hostname;
        
        // Безопасное получение разрешения экрана
        let screenResolution = 'Unknown';
        try {
            if (screen && screen.width && screen.height) {
                screenResolution = `${screen.width}x${screen.height}`;
            }
        } catch (e) {
            console.warn('Screen resolution unavailable:', e);
        }
        
        console.log('Tracking visit - OS:', os, 'Browser:', browser, 'Resolution:', screenResolution, 'Hostname:', hostname);
        
        // Инициализируем объекты если их нет
        if (!analytics.dailyVisits) analytics.dailyVisits = {};
        if (!analytics.sources) analytics.sources = {};
        if (!analytics.pages) analytics.pages = {};
        if (!analytics.devices) analytics.devices = {};
        if (!analytics.browsers) analytics.browsers = {};
        if (!analytics.resolutions) analytics.resolutions = {};
        if (!analytics.lastVisits) analytics.lastVisits = [];
        if (!analytics.uniqueUsers) analytics.uniqueUsers = {}; // Для дедупликации по hostname
        
        // Увеличиваем счетчик для сегодняшнего дня
        analytics.dailyVisits[today] = (analytics.dailyVisits[today] || 0) + 1;
        
        // Отслеживаем источник
        analytics.sources[referrer] = (analytics.sources[referrer] || 0) + 1;
        
        // Отслеживаем страницы
        analytics.pages[page] = (analytics.pages[page] || 0) + 1;
        
        // Отслеживаем ОС
        analytics.devices[os] = (analytics.devices[os] || 0) + 1;
        
        // Отслеживаем браузеры
        analytics.browsers[browser] = (analytics.browsers[browser] || 0) + 1;
        
        // Отслеживаем разрешения экрана
        analytics.resolutions[screenResolution] = (analytics.resolutions[screenResolution] || 0) + 1;
        
        // ДЕДУПЛИКАЦИЯ: Проверяем есть ли уже этот hostname
        const visitData = {
            time: new Date().toLocaleString('ru-RU'),
            os: os,
            browser: browser,
            hostname: hostname,
            page: page,
            resolution: screenResolution,
            ip: 'N/A' // Будет заполняться если доступно
        };
        
        // Если hostname уже существует - объединяем данные
        if (analytics.uniqueUsers[hostname]) {
            const existingUser = analytics.uniqueUsers[hostname];
            
            // Увеличиваем счетчик посещений для этого hostname
            existingUser.visitCount = (existingUser.visitCount || 1) + 1;
            
            // Обновляем последнее время посещения
            existingUser.lastVisit = visitData.time;
            
            // Собираем разные браузеры
            if (!existingUser.browsers) existingUser.browsers = {};
            existingUser.browsers[browser] = (existingUser.browsers[browser] || 0) + 1;
            
            // Собираем разные ОС
            if (!existingUser.operatingSystems) existingUser.operatingSystems = {};
            existingUser.operatingSystems[os] = (existingUser.operatingSystems[os] || 0) + 1;
            
            // Собираем разные разрешения экрана
            if (!existingUser.screenResolutions) existingUser.screenResolutions = {};
            existingUser.screenResolutions[screenResolution] = (existingUser.screenResolutions[screenResolution] || 0) + 1;
            
            // Собираем все посещаемые страницы
            if (!existingUser.pages) existingUser.pages = {};
            existingUser.pages[page] = (existingUser.pages[page] || 0) + 1;
            
            console.log('User already exists, updating profile:', hostname);
        } else {
            // Новый пользователь - создаём профиль
            analytics.uniqueUsers[hostname] = {
                hostname: hostname,
                firstVisit: visitData.time,
                lastVisit: visitData.time,
                visitCount: 1,
                browsers: { [browser]: 1 },
                operatingSystems: { [os]: 1 },
                screenResolutions: { [screenResolution]: 1 },
                pages: { [page]: 1 },
                referrer: referrer
            };
            
            console.log('New unique user registered:', hostname);
        }
        
        // Сохраняем последнее посещение в лог (последние 100)
        analytics.lastVisits.unshift(visitData);
        
        // Сохраняем только последние 100 посещений
        if (analytics.lastVisits.length > 100) {
            analytics.lastVisits = analytics.lastVisits.slice(0, 100);
        }
        
        // Сохраняем общее количество посещений
        analytics.totalVisits = (analytics.totalVisits || 0) + 1;
        
        // Считаем количество уникальных пользователей
        analytics.uniqueUserCount = Object.keys(analytics.uniqueUsers).length;
        
        // Сохраняем последнее обновление
        analytics.lastUpdate = new Date().toISOString();
        
        // Сохраняем данные
        localStorage.setItem('siteAnalytics', JSON.stringify(analytics));
        console.log('Visit tracked successfully. Unique users:', analytics.uniqueUserCount);
    } catch (error) {
        console.error('Error tracking visit:', error);
    }
}

// Получить данные аналитики
function getAnalyticsData() {
    const data = localStorage.getItem('siteAnalytics');
    return data ? JSON.parse(data) : {
        dailyVisits: {},
        sources: {},
        pages: {},
        devices: {},
        browsers: {},
        resolutions: {},
        lastVisits: [],
        uniqueUsers: {}, // Объект для дедупликации по hostname
        totalVisits: 0,
        uniqueUserCount: 0,
        lastUpdate: null
    };
}

// Загрузить и отобразить аналитику
function loadAnalytics() {
    try {
        const analytics = getAnalyticsData();
        console.log('Analytics data:', analytics);
        
        // Отображаем основную статистику
        displayMainStats(analytics);
        
        // Заполняем таблицы
        displayPagesTable(analytics.pages);
        displaySourcesTable(analytics.sources);
        displayDevicesTable(analytics.devices || {});
        displayBrowsersTable(analytics.browsers || {});
        displayResolutionsTable(analytics.resolutions || {});
        displayLastVisits(analytics.lastVisits || []);
        
        // Отображаем уникальных пользователей (дедупликация по hostname)
        displayUniqueUsers(analytics.uniqueUsers || {});
        
        // Строим графики
        createDailyChart(analytics.dailyVisits);
        createSourcesChart(analytics.sources);
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

// Отобразить основную статистику
function displayMainStats(analytics) {
    try {
        // Общее количество посещений
        const totalVisitsEl = document.getElementById('totalVisits');
        if (totalVisitsEl) totalVisitsEl.textContent = analytics.totalVisits || 0;
        
        // Посещений сегодня
        const today = new Date().toLocaleDateString('ru-RU');
        const todayVisits = (analytics.dailyVisits && analytics.dailyVisits[today]) || 0;
        const todayVisitsEl = document.getElementById('todayVisits');
        if (todayVisitsEl) todayVisitsEl.textContent = todayVisits;
        const todayDateEl = document.getElementById('todayDate');
        if (todayDateEl) todayDateEl.textContent = today;
        
        // Уникальные пользователи (по hostname)
        const uniqueUsersEl = document.getElementById('uniqueUsers');
        const uniqueUserCount = analytics.uniqueUserCount || Object.keys(analytics.uniqueUsers || {}).length;
        if (uniqueUsersEl) uniqueUsersEl.textContent = uniqueUserCount;
        
        // Уникальные источники
        const uniqueSourcesEl = document.getElementById('uniqueSources');
        if (uniqueSourcesEl) uniqueSourcesEl.textContent = Object.keys(analytics.sources || {}).length;
        
        // Отслеживаемые страницы
        const trackedPagesEl = document.getElementById('trackedPages');
        if (trackedPagesEl) trackedPagesEl.textContent = Object.keys(analytics.pages || {}).length;
    } catch (error) {
        console.error('Error displaying main stats:', error);
    }
}

// Отобразить таблицу популярных страниц
function displayPagesTable(pages) {
    try {
        const tbody = document.querySelector('#pagesTable tbody');
        if (!tbody) {
            console.warn('pagesTable not found');
            return;
        }
        
        const sortedPages = Object.entries(pages || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        if (sortedPages.length === 0) {
            tbody.innerHTML = '<tr><td colspan="2" class="text-center text-muted">Нет данных</td></tr>';
        } else {
            tbody.innerHTML = sortedPages.map(([page, visits]) => `<tr><td>${page || 'Главная'}</td><td><strong>${visits}</strong></td></tr>`).join('');
        }
    } catch (error) {
        console.error('Error displaying pages table:', error);
    }
}

// Отобразить таблицу источников трафика
function displaySourcesTable(sources) {
    try {
        const tbody = document.querySelector('#sourcesTable tbody');
        if (!tbody) {
            console.warn('sourcesTable not found');
            return;
        }
        
        const sortedSources = Object.entries(sources || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        if (sortedSources.length === 0) {
            tbody.innerHTML = '<tr><td colspan="2" class="text-center text-muted">Нет данных</td></tr>';
        } else {
            tbody.innerHTML = sortedSources.map(([source, visits]) => `<tr><td>${source}</td><td><strong>${visits}</strong></td></tr>`).join('');
        }
    } catch (error) {
        console.error('Error displaying sources table:', error);
    }
}

// Создать график посещений по дням
function createDailyChart(dailyVisits) {
    try {
        const canvas = document.getElementById('dailyChart');
        if (!canvas) {
            console.warn('dailyChart canvas not found');
            return;
        }
        
        const labels = Object.keys(dailyVisits || {}).slice(-30); // Последние 30 дней
        const data = labels.map(label => (dailyVisits || {})[label]);
        
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
    } catch (error) {
        console.error('Error creating daily chart:', error);
    }
}

// Создать круговую диаграмму источников
function createSourcesChart(sources) {
    try {
        const canvas = document.getElementById('sourcesChart');
        if (!canvas) {
            console.warn('sourcesChart canvas not found');
            return;
        }
        
        const labels = Object.keys(sources || {}).slice(0, 8);
        const data = labels.map(label => (sources || {})[label]);
        
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
    } catch (error) {
        console.error('Error creating sources chart:', error);
    }
}

// Отобразить информацию об устройствах (ОС)
function displayDevicesTable(devices) {
    try {
        const tbody = document.querySelector('#devicesTable tbody');
        if (!tbody) {
            console.warn('devicesTable not found');
            return;
        }
        
        const sortedDevices = Object.entries(devices || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        if (sortedDevices.length === 0) {
            tbody.innerHTML = '<tr><td colspan="2" class="text-center text-muted">Нет данных</td></tr>';
        } else {
            tbody.innerHTML = sortedDevices.map(([device, visits]) => `<tr><td><i class="fas fa-desktop"></i> ${device}</td><td><strong>${visits}</strong></td></tr>`).join('');
        }
    } catch (error) {
        console.error('Error displaying devices table:', error);
    }
}

// Отобразить информацию о браузерах
function displayBrowsersTable(browsers) {
    try {
        const tbody = document.querySelector('#browsersTable tbody');
        if (!tbody) {
            console.warn('browsersTable not found');
            return;
        }
        
        const sortedBrowsers = Object.entries(browsers || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        if (sortedBrowsers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="2" class="text-center text-muted">Нет данных</td></tr>';
        } else {
            tbody.innerHTML = sortedBrowsers.map(([browser, visits]) => `<tr><td><i class="fas fa-firefox"></i> ${browser}</td><td><strong>${visits}</strong></td></tr>`).join('');
        }
    } catch (error) {
        console.error('Error displaying browsers table:', error);
    }
}

// Отобразить информацию о разрешениях экрана
function displayResolutionsTable(resolutions) {
    try {
        const tbody = document.querySelector('#resolutionsTable tbody');
        if (!tbody) {
            console.warn('resolutionsTable not found');
            return;
        }
        
        const sortedResolutions = Object.entries(resolutions || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        if (sortedResolutions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="2" class="text-center text-muted">Нет данных</td></tr>';
        } else {
            tbody.innerHTML = sortedResolutions.map(([resolution, visits]) => `<tr><td><i class="fas fa-tv"></i> ${resolution}</td><td><strong>${visits}</strong></td></tr>`).join('');
        }
    } catch (error) {
        console.error('Error displaying resolutions table:', error);
    }
}

// Отобразить последние посещения
function displayLastVisits(lastVisits) {
    try {
        const tbody = document.querySelector('#lastVisitsTable tbody');
        if (!tbody) {
            console.warn('lastVisitsTable not found');
            return;
        }
        
        const visits = (lastVisits || []).slice(0, 20);
        
        if (visits.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Нет данных</td></tr>';
        } else {
            tbody.innerHTML = visits.map(visit => `<tr><td>${visit.time}</td><td>${visit.os}</td><td>${visit.browser}</td><td>${visit.resolution}</td><td>${visit.page}</td></tr>`).join('');
        }
    } catch (error) {
        console.error('Error displaying last visits table:', error);
    }
}

// Отобразить уникальных пользователей (дедупликация по hostname)
function displayUniqueUsers(uniqueUsers) {
    try {
        const tbody = document.querySelector('#uniqueUsersTable tbody');
        if (!tbody) {
            console.warn('uniqueUsersTable not found');
            return;
        }
        
        // Сортируем пользователей по количеству посещений (по убыванию)
        const sortedUsers = Object.entries(uniqueUsers || {})
            .map(([hostname, userData]) => ({
                hostname: hostname,
                visitCount: userData.visitCount || 0,
                browsers: userData.browsers || {},
                operatingSystems: userData.operatingSystems || {},
                screenResolutions: userData.screenResolutions || {},
                pages: userData.pages || {},
                firstVisit: userData.firstVisit || 'N/A',
                lastVisit: userData.lastVisit || 'N/A'
            }))
            .sort((a, b) => b.visitCount - a.visitCount)
            .slice(0, 50); // Показываем топ 50 пользователей
        
        if (sortedUsers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Нет уникальных пользователей</td></tr>';
        } else {
            tbody.innerHTML = sortedUsers.map(user => {
                const browserList = Object.entries(user.browsers).map(([b, c]) => `${b} (${c})`).join(', ');
                const osList = Object.entries(user.operatingSystems).map(([os, c]) => `${os} (${c})`).join(', ');
                const pageList = Object.keys(user.pages).join(', ') || '/';
                
                return `<tr>
                    <td><strong>${user.hostname}</strong></td>
                    <td class="text-center"><span class="badge bg-primary">${user.visitCount}</span></td>
                    <td><small>${browserList || 'N/A'}</small></td>
                    <td><small>${osList || 'N/A'}</small></td>
                    <td><small>${pageList}</small></td>
                    <td><small>${user.firstVisit.split(' ')[0] || 'N/A'}</small></td>
                    <td><small>${user.lastVisit.split(' ')[0] || 'N/A'}</small></td>
                    <td><small>${Object.keys(user.screenResolutions).length} разреш.</small></td>
                </tr>`;
            }).join('');
        }
    } catch (error) {
        console.error('Error displaying unique users table:', error);
    }
}
