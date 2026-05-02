/**
 * Lobby System
 * Giao diện chọn chế độ chơi, số lượng bot, team, v.v.
 */

import { GAME_CONFIG } from '../constants.js';

class LobbyManager {
  constructor() {
    this.gameMode = 'survival';
    this.teamSize = GAME_CONFIG.DEFAULT_TEAM_SIZE;
    this.botCount = GAME_CONFIG.DEFAULT_BOT_COUNT;
    this.difficulty = 'normal';
    this.playerTeam = GAME_CONFIG.TEAM_BLUE;
    this.isReady = false;
    
    this.settings = {
      friendlyFire: false,
      timeLimit: 0, // 0 = unlimited
      scoreLimit: 0, // 0 = unlimited
      respawnTime: 5,
    };
  }
  
  /**
   * Thiết lập chế độ chơi
   */
  setGameMode(mode) {
    this.gameMode = mode;
    this.dispatchEvent('gameModeChanged', { mode });
  }
  
  /**
   * Thiết lập kích thước đội
   */
  setTeamSize(size) {
    const clamped = Math.max(1, Math.min(size, GAME_CONFIG.MAX_PLAYERS_PER_TEAM));
    this.teamSize = clamped;
    this.botCount = Math.max(0, clamped - 1); // 1 human player
    this.dispatchEvent('teamSizeChanged', { size: clamped, botCount: this.botCount });
  }
  
  /**
   * Thiết lập số lượng bot
   */
  setBotCount(count) {
    const maxBots = this.teamSize - 1; // Ít nhất 1 người chơi thực
    const clamped = Math.max(0, Math.min(count, maxBots));
    this.botCount = clamped;
    this.dispatchEvent('botCountChanged', { botCount: clamped });
  }
  
  /**
   * Thiết lập độ khó
   */
  setDifficulty(difficulty) {
    if (['easy', 'normal', 'hard'].includes(difficulty)) {
      this.difficulty = difficulty;
      this.dispatchEvent('difficultyChanged', { difficulty });
    }
  }
  
  /**
   * Chọn team
   */
  setPlayerTeam(team) {
    if (team === GAME_CONFIG.TEAM_RED || team === GAME_CONFIG.TEAM_BLUE) {
      this.playerTeam = team;
      this.dispatchEvent('teamChanged', { team });
    }
  }
  
  /**
   * Xác nhận sẵn sàng
   */
  setReady(ready) {
    this.isReady = ready;
    this.dispatchEvent('readyStatusChanged', { ready });
  }
  
  /**
   * Lấy cấu hình hiện tại
   */
  getConfiguration() {
    return {
      gameMode: this.gameMode,
      teamSize: this.teamSize,
      botCount: this.botCount,
      difficulty: this.difficulty,
      playerTeam: this.playerTeam,
      isReady: this.isReady,
      settings: { ...this.settings },
    };
  }
  
  /**
   * Kiểm tra cấu hình hợp lệ
   */
  isValidConfiguration() {
    return (
      this.gameMode &&
      this.teamSize > 0 &&
      this.botCount >= 0 &&
      this.botCount < this.teamSize &&
      this.difficulty &&
      this.playerTeam
    );
  }
  
  /**
   * Reset về mặc định
   */
  reset() {
    this.gameMode = 'survival';
    this.teamSize = GAME_CONFIG.DEFAULT_TEAM_SIZE;
    this.botCount = GAME_CONFIG.DEFAULT_BOT_COUNT;
    this.difficulty = 'normal';
    this.playerTeam = GAME_CONFIG.TEAM_BLUE;
    this.isReady = false;
    this.dispatchEvent('reset', {});
  }
  
  /**
   * Dispatch custom event
   */
  dispatchEvent(eventName, detail) {
    window.dispatchEvent(new CustomEvent(`lobby_${eventName}`, { detail }));
  }
}

class LobbyUI {
  constructor(container) {
    this.container = container;
    this.manager = new LobbyManager();
    this.render();
    this.attachEventListeners();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="lobby-panel">
        <h2>Game Setup</h2>
        
        <div class="lobby-section">
          <label>Game Mode</label>
          <select id="gameMode">
            <option value="survival">Survival</option>
            <option value="training">Training</option>
            <option value="assault">Assault</option>
            <option value="nightmare">Nightmare</option>
          </select>
        </div>
        
        <div class="lobby-section">
          <label>Team Size: <span id="teamSizeValue">${this.manager.teamSize}</span></label>
          <input type="range" id="teamSize" min="1" max="${GAME_CONFIG.MAX_PLAYERS_PER_TEAM}" value="${this.manager.teamSize}">
        </div>
        
        <div class="lobby-section">
          <label>Bot Count: <span id="botCountValue">${this.manager.botCount}</span></label>
          <input type="range" id="botCount" min="0" max="${this.manager.teamSize - 1}" value="${this.manager.botCount}">
        </div>
        
        <div class="lobby-section">
          <label>Difficulty</label>
          <div class="difficulty-buttons">
            <button class="difficulty-btn" data-difficulty="easy">Easy</button>
            <button class="difficulty-btn active" data-difficulty="normal">Normal</button>
            <button class="difficulty-btn" data-difficulty="hard">Hard</button>
          </div>
        </div>
        
        <div class="lobby-section">
          <label>Your Team</label>
          <div class="team-buttons">
            <button class="team-btn" data-team="blue">Blue Team</button>
            <button class="team-btn" data-team="red">Red Team</button>
          </div>
        </div>
        
        <div class="lobby-section">
          <label>
            <input type="checkbox" id="friendlyFire"> Friendly Fire
          </label>
        </div>
        
        <button id="startGameBtn" class="start-game-btn">Start Game</button>
      </div>
    `;
  }
  
  attachEventListeners() {
    const gameMode = this.container.querySelector('#gameMode');
    const teamSize = this.container.querySelector('#teamSize');
    const botCount = this.container.querySelector('#botCount');
    const difficultyBtns = this.container.querySelectorAll('.difficulty-btn');
    const teamBtns = this.container.querySelectorAll('.team-btn');
    const friendlyFire = this.container.querySelector('#friendlyFire');
    const startBtn = this.container.querySelector('#startGameBtn');
    
    gameMode.addEventListener('change', (e) => {
      this.manager.setGameMode(e.target.value);
    });
    
    teamSize.addEventListener('input', (e) => {
      this.manager.setTeamSize(parseInt(e.target.value));
      this.container.querySelector('#teamSizeValue').textContent = e.target.value;
      this.container.querySelector('#botCount').max = parseInt(e.target.value) - 1;
    });
    
    botCount.addEventListener('input', (e) => {
      this.manager.setBotCount(parseInt(e.target.value));
      this.container.querySelector('#botCountValue').textContent = e.target.value;
    });
    
    difficultyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        difficultyBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.manager.setDifficulty(e.target.dataset.difficulty);
      });
    });
    
    teamBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        teamBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.manager.setPlayerTeam(e.target.dataset.team);
      });
    });
    
    friendlyFire.addEventListener('change', (e) => {
      this.manager.settings.friendlyFire = e.target.checked;
    });
    
    startBtn.addEventListener('click', () => {
      if (this.manager.isValidConfiguration()) {
        this.manager.setReady(true);
        window.dispatchEvent(new CustomEvent('lobbyStartGame', {
          detail: this.manager.getConfiguration()
        }));
      } else {
        alert('Invalid configuration');
      }
    });
  }
  
  getConfiguration() {
    return this.manager.getConfiguration();
  }
}

export { LobbyManager, LobbyUI };

export const lobbyManager = new LobbyManager();

/**
 * Helper functions
 */

export function createLobbyUI(container) {
  return new LobbyUI(container);
}

export function getLobbyConfiguration() {
  return lobbyManager.getConfiguration();
}

export function startGame(config) {
  if (config && config.isReady) {
    window.dispatchEvent(new CustomEvent('gameStart', { detail: config }));
  }
}
