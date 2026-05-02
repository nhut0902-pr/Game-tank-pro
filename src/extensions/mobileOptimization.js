/**
 * Mobile Optimization
 * Tối ưu hóa cho thiết bị mobile và desktop
 */

import { GAME_CONFIG } from '../constants.js';

class MobileOptimizer {
  constructor() {
    this.isMobile = this.detectMobile();
    this.isTablet = this.detectTablet();
    this.devicePixelRatio = this.getOptimalPixelRatio();
    this.touchEnabled = this.detectTouchSupport();
    this.screenSize = this.getScreenSize();
    
    console.log(`Device: ${this.isMobile ? 'Mobile' : this.isTablet ? 'Tablet' : 'Desktop'}`);
    console.log(`Touch: ${this.touchEnabled ? 'Enabled' : 'Disabled'}`);
    console.log(`Screen: ${this.screenSize.width}x${this.screenSize.height}`);
  }
  
  /**
   * Phát hiện thiết bị mobile
   */
  detectMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  }
  
  /**
   * Phát hiện tablet
   */
  detectTablet() {
    const userAgent = navigator.userAgent;
    return /ipad|android(?!.*mobi)/i.test(userAgent.toLowerCase());
  }
  
  /**
   * Lấy pixel ratio tối ưu
   */
  getOptimalPixelRatio() {
    const ratio = window.devicePixelRatio || 1;
    
    if (this.isMobile) {
      return Math.min(ratio, GAME_CONFIG.MOBILE_PIXEL_RATIO_CAP);
    } else {
      return Math.min(ratio, GAME_CONFIG.DESKTOP_PIXEL_RATIO_CAP);
    }
  }
  
  /**
   * Phát hiện hỗ trợ touch
   */
  detectTouchSupport() {
    return (
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0)
    );
  }
  
  /**
   * Lấy kích thước màn hình
   */
  getScreenSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    };
  }
  
  /**
   * Cấu hình renderer cho mobile
   */
  configureRendererForDevice(renderer) {
    renderer.setPixelRatio(this.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (this.isMobile) {
      renderer.shadowMap.type = THREE.BasicShadowMap; // Lighter shadows for mobile
    }
  }
  
  /**
   * Tối ưu hóa UI cho mobile
   */
  optimizeUIForMobile() {
    if (!this.isMobile) return;
    
    // Tăng kích thước button cho touch
    const style = document.createElement('style');
    style.textContent = `
      button, [role="button"] {
        min-height: 44px;
        min-width: 44px;
      }
      
      .joystick {
        width: 120px;
        height: 120px;
      }
      
      .fire-button {
        width: 80px;
        height: 80px;
      }
      
      .hud-text {
        font-size: 16px;
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Xử lý orientation change
   */
  onOrientationChange(callback) {
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.screenSize = this.getScreenSize();
        callback(this.screenSize);
      }, 100);
    });
    
    window.addEventListener('resize', () => {
      this.screenSize = this.getScreenSize();
      callback(this.screenSize);
    });
  }
  
  /**
   * Tối ưu hóa performance
   */
  optimizePerformance() {
    if (this.isMobile) {
      // Giảm quality cho mobile
      return {
        shadowMapSize: 512,
        antialias: false,
        maxLights: 2,
        geometryDetail: 'low',
      };
    } else {
      return {
        shadowMapSize: 1024,
        antialias: true,
        maxLights: 4,
        geometryDetail: 'high',
      };
    }
  }
  
  /**
   * Kiểm tra battery status
   */
  async checkBatteryStatus() {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        return {
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
        };
      } catch (e) {
        console.warn('Battery API not available');
      }
    }
    return null;
  }
  
  /**
   * Điều chỉnh quality dựa trên battery
   */
  adjustQualityForBattery(batteryStatus) {
    if (!batteryStatus) return;
    
    if (batteryStatus.level < 0.2 && !batteryStatus.charging) {
      // Low battery mode
      console.log('Low battery mode activated');
      return {
        reducedQuality: true,
        disableShadows: true,
        lowerFPS: true,
      };
    }
  }
  
  /**
   * Lấy thông tin thiết bị
   */
  getDeviceInfo() {
    return {
      isMobile: this.isMobile,
      isTablet: this.isTablet,
      touchEnabled: this.touchEnabled,
      devicePixelRatio: this.devicePixelRatio,
      screenSize: this.screenSize,
      userAgent: navigator.userAgent,
    };
  }
}

export const mobileOptimizer = new MobileOptimizer();

/**
 * Helper functions
 */

export function isMobileDevice() {
  return mobileOptimizer.isMobile;
}

export function isTabletDevice() {
  return mobileOptimizer.isTablet;
}

export function isTouchEnabled() {
  return mobileOptimizer.touchEnabled;
}

export function getScreenSize() {
  return mobileOptimizer.getScreenSize();
}

export function getDeviceInfo() {
  return mobileOptimizer.getDeviceInfo();
}

export function optimizeForDevice(renderer) {
  mobileOptimizer.configureRendererForDevice(renderer);
  mobileOptimizer.optimizeUIForMobile();
}
