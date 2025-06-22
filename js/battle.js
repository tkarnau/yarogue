class BattleSystem {
    constructor(game) {
        this.game = game;
        this.currentEnemy = null;
        this.battleLog = [];
        this.maxBattleLog = 10;
        this.playerTurn = true;
        this.battleEnded = false;
    }
    
    startBattle(enemy) {
        this.currentEnemy = enemy;
        this.battleLog = [];
        this.playerTurn = true;
        this.battleEnded = false;
        
        this.addBattleMessage(`A ${enemy.name} appears!`);
        this.addBattleMessage(`Battle begins!`);
        
        this.updateBattleUI();
    }
    
    playerAttack() {
        if (this.battleEnded || !this.playerTurn) return;
        
        const player = this.game.player;
        const enemy = this.currentEnemy;
        
        // Calculate damage
        const playerAttack = player.getTotalAttack();
        const damage = Math.max(1, playerAttack - enemy.defense);
        
        // Apply damage
        const result = enemy.takeDamage(damage);
        
        this.addBattleMessage(`You attack the ${enemy.name} for ${damage} damage!`);
        
        if (result === 'death') {
            this.addBattleMessage(`You defeated the ${enemy.name}!`);
            this.endBattle();
            return;
        }
        
        // Enemy's turn
        this.playerTurn = false;
        this.enemyTurn();
    }
    
    enemyTurn() {
        if (this.battleEnded) return;
        
        const enemy = this.currentEnemy;
        const player = this.game.player;
        
        // Check for special abilities
        const specialResult = enemy.useSpecialAbility(player);
        if (specialResult) {
            this.addBattleMessage(specialResult);
        } else {
            // Normal attack
            const result = enemy.attackPlayer(player);
            this.addBattleMessage(result);
        }
        
        // Check if player died
        if (!player.isAlive()) {
            this.addBattleMessage("You have been defeated!");
            this.endBattle();
            return;
        }
        
        // Back to player's turn
        this.playerTurn = true;
        this.updateBattleUI();
    }
    
    useItem() {
        if (this.battleEnded || !this.playerTurn) return;
        
        const player = this.game.player;
        const usableItems = player.getUsableItems();
        
        if (usableItems.length === 0) {
            this.addBattleMessage("You have no usable items!");
            return;
        }
        
        // For simplicity, use the first usable item
        const item = usableItems[0];
        const result = player.useItem(item);
        
        if (result) {
            this.addBattleMessage(result);
        }
        
        // Enemy's turn
        this.playerTurn = false;
        this.enemyTurn();
    }
    
    flee() {
        if (this.battleEnded) return;
        
        const fleeChance = 0.7; // 70% chance to flee
        
        if (Math.random() < fleeChance) {
            this.addBattleMessage("You successfully flee from battle!");
            this.endBattle();
        } else {
            this.addBattleMessage("You failed to flee!");
            // Enemy gets a free attack
            this.playerTurn = false;
            this.enemyTurn();
        }
    }
    
    addBattleMessage(message) {
        this.battleLog.push(message);
        if (this.battleLog.length > this.maxBattleLog) {
            this.battleLog.shift();
        }
        
        // Update battle log display
        const battleLogElement = document.getElementById('battleLog');
        if (battleLogElement) {
            battleLogElement.innerHTML = '';
            this.battleLog.forEach(msg => {
                const p = document.createElement('p');
                p.textContent = msg;
                battleLogElement.appendChild(p);
            });
            battleLogElement.scrollTop = battleLogElement.scrollHeight;
        }
    }
    
    updateBattleUI() {
        const player = this.game.player;
        const enemy = this.currentEnemy;
        
        if (!enemy) return;
        
        // Update player stats
        const battlePlayerHP = document.getElementById('battlePlayerHP');
        const battlePlayerAttack = document.getElementById('battlePlayerAttack');
        
        if (battlePlayerHP) battlePlayerHP.textContent = player.hp;
        if (battlePlayerAttack) battlePlayerAttack.textContent = player.getTotalAttack();
        
        // Update enemy stats
        const battleEnemyName = document.getElementById('battleEnemyName');
        const battleEnemyHP = document.getElementById('battleEnemyHP');
        const battleEnemyAttack = document.getElementById('battleEnemyAttack');
        
        if (battleEnemyName) battleEnemyName.textContent = enemy.name;
        if (battleEnemyHP) battleEnemyHP.textContent = enemy.hp;
        if (battleEnemyAttack) battleEnemyAttack.textContent = enemy.attack;
        
        // Update button states
        const attackBtn = document.getElementById('attackBtn');
        const useItemBtn = document.getElementById('useItemBtn');
        const fleeBtn = document.getElementById('fleeBtn');
        
        if (attackBtn) attackBtn.disabled = !this.playerTurn || this.battleEnded;
        if (useItemBtn) useItemBtn.disabled = !this.playerTurn || this.battleEnded;
        if (fleeBtn) fleeBtn.disabled = this.battleEnded;
        
        // Update button text based on turn
        if (attackBtn) {
            attackBtn.textContent = this.playerTurn ? 'Attack' : 'Enemy Turn...';
        }
    }
    
    endBattle() {
        this.battleEnded = true;
        this.addBattleMessage("Battle ended!");
        
        // Disable all buttons
        const attackBtn = document.getElementById('attackBtn');
        const useItemBtn = document.getElementById('useItemBtn');
        const fleeBtn = document.getElementById('fleeBtn');
        
        if (attackBtn) attackBtn.disabled = true;
        if (useItemBtn) useItemBtn.disabled = true;
        if (fleeBtn) fleeBtn.disabled = true;
        
        // Close battle modal after a short delay
        setTimeout(() => {
            this.game.endBattle();
        }, 2000);
    }
    
    // Calculate combat modifiers
    calculateHitChance(attacker, defender) {
        // Base hit chance is 80%
        let hitChance = 0.8;
        
        // Level difference affects hit chance
        const levelDiff = attacker.level - (defender.level || 1);
        hitChance += levelDiff * 0.05;
        
        // Equipment affects hit chance
        if (attacker.weapon) {
            hitChance += 0.1; // Weapons improve accuracy
        }
        
        return Math.max(0.1, Math.min(0.95, hitChance));
    }
    
    calculateCriticalChance(attacker) {
        let critChance = 0.05; // Base 5% crit chance
        
        // Level affects crit chance
        critChance += attacker.level * 0.01;
        
        // Equipment affects crit chance
        if (attacker.weapon) {
            critChance += 0.02; // Weapons improve crit chance
        }
        
        return Math.min(0.25, critChance); // Max 25% crit chance
    }
    
    // Advanced combat with hit/crit calculations
    advancedAttack(attacker, defender) {
        const hitChance = this.calculateHitChance(attacker, defender);
        const critChance = this.calculateCriticalChance(attacker);
        
        // Check if attack hits
        if (Math.random() > hitChance) {
            return { hit: false, damage: 0, critical: false };
        }
        
        // Calculate damage
        let damage = Math.max(1, attacker.getTotalAttack() - defender.defense);
        
        // Check for critical hit
        const isCritical = Math.random() < critChance;
        if (isCritical) {
            damage = Math.floor(damage * 1.5);
        }
        
        return { hit: true, damage: damage, critical: isCritical };
    }
    
    // Get battle status for UI
    getBattleStatus() {
        if (!this.currentEnemy) return null;
        
        return {
            player: {
                hp: this.game.player.hp,
                maxHp: this.game.player.maxHp,
                attack: this.game.player.getTotalAttack(),
                defense: this.game.player.getTotalDefense()
            },
            enemy: {
                name: this.currentEnemy.name,
                hp: this.currentEnemy.hp,
                maxHp: this.currentEnemy.maxHp,
                attack: this.currentEnemy.attack,
                defense: this.currentEnemy.defense
            },
            turn: this.playerTurn ? 'player' : 'enemy',
            ended: this.battleEnded
        };
    }
} 