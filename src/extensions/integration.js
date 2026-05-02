/**
 * Integration Module
 * Tích hợp tất cả các extension vào game mà không sửa code cũ
 */

import { initInfiniteMap, updateMapChunks, getCollisionObjects, checkCollision } from './infiniteMap.js';
import { BotManager } from './botSystem.js';
import { currencyManager, earnReward } from './currency.js';
import { shop } from './shop.js';
import { mobileOptimizer, optimizeForDevice } from './mobileOptimization.js';
import { LobbyUI } from './lobby.js';
import { GAME_CONFIG } from '../constants.js';

let gameState = {
  infiniteMapEnabled: GAME_CONFIG.INFINITE_MAP_ENABLED,
  botsEnabled: false,
  shopEnabled: true,
  lobbyEnabled: false,
  
  // References
  scene: null,
  camera: null,
  renderer: null,
  player: null,
  
  // Managers
  botManager: null,
  lobbyUI: null,
  
  // Game config
  gameConfig: null,
  
  // Game stats
  stats: {
    kills: 0,
    deaths: 0,
    score: 0,
    startTime: 0,
    endTime: 0,
  },
};

/**
 * Khởi tạo tất cả extensions
 */
export function initializeExtensions(scene, camera, renderer, player) {
  gameState.scene = scene;
  gameState.camera = camera;
  gameState.renderer = renderer;
  gameState.player = player;
  
  console.log('🎮 Initializing Game Extensions...');
  
  // Initialize infinite map
  if (gameState.infiniteMapEnabled) {
    initInfiniteMap(scene, camera, renderer);
    console.log('✓ Infinite Map initialized');
  }
  
  // Initialize mobile optimization
  optimizeForDevice(renderer);
  console.log('✓ Mobile Optimization initialized');
  
  // Initialize bot manager
  gameState.botManager = new BotManager();
  console.log('✓ Bot Manager initialized');
  
  // Initialize currency
  console.log(`✓ Currency System initialized (Balance: ${currencyManager.getBalance()})`);
  
  // Initialize shop
  console.log(`✓ Shop System initialized (${shop.items.size} items)`);
  
  // Setup event listeners
  setupEventListeners();
  
  console.log('✅ All extensions initialized');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Bot died event
  window.addEventListener('botDied', (e) => {
    const { botId, team } = e.detail;
    console.log(`Bot ${botId} from team ${team} died`);
    gameState.stats.kills++;
  });
  
  // Bot shoot event
  window.addEventListener('botShoot', (e) => {
    const { botId, position, direction } = e.detail;
    // Handle bot shooting
  });
  
  // Item purchased event
  window.addEventListener('itemPurchased', (e) => {
    console.log(`Item purchased: ${e.detail.item.name}`);
  });
  
  // Item equipped event
  window.addEventListener('itemEquipped', (e) => {
    console.log(`Item equipped: ${e.detail.item.name}`);
  });
  
  // Currency changed event
  window.addEventListener('currencyChanged', (e) => {
    console.log(`Balance updated: ${e.detail.balance}`);
  });
}

/**
 * Update game logic mỗi frame
 */
export function updateExtensions(dt) {
  // Update infinite map
  if (gameState.infiniteMapEnabled && gameState.player) {
    updateMapChunks(gameState.player.position);
  }
  
  // Update bots
  if (gameState.botManager && gameState.botsEnabled) {
    const colliders = getCollisionObjects();
    gameState.botManager.update(dt, gameState.player, colliders);
  }
  
  // Check player collision with obstacles
  if (gameState.infiniteMapEnabled && gameState.player) {
    const playerRadius = 1.9;
    if (checkCollision(gameState.player.position, playerRadius)) {
      // Handle collision - push player back
      // This would be handled by the main game logic
    }
  }
}

/**
 * Tạo lobby UI
 */
export function createLobby(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container ${containerId} not found`);
    return null;
  }
  
  gameState.lobbyUI = new LobbyUI(container);
  gameState.lobbyEnabled = true;
  
  // Listen for game start
  window.addEventListener('lobbyStartGame', (e) => {
    gameState.gameConfig = e.detail;
    gameState.botsEnabled = true;
    gameState.stats.startTime = Date.now();
    
    // Create bots
    const botCount = e.detail.botCount;
    const teamSize = e.detail.teamSize;
    const difficulty = e.detail.difficulty;
    
    // Create player team
    gameState.botManager.createBots(botCount, e.detail.playerTeam, difficulty);
    
    // Create enemy team
    const enemyTeam = e.detail.playerTeam === GAME_CONFIG.TEAM_RED 
      ? GAME_CONFIG.TEAM_BLUE 
      : GAME_CONFIG.TEAM_RED;
    gameState.botManager.createBots(teamSize, enemyTeam, difficulty);
    
    console.log(`🎮 Game started with ${botCount} bots per team, difficulty: ${difficulty}`);
  });
  
  return gameState.lobbyUI;
}

/**
 * Thêm bot vào game
 */
export function addBots(count, team, difficulty = 'normal') {
  if (!gameState.botManager) {
    console.warn('Bot Manager not initialized');
    return [];
  }
  
  gameState.botsEnabled = true;
  return gameState.botManager.createBots(count, team, difficulty);
}

/**
 * Damage bot
 */
export function damageBot(botId, amount) {
  if (gameState.botManager) {
    gameState.botManager.damageBot(botId, amount);
  }
}

/**
 * Get bot info
 */
export function getBotInfo(botId) {
  if (gameState.botManager) {
    return gameState.botManager.getBot(botId);
  }
  return null;
}

/**
 * Get team stats
 */
export function getTeamStats(team) {
  if (!gameState.botManager) return null;
  
  const bots = gameState.botManager.getBotsByTeam(team);
  const alive = gameState.botManager.getAliveBotsCount(team);
  
  return {
    team,
    totalBots: bots.length,
    aliveBots: alive,
    deadBots: bots.length - alive,
    totalHealth: bots.reduce((sum, bot) => sum + bot.health, 0),
  };
}

/**
 * Xử lý khi người chơi giết bot
 */
export function handleBotKilled(botId, reward = 100) {
  earnReward(reward, `kill_bot_${botId}`);
  gameState.stats.kills++;
  console.log(`Bot ${botId} killed! Earned ${reward} credits`);
}

/**
 * Mở cửa hàng
 */
export function openShop() {
  const shopContainer = document.getElementById('shopPanel');
  if (!shopContainer) {
    console.warn('Shop panel not found');
    return;
  }
  
  renderShop(shopContainer);
}

/**
 * Render cửa hàng
 */
function renderShop(container) {
  const items = shop.getAvailableItems();
  const ownedItems = shop.getOwnedItems();
  
  let html = `
    <div class="shop-panel">
      <h2>SHOP</h2>
      <div class="shop-header">
        <span>Balance: ${currencyManager.getBalance()} Credits</span>
      </div>
      
      <div class="shop-tabs">
        <button class="shop-tab active" data-category="all">All</button>
        <button class="shop-tab" data-category="skin">Skins</button>
        <button class="shop-tab" data-category="upgrade">Upgrades</button>
        <button class="shop-tab" data-category="consumable">Consumables</button>
      </div>
      
      <div class="shop-items">
  `;
  
  items.forEach(item => {
    html += `
      <div class="shop-item" data-item-id="${item.id}">
        <div class="item-icon">${item.icon}</div>
        <div class="item-info">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="item-price">${item.price} Credits</div>
        </div>
        <button class="item-buy-btn" data-item-id="${item.id}">Buy</button>
      </div>
    `;
  });
  
  html += `
      </div>
      
      <div class="owned-items">
        <h3>Owned Items (${ownedItems.length})</h3>
        <div class="owned-list">
  `;
  
  ownedItems.forEach(item => {
    html += `
      <div class="owned-item">
        <span>${item.icon} ${item.name}</span>
        ${item.type === 'skin' ? `<button class="equip-btn" data-item-id="${item.id}">Equip</button>` : ''}
      </div>
    `;
  });
  
  html += `
        </div>
      </div>
      
      <button class="close-shop-btn">Close</button>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Attach event listeners
  container.querySelectorAll('.item-buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemId = e.target.dataset.itemId;
      const result = shop.purchaseItem(itemId);
      if (result.success) {
        alert(`Purchased successfully!`);
        renderShop(container); // Re-render
      } else {
        alert(`Purchase failed: ${result.message}`);
      }
    });
  });
  
  container.querySelectorAll('.equip-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemId = e.target.dataset.itemId;
      shop.equipItem(itemId);
      renderShop(container); // Re-render
    });
  });
  
  container.querySelector('.close-shop-btn').addEventListener('click', () => {
    container.innerHTML = '';
  });
}

/**
 * End game
 */
export function endGame() {
  gameState.stats.endTime = Date.now();
  gameState.botsEnabled = false;
  
  const duration = (gameState.stats.endTime - gameState.stats.startTime) / 1000;
  console.log(`Game ended. Duration: ${duration}s, Kills: ${gameState.stats.kills}`);
  
  return gameState.stats;
}

/**
 * Lấy game state
 */
export function getGameState() {
  return { ...gameState };
}

/**
 * Lấy game stats
 */
export function getGameStats() {
  return { ...gameState.stats };
}

/**
 * Reset extensions
 */
export function resetExtensions() {
  if (gameState.botManager) {
    gameState.botManager.dispose();
    gameState.botManager = new BotManager();
  }
  
  gameState.botsEnabled = false;
  gameState.gameConfig = null;
  gameState.stats = {
    kills: 0,
    deaths: 0,
    score: 0,
    startTime: 0,
    endTime: 0,
  };
  
  console.log('Extensions reset');
}

/**
 * Cleanup
 */
export function disposeExtensions() {
  if (gameState.botManager) {
    gameState.botManager.dispose();
  }
  
  console.log('Extensions disposed');
}

/**
 * Export stats to CSV
 */
export function exportStatsToCSV() {
  const stats = getGameStats();
  const csv = `Stat,Value\nKills,${stats.kills}\nDeaths,${stats.deaths}\nScore,${stats.score}\nDuration,${(stats.endTime - stats.startTime) / 1000}s`;
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `game-stats-${Date.now()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}
