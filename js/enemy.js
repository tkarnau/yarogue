class Enemy {
    constructor(x, y, type, floor = 1) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.floor = floor;
        
        // Set properties based on enemy type
        this.setupEnemyType(type);
        
        // Scale stats based on floor level
        this.scaleStatsForFloor();
    }
    
    setupEnemyType(type) {
        switch (type) {
            case 'goblin':
                this.name = 'Goblin';
                this.symbol = 'g';
                this.color = '#4CAF50'; // Bright green
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
                this.color = '#FF9800'; // Orange
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
                this.color = '#9C27B0'; // Purple
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
                this.color = '#F44336'; // Red
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
                this.color = '#E0E0E0'; // Light gray
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
                this.color = '#795548'; // Brown
                this.hp = 18;
                this.maxHp = 18;
                this.attack = 6;
                this.defense = 2;
                this.experienceValue = 30;
                this.goldValue = 12;
                break;
                
            case 'demon':
                this.name = 'Demon';
                this.symbol = 'd';
                this.color = '#8B0000'; // Dark red
                this.hp = 35;
                this.maxHp = 35;
                this.attack = 10;
                this.defense = 4;
                this.experienceValue = 60;
                this.goldValue = 25;
                break;
                
            case 'lich':
                this.name = 'Lich';
                this.symbol = 'L';
                this.color = '#4A148C'; // Deep purple
                this.hp = 40;
                this.maxHp = 40;
                this.attack = 11;
                this.defense = 6;
                this.experienceValue = 80;
                this.goldValue = 35;
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
    
    scaleStatsForFloor() {
        if (this.floor <= 1) return; // No scaling for floor 1
        
        const floorMultiplier = 1 + (this.floor - 1) * 0.3; // 30% increase per floor
        
        // Scale HP, attack, defense, and rewards
        this.hp = Math.floor(this.hp * floorMultiplier);
        this.maxHp = this.hp;
        this.attack = Math.floor(this.attack * floorMultiplier);
        this.defense = Math.floor(this.defense * floorMultiplier);
        this.experienceValue = Math.floor(this.experienceValue * floorMultiplier);
        this.goldValue = Math.floor(this.goldValue * floorMultiplier);
        
        // Update name to show floor level for higher floors
        if (this.floor > 1) {
            this.name = `${this.name} (Floor ${this.floor})`;
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
        
        // Check if player has a poison weapon equipped
        if (player.weapon && player.weapon.poisonChance && Math.random() < player.weapon.poisonChance) {
            player.addStatusEffect({
                type: 'poison',
                intensity: player.weapon.poisonDamage,
                duration: player.weapon.poisonDuration
            });
            
            if (result === 'death') {
                return `The ${this.name} deals ${damage} damage and poisons you! You are defeated!`;
            } else {
                return `The ${this.name} deals ${damage} damage and poisons you!`;
            }
        }
        
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

window.Enemy = Enemy; 