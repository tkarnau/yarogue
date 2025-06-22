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
        
        this.tileSize = 20;
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
                        // Wall
                        this.ctx.fillStyle = '#333';
                        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        this.ctx.strokeStyle = '#666';
                        this.ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
                        wallTilesRendered++;
                    } else if (tile === '.') {
                        // Floor
                        this.ctx.fillStyle = '#222';
                        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
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
                
                this.ctx.fillStyle = item.color;
                this.ctx.font = '16px monospace';
                this.ctx.fillText(item.symbol, screenX + 3, screenY + 15);
            }
        });
    }
    
    renderEnemies() {
        this.enemies.forEach(enemy => {
            const screenX = (enemy.x - this.cameraX) * this.tileSize;
            const screenY = (enemy.y - this.cameraY) * this.tileSize;
            
            if (screenX >= 0 && screenX < this.canvas.width && 
                screenY >= 0 && screenY < this.canvas.height) {
                
                this.ctx.fillStyle = enemy.color;
                this.ctx.font = '16px monospace';
                this.ctx.fillText(enemy.symbol, screenX + 3, screenY + 15);
            }
        });
    }
    
    renderPlayer() {
        const screenX = (this.player.x - this.cameraX) * this.tileSize;
        const screenY = (this.player.y - this.cameraY) * this.tileSize;
        
        this.ctx.fillStyle = this.player.color;
        this.ctx.font = '16px monospace';
        this.ctx.fillText(this.player.symbol, screenX + 3, screenY + 15);
    }
    
    gameLoop() {
        this.render();
        this.ui.update();
        requestAnimationFrame(() => this.gameLoop());
    }
}

window.Game = Game; 