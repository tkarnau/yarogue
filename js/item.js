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
        const weaponTypes = ['sword', 'axe', 'mace', 'dagger', 'staff'];
        const armorTypes = ['leather', 'chain', 'plate', 'robe'];
        const shieldTypes = ['shield', 'buckler'];
        const potionTypes = ['potion', 'healing_potion', 'strength_potion'];
        const scrollTypes = ['scroll', 'fireball_scroll', 'lightning_scroll'];
        const treasureTypes = ['gold', 'gem', 'ring', 'amulet'];
        
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
                this.color = '#cccccc';
                this.attackBonus = 3;
                this.value = 25;
                this.description = 'A sharp iron sword';
                break;
                
            case 'axe':
                this.name = 'Battle Axe';
                this.symbol = '\\';
                this.color = '#8b4513';
                this.attackBonus = 5;
                this.value = 40;
                this.description = 'A heavy battle axe';
                break;
                
            case 'mace':
                this.name = 'Iron Mace';
                this.symbol = 'M';
                this.color = '#696969';
                this.attackBonus = 4;
                this.value = 30;
                this.description = 'A solid iron mace';
                break;
                
            case 'dagger':
                this.name = 'Steel Dagger';
                this.symbol = '|';
                this.color = '#c0c0c0';
                this.attackBonus = 2;
                this.value = 15;
                this.description = 'A sharp steel dagger';
                break;
                
            case 'staff':
                this.name = 'Magic Staff';
                this.symbol = 'I';
                this.color = '#daa520';
                this.attackBonus = 6;
                this.value = 60;
                this.description = 'A magical staff';
                break;
                
            // Armor
            case 'leather':
                this.name = 'Leather Armor';
                this.symbol = ']';
                this.color = '#8b4513';
                this.defenseBonus = 2;
                this.value = 20;
                this.description = 'Light leather armor';
                break;
                
            case 'chain':
                this.name = 'Chain Mail';
                this.symbol = ']';
                this.color = '#c0c0c0';
                this.defenseBonus = 4;
                this.value = 35;
                this.description = 'Flexible chain mail';
                break;
                
            case 'plate':
                this.name = 'Plate Armor';
                this.symbol = ']';
                this.color = '#696969';
                this.defenseBonus = 6;
                this.value = 50;
                this.description = 'Heavy plate armor';
                break;
                
            case 'robe':
                this.name = 'Magic Robe';
                this.symbol = ']';
                this.color = '#4169e1';
                this.defenseBonus = 3;
                this.value = 45;
                this.description = 'A magical robe';
                break;
                
            // Shields
            case 'shield':
                this.name = 'Wooden Shield';
                this.symbol = 'O';
                this.color = '#8b4513';
                this.defenseBonus = 2;
                this.value = 15;
                this.description = 'A sturdy wooden shield';
                break;
                
            case 'buckler':
                this.name = 'Iron Buckler';
                this.symbol = 'O';
                this.color = '#696969';
                this.defenseBonus = 3;
                this.value = 25;
                this.description = 'A small iron buckler';
                break;
                
            // Potions
            case 'potion':
            case 'healing_potion':
                this.name = 'Healing Potion';
                this.symbol = '!';
                this.color = '#ff0000';
                this.healAmount = 15;
                this.value = 10;
                this.description = 'Restores 15 HP';
                break;
                
            case 'strength_potion':
                this.name = 'Strength Potion';
                this.symbol = '!';
                this.color = '#ff6600';
                this.temporaryEffect = 'strength';
                this.effectDuration = 10;
                this.value = 20;
                this.description = 'Temporarily increases attack';
                break;
                
            // Scrolls
            case 'scroll':
                this.name = 'Mysterious Scroll';
                this.symbol = '?';
                this.color = '#ffff00';
                this.value = 5;
                this.description = 'A mysterious scroll';
                break;
                
            case 'fireball_scroll':
                this.name = 'Fireball Scroll';
                this.symbol = '?';
                this.color = '#ff0000';
                this.scrollEffect = 'fireball';
                this.value = 25;
                this.description = 'Casts a powerful fireball';
                break;
                
            case 'lightning_scroll':
                this.name = 'Lightning Scroll';
                this.symbol = '?';
                this.color = '#00ffff';
                this.scrollEffect = 'lightning';
                this.value = 30;
                this.description = 'Casts a lightning bolt';
                break;
                
            // Treasure
            case 'gold':
                this.name = 'Gold Coins';
                this.symbol = '$';
                this.color = '#ffd700';
                this.value = 10;
                this.description = 'Shiny gold coins';
                break;
                
            case 'gem':
                this.name = 'Precious Gem';
                this.symbol = '*';
                this.color = '#ff69b4';
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