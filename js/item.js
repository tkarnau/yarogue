class Item {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = this.getItemType(type);
        
        // Set properties based on item type
        this.setupItemType(type);
    }
    
    getItemType(baseType) {
        // Categorize items by type
        const weaponTypes = ['sword', 'axe', 'mace', 'dagger', 'staff', 'poison_dagger'];
        const armorTypes = ['leather', 'chain', 'plate', 'robe'];
        const shieldTypes = ['shield', 'buckler'];
        const potionTypes = ['potion', 'healing_potion', 'strength_potion', 'poison_potion', 'antidote'];
        const scrollTypes = ['scroll', 'fireball_scroll', 'lightning_scroll'];
        const treasureTypes = ['gold', 'gem', 'ring', 'amulet', 'ring_of_regeneration', 'ring_of_battle_regeneration', 'ring_of_poison_resistance'];
        
        if (weaponTypes.includes(baseType)) return 'weapon';
        if (armorTypes.includes(baseType)) return 'armor';
        if (shieldTypes.includes(baseType)) return 'shield';
        if (potionTypes.includes(baseType)) return 'potion';
        if (scrollTypes.includes(baseType)) return 'scroll';
        if (treasureTypes.includes(baseType)) return 'treasure';
        
        return 'misc';
    }
    
    setupItemType(type) {
        switch (type) {
            // Weapons
            case 'sword':
                this.name = 'Iron Sword';
                this.symbol = '/';
                this.color = '#BDBDBD'; // Light gray
                this.attackBonus = 3;
                this.value = 25;
                this.description = 'A sharp iron sword';
                break;
                
            case 'axe':
                this.name = 'Battle Axe';
                this.symbol = '\\';
                this.color = '#8D6E63'; // Brown
                this.attackBonus = 5;
                this.value = 40;
                this.description = 'A heavy battle axe';
                break;
                
            case 'mace':
                this.name = 'Iron Mace';
                this.symbol = 'M';
                this.color = '#757575'; // Dark gray
                this.attackBonus = 4;
                this.value = 30;
                this.description = 'A solid iron mace';
                break;
                
            case 'dagger':
                this.name = 'Steel Dagger';
                this.symbol = '|';
                this.color = '#E0E0E0'; // Silver
                this.attackBonus = 2;
                this.value = 15;
                this.description = 'A sharp steel dagger';
                break;
                
            case 'staff':
                this.name = 'Magic Staff';
                this.symbol = 'I';
                this.color = '#FFD700'; // Gold
                this.attackBonus = 6;
                this.value = 60;
                this.description = 'A magical staff';
                break;
                
            // Armor
            case 'leather':
                this.name = 'Leather Armor';
                this.symbol = ']';
                this.color = '#8D6E63'; // Brown
                this.defenseBonus = 2;
                this.value = 20;
                this.description = 'Light leather armor';
                break;
                
            case 'chain':
                this.name = 'Chain Mail';
                this.symbol = ']';
                this.color = '#BDBDBD'; // Silver
                this.defenseBonus = 4;
                this.value = 35;
                this.description = 'Flexible chain mail';
                break;
                
            case 'plate':
                this.name = 'Plate Armor';
                this.symbol = ']';
                this.color = '#757575'; // Dark gray
                this.defenseBonus = 6;
                this.value = 50;
                this.description = 'Heavy plate armor';
                break;
                
            case 'robe':
                this.name = 'Magic Robe';
                this.symbol = ']';
                this.color = '#3F51B5'; // Blue
                this.defenseBonus = 3;
                this.value = 45;
                this.description = 'A magical robe';
                break;
                
            // Shields
            case 'shield':
                this.name = 'Wooden Shield';
                this.symbol = 'O';
                this.color = '#8D6E63'; // Brown
                this.defenseBonus = 2;
                this.value = 15;
                this.description = 'A sturdy wooden shield';
                break;
                
            case 'buckler':
                this.name = 'Iron Buckler';
                this.symbol = 'O';
                this.color = '#757575'; // Dark gray
                this.defenseBonus = 3;
                this.value = 25;
                this.description = 'A small iron buckler';
                break;
                
            // Potions
            case 'potion':
            case 'healing_potion':
                this.name = 'Healing Potion';
                this.symbol = '!';
                this.color = '#F44336'; // Red
                this.healAmount = 15;
                this.value = 10;
                this.description = 'Restores 15 HP';
                break;
                
            case 'strength_potion':
                this.name = 'Strength Potion';
                this.symbol = '!';
                this.color = '#FF9800'; // Orange
                this.temporaryEffect = 'strength';
                this.effectDuration = 10;
                this.value = 20;
                this.description = 'Temporarily increases attack';
                break;
                
            case 'poison_potion':
                this.name = 'Poison Potion';
                this.symbol = '!';
                this.color = '#4CAF50'; // Green
                this.value = 25;
                this.description = 'A dangerous poison potion';
                this.poisonDamage = 3;
                this.poisonDuration = 5;
                break;
                
            case 'antidote':
                this.name = 'Antidote';
                this.symbol = '!';
                this.color = '#2196F3'; // Blue
                this.value = 30;
                this.description = 'Cures poison effects';
                this.curesPoison = true;
                break;
                
            // Scrolls
            case 'scroll':
                this.name = 'Mysterious Scroll';
                this.symbol = '?';
                this.color = '#FFEB3B'; // Yellow
                this.value = 5;
                this.description = 'A mysterious scroll';
                break;
                
            case 'fireball_scroll':
                this.name = 'Fireball Scroll';
                this.symbol = '?';
                this.color = '#F44336'; // Red
                this.scrollEffect = 'fireball';
                this.value = 25;
                this.description = 'Casts a powerful fireball';
                break;
                
            case 'lightning_scroll':
                this.name = 'Lightning Scroll';
                this.symbol = '?';
                this.color = '#00BCD4'; // Cyan
                this.scrollEffect = 'lightning';
                this.value = 30;
                this.description = 'Casts a lightning bolt';
                break;
                
            // Treasure
            case 'gold':
                this.name = 'Gold Coins';
                this.symbol = '$';
                this.color = '#FFD700'; // Gold
                this.value = 10;
                this.description = 'Shiny gold coins';
                break;
                
            case 'gem':
                this.name = 'Precious Gem';
                this.symbol = '*';
                this.color = '#E91E63'; // Pink
                this.value = 100;
                this.description = 'A precious gemstone';
                break;
                
            case 'ring':
                this.name = 'Magic Ring';
                this.symbol = 'o';
                this.color = '#daa520';
                this.value = 75;
                this.description = 'A magical ring';
                break;
                
            case 'ring_of_regeneration':
                this.name = 'Ring of Regeneration';
                this.symbol = 'o';
                this.color = '#4CAF50'; // Green
                this.value = 150;
                this.description = 'Regenerates 1 HP every 5 tiles walked';
                this.regenerationTiles = 5;
                this.regenerationAmount = 1;
                break;
                
            case 'ring_of_battle_regeneration':
                this.name = 'Ring of Battle Regeneration';
                this.symbol = 'o';
                this.color = '#FF5722'; // Deep orange
                this.value = 200;
                this.description = 'Regenerates 1 HP every 5 turns in battle';
                this.regenerationTurns = 5;
                this.regenerationAmount = 1;
                break;
                
            case 'ring_of_poison_resistance':
                this.name = 'Ring of Poison Resistance';
                this.symbol = 'o';
                this.color = '#8BC34A'; // Light green
                this.value = 120;
                this.description = 'Reduces poison damage by 50%';
                this.poisonResistance = 0.5;
                break;
                
            case 'poison_dagger':
                this.name = 'Poison Dagger';
                this.symbol = '|';
                this.color = '#4CAF50'; // Green
                this.attackBonus = 1;
                this.value = 35;
                this.description = 'A dagger coated with poison';
                this.poisonChance = 0.3;
                this.poisonDamage = 2;
                this.poisonDuration = 3;
                break;
                
            case 'amulet':
                this.name = 'Protection Amulet';
                this.symbol = 'a';
                this.color = '#4169e1';
                this.defenseBonus = 1;
                this.value = 50;
                this.description = 'Provides magical protection';
                break;
                
            default:
                this.name = 'Unknown Item';
                this.symbol = '?';
                this.color = '#ffffff';
                this.value = 1;
                this.description = 'An unknown item';
        }
    }
    
    use(player) {
        switch (this.type) {
            case 'potion':
                if (this.healAmount) {
                    const oldHp = player.hp;
                    player.heal(this.healAmount);
                    const healed = player.hp - oldHp;
                    return `You drink the potion and recover ${healed} HP!`;
                }
                
                if (this.poisonDamage) {
                    // Poison potion - apply poison effect
                    player.addStatusEffect({
                        type: 'poison',
                        intensity: this.poisonDamage,
                        duration: this.poisonDuration
                    });
                    return `You drink the poison potion! You feel sick...`;
                }
                
                if (this.curesPoison) {
                    // Antidote - cure poison
                    if (player.hasStatusEffect('poison')) {
                        player.removeStatusEffect('poison');
                        return `You drink the antidote and feel better!`;
                    } else {
                        return `You drink the antidote, but you weren't poisoned.`;
                    }
                }
                break;
                
            case 'scroll':
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
        
        if (this.attackBonus) {
            desc += ` (+${this.attackBonus} attack)`;
        }
        if (this.defenseBonus) {
            desc += ` (+${this.defenseBonus} defense)`;
        }
        if (this.healAmount) {
            desc += ` (heals ${this.healAmount} HP)`;
        }
        if (this.value) {
            desc += ` (worth ${this.value} gold)`;
        }
        
        return desc;
    }
}

window.Item = Item; 