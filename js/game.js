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
        
        this.tileSize = 24; // Increased from 20 for better visibility
        this.mapWidth = 50;
        this.mapHeight = 38;
        
        // Calculate viewport dimensions based on canvas size
        this.viewportWidth = Math.floor(this.canvas.width / this.tileSize);
        this.viewportHeight = Math.floor(this.canvas.height / this.tileSize);
        
        // Ensure viewport doesn't exceed map size
        this.viewportWidth = Math.min(this.viewportWidth, this.mapWidth);
        this.viewportHeight = Math.min(this.viewportHeight, this.mapHeight);
        
        console.log(`Viewport calculated: ${this.viewportWidth}x${this.viewportHeight} tiles`);
        console.log(`Canvas size: ${this.canvas.width}x${this.canvas.height} pixels`);
        console.log(`Tile size: ${this.tileSize} pixels`);
        
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
            
            // Ensure spawn position is within map bounds
            const clampedX = Math.max(0, Math.min(centerX, this.mapWidth - 1));
            const clampedY = Math.max(0, Math.min(centerY, this.mapHeight - 1));
            
            if (this.map.isWalkable(clampedX, clampedY)) {
                console.log(`Spawning player in room center: ${clampedX}, ${clampedY}`);
                return { x: clampedX, y: clampedY };
            }
        }
        
        // If no room or room center is invalid, find any floor tile within map bounds
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
            const spawnPos = floorTiles[Math.floor(Math.random() * floorTiles.length)];
            console.log(`Spawning player on random floor tile: ${spawnPos.x}, ${spawnPos.y}`);
            return spawnPos;
        }
        
        // Fallback to center of map
        const fallbackX = Math.floor(this.mapWidth / 2);
        const fallbackY = Math.floor(this.mapHeight / 2);
        console.warn(`No valid spawn position found, using map center: ${fallbackX}, ${fallbackY}`);
        return { x: fallbackX, y: fallbackY };
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
        // Calculate the center of the viewport
        const viewportCenterX = Math.floor(this.viewportWidth / 2);
        const viewportCenterY = Math.floor(this.viewportHeight / 2);
        
        // Center camera on player
        let targetCameraX = this.player.x - viewportCenterX;
        let targetCameraY = this.player.y - viewportCenterY;
        
        // Clamp camera to map boundaries
        this.cameraX = Math.max(0, Math.min(targetCameraX, this.mapWidth - this.viewportWidth));
        this.cameraY = Math.max(0, Math.min(targetCameraY, this.mapHeight - this.viewportHeight));
        
        // Ensure camera doesn't go negative (shouldn't happen with the above clamping, but safety check)
        this.cameraX = Math.max(0, this.cameraX);
        this.cameraY = Math.max(0, this.cameraY);
        
        // Validate camera bounds
        this.validateCameraBounds();
    }
    
    validateCameraBounds() {
        // Safety checks to ensure camera is always within valid bounds
        if (this.cameraX < 0) {
            console.warn(`Camera X was negative (${this.cameraX}), clamping to 0`);
            this.cameraX = 0;
        }
        if (this.cameraY < 0) {
            console.warn(`Camera Y was negative (${this.cameraY}), clamping to 0`);
            this.cameraY = 0;
        }
        if (this.cameraX + this.viewportWidth > this.mapWidth) {
            console.warn(`Camera X would exceed map width, clamping to ${this.mapWidth - this.viewportWidth}`);
            this.cameraX = this.mapWidth - this.viewportWidth;
        }
        if (this.cameraY + this.viewportHeight > this.mapHeight) {
            console.warn(`Camera Y would exceed map height, clamping to ${this.mapHeight - this.viewportHeight}`);
            this.cameraY = this.mapHeight - this.viewportHeight;
        }
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
        
        for (let y = 0; y < this.viewportHeight; y++) {
            for (let x = 0; x < this.viewportWidth; x++) {
                const mapX = x + this.cameraX;
                const mapY = y + this.cameraY;
                
                if (mapX >= 0 && mapX < this.mapWidth && mapY >= 0 && mapY < this.mapHeight) {
                    const tile = this.map.getTile(mapX, mapY);
                    const biome = this.map.getBiome(mapX, mapY);
                    const screenX = x * this.tileSize;
                    const screenY = y * this.tileSize;
                    
                    this.renderTile(tile, biome, screenX, screenY, mapX, mapY);
                    
                    if (tile === '#') {
                        wallTilesRendered++;
                    } else if (tile === '.' || tile === 'vegetation' || tile === 'steam' || tile === 'mud' || tile === 'lava' || tile === 'water' || tile === 'crystal') {
                        floorTilesRendered++;
                    }
                }
            }
        }
        
        console.log(`Map rendered: ${floorTilesRendered} floor tiles, ${wallTilesRendered} wall tiles`);
    }
    
    renderTile(tile, biome, screenX, screenY, mapX, mapY) {
        switch (tile) {
            case '#':
                this.renderWall(screenX, screenY, biome);
                break;
            case '.':
                this.renderFloor(screenX, screenY, biome);
                break;
            case 'lava':
                this.renderLava(screenX, screenY);
                break;
            case 'steam':
                this.renderSteam(screenX, screenY);
                break;
            case 'vegetation':
                this.renderVegetation(screenX, screenY);
                break;
            case 'water':
                this.renderWater(screenX, screenY);
                break;
            case 'mud':
                this.renderMud(screenX, screenY);
                break;
            case 'crystal':
                this.renderCrystal(screenX, screenY);
                break;
            default:
                this.renderFloor(screenX, screenY, biome);
        }
    }
    
    renderWall(screenX, screenY, biome) {
        let baseColor, textureColor, highlightColor;
        
        switch (biome) {
            case 'heated':
                baseColor = '#4a2a2a';
                textureColor = '#5a3a3a';
                highlightColor = '#6a4a4a';
                break;
            case 'jungle':
                baseColor = '#2a4a2a';
                textureColor = '#3a5a3a';
                highlightColor = '#4a6a4a';
                break;
            case 'crystal':
                baseColor = '#2a2a4a';
                textureColor = '#3a3a5a';
                highlightColor = '#4a4a6a';
                break;
            case 'swamp':
                baseColor = '#2a4a4a';
                textureColor = '#3a5a5a';
                highlightColor = '#4a6a6a';
                break;
            default: // stone
                baseColor = '#2a2a2a';
                textureColor = '#3a3a3a';
                highlightColor = '#4a4a4a';
        }
        
        // Wall - draw as dark stone blocks
        this.ctx.fillStyle = baseColor;
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
        
        // Add stone texture
        this.ctx.fillStyle = textureColor;
        this.ctx.fillRect(screenX + 2, screenY + 2, this.tileSize - 4, this.tileSize - 4);
        
        // Add highlights
        this.ctx.fillStyle = highlightColor;
        this.ctx.fillRect(screenX + 1, screenY + 1, 2, 2);
        this.ctx.fillRect(screenX + this.tileSize - 3, screenY + 1, 2, 2);
    }
    
    renderFloor(screenX, screenY, biome) {
        let baseColor, patternColor;
        
        switch (biome) {
            case 'heated':
                baseColor = '#3a1a1a';
                patternColor = '#4a2a2a';
                break;
            case 'jungle':
                baseColor = '#1a3a1a';
                patternColor = '#2a4a2a';
                break;
            case 'crystal':
                baseColor = '#1a1a3a';
                patternColor = '#2a2a4a';
                break;
            case 'swamp':
                baseColor = '#1a3a3a';
                patternColor = '#2a4a4a';
                break;
            default: // stone
                baseColor = '#1a1a1a';
                patternColor = '#252525';
        }
        
        // Floor - draw as stone tiles
        this.ctx.fillStyle = baseColor;
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
        
        // Add tile pattern
        this.ctx.fillStyle = patternColor;
        this.ctx.fillRect(screenX + 1, screenY + 1, this.tileSize - 2, this.tileSize - 2);
        
        // Add subtle grid lines
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 0.5;
        this.ctx.strokeRect(screenX + 0.5, screenY + 0.5, this.tileSize - 1, this.tileSize - 1);
    }
    
    renderLava(screenX, screenY) {
        // Animated lava effect
        const time = Date.now() * 0.005;
        const brightness = Math.sin(time + screenX * 0.1 + screenY * 0.1) * 0.3 + 0.7;
        
        this.ctx.fillStyle = `rgba(255, ${Math.floor(100 * brightness)}, 0, 0.8)`;
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
        
        // Add lava bubbles
        this.ctx.fillStyle = `rgba(255, ${Math.floor(150 * brightness)}, 50, 0.6)`;
        this.ctx.beginPath();
        this.ctx.arc(screenX + this.tileSize/2, screenY + this.tileSize/2, 3, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    renderSteam(screenX, screenY) {
        // Steam effect
        this.ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
        
        // Add steam particles
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        for (let i = 0; i < 3; i++) {
            const x = screenX + Math.random() * this.tileSize;
            const y = screenY + Math.random() * this.tileSize;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 1, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    renderVegetation(screenX, screenY) {
        // Base floor
        this.renderFloor(screenX, screenY, 'jungle');
        
        // Add vegetation
        this.ctx.fillStyle = '#2d5a2d';
        this.ctx.fillRect(screenX + 2, screenY + 2, this.tileSize - 4, this.tileSize - 4);
        
        // Add grass details
        this.ctx.fillStyle = '#4a7a4a';
        for (let i = 0; i < 4; i++) {
            const x = screenX + 3 + (i * 4);
            const y = screenY + this.tileSize - 6;
            this.ctx.fillRect(x, y, 2, 4);
        }
    }
    
    renderWater(screenX, screenY) {
        // Water effect
        this.ctx.fillStyle = 'rgba(0, 100, 200, 0.7)';
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
        
        // Add water ripples
        this.ctx.fillStyle = 'rgba(0, 150, 255, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(screenX + this.tileSize/2, screenY + this.tileSize/2, 6, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    renderMud(screenX, screenY) {
        // Mud effect
        this.ctx.fillStyle = '#5d4e37';
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
        
        // Add mud texture
        this.ctx.fillStyle = '#6d5e47';
        this.ctx.fillRect(screenX + 2, screenY + 2, this.tileSize - 4, this.tileSize - 4);
        
        // Add mud bubbles
        this.ctx.fillStyle = '#4d3e27';
        this.ctx.beginPath();
        this.ctx.arc(screenX + this.tileSize/3, screenY + this.tileSize/3, 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    renderCrystal(screenX, screenY) {
        // Crystal effect
        this.ctx.fillStyle = 'rgba(100, 100, 255, 0.8)';
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
        
        // Add crystal facets
        this.ctx.fillStyle = 'rgba(150, 150, 255, 0.9)';
        this.ctx.beginPath();
        this.ctx.moveTo(screenX + this.tileSize/2, screenY);
        this.ctx.lineTo(screenX + this.tileSize - 2, screenY + this.tileSize/2);
        this.ctx.lineTo(screenX + this.tileSize/2, screenY + this.tileSize);
        this.ctx.lineTo(screenX + 2, screenY + this.tileSize/2);
        this.ctx.closePath();
        this.ctx.fill();
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
        
        // Draw player as a heroic figure - larger and more detailed
        this.ctx.fillStyle = this.player.color;
        
        // Main body - larger
        this.ctx.fillRect(centerX - 4, centerY - 3, 8, 7);
        
        // Head - larger
        this.ctx.fillRect(centerX - 3, centerY - 6, 6, 4);
        
        // Eyes - more prominent
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(centerX - 2, centerY - 5, 1, 1);
        this.ctx.fillRect(centerX + 1, centerY - 5, 1, 1);
        
        // Add a nose
        this.ctx.fillRect(centerX, centerY - 4, 1, 1);
        
        // Equipment indicators - more detailed
        if (this.player.weapon) {
            // Sword - larger and more detailed
            this.ctx.fillStyle = '#ccc';
            this.ctx.fillRect(centerX + 3, centerY - 1, 4, 3); // Blade
            this.ctx.fillStyle = '#8b4513';
            this.ctx.fillRect(centerX + 2, centerY, 1, 2); // Handle
            this.ctx.fillStyle = '#daa520';
            this.ctx.fillRect(centerX + 1, centerY - 1, 2, 1); // Crossguard
        }
        
        if (this.player.shield) {
            // Shield - larger and more detailed
            this.ctx.fillStyle = '#8b4513';
            this.ctx.beginPath();
            this.ctx.arc(centerX - 6, centerY, 3, 0, Math.PI * 2);
            this.ctx.fill();
            // Shield boss
            this.ctx.fillStyle = '#daa520';
            this.ctx.beginPath();
            this.ctx.arc(centerX - 6, centerY, 1.5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Add armor details
        if (this.player.armor) {
            this.ctx.fillStyle = '#4a4a4a';
            this.ctx.fillRect(centerX - 3, centerY - 2, 6, 5);
            // Armor highlights
            this.ctx.fillStyle = '#6a6a6a';
            this.ctx.fillRect(centerX - 2, centerY - 1, 4, 3);
        }
        
        // Add cape/cloak effect
        this.ctx.fillStyle = '#8b0000';
        this.ctx.fillRect(centerX - 2, centerY + 2, 4, 3);
        
        // Add a subtle glow effect - more prominent
        this.ctx.shadowColor = this.player.color;
        this.ctx.shadowBlur = 8;
        this.ctx.fillRect(centerX - 4, centerY - 3, 8, 7);
        this.ctx.shadowBlur = 0;
        
        // Health bar - larger and more prominent
        const healthPercent = this.player.hp / this.player.maxHp;
        const barWidth = this.tileSize - 2;
        const barHeight = 4;
        
        // Health bar background
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x + 1, y - 10, barWidth, barHeight);
        
        // Health bar border
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x + 1, y - 10, barWidth, barHeight);
        
        // Health bar fill
        this.ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        this.ctx.fillRect(x + 1, y - 10, barWidth * healthPercent, barHeight);
        
        // Add level indicator
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '10px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`L${this.player.level}`, centerX, y - 12);
        this.ctx.textAlign = 'left';
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