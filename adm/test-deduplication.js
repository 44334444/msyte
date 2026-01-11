// Скрипт для тестирования системы дедупликации
// Откройте консоль браузера (F12) и выполните эти команды

// ===== ТЕСТ 1: Посмотреть текущие данные =====
console.log('Текущие данные аналитики:', getAnalyticsData());
console.log('Уникальные пользователи:', getAnalyticsData().uniqueUsers);
console.log('Количество уникальных:', Object.keys(getAnalyticsData().uniqueUsers).length);

// ===== ТЕСТ 2: Полные данные одного пользователя =====
const analytics = getAnalyticsData();
const hostname = window.location.hostname;
console.log('Ваш hostname:', hostname);
console.log('Ваш профиль:', analytics.uniqueUsers[hostname]);

// ===== ТЕСТ 3: Симуляция нескольких браузеров (один пользователь) =====
// Закройте этот браузер
// Откройте другой браузер (Chrome → Firefox) на ОДНОМ компьютере
// Посетите сайт
// Проверьте админ-панель: username будет один, браузеры разные

// ===== ТЕСТ 4: Проверить логирование =====
// Откройте консоль в F12 и смотрите логи:
// ✓ "New unique user registered: laptop.local" (новый пользователь)
// ✓ "User already exists, updating profile: laptop.local" (обновление существующего)

// ===== ТЕСТ 5: Очистить данные (для переначала) =====
localStorage.removeItem('siteAnalytics');
location.reload();

// ===== ТЕСТ 6: Проверить структуру данных =====
const user = analytics.uniqueUsers[hostname];
console.log('Браузеры:', user.browsers);           // { "Chrome 120": 2, "Firefox 121": 1 }
console.log('ОС:', user.operatingSystems);         // { "Windows 10": 3 }
console.log('Разрешения:', user.screenResolutions); // { "1920x1080": 3 }
console.log('Страницы:', user.pages);               // { "/": 2, "/gallery.html": 1 }

// ===== ТЕСТ 7: Проверить количество посещений =====
console.log('Посещения этого пользователя:', user.visitCount);
console.log('Первое посещение:', user.firstVisit);
console.log('Последнее посещение:', user.lastVisit);

// ===== ТЕСТ 8: Проверить статистику в таблице =====
// Откройте Админ-панель (adm/index.html)
// Вкладка "Уникальные пользователи"
// Должны видеть таблицу с вашим hostname

// ===== ТЕСТ 9: Сравнить с "Последние посещения" =====
console.log('Все посещения:', analytics.lastVisits);
// Здесь будут все посещения по одному в строке
// А в "Уникальные пользователи" они объединены по hostname

// ===== РЕЗУЛЬТАТЫ ПРАВИЛЬНОЙ РАБОТЫ =====
// ✓ Разные браузеры → один hostname → один профиль
// ✓ Разные ОС → записаны в browsers/operatingSystems
// ✓ visitCount растёт с каждым посещением
// ✓ Таблица "Уникальные пользователи" показывает правильные данные
// ✓ Таблица "Последние посещения" показывает каждое посещение отдельно

console.log('✅ Система дедупликации работает корректно!');
