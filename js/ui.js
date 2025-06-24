class UI {
    constructor(game) {
        this.game = game;
        this.battleModal = document.getElementById('battleModal');
        this.inventoryModal = document.getElementById('inventoryModal');
        this.deathModal = document.getElementById('deathModal');
        this.confirmationModal = document.getElementById('confirmationModal');
        
        // Tooltip management
        this.globalTooltipCleanupListener = null;
        
        // Confirmation modal state
        this.pendingDestroyItem = null;
        
        // Don't call init() here - will be called after player is created
    }
    
    init() {
        // Set up event listeners for modals
        this.setupModalEventListeners();
        
        // Set up window event listeners for tooltip cleanup
        this.setupWindowEventListeners();
        
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
        const floorSpan = document.getElementById('floor');
        const healthSpan = document.getElementById('health');
        const goldSpan = document.getElementById('gold');
        const enemiesLeftSpan = document.getElementById('enemiesLeft');
        
        if (levelSpan) levelSpan.textContent = `Level: ${player.level}`;
        if (floorSpan) floorSpan.textContent = `Floor: ${this.game.currentFloor}`;
        if (healthSpan) healthSpan.textContent = `HP: ${player.hp}/${player.totalMaxHp || player.maxHp}`;
        if (goldSpan) goldSpan.textContent = `Gold: ${player.gold}`;
        if (enemiesLeftSpan) {
            const enemiesLeft = this.game.enemies.length;
            enemiesLeftSpan.textContent = `Enemies: ${enemiesLeft}`;
            // Color code based on remaining enemies
            if (enemiesLeft === 0) {
                enemiesLeftSpan.style.color = '#00ff00'; // Green when all enemies defeated
            } else if (enemiesLeft <= 3) {
                enemiesLeftSpan.style.color = '#ffff00'; // Yellow when few enemies left
            } else {
                enemiesLeftSpan.style.color = '#ff0000'; // Red when many enemies left
            }
        }
    }
    
    updateInventory() {
        const player = this.game.player;
        const inventoryList = document.getElementById('inventoryList');
        
        if (!inventoryList) return;
        
        // Add inventory capacity header
        const capacityHeader = document.createElement('div');
        capacityHeader.style.fontSize = '10px';
        capacityHeader.style.color = '#888';
        capacityHeader.style.marginBottom = '5px';
        capacityHeader.style.borderBottom = '1px solid #333';
        capacityHeader.style.paddingBottom = '2px';
        
        const capacityColor = player.inventory.length >= player.maxInventory ? '#ff0000' : '#00ff00';
        capacityHeader.innerHTML = `Inventory: <span style="color: ${capacityColor}">${player.inventory.length}/${player.maxInventory}</span>`;
        inventoryList.appendChild(capacityHeader);
        
        if (player.inventory.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'Empty';
            emptyMsg.style.fontSize = '9px';
            emptyMsg.style.color = '#666';
            inventoryList.appendChild(emptyMsg);
            return;
        }
        
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
            
            // Add global click listener to clean up tooltips when clicking outside
            this.setupGlobalTooltipCleanup();
        }
    }
    
    hideInventoryModal() {
        if (this.inventoryModal) {
            this.inventoryModal.style.display = 'none';
            // Clean up any lingering tooltips
            this.cleanupAllTooltips();
            
            // Remove global click listener
            if (this.globalTooltipCleanupListener) {
                document.removeEventListener('click', this.globalTooltipCleanupListener);
                this.globalTooltipCleanupListener = null;
            }
            
            // Hide confirmation modal if open
            this.hideConfirmationModal();
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
        const inventoryGrid = document.getElementById('inventoryGrid');
        const inventoryCapacity = document.getElementById('inventoryCapacity');
        const inventoryGold = document.getElementById('inventoryGold');
        
        if (!inventoryGrid) return;
        
        // Clean up any existing tooltips before updating
        this.cleanupAllTooltips();
        
        // Update capacity and gold info
        if (inventoryCapacity) {
            const capacityColor = player.inventory.length >= player.maxInventory ? '#ff0000' : '#00ff00';
            inventoryCapacity.innerHTML = `Capacity: <span style="color: ${capacityColor}">${player.inventory.length}/${player.maxInventory}</span>`;
        }
        
        if (inventoryGold) {
            inventoryGold.textContent = `Gold: ${player.gold}`;
        }
        
        // Clear existing grid
        inventoryGrid.innerHTML = '';
        
        // Create grid slots
        for (let i = 0; i < player.maxInventory; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot empty';
            slot.dataset.index = i;
            
            // Add drag and drop event listeners
            this.setupSlotDragAndDrop(slot, i);
            
            inventoryGrid.appendChild(slot);
        }
        
        // Populate slots with items
        player.inventory.forEach((item, index) => {
            if (index < player.maxInventory) {
                const slot = inventoryGrid.children[index];
                slot.className = 'inventory-slot';
                slot.innerHTML = '';
                
                const itemElement = this.createInventoryItemElement(item, index);
                slot.appendChild(itemElement);
            }
        });
        
        // Setup sort button
        this.setupSortButton();
        
        // Setup mobile touch handling for inventory
        this.setupInventoryTouchHandling();
    }
    
    createInventoryItemElement(item, index) {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.draggable = true;
        itemElement.dataset.itemIndex = index;
        
        // Add rarity-based border to the slot
        const slot = itemElement.closest('.inventory-slot');
        if (slot) {
            slot.classList.add(`rarity-${item.rarity}`);
        }
        
        // Create item icon
        const icon = document.createElement('div');
        icon.className = 'inventory-item-icon';
        icon.textContent = this.getItemIcon(item);
        itemElement.appendChild(icon);
        
        // Create item name
        const name = document.createElement('div');
        name.className = 'inventory-item-name';
        name.textContent = item.name;
        name.style.color = this.game.player.getItemRarityColor(item);
        itemElement.appendChild(name);
        
        // Add equipped indicator
        if (this.isItemEquipped(item)) {
            const equipped = document.createElement('div');
            equipped.className = 'inventory-item-equipped';
            equipped.textContent = 'E';
            itemElement.appendChild(equipped);
        }
        
        // Add stats for equipment
        if (item.type === 'weapon' || item.type === 'armor' || item.type === 'shield' || item.type === 'accessory') {
            const stats = [];
            if (item.attackBonus) stats.push(`+${item.attackBonus}ATK`);
            if (item.defenseBonus) stats.push(`+${item.defenseBonus}DEF`);
            if (item.healthBonus) stats.push(`+${item.healthBonus}HP`);
            
            if (stats.length > 0) {
                const statsElement = document.createElement('div');
                statsElement.className = 'inventory-item-stats';
                statsElement.textContent = stats.join(' ');
                itemElement.appendChild(statsElement);
            }
        }
        
        // Add click handler for item interaction
        itemElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleItemClick(item, index);
        });
        
        // Setup drag and drop for this item
        this.setupItemDragAndDrop(itemElement, index);
        
        // Add tooltip
        this.setupItemTooltip(itemElement, item);
        
        return itemElement;
    }
    
    getItemIcon(item) {
        // Return appropriate icon based on item type
        switch (item.type) {
            case 'weapon':
                return '⚔️';
            case 'armor':
                return '🛡️';
            case 'shield':
                return '🛡️';
            case 'accessory':
                if (item.baseType === 'ring') return '💍';
                if (item.baseType === 'amulet') return '📿';
                return '✨';
            case 'consumable':
                if (item.healAmount) return '🧪';
                if (item.poisonDamage) return '☠️';
                if (item.curesPoison) return '💊';
                if (item.scrollEffect) return '📜';
                return '🍶';
            case 'treasure':
                if (item.name === 'Gold Coins') return '💰';
                return '💎';
            default:
                return '📦';
        }
    }
    
    setupSlotDragAndDrop(slot, slotIndex) {
        // Drag over events
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.classList.add('drag-over');
        });
        
        slot.addEventListener('dragleave', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
        });
        
        // Drop event
        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            
            const draggedItemIndex = e.dataTransfer.getData('text/plain');
            if (draggedItemIndex !== '') {
                this.moveItemInInventory(parseInt(draggedItemIndex), slotIndex);
            }
        });
    }
    
    setupItemDragAndDrop(itemElement, itemIndex) {
        itemElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', itemIndex.toString());
            e.dataTransfer.effectAllowed = 'move';
            
            // Add visual feedback
            itemElement.classList.add('dragging');
            
            // Create drag preview
            const preview = document.createElement('div');
            preview.className = 'drag-preview';
            preview.textContent = this.game.player.inventory[itemIndex].name;
            document.body.appendChild(preview);
            
            // Position preview
            const rect = itemElement.getBoundingClientRect();
            preview.style.left = (rect.left + rect.width / 2) + 'px';
            preview.style.top = (rect.top - 30) + 'px';
            
            // Store preview reference
            itemElement.dragPreview = preview;
        });
        
        itemElement.addEventListener('dragend', (e) => {
            itemElement.classList.remove('dragging');
            
            // Remove drag preview
            if (itemElement.dragPreview) {
                document.body.removeChild(itemElement.dragPreview);
                itemElement.dragPreview = null;
            }
        });
    }
    
    moveItemInInventory(fromIndex, toIndex) {
        const player = this.game.player;
        
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || 
            fromIndex >= player.inventory.length || toIndex >= player.maxInventory) {
            return;
        }
        
        // Move item in array
        const item = player.inventory.splice(fromIndex, 1)[0];
        player.inventory.splice(toIndex, 0, item);
        
        // Update UI
        this.updateInventoryModal();
        this.updateInventory();
        
        this.game.addMessage(`Moved ${item.name} to slot ${toIndex + 1}`);
    }
    
    setupItemTooltip(itemElement, item) {
        let tooltip = null;
        let tooltipTimeout = null;
        
        itemElement.addEventListener('mouseenter', (e) => {
            // Clear any existing timeout
            if (tooltipTimeout) {
                clearTimeout(tooltipTimeout);
                tooltipTimeout = null;
            }
            
            // Remove any existing tooltip
            if (tooltip) {
                document.body.removeChild(tooltip);
                tooltip = null;
            }
            
            tooltipTimeout = setTimeout(() => {
                tooltip = document.createElement('div');
                tooltip.className = 'inventory-tooltip';
                
                // Add rarity-based styling
                const rarityColor = this.game.player.getItemRarityColor(item);
                tooltip.style.borderColor = rarityColor;
                tooltip.style.boxShadow = `0 0 10px ${rarityColor}40`; // 40 = 25% opacity
                
                const description = item.getFullDescription();
                tooltip.innerHTML = `
                    <h4 style="color: ${rarityColor};">${item.name}</h4>
                    <p><strong>Type:</strong> ${item.type} (<span style="color: ${rarityColor};">${item.rarity}</span>)</p>
                    <p>${description}</p>
                `;
                
                document.body.appendChild(tooltip);
                
                // Position tooltip with bounds checking
                const rect = itemElement.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                
                let left = rect.right + 10;
                let top = rect.top;
                
                // Check if tooltip would go off the right edge
                if (left + tooltipRect.width > window.innerWidth) {
                    left = rect.left - tooltipRect.width - 10;
                }
                
                // Check if tooltip would go off the bottom edge
                if (top + tooltipRect.height > window.innerHeight) {
                    top = window.innerHeight - tooltipRect.height - 10;
                }
                
                // Ensure tooltip doesn't go off the top edge
                if (top < 10) {
                    top = 10;
                }
                
                tooltip.style.left = left + 'px';
                tooltip.style.top = top + 'px';
            }, 500);
        });
        
        itemElement.addEventListener('mouseleave', () => {
            // Clear timeout
            if (tooltipTimeout) {
                clearTimeout(tooltipTimeout);
                tooltipTimeout = null;
            }
            
            // Remove tooltip
            if (tooltip) {
                document.body.removeChild(tooltip);
                tooltip = null;
            }
        });
        
        // Store tooltip reference on the element for cleanup
        itemElement.tooltip = tooltip;
        itemElement.tooltipTimeout = tooltipTimeout;
    }
    
    // Add method to clean up all tooltips
    cleanupAllTooltips() {
        // Remove all tooltips from the page
        const tooltips = document.querySelectorAll('.inventory-tooltip');
        tooltips.forEach(tooltip => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
        
        // Clear any pending timeouts
        const items = document.querySelectorAll('.inventory-item');
        items.forEach(item => {
            if (item.tooltipTimeout) {
                clearTimeout(item.tooltipTimeout);
                item.tooltipTimeout = null;
            }
        });
    }
    
    setupSortButton() {
        const sortBtn = document.getElementById('sortInventoryBtn');
        if (sortBtn) {
            sortBtn.onclick = () => this.sortInventory();
            sortBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.sortInventory();
            });
        }
    }
    
    sortInventory() {
        const player = this.game.player;
        
        // Sort inventory by type, then by rarity, then by name
        player.inventory.sort((a, b) => {
            // First sort by type priority
            const typeOrder = { 'weapon': 1, 'armor': 2, 'shield': 3, 'accessory': 4, 'consumable': 5, 'treasure': 6 };
            const aTypeOrder = typeOrder[a.type] || 7;
            const bTypeOrder = typeOrder[b.type] || 7;
            
            if (aTypeOrder !== bTypeOrder) {
                return aTypeOrder - bTypeOrder;
            }
            
            // Then sort by rarity
            const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3, 'epic': 4, 'legendary': 5 };
            const aRarityOrder = rarityOrder[a.rarity] || 6;
            const bRarityOrder = rarityOrder[b.rarity] || 6;
            
            if (aRarityOrder !== bRarityOrder) {
                return bRarityOrder - aRarityOrder; // Higher rarity first
            }
            
            // Finally sort by name
            return a.name.localeCompare(b.name);
        });
        
        // Update UI
        this.updateInventoryModal();
        this.updateInventory();
        
        this.game.addMessage('Inventory sorted!');
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
    
    handleItemDestroy(item) {
        if (!this.isItemEquipped(item)) {
            this.showDestroyConfirmation(item);
        } else {
            this.game.addMessage("Cannot destroy equipped items!");
        }
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
    
    setupGlobalTooltipCleanup() {
        // Remove any existing listener
        if (this.globalTooltipCleanupListener) {
            document.removeEventListener('click', this.globalTooltipCleanupListener);
        }
        
        // Add new listener
        this.globalTooltipCleanupListener = (e) => {
            // Only clean up if click is outside inventory items
            if (!e.target.closest('.inventory-item') && !e.target.closest('.inventory-tooltip')) {
                this.cleanupAllTooltips();
            }
        };
        
        document.addEventListener('click', this.globalTooltipCleanupListener);
    }
    
    setupModalEventListeners() {
        // Add event listeners for modal close buttons
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(button => {
            button.onclick = () => {
                this.hideBattleModal();
                this.hideInventoryModal();
            };
        });
        
        // Setup confirmation modal
        this.setupConfirmationModal();
        
        // Setup trash zone
        this.setupTrashZone();
        
        // Setup mobile-specific event listeners
        this.setupMobileEventListeners();
    }
    
    setupMobileEventListeners() {
        // Add touch event listeners for better mobile experience
        const modals = [this.battleModal, this.inventoryModal, this.deathModal, this.confirmationModal];
        
        modals.forEach(modal => {
            if (modal) {
                // Prevent zoom on double tap
                modal.addEventListener('touchend', (e) => {
                    e.preventDefault();
                }, { passive: false });
                
                // Close modal when tapping outside content
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        if (modal === this.battleModal) {
                            // Don't close battle modal by tapping outside
                            return;
                        }
                        if (modal === this.inventoryModal) {
                            this.hideInventoryModal();
                        } else if (modal === this.deathModal) {
                            // Don't close death modal by tapping outside
                            return;
                        } else if (modal === this.confirmationModal) {
                            this.hideConfirmationModal();
                        }
                    }
                });
            }
        });
        
        // Add touch handling for inventory items
        this.setupInventoryTouchHandling();
    }
    
    setupInventoryTouchHandling() {
        // This will be called when inventory modal is shown
        const inventoryGrid = document.getElementById('inventoryGrid');
        if (inventoryGrid) {
            // Add touch event listeners for inventory slots
            const slots = inventoryGrid.querySelectorAll('.inventory-slot');
            slots.forEach((slot, index) => {
                // Add touch event for item interaction
                slot.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const item = this.game.player.inventory[index];
                    if (item) {
                        // Show tooltip on touch
                        const rect = slot.getBoundingClientRect();
                        this.showTooltip(item, rect.left, rect.top - 10);
                    }
                }, { passive: false });
                
                slot.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    const item = this.game.player.inventory[index];
                    if (item) {
                        // Handle item interaction on touch end
                        this.handleItemClick(item, index);
                        // Clean up tooltip after a short delay
                        setTimeout(() => {
                            this.cleanupAllTooltips();
                        }, 2000);
                    }
                }, { passive: false });
            });
        }
    }
    
    setupWindowEventListeners() {
        // Clean up tooltips when window loses focus
        window.addEventListener('blur', () => {
            this.cleanupAllTooltips();
        });
        
        // Clean up tooltips when page becomes hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.cleanupAllTooltips();
            }
        });
    }
    
    setupConfirmationModal() {
        const confirmBtn = document.getElementById('confirmDestroyBtn');
        const cancelBtn = document.getElementById('cancelDestroyBtn');
        
        if (confirmBtn) {
            confirmBtn.onclick = () => {
                this.confirmDestroyItem();
            };
            confirmBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.confirmDestroyItem();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                this.hideConfirmationModal();
            };
            cancelBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.hideConfirmationModal();
            });
        }
        
        // Close modal when clicking outside
        this.confirmationModal.addEventListener('click', (e) => {
            if (e.target === this.confirmationModal) {
                this.hideConfirmationModal();
            }
        });
    }
    
    setupTrashZone() {
        const trashZone = document.getElementById('trashZone');
        if (!trashZone) return;
        
        // Drag over events
        trashZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            trashZone.classList.add('drag-over');
        });
        
        trashZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            trashZone.classList.remove('drag-over');
        });
        
        // Drop event
        trashZone.addEventListener('drop', (e) => {
            e.preventDefault();
            trashZone.classList.remove('drag-over');
            
            const draggedItemIndex = e.dataTransfer.getData('text/plain');
            if (draggedItemIndex !== '') {
                const itemIndex = parseInt(draggedItemIndex);
                const item = this.game.player.inventory[itemIndex];
                
                if (item && !this.isItemEquipped(item)) {
                    this.showDestroyConfirmation(item);
                } else if (item && this.isItemEquipped(item)) {
                    this.game.addMessage("Cannot destroy equipped items!");
                }
            }
        });
    }
    
    showDestroyConfirmation(item) {
        this.pendingDestroyItem = item;
        
        const message = document.getElementById('confirmationMessage');
        if (message) {
            message.textContent = `Are you sure you want to destroy "${item.name}"? This action cannot be undone.`;
        }
        
        this.confirmationModal.style.display = 'block';
    }
    
    hideConfirmationModal() {
        this.confirmationModal.style.display = 'none';
        this.pendingDestroyItem = null;
    }
    
    confirmDestroyItem() {
        if (this.pendingDestroyItem) {
            const item = this.pendingDestroyItem;
            const player = this.game.player;
            
            if (player.destroyItem(item)) {
                this.game.addMessage(`You destroyed ${item.name}.`);
                
                // Update UI
                this.updateInventoryModal();
                this.updatePlayerStats();
                this.updateCharacterPanel();
                this.updateInventory();
            } else {
                this.game.addMessage(`Cannot destroy ${item.name}.`);
            }
        }
        
        this.hideConfirmationModal();
    }
}

window.UI = UI; 