# JSRogue - A Web-Based Roguelike Game

A modern web-based roguelike game inspired by classic games like NetHack and Rogue, featuring pixelated graphics, turn-based combat, and procedural dungeon generation.

## Features

### Core Gameplay
- **Turn-based Movement**: Use WASD or arrow keys to move around the dungeon
- **Procedural Dungeons**: Each game generates a unique dungeon with rooms and corridors
- **Pixelated Graphics**: Retro-style graphics with a modern web interface
- **Camera System**: View follows the player as they explore

### Combat System
- **Turn-based Battles**: Strategic combat with multiple enemy types
- **Battle Modals**: Popup battle interface with attack, item use, and flee options
- **Enemy Variety**: Goblins, Orcs, Trolls, Dragons, Skeletons, and Zombies
- **Special Abilities**: Some enemies have unique abilities (dragons breathe fire, trolls regenerate)

### Character System
- **Leveling**: Gain experience and level up to increase stats
- **Stats**: Health, Attack, Defense, and Experience points
- **Equipment**: Weapons, armor, and shields that modify your stats
- **Inventory Management**: Collect and manage items

### Item System
- **Weapons**: Swords, axes, maces, daggers, and magical staves
- **Armor**: Leather, chain mail, plate armor, and magical robes
- **Shields**: Wooden shields and iron bucklers
- **Consumables**: Healing potions, strength potions, and scrolls
- **Treasure**: Gold coins, gems, rings, and amulets

### User Interface
- **Real-time Stats**: Player stats displayed in sidebar
- **Message Log**: Scrollable log of game events
- **Inventory Modal**: Click items to equip or use them
- **Battle Interface**: Clear combat UI with action buttons
- **Responsive Design**: Works on different screen sizes

## How to Run

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (for the development server)

### Running the Game

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd jsrogue
   ```

2. **Start the development server**
   ```bash
   npm start
   # or
   python3 -m http.server 8000
   ```

3. **Open your browser**
   Navigate to `http://localhost:8000`

4. **Start playing!**
   The game will load automatically and you can begin exploring the dungeon.

## How to Play

### Controls
- **Movement**: WASD keys or Arrow keys
- **Wait**: Spacebar (passes your turn)
- **Inventory**: I key (opens inventory modal)
- **Examine**: E key (examines current tile)
- **Save Game**: Ctrl+S
- **Load Game**: Ctrl+L
- **Close Modals**: Escape key

### Gameplay Tips

1. **Exploration**
   - Move around to explore the dungeon
   - Look for items (colored symbols) to collect
   - Avoid walls (dark squares)

2. **Combat**
   - When you encounter an enemy, a battle modal will appear
   - Click "Attack" to fight
   - Use items during battle with "Use Item"
   - "Flee" to try to escape (70% success rate)

3. **Items**
   - **Weapons** (/, \, M, |, I): Equip to increase attack power
   - **Armor** (]): Equip to increase defense
   - **Shields** (O): Equip for additional defense
   - **Potions** (!): Use to restore health
   - **Scrolls** (?): Use for magical effects
   - **Gold** ($): Automatically adds to your gold count

4. **Leveling**
   - Defeat enemies to gain experience
   - Level up to increase health, attack, and defense
   - Higher levels require more experience

5. **Survival**
   - Keep your health high with potions
   - Equip better weapons and armor when found
   - Be careful around stronger enemies (dragons, trolls)

### Enemy Types

| Enemy | Symbol | Color | HP | Attack | Defense | XP |
|-------|--------|-------|----|--------|---------|----|
| Goblin | g | Green | 8 | 3 | 1 | 15 |
| Orc | o | Orange | 15 | 5 | 2 | 25 |
| Troll | T | Purple | 25 | 7 | 3 | 40 |
| Dragon | D | Red | 50 | 12 | 5 | 100 |
| Skeleton | s | Gray | 12 | 4 | 1 | 20 |
| Zombie | z | Brown | 18 | 6 | 2 | 30 |

### Item Types

| Item Type | Examples | Effects |
|-----------|----------|---------|
| Weapons | Sword, Axe, Mace | +Attack bonus |
| Armor | Leather, Chain, Plate | +Defense bonus |
| Shields | Wooden Shield, Buckler | +Defense bonus |
| Potions | Healing Potion | Restore HP |
| Scrolls | Fireball, Lightning | Magical effects |
| Treasure | Gold, Gems | Value/collectible |

## Technical Details

### Architecture
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **HTML5 Canvas**: For game rendering
- **CSS3**: For UI styling and responsive design
- **Modular Design**: Separate classes for different game systems

### File Structure
```
jsrogue/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── package.json        # Project configuration
├── README.md          # This file
└── js/                # JavaScript files
    ├── game.js        # Main game engine
    ├── player.js      # Player class
    ├── enemy.js       # Enemy class
    ├── item.js        # Item system
    ├── map.js         # Map generation
    ├── battle.js      # Combat system
    ├── ui.js          # User interface
    └── main.js        # Game initialization
```

### Game Systems
- **Map Generation**: Cellular automata + room placement
- **Combat**: Turn-based with damage calculation
- **Inventory**: Equipment and consumable management
- **UI**: Real-time updates and modal management
- **Save/Load**: LocalStorage-based persistence

## Development

### Adding New Features
1. **New Enemies**: Add to `Enemy.setupEnemyType()` in `enemy.js`
2. **New Items**: Add to `Item.setupItemType()` in `item.js`
3. **New Abilities**: Extend the battle system in `battle.js`
4. **UI Changes**: Modify `ui.js` for interface updates

### Debugging
- Open browser console (F12) for debug information
- Game instance is available as `window.game`
- Use `saveGame()` and `loadGame()` functions for testing

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License
ISC License - See package.json for details

## Credits
- Inspired by classic roguelike games like NetHack and Rogue
- Built with modern web technologies
- Pixelated font: Press Start 2P from Google Fonts

---

**Enjoy exploring the dungeons of JSRogue!** 🗡️🛡️⚔️ 