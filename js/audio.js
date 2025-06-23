class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.currentMusic = null;
        this.isAudioEnabled = true;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.currentTrack = null;
        this.musicTracks = {
            dungeon: [
                { notes: [110, 146, 220, 293], type: 'triangle', volume: 0.06, duration: 8000 }, // A2, D3, A3, D4
                { notes: [130, 174, 261, 349], type: 'triangle', volume: 0.06, duration: 8000 }, // C3, F3, C4, F4
                { notes: [98, 147, 196, 294], type: 'triangle', volume: 0.06, duration: 8000 },  // G2, D3, G3, D4
                { notes: [87, 116, 174, 233], type: 'sine', volume: 0.05, duration: 10000 },    // F2, A#2, F3, A#3
                { notes: [73, 110, 146, 220], type: 'sine', volume: 0.05, duration: 12000 }     // D2, A2, D3, A3
            ],
            battle: [
                { notes: [220, 293, 349, 440], type: 'square', volume: 0.05, duration: 4000 }, // A3, D4, F4, A4
                { notes: [196, 261, 329, 392], type: 'square', volume: 0.05, duration: 4000 }, // G3, C4, E4, G4
                { notes: [174, 233, 311, 415], type: 'square', volume: 0.05, duration: 4000 }, // F3, A#3, D#4, G#4
                { notes: [147, 196, 294, 392], type: 'sawtooth', volume: 0.04, duration: 3500 }, // D3, G3, D4, G4
                { notes: [165, 220, 330, 440], type: 'sawtooth', volume: 0.04, duration: 3500 }  // E3, A3, E4, A4
            ],
            victory: [
                { notes: [262, 330, 392, 523, 659, 784], type: 'square', volume: 0.15 }, // C4, E4, G4, C5, E5, G5
                { notes: [294, 370, 440, 587, 740, 880], type: 'square', volume: 0.15 }, // D4, F#4, A4, D5, F#5, A5
                { notes: [220, 277, 349, 523, 659, 880], type: 'square', volume: 0.15 }  // A3, C#4, F4, C5, E5, A5
            ],
            ambient: [
                { notes: [55, 73, 110, 146], type: 'sine', volume: 0.03, duration: 15000 },     // A1, D2, A2, D3
                { notes: [49, 65, 98, 130], type: 'sine', volume: 0.03, duration: 18000 },     // G1, C2, G2, C3
                { notes: [41, 55, 82, 110], type: 'sine', volume: 0.03, duration: 20000 }      // E1, A1, E2, A2
            ]
        };
        
        this.init();
    }

    init() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.7;
            
            // Create separate gain nodes for music and SFX
            this.musicGain = this.audioContext.createGain();
            this.sfxGain = this.audioContext.createGain();
            
            this.musicGain.connect(this.masterGain);
            this.sfxGain.connect(this.masterGain);
            
            this.musicGain.gain.value = this.musicVolume;
            this.sfxGain.gain.value = this.sfxVolume;
            
            console.log("Audio system initialized successfully");
        } catch (error) {
            console.warn("Audio system failed to initialize:", error);
            this.isAudioEnabled = false;
        }
    }

    // Enable/disable audio
    toggleAudio() {
        this.isAudioEnabled = !this.isAudioEnabled;
        if (this.isAudioEnabled) {
            this.resumeAudioContext();
        }
        return this.isAudioEnabled;
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGain) {
            this.musicGain.gain.value = this.musicVolume;
        }
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.sfxVolume;
        }
    }

    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Generate retro-style tones
    createTone(frequency, duration, type = 'square', volume = 0.3) {
        if (!this.isAudioEnabled || !this.audioContext) return null;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
        
        return oscillator;
    }

    // Create retro-style chord progression
    createChord(notes, duration, type = 'square') {
        if (!this.isAudioEnabled || !this.audioContext) return;

        notes.forEach((note, index) => {
            setTimeout(() => {
                this.createTone(note, duration, type, 0.1);
            }, index * 50);
        });
    }

    // Sound effects
    playMoveSound() {
        this.createTone(200, 0.1, 'sine', 0.2);
    }

    playAttackSound() {
        this.createTone(300, 0.2, 'square', 0.4);
        setTimeout(() => this.createTone(200, 0.1, 'square', 0.3), 100);
    }

    playHitSound() {
        this.createTone(150, 0.3, 'sawtooth', 0.5);
    }

    playDeathSound() {
        this.createTone(100, 0.5, 'sawtooth', 0.6);
        setTimeout(() => this.createTone(80, 0.3, 'sawtooth', 0.4), 200);
    }

    playPickupSound() {
        this.createTone(400, 0.1, 'sine', 0.3);
        setTimeout(() => this.createTone(500, 0.1, 'sine', 0.2), 100);
    }

    playLevelUpSound() {
        const notes = [200, 250, 300, 350, 400];
        notes.forEach((note, index) => {
            setTimeout(() => {
                this.createTone(note, 0.2, 'square', 0.3);
            }, index * 100);
        });
    }

    playDoorSound() {
        this.createTone(150, 0.3, 'triangle', 0.4);
        setTimeout(() => this.createTone(200, 0.2, 'triangle', 0.3), 150);
    }

    playStairsSound() {
        const notes = [100, 150, 200, 250];
        notes.forEach((note, index) => {
            setTimeout(() => {
                this.createTone(note, 0.3, 'sine', 0.3);
            }, index * 200);
        });
    }

    // Background music system
    playDungeonMusic() {
        if (!this.isAudioEnabled || !this.audioContext) return;
        
        this.stopMusic();
        this.currentTrack = 'dungeon';
        
        // Select a random dungeon track
        const trackIndex = Math.floor(Math.random() * this.musicTracks.dungeon.length);
        const track = this.musicTracks.dungeon[trackIndex];
        
        const playNote = (note, duration, delay) => {
            setTimeout(() => {
                this.createTone(note, duration, track.type, track.volume);
            }, delay);
        };

        const loopDuration = track.duration;
        const notes = track.notes;
        
        const playLoop = () => {
            if (!this.isAudioEnabled || this.currentTrack !== 'dungeon') return;
            
            notes.forEach((note, index) => {
                playNote(note, 1.5, index * 1500);
            });
            
            this.currentMusic = setTimeout(playLoop, loopDuration);
        };
        
        playLoop();
    }

    playBattleMusic() {
        if (!this.isAudioEnabled || !this.audioContext) return;
        
        this.stopMusic();
        this.currentTrack = 'battle';
        
        // Select a random battle track
        const trackIndex = Math.floor(Math.random() * this.musicTracks.battle.length);
        const track = this.musicTracks.battle[trackIndex];
        
        const playNote = (note, duration, delay) => {
            setTimeout(() => {
                this.createTone(note, duration, track.type, track.volume);
            }, delay);
        };

        const loopDuration = track.duration;
        const notes = track.notes;
        
        const playLoop = () => {
            if (!this.isAudioEnabled || this.currentTrack !== 'battle') return;
            
            notes.forEach((note, index) => {
                playNote(note, 0.8, index * 800);
            });
            
            this.currentMusic = setTimeout(playLoop, loopDuration);
        };
        
        playLoop();
    }

    playVictoryMusic() {
        if (!this.isAudioEnabled || !this.audioContext) return;
        
        this.stopMusic();
        this.currentTrack = 'victory';
        
        // Select a random victory track
        const trackIndex = Math.floor(Math.random() * this.musicTracks.victory.length);
        const track = this.musicTracks.victory[trackIndex];
        
        const notes = track.notes;
        notes.forEach((note, index) => {
            setTimeout(() => {
                this.createTone(note, 0.5, track.type, track.volume);
            }, index * 200);
        });
    }

    stopMusic() {
        if (this.currentMusic) {
            clearTimeout(this.currentMusic);
            this.currentMusic = null;
        }
        this.currentTrack = null;
    }

    // Ambient dungeon sounds
    playAmbientDrip() {
        if (!this.isAudioEnabled || !this.audioContext) return;
        
        const playDrip = () => {
            if (!this.isAudioEnabled) return;
            
            this.createTone(50, 0.5, 'sine', 0.1);
            
            // Random delay between 3-8 seconds
            const delay = 3000 + Math.random() * 5000;
            setTimeout(playDrip, delay);
        };
        
        playDrip();
    }

    playWindSound() {
        if (!this.isAudioEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 3);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.musicGain);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 3);
    }

    playAmbientMusic() {
        if (!this.isAudioEnabled || !this.audioContext) return;
        
        this.stopMusic();
        this.currentTrack = 'ambient';
        
        // Select a random ambient track
        const trackIndex = Math.floor(Math.random() * this.musicTracks.ambient.length);
        const track = this.musicTracks.ambient[trackIndex];
        
        const playNote = (note, duration, delay) => {
            setTimeout(() => {
                this.createTone(note, duration, track.type, track.volume);
            }, delay);
        };

        const loopDuration = track.duration;
        const notes = track.notes;
        
        const playLoop = () => {
            if (!this.isAudioEnabled || this.currentTrack !== 'ambient') return;
            
            notes.forEach((note, index) => {
                playNote(note, 2.0, index * 2000);
            });
            
            this.currentMusic = setTimeout(playLoop, loopDuration);
        };
        
        playLoop();
    }

    // Cycle to a different dungeon track for variety
    cycleDungeonTrack() {
        if (this.currentTrack === 'dungeon') {
            this.playDungeonMusic(); // This will select a random track
        }
    }

    // Play thematic music based on floor level
    playThematicMusic(floorLevel) {
        if (!this.isAudioEnabled || !this.audioContext) return;
        
        this.stopMusic();
        this.currentTrack = 'thematic';
        
        // Different music for different floor ranges
        let track;
        if (floorLevel <= 3) {
            // Early floors - simpler, more peaceful
            track = { notes: [110, 146, 220, 293], type: 'sine', volume: 0.05, duration: 10000 };
        } else if (floorLevel <= 6) {
            // Mid floors - more tension
            track = { notes: [98, 147, 196, 294], type: 'triangle', volume: 0.06, duration: 8000 };
        } else if (floorLevel <= 9) {
            // Late floors - darker atmosphere
            track = { notes: [87, 116, 174, 233], type: 'sawtooth', volume: 0.04, duration: 6000 };
        } else {
            // Deep floors - intense
            track = { notes: [73, 110, 146, 220], type: 'square', volume: 0.05, duration: 5000 };
        }
        
        const playNote = (note, duration, delay) => {
            setTimeout(() => {
                this.createTone(note, duration, track.type, track.volume);
            }, delay);
        };

        const loopDuration = track.duration;
        const notes = track.notes;
        
        const playLoop = () => {
            if (!this.isAudioEnabled || this.currentTrack !== 'thematic') return;
            
            notes.forEach((note, index) => {
                playNote(note, 1.5, index * 1500);
            });
            
            this.currentMusic = setTimeout(playLoop, loopDuration);
        };
        
        playLoop();
    }
}

// Make AudioSystem globally accessible
window.AudioSystem = AudioSystem; 