class Game {
    constructor() {
        console.log('Game constructor called');
        
        // Check if canvas exists
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            throw new Error('Canvas element with id "gameCanvas" not found. Make sure the HTML is loaded before creating the Game instance.');
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error('Could not get 2D context from canvas');
        }
        
        this.tileSize = 24;
        this.mapWidth = 50;
        this.mapHeight = 38;
        this.cameraX = 0;
        this.cameraY = 0;
        
        this.player = null;
        this.enemies = [];
        this.items = [];
        this.map = null;
        this.battleSystem = null;
        this.ui = null;
        
        this.gameState = 'playing'; // 'playing', 'battle', 'inventory', 'gameOver'
        this.currentEnemy = null;
        
        this.messageLog = [];
        this.maxMessages = 10;
        
        console.log('Game constructor completed, calling init()');
        this.init();
    }
    
    init() {
        console.log('Game init() called');
        
        try {
            console.log('Creating GameMap...');
            // Initialize game systems
            this.map = new GameMap(this.mapWidth, this.mapHeight);
            
            console.log('Creating BattleSystem...');
            this.battleSystem = new BattleSystem(this);
            
            console.log('Creating UI...');
            this.ui = new UI(this);
            
            console.log('Generating map...');
            // Generate initial map
            this.map.generate();
            
            console.log('Finding spawn position...');
            // Find a valid spawn position for the player
            const spawnPos = this.findValidSpawnPosition();
            
            console.log('Creating Player...');
            this.player = new Player(spawnPos.x, spawnPos.y);
            
            console.log('Adding starting equipment...');
            // Add starting equipment after player is created
            this.player.addStartingEquipment();
            
            console.log('Initializing UI...');
            // Initialize UI after player is created
            this.ui.init();
            
            console.log('Spawning enemies...');
            // Add some enemies
            this.spawnEnemies();
            
            console.log('Spawning items...');
            // Add some items
            this.spawnItems();
            
            console.log('Setting up event listeners...');
            // Set up event listeners
            this.setupEventListeners();
            
            console.log('Starting game loop...');
            // Start game loop
            this.gameLoop();
            
            console.log('Game initialization completed successfully!');
        } catch (error) {
            console.error('Error in Game.init():', error);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }
    
    findValidSpawnPosition() {
        // Try to find a room center first
        if (this.map.rooms.length > 0) {
            const room = this.map.rooms[0]; // Use the first room
            const centerX = Math.floor(room.x + room.width / 2);
            const centerY = Math.floor(room.y + room.height / 2);
            
            if (this.map.isWalkable(centerX, centerY)) {
                return { x: centerX, y: centerY };
            }
        }
        
        // If no room or room center is invalid, find any floor tile
        const floorTiles = [];
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                if (this.map.isWalkable(x, y)) {
                    floorTiles.push({ x, y });
                }
            }
        }
        
        if (floorTiles.length > 0) {
            // Choose a random floor tile
            return floorTiles[Math.floor(Math.random() * floorTiles.length)];
        }
        
        // Fallback to center of map
        console.warn('No valid spawn position found, using map center');
        return { x: Math.floor(this.mapWidth / 2), y: Math.floor(this.mapHeight / 2) };
    }
    
    spawnEnemies() {
        const enemyTypes = ['goblin', 'orc', 'troll', 'dragon'];
        const numEnemies = 10 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < numEnemies; i++) {
            const spawnPos = this.findValidEnemySpawnPosition();
            if (spawnPos) {
                const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
                const enemy = new Enemy(spawnPos.x, spawnPos.y, enemyType);
                this.enemies.push(enemy);
            }
        }
    }
    
    findValidEnemySpawnPosition() {
        const attempts = 50; // Limit attempts to prevent infinite loops
        
        for (let attempt = 0; attempt < attempts; attempt++) {
            const x = Math.floor(Math.random() * this.mapWidth);
            const y = Math.floor(Math.random() * this.mapHeight);
            
            // Check if position is valid
            if (this.map.isWalkable(x, y) && 
                !this.isPositionOccupied(x, y)) {
                return { x, y };
            }
        }
        
        return null; // Could not find valid position
    }
    
    isPositionOccupied(x, y) {
        // Check if player is at this position
        if (this.player && this.player.x === x && this.player.y === y) {
            return true;
        }
        
        // Check if enemy is at this position
        if (this.enemies.some(enemy => enemy.x === x && enemy.y === y)) {
            return true;
        }
        
        // Check if item is at this position
        if (this.items.some(item => item.x === x && item.y === y)) {
            return true;
        }
        
        return false;
    }
    
    spawnItems() {
        const itemTypes = ['sword', 'shield', 'potion', 'scroll', 'gold'];
        const numItems = 8 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numItems; i++) {
            const spawnPos = this.findValidItemSpawnPosition();
            if (spawnPos) {
                const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
                const item = new Item(spawnPos.x, spawnPos.y, itemType);
                this.items.push(item);
            }
        }
    }
    
    findValidItemSpawnPosition() {
        const attempts = 30;
        
        for (let attempt = 0; attempt < attempts; attempt++) {
            const x = Math.floor(Math.random() * this.mapWidth);
            const y = Math.floor(Math.random() * this.mapHeight);
            
            // Check if position is valid
            if (this.map.isWalkable(x, y) && 
                !this.isPositionOccupied(x, y)) {
                return { x, y };
            }
        }
        
        return null;
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                this.handlePlayerInput(e);
            }
        });
        
        // Battle modal event listeners
        document.getElementById('attackBtn').addEventListener('click', () => {
            this.battleSystem.playerAttack();
        });
        
        document.getElementById('useItemBtn').addEventListener('click', () => {
            this.battleSystem.useItem();
        });
        
        document.getElementById('fleeBtn').addEventListener('click', () => {
            this.battleSystem.flee();
        });
        
        // Inventory modal event listeners
        document.getElementById('closeInventoryBtn').addEventListener('click', () => {
            this.closeInventory();
        });
    }
    
    handlePlayerInput(e) {
        let dx = 0, dy = 0;
        
        switch(e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                dy = -1;
                break;
            case 's':
            case 'arrowdown':
                dy = 1;
                break;
            case 'a':
            case 'arrowleft':
                dx = -1;
                break;
            case 'd':
            case 'arrowright':
                dx = 1;
                break;
            case ' ':
                // Wait
                this.addMessage("You wait a moment...");
                this.updateEnemies();
                break;
            case 'i':
                this.openInventory();
                break;
            case 'e':
                this.examineTile();
                break;
        }
        
        if (dx !== 0 || dy !== 0) {
            this.movePlayer(dx, dy);
        }
    }
    
    movePlayer(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;
        
        // Check if move is valid
        if (this.map.isWalkable(newX, newY)) {
            // Check for enemies
            const enemy = this.getEnemyAt(newX, newY);
            if (enemy) {
                this.startBattle(enemy);
                return;
            }
            
            // Check for items
            const item = this.getItemAt(newX, newY);
            if (item) {
                this.pickupItem(item);
            }
            
            // Move player
            this.player.x = newX;
            this.player.y = newY;
            
            // Update camera
            this.updateCamera();
            
            // Update enemies
            this.updateEnemies();
            
            this.addMessage(`You move ${dx > 0 ? 'east' : dx < 0 ? 'west' : ''}${dy > 0 ? 'south' : dy < 0 ? 'north' : ''}`);
        }
    }
    
    getEnemyAt(x, y) {
        return this.enemies.find(enemy => enemy.x === x && enemy.y === y);
    }
    
    getItemAt(x, y) {
        return this.items.find(item => item.x === x && item.y === y);
    }
    
    startBattle(enemy) {
        this.currentEnemy = enemy;
        this.gameState = 'battle';
        this.battleSystem.startBattle(enemy);
        this.ui.showBattleModal(enemy);
    }
    
    endBattle() {
        this.gameState = 'playing';
        this.ui.hideBattleModal();
        
        if (this.currentEnemy.hp <= 0) {
            // Enemy defeated
            this.enemies = this.enemies.filter(e => e !== this.currentEnemy);
            this.player.gainExperience(this.currentEnemy.experienceValue);
            this.addMessage(`You defeated the ${this.currentEnemy.name}!`);
            
            // Chance to drop item
            if (Math.random() < 0.3) {
                const itemTypes = ['potion', 'scroll', 'gold'];
                const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
                const item = new Item(this.currentEnemy.x, this.currentEnemy.y, itemType);
                this.items.push(item);
                this.addMessage(`The ${this.currentEnemy.name} dropped a ${item.name}!`);
            }
        }
        
        this.currentEnemy = null;
    }
    
    pickupItem(item) {
        this.player.addToInventory(item);
        this.items = this.items.filter(i => i !== item);
        this.addMessage(`You picked up ${item.name}!`);
    }
    
    openInventory() {
        this.gameState = 'inventory';
        this.ui.showInventoryModal();
    }
    
    closeInventory() {
        this.gameState = 'playing';
        this.ui.hideInventoryModal();
    }
    
    examineTile() {
        const x = this.player.x;
        const y = this.player.y;
        
        const enemy = this.getEnemyAt(x, y);
        const item = this.getItemAt(x, y);
        
        if (enemy) {
            this.addMessage(`You see a ${enemy.name} (HP: ${enemy.hp}/${enemy.maxHp})`);
        } else if (item) {
            this.addMessage(`You see ${item.name} on the ground`);
        } else {
            this.addMessage("You see nothing of interest here");
        }
    }
    
    updateEnemies() {
        // Simple AI: enemies move randomly
        this.enemies.forEach(enemy => {
            if (Math.random() < 0.3) { // 30% chance to move
                const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];
                const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
                const newX = enemy.x + dx;
                const newY = enemy.y + dy;
                
                if (this.map.isWalkable(newX, newY) && 
                    !this.getEnemyAt(newX, newY) && 
                    !this.getItemAt(newX, newY) &&
                    !(newX === this.player.x && newY === this.player.y)) {
                    enemy.x = newX;
                    enemy.y = newY;
                }
            }
        });
    }
    
    updateCamera() {
        // Center camera on player
        this.cameraX = Math.max(0, Math.min(this.player.x - 25, this.mapWidth - 50));
        this.cameraY = Math.max(0, Math.min(this.player.y - 19, this.mapHeight - 38));
    }
    
    addMessage(message) {
        this.messageLog.push(message);
        if (this.messageLog.length > this.maxMessages) {
            this.messageLog.shift();
        }
        this.ui.updateMessageLog();
    }
    
    render() {
        console.log('Rendering frame...');
        
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        console.log('Canvas cleared, rendering map...');
        // Render map
        this.renderMap();
        
        console.log('Map rendered, rendering items...');
        // Render items
        this.renderItems();
        
        console.log('Items rendered, rendering enemies...');
        // Render enemies
        this.renderEnemies();
        
        console.log('Enemies rendered, rendering player...');
        // Render player
        this.renderPlayer();
        
        // Add lighting effect around player
        this.renderLighting();
        
        console.log('Frame rendered successfully');
    }
    
    renderMap() {
        let floorTilesRendered = 0;
        let wallTilesRendered = 0;
        
        for (let y = 0; y < 38; y++) {
            for (let x = 0; x < 50; x++) {
                const mapX = x + this.cameraX;
                const mapY = y + this.cameraY;
                
                if (mapX >= 0 && mapX < this.mapWidth && mapY >= 0 && mapY < this.mapHeight) {
                    const tile = this.map.getTile(mapX, mapY);
                    const screenX = x * this.tileSize;
                    const screenY = y * this.tileSize;
                    
                    if (tile === '#') {
                        // Wall - draw as dark stone blocks
                        this.ctx.fillStyle = '#2a2a2a';
                        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        
                        // Add stone texture
                        this.ctx.fillStyle = '#3a3a3a';
                        this.ctx.fillRect(screenX + 2, screenY + 2, this.tileSize - 4, this.tileSize - 4);
                        
                        // Add highlights
                        this.ctx.fillStyle = '#4a4a4a';
                        this.ctx.fillRect(screenX + 1, screenY + 1, 2, 2);
                        this.ctx.fillRect(screenX + this.tileSize - 3, screenY + 1, 2, 2);
                        
                        wallTilesRendered++;
                    } else if (tile === '.') {
                        // Floor - draw as stone tiles
                        this.ctx.fillStyle = '#1a1a1a';
                        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        
                        // Add tile pattern
                        this.ctx.fillStyle = '#252525';
                        this.ctx.fillRect(screenX + 1, screenY + 1, this.tileSize - 2, this.tileSize - 2);
                        
                        // Add subtle grid lines
                        this.ctx.strokeStyle = '#333';
                        this.ctx.lineWidth = 0.5;
                        this.ctx.strokeRect(screenX + 0.5, screenY + 0.5, this.tileSize - 1, this.tileSize - 1);
                        
                        floorTilesRendered++;
                    }
                }
            }
        }
        
        console.log(`Map rendered: ${floorTilesRendered} floor tiles, ${wallTilesRendered} wall tiles`);
    }
    
    renderItems() {
        this.items.forEach(item => {
            const screenX = (item.x - this.cameraX) * this.tileSize;
            const screenY = (item.y - this.cameraY) * this.tileSize;
            
            if (screenX >= 0 && screenX < this.canvas.width && 
                screenY >= 0 && screenY < this.canvas.height) {
                
                this.renderItemSprite(item, screenX, screenY);
            }
        });
    }
    
    renderItemSprite(item, x, y) {
        const centerX = x + this.tileSize / 2;
        const centerY = y + this.tileSize / 2;
        const size = this.tileSize * 0.6;
        
        switch (item.type) {
            case 'weapon':
                // Draw weapon as a sword shape
                this.ctx.fillStyle = item.color;
                this.ctx.fillRect(centerX - 1, y + 2, 2, this.tileSize - 4); // Handle
                this.ctx.fillRect(centerX - 3, y + 3, 6, 2); // Crossguard
                this.ctx.fillRect(centerX - 2, y + 2, 4, 3); // Blade
                break;
                
            case 'armor':
                // Draw armor as a chest piece
                this.ctx.fillStyle = item.color;
                this.ctx.fillRect(centerX - 3, centerY - 2, 6, 4); // Main body
                this.ctx.fillRect(centerX - 2, centerY - 3, 4, 2); // Shoulders
                break;
                
            case 'shield':
                // Draw shield as a circle
                this.ctx.fillStyle = item.color;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
                this.ctx.fill();
                // Add shield boss
                this.ctx.fillStyle = '#8b4513';
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, size / 4, 0, Math.PI * 2);
                this.ctx.fill();
                break;
                
            case 'potion':
                // Draw potion as a bottle
                this.ctx.fillStyle = item.color;
                this.ctx.fillRect(centerX - 2, centerY - 3, 4, 6); // Bottle body
                this.ctx.fillRect(centerX - 1, centerY - 4, 2, 2); // Bottle neck
                // Add liquid
                this.ctx.fillStyle = '#ff6666';
                this.ctx.fillRect(centerX - 1, centerY - 2, 2, 4);
                break;
                
            case 'scroll':
                // Draw scroll as a rolled paper
                this.ctx.fillStyle = '#f5f5dc';
                this.ctx.fillRect(centerX - 3, centerY - 2, 6, 4);
                // Add scroll details
                this.ctx.fillStyle = '#8b4513';
                this.ctx.fillRect(centerX - 2, centerY - 1, 4, 2);
                break;
                
            case 'treasure':
                if (item.name.includes('Gold')) {
                    // Draw gold as coins
                    this.ctx.fillStyle = '#ffd700';
                    this.ctx.beginPath();
                    this.ctx.arc(centerX - 2, centerY, 2, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.beginPath();
                    this.ctx.arc(centerX + 2, centerY, 2, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (item.name.includes('Gem')) {
                    // Draw gem as a diamond
                    this.ctx.fillStyle = item.color;
                    this.ctx.beginPath();
                    this.ctx.moveTo(centerX, y + 2);
                    this.ctx.lineTo(centerX - 3, centerY);
                    this.ctx.lineTo(centerX, y + this.tileSize - 2);
                    this.ctx.lineTo(centerX + 3, centerY);
                    this.ctx.closePath();
                    this.ctx.fill();
                } else {
                    // Default treasure
                    this.ctx.fillStyle = item.color;
                    this.ctx.fillRect(centerX - 2, centerY - 2, 4, 4);
                }
                break;
                
            default:
                // Default item
                this.ctx.fillStyle = item.color;
                this.ctx.fillRect(centerX - 2, centerY - 2, 4, 4);
        }
    }
    
    renderEnemies() {
        this.enemies.forEach(enemy => {
            const screenX = (enemy.x - this.cameraX) * this.tileSize;
            const screenY = (enemy.y - this.cameraY) * this.tileSize;
            
            if (screenX >= 0 && screenX < this.canvas.width && 
                screenY >= 0 && screenY < this.canvas.height) {
                
                this.renderEnemySprite(enemy, screenX, screenY);
            }
        });
    }
    
    renderEnemySprite(enemy, x, y) {
        const centerX = x + this.tileSize / 2;
        const centerY = y + this.tileSize / 2;
        const size = this.tileSize * 0.7;
        
        switch (enemy.type) {
            case 'goblin':
                // Draw goblin as a small humanoid
                this.ctx.fillStyle = enemy.color;
                this.ctx.fillRect(centerX - 2, centerY - 3, 4, 6); // Body
                this.ctx.fillRect(centerX - 1, centerY - 4, 2, 2); // Head
                // Add eyes
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(centerX - 1, centerY - 4, 1, 1);
                this.ctx.fillRect(centerX, centerY - 4, 1, 1);
                break;
                
            case 'orc':
                // Draw orc as a larger humanoid
                this.ctx.fillStyle = enemy.color;
                this.ctx.fillRect(centerX - 3, centerY - 4, 6, 8); // Body
                this.ctx.fillRect(centerX - 2, centerY - 5, 4, 2); // Head
                // Add tusks
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(centerX - 2, centerY - 4, 1, 1);
                this.ctx.fillRect(centerX + 1, centerY - 4, 1, 1);
                break;
                
            case 'troll':
                // Draw troll as a large, bulky creature
                this.ctx.fillStyle = enemy.color;
                this.ctx.fillRect(centerX - 4, centerY - 5, 8, 10); // Large body
                this.ctx.fillRect(centerX - 3, centerY - 6, 6, 2); // Head
                // Add club
                this.ctx.fillStyle = '#8b4513';
                this.ctx.fillRect(centerX + 3, centerY - 2, 3, 6);
                break;
                
            case 'dragon':
                // Draw dragon as a large winged creature
                this.ctx.fillStyle = enemy.color;
                this.ctx.fillRect(centerX - 4, centerY - 4, 8, 8); // Body
                this.ctx.fillRect(centerX - 3, centerY - 5, 6, 2); // Head
                // Add wings
                this.ctx.fillStyle = '#8b0000';
                this.ctx.fillRect(centerX - 6, centerY - 2, 3, 4);
                this.ctx.fillRect(centerX + 3, centerY - 2, 3, 4);
                // Add tail
                this.ctx.fillRect(centerX + 2, centerY + 2, 4, 2);
                break;
                
            case 'skeleton':
                // Draw skeleton as a bony humanoid
                this.ctx.fillStyle = enemy.color;
                this.ctx.fillRect(centerX - 2, centerY - 3, 4, 6); // Body
                this.ctx.fillRect(centerX - 1, centerY - 4, 2, 2); // Head
                // Add bone details
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(centerX - 1, centerY - 2, 2, 1);
                this.ctx.fillRect(centerX - 1, centerY, 2, 1);
                break;
                
            case 'zombie':
                // Draw zombie as a shambling humanoid
                this.ctx.fillStyle = enemy.color;
                this.ctx.fillRect(centerX - 3, centerY - 4, 6, 8); // Body
                this.ctx.fillRect(centerX - 2, centerY - 5, 4, 2); // Head
                // Add zombie details
                this.ctx.fillStyle = '#654321';
                this.ctx.fillRect(centerX - 1, centerY - 4, 2, 1);
                break;
                
            default:
                // Default enemy
                this.ctx.fillStyle = enemy.color;
                this.ctx.fillRect(centerX - 2, centerY - 2, 4, 4);
        }
        
        // Add health bar for enemies
        const healthPercent = enemy.hp / enemy.maxHp;
        const barWidth = this.tileSize - 4;
        const barHeight = 2;
        
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x + 2, y - 4, barWidth, barHeight);
        this.ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        this.ctx.fillRect(x + 2, y - 4, barWidth * healthPercent, barHeight);
    }
    
    renderPlayer() {
        const screenX = (this.player.x - this.cameraX) * this.tileSize;
        const screenY = (this.player.y - this.cameraY) * this.tileSize;
        
        this.renderPlayerSprite(screenX, screenY);
    }
    
    renderPlayerSprite(x, y) {
        const centerX = x + this.tileSize / 2;
        const centerY = y + this.tileSize / 2;
        
        // Draw player as a heroic figure
        this.ctx.fillStyle = this.player.color;
        
        // Body
        this.ctx.fillRect(centerX - 3, centerY - 3, 6, 6);
        
        // Head
        this.ctx.fillRect(centerX - 2, centerY - 5, 4, 3);
        
        // Eyes
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(centerX - 1, centerY - 4, 1, 1);
        this.ctx.fillRect(centerX, centerY - 4, 1, 1);
        
        // Equipment indicators
        if (this.player.weapon) {
            this.ctx.fillStyle = '#ccc';
            this.ctx.fillRect(centerX + 2, centerY - 1, 3, 2); // Sword
        }
        
        if (this.player.shield) {
            this.ctx.fillStyle = '#8b4513';
            this.ctx.fillRect(centerX - 5, centerY - 1, 2, 2); // Shield
        }
        
        // Add a subtle glow effect
        this.ctx.shadowColor = this.player.color;
        this.ctx.shadowBlur = 5;
        this.ctx.fillRect(centerX - 3, centerY - 3, 6, 6);
        this.ctx.shadowBlur = 0;
        
        // Health bar
        const healthPercent = this.player.hp / this.player.maxHp;
        const barWidth = this.tileSize - 4;
        const barHeight = 3;
        
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x + 2, y - 8, barWidth, barHeight);
        this.ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        this.ctx.fillRect(x + 2, y - 8, barWidth * healthPercent, barHeight);
    }
    
    renderLighting() {
        // Create a radial gradient for lighting effect around the player
        const playerScreenX = (this.player.x - this.cameraX) * this.tileSize + this.tileSize / 2;
        const playerScreenY = (this.player.y - this.cameraY) * this.tileSize + this.tileSize / 2;
        const lightRadius = this.tileSize * 8;
        
        // Create gradient
        const gradient = this.ctx.createRadialGradient(
            playerScreenX, playerScreenY, 0,
            playerScreenX, playerScreenY, lightRadius
        );
        
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
        gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    gameLoop() {
        this.render();
        this.ui.update();
        requestAnimationFrame(() => this.gameLoop());
    }
}

window.Game = Game; 