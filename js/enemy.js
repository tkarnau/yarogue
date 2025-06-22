class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        
        // Set properties based on enemy type
        this.setupEnemyType(type);
    }
    
    setupEnemyType(type) {
        switch (type) {
            case 'goblin':
                this.name = 'Goblin';
                this.symbol = 'g';
                this.color = '#00ff00';
                this.hp = 8;
                this.maxHp = 8;
                this.attack = 3;
                this.defense = 1;
                this.experienceValue = 15;
                this.goldValue = 5;
                break;
                
            case 'orc':
                this.name = 'Orc';
                this.symbol = 'o';
                this.color = '#ff6600';
                this.hp = 15;
                this.maxHp = 15;
                this.attack = 5;
                this.defense = 2;
                this.experienceValue = 25;
                this.goldValue = 10;
                break;
                
            case 'troll':
                this.name = 'Troll';
                this.symbol = 'T';
                this.color = '#800080';
                this.hp = 25;
                this.maxHp = 25;
                this.attack = 7;
                this.defense = 3;
                this.experienceValue = 40;
                this.goldValue = 20;
                break;
                
            case 'dragon':
                this.name = 'Dragon';
                this.symbol = 'D';
                this.color = '#ff0000';
                this.hp = 50;
                this.maxHp = 50;
                this.attack = 12;
                this.defense = 5;
                this.experienceValue = 100;
                this.goldValue = 50;
                break;
                
            case 'skeleton':
                this.name = 'Skeleton';
                this.symbol = 's';
                this.color = '#cccccc';
                this.hp = 12;
                this.maxHp = 12;
                this.attack = 4;
                this.defense = 1;
                this.experienceValue = 20;
                this.goldValue = 8;
                break;
                
            case 'zombie':
                this.name = 'Zombie';
                this.symbol = 'z';
                this.color = '#8b4513';
                this.hp = 18;
                this.maxHp = 18;
                this.attack = 6;
                this.defense = 2;
                this.experienceValue = 30;
                this.goldValue = 12;
                break;
                
            default:
                this.name = 'Unknown';
                this.symbol = '?';
                this.color = '#ffffff';
                this.hp = 10;
                this.maxHp = 10;
                this.attack = 4;
                this.defense = 1;
                this.experienceValue = 20;
                this.goldValue = 10;
        }
    }
    
    takeDamage(amount) {
        const actualDamage = Math.max(1, amount - this.defense);
        this.hp -= actualDamage;
        
        if (this.hp <= 0) {
            this.hp = 0;
            return 'death';
        }
        
        return actualDamage;
    }
    
    attackPlayer(player) {
        const damage = Math.max(1, this.attack - player.getTotalDefense());
        const result = player.takeDamage(damage);
        
        if (result === 'death') {
            return `The ${this.name} deals ${damage} damage! You are defeated!`;
        } else {
            return `The ${this.name} deals ${damage} damage!`;
        }
    }
    
    isAlive() {
        return this.hp > 0;
    }
    
    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }
    
    // Special abilities for certain enemies
    hasSpecialAbility() {
        return this.type === 'dragon' || this.type === 'troll';
    }
    
    useSpecialAbility(player) {
        if (!this.hasSpecialAbility()) {
            return null;
        }
        
        switch (this.type) {
            case 'dragon':
                if (Math.random() < 0.3) { // 30% chance
                    const fireDamage = Math.floor(this.attack * 1.5);
                    const result = player.takeDamage(fireDamage);
                    return `The Dragon breathes fire for ${fireDamage} damage!`;
                }
                break;
                
            case 'troll':
                if (Math.random() < 0.2) { // 20% chance
                    this.heal(5);
                    return `The Troll regenerates 5 HP!`;
                }
                break;
        }
        
        return null;
    }
    
    // AI behavior
    getMoveDirection(playerX, playerY) {
        // Simple AI: move towards player if close, random otherwise
        const distance = Math.abs(this.x - playerX) + Math.abs(this.y - playerY);
        
        if (distance <= 3) {
            // Move towards player
            const dx = playerX > this.x ? 1 : playerX < this.x ? -1 : 0;
            const dy = playerY > this.y ? 1 : playerY < this.y ? -1 : 0;
            return [dx, dy];
        } else {
            // Random movement
            const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];
            return directions[Math.floor(Math.random() * directions.length)];
        }
    }
    
    // Get description for examine
    getDescription() {
        const healthPercent = Math.floor((this.hp / this.maxHp) * 100);
        let healthStatus = '';
        
        if (healthPercent > 75) {
            healthStatus = 'unharmed';
        } else if (healthPercent > 50) {
            healthStatus = 'lightly wounded';
        } else if (healthPercent > 25) {
            healthStatus = 'badly wounded';
        } else {
            healthStatus = 'near death';
        }
        
        return `A ${this.name} (${healthStatus})`;
    }
} 