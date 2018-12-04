import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import "pixi";
import "p2";
import * as Phaser from "phaser-ce";
//import { Game } from '../../game/game';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  /**
   * Creates an instance of HomePage.
   * @param {NavController} navCtrl 
   * @memberof HomePage
   */
  public game: Phaser.Game;
  public state: any;

  score: number;
  scoreText;
  pVez;
  largura = 0;
  altura = 0;
  sprite;
  vivo:boolean;
  cursors;
  //tiros
  bullet;
  bullets;
  bulletTime = 0;
  //inimigos
  inimigos;
  numInimigos = 2;
  veloInimigos = 40;
  dificuldade = 0;

  botaoStart;
  start = false;

  monitorMotion;
  constructor(public navCtrl: NavController, public plat: Platform, public motion:DeviceMotion) {
  }
  
  ionViewDidLoad = () => {
    // Put here the code you want to execute
    this.state = {
      init: this.init,
      preload: this.preload,
      create: this.create,
      update: this.update,
      render: this.render,
      resize: this.resize
    };
   
    this.game = new Phaser.Game(this.plat.width(), this.plat.height(), Phaser.CANVAS, "game", this.state);

    
    //console.log(this.game);
  }

  init = () => {
    let text = "Phaser Version " + Phaser.VERSION + " works!";
    console.log(text);
  }
  preload = () => {
    this.game.load.image('player', 'assets/jogo/player2.png');
    this.game.load.image('bullet', 'assets/jogo/bullets.png');
    this.game.load.image('inimigo', 'assets/jogo/inimigo.png');

  }
  
  create = () => {
    this.game.renderer.clearBeforeRender = true;
    //this.game.renderer.roundPixels = true;

    this.vivo = true;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(40, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);

    this.setupPlayer();
    this.pVez = 0;

    this.inimigos = this.game.add.group();
    this.inimigos.enableBody = true;
    this.inimigos.physicsBodyType = Phaser.Physics.ARCADE;
    this.inimigos.setAll('checkWorldBounds', true);
    this.inimigos.setAll('outOfBoundsKill', true);

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.input.onDown.add(this.comecar,this);
  }
  update = () => {
    if(this.start && this.inimigos.countLiving() === 0)
    {
      this.criarInimigos();
      this.pVez = 2;
    }

    if(this.vivo && this.start)
    {
      this.monitorMotion = this.motion.watchAcceleration().subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.sprite.angle = (-acceleration.y - 9.81) * 10;
        //console.log('x :' + acceleration.x, ' y: '+ acceleration.y + ' z: ' + acceleration.z + ' time: ' + acceleration.timestamp);
      });
      
  
      this.game.physics.arcade.overlap(this.bullets, this.inimigos, this.colisoes, null, this);
      this.game.physics.arcade.overlap(this.inimigos, this.sprite, this.colisaoCplayer, null, this);
      /*if (this.cursors.left.isDown) {
        //this.sprite.body.angularVelocity = -300;
        //this.sprite.rotation -= 100;
        this.sprite.angle -= 6;
      }
      else if (this.cursors.right.isDown) {
        //this.sprite.body.angularVelocity = 300;
        //this.sprite.rotation += 100;
        this.sprite.angle += 6;
  
      }
      else {
        //this.sprite.body.angularVelocity = 0;
      }*/
      /*if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        //console.log('apertei espaco');
        this.fireBullet();
      }*/
    }
    
  }
  render = () => {

  }
  resize = () => {

  }
  setupPlayer(){
    this.sprite = this.game.add.sprite(this.plat.width() / 2, this.plat.height() - 32, 'player');
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.anchor.set(0.5);
    this.sprite.body.drag.set(100);
    this.sprite.body.maxVelocity.set(200);
    this.sprite.rotation = -1.5;
    
    /*this.inimigos.array.forEach(inimigo => {
      inimigo.kill();
      
    });*/
  }
  restart(){
    this.numInimigos = 2;
    this.veloInimigos = 40;
    this.dificuldade = 0;
    this.inimigos.forEach(function (c) { c.kill(); });
  }
  
  fireBullet() {
    //console.log('apertei espaco');
    if (this.bullets.countLiving() < 2) {
      if (this.game.time.now > this.bulletTime) {
        this.bullet = this.bullets.getFirstExists(false);

        if (this.bullet) {
          this.bullet.reset(this.sprite.x, this.sprite.y);
          //this.bullet.lifespan = 2000;
          this.bullet.rotation = this.sprite.rotation;
          //console.log('bullet r: '+ this.bullet.rotation + ' sprite: '+ this.sprite.rotation);
          this.game.physics.arcade.velocityFromRotation(this.sprite.rotation, 300, this.bullet.body.velocity);
          //this.game.physics.arcade.velocityFromRotation(this.sprite.rotation, 300);

          //this.bullet.body.velocity.y = -400;
          this.bulletTime = this.game.time.now + 200;
        }
      }
    }

  }

  criarInimigos() {
    for (let i = 0; i < this.numInimigos + this.dificuldade; i++) {
      let ini = this.inimigos.create(Math.floor(Math.random() * this.plat.width()), -20, 'inimigo');
      ini.anchor.setTo(0.5, 0.5);
      ini.rotation = this.game.physics.arcade.angleBetween(ini, this.sprite);
      this.game.physics.arcade.moveToObject(ini, this.sprite, Math.floor((Math.random() * 125) + this.veloInimigos));

    }
    /*let ini = this.inimigos.create(this.plat.width(), -20, 'inimigo');
    ini.anchor.setTo(0.5, 0.5);
    ini.rotation = this.game.physics.arcade.angleBetween(ini, this.sprite);
    this.game.physics.arcade.moveToObject(ini, this.sprite, 40);

    let ini2 = this.inimigos.create(0, -20, 'inimigo');
    ini2.anchor.setTo(0.5, 0.5);
    ini2.rotation = this.game.physics.arcade.angleBetween(ini2, this.sprite);
    this.game.physics.arcade.moveToObject(ini2, this.sprite, 40);*/


  }

  colisoes(bullet, inimigo) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    inimigo.kill();

    if (this.inimigos.countLiving() == 0) {


      console.log('derrotou todos inimigos');
      this.dificuldade += 0.5;
      this.veloInimigos += 2;
      this.criarInimigos();


      //the "click to restart" handler
      //game.input.onTap.addOnce(restart,this);
    }

  }

  colisaoCplayer(inimigo, player) {
    console.log('vc morreu');
    inimigo.kill();
    player.kill();
    console.log(this.inimigos.countLiving());
   // this.game.world.removeAll();
    this.vivo = false;
    this.start = false;
    this.monitorMotion.unsubscribe();
    this.game.input.onDown.removeAll();
    this.game.input.onDown.add(this.comecar,this);
  }
  comecar(){
      console.log('comecei');
      this.start = true;
      this.vivo = true;
      console.log(this.inimigos.countLiving());
      if(this.pVez > 0)
      {
        this.setupPlayer();
        this.restart();

      }else{
        this.pVez = 1;
      }

      this.game.input.onDown.removeAll();
      this.game.input.onDown.add(this.fireBullet,this);

  }
}






















/*constructor(public navCtrl: NavController, public plat: Platform) {
    //this.gameInstance = new Game(plat.width(), plat.height());
    this.game = new Phaser.Game(plat.width(), plat.height(), Phaser.CANVAS, "game", { preload: preload, create: create, update: update, render: render });

    this.largura = plat.width();
    this.altura = plat.height();

    function preload() {
      this.game.load.image('player', 'assets/jogo/player2.png');
      this.game.load.image('bullet', 'assets/jogo/bullets.png');
    }
    function create() {
      console.log('largura: ' + plat.width());
      console.log('altura: ' + plat.height());
      //this.floor = new Phaser.Rectangle(0, 50, 800, 50);

      this.game.renderer.clearBeforeRender = true;
      this.game.renderer.roundPixels = true;
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.bullets = this.game.add.group();
      this.bullets.enableBody = true;
      this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

      this.bullets.createMultiple(40, 'bullet');
      this.bullets.setAll('anchor.x', 0.5);
      this.bullets.setAll('anchor.y', 0.5);

      this.sprite = this.game.add.sprite(plat.width()/2, plat.height() - 32, 'player');
      this.sprite.anchor.set(0.5);

      this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

      this.sprite.body.drag.set(100);
      this.sprite.body.maxVelocity.set(200);

      this.cursors = this.game.input.keyboard.createCursorKeys();

      var style = { font: "bold 12px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
      this.scoreText = this.game.add.text(5, 360 / 3, 'Score: 0', style);
      this.score = 0;
    }
    function update() {
      //this.score += 10;
      this.scoreText.text = 'Score: ' + this.score;

      /*if (this.cursors.up.isDown) {
        this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 200, this.sprite.body.acceleration);
      }
      else {
        this.sprite.body.acceleration.set(0);
      }*/
/*
      if (this.cursors.left.isDown) {
        this.sprite.body.angularVelocity = -300;
      }
      else if (this.cursors.right.isDown) {
        this.sprite.body.angularVelocity = 300;
      }
      else {
        this.sprite.body.angularVelocity = 0;
      }

      if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        fireBullet();
      }

      
    }
    function render() {
      //this.game.debug.geom(this.floor,'#0fffff');
    }
    
    function fireBullet() {
      //if (this.game.time.now > this.bulletTime) {
       // this.bullet = this.bullets.getFirstExists(false);
  
        //if (this.bullet) {
          this.bullet.reset(this.sprite.body.x + 16, this.sprite.body.y + 16);
          this.bullet.lifespan = 2000;
          this.bullet.rotation = this.sprite.rotation;
          this.game.physics.arcade.velocityFromRotation(this.sprite.rotation, 400, this.bullet.body.velocity);
          this.bulletTime = this.game.time.now + 50;
        //}
      //}
  
    }

  }*/


