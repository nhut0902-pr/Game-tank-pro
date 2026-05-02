/**
 * Storage Utilities
 * Quản lý localStorage và sessionStorage
 */

import { STORAGE_KEYS } from '../constants.js';

/**
 * Lưu dữ liệu vào localStorage
 */
export function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
    return false;
  }
}

/**
 * Tải dữ liệu từ localStorage
 */
export function loadFromLocalStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
    return defaultValue;
  }
}

/**
 * Xóa dữ liệu từ localStorage
 */
export function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Failed to remove from localStorage:', e);
    return false;
  }
}

/**
 * Clear tất cả dữ liệu game
 */
export function clearGameData() {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (e) {
    console.error('Failed to clear game data:', e);
    return false;
  }
}

/**
 * Lưu player stats
 */
export function savePlayerStats(stats) {
  return saveToLocalStorage(STORAGE_KEYS.STATS, {
    ...stats,
    lastSaved: Date.now(),
  });
}

/**
 * Tải player stats
 */
export function loadPlayerStats() {
  return loadFromLocalStorage(STORAGE_KEYS.STATS, {
    totalKills: 0,
    totalDeaths: 0,
    totalScore: 0,
    gamesPlayed: 0,
    lastSaved: 0,
  });
}

/**
 * Lưu game settings
 */
export function saveGameSettings(settings) {
  return saveToLocalStorage(STORAGE_KEYS.SETTINGS, {
    ...settings,
    lastSaved: Date.now(),
  });
}

/**
 * Tải game settings
 */
export function loadGameSettings() {
  return loadFromLocalStorage(STORAGE_KEYS.SETTINGS, {
    volume: 1.0,
    musicVolume: 0.7,
    sfxVolume: 1.0,
    quality: 'high',
    antiAlias: true,
    shadows: true,
    lastSaved: 0,
  });
}

/**
 * Export game data
 */
export function exportGameData() {
  return {
    playerData: loadFromLocalStorage(STORAGE_KEYS.PLAYER_DATA),
    stats: loadPlayerStats(),
    settings: loadGameSettings(),
    inventory: loadFromLocalStorage(STORAGE_KEYS.INVENTORY),
    exportedAt: Date.now(),
  };
}

/**
 * Import game data
 */
export function importGameData(data) {
  try {
    if (data.playerData) {
      saveToLocalStorage(STORAGE_KEYS.PLAYER_DATA, data.playerData);
    }
    if (data.stats) {
      savePlayerStats(data.stats);
    }
    if (data.settings) {
      saveGameSettings(data.settings);
    }
    if (data.inventory) {
      saveToLocalStorage(STORAGE_KEYS.INVENTORY, data.inventory);
    }
    return true;
  } catch (e) {
    console.error('Failed to import game data:', e);
    return false;
  }
}

/**
 * Check localStorage availability
 */
export function isLocalStorageAvailable() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get storage size
 */
export function getStorageSize() {
  let size = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      size += localStorage[key].length + key.length;
    }
  }
  return size;
}

/**
 * Get storage usage percentage
 */
export function getStorageUsagePercent() {
  const size = getStorageSize();
  const maxSize = 5242880; // 5MB
  return (size / maxSize) * 100;
}
