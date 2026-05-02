# Game Tank 3D Pro - Kế Hoạch Phát Triển

## Tổng Quan Dự Án
Nâng cấp game Tank 3D hiện tại với các tính năng mới:
- Bản đồ 3D không giới hạn (procedural/infinite terrain)
- Cây xanh, vật cản (giống WoT)
- Hệ thống bot AI
- Chế độ multiplayer với chọn số lượng người chơi
- Cửa hàng và tiền tệ ảo
- Tối ưu mobile (joystick ảo) và desktop
- Deploy lên Vercel (không dùng GitHub Pages)

## Kiến Trúc Hiện Tại
- **Framework**: Three.js 3D engine
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Code Structure**: 
  - `src/main.js` - Logic game chính (1474 dòng)
  - `src/styles.css` - CSS cho gameplay
  - `game.html` - Trang gameplay
  - `index.html` - Trang chọn chế độ
  - `liberation.html` - Minigame riêng

## Chiến Lược Tích Hợp (Không Sửa Code Cũ)
1. Tạo file mới cho từng tính năng (không chỉnh sửa `src/main.js`)
2. Sử dụng module pattern để mở rộng
3. Tạo `src/extensions/` cho các tính năng mới
4. Import và khởi tạo trong `src/main.js` mà không thay đổi logic cũ

## Các Tính Năng Cần Thêm (Thứ Tự Ưu Tiên)

### Phase 1: Bản Đồ 3D Không Giới Hạn
- [ ] Tạo hệ thống terrain procedural
- [ ] Implement infinite map loading/unloading
- [ ] Thêm cây xanh (trees)
- [ ] Thêm vật cản (rocks, buildings)
- [ ] Collision detection cho vật cản

**File mới**: `src/extensions/infiniteMap.js`

### Phase 2: Hệ Thống Bot AI
- [ ] Tạo class Bot với AI pathfinding
- [ ] Implement simple AI (chase, shoot, evade)
- [ ] Hệ thống team (Red team vs Blue team)
- [ ] Chế độ chọn số lượng người chơi
- [ ] Mặc định 5 người/đội (1 người thật + 4 bot)

**File mới**: `src/extensions/botSystem.js`

### Phase 3: Cửa Hàng & Tiền Tệ
- [ ] Tạo hệ thống tiền tệ ảo (coins/credits)
- [ ] Giao diện cửa hàng
- [ ] Vật phẩm có thể mua (tank upgrades, skins)
- [ ] Lưu trữ dữ liệu người chơi (localStorage)

**File mới**: `src/extensions/shop.js`, `src/extensions/currency.js`

### Phase 4: Tối Ưu Mobile & Desktop
- [ ] Joystick ảo cho mobile (đã có, cần cải thiện)
- [ ] Responsive UI cho tất cả màn hình
- [ ] Touch controls tối ưu
- [ ] Desktop keyboard/mouse controls
- [ ] Performance optimization

**File mới**: `src/extensions/mobileOptimization.js`

### Phase 5: Giao Diện & Lobby
- [ ] Tạo lobby chọn chế độ chơi
- [ ] Chọn số lượng bot
- [ ] Chọn team
- [ ] Hiển thị stats người chơi

**File mới**: `src/extensions/lobby.js`

### Phase 6: Deploy & Testing
- [ ] Kiểm tra toàn bộ tính năng
- [ ] Tối ưu performance
- [ ] Fix bugs
- [ ] Push lên GitHub
- [ ] Deploy lên Vercel

## Cấu Trúc File Mới

```
src/
├── main.js (không sửa)
├── styles.css (có thể thêm CSS mới)
├── extensions/
│   ├── infiniteMap.js
│   ├── botSystem.js
│   ├── shop.js
│   ├── currency.js
│   ├── mobileOptimization.js
│   └── lobby.js
├── utils/
│   ├── math.js
│   ├── physics.js
│   └── storage.js
└── constants.js
```

## Quy Tắc Phát Triển
1. ✅ **Không sửa code cũ** - Chỉ thêm file mới
2. ✅ **Module exports** - Mỗi extension export functions/classes
3. ✅ **Global scope** - Sử dụng global variables nếu cần (scene, camera, renderer)
4. ✅ **Event-driven** - Sử dụng events để communicate giữa modules
5. ✅ **Backward compatible** - Game vẫn chơi được nếu tắt extension

## Timeline Ước Tính
- Phase 1 (Map): 2-3 giờ
- Phase 2 (Bot): 2-3 giờ
- Phase 3 (Shop): 1-2 giờ
- Phase 4 (Mobile): 1-2 giờ
- Phase 5 (UI): 1-2 giờ
- Phase 6 (Deploy): 30 phút

**Tổng cộng**: ~10-15 giờ

## Ghi Chú Quan Trọng
- Giữ lại tất cả 5 chế độ chơi hiện tại
- Bản đồ mới phải tương thích với joystick ảo
- Bot phải có AI hợp lý (không quá dễ, không quá khó)
- Cửa hàng có thể mở rộng sau với IAP thực
- Performance phải tốt trên mobile (60fps nếu có thể)
