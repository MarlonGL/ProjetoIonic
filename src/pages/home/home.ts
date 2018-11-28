import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
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
   * Game instance
   * @public
   * @type {Phaser.Game}
   * @memberof HomePage
   */
  public game: Phaser.Game;
  /**
   * Creates an instance of HomePage.
   * @param {NavController} navCtrl 
   * @memberof HomePage
   */
   score:number;
   scoreText;
   floor;
   largura = 0;
   altura = 0;
  constructor( public navCtrl: NavController, public plat:Platform) {
    //this.gameInstance = new Game(plat.width(), plat.height());
    this.game = new Phaser.Game(plat.width(), plat.height(), Phaser.CANVAS, "game", {preload: preload,create: create,update: update, render:render});
    
    this.largura = plat.width();
    this.altura = plat.height();
    
    function preload(){

    }
    function create(){
      console.log('largura: ' + plat.width());
      console.log('altura: ' + plat.height());
      this.floor = new Phaser.Rectangle(0, 50, 800, 50);
      var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
      //console.log(this.plat.height().toFixed());
      this.scoreText = this.game.add.text(5, 360/3, 'Score: 0', style);
      this.score = 0;
    }
    function update(){
      //this.score += 10;
      this.scoreText.text = 'Score: ' + this.score;
    }
    function render(){
      //this.game.debug.geom(this.floor,'#0fffff');
    }
  }

  inicio(lar:number, alt:number){
    this.largura = lar;
    this.altura = alt;
  }
  getLarg() {
    return 3;
  }
  
}
