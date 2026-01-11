// Security configuration - KEEP THIS FILE SECURE
// Используйте переменные окружения в продакшене
window._CONFIG = {
  AUTH: {
    ENABLED: true,
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 часа
    MAX_ATTEMPTS: 5,
    LOCKOUT_TIME: 15 * 60 * 1000 // 15 минут
  }
};

// Не раскрывайте это значение!
// В продакшене используйте переменные окружения или server-side проверку
window._AUTH_HASH = function() {
  // Возвращаем хеш с обфускацией
  return atob('NjA1MWZjODRhN2EwZDc0YzIyNWZiMThhNDk2YjA5OTUyZGE1NjQyZTYwNzIzZWNhZTU0MzI5OGVkZDdkODJkNg==');
};
