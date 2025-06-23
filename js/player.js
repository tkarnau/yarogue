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
        
        // Additional base stats
        this.speed = 1;
        this.critChance = 0.05; // 5% base crit chance
        this.critMultiplier = 1.5; // 50% bonus damage on crit
        this.lifeSteal = 0;
        this.magicResistance = 0;
        this.poisonResistance = 0;
        this.fireResistance = 0;
        this.iceResistance = 0;
        this.lightningResistance = 0;
        this.goldBonus = 0;
        this.expBonus = 0;
        
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
    
    // Calculate total stats from equipment and affixes
    calculateTotalStats() {
        // Reset to base stats
        this.totalAttack = this.attack;
        this.totalDefense = this.defense;
        this.totalMaxHp = this.maxHp;
        this.totalSpeed = this.speed;
        this.totalCritChance = this.critChance;
        this.totalCritMultiplier = this.critMultiplier;
        this.totalLifeSteal = this.lifeSteal;
        this.totalMagicResistance = this.magicResistance;
        this.totalPoisonResistance = this.poisonResistance;
        this.totalFireResistance = this.fireResistance;
        this.totalIceResistance = this.iceResistance;
        this.totalLightningResistance = this.lightningResistance;
        this.totalGoldBonus = this.goldBonus;
        this.totalExpBonus = this.expBonus;
        
        // Add equipment bonuses
        const equipment = [this.weapon, this.armor, this.shield, this.ring, this.amulet];
        equipment.forEach(item => {
            if (item) {
                this.addItemStats(item);
            }
        });
        
        // Apply status effect modifiers
        this.applyStatusEffectModifiers();
    }
    
    addItemStats(item) {
        if (item.attackBonus) this.totalAttack += item.attackBonus;
        if (item.defenseBonus) this.totalDefense += item.defenseBonus;
        if (item.healthBonus) this.totalMaxHp += item.healthBonus;
        if (item.speedBonus) this.totalSpeed += item.speedBonus;
        if (item.critChance) this.totalCritChance += item.critChance;
        if (item.critMultiplier) this.totalCritMultiplier += item.critMultiplier;
        if (item.lifeSteal) this.totalLifeSteal += item.lifeSteal;
        if (item.magicResistance) this.totalMagicResistance += item.magicResistance;
        if (item.poisonResistance) this.totalPoisonResistance += item.poisonResistance;
        if (item.fireResistance) this.totalFireResistance += item.fireResistance;
        if (item.iceResistance) this.totalIceResistance += item.iceResistance;
        if (item.lightningResistance) this.totalLightningResistance += item.lightningResistance;
        if (item.goldBonus) this.totalGoldBonus += item.goldBonus;
        if (item.expBonus) this.totalExpBonus += item.expBonus;
    }
    
    applyStatusEffectModifiers() {
        const strengthEffect = this.getStatusEffect('strength');
        if (strengthEffect) {
            this.totalAttack += strengthEffect.intensity || 0;
        }
        
        const weaknessEffect = this.getStatusEffect('weakness');
        if (weaknessEffect) {
            this.totalAttack = Math.max(1, this.totalAttack - (weaknessEffect.intensity || 0));
        }
    }
    
    // Get formatted stat display
    getStatDisplay(statName) {
        const stats = {
            'attack': { value: this.totalAttack, base: this.attack, color: '#ff6b6b' },
            'defense': { value: this.totalDefense, base: this.defense, color: '#4ecdc4' },
            'maxHp': { value: this.totalMaxHp, base: this.maxHp, color: '#45b7d1' },
            'speed': { value: this.totalSpeed, base: this.speed, color: '#96ceb4' },
            'critChance': { value: this.totalCritChance, base: this.critChance, color: '#feca57', format: 'percent' },
            'critMultiplier': { value: this.totalCritMultiplier, base: this.critMultiplier, color: '#ff9ff3', format: 'multiplier' },
            'lifeSteal': { value: this.totalLifeSteal, base: this.lifeSteal, color: '#ff6b6b', format: 'percent' },
            'magicResistance': { value: this.totalMagicResistance, base: this.magicResistance, color: '#5f27cd', format: 'percent' },
            'poisonResistance': { value: this.totalPoisonResistance, base: this.poisonResistance, color: '#00d2d3', format: 'percent' },
            'fireResistance': { value: this.totalFireResistance, base: this.fireResistance, color: '#ff9f43', format: 'percent' },
            'iceResistance': { value: this.totalIceResistance, base: this.iceResistance, color: '#54a0ff', format: 'percent' },
            'lightningResistance': { value: this.totalLightningResistance, base: this.lightningResistance, color: '#ff9ff3', format: 'percent' },
            'goldBonus': { value: this.totalGoldBonus, base: this.goldBonus, color: '#feca57', format: 'percent' },
            'expBonus': { value: this.totalExpBonus, base: this.expBonus, color: '#48dbfb', format: 'percent' }
        };
        
        const stat = stats[statName];
        if (!stat) return { text: '0', color: '#ffffff' };
        
        let text = '';
        switch (stat.format) {
            case 'percent':
                text = `${Math.round(stat.value * 100)}%`;
                break;
            case 'multiplier':
                text = `${stat.value.toFixed(1)}x`;
                break;
            default:
                text = Math.round(stat.value).toString();
        }
        
        const color = stat.value > stat.base ? '#00ff00' : stat.value < stat.base ? '#ff0000' : stat.color;
        return { text, color };
    }
    
    // Get equipped items info
    getEquippedItems() {
        return {
            weapon: this.weapon,
            armor: this.armor,
            shield: this.shield,
            ring: this.ring,
            amulet: this.amulet
        };
    }
    
    // Get inventory by category with better organization
    getInventoryByCategory() {
        const categories = {
            weapons: this.inventory.filter(item => item.type === 'weapon'),
            armor: this.inventory.filter(item => item.type === 'armor'),
            shields: this.inventory.filter(item => item.type === 'shield'),
            accessories: this.inventory.filter(item => item.type === 'accessory'),
            consumables: this.inventory.filter(item => item.type === 'consumable'),
            treasure: this.inventory.filter(item => item.type === 'treasure')
        };
        
        return categories;
    }
    
    // Get item rarity color
    getItemRarityColor(item) {
        const rarityColors = {
            'normal': '#ffffff',
            'magic': '#4169e1',
            'rare': '#ffd700',
            'epic': '#9932cc',
            'legendary': '#ff4500'
        };
        return rarityColors[item.rarity] || '#ffffff';
    }
    
    addToInventory(item) {
        if (this.inventory.length < this.maxInventory) {
            this.inventory.push(item);
            this.calculateTotalStats(); // Recalculate stats when inventory changes
            return true;
        }
        return false;
    }
    
    removeFromInventory(item) {
        const index = this.inventory.indexOf(item);
        if (index > -1) {
            this.inventory.splice(index, 1);
            this.calculateTotalStats(); // Recalculate stats when inventory changes
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
                break;
            case 'armor':
                if (this.armor) {
                    this.unequipItem(this.armor);
                }
                this.armor = item;
                break;
            case 'shield':
                if (this.shield) {
                    this.unequipItem(this.shield);
                }
                this.shield = item;
                break;
            case 'accessory':
                // For accessories, we'll use the base type to determine slot
                if (item.baseType === 'ring') {
                    if (this.ring) {
                        this.unequipItem(this.ring);
                    }
                    this.ring = item;
                } else if (item.baseType === 'amulet') {
                    if (this.amulet) {
                        this.unequipItem(this.amulet);
                    }
                    this.amulet = item;
                }
                break;
        }
        
        this.calculateTotalStats(); // Recalculate stats when equipment changes
        return true;
    }
    
    unequipItem(item) {
        switch (item.type) {
            case 'weapon':
                if (this.weapon === item) {
                    this.weapon = null;
                }
                break;
            case 'armor':
                if (this.armor === item) {
                    this.armor = null;
                }
                break;
            case 'shield':
                if (this.shield === item) {
                    this.shield = null;
                }
                break;
            case 'accessory':
                if (item.baseType === 'ring' && this.ring === item) {
                    this.ring = null;
                } else if (item.baseType === 'amulet' && this.amulet === item) {
                    this.amulet = null;
                }
                break;
        }
        
        this.calculateTotalStats(); // Recalculate stats when equipment changes
    }
    
    useItem(item) {
        if (!this.inventory.includes(item)) {
            return false;
        }
        
        switch (item.type) {
            case 'consumable':
                if (item.healAmount) {
                    const healAmount = item.healAmount || 10;
                    this.hp = Math.min(this.totalMaxHp, this.hp + healAmount);
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
                
                if (item.scrollEffect) {
                    this.removeFromInventory(item);
                    switch (item.scrollEffect) {
                        case 'fireball':
                            return 'You cast a fireball! It explodes with great force!';
                        case 'lightning':
                            return 'You cast lightning! The air crackles with energy!';
                        default:
                            return 'You read the scroll. It crumbles to dust.';
                    }
                }
                
                this.removeFromInventory(item);
                return `You use the ${item.name}.`;
                
            case 'treasure':
                if (item.name === 'Gold Coins') {
                    const goldGained = Math.floor(item.value * (1 + this.totalGoldBonus));
                    this.gold += goldGained;
                    this.removeFromInventory(item);
                    return `You collect ${goldGained} gold!`;
                }
                break;
        }
        
        return false;
    }
    
    gainExperience(amount) {
        const expGained = Math.floor(amount * (1 + this.totalExpBonus));
        this.experience += expGained;
        
        while (this.experience >= this.nextLevelExp) {
            this.levelUp();
        }
        
        return expGained;
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
        
        this.calculateTotalStats(); // Recalculate stats after level up
        
        return `You reached level ${this.level}!`;
    }
    
    takeDamage(amount, damageType = 'physical') {
        let actualDamage = amount;
        
        // Apply resistances based on damage type
        switch (damageType) {
            case 'poison':
                actualDamage = Math.ceil(amount * (1 - this.totalPoisonResistance));
                break;
            case 'fire':
                actualDamage = Math.ceil(amount * (1 - this.totalFireResistance));
                break;
            case 'ice':
                actualDamage = Math.ceil(amount * (1 - this.totalIceResistance));
                break;
            case 'lightning':
                actualDamage = Math.ceil(amount * (1 - this.totalLightningResistance));
                break;
            case 'magic':
                actualDamage = Math.ceil(amount * (1 - this.totalMagicResistance));
                break;
            default:
                actualDamage = Math.max(1, amount - this.totalDefense);
        }
        
        this.hp -= actualDamage;
        
        if (this.hp <= 0) {
            this.hp = 0;
            return 'death';
        }
        
        return actualDamage;
    }
    
    heal(amount) {
        this.hp = Math.min(this.totalMaxHp, this.hp + amount);
    }
    
    isAlive() {
        return this.hp > 0;
    }
    
    checkForDeath() {
        if (!this.isAlive() && window.game && window.game.handlePlayerDeath) {
            window.game.handlePlayerDeath();
            return true;
        }
        return false;
    }
    
    getTotalAttack() {
        return this.totalAttack;
    }
    
    getTotalDefense() {
        return this.totalDefense;
    }
    
    getInventoryByType(type) {
        return this.inventory.filter(item => item.type === type);
    }
    
    getUsableItems() {
        return this.inventory.filter(item => 
            item.type === 'consumable' || item.type === 'treasure'
        );
    }
    
    getEquippableItems() {
        return this.inventory.filter(item => 
            item.type === 'weapon' || item.type === 'armor' || item.type === 'shield' || item.type === 'accessory'
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
                const result = this.takeDamage(poisonDamage, 'poison');
                if (result === 'death') {
                    // Check for death and trigger handling
                    this.checkForDeath();
                    return `You take ${poisonDamage} poison damage and die!`;
                }
                return `You take ${poisonDamage} poison damage!`;
                
            case 'regeneration':
                const healAmount = effect.intensity || 1;
                this.heal(healAmount);
                return `You regenerate ${healAmount} HP!`;
                
            case 'strength':
                // Temporary attack boost - handled in calculateTotalStats()
                break;
                
            case 'weakness':
                // Temporary attack penalty - handled in calculateTotalStats()
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