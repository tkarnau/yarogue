class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.symbol = '@';
        this.color = '#ffff00';
        
        // Base stats
        this.level = 1;
        this.hp = 20;
        this.maxHp = 20;
        this.attack = 5;
        this.defense = 2;
        this.experience = 0;
        this.nextLevelExp = 100;
        this.gold = 0;
        
        // Equipment
        this.weapon = null;
        this.armor = null;
        this.shield = null;
        
        // Inventory
        this.inventory = [];
        this.maxInventory = 20;
        
        // Don't add starting equipment here - will be called later
    }
    
    addStartingEquipment() {
        // Only add starting equipment if Item class is available
        if (typeof Item !== 'undefined') {
            try {
                const startingSword = new Item(null, null, 'sword');
                this.addToInventory(startingSword);
                this.equipItem(startingSword);
            } catch (error) {
                console.warn('Could not create starting equipment:', error);
            }
        }
    }
    
    addToInventory(item) {
        if (this.inventory.length < this.maxInventory) {
            this.inventory.push(item);
            return true;
        }
        return false;
    }
    
    removeFromInventory(item) {
        const index = this.inventory.indexOf(item);
        if (index > -1) {
            this.inventory.splice(index, 1);
            return true;
        }
        return false;
    }
    
    equipItem(item) {
        if (!this.inventory.includes(item)) {
            return false;
        }
        
        switch (item.type) {
            case 'weapon':
                if (this.weapon) {
                    this.unequipItem(this.weapon);
                }
                this.weapon = item;
                this.attack = 5 + (item.attackBonus || 0);
                break;
            case 'armor':
                if (this.armor) {
                    this.unequipItem(this.armor);
                }
                this.armor = item;
                this.defense = 2 + (item.defenseBonus || 0);
                break;
            case 'shield':
                if (this.shield) {
                    this.unequipItem(this.shield);
                }
                this.shield = item;
                this.defense += (item.defenseBonus || 0);
                break;
        }
        
        return true;
    }
    
    unequipItem(item) {
        switch (item.type) {
            case 'weapon':
                if (this.weapon === item) {
                    this.weapon = null;
                    this.attack = 5;
                }
                break;
            case 'armor':
                if (this.armor === item) {
                    this.armor = null;
                    this.defense = 2;
                }
                break;
            case 'shield':
                if (this.shield === item) {
                    this.shield = null;
                    this.defense = 2 + (this.armor ? this.armor.defenseBonus : 0);
                }
                break;
        }
    }
    
    useItem(item) {
        if (!this.inventory.includes(item)) {
            return false;
        }
        
        switch (item.type) {
            case 'potion':
                const healAmount = item.healAmount || 10;
                this.hp = Math.min(this.maxHp, this.hp + healAmount);
                this.removeFromInventory(item);
                return `You drink the potion and recover ${healAmount} HP!`;
                
            case 'scroll':
                // Scroll effects could be implemented here
                this.removeFromInventory(item);
                return `You read the scroll. It crumbles to dust.`;
                
            case 'gold':
                this.gold += item.value || 10;
                this.removeFromInventory(item);
                return `You pick up ${item.value || 10} gold!`;
                
            default:
                return false;
        }
    }
    
    gainExperience(amount) {
        this.experience += amount;
        
        while (this.experience >= this.nextLevelExp) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.experience -= this.nextLevelExp;
        this.nextLevelExp = Math.floor(this.nextLevelExp * 1.5);
        
        // Increase stats
        this.maxHp += 5;
        this.hp = this.maxHp; // Full heal on level up
        this.attack += 2;
        this.defense += 1;
        
        return `You reached level ${this.level}!`;
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
    
    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }
    
    isAlive() {
        return this.hp > 0;
    }
    
    getTotalAttack() {
        let total = this.attack;
        if (this.weapon) {
            total += this.weapon.attackBonus || 0;
        }
        return total;
    }
    
    getTotalDefense() {
        let total = this.defense;
        if (this.armor) {
            total += this.armor.defenseBonus || 0;
        }
        if (this.shield) {
            total += this.shield.defenseBonus || 0;
        }
        return total;
    }
    
    getInventoryByType(type) {
        return this.inventory.filter(item => item.type === type);
    }
    
    getUsableItems() {
        return this.inventory.filter(item => 
            item.type === 'potion' || item.type === 'scroll' || item.type === 'gold'
        );
    }
    
    getEquippableItems() {
        return this.inventory.filter(item => 
            item.type === 'weapon' || item.type === 'armor' || item.type === 'shield'
        );
    }
}

window.Player = Player; 