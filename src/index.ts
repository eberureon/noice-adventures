// Simple type definitions for this project

// Interfaces for game data structures
interface LevelData {
  platforms: PlatformData[];
  coins: CoinData[];
  spiders: SpiderData[];
  hero: PositionData;
  door: PositionData;
  key: PositionData;
}

interface PlatformData {
  image: string;
  x: number;
  y: number;
}

interface CoinData {
  x: number;
  y: number;
}

interface SpiderData {
  x: number;
  y: number;
}

interface PositionData {
  x: number;
  y: number;
}

interface PlayerData {
  times: string[];
  coins: number[];
  level: number[];
}

interface SoundEffects {
  jump: any;
  coin: any;
  stomp: any;
  key: any;
  door: any;
}

interface KeysCollection {
  left: any;
  right: any;
  up: any;
}

// Game state interface
interface PlayStateInterface {
  game: any;
  keys: KeysCollection;
  coinCount: number;
  hasKey: boolean;
  level: number;
  startTime: Date;
  timeElapsed: number;
  gameTimer: any;
  timeLabel: any;
  sfx: SoundEffects;
  bgm: any;
  hero: Hero;
  platforms: any;
  coins: any;
  spiders: any;
  enemyWalls: any;
  bgDecoration: any;
  door: any;
  key: any;
  keyIcon: any;
  coinFont: any;
  hud: any;
  
  init(data: any): void;
  preload(): void;
  create(): void;
  update(): void;
  shutdown(): void;
  createTimer(): void;
  updateTimer(): void;
  _loadLevel(data: LevelData): void;
  _spawnPlatform(platform: PlatformData): void;
  _spawnEnemyWall(x: number, y: number, side: string): void;
  _spawnCharacters(data: { hero: PositionData; spiders: SpiderData[] }): void;
  _spawnCoins(coin: CoinData): void;
  _spawnDoor(x: number, y: number): void;
  _spawnKey(x: number, y: number): void;
  _handleCollisions(): void;
  _heroVsCoin(hero: Hero, coin: any): void;
  _heroVsEnemy(hero: Hero, enemy: Spider): void;
  _heroVsKey(hero: Hero, key: any): void;
  _heroVsDoor(): void;
  _handleInput(): void;
  _createHud(): void;
}

// Global game state
const PlayState: PlayStateInterface = {} as PlayStateInterface;

// Get button element
const Button = document.getElementById('startGame') as HTMLButtonElement;
Button.addEventListener('click', () => {
  const game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
  game.state.add('play', PlayState);
  game.state.start('play', true, false, { level: 0 }); // TESTING
  Button.style.display = 'none';
});

/* Hero Class */
class Hero extends (Phaser as any).Sprite {
  constructor(game: any, x: number, y: number) {
    super(game, x, y, 'hero');
    this.anchor.set(0.5, 0.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;

    this.animations.add('stop', [0]);
    this.animations.add('run', [1, 2], 8, true);
    this.animations.add('jump', [3]);
    this.animations.add('fall', [4]);
    this.animations.add('die', [5, 6, 5, 6, 5, 6], 10);
  }

  move(direction: number): void {
    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;

    if (this.body.velocity.x < 0) {
      this.scale.x = -1;
    } else {
      this.scale.x = 1;
    }

    const gameCache = PlayState.game.cache.getJSON(`level:${PlayState.level}`);
    if (this.body.onFloor()) {
      PlayState.hero.reset(gameCache.hero.x, gameCache.hero.y);
      PlayState.key.reset(gameCache.key.x, gameCache.key.y);
      PlayState.hasKey = false;
    }
  }

  jump(): boolean {
    const JUMP_SPEED = 580;
    const canJump = this.body.touching.down;

    if (canJump) {
      this.body.velocity.y = -JUMP_SPEED;
    }

    return canJump;
  }

  bounce(bounceSpeed: number): void {
    this.body.velocity.y = -bounceSpeed;
  }

  private _getAnimationName(): string {
    let name = '';

    if (!this.alive) {
      name = 'die';
    } else if (this.body.velocity.y < 0) {
      name = 'jump';
    } else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
      name = 'fall';
    } else if (this.body.velocity.x !== 0 && this.body.touching.down) {
      name = 'run';
    } else {
      name = 'stop';
    }

    return name;
  }

  update(): void {
    const animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
      this.animations.play(animationName);
    }
  }

  die(): void {
    this.alive = false;
    this.body.enable = false;

    this.animations.play('die').onComplete.addOnce(function(this: Hero) {
      this.kill();
    }, this);
  }
}

/* Spider Class */
class Spider extends (Phaser as any).Sprite {
  static SPEED = 200;

  constructor(game: any, x: number, y: number) {
    super(game, x, y, 'spider');

    this.anchor.set(0.5);

    this.animations.add('crawl', [0, 1, 2], 7, true);
    this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 10);
    this.animations.play('crawl');

    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;
  }

  update(): void {
    if (this.body.touching.right || this.body.blocked.right) {
      this.body.velocity.x = -Spider.SPEED;
    } else if (this.body.touching.left || this.body.blocked.left) {
      this.body.velocity.x = Spider.SPEED;
    }
  }

  die(): void {
    this.body.enable = false;

    this.animations.play('die').onComplete.addOnce(function(this: Spider) {
      this.kill();
    }, this);
  }
}

// Constants
const LEVEL_COUNT = 6;

// Player data
const playerData: PlayerData = {
  times: [],
  coins: [],
  level: []
};

// Game state implementation
PlayState.init = function(data: any): void {
  this.game.renderer.renderSession.roundPixels = true;
  this.keys = this.game.input.keyboard.addKeys({
    left: Phaser.KeyCode.LEFT,
    right: Phaser.KeyCode.RIGHT,
    up: Phaser.KeyCode.UP
  });

  this.keys.up.onDown.add(function(this: PlayStateInterface) {
    const didJump = this.hero.jump();
    if (didJump) {
      this.sfx.jump.play();
    }
  }, this);

  this.coinCount = 0;
  this.hasKey = false;
  this.level = (data.level || 0) % LEVEL_COUNT;

  if (this.level === 3 || this.level === 5) {
    Spider.SPEED = 500;
  }
};

PlayState.preload = function(): void {
  this.game.load.image('background', 'src/assets/images/background.png');
  this.game.load.image('ground', 'src/assets/images/ground.png');
  this.game.load.image('grass:8x1', 'src/assets/images/grass_8x1.png');
  this.game.load.image('grass:6x1', 'src/assets/images/grass_6x1.png');
  this.game.load.image('grass:4x1', 'src/assets/images/grass_4x1.png');
  this.game.load.image('grass:2x1', 'src/assets/images/grass_2x1.png');
  this.game.load.image('grass:1x1', 'src/assets/images/grass_1x1.png');
  this.game.load.image('invisible-wall', 'src/assets/images/invisible_wall.png');
  this.game.load.image('icon:coin', 'src/assets/images/coin_icon.png');
  this.game.load.image('font:numbers', 'src/assets/images/numbers.png');
  this.game.load.image('key', 'src/assets/images/key.png');
  this.game.load.spritesheet('icon:key', 'src/assets/images/key_icon.png', 34, 30);
  this.game.load.spritesheet('door', 'src/assets/images/door.png', 42, 66);
  this.game.load.spritesheet('hero', 'src/assets/images/hero.png', 36, 42);
  this.game.load.spritesheet('coin', 'src/assets/images/coin_animated.png', 22, 22);
  this.game.load.spritesheet('spider', 'src/assets/images/spider.png', 42, 32);
  this.game.load.audio('sfx:jump', 'src/assets/audio/jump.wav');
  this.game.load.audio('sfx:coin', 'src/assets/audio/coin.wav');
  this.game.load.audio('sfx:stomp', 'src/assets/audio/stomp.wav');
  this.game.load.audio('sfx:key', 'src/assets/audio/key.wav');
  this.game.load.audio('sfx:nice', 'src/assets/audio/nice.wav');
  this.game.load.audio('bgm', ['src/assets/audio/bgm.mp3', 'src/assets/audio/bgm.ogg']);
  this.game.load.json('level:0', 'src/assets/data/level00.json');
  this.game.load.json('level:1', 'src/assets/data/level01.json');
  this.game.load.json('level:2', 'src/assets/data/level02.json');
  this.game.load.json('level:3', 'src/assets/data/level03.json');
  this.game.load.json('level:4', 'src/assets/data/level04.json');
  this.game.load.json('level:5', 'src/assets/data/level05.json');
};

PlayState.create = function(): void {
  this.game.add.image(0, 0, 'background');
  this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));

  this.sfx = {
    jump: this.game.add.audio('sfx:jump', 0.2),
    coin: this.game.add.audio('sfx:coin', 0.2),
    stomp: this.game.add.audio('sfx:stomp', 0.4),
    key: this.game.add.audio('sfx:key', 0.2),
    door: this.game.add.audio('sfx:nice', 7)
  };

  this.bgm = this.game.add.audio('bgm', 0.6, true).play();

  this.startTime = new Date();
  this.timeElapsed = 0;

  this.createTimer();

  this.gameTimer = this.game.time.events.loop(100, () => {
    this.updateTimer();
  });

  this._createHud();
};

PlayState.update = function(): void {
  this._handleCollisions();
  this._handleInput();
  this.coinFont.text = `x${this.coinCount}`;
  this.keyIcon.frame = !this.hasKey ? 0 : 1;
};

PlayState.shutdown = function(): void {
  this.bgm.stop();
};

PlayState.createTimer = function(): void {
  this.timeLabel = this.game.add.text(this.game.world.centerX, 10, "00:00", { font: "50px Arial", fill: "#fff" });
  this.timeLabel.anchor.setTo(0.5, 0);
  this.timeLabel.align = 'center';
};

PlayState.updateTimer = function(): void {
  const currentTime = new Date();
  const timeDifference = this.startTime.getTime() - currentTime.getTime();

  // Time elapsed in seconds
  this.timeElapsed = Math.abs(timeDifference / 1000);

  // Convert seconds into minutes and seconds
  const minutes = Math.floor(this.timeElapsed / 60);
  const seconds = Math.floor(this.timeElapsed) - (60 * minutes);

  let result = (minutes < 10) ? '0' + minutes : minutes.toString();

  result += (seconds < 10) ? ':0' + seconds : ':' + seconds;

  this.timeLabel.text = result;
};

PlayState._loadLevel = function(data: LevelData): void {
  this.bgDecoration = this.game.add.group();
  this.platforms = this.game.add.group();
  this.coins = this.game.add.group();
  this.spiders = this.game.add.group();
  this.enemyWalls = this.game.add.group();
  this.enemyWalls.visible = false;

  // spawn heroes and enemies
  data.platforms.forEach(this._spawnPlatform, this);
  this._spawnCharacters({ hero: data.hero, spiders: data.spiders });

  data.coins.forEach(this._spawnCoins, this);
  this._spawnDoor(data.door.x, data.door.y);
  this._spawnKey(data.key.x, data.key.y);

  this.game.physics.arcade.gravity.y = 1200;
};

PlayState._spawnPlatform = function(platform: PlatformData): void {
  const sprite = this.platforms.create(
    platform.x, platform.y, platform.image);
  this.game.physics.enable(sprite);

  this._spawnEnemyWall(platform.x, platform.y, 'left');
  this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');

  sprite.body.allowGravity = false;
  sprite.body.immovable = true;
};

PlayState._spawnEnemyWall = function(x: number, y: number, side: string): void {
  const sprite = this.enemyWalls.create(x, y, 'invisible-wall');

  sprite.anchor.set(side === 'left' ? 1 : 0, 1);

  this.game.physics.enable(sprite);
  sprite.body.immovable = true;
  sprite.body.allowGravity = false;
};

PlayState._spawnCharacters = function(data: { hero: PositionData; spiders: SpiderData[] }): void {
  this.hero = new Hero(this.game, data.hero.x, data.hero.y);
  this.game.add.existing(this.hero);

  data.spiders.forEach((spider: SpiderData) => {
    const sprite = new Spider(this.game, spider.x, spider.y);
    this.spiders.add(sprite);
  }, this);
};

PlayState._spawnCoins = function(coin: CoinData): void {
  const sprite = this.coins.create(coin.x, coin.y, 'coin');
  sprite.anchor.set(0.5, 0.5);
  sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
  sprite.animations.play('rotate');

  this.game.physics.enable(sprite);
  sprite.body.allowGravity = false;
};

PlayState._spawnDoor = function(x: number, y: number): void {
  this.door = this.bgDecoration.create(x, y, 'door');
  this.door.anchor.setTo(0.5, 1);
  this.game.physics.enable(this.door);
  this.door.body.allowGravity = false;
};

PlayState._spawnKey = function(x: number, y: number): void {
  this.key = this.bgDecoration.create(x, y, 'key');
  this.key.anchor.setTo(0.5, 0.5);
  this.game.physics.enable(this.key);
  this.key.body.allowGravity = false;

  this.key.y -= 3;
  this.game.add.tween(this.key)
    .to({ y: this.key.y + 6 }, 800, Phaser.Easing.Sinusoidal.InOut)
    .yoyo(true)
    .loop()
    .start();
};

PlayState._handleCollisions = function(): void {
  this.game.physics.arcade.collide(this.hero, this.platforms);
  this.game.physics.arcade.collide(this.spiders, this.platforms);
  this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
  this.game.physics.arcade.overlap(this.hero, this.coins, this._heroVsCoin, null, this);
  this.game.physics.arcade.overlap(this.hero, this.spiders, this._heroVsEnemy, null, this);
  this.game.physics.arcade.overlap(this.hero, this.key, this._heroVsKey, null, this);
  this.game.physics.arcade.overlap(this.hero, this.door, this._heroVsDoor,
    function(this: PlayStateInterface, hero: Hero): boolean {
      if (this.level === (LEVEL_COUNT - 1) && this.hasKey && hero.body.touching.down) {
        this.game.destroy();
        setTimeout(() => {
          window.alert("Well Done!\nYou've completed the Game!\n\n" +
            "Level " + playerData.level[0] + "\n\t\tTime: " + playerData.times[0] + "\n\t\tCoins: " + playerData.coins[0] + "\n\n" +
            "Level " + playerData.level[1] + "\n\t\tTime: " + playerData.times[1] + "\n\t\tCoins: " + playerData.coins[1] + "\n\n" +
            "Level " + playerData.level[2] + "\n\t\tTime: " + playerData.times[2] + "\n\t\tCoins: " + playerData.coins[2] + "\n\n" +
            "Level " + playerData.level[3] + "\n\t\tTime: " + playerData.times[3] + "\n\t\tCoins: " + playerData.coins[3] + "\n\n" +
            "Level " + playerData.level[4] + "\n\t\tTime: " + playerData.times[4] + "\n\t\tCoins: " + playerData.coins[4] + "\n\n" +
            "Level " + playerData.level[5] + "\n\t\tTime: " + playerData.times[5] + "\n\t\tCoins: " + playerData.coins[5]);
          Button.style.display = "block";
          playerData.level = [];
          playerData.times = [];
          playerData.coins = [];
        }, 1000);
        return false;
      } else {
        return this.hasKey && hero.body.touching.down;
      }
    }, this);
};

PlayState._heroVsCoin = function(hero: Hero, coin: any): void {
  this.sfx.coin.play();
  coin.kill();
  this.coinCount++;
};

PlayState._heroVsEnemy = function(hero: Hero, enemy: Spider): void {
  const gameCache = this.game.cache.getJSON(`level:${this.level}`);
  if (hero.body.velocity.y > 0) {
    this.sfx.stomp.play();
    if (this.level === 3) {
      hero.bounce(630);
    } else {
      hero.bounce(200);
    }
    enemy.die();
  } else {
    this.sfx.stomp.play();
    this.hero.reset(gameCache.hero.x, gameCache.hero.y);
    this.key.reset(gameCache.key.x, gameCache.key.y);
    this.hasKey = false;
  }
};

PlayState._heroVsKey = function(hero: Hero, key: any): void {
  this.sfx.key.play();
  key.kill();
  this.hasKey = true;
};

PlayState._heroVsDoor = function(): void {
  playerData.level.push(this.level + 1);
  playerData.times.push(this.timeLabel.text);
  playerData.coins.push(this.coinCount);
  this.sfx.door.play();
  this.game.state.restart(true, false, { level: this.level + 1 });
};

PlayState._handleInput = function(): void {
  if (this.keys.left.isDown) {
    this.hero.move(-1);
  } else if (this.keys.right.isDown) {
    this.hero.move(1);
  } else {
    this.hero.move(0);
  }

  this.keys.up.onDown.add(function(this: PlayStateInterface) {
    this.hero.jump();
  }, this);
};

PlayState._createHud = function(): void {
  this.keyIcon = this.game.make.image(0, 19, 'icon:key');
  this.keyIcon.anchor.set(0, 0.5);

  const NUMBERS_STR = '0123456789X ';
  this.coinFont = this.game.add.retroFont('font:numbers', 20, 26, NUMBERS_STR);

  const coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin');
  const coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width, coinIcon.height / 2, this.coinFont);
  coinScoreImg.anchor.set(0, 0.5);

  this.hud = this.game.add.group();
  this.hud.add(coinIcon);
  this.hud.position.set(10, 10);
  this.hud.add(coinScoreImg);
  this.hud.add(this.keyIcon);
};