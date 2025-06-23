# JSRogue Death System

## Overview

The death system in JSRogue provides a comprehensive way to handle player death scenarios with multiple restart options and detailed statistics tracking.

## Features

### Death Detection

- **Battle Death**: Player dies during combat
- **Status Effect Death**: Player dies from poison or other status effects
- **Movement Death**: Player dies from status effects while moving
- **Wait Death**: Player dies from status effects while waiting

### Death Modal

When the player dies, a red-themed death modal appears with:

- **Death Statistics**:
  - Final Level
  - Final Experience Points
  - Final Gold Amount
  - Enemies Defeated (estimated)

- **Restart Options**:
  - **Restart Same Level**: Keeps current level, generates new map
  - **Restart New Level**: Starts at level 1, generates new map
  - **View Final Stats**: Shows detailed statistics in an alert

### Game State Management

- Game state changes to "gameOver" when player dies
- Player movement is disabled during death state
- Escape key cannot close death modal
- All game interactions are blocked until restart

## Implementation Details

### Files Modified

1. **index.html**
   - Added death modal HTML structure
   - Includes statistics display and restart buttons

2. **styles.css**
   - Added death modal styling with red theme
   - Responsive design for death modal buttons

3. **js/game.js**
   - Added `handlePlayerDeath()` method
   - Added `showDeathModal()` and `hideDeathModal()` methods
   - Added `restartGame()` method with level persistence
   - Added death checking in movement and wait actions
   - Updated input handling to block movement during death

4. **js/battle.js**
   - Updated battle system to trigger death handling
   - Added delay before showing death modal

5. **js/player.js**
   - Added `checkForDeath()` method
   - Updated status effect handling to trigger death
   - Enhanced death detection in poison effects

6. **js/ui.js**
   - Added `showDeathModal()` and `hideDeathModal()` methods
   - Integrated with existing UI system

7. **js/main.js**
   - Updated keyboard handling to prevent Escape from closing death modal

### Key Methods

#### Game Class

```javascript
handlePlayerDeath() // Main death handler
showDeathModal() // Display death modal with stats
restartGame(newLevel) // Restart with same or new level
```

#### Player Class

```javascript
checkForDeath() // Check if player is dead and trigger handling
isAlive() // Check if player has HP > 0
```

## Usage

### Testing the Death System

1. **Manual Testing**: Use the test controls in `test_death.html`
2. **In-Game Testing**:
   - Fight enemies until you die
   - Get poisoned and wait for death
   - Use status effects that cause damage

### Restart Options

- **Same Level**: Useful for retrying difficult encounters
- **New Level**: Fresh start with new map and enemies
- **View Stats**: Review your performance before restarting

## Technical Notes

### Death Statistics Calculation

- **Enemies Defeated**: Estimated based on experience gained (XP / 50)
- **Level Persistence**: When restarting same level, player keeps level and gets full HP
- **Map Generation**: New maps are generated for both restart options

### Status Effect Integration

- Poison and other damaging status effects can trigger death
- Death is checked after each status effect application
- Death handling is triggered immediately when HP reaches 0

### UI Integration

- Death modal uses existing modal system
- Consistent styling with game theme
- Responsive design for different screen sizes

## Future Enhancements

Potential improvements for the death system:

1. **Death Animations**: Visual death sequence
2. **Death Sounds**: Audio feedback for death
3. **High Score System**: Track best runs
4. **Death Replay**: Show how player died
5. **Achievement System**: Unlock achievements for different death types
6. **Death Statistics**: More detailed tracking of gameplay metrics
7. **Death Sharing**: Share death statistics on social media

## Testing

Use `test_death.html` to test the death system:

1. Open `test_death.html` in a browser
2. Use the test buttons to trigger different death scenarios
3. Verify that the death modal appears correctly
4. Test all restart options
5. Verify that game state is properly managed

The death system provides a complete solution for handling player death with multiple restart options and detailed statistics tracking.
