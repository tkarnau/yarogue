// Global game instance
let game;

// Panel collapse state storage
const panelStates = {
    characterPanel: true,
    statusEffectsList: true,
    inventoryList: true,
    messageLog: true
};

// Toggle panel function
function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    const btn = panel.previousElementSibling.querySelector('.collapse-btn');
    
    if (panel.classList.contains('collapsed')) {
        // Expand panel
        panel.classList.remove('collapsed');
        btn.textContent = '-';
        panelStates[panelId] = true;
    } else {
        // Collapse panel
        panel.classList.add('collapsed');
        btn.textContent = '+';
        panelStates[panelId] = false;
    }
}

// Make togglePanel globally accessible
window.togglePanel = togglePanel;

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", function () {
  console.log("JSRogue - DOM loaded, starting initialization...");

  // Check if required DOM elements exist
  const requiredElements = [
    "gameCanvas",
    "playerLevel",
    "playerHP",
    "playerMaxHP",
    "playerAttack",
    "playerDefense",
    "playerXP",
    "playerNextXP",
    "inventoryList",
    "messageLog",
  ];
  const missingElements = [];

  requiredElements.forEach((elementId) => {
    if (!document.getElementById(elementId)) {
      missingElements.push(elementId);
    }
  });

  if (missingElements.length > 0) {
    console.error("Missing required DOM elements:", missingElements);
    showError(`Missing required DOM elements: ${missingElements.join(", ")}`);
    return;
  }

  console.log("All required DOM elements found");

  // Small delay to ensure all scripts are loaded
  setTimeout(() => {
    initializeGame();
  }, 100);
});

function initializeGame() {
  console.log("JSRogue - Starting initialization...");

  // Check if all required classes are available
  const requiredClasses = [
    "Item",
    "GameMap",
    "Enemy",
    "Player",
    "BattleSystem",
    "UI",
    "Game",
  ];
  const missingClasses = [];
  const availableClasses = [];

  console.log("Checking for required classes...");
  console.log("window.Item:", typeof window.Item);
  console.log("window.GameMap:", typeof window.GameMap);
  console.log("window.Enemy:", typeof window.Enemy);
  console.log("window.Player:", typeof window.Player);
  console.log("window.BattleSystem:", typeof window.BattleSystem);
  console.log("window.UI:", typeof window.UI);
  console.log("window.Game:", typeof window.Game);

  requiredClasses.forEach((className) => {
    if (typeof window[className] === "undefined") {
      missingClasses.push(className);
      console.error(`Missing class: ${className}`);
    } else {
      availableClasses.push(className);
      console.log(`✓ ${className} is available`);
    }
  });

  if (missingClasses.length > 0) {
    console.error("Missing required classes:", missingClasses);
    showError(`Missing required classes: ${missingClasses.join(", ")}`);
    return;
  }

  console.log("All required classes are available:", availableClasses);

  try {
    console.log("Creating Game instance...");
    // Create and start the game
    game = new Game();

    // Make game globally accessible for debugging
    window.game = game;

    console.log("JSRogue - Game initialized successfully!");

    // Add some initial messages
    game.addMessage("Welcome to JSRogue!");
    game.addMessage("Use WASD or arrow keys to move.");
    game.addMessage("Press I to toggle inventory, E to examine.");
    game.addMessage("Press A to attack in battle, Space to wait.");
  } catch (error) {
    console.error("Failed to initialize game:", error);
    console.error("Error stack:", error.stack);
    showError(error.message);
  }
}

function showError(message) {
  // Show error message to user
  const errorDiv = document.createElement("div");
  errorDiv.style.position = "fixed";
  errorDiv.style.top = "50%";
  errorDiv.style.left = "50%";
  errorDiv.style.transform = "translate(-50%, -50%)";
  errorDiv.style.background = "#800000";
  errorDiv.style.border = "2px solid #ff0000";
  errorDiv.style.padding = "20px";
  errorDiv.style.color = "#ffffff";
  errorDiv.style.fontFamily = "monospace";
  errorDiv.style.zIndex = "9999";
  errorDiv.style.maxWidth = "600px";
  errorDiv.style.textAlign = "center";
  errorDiv.innerHTML = `
        <h2>Game Initialization Error</h2>
        <p>Failed to start JSRogue:</p>
        <p style="color: #ffcccc;">${message}</p>
        <p>Please check the browser console (F12) for more details.</p>
        <p>Refresh the page to try again.</p>
    `;

  document.body.appendChild(errorDiv);
}

// Add keyboard shortcuts for modals
document.addEventListener("keydown", function (e) {
  if (!game) return;

  // Close modals with Escape key
  if (e.key === "Escape") {
    if (game.gameState === "battle") {
      // Don't allow closing battle modal with Escape
      return;
    }

    if (game.gameState === "gameOver") {
      // Don't allow closing death modal with Escape
      return;
    }

    if (game.gameState === "inventory") {
      game.closeInventory();
    }
  }

  // 'A' key for attack in battle mode
  if (e.key.toLowerCase() === "a" && game.gameState === "battle") {
    e.preventDefault();
    if (game.battleSystem && game.battleSystem.playerTurn && !game.battleSystem.battleEnded) {
      game.battleSystem.playerAttack();
    }
  }

  // 'I' key to toggle inventory (open if closed, close if open)
  if (e.key.toLowerCase() === "i") {
    e.preventDefault();
    if (game.gameState === "inventory") {
      game.closeInventory();
    } else if (game.gameState === "playing") {
      game.openInventory();
    }
  }

  // Number keys for quick item selection in inventory
  if (game.gameState === "inventory" && e.key >= "1" && e.key <= "9") {
    const index = parseInt(e.key) - 1;
    const player = game.player;

    if (index < player.inventory.length) {
      const item = player.inventory[index];
      game.ui.handleItemClick(item, index);
    }
  }
});

// Add window resize handler
window.addEventListener("resize", function () {
  if (game && game.ui) {
    // Update UI layout if needed
    game.ui.update();
  }
});

// Add visibility change handler for pause functionality
document.addEventListener("visibilitychange", function () {
  if (game) {
    if (document.hidden) {
      // Page is hidden, could pause game here
      console.log("Game paused (page hidden)");
    } else {
      // Page is visible again
      console.log("Game resumed (page visible)");
    }
  }
});

// Add save/load functionality (basic localStorage)
function saveGame() {
  if (!game) return false;

  try {
    const saveData = {
      player: {
        x: game.player.x,
        y: game.player.y,
        level: game.player.level,
        hp: game.player.hp,
        maxHp: game.player.maxHp,
        attack: game.player.attack,
        defense: game.player.defense,
        experience: game.player.experience,
        nextLevelExp: game.player.nextLevelExp,
        gold: game.player.gold,
        inventory: game.player.inventory.map((item) => ({
          type: item.type,
          name: item.name,
        })),
      },
      timestamp: Date.now(),
    };

    localStorage.setItem("jsrogue_save", JSON.stringify(saveData));
    console.log("Game saved successfully");
    return true;
  } catch (error) {
    console.error("Failed to save game:", error);
    return false;
  }
}

function loadGame() {
  if (!game) return false;

  try {
    const saveData = localStorage.getItem("jsrogue_save");
    if (!saveData) {
      console.log("No save data found");
      return false;
    }

    const data = JSON.parse(saveData);

    // Restore player data
    const player = game.player;
    player.x = data.player.x;
    player.y = data.player.y;
    player.level = data.player.level;
    player.hp = data.player.hp;
    player.maxHp = data.player.maxHp;
    player.attack = data.player.attack;
    player.defense = data.player.defense;
    player.experience = data.player.experience;
    player.nextLevelExp = data.player.nextLevelExp;
    player.gold = data.player.gold;

    // Restore inventory (simplified - just recreate basic items)
    player.inventory = [];
    data.player.inventory.forEach((itemData) => {
      const item = new Item(
        null,
        null,
        itemData.name.toLowerCase().replace(/\s+/g, "_")
      );
      player.addToInventory(item);
    });

    // Update camera to player position
    game.updateCamera();

    // Update UI
    game.ui.updatePlayerStats();
    game.ui.updateInventory();
    game.ui.updateHeader();

    game.addMessage("Game loaded successfully!");
    console.log("Game loaded successfully");
    return true;
  } catch (error) {
    console.error("Failed to load game:", error);
    return false;
  }
}

// Add save/load to window for debugging
window.saveGame = saveGame;
window.loadGame = loadGame;

// Add keyboard shortcuts for save/load
document.addEventListener("keydown", function (e) {
  if (!game) return;

  // Ctrl+S to save
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    if (saveGame()) {
      game.addMessage("Game saved!");
    } else {
      game.addMessage("Failed to save game.");
    }
  }

  // Ctrl+L to load
  if (e.ctrlKey && e.key === "l") {
    e.preventDefault();
    if (loadGame()) {
      game.addMessage("Game loaded!");
    } else {
      game.addMessage("Failed to load game.");
    }
  }
});

// Add performance monitoring
let frameCount = 0;
let lastTime = performance.now();

function updateFPS() {
  frameCount++;
  const currentTime = performance.now();

  if (currentTime - lastTime >= 1000) {
    const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
    console.log(`FPS: ${fps}`);
    frameCount = 0;
    lastTime = currentTime;
  }
}

// Add FPS monitoring to game loop if needed
if (game && game.gameLoop) {
  const originalGameLoop = game.gameLoop;
  game.gameLoop = function () {
    updateFPS();
    originalGameLoop.call(this);
  };
}

console.log("JSRogue - Main script loaded successfully!");

window.initializeGame = initializeGame;