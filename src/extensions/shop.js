/**
 * Shop System
 * Quản lý cửa hàng và các item có thể mua
 */

import { GAME_CONFIG } from '../constants.js';
import { currencyManager, purchaseItem, sellItem } from './currency.js';

class ShopItem {
  constructor(id, name, price, type, description = '', icon = '', effect = null) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.type = type; // 'skin', 'upgrade', 'consumable'
    this.description = description;
    this.icon = icon;
    this.effect = effect; // Function to apply effect
    this.owned = false;
    this.equipped = false;
    this.quantity = 0;
  }
}

class Shop {
  constructor() {
    this.items = new Map();
    this.categories = new Map();
    this.selectedCategory = 'all';
    this.ownedItems = new Set();
    this.equippedItems = new Map();
    
    this.initializeItems();
  }
  
  initializeItems() {
    // Tank Skins
    this.addItem(new ShopItem(
      'skin_gold',
      'Gold Tank',
      500,
      'skin',
      'A shiny golden tank skin for prestige',
      '🟡',
      () => ({ color: 0xffd700, multiplier: 1.0 })
    ));
    
    this.addItem(new ShopItem(
      'skin_silver',
      'Silver Tank',
      300,
      'skin',
      'A sleek silver tank skin for speed',
      '⚪',
      () => ({ color: 0xc0c0c0, multiplier: 1.0 })
    ));
    
    this.addItem(new ShopItem(
      'skin_red',
      'Red Fury',
      400,
      'skin',
      'An aggressive red tank skin for power',
      '🔴',
      () => ({ color: 0xff0000, multiplier: 1.0 })
    ));
    
    this.addItem(new ShopItem(
      'skin_blue',
      'Ice Blue',
      400,
      'skin',
      'A cool blue tank skin for defense',
      '🔵',
      () => ({ color: 0x0000ff, multiplier: 1.0 })
    ));
    
    this.addItem(new ShopItem(
      'skin_green',
      'Forest Green',
      350,
      'skin',
      'A camouflage green tank skin',
      '💚',
      () => ({ color: 0x228b22, multiplier: 1.0 })
    ));
    
    // Upgrades
    this.addItem(new ShopItem(
      'upgrade_speed',
      'Speed Boost +20%',
      200,
      'upgrade',
      'Increase tank movement speed by 20%',
      '⚡',
      () => ({ speedMultiplier: 1.2 })
    ));
    
    this.addItem(new ShopItem(
      'upgrade_armor',
      'Armor Plating +30%',
      400,
      'upgrade',
      'Increase tank durability by 30%',
      '🛡️',
      () => ({ armorMultiplier: 1.3 })
    ));
    
    this.addItem(new ShopItem(
      'upgrade_firepower',
      'Firepower +25%',
      350,
      'upgrade',
      'Increase weapon damage by 25%',
      '💥',
      () => ({ damageMultiplier: 1.25 })
    ));
    
    this.addItem(new ShopItem(
      'upgrade_reload',
      'Quick Reload -30%',
      300,
      'upgrade',
      'Reduce weapon cooldown by 30%',
      '⏱️',
      () => ({ reloadMultiplier: 0.7 })
    ));
    
    this.addItem(new ShopItem(
      'upgrade_vision',
      'Enhanced Vision +50%',
      250,
      'upgrade',
      'Increase detection range by 50%',
      '👁️',
      () => ({ visionMultiplier: 1.5 })
    ));
    
    // Consumables
    this.addItem(new ShopItem(
      'consumable_health',
      'Health Pack',
      100,
      'consumable',
      'Restore 50 health points',
      '❤️',
      () => ({ heal: 50 })
    ));
    
    this.addItem(new ShopItem(
      'consumable_ammo',
      'Ammo Box',
      80,
      'consumable',
      'Restore 50 ammo',
      '📦',
      () => ({ ammo: 50 })
    ));
    
    this.addItem(new ShopItem(
      'consumable_shield',
      'Shield Booster',
      150,
      'consumable',
      'Temporary shield for 10 seconds',
      '🌟',
      () => ({ shield: 10 })
    ));
    
    this.addItem(new ShopItem(
      'consumable_boost',
      'Speed Boost',
      120,
      'consumable',
      'Temporary speed boost for 5 seconds',
      '🚀',
      () => ({ speedBoost: 5 })
    ));
  }
  
  addItem(item) {
    this.items.set(item.id, item);
    
    // Add to category
    if (!this.categories.has(item.type)) {
      this.categories.set(item.type, []);
    }
    this.categories.get(item.type).push(item);
  }
  
  getItems(category = 'all') {
    if (category === 'all') {
      return Array.from(this.items.values());
    }
    return this.categories.get(category) || [];
  }
  
  getItem(itemId) {
    return this.items.get(itemId);
  }
  
  /**
   * Mua item
   */
  purchaseItem(itemId) {
    const item = this.getItem(itemId);
    if (!item) {
      return { success: false, message: 'Item not found' };
    }
    
    if (item.type === 'skin' && this.ownedItems.has(itemId)) {
      return { success: false, message: 'Already owned' };
    }
    
    if (currencyManager.getBalance() < item.price) {
      return { success: false, message: 'Insufficient funds' };
    }
    
    // Purchase
    currencyManager.spendCurrency(item.price, `purchase_${itemId}`);
    
    if (item.type === 'skin') {
      this.ownedItems.add(itemId);
      item.owned = true;
    } else if (item.type === 'consumable') {
      currencyManager.addItem(itemId);
    } else if (item.type === 'upgrade') {
      this.ownedItems.add(itemId);
      item.owned = true;
    }
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('itemPurchased', {
      detail: { itemId, item }
    }));
    
    return { success: true, message: 'Purchase successful' };
  }
  
  /**
   * Kiểm tra sở hữu item
   */
  ownsItem(itemId) {
    return this.ownedItems.has(itemId);
  }
  
  /**
   * Trang bị item (skin)
   */
  equipItem(itemId) {
    const item = this.getItem(itemId);
    if (!item || !this.ownedItems.has(itemId)) {
      return false;
    }
    
    // Unequip previous item of same type
    for (const [id, equipped] of this.equippedItems) {
      if (equipped) {
        const prevItem = this.getItem(id);
        if (prevItem && prevItem.type === item.type) {
          this.equippedItems.set(id, false);
          prevItem.equipped = false;
        }
      }
    }
    
    this.equippedItems.set(itemId, true);
    item.equipped = true;
    
    window.dispatchEvent(new CustomEvent('itemEquipped', {
      detail: { itemId, item }
    }));
    
    return true;
  }
  
  /**
   * Lấy item đang trang bị
   */
  getEquippedItem(type) {
    for (const item of this.getItems(type)) {
      if (item.equipped) {
        return item;
      }
    }
    return null;
  }
  
  /**
   * Lấy danh sách item đã sở hữu
   */
  getOwnedItems() {
    const owned = [];
    for (const itemId of this.ownedItems) {
      const item = this.getItem(itemId);
      if (item) {
        owned.push(item);
      }
    }
    return owned;
  }
  
  /**
   * Lấy danh sách item có thể mua
   */
  getAvailableItems() {
    const available = [];
    for (const item of this.items.values()) {
      if (!this.ownedItems.has(item.id) || item.type === 'consumable') {
        available.push(item);
      }
    }
    return available;
  }
  
  /**
   * Lấy tất cả upgrades đã mua
   */
  getActiveUpgrades() {
    const upgrades = [];
    for (const item of this.getItems('upgrade')) {
      if (this.ownedItems.has(item.id)) {
        upgrades.push(item);
      }
    }
    return upgrades;
  }
  
  /**
   * Tính tổng effect của upgrades
   */
  calculateUpgradeEffect() {
    const effect = {
      speedMultiplier: 1.0,
      armorMultiplier: 1.0,
      damageMultiplier: 1.0,
      reloadMultiplier: 1.0,
      visionMultiplier: 1.0,
    };
    
    for (const upgrade of this.getActiveUpgrades()) {
      if (upgrade.effect) {
        const upgradeEffect = upgrade.effect();
        Object.assign(effect, upgradeEffect);
      }
    }
    
    return effect;
  }
  
  /**
   * Use consumable
   */
  useConsumable(itemId) {
    const item = this.getItem(itemId);
    if (!item || item.type !== 'consumable') {
      return false;
    }
    
    if (!currencyManager.removeItem(itemId)) {
      return false;
    }
    
    if (item.effect) {
      const effect = item.effect();
      window.dispatchEvent(new CustomEvent('consumableUsed', {
        detail: { itemId, item, effect }
      }));
    }
    
    return true;
  }
  
  /**
   * Reset shop
   */
  reset() {
    this.ownedItems.clear();
    this.equippedItems.clear();
    
    for (const item of this.items.values()) {
      item.owned = false;
      item.equipped = false;
    }
  }
}

export const shop = new Shop();

/**
 * Helper functions
 */

export function getShopItems(category = 'all') {
  return shop.getItems(category);
}

export function getShopCategories() {
  return Array.from(shop.categories.keys());
}

export function buyItem(itemId) {
  return shop.purchaseItem(itemId);
}

export function equipItem(itemId) {
  return shop.equipItem(itemId);
}

export function getEquippedSkin() {
  return shop.getEquippedItem('skin');
}

export function getOwnedItems() {
  return shop.getOwnedItems();
}

export function getAvailableItems() {
  return shop.getAvailableItems();
}

export function getActiveUpgrades() {
  return shop.getActiveUpgrades();
}

export function calculateUpgradeEffect() {
  return shop.calculateUpgradeEffect();
}

export function useConsumable(itemId) {
  return shop.useConsumable(itemId);
}
