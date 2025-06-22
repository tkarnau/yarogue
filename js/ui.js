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
    }
    
    update() {
        // Called every frame to update UI
        this.updatePlayerStats();
        this.updateHeader();
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
        if (playerMaxHP) playerMaxHP.textContent = player.maxHp;
        if (playerAttack) playerAttack.textContent = player.getTotalAttack();
        if (playerDefense) playerDefense.textContent = player.getTotalDefense();
        if (playerXP) playerXP.textContent = player.experience;
        if (playerNextXP) playerNextXP.textContent = player.nextLevelExp;
    }
    
    updateHeader() {
        const player = this.game.player;
        
        // Update header info
        const levelSpan = document.getElementById('level');
        const healthSpan = document.getElementById('health');
        const goldSpan = document.getElementById('gold');
        
        if (levelSpan) levelSpan.textContent = `Level: ${player.level}`;
        if (healthSpan) healthSpan.textContent = `HP: ${player.hp}/${player.maxHp}`;
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
        
        // Group items by type
        const groupedItems = {
            weapon: [],
            armor: [],
            shield: [],
            potion: [],
            scroll: [],
            treasure: [],
            misc: []
        };
        
        player.inventory.forEach(item => {
            if (groupedItems[item.type]) {
                groupedItems[item.type].push(item);
            } else {
                groupedItems.misc.push(item);
            }
        });
        
        // Display grouped items
        Object.keys(groupedItems).forEach(type => {
            const items = groupedItems[type];
            if (items.length > 0) {
                const typeHeader = document.createElement('p');
                typeHeader.style.fontWeight = 'bold';
                typeHeader.style.color = '#00ff00';
                typeHeader.style.marginTop = '10px';
                typeHeader.textContent = type.charAt(0).toUpperCase() + type.slice(1) + 's:';
                inventoryList.appendChild(typeHeader);
                
                items.forEach(item => {
                    const itemElement = document.createElement('p');
                    itemElement.textContent = `  ${item.getDisplayName()}`;
                    itemElement.style.fontSize = '9px';
                    itemElement.style.margin = '2px 0';
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
        
        // Create inventory items with click handlers
        player.inventory.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.style.cursor = 'pointer';
            
            const itemName = document.createElement('span');
            itemName.className = 'inventory-item-name';
            itemName.textContent = item.getDisplayName();
            
            const itemType = document.createElement('span');
            itemType.className = 'inventory-item-type';
            itemType.textContent = item.type;
            
            itemElement.appendChild(itemName);
            itemElement.appendChild(itemType);
            
            // Add click handler for item interaction
            itemElement.addEventListener('click', () => {
                this.handleItemClick(item, index);
            });
            
            inventoryModalList.appendChild(itemElement);
        });
    }
    
    handleItemClick(item, index) {
        const player = this.game.player;
        
        // Show item description
        const description = item.getFullDescription();
        
        // Handle different item types
        if (item.type === 'weapon' || item.type === 'armor' || item.type === 'shield') {
            // Equip/unequip equipment
            if (this.isItemEquipped(item)) {
                player.unequipItem(item);
                this.game.addMessage(`You unequipped ${item.name}.`);
            } else {
                player.equipItem(item);
                this.game.addMessage(`You equipped ${item.name}.`);
            }
        } else if (item.type === 'potion' || item.type === 'scroll' || item.type === 'gold') {
            // Use consumable items
            const result = player.useItem(item);
            if (result) {
                this.game.addMessage(result);
            }
        }
        
        // Update UI
        this.updateInventoryModal();
        this.updatePlayerStats();
        this.updateInventory();
    }
    
    isItemEquipped(item) {
        const player = this.game.player;
        return (item === player.weapon || item === player.armor || item === player.shield);
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
        const healthPercent = (player.hp / player.maxHp) * 100;
        
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
}

window.UI = UI; 