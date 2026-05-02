/**
 * Infinite Map System
 * Tạo bản đồ 3D vô hạn với terrain procedural, cây xanh, và vật cản
 * Giống như World of Tanks - bản đồ lớn với nhiều vật cản và địa hình
 */

import * as THREE from 'three';
import { GAME_CONFIG, MAP_CONFIG } from '../constants.js';

let scene, camera, renderer;
let terrainChunks = new Map();
let activeChunks = new Set();
let chunkSize = GAME_CONFIG.CHUNK_SIZE;
let renderDistance = GAME_CONFIG.RENDER_DISTANCE;

// Collision data
let collisionObjects = [];
let collisionBounds = new Map();

// Materials
let terrainMaterial, grassMaterial, treeMaterial, rockMaterial, buildingMaterial;

export function initInfiniteMap(sceneRef, cameraRef, rendererRef) {
  scene = sceneRef;
  camera = cameraRef;
  renderer = rendererRef;
  
  createMaterials();
  console.log('✓ Infinite Map System initialized');
}

function createMaterials() {
  // Terrain material
  terrainMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b7355,
    roughness: 0.8,
    metalness: 0.0,
    flatShading: true,
  });
  
  // Grass material
  grassMaterial = new THREE.MeshStandardMaterial({
    color: 0x7cb342,
    roughness: 0.9,
    metalness: 0.0,
    flatShading: true,
  });
  
  // Tree material
  treeMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d5016,
    roughness: 0.7,
    metalness: 0.0,
    flatShading: true,
  });
  
  // Rock material
  rockMaterial = new THREE.MeshStandardMaterial({
    color: 0x9a7655,
    roughness: 0.95,
    metalness: 0.0,
    flatShading: true,
  });
  
  // Building material
  buildingMaterial = new THREE.MeshStandardMaterial({
    color: 0x6b5b45,
    roughness: 0.8,
    metalness: 0.1,
    flatShading: true,
  });
}

export function updateMapChunks(playerPosition) {
  const playerChunkX = Math.floor(playerPosition.x / chunkSize);
  const playerChunkZ = Math.floor(playerPosition.z / chunkSize);
  
  // Xóa chunks cũ
  for (const chunkKey of activeChunks) {
    const [x, z] = chunkKey.split(',').map(Number);
    const distance = Math.max(Math.abs(x - playerChunkX), Math.abs(z - playerChunkZ));
    
    if (distance > renderDistance) {
      unloadChunk(x, z);
    }
  }
  
  // Tải chunks mới
  for (let x = playerChunkX - renderDistance; x <= playerChunkX + renderDistance; x++) {
    for (let z = playerChunkZ - renderDistance; z <= playerChunkZ + renderDistance; z++) {
      const chunkKey = `${x},${z}`;
      if (!activeChunks.has(chunkKey)) {
        loadChunk(x, z);
      }
    }
  }
}

function loadChunk(chunkX, chunkZ) {
  const chunkKey = `${chunkX},${chunkZ}`;
  
  if (terrainChunks.has(chunkKey)) {
    const chunk = terrainChunks.get(chunkKey);
    scene.add(chunk.group);
    activeChunks.add(chunkKey);
    return;
  }
  
  // Tạo chunk mới
  const chunkGroup = new THREE.Group();
  chunkGroup.position.set(chunkX * chunkSize, 0, chunkZ * chunkSize);
  
  // Tạo terrain
  createTerrainMesh(chunkGroup, chunkX, chunkZ);
  
  // Thêm vegetation
  addTreesAndRocks(chunkGroup, chunkX, chunkZ);
  
  // Thêm buildings
  addBuildings(chunkGroup, chunkX, chunkZ);
  
  scene.add(chunkGroup);
  terrainChunks.set(chunkKey, { group: chunkGroup, x: chunkX, z: chunkZ });
  activeChunks.add(chunkKey);
}

function unloadChunk(chunkX, chunkZ) {
  const chunkKey = `${chunkX},${chunkZ}`;
  const chunk = terrainChunks.get(chunkKey);
  
  if (chunk) {
    scene.remove(chunk.group);
    
    // Remove collision objects
    chunk.group.traverse(obj => {
      if (obj.userData.isCollider) {
        const idx = collisionObjects.indexOf(obj);
        if (idx > -1) {
          collisionObjects.splice(idx, 1);
        }
        collisionBounds.delete(obj.uuid);
      }
    });
    
    // Cleanup geometry and materials
    chunk.group.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
    activeChunks.delete(chunkKey);
  }
}

function createTerrainMesh(parent, chunkX, chunkZ) {
  const segments = 32;
  const geometry = new THREE.PlaneGeometry(chunkSize, chunkSize, segments, segments);
  
  // Modify vertices for height variation
  const positionAttribute = geometry.getAttribute('position');
  const positions = positionAttribute.array;
  
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i] + chunkX * chunkSize;
    const z = positions[i + 1] + chunkZ * chunkSize;
    
    // Perlin-like noise (simplified)
    const height = getTerrainHeight(x, z);
    positions[i + 2] = height;
  }
  
  positionAttribute.needsUpdate = true;
  geometry.computeVertexNormals();
  
  const terrain = new THREE.Mesh(geometry, grassMaterial);
  terrain.castShadow = true;
  terrain.receiveShadow = true;
  terrain.rotation.x = -Math.PI / 2;
  terrain.position.set(0, 0, 0);
  
  parent.add(terrain);
}

function addTreesAndRocks(parent, chunkX, chunkZ) {
  const seed = chunkX * 73856093 ^ chunkZ * 19349663;
  const random = seededRandom(seed);
  
  // Add trees
  const treeCount = Math.floor(chunkSize * chunkSize * MAP_CONFIG.TREE_DENSITY / 10000);
  for (let i = 0; i < treeCount; i++) {
    const x = random() * chunkSize - chunkSize / 2;
    const z = random() * chunkSize - chunkSize / 2;
    const height = getTerrainHeight(x + chunkX * chunkSize, z + chunkZ * chunkSize);
    
    const tree = createTree(random);
    tree.position.set(x, height, z);
    tree.userData.isCollider = true;
    tree.userData.radius = 0.5;
    
    collisionObjects.push(tree);
    collisionBounds.set(tree.uuid, {
      position: tree.position.clone(),
      radius: 0.5,
    });
    
    parent.add(tree);
  }
  
  // Add rocks
  const rockCount = Math.floor(chunkSize * chunkSize * MAP_CONFIG.ROCK_DENSITY / 10000);
  for (let i = 0; i < rockCount; i++) {
    const x = random() * chunkSize - chunkSize / 2;
    const z = random() * chunkSize - chunkSize / 2;
    const height = getTerrainHeight(x + chunkX * chunkSize, z + chunkZ * chunkSize);
    
    const rock = createRock(random);
    rock.position.set(x, height, z);
    rock.userData.isCollider = true;
    rock.userData.radius = 1.0;
    
    collisionObjects.push(rock);
    collisionBounds.set(rock.uuid, {
      position: rock.position.clone(),
      radius: 1.0,
    });
    
    parent.add(rock);
  }
}

function addBuildings(parent, chunkX, chunkZ) {
  const seed = (chunkX * 73856093 ^ chunkZ * 19349663) * 2;
  const random = seededRandom(seed);
  
  const buildingCount = Math.floor(chunkSize * chunkSize * MAP_CONFIG.BUILDING_DENSITY / 10000);
  for (let i = 0; i < buildingCount; i++) {
    const x = random() * chunkSize - chunkSize / 2;
    const z = random() * chunkSize - chunkSize / 2;
    const height = getTerrainHeight(x + chunkX * chunkSize, z + chunkZ * chunkSize);
    
    const building = createBuilding(random);
    building.position.set(x, height, z);
    building.userData.isCollider = true;
    building.userData.radius = 2.0;
    
    collisionObjects.push(building);
    collisionBounds.set(building.uuid, {
      position: building.position.clone(),
      radius: 2.0,
    });
    
    parent.add(building);
  }
}

function createTree(random) {
  const group = new THREE.Group();
  
  // Trunk
  const trunkHeight = MAP_CONFIG.TREE_HEIGHT_MIN + random() * (MAP_CONFIG.TREE_HEIGHT_MAX - MAP_CONFIG.TREE_HEIGHT_MIN);
  const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, trunkHeight, 8);
  const trunk = new THREE.Mesh(trunkGeometry, treeMaterial);
  trunk.position.y = trunkHeight / 2;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  group.add(trunk);
  
  // Foliage (cone)
  const foliageGeometry = new THREE.ConeGeometry(2, 4, 8);
  const foliage = new THREE.Mesh(foliageGeometry, treeMaterial);
  foliage.position.y = trunkHeight + 2;
  foliage.castShadow = true;
  foliage.receiveShadow = true;
  group.add(foliage);
  
  return group;
}

function createRock(random) {
  const size = 0.5 + random() * 1.5;
  const geometry = new THREE.IcosahedronGeometry(size, 2);
  const rock = new THREE.Mesh(geometry, rockMaterial);
  rock.castShadow = true;
  rock.receiveShadow = true;
  rock.rotation.set(random() * Math.PI, random() * Math.PI, random() * Math.PI);
  
  return rock;
}

function createBuilding(random) {
  const width = 2 + random() * 3;
  const depth = 2 + random() * 3;
  const height = 3 + random() * 4;
  
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const building = new THREE.Mesh(geometry, buildingMaterial);
  building.position.y = height / 2;
  building.castShadow = true;
  building.receiveShadow = true;
  
  return building;
}

function getTerrainHeight(x, z) {
  // Simplified Perlin noise
  const scale = 0.05;
  const height = Math.sin(x * scale) * Math.cos(z * scale) * MAP_CONFIG.HEIGHT_VARIATION;
  return Math.max(0, height);
}

function seededRandom(seed) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/**
 * Collision detection
 */
export function checkCollision(position, radius) {
  for (const obj of collisionObjects) {
    const bounds = collisionBounds.get(obj.uuid);
    if (!bounds) continue;
    
    const distance = position.distanceTo(bounds.position);
    if (distance < radius + bounds.radius) {
      return true;
    }
  }
  return false;
}

export function getCollisionObjects() {
  return [...collisionObjects];
}

export function getCollisionBounds() {
  return new Map(collisionBounds);
}

/**
 * Raycast để kiểm tra visibility
 */
export function checkLineOfSight(from, to) {
  const direction = to.clone().sub(from).normalize();
  const distance = from.distanceTo(to);
  
  const raycaster = new THREE.Raycaster(from, direction);
  const intersects = raycaster.intersectObjects(collisionObjects);
  
  if (intersects.length > 0 && intersects[0].distance < distance) {
    return false; // Blocked
  }
  return true; // Clear
}

export function dispose() {
  for (const chunk of terrainChunks.values()) {
    scene.remove(chunk.group);
    chunk.group.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
  }
  
  terrainChunks.clear();
  activeChunks.clear();
  collisionObjects = [];
  collisionBounds.clear();
  
  terrainMaterial.dispose();
  grassMaterial.dispose();
  treeMaterial.dispose();
  rockMaterial.dispose();
  buildingMaterial.dispose();
}

/**
 * Debug: Hiển thị collision bounds
 */
export function debugShowCollisionBounds(show = true) {
  if (!show) {
    scene.children.forEach(child => {
      if (child.userData.isDebugHelper) {
        scene.remove(child);
      }
    });
    return;
  }
  
  for (const bounds of collisionBounds.values()) {
    const geometry = new THREE.SphereGeometry(bounds.radius, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(bounds.position);
    mesh.userData.isDebugHelper = true;
    scene.add(mesh);
  }
}
