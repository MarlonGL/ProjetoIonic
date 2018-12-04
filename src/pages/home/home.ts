import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import "pixi";
import "p2";
import * as Phaser from "phaser-ce";
import { DatabaseProvider } from '../../providers/database/database';
import { Observable } from 'rxjs';
import { ScreenOrientation } from '@ionic-native/screen-orientation'

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

  listaText;
  listaRe: string;

  estilo;
  pVez;
  largura = 0;
  altura = 0;
  sprite;
  vivo: boolean;
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

  //scoreArray = [];
  arrayM = [];

  monitorMotion;

  constructor(public navCtrl: NavController, public plat: Platform, public motion: DeviceMotion, public database: DatabaseProvider, public alert: AlertController,
    public screen: ScreenOrientation) {

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

    this.largura = this.plat.width();
    this.altura = this.plat.height();
    if (this.largura < this.altura) {
      this.largura = this.plat.height();
      this.altura = this.plat.width();
    }
    this.game = new Phaser.Game(this.largura, this.altura, Phaser.CANVAS, "game", this.state);



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

    this.estilo = { font: "bold 15px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    this.scoreText = this.game.add.text(this.plat.width() / 2, 20, this.score.toString(), this.estilo);
    this.listaText = this.game.add.text(this.plat.width() / 3, 40, '', this.estilo);

    this.inimigos = this.game.add.group();
    this.inimigos.enableBody = true;
    this.inimigos.physicsBodyType = Phaser.Physics.ARCADE;
    this.inimigos.setAll('checkWorldBounds', true);
    this.inimigos.setAll('outOfBoundsKill', true);

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.input.onDown.add(this.comecar, this);
  }
  update = () => {

    if (this.start && this.inimigos.countLiving() === 0) {
      this.criarInimigos();
      this.pVez = 2;
    }

    if (this.vivo && this.start) {
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
  setupPlayer() {
    this.sprite = this.game.add.sprite(this.plat.width() / 2, this.plat.height() - 32, 'player');
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.anchor.set(0.5);
    this.sprite.body.drag.set(100);
    this.sprite.body.maxVelocity.set(200);
    this.sprite.rotation = -1.5;
    this.score = 0;
    /*this.inimigos.array.forEach(inimigo => {
      inimigo.kill();
      
    });*/
  }
  restart() {
    this.numInimigos = 2;
    this.veloInimigos = 40;
    this.dificuldade = 0;
    this.score = 0;
    this.scoreText.text = this.score.toString();
    this.inimigos.forEach(function (c) { c.kill(); });
    //this.scoreArray = [];
    this.listaRe = '';
    this.listaText.text = '';
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
    this.score += 10;
    this.scoreText.text = this.score.toString();
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
    // this.game.world.removeAll();
    this.vivo = false;
    this.start = false;
    this.monitorMotion.unsubscribe();
    this.game.input.onDown.removeAll();

    this.alertFimJogo();



    this.game.input.onDown.add(this.comecar, this);
  }
  comecar() {
    console.log('comecei');
    this.score = 0;
    this.start = true;
    this.vivo = true;
    // console.log(this.inimigos.countLiving());
    if (this.pVez > 0) {
      this.setupPlayer();
      this.restart();

    } else {
      this.pVez = 1;
    }

    this.game.input.onDown.removeAll();
    this.game.input.onDown.add(this.fireBullet, this);

  }


  alertFimJogo() {
    let alerta = this.alert.create({
      title: 'Nova Pontuação: ' + this.score,
      message: 'Deseja adicionar sua pontuação aos recordes?',
      inputs: [
        {
          name: 'Nome',
          placeholder: 'Insira o nome'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            this.getDatabase();
            this.scoreText.text = '';
          }
        },
        {
          text: 'Salvar',
          handler: (data) => {
            //console.log("Chamando Create");
            this.database.add(data.Nome, this.score);
            this.getDatabase();
            this.scoreText.text = '';
          }

        }
      ]
    });
    alerta.present();
  }

  getDatabase() {
    let teste2: Observable<any>;
    let scoreArray: any[] = [];
    console.log(scoreArray.length + ' depois')
    teste2 = this.database.getAll();
    teste2.subscribe(d => {
      d.forEach(d1 => {
        //let n = d1.name;
        //let p = d1.score;
        //console.log(d1);
        scoreArray.push({ nome: d1.name, pontos: d1.score });
      })
      this.ordenarScore(scoreArray);
    });
  }
  ordenarScore(arrayzin: any[]) {
    this.arrayM = [];
    console.log(arrayzin.length);
    for (let i = 0; i < arrayzin.length; i++) {
      this.arrayM.push({ nome: arrayzin[i].nome, pontos: arrayzin[i].pontos });
    }
    this.arrayM.sort(function (a, b) { return b.pontos - a.pontos; });
    console.log(this.arrayM);
    this.listaRecords();
  }

  listaRecords() {
    console.log('lista' + this.arrayM.length);
    this.listaRe = ' ';
    for (let m = 0; m < this.arrayM.length; m++) {
      if (m < 10) {
        this.listaRe += m + 1 + ' => Nome: ' + this.arrayM[m].nome + ' | Pontos: ' + this.arrayM[m].pontos + '\n ';
      }
    }
    this.listaText.text = this.listaRe;
    console.log(this.listaRe);
  }
}