var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

var mainState = {

  preload: function() {

    game.stage.backgroundColor = '#44D3A8';

    game.load.image('bird', 'assets/bird.png');
    game.load.image('pipe', 'assets/pipe.png');

  },

  create: function() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.bird = this.game.add.sprite(100, 245, 'bird');

    game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = 1000;

    this.bird.anchor.setTo(-0.2, 0.5);

    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);

    this.pipes = game.add.group();
    this.pipes.enableBody = true;
    this.pipes.createMultiple(20, 'pipe');

    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    this.score = 0;
    this.labelScore = game.add.text(20,20,'0',{
      font: "30px Impact",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 5
    });

  },

  update: function() {

    if (this.bird.inWorld == false) {
      this.restartGame();
    }

    if (this.bird.angle < 20) {
      this.bird.angle += 1;
    }

    game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);

  },

  jump: function() {

    game.add.tween(this.bird).to({angle: -20}, 100).start();

    this.bird.body.velocity.y = -350;

  },

  addOnePipe: function(x,y) {

    var pipe = this.pipes.getFirstDead();

    pipe.reset(x,y);

    pipe.body.velocity.x = -200;

    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;

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

  restartGame: function() {

    game.state.start('main');

  }

};

game.state.add('main', mainState);
game.state.start('main');