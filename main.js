// Constantes da tela do jogo
const screenConfig = {
  width: 700,
  height: 850
}

class GameScene extends Phaser.Scene {
  // Variáveis do jogo
  score;
  pontuacao = 0;

  // Carrega os assets do jogo
  preload() {
    this.load.image(
      'background', 
      'assets/bg.png'
    );
    
    this.load.image(
      'player',
      'assets/alienigena.png'
    );

    this.load.image(
      'turbo',
      'assets/turbo.png'
    );

    this.load.image(
      'platform',
      'assets/tijolos.png'
    );

    this.load.image(
      'coin',
      'assets/moeda.png'
    );
  }

  create() {
    // Instancia o background
    this.add.image(
      screenConfig.width / 2, 
      screenConfig.height / 2, 
      'background');

    // Instancia o jogador
    this.player = this.physics.add.sprite(
      screenConfig.width / 2,
      200,
      'player'
    )
      .setCollideWorldBounds(true)
      .setOrigin(0, 0)
      .setDepth(1);
    // Define o tamanho do corpo do jogador
    this.player.body.setSize(120, 120, true)

    // Instancia o fogo que é emitido pelo alien
    this.turbo = this.add.image(
      0, 0, 'turbo'
    )
      .setVisible(false)
      .setOrigin(0.5, 0.5);

    // Instancia as plataformas do jogo
    this.platform = this.physics.add.staticImage(
      screenConfig.width / 2,
      screenConfig.height / 2,
      'platform'
    );
    this.platform2 = this.physics.add.staticImage(
      screenConfig.width / 4,
      screenConfig.height / 4,
      'platform'
    );
    this.platform3 = this.physics.add.staticImage(
      screenConfig.width / 1.37,
      screenConfig.height / 4,
      'platform'
    );
    
    // Adiciona colisão entre o jogador e as plataformas
    this.physics.add.collider(this.player, this.platform); 
    this.physics.add.collider(this.player, this.platform2)
    this.physics.add.collider(this.player, this.platform3)

    // Adiciona o teclado
    this.actionKeys = this.input.keyboard
      .createCursorKeys();
    
    // Adiciona a moeda
    this.coin = this.physics.add.sprite(
      Phaser.Math.Between(0, screenConfig.width),
      Phaser.Math.Between(0, screenConfig.height),
      'coin');
    this.coin.setCollideWorldBounds(true);
    this.coin.setBounce(1);

    // Adiciona colisão entre a moeda e as plataformas
    this.physics.add.collider(this.coin, this.platform)
    this.physics.add.collider(this.coin, this.platform2)
    this.physics.add.collider(this.coin, this.platform3)

    // Adiciona a pontuação
    this.score = this.add.text(
      screenConfig.width - 50, 50, 
      'Moedas: ' + this.pontuacao, 
      {fontSize:'45px', fill:'#495613'});
    this.score.setOrigin(1, 0);

    // Adiciona a colisão entre o jogador e a moeda e contabiliza os pontos
    this.physics.add.overlap(
      this.player, 
      this.coin, 
      () => {
        this.pontuacao += 1;
        console.log(this.score);
        this.score.setText('Moedas: ' + this.pontuacao);
        this.coin.setPosition(
          Phaser.Math.Between(0, screenConfig.width),
          Phaser.Math.Between(0, screenConfig.height)
        )
      });
  }

  // Atualiza o estado do jogo
  update() {
    this.turbo.setPosition(
      this.player.x + this.player.width / 2, 
      this.player.y + this.player.height);

    this.player.setVelocityX(0);

    Promise.resolve([
      this.movementKeys.up(this.actionKeys.up.isDown),
      // this.movementKeys.down(this.actionKeys.down.isDown),
      this.movementKeys.left(this.actionKeys.left.isDown),
      this.movementKeys.right(this.actionKeys.right.isDown)
    ])

    this.validateTurbo();
  }

  // Valida se o jogador está acelerando para cima
  validateTurbo() {
    if(this.player.body.velocity.y < 0) {
      this.turbo.setVisible(true);
      return;
    }
    this.turbo.setVisible(false);
  }

  // Define as ações de movimento do jogador
  movementKeys = {
    up: (isDown) => {
      isDown ? this.player.setVelocityY(-160) : null;
    },
    down: (isDown) => {
      isDown ? this.player.setVelocityY(160) : null;
    },
    left: (isDown) => {
      isDown ? this.player.setVelocityX(-160) : null;
    },
    right: (isDown) => {
      isDown ? this.player.setVelocityX(160) : null;
    },
  }
};

// Instancia a cena do jogo
const _gameScene = new GameScene();

// Configurações do jogo
const config = {
  type: Phaser.AUTO,
  width: screenConfig.width,
  height: screenConfig.height,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: true
    }
  },
  scene: [
    _gameScene
  ]
};

// Inicializa o jogo
const game = new Phaser.Game(config);