class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.symbol = '@';
        this.color = '#2196F3'; // Blue - more modern and appealing
        
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
        this.ring = null;
        this.amulet = null;
        
        // Inventory
        this.inventory = [];
        this.maxInventory = 20;
        
        // Status effects
        this.statusEffects = [];
        this.tilesWalked = 0;
        this.battleTurns = 0;
        
        // Don't add starting equipment here - will be called later
    }
    
    addStartingEquipment() {
        // Only add starting equipment if Item class is available
        if (typeof Item !== 'undefined') {
            try {
                const startingSword = new Item(null, null, 'short_sword');
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
            case 'ring':
                if (this.ring) {
                    this.unequipItem(this.ring);
                }
                this.ring = item;
                break;
            case 'amulet':
                if (this.amulet) {
                    this.unequipItem(this.amulet);
                }
                this.amulet = item;
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
            case 'ring':
                if (this.ring === item) {
                    this.ring = null;
                }
                break;
            case 'amulet':
                if (this.amulet === item) {
                    this.amulet = null;
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
                if (item.healAmount) {
                    const healAmount = item.healAmount || 10;
                    this.hp = Math.min(this.maxHp, this.hp + healAmount);
                    this.removeFromInventory(item);
                    return `You drink the potion and recover ${healAmount} HP!`;
                }
                
                if (item.poisonDamage) {
                    // Poison potion - apply poison effect
                    this.addStatusEffect({
                        type: 'poison',
                        intensity: item.poisonDamage,
                        duration: item.poisonDuration
                    });
                    this.removeFromInventory(item);
                    return `You drink the poison potion! You feel sick...`;
                }
                
                if (item.curesPoison) {
                    // Antidote - cure poison
                    this.removeFromInventory(item);
                    if (this.hasStatusEffect('poison')) {
                        this.removeStatusEffect('poison');
                        return `You drink the antidote and feel better!`;
                    } else {
                        return `You drink the antidote, but you weren't poisoned.`;
                    }
                }
                
                this.removeFromInventory(item);
                return `You drink the potion.`;
                
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
        // Apply poison resistance if equipped
        if (this.ring && this.ring.poisonResistance && amount === 1) {
            // Assume damage of 1 is poison damage
            const reducedDamage = Math.ceil(amount * (1 - this.ring.poisonResistance));
            this.hp -= reducedDamage;
            
            if (this.hp <= 0) {
                this.hp = 0;
                return 'death';
            }
            
            return reducedDamage;
        }
        
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
        
        // Apply status effect modifiers
        const strengthEffect = this.getStatusEffect('strength');
        if (strengthEffect) {
            total += strengthEffect.intensity || 0;
        }
        
        const weaknessEffect = this.getStatusEffect('weakness');
        if (weaknessEffect) {
            total = Math.max(1, total - (weaknessEffect.intensity || 0));
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
            item.type === 'weapon' || item.type === 'armor' || item.type === 'shield' ||
            item.type === 'ring' || item.type === 'amulet'
        );
    }
    
    addStatusEffect(effect) {
        // Check if effect already exists
        const existingEffect = this.statusEffects.find(e => e.type === effect.type);
        if (existingEffect) {
            // Refresh duration if it's longer
            if (effect.duration > existingEffect.duration) {
                existingEffect.duration = effect.duration;
            }
            // Stack intensity if applicable
            if (effect.intensity) {
                existingEffect.intensity = (existingEffect.intensity || 0) + effect.intensity;
            }
        } else {
            this.statusEffects.push({...effect});
        }
    }
    
    removeStatusEffect(effectType) {
        const index = this.statusEffects.findIndex(e => e.type === effectType);
        if (index > -1) {
            this.statusEffects.splice(index, 1);
        }
    }
    
    hasStatusEffect(effectType) {
        return this.statusEffects.some(e => e.type === effectType);
    }
    
    getStatusEffect(effectType) {
        return this.statusEffects.find(e => e.type === effectType);
    }
    
    updateStatusEffects() {
        for (let i = this.statusEffects.length - 1; i >= 0; i--) {
            const effect = this.statusEffects[i];
            
            // Apply effect
            this.applyStatusEffect(effect);
            
            // Decrease duration
            effect.duration--;
            
            // Remove expired effects
            if (effect.duration <= 0) {
                this.statusEffects.splice(i, 1);
                if (effect.onExpire) {
                    effect.onExpire(this);
                }
            }
        }
    }
    
    applyStatusEffect(effect) {
        switch (effect.type) {
            case 'poison':
                const poisonDamage = effect.intensity || 1;
                this.takeDamage(poisonDamage);
                return `You take ${poisonDamage} poison damage!`;
                
            case 'regeneration':
                const healAmount = effect.intensity || 1;
                this.heal(healAmount);
                return `You regenerate ${healAmount} HP!`;
                
            case 'strength':
                // Temporary attack boost - handled in getTotalAttack()
                break;
                
            case 'weakness':
                // Temporary attack penalty - handled in getTotalAttack()
                break;
        }
        return null;
    }
    
    onTileWalked() {
        this.tilesWalked++;
        
        // Check for regeneration from equipment
        if (this.ring && this.ring.regenerationTiles && this.tilesWalked % this.ring.regenerationTiles === 0) {
            const healAmount = this.ring.regenerationAmount || 1;
            this.heal(healAmount);
            return `Your ${this.ring.name} regenerates ${healAmount} HP!`;
        }
        
        // Update status effects
        this.updateStatusEffects();
        
        return null;
    }
    
    onBattleTurn() {
        this.battleTurns++;
        
        // Check for regeneration from equipment
        if (this.ring && this.ring.regenerationTurns && this.battleTurns % this.ring.regenerationTurns === 0) {
            const healAmount = this.ring.regenerationAmount || 1;
            this.heal(healAmount);
            return `Your ${this.ring.name} regenerates ${healAmount} HP!`;
        }
        
        // Update status effects
        this.updateStatusEffects();
        
        return null;
    }
}

window.Player = Player; 