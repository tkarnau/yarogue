class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.tileSize = 16;
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
        
        this.init();
    }
    
    init() {
        // Initialize game systems
        this.map = new Map(this.mapWidth, this.mapHeight);
        this.player = new Player(25, 19); // Start in center
        this.battleSystem = new BattleSystem(this);
        this.ui = new UI(this);
        
        // Generate initial map
        this.map.generate();
        
        // Add some enemies
        this.spawnEnemies();
        
        // Add some items
        this.spawnItems();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start game loop
        this.gameLoop();
    }
    
    spawnEnemies() {
        const enemyTypes = ['goblin', 'orc', 'troll', 'dragon'];
        const numEnemies = 5 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < numEnemies; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * this.mapWidth);
                y = Math.floor(Math.random() * this.mapHeight);
            } while (this.map.getTile(x, y) !== '.' || 
                     (x === this.player.x && y === this.player.y));
            
            const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            const enemy = new Enemy(x, y, enemyType);
            this.enemies.push(enemy);
        }
    }
    
    spawnItems() {
        const itemTypes = ['sword', 'shield', 'potion', 'scroll', 'gold'];
        const numItems = 3 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numItems; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * this.mapWidth);
                y = Math.floor(Math.random() * this.mapHeight);
            } while (this.map.getTile(x, y) !== '.' || 
                     (x === this.player.x && y === this.player.y));
            
            const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            const item = new Item(x, y, itemType);
            this.items.push(item);
        }
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
        if (this.map.getTile(newX, newY) === '.') {
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
                
                if (this.map.getTile(newX, newY) === '.' && 
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
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render map
        this.renderMap();
        
        // Render items
        this.renderItems();
        
        // Render enemies
        this.renderEnemies();
        
        // Render player
        this.renderPlayer();
    }
    
    renderMap() {
        for (let y = 0; y < 38; y++) {
            for (let x = 0; x < 50; x++) {
                const mapX = x + this.cameraX;
                const mapY = y + this.cameraY;
                
                if (mapX >= 0 && mapX < this.mapWidth && mapY >= 0 && mapY < this.mapHeight) {
                    const tile = this.map.getTile(mapX, mapY);
                    const screenX = x * this.tileSize;
                    const screenY = y * this.tileSize;
                    
                    this.ctx.fillStyle = tile === '#' ? '#333' : '#000';
                    this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                    
                    if (tile === '#') {
                        this.ctx.strokeStyle = '#666';
                        this.ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
                    }
                }
            }
        }
    }
    
    renderItems() {
        this.items.forEach(item => {
            const screenX = (item.x - this.cameraX) * this.tileSize;
            const screenY = (item.y - this.cameraY) * this.tileSize;
            
            if (screenX >= 0 && screenX < this.canvas.width && 
                screenY >= 0 && screenY < this.canvas.height) {
                
                this.ctx.fillStyle = item.color;
                this.ctx.font = '12px monospace';
                this.ctx.fillText(item.symbol, screenX + 2, screenY + 12);
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
                this.ctx.font = '12px monospace';
                this.ctx.fillText(enemy.symbol, screenX + 2, screenY + 12);
            }
        });
    }
    
    renderPlayer() {
        const screenX = (this.player.x - this.cameraX) * this.tileSize;
        const screenY = (this.player.y - this.cameraY) * this.tileSize;
        
        this.ctx.fillStyle = this.player.color;
        this.ctx.font = '12px monospace';
        this.ctx.fillText(this.player.symbol, screenX + 2, screenY + 12);
    }
    
    gameLoop() {
        this.render();
        this.ui.update();
        requestAnimationFrame(() => this.gameLoop());
    }
} 