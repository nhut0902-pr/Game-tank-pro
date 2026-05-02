/**
 * Game Constants
 * Các hằng số dùng chung cho toàn game
 */

export const GAME_CONFIG = {
  // Map
  INFINITE_MAP_ENABLED: true,
  CHUNK_SIZE: 100,
  RENDER_DISTANCE: 3, // chunks
  
  // Teams
  TEAM_RED: 'red',
  TEAM_BLUE: 'blue',
  TEAM_COLORS: {
    red: 0xff0000,
    blue: 0x0000ff,
  },
  
  // Players
  DEFAULT_TEAM_SIZE: 5,
  DEFAULT_BOT_COUNT: 4, // 1 human + 4 bots
  MAX_PLAYERS_PER_TEAM: 10,
  
  // Currency
  CURRENCY_NAME: 'Credits',
  CURRENCY_SYMBOL: '₳',
  STARTING_CURRENCY: 1000,
  
  // Shop Items
  SHOP_ITEMS: {
    TANK_SKIN_GOLD: { id: 'skin_gold', name: 'Gold Tank', price: 500, type: 'skin' },
    TANK_SKIN_SILVER: { id: 'skin_silver', name: 'Silver Tank', price: 300, type: 'skin' },
    TURBO_BOOST: { id: 'turbo', name: 'Speed Boost', price: 200, type: 'upgrade' },
    ARMOR_UPGRADE: { id: 'armor', name: 'Armor +20%', price: 400, type: 'upgrade' },
  },
  
  // Mobile
  JOYSTICK_RADIUS: 58,
  JOYSTICK_DEAD_ZONE: 0.15,
  
  // Performance
  TARGET_FPS: 60,
  MOBILE_PIXEL_RATIO_CAP: 1.35,
  DESKTOP_PIXEL_RATIO_CAP: 1.75,
};

export const BOT_CONFIG = {
  // AI Behavior
  DETECTION_RANGE: 50,
  ATTACK_RANGE: 40,
  PATROL_RANGE: 60,
  
  // Movement
  BASE_SPEED: 15,
  ROTATION_SPEED: 8,
  
  // Decision Making
  DECISION_INTERVAL: 0.5, // seconds
  REACTION_TIME: 0.2,
  
  // Difficulty Levels
  DIFFICULTY: {
    EASY: { accuracy: 0.4, speed: 0.8, detection: 30 },
    NORMAL: { accuracy: 0.7, speed: 1.0, detection: 50 },
    HARD: { accuracy: 0.95, speed: 1.2, detection: 70 },
  },
};

export const MAP_CONFIG = {
  // Terrain
  TERRAIN_SCALE: 1.0,
  HEIGHT_VARIATION: 15,
  
  // Vegetation
  TREE_DENSITY: 0.3, // trees per chunk
  TREE_HEIGHT_MIN: 3,
  TREE_HEIGHT_MAX: 8,
  
  // Obstacles
  ROCK_DENSITY: 0.2,
  BUILDING_DENSITY: 0.1,
  
  // Biomes
  BIOME_TYPES: ['desert', 'forest', 'mountain', 'urban'],
};

export const UI_CONFIG = {
  // Colors
  PRIMARY_COLOR: '#67e8f9',
  SECONDARY_COLOR: '#facc15',
  DANGER_COLOR: '#ef4444',
  SUCCESS_COLOR: '#10b981',
  
  // Animations
  TRANSITION_DURATION: 0.3,
  FADE_DURATION: 0.2,
};

export const STORAGE_KEYS = {
  PLAYER_DATA: 'game_player_data',
  SETTINGS: 'game_settings',
  INVENTORY: 'game_inventory',
  STATS: 'game_stats',
};
