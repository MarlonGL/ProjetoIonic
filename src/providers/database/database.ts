import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { FirebaseDatabase } from '@angular/fire';
import { Firebase } from '@ionic-native/firebase';
import { resolveDefinition } from '@angular/core/src/view/util';



/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
  //public firebase:FirebaseDatabase
  scores: Observable<any[]>;
  dbList: AngularFireList<any>;
  fire:FirebaseDatabase;
  x = []; 
  constructor(public database: AngularFireDatabase) {    
    console.log("Alo");
    //this.dbList = database.list('scores');
    //database.list('scores').valueChanges().subscribe(console.log);
    //this.scores = this.getAll();
    //console.log(this.scores[0]);
    //this.getList();
    //this.add('Brunao', 0);
   // this.add('Marlao', 10);

  }
  getAll(){
    let score: Observable<any[]>;
    score = this.database.list('scores').valueChanges();
    return score;

  }
  pegarTudo(){
    /*return this.database.list('scores/', ref => ref.orderByChild('name'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })*/
  }
  getTudo(){
    //this.scores = this.getAll();
    //console.log(this.scores[0].name);
  }
  add(namex:string, scorex:number)
  {
    this.database.list('scores/').push({name: namex, score:scorex});
    
   // this.dbList.push({ name: namex, score: scorex});
    //this.x.push(this.dbList.push({ name: namex, score: scorex}).key);
    //console.log(this.scores);
  }

  deleteList()
  {
    this.dbList.remove();
  }

  orderList()
  {
    this.database.list('/scores', ref => ref.orderByValue().equalTo('score'));


    for(let i = 0; i < 0; i++)
    {

    }
  }

 /* getList()
  {
    return this.firebase.ref('/scores').once('value').then(function(snapshot) {
      let username = (snapshot.val() && snapshot.val().name) || 'Anonymous';
      let userscore = (snapshot.val() && snapshot.val().score);
      // ...
    });
  }*/
  getList()
  {
    let scoreArray = [];
    /*let scoreArray = [];
    this.fire.ref('scores').on('value', (snapshot)=> {
      let data = snapshot.val();
      for(let i in data)
      {        
      scoreArray.push({name: data[i].name, score:data[i].score });
      console.log(data[i].name, data[i].score);
      }
      // ...
    });*/
    console.log(this.x[0]);
    this.fire.ref('scores/' + this.x[0]).once('value').then(function(snapshot){
      console.log('cheguei');
      let name = snapshot.val().name;
      let nome = (snapshot.val() && snapshot.val().name);
      console.log(name); 
    })/*.subscribe(data =>{
      console.log(data);
      scoreArray.push(data);
    })*/
  }


}
