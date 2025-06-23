class UI {
    constructor(game) {
        this.game = game;
        this.battleModal = document.getElementById('battleModal');
        this.inventoryModal = document.getElementById('inventoryModal');
        
        // Don't call init() here - will be called after player is created
    }
    
    init() {
        // Initial UI update
        this.updatePlayerStats();
        this.updateInventory();
        this.updateMessageLog();
        this.updateHeader();
        this.updateStatusEffects();
    }
    
    update() {
        // Called every frame to update UI
        this.updatePlayerStats();
        this.updateCharacterPanel();
        this.updateHeader();
        this.updateStatusEffects();
    }
    
    updatePlayerStats() {
        const player = this.game.player;
        
        // Update player stats in sidebar
        const playerLevel = document.getElementById('playerLevel');
        const playerHP = document.getElementById('playerHP');
        const playerMaxHP = document.getElementById('playerMaxHP');
        const playerAttack = document.getElementById('playerAttack');
        const playerDefense = document.getElementById('playerDefense');
        const playerXP = document.getElementById('playerXP');
        const playerNextXP = document.getElementById('playerNextXP');
        
        if (playerLevel) playerLevel.textContent = player.level;
        if (playerHP) playerHP.textContent = player.hp;
        if (playerMaxHP) playerMaxHP.textContent = player.totalMaxHp || player.maxHp;
        if (playerAttack) playerAttack.textContent = player.getTotalAttack();
        if (playerDefense) playerDefense.textContent = player.getTotalDefense();
        if (playerXP) playerXP.textContent = player.experience;
        if (playerNextXP) playerNextXP.textContent = player.nextLevelExp;
    }
    
    updateCharacterPanel() {
        const player = this.game.player;
        
        // Update equipped items
        const equippedItems = player.getEquippedItems();
        const equippedWeapon = document.getElementById('equippedWeapon');
        const equippedArmor = document.getElementById('equippedArmor');
        const equippedShield = document.getElementById('equippedShield');
        const equippedRing = document.getElementById('equippedRing');
        const equippedAmulet = document.getElementById('equippedAmulet');
        
        if (equippedWeapon) {
            equippedWeapon.textContent = equippedItems.weapon ? equippedItems.weapon.name : 'None';
            equippedWeapon.style.color = equippedItems.weapon ? player.getItemRarityColor(equippedItems.weapon) : '#888';
        }
        if (equippedArmor) {
            equippedArmor.textContent = equippedItems.armor ? equippedItems.armor.name : 'None';
            equippedArmor.style.color = equippedItems.armor ? player.getItemRarityColor(equippedItems.armor) : '#888';
        }
        if (equippedShield) {
            equippedShield.textContent = equippedItems.shield ? equippedItems.shield.name : 'None';
            equippedShield.style.color = equippedItems.shield ? player.getItemRarityColor(equippedItems.shield) : '#888';
        }
        if (equippedRing) {
            equippedRing.textContent = equippedItems.ring ? equippedItems.ring.name : 'None';
            equippedRing.style.color = equippedItems.ring ? player.getItemRarityColor(equippedItems.ring) : '#888';
        }
        if (equippedAmulet) {
            equippedAmulet.textContent = equippedItems.amulet ? equippedItems.amulet.name : 'None';
            equippedAmulet.style.color = equippedItems.amulet ? player.getItemRarityColor(equippedItems.amulet) : '#888';
        }
        
        // Update detailed stats
        const statSpeed = document.getElementById('statSpeed');
        const statCritChance = document.getElementById('statCritChance');
        const statCritMultiplier = document.getElementById('statCritMultiplier');
        const statLifeSteal = document.getElementById('statLifeSteal');
        
        if (statSpeed) {
            const speedDisplay = player.getStatDisplay('speed');
            statSpeed.textContent = speedDisplay.text;
            statSpeed.style.color = speedDisplay.color;
        }
        if (statCritChance) {
            const critDisplay = player.getStatDisplay('critChance');
            statCritChance.textContent = critDisplay.text;
            statCritChance.style.color = critDisplay.color;
        }
        if (statCritMultiplier) {
            const critMultDisplay = player.getStatDisplay('critMultiplier');
            statCritMultiplier.textContent = critMultDisplay.text;
            statCritMultiplier.style.color = critMultDisplay.color;
        }
        if (statLifeSteal) {
            const lifeStealDisplay = player.getStatDisplay('lifeSteal');
            statLifeSteal.textContent = lifeStealDisplay.text;
            statLifeSteal.style.color = lifeStealDisplay.color;
        }
        
        // Update resistances
        const resMagic = document.getElementById('resMagic');
        const resPoison = document.getElementById('resPoison');
        const resFire = document.getElementById('resFire');
        const resIce = document.getElementById('resIce');
        const resLightning = document.getElementById('resLightning');
        
        if (resMagic) {
            const magicDisplay = player.getStatDisplay('magicResistance');
            resMagic.textContent = magicDisplay.text;
            resMagic.style.color = magicDisplay.color;
        }
        if (resPoison) {
            const poisonDisplay = player.getStatDisplay('poisonResistance');
            resPoison.textContent = poisonDisplay.text;
            resPoison.style.color = poisonDisplay.color;
        }
        if (resFire) {
            const fireDisplay = player.getStatDisplay('fireResistance');
            resFire.textContent = fireDisplay.text;
            resFire.style.color = fireDisplay.color;
        }
        if (resIce) {
            const iceDisplay = player.getStatDisplay('iceResistance');
            resIce.textContent = iceDisplay.text;
            resIce.style.color = iceDisplay.color;
        }
        if (resLightning) {
            const lightningDisplay = player.getStatDisplay('lightningResistance');
            resLightning.textContent = lightningDisplay.text;
            resLightning.style.color = lightningDisplay.color;
        }
        
        // Update bonuses
        const bonusGold = document.getElementById('bonusGold');
        const bonusExp = document.getElementById('bonusExp');
        
        if (bonusGold) {
            const goldDisplay = player.getStatDisplay('goldBonus');
            bonusGold.textContent = goldDisplay.text;
            bonusGold.style.color = goldDisplay.color;
        }
        if (bonusExp) {
            const expDisplay = player.getStatDisplay('expBonus');
            bonusExp.textContent = expDisplay.text;
            bonusExp.style.color = expDisplay.color;
        }
    }
    
    updateHeader() {
        const player = this.game.player;
        
        // Update header info
        const levelSpan = document.getElementById('level');
        const healthSpan = document.getElementById('health');
        const goldSpan = document.getElementById('gold');
        
        if (levelSpan) levelSpan.textContent = `Level: ${player.level}`;
        if (healthSpan) healthSpan.textContent = `HP: ${player.hp}/${player.totalMaxHp || player.maxHp}`;
        if (goldSpan) goldSpan.textContent = `Gold: ${player.gold}`;
    }
    
    updateInventory() {
        const player = this.game.player;
        const inventoryList = document.getElementById('inventoryList');
        
        if (!inventoryList) return;
        
        if (player.inventory.length === 0) {
            inventoryList.innerHTML = '<p>Empty</p>';
            return;
        }
        
        inventoryList.innerHTML = '';
        
        // Get inventory by category
        const categories = player.getInventoryByCategory();
        
        // Display categories with items
        Object.entries(categories).forEach(([category, items]) => {
            if (items.length > 0) {
                const categoryHeader = document.createElement('div');
                categoryHeader.className = 'inventory-category';
                categoryHeader.style.fontWeight = 'bold';
                categoryHeader.style.color = '#00ff00';
                categoryHeader.style.marginTop = '10px';
                categoryHeader.style.borderBottom = '1px solid #00ff00';
                categoryHeader.style.paddingBottom = '2px';
                categoryHeader.textContent = category.charAt(0).toUpperCase() + category.slice(1) + ` (${items.length})`;
                inventoryList.appendChild(categoryHeader);
                
                items.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'inventory-item';
                    itemElement.style.fontSize = '9px';
                    itemElement.style.margin = '2px 0';
                    itemElement.style.padding = '1px 0';
                    
                    // Create item name with rarity color
                    const itemName = document.createElement('span');
                    itemName.textContent = item.name;
                    itemName.style.color = player.getItemRarityColor(item);
                    
                    // Add equipped indicator
                    if (this.isItemEquipped(item)) {
                        itemName.textContent += ' [E]';
                        itemName.style.fontWeight = 'bold';
                    }
                    
                    itemElement.appendChild(itemName);
                    
                    // Add item stats if it's equipment
                    if (item.type === 'weapon' || item.type === 'armor' || item.type === 'shield' || item.type === 'accessory') {
                        const statsText = [];
                        if (item.attackBonus) statsText.push(`+${item.attackBonus} ATK`);
                        if (item.defenseBonus) statsText.push(`+${item.defenseBonus} DEF`);
                        if (item.healthBonus) statsText.push(`+${item.healthBonus} HP`);
                        if (item.speedBonus) statsText.push(`+${item.speedBonus} SPD`);
                        if (item.critChance) statsText.push(`+${Math.round(item.critChance * 100)}% CRIT`);
                        if (item.lifeSteal) statsText.push(`+${Math.round(item.lifeSteal * 100)}% LS`);
                        
                        if (statsText.length > 0) {
                            const statsSpan = document.createElement('span');
                            statsSpan.textContent = ` (${statsText.join(', ')})`;
                            statsSpan.style.color = '#888';
                            statsSpan.style.fontSize = '8px';
                            itemElement.appendChild(statsSpan);
                        }
                    }
                    
                    inventoryList.appendChild(itemElement);
                });
            }
        });
    }
    
    updateMessageLog() {
        const messageLog = document.getElementById('messageLog');
        if (!messageLog) return;
        
        messageLog.innerHTML = '';
        
        this.game.messageLog.forEach(message => {
            const p = document.createElement('p');
            p.textContent = message;
            p.style.fontSize = '9px';
            p.style.margin = '2px 0';
            messageLog.appendChild(p);
        });
        
        // Scroll to bottom
        messageLog.scrollTop = messageLog.scrollHeight;
    }
    
    showBattleModal(enemy) {
        if (this.battleModal) {
            this.battleModal.style.display = 'block';
        }
        
        // Update battle UI
        this.updateBattleUI(enemy);
    }
    
    hideBattleModal() {
        if (this.battleModal) {
            this.battleModal.style.display = 'none';
        }
    }
    
    updateBattleUI(enemy) {
        const player = this.game.player;
        
        // Update battle participant info
        const battlePlayerHP = document.getElementById('battlePlayerHP');
        const battlePlayerAttack = document.getElementById('battlePlayerAttack');
        const battleEnemyName = document.getElementById('battleEnemyName');
        const battleEnemyHP = document.getElementById('battleEnemyHP');
        const battleEnemyAttack = document.getElementById('battleEnemyAttack');
        
        if (battlePlayerHP) battlePlayerHP.textContent = player.hp;
        if (battlePlayerAttack) battlePlayerAttack.textContent = player.getTotalAttack();
        if (battleEnemyName) battleEnemyName.textContent = enemy.name;
        if (battleEnemyHP) battleEnemyHP.textContent = enemy.hp;
        if (battleEnemyAttack) battleEnemyAttack.textContent = enemy.attack;
    }
    
    showInventoryModal() {
        if (this.inventoryModal) {
            this.inventoryModal.style.display = 'block';
            this.updateInventoryModal();
        }
    }
    
    hideInventoryModal() {
        if (this.inventoryModal) {
            this.inventoryModal.style.display = 'none';
        }
    }
    
    // Death modal methods
    showDeathModal() {
        const deathModal = document.getElementById('deathModal');
        if (deathModal) {
            deathModal.style.display = 'block';
        }
    }
    
    hideDeathModal() {
        const deathModal = document.getElementById('deathModal');
        if (deathModal) {
            deathModal.style.display = 'none';
        }
    }
    
    updateInventoryModal() {
        const player = this.game.player;
        const inventoryModalList = document.getElementById('inventoryModalList');
        
        if (!inventoryModalList) return;
        
        inventoryModalList.innerHTML = '';
        
        if (player.inventory.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'Your inventory is empty.';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.color = '#888';
            inventoryModalList.appendChild(emptyMsg);
            return;
        }
        
        // Get inventory by category
        const categories = player.getInventoryByCategory();
        
        // Create inventory items with click handlers
        Object.entries(categories).forEach(([category, items]) => {
            if (items.length > 0) {
                // Add category header
                const categoryHeader = document.createElement('h3');
                categoryHeader.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                categoryHeader.style.color = '#00ff00';
                categoryHeader.style.borderBottom = '1px solid #00ff00';
                categoryHeader.style.marginBottom = '10px';
                inventoryModalList.appendChild(categoryHeader);
                
                items.forEach((item, index) => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'inventory-item';
                    itemElement.style.cursor = 'pointer';
                    itemElement.style.padding = '5px';
                    itemElement.style.margin = '2px 0';
                    itemElement.style.border = '1px solid #333';
                    itemElement.style.backgroundColor = '#1a1a1a';
                    
                    const itemName = document.createElement('div');
                    itemName.className = 'inventory-item-name';
                    itemName.textContent = item.name;
                    itemName.style.color = player.getItemRarityColor(item);
                    itemName.style.fontWeight = 'bold';
                    
                    const itemType = document.createElement('div');
                    itemType.className = 'inventory-item-type';
                    itemType.textContent = `${item.type} (${item.rarity})`;
                    itemType.style.color = '#888';
                    itemType.style.fontSize = '12px';
                    
                    const itemDescription = document.createElement('div');
                    itemDescription.className = 'inventory-item-description';
                    itemDescription.textContent = item.description;
                    itemDescription.style.color = '#ccc';
                    itemDescription.style.fontSize = '11px';
                    itemDescription.style.marginTop = '2px';
                    
                    // Add equipped indicator
                    if (this.isItemEquipped(item)) {
                        const equippedIndicator = document.createElement('div');
                        equippedIndicator.textContent = '[EQUIPPED]';
                        equippedIndicator.style.color = '#00ff00';
                        equippedIndicator.style.fontWeight = 'bold';
                        equippedIndicator.style.fontSize = '10px';
                        itemElement.appendChild(equippedIndicator);
                    }
                    
                    itemElement.appendChild(itemName);
                    itemElement.appendChild(itemType);
                    itemElement.appendChild(itemDescription);
                    
                    // Add click handler for item interaction
                    itemElement.addEventListener('click', () => {
                        this.handleItemClick(item, index);
                    });
                    
                    inventoryModalList.appendChild(itemElement);
                });
            }
        });
    }
    
    handleItemClick(item, index) {
        const player = this.game.player;
        
        // Show item description
        const description = item.getFullDescription();
        
        // Handle different item types
        if (item.type === 'weapon' || item.type === 'armor' || item.type === 'shield' || item.type === 'accessory') {
            // Equip/unequip equipment
            if (this.isItemEquipped(item)) {
                player.unequipItem(item);
                this.game.addMessage(`You unequipped ${item.name}.`);
            } else {
                player.equipItem(item);
                this.game.addMessage(`You equipped ${item.name}.`);
            }
        } else if (item.type === 'consumable' || item.type === 'treasure') {
            // Use consumable items
            const result = player.useItem(item);
            if (result) {
                this.game.addMessage(result);
            }
        }
        
        // Update UI
        this.updateInventoryModal();
        this.updatePlayerStats();
        this.updateCharacterPanel();
        this.updateInventory();
    }
    
    isItemEquipped(item) {
        const player = this.game.player;
        const equippedItems = player.getEquippedItems();
        return (item === equippedItems.weapon || 
                item === equippedItems.armor || 
                item === equippedItems.shield ||
                item === equippedItems.ring ||
                item === equippedItems.amulet);
    }
    
    // Show tooltip for items
    showTooltip(item, x, y) {
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
        tooltip.style.background = '#000';
        tooltip.style.border = '1px solid #00ff00';
        tooltip.style.padding = '5px';
        tooltip.style.color = '#00ff00';
        tooltip.style.fontSize = '10px';
        tooltip.style.zIndex = '1000';
        tooltip.style.maxWidth = '200px';
        tooltip.textContent = item.getFullDescription();
        
        document.body.appendChild(tooltip);
        
        // Remove tooltip after 3 seconds
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 3000);
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.background = type === 'error' ? '#800000' : '#000';
        notification.style.border = '1px solid #00ff00';
        notification.style.padding = '10px';
        notification.style.color = '#00ff00';
        notification.style.fontSize = '12px';
        notification.style.zIndex = '1001';
        notification.style.maxWidth = '300px';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
    
    // Update health bar color based on health percentage
    updateHealthBarColor() {
        const player = this.game.player;
        const maxHp = player.totalMaxHp || player.maxHp;
        const healthPercent = (player.hp / maxHp) * 100;
        
        let healthColor = '#00ff00'; // Green
        if (healthPercent < 25) {
            healthColor = '#ff0000'; // Red
        } else if (healthPercent < 50) {
            healthColor = '#ff6600'; // Orange
        } else if (healthPercent < 75) {
            healthColor = '#ffff00'; // Yellow
        }
        
        // Update health display color
        const healthSpan = document.getElementById('health');
        if (healthSpan) {
            healthSpan.style.color = healthColor;
        }
        
        const playerHP = document.getElementById('playerHP');
        if (playerHP) {
            playerHP.style.color = healthColor;
        }
    }
    
    // Show level up notification
    showLevelUpNotification() {
        const player = this.game.player;
        this.showNotification(`Level Up! You are now level ${player.level}!`, 'success');
        
        // Update health bar color (should be green after level up)
        this.updateHealthBarColor();
    }
    
    updateStatusEffects() {
        const player = this.game.player;
        const statusEffectsList = document.getElementById('statusEffectsList');
        
        if (!statusEffectsList) return;
        
        if (player.statusEffects.length === 0) {
            statusEffectsList.innerHTML = '<p>None</p>';
            return;
        }
        
        statusEffectsList.innerHTML = '';
        
        player.statusEffects.forEach(effect => {
            const effectElement = document.createElement('p');
            effectElement.style.fontSize = '9px';
            effectElement.style.margin = '2px 0';
            
            let effectText = '';
            let effectColor = '#ffffff';
            
            switch (effect.type) {
                case 'poison':
                    effectText = `Poison (${effect.intensity} damage, ${effect.duration} turns)`;
                    effectColor = '#4CAF50'; // Green
                    break;
                case 'regeneration':
                    effectText = `Regeneration (${effect.intensity} HP, ${effect.duration} turns)`;
                    effectColor = '#2196F3'; // Blue
                    break;
                case 'strength':
                    effectText = `Strength (+${effect.intensity} attack, ${effect.duration} turns)`;
                    effectColor = '#FF9800'; // Orange
                    break;
                case 'weakness':
                    effectText = `Weakness (-${effect.intensity} attack, ${effect.duration} turns)`;
                    effectColor = '#F44336'; // Red
                    break;
                default:
                    effectText = `${effect.type} (${effect.duration} turns)`;
                    break;
            }
            
            effectElement.textContent = effectText;
            effectElement.style.color = effectColor;
            statusEffectsList.appendChild(effectElement);
        });
    }
}

window.UI = UI; 