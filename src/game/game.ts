import "pixi";
import "p2";
import * as Phaser from "phaser-ce";

/**
 * Main entry game class
 * @export
 * @class Game
 * @extends {Phaser.Game}
 */
export class Game extends Phaser.Game {
    /**
     * Creates an instance of Game.
     * @memberof Game
     */
    jogo;
    constructor(width:number, height:number) {
        // call parent constructor
        super( width, height, Phaser.CANVAS, "game", { preload: preload, create: create, update: update } );

        // add some game states
        function preload(){

        }
        function create(){
            
        }
        function update(){

        }
        // start with boot state
    }
}