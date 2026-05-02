/**
 * Bot AI System
 * Hệ thống bot với AI pathfinding, targeting, và team-based gameplay
 */

import * as THREE from 'three';
import { GAME_CONFIG, BOT_CONFIG } from '../constants.js';

class Bot {
  constructor(id, team, difficulty = 'normal') {
    this.id = id;
    this.team = team;
    this.difficulty = BOT_CONFIG.DIFFICULTY[difficulty.toUpperCase()] || BOT_CONFIG.DIFFICULTY.NORMAL;
    
    // Position and movement
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.rotation = 0;
    this.speed = BOT_CONFIG.BASE_SPEED * this.difficulty.speed;
    
    // AI state
    this.state = 'patrol'; // patrol, chase, attack, evade, dead
    this.target = null;
    this.targetPosition = new THREE.Vector3();
    this.decisionTimer = 0;
    this.reactionTimer = 0;
    this.stuckTimer = 0;
    this.lastPosition = new THREE.Vector3();
    
    // Combat
    this.health = 100;
    this.maxHealth = 100;
    this.ammo = 999;
    this.shootTimer = 0;
    this.shootCooldown = 0.5;
    
    // Visual representation (will be set by game)
    this.mesh = null;
    this.turret = null;
    this.barrel = null;
  }
  
  update(dt, player, otherBots, obstacles) {
    if (this.state === 'dead') return;
    
    this.decisionTimer -= dt;
    this.reactionTimer -= dt;
    this.shootTimer -= dt;
    this.stuckTimer -= dt;
    
    // Check if stuck
    if (this.lastPosition.distanceTo(this.position) < 0.1) {
      this.stuckTimer -= dt;
      if (this.stuckTimer <= 0) {
        this.generatePatrolPoint();
        this.stuckTimer = 2;
      }
    } else {
      this.stuckTimer = 2;
    }
    this.lastPosition.copy(this.position);
    
    // Make decision
    if (this.decisionTimer <= 0) {
      this.makeDecision(player, otherBots);
      this.decisionTimer = BOT_CONFIG.DECISION_INTERVAL;
    }
    
    // Update behavior
    switch (this.state) {
      case 'patrol':
        this.updatePatrol(dt, obstacles);
        break;
      case 'chase':
        this.updateChase(dt, obstacles);
        break;
      case 'attack':
        this.updateAttack(dt, player, obstacles);
        break;
      case 'evade':
        this.updateEvade(dt, obstacles);
        break;
    }
    
    // Update position
    this.position.addScaledVector(this.velocity, dt);
    
    // Clamp to map bounds
    const maxRadius = 80;
    const distance = this.position.length();
    if (distance > maxRadius) {
      this.position.normalize().multiplyScalar(maxRadius);
      this.velocity.multiplyScalar(0.5);
    }
    
    // Update mesh
    if (this.mesh) {
      this.mesh.position.copy(this.position);
      this.mesh.rotation.y = this.rotation;
    }
  }
  
  makeDecision(player, otherBots) {
    const distToPlayer = this.position.distanceTo(player.position);
    const canSeePlayer = this.canSeeTarget(player.position);
    
    // Determine state based on distance and visibility
    if (canSeePlayer && distToPlayer < BOT_CONFIG.DETECTION_RANGE * this.difficulty.detection / 50) {
      if (distToPlayer < BOT_CONFIG.ATTACK_RANGE) {
        this.state = 'attack';
        this.target = player;
      } else {
        this.state = 'chase';
        this.target = player;
      }
    } else {
      // Check health
      if (this.health < 30) {
        this.state = 'evade';
      } else {
        this.state = 'patrol';
        this.generatePatrolPoint();
      }
    }
  }
  
  updatePatrol(dt, obstacles) {
    const dirToTarget = this.targetPosition.clone().sub(this.position);
    const distance = dirToTarget.length();
    
    if (distance < 2) {
      this.generatePatrolPoint();
    } else {
      dirToTarget.normalize();
      
      // Avoid obstacles
      const avoidDir = this.getAvoidanceDirection(obstacles);
      if (avoidDir) {
        dirToTarget.lerp(avoidDir, 0.3);
        dirToTarget.normalize();
      }
      
      this.velocity.lerp(dirToTarget.multiplyScalar(this.speed), 0.1);
      this.rotation = Math.atan2(dirToTarget.x, dirToTarget.z);
    }
  }
  
  updateChase(dt, obstacles) {
    if (!this.target) {
      this.state = 'patrol';
      return;
    }
    
    const dirToTarget = this.target.position.clone().sub(this.position);
    const distance = dirToTarget.length();
    
    if (distance > BOT_CONFIG.DETECTION_RANGE * this.difficulty.detection / 50) {
      this.state = 'patrol';
      return;
    }
    
    dirToTarget.normalize();
    
    // Avoid obstacles
    const avoidDir = this.getAvoidanceDirection(obstacles);
    if (avoidDir) {
      dirToTarget.lerp(avoidDir, 0.2);
      dirToTarget.normalize();
    }
    
    this.velocity.lerp(dirToTarget.multiplyScalar(this.speed), 0.15);
    this.rotation = Math.atan2(dirToTarget.x, dirToTarget.z);
  }
  
  updateAttack(dt, player, obstacles) {
    if (!this.target) {
      this.state = 'patrol';
      return;
    }
    
    const dirToTarget = this.target.position.clone().sub(this.position);
    const distance = dirToTarget.length();
    
    // Keep distance
    if (distance < 15) {
      this.velocity.lerp(dirToTarget.normalize().multiplyScalar(-this.speed * 0.5), 0.1);
    } else if (distance > BOT_CONFIG.ATTACK_RANGE) {
      this.state = 'chase';
      return;
    } else {
      this.velocity.multiplyScalar(0.9);
    }
    
    // Aim and shoot
    if (this.reactionTimer <= 0 && this.shootTimer <= 0) {
      const accuracy = this.difficulty.accuracy;
      const shouldShoot = Math.random() < accuracy;
      
      if (shouldShoot) {
        this.shoot();
        this.shootTimer = this.shootCooldown;
        this.reactionTimer = BOT_CONFIG.REACTION_TIME;
      }
    }
    
    this.rotation = Math.atan2(dirToTarget.x, dirToTarget.z);
  }
  
  updateEvade(dt, obstacles) {
    // Move away from last known threat
    if (this.targetPosition) {
      const dirAwayFromThreat = this.position.clone().sub(this.targetPosition).normalize();
      this.velocity.lerp(dirAwayFromThreat.multiplyScalar(this.speed * 1.2), 0.1);
      this.rotation = Math.atan2(dirAwayFromThreat.x, dirAwayFromThreat.z);
    }
  }
  
  generatePatrolPoint() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 20 + Math.random() * BOT_CONFIG.PATROL_RANGE;
    this.targetPosition.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );
  }
  
  canSeeTarget(targetPos) {
    const dirToTarget = targetPos.clone().sub(this.position);
    const distance = dirToTarget.length();
    
    if (distance > BOT_CONFIG.DETECTION_RANGE * this.difficulty.detection / 50) {
      return false;
    }
    
    // Simple line of sight (no obstacles for now)
    return true;
  }
  
  getAvoidanceDirection(obstacles) {
    if (!obstacles || obstacles.length === 0) return null;
    
    const avoidRadius = 5;
    const avoidDir = new THREE.Vector3();
    let avoidCount = 0;
    
    for (const obstacle of obstacles) {
      const dist = this.position.distanceTo(obstacle.position);
      if (dist < avoidRadius && dist > 0.1) {
        const away = this.position.clone().sub(obstacle.position).normalize();
        avoidDir.add(away);
        avoidCount++;
      }
    }
    
    if (avoidCount > 0) {
      avoidDir.divideScalar(avoidCount).normalize();
      return avoidDir;
    }
    
    return null;
  }
  
  shoot() {
    if (this.ammo > 0) {
      this.ammo--;
      // Trigger shooting event
      window.dispatchEvent(new CustomEvent('botShoot', {
        detail: {
          botId: this.id,
          position: this.position.clone(),
          direction: new THREE.Vector3(Math.sin(this.rotation), 0, Math.cos(this.rotation)),
        }
      }));
    }
  }
  
  takeDamage(amount) {
    this.health -= amount;
    if (this.health < 0) {
      this.health = 0;
      this.state = 'dead';
      window.dispatchEvent(new CustomEvent('botDied', {
        detail: { botId: this.id, team: this.team }
      }));
    }
  }
  
  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }
}

class BotManager {
  constructor() {
    this.bots = [];
    this.teams = {
      [GAME_CONFIG.TEAM_RED]: [],
      [GAME_CONFIG.TEAM_BLUE]: [],
    };
  }
  
  createBots(count, team, difficulty = 'normal') {
    const startId = this.bots.length;
    
    for (let i = 0; i < count; i++) {
      const bot = new Bot(startId + i, team, difficulty);
      
      // Random spawn position
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 20;
      bot.position.set(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      );
      
      this.bots.push(bot);
      this.teams[team].push(bot);
    }
    
    return this.bots.slice(startId);
  }
  
  update(dt, player, obstacles) {
    for (const bot of this.bots) {
      if (bot.state !== 'dead') {
        bot.update(dt, player, this.bots, obstacles);
      }
    }
  }
  
  getBotsByTeam(team) {
    return this.teams[team] || [];
  }
  
  getAliveBotsCount(team) {
    return this.teams[team].filter(bot => bot.state !== 'dead').length;
  }
  
  getBot(botId) {
    return this.bots.find(bot => bot.id === botId);
  }
  
  damageBot(botId, amount) {
    const bot = this.getBot(botId);
    if (bot) {
      bot.takeDamage(amount);
    }
  }
  
  dispose() {
    this.bots = [];
    this.teams = {
      [GAME_CONFIG.TEAM_RED]: [],
      [GAME_CONFIG.TEAM_BLUE]: [],
    };
  }
}

export { Bot, BotManager };

// Export singleton instance
export const botManager = new BotManager();
