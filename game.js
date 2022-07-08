kaboom({
  fullscreen: true,
  clearColor: [0.1, 0.1, 0.9, 0.9],
  global: true,
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("z", "z.png");
loadSprite("spongebob", "spongebob.png");
loadSprite("mario", "mario.png");
loadSprite("ground", "block.png");
loadSprite("ground_blue", "block_blue.png");
loadSprite("peach", "princes.png");
loadSprite("coin", "coin.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("surprise", "surprise.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("evil_mushroom", "evil_mushroom.png");

loadSound("jumpsound", "jumpsound.mp3");
loadSound("gameSound", "gameSound.mp3");

let score = 0;
let health = 2;

scene("game", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                                                                                        ",
    "                                                                                                        ",
    "                                                                                                        ",
    "                                                                                                        ",
    "                                                                                                        ",
    "                                                                                                        ",
    "                                                                                                        ",
    "                                                                                                        ",
    "                                                                                                        ",
    "                                                                                                        ",
    "                                     $$$$                                                               ",
    "                                     ====                                                               ",
    "                                         =                                                              ",
    "                                               ====                                                     ",
    "                                            =                                                           ",
    "                                        =====                                                           ",
    "                    =?=      $$       ===                                                               ",
    "  =!=                  =    ===    $$$=                                                        =        ",
    "                                   ====                                                       =      p  ",
    "=            e           =                                                    f              =          ",
    "==============    =======                                ====================================        == ",
  ];
  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("ground"), solid()],
    $: [sprite("coin"), "coin"],
    v: [sprite("unboxed"), solid(), "unboxed"],
    "?": [sprite("surprise"), solid(), "coin_surprise"],
    "!": [sprite("surprise"), solid(), "mushroom_surprise"],
    p: [sprite("pipe"), solid(), "pipe"],
    m: [sprite("mushroom"), solid(), "mushroom", body()],
    e: [sprite("evil_mushroom"), solid(), "evil_mushroom", body()],
    f: ["evil_spawn", rect(20, 20), color(0, 0, 0, 0)],
  };
  const gameLevel = addLevel(map, mapSymbols);
  let health = 2;

  const player = add([
    sprite("mario"),
    solid(),
    pos(32, 0),
    body(),
    origin("bot"),
    big(),
  ]);

  const scoreLabel = add([text("score:" + score)]);

  const moveSpeed = 150;

  keyDown("right", () => {
    player.move(moveSpeed, 0);
  });
  keyDown("d", () => {
    player.move(moveSpeed, 0);
  });
  keyDown("left", () => {
    player.move(-moveSpeed, 0);
  });
  keyDown("a", () => {
    player.move(-moveSpeed, 0);
  });
  keyDown("up", () => {
    if (player.grounded()) {
      isJumping = true;
      play("jumpsound");
      player.jump(300);
    }
  });
  keyDown("w", () => {
    if (player.grounded()) {
      isJumping = true;
      play("jumpsound");
      player.jump(300);
    }
  });
  keyDown("space", () => {
    if (player.grounded()) {
      isJumping = true;
      play("jumpsound");
      player.jump(300);
    }
  });
  player.on("headbump", (obj) => {
    if (obj.is("coin_surprise")) {
      destroy(obj);
      gameLevel.spawn("v", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }
    if (obj.is("mushroom_surprise")) {
      destroy(obj);
      gameLevel.spawn("v", obj.gridPos);
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
    }
  });

  action("mushroom", (obj) => {
    obj.move(20, 0);
  });

  player.collides("coin", (obj) => {
    score += 1;
    destroy(obj);
  });

  player.collides("mushroom", (obj) => {
    destroy(obj);
    player.biggify(5);
  });

  player.collides("evil_spawn", (obj) => {
    destroy(obj);
    gameLevel.spawn("e", obj.gridPos.sub(-10, 0));
  });

  player.action((obj) => {
    camPos(player.pos);
    scoreLabel.pos = player.pos.sub(450, 200);
    scoreLabel.text = "score:" + score;
  });

  action("evil_mushroom", (obj) => {
    obj.move(-40, 0);
  });

  let isJumping = false;

  player.collides("evil_mushroom", (obj) => {
    if (isJumping) {
      destroy(obj);
    } else {
      player.use(pos(32, 100));
      health--;
    }
  });

  player.action((obj) => {
    isJumping = !player.grounded();
    if (health <= 0) {
      destroy(player);
    }
  });

  player.collides("pipe", (obj) => {
    keyDown("down", () => {
      go("win");
    });
    keyDown("s", () => {
      go("win");
    });
  });
  const FALL_DOWN = 1000;
  player.action(() => {
    camPos(player.pos);
    if (player.pos.y >= FALL_DOWN && health > 0) {
      player.pos.y = 0;
      player.pos.x = 30;
      health--;
    } else if (health == 0) {
      go("lose");
    }
  });
});

scene("lose", () => {
  score = 0;
  add([
    text("Game Over\nTry Again", 64),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  add([
    text("press space to restart", 20),
    origin("center"),
    pos(width() / 2, height() / 2 + 200),
  ]);

  keyDown("space", () => {
    go("game");
  });
});

scene("win", () => {
  score = 0;
  add([
    text("You won\nThank you\nTo play the game ", 55),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  add([
    text("press space to play again", 20),
    origin("center"),
    pos(width() / 2, height() / 2 + 200),
  ]);
  keyDown("space", () => {
    go("game");
  });
});
start("game");
