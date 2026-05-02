# UFO Tank 3D Pro

**Một game tank 3D đa người chơi với bản đồ vô hạn, hệ thống bot AI, cửa hàng, và tối ưu mobile.**

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Web-orange)

## 🎮 Tính Năng

### Bản Đồ & Thế Giới
- **Bản đồ 3D vô hạn** với terrain procedural
- **Cây xanh** và **vật cản** giống World of Tanks
- **Nhà cửa** và **công trình** để che chắn
- **Collision detection** tự động
- **Chunk-based loading** để tối ưu performance

### Hệ Thống Bot AI
- **Bot thông minh** với 4 trạng thái: patrol, chase, attack, evade
- **3 mức độ khó**: Easy, Normal, Hard
- **Pathfinding** tránh vật cản
- **Team-based gameplay** (Red vs Blue)
- **Chọn số lượng bot** từ 1-10 người/đội

### Cửa Hàng & Tiền Tệ
- **14 item** có thể mua:
  - 5 tank skins (Gold, Silver, Red, Blue, Green)
  - 5 upgrades (Speed, Armor, Firepower, Reload, Vision)
  - 4 consumables (Health, Ammo, Shield, Speed Boost)
- **Tiền tệ ảo** (Credits) với lưu trữ persistent
- **Upgrade system** tăng hiệu suất tank
- **Inventory management**

### Tối Ưu Mobile
- **Joystick ảo** cho điều khiển
- **Touch controls** tối ưu
- **Responsive design** cho tất cả kích thước màn hình
- **Pixel ratio tối ưu** cho performance
- **Battery optimization** mode

### Chế Độ Chơi
- **5 chế độ chơi** gốc (Survival, Training, Assault, Nightmare, Liberation)
- **Lobby UI** để cấu hình game
- **Team selection** (Red/Blue)
- **Difficulty selection**
- **Game stats** tracking

## 🚀 Bắt Đầu

### Yêu Cầu
- Node.js 18+
- npm hoặc pnpm

### Cài Đặt

```bash
# Clone repo
git clone <repo-url>
cd Game-tank-new

# Cài dependencies
pnpm install

# Chạy dev server
pnpm run dev

# Build cho production
pnpm run build
```

### Chạy Game

1. Mở browser: `http://localhost:3000`
2. Chọn chế độ chơi từ menu
3. Cấu hình số lượng bot, team, độ khó
4. Nhấn "Start Game"
5. Điều khiển tank và bắn UFO/bot

## 🎮 Điều Khiển

### Desktop
- **W/A/S/D** hoặc **Arrow Keys** - Di chuyển
- **Mouse** - Ngắm bắn
- **Left Click** - Bắn
- **Space** - Pause
- **R** - Restart

### Mobile
- **Joystick ảo** (trái) - Di chuyển
- **Fire Button** (phải) - Bắn
- **Tap** - Menu/Pause

## 📁 Cấu Trúc Dự Án

```
Game-tank-new/
├── src/
│   ├── main.js                 # Game logic cũ (không sửa)
│   ├── styles.css              # CSS cũ
│   ├── constants.js            # Hằng số chung
│   ├── extensions/             # Tính năng mới
│   │   ├── infiniteMap.js      # Bản đồ vô hạn
│   │   ├── botSystem.js        # Hệ thống bot
│   │   ├── currency.js         # Tiền tệ ảo
│   │   ├── shop.js             # Cửa hàng
│   │   ├── mobileOptimization.js
│   │   ├── lobby.js            # Giao diện lobby
│   │   └── integration.js      # Tích hợp tất cả
│   └── utils/
│       ├── math.js             # Hàm toán học
│       └── storage.js          # Quản lý dữ liệu
├── client/
│   ├── index.html              # Trang chủ
│   ├── game.html               # Game cũ
│   └── game-pro.html           # Game mới (Pro)
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Cấu Hình

### Constants
Chỉnh sửa `src/constants.js` để thay đổi:
- Kích thước map
- Mật độ cây/vật cản
- Số lượng bot
- Giá item
- Màu sắc

### Game Config
```javascript
import { GAME_CONFIG, BOT_CONFIG, MAP_CONFIG } from './src/constants.js';

// Thay đổi cấu hình
GAME_CONFIG.INFINITE_MAP_ENABLED = true;
BOT_CONFIG.DIFFICULTY.NORMAL.accuracy = 0.8;
MAP_CONFIG.TREE_DENSITY = 0.4;
```

## 📊 API Reference

### Initialization
```javascript
import { initializeExtensions, updateExtensions } from './src/extensions/integration.js';

// Khởi tạo
initializeExtensions(scene, camera, renderer, player);

// Update mỗi frame
updateExtensions(dt);
```

### Bot Management
```javascript
import { addBots, damageBot, getTeamStats } from './src/extensions/integration.js';

// Thêm bot
addBots(4, 'blue', 'normal');

// Gây damage
damageBot(botId, 50);

// Lấy thống kê
const stats = getTeamStats('blue');
```

### Currency & Shop
```javascript
import { currencyManager } from './src/extensions/currency.js';
import { shop } from './src/extensions/shop.js';

// Thêm tiền
currencyManager.addCurrency(100, 'reward');

// Mua item
shop.purchaseItem('skin_gold');

// Trang bị item
shop.equipItem('skin_gold');
```

### Mobile Optimization
```javascript
import { isMobileDevice, getDeviceInfo } from './src/extensions/mobileOptimization.js';

if (isMobileDevice()) {
  // Mobile-specific logic
}

const info = getDeviceInfo();
```

## 🎨 Customization

### Thêm Tank Skin Mới
```javascript
// src/extensions/shop.js
this.addItem(new ShopItem(
  'skin_custom',
  'Custom Skin',
  500,
  'skin',
  'Your custom skin description',
  '🎨',
  () => ({ color: 0x123456 })
));
```

### Thêm Bot Behavior
```javascript
// src/extensions/botSystem.js
class Bot {
  customBehavior() {
    // Your custom AI logic
  }
}
```

### Thêm Map Feature
```javascript
// src/extensions/infiniteMap.js
function addCustomFeature(parent, chunkX, chunkZ) {
  // Your custom map generation
}
```

## 🚀 Deployment

### Vercel
```bash
# Deploy tự động
git push origin main

# Hoặc deploy manual
vercel deploy --prod
```

### GitHub Pages
Không dùng GitHub Pages vì dự án sử dụng Vercel.

## 📈 Performance

### Tối ưu hóa
- **Chunk-based rendering** giảm draw calls
- **LOD system** cho bot/object
- **Mobile pixel ratio capping** giảm GPU load
- **Lazy loading** cho assets

### Metrics
- Desktop: 60 FPS @ 1080p
- Mobile: 30-60 FPS (tùy thiết bị)
- Memory: ~100-150MB
- Storage: ~5MB (localStorage)

## 🐛 Troubleshooting

### Game không load
- Kiểm tra console cho errors
- Clear browser cache
- Kiểm tra internet connection

### Bot không xuất hiện
- Kiểm tra `botManager` initialized
- Gọi `addBots()` từ lobby

### Dữ liệu không lưu
- Kiểm tra localStorage enabled
- Kiểm tra storage quota

## 📝 Changelog

### v2.0.0 (Current)
- ✅ Bản đồ 3D vô hạn
- ✅ Hệ thống bot AI
- ✅ Cửa hàng & tiền tệ
- ✅ Tối ưu mobile
- ✅ Lobby UI
- ✅ Team-based gameplay

### v1.0.0
- Bản gốc UFO Tank 3D
- 5 chế độ chơi
- Joystick ảo

## 📄 License

MIT License - Xem file LICENSE để chi tiết

## 🤝 Đóng Góp

Contributions welcome! Vui lòng:
1. Fork repo
2. Tạo feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📞 Support

- 📧 Email: support@example.com
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

## 🙏 Cảm Ơn

Cảm ơn tất cả những người đóng góp và người chơi!

---

**Made with ❤️ by the Game Tank Team**
