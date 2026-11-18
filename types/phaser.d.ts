// Type definitions for Phaser 2.x used in this project
declare const Phaser: any;

interface Window {
  Phaser: any;
}

// Basic type definitions for the Phaser objects used in this game
declare namespace Phaser {
  interface Game {
    new (width: number, height: number, renderer: any, parent: string): Game;
    state: StateManager;
    add: GameObjectFactory;
    input: Input;
    physics: Physics;
    load: Loader;
    cache: Cache;
    make: GameObjectCreator;
    time: Time;
    world: World;
    renderer: any;
    destroy(): void;
  }

  interface StateManager {
    add(key: string, state: any): void;
    start(key: string, clearWorld?: boolean, clearCache?: boolean, parameter?: any): void;
    restart(clearWorld?: boolean, clearCache?: boolean, parameter?: any): void;
  }

  interface GameObjectFactory {
    image(x: number, y: number, key: string): Image;
    group(): Group;
    audio(key: string, volume?: number, loop?: boolean): Sound;
    text(x: number, y: number, text: string, style?: any): Text;
    retroFont(font: string, characterWidth: number, characterHeight: number, chars: string): RetroFont;
    tween(object: any): Tween;
    existing(object: any): any;
  }

  interface GameObjectCreator {
    image(x: number, y: number, key: string): Image;
  }

  interface Sprite {
    new (game: Game, x: number, y: number, key: string, frame?: any): Sprite;
    anchor: Point;
    game: Game;
    body: Body;
    animations: AnimationManager;
    scale: Point;
    alive: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    frame: number;
    reset(x: number, y: number): void;
    kill(): void;
    update(): void;
  }

  interface Physics {
    enable(object: any): void;
    arcade: ArcadePhysics;
  }

  interface ArcadePhysics {
    gravity: Point;
    collide(object1: any, object2: any, collideCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
    overlap(object1: any, object2: any, overlapCallback?: Function, processCallback?: Function, callbackContext?: any): boolean;
  }

  interface Body {
    velocity: Point;
    touching: FaceChoices;
    blocked: FaceChoices;
    onFloor(): boolean;
    collideWorldBounds: boolean;
    allowGravity: boolean;
    immovable: boolean;
    enable: boolean;
  }

  interface FaceChoices {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  }

  interface Point {
    x: number;
    y: number;
    set(x: number, y: number): void;
    setTo(x: number, y: number): void;
  }

  interface AnimationManager {
    add(name: string, frames?: any[], frameRate?: number, loop?: boolean): Animation;
    play(name: string, frameRate?: number, loop?: boolean): Animation;
    name: string;
  }

  interface Animation {
    onComplete: Signal;
  }

  interface Signal {
    addOnce(listener: Function, listenerContext?: any): void;
  }

  interface Group {
    create(x: number, y: number, key: string, frame?: any): Sprite;
    add(child: any): any;
    visible: boolean;
  }

  interface Input {
    keyboard: Keyboard;
  }

  interface Keyboard {
    addKeys(keys: any): any;
  }

  interface Key {
    isDown: boolean;
    onDown: Signal;
  }

  interface Loader {
    image(key: string, url: string): void;
    spritesheet(key: string, url: string, frameWidth: number, frameHeight: number): void;
    audio(key: string, urls: string | string[]): void;
    json(key: string, url: string): void;
  }

  interface Cache {
    getJSON(key: string): any;
  }

  interface Sound {
    play(): Sound;
    stop(): void;
  }

  interface Image {
    anchor: Point;
  }

  interface Text {
    anchor: Point;
    align: string;
    text: string;
  }

  interface RetroFont {
    text: string;
  }

  interface Tween {
    to(properties: any, duration: number, ease?: any): Tween;
    yoyo(yoyo: boolean): Tween;
    loop(): Tween;
    start(): Tween;
  }

  interface Time {
    events: Timer;
  }

  interface Timer {
    loop(delay: number, callback: Function, callbackContext?: any): any;
  }

  interface World {
    centerX: number;
    centerY: number;
  }

  // Static constants
  const AUTO: any;
  const KeyCode: {
    LEFT: number;
    RIGHT: number;
    UP: number;
  };
  const Easing: {
    Sinusoidal: {
      InOut: any;
    };
  };
}