# Game Tank 3D Pro - Extensions Guide

## Tổng Quan

Tất cả các tính năng mới được tổ chức thành các **modules độc lập** trong thư mục `src/extensions/`. Chúng được thiết kế để tích hợp với game hiện tại mà **không sửa đổi code cũ**.

## Cấu Trúc File

```
src/
├── main.js (game cũ - không sửa)
├── styles.css (CSS cũ)
├── constants.js (hằng số chung - MỚI)
└── extensions/
    ├── infiniteMap.js (bản đồ vô hạn)
    ├── botSystem.js (hệ thống bot AI)
    ├── currency.js (tiền tệ ảo)
    ├── shop.js (cửa hàng)
    ├── mobileOptimization.js (tối ưu mobile)
    ├── lobby.js (giao diện lobby)
    └── integration.js (tích hợp tất cả)
```

## Hướng Dẫn Sử Dụng

### 1. Infinite Map System

**File**: `src/extensions/infiniteMap.js`

**Chức năng**:
- Tạo bản đồ 3D vô hạn với terrain procedural
- Tự động load/unload chunks dựa trên vị trí người chơi
- Thêm cây xanh, vật cản (rocks)
- Collision detection

**Sử dụng**:
```javascript
import { initInfiniteMap, updateMapChunks } from './extensions/infiniteMap.js';

// Khởi tạo
initInfiniteMap(scene, camera, renderer);

// Update mỗi frame
updateMapChunks(playerPosition);

// Lấy collision objects
const colliders = getCollisionObjects();
```

### 2. Bot AI System

**File**: `src/extensions/botSystem.js`

**Chức năng**:
- Tạo bot với AI pathfinding
- 4 trạng thái: patrol, chase, attack, evade
- Team-based gameplay
- Difficulty levels: easy, normal, hard

**Sử dụng**:
```javascript
import { BotManager } from './extensions/botSystem.js';

const botManager = new BotManager();

// Tạo 4 bot cho team Blue
const bots = botManager.createBots(4, 'blue', 'normal');

// Update mỗi frame
botManager.update(dt, player, obstacles);

// Lấy bot theo team
const blueBots = botManager.getBotsByTeam('blue');
```

### 3. Currency System

**File**: `src/extensions/currency.js`

**Chức năng**:
- Quản lý tiền tệ ảo
- Inventory management
- Lưu trữ localStorage
- Lịch sử giao dịch

**Sử dụng**:
```javascript
import { currencyManager, earnReward, spendCurrency } from './extensions/currency.js';

// Thêm tiền
currencyManager.addCurrency(100, 'kill_reward');

// Trừ tiền
currencyManager.spendCurrency(50, 'purchase');

// Thêm item
currencyManager.addItem('skin_gold');

// Kiểm tra có item
if (currencyManager.hasItem('skin_gold')) {
  // ...
}

// Lấy số dư
const balance = currencyManager.getBalance();
```

### 4. Shop System

**File**: `src/extensions/shop.js`

**Chức năng**:
- 11 item có sẵn (skins, upgrades, consumables)
- Mua/bán item
- Trang bị item (skins)
- Phân loại theo category

**Sử dụng**:
```javascript
import { shop, buyItem, equipItem } from './extensions/shop.js';

// Lấy tất cả item
const allItems = shop.getItems('all');

// Lấy item theo category
const skins = shop.getItems('skin');

// Mua item
const result = shop.purchaseItem('skin_gold');
if (result.success) {
  console.log('Purchase successful');
}

// Trang bị item
shop.equipItem('skin_gold');

// Lấy item đang trang bị
const equippedSkin = shop.getEquippedItem('skin');

// Lấy item đã sở hữu
const owned = shop.getOwnedItems();
```

### 5. Mobile Optimization

**File**: `src/extensions/mobileOptimization.js`

**Chức năng**:
- Phát hiện thiết bị (mobile, tablet, desktop)
- Pixel ratio tối ưu
- Touch support detection
- Performance optimization

**Sử dụng**:
```javascript
import { mobileOptimizer, isMobileDevice, optimizeForDevice } from './extensions/mobileOptimization.js';

// Cấu hình renderer
optimizeForDevice(renderer);

// Kiểm tra thiết bị
if (isMobileDevice()) {
  // Mobile-specific logic
}

// Lấy thông tin thiết bị
const info = mobileOptimizer.getDeviceInfo();
console.log(info.isMobile, info.touchEnabled);

// Xử lý orientation change
mobileOptimizer.onOrientationChange((screenSize) => {
  console.log('Orientation changed:', screenSize);
});
```

### 6. Lobby System

**File**: `src/extensions/lobby.js`

**Chức năng**:
- Giao diện chọn chế độ chơi
- Chọn kích thước đội
- Chọn số lượng bot
- Chọn độ khó
- Chọn team

**Sử dụng**:
```javascript
import { LobbyUI } from './extensions/lobby.js';

// Tạo lobby UI
const lobby = new LobbyUI(document.getElementById('lobbyContainer'));

// Lắng nghe sự kiện
window.addEventListener('lobbyStartGame', (e) => {
  const config = e.detail;
  console.log('Game config:', config);
  // Bắt đầu game với config
});

// Lấy cấu hình hiện tại
const config = lobby.manager.getConfiguration();
```

### 7. Integration Module

**File**: `src/extensions/integration.js`

**Chức năng**:
- Tích hợp tất cả extensions
- Quản lý game state
- Event handling

**Sử dụng**:
```javascript
import { 
  initializeExtensions, 
  updateExtensions, 
  createLobby,
  addBots,
  openShop
} from './extensions/integration.js';

// Khởi tạo tất cả extensions
initializeExtensions(scene, camera, renderer, player);

// Update mỗi frame
updateExtensions(dt);

// Tạo lobby
createLobby('lobbyContainer');

// Thêm bot
addBots(4, 'blue', 'normal');

// Mở cửa hàng
openShop();
```

## Constants

**File**: `src/constants.js`

Chứa tất cả hằng số cấu hình:

```javascript
import { GAME_CONFIG, BOT_CONFIG, MAP_CONFIG, UI_CONFIG, STORAGE_KEYS } from './constants.js';

// Game config
GAME_CONFIG.INFINITE_MAP_ENABLED // true
GAME_CONFIG.DEFAULT_TEAM_SIZE // 5
GAME_CONFIG.DEFAULT_BOT_COUNT // 4

// Bot config
BOT_CONFIG.DETECTION_RANGE // 50
BOT_CONFIG.DIFFICULTY.NORMAL // { accuracy: 0.7, speed: 1.0, detection: 50 }

// Map config
MAP_CONFIG.TREE_DENSITY // 0.3
MAP_CONFIG.ROCK_DENSITY // 0.2

// Storage keys
STORAGE_KEYS.PLAYER_DATA // 'game_player_data'
```

## Event System

Tất cả extensions sử dụng custom events để communicate:

```javascript
// Currency events
window.addEventListener('currencyChanged', (e) => {
  console.log('New balance:', e.detail.balance);
});

// Shop events
window.addEventListener('itemPurchased', (e) => {
  console.log('Item purchased:', e.detail.item.name);
});

window.addEventListener('itemEquipped', (e) => {
  console.log('Item equipped:', e.detail.item.name);
});

// Lobby events
window.addEventListener('lobby_gameModeChanged', (e) => {
  console.log('Game mode:', e.detail.mode);
});

window.addEventListener('lobbyStartGame', (e) => {
  console.log('Game config:', e.detail);
});

// Bot events
window.addEventListener('botShoot', (e) => {
  console.log('Bot shot:', e.detail);
});
```

## Integration với Game Cũ

Để tích hợp với `src/main.js` mà không sửa code cũ:

1. **Import integration module** vào game.html:
```html
<script type="module">
  import { initializeExtensions, updateExtensions } from './src/extensions/integration.js';
  
  // Sau khi game được khởi tạo
  initializeExtensions(scene, camera, renderer, player);
  
  // Trong game loop
  function tick(dt) {
    updateExtensions(dt);
    // ... game logic cũ
  }
</script>
```

2. **Không sửa `src/main.js`** - tất cả tích hợp qua `integration.js`

3. **Thêm lobby UI** vào HTML:
```html
<div id="lobbyContainer"></div>
```

## Performance Tips

1. **Infinite Map**: Điều chỉnh `RENDER_DISTANCE` trong constants để cân bằng quality/performance
2. **Bots**: Giảm số lượng bot hoặc độ khó nếu FPS thấp
3. **Mobile**: Tự động giảm quality trên mobile devices
4. **Storage**: Dữ liệu được lưu vào localStorage, tối đa ~5MB

## Troubleshooting

### Bot không xuất hiện
- Kiểm tra `botManager` được khởi tạo
- Gọi `addBots()` hoặc `createBots()` từ lobby

### Cửa hàng không hoạt động
- Kiểm tra `shopPanel` element tồn tại
- Gọi `openShop()` từ integration module

### Map không load
- Kiểm tra `INFINITE_MAP_ENABLED` = true
- Gọi `updateMapChunks()` mỗi frame

### Dữ liệu không lưu
- Kiểm tra localStorage không bị disable
- Dữ liệu lưu vào key: `game_player_data`

## Mở Rộng

Để thêm tính năng mới:

1. Tạo file mới trong `src/extensions/`
2. Export functions/classes
3. Import vào `integration.js`
4. Gọi từ game logic

Ví dụ:
```javascript
// src/extensions/myFeature.js
export function myFeature() {
  // ...
}

// src/extensions/integration.js
import { myFeature } from './myFeature.js';

export function initializeExtensions(...) {
  myFeature();
}
```

## Liên Hệ

Nếu có vấn đề, kiểm tra:
- Browser console cho errors
- Network tab cho asset loading
- LocalStorage cho dữ liệu lưu
