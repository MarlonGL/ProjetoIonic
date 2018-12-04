import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { FirebaseDatabase } from '@angular/fire';



/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
  
  scores: Observable<any[]>;
  dbList: AngularFireList<any>;
  constructor(public database: AngularFireDatabase, public firebase:FirebaseDatabase) {    
    console.log("Alo");
    this.scores = database.list('scores').valueChanges();
    this.dbList = database.list('scores');
    this.add('Brunao', 0);
    this.add('Marlao', 10);
  }

  add(namex:string, scorex:number)
  {
    this.dbList.push({ name: namex, score: scorex});
    let x = this.dbList.push({ name: namex, score: scorex}).key;
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

  getList()
  {
    return this.firebase.ref('/scores').once('value').then(function(snapshot) {
      let username = (snapshot.val() && snapshot.val().name) || 'Anonymous';
      let userscore = (snapshot.val() && snapshot.val().score);
      // ...
    });
  }



}
