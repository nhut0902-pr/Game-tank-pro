/**
 * Currency System
 * Quản lý tiền tệ ảo và inventory
 */

import { GAME_CONFIG, STORAGE_KEYS } from '../constants.js';

class CurrencyManager {
  constructor() {
    this.balance = GAME_CONFIG.STARTING_CURRENCY;
    this.inventory = {};
    this.transactions = [];
    
    this.loadFromStorage();
  }
  
  /**
   * Thêm tiền
   */
  addCurrency(amount, reason = 'unknown') {
    this.balance += amount;
    this.transactions.push({
      type: 'add',
      amount,
      reason,
      timestamp: Date.now(),
    });
    this.saveToStorage();
    this.dispatchEvent('currencyChanged', { balance: this.balance });
    return this.balance;
  }
  
  /**
   * Trừ tiền
   */
  spendCurrency(amount, reason = 'unknown') {
    if (this.balance < amount) {
      return false; // Insufficient funds
    }
    
    this.balance -= amount;
    this.transactions.push({
      type: 'spend',
      amount,
      reason,
      timestamp: Date.now(),
    });
    this.saveToStorage();
    this.dispatchEvent('currencyChanged', { balance: this.balance });
    return true;
  }
  
  /**
   * Lấy số dư hiện tại
   */
  getBalance() {
    return this.balance;
  }
  
  /**
   * Thêm item vào inventory
   */
  addItem(itemId, quantity = 1) {
    if (!this.inventory[itemId]) {
      this.inventory[itemId] = 0;
    }
    this.inventory[itemId] += quantity;
    this.saveToStorage();
    this.dispatchEvent('inventoryChanged', { inventory: this.inventory });
  }
  
  /**
   * Xóa item khỏi inventory
   */
  removeItem(itemId, quantity = 1) {
    if (!this.inventory[itemId]) {
      return false;
    }
    
    if (this.inventory[itemId] < quantity) {
      return false;
    }
    
    this.inventory[itemId] -= quantity;
    if (this.inventory[itemId] === 0) {
      delete this.inventory[itemId];
    }
    
    this.saveToStorage();
    this.dispatchEvent('inventoryChanged', { inventory: this.inventory });
    return true;
  }
  
  /**
   * Kiểm tra có item không
   */
  hasItem(itemId, quantity = 1) {
    return (this.inventory[itemId] || 0) >= quantity;
  }
  
  /**
   * Lấy số lượng item
   */
  getItemCount(itemId) {
    return this.inventory[itemId] || 0;
  }
  
  /**
   * Lấy toàn bộ inventory
   */
  getInventory() {
    return { ...this.inventory };
  }
  
  /**
   * Lưu vào localStorage
   */
  saveToStorage() {
    const data = {
      balance: this.balance,
      inventory: this.inventory,
      lastSaved: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.PLAYER_DATA, JSON.stringify(data));
  }
  
  /**
   * Tải từ localStorage
   */
  loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYER_DATA);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        this.balance = parsed.balance || GAME_CONFIG.STARTING_CURRENCY;
        this.inventory = parsed.inventory || {};
      } catch (e) {
        console.error('Failed to load currency data:', e);
      }
    }
  }
  
  /**
   * Reset toàn bộ dữ liệu
   */
  reset() {
    this.balance = GAME_CONFIG.STARTING_CURRENCY;
    this.inventory = {};
    this.transactions = [];
    this.saveToStorage();
    this.dispatchEvent('currencyReset', {});
  }
  
  /**
   * Dispatch custom event
   */
  dispatchEvent(eventName, detail) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
  
  /**
   * Lấy lịch sử giao dịch
   */
  getTransactionHistory(limit = 10) {
    return this.transactions.slice(-limit).reverse();
  }
}

export const currencyManager = new CurrencyManager();

/**
 * Helper functions
 */

export function formatCurrency(amount) {
  return `${GAME_CONFIG.CURRENCY_SYMBOL}${amount.toLocaleString()}`;
}

export function canAfford(itemPrice) {
  return currencyManager.getBalance() >= itemPrice;
}

export function purchaseItem(itemId, price) {
  if (currencyManager.spendCurrency(price, `purchase_${itemId}`)) {
    currencyManager.addItem(itemId);
    return true;
  }
  return false;
}

export function sellItem(itemId, sellPrice) {
  if (currencyManager.removeItem(itemId)) {
    currencyManager.addCurrency(sellPrice, `sell_${itemId}`);
    return true;
  }
  return false;
}

export function earnReward(amount, reason = 'reward') {
  currencyManager.addCurrency(amount, reason);
}

export function spendCurrency(amount, reason = 'unknown') {
  return currencyManager.spendCurrency(amount, reason);
}
