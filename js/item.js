// Affix definitions
const PREFIXES = {
    // Weapon prefixes
    'Sharp': { type: 'weapon', attackBonus: [2, 4], weight: 10 },
    'Deadly': { type: 'weapon', attackBonus: [4, 6], weight: 8 },
    'Brutal': { type: 'weapon', attackBonus: [6, 8], weight: 6 },
    'Mighty': { type: 'weapon', attackBonus: [8, 12], weight: 4 },
    'Legendary': { type: 'weapon', attackBonus: [12, 18], weight: 2 },
    
    // Armor prefixes
    'Sturdy': { type: 'armor', defenseBonus: [2, 4], weight: 10 },
    'Reinforced': { type: 'armor', defenseBonus: [4, 6], weight: 8 },
    'Impenetrable': { type: 'armor', defenseBonus: [6, 8], weight: 6 },
    'Invulnerable': { type: 'armor', defenseBonus: [8, 12], weight: 4 },
    'Divine': { type: 'armor', defenseBonus: [12, 18], weight: 2 },
    
    // Universal prefixes
    'Swift': { type: 'universal', speedBonus: [1, 2], weight: 8 },
    'Lucky': { type: 'universal', critChance: [0.05, 0.15], weight: 6 },
    'Vampiric': { type: 'universal', lifeSteal: [0.1, 0.25], weight: 4 },
    'Ethereal': { type: 'universal', magicResistance: [0.1, 0.3], weight: 5 },
    'Poisonous': { type: 'weapon', poisonChance: [0.2, 0.4], poisonDamage: [2, 5], weight: 7 },
    'Burning': { type: 'weapon', fireChance: [0.15, 0.3], fireDamage: [3, 6], weight: 6 },
    'Freezing': { type: 'weapon', freezeChance: [0.1, 0.25], freezeDuration: [1, 3], weight: 5 },
    'Shocking': { type: 'weapon', shockChance: [0.15, 0.3], shockDamage: [2, 4], weight: 6 }
};

const SUFFIXES = {
    // Weapon suffixes
    'of Slaying': { type: 'weapon', attackBonus: [1, 3], weight: 12 },
    'of Destruction': { type: 'weapon', attackBonus: [3, 5], weight: 8 },
    'of Annihilation': { type: 'weapon', attackBonus: [5, 8], weight: 5 },
    'of the Warrior': { type: 'weapon', attackBonus: [2, 4], strengthBonus: [1, 3], weight: 6 },
    'of the Berserker': { type: 'weapon', attackBonus: [4, 6], critChance: [0.1, 0.2], weight: 4 },
    
    // Armor suffixes
    'of Protection': { type: 'armor', defenseBonus: [1, 3], weight: 12 },
    'of Warding': { type: 'armor', defenseBonus: [3, 5], weight: 8 },
    'of Invincibility': { type: 'armor', defenseBonus: [5, 8], weight: 5 },
    'of the Guardian': { type: 'armor', defenseBonus: [2, 4], healthBonus: [5, 15], weight: 6 },
    'of the Paladin': { type: 'armor', defenseBonus: [3, 5], magicResistance: [0.1, 0.25], weight: 5 },
    
    // Universal suffixes
    'of Health': { type: 'universal', healthBonus: [10, 25], weight: 10 },
    'of Regeneration': { type: 'universal', regenerationAmount: [1, 3], regenerationTiles: [3, 8], weight: 8 },
    'of Speed': { type: 'universal', speedBonus: [1, 3], weight: 8 },
    'of Fortune': { type: 'universal', goldBonus: [0.2, 0.5], weight: 6 },
    'of Experience': { type: 'universal', expBonus: [0.1, 0.3], weight: 5 },
    'of Resistance': { type: 'universal', poisonResistance: [0.3, 0.6], weight: 7 },
    'of Fire Resistance': { type: 'universal', fireResistance: [0.3, 0.6], weight: 7 },
    'of Ice Resistance': { type: 'universal', iceResistance: [0.3, 0.6], weight: 7 },
    'of Lightning Resistance': { type: 'universal', lightningResistance: [0.3, 0.6], weight: 7 },
    'of the Vampire': { type: 'weapon', lifeSteal: [0.15, 0.3], weight: 4 },
    'of the Phoenix': { type: 'armor', fireResistance: [0.4, 0.7], regenerationAmount: [2, 4], weight: 3 },
    'of the Storm': { type: 'weapon', lightningChance: [0.2, 0.35], lightningDamage: [3, 6], weight: 4 }
};

// Base item definitions
const BASE_ITEMS = {
    // Weapons
    'dagger': {
        name: 'Dagger',
        symbol: '|',
        color: '#E0E0E0',
        type: 'weapon',
        baseAttack: [3, 6],
        baseValue: [15, 25],
        description: 'A sharp dagger',
        tier: 1
    },
    'short_sword': {
        name: 'Short Sword',
        symbol: '/',
        color: '#BDBDBD',
        type: 'weapon',
        baseAttack: [5, 8],
        baseValue: [25, 35],
        description: 'A standard short sword',
        tier: 1
    },
    'long_sword': {
        name: 'Long Sword',
        symbol: '/',
        color: '#9E9E9E',
        type: 'weapon',
        baseAttack: [7, 11],
        baseValue: [40, 60],
        description: 'A well-crafted long sword',
        tier: 2
    },
    'battle_axe': {
        name: 'Battle Axe',
        symbol: '\\',
        color: '#8D6E63',
        type: 'weapon',
        baseAttack: [8, 12],
        baseValue: [45, 65],
        description: 'A heavy battle axe',
        tier: 2
    },
    'war_hammer': {
        name: 'War Hammer',
        symbol: 'M',
        color: '#757575',
        type: 'weapon',
        baseAttack: [10, 15],
        baseValue: [60, 80],
        description: 'A massive war hammer',
        tier: 3
    },
    'great_sword': {
        name: 'Great Sword',
        symbol: '/',
        color: '#616161',
        type: 'weapon',
        baseAttack: [12, 18],
        baseValue: [80, 120],
        description: 'A mighty great sword',
        tier: 3
    },
    'magic_staff': {
        name: 'Magic Staff',
        symbol: 'I',
        color: '#FFD700',
        type: 'weapon',
        baseAttack: [6, 10],
        baseValue: [70, 100],
        description: 'A staff imbued with magic',
        tier: 2,
        magicBonus: [2, 4]
    },
    'flame_sword': {
        name: 'Flame Sword',
        symbol: '/',
        color: '#FF5722',
        type: 'weapon',
        baseAttack: [9, 14],
        baseValue: [90, 130],
        description: 'A sword that burns with magical fire',
        tier: 3,
        fireDamage: [3, 6]
    },
    
    // Armor
    'leather_armor': {
        name: 'Leather Armor',
        symbol: ']',
        color: '#8D6E63',
        type: 'armor',
        baseDefense: [2, 4],
        baseValue: [20, 30],
        description: 'Light leather armor',
        tier: 1
    },
    'chain_mail': {
        name: 'Chain Mail',
        symbol: ']',
        color: '#BDBDBD',
        type: 'armor',
        baseDefense: [4, 7],
        baseValue: [35, 50],
        description: 'Flexible chain mail',
        tier: 2
    },
    'plate_armor': {
        name: 'Plate Armor',
        symbol: ']',
        color: '#757575',
        type: 'armor',
        baseDefense: [6, 10],
        baseValue: [50, 75],
        description: 'Heavy plate armor',
        tier: 2
    },
    'magic_robe': {
        name: 'Magic Robe',
        symbol: ']',
        color: '#3F51B5',
        type: 'armor',
        baseDefense: [3, 6],
        baseValue: [45, 65],
        description: 'A magical robe',
        tier: 2,
        magicResistance: [0.1, 0.2]
    },
    'dragon_armor': {
        name: 'Dragon Armor',
        symbol: ']',
        color: '#D32F2F',
        type: 'armor',
        baseDefense: [10, 15],
        baseValue: [120, 180],
        description: 'Armor forged from dragon scales',
        tier: 3,
        fireResistance: [0.3, 0.5]
    },
    
    // Shields
    'wooden_shield': {
        name: 'Wooden Shield',
        symbol: 'O',
        color: '#8D6E63',
        type: 'shield',
        baseDefense: [2, 4],
        baseValue: [15, 25],
        description: 'A sturdy wooden shield',
        tier: 1
    },
    'iron_shield': {
        name: 'Iron Shield',
        symbol: 'O',
        color: '#757575',
        type: 'shield',
        baseDefense: [4, 7],
        baseValue: [30, 45],
        description: 'A solid iron shield',
        tier: 2
    },
    'magic_shield': {
        name: 'Magic Shield',
        symbol: 'O',
        color: '#9C27B0',
        type: 'shield',
        baseDefense: [5, 8],
        baseValue: [60, 90],
        description: 'A shield with magical properties',
        tier: 2,
        magicResistance: [0.15, 0.25]
    },
    
    // Accessories
    'ring': {
        name: 'Ring',
        symbol: 'o',
        color: '#daa520',
        type: 'accessory',
        baseValue: [50, 100],
        description: 'A magical ring',
        tier: 1
    },
    'amulet': {
        name: 'Amulet',
        symbol: 'a',
        color: '#4169e1',
        type: 'accessory',
        baseValue: [75, 150],
        description: 'A protective amulet',
        tier: 1
    },
    
    // Consumables (no affixes)
    'healing_potion': {
        name: 'Healing Potion',
        symbol: '!',
        color: '#F44336',
        type: 'consumable',
        healAmount: [15, 25],
        baseValue: [10, 20],
        description: 'Restores health',
        tier: 0
    },
    'strength_potion': {
        name: 'Strength Potion',
        symbol: '!',
        color: '#FF9800',
        type: 'consumable',
        temporaryEffect: 'strength',
        effectDuration: [8, 15],
        baseValue: [20, 35],
        description: 'Temporarily increases attack',
        tier: 0
    },
    'poison_potion': {
        name: 'Poison Potion',
        symbol: '!',
        color: '#4CAF50',
        type: 'consumable',
        poisonDamage: [3, 6],
        poisonDuration: [4, 7],
        baseValue: [25, 40],
        description: 'A dangerous poison potion',
        tier: 0
    },
    'antidote': {
        name: 'Antidote',
        symbol: '!',
        color: '#2196F3',
        type: 'consumable',
        curesPoison: true,
        baseValue: [30, 50],
        description: 'Cures poison effects',
        tier: 0
    },
    'fireball_scroll': {
        name: 'Fireball Scroll',
        symbol: '?',
        color: '#F44336',
        type: 'consumable',
        scrollEffect: 'fireball',
        baseValue: [25, 40],
        description: 'Casts a powerful fireball',
        tier: 0
    },
    'lightning_scroll': {
        name: 'Lightning Scroll',
        symbol: '?',
        color: '#00BCD4',
        type: 'consumable',
        scrollEffect: 'lightning',
        baseValue: [30, 50],
        description: 'Casts a lightning bolt',
        tier: 0
    },
    'gold': {
        name: 'Gold Coins',
        symbol: '$',
        color: '#FFD700',
        type: 'treasure',
        baseValue: [10, 20],
        description: 'Shiny gold coins',
        tier: 0
    },
    'gem': {
        name: 'Precious Gem',
        symbol: '*',
        color: '#E91E63',
        type: 'treasure',
        baseValue: [100, 200],
        description: 'A precious gemstone',
        tier: 0
    }
};

// Item rarity tiers
const RARITY_TIERS = {
    'normal': { name: 'Normal', color: '#ffffff', affixCount: 0, weight: 50 },
    'magic': { name: 'Magic', color: '#4169e1', affixCount: [1, 2], weight: 30 },
    'rare': { name: 'Rare', color: '#ffd700', affixCount: [2, 4], weight: 15 },
    'epic': { name: 'Epic', color: '#9932cc', affixCount: [3, 5], weight: 4 },
    'legendary': { name: 'Legendary', color: '#ff4500', affixCount: [4, 6], weight: 1 }
};

class Item {
    constructor(x, y, baseType, rarity = null, level = 1) {
        this.x = x;
        this.y = y;
        this.baseType = baseType;
        this.level = level;
        
        // Get base item data
        const baseItem = BASE_ITEMS[baseType];
        if (!baseItem) {
            throw new Error(`Unknown base item type: ${baseType}`);
        }
        
        this.itemData = baseItem;
        this.type = baseItem.type;
        
        // Determine rarity if not specified
        this.rarity = rarity || this.determineRarity();
        this.rarityData = RARITY_TIERS[this.rarity];
        
        // Generate affixes
        this.prefixes = [];
        this.suffixes = [];
        this.generateAffixes();
        
        // Calculate final stats
        this.calculateStats();
        
        // Generate name and description
        this.generateName();
        this.generateDescription();
        
        // Set visual properties
        this.symbol = baseItem.symbol;
        this.color = this.rarityData.color;
    }
    
    determineRarity() {
        const rand = Math.random() * 100;
        let cumulative = 0;
        
        for (const [rarity, data] of Object.entries(RARITY_TIERS)) {
            cumulative += data.weight;
            if (rand <= cumulative) {
                return rarity;
            }
        }
        
        return 'normal';
    }
    
    generateAffixes() {
        if (this.rarity === 'normal') return;
        
        const affixCount = this.rarityData.affixCount;
        const numAffixes = Array.isArray(affixCount) 
            ? Math.floor(Math.random() * (affixCount[1] - affixCount[0] + 1)) + affixCount[0]
            : affixCount;
        
        const maxPrefixes = Math.ceil(numAffixes / 2);
        const maxSuffixes = numAffixes - maxPrefixes;
        
        // Generate prefixes
        const availablePrefixes = Object.entries(PREFIXES).filter(([name, data]) => {
            return data.type === 'universal' || data.type === this.type;
        });
        
        for (let i = 0; i < maxPrefixes && availablePrefixes.length > 0; i++) {
            const prefix = this.selectRandomAffix(availablePrefixes);
            if (prefix) {
                this.prefixes.push(prefix);
                // Remove used prefix to avoid duplicates
                const index = availablePrefixes.findIndex(([name]) => name === prefix.name);
                if (index !== -1) availablePrefixes.splice(index, 1);
            }
        }
        
        // Generate suffixes
        const availableSuffixes = Object.entries(SUFFIXES).filter(([name, data]) => {
            return data.type === 'universal' || data.type === this.type;
        });
        
        for (let i = 0; i < maxSuffixes && availableSuffixes.length > 0; i++) {
            const suffix = this.selectRandomAffix(availableSuffixes);
            if (suffix) {
                this.suffixes.push(suffix);
                // Remove used suffix to avoid duplicates
                const index = availableSuffixes.findIndex(([name]) => name === suffix.name);
                if (index !== -1) availableSuffixes.splice(index, 1);
            }
        }
    }
    
    selectRandomAffix(availableAffixes) {
        if (availableAffixes.length === 0) return null;
        
        // Calculate total weight
        const totalWeight = availableAffixes.reduce((sum, [name, data]) => sum + data.weight, 0);
        let rand = Math.random() * totalWeight;
        
        for (const [name, data] of availableAffixes) {
            rand -= data.weight;
            if (rand <= 0) {
                return {
                    name: name,
                    ...this.generateAffixStats(data)
                };
            }
        }
        
        return null;
    }
    
    generateAffixStats(affixData) {
        const stats = {};
        
        for (const [stat, range] of Object.entries(affixData)) {
            if (stat === 'type' || stat === 'weight') continue;
            
            if (Array.isArray(range)) {
                const [min, max] = range;
                stats[stat] = Math.floor(Math.random() * (max - min + 1)) + min;
            } else {
                stats[stat] = range;
            }
        }
        
        return stats;
    }
    
    calculateStats() {
        // Start with base stats
        this.attackBonus = 0;
        this.defenseBonus = 0;
        this.value = this.itemData.baseValue[0] + Math.floor(Math.random() * (this.itemData.baseValue[1] - this.itemData.baseValue[0] + 1));
        
        // Add base item stats
        if (this.itemData.baseAttack) {
            this.attackBonus = this.itemData.baseAttack[0] + Math.floor(Math.random() * (this.itemData.baseAttack[1] - this.itemData.baseAttack[0] + 1));
        }
        if (this.itemData.baseDefense) {
            this.defenseBonus = this.itemData.baseDefense[0] + Math.floor(Math.random() * (this.itemData.baseDefense[1] - this.itemData.baseDefense[0] + 1));
        }
        
        // Add affix stats
        [...this.prefixes, ...this.suffixes].forEach(affix => {
            for (const [stat, value] of Object.entries(affix)) {
                if (stat === 'name') continue;
                
                if (this[stat] !== undefined) {
                    this[stat] += value;
                } else {
                    this[stat] = value;
                }
            }
        });
        
        // Add base item special properties
        for (const [stat, value] of Object.entries(this.itemData)) {
            if (['name', 'symbol', 'color', 'type', 'description', 'tier', 'baseAttack', 'baseDefense', 'baseValue'].includes(stat)) continue;
            
            if (Array.isArray(value)) {
                this[stat] = value[0] + Math.floor(Math.random() * (value[1] - value[0] + 1));
            } else {
                this[stat] = value;
            }
        }
        
        // Apply rarity multiplier to value
        const rarityMultipliers = { normal: 1, magic: 2, rare: 4, epic: 8, legendary: 16 };
        this.value = Math.floor(this.value * rarityMultipliers[this.rarity]);
    }
    
    generateName() {
        let name = this.itemData.name;
        
        // Add prefixes
        if (this.prefixes.length > 0) {
            name = this.prefixes.map(p => p.name).join(' ') + ' ' + name;
        }
        
        // Add suffixes
        if (this.suffixes.length > 0) {
            name = name + ' ' + this.suffixes.map(s => s.name).join(' ');
        }
        
        this.name = name;
    }
    
    generateDescription() {
        let desc = this.itemData.description;
        
        // Add stat descriptions
        if (this.attackBonus > 0) {
            desc += ` (+${this.attackBonus} attack)`;
        }
        if (this.defenseBonus > 0) {
            desc += ` (+${this.defenseBonus} defense)`;
        }
        if (this.healthBonus > 0) {
            desc += ` (+${this.healthBonus} HP)`;
        }
        if (this.speedBonus > 0) {
            desc += ` (+${this.speedBonus} speed)`;
        }
        if (this.critChance > 0) {
            desc += ` (+${Math.round(this.critChance * 100)}% crit)`;
        }
        if (this.lifeSteal > 0) {
            desc += ` (+${Math.round(this.lifeSteal * 100)}% life steal)`;
        }
        if (this.magicResistance > 0) {
            desc += ` (+${Math.round(this.magicResistance * 100)}% magic resist)`;
        }
        if (this.poisonChance > 0) {
            desc += ` (${Math.round(this.poisonChance * 100)}% poison chance)`;
        }
        if (this.fireChance > 0) {
            desc += ` (${Math.round(this.fireChance * 100)}% fire chance)`;
        }
        if (this.freezeChance > 0) {
            desc += ` (${Math.round(this.freezeChance * 100)}% freeze chance)`;
        }
        if (this.shockChance > 0) {
            desc += ` (${Math.round(this.shockChance * 100)}% shock chance)`;
        }
        if (this.regenerationAmount > 0) {
            desc += ` (regenerates ${this.regenerationAmount} HP every ${this.regenerationTiles || 5} tiles)`;
        }
        if (this.poisonResistance > 0) {
            desc += ` (+${Math.round(this.poisonResistance * 100)}% poison resist)`;
        }
        if (this.fireResistance > 0) {
            desc += ` (+${Math.round(this.fireResistance * 100)}% fire resist)`;
        }
        if (this.iceResistance > 0) {
            desc += ` (+${Math.round(this.iceResistance * 100)}% ice resist)`;
        }
        if (this.lightningResistance > 0) {
            desc += ` (+${Math.round(this.lightningResistance * 100)}% lightning resist)`;
        }
        
        this.description = desc;
    }
    
    use(player) {
        switch (this.type) {
            case 'consumable':
                if (this.healAmount) {
                    const oldHp = player.hp;
                    player.heal(this.healAmount);
                    const healed = player.hp - oldHp;
                    return `You drink the potion and recover ${healed} HP!`;
                }
                
                if (this.poisonDamage) {
                    player.addStatusEffect({
                        type: 'poison',
                        intensity: this.poisonDamage,
                        duration: this.poisonDuration
                    });
                    return `You drink the poison potion! You feel sick...`;
                }
                
                if (this.curesPoison) {
                    if (player.hasStatusEffect('poison')) {
                        player.removeStatusEffect('poison');
                        return `You drink the antidote and feel better!`;
                    } else {
                        return `You drink the antidote, but you weren't poisoned.`;
                    }
                }
                
                if (this.scrollEffect) {
                    switch (this.scrollEffect) {
                        case 'fireball':
                            return 'You cast a fireball! It explodes with great force!';
                        case 'lightning':
                            return 'You cast lightning! The air crackles with energy!';
                        default:
                            return 'You read the scroll. It crumbles to dust.';
                    }
                }
                break;
                
            case 'treasure':
                if (this.name === 'Gold Coins') {
                    player.gold += this.value;
                    return `You collect ${this.value} gold coins!`;
                }
                break;
        }
        
        return `You use the ${this.name}.`;
    }
    
    getDisplayName() {
        if (this.type === 'weapon' || this.type === 'armor' || this.type === 'shield') {
            let equipped = '';
            if (this.type === 'weapon' && this === window.game?.player?.weapon) {
                equipped = ' (equipped)';
            } else if (this.type === 'armor' && this === window.game?.player?.armor) {
                equipped = ' (equipped)';
            } else if (this.type === 'shield' && this === window.game?.player?.shield) {
                equipped = ' (equipped)';
            }
            return this.name + equipped;
        }
        return this.name;
    }
    
    getFullDescription() {
        let desc = this.description;
        
        if (this.value) {
            desc += ` (worth ${this.value} gold)`;
        }
        
        return desc;
    }
    
    // Static method to get all available base types
    static getAvailableTypes() {
        return Object.keys(BASE_ITEMS);
    }
    
    // Static method to get types by category
    static getTypesByCategory(category) {
        return Object.entries(BASE_ITEMS)
            .filter(([key, item]) => item.type === category)
            .map(([key, item]) => key);
    }
}

Item.BASE_ITEMS = BASE_ITEMS;

window.Item = Item; 