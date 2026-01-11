// Security configuration example
// Скопируйте этот файл в config.js и обновите значения

window._CONFIG = {
  AUTH: {
    ENABLED: true,
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 часа
    MAX_ATTEMPTS: 5,
    LOCKOUT_TIME: 15 * 60 * 1000 // 15 минут
  }
};

// ПРИМЕРЫ:
// Пароль: admin2026
// Хеш SHA-256: 6051fc84a7a0d74c225fb18a496b09952da5642e60723ecae543298edd7d82d6
// Base64: NjA1MWZjODRhN2EwZDc0YzIyNWZiMThhNDk2YjA5OTUyZGE1NjQyZTYwNzIzZWNhZTU0MzI5OGVkZDdkODJkNg==

// ИНСТРУКЦИЯ:
// 1. Откройте консоль браузера (F12)
// 2. Выполните: CryptoJS.SHA256('ваш_пароль').toString()
// 3. Получите хеш, затем закодируйте: btoa('хеш')
// 4. Вставьте закодированное значение ниже

window._AUTH_HASH = function() {
  return atob('НА_ЭТОМ_МЕСТЕ_ВАШЕ_ЗАКОДИРОВАННОЕ_ЗНАЧЕНИЕ');
};
