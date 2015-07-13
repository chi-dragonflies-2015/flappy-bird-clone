var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

var mainState = {

  preload: function() {

    game.stage.backgroundColor = '#44D3A8';

    game.load.image('bord', 'assets/bord.png');
    game.load.image('machine', 'assets/machine.png');

  },

  create: function() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.bord = this.game.add.sprite(100, 245, 'bord');

    game.physics.arcade.enable(this.bord);
    this.bord.body.gravity.y = 1000;

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

  },

  update: function() {

    if (this.bord.inWorld == false) {
      this.restartGame();
    }

    game.physics.arcade.overlap(this.bord, this.pipes, this.restartGame, null, this);

  },

  jump: function() {

    this.bord.body.velocity.y = -350;

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

  restartGame: function() {

    game.state.start('main');

  }

};

game.state.add('main', mainState);
game.state.start('main');