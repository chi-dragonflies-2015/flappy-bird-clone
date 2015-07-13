var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

var mainState = {

  preload: function() {

    game.stage.backgroundColor = '#44D3A8';

    game.load.image('bord', 'assets/bord.png');
    game.load.image('machine', 'assets/machine.png');

    game.load.audio('jump', 'assets/jump.wav');

  },

  create: function() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.bord = this.game.add.sprite(100, 245, 'bord');

    game.physics.arcade.enable(this.bord);
    this.bord.body.gravity.y = 1000;

    this.bord.anchor.setTo(-0.2, 0.5);

    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);

    this.pipes = game.add.group();
    this.pipes.enableBody = true;
    this.pipes.createMultiple(20, 'machine');

    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    this.score = 0;
    this.labelScore = game.add.text(20,20,'0',{
      font: "30px Impact",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 5
    });

    this.jumpSound = game.add.audio('jump');

  },

  update: function() {

    if (this.bord.inWorld == false) {
      this.restartGame();
    }

    if (this.bord.angle < 20) {
      this.bord.angle += 1;
    }
    game.physics.arcade.overlap(this.bord, this.pipes, this.hitPipe, null, this);

  },

  jump: function() {
    if (this.bord.alive == false) {
      return;
    }

    game.add.tween(this.bord).to({angle: -20}, 100).start();

    this.bord.body.velocity.y = -350;

    this.jumpSound.play();

  },

  addOnePipe: function(x,y) {

    var machine = this.pipes.getFirstDead();

    machine.reset(x,y);

    machine.body.velocity.x = -200;

    machine.checkWorldBounds = true;
    machine.outOfBoundsKill = true;

  },

  addRowOfPipes: function() {

    var hole = Math.floor(Math.random()*5)+1;

    for (var i = 0; i < 8; i++) {
      if (i != hole && i != hole + 1) {
        this.addOnePipe(400, i*60 + 10);
      }
    }

    this.score += 1;
    this.labelScore.text = this.score;

  },

  hitPipe: function() {

    if (this.bord.alive == false) {
      return;
    }

    this.bord.alive = false;

    game.time.events.remove(this.timer);

    this.pipes.forEachAlive(function(p) {
      p.body.velocity.x = 0;
    });

    this.failMsg = game.add.text(this.bord.x+60, this.bord.y-20, 'SHIT', {
      font: "30px Impact",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 5
    });

    this.add.tween(this.failMsg).to({y: this.bord.y-50}, 500, Phaser.Easing.Linear.None, true);
    game.add.tween(this.failMsg).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

  },

  restartGame: function() {

    game.state.start('main');

  }

};

game.state.add('main', mainState);
game.state.start('main');