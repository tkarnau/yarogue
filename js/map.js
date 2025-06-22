class Map {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        this.rooms = [];
        
        this.init();
    }
    
    init() {
        // Initialize map with walls
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = '#';
            }
        }
    }
    
    generate() {
        // Generate rooms
        this.generateRooms();
        
        // Connect rooms with corridors
        this.connectRooms();
        
        // Apply cellular automata for natural cave-like appearance
        this.applyCellularAutomata();
        
        // Ensure the map is fully connected
        this.ensureConnectivity();
    }
    
    generateRooms() {
        const numRooms = 5 + Math.floor(Math.random() * 5); // 5-10 rooms
        
        for (let i = 0; i < numRooms; i++) {
            let attempts = 0;
            let room = null;
            
            // Try to place room without overlapping
            while (attempts < 100 && !room) {
                const roomWidth = 5 + Math.floor(Math.random() * 8); // 5-12 wide
                const roomHeight = 5 + Math.floor(Math.random() * 8); // 5-12 tall
                
                const x = 2 + Math.floor(Math.random() * (this.width - roomWidth - 4));
                const y = 2 + Math.floor(Math.random() * (this.height - roomHeight - 4));
                
                if (this.canPlaceRoom(x, y, roomWidth, roomHeight)) {
                    room = { x, y, width: roomWidth, height: roomHeight };
                    this.placeRoom(room);
                    this.rooms.push(room);
                }
                
                attempts++;
            }
        }
    }
    
    canPlaceRoom(x, y, width, height) {
        // Check if room overlaps with existing rooms
        for (let room of this.rooms) {
            if (x < room.x + room.width + 1 && x + width + 1 > room.x &&
                y < room.y + room.height + 1 && y + height + 1 > room.y) {
                return false;
            }
        }
        return true;
    }
    
    placeRoom(room) {
        for (let y = room.y; y < room.y + room.height; y++) {
            for (let x = room.x; x < room.x + room.width; x++) {
                this.tiles[y][x] = '.';
            }
        }
    }
    
    connectRooms() {
        if (this.rooms.length < 2) return;
        
        // Connect each room to the next one
        for (let i = 0; i < this.rooms.length - 1; i++) {
            const room1 = this.rooms[i];
            const room2 = this.rooms[i + 1];
            
            this.connectTwoRooms(room1, room2);
        }
        
        // Also connect some random rooms for more connectivity
        for (let i = 0; i < this.rooms.length / 2; i++) {
            const room1 = this.rooms[Math.floor(Math.random() * this.rooms.length)];
            const room2 = this.rooms[Math.floor(Math.random() * this.rooms.length)];
            
            if (room1 !== room2) {
                this.connectTwoRooms(room1, room2);
            }
        }
    }
    
    connectTwoRooms(room1, room2) {
        // Get center points of rooms
        const x1 = Math.floor(room1.x + room1.width / 2);
        const y1 = Math.floor(room1.y + room1.height / 2);
        const x2 = Math.floor(room2.x + room2.width / 2);
        const y2 = Math.floor(room2.y + room2.height / 2);
        
        // Create L-shaped corridor
        if (Math.random() < 0.5) {
            // Horizontal then vertical
            this.createHorizontalCorridor(x1, x2, y1);
            this.createVerticalCorridor(y1, y2, x2);
        } else {
            // Vertical then horizontal
            this.createVerticalCorridor(y1, y2, x1);
            this.createHorizontalCorridor(x1, x2, y2);
        }
    }
    
    createHorizontalCorridor(x1, x2, y) {
        const start = Math.min(x1, x2);
        const end = Math.max(x1, x2);
        
        for (let x = start; x <= end; x++) {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.tiles[y][x] = '.';
            }
        }
    }
    
    createVerticalCorridor(y1, y2, x) {
        const start = Math.min(y1, y2);
        const end = Math.max(y1, y2);
        
        for (let y = start; y <= end; y++) {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.tiles[y][x] = '.';
            }
        }
    }
    
    applyCellularAutomata() {
        const iterations = 2;
        
        for (let iter = 0; iter < iterations; iter++) {
            const newTiles = [];
            
            for (let y = 0; y < this.height; y++) {
                newTiles[y] = [];
                for (let x = 0; x < this.width; x++) {
                    const neighbors = this.countWallNeighbors(x, y);
                    
                    if (this.tiles[y][x] === '#') {
                        // Wall becomes floor if it has few wall neighbors
                        newTiles[y][x] = neighbors < 4 ? '.' : '#';
                    } else {
                        // Floor becomes wall if it has many wall neighbors
                        newTiles[y][x] = neighbors > 5 ? '#' : '.';
                    }
                }
            }
            
            this.tiles = newTiles;
        }
    }
    
    countWallNeighbors(x, y) {
        let count = 0;
        
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                
                const nx = x + dx;
                const ny = y + dy;
                
                if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                    if (this.tiles[ny][nx] === '#') {
                        count++;
                    }
                } else {
                    count++; // Count edges as walls
                }
            }
        }
        
        return count;
    }
    
    ensureConnectivity() {
        // Find all floor tiles
        const floorTiles = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.tiles[y][x] === '.') {
                    floorTiles.push({ x, y });
                }
            }
        }
        
        if (floorTiles.length === 0) return;
        
        // Use flood fill to find connected components
        const visited = new Set();
        const components = [];
        
        for (let tile of floorTiles) {
            const key = `${tile.x},${tile.y}`;
            if (!visited.has(key)) {
                const component = this.floodFill(tile.x, tile.y, visited);
                components.push(component);
            }
        }
        
        // Connect components if there are multiple
        if (components.length > 1) {
            for (let i = 0; i < components.length - 1; i++) {
                const comp1 = components[i];
                const comp2 = components[i + 1];
                
                // Find closest tiles between components
                let minDist = Infinity;
                let tile1 = null;
                let tile2 = null;
                
                for (let t1 of comp1) {
                    for (let t2 of comp2) {
                        const dist = Math.abs(t1.x - t2.x) + Math.abs(t1.y - t2.y);
                        if (dist < minDist) {
                            minDist = dist;
                            tile1 = t1;
                            tile2 = t2;
                        }
                    }
                }
                
                // Create corridor between closest tiles
                if (tile1 && tile2) {
                    this.connectTwoPoints(tile1, tile2);
                }
            }
        }
    }
    
    floodFill(startX, startY, visited) {
        const component = [];
        const queue = [{ x: startX, y: startY }];
        
        while (queue.length > 0) {
            const tile = queue.shift();
            const key = `${tile.x},${tile.y}`;
            
            if (visited.has(key)) continue;
            
            visited.add(key);
            component.push(tile);
            
            // Add neighbors
            const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];
            for (let [dx, dy] of directions) {
                const nx = tile.x + dx;
                const ny = tile.y + dy;
                
                if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height &&
                    this.tiles[ny][nx] === '.') {
                    queue.push({ x: nx, y: ny });
                }
            }
        }
        
        return component;
    }
    
    connectTwoPoints(point1, point2) {
        // Simple L-shaped connection
        if (Math.random() < 0.5) {
            this.createHorizontalCorridor(point1.x, point2.x, point1.y);
            this.createVerticalCorridor(point1.y, point2.y, point2.x);
        } else {
            this.createVerticalCorridor(point1.y, point2.y, point1.x);
            this.createHorizontalCorridor(point1.x, point2.x, point2.y);
        }
    }
    
    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return '#';
        }
        return this.tiles[y][x];
    }
    
    setTile(x, y, tile) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.tiles[y][x] = tile;
        }
    }
    
    isWalkable(x, y) {
        return this.getTile(x, y) === '.';
    }
    
    getRandomFloorTile() {
        const floorTiles = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.tiles[y][x] === '.') {
                    floorTiles.push({ x, y });
                }
            }
        }
        
        if (floorTiles.length === 0) {
            return { x: Math.floor(this.width / 2), y: Math.floor(this.height / 2) };
        }
        
        return floorTiles[Math.floor(Math.random() * floorTiles.length)];
    }
    
    getRoomCenter(roomIndex = 0) {
        if (this.rooms.length === 0) {
            return this.getRandomFloorTile();
        }
        
        const room = this.rooms[roomIndex % this.rooms.length];
        return {
            x: Math.floor(room.x + room.width / 2),
            y: Math.floor(room.y + room.height / 2)
        };
    }
} 