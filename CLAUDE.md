# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Noice Adventures is a 2D platformer game built with Phaser.js and packaged as an Electron app. The game features 6 levels with a hero character collecting coins, keys, and avoiding/defeating spider enemies. The project has been fully converted to TypeScript while maintaining all original functionality.

## Development Commands

### TypeScript Development

- `npm run build:ts` - Compile TypeScript to JavaScript
- `npm run build:watch` - Compile TypeScript with watch mode for development
- `npm install` - Install dependencies
- `npm start` - Compile TypeScript and launch the Electron app for development

### Building Distributables

- `npm run pack` - Create packaged app in directory format
- `npm run dist` - Create distribution packages
- `npm run build:all` - Build for all platforms (macOS, Windows, Linux x64)
- `npm run build:win` - Build Windows executable
- `npm run build:mac` - Build macOS app
- `npm run build:linux` - Build Linux packages

## Architecture

### Core Structure

- **TypeScript Source**: `src-ts/` directory containing TypeScript source files
- **Compiled Output**: `dist-ts/` directory containing compiled JavaScript
- **Entry Point**: `src-ts/main.ts` (compiled to `dist-ts/main.js`) - Electron main process
- **Game Entry**: `index.html` - Web page that loads the compiled Phaser game
- **Game Logic**: `src-ts/index.ts` (compiled to `dist-ts/index.js`) - Main game logic with TypeScript types

### Game Architecture (src-ts/index.ts)

The game uses TypeScript with proper interfaces and types. Key components include:

- **Hero Class**: Player character with movement, jumping, animation, and death mechanics
- **Spider Class**: Enemy with crawling movement and collision detection
- **Game State Management**: Handles 6 levels (level00.json through level05.json)
- **Asset Loading**: All sprites, audio, and level data loaded in `preload()`
- **Physics**: Arcade physics with gravity, collision detection, and platforming
- **Audio System**: Background music and sound effects for actions
- **Timer System**: Tracks completion time for each level
- **HUD**: Displays coin count, key status, and timer

### Level System

- Levels defined in JSON files (`src/assets/data/level00.json` - `level05.json`)
- Each level contains platform layouts, coin positions, enemy spawns, hero start position, key location, and door position
- Progressive difficulty with faster spider speeds on levels 3 and 5

### Asset Organization

- `src/assets/images/` - All sprite sheets and images
- `src/assets/audio/` - Sound effects and background music
- `src/assets/data/` - Level configuration JSON files
- `src/assets/js/` - Phaser.js library

### Electron Packaging

- Icons for each platform stored in `build/` directory
- Electron Builder configuration in `electron-builder.yml`
- Cross-platform builds support Windows (NSIS installer), macOS (DMG), and Linux (DEB/AppImage)

## Key Game Mechanics

### Movement and Physics

- Arrow keys for movement (left/right) and jumping (up)
- Hero resets to spawn position when touching enemies from the side or falling off platforms
- Stomping enemies from above defeats them and provides a bounce

### Level Progression

- Collect key to unlock door
- Touch door while holding key to advance to next level
- Game tracks completion time and coin count for each level
- Final level shows summary of all level statistics

## TypeScript Configuration

### Project Structure

- `tsconfig.json` - TypeScript compiler configuration
- `types/phaser.d.ts` - Type definitions for Phaser 2.x
- `src/` - TypeScript source files
- `dist/` - Compiled JavaScript output

### Type Safety

- Interfaces defined for game data structures (LevelData, PlayerData, etc.)
- Hero and Spider classes extend Phaser.Sprite with proper typing
- PlayStateInterface defines the complete game state structure

### Build Process

- TypeScript compilation happens automatically before starting the app (`prestart` script)
- Source maps included for debugging
- Original JavaScript files (`src/` and `main.js`) are deprecated but kept for reference

### Technical Notes

- Game uses Phaser 2.x (legacy version) with TypeScript wrapper
- Classes use proper inheritance with TypeScript syntax
- Electron-builder configured to exclude TypeScript source files from distribution
- All original game functionality preserved during TypeScript conversion
